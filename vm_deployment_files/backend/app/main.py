import os
import asyncio
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routers import auth as auth_router
from .routers import patients as patients_router
from .routers import files as files_router
from .routers import cases as cases_router
from .routers.payments import router as payments_router
from .routers.payments import router as payments_router

from .routers import reports as reports_router
from .routers import storage as storage_router
from .database import Base, engine
from .database import SessionLocal
from . import models as _models
from . import models  # noqa: F401 - ensure models are registered in metadata
from .routers import slack_test as slack_test_router
from .routers import whatsapp_test as whatsapp_test_router
from .routers import whatsapp_webhook as whatsapp_webhook_router


load_dotenv()

app = FastAPI(title="Second Opinion API")


# CORS configuration - allow common local dev ports and external access
frontend_origin = os.getenv("FRONTEND_ORIGIN")  # optional override
cors_origins_env = os.getenv("CORS_ORIGINS", "")  # comma-separated list from env
cors_origins_list = cors_origins_env.split(",") if cors_origins_env else []

origins = [
    frontend_origin,
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:8082",
    "http://127.0.0.1:8082",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
] + cors_origins_list

origins = [o.strip() for o in origins if o and o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Create tables if they don't exist (for dev convenience)
Base.metadata.create_all(bind=engine)


# Routers
app.include_router(auth_router.router)
app.include_router(patients_router.router)
app.include_router(files_router.router)
app.include_router(cases_router.router)
app.include_router(payments_router)
app.include_router(payments_router)
app.include_router(reports_router.router)
app.include_router(cases_router.router)
app.include_router(slack_test_router.router)
app.include_router(whatsapp_test_router.router)
app.include_router(whatsapp_webhook_router.router)
app.include_router(storage_router.router)


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------- Background status refresher ----------------
API_BASE = os.getenv("FIVEC_API_BASE", "https://api.5cnetwork.com")
API_AUTH = os.getenv("FIVEC_API_AUTH")
STATUS_REFRESH_INTERVAL = int(os.getenv("STATUS_REFRESH_INTERVAL_SECONDS", "300"))

_status_task: asyncio.Task | None = None


async def _get_json(client: httpx.AsyncClient, url: str, params: dict | None = None):
    headers = {}
    if API_AUTH:
        headers["Authorization"] = API_AUTH
    r = await client.get(url, params=params, headers=headers)
    if r.headers.get("content-type", "").startswith("application/json"):
        try:
            return r.status_code, r.json()
        except Exception:
            return r.status_code, None
    return r.status_code, None


async def _refresh_pending_files_loop():
    await asyncio.sleep(10)
    while True:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                db = SessionLocal()
                try:
                    from sqlalchemy import select
                    pending = db.execute(
                        select(_models.File).where(
                            _models.File.study_iuid.is_not(None)
                        )
                    ).scalars().all()
                    for f in pending:
                        # Ensure we have a study_id
                        if not f.study_id and f.study_iuid:
                            code, data = await _get_json(client, f"{API_BASE}/study/uid/{f.study_iuid}")
                            if code == 200 and isinstance(data, dict):
                                sid = data.get("id") or data.get("study_id")
                                if sid:
                                    f.study_id = str(sid)

                        # Decide status if we have a study_id and not completed
                        if f.study_id and f.status != "completed":
                            code, _ = await _get_json(client, f"{API_BASE}/report/client/completed/{f.study_id}")
                            if code == 200:
                                f.status = "completed"
                            else:
                                # Details fallback
                                params = {"report_ids[]": f.study_id}
                                code2, _ = await _get_json(client, f"{API_BASE}/report/details", params=params)
                                if code2 == 200:
                                    f.status = "completed"
                                else:
                                    f.status = f.status or "processing"
                        # If any file has completed, mark its case completed
                        if f.status == "completed" and f.case_id:
                            case = db.get(_models.Case, f.case_id)
                            if case and case.status != "completed":
                                case.status = "completed"
                                db.add(case)
                    db.commit()
                finally:
                    db.close()
        except Exception:
            # swallow errors to keep loop alive
            pass
        await asyncio.sleep(STATUS_REFRESH_INTERVAL)


@app.on_event("startup")
async def _start_status_task():
    global _status_task
    if _status_task is None:
        _status_task = asyncio.create_task(_refresh_pending_files_loop())


@app.on_event("shutdown")
async def _stop_status_task():
    global _status_task
    if _status_task:
        _status_task.cancel()
        _status_task = None


