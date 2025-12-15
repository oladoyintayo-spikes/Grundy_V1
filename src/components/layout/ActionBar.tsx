// ============================================
// GRUNDY — ACTION BAR (Bible v1.10 §14.5)
// Bottom-anchored bar with Feed, Games, Menu
// Replaces legacy BottomNav tab navigation
// ============================================

import React from 'react';
import { playUiTap } from '../../audio/audioManager';

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
 */
export function ActionBar({
  onFeedTap,
  onGamesTap,
  onMenuTap,
  isFoodDrawerOpen = false,
  isMenuOpen = false,
  isOnCooldown = false,
  isStuffed = false,
}: ActionBarProps) {
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
          className={`text-xl mb-1 transition-transform ${isFoodDrawerOpen ? 'scale-110' : ''}`}
          aria-hidden="true"
        >
          🍎
        </span>
        <span className={isFoodDrawerOpen ? 'font-medium text-amber-400' : ''}>Feed</span>
        {/* Cooldown/Stuffed indicator */}
        {isStuffed && (
          <span className="absolute top-2 right-1/4 text-[8px] px-1 py-0.5 rounded bg-red-500 text-white" aria-hidden="true">
            🚫
          </span>
        )}
        {isOnCooldown && !isStuffed && (
          <span className="absolute top-2 right-1/4 text-[8px] px-1 py-0.5 rounded bg-orange-500 text-white" aria-hidden="true">
            ⏱
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
