import json
import logging
from fastapi import APIRouter, Request


router = APIRouter(tags=["whatsapp"], prefix="/whatsapp")


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """Handle Gupshup WhatsApp callbacks (delivery, read, incoming messages).
    Supports both JSON and form-encoded payload styles used by Gupshup.
    """
    logger = logging.getLogger(__name__)

    payload: dict | None = None
    body_preview: str | None = None

    # Try JSON first
    try:
        payload = await request.json()
        body_preview = "json"
    except Exception:
        payload = None

    if payload is None:
        try:
            form = await request.form()
            body_preview = "form"
            if "payload" in form:
                try:
                    payload = json.loads(form["payload"])  # type: ignore[index]
                except Exception:
                    payload = {"raw_payload": form.get("payload")}
            else:
                # Fallback: dump form as dict
                payload = {k: form.get(k) for k in form.keys()}
        except Exception:
            payload = None

    # Log concise summary
    try:
        summary = {
            "source": body_preview,
            "type": payload.get("type") if isinstance(payload, dict) else None,
        }
        # Common fields for delivery receipts
        if isinstance(payload, dict):
            message = payload.get("payload") or {}
            if isinstance(message, dict):
                summary.update({
                    "event": message.get("type"),
                    "messageId": message.get("id") or message.get("gsId") or message.get("messageId"),
                    "destination": message.get("destination") or message.get("phone") or message.get("from") or message.get("to"),
                    "status": message.get("status"),
                })
        logger.info("Gupshup webhook event: %s", summary)
    except Exception:
        # Ensure webhook never fails due to logging
        pass

    return {"ok": True}


