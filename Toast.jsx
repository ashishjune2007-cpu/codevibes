import React from 'react';

/**
 * Toast Component
 * Elevated Glass Tier 3 (rgba(255, 255, 255, 0.90), blur-24px saturate-180%, specular highlight border).
 */
export default function Toast({ message, visible, icon = 'check_circle', onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl glass-elevated text-on-surface shadow-glow-cobalt border border-white/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <span className="material-symbols-outlined text-[#00E5FF] text-xl leading-none">
        {icon}
      </span>
      <span className="font-body-sm text-body-sm font-semibold tracking-tight text-[#151b2b]">
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-outline hover:text-on-surface transition-colors cursor-pointer p-0.5 rounded hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
}
