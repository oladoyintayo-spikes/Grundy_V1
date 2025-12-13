/**
 * BCT-P10E: Recovery Flows Tests
 *
 * Bible v1.8 §9.4.7.4, §11.5 — Medicine, Diet Food, Ad Recovery
 *
 * Covers:
 * - Medicine (Classic only): cures sickness, consumes inventory
 * - Diet Food: -20 weight, +5 hunger, consumes inventory
 * - Ad Recovery: Web Edition no-op stub
 * - Mode guards, inventory guards, edge cases
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  RECOVERY_EFFECTS,
  DIET_FOOD_THRESHOLD,
  AD_RECOVERY,
} from '../constants/bible.constants';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Reset store and complete FTUE with specified mode.
 */
function setupStore(mode: 'cozy' | 'classic' = 'classic') {
  useGameStore.getState().resetGame();
  const store = useGameStore.getState();
  store.startFtue();
  store.selectFtuePet('munchlet');
  store.selectPlayMode(mode);
  store.completeFtue();
  return useGameStore.getState();
}

/**
 * Get fresh store state.
 */
function getStore() {
  return useGameStore.getState();
}

/**
 * Make a pet sick (for testing medicine).
 */
function makePetSick(petId: string) {
  useGameStore.setState((state) => ({
    petsById: {
      ...state.petsById,
      [petId]: {
        ...state.petsById[petId],
        isSick: true,
        sickStartTimestamp: Date.now(),
      },
    },
  }));
}

/**
 * Set pet weight to a specific value.
 */
function setPetWeight(petId: string, weight: number) {
  useGameStore.setState((state) => ({
    petsById: {
      ...state.petsById,
      [petId]: {
        ...state.petsById[petId],
        weight,
      },
    },
  }));
}

/**
 * Set pet hunger to a specific value.
 */
function setPetHunger(petId: string, hunger: number) {
  useGameStore.setState((state) => ({
    petsById: {
      ...state.petsById,
      [petId]: {
        ...state.petsById[petId],
        hunger,
      },
    },
  }));
}

/**
 * Add item to inventory.
 */
function addToInventory(itemId: string, quantity: number) {
  useGameStore.setState((state) => ({
    inventory: {
      ...state.inventory,
      [itemId]: (state.inventory[itemId] || 0) + quantity,
    },
  }));
}

// ============================================================================
// CONSTANTS VERIFICATION
// ============================================================================

describe('BCT-P10E: Recovery Constants', () => {
  it('BCT-P10E-001: RECOVERY_EFFECTS.DIET_FOOD matches Bible §11.5', () => {
    // Bible: Diet Food 🥗 | -20 weight, +5 hunger | 30🪙
    expect(RECOVERY_EFFECTS.DIET_FOOD.WEIGHT_REDUCTION).toBe(20);
    expect(RECOVERY_EFFECTS.DIET_FOOD.HUNGER_GAIN).toBe(5);
  });

  it('BCT-P10E-002: DIET_FOOD_THRESHOLD matches Bible (Chubby+ = 31)', () => {
    // Bible §11.5: Diet Food visible when weight >= Chubby (31+)
    expect(DIET_FOOD_THRESHOLD).toBe(31);
  });

  it('BCT-P10E-003: AD_RECOVERY.WEB_ENABLED is false', () => {
    // Bible §9.4.7.4: Ads are [Unity Later] - disabled on Web
    expect(AD_RECOVERY.WEB_ENABLED).toBe(false);
  });

  it('BCT-P10E-004: AD_RECOVERY.COOLDOWN_HOURS matches Bible (24 hours)', () => {
    // Bible §9.4.7.4: Watch Ad | Free | Once per 24 hours
    expect(AD_RECOVERY.COOLDOWN_HOURS).toBe(24);
  });
});

// ============================================================================
// MEDICINE TESTS (Classic Only)
// ============================================================================

