from fastapi import APIRouter

from ..utils.slack_notifier import notify_new_case, notify_patient_consultation_request



from config import SLACK_BOT_TOKEN  # ✅ import your token to check

router = APIRouter(tags=["slack"])

@router.get("/test-slack")
def test_slack():
    print("SLACK_BOT_TOKEN:", SLACK_BOT_TOKEN)  # ✅ debug print
    response = notify_new_case("Test Patient", "CASE-TEST-001")
    return {"slack_response": response}

@router.get("/test-consultation")
def test_consultation():
    """Test consultation request notification"""
    response = notify_patient_consultation_request(
        patient_id=999,
        patient_name="Test Patient",
        patient_phone="9876543210",
        preferred_datetime="Monday, October 21, 2025, 10:30 AM"
    )
    return {"slack_response": response}

@router.get("/list-channels")
def list_channels():
    """List available Slack channels for debugging"""
    if not SLACK_BOT_TOKEN:
        return {"error": "no_token_configured"}
    
    import requests
    url = "https://slack.com/api/conversations.list"
    headers = {"Authorization": f"Bearer {SLACK_BOT_TOKEN}"}
    params = {"limit": 1000, "types": "public_channel,private_channel"}
    
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=8)
        data = resp.json()
        if data.get("ok"):
            channels = data.get("channels", [])
            return {
                "ok": True,
                "channels": [
                    {"id": ch.get("id"), "name": ch.get("name"), "is_member": ch.get("is_member")}
                    for ch in channels
                ]
            }
        else:
            return {"ok": False, "error": data.get("error")}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.get("/find-channel/{channel_name}")
def find_channel(channel_name: str):
    """Find a specific channel by name"""
    if not SLACK_BOT_TOKEN:
        return {"error": "no_token_configured"}
    
    import requests
    url = "https://slack.com/api/conversations.list"
    headers = {"Authorization": f"Bearer {SLACK_BOT_TOKEN}"}
    params = {"limit": 1000, "types": "public_channel,private_channel"}
    
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=8)
        data = resp.json()
        if data.get("ok"):
            channels = data.get("channels", [])
            for ch in channels:
                if ch.get("name") == channel_name:
                    return {
                        "found": True,
                        "channel": {"id": ch.get("id"), "name": ch.get("name"), "is_member": ch.get("is_member")}
                    }
            return {"found": False, "message": f"Channel '{channel_name}' not found"}
        else:
            return {"ok": False, "error": data.get("error")}
    except Exception as e:
        return {"ok": False, "error": str(e)}
