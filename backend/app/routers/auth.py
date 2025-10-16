from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from app import models, schemas, database
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt_sha256", "bcrypt"],
    deprecated="auto",
)
env_path='.env'
# Load env values
load_dotenv(dotenv_path=env_path)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = get_password_hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


# ---------- Magic-link registration for chatbot ----------

class MagicLinkRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    age: int
    gender: str
    phone: str
    symptoms: Optional[str] = None


@router.post("/magic/request")
def magic_link_request(payload: MagicLinkRequest, db: Session = Depends(database.get_db)):
    """Create or find a user by email, upsert a Patient, and return a short-lived login URL and token.

    This is intended for chatbot-driven quick registration. The frontend/chatbot can display the
    returned login_url to let the user continue and fill additional details. No email is sent.
    """
    # 1) Ensure user exists
    db_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not db_user:
        # Create user with a random password (user will log in via token link)
        random_pw = os.urandom(9).hex()
        hashed_pw = get_password_hash(random_pw)
        db_user = models.User(email=str(payload.email), password_hash=hashed_pw)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # 2) Upsert Patient for this user (use latest or create new)
    from sqlalchemy import select, desc
    existing_patient = db.execute(
        select(models.Patient).where(models.Patient.user_id == db_user.id).order_by(desc(models.Patient.id))
    ).scalar_one_or_none()

    if existing_patient is None:
        patient = models.Patient(
            user_id=db_user.id,
            first_name=payload.first_name,
            last_name=payload.last_name,
            age=payload.age,
            gender=(payload.gender or "").capitalize() if isinstance(payload.gender, str) else payload.gender,
            email=str(payload.email),
            phone=payload.phone,
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
    else:
        # Update basic fields if missing or changed
        existing_patient.first_name = payload.first_name or existing_patient.first_name
        existing_patient.last_name = payload.last_name or existing_patient.last_name
        existing_patient.age = payload.age or existing_patient.age
        existing_patient.gender = (payload.gender or existing_patient.gender)
        existing_patient.email = str(payload.email)
        existing_patient.phone = payload.phone or existing_patient.phone
        db.add(existing_patient)
        db.commit()
        patient = existing_patient

    # 3) Create a short-lived access token and a frontend login URL
    token_ttl = int(os.getenv("MAGIC_LINK_TTL_MINUTES", "30"))
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=token_ttl),
    )
    frontend_base = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
    # Frontend can read ?token= and store it to localStorage, then redirect to dashboard
    login_url = f"{frontend_base}/login?token={access_token}"

    return {
        "login_url": login_url,
        "token": access_token,
        "user": {"id": db_user.id, "email": db_user.email},
        "patient": {
            "id": patient.id,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "age": patient.age,
            "gender": patient.gender,
            "email": patient.email,
            "phone": patient.phone,
        },
    }


# ---------- Firebase adapter (optional, non-breaking) ----------
class FirebaseTokenRequest(BaseModel):
    id_token: str


@router.post("/firebase", response_model=schemas.Token)
def firebase_exchange_token(payload: FirebaseTokenRequest, db: Session = Depends(database.get_db)):
    """Verify a Firebase ID token and mint our backend JWT.

    Safe and additive: if FIREBASE_ENABLED or GOOGLE_APPLICATION_CREDENTIALS not set, returns 400.
    """
    print(os.getenv("FIREBASE_ENABLED", "false"))
    if not os.getenv("FIREBASE_ENABLED", "false").lower() == "true":
        raise HTTPException(status_code=400, detail="Firebase not enabled")
    try:
        import firebase_admin
        from firebase_admin import auth as fb_auth, credentials
        
        if not firebase_admin._apps:
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if not cred_path:
                raise HTTPException(status_code=500, detail="Firebase credentials not configured")
            
            if not os.path.exists(cred_path):
                raise HTTPException(status_code=500, detail=f"Firebase credentials file not found: {cred_path}")
            
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        decoded = fb_auth.verify_id_token(payload.id_token)
        email = decoded.get("email")
        firebase_uid = decoded.get("uid")
        if not email:
            raise HTTPException(status_code=401, detail="Firebase token missing email")
        # Upsert user by email
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            # Create a placeholder password hash for consistency; log it's Firebase-managed
            try:
                placeholder = os.urandom(9).hex()
                user = models.User(email=email, password_hash=get_password_hash(placeholder), firebase_uid=firebase_uid)
                db.add(user)
                db.commit()
                db.refresh(user)
            except Exception as db_error:
                db.rollback()
                logging.getLogger(__name__).error(f"Database error creating user: {db_error}")
                raise HTTPException(status_code=500, detail="Database error: unable to create user")
        else:
            # Attach firebase uid if not already present
            try:
                if not getattr(user, "firebase_uid", None) and firebase_uid:
                    user.firebase_uid = firebase_uid
                    db.add(user)
                    db.commit()
            except Exception:
                db.rollback()
        
        # Safety check - if user is still None, something went wrong
        if not user:
            raise HTTPException(status_code=500, detail="Failed to retrieve or create user")
        
        # Mint our existing JWT for compatibility
        access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logging.getLogger(__name__).exception("Firebase exchange failed")
        raise HTTPException(status_code=401, detail="Invalid Firebase token")


