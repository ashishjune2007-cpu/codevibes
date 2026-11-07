import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    login,
    register,
    loginWithGoogle,
    handleAuthSuccess,
    authContextMessage,
    targetEventTitle,
    isFirebase,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let authedUser;
      if (mode === 'login') {
        authedUser = await login(email, password, role);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        authedUser = await register(name, email, password);
      }
      handleAuthSuccess(authedUser);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const authedUser = await loginWithGoogle();
      handleAuthSuccess(authedUser);
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass, demoRole = 'member') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/50 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-modal rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-scale-in">
        <div className="h-1.5 w-full gradient-core-action" />

        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] text-[#006875] font-mono-sm text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                {isFirebase ? 'FIREBASE AUTH' : 'DEMO / LOCAL AUTH'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                {mode === 'login' ? 'Sign In to Register' : 'Create Verified Account'}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-outline hover:text-on-surface p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 border border-[#c2c6d7]/40 text-xs sm:text-sm text-on-surface-variant flex items-start gap-2.5 shadow-xs">
            <span className="material-symbols-outlined text-base text-[#0056c5] mt-0.5 shrink-0">verified_user</span>
            <div>
              {targetEventTitle ? (
                <>
                  To register for <strong className="text-on-surface font-semibold">{targetEventTitle}</strong>, please sign in with your verified profile.
                </>
              ) : (
                <span>{authContextMessage || 'Only verified community members can reserve event seats.'}</span>
              )}
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-[#c2c6d7]/50 hover:border-[#0056c5]/40 hover:shadow-md transition-all font-label-ui text-sm font-semibold text-on-surface cursor-pointer disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#c2c6d7]/40" />
            <span className="text-xs font-mono-sm text-on-surface-variant">or email</span>
            <div className="h-px flex-1 bg-[#c2c6d7]/40" />
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-black/5 border border-white/50">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-label-ui text-label-ui text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0056c5] shadow-card-default'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-label-ui text-label-ui text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0056c5] shadow-card-default'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              New Registration
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="font-label-ui text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or handle"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/15 outline-none text-on-surface text-sm"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-label-ui text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/15 outline-none text-on-surface text-sm"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-ui text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Min 6 characters' : 'Your password'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/15 outline-none text-on-surface text-sm"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'login' && (
              <div className="space-y-1.5">
                <label className="font-label-ui text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Sign in as
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      role === 'member'
                        ? 'bg-[#0056c5]/10 text-[#0056c5] border border-[#0056c5]/30'
                        : 'bg-white/50 text-on-surface-variant border border-[#c2c6d7]/40'
                    }`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      role === 'admin'
                        ? 'bg-[#B324E5]/10 text-[#9700c6] border border-[#B324E5]/30'
                        : 'bg-white/50 text-on-surface-variant border border-[#c2c6d7]/40'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-gradient-primary font-label-ui text-sm font-bold text-white cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>


          {isFirebase && (
            <p className="text-[11px] text-center text-on-surface-variant">
              New users are saved to Firebase Auth + Firestore <code className="text-[#0056c5]">users</code> collection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
