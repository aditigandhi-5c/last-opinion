from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from sqlalchemy.orm import Session
import logging

from .. import schemas, models
from ..utils.whatsapp_gupshup import opt_in_whatsapp
from ..utils.slack_notifier import notify_patient_consultation_request
from ..database import get_db


router = APIRouter(prefix="/patients", tags=["patients"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Return the current user (models.User) from JWT sub (email)."""
    if not token:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject = payload.get("sub")
        if not subject or not isinstance(subject, str):
            raise HTTPException(status_code=401, detail="Invalid token")
        # Case-insensitive email match - get the first user if multiple exist
        from sqlalchemy import select, func
        from ..models import User
        result = db.execute(
            select(User).where(func.lower(User.email) == func.lower(subject))
        ).first()
        if result is None:
            raise HTTPException(status_code=401, detail="User not found for token")
        return result[0]  # Extract the User object from the result tuple
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("", response_model=schemas.PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        # Resolve the user by email from JWT subject
        patient = models.Patient(
            user_id=current_user.id,
            first_name=payload.first_name,
            last_name=payload.last_name,
            age=payload.age,
            gender=(payload.gender or "").capitalize() if isinstance(payload.gender, str) else payload.gender,
            email=current_user.email,
            phone=payload.phone,
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

        # Optionally ensure opt-in once per new number (do not send message here to avoid duplicate with case creation)
        try:
            if patient.phone:
                opt_in_whatsapp(patient.phone)
        except Exception:
            logging.getLogger(__name__).warning("WhatsApp opt-in failed for patient %s", patient.id, exc_info=True)

        return {
            "id": patient.id,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "age": patient.age,
            "gender": patient.gender,
            "email": patient.email,
            "phone": patient.phone,
        }
    except Exception as e:
        db.rollback()
        logging.getLogger(__name__).exception("Failed to create patient")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=schemas.PatientOut)
def get_my_patient(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        from sqlalchemy import select, desc
        patient = db.execute(
            select(models.Patient)
            .where(models.Patient.user_id == current_user.id)
            .order_by(desc(models.Patient.id))
        ).scalar_one_or_none()
        if not patient:
            raise HTTPException(status_code=404, detail="No patient found for user")
        return {
            "id": patient.id,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "age": patient.age,
            "gender": patient.gender,
            "email": patient.email,
            "phone": patient.phone,
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.getLogger(__name__).exception("Failed to fetch patient")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/consultation-request", status_code=status.HTTP_200_OK)
def request_consultation(
    payload: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Handle patient consultation request and send notification to Slack #lastopinion-patient-questions channel.
    Expects: { "preferred_datetime": "Monday, October 16, 2025, 10:00 AM" }
    """
    try:
        # Get the patient record for current user
        from sqlalchemy import select, desc
        patient = db.execute(
            select(models.Patient)
            .where(models.Patient.user_id == current_user.id)
            .order_by(desc(models.Patient.id))
        ).scalar_one_or_none()
        
        if not patient:
            raise HTTPException(status_code=404, detail="No patient found for user")
        
        # Extract preferred datetime from payload
        preferred_datetime = payload.get("preferred_datetime", "Not specified")
        
        # Send Slack notification to #lastopinion-patient-questions
        patient_full_name = f"{patient.first_name} {patient.last_name}"
        slack_result = notify_patient_consultation_request(
            patient_id=patient.id,
            patient_name=patient_full_name,
            patient_phone=patient.phone or "Not provided",
            preferred_datetime=preferred_datetime
        )
        
        logging.getLogger(__name__).info(
            f"Consultation request from patient {patient.id}: {preferred_datetime}, Slack result: {slack_result}"
        )
        
        return {
            "success": True,
            "message": "Consultation request received. Our radiologist will contact you soon.",
            "slack_notification": slack_result.get("ok", False)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.getLogger(__name__).exception("Failed to process consultation request")
        raise HTTPException(status_code=400, detail=str(e))



