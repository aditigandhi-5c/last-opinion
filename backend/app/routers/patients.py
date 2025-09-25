from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from sqlalchemy.orm import Session
import logging

from .. import schemas, models
from ..utils.whatsapp_gupshup import opt_in_whatsapp
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
        # Case-insensitive email match
        from sqlalchemy import select, func
        from ..models import User
        row = db.execute(
            select(User).where(func.lower(User.email) == func.lower(subject))
        ).scalar_one_or_none()
        if row is None:
            raise HTTPException(status_code=401, detail="User not found for token")
        return row
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
            symptoms=payload.symptoms,
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
            "symptoms": patient.symptoms,
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
            "symptoms": patient.symptoms,
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.getLogger(__name__).exception("Failed to fetch patient")
        raise HTTPException(status_code=400, detail=str(e))




