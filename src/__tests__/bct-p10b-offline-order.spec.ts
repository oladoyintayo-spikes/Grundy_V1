/**
 * P10-B Offline Order-of-Application Tests
 * Bible v1.8 §9.4.6, §9.4.7
 *
 * Tests for:
 * 1. 14-day offline cap
 * 2. Order-of-application (weight decay, sickness triggers, care mistakes)
 * 3. Care mistakes cap at 4 per offline session
 * 4. Sickness duration care mistake accrual
 * 5. Cozy mode short-circuits sickness impacts
 * 6. Timer accumulator behavior
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  calculateOfflineDurationMinutes,
  applyWeightDecay,
  evaluateSicknessTriggers,
  applySicknessEffects,
  applyOfflineOrderToPet,
  MAX_OFFLINE_MINUTES,
} from '../game/offlineSickness';
import { OFFLINE_DECAY_RATES, SICKNESS_CONFIG } from '../constants/bible.constants';
import { setTimeProvider, resetTimeProvider } from '../game/time';
import { setRngProvider, resetRngProvider, createSequenceRng } from '../game/rng';
import type { OwnedPetState } from '../types';

// ============================================
// P10-B-001: 14-Day Offline Cap
// Bible v1.8 §9.4.6: "Cap elapsed time at 14 days"
// ============================================

describe('P10-B-001: 14-Day Offline Cap', () => {
  it('should cap offline duration at 14 days', () => {
    const baseTime = 1700000000000;
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    const fourteenDaysMinutes = 14 * 24 * 60;

    const result = calculateOfflineDurationMinutes(baseTime, baseTime + fifteenDaysMs);

    expect(result).toBe(fourteenDaysMinutes);
  });

  it('should return actual duration when under 14 days', () => {
    const baseTime = 1700000000000;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const threeDaysMinutes = 3 * 24 * 60;

    const result = calculateOfflineDurationMinutes(baseTime, baseTime + threeDaysMs);

    expect(result).toBe(threeDaysMinutes);
  });

  it('should return 0 for negative duration', () => {
    const baseTime = 1700000000000;
    const result = calculateOfflineDurationMinutes(baseTime, baseTime - 10000);

    expect(result).toBe(0);
  });

  it('should handle exactly 14 days correctly', () => {
    const baseTime = 1700000000000;
    const exactlyFourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const fourteenDaysMinutes = 14 * 24 * 60;

    const result = calculateOfflineDurationMinutes(baseTime, baseTime + exactlyFourteenDaysMs);

    expect(result).toBe(fourteenDaysMinutes);
  });

  it('should match MAX_OFFLINE_MINUTES constant', () => {
    expect(MAX_OFFLINE_MINUTES).toBe(14 * 24 * 60);
  });
});

// ============================================
// P10-B-002: Weight Decay
// Bible v1.8 §9.4.7.1: -1 per hour, floor 0
// ============================================

describe('P10-B-002: Weight Decay', () => {
  it('should decay weight by 1 per hour', () => {
    const currentWeight = 50;
    const threeHoursMinutes = 3 * 60;

    const result = applyWeightDecay(currentWeight, threeHoursMinutes);

    expect(result).toBe(47); // 50 - 3 = 47
  });

  it('should floor weight at 0', () => {
    const currentWeight = 5;
    const tenHoursMinutes = 10 * 60;

    const result = applyWeightDecay(currentWeight, tenHoursMinutes);

    expect(result).toBe(0); // Can't go below 0
  });

  it('should use floor division for hours', () => {
    const currentWeight = 50;
    const twoAndHalfHoursMinutes = 150; // 2.5 hours

    const result = applyWeightDecay(currentWeight, twoAndHalfHoursMinutes);

    expect(result).toBe(48); // 50 - 2 = 48 (floor of 2.5)
  });

  it('should handle zero offline duration', () => {
    const currentWeight = 50;

    const result = applyWeightDecay(currentWeight, 0);

    expect(result).toBe(50); // No change
  });
});

// ============================================
// P10-B-003: Sickness Trigger Evaluation
// Bible v1.8 §9.4.7.2, §9.4.7.3
// ============================================

describe('P10-B-003: Sickness Trigger Evaluation', () => {
  afterEach(() => {
    resetRngProvider();
  });

  it('should trigger sickness on hunger when timer threshold met and roll succeeds', () => {
    // Force successful roll (below 20% threshold)
    setRngProvider(() => 0.1);

    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false, // poopAtSave
      0, // currentHungerAccum
      0, // currentPoopAccum
      60 // 60 minutes offline (exceeds 30 min threshold)
    );

    expect(result.becameSick).toBe(true);
    expect(result.trigger).toBe('hunger');
    // Timer resets after roll
    expect(result.newHungerZeroMinutesAccum).toBe(0);
  });

  it('should NOT trigger sickness when roll fails', () => {
    // Force failed roll (above 20% threshold)
    setRngProvider(() => 0.9);

    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false, // poopAtSave
      0, // currentHungerAccum
      0, // currentPoopAccum
      60 // 60 minutes offline
    );

    expect(result.becameSick).toBe(false);
    expect(result.trigger).toBeNull();
    // Timer still resets after roll (pass or fail)
    expect(result.newHungerZeroMinutesAccum).toBe(0);
  });

  it('should accumulate timer when threshold not met', () => {
    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false, // poopAtSave
      0, // currentHungerAccum
      0, // currentPoopAccum
      20 // 20 minutes offline (below 30 min threshold)
    );

    expect(result.becameSick).toBe(false);
    expect(result.newHungerZeroMinutesAccum).toBe(20);
  });

  it('should trigger on poop when timer threshold met', () => {
    // Force successful roll (below 15% threshold)
    setRngProvider(() => 0.1);

    const result = evaluateSicknessTriggers(
      false, // hungerAtSave
      true, // poopAtSave
      0, // currentHungerAccum
      0, // currentPoopAccum
      150 // 150 minutes (exceeds 120 min poop threshold)
    );

    expect(result.becameSick).toBe(true);
    expect(result.trigger).toBe('poop');
    expect(result.newPoopDirtyMinutesAccum).toBe(0);
  });

  it('should use existing accumulator plus new time', () => {
    setRngProvider(() => 0.1); // Will succeed

    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false, // poopAtSave
      25, // Already 25 minutes accumulated
      0, // currentPoopAccum
      10 // 10 more minutes → total 35 > threshold
    );

    expect(result.becameSick).toBe(true);
    expect(result.trigger).toBe('hunger');
  });

  it('should not accumulate if condition was false at save', () => {
    const result = evaluateSicknessTriggers(
      false, // hunger NOT at 0
      false, // poop NOT uncleaned
      10, // currentHungerAccum
      10, // currentPoopAccum
      60 // 60 minutes offline
    );

    expect(result.becameSick).toBe(false);
    // Accumulators unchanged (conditions were false)
    expect(result.newHungerZeroMinutesAccum).toBe(10);
    expect(result.newPoopDirtyMinutesAccum).toBe(10);
  });
});

// ============================================
// P10-B-004: Care Mistakes Cap
// Bible v1.8 §9.4.7.2: Max 4 per offline session
// ============================================

describe('P10-B-004: Care Mistakes Cap', () => {
  it('should add care mistakes at 1 per hour while sick', () => {
    const threeHoursMinutes = 180;

    const result = applySicknessEffects(threeHoursMinutes, 0);

    expect(result.careMistakesAdded).toBe(3);
    expect(result.newOfflineSickCareMistakesAccruedThisSession).toBe(3);
  });

  it('should cap care mistakes at 4 per session', () => {
    const tenHoursMinutes = 600;

    const result = applySicknessEffects(tenHoursMinutes, 0);

    expect(result.careMistakesAdded).toBe(4); // Capped at 4
    expect(result.newOfflineSickCareMistakesAccruedThisSession).toBe(4);
  });

  it('should respect existing session counter', () => {
    const threeHoursMinutes = 180;

    // Already had 2 mistakes this session
    const result = applySicknessEffects(threeHoursMinutes, 2);

    expect(result.careMistakesAdded).toBe(2); // Only 2 more allowed (4 - 2)
    expect(result.newOfflineSickCareMistakesAccruedThisSession).toBe(4);
  });

  it('should add 0 if cap already reached', () => {
    const threeHoursMinutes = 180;

    // Already at cap
    const result = applySicknessEffects(threeHoursMinutes, 4);

    expect(result.careMistakesAdded).toBe(0);
    expect(result.newOfflineSickCareMistakesAccruedThisSession).toBe(4);
  });

  it('should use floor division for hours', () => {
    const twoAndHalfHoursMinutes = 150;

    const result = applySicknessEffects(twoAndHalfHoursMinutes, 0);

    expect(result.careMistakesAdded).toBe(2); // floor(2.5) = 2
  });
});

// ============================================
// P10-B-005: Cozy Mode Short-Circuit
// Bible v1.8 §9.3: Sickness system disabled
// ============================================

describe('P10-B-005: Cozy Mode Short-Circuit', () => {
  const createTestPet = (overrides?: Partial<OwnedPetState>): OwnedPetState => ({
    id: 'munchlet',
    customName: '',
    level: 1,
    xp: 0,
    bond: 0,
    mood: 'neutral',
    moodValue: 50,
    hunger: 0, // Hunger at 0 would trigger sickness in Classic
    evolutionStage: 'baby',
    lastMoodUpdate: Date.now(),
    instanceId: 'munchlet-test',
    speciesId: 'munchlet',
    weight: 50,
    isSick: false,
    sickStartTimestamp: null,
    hungerZeroMinutesAccum: 0,
    poopDirtyMinutesAccum: 0,
    offlineSickCareMistakesAccruedThisSession: 0,
    // P10-B1.5: Poop state fields
    isPoopDirty: false,
    poopDirtyStartTimestamp: null,
    feedingsSinceLastPoop: 0,
    // P11-A: Cosmetic state fields
    ownedCosmeticIds: [],
    equippedCosmetics: {},
    ...overrides,
  });

  afterEach(() => {
    resetRngProvider();
    resetTimeProvider();
  });

  it('should apply weight decay in Cozy mode', () => {
    const pet = createTestPet({ weight: 50 });
    const threeHoursMinutes = 180;

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: threeHoursMinutes,
      gameMode: 'cozy',
      hungerWasZeroAtSave: true,
      poopWasUncleanedAtSave: false,
    });

    expect(result.weightChange).toBe(-3);
    expect(result.pet.weight).toBe(47);
  });

  it('should NOT trigger sickness in Cozy mode', () => {
    // Force roll that would succeed
    setRngProvider(() => 0.1);

    const pet = createTestPet({ hungerZeroMinutesAccum: 25 });
    const tenMinutes = 10; // Would push over threshold

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: tenMinutes,
      gameMode: 'cozy',
      hungerWasZeroAtSave: true,
      poopWasUncleanedAtSave: false,
    });

    expect(result.becameSick).toBe(false);
    expect(result.cozyShortCircuit).toBe(true);
    expect(result.pet.isSick).toBe(false);
  });

  it('should NOT add care mistakes in Cozy mode', () => {
    const pet = createTestPet({ isSick: true, sickStartTimestamp: Date.now() - 3600000 });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 180,
      gameMode: 'cozy',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false,
    });

    expect(result.careMistakesAdded).toBe(0);
    expect(result.cozyShortCircuit).toBe(true);
  });

  it('should reset session counter in Cozy mode', () => {
    const pet = createTestPet({ offlineSickCareMistakesAccruedThisSession: 3 });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 60,
      gameMode: 'cozy',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false,
    });

    expect(result.pet.offlineSickCareMistakesAccruedThisSession).toBe(0);
  });
});

// ============================================
// P10-B-006: Classic Mode Full Order
// Bible v1.8 §9.4.6, §9.4.7.3
// ============================================

describe('P10-B-006: Classic Mode Full Order', () => {
  const createTestPet = (overrides?: Partial<OwnedPetState>): OwnedPetState => ({
    id: 'munchlet',
    customName: '',
    level: 1,
    xp: 0,
    bond: 0,
    mood: 'neutral',
    moodValue: 50,
    hunger: 0,
    evolutionStage: 'baby',
    lastMoodUpdate: Date.now(),
    instanceId: 'munchlet-test',
    speciesId: 'munchlet',
    weight: 50,
    isSick: false,
    sickStartTimestamp: null,
    hungerZeroMinutesAccum: 0,
    poopDirtyMinutesAccum: 0,
    offlineSickCareMistakesAccruedThisSession: 0,
    // P10-B1.5: Poop state fields
    isPoopDirty: false,
    poopDirtyStartTimestamp: null,
    feedingsSinceLastPoop: 0,
    // P11-A: Cosmetic state fields
    ownedCosmeticIds: [],
    equippedCosmetics: {},
    ...overrides,
  });

  afterEach(() => {
    resetRngProvider();
    resetTimeProvider();
  });

  it('should apply weight decay first, then sickness', () => {
    // Force successful sickness roll
    setRngProvider(() => 0.1);
    setTimeProvider(() => 1700000000000);

    const pet = createTestPet({ weight: 50 });
    const twoHoursMinutes = 120;

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: twoHoursMinutes,
      gameMode: 'classic',
      hungerWasZeroAtSave: true,
      poopWasUncleanedAtSave: false,
      currentTimestamp: 1700000000000,
    });

    // Weight decay: -2
    expect(result.weightChange).toBe(-2);
    expect(result.pet.weight).toBe(48);

    // Sickness triggered
    expect(result.becameSick).toBe(true);
    expect(result.pet.isSick).toBe(true);
  });

  it('should add care mistakes when sick during offline', () => {
    setTimeProvider(() => 1700000000000);

    // Pet was already sick
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: 1700000000000 - 5 * 60 * 60 * 1000, // Sick for 5 hours
    });
    const threeHoursMinutes = 180;

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: threeHoursMinutes,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false,
      currentTimestamp: 1700000000000,
    });

    // 3 hours offline = 3 care mistakes
    expect(result.careMistakesAdded).toBe(3);
  });

  it('should reset session counter at offline session start', () => {
    const pet = createTestPet({ offlineSickCareMistakesAccruedThisSession: 2 });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 60,
      gameMode: 'classic',
      hungerWasZeroAtSave: false,
      poopWasUncleanedAtSave: false,
    });

    // Session counter starts fresh (reset at session boundary)
    // If not sick, no new mistakes added
    expect(result.pet.offlineSickCareMistakesAccruedThisSession).toBe(0);
  });

  it('should NOT process sickness triggers if already sick', () => {
    setRngProvider(() => 0.1); // Would succeed if called

    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: Date.now(),
      hungerZeroMinutesAccum: 0,
    });

    const result = applyOfflineOrderToPet({
      pet,
      offlineMinutes: 120,
      gameMode: 'classic',
      hungerWasZeroAtSave: true,
      poopWasUncleanedAtSave: false,
    });

    // becameSick should be false (was already sick)
    expect(result.becameSick).toBe(false);
    // Accumulators should NOT have been updated (already sick)
    // Note: This depends on implementation - currently it only runs triggers if not sick
  });
});

// ============================================
// P10-B-007: Timer Accumulator Behavior
// Bible v1.8 §9.4.7.2: Timer resets after roll
// ============================================

describe('P10-B-007: Timer Accumulator Behavior', () => {
  afterEach(() => {
    resetRngProvider();
  });

  it('should reset timer after successful roll', () => {
    setRngProvider(() => 0.1); // Will succeed

    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false,
      10, // currentHungerAccum
      0,
      30 // Total 40 > 30 threshold
    );

    expect(result.becameSick).toBe(true);
    expect(result.newHungerZeroMinutesAccum).toBe(0); // Reset after roll
  });

  it('should reset timer after failed roll', () => {
    setRngProvider(() => 0.9); // Will fail

    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false,
      10, // currentHungerAccum
      0,
      30 // Total 40 > 30 threshold
    );

    expect(result.becameSick).toBe(false);
    expect(result.newHungerZeroMinutesAccum).toBe(0); // Reset after roll (even on fail)
  });

  it('should preserve accumulator if threshold not met', () => {
    const result = evaluateSicknessTriggers(
      true, // hungerAtSave
      false,
      10, // currentHungerAccum
      0,
      15 // Total 25 < 30 threshold
    );

    expect(result.becameSick).toBe(false);
    expect(result.newHungerZeroMinutesAccum).toBe(25); // Accumulated, not reset
  });
});
