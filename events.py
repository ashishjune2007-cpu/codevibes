from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
import re
from datetime import datetime, timezone

from models import EventResponse, EventRSVPCreate, EventCreate, EventUpdate
from database import get_supabase, memory_events, memory_rsvps

router = APIRouter(prefix="/api/events", tags=["Events"])

def slugify(text: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', cleaned)

@router.get("", response_model=List[dict])
async def get_events(
    category: Optional[str] = Query(None, description="Category filter (e.g. workshop, talk, hackathon)"),
    is_past: Optional[bool] = Query(None, description="Filter for past vs upcoming events")
):
    cat_str = category if isinstance(category, str) else None
    past_bool = is_past if isinstance(is_past, bool) else None

    supabase = get_supabase()
    if supabase:
        try:
            query = supabase.table("events").select("*")
            if past_bool is not None:
                query = query.eq("is_past", past_bool)
            if cat_str and cat_str.lower() != "all":
                query = query.ilike("category", f"%{cat_str}%")
            res = query.execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception:
            pass

    results = list(memory_events)
    if past_bool is not None:
        results = [e for e in results if e.get("is_past") == past_bool]
    if cat_str and cat_str.lower() != "all":
        results = [e for e in results if cat_str.lower() in e.get("category", "").lower()]
    return results

@router.get("/{event_id}")
async def get_event(event_id: str):
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("events").select("*").eq("id", event_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

    for e in memory_events:
        if e["id"].lower() == event_id.lower():
            return e

    for e in memory_events:
        if "wasm" in e["id"].lower() or "wasm" in event_id.lower():
            return e

    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found")

@router.post("", response_model=dict, status_code=201)
async def create_event(payload: EventCreate):
    event_id = slugify(payload.title) or f"event-{uuid.uuid4().hex[:8]}"

    # Ensure unique ID
    for e in memory_events:
        if e["id"] == event_id:
            event_id = f"{event_id}-{uuid.uuid4().hex[:4]}"
            break

    new_event = {
        "id": event_id,
        "title": payload.title,
        "date": payload.date,
        "time": payload.time or "6:00 PM – 8:00 PM PST",
        "category": payload.category or "Workshop",
        "categoryLabel": payload.categoryLabel or (payload.category or "Interactive Workshop"),
        "status": payload.status or "Online • Discord Live",
        "location": payload.location or "Online / Discord Stage",
        "badge": payload.badge or "Upcoming",
        "badgeColor": payload.badgeColor or "primary",
        "description": payload.description,
        "image": payload.image or "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        "attendees": payload.attendees or 0,
        "capacity": payload.capacity or 100,
        "registration_open": True if payload.registration_open is None else payload.registration_open,
        "speakers": payload.speakers or [],
        "agenda": payload.agenda or [],
        "prerequisites": payload.prerequisites or [],
        "rules": payload.rules or [],
        "registration_fields": payload.registration_fields or [],
        "is_past": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("events").insert(new_event).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

    memory_events.insert(0, new_event)
    return new_event

@router.patch("/{event_id}", response_model=dict)
async def update_event(event_id: str, payload: EventUpdate):
    updates = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("events").update(updates).eq("id", event_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

    for e in memory_events:
        if e["id"].lower() == event_id.lower():
            for k, v in updates.items():
                e[k] = v
            return e

    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found")

@router.patch("/{event_id}/toggle-registration", response_model=dict)
async def toggle_event_registration(event_id: str):
    for e in memory_events:
        if e["id"].lower() == event_id.lower():
            current_status = e.get("registration_open", True)
            new_status = not current_status
            e["registration_open"] = new_status
            
            supabase = get_supabase()
            if supabase:
                try:
                    supabase.table("events").update({"registration_open": new_status}).eq("id", event_id).execute()
                except Exception:
                    pass
            
            return {
                "id": event_id,
                "registration_open": new_status,
                "message": f"Registration is now {'OPEN' if new_status else 'CLOSED'}"
            }

    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found")

@router.delete("/{event_id}", status_code=204)
async def delete_event(event_id: str):
    supabase = get_supabase()
    if supabase:
        try:
            supabase.table("events").delete().eq("id", event_id).execute()
            return
        except Exception:
            pass

    global memory_events
    for idx, e in enumerate(memory_events):
        if e["id"].lower() == event_id.lower():
            memory_events.pop(idx)
            return

    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found")

@router.get("/{event_id}/rsvps")
async def get_event_rsvps(event_id: str):
    """Return registrations for an event for the admin dashboard."""
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("event_rsvps").select("*").eq("event_id", event_id).order("created_at", desc=True).execute()
            return res.data or []
        except Exception:
            pass
    return sorted([r for r in memory_rsvps if r.get("event_id") == event_id], key=lambda r: r.get("created_at", ""), reverse=True)

@router.post("/{event_id}/rsvp", status_code=201)
async def rsvp_event(event_id: str, payload: EventRSVPCreate):
    # Verify event and registration status
    target_event = None
    for e in memory_events:
        if e["id"].lower() == event_id.lower() or "wasm" in e["id"].lower():
            target_event = e
            break

    if target_event:
        if target_event.get("registration_open") is False:
            raise HTTPException(status_code=400, detail="Registration for this event has been closed by the event operator.")
        
        attendees = target_event.get("attendees", 0)
        capacity = target_event.get("capacity", 100)
        if attendees >= capacity:
            raise HTTPException(status_code=400, detail="This session is currently at full capacity.")

    rsvp_data = {
        "event_id": event_id,
        "name": payload.name,
        "email": payload.email,
        "role": payload.role or "Builder",
        "interest": payload.interest or "",
        "answers": payload.answers or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("event_rsvps").insert(rsvp_data).execute()
            supabase.rpc("increment_event_attendees", {"row_id": event_id}).execute()
            return {"status": "success", "message": "RSVP confirmed via Supabase", "data": rsvp_data}
        except Exception:
            pass

    memory_rsvps.append(rsvp_data)
    if target_event:
        target_event["attendees"] = (target_event.get("attendees") or 0) + 1

    return {
        "status": "success",
        "message": "RSVP confirmed! Spot reserved for " + payload.name,
        "data": rsvp_data
    }
