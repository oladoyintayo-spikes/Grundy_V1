// ============================================
// GRUNDY — MENU OVERLAY (Bible v1.10 §14.5)
// Slide-up overlay panel for main navigation
// Contains: Switch Pet, Shop, Inventory, Games, Settings, Home
// ============================================

import React, { useEffect, useRef } from 'react';
import { playUiTap } from '../../audio/audioManager';

// Focus ring classes for consistent keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

export type MenuAction = 'switch-pet' | 'shop' | 'inventory' | 'games' | 'settings' | 'home';

export interface MenuOverlayProps {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Called when overlay should close */
  onClose: () => void;
  /** Called when a menu action is selected */
  onAction: (action: MenuAction) => void;
  /** Pet status badge count for Switch Pet option */
  badgeCount?: number;
}

interface MenuOption {
  id: MenuAction;
  label: string;
  icon: string;
  description?: string;
}

const MENU_OPTIONS: MenuOption[] = [
  { id: 'switch-pet', label: 'Switch Pet', icon: '🐾', description: 'Change active Grundy' },
  { id: 'shop', label: 'Shop', icon: '🛒', description: 'Buy food and care items' },
  { id: 'inventory', label: 'Inventory', icon: '🎒', description: 'View your items' },
  { id: 'games', label: 'Games', icon: '🎮', description: 'Play mini-games' },
  { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Sound, music, and more' },
  { id: 'home', label: 'Home', icon: '🏠', description: 'Return to welcome screen' },
];

/**
 * Menu Overlay - Bible v1.10 §14.5
 *
 * Slide-up overlay panel providing primary navigation:
 * - Switch Pet: Opens Pet Selector modal
 * - Shop: Opens Shop screen
 * - Inventory: Opens Inventory screen
 * - Games: Opens Mini-Game Hub
 * - Settings: Opens Settings panel
 * - Home: Return to welcome (with confirmation)
 *
 * Dismiss behavior: tap scrim, close button, or swipe down.
 */
export function MenuOverlay({
  isOpen,
  onClose,
  onAction,
  badgeCount = 0,
}: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // Trap focus within overlay when open
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.focus();
    }
  }, [isOpen]);

  const handleAction = (action: MenuAction) => {
    playUiTap();
    onAction(action);
    onClose();
  };

  const handleScrimClick = () => {
    playUiTap();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      data-testid="menu-overlay"
    >
      {/* Scrim - tap to dismiss */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleScrimClick}
        data-testid="menu-overlay-scrim"
        aria-hidden="true"
      />

      {/* Menu Panel - slides up from bottom */}
      <div
        ref={overlayRef}
        className="relative bg-slate-900 rounded-t-2xl border-t border-white/10 p-4 pb-8 animate-slide-up safe-area-inset-bottom"
        tabIndex={-1}
        data-testid="menu-overlay-panel"
      >
        {/* Handle bar for visual swipe affordance */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1 bg-slate-600 rounded-full" aria-hidden="true" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors ${FOCUS_RING_CLASS}`}
          aria-label="Close menu"
          data-testid="menu-overlay-close"
        >
          ✕
        </button>

        {/* Menu Title */}
        <h2 className="text-lg font-semibold text-white mb-4 px-2">Menu</h2>

        {/* Menu Options Grid */}
        <div className="grid grid-cols-3 gap-3" role="menu">
          {MENU_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAction(option.id)}
              className={`relative flex flex-col items-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all active:scale-95 ${FOCUS_RING_CLASS}`}
              role="menuitem"
              data-testid={`menu-option-${option.id}`}
            >
              <span className="text-2xl mb-2" aria-hidden="true">
                {option.icon}
              </span>
              <span className="text-sm text-slate-200 font-medium">{option.label}</span>
              {/* Badge for Switch Pet */}
              {option.id === 'switch-pet' && badgeCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full"
                  aria-label={`${badgeCount} pets need attention`}
                  data-testid="menu-pet-badge"
                >
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Note about Cosmetics - Phase 11 gating per Bible v1.10 */}
        {/* Cosmetics NOT shown until Phase 11 implementation */}
      </div>
    </div>
  );
}

export default MenuOverlay;
