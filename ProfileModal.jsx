import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * ProfileModal Component
 * Allows verified builders to edit their display name and add their WhatsApp number.
 * Styled with Electric Glass & Precision Syntax design tokens.
 */
export default function ProfileModal() {
  const { user, profileModalOpen, closeProfileModal, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success'); // 'success' | 'error'

  useEffect(() => {
    if (user && profileModalOpen) {
      setName(user.name || '');
      setWhatsapp(user.whatsapp || '');
      setFeedbackMessage('');
    }
  }, [user, profileModalOpen]);

  if (!profileModalOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedbackType('error');
      setFeedbackMessage('Please provide your name or handle.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      await updateProfile({ name, whatsapp });
      setFeedbackType('success');
      setFeedbackMessage('✓ Profile updated successfully!');
      setTimeout(() => {
        closeProfileModal();
      }, 1200);
    } catch (err) {
      setFeedbackType('error');
      setFeedbackMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/45 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl glass-elevated border border-white/90 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Core Action Accent Gradient Bar */}
        <div className="h-1.5 w-full gradient-core-action" />

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 via-[#2979FF]/20 to-[#B324E5]/20 border border-white/80 shadow-xs flex items-center justify-center text-[#0056c5] shrink-0">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Edit Profile
                  </h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-mono-sm text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Update your builder handle and WhatsApp contact number
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeProfileModal}
              className="text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Feedback banner */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono-sm flex items-center gap-2 ${
                feedbackType === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {feedbackType === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="builder-name" className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                Builder Name / Handle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                  person
                </span>
                <input
                  id="builder-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Devin Vance (@dvance)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all font-body-md text-sm text-on-surface shadow-xs"
                />
              </div>
            </div>

            {/* WhatsApp Number Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="builder-whatsapp" className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                  WhatsApp Contact Number
                </label>
                <span className="font-mono-sm text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Direct Alerts
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#10B981] flex items-center pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <input
                  id="builder-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or +1 (555) 019-2834"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none transition-all font-body-md text-sm text-on-surface shadow-xs"
                />
              </div>
              <p className="font-mono-sm text-[11px] text-on-surface-variant leading-tight">
                Used for community matchmaking, event stage links, and WhatsApp group updates.
              </p>
            </div>

            {/* Email (Read-Only) */}
            <div className="space-y-1.5">
              <label htmlFor="builder-email" className="block font-label-ui text-xs font-semibold uppercase tracking-wider text-outline">
                Verified Account Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                  mail
                </span>
                <input
                  id="builder-email"
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/[0.03] border border-[#c2c6d7]/40 outline-none font-body-md text-sm text-on-surface-variant cursor-not-allowed"
                />
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-lg pointer-events-none" title="Verified">
                  check_circle
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#c2c6d7]/30">
              <button
                type="button"
                onClick={closeProfileModal}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl font-label-ui text-xs sm:text-sm text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-ui text-xs sm:text-sm font-semibold shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
