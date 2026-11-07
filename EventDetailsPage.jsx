import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { apiRsvpEvent, apiGetEvent } from '../services/api';
import { EVENTS_PAGE_ITEMS } from '../data/mockData';

/**
 * EventDetailsPage Component
 * Deep-dive technical masterclass page — fully mobile-responsive with verified RSVP flow and cover image.
 */
export default function EventDetailsPage() {
  const { id } = useParams();
  const { requireAuth, user } = useAuth();
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationAnswers, setRegistrationAnswers] = useState({});
  const [registrationSubmitting, setRegistrationSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Match event by URL parameter or fallback to default (mock), then hydrate from API
  const matchedEvent = EVENTS_PAGE_ITEMS.find((e) => e.id === id);
  const [eventData, setEventData] = useState(() => matchedEvent || {
    id: 'wasm-memory-safety',
    title: 'Rust for TypeScript Devs: WASM & Memory Safety',
    description: 'Bridging async event loops, zero-copy byte buffers, and compiling multi-threaded Web Workers via wasm-bindgen for line-rate browser computation.',
    date: 'Sep 12, 2025',
    time: '11:00 AM – 02:00 PM PST',
    category: 'workshop',
    categoryLabel: 'Interactive Workshop',
    status: 'Online • Discord Live',
    location: 'Online / Discord Stage',
    capacity: 120,
    attendees: 84,
    registration_open: true,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  });

  // Prefer backend event when available (uses Vite proxy / configured API base)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const fromApi = await apiGetEvent(id);
      if (!cancelled && fromApi && fromApi.id) {
        setEventData((prev) => ({ ...prev, ...fromApi }));
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const currentEvent = eventData;
  const isRegistrationClosed = currentEvent.registration_open === false;

  const host = (currentEvent.speakers && currentEvent.speakers[0]) || {
    name: currentEvent.speakerName || 'Elena Rostova',
    role: currentEvent.speakerRole || 'Lead Systems Architect @ VibeCore',
    avatar: currentEvent.speakerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    linkedin: currentEvent.speakerLinkedin || 'https://www.linkedin.com/company/the-code-vibe/',
  };

  const agendaMilestones = (currentEvent.agenda && currentEvent.agenda.length > 0)
    ? currentEvent.agenda
    : [
        {
          dot: 'bg-[#0056c5]',
          time: 'Part 1 • Architecture, Setup & Core Archetype',
          duration: '30 mins',
          durationColor: 'text-[#0056c5]',
          desc: 'Deconstructing toolchain dependencies, memory boundary models, and initial project scaffolding.',
        },
        {
          dot: 'bg-[#00E5FF]',
          time: 'Part 2 • Hands-On Pairing & Code Synthesis',
          duration: '75 mins',
          durationColor: 'text-[#006875]',
          desc: 'Collaborative code implementation, pair programming exercises, and live execution.',
        },
        {
          dot: 'bg-[#B324E5]',
          time: 'Part 3 • Stress Tests, Benchmarking & Open Q&A',
          duration: '45 mins',
          durationColor: 'text-[#9700c6]',
          desc: 'Real-time performance metrics, browser profiling, architectural review, and open questions.',
        },
      ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const toggleRsvp = () => {
    if (isRsvpd) {
      setIsRsvpd(false);
      showToast('Registration cancelled.');
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    requireAuth(async (verifiedUser) => {
      setRegistrationSubmitting(true);
      try {
        await apiRsvpEvent(currentEvent.id, verifiedUser.name, verifiedUser.email, 'Developer', registrationAnswers);
        setIsRsvpd(true);
        setShowRegistrationForm(false);
        showToast(`Registration submitted successfully for ${currentEvent.title}!`);
      } catch (error) {
        showToast(error.message || 'Could not submit registration. Please try again.');
      } finally {
        setRegistrationSubmitting(false);
      }
    }, `Sign in with your profile to register for ${currentEvent.title}.`, currentEvent.title);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('Event URL copied to your clipboard!');
  };

  const seatsFilled = isRsvpd ? 85 : 84;
  const seatsTotal = 120;
  const percentage = Math.round((seatsFilled / seatsTotal) * 100);

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Top Bar: Navigation */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            to="/events"
            className="btn-frosted-glass inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-label-ui text-label-ui shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Hero Masthead Banner with Event Image */}
        <div className="relative rounded-3xl glass-base border-t border-l border-white/80 border-r border-b border-[#c2c6d7]/35 p-5 sm:p-8 lg:p-10 shadow-card-default overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Details & Actions */}
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              {/* Badges & Temporal Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[rgba(179,36,229,0.12)] border border-[rgba(179,36,229,0.30)] text-[#9700c6] font-mono-sm text-xs tracking-wide uppercase font-semibold">
                  {currentEvent.categoryLabel || 'Workshop'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875] font-mono-sm text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  {currentEvent.status || 'Online • Discord Live'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-white/90 text-on-surface-variant font-mono-sm text-xs shadow-xs">
                  <span className="material-symbols-outlined text-sm text-[#0056c5]">schedule</span>
                  {currentEvent.date} • {currentEvent.time}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight font-bold leading-tight">
                  {currentEvent.title}
                </h1>
                <p className="font-body-md text-body-md sm:font-body-lg sm:text-body-lg text-on-surface-variant leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                {isRegistrationClosed ? (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-label-ui text-label-ui bg-rose-50 text-rose-700 border border-rose-300 cursor-not-allowed opacity-90"
                  >
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <span>Registration Closed</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={toggleRsvp}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-label-ui text-label-ui shadow-sm active:scale-95 transition-all cursor-pointer ${
                      isRsvpd ? 'bg-[#006875] text-white' : 'btn-gradient-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isRsvpd ? 'check_circle' : 'event_available'}
                    </span>
                    <span>{isRsvpd ? 'Verified Spot Confirmed ✓' : 'RSVP • Register Free'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share Event"
                  className="btn-frosted-glass w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-label-ui text-label-ui shadow-xs cursor-pointer"
                  title="Share event"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                  <span>Share Event</span>
                </button>
              </div>

              {showRegistrationForm && !isRsvpd && (
                <form onSubmit={handleRegistrationSubmit} className="mt-5 p-4 sm:p-5 rounded-2xl bg-white/85 border border-[#c2c6d7]/50 space-y-4">
                  <div><h3 className="font-semibold text-on-surface">Event Registration</h3><p className="text-xs text-on-surface-variant mt-1">Sign in to submit your details. Required questions are marked.</p></div>
                  {(currentEvent.registration_fields || []).filter(field => !['full name', 'name', 'email', 'email address'].includes((field.label || '').trim().toLowerCase())).map((field, index) => (
                    <label key={`${field.label}-${index}`} className="block space-y-1">
                      <span className="text-sm font-medium text-on-surface">{field.label}{field.required ? ' *' : ''}</span>
                      {field.type === 'textarea' ? <textarea required={Boolean(field.required)} value={registrationAnswers[field.label] || ''} onChange={e => setRegistrationAnswers(prev => ({ ...prev, [field.label]: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm" /> : <input type={['email','tel'].includes(field.type) ? field.type : 'text'} required={Boolean(field.required)} value={registrationAnswers[field.label] || ''} onChange={e => setRegistrationAnswers(prev => ({ ...prev, [field.label]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm" />}
                    </label>
                  ))}
                  <div className="flex flex-wrap gap-2"><button type="submit" disabled={registrationSubmitting} className="btn-gradient-primary px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">{registrationSubmitting ? 'Submitting…' : 'Submit Registration'}</button><button type="button" onClick={() => setShowRegistrationForm(false)} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm">Cancel</button></div>
                </form>
              )}
            </div>

            {/* Right Column: Event Cover Image Banner */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden border border-white/85 shadow-card-default group aspect-video sm:aspect-16/10 lg:aspect-4/3 bg-slate-900/10">
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-mono-sm text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                    {currentEvent.status || 'Live Online'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 font-semibold">
                    {currentEvent.categoryLabel || 'Workshop'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Curriculum & Agenda */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">

            {/* Live Workshop Schedule */}
            <div className="rounded-xl bento-card p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(179,36,229,0.12)] text-[#9700c6] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">pace</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Live Workshop Schedule
                  </h2>
                </div>
                <span className="font-mono-sm text-mono-sm text-on-surface-variant font-semibold text-xs">
                  {agendaMilestones.length} Milestones
                </span>
              </div>

              <div className="relative pl-5 sm:pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#c2c6d7]/35">
                {agendaMilestones.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-5 sm:-left-6 top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${item.dot || 'bg-[#0056c5]'} ring-4 ring-white`} />
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-label-ui text-label-ui text-on-surface font-bold text-sm sm:text-base leading-snug">
                        {item.time}
                      </h3>
                      <span className={`font-mono-sm text-xs font-semibold shrink-0 ${item.durationColor || 'text-[#0056c5]'}`}>
                        {item.duration || ''}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="rounded-xl bento-card p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.12)] text-[#006875] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">checklist</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Prerequisites &amp; Setup
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { title: 'Modern TypeScript & Node 20+', desc: 'Familiarity with Promises, typed generics, and browser ArrayBuffers.' },
                  { title: 'Zero Prior Rust Required', desc: 'We start from syntax zero and bridge incrementally to safety guarantees.' },
                  { title: 'Dev Environment Options', desc: 'Local cargo + wasm-pack or one-click zero-install browser container.' },
                  { title: 'Discord Audio Enabled', desc: 'Live Q&A microphone queue enabled for interactive code review.' },
                ].map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-white/70 border border-white/80 shadow-xs">
                    <span className="material-symbols-outlined text-[#006875] text-xl mt-0.5 shrink-0">check_circle</span>
                    <div>
                      <p className="font-label-ui text-label-ui text-on-surface font-semibold">{req.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Guidelines */}
            <div className="rounded-xl bento-card p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(179,36,229,0.12)] text-[#9700c6] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">gavel</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Rules &amp; Guidelines
                  </h2>
                </div>
                <span className="font-mono-sm text-xs text-[#9700c6] bg-[rgba(179,36,229,0.12)] border border-[rgba(179,36,229,0.25)] px-2.5 py-1 rounded font-semibold">
                  Event Guidelines
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { title: 'Code of Conduct & Mutual Respect', desc: 'Zero-tolerance harassment policy; maintain an inclusive, constructive, and ego-free technical discussion culture.', icon: 'handshake' },
                  { title: 'Active Participation & Mic Etiquette', desc: 'Keep microphones muted during presentations; open audio and pair discussions during pair-programming breakouts.', icon: 'mic_external_on' },
                  { title: 'Original Work & Collaboration', desc: 'Fork responsibly with open-source spirit; appropriately credit paired solutions and shared crate dependencies.', icon: 'fork_right' },
                  { title: 'Recording & Distribution Policy', desc: 'Session is archived for registered participants; re-streaming, mirroring, or external unauthorized distribution is prohibited.', icon: 'videocam_off' },
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-white/70 border border-white/80 shadow-xs">
                    <span className="material-symbols-outlined text-[#0056c5] text-xl mt-0.5 shrink-0">{rule.icon}</span>
                    <div>
                      <p className="font-label-ui text-label-ui text-on-surface font-semibold">{rule.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Event Specs Card */}
          <div className="lg:col-span-4">
            <div className="rounded-xl bento-card p-5 sm:p-6 space-y-5 lg:sticky lg:top-24">

              {/* Admission */}
              <div className="flex items-center justify-between pb-4 border-b border-[#c2c6d7]/30">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">
                  Admission Fee
                </span>
                <span className="font-headline-sm text-headline-sm text-[#0056c5] font-bold">
                  Free • Open Source
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-ui text-label-ui text-on-surface font-semibold text-sm">
                    Seat Availability
                  </span>
                  <span className="font-mono-sm text-xs text-[#0056c5] font-bold">
                    {seatsFilled} / {seatsTotal} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/5 overflow-hidden border border-[#c2c6d7]/30">
                  <div
                    className="h-full gradient-core-action rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-right text-xs">
                  {seatsTotal - seatsFilled} slots remaining
                </p>
              </div>

              {/* Register CTA — sticky reminder on mobile */}
              {isRegistrationClosed ? (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-label-ui text-label-ui bg-rose-50 text-rose-700 border border-rose-300 cursor-not-allowed opacity-90"
                >
                  <span className="material-symbols-outlined text-lg">lock</span>
                  <span>Registration Closed</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleRsvp}
                  className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-label-ui text-label-ui shadow-sm active:scale-95 transition-all cursor-pointer ${
                    isRsvpd ? 'bg-[#006875] text-white' : 'btn-gradient-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isRsvpd ? 'check_circle' : 'event_available'}
                  </span>
                  <span>{isRsvpd ? 'Verified Spot Confirmed ✓' : 'Register Free'}</span>
                </button>
              )}

              {/* Host Profile */}
              <div className="space-y-3 pt-1 border-t border-[#c2c6d7]/20">
                <span className="font-label-ui text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Session Host &amp; Mentor
                </span>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/70 border border-white/80 shadow-xs">
                  <img
                    className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-[#0056c5]/20 shrink-0"
                    src={host.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={host.name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-label-ui text-label-ui text-on-surface font-bold truncate">{host.name}</h4>
                      <span className="material-symbols-outlined text-sm text-[#0056c5] shrink-0" title="Verified Mentor">verified</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {host.role}
                    </p>
                  </div>
                  <a
                    href={host.linkedin || 'https://www.linkedin.com/company/the-code-vibe/'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Speaker LinkedIn Profile"
                    className="p-2 rounded-lg bg-white hover:bg-black/5 text-on-surface transition-colors border border-[#c2c6d7]/35 shrink-0"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current text-[#0056c5]" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Attendee Avatars */}
              <div className="space-y-3 border-t border-[#c2c6d7]/20 pt-1">
                <span className="font-label-ui text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Confirmed Attendees
                </span>
                <div className="flex items-center -space-x-2 overflow-hidden py-1">
                  {[
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDyuVx_d7jSI4eKcNT-HnXOtS7osOz_D-zjSjTPwJm6r5FVkIaYJu8ROcCoyl4YutObKhxihlJdtxTtxgfIQCtIGu4xH155rF6pK-VIaP92os1u_b8Gdviogsib4yBkI16_hG0F8buJ33uda__jWwAEGn_hr191O9_sjEZbYG-cosQ4piHHkHWPbckTPxYc9l5SN_VbBWX4c14Rd3DCR6JEQdBF5AO9sm1TYn0z9W9F6WVe_kJq3zhV',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMatR1C58aEQehxgaWQy2NC4rqGKINntASz8WsdeP0NCJ4Ki6wDHpgGmXgLW9RDGegzIE9D4CZhb3BjwlvNVmpEFs_HLb3aCVQmi2QvV_kOCyCOuOqrUJNk9d-eG_KYELtRzFeiP1FWeqne-nmKbOduBfb-izvVHw1Fz4rYaXtZ5U1-S_sl-3gK2n_l33b0tV2CxyXnkDycW5CgHDAdb05YezQTB7ZS_xuM4nWPM',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src={src}
                      alt="Peer"
                    />
                  ))}
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#0056c5] text-white ring-2 ring-white font-mono-sm text-xs font-bold">
                    +79
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
