/**
 * BCT TESTS — Notification System (Phase 12-0)
 *
 * Bible Compliance Tests for §11.6.2 Notification Center and §11.6.3 Trigger Conditions.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2, §11.6.3
 * @see docs/BIBLE_COMPLIANCE_TEST.md (v2.5)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from '../stores/notificationStore';
import {
  shouldSuppress,
  generateDedupeKey,
} from '../utils/notificationSuppression';
import { mapEventToNotification } from '../services/notificationMapper';
import { sanitizeNavigationTarget } from '../utils/navigationUtils';
import { createBatchSummary } from '../services/offlineBatcher';
import { __resetUUIDCounterForTests } from '../utils/uuid';
import {
  MAX_NOTIFICATIONS,
  NOTIFICATION_COOLDOWNS,
} from '../constants/notificationConstants';
import type {
  Notification,
  NewNotification,
} from '../types/notifications';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Create a test notification with defaults.
 */
function createTestNotification(
  overrides: Partial<NewNotification> = {}
): NewNotification {
  return {
    type: 'level_up',
    title: 'Test',
    message: 'Test message',
    icon: '⭐',
    priority: 'medium',
    deepLink: 'home',
    ...overrides,
  };
}

// ============================================================================
// BCT-NOTIF: Notification Center (§11.6.2)
// ============================================================================

describe('BCT-NOTIF: Notification Center', () => {
  beforeEach(() => {
    useNotificationStore.getState().clearAll();
    useNotificationStore.getState().resetSessionCount();
    __resetUUIDCounterForTests();
  });

  it('BCT-NOTIF-001: Max 50 notifications stored', () => {
    const store = useNotificationStore.getState();

    // Add 55 notifications with distinct timestamps
    for (let i = 0; i < 55; i++) {
      store.addNotification(
        createTestNotification({ title: `Test ${i}` }),
        1000 + i
      );
    }

    expect(store.notifications.length).toBe(MAX_NOTIFICATIONS);
  });

  it('BCT-NOTIF-002: Overflow drops oldest by timestamp (tail trim)', () => {
    const store = useNotificationStore.getState();

    // Add 50 notifications with sequential timestamps
    for (let i = 0; i < 50; i++) {
      store.addNotification(
        createTestNotification({ title: `Test ${i}` }),
        1000 + i // timestamps: 1000, 1001, ..., 1049
      );
    }

    // Add one more with newer timestamp (51st)
    store.addNotification(
      createTestNotification({ title: 'Newest' }),
      2000
    );

    // Newest (timestamp 2000) should be first
    expect(store.notifications[0].title).toBe('Newest');
    expect(store.notifications[0].timestamp).toBe(2000);

    // Oldest (timestamp 1000, Test 0) should be gone
    expect(
      store.notifications.find((n) => n.title === 'Test 0')
    ).toBeUndefined();

    // Test 1 (timestamp 1001) should still exist (now oldest)
    expect(
      store.notifications.find((n) => n.title === 'Test 1')
    ).toBeDefined();
  });

  it('BCT-NOTIF-003: Unread count accurate', () => {
    const store = useNotificationStore.getState();

    store.addNotification(createTestNotification({ title: 'Test 1' }), 1000);
    store.addNotification(
      createTestNotification({ type: 'evolution', title: 'Test 2' }),
      2000
    );

    expect(store.getUnreadCount()).toBe(2);

    store.markAsRead(store.notifications[0].id);
    expect(store.getUnreadCount()).toBe(1);

    store.markAllAsRead(3000);
    expect(store.getUnreadCount()).toBe(0);
  });

  it('BCT-NOTIF-004: Mark as read works', () => {
    const store = useNotificationStore.getState();

    store.addNotification(createTestNotification(), 1000);

    const id = store.notifications[0].id;
    expect(store.notifications[0].read).toBe(false);

    store.markAsRead(id);
    expect(store.notifications[0].read).toBe(true);
  });

  it('BCT-NOTIF-005: Ordering by timestamp desc (newest first)', () => {
    const store = useNotificationStore.getState();

    // Add in arbitrary order
    store.addNotification(createTestNotification({ title: 'T=1000' }), 1000);
    store.addNotification(createTestNotification({ title: 'T=3000' }), 3000);
    store.addNotification(createTestNotification({ title: 'T=2000' }), 2000);

    // Should be sorted by timestamp descending
    expect(store.notifications[0].timestamp).toBe(3000);
    expect(store.notifications[0].title).toBe('T=3000');
    expect(store.notifications[1].timestamp).toBe(2000);
    expect(store.notifications[1].title).toBe('T=2000');
    expect(store.notifications[2].timestamp).toBe(1000);
    expect(store.notifications[2].title).toBe('T=1000');
  });

  it('BCT-NOTIF-006: Hydration preserves ordering + read state', () => {
    const store = useNotificationStore.getState();

    // Add notifications
    store.addNotification(createTestNotification({ title: 'First' }), 1000);
    store.addNotification(createTestNotification({ title: 'Second' }), 2000);

    // Mark one as read
    const firstId = store.notifications.find(
      (n) => n.title === 'First'
    )!.id;
    store.markAsRead(firstId);

    // Get save data
    const saveData = store.getSaveData();

    // Clear and rehydrate
    store.clearAll();
    expect(store.notifications.length).toBe(0);

    store.hydrate(saveData);

    // Verify preserved — sorted by timestamp desc
    expect(store.notifications.length).toBe(2);
    expect(store.notifications[0].title).toBe('Second');
    expect(store.notifications[0].timestamp).toBe(2000);
    expect(store.notifications[1].title).toBe('First');
    expect(store.notifications[1].timestamp).toBe(1000);
    expect(store.notifications[1].read).toBe(true);
    expect(store.notifications[0].read).toBe(false);
  });

  it('BCT-NOTIF-007: Hydration clamps to 50 (drops oldest) and sanitizes deepLinks', () => {
    const store = useNotificationStore.getState();

    // Create corrupt save data: 60 notifications with bad deepLinks, unsorted
    const corruptNotifications: Notification[] = [];
    for (let i = 0; i < 60; i++) {
      corruptNotifications.push({
        id: `corrupt-${i}`,
        type: 'level_up',
        title: `Corrupt ${i}`,
        message: 'Test',
        icon: '⭐',
        priority: 'medium',
        deepLink: '/nonexistent-route' as any, // Invalid
        timestamp: 1000 + i, // 1000, 1001, ..., 1059
        read: false,
      });
    }

    // Shuffle to test sorting
    corruptNotifications.reverse();

    store.hydrate({
      notifications: corruptNotifications,
      lastChecked: 0,
    });

    // Should clamp to 50
    expect(store.notifications.length).toBe(MAX_NOTIFICATIONS);

    // Should keep newest 50 (timestamps 1010-1059), drop oldest (1000-1009)
    expect(store.notifications[0].timestamp).toBe(1059);
    expect(store.notifications[49].timestamp).toBe(1010);

    // All deepLinks should be sanitized to 'home'
    store.notifications.forEach((n) => {
      expect(n.deepLink).toBe('home');
    });
  });
});

