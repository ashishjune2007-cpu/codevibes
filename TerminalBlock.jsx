import React, { useState } from 'react';

/**
 * TerminalBlock / Frosted Syntax Viewport
 * Implements Electric Glass & Precision Syntax:
 * - Container with rgba(255, 255, 255, 0.85) fill, backdrop-blur-lg, specular border.
 * - Structural top header bar separating code actions from body.
 * - JetBrains Mono syntax rows highlighted with accessible spectral tokens.
 */
export default function TerminalBlock({
  title = 'terminal',
  commands = [],
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = commands
      .map((c) => (c.type === 'comment' ? `# ${c.text}` : c.text))
      .join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl bg-white/85 backdrop-blur-lg overflow-hidden shadow-card-default border border-white/60 border-b-[#c2c6d7]/40 flex flex-col justify-between ${className}`}>
      {/* Structural Top Header Bar */}
      <div className="px-4 py-2.5 bg-white/90 backdrop-blur-md flex items-center justify-between border-b border-[#c2c6d7]/35">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e3fd]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2979FF]/80" />
          <span className="ml-2 font-mono-sm text-mono-sm text-on-surface font-semibold tracking-tight">
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-mono-sm text-xs px-2 py-1 rounded bg-white/60 border border-white/80 hover:bg-white"
          title="Copy to clipboard"
        >
          <span className="material-symbols-outlined text-[15px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span className="text-[11px] font-medium">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Syntax Body */}
      <div className="p-5 font-mono-sm text-mono-sm text-on-surface space-y-2 overflow-x-auto bg-white/60 backdrop-blur-sm">
        {commands.map((cmd, idx) => {
          if (cmd.type === 'comment') {
            return (
              <div key={idx} className="text-[#727786]">
                # {cmd.text}
              </div>
            );
          }
          if (cmd.type === 'success') {
            return (
              <div key={idx} className="text-[#006875] font-semibold flex items-center gap-1">
                <span className="text-[#00E5FF]">✔</span> {cmd.text}
              </div>
            );
          }
          return (
            <div key={idx} className="text-[#0056c5] font-medium flex items-center gap-1.5">
              <span className="text-[#424655] select-none font-bold">$</span>
              <span>{cmd.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
