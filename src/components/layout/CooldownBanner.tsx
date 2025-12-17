// ============================================
// GRUNDY — COOLDOWN BANNER (Bible v1.10 §14.6)
// Player-facing cooldown visibility on main view
// UI Overlay Safety Rules: Cooldown timer must be visible when active
// ============================================

import React, { useState, useEffect } from 'react';

export interface CooldownBannerProps {
  /** Whether cooldown is currently active */
  isOnCooldown: boolean;
  /** Whether pet is stuffed (blocks feeding entirely) */
  isStuffed: boolean;
  /** Remaining cooldown time in milliseconds (from getCooldownRemaining) */
  cooldownRemaining: number;
  /** Fullness state label (for context) */
  fullnessState?: 'hungry' | 'satisfied' | 'full' | 'stuffed';
}

/**
 * Format cooldown time as MM:SS
 * @param ms - Remaining time in milliseconds
 * @returns Formatted string like "29:15" or "0:00"
 */
function formatTime(ms: number): string {
  // Clamp to 0 (never negative)
  const clampedMs = Math.max(0, ms);
  // Convert ms to total seconds
  const totalSeconds = Math.floor(clampedMs / 1000);
  // Cap at 59:59 to prevent absurd display values (cooldown max is 30 min anyway)
  const cappedSeconds = Math.min(totalSeconds, 59 * 60 + 59);
  const mins = Math.floor(cappedSeconds / 60);
  const secs = cappedSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Cooldown Timer - Real-time countdown display
 * Updates every second while cooldown is active.
 */
function CooldownTimer({ initialRemaining }: { initialRemaining: number }) {
  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    // Reset to initial value when prop changes (new cooldown started)
    setRemaining(initialRemaining);
  }, [initialRemaining]);

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining > 0]); // Only depend on whether timer is active

  return (
    <span
      className="text-xs text-orange-200 font-mono bg-orange-500/30 px-1.5 py-0.5 rounded"
      data-testid="cooldown-timer"
    >
      {formatTime(remaining)}
    </span>
  );
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
 * Bible §4.3: Cooldown banner is ALWAYS visible while active, even when STUFFED.
 * When both STUFFED and on cooldown, both states are communicated.
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

  // Bible §4.3: Cooldown banner ALWAYS visible when active
  // When both STUFFED and cooldown, show both states (stacked)
  if (isStuffed && isOnCooldown) {
    return (
      <div className="space-y-2">
        {/* Stuffed banner */}
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
        {/* Cooldown timer banner - always visible per Bible §4.3 */}
        <div
          className="bg-orange-500/20 border border-orange-500/40 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
          data-testid="cooldown-banner-active"
        >
          <span aria-hidden="true">⏱️</span>
          <span className="text-xs text-orange-300">
            Digesting...
          </span>
          <CooldownTimer initialRemaining={cooldownRemaining} />
        </div>
      </div>
    );
  }

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
        <CooldownTimer initialRemaining={cooldownRemaining} />
        <span className="text-[10px] text-orange-400/70">
          (reduced feed value)
        </span>
      </div>
    );
  }

  return null;
}

export default CooldownBanner;
