import React, { useEffect, useRef } from 'react';

/**
 * SearchBar Component
 * Adheres to Electric Glass & Precision Syntax:
 * - Glass Text Input: rgba(255, 255, 255, 0.85), 12px blur, 1px rgba(194, 198, 215, 0.50) border.
 * - Focus State: rgba(255, 255, 255, 0.98), 1px solid #2979FF border, 0 0 0 3px rgba(41, 121, 255, 0.20).
 * - JetBrains Mono keycap pill (⌘K).
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  id = 'search-input'
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative flex-1 ${className}`}>
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
        search
      </span>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-16 py-2.5 glass-input rounded-md font-body-md text-body-md text-on-surface placeholder:text-outline"
      />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono-sm text-mono-sm text-outline px-1.5 py-0.5 rounded bg-white/80 border border-outline-variant/40 shadow-xs pointer-events-none">
        ⌘K
      </span>
    </div>
  );
}
