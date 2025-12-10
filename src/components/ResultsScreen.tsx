// ============================================
// GRUNDY — RESULTS SCREEN
// Post-game results and rewards display
// P5-AUDIO-HOOKS
// P5-UX-KEYS, P5-A11Y-LABELS
// ============================================

import React, { useEffect } from 'react';
import type { MiniGameResult, RewardTier } from '../types';
import { playMiniGameResult, playUiConfirm, playUiBack } from '../audio/audioManager';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900';

interface ResultsScreenProps {
  result: MiniGameResult;
  onCollect: () => void;
  onBack: () => void;
}

const TIER_COLORS: Record<RewardTier, string> = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  rainbow: 'from-purple-500 via-pink-500 to-yellow-500',
};

const TIER_LABELS: Record<RewardTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  rainbow: 'Rainbow!',
};

const TIER_EMOJIS: Record<RewardTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  rainbow: '🌈',
};

export function ResultsScreen({ result, onCollect, onBack }: ResultsScreenProps) {
  const { tier, score, rewards } = result;

  // Play tier result sound on mount (P5-AUDIO-HOOKS)
  useEffect(() => {
    playMiniGameResult(tier);
  }, [tier]);

  const handleCollect = () => {
    playUiConfirm();
    onCollect();
  };

  const handleBack = () => {
    playUiBack();
    onBack();
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6" role="main">
      {/* Tier Badge (P5-A11Y-LABELS) */}
      <div className={`bg-gradient-to-br ${TIER_COLORS[tier]} rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg`} role="img" aria-label={`${TIER_LABELS[tier]} tier badge`}>
        <span className="text-5xl" aria-hidden="true">{TIER_EMOJIS[tier]}</span>
      </div>

      {/* Tier Label */}
      <h1 className="text-3xl font-bold text-white mb-2">{TIER_LABELS[tier]}</h1>

      {/* Score */}
      <p className="text-slate-300 text-lg mb-6">Score: {score}</p>

      {/* Rewards Box (P5-A11Y-LABELS) */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 w-full max-w-xs" role="region" aria-label="Rewards earned">
        <h2 className="text-white font-bold mb-4 text-center">Rewards</h2>

        <dl className="space-y-3">
          {/* Coins */}
          <div className="flex justify-between items-center">
            <dt className="text-slate-300">Coins</dt>
            <dd className="text-yellow-400 font-bold">+{rewards.coins} <span aria-hidden="true">🪙</span></dd>
          </div>

          {/* XP */}
          <div className="flex justify-between items-center">
            <dt className="text-slate-300">XP</dt>
            <dd className="text-blue-400 font-bold">+{rewards.xp} <span aria-hidden="true">✨</span></dd>
          </div>

          {/* Food Drop */}
          {rewards.foodDrop && (
            <div className="flex justify-between items-center">
              <dt className="text-slate-300">Food</dt>
              <dd className="text-green-400 font-bold">+1 {rewards.foodDrop}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Buttons (P5-UX-KEYS) */}
      <div className="flex gap-4" role="group" aria-label="Result actions">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Return to mini-game hub"
          className={`bg-white/10 backdrop-blur rounded-xl px-6 py-3 text-white hover:bg-white/20 transition ${FOCUS_RING_CLASS}`}
        >
          Back to Hub
        </button>
        <button
          type="button"
          onClick={handleCollect}
          aria-label="Collect rewards and continue"
          className={`bg-green-500 rounded-xl px-8 py-3 text-white font-bold hover:bg-green-600 transition active:scale-95 ${FOCUS_RING_CLASS}`}
        >
          Collect!
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;
