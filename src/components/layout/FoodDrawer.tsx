// ============================================
// GRUNDY — FOOD DRAWER (Bible v1.10 §14.6)
// Bottom drawer for feeding - shows ≥4 food items
// Overlay safety: dismissible, doesn't permanently hide poop/cooldown
// ============================================

import React, { useEffect, useRef } from 'react';
import { FoodDefinition } from '../../types';
import { playUiTap } from '../../audio/audioManager';

// Focus ring classes for consistent keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

export interface FoodDrawerProps {
  /** Whether the drawer is visible */
  isOpen: boolean;
  /** Called when drawer should close */
  onClose: () => void;
  /** All available foods to display */
  foods: FoodDefinition[];
  /** Inventory counts by food ID */
  inventory: Record<string, number>;
  /** Called when a food item is selected for feeding */
  onFeed: (foodId: string) => void;
  /** Whether feeding is currently in progress */
  isFeeding?: boolean;
  /** Whether pet is stuffed (feeding blocked) */
  isStuffed?: boolean;
  /** Whether pet is on cooldown (reduced feed value) */
  isOnCooldown?: boolean;
  /** Cooldown remaining time in milliseconds (from getCooldownRemaining) */
  cooldownRemaining?: number;
}

/**
 * Food Drawer - Bible v1.10 §14.6
 *
 * A Food Drawer is an approved replacement for an always-visible Food Tray if ALL:
 * 1. Feed is available from main view — One tap opens drawer (Feed button in Action Bar)
 * 2. ≥4 food items visible immediately — Drawer contents show at least 4 foods without scrolling
 * 3. Empty foods may show — Disabled state allowed, but must not hide available foods
 * 4. Does not obscure required indicators — Must not permanently block Poop, Cooldown, Currency
 *
 * Design Intent: Modernizes feeding UI while preserving "quick check-in" philosophy.
 * Players can feed in ≤2 interactions (tap Feed → tap food item).
 */
export function FoodDrawer({
  isOpen,
  onClose,
  foods,
  inventory,
  onFeed,
  isFeeding = false,
  isStuffed = false,
  isOnCooldown = false,
  cooldownRemaining = 0,
}: FoodDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus drawer when opened
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  const handleFoodClick = (foodId: string) => {
    const count = inventory[foodId] || 0;
    if (count <= 0 || isFeeding || isStuffed) return;

    playUiTap();
    onFeed(foodId);
    // Don't auto-close - let parent handle via state change
  };

  const handleScrimClick = () => {
    playUiTap();
    onClose();
  };

  /**
   * Format cooldown time as MM:SS
   * @param ms - Remaining time in milliseconds
   * @returns Formatted string like "29:15" or "0:00"
   */
  const formatCooldownTime = (ms: number): string => {
    // Clamp to 0 (never negative)
    const clampedMs = Math.max(0, ms);
    // Convert ms to total seconds
    const totalSeconds = Math.floor(clampedMs / 1000);
    // Cap at 59:59 to prevent absurd display values (cooldown max is 30 min anyway)
    const cappedSeconds = Math.min(totalSeconds, 59 * 60 + 59);
    const mins = Math.floor(cappedSeconds / 60);
    const secs = cappedSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Bible v1.10 §14.6: Show at least 4 food items without scrolling
  // We show ALL foods but ensure the grid displays ≥4 in the visible area
  const displayFoods = foods.slice(0, Math.max(4, foods.length));

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Food drawer"
      data-testid="food-drawer"
    >
      {/* Scrim - tap to dismiss (transparent to show poop indicator) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleScrimClick}
        data-testid="food-drawer-scrim"
        aria-hidden="true"
      />

      {/* Drawer Panel - slides up from bottom */}
      <div
        ref={drawerRef}
        className="relative bg-slate-900/95 rounded-t-2xl border-t border-white/10 p-4 pb-6 animate-slide-up backdrop-blur-sm"
        tabIndex={-1}
        data-testid="food-drawer-panel"
      >
        {/* Handle bar for visual swipe affordance */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-1 bg-slate-600 rounded-full" aria-hidden="true" />
        </div>

        {/* Header with status */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍎</span>
            <h2 className="text-sm font-semibold text-white">Feed Your Grundy</h2>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {isStuffed ? (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400" data-testid="food-drawer-stuffed">
                🚫 Too full!
              </span>
            ) : isOnCooldown ? (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400" data-testid="food-drawer-cooldown">
                ⏱ Digesting... {formatCooldownTime(cooldownRemaining)}
              </span>
            ) : (
              <span className="text-xs text-slate-400">Tap to feed!</span>
            )}
          </div>
        </div>

        {/* Food Grid - Bible v1.10: ≥4 items visible without scrolling */}
        <div
          className="grid grid-cols-4 gap-2"
          role="listbox"
          aria-label="Available foods"
          data-testid="food-drawer-grid"
        >
          {displayFoods.map((food, index) => {
            const count = inventory[food.id] || 0;
            const isDisabled = count <= 0 || isFeeding || isStuffed;
            const showCooldownBadge = isOnCooldown && !isStuffed && count > 0;

            return (
              <button
                key={food.id}
                onClick={() => handleFoodClick(food.id)}
                disabled={isDisabled}
                role="option"
                aria-selected={false}
                aria-disabled={isDisabled}
                data-testid={index === 0 ? 'food-drawer-first-item' : `food-drawer-item-${food.id}`}
                className={[
                  'relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center',
                  isStuffed
                    ? 'border-red-500/30 bg-red-900/20 opacity-40 cursor-not-allowed'
                    : showCooldownBadge
                      ? 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 cursor-pointer'
                      : count > 0 && !isFeeding
                        ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 hover:scale-105 cursor-pointer active:scale-95'
                        : 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed',
                  FOCUS_RING_CLASS,
                ].join(' ')}
              >
                <span className="text-2xl" aria-hidden="true">{food.emoji}</span>
                <span className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                  {food.name}
                </span>
                {/* Cooldown indicator */}
                {showCooldownBadge && (
                  <span className="absolute -top-1 -left-1 text-[8px] px-1 py-0.5 rounded bg-orange-500 text-white" aria-hidden="true">
                    ⏱
                  </span>
                )}
                {/* Stuffed indicator */}
                {isStuffed && count > 0 && (
                  <span className="absolute -top-1 -left-1 text-[8px] px-1 py-0.5 rounded bg-red-500 text-white" aria-hidden="true">
                    🚫
                  </span>
                )}
                {/* Count badge */}
                <span
                  className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-bold
                    ${count > 0 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-300'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Close hint */}
        <p className="text-[10px] text-slate-500 text-center mt-3">
          Tap outside or swipe down to close
        </p>
      </div>
    </div>
  );
}

export default FoodDrawer;
