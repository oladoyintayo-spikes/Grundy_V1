// ============================================
// GRUNDY — FTUE MODE SELECTION SCREEN
// Bible §7.7, §9 — Cozy vs Classic mode
// P4-6: Implement mode select
// P5-A11Y-LABELS, P5-UX-KEYS
// ============================================

import React from 'react';
import { FTUE_COPY, MODE_DESCRIPTIONS } from '../../copy/ftue';
import type { PlayMode } from '../../types';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1025]';

interface FtueModeSelectProps {
  onSelectMode: (mode: PlayMode) => void;
}

export function FtueModeSelect({ onSelectMode }: FtueModeSelectProps) {
  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6 py-8">
      {/* Title (P5-A11Y-LABELS) */}
      <h1 className="text-2xl font-bold text-white text-center mb-2">
        {FTUE_COPY.modeSelect.title}
      </h1>
      <p className="text-sm text-slate-300 text-center mb-8">
        {FTUE_COPY.modeSelect.subtitle}
      </p>

      {/* Mode Cards */}
      <div className="flex-1 flex flex-col gap-4" role="group" aria-label="Play mode selection">
        {MODE_DESCRIPTIONS.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelectMode(mode.id)}
            aria-label={`Select ${mode.name} mode: ${mode.tagline}`}
            className={`flex-1 flex flex-col p-5 rounded-2xl transition-all hover:scale-[1.02] ${FOCUS_RING_CLASS} ${
              mode.id === 'cozy'
                ? 'bg-gradient-to-br from-sky-900/50 to-slate-800/50 border border-sky-700/30'
                : 'bg-gradient-to-br from-orange-900/50 to-slate-800/50 border border-orange-700/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" aria-hidden="true">{mode.emoji}</span>
              <div className="text-left">
                <div className="text-lg font-bold text-white">{mode.name}</div>
                <div className="text-sm text-slate-300">{mode.tagline}</div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-200 mb-4 text-left">
              "{mode.description}"
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2" aria-label="Mode features">
              {mode.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded-full ${
                    mode.id === 'cozy'
                      ? 'bg-sky-800/50 text-sky-200'
                      : 'bg-orange-800/50 text-orange-200'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Choose Button */}
            <div
              className={`mt-auto pt-4 text-center font-semibold ${
                mode.id === 'cozy' ? 'text-sky-300' : 'text-orange-300'
              }`}
              aria-hidden="true"
            >
              {FTUE_COPY.modeSelect.chooseButton}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
