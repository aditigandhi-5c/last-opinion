import os
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/storage", tags=["storage"])


def _get_s3_client():
    try:
        import boto3  # type: ignore
    except Exception as exc:  # pragma: no cover - import-time
        raise HTTPException(status_code=500, detail=f"boto3 not installed: {exc}")

    endpoint = os.getenv("E2E_HOST_ENDPOINT") or "objectstore.e2enetworks.net"
    access_key = os.getenv("E2E_ACCESS_KEY")
    secret_key = os.getenv("E2E_SECRET_KEY")
    if not access_key or not secret_key:
        raise HTTPException(status_code=500, detail="Object storage credentials not configured")

    session = boto3.session.Session()
    s3 = session.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        endpoint_url=f"https://{endpoint}",
        config=boto3.session.Config(signature_version="s3v4"),
        region_name=os.getenv("E2E_REGION") or "auto",
    )
    return s3


def _bucket_name() -> str:
    name = os.getenv("E2E_BUCKET_NAME")
    if not name:
        raise HTTPException(status_code=500, detail="E2E_BUCKET_NAME not configured")
    return name


@router.post("/create-prefix")
def create_prefix(prefix: str = Query("second-opinion/", min_length=1)):
    """Create a logical folder (prefix) by uploading an empty object with trailing slash.
    Never performs delete operations.
    """
    key = prefix if prefix.endswith("/") else prefix + "/"
    s3 = _get_s3_client()
    bucket = _bucket_name()
    try:
        # zero-byte object to realize prefix
        s3.put_object(Bucket=bucket, Key=key, Body=b"")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to create prefix: {exc}")
    return {"ok": True, "prefix": key}


@router.get("/presign-view")
def presign_view(key: str = Query(..., min_length=1)):
    """Return a 7-day pre-signed URL to view an object inline. No deletes are performed."""
    s3 = _get_s3_client()
    bucket = _bucket_name()
    try:
        # Verify object exists (HEAD); do not download
        s3.head_object(Bucket=bucket, Key=key)
    except Exception as exc:
        raise HTTPException(status_code=404, detail=f"Object not found: {exc}")

    try:
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket,
                "Key": key,
                "ResponseContentDisposition": "inline",
            },
            ExpiresIn=7 * 24 * 3600,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to presign: {exc}")

    return {"view_url": url}


@router.get("/presign-view-latest")
def presign_view_latest(
    patient_id: str = Query(..., min_length=1),
    prefix_root: str = Query("second-opinion", min_length=1),
):
    """Find the latest PDF under second-opinion/<patient_id>/ and return a 7-day view URL.
    No deletes. If nothing found, returns 404.
    """
    s3 = _get_s3_client()
    bucket = _bucket_name()
    prefix = f"{prefix_root.strip('/')}/{patient_id.strip('/')}/"
    try:
        paginator = s3.get_paginator("list_objects_v2")
        latest_obj = None
        for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
            contents = page.get("Contents") or []
            for obj in contents:
                key = obj.get("Key") or ""
                if not key or key.endswith("/"):
                    continue  # skip folder markers
                if not key.lower().endswith(".pdf"):
                    continue
                if latest_obj is None or obj.get("LastModified") > latest_obj.get("LastModified"):
                    latest_obj = obj
        if not latest_obj:
            raise HTTPException(status_code=404, detail="No PDF found for patient")

        key = latest_obj["Key"]
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket,
                "Key": key,
                "ResponseContentDisposition": "inline",
            },
            ExpiresIn=7 * 24 * 3600,
        )
        return {"view_url": url, "key": key, "patient_id": patient_id}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch latest PDF: {exc}")



