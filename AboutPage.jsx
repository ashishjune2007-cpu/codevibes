import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ABOUT_BELIEFS, TEAM_MEMBERS } from '../data/mockData';
import { useReveal, useRevealGroup } from '../hooks/useReveal';

export default function AboutPage() {
  const { openJoinModal } = useOutletContext();

  // Reveal refs
  const whoWeAreRef    = useReveal({ threshold: 0.1 });
  const whoTextRef     = useReveal({ threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  const beliefsRef     = useReveal({ threshold: 0.1 });
  const beliefsCards   = useRevealGroup({ staggerMs: 130 });
  const teamRef        = useReveal({ threshold: 0.1 });
  const joinRef        = useReveal({ threshold: 0.1 });

  return (
    <div className="flex flex-col w-full relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Page-level ambient blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full bg-[rgba(179,36,229,0.05)] blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full bg-[rgba(0,229,255,0.06)] blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-10 lg:py-16 space-y-16 sm:space-y-24">

        {/* ═════════════════════════════
            1. WHO WE ARE
        ═════════════════════════════ */}
        <section className="relative flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto pt-6">
          <div
            ref={whoWeAreRef}
            className="reveal-ready inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip shadow-xs text-on-surface"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
              1. Who We Are
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 font-headline-xl text-headline-xl sm:font-display-hero sm:text-display-hero text-on-surface tracking-tight font-bold">
            A Little About <span className="gradient-text-animated">The Code Vibe</span>
          </h1>

          <div
            ref={whoTextRef}
            className="reveal-ready w-full p-8 sm:p-10 rounded-3xl glass-base border-t border-l border-white/90 border-r border-b border-[#c2c6d7]/35 shadow-card-default relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[rgba(0,229,255,0.12)] blur-3xl pointer-events-none group-hover:opacity-150 transition-opacity" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[rgba(179,36,229,0.07)] blur-3xl pointer-events-none" />
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-center relative z-10 max-w-3xl mx-auto">
              The Code Vibe is a student-driven community built around a shared passion for technology, creativity, and innovation. We bring together students who are eager to explore new ideas, learn from one another, and create meaningful experiences through hackathons, technical talks, workshops, and collaborative projects.
            </p>
          </div>
        </section>

        {/* ═════════════════════════════
            2. WHAT WE BELIEVE IN
        ═════════════════════════════ */}
        <section className="space-y-10">
          <div ref={beliefsRef} className="reveal-ready text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#B324E5] animate-pulse" />
              <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#9700c6] font-semibold">
                2. What We Believe In
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Our Core <span className="gradient-text-radiant">Beliefs</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Guiding principles that unite our student builders, pod members, and organizers.
            </p>
          </div>

          <div ref={beliefsCards} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_BELIEFS.map((belief) => (
              <div
                key={belief.id}
                className="reveal-ready group relative rounded-3xl bento-card-premium p-8 flex flex-col justify-between"
              >
                {/* Radial Glow */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: belief.cardGlow }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-white via-white/80 to-[#c2c6d7]/40 shadow-xs inline-block group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${belief.gradient} text-white flex items-center justify-center ${belief.iconGlow}`}
                    >
                      <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-300">
                        {belief.icon}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight group-hover:text-[#0056c5] transition-colors">
                    {belief.title}
                  </h3>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {belief.description}
                  </p>
                </div>

                {/* Bottom Shimmer Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${belief.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════════════════════
            3. MEET OUR TEAM
        ═════════════════════════════ */}
        <section className="space-y-8">
          <div ref={teamRef} className="reveal-ready text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-chip shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
                3. Meet Our Team
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Founding Members &amp; <span className="gradient-text-radiant">Coordinators</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              The students, builders, and community organizers leading The Code Vibe forward.
            </p>
          </div>

          {/* Infinite Marquee */}
          <div className="relative w-full overflow-hidden py-4 group">
            {/* Edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#faf8ff] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#faf8ff] to-transparent" />

            {/* Marquee Track */}
            <div className="animate-marquee flex items-center gap-6">
              {[...TEAM_MEMBERS, ...TEAM_MEMBERS].map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="w-72 sm:w-80 shrink-0 rounded-3xl bg-white/85 backdrop-blur-2xl border-t border-l border-white/95 border-r border-b border-[#c2c6d7]/40 p-6 flex flex-col justify-between overflow-hidden shadow-card-default hover:shadow-glow-cyan transition-all duration-350 hover:-translate-y-3 group/card"
                >
                  <div>
                    {/* Photo */}
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-sm text-xs font-semibold tracking-wider uppercase border shadow-xs backdrop-blur-md bg-white/90 text-[#006875] border-[rgba(0,229,255,0.30)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                          {member.badge}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover/card:text-[#0056c5] transition-colors">
                        {member.name}
                      </h4>
                      <p className="font-label-ui text-label-ui text-[#0056c5] font-semibold">
                        {member.position}
                      </p>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="pt-4 mt-4 border-t border-[#c2c6d7]/25">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/90 border border-[#c2c6d7]/35 hover:border-[#0056c5]/40 text-on-surface hover:text-[#0056c5] font-mono-sm text-xs font-semibold shadow-xs hover:bg-white hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current text-[#0056c5]" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════
            4. JOIN US BANNER
        ═════════════════════════════ */}
        <section
          ref={joinRef}
          className="reveal-ready relative rounded-3xl overflow-hidden p-8 sm:p-12 glass-base border-t border-l border-white/90 border-r border-b border-[#c2c6d7]/35 shadow-card-default max-w-4xl mx-auto w-full"
        >
          {/* Ambient blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[rgba(0,229,255,0.14)] blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[rgba(179,36,229,0.10)] blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: '2s' }} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full telemetry-chip shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                <span className="font-mono-sm text-mono-sm uppercase tracking-wider text-[#0056c5] font-semibold">
                  4. Join Us
                </span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Have an Idea? There's a Place for You Here.
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Be part of a community where curiosity meets creativity.
              </p>
            </div>

            <a
              href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient-primary shimmer-effect inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-label-ui text-label-ui font-semibold shadow-glow-cyan active:scale-95 cursor-pointer shrink-0 group"
            >
              <span>Join The Code Vibe</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
