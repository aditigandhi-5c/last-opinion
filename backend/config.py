
# backend/config.py
import os
from dotenv import load_dotenv

# Load .env and allow it to override any existing env so the value here is authoritative
load_dotenv(override=True)

# Read exactly what is set in backend/.env or the process env; do not fall back to a hardcoded URL
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:8081")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
FLASK_ENV = os.getenv("FLASK_ENV", "development")

# Slack integration
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNEL = os.getenv("SLACK_CHANNEL", "C036W170951")

# Slack integration for patient-questions (separate channel)
SLACK_PATIENT_QUESTIONS_CHANNEL = os.getenv("SLACK_PATIENT_QUESTIONS_CHANNEL", "#lastopinion-patient-questions")

# Gupshup WhatsApp integration
# NOTE: Avoid hardcoding secrets; prefer environment variables.
GUPSHUP_API_KEY = os.getenv("GUPSHUP_API_KEY")
GUPSHUP_SOURCE_NUMBER = os.getenv("GUPSHUP_SOURCE_NUMBER")
GUPSHUP_TEMPLATE_ID = os.getenv("GUPSHUP_TEMPLATE_ID")
GUPSHUP_SRC_NAME = os.getenv("GUPSHUP_SRC_NAME", "EchoMed")

# Firebase configuration
FIREBASE_ENABLED = os.getenv("FIREBASE_ENABLED", "false").lower() == "true"
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

