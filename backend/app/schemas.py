from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr | None = None
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    phone: str
    symptoms: Optional[str] = None

    # Normalize gender to capitalize first letter (e.g., 'female' -> 'Female')
    @field_validator("gender")
    @classmethod
    def normalize_gender(cls, v: str) -> str:
        if not isinstance(v, str):
            return v
        value = v.strip()
        if not value:
            return value
        return value[:1].upper() + value[1:].lower()


class PatientOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: int
    gender: str
    email: EmailStr
    phone: str
    symptoms: Optional[str] = None


class CaseBase(BaseModel):
    symptoms: Optional[str] = None
    medical_background: Optional[str] = None
    status: Optional[str] = "pending"


class CaseCreate(CaseBase):
    patient_id: int


class CaseOut(CaseBase):
    id: int
    patient_id: int
    model_config = ConfigDict(from_attributes=True)


class CaseUpdate(BaseModel):
    medical_background: Optional[str] = None
    symptoms: Optional[str] = None
    status: Optional[str] = None


class FileBase(BaseModel):
    file_type: str
    study_iuid: Optional[str] = None
    study_id: Optional[str] = None
    status: Optional[str] = None
    radiologist_id: Optional[int] = None
    uploaded_at: Optional[str] = None


class FileCreate(FileBase):
    case_id: int
    patient_id: int
    user_id: int


class FileOut(FileBase):
    id: int
    case_id: int
    patient_id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class ReportCreate(BaseModel):
    case_id: int
    file_id: int | None = None
    study_id: str | None = None
    study_iuid: str | None = None
    radiologist_id: int | None = None
    status: str | None = None
    uploaded_at: str | None = None


class ReportOut(ReportCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class PaymentCreate(BaseModel):
    case_id: int
    order_id: str
    payment_status: str
    amount: Optional[int] = None


class PaymentOut(PaymentCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

