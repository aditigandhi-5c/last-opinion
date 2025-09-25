import requests
from functools import lru_cache
from config import SLACK_BOT_TOKEN, SLACK_CHANNEL


@lru_cache(maxsize=1)
def _resolve_channel_id(channel_hint: str) -> str:
    """Return channel id. If a name like #general is provided, try to resolve via conversations.list.
    Requires the app to have channels:read (public) and/or groups:read (private) scopes.
    If resolution fails, return the original hint.
    """
    hint = (channel_hint or "").strip()
    if not SLACK_BOT_TOKEN or not hint:
        return hint
    if not hint.startswith("#"):
        return hint
    try:
        url = "https://slack.com/api/conversations.list"
        headers = {"Authorization": f"Bearer {SLACK_BOT_TOKEN}"}
        params = {"limit": 1000, "types": "public_channel,private_channel"}
        resp = requests.get(url, headers=headers, params=params, timeout=8)
        data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
        if data.get("ok") and isinstance(data.get("channels"), list):
            name = hint.lstrip("#")
            for ch in data["channels"]:
                if ch.get("name") == name:
                    return ch.get("id", hint)
        return hint
    except Exception:
        return hint


def notify_new_case(patient_name: str, case_id: str):
    if not SLACK_BOT_TOKEN:
        return {"ok": False, "error": "no_token_configured"}

    channel = _resolve_channel_id(SLACK_CHANNEL)

    # Compact message per request
    message = (
        f"New patient case created\n"
        f"name: {patient_name}\n"
        f"case_id: {case_id}"
    )

    url = "https://slack.com/api/chat.postMessage"
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json; charset=utf-8",
    }
    payload = {"channel": channel, "text": message}

    response = requests.post(url, headers=headers, json=payload, timeout=8)
    try:
        result = response.json()
        # Debug logging
        print(f"Slack notification attempt: channel={channel}, response={result}")
        return result
    except Exception as e:
        print(f"Slack notification error: {e}")
        return {"ok": False, "error": "non_json_response", "status": response.status_code}


