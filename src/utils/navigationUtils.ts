/**
 * GRUNDY NAVIGATION UTILITIES
 *
 * Navigation target validation and resolution.
 * Per Bible §11.6.2: deepLink required; unknown targets → 'home'.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import {
  NavigationTarget,
  DEFAULT_NAVIGATION_TARGET,
  VALID_NAVIGATION_TARGETS,
} from '../types/navigation';

/**
 * Validate and sanitize navigation target.
 *
 * Unknown targets fall back to 'home' per Bible §11.6.2.
 * BCT-TRIGGER-004: Navigation target sanitization.
 *
 * @param target - Raw navigation target string
 * @returns Valid NavigationTarget
 */
export function sanitizeNavigationTarget(
  target: string | undefined | null
): NavigationTarget {
  // Null/undefined → default
  if (!target) {
    return DEFAULT_NAVIGATION_TARGET;
  }

  // Valid target → return as-is
  if (VALID_NAVIGATION_TARGETS.has(target as NavigationTarget)) {
    return target as NavigationTarget;
  }

  // Unknown target → safe fallback
  // Only log in development to avoid console noise in prod/test
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[navigation] Unknown target "${target}", using "${DEFAULT_NAVIGATION_TARGET}"`
    );
  }

  return DEFAULT_NAVIGATION_TARGET;
}

/**
 * Navigation context interface for app-specific navigation handlers.
 *
 * This interface should be implemented by the app to handle navigation.
 * Different apps may use different navigation patterns (router, modals, state).
 */
export interface NavigationContext {
  /** Set active screen in state-based navigation */
  setActiveScreen?: (screen: string) => void;
  /** Open a modal/drawer */
  openModal?: (modal: string) => void;
  /** Close all modals */
  closeAllModals?: () => void;
  /** Open shop */
  openShop?: () => void;
  /** Open inventory */
  openInventory?: () => void;
}

/**
 * Navigate to a target.
 *
 * Handles modals, drawers, and screen state based on the app's navigation pattern.
 * This is a canonical resolver — all notification navigation goes through here.
 *
 * @param target - Valid navigation target
 * @param context - App-specific navigation context
 */
export function navigateToTarget(
  target: NavigationTarget,
  context: NavigationContext
): void {
  // Close any open modals first
  context.closeAllModals?.();

  switch (target) {
    case 'home':
      context.setActiveScreen?.('home');
      break;

    case 'games':
      context.setActiveScreen?.('games');
      break;

    case 'shop':
      // Shop is typically a modal/overlay
      context.openShop?.();
      break;

    case 'inventory':
      // Inventory is typically a modal/overlay
      context.openInventory?.();
      break;

    case 'settings':
      context.setActiveScreen?.('settings');
      break;

    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = target;
      console.warn(`[navigation] Unhandled target: ${_exhaustive}`);
      context.setActiveScreen?.('home');
  }
}
