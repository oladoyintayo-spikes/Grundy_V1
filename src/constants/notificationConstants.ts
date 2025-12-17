/**
 * GRUNDY NOTIFICATION BIBLE CONSTANTS
 *
 * These values are LOCKED per GRUNDY_MASTER_BIBLE v1.11 §11.6.2, §11.6.3.
 * Do not modify without explicit Bible version bump.
 *
 * This is the SINGLE SOURCE OF TRUTH for notification-related Bible values.
 * Both runtime code and tests import from this file.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11)
 * @see docs/BIBLE_COMPLIANCE_TEST.md (v2.5)
 */

import type { NotificationType } from '../types/notifications';

// ============================================================================
// §11.6.2 Notification Center - Storage Limits
// ============================================================================

/**
 * Maximum notifications stored per Bible §11.6.2.
 * BCT-NOTIF-001: Max 50 notifications stored.
 */
export const MAX_NOTIFICATIONS = 50;

/**
 * Maximum non-critical notifications per session per Bible §11.6.3.
 * BCT-TRIGGER-005: Session limit is 5 non-critical.
 */
export const MAX_NON_CRITICAL_PER_SESSION = 5;

// ============================================================================
// §11.6.3 Trigger Conditions - Cooldowns (in milliseconds)
// ============================================================================

/**
 * Notification cooldowns per type per Bible §11.6.3 Trigger Conditions table.
 *
 * Values extracted from Bible:
 * - pet_care (Hunger/Mood critical): 2 hours
 * - neglect: Once per stage (0 - handled by dedupe key)
 * - level_up: Immediate (0)
 * - evolution: Immediate (0)
 * - achievement: Default (30 min fallback)
 * - minigame (Energy full): 4 hours
 * - event: Immediate (0)
 * - daily: Once per day (24 hours)
 *
 * BCT-TRIGGER-002: Same-type cooldown uses these values.
 */
export const NOTIFICATION_COOLDOWNS: Record<NotificationType, number> = {
  pet_care: 2 * 60 * 60 * 1000,    // 2 hours (Hunger/Mood critical)
  neglect: 0,                       // Once per stage (dedupe key handles this)
  level_up: 0,                      // Immediate
  evolution: 0,                     // Immediate
  achievement: 0,                   // Immediate
  minigame: 4 * 60 * 60 * 1000,    // 4 hours (Energy full)
  event: 0,                         // Immediate
  daily: 24 * 60 * 60 * 1000,      // Once per day (24 hours)
};

/**
 * Default cooldown for unknown notification types.
 * Bible §11.6.3 Suppression Rules: "Min 30 min between same notification type"
 */
export const DEFAULT_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

// ============================================================================
// §11.6.2 Notification Center - UI Constants
// ============================================================================

/**
 * Toast display duration in milliseconds.
 * Standard toast visibility time before auto-dismiss.
 */
export const TOAST_DURATION_MS = 5000; // 5 seconds

// ============================================================================
// §11.6.3 Offline Batching
// ============================================================================

/**
 * Offline batching threshold per Bible §11.6.3 Suppression Rules.
 * "If returning from offline > 1 hour, batch into summary"
 */
export const OFFLINE_BATCH_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

// ============================================================================
// Test IDs for BCT compliance
// ============================================================================

/**
 * Test IDs for notification components.
 */
export const NOTIFICATION_TEST_IDS = {
  // Toast
  TOAST: 'toast',
  TOAST_ICON: 'toast-icon',
  TOAST_TITLE: 'toast-title',
  TOAST_MESSAGE: 'toast-message',
  TOAST_DISMISS: 'toast-dismiss',

  // Notification Center
  NOTIFICATION_CENTER: 'notification-center',
  NOTIFICATION_CENTER_BACKDROP: 'notification-center-backdrop',
  NOTIFICATION_EMPTY: 'notification-empty',
  NOTIFICATION_ITEM: (id: string) => `notification-item-${id}`,
  NOTIFICATION_UNREAD_DOT: 'notification-unread-dot',
  NOTIFICATION_MARK_ALL_READ: 'notification-mark-all-read',
  NOTIFICATION_CLEAR_ALL: 'notification-clear-all',
  NOTIFICATION_CLOSE: 'notification-close',

  // Menu Badge
  MENU_BADGE: 'menu-badge',
} as const;
