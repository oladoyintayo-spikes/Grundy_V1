/**
 * GRUNDY OFFLINE BATCHER (STUB)
 *
 * Offline batching helpers per Bible §11.6.3 Suppression Rules.
 * "If returning from offline > 1 hour, batch into summary"
 *
 * NOTE: Full offline integration requires telemetry (lastActiveTimestamp)
 * that may not exist yet. This phase implements the batching helper only.
 * Integration deferred.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.3
 */

import type {
  NewNotification,
  NotificationType,
} from '../types/notifications';
import { OFFLINE_BATCH_THRESHOLD_MS } from '../constants/notificationConstants';

// ============================================================================
// Type Labels for Summary Message
// ============================================================================

const TYPE_LABELS: Record<NotificationType, string> = {
  pet_care: 'pet alert',
  neglect: 'neglect warning',
  level_up: 'level up',
  evolution: 'evolution',
  achievement: 'achievement',
  minigame: 'game update',
  event: 'event',
  daily: 'daily update',
};

// ============================================================================
// Batching Functions
// ============================================================================

/**
 * Determines if notifications should be batched based on offline duration.
 *
 * @param lastOnlineMs - Timestamp when user was last online
 * @param nowMs - Current timestamp
 * @returns true if offline duration exceeds threshold (1 hour)
 */
export function shouldBatch(lastOnlineMs: number, nowMs: number): boolean {
  return nowMs - lastOnlineMs > OFFLINE_BATCH_THRESHOLD_MS;
}

/**
 * Creates a summary notification from multiple notifications.
 *
 * Used when returning from extended offline period (>1 hour).
 * Aggregates notifications by type and creates a single summary.
 *
 * @param notifications - Array of notifications to summarize
 * @returns Summary notification
 */
export function createBatchSummary(
  notifications: NewNotification[]
): NewNotification {
  // Count notifications by type
  const counts: Partial<Record<NotificationType, number>> = {};

  notifications.forEach((n) => {
    counts[n.type] = (counts[n.type] || 0) + 1;
  });

  // Build summary message parts
  const parts = Object.entries(counts)
    .filter(([, count]) => count && count > 0)
    .map(([type, count]) => {
      const label = TYPE_LABELS[type as NotificationType] || type;
      return `${count} ${label}${count! > 1 ? 's' : ''}`;
    });

  const summary =
    parts.length > 0 ? parts.join(', ') : 'Several updates';

  return {
    type: 'daily', // System summary type
    icon: '📋',
    priority: 'medium',
    deepLink: 'home',
    title: 'While you were away...',
    message: summary,
  };
}
