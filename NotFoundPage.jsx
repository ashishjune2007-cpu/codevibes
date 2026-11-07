import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage Component
 * 404 Recovery screen styled with Electric Glass & Precision Syntax tokens.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 relative">
      <div className="w-20 h-20 rounded-2xl glass-base flex items-center justify-center text-primary mb-6 shadow-card-default border border-white/80">
        <span className="material-symbols-outlined text-4xl text-[#0056c5]">travel_explore</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full telemetry-chip font-mono-sm text-xs text-[#006875] mb-3 font-semibold shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
        <span>ERROR 404 // COORDINATE UNMAPPED</span>
      </div>
      <h1 className="font-display-hero text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">
        Lost in Code Space
      </h1>
      <p className="mt-3 max-w-md font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
        The branch or cell cluster you are looking for has been merged, relocated, or doesn't exist yet.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="btn-gradient-primary px-6 py-3 rounded-lg font-label-ui text-label-ui shadow-sm active:scale-95 transition-all"
        >
          Return to Mission Control
        </Link>
        <Link
          to="/collaborate"
          className="btn-frosted-glass px-5 py-3 rounded-lg font-label-ui text-label-ui shadow-xs"
        >
          Collaborate
        </Link>
      </div>
    </div>
  );
}
