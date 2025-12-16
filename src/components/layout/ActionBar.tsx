// ============================================
// GRUNDY — ACTION BAR (Bible v1.10 §14.5)
// Bottom-anchored bar with Feed, Games, Menu
// Replaces legacy BottomNav tab navigation
// ============================================

import React, { useState, useEffect } from 'react';
import { playUiTap } from '../../audio/audioManager';
import { formatCooldownMs } from '../../utils/formatTime';

// Focus ring classes for consistent keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export interface ActionBarProps {
  /** Called when Feed button is tapped - opens Food Drawer */
  onFeedTap: () => void;
  /** Called when Games button is tapped - navigates to Mini-Game Hub */
  onGamesTap: () => void;
  /** Called when Menu button is tapped - opens Menu Overlay */
  onMenuTap: () => void;
  /** Whether the Food Drawer is currently open */
  isFoodDrawerOpen?: boolean;
  /** Whether the Menu Overlay is currently open */
  isMenuOpen?: boolean;
  /** Whether cooldown is active (shows indicator on Feed button) */
  isOnCooldown?: boolean;
  /** Whether pet is stuffed (shows blocked indicator on Feed button) */
  isStuffed?: boolean;
  /** Remaining cooldown time in milliseconds (for countdown display) */
  cooldownRemainingMs?: number;
}

/**
 * Action Bar - Bible v1.10 §14.5
 *
 * Bottom-anchored row providing quick access to core actions:
 * - Feed: Opens Food Drawer (not a navigation destination)
 * - Games: Routes to Mini-Game Hub (same as Menu → Games)
 * - Menu: Opens Menu Overlay (same as header menu icon)
 *
 * Design Intent: Keep core loop (feed, play, navigate) within thumb reach.
 *
 * Feed Status Display (precedence):
 * 1. "Too full" - when pet is stuffed (player-actionable)
 * 2. Countdown timer - when on cooldown (time-based lock)
 * 3. Normal "Feed" - when ready to feed
 */
export function ActionBar({
  onFeedTap,
  onGamesTap,
  onMenuTap,
  isFoodDrawerOpen = false,
  isMenuOpen = false,
  isOnCooldown = false,
  isStuffed = false,
  cooldownRemainingMs = 0,
}: ActionBarProps) {
  // Local state for 1-second countdown refresh
  const [, setTick] = useState(0);

  // 1-second timer for countdown refresh (only when cooldown is active)
  useEffect(() => {
    if (!isOnCooldown || cooldownRemainingMs <= 0) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnCooldown, cooldownRemainingMs]);

  const handleFeedClick = () => {
    playUiTap();
    onFeedTap();
  };

  const handleGamesClick = () => {
    playUiTap();
    onGamesTap();
  };

  const handleMenuClick = () => {
    playUiTap();
    onMenuTap();
  };

  // Determine Feed button status label (precedence: stuffed > cooldown > normal)
  const getFeedStatusLabel = (): string | null => {
    if (isStuffed) {
      return 'Too full';
    }
    if (isOnCooldown && cooldownRemainingMs > 0) {
      return formatCooldownMs(cooldownRemainingMs);
    }
    return null;
  };

  const feedStatus = getFeedStatusLabel();
  const hasFeedStatus = feedStatus !== null;

  return (
    <nav
      className="h-16 bg-slate-950/90 border-t border-white/10 flex items-center justify-around safe-area-inset-bottom"
      role="navigation"
      aria-label="Action bar"
      data-testid="action-bar"
    >
      {/* Feed Button - Opens Food Drawer */}
      <button
        type="button"
        onClick={handleFeedClick}
        aria-label={isStuffed ? 'Feed (too full)' : isOnCooldown ? 'Feed (on cooldown)' : 'Feed'}
        aria-pressed={isFoodDrawerOpen}
        data-testid="action-bar-feed"
        className={[
          'relative flex flex-col items-center justify-center w-full h-full text-xs transition-all rounded-lg',
          isFoodDrawerOpen ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200',
          FOCUS_RING_CLASS,
        ].join(' ')}
      >
        <span
          className={`text-xl mb-0.5 transition-transform ${isFoodDrawerOpen ? 'scale-110' : ''}`}
          aria-hidden="true"
        >
          🍎
        </span>
        <span className={isFoodDrawerOpen ? 'font-medium text-amber-400' : ''}>Feed</span>
        {/* Feed status sublabel (Too full / cooldown timer) */}
        {hasFeedStatus && (
          <span
            className={`text-[9px] mt-0.5 ${
              isStuffed ? 'text-red-400' : 'text-orange-400'
            }`}
            data-testid="action-bar-feed-status"
            aria-hidden="true"
          >
            {feedStatus}
          </span>
        )}
      </button>

      {/* Games Button - Routes to Mini-Game Hub */}
      <button
        type="button"
        onClick={handleGamesClick}
        aria-label="Games"
        data-testid="action-bar-games"
        className={[
          'flex flex-col items-center justify-center w-full h-full text-xs transition-all rounded-lg',
          'text-slate-400 hover:text-slate-200',
          FOCUS_RING_CLASS,
        ].join(' ')}
      >
        <span className="text-xl mb-1" aria-hidden="true">
          🎮
        </span>
        <span>Games</span>
      </button>

      {/* Menu Button - Opens Menu Overlay */}
      <button
        type="button"
        onClick={handleMenuClick}
        aria-label="Menu"
        aria-expanded={isMenuOpen}
        data-testid="action-bar-menu"
        className={[
          'flex flex-col items-center justify-center w-full h-full text-xs transition-all rounded-lg',
          isMenuOpen ? 'text-white' : 'text-slate-400 hover:text-slate-200',
          FOCUS_RING_CLASS,
        ].join(' ')}
      >
        <span
          className={`text-xl mb-1 transition-transform ${isMenuOpen ? 'scale-110' : ''}`}
          aria-hidden="true"
        >
          ☰
        </span>
        <span className={isMenuOpen ? 'font-medium' : ''}>Menu</span>
      </button>
    </nav>
  );
}

export default ActionBar;
