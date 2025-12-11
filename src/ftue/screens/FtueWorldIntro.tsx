// ============================================
// GRUNDY — FTUE WORLD INTRO SCREEN
// Bible §7.4 — LOCKED canonical text
// P5-A11Y-LABELS, P5-UX-KEYS
// ============================================

import React, { useState, useEffect } from 'react';
import { WORLD_INTRO_LINES, FTUE_COPY } from '../../copy/ftue';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1025]';

interface FtueWorldIntroProps {
  onContinue: () => void;
}

export function FtueWorldIntro({ onContinue }: FtueWorldIntroProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Animate lines appearing
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Line 1 at 0.5s
    timers.push(setTimeout(() => setVisibleLines(1), 500));
    // Line 2 at 1.5s
    timers.push(setTimeout(() => setVisibleLines(2), 1500));
    // Line 3 at 2.5s
    timers.push(setTimeout(() => setVisibleLines(3), 2500));
    // Button at 3.0s
    timers.push(setTimeout(() => setShowButton(true), 3000));
    // Auto-advance at 8.0s (if no tap)
    timers.push(setTimeout(onContinue, 8000));

    return () => timers.forEach(clearTimeout);
  }, [onContinue]);

  // Render line with emphasis on "you"
  const renderLine = (line: string) => {
    if (line.includes('*you*')) {
      const parts = line.split('*you*');
      return (
        <span>
          {parts[0]}
          <span className="text-amber-400 font-semibold">you</span>
          {parts[1]}
        </span>
      );
    }
    return line;
  };

  return (
    <div
      data-testid="ftue-screen"
      className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-8"
      role="article"
      aria-label="World introduction"
    >
      {/* Decorative stars */}
      <div className="text-slate-400 mb-8 text-sm tracking-widest" aria-hidden="true">
        ✦ · ✧ · ✦ · ✧
      </div>

      {/* World intro lines (P5-A11Y-LABELS) */}
      <div data-testid="ftue-lore" className="text-center space-y-4 mb-12" role="region" aria-label="Story introduction">
        <h1 className="sr-only">Welcome to Grundy</h1>
        {WORLD_INTRO_LINES.map((line, index) => (
          <p
            key={index}
            className={`text-lg text-[#FFF8E7] font-serif transition-opacity duration-800 ${
              index < visibleLines ? 'opacity-100' : 'opacity-0'
            } ${index === 2 ? 'text-xl mt-6' : ''}`}
            aria-hidden={index >= visibleLines}
          >
            {renderLine(line)}
          </p>
        ))}
      </div>

      {/* Decorative stars */}
      <div className="text-slate-400 mb-8 text-sm tracking-widest" aria-hidden="true">
        ✦ · ✧ · ✦ · ✧
      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={onContinue}
        className={`px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all duration-300 ${FOCUS_RING_CLASS} ${
          showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        tabIndex={showButton ? 0 : -1}
        aria-hidden={!showButton}
      >
        {FTUE_COPY.worldIntro.continueButton}
      </button>
    </div>
  );
}
