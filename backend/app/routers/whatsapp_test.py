from fastapi import APIRouter, Query
from ..utils.whatsapp_gupshup import send_whatsapp_case_update, opt_in_whatsapp


router = APIRouter(tags=["whatsapp"])


@router.get("/test-whatsapp")
def test_whatsapp(
    name: str = Query("Test Patient"),
    phone: str = Query("918805606668"),
    case_id: str = Query("CASE-TEST-001"),
):
    """Send a test WhatsApp template message via Gupshup.
    Returns the raw provider response for verification.
    """
    result = send_whatsapp_case_update(name, phone, case_id)
    return {"whatsapp_response": result}


@router.get("/test-whatsapp-optin")
def test_whatsapp_optin(
    phone: str = Query("918805606668"),
):
    result = opt_in_whatsapp(phone)
    return {"optin_response": result}


