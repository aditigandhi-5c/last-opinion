import logging
from typing import Dict, Any

import requests
import json

from config import (
    GUPSHUP_API_KEY,
    GUPSHUP_SOURCE_NUMBER,
    GUPSHUP_TEMPLATE_ID,
    GUPSHUP_SRC_NAME,
)


def send_whatsapp_case_update(patient_name: str, patient_phone: str, case_id: str) -> Dict[str, Any]:
    """
    Send a WhatsApp template message via Gupshup to the patient.

    Template variables mapping:
      {{1}} -> patient_name
      {{2}} -> case_id

    Returns a structured dict with ok/error fields. Does not raise.
    """
    logger = logging.getLogger(__name__)

    if not (GUPSHUP_API_KEY and GUPSHUP_SOURCE_NUMBER and GUPSHUP_TEMPLATE_ID):
        return {
            "ok": False,
            "error": "gupshup_not_configured",
            "detail": "Missing GUPSHUP_API_KEY or GUPSHUP_SOURCE_NUMBER or GUPSHUP_TEMPLATE_ID",
        }

    try:
        print("step 1 in inside the wa ------------------------------")
        # Use form-encoded template send as per Gupshup docs
        url = "https://api.gupshup.io/wa/api/v1/template/msg"
        headers = {
            "apikey": GUPSHUP_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
        }
        print("step 2 in inside the wa ------------------------------")
        destination = _normalize_msisdn(patient_phone)
        print("step 3 in inside the wa ------------------------------")
        # Ensure destination is digits in E.164 without leading '+' (Gupshup expects digits)
        if len(destination) == 10:
            destination = "91" + destination

        print("step 4 in inside the wa ------------------------------")

        # Use JSON-in-template format as per working reference implementation
        # template: JSON string with id and params array
        form = {
            "channel": "whatsapp",
            "source": GUPSHUP_SOURCE_NUMBER,
            "destination": destination,
            "src.name": GUPSHUP_SRC_NAME,
            "template": json.dumps({
                "id": GUPSHUP_TEMPLATE_ID,
                "params": [patient_name, case_id],
            }),
        }

        print("step 5 in inside the wa ------------------------------", form)

        resp = requests.post(url, data=form, headers=headers, timeout=10)
        print("step 6 in inside the wa ------------------------------", resp)
        data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}

        print("step 6.1 in inside the wa ------------------------------", data)

        if resp.ok and (data.get("status") in {"submitted", "success"} or data.get("ok")):
            print("step 7 in inside the wa ------------------------------")
            logger.info("Gupshup WhatsApp submitted: %s", data)
            return {"ok": True, "status": data.get("status", "submitted"), "data": data}

        # Non-2xx or unexpected body
        logger.warning("Gupshup WhatsApp failed: status=%s body=%s", resp.status_code, data)
        return {
            "ok": False,
            "status_code": resp.status_code,
            "error": data.get("message") or data.get("error") or "gupshup_send_failed",
            "data": data,
        }
    except Exception:
        logger.exception("Gupshup WhatsApp send failed")
        return {"ok": False, "error": "exception", "detail": "unexpected_error"}


def _normalize_msisdn(phone: str) -> str:
    """Return E.164-like number. Strip non-digits, drop leading +/zeros, auto 91 for 10-digit.
    Examples:
      '+91 88056-06668' -> '918805606668'
      '08805606668' -> '918805606668'
      '8805606668' -> '918805606668'
    """
    import re
    digits = re.sub(r"\D+", "", phone or "").lstrip("0")
    if digits.startswith("91") and len(digits) == 12:
        return digits
    if len(digits) == 10:
        return "91" + digits
    return digits


def opt_in_whatsapp(phone: str) -> Dict[str, Any]:
    """Attempt to opt-in a user to WhatsApp via Gupshup. Tries WA and SM endpoints.
    Returns {ok, data|error} and does not raise.
    """
    logger = logging.getLogger(__name__)

    if not (GUPSHUP_API_KEY and GUPSHUP_SRC_NAME):
        return {"ok": False, "error": "gupshup_not_configured"}

    dest = _normalize_msisdn(phone)
    if len(dest) == 10:
        dest = "91" + dest

    headers_form = {"apikey": GUPSHUP_API_KEY, "Content-Type": "application/x-www-form-urlencoded"}

    # 1) WhatsApp app opt-in endpoint
    wa_attempt: Dict[str, Any] = {}
    try:
        url_wa = "https://api.gupshup.io/wa/api/v1/app/optin"
        form_wa = {"user": dest, "channel": "whatsapp", "source": GUPSHUP_SOURCE_NUMBER or "", "src.name": GUPSHUP_SRC_NAME}
        resp_wa = requests.post(url_wa, data=form_wa, headers=headers_form, timeout=10)
        content_type_wa = resp_wa.headers.get("content-type", "")
        data_wa = resp_wa.json() if content_type_wa.startswith("application/json") else {"raw": resp_wa.text}
        wa_attempt = {"status_code": resp_wa.status_code, "body": data_wa}
        if resp_wa.ok and (data_wa.get("ok") or data_wa.get("status") in {"success", "submitted"}):
            logger.info("Gupshup opt-in (wa) ok: %s", data_wa)
            return {"ok": True, "data": data_wa}
        logger.warning("Gupshup opt-in (wa) failed: %s %s", resp_wa.status_code, data_wa)
    except Exception as exc:
        logger.exception("Gupshup opt-in (wa) exception")
        wa_attempt = {"error": "exception", "detail": str(exc)}

    # 2) SM users opt-in fallback
    sm_attempt: Dict[str, Any] = {}
    try:
        url_sm = "https://api.gupshup.io/sm/api/v1/users/optin"
        form_sm = {"user": dest, "appname": GUPSHUP_SRC_NAME}
        resp_sm = requests.post(url_sm, data=form_sm, headers=headers_form, timeout=10)
        content_type_sm = resp_sm.headers.get("content-type", "")
        data_sm = resp_sm.json() if content_type_sm.startswith("application/json") else {"raw": resp_sm.text}
        sm_attempt = {"status_code": resp_sm.status_code, "body": data_sm}
        if resp_sm.ok and (data_sm.get("ok") or data_sm.get("status") in {"success", "submitted"}):
            logger.info("Gupshup opt-in (sm) ok: %s", data_sm)
            return {"ok": True, "data": data_sm}
        logger.warning("Gupshup opt-in (sm) failed: %s %s", resp_sm.status_code, data_sm)
    except Exception as exc:
        logger.exception("Gupshup opt-in (sm) exception")
        sm_attempt = {"error": "exception", "detail": str(exc)}

    return {"ok": False, "error": "optin_failed", "wa_attempt": wa_attempt, "sm_attempt": sm_attempt}


