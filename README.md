# ⚡ The Code Vibe Platform — Electric Glass & Precision Syntax

**Auth:** Firebase Authentication (Email/Password + Google) → profiles in **Firestore `users`**.  
See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for console steps. Without Firebase env keys, local demo mode still works for UI testing.

---

## 🔗 Frontend ↔ Backend connection (fixed)

| Layer | URL | Notes |
|-------|-----|--------|
| Frontend (Vite) | http://localhost:5173 | Proxies `/api/*` → backend |
| Backend (FastAPI) | http://localhost:8000 | Docs at `/docs`, health at `/api/health` |
| API base in browser | relative `/api` | Set by empty `VITE_API_BASE_URL` + Vite proxy |

**Demo accounts (in-memory mode, no Supabase required):**
- Member: `builder@thecodevibe.io` / `builder123`
- Admin: there is no shipped/default admin password. Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` on the backend host. The default admin email is `admin@thecodevibe.io`; choose and set your own private password.

---

## 🚀 Quick Start (both servers)

### Option A — helper scripts
```bash
# Unix / macOS / Git Bash
chmod +x start-dev.sh
./start-dev.sh

# Windows
start-dev.bat
```

### Option B — two terminals
```bash
# Terminal 1 — backend
cd backend
python -m pip install -r requirements.txt   # once
python main.py
# → http://localhost:8000  |  http://localhost:8000/docs

# Terminal 2 — frontend
cd frontend
npm install   # once
npm run dev
# → http://localhost:5173
```

From repo root you can also run:
```bash
npm run backend    # starts FastAPI
npm run dev        # starts Vite frontend
```

Optional Supabase: copy `backend/.env.example` → `backend/.env` and set `SUPABASE_URL` + `SUPABASE_KEY`. Without them the API runs fully in **in-memory fallback** with seeded events, applications, and demo users.

---

## 📁 Project Structure

```
Code-Vibes/
├── frontend/               # React + Vite
│   ├── src/services/api.js # All backend calls (proxy-aware)
│   ├── vite.config.js      # /api proxy → :8000
│   └── .env.example
├── backend/                # FastAPI + optional Supabase
│   ├── main.py
│   ├── routers/            # auth, events, applications, community
│   └── .env.example
├── start-dev.sh / .bat     # Run both servers
└── package.json            # Root workspace scripts
```

---

## 🎨 Design System: "Electric Glass & Precision Syntax"
- **Primary Colors**:
  - Vivid Cobalt Blue: `#2979FF` / `#0056c5` (Anchor for primary flows, active tabs, buttons)
  - Electric Cyan: `#00E5FF` (Real-time telemetry, WebSocket ping indicators, code accents)
  - Electric Violet: `#B324E5` / `#9700c6` (Administrative states, premium badges, gradient terminals)
  - Cyber Slate-Black: `#0B1120` / `#151b2b` (High-density contrast text)
- **Glass Translucency & Specular Tints**:
  - Glass Subtle: `rgba(255, 255, 255, 0.70)` + `backdrop-filter: blur(12px) saturate(140%)`
  - Glass Base: `rgba(255, 255, 255, 0.80)` + `backdrop-filter: blur(16px) saturate(160%)`
  - Glass Elevated: `rgba(255, 255, 255, 0.90)` + `backdrop-filter: blur(24px) saturate(180%)`
  - Glass Modal: `rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(40px) saturate(180%)`
- **Luminous Strokes & Edge Highlights**:
  - Specular Highlight Stroke: `rgba(255, 255, 255, 0.60)` top and left edges
  - Ambient Edge Stroke: `rgba(255, 255, 255, 0.20)` bottom and right edges
  - Structural Stroke: `rgba(194, 198, 215, 0.35)`
- **Multi-Stop Ambient Gradients**:
  - Hero Mesh Canvas: `radial-gradient(at 0% 0%, rgba(0, 229, 255, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(179, 36, 229, 0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(41, 121, 255, 0.10) 0px, transparent 60%)`
  - Core Action Linear: `linear-gradient(135deg, #00E5FF 0%, #2979FF 50%, #B324E5 100%)`
- **Typography**:
  - Display & Headings: `Space Grotesk` (600/700 weight, tight tracking)
  - Body & UI: `Inter` (400/500/600 weight, high legibility)
  - Code & Telemetry: `JetBrains Mono` (monospaced system chips, git tags, terminals)
- **Iconography**:
  - Google Material Symbols Outlined (`data_object`, `terminal`, `bolt`, `hub`, `code_blocks`, `lan`, etc.)

---

## 🗺️ Application Routes

