// ============================================
// GRUNDY — ENVIRONMENT TESTS
// Tests for time-of-day and room logic
// P3-ENV-1, P3-ENV-2, P3-ENV-3
// ============================================

import { describe, it, expect } from 'vitest';
import {
  getTimeOfDay,
  getDefaultRoomForView,
  getBackgroundClass,
  TIME_LABELS,
  ROOM_LABELS,
  DEFAULT_ENVIRONMENT,
  ENVIRONMENT_REFRESH_INTERVAL_MS,
} from '../game/environment';
import type { AppView, TimeOfDay, RoomId } from '../types';

// ============================================
// TIME OF DAY TESTS
// P6-ENV-TOD: Updated to match Bible v1.4 / bible.constants.ts
// - Morning: 6:00-11:59
// - Day: 12:00-16:59
// - Evening: 17:00-20:59
// - Night: 21:00-05:59
// ============================================

describe('getTimeOfDay', () => {
  // Night: 21:00-05:59
  it('returns night for 05:00 (per Bible v1.4 - night is 21:00-05:59)', () => {
    const date = new Date('2025-01-01T05:00:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  it('returns night for 05:59', () => {
    const date = new Date('2025-01-01T05:59:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  // Morning: 6:00-11:59
  it('returns morning for 06:00', () => {
    const date = new Date('2025-01-01T06:00:00');
    expect(getTimeOfDay(date)).toBe('morning');
  });

  it('returns morning for 11:00', () => {
    const date = new Date('2025-01-01T11:00:00');
    expect(getTimeOfDay(date)).toBe('morning');
  });

  it('returns morning for 11:59', () => {
    const date = new Date('2025-01-01T11:59:00');
    expect(getTimeOfDay(date)).toBe('morning');
  });

  // Day: 12:00-16:59
  it('returns day for 12:00', () => {
    const date = new Date('2025-01-01T12:00:00');
    expect(getTimeOfDay(date)).toBe('day');
  });

  it('returns day for 13:00', () => {
    const date = new Date('2025-01-01T13:00:00');
    expect(getTimeOfDay(date)).toBe('day');
  });

  it('returns day for 16:59', () => {
    const date = new Date('2025-01-01T16:59:00');
    expect(getTimeOfDay(date)).toBe('day');
  });

  // Evening: 17:00-20:59
  it('returns evening for 17:00', () => {
    const date = new Date('2025-01-01T17:00:00');
    expect(getTimeOfDay(date)).toBe('evening');
  });

  it('returns evening for 18:00', () => {
    const date = new Date('2025-01-01T18:00:00');
    expect(getTimeOfDay(date)).toBe('evening');
  });

  it('returns evening for 20:59', () => {
    const date = new Date('2025-01-01T20:59:00');
    expect(getTimeOfDay(date)).toBe('evening');
  });

  // Night: 21:00-05:59
  it('returns night for 21:00', () => {
    const date = new Date('2025-01-01T21:00:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  it('returns night for 23:00', () => {
    const date = new Date('2025-01-01T23:00:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  it('returns night for 00:00 (midnight)', () => {
    const date = new Date('2025-01-01T00:00:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  it('returns night for 04:59', () => {
    const date = new Date('2025-01-01T04:59:00');
    expect(getTimeOfDay(date)).toBe('night');
  });

  it('returns a valid TimeOfDay when called without arguments', () => {
    const result = getTimeOfDay();
    expect(['morning', 'day', 'evening', 'night']).toContain(result);
  });
});

// ============================================
// ROOM MAPPING TESTS
// ============================================

describe('getDefaultRoomForView', () => {
  it('maps home to living_room', () => {
    expect(getDefaultRoomForView('home')).toBe('living_room');
  });

  it('maps games to playroom', () => {
    expect(getDefaultRoomForView('games')).toBe('playroom');
  });

  it('maps settings to living_room', () => {
    expect(getDefaultRoomForView('settings')).toBe('living_room');
  });

  it('does not map any view to yard', () => {
    const views: AppView[] = ['home', 'games', 'settings'];
    const rooms = views.map((v) => getDefaultRoomForView(v));
    expect(rooms).not.toContain('yard');
  });

  it('does not map any view to kitchen', () => {
    const views: AppView[] = ['home', 'games', 'settings'];
    const rooms = views.map((v) => getDefaultRoomForView(v));
    expect(rooms).not.toContain('kitchen');
  });

  it('does not map any view to bedroom', () => {
    const views: AppView[] = ['home', 'games', 'settings'];
    const rooms = views.map((v) => getDefaultRoomForView(v));
    expect(rooms).not.toContain('bedroom');
  });

  it('returns living_room as fallback for unknown view', () => {
    // @ts-expect-error testing unknown view
    expect(getDefaultRoomForView('unknown')).toBe('living_room');
  });
});

// ============================================
// BACKGROUND CLASS TESTS
// ============================================

describe('getBackgroundClass', () => {
  const allTimes: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];
  const allRooms: RoomId[] = ['living_room', 'kitchen', 'bedroom', 'playroom', 'yard'];

  it('returns a Tailwind gradient class string', () => {
    const cls = getBackgroundClass('day', 'yard');
    expect(typeof cls).toBe('string');
    expect(cls.length).toBeGreaterThan(0);
    expect(cls.startsWith('from-')).toBe(true);
  });

  it('returns different backgrounds for different rooms', () => {
    const livingRoom = getBackgroundClass('day', 'living_room');
    const playroom = getBackgroundClass('day', 'playroom');
    const kitchen = getBackgroundClass('day', 'kitchen');
    const bedroom = getBackgroundClass('day', 'bedroom');
    const yard = getBackgroundClass('day', 'yard');

    // At least some should be different
    const backgrounds = [livingRoom, playroom, kitchen, bedroom, yard];
    const unique = new Set(backgrounds);
    expect(unique.size).toBeGreaterThanOrEqual(4); // Most rooms should have different backgrounds
  });

  it('returns different backgrounds for different times in living_room', () => {
    const morning = getBackgroundClass('morning', 'living_room');
    const day = getBackgroundClass('day', 'living_room');
    const evening = getBackgroundClass('evening', 'living_room');
    const night = getBackgroundClass('night', 'living_room');

    const backgrounds = [morning, day, evening, night];
    const unique = new Set(backgrounds);
    expect(unique.size).toBeGreaterThanOrEqual(3); // At least 3 different time-based backgrounds
  });

  it('returns a valid string for all time/room combinations', () => {
    for (const time of allTimes) {
      for (const room of allRooms) {
        const cls = getBackgroundClass(time, room);
        expect(typeof cls).toBe('string');
        expect(cls.length).toBeGreaterThan(0);
        expect(cls).toMatch(/^from-/); // All should be Tailwind gradient classes
      }
    }
  });

  // Specific room tests
  it('playroom has indigo/violet theme', () => {
    const cls = getBackgroundClass('day', 'playroom');
    expect(cls).toContain('indigo');
  });

  it('kitchen has amber/warm theme', () => {
    const cls = getBackgroundClass('day', 'kitchen');
    expect(cls).toContain('amber');
  });

  it('bedroom has dark slate theme', () => {
    const cls = getBackgroundClass('day', 'bedroom');
    expect(cls).toContain('slate');
  });

  it('yard has sky/emerald theme during day', () => {
    const cls = getBackgroundClass('day', 'yard');
    expect(cls).toContain('sky');
    expect(cls).toContain('emerald');
  });
});

// ============================================
// LABEL TESTS
// ============================================

describe('TIME_LABELS', () => {
  it('has labels for all time periods', () => {
    expect(TIME_LABELS.morning).toBe('Morning');
    expect(TIME_LABELS.day).toBe('Day');
    expect(TIME_LABELS.evening).toBe('Evening');
    expect(TIME_LABELS.night).toBe('Night');
  });
});

describe('ROOM_LABELS', () => {
  it('has labels for all rooms', () => {
    expect(ROOM_LABELS.living_room).toBe('Living Room');
    expect(ROOM_LABELS.kitchen).toBe('Kitchen');
    expect(ROOM_LABELS.bedroom).toBe('Bedroom');
    expect(ROOM_LABELS.playroom).toBe('Playroom');
    expect(ROOM_LABELS.yard).toBe('Yard');
  });
});

// ============================================
// DEFAULT ENVIRONMENT TESTS
// ============================================

describe('DEFAULT_ENVIRONMENT', () => {
  it('has a valid timeOfDay', () => {
    expect(['morning', 'day', 'evening', 'night']).toContain(DEFAULT_ENVIRONMENT.timeOfDay);
  });

  it('has living_room as default room', () => {
    expect(DEFAULT_ENVIRONMENT.room).toBe('living_room');
  });

  it('has a lastUpdated timestamp', () => {
    expect(typeof DEFAULT_ENVIRONMENT.lastUpdated).toBe('number');
    expect(DEFAULT_ENVIRONMENT.lastUpdated).toBeGreaterThan(0);
  });
});

// ============================================
// REFRESH INTERVAL TESTS
// ============================================

describe('ENVIRONMENT_REFRESH_INTERVAL_MS', () => {
  it('is 15 minutes in milliseconds', () => {
    expect(ENVIRONMENT_REFRESH_INTERVAL_MS).toBe(15 * 60 * 1000);
  });

  it('equals 900000 ms', () => {
    expect(ENVIRONMENT_REFRESH_INTERVAL_MS).toBe(900000);
  });
});
