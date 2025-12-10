// ============================================
// GRUNDY — FTUE SPLASH SCREEN
// Bible §7.3 — Auto-advance after 2 seconds
// P5-A11Y-LABELS, P5-UX-KEYS
// ============================================

import React, { useEffect } from 'react';
import { FTUE_COPY } from '../../copy/ftue';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1025]';

interface FtueSplashProps {
  onContinue: () => void;
}

export function FtueSplash({ onContinue }: FtueSplashProps) {
  // Auto-advance after 2 seconds, or tap to continue
  useEffect(() => {
    const timer = setTimeout(onContinue, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  // Handle keyboard navigation (P5-UX-KEYS)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onContinue();
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] cursor-pointer ${FOCUS_RING_CLASS}`}
      onClick={onContinue}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Tap or press Enter to continue"
    >
      {/* Logo (P5-A11Y-LABELS) */}
      <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
        {FTUE_COPY.splash.title}
      </h1>

      {/* Sparkles */}
      <div className="text-2xl mb-8 animate-bounce" aria-hidden="true">✨</div>

      {/* Tap prompt */}
      <div className="text-sm text-slate-300 animate-pulse">
        {FTUE_COPY.splash.subtitle}
      </div>
    </div>
  );
}
