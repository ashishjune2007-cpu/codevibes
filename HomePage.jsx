import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import FaqAccordion from '../components/ui/FaqAccordion';
import Toast from '../components/ui/Toast';
import { useReveal, useRevealGroup } from '../hooks/useReveal';
import { useAuth } from '../context/AuthContext';
import { apiRsvpEvent } from '../services/api';
import {
  PLATFORM_STATS,
  WHAT_WE_DO_CARDS,
  FEATURED_EVENTS_HOME,
  WHY_JOIN_REASONS,
  HOME_FAQ_ITEMS,
} from '../data/mockData';

export default function HomePage() {
  const { openJoinModal } = useOutletContext();
  const { requireAuth, user } = useAuth();
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // Reveal refs — section headings & content blocks
  const heroTextRef    = useReveal({ threshold: 0.1 });
  const heroStatsRef   = useReveal({ threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  const whatWeDoRef    = useReveal({ threshold: 0.1 });
  const whatWeDoCards  = useRevealGroup({ staggerMs: 110 });
  const eventsRef      = useReveal({ threshold: 0.1 });
  const eventsCards    = useRevealGroup({ staggerMs: 130 });
  const whyJoinRef     = useReveal({ threshold: 0.1 });
  const whyJoinCards   = useRevealGroup({ staggerMs: 110 });
  const faqRef         = useReveal({ threshold: 0.08 });
  const bannerRef      = useReveal({ threshold: 0.1 });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const handleRegisterEvent = (eventId, eventTitle) => {
    if (registeredEventIds.includes(eventId)) {
      setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
      showNotification(`Unregistered from ${eventTitle}.`);
      return;
    }

    requireAuth(
      (verifiedUser) => {
        setRegisteredEventIds((prev) => [...prev, eventId]);
        apiRsvpEvent(eventId, verifiedUser.name, verifiedUser.email);
        showNotification(`🎉 Verified: ${verifiedUser.name} registered for ${eventTitle}! Confirmation sent to ${verifiedUser.email}.`);
      },
      `Please log in to confirm your verified spot for "${eventTitle}".`,
      eventTitle
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden hero-mesh-canvas">
        {/* Animated background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[rgba(0,229,255,0.10)] blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: '0s' }} />
        <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-[rgba(179,36,229,0.08)] blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[rgba(41,121,255,0.07)] blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: '3s' }} />

        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 flex flex-col items-center text-center">

          {/* Badge */}
          <div className="animate-fade-in-down delay-100 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              Student Builder Community
            </span>
          </div>

          {/* Main Typography Hero */}
          <div ref={heroTextRef} className="reveal-ready">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-on-surface max-w-4xl tracking-tight leading-tight font-bold font-display">
              More Than Code. <br />
              <span className="gradient-text-animated">
                A Community That Builds Together.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-on-surface-variant leading-relaxed mx-auto">
              A community for developers to explore technology, build meaningful projects, participate in events, and collaborate with people who share their passion for creating.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-primary shimmer-effect group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-label-ui text-label-ui shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Join the Community</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
                  arrow_forward
                </span>
              </a>
              <Link
                to="/events"
                className="btn-frosted-glass shimmer-effect inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-ui text-label-ui shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-base text-[#0056c5]">
                  calendar_month
                </span>
                <span>Explore Events</span>
              </Link>
            </div>
          </div>

          {/* Stats Strip */}
          <div
            ref={heroStatsRef}
            className="reveal-ready w-full mt-10 sm:mt-16 p-1.5 rounded-2xl sm:rounded-3xl glass-base border-t border-l border-white/80 border-r border-b border-[#c2c6d7]/35 shadow-card-default"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 py-4 sm:py-6 px-3 sm:px-6 bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl">
              {PLATFORM_STATS.map((stat, idx) => (
                <StatCard
                  key={idx}
                  value={stat.value}
                  label={stat.label}
                  color={stat.color}
                  hasBorder={idx < PLATFORM_STATS.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════
          WHAT WE DO SECTION
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-24 relative" id="what-we-do">
        <div ref={whatWeDoRef} className="reveal-ready text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              What We Do
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            More Than Just a{' '}
            <span className="gradient-text-radiant">
              Coding Community.
            </span>
          </h2>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            From high-energy build challenges and deep tech talks to hands-on learning labs and peer pods—discover the four core activities powering our builder collective.
          </p>
        </div>

        {/* 4 Activity Cards — staggered reveal */}
        <div ref={whatWeDoCards} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_WE_DO_CARDS.map((card) => (
            <Link
              key={card.id}
              to={card.link || '/events'}
              className="reveal-ready group relative rounded-3xl bento-card-premium p-7 flex flex-col justify-between block"
            >
              {/* Radial Ambient Glow */}
              <div
                className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: card.cardGlow }}
              />

              {/* Watermark Index */}
              <span className="absolute top-5 right-6 font-mono-lg text-3xl font-extrabold text-[#c2c6d7]/30 group-hover:text-[#0056c5]/25 transition-colors duration-300 select-none pointer-events-none z-0">
                {card.index}
              </span>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-white via-white/80 to-[#c2c6d7]/40 shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center ${card.iconGlow}`}
                      >
                        <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-300">
                          {card.icon}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 inline-flex">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-sm text-mono-sm font-semibold tracking-wider uppercase border shadow-xs ${card.badgeBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${card.badgeDot} animate-pulse`} />
                      {card.category}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight group-hover:text-[#0056c5] transition-colors duration-300">
                    {card.title}
                  </h3>

                  <p className="mt-2.5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Bottom Shimmer Bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          UPCOMING EVENTS SECTION
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-24" id="upcoming-events">
        <div ref={eventsRef} className="reveal-ready text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              Upcoming Events
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            What's Happening at <span className="gradient-text-radiant">The Code Vibe?</span>
          </h2>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Explore upcoming hackathons, technical talks, interactive workshops, and high-velocity competitions.
          </p>
        </div>

        {/* View all link */}
        <div className="flex justify-end mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-label-ui text-label-ui text-[#0056c5] hover:underline group"
          >
            <span>View all scheduled events</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </Link>
        </div>

        {FEATURED_EVENTS_HOME.length === 0 ? (
          <div className="p-12 sm:p-16 text-center rounded-3xl glass-base border-t border-l border-white/90 border-r border-b border-[#c2c6d7]/35 shadow-card-default max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/90 border border-white/80 shadow-xs flex items-center justify-center text-[#0056c5] mx-auto">
              <span className="material-symbols-outlined text-3xl">event_upcoming</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Coming Soon</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                No events currently announced. Stay tuned!
              </p>
            </div>
          </div>
        ) : (
          <div ref={eventsCards} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_EVENTS_HOME.slice(0, 3).map((event) => {
              const isRegistered = registeredEventIds.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="reveal-ready group rounded-3xl bg-white/85 backdrop-blur-2xl border-t border-l border-white/95 border-r border-b border-[#c2c6d7]/40 overflow-hidden shadow-card-default hover:shadow-glow-cyan transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-sm text-xs font-semibold tracking-wider uppercase border shadow-xs backdrop-blur-md bg-white/90 ${event.badgeBg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${event.badgeDot} animate-pulse`} />
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono-sm font-semibold text-[#0056c5] mb-2">
                        <span className="material-symbols-outlined text-base">calendar_month</span>
                        <span>{event.date}</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-[#0056c5] transition-colors line-clamp-2 mb-2">
                        {event.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Register Button */}
                  <div className="p-6 pt-2 border-t border-[#c2c6d7]/20 mt-2">
                    <button
                      type="button"
                      onClick={() => handleRegisterEvent(event.id, event.title)}
                      className={`w-full py-2.5 px-4 rounded-xl font-label-ui text-label-ui font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                          : 'btn-gradient-primary shimmer-effect shadow-sm active:scale-95'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isRegistered ? 'check_circle' : 'how_to_reg'}
                      </span>
                      <span>{isRegistered ? 'Verified Registration ✓' : 'Register Now'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          WHY JOIN SECTION
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-24" id="why-join">
        <div ref={whyJoinRef} className="reveal-ready text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              Why Join The Code Vibe?
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Be Part of <span className="gradient-text-radiant">Something Creative.</span>
          </h2>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Join a vibrant ecosystem where curiosity meets execution. Build meaningful software, learn from peers, and accelerate your engineering journey.
          </p>
        </div>

        {/* 4 Reasons Cards — staggered */}
        <div ref={whyJoinCards} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_JOIN_REASONS.map((reason) => (
            <div
              key={reason.id}
              className="reveal-ready group relative rounded-3xl bento-card-premium p-7 flex flex-col justify-between"
            >
              {/* Radial Glow */}
              <div
                className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: reason.cardGlow }}
              />

              {/* Watermark */}
              <span className="absolute top-5 right-6 font-mono-lg text-3xl font-extrabold text-[#c2c6d7]/30 group-hover:text-[#0056c5]/25 transition-colors duration-300 select-none pointer-events-none z-0">
                {reason.index}
              </span>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-white via-white/80 to-[#c2c6d7]/40 shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} text-white flex items-center justify-center ${reason.iconGlow}`}
                      >
                        <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-300">
                          {reason.icon}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 inline-flex">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-sm text-mono-sm font-semibold tracking-wider uppercase border shadow-xs ${reason.badgeBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${reason.badgeDot} animate-pulse`} />
                      {reason.tagline}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight group-hover:text-[#0056c5] transition-colors duration-300">
                    {reason.benefit}
                  </h3>

                  <p className="mt-2.5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>

              {/* Bottom Shimmer Bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24" id="faq">
        <div ref={faqRef} className="reveal-ready text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              5. FAQ
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Frequently Asked <span className="gradient-text-radiant">Questions.</span>
          </h2>
          <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Everything you need to know about joining, building projects, and connecting with The Code Vibe community.
          </p>
        </div>

        <FaqAccordion items={HOME_FAQ_ITEMS} />
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM BANNER — JOIN ACTION
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20">
        <div
          ref={bannerRef}
          className="reveal-ready p-8 sm:p-10 rounded-3xl relative overflow-hidden glass-base border-t border-l border-white/90 border-r border-b border-[#c2c6d7]/35 shadow-card-default flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          {/* Gradient glow blobs in banner */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[rgba(0,229,255,0.12)] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[rgba(179,36,229,0.10)] blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Ready to start your journey with The Code Vibe?
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Connect with 12,400+ student developers and builders shipping real projects.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient-primary shimmer-effect inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-ui text-label-ui font-semibold shadow-glow-cyan active:scale-95 cursor-pointer shrink-0 relative z-10 group"
          >
            <span>Join the Community</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
          </a>
        </div>
      </section>
    </div>
  );
}
