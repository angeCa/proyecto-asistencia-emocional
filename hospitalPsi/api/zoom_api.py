import base64
import requests
from django.conf import settings

def get_zoom_access_token():
    auth = f"{settings.ZOOM_CLIENT_ID}:{settings.ZOOM_CLIENT_SECRET}"
    b64_auth = base64.b64encode(auth.encode()).decode()

    url = (
        f"https://zoom.us/oauth/token"
        f"?grant_type=account_credentials"
        f"&account_id={settings.ZOOM_ACCOUNT_ID}"
    )

    headers = {"Authorization": f"Basic {b64_auth}"}

    resp = requests.post(url, headers=headers, timeout=20)
    if resp.status_code != 200:
        raise Exception(f"ZOOM_TOKEN_ERROR {resp.status_code} {resp.text}")

    return resp.json().get("access_token")


def create_zoom_meeting(topic, start_time, duration_minutes=60):
    token = get_zoom_access_token()
    if not token:
        raise Exception("ZOOM_TOKEN_MISSING")

    user_id = getattr(settings, "ZOOM_HOST_USER_ID", None)
    if not user_id:
        raise Exception("ZOOM_HOST_USER_ID_MISSING")

    if hasattr(start_time, "isoformat"):
        start_time = start_time.isoformat()

    url = f"https://api.zoom.us/v2/users/{user_id}/meetings"

    payload = {
        "topic": topic or "Consulta",
        "type": 2,
        "start_time": start_time,
        "duration": int(duration_minutes or 60),
        "timezone": "America/Costa_Rica",
        "settings": {"waiting_room": True, "approval_type": 0},
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=20)
    if resp.status_code not in (200, 201):
        raise Exception(f"ZOOM_CREATE_ERROR {resp.status_code} {resp.text}")

    data = resp.json()
    join_url = data.get("join_url")
    if not join_url:
        raise Exception(f"ZOOM_NO_JOIN_URL {data}")

    return join_url
