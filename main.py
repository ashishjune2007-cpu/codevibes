import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))

# Support both Windows and Unix virtualenv layouts if present
for candidate in (
    os.path.join(backend_dir, "venv", "Lib", "site-packages"),          # Windows
    os.path.join(backend_dir, "venv", "lib", "python3.12", "site-packages"),
    os.path.join(backend_dir, "venv", "lib", "python3.11", "site-packages"),
    os.path.join(backend_dir, "venv", "lib", "python3.10", "site-packages"),
):
    if os.path.isdir(candidate) and candidate not in sys.path:
        sys.path.insert(0, candidate)

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import get_supabase
from routers import applications, events, community, auth

app = FastAPI(
    title="Code Vibes API",
    description="Python FastAPI & Supabase backend for The Code Vibe platform",
    version="1.0.0"
)

# CORS: configured origins + local frontends + any *.netlify.app
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
origins = list(dict.fromkeys((settings.CORS_ORIGINS or []) + default_origins))

# If user set CORS_ORIGINS=* allow all (handy for first deploy)
allow_all = "*" in origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(events.router)
app.include_router(community.router)

@app.get("/")
async def root():
    return {
        "name": "The Code Vibe API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "supabase_connected": settings.is_supabase_configured
    }

@app.get("/api/health")
async def health_check():
    supabase_ready = False
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table("events").select("id", count="exact").limit(1).execute()
            supabase_ready = True
        except Exception:
            supabase_ready = False

    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "supabase": {
            "configured": settings.is_supabase_configured,
            "connected": supabase_ready,
            "mode": "supabase_cloud" if settings.is_supabase_configured else "in_memory_fallback"
        },
        "email_notifications": {
            "configured": settings.is_email_configured,
            "notify_email": settings.NOTIFY_EMAIL if settings.is_email_configured else None
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
