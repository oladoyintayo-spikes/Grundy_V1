/**
 * GRUNDY GAME EVENT TYPES
 *
 * Game event definitions for the notification pipeline.
 * Per Bible §11.6.3 Trigger Conditions.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.3
 */

// ============================================================================
// Game Event Type
// ============================================================================

/**
 * Game event types that can trigger notifications.
 * Maps to Bible §11.6.3 Trigger Conditions table.
 */
export type GameEventType =
  | 'HUNGER_CRITICAL'      // hunger < 20
  | 'MOOD_CRITICAL'        // mood < 30
  | 'NEGLECT_TRANSITION'   // Stage change
  | 'RUNAWAY'              // Day 14 reached
  | 'SICKNESS_ONSET'       // isSick → true
  | 'LEVEL_UP'             // XP threshold
  | 'EVOLUTION'            // Stage change
  | 'ENERGY_FULL'          // energy === 50
  | 'DAILY_REWARD_READY'   // New calendar day
  | 'EVENT_START'          // Event becomes active
  | 'ACHIEVEMENT_UNLOCKED'; // Achievement earned

// ============================================================================
// Game Event Interface
// ============================================================================

/**
 * Game event for the notification pipeline.
 *
 * IMPORTANT: timestamp must be deterministic (passed in, never Date.now()).
 * This enables testability and predictable behavior.
 */
export interface GameEvent {
  /** Event type from the trigger conditions table */
  type: GameEventType;
  /** Event payload with context data */
  payload: Record<string, unknown>;
  /** Deterministic timestamp (ms since epoch, passed by caller) */
  timestamp: number;
}
