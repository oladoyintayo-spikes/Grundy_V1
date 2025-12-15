/**
 * BIBLE COMPLIANCE TESTS — Phase 11-B: Cosmetics UI Wiring
 *
 * Tests for cosmetic UI wiring (view + equip/unequip only, no purchase):
 * - Shop cosmetics panel displays catalog (BCT-COS-UI-SHOP-001)
 * - Owned cosmetics show equip/unequip; non-owned locked (BCT-COS-UI-SHOP-002)
 * - Price informational only, no buy CTA (BCT-COS-UI-SHOP-003)
 * - Inventory cosmetics grouped by slot (BCT-COS-UI-INV-001)
 * - Equipped state visible and unequip works (BCT-COS-UI-INV-002)
 * - Empty state when no cosmetics owned (BCT-COS-UI-INV-003)
 *
 * Note: These tests verify store state logic that powers the UI.
 * Visual/component tests would require RTL setup.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.10)
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  COSMETIC_SLOTS,
  COSMETIC_CATALOG,
  getCosmeticById,
  type CosmeticSlot,
} from '../constants/bible.constants';

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
// BCT-COS-UI-SHOP Tests (Shop Cosmetics Panel)
// ============================================

describe('BCT-COS-UI-SHOP: Shop Cosmetics Panel', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  describe('BCT-COS-UI-SHOP-001: Shop shows Cosmetics panel listing catalog items', () => {
    it('COSMETIC_CATALOG contains items for UI to display', () => {
      // Shop cosmetics panel should render all catalog items
      expect(COSMETIC_CATALOG.length).toBeGreaterThan(0);

      // Each item has required display fields
      for (const cosmetic of COSMETIC_CATALOG) {
        expect(cosmetic.id).toBeTruthy();
        expect(cosmetic.displayName).toBeTruthy();
        expect(cosmetic.slot).toBeTruthy();
        expect(cosmetic.rarity).toBeTruthy();
        expect(cosmetic.priceGems).toBeGreaterThan(0);
      }
    });

    it('catalog covers all slots for complete UI display', () => {
      const slotsInCatalog = new Set(COSMETIC_CATALOG.map((c) => c.slot));

      // At least one item per slot for testing
      for (const slot of COSMETIC_SLOTS) {
        expect(slotsInCatalog.has(slot)).toBe(true);
      }
    });

    it('getCosmeticById returns definition for UI rendering', () => {
      const testCosmetic = COSMETIC_CATALOG[0];
      const result = getCosmeticById(testCosmetic.id);

      expect(result).toBeDefined();
      expect(result?.displayName).toBe(testCosmetic.displayName);
      expect(result?.slot).toBe(testCosmetic.slot);
      expect(result?.rarity).toBe(testCosmetic.rarity);
      expect(result?.priceGems).toBe(testCosmetic.priceGems);
    });
  });

  describe('BCT-COS-UI-SHOP-002: Owned cosmetics show equip/unequip; non-owned locked', () => {
    it('getPetOwnedCosmetics returns owned cosmetic IDs for ownership check', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Initially no cosmetics owned
      let owned = state.getPetOwnedCosmetics(petId);
      expect(owned).toEqual([]);

      // Grant a cosmetic
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      owned = useGameStore.getState().getPetOwnedCosmetics(petId);
      expect(owned).toContain('cos_hat_cap_blue');
    });

    it('owned cosmetic can be equipped (UI equip button enabled)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Grant and equip
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      const result = useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

      expect(result.success).toBe(true);
    });

    it('non-owned cosmetic cannot be equipped (UI shows locked)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Try to equip without ownership
      const result = state.equipCosmetic(petId, 'cos_hat_cap_blue');

      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_OWNED');
    });

    it('equipped cosmetic can be unequipped (UI shows unequip button)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Grant and equip
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

      // Unequip
      const result = useGameStore.getState().unequipCosmetic(petId, 'hat');

      expect(result.success).toBe(true);
      expect(result.previousCosmeticId).toBe('cos_hat_cap_blue');
    });
  });

  describe('BCT-COS-UI-SHOP-003: Price shown is informational only; no buy CTA', () => {
    it('all catalog items have gems-only pricing (priceGems > 0)', () => {
      for (const cosmetic of COSMETIC_CATALOG) {
        expect(cosmetic.priceGems).toBeGreaterThan(0);
        // No coinPrice field exists - gems only by design
        expect((cosmetic as unknown as Record<string, unknown>).coinPrice).toBeUndefined();
      }
    });

    it('no purchase action exists in P11-B scope (informational only)', () => {
      // P11-B does not implement purchase - verify no purchaseCosmetic action
      const state = useGameStore.getState();
      expect((state as unknown as Record<string, unknown>).purchaseCosmetic).toBeUndefined();
    });
  });
});

// ============================================
// BCT-COS-UI-INV Tests (Inventory Cosmetics Section)
// ============================================

describe('BCT-COS-UI-INV: Inventory Cosmetics Section', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  describe('BCT-COS-UI-INV-001: Inventory cosmetics grouped by slot', () => {
    it('COSMETIC_SLOTS provides slot order for UI grouping', () => {
      // Verify COSMETIC_SLOTS order is what UI should use
      expect(COSMETIC_SLOTS).toEqual(['hat', 'accessory', 'outfit', 'aura', 'skin']);
      expect(COSMETIC_SLOTS.length).toBe(5);
    });

    it('owned cosmetics can be grouped by slot using catalog data', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Grant cosmetics in different slots
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      grantCosmeticToPet(petId, 'cos_accessory_scarf_red');

      const owned = useGameStore.getState().getPetOwnedCosmetics(petId);

      // Group by slot (UI logic)
      const bySlot: Record<CosmeticSlot, string[]> = {
        hat: [],
        accessory: [],
        outfit: [],
        aura: [],
        skin: [],
      };

      for (const cosmeticId of owned) {
        const cosmetic = getCosmeticById(cosmeticId);
        if (cosmetic) {
          bySlot[cosmetic.slot].push(cosmeticId);
        }
      }

      expect(bySlot.hat).toContain('cos_hat_cap_blue');
      expect(bySlot.accessory).toContain('cos_accessory_scarf_red');
    });
  });

  describe('BCT-COS-UI-INV-002: Equipped state visible and consistent with store', () => {
    it('getPetEquippedCosmetics returns equipped state for UI display', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Initially nothing equipped
      let equipped = state.getPetEquippedCosmetics(petId);
      expect(Object.keys(equipped).length).toBe(0);

      // Grant and equip
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

      equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(equipped.hat).toBe('cos_hat_cap_blue');
    });

    it('unequip clears slot in store (UI updates)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Grant and equip
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

      // Verify equipped
      let equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(equipped.hat).toBe('cos_hat_cap_blue');

      // Unequip
      useGameStore.getState().unequipCosmetic(petId, 'hat');

      // Verify cleared
      equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(equipped.hat).toBeUndefined();
    });

    it('equip/unequip triggers state update (UI should re-render)', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      grantCosmeticToPet(petId, 'cos_hat_cap_blue');

      // Track state changes
      const initialEquipped = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(initialEquipped.hat).toBeUndefined();

      // Equip
      useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
      const afterEquip = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(afterEquip.hat).toBe('cos_hat_cap_blue');

      // Unequip
      useGameStore.getState().unequipCosmetic(petId, 'hat');
      const afterUnequip = useGameStore.getState().getPetEquippedCosmetics(petId);
      expect(afterUnequip.hat).toBeUndefined();
    });
  });

  describe('BCT-COS-UI-INV-003: Empty state when owned cosmetics = 0', () => {
    it('getPetOwnedCosmetics returns empty array when none owned', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      const owned = state.getPetOwnedCosmetics(petId);
      expect(owned).toEqual([]);
      expect(owned.length).toBe(0);
    });

    it('UI can detect empty state via owned cosmetics length', () => {
      const state = useGameStore.getState();
      const petId = state.activePetId;

      // Empty state condition
      const owned = state.getPetOwnedCosmetics(petId);
      const showEmptyState = owned.length === 0;

      expect(showEmptyState).toBe(true);

      // After granting, no longer empty
      grantCosmeticToPet(petId, 'cos_hat_cap_blue');
      const ownedAfter = useGameStore.getState().getPetOwnedCosmetics(petId);
      const showEmptyStateAfter = ownedAfter.length === 0;

      expect(showEmptyStateAfter).toBe(false);
    });
  });
});

// ============================================
// P11-B Integration Tests
// ============================================

describe('P11-B Integration: Shop + Inventory Cosmetics Flow', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('full flow: grant → equip in shop → visible in inventory', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // 1. Initially empty
    expect(state.getPetOwnedCosmetics(petId)).toEqual([]);
    expect(state.getPetEquippedCosmetics(petId)).toEqual({});

    // 2. Grant cosmetic (simulates future purchase)
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');

    // 3. Equip from shop
    const equipResult = useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
    expect(equipResult.success).toBe(true);

    // 4. Verify in inventory view state
    const owned = useGameStore.getState().getPetOwnedCosmetics(petId);
    const equipped = useGameStore.getState().getPetEquippedCosmetics(petId);

    expect(owned).toContain('cos_hat_cap_blue');
    expect(equipped.hat).toBe('cos_hat_cap_blue');
  });

  it('unequip from inventory clears state visible in shop', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Setup: grant and equip
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');

    // Verify equipped
    let equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // Unequip from inventory
    useGameStore.getState().unequipCosmetic(petId, 'hat');

    // Shop should see unequipped state
    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBeUndefined();

    // But still owned
    const owned = useGameStore.getState().getPetOwnedCosmetics(petId);
    expect(owned).toContain('cos_hat_cap_blue');
  });

  it('switching equipped cosmetic in same slot replaces previous', () => {
    const state = useGameStore.getState();
    const petId = state.activePetId;

    // Grant two hats
    grantCosmeticToPet(petId, 'cos_hat_cap_blue');
    grantCosmeticToPet(petId, 'cos_hat_bow_pink');

    // Equip first
    useGameStore.getState().equipCosmetic(petId, 'cos_hat_cap_blue');
    let equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_cap_blue');

    // Equip second (should replace)
    const result = useGameStore.getState().equipCosmetic(petId, 'cos_hat_bow_pink');
    expect(result.success).toBe(true);
    expect(result.previousCosmeticId).toBe('cos_hat_cap_blue');

    equipped = useGameStore.getState().getPetEquippedCosmetics(petId);
    expect(equipped.hat).toBe('cos_hat_bow_pink');
  });
});
