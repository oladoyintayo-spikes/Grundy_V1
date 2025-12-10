// ============================================
// GRUNDY — READY SCREEN
// Pre-game confirmation/info screen
// P5-AUDIO-HOOKS
// ============================================

import React from 'react';
import type { MiniGameId } from '../types';
import { playUiConfirm, playUiBack } from '../audio/audioManager';

interface ReadyScreenProps {
  gameId: MiniGameId;
  isFree: boolean;
  energyCost: number;
  onStart: () => void;
  onBack: () => void;
}

const GAME_INFO: Record<MiniGameId, { name: string; emoji: string; instructions: string }> = {
  snack_catch: {
    name: 'Snack Catch',
    emoji: '🧺',
    instructions: 'Catch falling foods in your basket! Catch favorites for bonus points, avoid bombs!',
  },
  memory_match: {
    name: 'Memory Match',
    emoji: '🧠',
    instructions: 'Flip cards to find matching food pairs. Fewer moves = better rewards!',
  },
  pips: {
    name: 'Pips',
    emoji: '🎲',
    instructions: 'Match domino tiles by connecting matching pip counts. Clear the board to win!',
  },
  rhythm_tap: {
    name: 'Rhythm Tap',
    emoji: '🎵',
    instructions: 'Tap the beats as they hit the target zone. Stay on rhythm for combos!',
  },
  poop_scoop: {
    name: 'Poop Scoop',
    emoji: '💩',
    instructions: 'Clean up the mess before time runs out! Swipe to scoop and keep the area tidy!',
  },
};

export function ReadyScreen({ gameId, isFree, energyCost, onStart, onBack }: ReadyScreenProps) {
  const gameInfo = GAME_INFO[gameId];

  const handleStart = () => {
    playUiConfirm();
    onStart();
  };

  const handleBack = () => {
    playUiBack();
    onBack();
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6">
      {/* Game Icon */}
      <div className="text-8xl mb-4">{gameInfo.emoji}</div>

      {/* Game Title */}
      <h2 className="text-2xl font-bold text-white mb-2">{gameInfo.name}</h2>

      {/* Instructions */}
      <p className="text-white/70 text-center mb-6 max-w-xs">{gameInfo.instructions}</p>

      {/* Energy cost indicator */}
      <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 mb-6">
        {isFree ? (
          <span className="text-green-400 font-bold">FREE PLAY!</span>
        ) : (
          <span className="text-white">
            Cost: <span className="text-yellow-400">{energyCost} &#9889;</span>
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="bg-white/10 backdrop-blur rounded-xl px-6 py-3 text-white hover:bg-white/20 transition"
        >
          Back
        </button>
        <button
          onClick={handleStart}
          className="bg-green-500 rounded-xl px-8 py-3 text-white font-bold hover:bg-green-600 transition active:scale-95"
        >
          Play!
        </button>
      </div>
    </div>
  );
}

export default ReadyScreen;
