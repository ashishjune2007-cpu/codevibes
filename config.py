import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "").strip()
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    # Dedicated admin credentials must be configured as server-side environment variables.
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@thecodevibe.io").strip().lower()
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "").strip()
    
    _raw_cors = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    )
    CORS_ORIGINS: List[str] = [origin.strip() for origin in _raw_cors.split(",") if origin.strip()]

    # --- Email notifications (form submissions) ---
    # Where form submissions should be delivered
    NOTIFY_EMAIL: str = os.getenv("NOTIFY_EMAIL", "").strip()
    # SMTP credentials (Gmail, Outlook, custom, etc.)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "").strip()
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "").strip()
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "").strip()
    # Optional "From" display address (defaults to SMTP_USER)
    SMTP_FROM: str = os.getenv("SMTP_FROM", "").strip()

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY and "your-project" not in self.SUPABASE_URL)

    @property
    def is_email_configured(self) -> bool:
        return bool(self.SMTP_HOST and self.SMTP_USER and self.SMTP_PASSWORD and self.NOTIFY_EMAIL)

settings = Settings()
