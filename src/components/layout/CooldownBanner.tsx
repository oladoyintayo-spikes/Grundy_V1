// ============================================
// GRUNDY — COOLDOWN BANNER (Bible v1.10 §14.6)
// Player-facing cooldown visibility on main view
// UI Overlay Safety Rules: Cooldown timer must be visible when active
// ============================================

import React from 'react';

export interface CooldownBannerProps {
  /** Whether cooldown is currently active */
  isOnCooldown: boolean;
  /** Whether pet is stuffed (blocks feeding entirely) */
  isStuffed: boolean;
  /** Remaining cooldown time in seconds */
  cooldownRemaining: number;
  /** Fullness state label (for context) */
  fullnessState?: 'hungry' | 'satisfied' | 'full' | 'stuffed';
}

/**
 * Cooldown Banner - Bible v1.10 §14.6 UI Overlay Safety Rules
 *
 * Section 2: Feeding Cooldown Must Be Clear
 * - If feeding is on cooldown, UI must clearly communicate this state
 * - Recommended: Disabled feed state + remaining time visible
 * - Required: UI must not allow spam-feeding attempts without feedback
 * - Cooldown timer, when active, should be visible on main view (not dev-only)
 *
 * This banner appears on the main home view when cooldown or stuffed state is active.
 */
export function CooldownBanner({
  isOnCooldown,
  isStuffed,
  cooldownRemaining,
  fullnessState,
}: CooldownBannerProps) {
  // Don't render if neither cooldown nor stuffed
  if (!isOnCooldown && !isStuffed) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isStuffed) {
    return (
      <div
        className="bg-red-500/20 border border-red-500/40 rounded-xl px-3 py-2 flex items-center justify-center gap-2"
        role="status"
        aria-live="polite"
        data-testid="cooldown-banner-stuffed"
      >
        <span aria-hidden="true">🚫</span>
        <span className="text-sm text-red-300 font-medium">
          Too full to eat!
        </span>
        <span className="text-xs text-red-400/70">
          Wait for hunger to decrease
        </span>
      </div>
    );
  }

  if (isOnCooldown) {
    return (
      <div
        className="bg-orange-500/20 border border-orange-500/40 rounded-xl px-3 py-2 flex items-center justify-center gap-2"
        role="status"
        aria-live="polite"
        data-testid="cooldown-banner-active"
      >
        <span aria-hidden="true">⏱️</span>
        <span className="text-sm text-orange-300 font-medium">
          Digesting...
        </span>
        <span className="text-xs text-orange-200 font-mono bg-orange-500/30 px-1.5 py-0.5 rounded" data-testid="cooldown-timer">
          {formatTime(cooldownRemaining)}
        </span>
        <span className="text-[10px] text-orange-400/70">
          (reduced feed value)
        </span>
      </div>
    );
  }

  return null;
}

export default CooldownBanner;
