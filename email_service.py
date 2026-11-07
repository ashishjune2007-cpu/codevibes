"""
Simple email notification helper for form submissions.
Uses standard library (smtplib + email) — no extra packages required.
Configure SMTP settings in backend/.env to enable real emails.
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any

from config import settings

logger = logging.getLogger(__name__)


def is_email_configured() -> bool:
    return bool(
        settings.SMTP_HOST
        and settings.SMTP_USER
        and settings.SMTP_PASSWORD
        and settings.NOTIFY_EMAIL
    )


def _build_application_html(app: Dict[str, Any]) -> str:
    skills = ", ".join(app.get("skills") or []) or "—"
    goals = ", ".join(app.get("goals") or []) or "—"
    bio = (app.get("bio") or app.get("pitch") or "—").replace("\n", "<br>")
    featured = (app.get("featuredWork") or "—").replace("\n", "<br>")

    return f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1a1a2e;">
      <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 8px; color: #0056c5;">🚀 New Collaborator Application</h2>
        <p style="margin: 0 0 20px; color: #555;">Someone just submitted the Collaborate form on The Code Vibe.</p>

        <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 12px; overflow: hidden;">
          <tr><td style="padding: 10px 16px; font-weight: 600; width: 160px;">Application ID</td><td style="padding: 10px 16px;">{app.get("id", "—")}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Name</td><td style="padding: 10px 16px;">{app.get("fullName") or app.get("name") or "—"}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Email</td><td style="padding: 10px 16px;"><a href="mailto:{app.get("email", "")}">{app.get("email") or "—"}</a></td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">GitHub</td><td style="padding: 10px 16px;">{app.get("github") or "—"}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Discord</td><td style="padding: 10px 16px;">{app.get("discord") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Portfolio</td><td style="padding: 10px 16px;">{app.get("portfolio") or "—"}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Role</td><td style="padding: 10px 16px;">{app.get("role") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Experience</td><td style="padding: 10px 16px;">{app.get("experience") or "—"}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Location</td><td style="padding: 10px 16px;">{app.get("location") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Skills</td><td style="padding: 10px 16px;">{skills}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Goals</td><td style="padding: 10px 16px;">{goals}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Availability</td><td style="padding: 10px 16px;">{app.get("availability") or app.get("commitment") or "—"}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Communication</td><td style="padding: 10px 16px;">{app.get("communicationPref") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Bio / Pitch</td><td style="padding: 10px 16px;">{bio}</td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">Featured Work</td><td style="padding: 10px 16px;">{featured}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Submitted</td><td style="padding: 10px 16px;">{app.get("created_at") or "Just now"}</td></tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 13px; color: #888;">
          Open the Admin Portal to accept / reject this application.
        </p>
      </div>
    </body>
    </html>
    """


def _build_community_html(member: Dict[str, Any]) -> str:
    return f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1a1a2e;">
      <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 8px; color: #0056c5;">👋 New Community Join Request</h2>
        <p style="margin: 0 0 20px; color: #555;">Someone joined via the Join Community modal.</p>
        <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 12px;">
          <tr><td style="padding: 10px 16px; font-weight: 600; width: 120px;">Name</td><td style="padding: 10px 16px;">{member.get("name") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Email</td><td style="padding: 10px 16px;"><a href="mailto:{member.get("email", "")}">{member.get("email") or "—"}</a></td></tr>
          <tr><td style="padding: 10px 16px; font-weight: 600;">GitHub</td><td style="padding: 10px 16px;">{member.get("github") or "—"}</td></tr>
          <tr style="background:#fff;"><td style="padding: 10px 16px; font-weight: 600;">Interest</td><td style="padding: 10px 16px;">{member.get("interest") or "—"}</td></tr>
        </table>
      </div>
    </body>
    </html>
    """


def send_email(
    subject: str,
    html_body: str,
    to_email: Optional[str] = None,
    reply_to: Optional[str] = None,
) -> bool:
    """
    Send an HTML email. Returns True on success, False if not configured or on error.
    Does not raise — form submission should still succeed even if email fails.
    """
    if not is_email_configured():
        logger.info(
            "Email not configured (set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL in .env). Skipping send."
        )
        return False

    recipient = to_email or settings.NOTIFY_EMAIL
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
        msg["To"] = recipient
        if reply_to:
            msg["Reply-To"] = reply_to

        msg.attach(MIMEText(html_body, "html", "utf-8"))

        port = settings.SMTP_PORT
        use_ssl = port == 465

        if use_ssl:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, port, timeout=20) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, port, timeout=20) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)

        logger.info("Notification email sent to %s", recipient)
        return True
    except Exception as exc:
        logger.warning("Failed to send notification email: %s", exc)
        return False


def notify_new_application(app: Dict[str, Any]) -> bool:
    name = app.get("fullName") or app.get("name") or "Someone"
    subject = f"[Code Vibe] New application from {name}"
    html = _build_application_html(app)
    reply = app.get("email") or None
    return send_email(subject=subject, html_body=html, reply_to=reply)


def notify_community_join(member: Dict[str, Any]) -> bool:
    name = member.get("name") or "Someone"
    subject = f"[Code Vibe] New community join — {name}"
    html = _build_community_html(member)
    reply = member.get("email") or None
    return send_email(subject=subject, html_body=html, reply_to=reply)
