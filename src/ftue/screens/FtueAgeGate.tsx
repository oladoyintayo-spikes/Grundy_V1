// ============================================
// GRUNDY — FTUE AGE GATE SCREEN
// Bible §7.8 — Age gate before FTUE begins
// P5-A11Y-LABELS, P5-UX-KEYS
// ============================================

import React, { useState } from 'react';
import { FTUE_COPY } from '../../copy/ftue';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1025]';

interface FtueAgeGateProps {
  onContinue: () => void;
}

export function FtueAgeGate({ onContinue }: FtueAgeGateProps) {
  const [showUnderAge, setShowUnderAge] = useState(false);

  const handleYes = () => {
    onContinue();
  };

  const handleNo = () => {
    setShowUnderAge(true);
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6"
      role="dialog"
      aria-labelledby="age-gate-title"
    >
      {/* Title (P5-A11Y-LABELS) */}
      <h1 id="age-gate-title" className="text-2xl font-bold text-white mb-8">
        {FTUE_COPY.ageGate.title}
      </h1>

      {showUnderAge ? (
        // Under age message
        <div className="text-center" role="alert">
          <div className="text-lg text-amber-400 mb-6">
            {FTUE_COPY.ageGate.underAgeMessage}
          </div>
          <button
            type="button"
            onClick={() => setShowUnderAge(false)}
            className={`px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors ${FOCUS_RING_CLASS}`}
          >
            Back
          </button>
        </div>
      ) : (
        // Age question
        <>
          <p className="text-lg text-slate-200 mb-8">
            {FTUE_COPY.ageGate.question}
          </p>

          <div className="flex flex-col gap-4 w-full max-w-xs" role="group" aria-label="Age verification options">
            <button
              type="button"
              onClick={handleYes}
              className={`px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors ${FOCUS_RING_CLASS}`}
            >
              {FTUE_COPY.ageGate.yesButton}
            </button>
            <button
              type="button"
              onClick={handleNo}
              className={`px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors ${FOCUS_RING_CLASS}`}
            >
              {FTUE_COPY.ageGate.noButton}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
