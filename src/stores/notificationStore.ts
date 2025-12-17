/**
 * GRUNDY NOTIFICATION STORE
 *
 * Zustand store for notification state management.
 * Per Bible §11.6.2 Notification Center.
 *
 * Key design decisions:
 * - No Date.now() in any store logic (timestamps passed in)
 * - No Math.random() in store logic
 * - Persistence via main save (not separate Zustand persist)
 * - Hydration: sort by timestamp desc, then clamp to 50
 * - Ordering: timestamp desc (newest first)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { generateUUID } from '../utils/uuid';
import { sanitizeNavigationTarget } from '../utils/navigationUtils';
import {
  shouldSuppress,
  generateDedupeKey,
} from '../utils/notificationSuppression';
import { MAX_NOTIFICATIONS } from '../constants/notificationConstants';
import type {
  Notification,
  NewNotification,
  NotificationSaveData,
} from '../types/notifications';
import { DEFAULT_NOTIFICATION_DATA } from '../types/notifications';

// ============================================================================
// Store Interface
// ============================================================================

interface NotificationState {
  // Persisted state (in main save)
  notifications: Notification[];
  lastChecked: number;

  // Session-only state (resets on app load)
  sessionNonCriticalCount: number;
  lastAddedId: string | null; // Track last added for toast detection

  // Actions (all time-dependent actions receive nowMs)
  addNotification: (n: NewNotification, nowMs: number) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: (nowMs: number) => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  openCenter: (nowMs: number) => void;
  resetSessionCount: () => void;

  // Hydration from main save (with hardening)
  hydrate: (data: NotificationSaveData | null | undefined) => void;
  getSaveData: () => NotificationSaveData;

  // Computed
  getUnreadCount: () => number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sort notifications by timestamp descending (newest first).
 * BCT-NOTIF-005: Ordering by timestamp desc (newest first).
 */
function sortByTimestampDesc(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    notifications: [],
    lastChecked: 0,
    sessionNonCriticalCount: 0,
    lastAddedId: null,

    /**
     * Add a notification with suppression logic.
     *
     * @param n - New notification input
     * @param nowMs - Current timestamp (deterministic)
     * @returns true if notification was added, false if suppressed
     */
    addNotification: (n: NewNotification, nowMs: number): boolean => {
      const state = get();

      // Generate dedupe key
      const dedupeKey = generateDedupeKey(n);

      // Check suppression (includes dedupe check)
      if (
        shouldSuppress(
          n,
          state.notifications,
          nowMs,
          state.sessionNonCriticalCount,
          dedupeKey
        )
      ) {
        return false;
      }

      // Create full notification object
      const notification: Notification = {
        ...n,
        id: generateUUID(),
        timestamp: nowMs,
        read: false,
        deepLink: sanitizeNavigationTarget(n.deepLink),
        dedupeKey,
      };

      set((s) => {
        // Insert and sort by timestamp desc (newest first)
        let updated = sortByTimestampDesc([notification, ...s.notifications]);

        // Overflow drops oldest (tail trim after sort)
        // BCT-NOTIF-001: Max 50 notifications stored
        // BCT-NOTIF-002: Overflow drops oldest by timestamp
        if (updated.length > MAX_NOTIFICATIONS) {
          updated = updated.slice(0, MAX_NOTIFICATIONS);
        }

        return {
          notifications: updated,
          lastAddedId: notification.id,
          sessionNonCriticalCount:
            n.priority !== 'critical'
              ? s.sessionNonCriticalCount + 1
              : s.sessionNonCriticalCount,
        };
      });

      return true;
    },

    /**
     * Mark a single notification as read.
     * BCT-NOTIF-004: Mark as read works.
     */
    markAsRead: (id: string) => {
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    },

    /**
     * Mark all notifications as read.
     * BCT-NOTIF-004: Mark as read works (all).
     */
    markAllAsRead: (nowMs: number) => {
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        lastChecked: nowMs,
      }));
    },

    /**
     * Clear a single notification.
     */
    clearNotification: (id: string) => {
      set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
      }));
    },

    /**
     * Clear all notifications.
     */
    clearAll: () => {
      set({ notifications: [], lastAddedId: null });
    },

    /**
     * Record that notification center was opened.
     */
    openCenter: (nowMs: number) => {
      set({ lastChecked: nowMs });
    },

    /**
     * Reset session non-critical count.
     * Called on app initialization or session reset.
     */
    resetSessionCount: () => {
      set({ sessionNonCriticalCount: 0 });
    },

    /**
     * Hydrate from main save with hardening.
     *
     * Hardening steps:
     * 1. Sanitize all deepLinks (BCT-NOTIF-007)
     * 2. Sort by timestamp desc
     * 3. Clamp to MAX_NOTIFICATIONS (drops oldest)
     * 4. Default missing fields
     *
     * BCT-NOTIF-006: Hydration round-trip preserves ordering + read state.
     * BCT-NOTIF-007: Hydration hardening (sort, clamp, sanitize deepLinks).
     */
    hydrate: (data: NotificationSaveData | null | undefined) => {
      const raw = data?.notifications ?? [];

      // Harden: sanitize, ensure required fields
      const sanitized = raw.map((n) => ({
        ...n,
        id: n.id || generateUUID(),
        deepLink: sanitizeNavigationTarget(n.deepLink),
        read: typeof n.read === 'boolean' ? n.read : false,
        timestamp: typeof n.timestamp === 'number' ? n.timestamp : 0,
      }));

      // Sort by timestamp desc THEN clamp (so we keep newest, drop oldest)
      const sorted = sortByTimestampDesc(sanitized);
      const clamped = sorted.slice(0, MAX_NOTIFICATIONS);

      set({
        notifications: clamped,
        lastChecked: data?.lastChecked ?? 0,
        sessionNonCriticalCount: 0, // Reset on hydrate
        lastAddedId: null,
      });
    },

    /**
     * Get save data for main save persistence.
     */
    getSaveData: (): NotificationSaveData => {
      const state = get();
      return {
        notifications: state.notifications,
        lastChecked: state.lastChecked,
      };
    },

    /**
     * Get count of unread notifications.
     * BCT-NOTIF-003: Unread count accurate.
     */
    getUnreadCount: () => {
      return get().notifications.filter((n) => !n.read).length;
    },
  }))
);

// Re-export default notification data for convenience
export { DEFAULT_NOTIFICATION_DATA };
