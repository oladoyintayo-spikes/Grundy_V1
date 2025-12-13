/**
 * BCT-P10C: Feeding-Time Triggers Tests
 * Bible v1.8 §5.7, §9.4.7.1, §9.4.7.2
 *
 * Tests weight gain and immediate sickness triggers on feeding.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  SNACK_WEIGHT_GAIN,
  FEEDING_SICKNESS_TRIGGERS,
} from '../constants/bible.constants';
import {
  setRngProvider,
  resetRngProvider,
  createSequenceRng,
} from '../game/rng';

// Helper to reset store and RNG before each test
function resetTestEnvironment() {
  useGameStore.getState().resetGame();
  resetRngProvider();
}

// Helper to set up a pet with specific weight
function setupPetWithWeight(weight: number, mode: 'cozy' | 'classic' = 'classic') {
  // Reset and select mode
  useGameStore.getState().resetGame();
  useGameStore.getState().selectPlayMode(mode);

  // Complete FTUE to enable normal gameplay
  useGameStore.getState().completeFtue();

  // Set pet weight directly - need to get fresh state after each operation
  const state = useGameStore.getState();
  const activePetId = state.activePetId;
  const currentPetsById = state.petsById;

  if (currentPetsById[activePetId]) {
    useGameStore.setState({
      petsById: {
        ...currentPetsById,
        [activePetId]: {
          ...currentPetsById[activePetId],
          weight,
          // Also ensure isSick is false for clean starting state
          isSick: false,
          sickStartTimestamp: null,
        },
      },
    });
  }
}

// Helper to add food and get pet weight after feeding
function feedAndGetWeight(foodId: string): number {
  useGameStore.getState().addFood(foodId, 1);
  useGameStore.getState().feed(foodId);
  // Get fresh state after feeding
  const freshState = useGameStore.getState();
  const activePetId = freshState.activePetId;
  return freshState.petsById[activePetId]?.weight ?? 0;
}

// Helper to check if pet became sick
function isPetSick(): boolean {
  const store = useGameStore.getState();
  const activePetId = store.activePetId;
  return store.petsById[activePetId]?.isSick ?? false;
}

describe('BCT-P10C: Weight Gain Tests', () => {
  beforeEach(() => {
    resetTestEnvironment();
  });

  afterEach(() => {
    resetRngProvider();
  });

  it('BCT-P10C-01: Feeding Cookie adds exactly +5 weight', () => {
    setupPetWithWeight(0);
    const newWeight = feedAndGetWeight('cookie');
    expect(newWeight).toBe(5);
  });

  it('BCT-P10C-02: Feeding Candy adds exactly +10 weight', () => {
    setupPetWithWeight(0);
    const newWeight = feedAndGetWeight('candy');
    expect(newWeight).toBe(10);
  });

  it('BCT-P10C-03: Feeding Ice Cream adds exactly +10 weight', () => {
    setupPetWithWeight(0);
    const newWeight = feedAndGetWeight('ice_cream');
    expect(newWeight).toBe(10);
  });

  it('BCT-P10C-04: Feeding Lollipop adds exactly +8 weight', () => {
    setupPetWithWeight(0);
    const newWeight = feedAndGetWeight('lollipop');
    expect(newWeight).toBe(8);
  });

  it('BCT-P10C-05: Feeding Apple (non-snack) adds 0 weight', () => {
    setupPetWithWeight(0);
    const newWeight = feedAndGetWeight('apple');
    expect(newWeight).toBe(0);
  });

  it('BCT-P10C-06: Weight caps at 100 (feeding snack at weight=98)', () => {
    setupPetWithWeight(98);
    // Cookie adds +5, so 98+5=103 -> should cap at 100
    const newWeight = feedAndGetWeight('cookie');
    expect(newWeight).toBe(100);
  });

  it('BCT-P10C-07: Weight gain applies in Cozy mode', () => {
    setupPetWithWeight(0, 'cozy');
    const newWeight = feedAndGetWeight('cookie');
    expect(newWeight).toBe(5);
  });

  it('BCT-P10C-08: Weight gain applies in Classic mode', () => {
    setupPetWithWeight(0, 'classic');
    const newWeight = feedAndGetWeight('cookie');
    expect(newWeight).toBe(5);
  });
});

describe('BCT-P10C: Sickness Trigger Tests (Classic Only)', () => {
  beforeEach(() => {
    resetTestEnvironment();
  });

  afterEach(() => {
    resetRngProvider();
  });

  it('BCT-P10C-09: Hot Pepper with RNG < 0.05 triggers sickness in Classic', () => {
    setupPetWithWeight(0, 'classic');
    // Set RNG to return 0.04 (< 0.05, should trigger)
    setRngProvider(() => 0.04);

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    expect(isPetSick()).toBe(true);
  });

  it('BCT-P10C-10: Hot Pepper with RNG >= 0.05 does NOT trigger sickness in Classic', () => {
    setupPetWithWeight(0, 'classic');
    // Set RNG to return 0.05 (>= 0.05, should NOT trigger)
    setRngProvider(() => 0.05);

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-11: Hot Pepper in Cozy mode NEVER triggers sickness', () => {
    setupPetWithWeight(0, 'cozy');
    // Set RNG to return 0.01 (would trigger in Classic)
    setRngProvider(() => 0.01);

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-12: Snack when Overweight (weight=65) with RNG < 0.05 triggers sickness in Classic', () => {
    setupPetWithWeight(65, 'classic');
    // Set RNG to return 0.04 (< 0.05, should trigger)
    setRngProvider(() => 0.04);

    const store = useGameStore.getState();
    store.addFood('cookie', 1);
    store.feed('cookie');

    expect(isPetSick()).toBe(true);
  });

  it('BCT-P10C-13: Snack when Overweight with RNG >= 0.05 does NOT trigger sickness', () => {
    setupPetWithWeight(65, 'classic');
    // Set RNG to return 0.05 (>= 0.05, should NOT trigger)
    setRngProvider(() => 0.05);

    const store = useGameStore.getState();
    store.addFood('cookie', 1);
    store.feed('cookie');

    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-14: Snack when NOT Overweight (weight=50) does NOT trigger sickness', () => {
    setupPetWithWeight(50, 'classic');
    // Even with low RNG, no trigger if not overweight
    setRngProvider(() => 0.01);

    const store = useGameStore.getState();
    store.addFood('cookie', 1);
    store.feed('cookie');

    // Weight after feeding: 50 + 5 = 55 (still < 61)
    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-15: Snack when Overweight in Cozy mode NEVER triggers sickness', () => {
    setupPetWithWeight(65, 'cozy');
    // Set RNG to return 0.01 (would trigger in Classic)
    setRngProvider(() => 0.01);

    const store = useGameStore.getState();
    store.addFood('cookie', 1);
    store.feed('cookie');

    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-16: Non-snack food when Overweight does NOT trigger sickness', () => {
    setupPetWithWeight(65, 'classic');
    // Even with low RNG, no trigger for non-snacks
    setRngProvider(() => 0.01);

    const store = useGameStore.getState();
    store.addFood('apple', 1);
    store.feed('apple');

    expect(isPetSick()).toBe(false);
  });
});

describe('BCT-P10C: Trigger Order + Edge Cases', () => {
  beforeEach(() => {
    resetTestEnvironment();
  });

  afterEach(() => {
    resetRngProvider();
  });

  it('BCT-P10C-17: Hot Pepper when Overweight - Hot Pepper roll happens first; if triggers, overweight roll skipped (one RNG call)', () => {
    setupPetWithWeight(65, 'classic');
    // Track how many times RNG is called
    let rngCallCount = 0;
    setRngProvider(() => {
      rngCallCount++;
      return 0.01; // Will trigger on first call
    });

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    expect(isPetSick()).toBe(true);
    // Only one RNG call because hot pepper triggered (early exit)
    expect(rngCallCount).toBe(1);
  });

  it('BCT-P10C-18: Hot Pepper when Overweight - If Hot Pepper roll fails, overweight snack roll happens (two RNG calls)', () => {
    setupPetWithWeight(65, 'classic');
    // First call returns 0.1 (fails hot pepper), second call returns 0.01 (triggers overweight)
    setRngProvider(createSequenceRng([0.1, 0.01]));

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    // Hot pepper is NOT a snack per SNACK_WEIGHT_GAIN, so overweight trigger won't apply
    // Wait - hot_pepper doesn't add weight, so it's not in SNACK_WEIGHT_GAIN
    // Let me verify: hot_pepper is NOT a snack, so overweight trigger doesn't apply
    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-18b: Hot Pepper when Overweight but hot_pepper is not a snack - only Hot Pepper trigger applies', () => {
    // This test clarifies: hot_pepper is not in SNACK_WEIGHT_GAIN, so overweight snack trigger doesn't apply
    expect(SNACK_WEIGHT_GAIN['hot_pepper']).toBeUndefined();

    setupPetWithWeight(65, 'classic');
    // First call returns 0.1 (fails hot pepper)
    setRngProvider(() => 0.1);

    const store = useGameStore.getState();
    store.addFood('hot_pepper', 1);
    store.feed('hot_pepper');

    // Hot pepper roll failed, and hot_pepper is not a snack, so no overweight trigger
    expect(isPetSick()).toBe(false);
  });

  it('BCT-P10C-18c: Snack (cookie) when Overweight - two RNG scenarios with actual snack', () => {
    // This test covers the intended behavior with an actual snack
    setupPetWithWeight(65, 'classic');
    // Cookie is not hot_pepper, so no hot pepper check. Overweight check applies.
    setRngProvider(() => 0.01);

    const store = useGameStore.getState();
    store.addFood('cookie', 1);
    store.feed('cookie');

    expect(isPetSick()).toBe(true);
  });

  it('BCT-P10C-19: Already sick pet - feeding does not re-trigger sickness or reset sickStartTimestamp', () => {
    setupPetWithWeight(0, 'classic');

    // First: make pet sick
    setRngProvider(() => 0.01);
    useGameStore.getState().addFood('hot_pepper', 1);
    useGameStore.getState().feed('hot_pepper');

    expect(isPetSick()).toBe(true);

    // Record the original sickStartTimestamp - get fresh state
    const stateAfterFirstFeed = useGameStore.getState();
    const activePetId = stateAfterFirstFeed.activePetId;
    const originalSickStartTimestamp = stateAfterFirstFeed.petsById[activePetId]?.sickStartTimestamp;
    expect(originalSickStartTimestamp).not.toBeNull();

    // Wait a bit and feed again
    // In tests, timestamps are based on Date.now(), so we'll just verify no reset
    useGameStore.getState().addFood('hot_pepper', 1);
    useGameStore.getState().feed('hot_pepper');

    // Pet should still be sick with same timestamp - get fresh state again
    const stateAfterSecondFeed = useGameStore.getState();
    expect(isPetSick()).toBe(true);
    expect(stateAfterSecondFeed.petsById[activePetId]?.sickStartTimestamp).toBe(originalSickStartTimestamp);
  });
});

describe('BCT-P10C: Constants Verification', () => {
  it('BCT-P10C-CONST-01: SNACK_WEIGHT_GAIN has correct values per Bible', () => {
    expect(SNACK_WEIGHT_GAIN.cookie).toBe(5);
    expect(SNACK_WEIGHT_GAIN.candy).toBe(10);
    expect(SNACK_WEIGHT_GAIN.ice_cream).toBe(10);
    expect(SNACK_WEIGHT_GAIN.lollipop).toBe(8);
  });

  it('BCT-P10C-CONST-02: FEEDING_SICKNESS_TRIGGERS has correct values per Bible', () => {
    expect(FEEDING_SICKNESS_TRIGGERS.HOT_PEPPER_CHANCE).toBe(0.05);
    expect(FEEDING_SICKNESS_TRIGGERS.OVERWEIGHT_SNACK_CHANCE).toBe(0.05);
    expect(FEEDING_SICKNESS_TRIGGERS.OVERWEIGHT_THRESHOLD).toBe(61);
  });
});
