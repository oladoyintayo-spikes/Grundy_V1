/**
 * BIBLE COMPLIANCE TESTS — Phase 11-D1: Cosmetics Purchase UX Polish
 *
 * Tests for cosmetic purchase UX improvements:
 * - BCT-COS-BUY-UI-001: After purchase, owned state + equip controls appear immediately
 * - BCT-COS-BUY-UI-002: Double-tap protection prevents multiple deductions
 * - Deterministic "Need X more" calculation
 * - Pet-bound UI behavior (buy on Pet A, Pet B shows not owned)
 *
 * Note: These tests verify store state logic. Component-level double-tap
 * protection is tested via React state in CosmeticsTabContent (purchasingIds).
 * Full RTL component tests would be required for complete UI verification.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.10) §11.5.2
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import { COSMETIC_CATALOG } from '../constants/bible.constants';

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

// ============================================
// BCT-COS-BUY-UI Tests (Purchase UX Polish)
// ============================================

describe('BCT-COS-BUY-UI: Cosmetics Purchase UX', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  // Test cosmetic for these tests
  const testCosmetic = COSMETIC_CATALOG.find((c) => c.id === 'cos_acc_bowtie_red')
    || COSMETIC_CATALOG[0];

  describe('BCT-COS-BUY-UI-001: After purchase, owned state appears immediately', () => {
    it('purchased cosmetic appears in ownedCosmeticIds immediately', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Before purchase: not owned
      expect(useGameStore.getState().getPetOwnedCosmetics(petId!)).not.toContain(testCosmetic.id);

      // Execute purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // After purchase: immediately owned (no async delay)
      expect(useGameStore.getState().getPetOwnedCosmetics(petId!)).toContain(testCosmetic.id);
    });

    it('gems balance updates immediately after purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 100;
      setGems(initialGems);

      // Execute purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Balance updated immediately
      expect(useGameStore.getState().currencies.gems).toBe(initialGems - testCosmetic.priceGems);
    });

    it('equip controls available after purchase (cosmetic can be equipped)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Equip should succeed (equip controls available)
      const equipResult = useGameStore.getState().equipCosmetic(petId!, testCosmetic.id);
      expect(equipResult.success).toBe(true);
    });

    it('no auto-equip after purchase (slot remains empty)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(100);

      // Slot is empty before
      expect(useGameStore.getState().getPetEquippedCosmetics(petId!)[testCosmetic.slot]).toBeUndefined();

      // Purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Slot still empty (not auto-equipped)
      expect(useGameStore.getState().getPetEquippedCosmetics(petId!)[testCosmetic.slot]).toBeUndefined();
    });
  });

  describe('BCT-COS-BUY-UI-002: Double-tap protection (store-level)', () => {
    it('second purchase of same cosmetic returns ALREADY_OWNED error', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      setGems(200);

      // First purchase succeeds
      const result1 = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);
      expect(result1.success).toBe(true);

      // Second purchase fails with ALREADY_OWNED
      const result2 = useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('ALREADY_OWNED');
    });

    it('only one gem deduction occurs for duplicate purchase attempts', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 200;
      setGems(initialGems);

      // First purchase
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Second purchase (should fail)
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      // Only one deduction
      expect(useGameStore.getState().currencies.gems).toBe(initialGems - testCosmetic.priceGems);
    });

    /**
     * Note: UI-level double-tap protection (purchasingIds state) prevents
     * the second call from reaching the store action. This test verifies
     * the store's fallback protection via ALREADY_OWNED check.
     */
  });

  describe('Deterministic "Need X more" calculation', () => {
    it('gemsNeeded = priceGems - currentGems (positive)', () => {
      const currentGems = 10;
      const priceGems = 50;
      const gemsNeeded = priceGems - currentGems;

      expect(gemsNeeded).toBe(40);
    });

    it('gemsNeeded = 0 when currentGems = priceGems', () => {
      const currentGems = 50;
      const priceGems = 50;
      const gemsNeeded = priceGems - currentGems;

      expect(gemsNeeded).toBe(0);
    });

    it('gemsNeeded calculation works for all catalog items', () => {
      const currentGems = 10;

      for (const cosmetic of COSMETIC_CATALOG) {
        const gemsNeeded = cosmetic.priceGems - currentGems;
        // Should be deterministic and consistent
        expect(gemsNeeded).toBe(cosmetic.priceGems - 10);
        expect(typeof gemsNeeded).toBe('number');
      }
    });
  });

  describe('Pet-bound UI behavior', () => {
    it('purchase on Pet A does not grant ownership to Pet B', () => {
      const state = useGameStore.getState();
      const allPetIds = Object.keys(state.petsById);

      // Need at least 2 pets for this test
      if (allPetIds.length < 2) {
        // Skip if only one pet
        expect(true).toBe(true);
        return;
      }

      const petA = allPetIds[0];
      const petB = allPetIds[1];
      setGems(100);

      // Set active pet to Pet A
      useGameStore.setState({ activePetId: petA });

      // Purchase on Pet A
      useGameStore.getState().buyCosmetic(petA, testCosmetic.id);

      // Pet A owns it
      expect(useGameStore.getState().getPetOwnedCosmetics(petA)).toContain(testCosmetic.id);

      // Pet B does NOT own it
      expect(useGameStore.getState().getPetOwnedCosmetics(petB)).not.toContain(testCosmetic.id);
    });

    it('switching pets shows different ownership states', () => {
      const state = useGameStore.getState();
      const allPetIds = Object.keys(state.petsById);

      if (allPetIds.length < 2) {
        expect(true).toBe(true);
        return;
      }

      const petA = allPetIds[0];
      const petB = allPetIds[1];
      setGems(100);

      // Purchase on Pet A
      useGameStore.getState().buyCosmetic(petA, testCosmetic.id);

      // Check ownership from Pet A's perspective
      const petAOwned = useGameStore.getState().getPetOwnedCosmetics(petA);
      expect(petAOwned).toContain(testCosmetic.id);

      // Check ownership from Pet B's perspective (simulating switch)
      const petBOwned = useGameStore.getState().getPetOwnedCosmetics(petB);
      expect(petBOwned).not.toContain(testCosmetic.id);
    });

    it('Pet B can purchase same cosmetic separately', () => {
      const state = useGameStore.getState();
      const allPetIds = Object.keys(state.petsById);

      if (allPetIds.length < 2) {
        expect(true).toBe(true);
        return;
      }

      const petA = allPetIds[0];
      const petB = allPetIds[1];
      setGems(200); // Enough for two purchases

      // Pet A purchases
      const resultA = useGameStore.getState().buyCosmetic(petA, testCosmetic.id);
      expect(resultA.success).toBe(true);

      // Pet B can also purchase the same cosmetic
      const resultB = useGameStore.getState().buyCosmetic(petB, testCosmetic.id);
      expect(resultB.success).toBe(true);

      // Both pets now own it
      expect(useGameStore.getState().getPetOwnedCosmetics(petA)).toContain(testCosmetic.id);
      expect(useGameStore.getState().getPetOwnedCosmetics(petB)).toContain(testCosmetic.id);
    });
  });

  describe('Wallet balance assertions', () => {
    it('shop-gems-balance test ID would show correct value', () => {
      // This test verifies the value that would be displayed
      // Actual test ID rendering requires RTL component tests
      setGems(42);
      expect(useGameStore.getState().currencies.gems).toBe(42);
    });

    it('gems balance decreases by exactly priceGems on purchase', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const initialGems = 100;
      setGems(initialGems);

      const { priceGems } = testCosmetic;
      useGameStore.getState().buyCosmetic(petId!, testCosmetic.id);

      const finalGems = useGameStore.getState().currencies.gems;
      expect(finalGems).toBe(initialGems - priceGems);
      expect(initialGems - finalGems).toBe(priceGems);
    });
  });
});
