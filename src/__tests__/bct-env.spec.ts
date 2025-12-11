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
   * Per bible.constants.ts TIME_OF_DAY:
   * - MORNING: 6-12 (6:00-11:59)
   * - AFTERNOON/DAY: 12-17 (12:00-16:59)
   * - EVENING: 17-21 (17:00-20:59)
   * - NIGHT: 21-6 (21:00-05:59)
   *
   * P6-ENV-TOD: Aligned implementation to Bible v1.4
   */

  it('getTimeOfDay returns correct period for morning hours (6-11)', () => {
    // Bible: Morning is 6:00-11:59
    expect(getTimeOfDay(new Date('2024-01-01T06:00:00'))).toBe('morning');
    expect(getTimeOfDay(new Date('2024-01-01T08:00:00'))).toBe('morning');
    expect(getTimeOfDay(new Date('2024-01-01T11:59:00'))).toBe('morning');
  });

  it('getTimeOfDay returns correct period for day hours (12-16)', () => {
    // Bible: Day/Afternoon is 12:00-16:59
    expect(getTimeOfDay(new Date('2024-01-01T12:00:00'))).toBe('day');
    expect(getTimeOfDay(new Date('2024-01-01T14:00:00'))).toBe('day');
    expect(getTimeOfDay(new Date('2024-01-01T16:59:00'))).toBe('day');
  });

  it('getTimeOfDay returns correct period for evening hours (17-20)', () => {
    // Bible: Evening is 17:00-20:59
    expect(getTimeOfDay(new Date('2024-01-01T17:00:00'))).toBe('evening');
    expect(getTimeOfDay(new Date('2024-01-01T19:00:00'))).toBe('evening');
    expect(getTimeOfDay(new Date('2024-01-01T20:59:00'))).toBe('evening');
  });

  it('getTimeOfDay returns correct period for night hours (21-5)', () => {
    // Bible: Night is 21:00-05:59
    expect(getTimeOfDay(new Date('2024-01-01T21:00:00'))).toBe('night');
    expect(getTimeOfDay(new Date('2024-01-01T00:00:00'))).toBe('night');
    expect(getTimeOfDay(new Date('2024-01-01T05:59:00'))).toBe('night');
  });

  it('getTimeOfDay boundary: 5:59 is night, 6:00 is morning (P6-ENV-TOD)', () => {
    // Bible boundary: night ends at 6:00, morning starts at 6:00
    expect(getTimeOfDay(new Date('2024-01-01T05:59:00'))).toBe('night');
    expect(getTimeOfDay(new Date('2024-01-01T06:00:00'))).toBe('morning');
  });

  it('getTimeOfDay boundary: 11:59 is morning, 12:00 is day (P6-ENV-TOD)', () => {
    // Bible boundary: morning ends at 12:00, day starts at 12:00
    expect(getTimeOfDay(new Date('2024-01-01T11:59:00'))).toBe('morning');
    expect(getTimeOfDay(new Date('2024-01-01T12:00:00'))).toBe('day');
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

describe('BCT-ENV-UI: Room Selector (P6-ENV-UI)', () => {
  /**
   * Bible §14.4: Explicit room switcher
   * User can manually select rooms via the Room Selector UI.
   * Activities (feeding, playing) override manual selection per Bible precedence rule.
   */

  it('manual room selection works via setRoom', () => {
    // Start in living room
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().environment.room).toBe('living_room');

    // User manually selects kitchen
    useGameStore.getState().setRoom('kitchen');
    expect(useGameStore.getState().environment.room).toBe('kitchen');

    // User manually selects bedroom
    useGameStore.getState().setRoom('bedroom');
    expect(useGameStore.getState().environment.room).toBe('bedroom');

    // User manually selects playroom
    useGameStore.getState().setRoom('playroom');
    expect(useGameStore.getState().environment.room).toBe('playroom');
  });

  it('activity overrides manual room selection (feed → kitchen)', () => {
    // P6-ENV-UI: Activities take precedence over manual room selection
    useGameStore.getState().resetGame();

    // User manually selects bedroom
    useGameStore.getState().setRoom('bedroom');
    expect(useGameStore.getState().environment.room).toBe('bedroom');

    // Give pet some food
    useGameStore.setState(state => ({
      ...state,
      inventory: { apple: 5 }
    }));

    // Feed the pet - should override manual selection to kitchen
    useGameStore.getState().feed('apple');

    // Room should now be kitchen per Bible §14.4 activity-to-room mapping
    expect(useGameStore.getState().environment.room).toBe('kitchen');
  });

  it('user can manually switch after activity', () => {
    // After activity completes, user can switch rooms again
    useGameStore.getState().resetGame();

    // Give pet food and feed (room → kitchen)
    useGameStore.setState(state => ({
      ...state,
      inventory: { apple: 5 }
    }));
    useGameStore.getState().feed('apple');
    expect(useGameStore.getState().environment.room).toBe('kitchen');

    // User manually switches to living room after feeding
    useGameStore.getState().setRoom('living_room');
    expect(useGameStore.getState().environment.room).toBe('living_room');
  });

  it('ROOM_ACTIVITY_MAP defines all activity-to-room mappings', () => {
    // Verify all mappings are defined per Bible §14.4
    expect(ROOM_ACTIVITY_MAP).toEqual({
      feeding: 'kitchen',
      sleeping: 'bedroom',
      playing: 'playroom',
      default: 'living_room',
    });
  });
});
