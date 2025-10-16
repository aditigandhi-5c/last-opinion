from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from .patients import get_current_user
from ..utils.slack_notifier import notify_new_case
from ..utils.whatsapp_gupshup import send_whatsapp_case_update

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=schemas.CaseOut, status_code=status.HTTP_201_CREATED)
def create_case(payload: schemas.CaseCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Ensure patient exists and belongs to current user
    patient = db.get(models.Patient, payload.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Create case with medical background (symptoms are now handled in medical_background)
    case = models.Case(
        patient_id=payload.patient_id,
        symptoms=payload.symptoms,  # Optional symptoms from payload
        medical_background=payload.medical_background,
        status="processing",  # case moves to processing after payment+creation flow
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    # Fire-and-forget Slack notification (if token configured)
    try:
        if case and patient and patient.first_name:
            background_tasks.add_task(notify_new_case, f"{patient.first_name} {patient.last_name}".strip(), str(case.id))
    except Exception:
        # Do not block case creation on Slack errors
        pass

    # NOTE: WhatsApp notification moved to payment confirmation to avoid duplicate messages
    # (case creation happens multiple times in the flow, but payment happens only once)

    return case


@router.patch("/{case_id}", response_model=schemas.CaseOut)
def update_case(case_id: int, payload: schemas.CaseUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    case = db.get(models.Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    # Verify ownership via patient -> user
    patient = db.get(models.Patient, case.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this case")

    if payload.medical_background is not None:
        case.medical_background = payload.medical_background
    if getattr(payload, "symptoms", None) is not None:
        case.symptoms = payload.symptoms
    if payload.status is not None:
        case.status = payload.status
    db.add(case)
    db.commit()
    db.refresh(case)
    return case



 