// ============================================================================
// BCT-TRIGGER: Notification Triggers (§11.6.3)
// ============================================================================

describe('BCT-TRIGGER: Notification Triggers', () => {
  beforeEach(() => {
    useNotificationStore.getState().clearAll();
    useNotificationStore.getState().resetSessionCount();
    __resetUUIDCounterForTests();
  });

  it('BCT-TRIGGER-001: Event→notification mapping works', () => {
    const event = {
      type: 'LEVEL_UP' as const,
      payload: { petName: 'Munchlet', level: 5 },
      timestamp: 1000,
    };

    const notification = mapEventToNotification(event);

    expect(notification).not.toBeNull();
    expect(notification?.type).toBe('level_up');
    expect(notification?.title).toBe('Level Up!');
    expect(notification?.message).toBe('Munchlet reached Level 5!');
    expect(notification?.deepLink).toBeDefined();
  });

  it('BCT-TRIGGER-002: Same-type cooldown uses Bible §11.6.3 values', () => {
    const nowMs = 1000000;
    const petCareCooldown = NOTIFICATION_COOLDOWNS.pet_care;

    // pet_care has specific cooldown per Bible
    const recentPetCare: Notification[] = [
      {
        id: '1',
        type: 'pet_care',
        title: 'Test',
        message: 'Message',
        icon: '🐾',
        priority: 'medium',
        deepLink: 'home',
        timestamp: nowMs - petCareCooldown / 2, // Half cooldown ago
        read: false,
        dedupeKey: 'pet_care',
      },
    ];

    const newPetCare = createTestNotification({ type: 'pet_care' });
    const dedupeKey = generateDedupeKey(newPetCare);

    // Should suppress (within cooldown)
    expect(
      shouldSuppress(newPetCare, recentPetCare, nowMs, 0, dedupeKey)
    ).toBe(true);

    // After full cooldown, should not suppress
    const afterCooldown = nowMs + petCareCooldown + 1;
    expect(
      shouldSuppress(newPetCare, recentPetCare, afterCooldown, 0, dedupeKey)
    ).toBe(false);
  });

  it('BCT-TRIGGER-003: Timestamp ordering is deterministic', () => {
    const store = useNotificationStore.getState();

    // Add with explicit timestamps in random order
    store.addNotification(createTestNotification({ title: 'T=5000' }), 5000);
    store.addNotification(createTestNotification({ title: 'T=1000' }), 1000);
    store.addNotification(createTestNotification({ title: 'T=3000' }), 3000);
    store.addNotification(createTestNotification({ title: 'T=2000' }), 2000);
    store.addNotification(createTestNotification({ title: 'T=4000' }), 4000);

    // Must be sorted by timestamp desc regardless of insertion order
    expect(store.notifications.map((n) => n.timestamp)).toEqual([
      5000, 4000, 3000, 2000, 1000,
    ]);
  });

  it('BCT-TRIGGER-004: Navigation targets always valid (sanitized)', () => {
    // Known targets
    expect(sanitizeNavigationTarget('home')).toBe('home');
    expect(sanitizeNavigationTarget('games')).toBe('games');
    expect(sanitizeNavigationTarget('shop')).toBe('shop');

    // Unknown targets fall back to 'home'
    expect(sanitizeNavigationTarget('/nonexistent')).toBe('home');
    expect(sanitizeNavigationTarget('login-rewards')).toBe('home'); // Not yet implemented
    expect(sanitizeNavigationTarget(undefined)).toBe('home');
    expect(sanitizeNavigationTarget(null)).toBe('home');
    expect(sanitizeNavigationTarget('')).toBe('home');

    // All mapped events have valid deepLinks
    const eventTypes = [
      'HUNGER_CRITICAL',
      'MOOD_CRITICAL',
      'NEGLECT_TRANSITION',
      'RUNAWAY',
      'SICKNESS_ONSET',
      'LEVEL_UP',
      'EVOLUTION',
      'ENERGY_FULL',
      'DAILY_REWARD_READY',
      'EVENT_START',
      'ACHIEVEMENT_UNLOCKED',
    ] as const;

    eventTypes.forEach((type) => {
      const notification = mapEventToNotification({
        type,
        payload: { petName: 'Test', level: 1 },
        timestamp: 1000,
      });
      expect(notification?.deepLink).toBeDefined();
      expect(typeof notification?.deepLink).toBe('string');
      expect(notification!.deepLink.length).toBeGreaterThan(0);
    });
  });

  it('BCT-TRIGGER-005: Session limit enforced (max 5 non-critical)', () => {
    const store = useNotificationStore.getState();
    const nowMs = 1000;

    // Add 5 non-critical (all should succeed)
    // Use types with 0 cooldown to avoid cooldown suppression
    const immediateTypes = ['level_up', 'evolution', 'achievement'] as const;

    for (let i = 0; i < 5; i++) {
      const result = store.addNotification(
        createTestNotification({
          type: immediateTypes[i % 3],
          title: `Test ${i}`,
          priority: 'medium',
        }),
        nowMs + i
      );
      expect(result).toBe(true);
    }

    expect(store.sessionNonCriticalCount).toBe(5);

    // 6th non-critical should be suppressed
    const result = store.addNotification(
      createTestNotification({ priority: 'low' }),
      nowMs + 100
    );
    expect(result).toBe(false);

    // Critical should still fire
    const criticalResult = store.addNotification(
      createTestNotification({
        type: 'neglect',
        priority: 'critical',
      }),
      nowMs + 200
    );
    expect(criticalResult).toBe(true);
  });
});

