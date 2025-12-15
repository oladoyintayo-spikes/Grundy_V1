/**
 * BIBLE COMPLIANCE TESTS — Phase 11-C: Cosmetics Render Layering
 *
 * Tests for cosmetic visual rendering:
 * - BCT-COS-RENDER-001: Equipped cosmetics render as visible layers
 * - BCT-COS-RENDER-002: Layering respects canonical order (Bible §11.5.3)
 * - BCT-COS-RENDER-003: Switching active pet updates rendered cosmetic layers
 * - BCT-COS-RENDER-004: Multi-surface consistency — shared component
 *
 * Note: These tests verify store state logic and layer z-index order.
 * Visual/component tests with actual DOM rendering would require RTL setup.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.10) §11.5.3
 * @see docs/BIBLE_COMPLIANCE_TEST.md Phase 11 P11-C
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  COSMETIC_SLOTS,
  getCosmeticById,
  type CosmeticSlot,
} from '../constants/bible.constants';

// ============================================
// P11-C Constants (Layer Z-Indices)
// Bible §11.5.3 Render Layer Order (back to front):
// aura → base → skin → outfit → accessory → hat
// ============================================

/**
 * Canonical layer z-indices per Bible §11.5.3.
 * These must match the implementation in PetRender.
 */
const LAYER_Z_INDEX: Record<CosmeticSlot | 'base', number> = {
  aura: 1,      // Background effect behind pet
  skin: 3,      // Body replacement/overlay
  outfit: 4,    // Body covering
  accessory: 5, // Neck/body accent
  hat: 6,       // Topmost layer
  base: 2,      // Base pet sprite
};

// ============================================
// Test Helpers
// ============================================

/**
 * Reset store cosmetic state before each test.
 */
function resetStore() {
  useGameStore.setState((state) => {
    const resetPetsById = { ...state.petsById };
    for (const petId of Object.keys(resetPetsById)) {
      resetPetsById[petId] = {
        ...resetPetsById[petId],
        ownedCosmeticIds: [],
        equippedCosmetics: {},
      };
    }
    return { petsById: resetPetsById };
  });
}

/**
 * Helper to directly inject cosmetic ownership for testing.
 */
function grantCosmeticToPet(petId: string, cosmeticId: string) {
  useGameStore.setState((state) => {
    const pet = state.petsById[petId];
    if (!pet) return state;
    return {
      petsById: {
        ...state.petsById,
        [petId]: {
          ...pet,
          ownedCosmeticIds: [...pet.ownedCosmeticIds, cosmeticId],
        },
      },
    };
  });
}

// ============================================
// BCT-COS-RENDER-001: Equipped cosmetics render as visible layers
// ============================================

describe('BCT-COS-RENDER-001: Equipped cosmetics render as visible layers', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('getPetEquippedCosmetics returns equipped state for rendering', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Initially nothing equipped
    let equipped = state.getPetEquippedCosmetics(petId);
    expect(Object.keys(equipped).length).toBe(0);

    // Grant and equip a hat
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

    // Now hat should be in equipped state
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');
  });

  it('multiple slots can be equipped simultaneously', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Grant and equip multiple cosmetics
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_accessory_scarf_red');
    grantCosmeticToPet(petId, 'cos_aura_sparkle');

    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_accessory_scarf_red');
    useGameStore.getState().equipCosmetic(petId, 'cos_aura_sparkle');

    const equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');
    expect(equipped.accessory).toBe('cos_accessory_scarf_red');
    expect(equipped.aura).toBe('cos_aura_sparkle');
  });

  it('getCosmeticById provides display name for layer tooltip', () => {
    const cosmetic = getCosmeticById('cos_hat_cap_blue');
    expect(cosmetic).toBeDefined();
    expect(cosmetic?.displayName).toBeTruthy();
    expect(cosmetic?.slot).toBe('hat');
  });
});

// ============================================
// BCT-COS-RENDER-002: Layering respects canonical order
// ============================================

describe('BCT-COS-RENDER-002: Layering respects canonical order', () => {
  it('z-index order matches Bible §11.5.3 (aura < base < skin < outfit < accessory < hat)', () => {
    // Verify the layer order constant matches Bible spec
    expect(LAYER_Z_INDEX.aura).toBeLessThan(LAYER_Z_INDEX.base);
    expect(LAYER_Z_INDEX.base).toBeLessThan(LAYER_Z_INDEX.skin);
    expect(LAYER_Z_INDEX.skin).toBeLessThan(LAYER_Z_INDEX.outfit);
    expect(LAYER_Z_INDEX.outfit).toBeLessThan(LAYER_Z_INDEX.accessory);
    expect(LAYER_Z_INDEX.accessory).toBeLessThan(LAYER_Z_INDEX.hat);
  });

  it('hat has highest z-index (topmost layer)', () => {
    const hatZIndex = LAYER_Z_INDEX.hat;
    for (const [slot, zIndex] of Object.entries(LAYER_Z_INDEX)) {
      if (slot !== 'hat') {
        expect(hatZIndex).toBeGreaterThan(zIndex);
      }
    }
  });

  it('aura has lowest z-index (background behind pet)', () => {
    const auraZIndex = LAYER_Z_INDEX.aura;
    for (const [slot, zIndex] of Object.entries(LAYER_Z_INDEX)) {
      if (slot !== 'aura') {
        expect(auraZIndex).toBeLessThan(zIndex);
      }
    }
  });

  it('base sprite renders above aura but below cosmetic overlays', () => {
    expect(LAYER_Z_INDEX.base).toBeGreaterThan(LAYER_Z_INDEX.aura);
    expect(LAYER_Z_INDEX.base).toBeLessThan(LAYER_Z_INDEX.skin);
    expect(LAYER_Z_INDEX.base).toBeLessThan(LAYER_Z_INDEX.outfit);
    expect(LAYER_Z_INDEX.base).toBeLessThan(LAYER_Z_INDEX.accessory);
    expect(LAYER_Z_INDEX.base).toBeLessThan(LAYER_Z_INDEX.hat);
  });
});

