// ============================================
// GRUNDY — FTUE WORLD INTRO SCREEN
// Bible §7.4 — LOCKED canonical text
// ============================================

import React, { useState, useEffect } from 'react';
import { WORLD_INTRO_LINES, FTUE_COPY } from '../../copy/ftue';

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
  const renderLine = (line: string, index: number) => {
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
      className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-8 cursor-pointer"
      onClick={showButton ? onContinue : undefined}
    >
      {/* Decorative stars */}
      <div className="text-slate-500 mb-8 text-sm tracking-widest">
        ✦ · ✧ · ✦ · ✧
      </div>

      {/* World intro lines */}
      <div className="text-center space-y-4 mb-12">
        {WORLD_INTRO_LINES.map((line, index) => (
          <div
            key={index}
            className={`text-lg text-[#FFF8E7] font-serif transition-opacity duration-800 ${
              index < visibleLines ? 'opacity-100' : 'opacity-0'
            } ${index === 2 ? 'text-xl mt-6' : ''}`}
          >
            {renderLine(line, index)}
          </div>
        ))}
      </div>

      {/* Decorative stars */}
      <div className="text-slate-500 mb-8 text-sm tracking-widest">
        ✦ · ✧ · ✦ · ✧
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className={`px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all duration-300 ${
          showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {FTUE_COPY.worldIntro.continueButton}
      </button>
    </div>
  );
}
