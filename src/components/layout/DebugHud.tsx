// ============================================
// GRUNDY — DEBUG HUD
// Dev-only stats display for QA testing
// Bible §4.4: "Debug stats gated behind dev flag"
// BCT-HUD-002: Debug HUD Gated
// ============================================

import React from 'react';
import { useGameStore } from '../../game/store';
import { getFullnessState, isOnCooldown, getCooldownRemaining } from '../../game/systems';

/**
 * DebugHud - Developer-only stats panel
 *
 * Per Bible §4.4 Developer/QA Exception:
 * "Developer and QA builds may expose additional debug stats (XP bars, hunger meters,
 *  cooldown timers, feed counters, session timers). These must not appear in player-facing builds."
 *
 * This component is only rendered when import.meta.env.DEV is true.
 */
export function DebugHud() {
  // Only render in development builds
  if (!import.meta.env.DEV) {
    return null;
  }

  return <DebugHudContent />;
}

function DebugHudContent() {
  const pet = useGameStore((state) => state.pet);
  const stats = useGameStore((state) => state.stats);
  const energy = useGameStore((state) => state.energy);

  const now = Date.now();
  const onCooldown = isOnCooldown(stats.lastFeedCooldownStart, now);
  const cooldownRemaining = getCooldownRemaining(stats.lastFeedCooldownStart, now);
  const fullnessState = getFullnessState(pet.hunger);

  // Format cooldown remaining as mm:ss
  const formatCooldown = (ms: number): string => {
    if (ms <= 0) return '0:00';
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format session duration
  const sessionDuration = Math.floor((now - stats.sessionStartTime) / 1000 / 60);

  return (
    <div
      className="fixed bottom-20 left-2 z-50 bg-black/90 text-white p-3 rounded-lg text-xs font-mono max-w-[200px] border border-yellow-500/50"
      data-testid="debug-hud"
    >
      <div className="text-yellow-400 font-bold mb-2 flex items-center gap-1">
        <span>🔧</span> DEBUG HUD
      </div>

      {/* Pet Stats */}
      <div className="space-y-1 mb-2 border-b border-white/20 pb-2">
        <div className="flex justify-between">
          <span className="text-gray-400">XP:</span>
          <span>{pet.xp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Hunger:</span>
          <span>{Math.round(pet.hunger)}/100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fullness:</span>
          <span className={fullnessState === 'STUFFED' ? 'text-red-400' : ''}>{fullnessState}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Mood:</span>
          <span>{pet.mood}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Bond:</span>
          <span>{Math.round(pet.bond)}</span>
        </div>
      </div>

      {/* Energy (mini-game context) */}
      <div className="space-y-1 mb-2 border-b border-white/20 pb-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Energy:</span>
          <span>{energy.current}/{energy.max}</span>
        </div>
      </div>

      {/* Cooldown & Feeding */}
      <div className="space-y-1 mb-2 border-b border-white/20 pb-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Cooldown:</span>
          <span className={onCooldown ? 'text-orange-400' : 'text-green-400'}>
            {onCooldown ? formatCooldown(cooldownRemaining) : 'Ready'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Feeds:</span>
          <span>{stats.totalFeeds}</span>
        </div>
      </div>

      {/* Session Info */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Session:</span>
          <span>{sessionDuration}m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Feed:</span>
          <span>{stats.lastFeedTime ? new Date(stats.lastFeedTime).toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>
    </div>
  );
}

export default DebugHud;
