import React, { useState } from 'react';
import Button from './Button';
import { apiJoinCommunity } from '../../services/api';

/**
 * JoinCommunityModal Component
 * Implements Glass Tier 4 modal (rgba(255, 255, 255, 0.92), 40px blur, specular highlight borders, glass inputs).
 * Submits to backend so admin receives email notification.
 */
export default function JoinCommunityModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: '',
    interest: 'Open Source Pods'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await apiJoinCommunity({
        name: formData.name.trim(),
        email: formData.email.trim(),
        github: formData.github.trim(),
        interest: formData.interest,
      });
      setSubmitted(true);
      // Still open WhatsApp as before for instant community access
      window.open('https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe', '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError('');
    setFormData({
      name: '',
      email: '',
      github: '',
      interest: 'Open Source Pods'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/40 backdrop-blur-md transition-all duration-200">
      <div className="relative w-full max-w-lg glass-modal rounded-2xl shadow-2xl border border-white/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Core Action Linear Accent Bar */}
        <div className="h-1.5 w-full gradient-core-action" />

        <div className="p-6 md:p-8 space-y-6">
          {!submitted ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.30)] font-mono-sm text-xs text-[#006875] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                    COHORT 08 ONBOARDING
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mt-2 font-bold">
                    Join The Code Vibe
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Connect with 12,400+ builders, gain instant access to private pods, and start shipping.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-label-ui text-label-ui text-on-surface font-semibold">
                    Full Name or Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen (@achen)"
                    className="w-full px-3.5 py-2.5 glass-input rounded-md font-body-md text-body-md text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-ui text-label-ui text-on-surface font-semibold">
                    Developer Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 glass-input rounded-md font-body-md text-body-md text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-ui text-label-ui text-on-surface font-semibold">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/alexchen"
                    className="w-full px-3.5 py-2.5 glass-input rounded-md font-body-md text-body-md text-on-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-ui text-label-ui text-on-surface font-semibold">
                    Primary Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3.5 py-2.5 glass-input rounded-md font-body-md text-body-md text-on-surface"
                  >
                    <option value="Open Source Pods">Open Source Pods</option>
                    <option value="Hackathons & Events">Hackathons & Events</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Job / Collaboration">Job / Collaboration</option>
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-rose-500 font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2"
                >
                  {isSubmitting ? 'Joining…' : 'Join Community'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  You're in!
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  Welcome aboard. We've received your details and the WhatsApp community is opening in a new tab.
                </p>
              </div>
              <Button onClick={handleReset} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
