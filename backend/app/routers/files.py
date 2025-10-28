import os
import httpx
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from .patients import get_current_user

router = APIRouter(prefix="/files", tags=["files"])
API_BASE = os.getenv("FIVEC_API_BASE", "https://api.5cnetwork.com")
API_AUTH = os.getenv("FIVEC_API_AUTH")  # e.g., "Bearer <token>" or raw token if API expects basic token

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


@router.get("/mine", response_model=List[schemas.FileOut])
def list_my_files(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    rows = db.execute(
        select(models.File)
        .where(models.File.user_id == current_user.id)
        .order_by(desc(models.File.id))
    ).scalars().all()
    return [
        schemas.FileOut(
            id=f.id,
            case_id=f.case_id,
            patient_id=f.patient_id,
            user_id=f.user_id,
            file_type=f.file_type,
            study_iuid=f.study_iuid,
            study_id=f.study_id,
            status=f.status,
        )
        for f in rows
    ]


@router.post("/dicom", response_model=schemas.FileOut)
async def upload_dicom(
    dicomFile: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    case_id: int | None = None,
    patient_id: int | None = None,
):
    """Proxy DICOM upload to 5C router and persist StudyIUID and response."""
    external_url = os.getenv(
        "DICOM_UPLOAD_URL",
        "https://router.5cn.co.in/api/dicom/upload?callingAET=secondopinion",
    )

    try:
        # Stream file to external API
        print(f"DEBUG: Uploading to {external_url}")
        print(f"DEBUG: API_AUTH available: {bool(API_AUTH)}")
        async with httpx.AsyncClient(timeout=120) as client:
            payload = await dicomFile.read()
            files = {"dicomFile": (dicomFile.filename, payload, dicomFile.content_type or "application/dicom")}
            headers = {}
            if API_AUTH:
                headers["Authorization"] = API_AUTH
                print(f"DEBUG: Using auth header: {API_AUTH[:20]}...")
            else:
                print("DEBUG: No API_AUTH found, uploading without authentication")
            resp = await client.post(external_url, files=files, headers=headers)
            print(f"DEBUG: Upload response status: {resp.status_code}")
            print(f"DEBUG: Upload response: {resp.text[:200]}...")
        # Best-effort parse JSON regardless of header
        data = None
        try:
            data = resp.json()
        except Exception:
            try:
                import json as _json
                txt = resp.text
                data = _json.loads(txt) if txt else None
            except Exception:
                data = None
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=data)

        # Extract StudyIUID and s3 url (best-effort, nested/case-insensitive)
        def _walk(obj):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    yield k, v
                    for t in _walk(v):
                        yield t
            elif isinstance(obj, list):
                for it in obj:
                    for t in _walk(it):
                        yield t
        def _norm(s: str) -> str:
            return ''.join(ch for ch in s.lower() if ch.isalnum())

        study_iuid = None
        s3_url_val = None
        if isinstance(data, (dict, list)):
            for k, v in _walk(data):
                nk = _norm(str(k))
                if v is None:
                    continue
                if nk in {"studyiuid","studyinstanceuid","studyuid","study_iuid"}:
                    study_iuid = str(v)
                if nk in {"s3url","s3_url","fileurl","url","location"}:
                    sv = str(v)
                    if sv.startswith("http"):
                        s3_url_val = sv

        # Resolve case and patient ownership
        from sqlalchemy import select, desc, func
        effective_case_id = None
        effective_patient_id = None

        if case_id is not None:
            case = db.execute(select(models.Case).where(models.Case.id == case_id)).scalar_one_or_none()
            if not case:
                raise HTTPException(status_code=404, detail="Case not found")
            # Verify ownership via patient → user
            patient = db.execute(select(models.Patient).where(models.Patient.id == case.patient_id)).scalar_one_or_none()
            if not patient or patient.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not allowed for this case")
            effective_case_id = case.id
            effective_patient_id = case.patient_id
        else:
            # fallback: latest case for current user
            case = db.execute(
                select(models.Case)
                .join(models.Patient, models.Patient.id == models.Case.patient_id)
                .where(models.Patient.user_id == current_user.id)
                .order_by(desc(models.Case.id))
            ).scalar_one_or_none()
            if not case:
                raise HTTPException(status_code=400, detail="No case found. Create a case before uploading.")
            effective_case_id = case.id
            effective_patient_id = case.patient_id

        # Persist
        file_rec = models.File(
            case_id=effective_case_id,
            patient_id=effective_patient_id,
            user_id=current_user.id,
            file_type="dicom",
            study_iuid=study_iuid,
            status="uploaded",
        )
        db.add(file_rec)
        db.commit()
        db.refresh(file_rec)

        # Trigger report polling/sync in background
        try:
            import asyncio
            from .reports import poll_and_store_report_for_file
            asyncio.create_task(poll_and_store_report_for_file(file_rec.id, db))
        except Exception:
            pass

        return schemas.FileOut(
            id=file_rec.id,
            case_id=file_rec.case_id,
            patient_id=file_rec.patient_id,
            user_id=file_rec.user_id,
            file_type=file_rec.file_type,
            study_iuid=file_rec.study_iuid,
            study_id=file_rec.study_id,
            status=file_rec.status,
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{file_id}", response_model=schemas.FileOut)
def get_file(file_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    file_rec = db.get(models.File, file_id)
    if not file_rec:
        raise HTTPException(status_code=404, detail="File not found")
    # Verify ownership
    patient = db.get(models.Patient, file_rec.patient_id) if file_rec.patient_id else None
    if not patient or patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this file")
    return schemas.FileOut(
        id=file_rec.id,
        case_id=file_rec.case_id,
        patient_id=file_rec.patient_id,
        user_id=file_rec.user_id,
        file_type=file_rec.file_type,
        study_iuid=file_rec.study_iuid,
        study_id=file_rec.study_id,
        status=file_rec.status,
    )


@router.post("/{file_id}/refresh-status", response_model=schemas.FileOut)
async def refresh_status(file_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Resolve study_id by study_iuid if missing, then update status via external API and persist."""
    file_rec = db.get(models.File, file_id)
    if not file_rec:
        raise HTTPException(status_code=404, detail="File not found")

    # Verify ownership through case -> patient -> user
    case = db.get(models.Case, file_rec.case_id) if file_rec.case_id else None
    patient = db.get(models.Patient, file_rec.patient_id) if file_rec.patient_id else None
    owner_ok = (patient and patient.user_id == current_user.id) or False
    if not owner_ok:
        raise HTTPException(status_code=403, detail="Not allowed for this file")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # If no study_id, try resolving from Study IUID
            if not file_rec.study_id and file_rec.study_iuid:
                code, data = await _get_json(client, f"{API_BASE}/study/uid/{file_rec.study_iuid}")
                if code == 200 and isinstance(data, dict):
                    # Map sample response: {"id": 5746411, "study_uid": "...", "status": "COMPLETED"}
                    sid = data.get("id") or data.get("study_id")
                    if sid is not None:
                        file_rec.study_id = str(sid)
                    # Update status directly if present
                    status_val = (data.get("status") or "").lower()
                    if status_val:
                        file_rec.status = "completed" if status_val == "completed" else file_rec.status or "processing"
                    # Do not store extra metadata in files; that belongs in reports

            # If we have a study_id, attempt to detect report status
            if file_rec.study_id:
                # Try completed endpoint first
                code, data = await _get_json(client, f"{API_BASE}/report/client/completed/{file_rec.study_id}")
                if code == 200:
                    file_rec.status = "completed"
                else:
                    # Try details endpoint as fallback
                    params = {"report_ids[]": file_rec.study_id}
                    code2, data2 = await _get_json(client, f"{API_BASE}/report/details", params=params)
                    if code2 == 200:
                        file_rec.status = "completed"
                    else:
                        file_rec.status = "processing"

        db.add(file_rec)
        db.commit()
        db.refresh(file_rec)
        return schemas.FileOut(
            id=file_rec.id,
            case_id=file_rec.case_id,
            patient_id=file_rec.patient_id,
            user_id=file_rec.user_id,
            file_type=file_rec.file_type,
            study_iuid=file_rec.study_iuid,
            study_id=file_rec.study_id,
            status=file_rec.status,
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


