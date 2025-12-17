/**
 * GRUNDY EVENT EMITTER
 *
 * Game event emission for the notification pipeline.
 * Per Bible §11.6.3 Trigger Conditions.
 *
 * Usage:
 * ```typescript
 * emitGameEvent({
 *   type: 'LEVEL_UP',
 *   payload: { petId: 'munchlet-1', petName: 'Munchlet', level: 5 },
 *   timestamp: nowMs,
 * });
 * ```
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.3
 */

import { useNotificationStore } from '../stores/notificationStore';
import { mapEventToNotification } from './notificationMapper';
import type { GameEvent } from '../types/events';

/**
 * Emit a game event and create notification if mapped.
 *
 * This is the main entry point for the notification pipeline.
 * Game systems call this function to emit events that may trigger notifications.
 *
 * @param event - Game event with deterministic timestamp
 *
 * Pipeline:
 * 1. Event → mapEventToNotification → NewNotification (or null)
 * 2. NewNotification → addNotification (with suppression check)
 * 3. If not suppressed → notification added → toast shown
 */
export function emitGameEvent(event: GameEvent): void {
  // Map event to notification
  const notification = mapEventToNotification(event);

  // No mapping for this event type
  if (!notification) {
    return;
  }

  // Add to store (suppression logic applied internally)
  const { addNotification } = useNotificationStore.getState();
  addNotification(notification, event.timestamp);
}
