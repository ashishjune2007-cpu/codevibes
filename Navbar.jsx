import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar Component
 * Floating Glass Tier 3 header with scroll-aware glass intensification,
 * scroll progress indicator, and verified member auth controls.
 */
export default function Navbar({ onOpenJoinModal }) {
  const { user, isAuthenticated, logout, requireAuth, openProfileModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Collaborate', path: '/collaborate' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  const getLinkClasses = ({ isActive }) =>
    isActive
      ? 'px-3.5 py-1.5 transition-all text-[#0056c5] font-semibold bg-white/95 border border-white/90 rounded-lg shadow-card-default flex items-center gap-1.5 relative'
      : 'px-3.5 py-1.5 font-label-ui text-label-ui text-[#424655] hover:text-[#151b2b] hover:bg-white/60 rounded-lg transition-all duration-200 flex items-center gap-1.5 relative';

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'pt-2' : 'pt-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div
            className={`h-16 px-6 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 ${
              scrolled
                ? 'glass-elevated navbar-scrolled'
                : 'glass-elevated border-t border-l border-white/80 border-r border-b border-[#c2c6d7]/30 shadow-card-default'
            }`}
          >
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-3 group animate-fade-in-down"
                style={{ animationDelay: '0ms' }}
              >
                <div className="w-10 h-10 rounded-full p-0.5 gradient-core-action shadow-glow-cyan shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <img
                    alt="The Code Vibe Logo"
                    className="w-full h-full rounded-full object-contain bg-black/95 backdrop-blur-sm"
                    src="/logo.png"
                  />
                </div>
                <span className="font-headline-sm text-headline-sm tracking-tight font-bold gradient-text-radiant hidden sm:inline">
                  The Code Vibe
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav
                className="hidden lg:flex items-center gap-1 p-1 bg-black/5 rounded-xl border border-white/40 animate-fade-in-down"
                style={{ animationDelay: '80ms' }}
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={getLinkClasses}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Action Cluster */}
            <div
              className="flex items-center gap-2 sm:gap-3 animate-fade-in-down relative"
              style={{ animationDelay: '160ms' }}
            >
              {isAuthenticated ? (
                /* Authenticated User Status & Menu */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white/90 border border-white/90 hover:border-[#0056c5]/40 shadow-card-default transition-all cursor-pointer"
                    title={`Verified Member: ${user.name}`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#0056c5] p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#0056c5] uppercase">
                        {user.name ? user.name.slice(0, 2) : 'CV'}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-on-surface truncate max-w-[100px] leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-mono-sm text-emerald-600 font-semibold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-sm text-outline hidden sm:inline">
                      expand_more
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass-elevated border border-white/90 shadow-2xl p-3 z-50 animate-scale-in space-y-2">
                      <div className="p-2 border-b border-[#c2c6d7]/30 space-y-1">
                        <p className="font-bold text-sm text-on-surface truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant font-mono-sm truncate">{user.email}</p>
                        {user.whatsapp ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono-sm pt-0.5">
                            <span className="material-symbols-outlined text-sm text-[#10B981]">phone</span>
                            <span className="truncate">{user.whatsapp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-mono-sm pt-0.5">
                            <span className="material-symbols-outlined text-xs">info</span>
                            <span>No WhatsApp added</span>
                          </div>
                        )}
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-mono-sm text-emerald-700 font-semibold">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>Verified Member</span>
                        </div>
                      </div>

                      {/* Edit Profile Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0056c5] hover:bg-[#0056c5]/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">edit</span>
                          <span>Edit Profile &amp; WhatsApp</span>
                        </div>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>

                      {/* Admin Portal Shortcut if role is admin */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100/80 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-purple-700">admin_panel_settings</span>
                            <span>Admin Control Portal</span>
                          </div>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      )}

                      {/* Sign Out Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Sign In Option */
                <button
                  type="button"
                  onClick={() => requireAuth(null, 'Sign in to access your verified builder profile and register for events.')}
                  className="btn-frosted-glass inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg font-label-ui text-label-ui text-xs sm:text-sm shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-[#0056c5]">login</span>
                  <span>Sign In</span>
                </button>
              )}

              <a
                href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-primary shimmer-effect inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-label-ui text-label-ui shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="hidden sm:inline">Join Community</span>
                <span className="sm:hidden material-symbols-outlined text-base leading-none">group_add</span>
              </a>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/80 hover:bg-white text-on-surface border border-white/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                <span
                  className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                    mobileMenuOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="p-4 rounded-2xl glass-elevated border border-white/80 shadow-2xl space-y-2">
              {isAuthenticated && (
                <div className="p-3 bg-white/80 rounded-xl border border-white flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <span className="font-bold text-xs text-on-surface block">{user.name}</span>
                        <span className="text-[10px] font-mono-sm text-emerald-600 font-semibold">Verified Member</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openProfileModal();
                      }}
                      className="text-xs text-[#0056c5] font-semibold px-2.5 py-1 rounded-lg bg-[#0056c5]/10 hover:bg-[#0056c5]/20 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </button>
                  </div>
                  {user.whatsapp && (
                    <div className="text-[11px] font-mono-sm text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#10B981]">phone</span>
                      <span>{user.whatsapp}</span>
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold px-2.5 py-1.5 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                        <span>Admin Portal</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-600 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 cursor-pointer text-center"
                  >
                    Log Out
                  </button>
                </div>
              )}

              {navLinks.map((link, idx) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={({ isActive }) =>
                    `w-full px-4 py-2.5 rounded-xl font-body-md text-body-md flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-[#0056c5] font-semibold shadow-xs'
                        : 'text-[#424655] hover:text-[#151b2b] hover:bg-white/60 hover:translate-x-1'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
              <div className="pt-2 border-t border-[#c2c6d7]/30 space-y-2">
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      requireAuth(null, 'Sign in to access your verified builder profile.');
                    }}
                    className="w-full btn-frosted-glass py-2.5 rounded-xl font-label-ui text-label-ui flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#0056c5]">login</span>
                    <span>Sign In</span>
                  </button>
                )}
                <a
                  href="https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-gradient-primary shimmer-effect py-2.5 rounded-xl font-label-ui text-label-ui flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Join Community</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
