export const PLATFORM_STATS = [
  { value: "12,400+", label: "Active Builders", color: "text-primary" },
  { value: "180+", label: "Shipped Open Projects", color: "text-secondary" },
  { value: "45+", label: "Hackathons & Talks", color: "text-tertiary" },
  { value: "98%", label: "Mentorship Match", color: "text-primary-container" }
];

export const ABOUT_STATS = [
  { value: "12,400+", label: "Active Builders", color: "text-primary" },
  { value: "180+", label: "Shipped Projects", color: "text-secondary" },
  { value: "45+", label: "Deep Tech Talks", color: "text-tertiary" },
  { value: "98%", label: "Pairing Match Rate", color: "text-primary-container" }
];

export const TELEMETRY_METRICS = [
  { label: "TOTAL OPEN ROLES", value: "38 Seats", icon: "group_add", iconColor: "text-primary" },
  { label: "ACTIVE REVIEW VELOCITY", value: "< 48 hrs", icon: "bolt", iconColor: "text-secondary" },
  { label: "WEEKLY CODE COMMITS", value: "1,480+", icon: "terminal", iconColor: "text-tertiary" },
  { label: "COMMUNITY MATCH RATE", value: "91.4%", icon: "verified", iconColor: "text-primary-container" }
];

export const WHAT_WE_DO_CARDS = [
  {
    id: "hackathons",
    index: "01",
    title: "Hackathons",
    category: "Competition",
    description: "Turn creative ideas into working solutions.",
    icon: "trophy",
    color: "primary",
    link: "/events",
    gradient: "from-[#00E5FF] via-[#2979FF] to-[#B324E5]",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(0,229,255,0.35)]",
    cardGlow: "rgba(0, 229, 255, 0.18)",
    badgeDot: "bg-[#00E5FF]",
    badgeBg: "bg-[rgba(0,229,255,0.12)] text-[#006875] border-[rgba(0,229,255,0.30)]",
    tags: ["48h Sprints", "Prize Pools", "Ship MVPs"]
  },
  {
    id: "tech-talks",
    index: "02",
    title: "Tech Talks",
    category: "Knowledge",
    description: "Explore new technologies and industry insights.",
    icon: "podcasts",
    color: "secondary",
    link: "/events",
    gradient: "from-[#B324E5] via-[#7928CA] to-[#2979FF]",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(179,36,229,0.35)]",
    cardGlow: "rgba(179, 36, 229, 0.18)",
    badgeDot: "bg-[#B324E5]",
    badgeBg: "bg-[rgba(179,36,229,0.12)] text-[#76009b] border-[rgba(179,36,229,0.30)]",
    tags: ["Tech Leads", "System Dives", "Live Q&A"]
  },
  {
    id: "workshops",
    index: "03",
    title: "Workshops",
    category: "Hands-on",
    description: "Learn through practical experiences.",
    icon: "terminal",
    color: "tertiary",
    link: "/events",
    gradient: "from-[#00E5FF] via-[#00B0FF] to-[#10B981]",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(16,185,129,0.35)]",
    cardGlow: "rgba(16, 185, 129, 0.18)",
    badgeDot: "bg-[#10B981]",
    badgeBg: "bg-[rgba(16,185,129,0.12)] text-[#065f46] border-[rgba(16,185,129,0.30)]",
    tags: ["Live Labs", "Modern Stacks", "Practical Code"]
  },
  {
    id: "collaboration",
    index: "04",
    title: "Collaboration",
    category: "Community",
    description: "Connect, share ideas and build together.",
    icon: "groups",
    color: "primary-container",
    link: "/collaborate",
    gradient: "from-[#2979FF] via-[#00E5FF] to-[#B324E5]",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(41,121,255,0.35)]",
    cardGlow: "rgba(41, 121, 255, 0.18)",
    badgeDot: "bg-[#2979FF]",
    badgeBg: "bg-[rgba(41,121,255,0.12)] text-[#00429b] border-[rgba(41,121,255,0.30)]",
    tags: ["Builder Pods", "Open Source", "Pair Coding"]
  }
];

