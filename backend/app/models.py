from sqlalchemy import Column, Integer, String, DateTime, Text, func, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    # Optional mapping to Firebase user
    firebase_uid = Column(String(255), unique=True, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    patients = relationship("Patient", back_populates="user")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    email = Column(String(100))
    phone = Column(String(15))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="patients")


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_type = Column(String, nullable=False)
    study_iuid = Column(String, nullable=True)
    study_id = Column(String, nullable=True)
    status = Column(String, default="uploaded")

    # relationships
    case = relationship("Case", back_populates="files")
    patient = relationship("Patient")
    user = relationship("User")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    symptoms = Column(Text, nullable=True)
    medical_background = Column(Text, nullable=True)
    status = Column(String, default="pending")

    # relationships
    patient = relationship("Patient")
    files = relationship("File", back_populates="case", cascade="all, delete")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    order_id = Column(String, nullable=False)
    payment_status = Column(String, nullable=False)
    amount = Column(Integer, nullable=True)

    # relationships
    case = relationship("Case")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=True)
    study_id = Column(String, nullable=True)
    study_iuid = Column(String, nullable=True)
    radiologist_id = Column(Integer, nullable=True)
    report_id = Column(String, nullable=True)
    pdf_url = Column(Text, nullable=True)
    status = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), nullable=True)

    case = relationship("Case")
    file = relationship("File")




# Structured reports submitted from the external "opinion report" site
class StructuredReport(Base):
    __tablename__ = "structured_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, index=True, nullable=False)
    status = Column(String, nullable=True)
    structured = Column(Text, nullable=True)
    original_report_pdf = Column(Text, nullable=True)  # can be base64 text or raw bytes repr
    generated_report_pdf = Column(Text, nullable=True) # can be base64 text or raw bytes repr
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

