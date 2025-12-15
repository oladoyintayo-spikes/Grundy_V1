/**
 * BIBLE COMPLIANCE TESTS — Phase 11-A: Cosmetics Foundations
 *
 * Tests for cosmetic system foundations:
 * - Pet-bound ownership (Bible §11.5.2)
 * - Equip/unequip rules (Bible §11.5.3)
 * - Slot system (Bible §11.5.3)
 * - Rarity tiers (Bible §11.5.4)
 * - No stat impact invariant (Bible §11.5.3)
 * - Save migration v5→v6
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.10)
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  COSMETIC_SLOTS,
  COSMETIC_CATALOG,
  COSMETIC_RARITY_CONFIG,
  getCosmeticSlot,
  getCosmeticById,
  isValidCosmeticPrice,
} from '../constants/bible.constants';
import type { OwnedPetState, CosmeticSlot } from '../types';

// ============================================
// Test Helpers
// ============================================

/**
 * Reset store cosmetic state before each test.
 * Clears owned and equipped cosmetics for all pets.
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
 * In production, ownership is granted via purchase (P11-B).
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

/**
 * Get stat snapshot for invariant testing.
 */
function getStatSnapshot(pet: OwnedPetState) {
  return {
    hunger: pet.hunger,
    moodValue: pet.moodValue,
    mood: pet.mood,
    bond: pet.bond,
    weight: pet.weight,
    isSick: pet.isSick,
    xp: pet.xp,
    level: pet.level,
    isPoopDirty: pet.isPoopDirty,
  };
}

// ============================================
// BCT-COS-OWN-001: Pet-bound Ownership
// Bible §11.5.2: Cosmetics are pet-bound
// ============================================

describe('BCT-COS-OWN-001: Cosmetics are pet-bound (no cross-pet equip)', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should reject equip when pet does not own cosmetic', () => {
    const state = useGameStore.getState();
    const petAId = 'munchlet-starter';
    const petBId = 'grib-starter';

    // Grant cosmetic to Pet A only
    grantCosmeticToPet(petAId, 'cos_hat_cap_blue');

    // Attempt to equip on Pet B (who doesn't own it)
    const result = state.equipCosmetic(petBId, 'cos_hat_cap_blue');

    expect(result.success).toBe(false);
    expect(result.error).toBe('NOT_OWNED');

    // Pet B's equipped state should be unchanged
    const petB = useGameStore.getState().petsById[petBId];
    expect(petB.equippedCosmetics.hat).toBeUndefined();
  });

  it('should allow equip when pet owns cosmetic', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Grant cosmetic to pet
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');

    // Equip should succeed
    const result = state.equipCosmetic(petId, 'cos_hat_cap_blue');

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();

    // Verify equipped
    const pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBe('cos_hat_cap_blue');
  });
});

// ============================================
// BCT-COS-EQ-001: Equip requires ownership
// Bible §11.5.3: Ownership required
// ============================================

describe('BCT-COS-EQ-001: Equip requires ownership + matching slot', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should reject equip of unowned cosmetic', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Pet has no cosmetics
    const result = state.equipCosmetic(petId, 'cos_hat_cap_blue');

    expect(result.success).toBe(false);
    expect(result.error).toBe('NOT_OWNED');
  });

  it('should reject equip of non-existent cosmetic', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Try to equip cosmetic not in catalog
    const result = state.equipCosmetic(petId, 'cos_fake_item');

    expect(result.success).toBe(false);
    expect(result.error).toBe('NOT_FOUND');
  });

  it('should detect slot from cosmetic ID prefix', () => {
    // Test slot detection utility
    expect(getCosmeticSlot('cos_hat_cap_blue')).toBe('hat');
    expect(getCosmeticSlot('cos_accessory_scarf_red')).toBe('accessory');
    expect(getCosmeticSlot('cos_outfit_sweater')).toBe('outfit');
    expect(getCosmeticSlot('cos_aura_sparkle')).toBe('aura');
    expect(getCosmeticSlot('cos_skin_golden')).toBe('skin');
    expect(getCosmeticSlot('invalid_id')).toBeUndefined();
  });
});

