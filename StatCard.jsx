import React from 'react';

export default function StatCard({
  value,
  label,
  color = 'text-primary',
  hasBorder = false,
  className = ''
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 py-2 ${
        hasBorder ? 'border-none md:border-r border-slate-200/60' : ''
      } ${className}`}
    >
      <span className={`font-headline-lg text-headline-lg tracking-tight font-bold ${color}`}>
        {value}
      </span>
      <span className="font-mono-sm text-mono-sm text-on-surface-variant mt-1">
        {label}
      </span>
    </div>
  );
}
