from fastapi import APIRouter
from datetime import datetime, timezone
import uuid

from models import CommunityJoinRequest
from database import get_supabase, memory_members
from email_service import notify_community_join

router = APIRouter(prefix="/api/community", tags=["Community"])

TELEMETRY_STATS = {
    "platformStats": [
        {"value": "12,400+", "label": "Active Builders", "color": "text-primary"},
        {"value": "180+", "label": "Shipped Open Projects", "color": "text-secondary"},
        {"value": "45+", "label": "Hackathons & Talks", "color": "text-tertiary"},
        {"value": "98%", "label": "Mentorship Match", "color": "text-primary-container"}
    ],
    "telemetryMetrics": [
        {"label": "TOTAL OPEN ROLES", "value": "38 Seats", "icon": "group_add", "iconColor": "text-primary"},
        {"label": "ACTIVE REVIEW VELOCITY", "value": "< 48 hrs", "icon": "bolt", "iconColor": "text-secondary"},
        {"label": "WEEKLY CODE COMMITS", "value": "1,480+", "icon": "terminal", "iconColor": "text-tertiary"},
        {"label": "COMMUNITY MATCH RATE", "value": "91.4%", "icon": "verified", "iconColor": "text-primary-container"}
    ]
}

@router.get("/stats")
async def get_community_stats():
    return TELEMETRY_STATS

@router.post("/join", status_code=201)
async def join_community(payload: CommunityJoinRequest):
    member_data = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "github": payload.github or "",
        "interest": payload.interest or "Open Source Pods",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    saved = member_data
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("community_members").insert(member_data).execute()
            if res.data and len(res.data) > 0:
                saved = res.data[0]
        except Exception:
            pass

    if saved is member_data:
        memory_members.append(member_data)

    try:
        notify_community_join(saved)
    except Exception:
        pass

    return {
        "status": "success",
        "message": f"Welcome to The Code Vibe network, {payload.name}!",
        "member": saved
    }

@router.get("/members")
async def get_community_members():
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("community_members").select("*").limit(20).execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception:
            pass

    return memory_members