export const FEATURED_EVENTS_HOME = [
  {
    id: "ai-agent-hackathon-2026",
    title: "Autonomous AI Agents Sprint 2026",
    category: "Hackathons",
    categoryKey: "hackathons",
    date: "May 16 - 18, 2026",
    time: "48-Hour Continuous Sprint",
    location: "Online & Worldwide • Discord Stage",
    description: "48-hour sprint to craft self-healing, stateful autonomous agents with memory persistence.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    badgeBg: "bg-[rgba(0,229,255,0.12)] border-[rgba(0,229,255,0.30)] text-[#006875]",
    badgeDot: "bg-[#00E5FF]",
    link: "/events"
  },
  {
    id: "system-architecture-scale-2026",
    title: "System Architecture & Consensus at Scale",
    category: "Technical talks",
    categoryKey: "technical-talks",
    date: "May 28, 2026",
    time: "06:00 PM – 08:30 PM PST",
    location: "SF Tech Hall & Global Live Stream",
    description: "Deep architectural breakdown of zero-downtime database sharding and distributed consensus under 100k QPS.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    badgeBg: "bg-[rgba(179,36,229,0.12)] border-[rgba(179,36,229,0.30)] text-[#76009b]",
    badgeDot: "bg-[#B324E5]",
    link: "/events"
  },
  {
    id: "full-stack-vector-search-2026",
    title: "Full-Stack Vector Search with Postgres & pgvector",
    category: "Workshops",
    categoryKey: "workshops",
    date: "June 05, 2026",
    time: "10:00 AM – 01:00 PM PST",
    location: "Interactive Lab • Virtual Sandbox",
    description: "Architecting scalable semantic retrieval pipelines directly in PostgreSQL with HNSW indexing.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    badgeBg: "bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.30)] text-[#065f46]",
    badgeDot: "bg-[#10B981]",
    link: "/events"
  },
  {
    id: "algorithmic-code-duel-2026",
    title: "Algorithmic Code Duel & WebGPU Shader Arena",
    category: "Competitions",
    categoryKey: "competitions",
    date: "June 14, 2026",
    time: "12:00 PM – 04:00 PM PST",
    location: "Online Competitive Arena • Realtime Leaderboard",
    description: "Live code golf and compute shader optimization duel. Race against the clock to optimize memory & latency.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    badgeBg: "bg-[rgba(41,121,255,0.12)] border-[rgba(41,121,255,0.30)] text-[#00429b]",
    badgeDot: "bg-[#2979FF]",
    link: "/events"
  }
];

export const WHY_JOIN_REASONS = [
  {
    id: "learn",
    index: "01",
    benefit: "Learn",
    description: "Explore technologies and develop skills.",
    icon: "school",
    gradient: "from-[#00E5FF] via-[#2979FF] to-[#B324E5]",
    cardGlow: "rgba(0, 229, 255, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(0,229,255,0.35)]",
    badgeDot: "bg-[#00E5FF]",
    badgeBg: "bg-[rgba(0,229,255,0.12)] text-[#006875] border-[rgba(0,229,255,0.30)]",
    tagline: "Skill Acceleration",
    highlights: ["Modern Stacks", "Interactive Labs", "Peer Code Reviews"]
  },
  {
    id: "connect",
    index: "02",
    benefit: "Connect",
    description: "Meet like-minded students.",
    icon: "diversity_3",
    gradient: "from-[#B324E5] via-[#7928CA] to-[#2979FF]",
    cardGlow: "rgba(179, 36, 229, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(179,36,229,0.35)]",
    badgeDot: "bg-[#B324E5]",
    badgeBg: "bg-[rgba(179,36,229,0.12)] text-[#76009b] border-[rgba(179,36,229,0.30)]",
    tagline: "Peer Network",
    highlights: ["Active Discord", "Student Devs", "Hackathon Pods"]
  },
  {
    id: "build",
    index: "03",
    benefit: "Build",
    description: "Work on interesting projects.",
    icon: "rocket_launch",
    gradient: "from-[#00E5FF] via-[#00B0FF] to-[#10B981]",
    cardGlow: "rgba(16, 185, 129, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(16,185,129,0.35)]",
    badgeDot: "bg-[#10B981]",
    badgeBg: "bg-[rgba(16,185,129,0.12)] text-[#065f46] border-[rgba(16,185,129,0.30)]",
    tagline: "Hands-on Shipping",
    highlights: ["Real Software", "Open Source Repos", "Production MVPs"]
  },
  {
    id: "grow",
    index: "04",
    benefit: "Grow",
    description: "Gain experience through events and activities.",
    icon: "trending_up",
    gradient: "from-[#2979FF] via-[#00E5FF] to-[#B324E5]",
    cardGlow: "rgba(41, 121, 255, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(41,121,255,0.35)]",
    badgeDot: "bg-[#2979FF]",
    badgeBg: "bg-[rgba(41,121,255,0.12)] text-[#00429b] border-[rgba(41,121,255,0.30)]",
    tagline: "Career Velocity",
    highlights: ["Flagship Events", "Speaker Insights", "Portfolio Boost"]
  }
];

export const OPEN_COLLABORATION_SPOTLIGHT = [
  {
    id: "chroma-flow",
    repo: "github.com/thecodevibe/chroma-flow",
    seats: "2 Seats Open",
    seatColor: "bg-secondary-container/20 border-secondary-container/40 text-on-secondary-container",
    indicatorColor: "bg-secondary",
    title: "ChromaFlow WebGL Canvas Engine",
    description: "GPU-accelerated vector rendering engine for high-density node graphs. Seeking a shaders engineer and a performance tester.",
    tags: ["TypeScript", "WebGL 2.0", "GLSL", "Vitest"],
    lead: "@alex_k",
    leadAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7U7-jBpHbrY--TMb-okvztgn0o78lK4Xf1HhFelVWhLM7pvK2Rx68wGqAXIjuKjbccYMcPPy8uIF3fMdRcT5P1-BgjYg6rGDOdgAYDJyKlB39yft5loqmo-i5s-dfk5wAVwcW2lMIGbL-1CnvdmZev3M7U66xv-I4uJ0ZMB1VxKFrdIEXsxIyu2ic0YHI2D5qAEjb12jK-8EIAi-Pccvz1uTlCuUotCvu1FAYAz8NINMXqNEAX25W",
    projectKey: "ChromaFlow"
  },
  {
    id: "nexus-queue",
    repo: "github.com/thecodevibe/nexus-queue",
    seats: "1 Seat Open",
    seatColor: "bg-tertiary-fixed/50 border-tertiary/20 text-on-tertiary-fixed-variant",
    indicatorColor: "bg-tertiary",
    title: "Nexus Distributed Task Scheduler",
    description: "Fault-tolerant asynchronous job broker written in Go with raft-backed leader election and gRPC interface.",
    tags: ["Golang 1.23", "gRPC", "Protobuf", "Docker"],
    lead: "@tarik_dev",
    leadAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhD6tXPy7_PL2x9eyr0ex34o6GJxqyUMQskTE2L5kYWFLukjYjcj24Gxge0EU9ZAYyhrIVko4yPfwXe4v0HU6W2-LstmIp1-KHd3qZGBb4VOGu5dg86paFdKOspcGIYNffMBJyKaP45Gyvxc3rTOeu3R-nTPq19gzRhGhirFjwBs9IDPQI__EQa1yUJ1uAAgN5SZvSVw7a9sioTHA7rxvsojrk9fVKZu-6urFbfDX80DDrQTJmqxzY",
    projectKey: "NexusQueue"
  }
];

export const TESTIMONIALS = [
  {
    quote: "“The pair programming sessions accelerated my understanding of distributed systems faster than any paid course. Shipped my first production Go microservice in 3 weeks.”",
    name: "Samantha Roy",
    handle: "@samroy_dev",
    role: "SRE at CloudScale",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtPlC1wpc4qJoMLCUxHTKTqacVtMjRyI3dBwfu2vnI9wiDzXRNAlwFSl2101jxdRD1Csx0vrXtQkk5Fbc6fkr_xo0qJsM7AMJd25qwXboVRRK8dEjCRdft7yX6ecUzg0-qIfyrksar5vyclJwIM5E1pH_piofjtXn-j_o4htmh3AaH_W_59rB76gFOM9W1q38suIzlaF2VwuwbFntVaSaZiZDi6U0EjkXIPGeJsgQJ8AkHK5PpyeVB"
  },
  {
    quote: "“Found our technical co-founder during the AI Agents Hackathon. The signal-to-noise ratio in this community is leagues beyond traditional Discord forums.”",
    name: "Liam Chen",
    handle: "@liam_builds",
    role: "Founder, AgenticOS",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcasoZaX4qH1xb3GBfF1PI2zOSxe6AF_QjQJ7xwcCnFv-sRXo6UAS14YgDVVspQRdlv-IlZpUzprgWbGP7h_wOIboDxXAB-dhar0a6i-RWGUx_nP57Y2qW8UWX4AdxOXXKFqLdTzjYEMJbcqIWvIwc96mFiUlT9Cl7OSb5nz0GpPpYc1Mr4Em2-mNlEitII90k2EOQeDHF0Y9lrcrFMs-sWs18WWvu8ZYASboqGOzLGpTu63j0mlBP"
  },
  {
    quote: "“Mentoring junior engineers here has refined how I write architectural documentation. The collaborative feedback loop is remarkably thoughtful and rigorous.”",
    name: "Davide Moretti",
    handle: "@dmoretti",
    role: "Staff Eng at Datasync",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJRR1f9IkzhbpzVcSRtK1_yk9Sxvwja60KOsUK84bH734qqLCoGOtE7ZHXBXeYBeGC2BKD0CzRduEOlsjvMnb8AvhXmM0ZF9D2iRP_DxNgjE4gyN1lKrAm0zCB0pgJncTpHQpl-gg1um8qXo8uPhJbV9ZO1R_0R8Tvk_TVUnsZafx2afhnPawxl0QqRElYE7DG53ckPkDsnxtLAH6fZQ6PiBPwFaTuWEQcnQ4mM4jPh2LxA6mjaE-V"
  }
];

export const ABOUT_BELIEFS = [
  {
    id: "explore",
    title: "Explore",
    description: "Stay curious and discover new possibilities.",
    icon: "explore",
    gradient: "from-[#00E5FF] via-[#2979FF] to-[#B324E5]",
    cardGlow: "rgba(0, 229, 255, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(0,229,255,0.35)]",
    badgeBg: "bg-[rgba(0,229,255,0.12)] border-[rgba(0,229,255,0.30)] text-[#006875]",
    badgeDot: "bg-[#00E5FF]"
  },
  {
    id: "create",
    title: "Create",
    description: "Turn ideas into meaningful projects.",
    icon: "lightbulb",
    gradient: "from-[#B324E5] via-[#7928CA] to-[#2979FF]",
    cardGlow: "rgba(179, 36, 229, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(179,36,229,0.35)]",
    badgeBg: "bg-[rgba(179,36,229,0.12)] border-[rgba(179,36,229,0.30)] text-[#76009b]",
    badgeDot: "bg-[#B324E5]"
  },
  {
    id: "connect",
    title: "Connect",
    description: "Learn and grow together.",
    icon: "diversity_3",
    gradient: "from-[#00E5FF] via-[#00B0FF] to-[#10B981]",
    cardGlow: "rgba(16, 185, 129, 0.18)",
    iconGlow: "shadow-[0_8px_24px_-4px_rgba(16,185,129,0.35)]",
    badgeBg: "bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.30)] text-[#065f46]",
    badgeDot: "bg-[#10B981]"
  }
];

export const TEAM_MEMBERS = [
  {
    id: "dhruv-senga",
    name: "Dhruv Senga",
    position: "Founder & Community Lead",
    avatar: "/team/dhruv-senga.jpeg",
    linkedin: "https://www.linkedin.com/company/the-code-vibe/",
    badge: "Founding Member"
  },
  {
    id: "ashish-singh",
    name: "Ashish Singh",
    position: "Hackathons & Events Lead · Tech Team Lead",
    avatar: "/team/ashish-singh.jpeg",
    linkedin: "https://www.linkedin.com/company/the-code-vibe/",
    badge: "Founding Member"
  },
  {
    id: "nancy-agrawal",
    name: "Nancy Agrawal",
    position: "Social Media Manager & Coordinator",
    avatar: "/team/nancy-agrawal.jpeg",
    linkedin: "https://www.linkedin.com/company/the-code-vibe/",
    badge: "Founding Member"
  },
  {
    id: "moningi-nidh",
    name: "Moningi Nidh",
    position: "Frontend Developer & Creative Tech Lead",
    avatar: "/team/moningi-nidh.jpeg",
    linkedin: "https://www.linkedin.com/company/the-code-vibe/",
    badge: "Founding Member"
  },
  {
    id: "krishnanand-verma",
    name: "Krishnanand Verma",
    position: "Student Outreach & Partnerships",
    avatar: "/team/krishnanand-verma.jpeg",
    linkedin: "https://www.linkedin.com/company/the-code-vibe/",
    badge: "Founding Member"
  }
];

export const CORE_VALUES = [
  {
    number: "01",
    title: "Real-World Engineering",
    description: "We ship to production clusters, not local branches. Every commit must withstand linting, end-to-end integration tests, and telemetry monitoring.",
    badge: "CI/CD & Helm Ready",
    icon: "dns",
    color: "primary"
  },
  {
    number: "02",
    title: "Radical Transparency",
    description: "All architectural design docs, RFC debates, and PR review decisions are openly discussed in publicly searchable community channels.",
    badge: "100% Open RFC Protocol",
    icon: "visibility",
    color: "secondary"
  },
  {
    number: "03",
    title: "Mentorship & Pairing",
    description: "Senior staff engineers pair directly with emerging talent on weekly schedules to unblock tricky bugs, design APIs, and refactor bottlenecks.",
    badge: "Weekly Live Pair Syncs",
    icon: "group_work",
    color: "tertiary"
  },
  {
    number: "04",
    title: "Open-Source Ecosystem",
    description: "Every tool and library authored within our public cohorts is published under Apache 2.0 or MIT to give back unconditionally to the global developer commons.",
    badge: "Apache 2.0 & MIT First",
    icon: "code_blocks",
    color: "primary-container"
  }
];

export const COMMUNITY_LEADERS = [
  {
    name: "Alex Chen",
    handle: "@achen",
    handleColor: "text-primary",
    title: "Staff SRE & Pods Lead",
    titleColor: "text-secondary",
    bio: "Ex-Cloudflare infrastructure engineer focusing on eBPF packet processing, Linux kernel tracing, and distributed cluster reliability.",
    tags: ["Rust", "eBPF", "K8s"],
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvEHjQgpbw7VM4y1R-kQS9vZltQdO7-DLrOzIaWJQfarDuhgbvWKuGT-32AhmW3ujf0XBvQpCs6ua_ucEMg_7ouSjMS4DXXu9E9_BjThlPWukP34HtVV3mNZSE-nGnyb_sojo_e_OsxhehNcBMjumrLgSfQJeBc5N7jhaJo6Sl5jS5AQZWmBy3pjaUO8-MwacbrC4B5tkX4tCgwdbvsMgTsG-ZR5B6w-zfLb4eveLrN5dKEL93W2hD"
  },
  {
    name: "Elena Rostova",
    handle: "@elena_k",
    handleColor: "text-tertiary",
    title: "Kernel Tracing & Systems Architect",
    titleColor: "text-tertiary",
    bio: "Specialized in low-level concurrency engines, lock-free memory models, and zero-copy microservice telemetry systems.",
    tags: ["Go", "C++", "Linux"],
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLX9RzBjf1Hwo4sIF33nxyEKgDTHmuq7BW7IVe1m7ChtWbFeS5sBJjZ-z4ElWP_Dz9i2siPhjhOmBbtIZLz3aHfNiU5ZunHpIazXgkPR6kf2mytQZ9ZQmAqQCnyCZ2kk0OvRjkPL2TBBZ1IPZLGVjt__3l3tCVVm5XrhI_i-LzTSWgXK1GpWWmsa-KG0RvXNLFmtuNsUrMp3uO63-1H46wiINR1YZ51SuscAvPd2P4r-DNG6Ax09Un"
  },
  {
    name: "Sophia Rodriguez",
    handle: "@sophia_r",
    handleColor: "text-secondary",
    title: "Full-Stack UI & WebGL Visuals Lead",
    titleColor: "text-secondary",
    bio: "Pioneering shader graph tools and dynamic vector graphics pipelines. Advocates for hyper-accessible developer tooling and reactive state engines.",
    tags: ["TypeScript", "WebGL", "Three.js"],
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8-BIMhbsKLB689qAnOglrQ1ptNjYCrj2ajT1UnCFHWSmnRiyqOIFomc_kq6JSTLxtm5IwKjVGKwh6ERoRCkHZNzhi1PkBN4U4fRxptzrSqdsyTBG6lCBqKanBWRb_HJE8wpoVoIm18rBXUkXiVgkyGUeJGeH6m8BkandFAm5f3Jeet5BDs7zKDD6KS3tVQO8dd1SZNkcPr8nVkL9U140rsZNb2O8nLQ8cTF1KLVbtXMYtcoO3DXdW"
  },
  {
    name: "Liam Chen",
    handle: "@liam_builds",
    handleColor: "text-primary-container",
    title: "Founder & Agentic Systems Lead",
    titleColor: "text-primary-container",
    bio: "Researching autonomous developer agents, deterministic compiler tooling, and decentralized code synthesis protocols across edge clusters.",
    tags: ["Python", "LLMs", "WASM"],
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhGiR_X0N-u-6aON6gCdLsOwqkcfOicg5Kd-yD_7kf4hcAP6_S_ckZ3hI42WMzQHbZBthgdTe0RRbfI84VlmBQoNwu67SqauSJAUWQVyQ1N2lRu1T4MfzWgg-3pYqut3Z5n84JuhC3I9MYFMdm_v9hkdw899qDxdTM6PWeTtQdKuUeNO2CoAbYF50mihWJHBo-n1ZMwlpXjgbt_v9p5yJGYJ30oYIpFvbZTVbGvFSkIa0sDD9qYRA-"
  }
];

export const FAQ_ITEMS = [
  {
    question: "What makes The Code Vibe different from standard Discord or Slack communities?",
    answer: "We are project-first and output-driven. Rather than open-ended endless chat rooms, our members organize into focused Pods with 2-week sprint cycles, paired code reviews, architectural RFCs, and real production releases with verifiable user metrics."
  },
  {
    question: "Is The Code Vibe free to join?",
    answer: "Yes, community membership, public hackathons, tech talks, and open-source collaboration pods are 100% free and open. We are funded by ecosystem sponsors, compute grants, and institutional open-source foundations."
  },
  {
    question: "What skill level is required to participate in engineering pods?",
    answer: "We have cohorts spanning from intermediate builders up to staff/principal engineers. While we assume familiarity with at least one programming language (TypeScript, Rust, Go, Python), each pod pairs newer contributors directly with veteran leads to accelerate ramp-up time."
  },
  {
    question: "How do pair programming circles work?",
    answer: "Every week, builders can schedule 1:1 or small-group 60-minute pairing sessions through our automated scheduler to debug complex issues, review PRs, or tackle algorithmic and distributed system bottlenecks collaboratively."
  },
  {
    question: "How can organizations or sponsors partner with The Code Vibe?",
    answer: "Companies can sponsor bounty issues, host deep-dive technical masterclasses, or sponsor specialized hackathon tracks by reaching out via our partner desk at partners@thecodevibe.dev."
  }
];

export const HOME_FAQ_ITEMS = [
  {
    question: "1. Who can join The Code Vibe?",
    answer: "Anyone passionate about programming, building technology, or exploring software can join! Whether you are a beginner, a university student, a self-taught coder, or an experienced engineer, The Code Vibe welcomes all passionate builders."
  },
  {
    question: "2. Do I need coding experience to join?",
    answer: "No prior experience is required! We offer beginner-friendly tracks, guided workshops, and collaborative project pods where you can learn from peers and grow from hello-world fundamentals to building production software."
  },
  {
    question: "3. Can students from different branches participate?",
    answer: "Yes, absolutely! Students from all branches and academic fields—including Computer Science, Electrical, Mechanical, Civil, Design, Business, and humanities—actively participate. Cross-disciplinary thinking drives the most creative projects."
  },
  {
    question: "4. How can I participate in hackathons?",
    answer: "You can register directly from our Events page or via our community announcements. You can enter individually or as a team. If you don't have a team yet, we host dedicated matchmaking channels and pairing huddles to connect you with teammates."
  },
  {
    question: "5. How can I stay updated about events?",
    answer: "Keep an eye on the Upcoming Events section on our website, join our WhatsApp community, and follow our LinkedIn and Instagram pages. All event dates, registration links, and reminders are published there in real time."
  },
  {
    question: "6. How can I collaborate with the community?",
    answer: "Head over to our Collaborate page to submit your details and connect as a collaborator, join active open-source project pods, propose new project ideas, or join our weekly pair programming circles."
  }
];

export const EVENTS_PAGE_ITEMS = [
  {
    id: "wasm-memory-safety",
    title: "Deep Dive: WebAssembly, Memory Safety & Sandboxing",
    description: "Architecting untrusted edge execution environments with Wasmtime and Rust. Dive into isolated memory linear address spaces.",
    date: "Nov 28, 2025",
    time: "6:00 PM – 8:30 PM PST",
    category: "workshop",
    categoryLabel: "Workshop",
    status: "Online",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    link: "/events/wasm-memory-safety"
  },
  {
    id: "full-stack-vector-search",
    title: "Full-Stack Vector Search with Postgres & pgvector",
    description: "Architecting scalable semantic retrieval pipelines directly in PostgreSQL with HNSW indexing and Supabase.",
    date: "Dec 2, 2025",
    time: "10:00 AM – 1:00 PM PST",
    category: "workshop",
    categoryLabel: "Workshop",
    status: "Online",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    link: "/events/full-stack-vector-search"
  },
  {
    id: "building-high-throughput-microservices-go",
    title: "Building High-Throughput Microservices in Go",
    description: "Deconstructing zero-allocation serialization, lock-free concurrency rings, and 500k RPS loads.",
    date: "Dec 8, 2025",
    time: "6:00 PM – 8:30 PM PST",
    category: "talk",
    categoryLabel: "Tech Talk",
    status: "Online",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    link: "/events/building-high-throughput-microservices-go"
  },
  {
    id: "open-source-ai-sprint",
    title: "Open Source AI Sprint: Fine-Tuning LLMs",
    description: "Fine-tune open-weights models (Llama 3, Mistral) for niche dev tools with cloud GPU grants.",
    date: "Dec 14–15, 2025",
    time: "36 Hours Continuous",
    category: "hackathon",
    categoryLabel: "Hackathon",
    status: "Online",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    link: "/events/open-source-ai-sprint"
  },
  {
    id: "webassembly-real-world",
    title: "WebAssembly in the Real World: Beyond the Browser",
    description: "Exploration of WASI 0.2, untrusted sandboxed code at edge gateways, and Rust microservices.",
    date: "Dec 20, 2025",
    time: "5:30 PM – 8:00 PM EST",
    category: "meetup",
    categoryLabel: "Meetup",
    status: "Hybrid",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    link: "/events/webassembly-real-world"
  }
];

export const PAST_SESSIONS = [
  {
    id: "ebpf-internals",
    title: "eBPF Internals & Zero-Downtime Microservices",
    description: "Kernel tracing, dynamic network probes, and custom security sandboxing without kernel module compilation.",
    date: "Oct 24, 2025",
    duration: "1h 45m",
    status: "Online",
    tags: ["Linux", "Networking"],
    category: "talk"
  },
  {
    id: "autonomous-ai-agents-finale",
    title: "Autonomous AI Agents Hackathon: Grand Finale",
    description: "Showcase of top 12 autonomous agent prototypes, multi-agent debate protocols, and tool use benchmarks.",
    date: "Sep 30, 2025",
    duration: "2h 30m",
    status: "Hybrid",
    tags: ["AI / LLMs", "Demos"],
    category: "hackathon"
  },
  {
    id: "rust-wasm-past",
    title: "Rust for TypeScript Devs: WASM & Memory Safety",
    description: "Bridging async event loops, zero-copy byte buffers, and compiling multi-threaded Web Workers via wasm-bindgen.",
    date: "Sep 12, 2025",
    duration: "2h 10m",
    status: "Online",
    tags: ["Rust", "WASM"],
    category: "workshop"
  },
  {
    id: "webgl-webgpu-engine",
    title: "WebGL & WebGPU Canvas Engine Demo",
    description: "Writing custom compute shaders for 100k GPU particle simulations and browser performance telemetry.",
    date: "Aug 18, 2025",
    duration: "1h 35m",
    status: "Online",
    tags: ["Graphics", "WebGPU"],
    category: "talk"
  }
];
