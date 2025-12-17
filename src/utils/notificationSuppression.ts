/**
 * GRUNDY NOTIFICATION SUPPRESSION
 *
 * Dedupe and rate limiting logic per Bible §11.6.3 Suppression Rules.
 *
 * Rules:
 * - Same-type cooldown: Min time between same notification type
 * - Session limit: Max 5 non-critical notifications per session
 * - Critical override: Critical notifications (Runaway/sickness) always fire
 * - Batching: If returning from offline > 1 hour, batch into summary (stub)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.3
 */

import type {
  Notification,
  NewNotification,
  NotificationType,
} from '../types/notifications';
import {
  NOTIFICATION_COOLDOWNS,
  DEFAULT_COOLDOWN_MS,
  MAX_NON_CRITICAL_PER_SESSION,
} from '../constants/notificationConstants';

/**
 * Generate dedupe key for a notification.
 *
 * Format: type:petId:optionalContext
 * Used for true deduplication within cooldown window.
 *
 * @param n - New notification input
 * @returns Dedupe key string
 */
export function generateDedupeKey(n: NewNotification): string {
  const parts = [n.type];

  // Add pet ID for pet-specific deduplication
  if (n.petId) {
    parts.push(n.petId);
  }

  // Add context for specific types that need finer deduplication
  if (n.type === 'neglect' && n.message) {
    // Include stage/message for neglect transitions
    // Each stage transition is a unique notification
    parts.push(n.message.slice(0, 50)); // Truncate for safety
  }

  return parts.join(':');
}

/**
 * Check if a notification should be suppressed.
 *
 * Suppression rules per Bible §11.6.3:
 * 1. Critical notifications always fire
 * 2. Session limit for non-critical (max 5)
 * 3. Same-type cooldown from NOTIFICATION_COOLDOWNS
 * 4. True dedupe via dedupeKey within cooldown
 *
 * BCT-TRIGGER-002: Same-type cooldown uses Bible §11.6.3 values.
 * BCT-TRIGGER-005: Session limit enforced (max 5 non-critical).
 *
 * @param newNotif - New notification to check
 * @param recent - Recent notifications for cooldown check
 * @param nowMs - Current timestamp (deterministic)
 * @param sessionNonCriticalCount - Non-critical notifications added this session
 * @param dedupeKey - Dedupe key for this notification
 * @returns true if notification should be suppressed
 */
export function shouldSuppress(
  newNotif: NewNotification,
  recent: Notification[],
  nowMs: number,
  sessionNonCriticalCount: number,
  dedupeKey: string
): boolean {
  // Critical always fires (Bible §11.6.3: "Critical override")
  if (newNotif.priority === 'critical') {
    return false;
  }

  // Session limit for non-critical (Bible §11.6.3)
  if (sessionNonCriticalCount >= MAX_NON_CRITICAL_PER_SESSION) {
    return true;
  }

  // Get cooldown for this type
  const cooldown = NOTIFICATION_COOLDOWNS[newNotif.type] ?? DEFAULT_COOLDOWN_MS;

  // Immediate types (cooldown = 0) are never suppressed by cooldown
  if (cooldown === 0) {
    return false;
  }

  // True dedupe: check for same dedupeKey within cooldown
  const recentDupe = recent.find(
    (n) => n.dedupeKey === dedupeKey && n.timestamp > nowMs - cooldown
  );

  if (recentDupe) {
    return true;
  }

  // Also check same-type cooldown (fallback if no dedupe key match)
  const recentSameType = recent.find(
    (n) => n.type === newNotif.type && n.timestamp > nowMs - cooldown
  );

  return !!recentSameType;
}
