// ============================================
// GRUNDY — ENVIRONMENT MODULE
// Time-of-day theming + room contexts
// P3-ENV-1, P3-ENV-2, P3-ENV-3
// ============================================

import type { TimeOfDay, RoomId, AppView } from '../types';

// ============================================
// TIME-OF-DAY HELPER
// ============================================

/**
 * Returns the time of day based on the current hour.
 *
 * Time ranges (documented):
 * - 05:00–10:59 → morning
 * - 11:00–16:59 → day
 * - 17:00–20:59 → evening
 * - 21:00–04:59 → night
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// ============================================
// ROOM MAPPING
// ============================================

/**
 * Returns the default room for a given AppView.
 *
 * Mapping:
 * - home → living_room
 * - games → playroom
 * - settings → living_room
 *
 * Note: 'yard' is intentionally not mapped to any current AppView.
 * It is reserved for future outdoor features (walks, events).
 * This function will NEVER return 'yard'.
 */
export function getDefaultRoomForView(view: AppView): RoomId {
  switch (view) {
    case 'home':
      return 'living_room';
    case 'games':
      return 'playroom';
    case 'settings':
      return 'living_room';
    default:
      return 'living_room';
  }
}

// ============================================
// ENVIRONMENT STATE
// ============================================

export interface EnvironmentState {
  timeOfDay: TimeOfDay;
  room: RoomId;
  lastUpdated: number; // timestamp (ms)
}

export const DEFAULT_ENVIRONMENT: EnvironmentState = {
  timeOfDay: getTimeOfDay(),
  room: 'living_room',
  lastUpdated: Date.now(),
};

// ============================================
// BACKGROUND THEMING
// ============================================

/**
 * Returns a Tailwind gradient class string based on time of day and room.
 * All classes are valid Tailwind CSS classes.
 */
export function getBackgroundClass(timeOfDay: TimeOfDay, room: RoomId): string {
  // Playroom - fun, vibrant colors
  if (room === 'playroom') {
    if (timeOfDay === 'night') {
      return 'from-indigo-900 via-violet-900 to-black';
    }
    return 'from-indigo-700 via-purple-800 to-slate-900';
  }

  // Kitchen - warm, cozy colors
  if (room === 'kitchen') {
    if (timeOfDay === 'morning') {
      return 'from-amber-200 via-amber-300 to-amber-500';
    }
    return 'from-amber-300 via-amber-400 to-orange-500';
  }

  // Bedroom - dark, restful colors
  if (room === 'bedroom') {
    return 'from-slate-900 via-slate-950 to-black';
  }

  // Yard - outdoor, natural colors
  if (room === 'yard') {
    if (timeOfDay === 'day') {
      return 'from-sky-300 via-sky-500 to-emerald-500';
    }
    if (timeOfDay === 'morning') {
      return 'from-amber-200 via-sky-300 to-emerald-400';
    }
    if (timeOfDay === 'evening') {
      return 'from-orange-400 via-rose-500 to-emerald-600';
    }
    return 'from-sky-900 via-slate-900 to-emerald-700';
  }

  // Living room (default) - time-of-day sensitive
  if (timeOfDay === 'morning') {
    return 'from-slate-800 via-slate-900 to-slate-950';
  }
  if (timeOfDay === 'day') {
    return 'from-slate-700 via-slate-800 to-slate-900';
  }
  if (timeOfDay === 'evening') {
    return 'from-slate-900 via-indigo-900 to-black';
  }
  // night
  return 'from-slate-950 via-black to-black';
}

// ============================================
// DISPLAY LABELS
// ============================================

export const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: 'Morning',
  day: 'Day',
  evening: 'Evening',
  night: 'Night',
};

export const ROOM_LABELS: Record<RoomId, string> = {
  living_room: 'Living Room',
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  playroom: 'Playroom',
  yard: 'Yard',
};

// ============================================
// AUTO-REFRESH INTERVAL
// ============================================

/** Refresh interval for time-of-day updates (15 minutes in ms) */
export const ENVIRONMENT_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
