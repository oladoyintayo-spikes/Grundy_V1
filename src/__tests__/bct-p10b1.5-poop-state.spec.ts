/**
 * P10-B1.5: Poop State System Tests
 * Bible v1.8 §9.5 - Cleaning / Waste System
 *
 * Tests poop spawn, clean, and sickness trigger integration.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import { POOP_FREQUENCY, SICKNESS_CONFIG } from '../constants/bible.constants';
import { setTimeProvider, resetTimeProvider } from '../game/time';
import { setRngProvider, resetRngProvider } from '../game/rng';
import { applyOfflineOrderToPet } from '../game/offlineSickness';
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
  ...overrides,
});

// ============================================
// P10-B1.5-001: Poop Frequency Constants
// Bible v1.8 §9.5 - Poop Frequency by Pet table
// ============================================

describe('P10-B1.5-001: Poop Frequency Constants', () => {
  it('should have correct poop frequency values per Bible §9.5', () => {
    // Bible §9.5: Poop Frequency by Pet table
    expect(POOP_FREQUENCY.munchlet).toBe(4);  // Average
    expect(POOP_FREQUENCY.grib).toBe(3);      // Messy
    expect(POOP_FREQUENCY.plompo).toBe(5);    // Efficient
    expect(POOP_FREQUENCY.fizz).toBe(3);      // Hyper digestion
    expect(POOP_FREQUENCY.ember).toBe(4);     // Average
    expect(POOP_FREQUENCY.chomper).toBe(2);   // Constant eating = constant pooping
    expect(POOP_FREQUENCY.whisp).toBe(6);     // Ethereal, minimal waste
    expect(POOP_FREQUENCY.luxe).toBe(4);      // Average
  });

  it('should have all 8 pet species defined', () => {
    const expectedPets = ['munchlet', 'grib', 'plompo', 'fizz', 'ember', 'chomper', 'whisp', 'luxe'];
    for (const pet of expectedPets) {
      expect(POOP_FREQUENCY[pet]).toBeDefined();
      expect(typeof POOP_FREQUENCY[pet]).toBe('number');
      expect(POOP_FREQUENCY[pet]).toBeGreaterThan(0);
    }
  });
});

// ============================================
// P10-B1.5-002: Poop State Fields
// Bible v1.8 §9.5 - Pet state tracking
// ============================================

describe('P10-B1.5-002: Poop State Fields', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should initialize poop state fields with correct defaults', () => {
    const state = useGameStore.getState();
    const activePet = state.petsById[state.activePetId];

    expect(activePet.isPoopDirty).toBe(false);
    expect(activePet.poopDirtyStartTimestamp).toBe(null);
    expect(activePet.feedingsSinceLastPoop).toBe(0);
  });

  it('should have poopDirtyMinutesAccum for sickness trigger', () => {
    const state = useGameStore.getState();
    const activePet = state.petsById[state.activePetId];

    expect(activePet.poopDirtyMinutesAccum).toBe(0);
  });
});

// ============================================
// P10-B1.5-003: Poop Spawn on Feeding
// Bible v1.8 §9.5 - After N feedings, poop spawns
// ============================================

describe('P10-B1.5-003: Poop Spawn on Feeding', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    // Add food to inventory for feeding
    useGameStore.getState().addFood('apple', 20);
    // Set pet hunger to low value so feeding doesn't get blocked by STUFFED state
    // (Bible §4.4: STUFFED pets 91-100 cannot be fed)
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];
    useGameStore.setState({
      pet: { ...state.pet, hunger: 20 },
      petsById: {
        ...state.petsById,
        [activePetId]: { ...pet, hunger: 20 },
      },
    });
  });

  it('should spawn poop after correct feeding count for Munchlet (4 feedings)', () => {
    const store = useGameStore.getState();
    const activePetId = store.activePetId;

    // Munchlet threshold is 4
    expect(POOP_FREQUENCY.munchlet).toBe(4);

    // Feed 3 times - no poop yet
    for (let i = 0; i < 3; i++) {
      useGameStore.getState().feed('apple');
    }

    let pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(false);
    expect(pet.feedingsSinceLastPoop).toBe(3);

    // 4th feeding - poop spawns
    useGameStore.getState().feed('apple');

    pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(true);
    expect(pet.poopDirtyStartTimestamp).not.toBe(null);
    expect(pet.feedingsSinceLastPoop).toBe(0); // Reset after spawn
  });

  it('should spawn poop after correct feeding count for Chomper (2 feedings)', () => {
    // Switch to Chomper for this test
    const store = useGameStore.getState();

    // Create a Chomper pet in the store
    const chomperPet = createTestPet('chomper');
    const chomperInstanceId = 'chomper-test';

    useGameStore.setState({
      petsById: {
        ...store.petsById,
        [chomperInstanceId]: chomperPet,
      },
      ownedPetIds: [...store.ownedPetIds, chomperInstanceId],
      activePetId: chomperInstanceId,
      pet: chomperPet,
    });

    // Chomper threshold is 2
    expect(POOP_FREQUENCY.chomper).toBe(2);

    // Feed once - no poop yet
    useGameStore.getState().feed('apple');

    let pet = useGameStore.getState().petsById[chomperInstanceId];
    expect(pet.isPoopDirty).toBe(false);
    expect(pet.feedingsSinceLastPoop).toBe(1);

    // 2nd feeding - poop spawns
    useGameStore.getState().feed('apple');

    pet = useGameStore.getState().petsById[chomperInstanceId];
    expect(pet.isPoopDirty).toBe(true);
    expect(pet.feedingsSinceLastPoop).toBe(0);
  });

  it('should not spawn poop if poop already exists', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const testTimestamp = 1700000000000;

    // Directly set poop state to dirty (simulating poop already exists)
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...state.petsById[activePetId],
          isPoopDirty: true,
          poopDirtyStartTimestamp: testTimestamp,
          feedingsSinceLastPoop: 0,
        },
      },
    });

    // Feed twice more - counter should increment but poop shouldn't spawn again
    useGameStore.getState().feed('apple');
    useGameStore.getState().feed('apple');

    const pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(true);
    expect(pet.poopDirtyStartTimestamp).toBe(testTimestamp); // Same timestamp (no new spawn)
    expect(pet.feedingsSinceLastPoop).toBe(2); // Counter keeps going
  });

  it('should set timestamp when poop spawns', () => {
    const testTime = 1700000000000;
    setTimeProvider(() => testTime);

    const store = useGameStore.getState();
    const activePetId = store.activePetId;

    // Feed to spawn poop
    for (let i = 0; i < 4; i++) {
      useGameStore.getState().feed('apple');
    }

    const pet = useGameStore.getState().petsById[activePetId];
    // Timestamp should be close to our test time (within feeding time)
    expect(pet.poopDirtyStartTimestamp).not.toBe(null);

    resetTimeProvider();
  });
});

// ============================================
// P10-B1.5-004: Clean Poop Action
// Bible v1.8 §9.5 - Tap to clean
// ============================================

describe('P10-B1.5-004: Clean Poop Action', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    useGameStore.getState().addFood('apple', 20);
    // Set pet hunger to low value so feeding doesn't get blocked by STUFFED state
    const state = useGameStore.getState();
    const activePetId = state.activePetId;
    const pet = state.petsById[activePetId];
    useGameStore.setState({
      pet: { ...state.pet, hunger: 20 },
      petsById: {
        ...state.petsById,
        [activePetId]: { ...pet, hunger: 20 },
      },
    });
  });

  it('should clean poop and clear timestamp', () => {
    const store = useGameStore.getState();
    const activePetId = store.activePetId;

    // Spawn poop
    for (let i = 0; i < 4; i++) {
      useGameStore.getState().feed('apple');
    }

    let pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(true);
    expect(pet.poopDirtyStartTimestamp).not.toBe(null);

    // Clean poop
    useGameStore.getState().cleanPoop(activePetId);

    pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(false);
    expect(pet.poopDirtyStartTimestamp).toBe(null);
  });

  it('should NOT reset feedingsSinceLastPoop counter on clean', () => {
    const state = useGameStore.getState();
    const activePetId = state.activePetId;

    // Directly set poop state with counter at 2 (simulating poop spawn + 2 more feedings)
    useGameStore.setState({
      petsById: {
        ...state.petsById,
        [activePetId]: {
          ...state.petsById[activePetId],
          isPoopDirty: true,
          poopDirtyStartTimestamp: Date.now(),
          feedingsSinceLastPoop: 2, // Simulating 2 feedings after poop spawned
        },
      },
    });

    let pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(true);
    expect(pet.feedingsSinceLastPoop).toBe(2);

    // Clean poop
    useGameStore.getState().cleanPoop(activePetId);

    pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(false);
    expect(pet.feedingsSinceLastPoop).toBe(2); // Counter NOT reset
  });

  it('should do nothing if no poop exists', () => {
    const store = useGameStore.getState();
    const activePetId = store.activePetId;

    let pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(false);

    // Clean when no poop
    useGameStore.getState().cleanPoop(activePetId);

    pet = useGameStore.getState().petsById[activePetId];
    expect(pet.isPoopDirty).toBe(false);
    expect(pet.poopDirtyStartTimestamp).toBe(null);
  });
});

// ============================================
// P10-B1.5-005: Poop Sickness Trigger (Classic Only)
// Bible v1.8 §9.4.7.2 - Poop uncleaned 2 hours = 15% chance
// ============================================

describe('P10-B1.5-005: Poop Sickness Trigger', () => {
  afterEach(() => {
    resetRngProvider();
    resetTimeProvider();
  });

  it('should trigger sickness roll after 120 minutes of poop dirty (15% chance)', () => {
    // Force successful sickness roll (roll < 0.15)
    setRngProvider(() => 0.10);
    setTimeProvider(() => 1700000000000);

    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyStartTimestamp: 1700000000000,
      poopDirtyMinutesAccum: 0,
    });

    // 120 minutes offline with poop dirty
    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 120,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true, // This now uses real isPoopDirty
      currentTimestamp: 1700000000000,
    });

    expect(result.becameSick).toBe(true);
    expect(result.sicknessTrigger).toBe('poop');
    expect(result.pet.isSick).toBe(true);
  });

  it('should NOT trigger sickness if roll fails (>= 15%)', () => {
    // Force failed sickness roll (roll >= 0.15)
    setRngProvider(() => 0.20);
    setTimeProvider(() => 1700000000000);

    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 120,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true,
      currentTimestamp: 1700000000000,
    });

    expect(result.becameSick).toBe(false);
    expect(result.pet.isSick).toBe(false);
    // Accumulator should be reset after roll
    expect(result.pet.poopDirtyMinutesAccum).toBe(0);
  });

  it('should skip sickness trigger in Cozy mode', () => {
    setRngProvider(() => 0.01); // Would trigger if Classic

    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 120,
      gameMode: 'cozy',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true,
    });

    expect(result.becameSick).toBe(false);
    expect(result.cozyShortCircuit).toBe(true);
  });

  it('should reset accumulator after sickness roll (pass or fail)', () => {
    // Force failed roll
    setRngProvider(() => 0.50);

    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyMinutesAccum: 50, // Some existing accumulation
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 100, // Total 150 > 120 threshold
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true,
    });

    // Roll happened, accumulator reset
    expect(result.pet.poopDirtyMinutesAccum).toBe(0);
    expect(result.becameSick).toBe(false);
  });

  it('should use SICKNESS_CONFIG.POOP_TRIGGER_CHANCE (15%)', () => {
    // Verify the constant is 15% per Bible §9.4.7.2
    // (Note: §9.5 says 20%, but §9.4.7.2 takes precedence per task spec)
    expect(SICKNESS_CONFIG.POOP_TRIGGER_CHANCE).toBe(0.15);
  });

  it('should use SICKNESS_CONFIG.POOP_TRIGGER_MINUTES (120)', () => {
    // Verify the threshold is 2 hours (120 minutes)
    expect(SICKNESS_CONFIG.POOP_TRIGGER_MINUTES).toBe(120);
  });
});

// ============================================
// P10-B1.5-006: Hunger Proxy Removed
// Verify hunger level is irrelevant to poop trigger
// ============================================

describe('P10-B1.5-006: Hunger Proxy Removed', () => {
  afterEach(() => {
    resetRngProvider();
    resetTimeProvider();
  });

  it('should NOT use hunger < 20 as poop proxy', () => {
    // Low hunger should NOT trigger poop sickness if isPoopDirty is false
    setRngProvider(() => 0.01); // Would trigger if poop was dirty

    const pet = createTestPet('munchlet', {
      hunger: 10, // Low hunger (old proxy condition)
      isPoopDirty: false, // But no actual poop
      poopDirtyMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 180, // 3 hours
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false, // Real poop state: false
    });

    // Should NOT trigger poop sickness (hunger is irrelevant)
    expect(result.sicknessTrigger).not.toBe('poop');
  });

  it('should trigger poop sickness based on isPoopDirty, not hunger', () => {
    setRngProvider(() => 0.01);

    const pet = createTestPet('munchlet', {
      hunger: 100, // Full hunger (opposite of old proxy)
      isPoopDirty: true, // But poop is dirty
      poopDirtyMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 180,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true, // Real poop state: true
    });

    // Should trigger poop sickness (based on real state)
    expect(result.becameSick).toBe(true);
    expect(result.sicknessTrigger).toBe('poop');
  });
});

// ============================================
// P10-B1.5-007: Offline Poop Behavior
// Bible v1.8 §9.4.7.3 - Offline rules
// ============================================

describe('P10-B1.5-007: Offline Poop Behavior', () => {
  afterEach(() => {
    resetRngProvider();
    resetTimeProvider();
  });

  it('should accumulate poop dirty time offline (capped at 14 days)', () => {
    setRngProvider(() => 0.99); // Don't trigger sickness

    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyMinutesAccum: 0,
    });

    // 60 minutes offline (under threshold)
    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 60,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true,
    });

    // Accumulator increased but no roll (under 120 min threshold)
    expect(result.pet.poopDirtyMinutesAccum).toBe(60);
    expect(result.becameSick).toBe(false);
  });

  it('should NOT spawn poop offline (requires feeding)', () => {
    const pet = createTestPet('munchlet', {
      isPoopDirty: false,
      feedingsSinceLastPoop: 3, // Close to threshold
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 1000,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false,
    });

    // Poop should NOT spawn offline (no feeding)
    expect(result.pet.isPoopDirty).toBe(false);
    expect(result.pet.feedingsSinceLastPoop).toBe(3); // Unchanged
  });

  it('should NOT auto-clean poop offline', () => {
    setRngProvider(() => 0.99); // Don't trigger sickness

    const testTime = 1700000000000;
    const pet = createTestPet('munchlet', {
      isPoopDirty: true,
      poopDirtyStartTimestamp: testTime - 60000, // 1 min ago
      poopDirtyMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 60,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: true,
    });

    // Poop should NOT be auto-cleaned
    expect(result.pet.isPoopDirty).toBe(true);
  });
});
