// ============================================
// GRUNDY — FTUE AGE GATE SCREEN
// Bible §7.8 — Age gate before FTUE begins
// ============================================

import React, { useState } from 'react';
import { FTUE_COPY } from '../../copy/ftue';

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
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6">
      {/* Title */}
      <div className="text-2xl font-bold text-white mb-8">
        {FTUE_COPY.ageGate.title}
      </div>

      {showUnderAge ? (
        // Under age message
        <div className="text-center">
          <div className="text-lg text-amber-400 mb-6">
            {FTUE_COPY.ageGate.underAgeMessage}
          </div>
          <button
            onClick={() => setShowUnderAge(false)}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      ) : (
        // Age question
        <>
          <div className="text-lg text-slate-300 mb-8">
            {FTUE_COPY.ageGate.question}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={handleYes}
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors"
            >
              {FTUE_COPY.ageGate.yesButton}
            </button>
            <button
              onClick={handleNo}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
            >
              {FTUE_COPY.ageGate.noButton}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
