import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EventCard Component
 * Implements Electric Glass Bento Card specification with specular highlights and frosted badges.
 */
export default function EventCard({
  event,
  onOpenDetails
}) {
  const categoryBadgeStyles = {
    workshop: 'bg-[rgba(179,36,229,0.12)] border border-[rgba(179,36,229,0.30)] text-[#9700c6]',
    hackathon: 'bg-primary-fixed text-on-primary-fixed border border-primary/20',
    talk: 'bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875]',
    meetup: 'bg-white/80 border border-[#c2c6d7]/40 text-on-surface',
  };

  return (
    <div className="event-card group bento-card rounded-xl flex flex-col overflow-hidden hover:transform-none">
      <div className="relative h-48 w-full overflow-hidden bg-surface-container">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono-sm text-mono-sm bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              {event.status}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono-sm text-mono-sm font-semibold ${
                categoryBadgeStyles[event.category] || categoryBadgeStyles.workshop
              }`}
            >
              {event.categoryLabel}
            </span>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-mono-sm text-mono-sm pt-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end border-t border-[#c2c6d7]/30">
          <Link
            to={event.link || '/events/wasm-memory-safety'}
            className="btn-frosted-glass inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-ui text-label-ui shadow-xs group/btn cursor-pointer"
          >
            <span>More Details</span>
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 transition-transform text-primary">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
