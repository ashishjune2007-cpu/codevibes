import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/70 backdrop-blur-2xl text-on-surface relative">
      {/* Gradient divider line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2979FF]/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* 1. Community Logo & Tagline */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-3 group">
                <div className="w-10 h-10 rounded-full p-0.5 gradient-core-action shadow-glow-cyan shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                  <img
                    alt="The Code Vibe Logo"
                    className="w-full h-full rounded-full object-contain bg-black/95 backdrop-blur-sm"
                    src="/logo.png"
                  />
                </div>
                <span className="font-headline-md text-headline-md tracking-tight font-bold gradient-text-radiant">
                  The Code Vibe
                </span>
              </Link>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
                Where developers explore technology, build meaningful projects, and pair up to ship real software.
              </p>
            </div>

            {/* 4. Contact Email */}
            <div className="pt-1">
              <span className="block font-mono-sm text-xs uppercase tracking-wider text-outline font-semibold mb-1.5">
                Contact Email
              </span>
              <a
                href="mailto:contact@thecodevibe.com"
                className="inline-flex items-center gap-2.5 text-on-surface hover:text-[#0056c5] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/90 border border-[#c2c6d7]/35 flex items-center justify-center shadow-xs text-[#0056c5] group-hover:bg-[#0056c5] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-base">mail</span>
                </div>
                <span className="font-mono-sm text-sm font-semibold">contact@thecodevibe.com</span>
              </a>
            </div>
          </div>

          {/* 2. Navigation: Home, About, Events, Collaborate */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-label-ui text-label-ui text-on-surface uppercase tracking-wider font-semibold">
              Navigation
            </div>
            <ul className="space-y-3">
              <li className="leading-none">
                <Link
                  to="/"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/about"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/events"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Events
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/collaborate"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Collaborate
                </Link>
              </li>
              <li className="leading-none">
                <Link
                  to="/admin"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs text-[#0056c5]">shield_person</span>
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Socials: Instagram, LinkedIn, WhatsApp */}
          <div className="lg:col-span-3 space-y-4">
            <div className="font-label-ui text-label-ui text-on-surface uppercase tracking-wider font-semibold">
              Social Community
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Connect with fellow builders and follow our latest event updates and community announcements.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/thecodevibess?mdxt=MWYyMmZud293dHNuNA=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-10 h-10 rounded-xl bg-white/90 border border-[#c2c6d7]/35 shadow-xs hover:shadow-glow-cyan hover:border-[#0056c5]/40 flex items-center justify-center text-on-surface-variant hover:text-[#0056c5] transition-all duration-250 hover:-translate-y-1.5 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/the-code-vibe/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/90 border border-[#c2c6d7]/35 shadow-xs hover:shadow-glow-cyan hover:border-[#0056c5]/40 flex items-center justify-center text-on-surface-variant hover:text-[#0056c5] transition-all duration-250 hover:-translate-y-1.5 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Community"
                title="WhatsApp Community"
                className="w-10 h-10 rounded-xl bg-white/90 border border-[#c2c6d7]/35 shadow-xs hover:shadow-glow-cyan hover:border-[#10B981]/40 flex items-center justify-center text-on-surface-variant hover:text-[#10B981] transition-all duration-250 hover:-translate-y-1.5 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 5. Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-[#c2c6d7]/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-on-surface-variant font-body-sm text-body-sm text-center sm:text-left">
          <div className="font-mono-sm text-xs">
            © {currentYear} The Code Vibe. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono-sm text-xs text-on-surface-variant">
            <span className="hover:text-[#0056c5] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#0056c5] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#0056c5] transition-colors cursor-pointer">Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
