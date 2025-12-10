// ============================================
// GRUNDY — FTUE SPLASH SCREEN
// Bible §7.3 — Auto-advance after 2 seconds
// ============================================

import React, { useEffect } from 'react';
import { FTUE_COPY } from '../../copy/ftue';

interface FtueSplashProps {
  onContinue: () => void;
}

export function FtueSplash({ onContinue }: FtueSplashProps) {
  // Auto-advance after 2 seconds, or tap to continue
  useEffect(() => {
    const timer = setTimeout(onContinue, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] cursor-pointer"
      onClick={onContinue}
    >
      {/* Logo */}
      <div className="text-5xl font-bold text-white mb-4 animate-pulse">
        {FTUE_COPY.splash.title}
      </div>

      {/* Sparkles */}
      <div className="text-2xl mb-8 animate-bounce">✨</div>

      {/* Tap prompt */}
      <div className="text-sm text-slate-400 animate-pulse">
        {FTUE_COPY.splash.subtitle}
      </div>
    </div>
  );
}
