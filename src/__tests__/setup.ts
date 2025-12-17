/**
 * Global test setup for Vitest
 *
 * This runs before each test file to ensure clean state.
 * Specifically ensures notification store is reset to prevent
 * test bleed between describe blocks.
 */
import { beforeEach } from 'vitest';
import { __resetUUIDCounterForTests } from '../utils/uuid';

// Reset notification store state before each test
beforeEach(async () => {
  // Dynamically import to avoid circular dependency issues
  const { useNotificationStore } = await import('../stores/notificationStore');

  // Clear notifications and reset session count
  useNotificationStore.getState().clearAll();
  useNotificationStore.getState().resetSessionCount();

  // Also reset UUID counter for determinism
  __resetUUIDCounterForTests();
});
