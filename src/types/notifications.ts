/**
 * GRUNDY NOTIFICATION TYPES
 *
 * Type definitions for the Notification System per Bible §11.6.2.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import type { NavigationTarget } from './navigation';

// ============================================================================
// Notification Type Enum
// ============================================================================

/**
 * Notification types per Bible §11.6.3 Trigger Conditions table.
 */
export type NotificationType =
  | 'pet_care'     // Hunger/Mood critical, Sickness onset
  | 'neglect'      // Neglect transition, Runaway
  | 'level_up'     // XP threshold reached
  | 'evolution'    // Stage change
  | 'achievement'  // Achievement unlocked
  | 'minigame'     // Energy full
  | 'event'        // Event start
  | 'daily';       // Daily reward ready

// ============================================================================
// Notification Priority
// ============================================================================

/**
 * Notification priority levels per Bible §11.6.2.
 * Critical notifications bypass suppression rules.
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// Notification Interface
// ============================================================================

/**
 * Full notification object stored in the notification center.
 * Per Bible §11.6.2 Schema.
 */
export interface Notification {
  /** Unique identifier (UUID or counter-based in tests) */
  id: string;
  /** Notification category */
  type: NotificationType;
  /** Display title */
  title: string;
  /** Display message (Bible uses "message" not "body") */
  message: string;
  /** Timestamp in ms since epoch (deterministic, passed in) */
  timestamp: number;
  /** Whether user has read this notification */
  read: boolean;
  /** Pet instance ID if pet-specific */
  petId?: string;
  /** Navigation target for tap action (required per Bible §11.6.2) */
  deepLink: NavigationTarget;
  /** Emoji icon for display */
  icon: string;
  /** Priority level (critical bypasses suppression) */
  priority: NotificationPriority;
  /** Dedupe key for suppression logic */
  dedupeKey?: string;
}

// ============================================================================
// New Notification Input
// ============================================================================

/**
 * Input shape for addNotification.
 * Store generates id; timestamp passed in; read defaults to false.
 */
export type NewNotification = Omit<Notification, 'id' | 'timestamp' | 'read'>;

// ============================================================================
// Notification Save Data
// ============================================================================

/**
 * Notification state stored in main save.
 * Persisted via main save system (not separate Zustand persist).
 */
export interface NotificationSaveData {
  /** Stored notifications (max 50, sorted by timestamp desc) */
  notifications: Notification[];
  /** Timestamp when notification center was last opened */
  lastChecked: number;
}

/**
 * Default notification data for new saves or migration.
 */
export const DEFAULT_NOTIFICATION_DATA: NotificationSaveData = {
  notifications: [],
  lastChecked: 0,
};