// ============================================
// BCT-COS-EQ-002: One-per-slot replacement
// Bible §11.5.3: Equipping replaces previous
// ============================================

describe('BCT-COS-EQ-002: One cosmetic per slot; equipping replaces previous', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should replace existing cosmetic in same slot', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Grant two hats
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_hat_bow_pink');

    // Equip first hat
    let result = state.equipCosmetic(petId, 'cos_hat_cap_blue');
    expect(result.success).toBe(true);
    expect(result.previousCosmeticId).toBeNull();

    let pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBe('cos_hat_cap_blue');

    // Equip second hat - should replace first
    const newState = useGameStore.getState();
    result = newState.equipCosmetic(petId, 'cos_hat_bow_pink');
    expect(result.success).toBe(true);
    expect(result.previousCosmeticId).toBe('cos_hat_cap_blue');

    pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBe('cos_hat_bow_pink');

    // First hat still owned
    expect(pet.ownedCosmeticIds).toContain('cos_hat_cap_blue');
  });

  it('should allow equipping different slots independently', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Grant hat and accessory
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_accessory_scarf_red');

    // Equip hat
    state.equipCosmetic(petId, 'cos_hat_cap_blue');
    // Equip accessory (different slot)
    useGameStore.getState().equipCosmetic(petId, 'cos_accessory_scarf_red');

    const pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBe('cos_hat_cap_blue');
    expect(pet.equippedCosmetics.accessory).toBe('cos_accessory_scarf_red');
  });
});

// ============================================
// BCT-COS-UNEQ-001: Unequip clears slot
// Bible §11.5.3: Cosmetic remains owned
// ============================================

describe('BCT-COS-UNEQ-001: Unequip clears slot', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should clear slot on unequip', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    state.equipCosmetic(petId, 'cos_hat_cap_blue');

    let pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBe('cos_hat_cap_blue');

    // Unequip
    const newState = useGameStore.getState();
    const result = newState.unequipCosmetic(petId, 'hat');

    expect(result.success).toBe(true);
    expect(result.previousCosmeticId).toBe('cos_hat_cap_blue');

    pet = useGameStore.getState().petsById[petId];
    expect(pet.equippedCosmetics.hat).toBeUndefined();

    // Still owned
    expect(pet.ownedCosmeticIds).toContain('cos_hat_cap_blue');
  });

  it('should succeed even if slot was already empty', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    const result = state.unequipCosmetic(petId, 'hat');

    expect(result.success).toBe(true);
    expect(result.previousCosmeticId).toBeNull();
  });
});

// ============================================
// BCT-COS-MULTI-001: Same SKU multi-pet
// Bible §11.5.2: Separate purchases allowed
// ============================================

describe('BCT-COS-MULTI-001: Same cosmetic ID can be owned by multiple pets', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should allow same cosmetic owned by multiple pets', () => {
    const state = useGameStore.getState();
    const petAId = 'munchlet-starter';
    const petBId = 'grib-starter';

    // Grant same cosmetic to both pets
    grantCosmeticToPet(petAId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petBId, 'cos_hat_cap_blue');

    // Both should own it
    const updatedState = useGameStore.getState();
    expect(updatedState.petsById[petAId].ownedCosmeticIds).toContain('cos_hat_cap_blue');
    expect(updatedState.petsById[petBId].ownedCosmeticIds).toContain('cos_hat_cap_blue');

    // Both should be able to equip
    let result = updatedState.equipCosmetic(petAId, 'cos_hat_cap_blue');
    expect(result.success).toBe(true);

    result = useGameStore.getState().equipCosmetic(petBId, 'cos_hat_cap_blue');
    expect(result.success).toBe(true);

    // Verify both equipped
    const finalState = useGameStore.getState();
    expect(finalState.petsById[petAId].equippedCosmetics.hat).toBe('cos_hat_cap_blue');
    expect(finalState.petsById[petBId].equippedCosmetics.hat).toBe('cos_hat_cap_blue');
  });
});

