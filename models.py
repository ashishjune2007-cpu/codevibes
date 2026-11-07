from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# ----------------- AUTHENTICATION -----------------
class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "member"  # "admin" or "member"

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "member"

class UserProfileUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    whatsapp: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    avatar: Optional[str] = ""
    whatsapp: Optional[str] = ""
    token: Optional[str] = ""

# ----------------- APPLICATIONS -----------------
class ApplicationCreate(BaseModel):
    project_id: Optional[str] = "DevPulse Telemetry"
    pod: Optional[str] = "DevPulse Telemetry"
    role: str
    name: Optional[str] = "Anonymous Contributor"
    fullName: Optional[str] = None
    handle: Optional[str] = ""
    email: Optional[str] = ""
    github: Optional[str] = ""
    discord: Optional[str] = ""
    portfolio: Optional[str] = ""
    experience: Optional[str] = ""
    location: Optional[str] = ""
    skills: Optional[List[str]] = []
    goals: Optional[List[str]] = []
    availability: Optional[str] = ""
    commitment: Optional[str] = ""
    communicationPref: Optional[str] = ""
    bio: Optional[str] = ""
    pitch: Optional[str] = ""
    featuredWork: Optional[str] = ""

class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., description="Status e.g. Accepted, Rejected, Under Review, Pending")

class ApplicationResponse(BaseModel):
    id: str
    name: str
    fullName: Optional[str] = None
    pod: str
    role: str
    time: str
    status: str
    statusColor: Optional[str] = None
    github: Optional[str] = ""
    discord: Optional[str] = ""
    email: Optional[str] = ""
    portfolio: Optional[str] = ""
    experience: Optional[str] = ""
    location: Optional[str] = ""
    skills: Optional[List[str]] = []
    goals: Optional[List[str]] = []
    availability: Optional[str] = ""
    commitment: Optional[str] = ""
    communicationPref: Optional[str] = ""
    bio: Optional[str] = ""
    pitch: Optional[str] = ""
    featuredWork: Optional[str] = ""
    created_at: Optional[str] = None

# ----------------- EVENTS -----------------
class EventSpeaker(BaseModel):
    name: str
    role: str
    avatar: Optional[str] = ""

class EventRSVPCreate(BaseModel):
    name: str
    email: str
    role: Optional[str] = "Developer"
    interest: Optional[str] = ""
    answers: Optional[Dict[str, Any]] = {}

class EventCreate(BaseModel):
    title: str
    date: str
    time: Optional[str] = "6:00 PM – 8:00 PM PST"
    category: Optional[str] = "Workshop"
    categoryLabel: Optional[str] = "Interactive Workshop"
    status: Optional[str] = "Online • Discord Live"
    location: Optional[str] = "Online / Global"
    badge: Optional[str] = "Upcoming"
    badgeColor: Optional[str] = "primary"
    description: str
    image: Optional[str] = ""
    capacity: Optional[int] = 100
    attendees: Optional[int] = 0
    registration_open: Optional[bool] = True
    speakers: Optional[List[Any]] = []
    agenda: Optional[List[Any]] = []
    prerequisites: Optional[List[Any]] = []
    rules: Optional[List[Any]] = []
    registration_fields: Optional[List[Dict[str, Any]]] = []

class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    category: Optional[str] = None
    categoryLabel: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    badge: Optional[str] = None
    badgeColor: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    capacity: Optional[int] = None
    attendees: Optional[int] = None
    registration_open: Optional[bool] = None
    is_past: Optional[bool] = None
    speakers: Optional[List[Any]] = None
    agenda: Optional[List[Any]] = None
    prerequisites: Optional[List[Any]] = None
    rules: Optional[List[Any]] = None
    registration_fields: Optional[List[Dict[str, Any]]] = None

class EventResponse(BaseModel):
    id: str
    title: str
    date: str
    time: Optional[str] = ""
    category: str
    location: Optional[str] = "Online / Global"
    badge: Optional[str] = "Upcoming"
    badgeColor: Optional[str] = "primary"
    description: str
    image: Optional[str] = ""
    attendees: Optional[int] = 0
    capacity: Optional[int] = 500
    registration_open: Optional[bool] = True
    speakers: Optional[List[EventSpeaker]] = []
    agenda: Optional[List[Dict[str, Any]]] = []
    is_past: bool = False

# ----------------- COMMUNITY -----------------
class CommunityJoinRequest(BaseModel):
    name: str
    email: str
    github: Optional[str] = ""
    interest: Optional[str] = "Open Source Pods"

class PlatformStat(BaseModel):
    value: str
    label: str
    color: Optional[str] = "text-primary"

class TelemetryMetric(BaseModel):
    label: str
    value: str
    icon: str
    iconColor: str
