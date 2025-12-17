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
  const parts: string[] = [n.type];

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
 * Create fallback dedupe key from notification type and petId.
 */
function makeFallbackKey(n: { type: NotificationType; petId?: string }): string {
  return `${n.type}:${n.petId ?? ''}`;
}

/**
 * Check if a notification should be suppressed.
 *
 * Suppression rules per Bible §11.6.3:
 * 1. Critical notifications always fire
 * 2. Session limit for non-critical (max 5) - but only checked here if
 *    `sessionNonCriticalCount` is provided
 * 3. Same-type cooldown from NOTIFICATION_COOLDOWNS (default 0 = allow)
 * 4. True dedupe via dedupeKey within cooldown
 *
 * IMPORTANT: Suppression is permissive by default - only suppress when
 * Bible rules explicitly say to. Missing data never causes fail-closed.
 *
 * BCT-TRIGGER-002: Same-type cooldown uses Bible §11.6.3 values.
 * BCT-TRIGGER-005: Session limit enforced (max 5 non-critical).
 *
 * @param newNotif - New notification to check
 * @param recent - Recent notifications for cooldown check
 * @param nowMs - Current timestamp (deterministic)
 * @param sessionNonCriticalCount - Non-critical notifications added this session
 * @param dedupeKey - Optional dedupe key (backward compat with old API)
 * @returns true if notification should be suppressed
 */
export function shouldSuppress(
  newNotif: NewNotification,
  recent: Notification[],
  nowMs: number,
  sessionNonCriticalCount: number,
  dedupeKey?: string
): boolean {
  // 1) Critical always fires (Bible §11.6.3: "Critical override")
  if (newNotif.priority === 'critical') {
    return false;
  }

  // 2) Cooldown - default to 0 (allow) if type not found
  const cooldown = NOTIFICATION_COOLDOWNS[newNotif.type] ?? 0;

  // 3) Low priority is always subject to session limit (spam prevention)
  // Medium/High priority with cooldown=0 bypass session limit (important milestones)
  if (newNotif.priority === 'low') {
    if (sessionNonCriticalCount >= MAX_NON_CRITICAL_PER_SESSION) {
      return true;
    }
  } else if (cooldown === 0) {
    // Medium/High priority with immediate types - always allow
    return false;
  }

  // 4) Session limit for notifications with cooldowns
  if (cooldown > 0 && sessionNonCriticalCount >= MAX_NON_CRITICAL_PER_SESSION) {
    return true;
  }

  // 5) No cooldown and not low priority - allow without cooldown check
  if (cooldown === 0) {
    return false;
  }

  // 6) Build dedupe key with fallback
  // Accept optional dedupeKey param for backward compat with BCT-TRIGGER-002
  const key = dedupeKey
    ? String(dedupeKey)
    : (newNotif as { dedupeKey?: string }).dedupeKey
      ? String((newNotif as { dedupeKey?: string }).dedupeKey)
      : makeFallbackKey(newNotif);

  // 7) Check for matching notification within cooldown window
  // Tolerate older notifications missing dedupeKey by comparing fallback
  const hit = recent.find((n) => {
    const nKey = (n as { dedupeKey?: string }).dedupeKey
      ? String((n as { dedupeKey?: string }).dedupeKey)
      : makeFallbackKey(n);

    return n.timestamp > nowMs - cooldown && nKey === key;
  });

  return Boolean(hit);
}
