/**
 * BIBLE COMPLIANCE TESTS — Phase 11-D: Cosmetics Purchase Plumbing
 *
 * Tests for cosmetic purchase with gems (pet-bound ownership):
 * - Buy button shown for non-owned cosmetics (BCT-COS-BUY-001)
 * - Disabled button when insufficient gems (BCT-COS-BUY-002)
 * - Purchase deducts gems and grants pet-bound ownership (BCT-COS-BUY-003)
 * - No auto-equip after purchase (BCT-COS-BUY-004)
 *
 * Note: These tests verify store buyCosmetic action logic.
 * Visual/component tests would require RTL setup.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.10) §11.5.2
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  COSMETIC_CATALOG,
  getCosmeticById,
} from '../constants/bible.constants';

// ============================================
// Test Helpers
// ============================================

/**
 * Reset store cosmetic and gem state before each test.
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
    return {
      petsById: resetPetsById,
      currencies: {
        ...state.currencies,
        gems: 100, // Reset to 100 gems for testing
      },
    };
  });
}

/**
 * Set specific gem amount for testing.
 */
function setGems(amount: number) {
  useGameStore.setState((state) => ({
    currencies: {
      ...state.currencies,
      gems: amount,
    },
  }));
}

/**
 * Grant cosmetic ownership to a pet (for testing already-owned scenario).
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
// BCT-COS-BUY Tests (Cosmetics Purchase)
// ============================================

describe('BCT-COS-BUY: Cosmetics Purchase', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  // Test cosmetic for these tests (cheapest one)
  const testCosmetic = COSMETIC_CATALOG.find((c) => c.id === 'cos_acc_bowtie_red')
    || COSMETIC_CATALOG[0];

  describe('BCT-COS-BUY-001: Buy button shown for non-owned cosmetics', () => {
    it('buyCosmetic succeeds when pet does not own cosmetic and has sufficient gems', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      expect(petId).toBeTruthy();

      // Ensure sufficient gems
      setGems(testCosmetic.priceGems + 10);

      // Verify pet does not own cosmetic
      const ownedBefore = useGameStore.getState().getPetOwnedCosmetics(petId!);
      expect(ownedBefore).not.toContain(testCosmetic.id);

      // Execute purchase
      const result = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Should succeed
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.gemsSpent).toBe(testCosmetic.priceGems);
    });

    it('buyCosmetic returns gemsSpent and remainingGems on success', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 100;
      setGems(initialGems);

      const result = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      expect(result.success).toBe(true);
      expect(result.gemsSpent).toBe(testCosmetic.priceGems);
      expect(result.remainingGems).toBe(initialGems - testCosmetic.priceGems);
    });
  });

  describe('BCT-COS-BUY-002: Disabled button when insufficient gems', () => {
    it('buyCosmetic fails with INSUFFICIENT_GEMS when gems < priceGems', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      expect(petId).toBeTruthy();

      // Set gems below price
      setGems(testCosmetic.priceGems - 1);

      const result = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('INSUFFICIENT_GEMS');
      expect(result.gemsSpent).toBeUndefined();
    });

    it('buyCosmetic fails with INSUFFICIENT_GEMS when gems = 0', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(0);

      const result = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('INSUFFICIENT_GEMS');
    });

    it('gems are NOT deducted on insufficient funds failure', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = testCosmetic.priceGems - 1;
      setGems(initialGems);

      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Gems unchanged
      expect(useGameStore.getState().currencies.gems).toBe(initialGems);
    });
  });

  describe('BCT-COS-BUY-003: Purchase deducts gems and grants pet-bound ownership', () => {
    it('gems are deducted by priceGems on successful purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 100;
      setGems(initialGems);

      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      expect(useGameStore.getState().currencies.gems).toBe(initialGems - testCosmetic.priceGems);
    });

    it('pet owns cosmetic after successful purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Before: not owned
      expect(useGameStore.getState().getPetOwnedCosmetics(petId!)).not.toContain(testCosmetic.id);

      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // After: owned
      expect(useGameStore.getState().getPetOwnedCosmetics(petId!)).toContain(testCosmetic.id);
    });

    it('ownership is pet-bound (other pets do NOT own it)', () => {
      const state = useGameStore.getState();
      const activePetId = state.activePetId;
      const allPetIds = Object.keys(state.petsById);
      setGems(100);

      // Purchase for active pet
      useGameStore.getState().buyCosmetic(activePetId!, testCosmetic.id);

      // Active pet owns it
      expect(useGameStore.getState().getPetOwnedCosmetics(activePetId!)).toContain(testCosmetic.id);

      // Other pets do NOT own it
      for (const petId of allPetIds) {
        if (petId !== activePetId) {
          expect(useGameStore.getState().getPetOwnedCosmetics(petId)).not.toContain(testCosmetic.id);
        }
      }
    });

    it('ALREADY_OWNED error if pet already owns cosmetic', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(200);

      // Grant ownership first
      grantCosmeticToPet(petId!, testCosmetic.id);

      const result = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('ALREADY_OWNED');
    });

    it('gems are NOT deducted on ALREADY_OWNED failure', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 200;
      setGems(initialGems);

      // Grant ownership first
      grantCosmeticToPet(petId!, testCosmetic.id);

      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Gems unchanged
      expect(useGameStore.getState().currencies.gems).toBe(initialGems);
    });
  });

  describe('BCT-COS-BUY-004: No auto-equip after purchase', () => {
    it('equippedCosmetics is unchanged after successful purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Get equipped state before
      const equippedBefore = { ...useGameStore.getState().getPetEquippedCosmetics(petId!) };

      // Purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Equipped state should be unchanged
      const equippedAfter = useGameStore.getState().getPetEquippedCosmetics(petId!);
      expect(equippedAfter).toEqual(equippedBefore);
    });

    it('cosmetic slot is not auto-filled after purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Verify slot is empty before
      const slot = testCosmetic.slot;
      expect(useGameStore.getState().getPetEquippedCosmetics(petId!)[slot]).toBeUndefined();

      // Purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Slot should still be empty (not auto-equipped)
      expect(useGameStore.getState().getPetEquippedCosmetics(petId!)[slot]).toBeUndefined();
    });

    it('user can manually equip after purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Manually equip
      const equipResult = useGameStore.getState().equipCosmetic(petId!, testCosmetic.id);

      expect(equipResult.success).toBe(true);
      expect(useGameStore.getState().getPetEquippedCosmetics(petId!)[testCosmetic.slot]).toBe(testCosmetic.id);
    });
  });

  describe('Error handling', () => {
    it('INVALID_COSMETIC error for non-existent cosmetic ID', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      const result = useGameStore.getState().buyCosmetic(petId!, 'invalid_cosmetic_id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_COSMETIC');
    });

    it('INVALID_PET error for non-existent pet ID', () => {
      setGems(100);

      const result = useGameStore.getState().buyCosmetic('invalid_pet_id', testCosmetic.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_PET');
    });

    it('gems are NOT deducted on INVALID_COSMETIC failure', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 100;
      setGems(initialGems);

      useGameStore.getState().buyCosmetic(petId!, 'invalid_cosmetic_id');

      expect(useGameStore.getState().currencies.gems).toBe(initialGems);
    });

    it('gems are NOT deducted on INVALID_PET failure', () => {
      const initialGems = 100;
      setGems(initialGems);

      useGameStore.getState().buyCosmetic('invalid_pet_id', testCosmetic.id);

      expect(useGameStore.getState().currencies.gems).toBe(initialGems);
    });
  });

  describe('Multiple purchases', () => {
    it('can purchase multiple different cosmetics for same pet', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(500); // Enough for multiple

      const cosmetic1 = COSMETIC_CATALOG[0];
      const cosmetic2 = COSMETIC_CATALOG[1];

      const result1 = useGameStore.getState().buyCosmetic(petId!, cosmetic1.id);
      const result2 = useGameStore.getState().buyCosmetic(petId!, cosmetic2.id);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      const owned = useGameStore.getState().getPetOwnedCosmetics(petId!);
      expect(owned).toContain(cosmetic1.id);
      expect(owned).toContain(cosmetic2.id);
    });

    it('gems deducted correctly for multiple purchases', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 500;
      setGems(initialGems);

      const cosmetic1 = COSMETIC_CATALOG[0];
      const cosmetic2 = COSMETIC_CATALOG[1];

      useGameStore.getState().buyCosmetic(petId!, cosmetic1.id);
      useGameStore.getState().buyCosmetic(petId!, cosmetic2.id);

      const expectedGems = initialGems - cosmetic1.priceGems - cosmetic2.priceGems;
      expect(useGameStore.getState().currencies.gems).toBe(expectedGems);
    });
  });
});
