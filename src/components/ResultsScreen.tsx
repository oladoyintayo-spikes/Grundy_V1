// ============================================
// GRUNDY — RESULTS SCREEN
// Post-game results and rewards display
// P5-AUDIO-HOOKS
// ============================================

import React, { useEffect } from 'react';
import type { MiniGameResult, RewardTier } from '../types';
import { playMiniGameResult, playUiConfirm, playUiBack } from '../audio/audioManager';

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
    <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6">
      {/* Tier Badge */}
      <div className={`bg-gradient-to-br ${TIER_COLORS[tier]} rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg`}>
        <span className="text-5xl">{TIER_EMOJIS[tier]}</span>
      </div>

      {/* Tier Label */}
      <h2 className="text-3xl font-bold text-white mb-2">{TIER_LABELS[tier]}</h2>

      {/* Score */}
      <p className="text-white/70 text-lg mb-6">Score: {score}</p>

      {/* Rewards Box */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 w-full max-w-xs">
        <h3 className="text-white font-bold mb-4 text-center">Rewards</h3>

        <div className="space-y-3">
          {/* Coins */}
          <div className="flex justify-between items-center">
            <span className="text-white/70">Coins</span>
            <span className="text-yellow-400 font-bold">+{rewards.coins} 🪙</span>
          </div>

          {/* XP */}
          <div className="flex justify-between items-center">
            <span className="text-white/70">XP</span>
            <span className="text-blue-400 font-bold">+{rewards.xp} ✨</span>
          </div>

          {/* Food Drop */}
          {rewards.foodDrop && (
            <div className="flex justify-between items-center">
              <span className="text-white/70">Food</span>
              <span className="text-green-400 font-bold">+1 {rewards.foodDrop}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="bg-white/10 backdrop-blur rounded-xl px-6 py-3 text-white hover:bg-white/20 transition"
        >
          Back to Hub
        </button>
        <button
          onClick={handleCollect}
          className="bg-green-500 rounded-xl px-8 py-3 text-white font-bold hover:bg-green-600 transition active:scale-95"
        >
          Collect!
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;