// ============================================================================
// BCT-BATCH: Offline Batching Helper
// ============================================================================

describe('BCT-BATCH: Offline Batching Helper', () => {
  it('createBatchSummary formats notification counts', () => {
    const notifications: NewNotification[] = [
      createTestNotification({ type: 'pet_care' }),
      createTestNotification({ type: 'pet_care' }),
      createTestNotification({ type: 'level_up' }),
    ];

    const summary = createBatchSummary(notifications);

    expect(summary.title).toBe('While you were away...');
    expect(summary.message).toContain('2 pet alert');
    expect(summary.message).toContain('1 level up');
    expect(summary.deepLink).toBe('home');
  });
});

// ============================================================================
// BCT-UUID: UUID Generation
// ============================================================================

describe('BCT-UUID: UUID Generation', () => {
  beforeEach(() => {
    __resetUUIDCounterForTests();
  });

  it('generates deterministic IDs in test environment', () => {
    const store = useNotificationStore.getState();

    store.addNotification(createTestNotification({ title: 'First' }), 1000);
    store.addNotification(createTestNotification({ title: 'Second' }), 2000);
    store.addNotification(createTestNotification({ title: 'Third' }), 3000);

    // IDs should be deterministic counter-based
    expect(store.notifications[0].id).toBe('notif-3'); // Newest first
    expect(store.notifications[1].id).toBe('notif-2');
    expect(store.notifications[2].id).toBe('notif-1');
  });
});

// ============================================================================
// BCT-DEDUPE: Deduplication Logic
// ============================================================================

describe('BCT-DEDUPE: Deduplication Logic', () => {
  it('generates unique dedupe keys per type and petId', () => {
    const key1 = generateDedupeKey(
      createTestNotification({ type: 'level_up', petId: 'pet-1' })
    );
    const key2 = generateDedupeKey(
      createTestNotification({ type: 'level_up', petId: 'pet-2' })
    );
    const key3 = generateDedupeKey(
      createTestNotification({ type: 'evolution', petId: 'pet-1' })
    );

    expect(key1).not.toBe(key2); // Different pets
    expect(key1).not.toBe(key3); // Different types
    expect(key2).not.toBe(key3);
  });

  it('includes stage info for neglect dedupe keys', () => {
    const key1 = generateDedupeKey(
      createTestNotification({
        type: 'neglect',
        petId: 'pet-1',
        message: 'Stage: worried',
      })
    );
    const key2 = generateDedupeKey(
      createTestNotification({
        type: 'neglect',
        petId: 'pet-1',
        message: 'Stage: sad',
      })
    );

    expect(key1).not.toBe(key2); // Different stages
  });
});