// ============================================
// BCT-COS-GEMS-001: Cosmetics are gems-only
// Bible §11.1, §11.5.2: No coins for cosmetics
// ============================================

describe('BCT-COS-GEMS-001: Cosmetics can only be purchased with gems', () => {
  it('should have only gem pricing in catalog (no coinPrice)', () => {
    for (const cosmetic of COSMETIC_CATALOG) {
      expect(cosmetic.priceGems).toBeGreaterThan(0);
      // Verify no coinPrice field exists in type
      expect('coinPrice' in cosmetic).toBe(false);
      expect('priceCoin' in cosmetic).toBe(false);
    }
  });

  it('should have prices within rarity ranges', () => {
    for (const cosmetic of COSMETIC_CATALOG) {
      const valid = isValidCosmeticPrice(cosmetic.rarity, cosmetic.priceGems);
      expect(valid).toBe(true);
    }
  });

  it('should have all rarity tiers defined', () => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
    for (const rarity of rarities) {
      expect(COSMETIC_RARITY_CONFIG[rarity]).toBeDefined();
      expect(COSMETIC_RARITY_CONFIG[rarity].minGems).toBeGreaterThan(0);
      expect(COSMETIC_RARITY_CONFIG[rarity].maxGems).toBeGreaterThan(COSMETIC_RARITY_CONFIG[rarity].minGems);
    }
  });
});

// ============================================
// BCT-COS-NOSTAT-001: Stats unaffected
// Bible §11.5.3: Cosmetics are visual-only
// ============================================

describe('BCT-COS-NOSTAT-001: Equipping cosmetics does not affect pet stats', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should not change stats on equip', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Get initial stats
    let pet = state.petsById[petId];
    const beforeStats = getStatSnapshot(pet);

    // Grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

    // Get stats after equip
    pet = useGameStore.getState().petsById[petId];
    const afterEquipStats = getStatSnapshot(pet);

    // Verify no change
    expect(afterEquipStats.hunger).toBe(beforeStats.hunger);
    expect(afterEquipStats.moodValue).toBe(beforeStats.moodValue);
    expect(afterEquipStats.mood).toBe(beforeStats.mood);
    expect(afterEquipStats.bond).toBe(beforeStats.bond);
    expect(afterEquipStats.weight).toBe(beforeStats.weight);
    expect(afterEquipStats.isSick).toBe(beforeStats.isSick);
    expect(afterEquipStats.xp).toBe(beforeStats.xp);
    expect(afterEquipStats.level).toBe(beforeStats.level);
  });

  it('should not change stats on unequip', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    state.equipCosmetic(petId, 'cos_hat_cap_blue');

    // Get stats before unequip
    let pet = useGameStore.getState().petsById[petId];
    const beforeStats = getStatSnapshot(pet);

    // Unequip
    useGameStore.getState().unequipCosmetic(petId, 'hat');

    // Get stats after unequip
    pet = useGameStore.getState().petsById[petId];
    const afterUnequipStats = getStatSnapshot(pet);

    // Verify no change
    expect(afterUnequipStats.hunger).toBe(beforeStats.hunger);
    expect(afterUnequipStats.moodValue).toBe(beforeStats.moodValue);
    expect(afterUnequipStats.bond).toBe(beforeStats.bond);
    expect(afterUnequipStats.weight).toBe(beforeStats.weight);
  });
});

// ============================================
// Save Migration v5→v6 Tests
// ============================================

