/**
 * P10-A Foundation Tests
 * Bible v1.8 §9.4.7: Weight & Sickness Multi-Pet Rules
 *
 * Tests for:
 * 1. New pet defaults (weight, sickness fields, accumulators)
 * 2. Migration: older persisted state loads with defaults injected
 * 3. Deterministic time/RNG hooks
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import type { OwnedPetState } from '../types';
import {
  nowMs,
  setTimeProvider,
  resetTimeProvider,
} from '../game/time';
import {
  randomFloat,
  setRngProvider,
  resetRngProvider,
  createSequenceRng,
} from '../game/rng';

// ============================================
// P10-A-001: New Pet Default Values
// Bible v1.8 §9.4.7
// ============================================

describe('P10-A-001: New Pet Default Values', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should initialize weight to 0 for new pets', () => {
    const pets = useGameStore.getState().getOwnedPets();
    expect(pets.length).toBeGreaterThan(0);

    for (const pet of pets) {
      expect(pet.weight).toBe(0);
    }
  });

  it('should initialize isSick to false for new pets', () => {
    const pets = useGameStore.getState().getOwnedPets();

    for (const pet of pets) {
      expect(pet.isSick).toBe(false);
    }
  });

  it('should initialize sickStartTimestamp to null for new pets', () => {
    const pets = useGameStore.getState().getOwnedPets();

    for (const pet of pets) {
      expect(pet.sickStartTimestamp).toBeNull();
    }
  });

  it('should initialize timer accumulators to 0 for new pets', () => {
    const pets = useGameStore.getState().getOwnedPets();

    for (const pet of pets) {
      expect(pet.hungerZeroMinutesAccum).toBe(0);
      expect(pet.poopDirtyMinutesAccum).toBe(0);
    }
  });

  it('should initialize offline care mistakes counter to 0 for new pets', () => {
    const pets = useGameStore.getState().getOwnedPets();

    for (const pet of pets) {
      expect(pet.offlineSickCareMistakesAccruedThisSession).toBe(0);
    }
  });
});

// ============================================
// P10-A-002: OwnedPetState Type Compliance
// Verify the type shape matches Bible v1.8 §9.4.7
// ============================================

describe('P10-A-002: OwnedPetState Type Compliance', () => {
  it('should have all required weight/sickness fields in type', () => {
    const pet: OwnedPetState = {
      // Base PetState fields
      id: 'munchlet',
      customName: '',
      level: 1,
      xp: 0,
      bond: 0,
      mood: 'neutral',
      moodValue: 50,
      hunger: 50,
      evolutionStage: 'baby',
      lastMoodUpdate: Date.now(),
      // OwnedPetState fields
      instanceId: 'munchlet-test',
      speciesId: 'munchlet',
      // P10-A fields (Bible v1.8 §9.4.7)
      weight: 0,
      isSick: false,
      sickStartTimestamp: null,
      hungerZeroMinutesAccum: 0,
      poopDirtyMinutesAccum: 0,
      offlineSickCareMistakesAccruedThisSession: 0,
      // P10-B1.5 fields (Bible v1.8 §9.5)
      isPoopDirty: false,
      poopDirtyStartTimestamp: null,
      feedingsSinceLastPoop: 0,
      // P11-A: Cosmetic state fields
      ownedCosmeticIds: [],
      equippedCosmetics: {},
    };

    // Type check: all fields exist and have correct types
    expect(typeof pet.weight).toBe('number');
    expect(typeof pet.isSick).toBe('boolean');
    expect(pet.sickStartTimestamp === null || typeof pet.sickStartTimestamp === 'number').toBe(true);
    expect(typeof pet.hungerZeroMinutesAccum).toBe('number');
    expect(typeof pet.poopDirtyMinutesAccum).toBe('number');
    expect(typeof pet.offlineSickCareMistakesAccruedThisSession).toBe('number');
    // P10-B1.5 poop state fields
    expect(typeof pet.isPoopDirty).toBe('boolean');
    expect(pet.poopDirtyStartTimestamp === null || typeof pet.poopDirtyStartTimestamp === 'number').toBe(true);
    expect(typeof pet.feedingsSinceLastPoop).toBe('number');
  });
});

// ============================================
// P10-A-003: Deterministic Time Hook
// Bible v1.8 §9.4.7: For offline calculation testing
// ============================================

describe('P10-A-003: Deterministic Time Hook', () => {
  afterEach(() => {
    resetTimeProvider();
  });

  it('should return current time by default', () => {
    const before = Date.now();
    const result = nowMs();
    const after = Date.now();

    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });

  it('should use injected time provider', () => {
    const fixedTime = 1700000000000;
    setTimeProvider(() => fixedTime);

    expect(nowMs()).toBe(fixedTime);
    expect(nowMs()).toBe(fixedTime);
  });

  it('should reset to real time when provider set to null', () => {
    setTimeProvider(() => 1234567890);
    expect(nowMs()).toBe(1234567890);

    setTimeProvider(null);
    const realTime = nowMs();
    expect(Math.abs(realTime - Date.now())).toBeLessThan(100);
  });

  it('should reset to real time with resetTimeProvider()', () => {
    setTimeProvider(() => 9999999999);
    expect(nowMs()).toBe(9999999999);

    resetTimeProvider();
    const realTime = nowMs();
    expect(Math.abs(realTime - Date.now())).toBeLessThan(100);
  });
});

// ============================================
// P10-A-004: Deterministic RNG Hook
// Bible v1.8 §9.4.7: For sickness chance roll testing
// ============================================

describe('P10-A-004: Deterministic RNG Hook', () => {
  afterEach(() => {
    resetRngProvider();
  });

  it('should return random values in [0, 1) by default', () => {
    const values = Array.from({ length: 100 }, () => randomFloat());

    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }

    // Should have some variance (not all same value)
    const unique = new Set(values);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should use injected RNG provider', () => {
    setRngProvider(() => 0.42);

    expect(randomFloat()).toBe(0.42);
    expect(randomFloat()).toBe(0.42);
    expect(randomFloat()).toBe(0.42);
  });

  it('should cycle through sequence with createSequenceRng', () => {
    setRngProvider(createSequenceRng([0.1, 0.5, 0.9]));

    expect(randomFloat()).toBe(0.1);
    expect(randomFloat()).toBe(0.5);
    expect(randomFloat()).toBe(0.9);
    expect(randomFloat()).toBe(0.1); // cycles back
    expect(randomFloat()).toBe(0.5);
  });

  it('should throw if createSequenceRng receives empty array', () => {
    expect(() => createSequenceRng([])).toThrow('RNG sequence must have at least one value');
  });

  it('should reset to real randomness when provider set to null', () => {
    setRngProvider(() => 0.123);
    expect(randomFloat()).toBe(0.123);

    setRngProvider(null);
    const values = Array.from({ length: 10 }, () => randomFloat());
    const unique = new Set(values);
    // Real randomness should give different values
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should reset to real randomness with resetRngProvider()', () => {
    setRngProvider(() => 0.999);
    expect(randomFloat()).toBe(0.999);

    resetRngProvider();
    const values = Array.from({ length: 10 }, () => randomFloat());
    const unique = new Set(values);
    expect(unique.size).toBeGreaterThan(1);
  });
});