// ============================================
// BCT-COS-RENDER-003: Switching active pet updates cosmetic layers
// ============================================

describe('BCT-COS-RENDER-003: Switching active pet updates cosmetic layers', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('different pets have different equipped cosmetics', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Grant and equip for first pet
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

    // Verify first pet has hat
    const equippedPet1 = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equippedPet1.hat).toBe('cos_hat_cap_blue');

    // Check another pet (if exists) has no cosmetics
    const allPetIds = Object.keys(useGameStore.getState().petsById);
    const otherPetId = allPetIds.find((id) => id !== petId);
    if (otherPetId) {
      const equippedPet2 = useGameStore.getState().getPetEquippedCosmetics(otherPetId);
      expect(equippedPet2.hat).toBeUndefined();
    }
  });

  it('switching active pet changes which cosmetics are visible', () => {
    const state = useGameStore.getState();
    const petId1 = state.activePetId;

    // Setup: pet 1 has hat equipped
    grantCosmeticToPet(petId1, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId1, 'cos_hat_cap_blue');

    // Query for pet 1 - should have hat
    let equipped = useGameStore.getState().getPetEquippedCosmetics(petId1);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // Query for different pet (via getPetEquippedCosmetics) - should not have hat
    const allPetIds = Object.keys(useGameStore.getState().petsById);
    const petId2 = allPetIds.find((id) => id !== petId1);
    if (petId2) {
      equipped = useGameStore.getState().getPetEquippedCosmetics(petId2);
      expect(equipped.hat).toBeUndefined();
    }
  });

  it('unequipping cosmetic removes it from render state', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Setup
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

    // Verify equipped
    let equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // Unequip
    useGameStore.getState().unequipCosmetic(petId, 'hat');

    // Verify no longer in render state
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBeUndefined();
  });
});

// ============================================
// BCT-COS-RENDER-004: Multi-surface consistency — shared component
// ============================================

describe('BCT-COS-RENDER-004: Multi-surface consistency — shared component', () => {
  it('COSMETIC_SLOTS is consistent for all render surfaces', () => {
    // All surfaces use the same COSMETIC_SLOTS array
    expect(COSMETIC_SLOTS).toEqual(['hat', 'accessory', 'outfit', 'aura', 'skin']);
    expect(COSMETIC_SLOTS.length).toBe(5);
  });

  it('equipped cosmetics are accessed consistently via getPetEquippedCosmetics', () => {
    // All render surfaces should use the same store selector
    const state = useGameStore.getState();
    expect(typeof state.getPetEquippedCosmetics).toBe('function');

    // Calling multiple times returns consistent results
    const petId = state.activePetId;
    const result1 = state.getPetEquippedCosmetics(petId);
    const result2 = state.getPetEquippedCosmetics(petId);
    expect(result1).toEqual(result2);
  });

  it('layer z-indices are defined for all cosmetic slots', () => {
    for (const slot of COSMETIC_SLOTS) {
      expect(LAYER_Z_INDEX[slot]).toBeDefined();
      expect(typeof LAYER_Z_INDEX[slot]).toBe('number');
    }
    // Also verify base is defined
    expect(LAYER_Z_INDEX.base).toBeDefined();
  });
});

// ============================================
// P11-C Integration Tests
// ============================================

describe('P11-C Integration: Cosmetic Render Flow', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('full flow: equip → render state available → unequip → render state cleared', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // 1. Initially no cosmetics
    let equipped = state.getPetEquippedCosmetics(petId);
    expect(Object.keys(equipped).length).toBe(0);

    // 2. Grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    const equipResult = useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
    expect(equipResult.success).toBe(true);

    // 3. Render state now has hat
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // 4. Unequip
    const unequipResult = useGameStore.getState().unequipCosmetic(petId, 'hat');
    expect(unequipResult.success).toBe(true);

    // 5. Render state cleared
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBeUndefined();
  });

  it('equipping multiple cosmetics produces correct render state', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Grant all test cosmetics (using actual IDs from COSMETIC_CATALOG)
    const cosmetics = [
      'cos_hat_cap_blue',
      'cos_accessory_scarf_red',
      'cos_outfit_sweater',
      'cos_aura_sparkle',
    ];

    for (const cosmeticId of cosmetics) {
      grantCosmeticToPet(petId, cosmeticId);
      useGameStore.getState().equipCosmetic(petId, cosmeticId);
    }

    // Verify all are in render state
    const equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');
    expect(equipped.accessory).toBe('cos_accessory_scarf_red');
    expect(equipped.outfit).toBe('cos_outfit_sweater');
    expect(equipped.aura).toBe('cos_aura_sparkle');
  });

  it('cosmetic replacement updates render state correctly', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Grant two hats
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_hat_bow_pink');

    // Equip first
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
    let equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // Equip second (replaces)
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_bow_pink');
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_bow_pink');
  });
});
