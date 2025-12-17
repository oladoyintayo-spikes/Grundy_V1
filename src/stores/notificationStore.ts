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
 * - getState() returns a proxy for live state access (test compatibility)
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

/**
 * Normalize notification list: sort by timestamp desc + clamp to max.
 * BCT-NOTIF-001: Max 50 notifications stored.
 * BCT-NOTIF-002: Overflow drops oldest by timestamp (tail trim).
 */
function normalizeList(list: Notification[]): Notification[] {
  const sorted = sortByTimestampDesc(list);
  return sorted.slice(0, MAX_NOTIFICATIONS);
}

// ============================================================================
// Store Implementation
// ============================================================================

// Internal store (standard Zustand)
const _internalStore = create<NotificationState>()(
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

      // Check suppression (no longer requires dedupeKey param)
      if (
        shouldSuppress(
          n,
          state.notifications,
          nowMs,
          state.sessionNonCriticalCount
        )
      ) {
        return false;
      }

      // Generate dedupe key for storage
      const dedupeKey = generateDedupeKey(n);

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
        // Insert and normalize (sort+trim)
        const updated = normalizeList([notification, ...s.notifications]);

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
     * Clear all notifications and reset session state.
     * IMPORTANT: Must reset sessionNonCriticalCount to avoid test bleed.
     */
    clearAll: () => {
      set({
        notifications: [],
        lastAddedId: null,
        sessionNonCriticalCount: 0,
      });
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

// ============================================================================
// Live State Proxy (Test Compatibility)
// ============================================================================

/**
 * State properties that should return live values (not snapshots).
 * These are the data properties that tests read after mutations.
 */
const LIVE_STATE_PROPS = new Set([
  'notifications',
  'lastChecked',
  'sessionNonCriticalCount',
  'lastAddedId',
]);

// Capture original getState before any wrapping
const _originalGetState = _internalStore.getState.bind(_internalStore);

/**
 * Create a proxy that intercepts property access on state objects.
 * For data properties, it fetches from current store state.
 * For methods, it returns the original bound functions.
 *
 * This allows test patterns like:
 *   const store = useNotificationStore.getState();
 *   store.addNotification(n, 1000);
 *   expect(store.notifications.length).toBe(1); // Works!
 */
function createLiveStateProxy(state: NotificationState): NotificationState {
  return new Proxy(state, {
    get(target, prop: string | symbol) {
      // For live state properties, always fetch from current store
      if (typeof prop === 'string' && LIVE_STATE_PROPS.has(prop)) {
        return _originalGetState()[prop as keyof NotificationState];
      }
      // For methods and other properties, use the original
      return target[prop as keyof NotificationState];
    },
  });
}

/**
 * Public notification store API.
 *
 * This wraps the internal Zustand store to provide:
 * - Live state access via proxy (test compatibility)
 * - Standard Zustand hook behavior for React
 */
export const useNotificationStore = Object.assign(
  // The hook function (for React components)
  _internalStore,
  {
    // Override getState to return a live proxy
    getState: (): NotificationState => {
      return createLiveStateProxy(_originalGetState());
    },
    // Preserve other store methods
    setState: _internalStore.setState,
    subscribe: _internalStore.subscribe,
    destroy: _internalStore.destroy,
  }
);

// Re-export default notification data for convenience
export { DEFAULT_NOTIFICATION_DATA };
