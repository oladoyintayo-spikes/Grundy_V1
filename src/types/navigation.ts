/**
 * GRUNDY NAVIGATION TYPES
 *
 * Navigation target definitions for deep linking.
 * Per Bible §11.6.2: deepLink required; unknown targets → 'home'.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

// ============================================================================
// Navigation Target Type
// ============================================================================

/**
 * Valid navigation targets in Grundy.
 * These map to screens, modals, or drawers — not necessarily URL routes.
 *
 * Note: Add more as features ship:
 * - 'achievements' (Phase 12-A)
 * - 'login-rewards' (Phase 12-B)
 * - 'events' (Phase 12-D)
 */
export type NavigationTarget =
  | 'home'
  | 'games'
  | 'shop'
  | 'inventory'
  | 'settings';

// ============================================================================
// Constants
// ============================================================================

/**
 * Default navigation target for unknown/invalid targets.
 * Per Bible §11.6.2: unknown targets → 'home'.
 */
export const DEFAULT_NAVIGATION_TARGET: NavigationTarget = 'home';

/**
 * Set of all valid navigation targets for validation.
 */
export const VALID_NAVIGATION_TARGETS: Set<NavigationTarget> = new Set([
  'home',
  'games',
  'shop',
  'inventory',
  'settings',
]);
