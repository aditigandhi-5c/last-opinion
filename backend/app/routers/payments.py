from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from .patients import get_current_user
from ..utils.slack_notifier import notify_new_case

# Single router instance exported for main.py import
router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=schemas.PaymentOut, status_code=status.HTTP_201_CREATED)
def create_payment(payload: schemas.PaymentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    case = db.get(models.Case, payload.case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    patient = db.get(models.Patient, case.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this case")

    payment = models.Payment(
        case_id=payload.case_id,
        order_id=payload.order_id,
        payment_status=payload.payment_status,
        amount=payload.amount,
    )
    db.add(payment)
    # Move case to processing on successful payment and ensure reports are synced for latest files
    if (payload.payment_status or '').lower() in {"success","captured","paid"}:
        case.status = "processing"
        db.add(case)
        # Notify Slack with real data
        try:
            patient_name = (patient.first_name or "").strip() + (" " + (patient.last_name or "").strip() if patient.last_name else "")
            notify_new_case(patient_name.strip() or patient.email or f"patient:{patient.id}", str(case.id))
        except Exception:
            pass
        try:
            # Find latest file(s) for this case and trigger a sync to populate reports
            from sqlalchemy import select, desc
            latest_files = db.execute(
                select(models.File).where(models.File.case_id == case.id).order_by(desc(models.File.id)).limit(3)
            ).scalars().all()
            import httpx, asyncio
            async def _sync_all():
                async with httpx.AsyncClient(timeout=30) as client:
                    from .reports import sync_report_from_study_uid
                    for f in latest_files:
                        try:
                            await sync_report_from_study_uid(f.id, db, current_user)  # reuse same db/session
                        except Exception:
                            pass
            try:
                asyncio.create_task(_sync_all())
            except RuntimeError:
                # If not in async loop, ignore and let background refresher handle it
                pass
        except Exception:
            pass
    db.commit()
    db.refresh(payment)
    return payment



