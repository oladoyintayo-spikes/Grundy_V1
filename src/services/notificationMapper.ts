/**
 * GRUNDY NOTIFICATION MAPPER
 *
 * Maps game events to notification objects.
 * Per Bible §11.6.3 Trigger Conditions.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.3
 */

import type { GameEvent, GameEventType } from '../types/events';
import type {
  NewNotification,
  NotificationType,
  NotificationPriority,
} from '../types/notifications';
import type { NavigationTarget } from '../types/navigation';
import {
  getString,
  getNumber,
  getOptionalString,
} from '../utils/payloadHelpers';

// ============================================================================
// Mapping Configuration
// ============================================================================

interface MappingConfig {
  /** Notification type category */
  type: NotificationType;
  /** Emoji icon for display */
  icon: string;
  /** Priority level */
  priority: NotificationPriority;
  /** Navigation target for tap action */
  deepLink: NavigationTarget;
  /** Title generator function */
  title: (payload: Record<string, unknown>) => string;
  /** Message generator function */
  message: (payload: Record<string, unknown>) => string;
}

/**
 * Event to notification mapping configurations.
 * Per Bible §11.6.3 Trigger Conditions table.
 *
 * BCT-TRIGGER-001: Event→notification mapping works.
 */
const EVENT_MAPPINGS: Record<GameEventType, MappingConfig> = {
  HUNGER_CRITICAL: {
    type: 'pet_care',
    icon: '🐾',
    priority: 'medium',
    deepLink: 'home',
    title: () => 'Pet is hungry!',
    message: (p) => `${getString(p, 'petName', 'Your pet')} needs food!`,
  },

  MOOD_CRITICAL: {
    type: 'pet_care',
    icon: '🐾',
    priority: 'medium',
    deepLink: 'home',
    title: () => 'Pet is sad!',
    message: (p) => `${getString(p, 'petName', 'Your pet')} wants to play!`,
  },

  NEGLECT_TRANSITION: {
    type: 'neglect',
    icon: '⚠️',
    priority: 'high',
    deepLink: 'home',
    title: (p) =>
      `${getString(p, 'petName', 'Your pet')} is ${getString(p, 'stage', 'worried')}`,
    message: (p) => getString(p, 'message', 'Please check on your pet'),
  },

  RUNAWAY: {
    type: 'neglect',
    icon: '⚠️',
    priority: 'critical',
    deepLink: 'home',
    title: () => 'Pet has run away!',
    message: (p) =>
      `${getString(p, 'petName', 'Your pet')} has gone into hiding.`,
  },

  SICKNESS_ONSET: {
    type: 'pet_care',
    icon: '🤒',
    priority: 'high',
    deepLink: 'home',
    title: () => 'Pet is sick!',
    message: (p) =>
      `${getString(p, 'petName', 'Your pet')} needs medicine!`,
  },

  LEVEL_UP: {
    type: 'level_up',
    icon: '⭐',
    priority: 'medium',
    deepLink: 'home',
    title: () => 'Level Up!',
    message: (p) =>
      `${getString(p, 'petName', 'Your pet')} reached Level ${getNumber(p, 'level', 0)}!`,
  },

  EVOLUTION: {
    type: 'evolution',
    icon: '🌟',
    priority: 'high',
    deepLink: 'home',
    title: () => 'Evolution!',
    message: (p) => `${getString(p, 'petName', 'Your pet')} evolved!`,
  },

  ENERGY_FULL: {
    type: 'minigame',
    icon: '🎮',
    priority: 'low',
    deepLink: 'games',
    title: () => 'Energy is full!',
    message: () => 'Ready to play mini-games!',
  },

  DAILY_REWARD_READY: {
    type: 'daily',
    icon: '📅',
    priority: 'medium',
    deepLink: 'home', // Update to 'login-rewards' when implemented
    title: () => 'Daily reward ready!',
    message: (p) => `Claim your Day ${getNumber(p, 'day', 1)} reward!`,
  },

  EVENT_START: {
    type: 'event',
    icon: '🎉',
    priority: 'medium',
    deepLink: 'home', // Update to 'events' when implemented
    title: (p) => `${getString(p, 'eventName', 'Event')} starts!`,
    message: (p) => getString(p, 'message', 'Check it out!'),
  },

  ACHIEVEMENT_UNLOCKED: {
    type: 'achievement',
    icon: '🏆',
    priority: 'medium',
    deepLink: 'home', // Update to 'achievements' when Phase 12-A ships
    title: () => 'Achievement Unlocked!',
    message: (p) => `Earned: ${getString(p, 'name', 'Unknown')}`,
  },
};

// ============================================================================
// Mapper Function
// ============================================================================

/**
 * Map a game event to a notification.
 *
 * @param event - Game event with type, payload, and timestamp
 * @returns NewNotification or null if event type has no mapping
 *
 * BCT-TRIGGER-001: Event→notification mapping works.
 * BCT-TRIGGER-004: Navigation targets always valid (sanitized).
 */
export function mapEventToNotification(
  event: GameEvent
): NewNotification | null {
  const config = EVENT_MAPPINGS[event.type];

  if (!config) {
    // Unknown event type — no notification
    return null;
  }

  return {
    type: config.type,
    icon: config.icon,
    priority: config.priority,
    deepLink: config.deepLink,
    title: config.title(event.payload),
    message: config.message(event.payload),
    petId: getOptionalString(event.payload, 'petId'),
  };
}
