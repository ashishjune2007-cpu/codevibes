-- ==============================================================================
-- THE CODE VIBE PLATFORM - SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- ==============================================================================
-- Run this script in your Supabase Project:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. APPLICATIONS TABLE (Intake & Admin Review Queue)
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pod TEXT NOT NULL,
    role TEXT NOT NULL,
    time TEXT DEFAULT 'Just now',
    status TEXT NOT NULL DEFAULT 'Under Review',
    github TEXT,
    email TEXT,
    commitment TEXT,
    pitch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_pod ON public.applications(pod);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    category TEXT NOT NULL,
    location TEXT DEFAULT 'Online / Discord Stage',
    badge TEXT DEFAULT 'Upcoming',
    badge_color TEXT DEFAULT 'primary',
    description TEXT NOT NULL,
    image TEXT,
    attendees INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 100,
    speakers JSONB DEFAULT '[]'::jsonb,
    agenda JSONB DEFAULT '[]'::jsonb,
    registration_fields JSONB DEFAULT '[]'::jsonb,
    registration_open BOOLEAN DEFAULT TRUE,
    is_past BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_is_past ON public.events(is_past);

-- 4. EVENT RSVPs TABLE
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'Builder',
    interest TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMMUNITY MEMBERS TABLE (Onboarding Cohorts)
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    github TEXT,
    interest TEXT DEFAULT 'Open Source Pods',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to atomically increment attendees count on RSVP
CREATE OR REPLACE FUNCTION public.increment_event_attendees(row_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events
    SET attendees = attendees + 1
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Applications" ON public.applications;
CREATE POLICY "Public Read Applications" ON public.applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Applications" ON public.applications;
CREATE POLICY "Public Insert Applications" ON public.applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Applications" ON public.applications;
CREATE POLICY "Public Update Applications" ON public.applications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Applications" ON public.applications;
CREATE POLICY "Public Delete Applications" ON public.applications FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public Insert RSVPs" ON public.event_rsvps;
CREATE POLICY "Public Insert RSVPs" ON public.event_rsvps FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Members" ON public.community_members;
CREATE POLICY "Public Insert Members" ON public.community_members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Members" ON public.community_members;
CREATE POLICY "Public Read Members" ON public.community_members FOR SELECT USING (true);

-- 6. INITIAL SEED DATA
INSERT INTO public.applications (id, name, pod, role, time, status, github, email, commitment, pitch)
VALUES
(
    'APP-8941',
    'Julian Vance (@jvance)',
    'DevPulse Telemetry',
    'eBPF Systems Engineer',
    '12m ago',
    'Under Review',
    'https://github.com/jvance',
    'jvance@devpulse.io',
    '8 hrs/wk',
    'Extensive experience with Linux kernel tracing, libbpf, and writing custom ring buffers.'
),
(
    'APP-8940',
    'Maya Patel (@mpatel)',
    'NeuroFlow AI Studio',
    'Frontend Performance Specialist',
    '1h ago',
    'Pending',
    'https://github.com/mpatel',
    'maya@flowstudio.ai',
    '10 hrs/wk',
    'Specializing in WebGL/WebGPU shaders, canvas virtualized node graphs, and low-latency UI.'
),
(
    'APP-8939',
    'Kenji Sato (@ksato)',
    'CloudMesh Engine',
    'Backend Go Engineer',
    '3h ago',
    'Accepted',
    'https://github.com/ksato',
    'kenji@meshcloud.org',
    '6 hrs/wk',
    'Core contributor to open source Kubernetes operators and high performance gRPC streaming.'
),
(
    'APP-8938',
    'Sarah Lindqvist (@slind)',
    'OmniAnchor Oracle',
    'Smart Contract Auditor',
    '5h ago',
    'Accepted',
    'https://github.com/slind',
    'sarah@auditsec.io',
    '8 hrs/wk',
    'Audited 15+ EVM and Rust contracts with zero post-deployment exploit reports.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.events (id, title, date, time, category, location, badge, badge_color, description, image, attendees, capacity, is_past)
VALUES
(
    'wasm-memory-safety',
    'Deep Dive: WebAssembly, Memory Safety & Sandboxing',
    'Nov 28, 2025',
    '6:00 PM – 8:30 PM PST',
    'Workshop',
    'Online / Discord Stage',
    'Upcoming Masterclass',
    'primary',
    'Architecting untrusted edge execution environments with Wasmtime and Rust. Dive into isolated memory linear address spaces, host call boundaries, and zero-overhead sandbox orchestration.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    84,
    120,
    FALSE
),
(
    'full-stack-vector-search',
    'Full-Stack Vector Search with Postgres & pgvector',
    'Dec 2, 2025',
    '10:00 AM – 1:00 PM PST',
    'Workshop',
    'Online / Zoom Live',
    'Hands-on',
    'secondary',
    'Architecting scalable semantic retrieval pipelines directly in PostgreSQL with HNSW indexing and Supabase.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    142,
    200,
    FALSE
),
(
    'building-high-throughput-microservices-go',
    'Building High-Throughput Microservices in Go',
    'Dec 8, 2025',
    '6:00 PM – 8:30 PM PST',
    'Tech Talk',
    'Online / Discord Stage',
    'Knowledge',
    'tertiary',
    'Deconstructing zero-allocation serialization, lock-free concurrency rings, and 500k RPS loads.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    210,
    300,
    FALSE
),
(
    'open-source-ai-sprint',
    'Open Source AI Sprint: Fine-Tuning LLMs',
    'Dec 14–15, 2025',
    '36 Hours Continuous',
    'Hackathon',
    'Hybrid (San Francisco & Online)',
    'Competition',
    'primary',
    'Fine-tune open-weights models (Llama 3, Mistral) for niche dev tools with cloud GPU grants.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    380,
    500,
    FALSE
),
(
    'ebpf-internals',
    'eBPF Internals & Zero-Downtime Microservices',
    'Oct 24, 2025',
    '1h 45m recording',
    'Tech Talk',
    'Recorded',
    'Past Session',
    'surface',
    'Kernel tracing, dynamic network probes, and custom security sandboxing without kernel module compilation.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    340,
    500,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Event registration form support (safe to run on existing databases)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.event_rsvps ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;