| Path | Screen | Description |
| :--- | :--- | :--- |
| `/` | **Home Page** | Glassmorphism hero, stats strip, 4-card What We Do Bento grid, Featured Events carousel, Open Collaboration spotlight, community testimonials, and persistent CTA. |
| `/about` | **About Us** | Manifesto bento, Origin telemetry pill, What We Stand For 4-pillar breakdown, Community Leadership maintainers, interactive FAQ accordion, and onboarding footer. |
| `/events` | **Events & Workshops** | Protocol header, live search filter, timeframe dropdown, category pills, upcoming workshops grid, and collapsible past recorded sessions archive. |
| `/events/:eventId` | **Event Details** | Deep dive into `Rust for TypeScript Devs: WASM & Memory Safety`, interactive RSVP status toggle, calendar invite, share/bookmark toasts, host bio, syllabus timeline, and live attendee roster. |
| `/collaborate` | **Collaborate Pods** | Pod dispatch console, live telemetry counter, search & multi-tag tech stack filtering, Submit Project modal intake, and Bento project cards with maintainers and open roles. |
| `/projects/:projectId` | **Project Specs (DevPulse)** | Comprehensive system architecture breakdown for `DevPulse - Real-time Distributed Tracing Engine`, pipeline diagram, benchmark sparklines, sandbox terminals with copy actions, and Role Application modal. |
| `/admin` | **Admin Portal** | Operations dashboard for pod orchestration, live cluster telemetry, and applicant dispatch approval queue with glass data table hover states. |
| `*` | **404 Recovery** | Cyber-themed unmapped coordinate route handler with fast return actions. |

---

## 🧩 Reusable Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx          # Shell with Navbar, AtmosphereOrbs, Modal Context & Footer
│   │   ├── Navbar.jsx              # Frosted glass floating navigation with active status & mobile drawer
│   │   ├── Footer.jsx              # Cyber branding, operational ping, social SVGs & link matrix
│   │   └── AtmosphereOrbs.jsx      # Multi-layered ambient radiant backdrop
│   ├── ui/
│   │   ├── Button.jsx              # Gradient primary & frosted glass variants
│   │   ├── Badge.jsx               # Frosted telemetry chips & live status badges
│   │   ├── StatCard.jsx            # High-impact metric card with subtle borders
│   │   ├── SearchBar.jsx           # Glass text input with keyboard ⌘K shortcut listener
│   │   ├── TerminalBlock.jsx       # Frosted syntax viewport with traffic light dots & clipboard copy
│   │   ├── FaqAccordion.jsx        # Bento card FAQ item expand/collapse
│   │   ├── Toast.jsx               # Elevated glass telemetry toast notification
│   │   ├── FloatingNeonOrbs.jsx    # Interactive 3D floating neon glass orbs with mouse parallax
│   │   └── JoinCommunityModal.jsx  # Glass Tier 4 developer onboarding dialog
│   ├── collaborate/
│   │   ├── ProjectCard.jsx         # Bento project card with stack tags & open spots
│   │   ├── ApplyModal.jsx          # Glass Tier 4 role application submission
│   │   ├── SubmitProjectModal.jsx  # New project intake dispatch modal
│   │   └── ProjectSpecsModal.jsx   # Architecture quick-spec viewer dialog
│   └── events/
│       ├── EventCard.jsx           # Workshop banner card with category & time metadata
│       └── PastEventCard.jsx       # Archived session card with stream watch & slide links
├── data/
│   └── mockData.js                 # Complete authoritative datasets matching Stitch specs
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── EventsPage.jsx
│   ├── EventDetailsPage.jsx
│   ├── CollaboratePage.jsx
│   ├── ProjectSpecsPage.jsx
│   ├── AdminPortalPage.jsx
│   └── NotFoundPage.jsx
├── App.jsx                         # React Router route registry with ScrollToTop
├── index.css                       # Tailwind directives, frosted glass tiers, specular highlights
└── main.jsx                        # React root entrypoint
```

---

## 🛠️ Technology Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS 3** (configured with exact design tokens)
- **React Router 7**
- **Google Material Symbols & Google Fonts**


## Production deployment: connect the frontend to the API

The frontend is a static Vite app. In production, an empty `VITE_API_BASE_URL`
makes requests such as `/api/auth/login` go to the frontend host. The Netlify
SPA fallback can then return `index.html` (404/HTML), which is **not** the
FastAPI login endpoint. This causes the browser errors `404` and
`Unexpected token '<'`.

In Netlify, open **Site configuration → Environment variables** and add:

```ini
VITE_API_BASE_URL=https://YOUR-BACKEND-SERVICE.onrender.com
```

Replace the value with the actual public URL of your deployed FastAPI service
(no trailing slash). Trigger a **new frontend build/deploy** after setting it;
Vite environment variables are embedded at build time.

Verify the backend first by opening:

- `https://YOUR-BACKEND-SERVICE.onrender.com/api/health`
- `https://YOUR-BACKEND-SERVICE.onrender.com/docs`

The health endpoint should return JSON and `/docs` should show FastAPI docs.
Then configure the backend service environment variables:

```ini
ADMIN_EMAIL=admin@thecodevibe.io
ADMIN_PASSWORD=YOUR_OWN_PRIVATE_PASSWORD
CORS_ORIGINS=https://YOUR-FRONTEND-SITE.netlify.app
```

Use your real frontend domain in `CORS_ORIGINS`. Save and redeploy the backend.
Do not put `ADMIN_PASSWORD` in frontend variables, source code, or Git.

If you deploy somewhere other than Netlify/Render, the same rule applies:
`VITE_API_BASE_URL` must be the public base URL of the FastAPI backend.
