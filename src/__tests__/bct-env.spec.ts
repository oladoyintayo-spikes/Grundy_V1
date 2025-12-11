/**
 * BCT-ENV-001, BCT-ENV-002: Environment Tests
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §14.4
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-ENV-*
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import { getTimeOfDay, getDefaultRoomForView, getBackgroundClass } from '../game/environment';
import { ROOM_ACTIVITY_MAP } from '../constants/bible.constants';

// Reset store before each test
beforeEach(() => {
  useGameStore.getState().resetGame();
});

describe('BCT-ENV-001: Activity-to-Room Mapping', () => {
  /**
   * Bible §14.4: Activities trigger room context switches
   * - Feeding → Kitchen
   * - Sleeping → Bedroom
   * - Playing → Playroom
   * - Default/idle → Living room
   */

  it('feeding activity switches room to kitchen', () => {
    // Start in living room
    const initialState = useGameStore.getState();
    expect(initialState.environment.room).toBe('living_room');

    // Give pet some food to feed
    useGameStore.setState(state => ({
      ...state,
      inventory: { apple: 5 }
    }));

    // Feed the pet
    const result = useGameStore.getState().feed('apple');

    // Should have switched to kitchen per Bible §14.4
    const newState = useGameStore.getState();
    expect(newState.environment.room).toBe('kitchen');
  });

  it('ROOM_ACTIVITY_MAP constants are correct', () => {
    // Bible §14.4: Activity-to-room mapping
    expect(ROOM_ACTIVITY_MAP.feeding).toBe('kitchen');
    expect(ROOM_ACTIVITY_MAP.sleeping).toBe('bedroom');
    expect(ROOM_ACTIVITY_MAP.playing).toBe('playroom');
    expect(ROOM_ACTIVITY_MAP.default).toBe('living_room');
  });

  it('getDefaultRoomForView maps games view to playroom', () => {
    // When playing mini-games, should be in playroom
    const playRoom = getDefaultRoomForView('games');
    expect(playRoom).toBe('playroom');
  });

  it('getDefaultRoomForView maps home view to living_room', () => {
    // Default home view should be living room
    const homeRoom = getDefaultRoomForView('home');
    expect(homeRoom).toBe('living_room');
  });

  it('getDefaultRoomForView maps settings view to living_room', () => {
    // Settings doesn't have a specific room, defaults to living room
    const settingsRoom = getDefaultRoomForView('settings');
    expect(settingsRoom).toBe('living_room');
  });

  it('syncEnvironmentWithView updates room based on view', () => {
    const store = useGameStore.getState();

    // Sync to games view
    store.syncEnvironmentWithView('games');
    expect(useGameStore.getState().environment.room).toBe('playroom');

    // Sync back to home view
    store.syncEnvironmentWithView('home');
    expect(useGameStore.getState().environment.room).toBe('living_room');
  });

  it('setRoom directly changes the room', () => {
    const store = useGameStore.getState();

    store.setRoom('kitchen');
    expect(useGameStore.getState().environment.room).toBe('kitchen');

    store.setRoom('bedroom');
    expect(useGameStore.getState().environment.room).toBe('bedroom');

    store.setRoom('playroom');
    expect(useGameStore.getState().environment.room).toBe('playroom');

    store.setRoom('living_room');
    expect(useGameStore.getState().environment.room).toBe('living_room');
  });
});

describe('BCT-ENV-002: Time-of-Day', () => {
  /**
   * Bible §14.4: Background reflects time of day
   */

  it('getTimeOfDay returns correct period for morning hours (5-10)', () => {
    expect(getTimeOfDay(new Date('2024-01-01T05:00:00'))).toBe('morning');
    expect(getTimeOfDay(new Date('2024-01-01T08:00:00'))).toBe('morning');
    expect(getTimeOfDay(new Date('2024-01-01T10:59:00'))).toBe('morning');
  });

  it('getTimeOfDay returns correct period for day hours (11-16)', () => {
    expect(getTimeOfDay(new Date('2024-01-01T11:00:00'))).toBe('day');
    expect(getTimeOfDay(new Date('2024-01-01T14:00:00'))).toBe('day');
    expect(getTimeOfDay(new Date('2024-01-01T16:59:00'))).toBe('day');
  });

  it('getTimeOfDay returns correct period for evening hours (17-20)', () => {
    expect(getTimeOfDay(new Date('2024-01-01T17:00:00'))).toBe('evening');
    expect(getTimeOfDay(new Date('2024-01-01T19:00:00'))).toBe('evening');
    expect(getTimeOfDay(new Date('2024-01-01T20:59:00'))).toBe('evening');
  });

  it('getTimeOfDay returns correct period for night hours (21-4)', () => {
    expect(getTimeOfDay(new Date('2024-01-01T21:00:00'))).toBe('night');
    expect(getTimeOfDay(new Date('2024-01-01T00:00:00'))).toBe('night');
    expect(getTimeOfDay(new Date('2024-01-01T04:59:00'))).toBe('night');
  });

  it('refreshTimeOfDay updates the environment time', () => {
    const store = useGameStore.getState();
    const initialTime = store.environment.timeOfDay;

    // Refresh time
    store.refreshTimeOfDay();

    // Should have updated lastUpdated timestamp
    const newState = useGameStore.getState();
    expect(newState.environment.lastUpdated).toBeGreaterThan(0);
    // Time of day should match current real time
    expect(newState.environment.timeOfDay).toBe(getTimeOfDay());
  });

  it('getBackgroundClass returns different backgrounds per time-of-day', () => {
    // Living room backgrounds vary by time
    const morningBg = getBackgroundClass('morning', 'living_room');
    const dayBg = getBackgroundClass('day', 'living_room');
    const eveningBg = getBackgroundClass('evening', 'living_room');
    const nightBg = getBackgroundClass('night', 'living_room');

    // Each should be a valid Tailwind gradient class string
    expect(morningBg).toContain('from-');
    expect(dayBg).toContain('from-');
    expect(eveningBg).toContain('from-');
    expect(nightBg).toContain('from-');

    // They should differ for at least some time periods
    expect(morningBg).not.toBe(nightBg);
  });

  it('getBackgroundClass returns room-specific backgrounds', () => {
    const kitchenBg = getBackgroundClass('day', 'kitchen');
    const bedroomBg = getBackgroundClass('day', 'bedroom');
    const playroomBg = getBackgroundClass('day', 'playroom');
    const livingRoomBg = getBackgroundClass('day', 'living_room');

    // Each room should have distinct theming
    expect(kitchenBg).toContain('amber'); // Warm kitchen colors
    expect(bedroomBg).toContain('slate'); // Dark restful colors
    expect(playroomBg).toContain('indigo'); // Fun vibrant colors
  });
});

describe('BCT-ENV: Environment State Persistence', () => {
  it('environment state has required fields', () => {
    const state = useGameStore.getState();
    expect(state.environment).toHaveProperty('room');
    expect(state.environment).toHaveProperty('timeOfDay');
    expect(state.environment).toHaveProperty('lastUpdated');
  });

  it('environment defaults to living_room', () => {
    // Fresh state should default to living room
    useGameStore.getState().resetGame();
    const state = useGameStore.getState();
    expect(state.environment.room).toBe('living_room');
  });

  it('room changes persist across state updates', () => {
    const store = useGameStore.getState();

    // Change room to kitchen
    store.setRoom('kitchen');
    expect(useGameStore.getState().environment.room).toBe('kitchen');

    // Update something else
    store.addCurrency('coins', 10, 'test');

    // Room should still be kitchen
    expect(useGameStore.getState().environment.room).toBe('kitchen');
  });
});
