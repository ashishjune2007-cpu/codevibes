import React from 'react';

/**
 * AtmosphereOrbs
 * Renders the multi-stop ambient spectral gradients and deep-field luminous orbs
 * from the Electric Glass & Precision Syntax design specification.
 */
export default function AtmosphereOrbs({ variant = 'default' }) {
  if (variant === 'glass') {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Full-viewport Hero Mesh Ambient Radial Canvas */}
        <div className="absolute inset-0 hero-mesh-canvas opacity-90" />

        {/* Luminous Spectral Ambient Orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[rgba(0,229,255,0.20)] via-[rgba(41,121,255,0.18)] to-[rgba(179,36,229,0.22)] blur-[120px] rounded-full" />
        <div className="absolute top-[26rem] -left-48 w-[550px] h-[550px] bg-[rgba(0,229,255,0.15)] blur-[130px] rounded-full" />
        <div className="absolute top-[50rem] -right-48 w-[600px] h-[600px] bg-[rgba(179,36,229,0.15)] blur-[140px] rounded-full" />
        <div className="absolute top-[92rem] left-1/4 w-[700px] h-[500px] bg-[rgba(41,121,255,0.14)] blur-[130px] rounded-full" />
        <div className="absolute bottom-28 -right-36 w-[650px] h-[650px] bg-[rgba(0,229,255,0.16)] blur-[140px] rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Subtle Ambient Mesh Base */}
      <div className="absolute inset-0 hero-mesh-canvas opacity-60" />

      {/* Deep-field Spectral Radiance */}
      <div className="absolute -top-24 -left-20 w-[600px] h-[600px] rounded-full bg-[rgba(0,229,255,0.16)] blur-[130px]" />
      <div className="absolute top-1/4 -right-20 w-[650px] h-[650px] rounded-full bg-[rgba(179,36,229,0.14)] blur-[140px]" />
      <div className="absolute top-2/4 left-10 w-[550px] h-[550px] rounded-full bg-[rgba(41,121,255,0.13)] blur-[130px]" />
      <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[rgba(0,229,255,0.18)] blur-[140px]" />
    </div>
  );
}
