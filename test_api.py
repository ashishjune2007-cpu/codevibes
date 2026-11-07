import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
venv_site = os.path.join(backend_dir, "venv", "Lib", "site-packages")
if os.path.exists(venv_site) and venv_site not in sys.path:
    sys.path.insert(0, venv_site)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault("ADMIN_PASSWORD", "test-only-password")
from routers import applications, events, community, auth
from config import settings
from models import (
    ApplicationCreate, ApplicationStatusUpdate, EventRSVPCreate, CommunityJoinRequest,
    LoginRequest, EventCreate, EventUpdate, UserProfileUpdate
)

def run_step(coro):
    try:
        coro.send(None)
    except StopIteration as e:
        return e.value

def run_all_tests():
    print("1. Testing auth.login()...")
    # Test Admin Login
    admin_res = run_step(auth.login(LoginRequest(email="admin@thecodevibe.io", password=settings.ADMIN_PASSWORD, role="admin")))
    print(f"[OK] Admin logged in: {admin_res['user']['name']} ({admin_res['user']['role']})")
    assert admin_res["user"]["role"] == "admin"

    # Test Member Login
    member_res = run_step(auth.login(LoginRequest(email="builder@thecodevibe.io", password="builder123", role="member")))
    print(f"[OK] Member logged in: {member_res['user']['name']} ({member_res['user']['role']})")
    assert member_res["user"]["role"] == "member"

    # Test Update Profile (Edit Name & WhatsApp number)
    updated_profile = run_step(auth.update_profile(UserProfileUpdate(
        email="builder@thecodevibe.io",
        name="Devin Vance (@dvance_pro)",
        whatsapp="+1 (555) 777-8899"
    )))
    print(f"[OK] Profile updated: {updated_profile['user']['name']}, WhatsApp: {updated_profile['user']['whatsapp']}")
    assert updated_profile["user"]["name"] == "Devin Vance (@dvance_pro)"
    assert updated_profile["user"]["whatsapp"] == "+1 (555) 777-8899"

    print("\n2. Testing applications.get_applications()...")
    apps = run_step(applications.get_applications())
    print(f"[OK] Retrieved {len(apps)} applications.")
    assert len(apps) >= 4

    print("\n3. Testing applications.submit_application()...")
    new_app = run_step(applications.submit_application(ApplicationCreate(
        name="Alex Miller",
        fullName="Alex Miller",
        handle="@amiller",
        email="alex@miller.systems",
        github="https://github.com/amiller",
        discord="amiller#9988",
        portfolio="https://alexmiller.dev",
        pod="DevPulse Telemetry",
        role="Backend / Systems Engineer",
        experience="Senior Engineer (5 - 8 years)",
        location="Seattle, WA (PST)",
        skills=["Rust", "eBPF", "Go", "Docker"],
        goals=["Join an active open-source project pod", "Pair programming & live code reviews"],
        availability="10 - 20 hours / week",
        commitment="10 - 20 hours / week",
        communicationPref="Async-first (GitHub Issues, PRs, Discord chat)",
        bio="Kernel tracing expert with extensive experience building zero-allocation network daemons.",
        pitch="Kernel tracing expert with extensive experience building zero-allocation network daemons.",
        featuredWork="https://github.com/amiller/fast-bpf"
    )))
    print(f"[OK] Submitted application: {new_app['id']} (status: {new_app['status']})")
    assert new_app["discord"] == "amiller#9988"
    assert new_app["portfolio"] == "https://alexmiller.dev"
    assert "Rust" in new_app["skills"]
    assert new_app["location"] == "Seattle, WA (PST)"

    print("\n4. Testing applications.update_application_status()...")
    updated = run_step(applications.update_application_status(new_app['id'], ApplicationStatusUpdate(status="Accepted")))
    print(f"[OK] Status updated to: {updated['status']}")
    assert updated['status'] == "Accepted"

    print("\n5. Testing events.get_events()...")
    evs = run_step(events.get_events())
    print(f"[OK] Retrieved {len(evs)} events.")
    assert len(evs) >= 4

    print("\n6. Testing events admin actions: create, toggle registration, update capacity & count...")
    # Admin Create Event
    created_ev = run_step(events.create_event(EventCreate(
        title="Autonomous Kernel Sandboxing Workshop",
        date="Dec 28, 2025",
        time="4:00 PM – 7:00 PM PST",
        category="Workshop",
        location="Online / Discord Stage",
        description="Hands-on memory safety and eBPF kernel sandboxing session.",
        capacity=150,
        registration_open=True
    )))
    print(f"[OK] Event created: {created_ev['id']} (capacity: {created_ev['capacity']})")

    # Toggle Registration to CLOSED
    toggled = run_step(events.toggle_event_registration(created_ev["id"]))
    print(f"[OK] Registration toggled: {toggled['message']}")
    assert toggled["registration_open"] is False

    # Toggle Registration back to OPEN
    toggled_back = run_step(events.toggle_event_registration(created_ev["id"]))
    print(f"[OK] Registration toggled back: {toggled_back['message']}")
    assert toggled_back["registration_open"] is True

    # Admin Updates Attendees count and Capacity
    updated_ev = run_step(events.update_event(created_ev["id"], EventUpdate(attendees=25, capacity=200)))
    print(f"[OK] Event attendees updated to {updated_ev['attendees']} / {updated_ev['capacity']}")
    assert updated_ev["attendees"] == 25
    assert updated_ev["capacity"] == 200

    # Delete test event
    run_step(events.delete_event(created_ev["id"]))
    print(f"[OK] Cleaned up test event: {created_ev['id']}")

    print("\n7. Testing rsvp_event()...")
    rsvp_res = run_step(events.rsvp_event("wasm-memory-safety", EventRSVPCreate(
        name="Elena Miller",
        email="elena@example.com",
        role="Rust Core Dev"
    )))
    print(f"[OK] RSVP response: {rsvp_res['status']}")

    print("\n8. Testing community.join_community()...")
    join_res = run_step(community.join_community(CommunityJoinRequest(
        name="Taylor Swift",
        email="taylor@example.com",
        github="https://github.com/taylorswift",
        interest="Open Source Pods"
    )))
    print(f"[OK] Community response: {join_res['message']}")

    print("\nALL 8 BACKEND AUTH & EVENT ADMIN TEST CASES PASSED PERFECTLY!")

if __name__ == "__main__":
    run_all_tests()
