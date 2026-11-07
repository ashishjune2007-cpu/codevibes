from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import random
from datetime import datetime, timezone

from models import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from database import get_supabase, memory_applications
from email_service import notify_new_application

router = APIRouter(prefix="/api/applications", tags=["Applications"])

STATUS_COLORS = {
    "Accepted": "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300",
    "Under Review": "bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-primary",
    "Pending": "bg-surface-container border border-outline-variant text-on-surface-variant",
    "Rejected": "bg-rose-500/10 border border-rose-500/40 text-rose-400"
}

@router.get("", response_model=List[dict])
async def get_applications(
    status: Optional[str] = Query(None, description="Filter by status (e.g. Accepted, Under Review, Pending)"),
    pod: Optional[str] = Query(None, description="Filter by project pod")
):
    status_str = status if isinstance(status, str) else None
    pod_str = pod if isinstance(pod, str) else None

    supabase = get_supabase()
    if supabase:
        try:
            query = supabase.table("applications").select("*").order("created_at", desc=True)
            if status_str and status_str.lower() != "all":
                query = query.eq("status", status_str)
            if pod_str:
                query = query.ilike("pod", f"%{pod_str}%")
            res = query.execute()
            if res.data and len(res.data) > 0:
                for app in res.data:
                    app["statusColor"] = STATUS_COLORS.get(app.get("status"), STATUS_COLORS["Pending"])
                return res.data
        except Exception:
            pass

    apps = list(memory_applications)
    if status_str and status_str.lower() != "all":
        apps = [a for a in apps if a.get("status", "").lower() == status_str.lower()]
    if pod_str:
        apps = [a for a in apps if pod_str.lower() in a.get("pod", "").lower()]
    return apps

@router.post("", response_model=dict, status_code=201)
async def submit_application(payload: ApplicationCreate):
    random_num = random.randint(1000, 9999)
    app_id = f"APP-{random_num}"
    
    display_name = payload.fullName or payload.name or "Anonymous Builder"
    handle = payload.handle or (f"@{payload.github.replace('https://github.com/', '').strip('/')}" if payload.github else "@contributor")
    formatted_name = f"{display_name} ({handle})" if not display_name.endswith(")") else display_name

    availability_str = payload.availability or (f"{payload.commitment} hrs/wk" if payload.commitment else "5 - 10 hours / week")

    app_data = {
        "id": app_id,
        "name": formatted_name,
        "fullName": display_name,
        "pod": payload.pod or payload.project_id or "General Intake",
        "role": payload.role or "Full Stack Developer",
        "time": "Just now",
        "status": "Under Review",
        "statusColor": STATUS_COLORS["Under Review"],
        "email": payload.email or "",
        "github": payload.github or "",
        "discord": payload.discord or "",
        "portfolio": payload.portfolio or "",
        "experience": payload.experience or "Mid-Level Engineer (3 - 5 years)",
        "location": payload.location or "Global / Remote",
        "skills": payload.skills or ["Full Stack", "TypeScript"],
        "goals": payload.goals or ["Join an active open-source project pod"],
        "availability": availability_str,
        "commitment": availability_str,
        "communicationPref": payload.communicationPref or "Async-first",
        "bio": payload.bio or payload.pitch or "",
        "pitch": payload.pitch or payload.bio or "",
        "featuredWork": payload.featuredWork or "",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    # Persist first, then notify (email failure must not block the submission)
    created = None
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("applications").insert(app_data).execute()
            if res.data and len(res.data) > 0:
                created = res.data[0]
                created["statusColor"] = STATUS_COLORS.get(created.get("status"), STATUS_COLORS["Under Review"])
        except Exception:
            pass

    if created is None:
        memory_applications.insert(0, app_data)
        created = app_data

    # Report the actual notification result. Previously this endpoint returned a
    # successful response even when SMTP was not configured or delivery failed,
    # which prevented the Netlify frontend from trying its email fallback.
    email_sent = False
    try:
        email_sent = bool(notify_new_application(created))
    except Exception:
        email_sent = False

    created["email_sent"] = email_sent
    return created

@router.patch("/{app_id}/status", response_model=dict)
async def update_application_status(app_id: str, payload: ApplicationStatusUpdate):
    status = payload.status
    color = STATUS_COLORS.get(status, STATUS_COLORS["Pending"])

    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("applications").update({"status": status}).eq("id", app_id).execute()
            if res.data and len(res.data) > 0:
                updated = res.data[0]
                updated["statusColor"] = color
                return updated
        except Exception:
            pass

    for app in memory_applications:
        if app["id"] == app_id:
            app["status"] = status
            app["statusColor"] = color
            return app

    raise HTTPException(status_code=404, detail=f"Application '{app_id}' not found")

@router.delete("/{app_id}", status_code=204)
async def delete_application(app_id: str):
    supabase = get_supabase()
    if supabase:
        try:
            supabase.table("applications").delete().eq("id", app_id).execute()
            return
        except Exception:
            pass

    global memory_applications
    for idx, app in enumerate(memory_applications):
        if app["id"] == app_id:
            memory_applications.pop(idx)
            return

    raise HTTPException(status_code=404, detail=f"Application '{app_id}' not found")
