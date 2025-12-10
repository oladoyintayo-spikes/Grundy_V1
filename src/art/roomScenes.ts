// ============================================
// GRUNDY — ROOM SCENES CONFIG
// P5-ART-ROOMS: Room foreground visuals layered on environment
// ============================================

import type { RoomId, TimeOfDay } from '../types';

// ============================================
// TYPES
// ============================================

/**
 * Visual accent elements that appear in rooms.
 * These are placeholder references for future art integration.
 */
export type AccentElement = 'plant' | 'lamp' | 'desk' | 'bed' | 'tree' | 'toys' | 'couch' | 'rug';

/**
 * Room scene specification defining visual overlays and props.
 */
export interface RoomSceneSpec {
  /** Display label for the room */
  label: string;
  /** Tailwind class for foreground gradient overlay */
  foregroundClass: string;
  /** Visual accent elements in this room */
  accentElements: AccentElement[];
  /** Time-of-day specific modifications */
  nightOverlay?: string;
}

// ============================================
// ROOM SCENE DEFINITIONS
// ============================================

/**
 * Get the visual specification for a room based on its ID and time of day.
 *
 * The foreground class is a gradient that sits on TOP of the environment
 * background, adding depth and room-specific atmosphere.
 *
 * @param room - The room ID
 * @param timeOfDay - Current time of day
 * @returns Room scene specification
 */
export function getRoomSceneSpec(room: RoomId, timeOfDay: TimeOfDay): RoomSceneSpec {
  // Playroom - fun, vibrant overlays
  if (room === 'playroom') {
    const isNight = timeOfDay === 'night';
    return {
      label: 'Playroom',
      foregroundClass: isNight
        ? 'bg-gradient-to-t from-indigo-950/50 via-transparent to-transparent'
        : 'bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent',
      accentElements: ['toys', 'rug'],
      nightOverlay: isNight ? 'bg-black/20' : undefined,
    };
  }

  // Kitchen - warm, cozy overlays
  if (room === 'kitchen') {
    const isMorning = timeOfDay === 'morning';
    return {
      label: 'Kitchen',
      foregroundClass: isMorning
        ? 'bg-gradient-to-t from-amber-800/20 via-transparent to-transparent'
        : 'bg-gradient-to-t from-amber-900/30 via-transparent to-transparent',
      accentElements: ['plant'],
    };
  }

  // Bedroom - darker, restful overlays
  if (room === 'bedroom') {
    return {
      label: 'Bedroom',
      foregroundClass: 'bg-gradient-to-t from-slate-950/60 via-slate-900/20 to-transparent',
      accentElements: ['lamp', 'bed'],
      nightOverlay: timeOfDay === 'night' ? 'bg-black/30' : undefined,
    };
  }

  // Yard - outdoor, natural overlays
  if (room === 'yard') {
    if (timeOfDay === 'morning') {
      return {
        label: 'Yard',
        foregroundClass: 'bg-gradient-to-t from-emerald-800/30 via-transparent to-amber-500/10',
        accentElements: ['tree', 'plant'],
      };
    }
    if (timeOfDay === 'evening') {
      return {
        label: 'Yard',
        foregroundClass: 'bg-gradient-to-t from-emerald-900/40 via-transparent to-orange-500/10',
        accentElements: ['tree', 'plant'],
      };
    }
    if (timeOfDay === 'night') {
      return {
        label: 'Yard',
        foregroundClass: 'bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent',
        accentElements: ['tree'],
        nightOverlay: 'bg-black/20',
      };
    }
    // Day
    return {
      label: 'Yard',
      foregroundClass: 'bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent',
      accentElements: ['tree', 'plant'],
    };
  }

  // Living Room (default) - subtle, comfortable overlays
  if (timeOfDay === 'night') {
    return {
      label: 'Living Room',
      foregroundClass: 'bg-gradient-to-t from-slate-950/50 via-transparent to-transparent',
      accentElements: ['plant', 'lamp', 'couch'],
      nightOverlay: 'bg-black/10',
    };
  }

  if (timeOfDay === 'evening') {
    return {
      label: 'Living Room',
      foregroundClass: 'bg-gradient-to-t from-slate-900/40 via-indigo-900/10 to-transparent',
      accentElements: ['plant', 'lamp', 'couch'],
    };
  }

  // Morning/Day - bright and open
  return {
    label: 'Living Room',
    foregroundClass: 'bg-gradient-to-t from-slate-900/40 via-transparent to-transparent',
    accentElements: ['plant', 'lamp', 'couch'],
  };
}

// ============================================
// ACCENT ELEMENT DISPLAY
// ============================================

/**
 * Display configuration for accent elements.
 * Used to show placeholder indicators in the RoomScene component.
 */
export const ACCENT_ELEMENT_DISPLAY: Record<AccentElement, { icon: string; label: string }> = {
  plant: { icon: '🪴', label: 'Plant' },
  lamp: { icon: '💡', label: 'Lamp' },
  desk: { icon: '🪑', label: 'Desk' },
  bed: { icon: '🛏️', label: 'Bed' },
  tree: { icon: '🌳', label: 'Tree' },
  toys: { icon: '🧸', label: 'Toys' },
  couch: { icon: '🛋️', label: 'Couch' },
  rug: { icon: '🟫', label: 'Rug' },
};

/**
 * Get display data for an accent element.
 */
export function getAccentDisplay(element: AccentElement) {
  return ACCENT_ELEMENT_DISPLAY[element];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all rooms that have a specific accent element.
 */
export function getRoomsWithAccent(element: AccentElement): RoomId[] {
  const rooms: RoomId[] = ['living_room', 'kitchen', 'bedroom', 'playroom', 'yard'];
  return rooms.filter((room) => {
    const spec = getRoomSceneSpec(room, 'day');
    return spec.accentElements.includes(element);
  });
}
