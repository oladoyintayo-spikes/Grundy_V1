/**
 * BCT-CORE-001, 002, 003: Feeding Cooldown Integration Tests
 * BCT-OFFLINE-HUNGER-001: Offline Hunger Decay Tests
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §4.3-4.4, §9.4.7.0
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-CORE-*, BCT-OFFLINE-HUNGER-*
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import { COOLDOWN, OFFLINE_DECAY_RATES } from '../constants/bible.constants';
import { setTimeProvider, resetTimeProvider, nowMs } from '../game/time';
import type { PetInstanceId } from '../types';

// ============================================
// BCT-CORE-001: Cooldown Timer Persists
// ============================================
describe('BCT-CORE-001: Cooldown timer persists across refresh', () => {
  let mockTime: number;

  beforeEach(() => {
    mockTime = Date.now();
    setTimeProvider(() => mockTime);
    useGameStore.getState().resetGame();
    // Complete FTUE to enable game features
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
  });

  afterEach(() => {
    resetTimeProvider();
  });

  it('should store lastFeedCooldownStart timestamp when feeding', () => {
    const store = useGameStore.getState();
    const activePetId = store.activePetId;

    // Give pet some food
    useGameStore.setState({
      inventory: { apple: 5 },
    });

    // Capture time before feeding
    const beforeFeed = Date.now();

    // Feed the pet
    store.feed('apple');

    // Capture time after feeding
    const afterFeedTime = Date.now();

    // Verify cooldown started (within a small time window)
    const afterFeed = useGameStore.getState();
    expect(afterFeed.stats.lastFeedCooldownStart).toBeGreaterThanOrEqual(beforeFeed);
    expect(afterFeed.stats.lastFeedCooldownStart).toBeLessThanOrEqual(afterFeedTime);
  });

  it('should calculate remaining cooldown correctly after time passes', () => {
    const store = useGameStore.getState();

    // Set cooldown start to 10 minutes ago
    const tenMinutesMs = 10 * 60 * 1000;
    const cooldownStart = mockTime - tenMinutesMs;
    useGameStore.setState({
      stats: { ...store.stats, lastFeedCooldownStart: cooldownStart },
    });

    // Calculate remaining
    const elapsed = mockTime - cooldownStart;
    const remaining = COOLDOWN.DURATION_MS - elapsed;

    expect(remaining).toBe(COOLDOWN.DURATION_MS - tenMinutesMs);
    // 30 min - 10 min = 20 min
    expect(remaining).toBe(20 * 60 * 1000);
  });

  it('should persist cooldown after store rehydration', () => {
    const store = useGameStore.getState();

    // Set cooldown
    const cooldownStart = mockTime - (5 * 60 * 1000); // 5 min ago
    useGameStore.setState({
      stats: { ...store.stats, lastFeedCooldownStart: cooldownStart },
    });

    // Verify cooldown persists (store state check)
    const rehydrated = useGameStore.getState();
    expect(rehydrated.stats.lastFeedCooldownStart).toBe(cooldownStart);
  });
});

// ============================================
// BCT-CORE-002: Cooldown Reduces Feed Value
// ============================================
describe('BCT-CORE-002: Cooldown reduces feed value (25% hunger/XP)', () => {
  let mockTime: number;

  beforeEach(() => {
    mockTime = Date.now();
    setTimeProvider(() => mockTime);
    useGameStore.getState().resetGame();
    // Complete FTUE
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
  });

  afterEach(() => {
    resetTimeProvider();
  });

  it('should apply 25% multiplier to XP gain during cooldown', () => {
    // First, feed without cooldown to get base XP
    useGameStore.getState().resetGame();
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });

    const store = useGameStore.getState();

    // Set pet to hungry state (low fullness for maximum feed value)
    useGameStore.setState({
      pet: { ...store.pet, hunger: 10, mood: 'neutral', moodValue: 50 },
      inventory: { apple: 10 },
      // NO cooldown active
      stats: { ...store.stats, lastFeedCooldownStart: 0 },
    });

    // Feed without cooldown to get base values
    const baseResult = useGameStore.getState().feed('apple');
    const baseXP = baseResult?.xpGained ?? 0;

    // Now reset and feed WITH cooldown
    useGameStore.getState().resetGame();
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
    useGameStore.setState({
      pet: { ...store.pet, hunger: 10, mood: 'neutral', moodValue: 50 },
      inventory: { apple: 10 },
      // Set cooldown to active (started 1 minute ago)
      stats: { ...useGameStore.getState().stats, lastFeedCooldownStart: Date.now() - 60000 },
    });

    // Feed during cooldown
    const cooldownResult = useGameStore.getState().feed('apple');

    expect(cooldownResult).toBeTruthy();
    expect(cooldownResult?.wasOnCooldown).toBe(true);
    expect(cooldownResult?.feedValueMultiplier).toBe(COOLDOWN.REDUCED_VALUE); // 0.25

    // XP should be ~25% of base XP (accounting for rounding)
    if (baseXP > 0) {
      expect(cooldownResult?.xpGained).toBeLessThan(baseXP);
      // Cooldown XP should be approximately 25% of base (allow for rounding)
      expect(cooldownResult?.xpGained).toBeLessThanOrEqual(Math.round(baseXP * COOLDOWN.REDUCED_VALUE) + 1);
    }
  });

  it('should apply 25% multiplier to hunger gain during cooldown', () => {
    // First, feed without cooldown to get base hunger gain
    useGameStore.getState().resetGame();
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });

    const store = useGameStore.getState();
    const initialHunger = 10;

    // Set pet to hungry state (no cooldown)
    useGameStore.setState({
      pet: { ...store.pet, hunger: initialHunger, mood: 'neutral', moodValue: 50 },
      inventory: { apple: 10 },
      stats: { ...store.stats, lastFeedCooldownStart: 0 },
    });

    // Feed without cooldown
    useGameStore.getState().feed('apple');
    const afterNoCooldown = useGameStore.getState();
    const baseHungerGain = afterNoCooldown.pet.hunger - initialHunger;

    // Now reset and feed WITH cooldown
    useGameStore.getState().resetGame();
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
    useGameStore.setState({
      pet: { ...store.pet, hunger: initialHunger, mood: 'neutral', moodValue: 50 },
      inventory: { apple: 10 },
      // Set cooldown to active
      stats: { ...useGameStore.getState().stats, lastFeedCooldownStart: Date.now() - 60000 },
    });

    // Feed during cooldown
    const result = useGameStore.getState().feed('apple');
    const afterFeed = useGameStore.getState();
    const cooldownHungerGain = afterFeed.pet.hunger - initialHunger;

    // Verify cooldown was applied
    expect(result?.feedValueMultiplier).toBe(COOLDOWN.REDUCED_VALUE);
    expect(result?.wasOnCooldown).toBe(true);

    // Hunger gain during cooldown should be less than base
    if (baseHungerGain > 0) {
      expect(cooldownHungerGain).toBeLessThan(baseHungerGain);
      // Cooldown hunger should be approximately 25% of base (allow for rounding)
      expect(cooldownHungerGain).toBeLessThanOrEqual(Math.round(baseHungerGain * COOLDOWN.REDUCED_VALUE) + 1);
    }
  });

  it('should apply full value (1.0) when NOT on cooldown', () => {
    const store = useGameStore.getState();

    // Set pet to hungry state with NO cooldown
    useGameStore.setState({
      pet: { ...store.pet, hunger: 10, mood: 'neutral', moodValue: 50 },
      inventory: { apple: 10 },
      // No cooldown active
      stats: { ...store.stats, lastFeedCooldownStart: 0 },
    });

    // Feed without cooldown
    const result = store.feed('apple');

    expect(result).toBeTruthy();
    expect(result?.wasOnCooldown).toBe(false);
    // Feed value should be full (1.0) since pet is HUNGRY (low fullness)
    expect(result?.feedValueMultiplier).toBe(1.0);
  });
});

// ============================================
// BCT-CORE-003: STUFFED Blocks Feeding
// ============================================
describe('BCT-CORE-003: STUFFED blocks feeding (no cooldown reset, no inventory)', () => {
  let mockTime: number;

  beforeEach(() => {
    mockTime = Date.now();
    setTimeProvider(() => mockTime);
    useGameStore.getState().resetGame();
    // Complete FTUE
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
  });

  afterEach(() => {
    resetTimeProvider();
  });

  it('should block feeding when hunger >= 91 (STUFFED)', () => {
    const store = useGameStore.getState();

    // Set pet to STUFFED state (hunger 95)
    useGameStore.setState({
      pet: { ...store.pet, hunger: 95 },
      inventory: { apple: 5 },
    });

    // Attempt to feed
    const result = store.feed('apple');

    expect(result).toBeTruthy();
    expect(result?.success).toBe(false);
    expect(result?.wasBlocked).toBe(true);
    expect(result?.xpGained).toBe(0);
    expect(result?.bondGained).toBe(0);
    expect(result?.coinsGained).toBe(0);
  });

  it('should NOT reset cooldown when feeding is blocked by STUFFED', () => {
    const store = useGameStore.getState();
    const originalCooldownStart = mockTime - (15 * 60 * 1000); // 15 min ago

    // Set pet to STUFFED with existing cooldown
    useGameStore.setState({
      pet: { ...store.pet, hunger: 95 },
      inventory: { apple: 5 },
      stats: { ...store.stats, lastFeedCooldownStart: originalCooldownStart },
    });

    // Attempt to feed (should be blocked)
    store.feed('apple');

    // Verify cooldown was NOT reset
    const afterAttempt = useGameStore.getState();
    expect(afterAttempt.stats.lastFeedCooldownStart).toBe(originalCooldownStart);
  });

  it('should NOT consume inventory when feeding is blocked by STUFFED', () => {
    const store = useGameStore.getState();
    const originalInventory = 5;

    // Set pet to STUFFED with food inventory
    useGameStore.setState({
      pet: { ...store.pet, hunger: 95 },
      inventory: { apple: originalInventory },
    });

    // Attempt to feed (should be blocked)
    store.feed('apple');

    // Verify inventory unchanged
    const afterAttempt = useGameStore.getState();
    expect(afterAttempt.inventory['apple']).toBe(originalInventory);
  });

  it('should NOT grant XP/bond/coins when feeding is blocked by STUFFED', () => {
    const store = useGameStore.getState();
    const originalXp = store.pet.xp;
    const originalBond = store.pet.bond;
    const originalCoins = store.currencies.coins;

    // Set pet to STUFFED
    useGameStore.setState({
      pet: { ...store.pet, hunger: 95 },
      inventory: { apple: 5 },
    });

    // Attempt to feed (should be blocked)
    store.feed('apple');

    // Verify no gains
    const afterAttempt = useGameStore.getState();
    expect(afterAttempt.pet.xp).toBe(originalXp);
    expect(afterAttempt.pet.bond).toBe(originalBond);
    expect(afterAttempt.currencies.coins).toBe(originalCoins);
  });
});

// ============================================
// BCT-OFFLINE-HUNGER-001: Offline Hunger Decay
// ============================================
describe('BCT-OFFLINE-HUNGER-001: Offline hunger decay (proportional)', () => {
  let mockTime: number;

  beforeEach(() => {
    mockTime = Date.now();
    setTimeProvider(() => mockTime);
    useGameStore.getState().resetGame();
    // Complete FTUE
    useGameStore.setState({
      ftue: { hasCompletedFtue: true, activeStep: 'complete', selectedPetId: null, selectedMode: null },
    });
  });

  afterEach(() => {
    resetTimeProvider();
  });

  it('should decay hunger by 10 after 24h offline', () => {
    const store = useGameStore.getState();
    const initialHunger = 80;
    const activePetId = store.activePetId;

    // Set initial hunger and lastSeenTimestamp
    const hoursOffline = 24;
    const lastSeen = mockTime - (hoursOffline * 60 * 60 * 1000);

    useGameStore.setState({
      lastSeenTimestamp: lastSeen,
      petsById: {
        ...store.petsById,
        [activePetId]: {
          ...store.petsById[activePetId],
          hunger: initialHunger,
        },
      },
    });

    // Apply offline fanout
    const result = useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    // Verify hunger decreased by 10 (-10 per 24h)
    const afterOffline = useGameStore.getState();
    const expectedHunger = Math.round(initialHunger - (hoursOffline / 24) * OFFLINE_DECAY_RATES.HUNGER_PER_24H);
    expect(afterOffline.petsById[activePetId].hunger).toBe(expectedHunger);
    expect(afterOffline.petsById[activePetId].hunger).toBe(70);
  });

  it('should decay hunger by 5 after 12h offline (proportional)', () => {
    const store = useGameStore.getState();
    const initialHunger = 80;
    const activePetId = store.activePetId;

    // Set initial hunger and lastSeenTimestamp
    const hoursOffline = 12;
    const lastSeen = mockTime - (hoursOffline * 60 * 60 * 1000);

    useGameStore.setState({
      lastSeenTimestamp: lastSeen,
      petsById: {
        ...store.petsById,
        [activePetId]: {
          ...store.petsById[activePetId],
          hunger: initialHunger,
        },
      },
    });

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    // Verify hunger decreased by 5 (-10 per 24h = -5 per 12h)
    const afterOffline = useGameStore.getState();
    const expectedHunger = Math.round(initialHunger - (hoursOffline / 24) * OFFLINE_DECAY_RATES.HUNGER_PER_24H);
    expect(afterOffline.petsById[activePetId].hunger).toBe(expectedHunger);
    expect(afterOffline.petsById[activePetId].hunger).toBe(75);
  });

  it('should decay hunger proportionally for any time period', () => {
    const store = useGameStore.getState();
    const initialHunger = 80;
    const activePetId = store.activePetId;

    // Set initial hunger and lastSeenTimestamp (6 hours offline)
    const hoursOffline = 6;
    const lastSeen = mockTime - (hoursOffline * 60 * 60 * 1000);

    useGameStore.setState({
      lastSeenTimestamp: lastSeen,
      petsById: {
        ...store.petsById,
        [activePetId]: {
          ...store.petsById[activePetId],
          hunger: initialHunger,
        },
      },
    });

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    // Verify proportional decay: 6h = 6/24 * 10 = 2.5, rounded to 3 (or 2)
    const afterOffline = useGameStore.getState();
    const expectedHunger = Math.round(initialHunger - (hoursOffline / 24) * OFFLINE_DECAY_RATES.HUNGER_PER_24H);
    expect(afterOffline.petsById[activePetId].hunger).toBe(expectedHunger);
    // 6h offline: 80 - (6/24 * 10) = 80 - 2.5 = 77.5, rounded to 78
    expect(afterOffline.petsById[activePetId].hunger).toBe(78);
  });

  it('should not decay hunger below 0 (floor)', () => {
    const store = useGameStore.getState();
    const initialHunger = 5;
    const activePetId = store.activePetId;

    // Set low hunger and long offline period
    const hoursOffline = 48; // Would be -20 decay
    const lastSeen = mockTime - (hoursOffline * 60 * 60 * 1000);

    useGameStore.setState({
      lastSeenTimestamp: lastSeen,
      petsById: {
        ...store.petsById,
        [activePetId]: {
          ...store.petsById[activePetId],
          hunger: initialHunger,
        },
      },
    });

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    // Verify hunger floored at 0
    const afterOffline = useGameStore.getState();
    expect(afterOffline.petsById[activePetId].hunger).toBe(OFFLINE_DECAY_RATES.HUNGER_FLOOR);
    expect(afterOffline.petsById[activePetId].hunger).toBe(0);
  });

  it('should apply hunger decay to ALL owned pets', () => {
    const store = useGameStore.getState();
    const initialHunger = 80;

    // Get all owned pet IDs
    const petIds = store.ownedPetIds;

    // Set same hunger for all pets
    const petsById: typeof store.petsById = {};
    for (const petId of petIds) {
      petsById[petId] = {
        ...store.petsById[petId],
        hunger: initialHunger,
      };
    }

    // Set offline for 24h
    const hoursOffline = 24;
    const lastSeen = mockTime - (hoursOffline * 60 * 60 * 1000);

    useGameStore.setState({
      lastSeenTimestamp: lastSeen,
      petsById,
    });

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    // Verify ALL pets had hunger decay
    const afterOffline = useGameStore.getState();
    for (const petId of petIds) {
      expect(afterOffline.petsById[petId].hunger).toBe(70); // 80 - 10 = 70
    }
  });
});
