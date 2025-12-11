// ============================================
// GRUNDY — MINI-GAME HUB
// Game selection UI with energy/limit display
// Bible §8.1, P5-AUDIO-HOOKS
// P5-UX-KEYS, P5-A11Y-LABELS
// ============================================

import React from 'react';
import { useGameStore, useEnergy, useDailyMiniGames } from '../game/store';
import type { MiniGameId } from '../types';
import { playUiTap, playUiBack } from '../audio/audioManager';

// Focus ring class for keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900';

interface MiniGameHubProps {
  onSelectGame: (gameId: MiniGameId) => void;
  onBack: () => void;
}

interface GameInfo {
  id: MiniGameId;
  name: string;
  emoji: string;
  description: string;
  duration: string;
}

const GAMES: GameInfo[] = [
  { id: 'snack_catch', name: 'Snack Catch', emoji: '🧺', description: 'Catch falling food!', duration: '60s' },
  { id: 'memory_match', name: 'Memory Match', emoji: '🧠', description: 'Find matching pairs.', duration: '60-120s' },
  { id: 'pips', name: 'Pips', emoji: '🎲', description: 'Match the dominoes.', duration: '120s' },
  { id: 'rhythm_tap', name: 'Rhythm Tap', emoji: '🎵', description: 'Tap to the beat.', duration: '45-60s' },
  { id: 'poop_scoop', name: 'Poop Scoop', emoji: '💩', description: 'Clean up fast!', duration: '60s' },
];

function formatTime(ms: number): string {
  if (ms <= 0) return '0:00';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function MiniGameHub({ onSelectGame, onBack }: MiniGameHubProps) {
  const energy = useEnergy();
  const dailyMiniGames = useDailyMiniGames();
  const canPlay = useGameStore((state) => state.canPlay);
  const getTimeToNextEnergy = useGameStore((state) => state.getTimeToNextEnergy);
  const tickEnergyRegen = useGameStore((state) => state.tickEnergyRegen);

  // Tick energy regen on mount and every minute
  React.useEffect(() => {
    tickEnergyRegen();
    const interval = setInterval(tickEnergyRegen, 60000);
    return () => clearInterval(interval);
  }, [tickEnergyRegen]);

  const timeToNext = getTimeToNextEnergy();

  const handleBack = () => {
    playUiBack();
    onBack();
  };

  const handleSelectGame = (gameId: MiniGameId, allowed: boolean) => {
    if (allowed) {
      playUiTap();
      onSelectGame(gameId);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col">
      {/* Header (P5-A11Y-LABELS) */}
      <header className="p-4 flex items-center justify-between" role="banner">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to home"
          className={`bg-white/10 backdrop-blur rounded-full p-2 text-white hover:bg-white/20 transition ${FOCUS_RING_CLASS}`}
        >
          <span className="text-xl" aria-hidden="true">&#8592;</span>
        </button>
        <h1 className="text-xl font-bold text-white">Mini-Games</h1>
        <div className="bg-white/10 backdrop-blur rounded-full px-3 py-1 text-white flex items-center gap-1" role="status" aria-label={`Energy: ${energy.current} of ${energy.max}`}>
          <span aria-hidden="true">&#9889;</span>
          <span>{energy.current}/{energy.max}</span>
        </div>
      </header>

      {/* Game Grid (P5-A11Y-LABELS) */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto" role="group" aria-label="Available mini-games">
        {GAMES.map((game, index) => {
          const playStatus = canPlay(game.id);
          const playsToday = dailyMiniGames.plays[game.id] ?? 0;

          return (
            <button
              type="button"
              key={game.id}
              data-testid={index === 0 ? 'play-button' : `game-${game.id}`}
              onClick={() => handleSelectGame(game.id, playStatus.allowed)}
              disabled={!playStatus.allowed}
              aria-label={`${game.name}: ${game.description} Duration: ${game.duration}. ${playsToday} of 3 plays used today.${playStatus.isFree && playStatus.allowed ? ' Free play available.' : ''}${!playStatus.allowed && playStatus.reason ? ` ${playStatus.reason}` : ''}`}
              className={`bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col items-center gap-2 transition ${FOCUS_RING_CLASS}
                ${playStatus.allowed
                  ? 'hover:bg-white/20 active:scale-95 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                }`}
            >
              <span className="text-4xl" aria-hidden="true">{game.emoji}</span>
              <span className="text-white font-bold">{game.name}</span>
              <span className="text-slate-300 text-xs">{game.duration}</span>

              {/* Play count indicator (3 dots) */}
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < playsToday ? 'bg-yellow-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Status badge */}
              {playStatus.isFree && playStatus.allowed && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full" aria-hidden="true">
                  FREE
                </span>
              )}
              {!playStatus.allowed && playStatus.reason && (
                <span className="text-xs text-red-300" aria-hidden="true">
                  {playStatus.reason}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Energy regen timer (P5-A11Y-LABELS) */}
      <footer className="p-4 text-center text-slate-400 text-sm" role="status" aria-live="polite">
        {energy.current < energy.max ? (
          <span>Next energy in {formatTime(timeToNext)}</span>
        ) : (
          <span>Energy full!</span>
        )}
      </footer>
    </div>
  );
}

export default MiniGameHub;