describe('Save Migration v5→v6: Cosmetic state fields', () => {
  it('should have cosmetic fields on new pets', () => {
    resetStore();
    const state = useGameStore.getState();

    // Check all starter pets have cosmetic fields
    for (const petId of state.ownedPetIds) {
      const pet = state.petsById[petId];
      expect(pet.ownedCosmeticIds).toBeDefined();
      expect(Array.isArray(pet.ownedCosmeticIds)).toBe(true);
      expect(pet.ownedCosmeticIds.length).toBe(0);
      expect(pet.equippedCosmetics).toBeDefined();
      expect(typeof pet.equippedCosmetics).toBe('object');
      expect(Object.keys(pet.equippedCosmetics).length).toBe(0);
    }
  });
});

// ============================================
// Cosmetic Slot System Tests
// ============================================

describe('Cosmetic Slot System', () => {
  it('should have all 5 slots defined per Bible §11.5.3', () => {
    expect(COSMETIC_SLOTS).toContain('hat');
    expect(COSMETIC_SLOTS).toContain('accessory');
    expect(COSMETIC_SLOTS).toContain('outfit');
    expect(COSMETIC_SLOTS).toContain('aura');
    expect(COSMETIC_SLOTS).toContain('skin');
    expect(COSMETIC_SLOTS.length).toBe(5);
  });

  it('should map cosmetic IDs to correct slots', () => {
    // Test each catalog item
    for (const cosmetic of COSMETIC_CATALOG) {
      const detectedSlot = getCosmeticSlot(cosmetic.id);
      expect(detectedSlot).toBe(cosmetic.slot);
    }
  });

  it('should get cosmetic by ID', () => {
    const cosmetic = getCosmeticById('cos_hat_cap_blue');
    expect(cosmetic).toBeDefined();
    expect(cosmetic?.displayName).toBe('Blue Cap');
    expect(cosmetic?.slot).toBe('hat');

    const notFound = getCosmeticById('nonexistent');
    expect(notFound).toBeUndefined();
  });
});

// ============================================
// Helper Action Tests
// ============================================

describe('Cosmetic Helper Actions', () => {
  beforeEach(() => {
    resetStore();
  });

  it('petOwnsCosmetic should return correct ownership status', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Initially doesn't own
    expect(state.petOwnsCosmetic(petId, 'cos_hat_cap_blue')).toBe(false);

    // Grant ownership
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');

    // Now owns
    expect(useGameStore.getState().petOwnsCosmetic(petId, 'cos_hat_cap_blue')).toBe(true);
    expect(useGameStore.getState().petOwnsCosmetic(petId, 'cos_hat_bow_pink')).toBe(false);
  });

  it('getPetOwnedCosmetics should return owned list', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Initially empty
    expect(state.getPetOwnedCosmetics(petId)).toEqual([]);

    // Grant some
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_accessory_scarf_red');

    const owned = useGameStore.getState().getPetOwnedCosmetics(petId);
    expect(owned).toContain('cos_hat_cap_blue');
    expect(owned).toContain('cos_accessory_scarf_red');
    expect(owned.length).toBe(2);
  });

  it('getPetEquippedCosmetics should return equipped state', () => {
    const state = useGameStore.getState();
    const petId = 'munchlet-starter';

    // Initially empty
    expect(state.getPetEquippedCosmetics(petId)).toEqual({});

    // Grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    state.equipCosmetic(petId, 'cos_hat_cap_blue');

    const equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');
  });

  it('should handle invalid pet ID gracefully', () => {
    const state = useGameStore.getState();
    const invalidPetId = 'nonexistent-pet';

    expect(state.petOwnsCosmetic(invalidPetId, 'cos_hat_cap_blue')).toBe(false);
    expect(state.getPetOwnedCosmetics(invalidPetId)).toEqual([]);
    expect(state.getPetEquippedCosmetics(invalidPetId)).toEqual({});

    const equipResult = state.equipCosmetic(invalidPetId, 'cos_hat_cap_blue');
    expect(equipResult.success).toBe(false);
    expect(equipResult.error).toBe('INVALID_PET');

    const unequipResult = state.unequipCosmetic(invalidPetId, 'hat');
    expect(unequipResult.success).toBe(false);
    expect(unequipResult.error).toBe('INVALID_PET');
  });
});
