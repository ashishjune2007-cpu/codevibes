import React, { useState, useEffect } from 'react';

/**
 * FloatingNeonOrbs Component
 * Renders glowing, animated 3D neon glass orbs with radiant cyan, magenta,
 * and electric blue atmospheric lighting on the landing page.
 */
export default function FloatingNeonOrbs() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized mouse offset (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Large Cyan Neon Orb (Top Left - Floating near Hero Headline) */}
      <div
        className="absolute -top-12 left-[8%] md:left-[12%] animate-float-orb-1"
        style={{
          transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 18}px, 0)`,
          transition: 'transform 0.4s ease-out'
        }}
      >
        {/* Ambient Blur Aura */}
        <div className="absolute -inset-10 rounded-full bg-cyan-400/30 blur-3xl" />
        {/* Glowing Orb Sphere */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-[1.5px] bg-gradient-to-br from-cyan-300 via-cyan-400/50 to-transparent shadow-[0_0_50px_rgba(0,229,255,0.65),inset_0_0_30px_rgba(255,255,255,0.7)] backdrop-blur-md">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-white/40 flex items-center justify-center overflow-hidden">
            {/* Specular 3D Glass Light Crescent */}
            <div className="absolute top-3 left-6 w-14 h-7 sm:w-20 sm:h-10 rounded-full bg-white/70 blur-[3px] -rotate-45" />
            <div className="absolute bottom-4 right-6 w-16 h-8 rounded-full bg-cyan-300/40 blur-[8px]" />
          </div>
        </div>
      </div>

      {/* 2. Vibrant Magenta/Violet Neon Orb (Top Right - Floating near Registrations Badge) */}
      <div
        className="absolute top-16 right-[6%] md:right-[14%] animate-float-orb-2"
        style={{
          transform: `translate3d(${mousePos.x * -24}px, ${mousePos.y * -20}px, 0)`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        {/* Ambient Aura */}
        <div className="absolute -inset-12 rounded-full bg-fuchsia-500/25 blur-3xl" />
        {/* Glowing Orb */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-[1.5px] bg-gradient-to-bl from-fuchsia-300 via-[rgba(179,36,229,0.60)] to-purple-800/20 shadow-[0_0_55px_rgba(179,36,229,0.7),inset_0_0_35px_rgba(255,255,255,0.65)] backdrop-blur-md">
          <div className="w-full h-full rounded-full bg-gradient-to-bl from-purple-500/25 via-pink-500/20 to-white/35 flex items-center justify-center overflow-hidden">
            <div className="absolute top-3 right-6 w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-white/80 blur-[2px] rotate-45" />
            <div className="absolute bottom-5 left-5 w-14 h-7 rounded-full bg-[rgba(179,36,229,0.50)] blur-[6px]" />
          </div>
        </div>
      </div>

      {/* 3. Electric Blue Depth Orb (Center Hero - Floating behind CTA buttons) */}
      <div
        className="absolute top-72 left-1/2 -translate-x-1/2 animate-float-orb-3"
        style={{
          transform: `translate3d(calc(-50% + ${mousePos.x * 12}px), ${mousePos.y * 14}px, 0)`,
          transition: 'transform 0.6s ease-out'
        }}
      >
        <div className="absolute -inset-16 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full p-[2px] bg-gradient-to-r from-blue-400/40 via-cyan-400/30 to-purple-500/30 shadow-[0_0_60px_rgba(41,121,255,0.5),inset_0_0_40px_rgba(255,255,255,0.5)] backdrop-blur-lg opacity-80">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-white/20" />
        </div>
      </div>

      {/* 4. Neon Cyan Ring / Satellite Pearl (Mid Left - near Stats Grid) */}
      <div
        className="absolute top-[32rem] left-[4%] md:left-[10%] animate-float-orb-4"
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * 22}px, 0)`,
          transition: 'transform 0.45s ease-out'
        }}
      >
        <div className="absolute -inset-8 rounded-full bg-cyan-400/25 blur-2xl" />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[1.5px] bg-gradient-to-br from-white via-cyan-300 to-blue-500 shadow-[0_0_35px_rgba(0,229,255,0.8),inset_0_0_20px_rgba(255,255,255,0.8)]">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400/30 to-white/40 flex items-center justify-center">
            <div className="absolute top-2 left-3 w-7 h-4 rounded-full bg-white blur-[1px] -rotate-45" />
          </div>
        </div>
      </div>

      {/* 5. Violet Mini Orb Pearl (Mid Right - Floating above Metrics Strip) */}
      <div
        className="absolute top-[28rem] right-[5%] md:right-[11%] animate-float-orb-1"
        style={{
          transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * -18}px, 0)`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        <div className="absolute -inset-6 rounded-full bg-fuchsia-400/30 blur-2xl" />
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[1.5px] bg-gradient-to-tl from-purple-400 via-pink-400 to-white shadow-[0_0_30px_rgba(217,70,239,0.75),inset_0_0_18px_rgba(255,255,255,0.8)]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/25 to-white/40">
            <div className="absolute top-1.5 right-2 w-5 h-2.5 rounded-full bg-white blur-[1px] rotate-45" />
          </div>
        </div>
      </div>

      {/* 6. Subtle Neon Stardust Embers (Floating Particle Dots) */}
      <div className="absolute top-28 left-[25%] w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#00E5FF] animate-pulse" />
      <div className="absolute top-44 right-[30%] w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_14px_#B324E5] animate-pulse delay-300" />
      <div className="absolute top-[22rem] left-[20%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#2979FF] animate-pulse delay-700" />
      <div className="absolute top-[36rem] right-[24%] w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_15px_#00E5FF] animate-pulse delay-500" />
    </div>
  );
}
