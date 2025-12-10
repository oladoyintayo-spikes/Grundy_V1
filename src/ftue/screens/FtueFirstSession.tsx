// ============================================
// GRUNDY — FTUE FIRST SESSION SCREEN
// Bible §7.6, §7.8 — Guided first session
// P4-5: Add personality dialogue
// P4-7: First reaction positive
// ============================================

import React from 'react';
import { FTUE_COPY, getPetLore } from '../../copy/ftue';
import { getPetById } from '../../data/pets';

interface FtueFirstSessionProps {
  petId: string;
  onComplete: () => void;
}

export function FtueFirstSession({ petId, onComplete }: FtueFirstSessionProps) {
  const pet = getPetById(petId);
  const lore = getPetLore(petId);

  // Bible §7.6: Personality-specific greeting
  // P4-7: First interaction is always positive
  const greeting = lore?.greeting || "Hi! I'm so glad you found me!";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6">
      {/* Pet */}
      <div className="text-6xl mb-4 animate-bounce">{pet?.emoji}</div>

      {/* Pet Name */}
      <div className="text-xl font-bold text-white mb-6">{lore?.name || pet?.name}</div>

      {/* Speech Bubble - Positive first greeting (P4-5, P4-7) */}
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 max-w-xs">
        <div className="text-sm text-slate-300 text-center">
          💭 "{greeting}"
        </div>
      </div>

      {/* Tips */}
      <div className="bg-slate-800/30 rounded-xl p-4 mb-8 max-w-xs">
        <div className="text-sm font-semibold text-white mb-3 text-center">
          {FTUE_COPY.firstSession.title}
        </div>
        <ul className="space-y-2">
          {FTUE_COPY.firstSession.tips.map((tip, idx) => (
            <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
              <span className="text-amber-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Ready Button */}
      <button
        onClick={onComplete}
        className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold text-lg transition-colors"
      >
        {FTUE_COPY.firstSession.readyButton}
      </button>
    </div>
  );
}
