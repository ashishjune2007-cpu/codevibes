import React from 'react';

/**
 * Badge Component
 * Implements the Electric Glass & Precision Syntax design specifications:
 * - Frosted Telemetry Chip: rgba(255, 255, 255, 0.70) fill, 12px blur, 1px rgba(255, 255, 255, 0.50) stroke.
 * - Active / Online: Cyan ping indicator (#00E5FF) on rgba(0, 229, 255, 0.10) glass pill.
 * - Processing: Cobalt pulse (#2979FF) over rgba(41, 121, 255, 0.10).
 * - Restricted / Critical: Violet badge (#B324E5) in JetBrains Mono over rgba(179, 36, 229, 0.10).
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  ping = false,
  pingColor = 'bg-secondary',
  className = '',
  ...props
}) {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const variantStyles = {
    // Frosted Telemetry Chip
    telemetry: 'bg-white/70 backdrop-blur-md border border-white/50 text-on-surface font-mono-sm shadow-xs',
    glass: 'bg-white/75 backdrop-blur-md border border-white/60 text-on-surface shadow-xs',
    
    // Live Status Badges from design.md
    'status-active': 'bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.35)] text-[#006875] font-mono-sm font-semibold',
    'status-processing': 'bg-[rgba(41,121,255,0.12)] border border-[rgba(41,121,255,0.35)] text-[#0056c5] font-mono-sm font-semibold',
    'status-restricted': 'bg-[rgba(179,36,229,0.12)] border border-[rgba(179,36,229,0.35)] text-[#9700c6] font-mono-sm font-semibold',
    
    // Brand Semantics
    default: 'bg-surface-container text-on-surface font-mono-sm border border-outline-variant/30',
    primary: 'bg-primary-fixed text-on-primary-fixed font-mono-sm uppercase tracking-wider border border-primary/20',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed font-mono-sm font-semibold border border-secondary/20',
    'secondary-subtle': 'bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875] font-mono-sm font-semibold',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed font-mono-sm uppercase tracking-wider border border-tertiary/20',
    'tertiary-subtle': 'bg-[rgba(179,36,229,0.12)] border border-[rgba(179,36,229,0.30)] text-[#9700c6] font-mono-sm font-semibold',
    surface: 'bg-surface-container-high text-on-surface-variant font-mono-sm border border-outline-variant/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {ping && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pingColor}`} />
        </span>
      )}
      {children}
    </span>
  );
}
