import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from config import settings

logger = logging.getLogger("uvicorn.error")

_supabase_client = None

def get_supabase():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.is_supabase_configured:
        try:
            from supabase import create_client
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info(" Connected to Supabase at %s", settings.SUPABASE_URL)
            return _supabase_client
        except Exception as e:
            logger.warning(" Could not initialize Supabase client: %s. Using in-memory fallback store.", e)
            return None
    else:
        logger.info("ℹ️ Supabase credentials not set in .env. Running with in-memory fallback store.")
        return None

# Initial in-memory seed data matching the frontend
INITIAL_APPLICATIONS = [
    {
        "id": "APP-8941",
        "name": "Julian Vance (@jvance)",
        "fullName": "Julian Vance",
        "pod": "DevPulse Telemetry",
        "role": "Backend / Systems Engineer",
        "time": "12m ago",
        "status": "Under Review",
        "statusColor": "bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-primary",
        "github": "https://github.com/jvance",
        "discord": "jvance#4412",
        "email": "jvance@devpulse.io",
        "portfolio": "https://jvance.dev",
        "experience": "Senior Engineer (5 - 8 years)",
        "location": "Berlin, Germany (CET)",
        "skills": ["Rust", "C++", "eBPF", "Linux Kernel", "Docker"],
        "goals": ["Join an active open-source project pod", "Lead my own project & recruit builders"],
        "availability": "10 - 20 hours / week (Dedicated Sprint)",
        "commitment": "10 - 20 hours / week",
        "communicationPref": "Async-first (GitHub Issues, PRs, Discord chat)",
        "bio": "Extensive experience with Linux kernel tracing, libbpf, and writing custom ring buffers in C and Rust for low-overhead production telemetry.",
        "pitch": "Extensive experience with Linux kernel tracing, libbpf, and writing custom ring buffers.",
        "featuredWork": "https://github.com/jvance/bpf-ringbuf-streamer (800+ stars)",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "APP-8940",
        "name": "Maya Patel (@mpatel)",
        "fullName": "Maya Patel",
        "pod": "NeuroFlow AI Studio",
        "role": "Frontend Engineer",
        "time": "1h ago",
        "status": "Pending",
        "statusColor": "bg-surface-container border border-outline-variant text-on-surface-variant",
        "github": "https://github.com/mpatel",
        "discord": "maya.gl#9021",
        "email": "maya@flowstudio.ai",
        "portfolio": "https://mayapatel.design",
        "experience": "Mid-Level Engineer (3 - 5 years)",
        "location": "Toronto, Canada (EST)",
        "skills": ["React", "TypeScript", "WebGPU", "Three.js", "Tailwind CSS"],
        "goals": ["Pair programming & live code reviews", "Co-found a side project or hackathon team"],
        "availability": "5 - 10 hours / week (Active Contributor)",
        "commitment": "5 - 10 hours / week",
        "communicationPref": "Hybrid (Weekly sprint standup + async updates)",
        "bio": "Specializing in WebGL/WebGPU shaders, canvas virtualized node graphs, and ultra low-latency interactive visualizers for AI models.",
        "pitch": "Specializing in WebGL/WebGPU shaders, canvas virtualized node graphs, and low-latency UI.",
        "featuredWork": "https://neuroflow.ai/canvas-engine",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "APP-8939",
        "name": "Kenji Sato (@ksato)",
        "fullName": "Kenji Sato",
        "pod": "CloudMesh Engine",
        "role": "Backend / Systems Engineer",
        "time": "3h ago",
        "status": "Accepted",
        "statusColor": "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300",
        "github": "https://github.com/ksato",
        "discord": "ksato#1001",
        "email": "kenji@meshcloud.org",
        "portfolio": "https://ksato.dev",
        "experience": "Lead / Staff / Architect (8+ years)",
        "location": "Tokyo, Japan (JST)",
        "skills": ["Go", "Kubernetes", "PostgreSQL", "GraphQL", "Docker"],
        "goals": ["Mentorship, peer review & knowledge sharing"],
        "availability": "5 - 10 hours / week (Active Contributor)",
        "commitment": "5 - 10 hours / week",
        "communicationPref": "Async-first (GitHub Issues, PRs, Discord chat)",
        "bio": "Core contributor to open source Kubernetes operators, high performance gRPC streaming multiplexers, and lock-free concurrency queues.",
        "pitch": "Core contributor to open source Kubernetes operators and high performance gRPC streaming.",
        "featuredWork": "https://github.com/cloudmesh/zero-alloc-router",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "APP-8938",
        "name": "Sarah Lindqvist (@slind)",
        "fullName": "Sarah Lindqvist",
        "pod": "OmniAnchor Oracle",
        "role": "Web3 / Smart Contract Developer",
        "time": "5h ago",
        "status": "Accepted",
        "statusColor": "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300",
        "github": "https://github.com/slind",
        "discord": "slindqvist#5890",
        "email": "sarah@auditsec.io",
        "portfolio": "https://slind.security",
        "experience": "Senior Engineer (5 - 8 years)",
        "location": "Stockholm, Sweden (CET)",
        "skills": ["Rust", "Solidity", "Web3", "Python", "Docker"],
        "goals": ["Join an active open-source project pod", "Pair programming & live code reviews"],
        "availability": "10 - 20 hours / week (Dedicated Sprint)",
        "commitment": "10 - 20 hours / week",
        "communicationPref": "Async-first (GitHub Issues, PRs, Discord chat)",
        "bio": "Audited 15+ EVM and Rust smart contract architectures with formal verification and zero post-deployment exploit reports.",
        "pitch": "Audited 15+ EVM and Rust contracts with zero post-deployment exploit reports.",
        "featuredWork": "https://github.com/auditsec/sol-invariant-fuzzer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

INITIAL_EVENTS = [
    {
        "id": "wasm-memory-safety",
        "title": "Deep Dive: WebAssembly, Memory Safety & Sandboxing",
        "date": "Nov 28, 2025",
        "time": "6:00 PM – 8:30 PM PST",
        "category": "Workshop",
        "location": "Online / Discord Stage",
        "badge": "Upcoming Masterclass",
        "badgeColor": "primary",
        "description": "Architecting untrusted edge execution environments with Wasmtime and Rust. Dive into isolated memory linear address spaces, host call boundaries, and zero-overhead sandbox orchestration.",
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        "attendees": 84,
        "capacity": 120,
        "registration_open": True,
        "speakers": [
            {"name": "Elena Rostova", "role": "Principal Systems Architect, Wasmer Core", "avatar": ""},
            {"name": "Devin Chen", "role": "Compiler Engineer, Bytecode Alliance", "avatar": ""}
        ],
        "agenda": [
            {"time": "6:00 PM", "title": "Architecture Overview & Sandbox Security"},
            {"time": "6:45 PM", "title": "Hands-on: Writing Wasm Guest Extensions in Rust"},
            {"time": "7:45 PM", "title": "Live Profiling & Q&A"}
        ],
        "is_past": False
    },
    {
        "id": "full-stack-vector-search",
        "title": "Full-Stack Vector Search with Postgres & pgvector",
        "date": "Dec 2, 2025",
        "time": "10:00 AM – 1:00 PM PST",
        "category": "Workshop",
        "location": "Online / Zoom Live",
        "badge": "Hands-on",
        "badgeColor": "secondary",
        "description": "Architecting scalable semantic retrieval pipelines directly in PostgreSQL with HNSW indexing and Supabase.",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        "attendees": 142,
        "capacity": 200,
        "registration_open": True,
        "speakers": [
            {"name": "Marcus Vance", "role": "Database Architect, OpenData", "avatar": ""}
        ],
        "is_past": False
    },
    {
        "id": "building-high-throughput-microservices-go",
        "title": "Building High-Throughput Microservices in Go",
        "date": "Dec 8, 2025",
        "time": "6:00 PM – 8:30 PM PST",
        "category": "Tech Talk",
        "location": "Online / Discord Stage",
        "badge": "Knowledge",
        "badgeColor": "tertiary",
        "description": "Deconstructing zero-allocation serialization, lock-free concurrency rings, and 500k RPS loads.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "attendees": 210,
        "capacity": 300,
        "registration_open": True,
        "is_past": False
    },
    {
        "id": "open-source-ai-sprint",
        "title": "Open Source AI Sprint: Fine-Tuning LLMs",
        "date": "Dec 14–15, 2025",
        "time": "36 Hours Continuous",
        "category": "Hackathon",
        "location": "Hybrid (San Francisco & Online)",
        "badge": "Competition",
        "badgeColor": "primary",
        "description": "Fine-tune open-weights models (Llama 3, Mistral) for niche dev tools with cloud GPU grants.",
        "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        "attendees": 380,
        "capacity": 500,
        "registration_open": True,
        "is_past": False
    },
    {
        "id": "ebpf-internals",
        "title": "eBPF Internals & Zero-Downtime Microservices",
        "date": "Oct 24, 2025",
        "time": "1h 45m recording",
        "category": "Tech Talk",
        "location": "Recorded",
        "badge": "Past Session",
        "description": "Kernel tracing, dynamic network probes, and custom security sandboxing without kernel module compilation.",
        "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
        "attendees": 340,
        "capacity": 500,
        "registration_open": False,
        "is_past": True
    }
]

INITIAL_USERS = [
    {
        "id": "usr-member-01",
        "email": "builder@thecodevibe.io",
        "password": "builder123",
        "name": "Devin Vance (@dvance)",
        "role": "member",
        "whatsapp": "+1 (555) 019-2834",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    }
]

# Active memory stores
memory_applications = list(INITIAL_APPLICATIONS)
memory_events = list(INITIAL_EVENTS)
memory_users = list(INITIAL_USERS)
memory_members = []
memory_rsvps = []
