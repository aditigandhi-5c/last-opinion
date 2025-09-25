import os
import httpx
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
import asyncio
from datetime import datetime

from ..database import get_db
from .. import models
from .patients import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])

API_BASE = os.getenv("FIVEC_API_BASE", "https://api.5cnetwork.com")
API_AUTH = os.getenv("FIVEC_API_AUTH")
FIVEC_RAD_ID = os.getenv("FIVEC_RAD_ID")
FIVEC_CLIENT_FK = os.getenv("FIVEC_CLIENT_FK")


# -------------------------------
# Helpers
# -------------------------------

async def _get_json(client: httpx.AsyncClient, url: str, params: dict | None = None):
    headers = {}
    if API_AUTH:
        headers["Authorization"] = API_AUTH
    r = await client.get(url, params=params, headers=headers)
    try:
        return r.status_code, r.json()
    except Exception:
        return r.status_code, None


def _extract(value: dict | list | None, keys: list[str]):
    if not value:
        return None
    if isinstance(value, dict):
        for k in keys:
            if k in value:
                return value[k]
        for v in value.values():
            res = _extract(v, keys)
            if res is not None:
                return res
    if isinstance(value, list):
        for item in value:
            res = _extract(item, keys)
            if res is not None:
                return res
    return None


# -------------------------------
# Core: Poll + store reports
# -------------------------------

async def poll_and_store_report_for_file(file_id: int, db: Session, max_attempts: int = 18, delay_seconds: int = 10):
    """
    Orchestrate APIs (2 → 3 → 4) with polling. Upserts into reports table, updates file & case status.
    """
    file_rec = db.get(models.File, file_id)
    if not file_rec:
        return

    async with httpx.AsyncClient(timeout=30) as client:
        # 1. Ensure study_id from study_iuid
        if not file_rec.study_id and file_rec.study_iuid:
            code, data = await _get_json(client, f"{API_BASE}/study/uid/{file_rec.study_iuid}")
            if code == 200 and isinstance(data, dict):
                sid = _extract(data, ["id", "study_id"])
                if sid:
                    file_rec.study_id = str(sid)
                    db.add(file_rec); db.commit(); db.refresh(file_rec)

        if not file_rec.study_id:
            return

        # 2. Poll until pdf_url ready
        for _ in range(max_attempts):
            code_c, data_c = await _get_json(client, f"{API_BASE}/report/client/completed/{file_rec.study_id}")
            rad_id, report_ids = None, []
            if code_c == 200 and data_c:
                if isinstance(data_c, list):
                    for it in data_c:
                        if isinstance(it, dict):
                            if it.get("id"):
                                report_ids.append(str(it["id"]))
                            if it.get("rad_fk") and not rad_id:
                                rad_id = str(it["rad_fk"])
                elif isinstance(data_c, dict):
                    if data_c.get("id"):
                        report_ids.append(str(data_c["id"]))
                    if data_c.get("rad_fk"):
                        rad_id = str(data_c["rad_fk"])
            if not report_ids:
                report_ids = [str(file_rec.study_id)]

            # fetch details with pdf_url
            params = {"send_pdf_url": "true"}
            for rid in report_ids:
                params.setdefault("report_ids[]", []).append(rid)
            if rad_id:
                params["rad_id"] = rad_id
            if FIVEC_CLIENT_FK:
                params["client_fk"] = FIVEC_CLIENT_FK

            code_d, data_d = await _get_json(client, f"{API_BASE}/report/details", params=params)
            if code_d == 200 and data_d:
                items = data_d if isinstance(data_d, list) else [data_d]
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    pdf_url = _extract(item, ["pdf_url", "s3_url", "url", "fileUrl", "location"])
                    rid = str(item.get("id")) if item.get("id") else None
                    status = str(item.get("status") or "").upper() or "PENDING"
                    uploaded_at = _extract(item, ["completed_date", "created_at", "updated_at", "updatedAt"])

                    # upsert report
                    report_rec = db.query(models.Report).filter(models.Report.file_id == file_rec.id).first()
                    if not report_rec:
                        report_rec = models.Report(
                            case_id=file_rec.case_id,
                            file_id=file_rec.id,
                            study_id=file_rec.study_id,
                            study_iuid=file_rec.study_iuid,
                        )
                    report_rec.report_id = rid or report_rec.report_id
                    report_rec.radiologist_id = rad_id or report_rec.radiologist_id
                    report_rec.pdf_url = pdf_url or report_rec.pdf_url
                    report_rec.status = status or report_rec.status

                    if uploaded_at:
                        for fmt in ["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ"]:
                            try:
                                report_rec.uploaded_at = datetime.strptime(str(uploaded_at), fmt)
                                break
                            except Exception:
                                continue

                    db.add(report_rec); db.commit(); db.refresh(report_rec)

                    if pdf_url:
                        file_rec.status = "completed"
                        db.add(file_rec)
                        if file_rec.case_id:
                            case = db.get(models.Case, file_rec.case_id)
                            if case:
                                case.status = "completed"
                                db.add(case)
                        db.commit()
                        return
            await asyncio.sleep(delay_seconds)


# -------------------------------
# Routes
# -------------------------------

@router.post("/sync/{file_id}")
async def sync_report_from_study_uid(file_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Force sync a file's report from vendor and store in DB."""
    file_rec = db.get(models.File, file_id)
    if not file_rec:
        raise HTTPException(status_code=404, detail="File not found")
    patient = db.get(models.Patient, file_rec.patient_id) if file_rec.patient_id else None
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this file")

    if not API_AUTH:
        raise HTTPException(status_code=500, detail="FIVEC_API_AUTH is not configured")

    await poll_and_store_report_for_file(file_id, db)
    return {"ok": True, "file_id": file_id, "study_id": file_rec.study_id}


@router.get("/{file_id}/pdf")
async def get_report_pdf(file_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Return report pdf url(s) for a file, syncing if missing."""
    file_rec = db.get(models.File, file_id)
    if not file_rec:
        raise HTTPException(status_code=404, detail="File not found")
    patient = db.get(models.Patient, file_rec.patient_id) if file_rec.patient_id else None
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this file")

    existing = db.query(models.Report).filter(models.Report.file_id == file_rec.id).first()
    if existing and existing.pdf_url:
        return {"file_id": file_rec.id, "study_id": file_rec.study_id, "pdf_urls": [existing.pdf_url]}

    if not API_AUTH:
        raise HTTPException(status_code=404, detail="Report PDF not available yet")

    await poll_and_store_report_for_file(file_id, db)
    existing = db.query(models.Report).filter(models.Report.file_id == file_rec.id).first()
    if existing and existing.pdf_url:
        return {"file_id": file_rec.id, "study_id": file_rec.study_id, "pdf_urls": [existing.pdf_url]}
    raise HTTPException(status_code=404, detail="Report PDF not available yet")


@router.get("/viewer-link")
async def get_viewer_link_by_iuid(study_iuid: str = Query(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not API_AUTH:
        raise HTTPException(status_code=500, detail="FIVEC_API_AUTH not configured")
    async with httpx.AsyncClient(timeout=30) as client:
        code, data = await _get_json(client, f"{API_BASE}/dicom/v2/sharable-image-link", params={"study_iuid": study_iuid})
        if code != 200 or not data:
            raise HTTPException(status_code=502, detail="viewer-link failed")
        link = _extract(data, ["url", "link", "sharable_link", "viewer_url"]) or data
        return {"study_iuid": study_iuid, "viewer_link": link}
