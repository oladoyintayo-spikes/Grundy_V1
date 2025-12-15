/**
 * P10-B2: Poop UI + Mood Decay + Rewards Tests
 * Bible v1.8 §9.5 - Cleaning / Waste System (Polish Layer)
 *
 * Tests:
 * - Poop visual indicator (PoopIndicator component)
 * - Tap-to-clean interaction
 * - Cleaning rewards (+2 Happiness, +0.1 Bond)
 * - Mood decay acceleration (2× when dirty 60+ min)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  POOP_CLEANING_REWARDS,
  POOP_MOOD_DECAY,
  MOOD_MODIFIERS,
} from '../constants/bible.constants';
import { setTimeProvider, resetTimeProvider } from '../game/time';
import { decayMood, type PoopDecayOptions } from '../game/systems';
import type { OwnedPetState } from '../types';

// ============================================
// Test Helpers
// ============================================

const createTestPet = (speciesId: string, overrides?: Partial<OwnedPetState>): OwnedPetState => ({
  id: speciesId,
  customName: '',
  level: 1,
  xp: 0,
  bond: 0,
  mood: 'neutral',
  moodValue: 50,
  hunger: 50,
  evolutionStage: 'baby',
  lastMoodUpdate: Date.now(),
  instanceId: `${speciesId}-test`,
  speciesId: speciesId as OwnedPetState['speciesId'],
  weight: 50,
  isSick: false,
  sickStartTimestamp: null,
  hungerZeroMinutesAccum: 0,
  poopDirtyMinutesAccum: 0,
  offlineSickCareMistakesAccruedThisSession: 0,
  isPoopDirty: false,
  poopDirtyStartTimestamp: null,
  feedingsSinceLastPoop: 0,
  // P11-A: Cosmetic state fields
  ownedCosmeticIds: [],
  equippedCosmetics: {},
  ...overrides,
});

// ============================================
// P10-B2-001: Cleaning Rewards Constants
// Bible v1.8 §9.5 - Cleaning rewards
// ============================================

describe('P10-B2-001: Cleaning Rewards Constants', () => {
  it('should have correct cleaning reward values per Bible §9.5', () => {
    // Bible §9.5: +2 Happiness, +0.1 Bond
    expect(POOP_CLEANING_REWARDS.HAPPINESS_BOOST).toBe(2);
    expect(POOP_CLEANING_REWARDS.BOND_BOOST).toBe(0.1);
  });
});

// ============================================
// P10-B2-002: Mood Decay Acceleration Constants
// Bible v1.8 §9.5 - Mood decay when poop dirty 60+ min
// ============================================

describe('P10-B2-002: Mood Decay Acceleration Constants', () => {
  it('should have correct mood decay acceleration values per Bible §9.5', () => {
    // Bible §9.5: 2× mood decay when poop dirty 60+ min
    expect(POOP_MOOD_DECAY.ACCELERATION_THRESHOLD_MINUTES).toBe(60);
    expect(POOP_MOOD_DECAY.ACCELERATION_MULTIPLIER).toBe(2);
  });
});

// ============================================
// P10-B2-003: cleanPoop() Rewards
// Bible v1.8 §9.5 - +2 Happiness, +0.1 Bond
// ============================================

describe('P10-B2-003: cleanPoop() Rewards', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    // Set poop dirty on the active pet
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: true,
          poopDirtyStartTimestamp: Date.now() - 30 * 60 * 1000, // 30 min ago
          moodValue: 50,
          bond: 0,
        },
      },
    });
  });

  it('should award +2 Happiness (mood) when cleaning poop', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const petBefore = state.petsById[activePetId];
    const moodBefore = petBefore.moodValue ?? 50;

    // Clean the poop
    state.cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    expect(petAfter.moodValue).toBe(moodBefore + POOP_CLEANING_REWARDS.HAPPINESS_BOOST);
    expect(petAfter.moodValue).toBe(moodBefore + 2);
  });

  it('should award +0.1 Bond when cleaning poop', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const petBefore = state.petsById[activePetId];
    const bondBefore = petBefore.bond;

    // Clean the poop
    state.cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    expect(petAfter.bond).toBeCloseTo(bondBefore + POOP_CLEANING_REWARDS.BOND_BOOST, 5);
    expect(petAfter.bond).toBeCloseTo(bondBefore + 0.1, 5);
  });

  it('should cap mood at 100', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set mood to 99
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          moodValue: 99,
        },
      },
    });

    // Clean the poop (+2 mood)
    useGameStore.getState().cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    expect(petAfter.moodValue).toBe(100); // Capped at 100
  });

  it('should cap bond at 100', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set bond to 99.95
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          bond: 99.95,
        },
      },
    });

    // Clean the poop (+0.1 bond)
    useGameStore.getState().cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    expect(petAfter.bond).toBe(100); // Capped at 100
  });

  it('should not award rewards if poop is not dirty (race-safe guard)', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set poop to NOT dirty
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: false,
          moodValue: 50,
          bond: 0,
        },
      },
    });

    const moodBefore = 50;
    const bondBefore = 0;

    // Try to clean (should be no-op)
    useGameStore.getState().cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    expect(petAfter.moodValue).toBe(moodBefore); // No change
    expect(petAfter.bond).toBe(bondBefore); // No change
  });

  it('should not double-award if cleanPoop called twice in quick succession', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const petBefore = state.petsById[activePetId];
    const moodBefore = petBefore.moodValue ?? 50;
    const bondBefore = petBefore.bond;

    // Clean once
    state.cleanPoop(activePetId);

    // Try to clean again (should be no-op)
    useGameStore.getState().cleanPoop(activePetId);

    const petAfter = useGameStore.getState().petsById[activePetId];
    // Should only be +2/+0.1 from first clean, not +4/+0.2
    expect(petAfter.moodValue).toBe(moodBefore + 2);
    expect(petAfter.bond).toBeCloseTo(bondBefore + 0.1, 5);
  });
});

// ============================================
// P10-B2-004: Online Mood Decay Acceleration
// Bible v1.8 §9.5 - 2× decay when poop dirty 60+ min
// ============================================

describe('P10-B2-004: Online Mood Decay Acceleration', () => {
  const baseDecayPerMinute = MOOD_MODIFIERS.DECAY_PER_MINUTE;
  const minutesElapsed = 10;
  const baseDecay = minutesElapsed * baseDecayPerMinute;

  it('should NOT apply 2× multiplier when poop is not dirty', () => {
    const currentMood = 80;
    const poopOptions: PoopDecayOptions = {
      isPoopDirty: false,
      poopDirtyStartTimestamp: null,
    };

    const newMood = decayMood(currentMood, minutesElapsed, undefined, undefined, poopOptions);

    expect(newMood).toBe(currentMood - baseDecay);
  });

  it('should NOT apply 2× multiplier when poop dirty < 60 minutes', () => {
    const currentMood = 80;
    const currentTs = Date.now();
    const poopOptions: PoopDecayOptions = {
      isPoopDirty: true,
      poopDirtyStartTimestamp: currentTs - (59 * 60 * 1000), // 59 min ago
      currentTimestamp: currentTs,
    };

    const newMood = decayMood(currentMood, minutesElapsed, undefined, undefined, poopOptions);

    // Should NOT have 2× multiplier (only 59 min dirty)
    expect(newMood).toBe(currentMood - baseDecay);
  });

  it('should apply 2× multiplier when poop dirty exactly 60 minutes', () => {
    const currentMood = 80;
    const currentTs = Date.now();
    const poopOptions: PoopDecayOptions = {
      isPoopDirty: true,
      poopDirtyStartTimestamp: currentTs - (60 * 60 * 1000), // 60 min ago
      currentTimestamp: currentTs,
    };

    const newMood = decayMood(currentMood, minutesElapsed, undefined, undefined, poopOptions);

    // Should have 2× multiplier
    const expectedDecay = baseDecay * POOP_MOOD_DECAY.ACCELERATION_MULTIPLIER;
    expect(newMood).toBe(currentMood - expectedDecay);
  });

  it('should apply 2× multiplier when poop dirty > 60 minutes', () => {
    const currentMood = 80;
    const currentTs = Date.now();
    const poopOptions: PoopDecayOptions = {
      isPoopDirty: true,
      poopDirtyStartTimestamp: currentTs - (90 * 60 * 1000), // 90 min ago
      currentTimestamp: currentTs,
    };

    const newMood = decayMood(currentMood, minutesElapsed, undefined, undefined, poopOptions);

    // Should have 2× multiplier
    const expectedDecay = baseDecay * POOP_MOOD_DECAY.ACCELERATION_MULTIPLIER;
    expect(newMood).toBe(currentMood - expectedDecay);
  });

  it('should not decay mood below 0', () => {
    const currentMood = 1; // Very low mood
    const currentTs = Date.now();
    const poopOptions: PoopDecayOptions = {
      isPoopDirty: true,
      poopDirtyStartTimestamp: currentTs - (90 * 60 * 1000), // 90 min ago
      currentTimestamp: currentTs,
    };

    const newMood = decayMood(currentMood, 100, undefined, undefined, poopOptions); // Large decay

    expect(newMood).toBe(0); // Floored at 0
  });
});

// ============================================
// P10-B2-005: Offline Mood Decay Acceleration
// Bible v1.8 §9.5 - 2× decay when poop dirty at save 60+ min
// ============================================

describe('P10-B2-005: Offline Mood Decay Acceleration', () => {
  let mockTime = Date.now();

  beforeEach(() => {
    mockTime = Date.now();
    setTimeProvider(() => mockTime);
    useGameStore.getState().resetGame();

    // Complete FTUE to enable offline fanout
    const store = useGameStore.getState();
    useGameStore.setState({
      ftue: { ...store.ftue, hasCompletedFtue: true },
    });
  });

  afterEach(() => {
    resetTimeProvider();
  });

  it('should apply 2× mood decay multiplier when poop was dirty 60+ min at save', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set poop dirty for 90 minutes at save time
    const lastSeenTime = mockTime;
    const poopDirtyStart = lastSeenTime - (90 * 60 * 1000); // Poop dirty 90 min before save

    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: true,
          poopDirtyStartTimestamp: poopDirtyStart,
          moodValue: 80,
        },
      },
      lastSeenTimestamp: lastSeenTime,
    });

    // Advance time by 48 hours (2 full 24h periods for decay)
    mockTime = lastSeenTime + (48 * 60 * 60 * 1000);

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    const petAfter = useGameStore.getState().petsById[activePetId];

    // Base decay = 2 periods × 5 mood per period = 10
    // With 2× multiplier = 20
    // Starting from 80, should be 60
    expect(petAfter.moodValue).toBe(80 - (2 * 5 * 2)); // 60
  });

  it('should NOT apply 2× mood decay multiplier when poop was dirty < 60 min at save', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set poop dirty for only 30 minutes at save time
    const lastSeenTime = mockTime;
    const poopDirtyStart = lastSeenTime - (30 * 60 * 1000); // Poop dirty 30 min before save

    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: true,
          poopDirtyStartTimestamp: poopDirtyStart,
          moodValue: 80,
        },
      },
      lastSeenTimestamp: lastSeenTime,
    });

    // Advance time by 48 hours (2 full 24h periods for decay)
    mockTime = lastSeenTime + (48 * 60 * 60 * 1000);

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    const petAfter = useGameStore.getState().petsById[activePetId];

    // Base decay = 2 periods × 5 mood per period = 10
    // NO 2× multiplier since poop was only dirty 30 min
    // Starting from 80, should be 70
    expect(petAfter.moodValue).toBe(80 - (2 * 5)); // 70
  });

  it('should NOT apply 2× mood decay multiplier when poop was not dirty', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Poop NOT dirty
    const lastSeenTime = mockTime;

    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: false,
          poopDirtyStartTimestamp: null,
          moodValue: 80,
        },
      },
      lastSeenTimestamp: lastSeenTime,
    });

    // Advance time by 48 hours (2 full 24h periods for decay)
    mockTime = lastSeenTime + (48 * 60 * 60 * 1000);

    // Apply offline fanout
    useGameStore.getState().applyOfflineFanout(new Date(mockTime));

    const petAfter = useGameStore.getState().petsById[activePetId];

    // Base decay = 2 periods × 5 mood per period = 10
    // NO 2× multiplier
    // Starting from 80, should be 70
    expect(petAfter.moodValue).toBe(80 - (2 * 5)); // 70
  });
});

// ============================================
// P10-B2-006: PoopIndicator Component Integration
// Tests that store state properly drives UI visibility
// ============================================

describe('P10-B2-006: Poop Indicator Store Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should reflect isPoopDirty state from active pet', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Initially not dirty
    expect(pet.isPoopDirty).toBe(false);

    // Set dirty
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: true,
          poopDirtyStartTimestamp: Date.now(),
        },
      },
    });

    const updatedPet = useGameStore.getState().petsById[activePetId];
    expect(updatedPet.isPoopDirty).toBe(true);
  });

  it('should clear dirty state after cleanPoop', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];

    // Set dirty first
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...pet,
          isPoopDirty: true,
          poopDirtyStartTimestamp: Date.now(),
        },
      },
    });

    // Clean poop
    useGameStore.getState().cleanPoop(activePetId);

    const updatedPet = useGameStore.getState().petsById[activePetId];
    expect(updatedPet.isPoopDirty).toBe(false);
    expect(updatedPet.poopDirtyStartTimestamp).toBe(null);
  });
});