describe('BCT-P10E: Medicine (Classic Only)', () => {
  beforeEach(() => {
    setupStore('classic');
  });

  it('BCT-P10E-005: Classic + sick pet + has medicine → cures pet', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);
    addToInventory('care_medicine', 1);

    const petBefore = getStore().petsById[petId];
    expect(petBefore.isSick).toBe(true);
    expect(petBefore.sickStartTimestamp).not.toBeNull();

    const result = getStore().useMedicine(petId);

    expect(result.success).toBe(true);
    const petAfter = getStore().petsById[petId];
    expect(petAfter.isSick).toBe(false);
    expect(petAfter.sickStartTimestamp).toBeNull();
  });

  it('BCT-P10E-006: Classic + sick pet + has medicine → decrements inventory by 1', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);
    addToInventory('care_medicine', 3);

    expect(getStore().inventory['care_medicine']).toBe(3);

    getStore().useMedicine(petId);

    expect(getStore().inventory['care_medicine']).toBe(2);
  });

  it('BCT-P10E-007: Classic + sick pet + NO medicine → returns failure, pet stays sick', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);
    // No medicine in inventory

    const result = getStore().useMedicine(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NO_ITEM');
    expect(getStore().petsById[petId].isSick).toBe(true);
  });

  it('BCT-P10E-008: Classic + healthy pet + has medicine → returns failure, inventory unchanged', () => {
    const petId = 'munchlet-starter';
    // Pet is not sick (default)
    addToInventory('care_medicine', 2);

    const result = getStore().useMedicine(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NOT_SICK');
    expect(getStore().inventory['care_medicine']).toBe(2);
  });

  it('BCT-P10E-009: Cozy + sick pet (edge case) → returns failure, no state change', () => {
    // Setup Cozy mode
    setupStore('cozy');
    const petId = 'munchlet-starter';
    // Force sick state (edge case: mode switch or bad save)
    makePetSick(petId);
    addToInventory('care_medicine', 1);

    const result = getStore().useMedicine(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('COZY_MODE');
    // Inventory unchanged
    expect(getStore().inventory['care_medicine']).toBe(1);
    // Pet still sick (not cured in Cozy)
    expect(getStore().petsById[petId].isSick).toBe(true);
  });
});

// ============================================================================
// DIET FOOD TESTS
// ============================================================================

describe('BCT-P10E: Diet Food', () => {
  beforeEach(() => {
    setupStore('classic');
  });

  it('BCT-P10E-010: Pet with weight 50 + has diet food → weight reduced by 20', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    addToInventory('care_diet_food', 1);

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(true);
    expect(getStore().petsById[petId].weight).toBe(30);
  });

  it('BCT-P10E-011: Pet with low weight + has diet food → weight floors at 0', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 10);
    addToInventory('care_diet_food', 1);

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(true);
    // 10 - 20 = -10, but floors at 0
    expect(getStore().petsById[petId].weight).toBe(0);
  });

  it('BCT-P10E-012: Diet food adds +5 hunger per Bible §11.5', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    setPetHunger(petId, 40);
    addToInventory('care_diet_food', 1);

    getStore().useDietFood(petId);

    expect(getStore().petsById[petId].hunger).toBe(45);
  });

  it('BCT-P10E-013: Diet food hunger caps at 100 (no overflow)', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    setPetHunger(petId, 98);
    addToInventory('care_diet_food', 1);

    getStore().useDietFood(petId);

    // 98 + 5 = 103, but caps at 100
    expect(getStore().petsById[petId].hunger).toBe(100);
  });

  it('BCT-P10E-014: Diet food → decrements inventory by 1', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    addToInventory('care_diet_food', 5);

    getStore().useDietFood(petId);

    expect(getStore().inventory['care_diet_food']).toBe(4);
  });

  it('BCT-P10E-015: Pet + NO diet food → returns failure, weight unchanged', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    // No diet food in inventory

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NO_ITEM');
    expect(getStore().petsById[petId].weight).toBe(50);
  });

  it('BCT-P10E-016: Diet food works in Classic mode', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 60);
    addToInventory('care_diet_food', 1);

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(true);
    expect(getStore().petsById[petId].weight).toBe(40);
  });

  it('BCT-P10E-017: Diet food works in Cozy mode', () => {
    setupStore('cozy');
    const petId = 'munchlet-starter';
    setPetWeight(petId, 60);
    addToInventory('care_diet_food', 1);

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(true);
    expect(getStore().petsById[petId].weight).toBe(40);
  });
});

// ============================================================================
// AD RECOVERY STUB TESTS
// ============================================================================

describe('BCT-P10E: Ad Recovery Stub', () => {
  beforeEach(() => {
    setupStore('classic');
  });

  it('BCT-P10E-018: Ad recovery returns WEB_ADS_DISABLED', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);

    const result = getStore().useAdRecovery(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('WEB_ADS_DISABLED');
  });

  it('BCT-P10E-019: Ad recovery does NOT modify any game state', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);

    const stateBefore = JSON.stringify(getStore().petsById[petId]);
    const inventoryBefore = JSON.stringify(getStore().inventory);

    getStore().useAdRecovery(petId);

    const stateAfter = JSON.stringify(getStore().petsById[petId]);
    const inventoryAfter = JSON.stringify(getStore().inventory);

    expect(stateAfter).toBe(stateBefore);
    expect(inventoryAfter).toBe(inventoryBefore);
  });

  it('BCT-P10E-020: Ad recovery does NOT set any timestamps', () => {
    const petId = 'munchlet-starter';

    // Check that no ad-related timestamp fields exist (future-proofing)
    getStore().useAdRecovery(petId);

    const pet = getStore().petsById[petId];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((pet as any).lastAdRecoveryTimestamp).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((pet as any).adCooldownUntil).toBeUndefined();
  });
});

