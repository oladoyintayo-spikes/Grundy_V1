// ============================================
// ABILITY INDICATOR (P1-ABILITY-4)
// Shows brief toast-style indicators when abilities trigger
// ============================================

import React, { useEffect } from 'react';
import { useAbilityTriggers, useGameStore } from '../../game/store';

const ABILITY_ICONS: Record<string, string> = {
  bond_bonus: '💕',
  mood_penalty_reduction: '😌',
  decay_reduction: '💤',
  minigame_bonus: '🎮',
  spicy_coin_bonus: '🌶️',
  no_dislikes: '🍽️',
  rare_xp_chance: '✨',
  gem_multiplier: '💎',
};

export const AbilityIndicator: React.FC = () => {
  const abilityTriggers = useAbilityTriggers();
  const clearExpiredAbilityTriggers = useGameStore((state) => state.clearExpiredAbilityTriggers);

  // Auto-clear expired triggers every second
  useEffect(() => {
    if (abilityTriggers.length === 0) return;

    const interval = setInterval(() => {
      clearExpiredAbilityTriggers();
    }, 1000);

    return () => clearInterval(interval);
  }, [abilityTriggers.length, clearExpiredAbilityTriggers]);

  if (abilityTriggers.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2"
      aria-live="polite"
      data-testid="ability-indicator-container"
    >
      {abilityTriggers.map((trigger) => {
        const icon = ABILITY_ICONS[trigger.id] || '⭐';
        return (
          <div
            key={`${trigger.id}-${trigger.triggeredAt}`}
            className="bg-amber-500/90 text-white px-4 py-2 rounded-full shadow-lg animate-bounce-in flex items-center gap-2"
            data-testid="ability-indicator"
          >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{trigger.message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AbilityIndicator;
