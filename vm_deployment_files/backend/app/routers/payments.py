from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import razorpay
import hmac
import hashlib
import json
import os
from dotenv import load_dotenv

from ..database import get_db
from .. import models, schemas
from .patients import get_current_user
from ..utils.slack_notifier import notify_new_case
from ..utils.whatsapp_gupshup import send_whatsapp_case_update

# Load environment variables
load_dotenv()

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)

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
        # Send WhatsApp notification on successful payment (once per case)
        try:
            if patient and patient.phone:
                patient_full_name = f"{patient.first_name or ''} {patient.last_name or ''}".strip()
                send_whatsapp_case_update(
                    patient_full_name or patient.email or f"Patient {patient.id}",
                    str(patient.phone),
                    str(case.id),
                )
        except Exception:
            # Do not block payment on WhatsApp errors
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


@router.post("/create-order")
async def create_razorpay_order(request_data: schemas.CreateOrderRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Create Razorpay order for ₹3,000"""
    
    case_id = request_data.case_id
    
    # Verify case exists and belongs to user
    case = db.get(models.Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    patient = db.get(models.Patient, case.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this case")
    
    # Create order in Razorpay
    order_data = {
        "amount": 300000,  # ₹3,000 in paise
        "currency": "INR",
        "receipt": f"case_{case_id}",
        "notes": {
            "case_id": str(case_id),
            "patient_id": str(patient.id)
        }
    }
    
    try:
        order = razorpay_client.order.create(data=order_data)
        
        # Save order to database
        payment = models.Payment(
            case_id=case_id,
            order_id=order["id"],
            razorpay_order_id=order["id"],
            payment_status="pending",
            amount=3000
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": os.getenv("RAZORPAY_KEY_ID"),
            "payment_id": payment.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Razorpay webhook events"""
    
    # Get the raw body
    body = await request.body()
    
    # Get the signature from headers
    signature = request.headers.get("X-Razorpay-Signature")
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")
    
    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature header")
    
    # Verify webhook signature
    expected_signature = hmac.new(
        webhook_secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Parse the webhook data
    webhook_data = json.loads(body)
    event = webhook_data.get("event")
    
    if event == "payment.captured":
        payment_data = webhook_data.get("payload", {}).get("payment", {})
        order_data = webhook_data.get("payload", {}).get("order", {})
        
        # Update payment status in database
        payment = db.query(models.Payment).filter(
            models.Payment.razorpay_order_id == order_data.get("id")
        ).first()
        
        if payment:
            payment.payment_status = "success"
            payment.razorpay_payment_id = payment_data.get("id")
            payment.razorpay_signature = signature
            
            # Update case status to processing
            case = db.get(models.Case, payment.case_id)
            if case:
                case.status = "processing"
                db.add(case)
                
                # Notify Slack and WhatsApp
                try:
                    patient = db.get(models.Patient, case.patient_id)
                    if patient:
                        patient_name = (patient.first_name or "").strip() + (" " + (patient.last_name or "").strip() if patient.last_name else "")
                        notify_new_case(patient_name.strip() or patient.email or f"patient:{patient.id}", str(case.id))
                        
                        # Send WhatsApp notification
                        if patient.phone:
                            patient_full_name = f"{patient.first_name or ''} {patient.last_name or ''}".strip()
                            send_whatsapp_case_update(
                                patient_full_name or patient.email or f"Patient {patient.id}",
                                str(patient.phone),
                                str(case.id),
                            )
                except Exception:
                    pass  # Don't block payment on notification errors
            
            db.commit()
            
    elif event == "payment.failed":
        payment_data = webhook_data.get("payload", {}).get("payment", {})
        order_data = webhook_data.get("payload", {}).get("order", {})
        
        # Update payment status to failed
        payment = db.query(models.Payment).filter(
            models.Payment.razorpay_order_id == order_data.get("id")
        ).first()
        
        if payment:
            payment.payment_status = "failed"
            payment.razorpay_payment_id = payment_data.get("id")
            db.commit()
    
    return {"status": "success"}


@router.post("/verify")
async def verify_payment(
    request_data: schemas.VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Verify payment signature"""
    
    # Extract data from request
    razorpay_payment_id = request_data.razorpay_payment_id
    razorpay_order_id = request_data.razorpay_order_id
    razorpay_signature = request_data.razorpay_signature
    
    print(f"DEBUG: Payment verification request - Order ID: {razorpay_order_id}, Payment ID: {razorpay_payment_id}, User: {current_user.email}")
    
    # Verify signature
    body = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected_signature = hmac.new(
        os.getenv("RAZORPAY_KEY_SECRET").encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(razorpay_signature, expected_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Update payment status
    payment = db.query(models.Payment).filter(
        models.Payment.razorpay_order_id == razorpay_order_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify case belongs to user
    case = db.get(models.Case, payment.case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    patient = db.get(models.Patient, case.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this payment")
    
    payment.payment_status = "success"
    payment.razorpay_payment_id = razorpay_payment_id
    payment.razorpay_signature = razorpay_signature
    
    # Update case status
    case.status = "processing"
    db.add(case)
    db.commit()
    
    return {"status": "success", "message": "Payment verified successfully"}


@router.get("/status/{payment_id}")
async def get_payment_status(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get payment status"""
    
    payment = db.get(models.Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Verify case belongs to user
    case = db.get(models.Case, payment.case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    patient = db.get(models.Patient, case.patient_id)
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this payment")
    
    return {
        "payment_id": payment.id,
        "order_id": payment.order_id,
        "payment_status": payment.payment_status,
        "amount": payment.amount,
        "case_id": payment.case_id,
        "created_at": payment.created_at
    }



