import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/ui/Toast';
import {
  apiGetEvents,
  apiCreateEvent,
  apiUpdateEvent,
  apiToggleEventRegistration,
  apiDeleteEvent,
  apiGetApplications,
  apiUpdateApplicationStatus,
  apiGetEventRegistrations
} from '../services/api';
import { EVENTS_PAGE_ITEMS } from '../data/mockData';

const PRESET_EVENT_IMAGES = [
  { label: 'Cloud & Architecture', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rust & Memory Safety', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Go Microservices', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI Sprint & LLMs', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'eBPF & Linux Kernel', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80' },
];

const EMPTY_EVENT_FORM = {
  title: '',
  category: 'Workshop',
  categoryLabel: '',
  status: '',
  date: '',
  time: '',
  location: '',
  capacity: '',
  attendees: 0,
  description: '',
  image: '',
  registration_open: true,
  // Host details
  speakerName: '',
  speakerRole: '',
  speakerLinkedin: '',
  // Dynamic Timeline milestones
  agenda: [
    { time: '', desc: '' }
  ],
  registration_fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Email Address', type: 'email', required: true },
  ],
};

export default function AdminPortalPage() {
  const { user, isAuthenticated, login } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('admin@thecodevibe.io');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('events'); // events | registrations | collaborators
  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  // Events management state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Modal State (Create or Edit)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormData, setEventFormData] = useState(EMPTY_EVENT_FORM);

  // Dynamic Timeline (Agenda) handlers
  const handleAgendaChange = (index, field, value) => {
    setEventFormData((prev) => {
      const nextAgenda = [...(prev.agenda || [])];
      nextAgenda[index] = { ...nextAgenda[index], [field]: value };
      return { ...prev, agenda: nextAgenda };
    });
  };

  const handleAddAgendaItem = () => {
    setEventFormData((prev) => ({
      ...prev,
      agenda: [...(prev.agenda || []), { time: '', desc: '' }],
    }));
  };

  const handleRemoveAgendaItem = (index) => {
    setEventFormData((prev) => {
      const filtered = (prev.agenda || []).filter((_, i) => i !== index);
      return {
        ...prev,
        // Keep at least one item row for editing convenience
        agenda: filtered.length > 0 ? filtered : [{ time: '', desc: '' }],
      };
    });
  };

  // Collaborator Applications state
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState('all');
  const [expandedAppIds, setExpandedAppIds] = useState({});

  const toggleExpandApp = (appId) => {
    setExpandedAppIds((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  // Fetch initial data
  useEffect(() => {
    if (isAdmin) {
      loadEvents();
      loadApplications();
    }
  }, [isAdmin]);

  const loadEvents = async () => {
    setEventsLoading(true);
    const backendEvents = await apiGetEvents();
    if (backendEvents && backendEvents.length > 0) {
      setEvents(backendEvents);
    } else {
      setEvents(
        EVENTS_PAGE_ITEMS.map((e) => ({
          ...e,
          capacity: e.capacity || 200,
          attendees: e.attendees || 85,
          registration_open: e.registration_open !== undefined ? e.registration_open : true,
        }))
      );
    }
    setEventsLoading(false);
  };

  const loadApplications = async () => {
    const backendApps = await apiGetApplications();
    if (backendApps && backendApps.length > 0) {
      setApplications(backendApps);
    } else {
      setApplications([
        {
          id: 'APP-8941',
          name: 'Julian Vance (@jvance)',
          fullName: 'Julian Vance',
          pod: 'DevPulse Telemetry',
          role: 'Backend / Systems Engineer',
          time: '12m ago',
          status: 'Under Review',
          email: 'jvance@devpulse.io',
          github: 'https://github.com/jvance',
          discord: 'jvance#4412',
          portfolio: 'https://jvance.dev',
          experience: 'Senior Engineer (5 - 8 years)',
          location: 'Berlin, Germany (CET)',
          skills: ['Rust', 'C++', 'eBPF', 'Linux Kernel', 'Docker'],
          goals: ['Join an active open-source project pod', 'Lead my own project & recruit builders'],
          availability: '10 - 20 hours / week (Dedicated Sprint)',
          communicationPref: 'Async-first (GitHub Issues, PRs, Discord chat)',
          bio: 'Extensive experience with Linux kernel tracing, libbpf, and writing custom ring buffers in C and Rust.',
          pitch: 'Extensive experience with Linux kernel tracing, libbpf, and writing custom ring buffers in C and Rust.',
          featuredWork: 'https://github.com/jvance/bpf-ringbuf-streamer (800+ stars)',
        },
        {
          id: 'APP-8940',
          name: 'Maya Patel (@mpatel)',
          fullName: 'Maya Patel',
          pod: 'NeuroFlow AI Studio',
          role: 'Frontend Engineer',
          time: '1h ago',
          status: 'Pending',
          email: 'maya.patel@designer.io',
          github: 'https://github.com/mpatel',
          discord: 'maya.gl#9021',
          portfolio: 'https://mayapatel.design',
          experience: 'Mid-Level Engineer (3 - 5 years)',
          location: 'Toronto, Canada (EST)',
          skills: ['React', 'TypeScript', 'WebGPU', 'Three.js', 'Tailwind CSS'],
          goals: ['Pair programming & live code reviews', 'Co-found a side project or hackathon team'],
          availability: '5 - 10 hours / week (Active Contributor)',
          communicationPref: 'Hybrid (Weekly sprint standup + async updates)',
          bio: 'Specialized in Three.js and WebGL canvas performance optimization for deep learning visualizers.',
          pitch: 'Specialized in Three.js and WebGL canvas performance optimization for deep learning visualizers.',
          featuredWork: 'https://neuroflow.ai/canvas-engine',
        },
        {
          id: 'APP-8939',
          name: 'Kenji Sato (@ksato)',
          fullName: 'Kenji Sato',
          pod: 'CloudMesh Engine',
          role: 'Backend / Systems Engineer',
          time: '3h ago',
          status: 'Accepted',
          email: 'kenji@sato.dev',
          github: 'https://github.com/ksato',
          discord: 'ksato#1001',
          portfolio: 'https://ksato.dev',
          experience: 'Lead / Staff / Architect (8+ years)',
          location: 'Tokyo, Japan (JST)',
          skills: ['Go', 'Kubernetes', 'PostgreSQL', 'GraphQL', 'Docker'],
          goals: ['Mentorship, peer review & knowledge sharing'],
          availability: '5 - 10 hours / week (Active Contributor)',
          communicationPref: 'Async-first (GitHub Issues, PRs, Discord chat)',
          bio: 'Built lock-free queues and zero-allocation network multiplexers processing 250k RPS.',
          pitch: 'Built lock-free queues and zero-allocation network multiplexers processing 250k RPS.',
          featuredWork: 'https://github.com/cloudmesh/zero-alloc-router',
        },
        {
          id: 'APP-8938',
          name: 'Sarah Lindqvist (@slind)',
          fullName: 'Sarah Lindqvist',
          pod: 'OmniAnchor Oracle',
          role: 'Web3 / Smart Contract Developer',
          time: '5h ago',
          status: 'Accepted',
          email: 'sarah@auditsec.io',
          github: 'https://github.com/slind',
          discord: 'slindqvist#5890',
          portfolio: 'https://slind.security',
          experience: 'Senior Engineer (5 - 8 years)',
          location: 'Stockholm, Sweden (CET)',
          skills: ['Rust', 'Solidity', 'Web3', 'Python', 'Docker'],
          goals: ['Join an active open-source project pod', 'Pair programming & live code reviews'],
          availability: '10 - 20 hours / week (Dedicated Sprint)',
          communicationPref: 'Async-first (GitHub Issues, PRs, Discord chat)',
          bio: 'Audited 15+ EVM and Rust contracts with zero post-deployment exploit reports.',
          pitch: 'Audited 15+ EVM and Rust contracts with zero post-deployment exploit reports.',
          featuredWork: 'https://github.com/auditsec/sol-invariant-fuzzer',
        },
      ]);
    }
  };

  // Handle Admin Quick Login
  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await login(adminEmail, adminPassword, 'admin');
      showToast('Welcome, Root Systems Operator! Admin privileges verified.');
    } catch (err) {
      setLoginError(err.message || 'Invalid admin email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Open Create Event Modal (Zero Defaults - Clean Slate)
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingEventId(null);
    setEventFormData({
      ...EMPTY_EVENT_FORM,
      agenda: [{ time: '', desc: '' }],
    });
    setIsEventModalOpen(true);
  };

  // Open Edit Event Modal
  const handleOpenEditModal = (event) => {
    setIsEditMode(true);
    setEditingEventId(event.id);

    const firstSpeaker = event.speakers?.[0] || {};
    let initialAgenda = [];

    if (Array.isArray(event.agenda) && event.agenda.length > 0) {
      initialAgenda = event.agenda.map((item) => ({
        time: item.time || '',
        desc: item.desc || '',
        dot: item.dot || '',
      }));
    } else if (event.agendaPart1 || event.agendaPart2 || event.agendaPart3) {
      if (event.agendaPart1 || event.agendaPart1Time) {
        initialAgenda.push({ time: event.agendaPart1Time || '', desc: event.agendaPart1 || '' });
      }
      if (event.agendaPart2 || event.agendaPart2Time) {
        initialAgenda.push({ time: event.agendaPart2Time || '', desc: event.agendaPart2 || '' });
      }
      if (event.agendaPart3 || event.agendaPart3Time) {
        initialAgenda.push({ time: event.agendaPart3Time || '', desc: event.agendaPart3 || '' });
      }
    }

    if (initialAgenda.length === 0) {
      initialAgenda = [{ time: '', desc: '' }];
    }

    setEventFormData({
      title: event.title || '',
      category: event.category || 'Workshop',
      categoryLabel: event.categoryLabel || '',
      status: event.status || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      capacity: event.capacity !== undefined ? event.capacity : '',
      attendees: event.attendees !== undefined ? event.attendees : 0,
      description: event.description || '',
      image: event.image || '',
      registration_open: event.registration_open !== undefined ? event.registration_open : true,
      speakerName: firstSpeaker.name || event.speakerName || '',
      speakerRole: firstSpeaker.role || event.speakerRole || '',
      speakerLinkedin: firstSpeaker.linkedin || event.speakerLinkedin || '',
      agenda: initialAgenda,
      registration_fields: Array.isArray(event.registration_fields) && event.registration_fields.length ? event.registration_fields : EMPTY_EVENT_FORM.registration_fields,
    });

    setIsEventModalOpen(true);
  };

  // Submit Event (Create or Update)
  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) {
      showToast('Event title is required.');
      return;
    }

    const dotColors = [
      'bg-[#0056c5]',
      'bg-[#00E5FF]',
      'bg-[#B324E5]',
      'bg-[#006875]',
      'bg-amber-500',
      'bg-emerald-500',
    ];

    const formattedAgenda = (eventFormData.agenda || [])
      .filter((item) => item.time?.trim() || item.desc?.trim())
      .map((item, idx) => ({
        time: item.time.trim(),
        desc: item.desc.trim(),
        dot: item.dot || dotColors[idx % dotColors.length],
      }));

    const payload = {
      title: eventFormData.title.trim(),
      category: eventFormData.category || 'Workshop',
      categoryLabel: eventFormData.categoryLabel?.trim() || eventFormData.category || 'Workshop',
      status: eventFormData.status?.trim() || 'Online • Discord Live',
      date: eventFormData.date?.trim() || 'TBA',
      time: eventFormData.time?.trim() || 'TBA',
      location: eventFormData.location?.trim() || 'Online / Global Stage',
      capacity: Number(eventFormData.capacity) || 100,
      attendees: Number(eventFormData.attendees) || 0,
      description: eventFormData.description?.trim() || '',
      image: eventFormData.image?.trim() || PRESET_EVENT_IMAGES[0].url,
      registration_open: Boolean(eventFormData.registration_open),
      speakers: (eventFormData.speakerName?.trim() || eventFormData.speakerRole?.trim())
        ? [
            {
              name: eventFormData.speakerName.trim() || 'Guest Speaker',
              role: eventFormData.speakerRole.trim() || 'Community Mentor',
              linkedin: eventFormData.speakerLinkedin?.trim() || 'https://www.linkedin.com/company/the-code-vibe/',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            },
          ]
        : [],
      agenda: formattedAgenda,
      registration_fields: eventFormData.registration_fields || EMPTY_EVENT_FORM.registration_fields,
    };

    if (isEditMode && editingEventId) {
      // Update Event
      const updated = await apiUpdateEvent(editingEventId, payload);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEventId ? { ...ev, ...updated } : ev))
      );
      setIsEventModalOpen(false);
      showToast(`✓ Event "${eventFormData.title}" updated successfully!`);
    } else {
      // Create Event
      const created = await apiCreateEvent(payload);
      setEvents((prev) => [created, ...prev]);
      setIsEventModalOpen(false);
      showToast(`🎉 Event "${created.title}" published live!`);
    }
  };

  // Toggle Event Registration (Open / Closed)
  const handleToggleRegistration = async (eventId) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newStatus = !targetEvent.registration_open;

    // Optimistic UI update
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registration_open: newStatus } : e
      )
    );

    await apiToggleEventRegistration(eventId);

    showToast(
      newStatus
        ? `🟢 Registration is now OPEN for "${targetEvent.title}"`
        : `🔴 Registration CLOSED for "${targetEvent.title}"`
    );
  };

  // Delete Event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will permanently remove it from the platform schedule.')) {
      return;
    }

    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    await apiDeleteEvent(eventId);
    showToast(`Event deleted successfully.`);
  };

  // Update Collaborator Application Status
  const handleUpdateAppStatus = async (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    await apiUpdateApplicationStatus(appId, newStatus);
    showToast(`Application ${appId} marked as ${newStatus}!`);
  };

  // -------------------------------------------------------------
  // VIEW: GATED ADMIN LOGIN
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 relative">
        <Toast
          message={toastMessage}
          visible={toastVisible}
          onClose={() => setToastVisible(false)}
        />

        <div className="w-full max-w-md rounded-3xl glass-elevated border border-white/90 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="h-1.5 w-full gradient-core-action -mx-8 -mt-8 mb-6" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-cyan-500/20 border border-purple-300/40 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono-sm text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
              RESTRICTED CONSOLE // SYS-OPS
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Admin &amp; Operations Gate
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mx-auto">
              Sign in with your verified administrator credentials to manage events, post workshops, open/close registrations, and review collaborator requests.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-mono-sm text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                  badge
                </span>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@thecodevibe.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none text-sm font-body-md"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                Master Security Key / Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none text-sm font-body-md"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-gradient-primary w-full py-3 rounded-xl font-label-ui text-sm font-semibold shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Authorize &amp; Access Admin Console</span>
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED ADMIN CONSOLE
  // -------------------------------------------------------------
  const filteredApps = applications.filter((app) => {
    if (appFilter === 'all') return true;
    return app.status.toLowerCase() === appFilter.toLowerCase();
  });

  const openRegistrationsCount = events.filter((e) => e.registration_open).length;
  const closedRegistrationsCount = events.length - openRegistrationsCount;
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
  const totalAttendees = events.reduce((sum, e) => sum + (Number(e.attendees) || 0), 0);

  return (
    <div className="flex flex-col w-full relative">
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-8 space-y-8">

        {/* Console Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#c2c6d7]/30">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono-sm text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                SYS-OPS // ROOT ACCESS ACTIVE
              </span>
              <span className="font-mono-sm text-xs text-on-surface-variant font-semibold">
                OPERATOR: {user?.name || 'Root Systems Operator'}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Admin Control &amp; Event Operations
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              Post, edit, and manage events in full detail, toggle registration gates, and review incoming collaborator intake applications.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn-gradient-primary shimmer-effect px-5 py-2.5 rounded-xl font-label-ui text-sm font-semibold shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Post New Event</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Bento Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bento-card space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant font-mono-sm text-xs uppercase font-semibold">
              <span>Total Events</span>
              <span className="material-symbols-outlined text-[#0056c5] text-lg">calendar_month</span>
            </div>
            <div className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">{events.length}</div>
            <div className="font-mono-sm text-xs text-[#006875] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              Platform Live
            </div>
          </div>

          <div className="p-5 rounded-2xl bento-card space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant font-mono-sm text-xs uppercase font-semibold">
              <span>Registration Status</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">lock_open</span>
            </div>
            <div className="font-headline-lg text-2xl sm:text-3xl text-emerald-600 font-bold">
              {openRegistrationsCount} Open
            </div>
            <div className="font-mono-sm text-xs text-on-surface-variant">
              {closedRegistrationsCount} Closed / Full
            </div>
          </div>

          <div className="p-5 rounded-2xl bento-card space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant font-mono-sm text-xs uppercase font-semibold">
              <span>Total Capacity</span>
              <span className="material-symbols-outlined text-[#9700c6] text-lg">groups</span>
            </div>
            <div className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">{totalCapacity}</div>
            <div className="font-mono-sm text-xs text-[#9700c6] font-semibold">
              {totalAttendees} spots confirmed
            </div>
          </div>

          <div className="p-5 rounded-2xl bento-card space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant font-mono-sm text-xs uppercase font-semibold">
              <span>Collaborator Queue</span>
              <span className="material-symbols-outlined text-[#006875] text-lg">person_search</span>
            </div>
            <div className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
              {applications.length} Requests
            </div>
            <div className="font-mono-sm text-xs text-emerald-600 font-semibold">
              {applications.filter((a) => a.status === 'Accepted').length} Accepted
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-[#c2c6d7]/30 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl font-label-ui text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'events'
                ? 'btn-gradient-primary shadow-xs'
                : 'bg-white/80 text-on-surface-variant hover:text-on-surface hover:bg-white border border-[#c2c6d7]/35'
            }`}
          >
            <span className="material-symbols-outlined text-base">event_note</span>
            <span>Manage &amp; Edit Events ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            className={`px-5 py-2.5 rounded-xl font-label-ui text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'registrations' ? 'btn-gradient-primary shadow-xs' : 'bg-white/80 text-on-surface-variant hover:text-on-surface hover:bg-white border border-[#c2c6d7]/35'}`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Event Registrations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collaborators')}
            className={`px-5 py-2.5 rounded-xl font-label-ui text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'collaborators'
                ? 'btn-gradient-primary shadow-xs'
                : 'bg-white/80 text-on-surface-variant hover:text-on-surface hover:bg-white border border-[#c2c6d7]/35'
            }`}
          >
            <span className="material-symbols-outlined text-base">handshake</span>
            <span>Collaborator Requests ({applications.length})</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: MANAGE & EDIT EVENTS
        ------------------------------------------------------------- */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Active Events Roster
              </h3>
              <span className="font-mono-sm text-xs text-on-surface-variant">
                Edit details, toggle registration gates, or preview live event pages
              </span>
            </div>

            {eventsLoading ? (
              <div className="p-12 text-center rounded-2xl glass-base border border-white/80">
                <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
                <p className="font-mono-sm text-xs text-on-surface-variant mt-2">Loading events roster...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-base border border-white/80 space-y-3">
                <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
                <p className="font-headline-sm text-on-surface font-bold">No Events Found</p>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="btn-gradient-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Post First Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {events.map((event) => {
                  const isOpen = Boolean(event.registration_open);
                  const capacity = Number(event.capacity) || 100;
                  const attendees = Number(event.attendees) || 0;
                  const pct = Math.min(100, Math.round((attendees / capacity) * 100));

                  return (
                    <div
                      key={event.id}
                      className="p-5 sm:p-6 rounded-2xl bento-card border border-white/85 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all hover:shadow-card-default"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-900/10 shrink-0 border border-white/80 shadow-xs">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-sm font-semibold bg-black/60 text-white backdrop-blur-md">
                              {event.category || 'Workshop'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface truncate">
                              {event.title}
                            </h4>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono-sm text-[11px] font-semibold border ${
                                isOpen
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                }`}
                              />
                              {isOpen ? 'Registration OPEN' : 'Registration CLOSED'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 font-mono-sm text-xs text-on-surface-variant">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#0056c5]">calendar_month</span>
                              <span>{event.date}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#0056c5]">schedule</span>
                              <span>{event.time}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#006875]">location_on</span>
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                          </div>

                          {/* Capacity progress & Live Page Preview */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 max-w-lg">
                            <div className="flex-1 max-w-xs space-y-1">
                              <div className="flex justify-between font-mono-sm text-[11px] text-on-surface-variant">
                                <span>Seats: {attendees} / {capacity}</span>
                                <span className="font-semibold text-primary">{pct}% full</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            <Link
                              to={`/events/${event.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 font-mono-sm text-xs text-[#0056c5] hover:underline shrink-0"
                            >
                              <span>Preview Page</span>
                              <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Edit, Toggle Registration, Delete) */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0 flex-wrap">
                        {/* Edit Event Details Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(event)}
                          className="btn-frosted-glass inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-label-ui text-xs font-semibold text-[#0056c5] shadow-xs cursor-pointer hover:border-[#0056c5]/40"
                          title="Edit Full Event Details"
                        >
                          <span className="material-symbols-outlined text-base text-[#0056c5]">edit</span>
                          <span>Edit Details</span>
                        </button>

                        {/* Toggle Registration button */}
                        <button
                          type="button"
                          onClick={() => handleToggleRegistration(event.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-label-ui text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer ${
                            isOpen
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {isOpen ? 'lock' : 'lock_open'}
                          </span>
                          <span>{isOpen ? 'Close Registration' : 'Open Registration'}</span>
                        </button>

                        {/* Delete event button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 shadow-xs transition-colors cursor-pointer"
                          title="Delete Event"
                          aria-label="Delete Event"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: COLLABORATOR REQUESTS
        ------------------------------------------------------------- */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Event Registrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {events.map(event => (
                <button key={event.id} type="button" onClick={async () => { setRegistrationEvent(event); setRegistrationsLoading(true); try { setEventRegistrations(await apiGetEventRegistrations(event.id)); } catch (err) { showToast(err.message); setEventRegistrations([]); } finally { setRegistrationsLoading(false); } }} className={`text-left p-4 rounded-xl border ${registrationEvent?.id === event.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white/70'}`}>
                  <span className="font-semibold text-sm text-on-surface">{event.title}</span>
                  <span className="block text-xs text-on-surface-variant mt-1">{event.date || 'Date TBA'}</span>
                </button>
              ))}
            </div>
            {registrationEvent && <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2"><h4 className="font-semibold text-on-surface">{registrationEvent.title} — Submissions</h4><span className="text-xs text-slate-500">{eventRegistrations.length} registered</span></div>
              {registrationsLoading ? <p className="text-sm text-slate-500">Loading registrations…</p> : eventRegistrations.length === 0 ? <p className="text-sm text-slate-500">No registrations found yet.</p> : eventRegistrations.map((entry, index) => <div key={entry.id || `${entry.email}-${index}`} className="p-3 rounded-xl bg-slate-50 border border-slate-100"><div className="font-semibold text-sm">{entry.name} <span className="font-normal text-slate-500">· {entry.email}</span></div><div className="text-xs text-slate-500 mt-1">{entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}</div>{Object.entries(entry.answers || {}).map(([key, value]) => <div key={key} className="text-sm mt-2"><span className="font-medium">{key}: </span>{String(value)}</div>)}</div>)}
            </div>}
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Contributor Intake Queue ({filteredApps.length})
                </h3>
                <p className="font-mono-sm text-xs text-on-surface-variant">
                  Builder requests submitted via the Collaborate portal
                </p>
              </div>

              {/* Status filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'Under Review', 'Pending', 'Accepted', 'Rejected'].map((statusKey) => (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => setAppFilter(statusKey)}
                    className={`px-3 py-1 rounded-full font-mono-sm text-xs font-semibold cursor-pointer transition-all ${
                      appFilter.toLowerCase() === statusKey.toLowerCase()
                        ? 'bg-[#0056c5] text-white shadow-xs'
                        : 'bg-white/80 text-on-surface-variant hover:text-on-surface border border-[#c2c6d7]/35'
                    }`}
                  >
                    {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-base border border-white/80 space-y-2">
                <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
                <p className="font-headline-sm text-on-surface font-bold">No Requests Found</p>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  No collaborator submissions match the selected filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredApps.map((app) => {
                  const isAccepted = app.status === 'Accepted';
                  const isRejected = app.status === 'Rejected';

                  const skillsList = Array.isArray(app.skills)
                    ? app.skills
                    : typeof app.skills === 'string' && app.skills
                    ? app.skills.split(',').map((s) => s.trim())
                    : [];

                  const goalsList = Array.isArray(app.goals)
                    ? app.goals
                    : typeof app.goals === 'string' && app.goals
                    ? app.goals.split(',').map((g) => g.trim())
                    : [];

                  const rawGithub = app.github || '';
                  const githubUrl = rawGithub
                    ? rawGithub.startsWith('http')
                      ? rawGithub
                      : `https://github.com/${rawGithub.replace('@', '').trim()}`
                    : '';

                  const rawPortfolio = app.portfolio || '';
                  const portfolioUrl = rawPortfolio
                    ? rawPortfolio.startsWith('http')
                      ? rawPortfolio
                      : `https://${rawPortfolio.trim()}`
                    : '';

                  return (
                    <div
                      key={app.id}
                      className="p-5 sm:p-7 rounded-3xl bento-card border border-white/85 space-y-4 transition-all hover:shadow-card-default"
                    >
                      {/* Top Bar: ID, Status, Timestamp & Quick Contact Links */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#c2c6d7]/20 pb-4">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono-sm text-xs font-bold text-primary px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                            {app.id}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full font-mono-sm text-xs font-semibold ${
                              isAccepted
                                ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
                                : isRejected
                                ? 'bg-rose-100/90 text-rose-800 border border-rose-300'
                                : 'bg-[rgba(0,229,255,0.12)] text-[#006875] border border-[rgba(0,229,255,0.30)]'
                            }`}
                          >
                            {app.status}
                          </span>
                          <span className="font-mono-sm text-xs text-outline">· Submitted {app.time || 'Recent'}</span>
                        </div>

                        {/* Direct Channel Badges (Email, GitHub, Discord, Portfolio) */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-sm">
                          {app.email && (
                            <a
                              href={`mailto:${app.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white text-on-surface-variant hover:text-[#0056c5] border border-[#c2c6d7]/40 transition-colors"
                              title="Send Email"
                            >
                              <span className="material-symbols-outlined text-sm text-[#0056c5]">mail</span>
                              <span>{app.email}</span>
                            </a>
                          )}

                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white text-on-surface-variant hover:text-black border border-[#c2c6d7]/40 transition-colors"
                              title="View GitHub Profile"
                            >
                              <span className="material-symbols-outlined text-sm text-black">code</span>
                              <span className="truncate max-w-[140px]">{rawGithub.replace('https://github.com/', '')}</span>
                              <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                            </a>
                          )}

                          {app.discord && (
                            <div
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200"
                              title="Discord Username"
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                              <span>{app.discord}</span>
                            </div>
                          )}

                          {portfolioUrl && (
                            <a
                              href={portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors"
                              title="View Portfolio"
                            >
                              <span className="material-symbols-outlined text-sm">language</span>
                              <span className="truncate max-w-[120px]">Portfolio</span>
                              <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Header Info: Applicant Name, Role & Experience */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
                              {app.fullName || app.name}
                            </h4>
                            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 text-[#0056c5] font-mono-sm text-xs font-semibold">
                              {app.role}
                            </span>
                          </div>
                        </div>

                        {app.experience && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#c2c6d7]/30 text-xs font-mono-sm text-on-surface-variant shrink-0">
                            <span className="material-symbols-outlined text-sm text-[#006875]">military_tech</span>
                            <span>{app.experience}</span>
                          </div>
                        )}
                      </div>

                      {/* Details Matrix: 4-Item Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-black/[0.02] border border-[#c2c6d7]/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm text-outline uppercase font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#0056c5]">location_on</span>
                            <span>Location / Timezone</span>
                          </div>
                          <p className="font-body-sm text-xs font-semibold text-on-surface truncate">
                            {app.location || 'Global / Remote'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/[0.02] border border-[#c2c6d7]/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm text-outline uppercase font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#006875]">schedule</span>
                            <span>Availability</span>
                          </div>
                          <p className="font-body-sm text-xs font-semibold text-on-surface truncate">
                            {app.availability || app.commitment || '5 - 10 hours / week'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/[0.02] border border-[#c2c6d7]/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm text-outline uppercase font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#9700c6]">forum</span>
                            <span>Communication</span>
                          </div>
                          <p className="font-body-sm text-xs font-semibold text-on-surface truncate">
                            {app.communicationPref || 'Async-first'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/[0.02] border border-[#c2c6d7]/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm text-outline uppercase font-semibold">
                            <span className="material-symbols-outlined text-sm text-emerald-600">rocket_launch</span>
                            <span>Target Pod</span>
                          </div>
                          <p className="font-body-sm text-xs font-semibold text-on-surface truncate">
                            {app.pod || 'General Intake'}
                          </p>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {skillsList.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm uppercase text-outline font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#0056c5]">terminal</span>
                            <span>Core Tech Skills &amp; Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skillsList.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-md bg-white border border-[#c2c6d7]/40 font-mono-sm text-xs text-on-surface font-semibold shadow-2xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Collaboration Goals */}
                      {goalsList.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm uppercase text-outline font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#006875]">track_changes</span>
                            <span>Collaboration Objectives</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {goalsList.map((goal, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.25)] text-[#006875] font-mono-sm text-xs font-medium"
                              >
                                <span className="material-symbols-outlined text-xs">check</span>
                                <span>{goal}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bio / Motivation Pitch */}
                      {(app.bio || app.pitch) && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm uppercase text-outline font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#0056c5]">description</span>
                            <span>Applicant Bio &amp; Introduction</span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-[#c2c6d7]/30 text-xs sm:text-sm font-body-sm text-on-surface leading-relaxed italic">
                            "{app.bio || app.pitch}"
                          </div>
                        </div>
                      )}

                      {/* Featured Work / Proof of Work */}
                      {app.featuredWork && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-sm uppercase text-outline font-semibold">
                            <span className="material-symbols-outlined text-sm text-[#9700c6]">stars</span>
                            <span>Featured Work &amp; Proof of Work</span>
                          </div>
                          <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/60 flex items-center justify-between gap-3 flex-wrap">
                            <div className="font-mono-sm text-xs text-purple-950 truncate max-w-xl">
                              {app.featuredWork}
                            </div>
                            {app.featuredWork.startsWith('http') && (
                              <a
                                href={app.featuredWork}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-mono-sm text-xs font-semibold text-purple-700 hover:underline shrink-0"
                              >
                                <span>Inspect Repo / Site</span>
                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c2c6d7]/20">
                        {app.status !== 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateAppStatus(app.id, 'Accepted')}
                            className="btn-gradient-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-label-ui text-xs font-semibold shadow-xs active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span>Approve Candidate</span>
                          </button>
                        )}

                        {app.status !== 'Rejected' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                            className="btn-frosted-glass inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 font-label-ui text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">cancel</span>
                            <span>Decline</span>
                          </button>
                        )}

                        {app.status !== 'Under Review' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateAppStatus(app.id, 'Under Review')}
                            className="px-3 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-black/5 font-label-ui text-xs font-semibold cursor-pointer"
                          >
                            Set Under Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            MODAL: POST OR EDIT FULL EVENT DETAILS
        ------------------------------------------------------------- */}
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/50 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div
              className="relative w-full max-w-3xl rounded-3xl glass-elevated border border-white/90 shadow-2xl overflow-hidden animate-scale-in my-8 max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full gradient-core-action shrink-0" />

              {/* Modal Header */}
              <div className="p-6 sm:p-7 border-b border-[#c2c6d7]/30 flex items-start justify-between shrink-0 bg-white/60">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono-sm text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                    {isEditMode ? 'SYS-OPS // EDIT EVENT RECORD' : 'SYS-OPS // PUBLISH NEW EVENT'}
                  </span>
                  <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface mt-1">
                    {isEditMode ? `Edit Event: ${eventFormData.title}` : 'Post & Publish New Event'}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    {isEditMode
                      ? 'Modify title, category, format, schedule, speaker, or seat capacity. Changes reflect instantly.'
                      : 'Configure all visible parameters for the community event calendar and deep-dive details page.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Modal Body: Scrollable Form */}
              <form onSubmit={handleEventFormSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
                
                {/* 1. Core Header Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold border-b border-[#c2c6d7]/20 pb-1">
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>1. Core Event Information</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                      placeholder="e.g. Distributed Consensus & Raft Internals in Rust"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none text-sm font-body-md"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Category
                      </label>
                      <select
                        value={eventFormData.category}
                        onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Tech Talk">Tech Talk</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Meetup">Meetup</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={eventFormData.categoryLabel}
                        onChange={(e) => setEventFormData({ ...eventFormData, categoryLabel: e.target.value })}
                        placeholder="e.g. Interactive Workshop"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Format / Status Pill
                      </label>
                      <input
                        type="text"
                        value={eventFormData.status}
                        onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                        placeholder="Online • Discord Live"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom registration form builder */}
                <div className="space-y-3 rounded-2xl border border-[#c2c6d7]/40 bg-white/65 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface">Registration Form Fields</h4>
                      <p className="text-xs text-on-surface-variant">These questions will appear when visitors click Register Now.</p>
                    </div>
                    <button type="button" onClick={() => setEventFormData(prev => ({ ...prev, registration_fields: [...(prev.registration_fields || []), { label: '', type: 'text', required: false }] }))} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">+ Add question</button>
                  </div>
                  {(eventFormData.registration_fields || []).map((field, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_auto_auto] gap-2 items-center">
                      <input value={field.label} onChange={e => setEventFormData(prev => ({ ...prev, registration_fields: prev.registration_fields.map((f, i) => i === index ? { ...f, label: e.target.value } : f) }))} placeholder="Question / field label" className="min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                      <select value={field.type || 'text'} onChange={e => setEventFormData(prev => ({ ...prev, registration_fields: prev.registration_fields.map((f, i) => i === index ? { ...f, type: e.target.value } : f) }))} className="px-2 py-2 rounded-lg border border-slate-200 text-sm"><option value="text">Short text</option><option value="email">Email</option><option value="tel">Phone</option><option value="textarea">Long answer</option></select>
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={Boolean(field.required)} onChange={e => setEventFormData(prev => ({ ...prev, registration_fields: prev.registration_fields.map((f, i) => i === index ? { ...f, required: e.target.checked } : f) }))} /> Required</label>
                      <button type="button" onClick={() => setEventFormData(prev => ({ ...prev, registration_fields: prev.registration_fields.filter((_, i) => i !== index) }))} className="text-red-600 text-xs px-2 py-2">Remove</button>
                    </div>
                  ))}
                </div>

                {/* 2. Date, Time, Venue & Seats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold border-b border-[#c2c6d7]/20 pb-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>2. Date, Timing, Venue &amp; Registration Gate</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Date
                      </label>
                      <input
                        type="text"
                        value={eventFormData.date}
                        onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                        placeholder="e.g. Dec 28, 2025"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Time
                      </label>
                      <input
                        type="text"
                        value={eventFormData.time}
                        onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                        placeholder="e.g. 6:00 PM – 8:30 PM PST"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Location / Stage
                      </label>
                      <input
                        type="text"
                        value={eventFormData.location}
                        onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                        placeholder="Online / Discord Stage"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Total Capacity (Max Seats)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={eventFormData.capacity}
                        onChange={(e) => setEventFormData({ ...eventFormData, capacity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Current Attendees (RSVPs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={eventFormData.attendees}
                        onChange={(e) => setEventFormData({ ...eventFormData, attendees: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="pt-4 sm:pt-6">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-[#c2c6d7]/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventFormData.registration_open}
                          onChange={(e) => setEventFormData({ ...eventFormData, registration_open: e.target.checked })}
                          className="w-4 h-4 accent-[#0056c5] rounded cursor-pointer"
                        />
                        <span className="font-label-ui text-xs font-semibold text-on-surface">
                          Registration Open
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. Description & Abstract */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold border-b border-[#c2c6d7]/20 pb-1">
                    <span className="material-symbols-outlined text-base">description</span>
                    <span>3. Curriculum &amp; Overview Description</span>
                  </div>

                  <textarea
                    rows={3}
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    placeholder="Provide a detailed description of what builders will learn and master..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md resize-none"
                  />
                </div>

                {/* 4. Cover Image */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold border-b border-[#c2c6d7]/20 pb-1">
                    <span className="material-symbols-outlined text-base">image</span>
                    <span>4. Cover Image</span>
                  </div>

                  <input
                    type="url"
                    value={eventFormData.image}
                    onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2 rounded-xl bg-white/90 border border-[#c2c6d7]/50 text-xs font-mono-sm outline-none text-on-surface"
                  />

                  {/* Image Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-mono-sm text-[11px] text-outline">Presets:</span>
                    {PRESET_EVENT_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEventFormData({ ...eventFormData, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg font-mono-sm text-[11px] font-semibold border transition-all cursor-pointer ${
                          eventFormData.image === preset.url
                            ? 'bg-[#0056c5] text-white border-[#0056c5]'
                            : 'bg-white/80 text-on-surface-variant hover:bg-white border-[#c2c6d7]/40'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Host & Speaker Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold border-b border-[#c2c6d7]/20 pb-1">
                    <span className="material-symbols-outlined text-base">person</span>
                    <span>5. Session Host &amp; Mentor (Displayed in Sidebar)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Host Name
                      </label>
                      <input
                        type="text"
                        value={eventFormData.speakerName}
                        onChange={(e) => setEventFormData({ ...eventFormData, speakerName: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        Host Role &amp; Company
                      </label>
                      <input
                        type="text"
                        value={eventFormData.speakerRole}
                        onChange={(e) => setEventFormData({ ...eventFormData, speakerRole: e.target.value })}
                        placeholder="e.g. Lead Systems Architect @ VibeCore"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={eventFormData.speakerLinkedin}
                        onChange={(e) => setEventFormData({ ...eventFormData, speakerLinkedin: e.target.value })}
                        placeholder="https://www.linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-sm font-body-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Dynamic Live Schedule & Timeline Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#c2c6d7]/20 pb-1">
                    <div className="flex items-center gap-2 text-xs font-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
                      <span className="material-symbols-outlined text-base">pace</span>
                      <span>6. Schedule &amp; Timeline Milestones ({eventFormData.agenda?.length || 0})</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAgendaItem}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0056c5] font-mono-sm text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                      title="Add Milestone"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Define the session flow. You can add more timeline milestones or remove items to customize the duration.
                  </p>

                  <div className="space-y-3">
                    {(eventFormData.agenda || []).map((milestone, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/80 border border-[#c2c6d7]/40 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3 transition-all hover:border-[#0056c5]/40"
                      >
                        {/* Step indicator */}
                        <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0056c5]/10 text-[#0056c5] font-mono-sm text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-mono-sm text-outline sm:hidden">Milestone {idx + 1}</span>
                          
                          {/* Mobile delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveAgendaItem(idx)}
                            className="sm:hidden p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove this milestone"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>

                        {/* Timing input */}
                        <div className="sm:w-44 shrink-0">
                          <input
                            type="text"
                            value={milestone.time}
                            onChange={(e) => handleAgendaChange(idx, 'time', e.target.value)}
                            placeholder="e.g. 11:00 AM (30 mins)"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-xs font-mono-sm"
                          />
                        </div>

                        {/* Description input */}
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={milestone.desc}
                            onChange={(e) => handleAgendaChange(idx, 'desc', e.target.value)}
                            placeholder="e.g. Architecture Overview, Live Pairing & Q&A"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#c2c6d7]/50 focus:border-[#0056c5] outline-none text-xs font-body-md"
                          />
                        </div>

                        {/* Desktop delete / reduce button */}
                        <div className="hidden sm:flex items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveAgendaItem(idx)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Remove this milestone"
                            aria-label={`Remove milestone #${idx + 1}`}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Button to add more timeline milestones */}
                    <button
                      type="button"
                      onClick={handleAddAgendaItem}
                      className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-[#0056c5]/30 hover:border-[#0056c5] text-[#0056c5] hover:bg-[#0056c5]/5 font-mono-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add_circle</span>
                      <span>+ Add More Timeline Milestones</span>
                    </button>
                  </div>
                </div>

                {/* Form Action Footer */}
                <div className="pt-4 border-t border-[#c2c6d7]/30 flex items-center justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-md p-2 -mx-2 -mb-2 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-label-ui text-xs sm:text-sm text-on-surface-variant hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-gradient-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-label-ui text-xs sm:text-sm font-semibold shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isEditMode ? 'save' : 'send'}
                    </span>
                    <span>{isEditMode ? 'Save & Update Event Details' : 'Publish Event to Live Schedule'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
