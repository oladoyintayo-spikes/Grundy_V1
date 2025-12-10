// ============================================
// GRUNDY — FTUE FIRST SESSION SCREEN
// Bible §7.6, §7.8 — Guided first session
// P4-5: Add personality dialogue
// P4-7: First reaction positive
// P5-A11Y-LABELS, P5-UX-KEYS
// ============================================

import React from 'react';
import { FTUE_COPY, getPetLore } from '../../copy/ftue';
import { getPetById } from '../../data/pets';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1025]';

interface FtueFirstSessionProps {
  petId: string;
  onComplete: () => void;
}

export function FtueFirstSession({ petId, onComplete }: FtueFirstSessionProps) {
  const pet = getPetById(petId);
  const lore = getPetLore(petId);
  const petName = lore?.name || pet?.name || 'your pet';

  // Bible §7.6: Personality-specific greeting
  // P4-7: First interaction is always positive
  const greeting = lore?.greeting || "Hi! I'm so glad you found me!";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6">
      {/* Pet (P5-A11Y-LABELS) */}
      <div className="text-6xl mb-4 animate-bounce" role="img" aria-label={petName}>{pet?.emoji}</div>

      {/* Pet Name */}
      <h1 className="text-xl font-bold text-white mb-6">{petName}</h1>

      {/* Speech Bubble - Positive first greeting (P4-5, P4-7) */}
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 max-w-xs" role="status" aria-live="polite">
        <p className="text-sm text-slate-200 text-center">
          <span aria-hidden="true">💭 </span>"{greeting}"
        </p>
      </div>

      {/* Tips */}
      <div className="bg-slate-800/30 rounded-xl p-4 mb-8 max-w-xs" role="region" aria-label="Getting started tips">
        <h2 className="text-sm font-semibold text-white mb-3 text-center">
          {FTUE_COPY.firstSession.title}
        </h2>
        <ul className="space-y-2" aria-label="Tips list">
          {FTUE_COPY.firstSession.tips.map((tip, idx) => (
            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-amber-400" aria-hidden="true">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Ready Button */}
      <button
        type="button"
        onClick={onComplete}
        className={`px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold text-lg transition-colors ${FOCUS_RING_CLASS}`}
      >
        {FTUE_COPY.firstSession.readyButton}
      </button>
    </div>
  );
}
