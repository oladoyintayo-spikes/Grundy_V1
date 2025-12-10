// ============================================
// GRUNDY — FTUE MODE SELECTION SCREEN
// Bible §7.7, §9 — Cozy vs Classic mode
// P4-6: Implement mode select
// ============================================

import React from 'react';
import { FTUE_COPY, MODE_DESCRIPTIONS } from '../../copy/ftue';
import type { PlayMode } from '../../types';

interface FtueModeSelectProps {
  onSelectMode: (mode: PlayMode) => void;
}

export function FtueModeSelect({ onSelectMode }: FtueModeSelectProps) {
  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-6 py-8">
      {/* Title */}
      <div className="text-2xl font-bold text-white text-center mb-2">
        {FTUE_COPY.modeSelect.title}
      </div>
      <div className="text-sm text-slate-400 text-center mb-8">
        {FTUE_COPY.modeSelect.subtitle}
      </div>

      {/* Mode Cards */}
      <div className="flex-1 flex flex-col gap-4">
        {MODE_DESCRIPTIONS.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`flex-1 flex flex-col p-5 rounded-2xl transition-all hover:scale-[1.02] ${
              mode.id === 'cozy'
                ? 'bg-gradient-to-br from-sky-900/50 to-slate-800/50 border border-sky-700/30'
                : 'bg-gradient-to-br from-orange-900/50 to-slate-800/50 border border-orange-700/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{mode.emoji}</span>
              <div className="text-left">
                <div className="text-lg font-bold text-white">{mode.name}</div>
                <div className="text-sm text-slate-400">{mode.tagline}</div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-300 mb-4 text-left">
              "{mode.description}"
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {mode.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded-full ${
                    mode.id === 'cozy'
                      ? 'bg-sky-800/50 text-sky-300'
                      : 'bg-orange-800/50 text-orange-300'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Choose Button */}
            <div
              className={`mt-auto pt-4 text-center font-semibold ${
                mode.id === 'cozy' ? 'text-sky-400' : 'text-orange-400'
              }`}
            >
              {FTUE_COPY.modeSelect.chooseButton}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
