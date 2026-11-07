import React, { useState } from 'react';

/**
 * PastEventCard Component
 * Uses the Electric Glass Bento Card specification for recorded session archives.
 */
export default function PastEventCard({ session, onActionNotice }) {
  const [playing, setPlaying] = useState(false);

  const handleWatch = (e) => {
    e.preventDefault();
    setPlaying(true);
    onActionNotice?.(`Buffering 4K stream for "${session.title}"...`);
    setTimeout(() => setPlaying(false), 3000);
  };

  const handleSlides = (e) => {
    e.preventDefault();
    onActionNotice?.(`Opening slides and benchmark code for "${session.title}" in new tab.`);
  };

  return (
    <div className="bento-card rounded-xl p-space-md flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono-sm text-mono-sm bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            {session.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-full font-mono-sm text-mono-sm bg-white/70 border border-white/60 font-medium text-on-surface-variant">
            {session.date}
          </span>
        </div>

        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
          {session.title}
        </h4>

        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {session.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono-sm text-mono-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#c2c6d7]/35 text-on-surface">
            <span className="material-symbols-outlined text-xs text-[#ba1a1a]">timer</span>
            {session.duration}
          </span>
          {session.tags?.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-white/60 border border-white/80 text-on-surface">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#c2c6d7]/30 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={handleWatch}
          className="btn-frosted-glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-ui text-label-ui text-primary shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            {playing ? 'play_circle' : 'smart_display'}
          </span>
          <span>{playing ? 'Buffering...' : 'Watch Stream'}</span>
        </button>

        <button
          onClick={handleSlides}
          className="text-on-surface-variant hover:text-primary font-mono-sm text-mono-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Slides & Code</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>
    </div>
  );
}
