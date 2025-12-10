// ============================================
// GRUNDY — MINI-GAME HUB
// Game selection UI with energy/limit display
// Bible §8.1
// ============================================

import React from 'react';
import { useGameStore, useEnergy, useDailyMiniGames } from '../game/store';
import type { MiniGameId } from '../types';

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

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/10 backdrop-blur rounded-full p-2 text-white hover:bg-white/20 transition"
        >
          <span className="text-xl">&#8592;</span>
        </button>
        <h2 className="text-xl font-bold text-white">Mini-Games</h2>
        <div className="bg-white/10 backdrop-blur rounded-full px-3 py-1 text-white flex items-center gap-1">
          <span>&#9889;</span>
          <span>{energy.current}/{energy.max}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto">
        {GAMES.map((game) => {
          const playStatus = canPlay(game.id);
          const playsToday = dailyMiniGames.plays[game.id] ?? 0;

          return (
            <button
              key={game.id}
              onClick={() => playStatus.allowed && onSelectGame(game.id)}
              disabled={!playStatus.allowed}
              className={`bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col items-center gap-2 transition
                ${playStatus.allowed
                  ? 'hover:bg-white/20 active:scale-95 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                }`}
            >
              <span className="text-4xl">{game.emoji}</span>
              <span className="text-white font-bold">{game.name}</span>
              <span className="text-white/60 text-xs">{game.duration}</span>

              {/* Play count indicator (3 dots) */}
              <div className="flex gap-1">
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
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  FREE
                </span>
              )}
              {!playStatus.allowed && playStatus.reason && (
                <span className="text-xs text-red-300">
                  {playStatus.reason}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Energy regen timer */}
      <div className="p-4 text-center text-white/50 text-sm">
        {energy.current < energy.max ? (
          <span>Next energy in {formatTime(timeToNext)}</span>
        ) : (
          <span>Energy full!</span>
        )}
      </div>
    </div>
  );
}

export default MiniGameHub;