// ============================================================================
// REGRESSION GUARDS
// ============================================================================

describe('BCT-P10E: Regression Guards', () => {
  beforeEach(() => {
    setupStore('classic');
  });

  it('BCT-P10E-021: Medicine does not affect other pet stats', () => {
    const petId = 'munchlet-starter';
    makePetSick(petId);
    setPetWeight(petId, 50);
    setPetHunger(petId, 60);
    addToInventory('care_medicine', 1);

    const petBefore = getStore().petsById[petId];
    const moodBefore = petBefore.moodValue;
    const bondBefore = petBefore.bond;

    getStore().useMedicine(petId);

    const petAfter = getStore().petsById[petId];
    expect(petAfter.weight).toBe(50); // Unchanged
    expect(petAfter.hunger).toBe(60); // Unchanged
    expect(petAfter.moodValue).toBe(moodBefore); // Unchanged
    expect(petAfter.bond).toBe(bondBefore); // Unchanged
  });

  it('BCT-P10E-022: Diet food does not affect other pet stats', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    setPetHunger(petId, 40);
    addToInventory('care_diet_food', 1);

    const petBefore = getStore().petsById[petId];
    const moodBefore = petBefore.moodValue;
    const bondBefore = petBefore.bond;
    const isSickBefore = petBefore.isSick;

    getStore().useDietFood(petId);

    const petAfter = getStore().petsById[petId];
    expect(petAfter.moodValue).toBe(moodBefore); // Unchanged
    expect(petAfter.bond).toBe(bondBefore); // Unchanged
    expect(petAfter.isSick).toBe(isSickBefore); // Unchanged
  });

  it('BCT-P10E-023: Recovery actions are deterministic (no RNG)', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    setPetHunger(petId, 40);
    addToInventory('care_diet_food', 10);

    // Run 5 times and verify consistent results
    for (let i = 0; i < 5; i++) {
      setPetWeight(petId, 50);
      setPetHunger(petId, 40);

      getStore().useDietFood(petId);

      expect(getStore().petsById[petId].weight).toBe(30);
      expect(getStore().petsById[petId].hunger).toBe(45);
    }
  });

  it('BCT-P10E-024: Recovery actions check inventory BEFORE applying effect', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 50);
    // Zero diet food in inventory

    const result = getStore().useDietFood(petId);

    expect(result.success).toBe(false);
    // Inventory should not go negative (undefined or 0 both mean "no items")
    expect(getStore().inventory['care_diet_food'] ?? 0).toBe(0);
    // Weight should be unchanged
    expect(getStore().petsById[petId].weight).toBe(50);
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe('BCT-P10E: Edge Cases', () => {
  beforeEach(() => {
    setupStore('classic');
  });

  it('BCT-P10E-025: Multiple diet food uses drain inventory correctly', () => {
    const petId = 'munchlet-starter';
    setPetWeight(petId, 100);
    addToInventory('care_diet_food', 3);

    getStore().useDietFood(petId);
    expect(getStore().inventory['care_diet_food']).toBe(2);
    expect(getStore().petsById[petId].weight).toBe(80);

    getStore().useDietFood(petId);
    expect(getStore().inventory['care_diet_food']).toBe(1);
    expect(getStore().petsById[petId].weight).toBe(60);

    getStore().useDietFood(petId);
    expect(getStore().inventory['care_diet_food']).toBe(0);
    expect(getStore().petsById[petId].weight).toBe(40);

    // Fourth attempt should fail
    const result = getStore().useDietFood(petId);
    expect(result.success).toBe(false);
    expect(result.reason).toBe('NO_ITEM');
  });

  it('BCT-P10E-026: Using medicine when already healthy fails gracefully', () => {
    const petId = 'munchlet-starter';
    // Pet starts healthy
    addToInventory('care_medicine', 5);

    const result = getStore().useMedicine(petId);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NOT_SICK');
    // Inventory unchanged
    expect(getStore().inventory['care_medicine']).toBe(5);
  });

  it('BCT-P10E-027: Invalid pet ID returns failure for medicine', () => {
    addToInventory('care_medicine', 1);

    const result = getStore().useMedicine('invalid-pet-id' as any);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NO_ITEM');
  });

  it('BCT-P10E-028: Invalid pet ID returns failure for diet food', () => {
    addToInventory('care_diet_food', 1);

    const result = getStore().useDietFood('invalid-pet-id' as any);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('NO_ITEM');
  });
});
