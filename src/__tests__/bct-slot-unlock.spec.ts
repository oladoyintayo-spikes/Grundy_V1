/**
 * BCT-SLOT-UNLOCK: Pet Slot Unlock Purchase Tests (P9-C-SLOTS)
 *
 * Tests for slot unlock system including:
 * - Slot pricing (100/150/200 gems for slots 2/3/4)
 * - Sequential prerequisites (level 5 for slot 2, previous slot for 3/4)
 * - Atomic purchase behavior
 * - UI helper functions (getSlotStatuses)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §11.6, §11.5
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-PETSLOTS-*
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  PET_SLOTS_CONFIG,
  PET_SLOT_PRICES,
  PET_SLOT_PREREQS,
  getPetSlotPrice,
  checkSlotPrereq,
  purchaseSlot,
  getAllSlotStatuses,
  SLOT_UNLOCK_TEST_IDS,
} from '../constants/bible.constants';

// Reset store before each test
beforeEach(() => {
  useGameStore.getState().resetGame();
});

describe('BCT-SLOT-UNLOCK-001: Slot Pricing Configuration', () => {
  it('slot 2 costs 100 gems (Bible §11.6)', () => {
    expect(PET_SLOT_PRICES.SLOT_2.base).toBe(100);
    expect(getPetSlotPrice(2, false)).toBe(100);
  });

  it('slot 3 costs 150 gems (Bible §11.6)', () => {
    expect(PET_SLOT_PRICES.SLOT_3.base).toBe(150);
    expect(getPetSlotPrice(3, false)).toBe(150);
  });

  it('slot 4 costs 200 gems (Bible §11.6)', () => {
    expect(PET_SLOT_PRICES.SLOT_4.base).toBe(200);
    expect(getPetSlotPrice(4, false)).toBe(200);
  });

  it('Plus subscribers get 20% discount', () => {
    expect(PET_SLOT_PRICES.SLOT_2.plusDiscount).toBe(80);
    expect(PET_SLOT_PRICES.SLOT_3.plusDiscount).toBe(120);
    expect(PET_SLOT_PRICES.SLOT_4.plusDiscount).toBe(160);
    expect(getPetSlotPrice(2, true)).toBe(80);
    expect(getPetSlotPrice(3, true)).toBe(120);
    expect(getPetSlotPrice(4, true)).toBe(160);
  });
});

describe('BCT-SLOT-UNLOCK-002: Slot Prerequisites Configuration', () => {
  it('slot 2 requires level 5 (Bible §11.5)', () => {
    const prereq = PET_SLOT_PREREQS[2];
    expect(prereq.type).toBe('level');
    expect(prereq.value).toBe(5);
  });

  it('slot 3 requires owning slot 2 (Bible §11.5)', () => {
    const prereq = PET_SLOT_PREREQS[3];
    expect(prereq.type).toBe('slot_owned');
    expect(prereq.value).toBe(2);
  });

  it('slot 4 requires owning slot 3 (Bible §11.5)', () => {
    const prereq = PET_SLOT_PREREQS[4];
    expect(prereq.type).toBe('slot_owned');
    expect(prereq.value).toBe(3);
  });
});

describe('BCT-SLOT-UNLOCK-003: Prerequisite Check Function', () => {
  it('slot 1 always returns met=true', () => {
    const result = checkSlotPrereq(1, 1, 1);
    expect(result.met).toBe(true);
  });

  it('slot 2 fails when level < 5', () => {
    const result = checkSlotPrereq(2, 4, 1);
    expect(result.met).toBe(false);
    expect(result.reason).toContain('Level 5');
  });

  it('slot 2 passes when level >= 5', () => {
    const result = checkSlotPrereq(2, 5, 1);
    expect(result.met).toBe(true);
  });

  it('slot 3 fails when unlockedSlots < 2', () => {
    const result = checkSlotPrereq(3, 10, 1);
    expect(result.met).toBe(false);
    expect(result.reason).toContain('2nd slot');
  });

  it('slot 3 passes when unlockedSlots >= 2', () => {
    const result = checkSlotPrereq(3, 10, 2);
    expect(result.met).toBe(true);
  });

  it('slot 4 fails when unlockedSlots < 3', () => {
    const result = checkSlotPrereq(4, 10, 2);
    expect(result.met).toBe(false);
    expect(result.reason).toContain('3rd slot');
  });

  it('slot 4 passes when unlockedSlots >= 3', () => {
    const result = checkSlotPrereq(4, 10, 3);
    expect(result.met).toBe(true);
  });
});

describe('BCT-SLOT-UNLOCK-004: Pure Purchase Function', () => {
  it('fails with insufficient gems', () => {
    const result = purchaseSlot({
      gems: 50,
      unlockedSlots: 1,
      playerLevel: 5,
      hasPlusSubscription: false,
    }, 2);

    expect(result.success).toBe(false);
    expect(result.error).toBe('insufficient_gems');
  });

  it('fails when prereq not met', () => {
    const result = purchaseSlot({
      gems: 200,
      unlockedSlots: 1,
      playerLevel: 4, // Level 4, need 5
      hasPlusSubscription: false,
    }, 2);

    expect(result.success).toBe(false);
    expect(result.error).toBe('prereq_not_met');
  });

  it('fails when slot already owned', () => {
    const result = purchaseSlot({
      gems: 200,
      unlockedSlots: 2, // Already have slot 2
      playerLevel: 10,
      hasPlusSubscription: false,
    }, 2);

    expect(result.success).toBe(false);
    expect(result.error).toBe('already_owned');
  });

  it('fails for invalid slot number', () => {
    const result = purchaseSlot({
      gems: 500,
      unlockedSlots: 3,
      playerLevel: 10,
      hasPlusSubscription: false,
    }, 5); // Invalid

    expect(result.success).toBe(false);
    expect(result.error).toBe('invalid_slot');
  });

  it('fails when max slots reached', () => {
    const result = purchaseSlot({
      gems: 500,
      unlockedSlots: 4, // Already at max
      playerLevel: 10,
      hasPlusSubscription: false,
    }, 4);

    expect(result.success).toBe(false);
    expect(result.error).toBe('already_owned');
  });

  it('succeeds with enough gems and prereq met', () => {
    const result = purchaseSlot({
      gems: 150,
      unlockedSlots: 1,
      playerLevel: 5,
      hasPlusSubscription: false,
    }, 2);

    expect(result.success).toBe(true);
    expect(result.cost).toBe(100);
    expect(result.newGems).toBe(50);
    expect(result.newUnlockedSlots).toBe(2);
  });

  it('deducts exact cost from gems', () => {
    const result = purchaseSlot({
      gems: 100,
      unlockedSlots: 1,
      playerLevel: 5,
      hasPlusSubscription: false,
    }, 2);

    expect(result.success).toBe(true);
    expect(result.newGems).toBe(0);
  });
});

describe('BCT-SLOT-UNLOCK-005: Store Integration', () => {
  it('purchasePetSlot deducts gems from store', () => {
    const store = useGameStore.getState();

    // Setup: Give player level 5 and enough gems
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 5 },
      currencies: { ...s.currencies, gems: 150 },
    }));

    const beforeGems = useGameStore.getState().currencies.gems;
    const result = useGameStore.getState().purchasePetSlot(2);
    const afterGems = useGameStore.getState().currencies.gems;

    expect(result.success).toBe(true);
    expect(afterGems).toBe(beforeGems - 100);
  });

  it('purchasePetSlot increments unlockedSlots', () => {
    // Setup: Give player level 5 and enough gems
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 5 },
      currencies: { ...s.currencies, gems: 150 },
    }));

    const beforeSlots = useGameStore.getState().unlockedSlots;
    const result = useGameStore.getState().purchasePetSlot(2);
    const afterSlots = useGameStore.getState().unlockedSlots;

    expect(result.success).toBe(true);
    expect(afterSlots).toBe(beforeSlots + 1);
  });

  it('failed purchase does not modify state (atomic)', () => {
    // Setup: Level 4 (prereq not met), has gems
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 4 },
      currencies: { ...s.currencies, gems: 150 },
    }));

    const beforeGems = useGameStore.getState().currencies.gems;
    const beforeSlots = useGameStore.getState().unlockedSlots;

    const result = useGameStore.getState().purchasePetSlot(2);

    expect(result.success).toBe(false);
    expect(useGameStore.getState().currencies.gems).toBe(beforeGems);
    expect(useGameStore.getState().unlockedSlots).toBe(beforeSlots);
  });
});

describe('BCT-SLOT-UNLOCK-006: getSlotStatuses', () => {
  it('returns 4 slot statuses', () => {
    const statuses = getAllSlotStatuses(1, 1, 0);
    expect(statuses).toHaveLength(4);
  });

  it('slot 1 is always owned', () => {
    const statuses = getAllSlotStatuses(1, 1, 0);
    const slot1 = statuses.find(s => s.slotNumber === 1);

    expect(slot1?.isOwned).toBe(true);
    expect(slot1?.isLocked).toBe(false);
  });

  it('slot 2 shows prereq not met when level < 5', () => {
    const statuses = getAllSlotStatuses(1, 4, 100);
    const slot2 = statuses.find(s => s.slotNumber === 2);

    expect(slot2?.isOwned).toBe(false);
    expect(slot2?.prereqMet).toBe(false);
    expect(slot2?.canUnlock).toBe(false);
  });

  it('slot 2 shows canUnlock=true when level >= 5 and has gems', () => {
    const statuses = getAllSlotStatuses(1, 5, 100);
    const slot2 = statuses.find(s => s.slotNumber === 2);

    expect(slot2?.isOwned).toBe(false);
    expect(slot2?.prereqMet).toBe(true);
    expect(slot2?.canUnlock).toBe(true);
    expect(slot2?.price).toBe(100);
  });

  it('slot 2 shows canUnlock=false when has prereq but not enough gems', () => {
    const statuses = getAllSlotStatuses(1, 5, 50);
    const slot2 = statuses.find(s => s.slotNumber === 2);

    expect(slot2?.prereqMet).toBe(true);
    expect(slot2?.canUnlock).toBe(false);
  });

  it('store.getSlotStatuses returns current state', () => {
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 5 },
      currencies: { ...s.currencies, gems: 100 },
    }));

    const statuses = useGameStore.getState().getSlotStatuses();
    const slot2 = statuses.find(s => s.slotNumber === 2);

    expect(slot2?.canUnlock).toBe(true);
  });
});

describe('BCT-SLOT-UNLOCK-007: Sequential Purchase Flow', () => {
  it('can unlock slot 2, then 3, then 4 sequentially', () => {
    // Setup: Level 10, 500 gems
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 10 },
      currencies: { ...s.currencies, gems: 500 },
    }));

    // Purchase slot 2
    const result2 = useGameStore.getState().purchasePetSlot(2);
    expect(result2.success).toBe(true);
    expect(useGameStore.getState().unlockedSlots).toBe(2);
    expect(useGameStore.getState().currencies.gems).toBe(400);

    // Purchase slot 3
    const result3 = useGameStore.getState().purchasePetSlot(3);
    expect(result3.success).toBe(true);
    expect(useGameStore.getState().unlockedSlots).toBe(3);
    expect(useGameStore.getState().currencies.gems).toBe(250);

    // Purchase slot 4
    const result4 = useGameStore.getState().purchasePetSlot(4);
    expect(result4.success).toBe(true);
    expect(useGameStore.getState().unlockedSlots).toBe(4);
    expect(useGameStore.getState().currencies.gems).toBe(50);
  });

  it('cannot skip slot 2 to purchase slot 3', () => {
    // Setup: Level 10, enough gems
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 10 },
      currencies: { ...s.currencies, gems: 500 },
    }));

    // Try to purchase slot 3 without slot 2
    const result = useGameStore.getState().purchasePetSlot(3);
    expect(result.success).toBe(false);
    expect(result.error).toBe('prereq_not_met');
    expect(useGameStore.getState().unlockedSlots).toBe(1);
  });

  it('cannot skip slot 3 to purchase slot 4', () => {
    // Setup: Level 10, enough gems, slot 2 purchased
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 10 },
      currencies: { ...s.currencies, gems: 500 },
      unlockedSlots: 2,
    }));

    // Try to purchase slot 4 without slot 3
    const result = useGameStore.getState().purchasePetSlot(4);
    expect(result.success).toBe(false);
    expect(result.error).toBe('prereq_not_met');
    expect(useGameStore.getState().unlockedSlots).toBe(2);
  });
});

describe('BCT-SLOT-UNLOCK-008: Max Slots Enforcement', () => {
  it('maximum slots is 4 (Bible §11.6)', () => {
    expect(PET_SLOTS_CONFIG.MAX_SLOTS).toBe(4);
  });

  it('cannot purchase beyond max slots', () => {
    useGameStore.setState((s) => ({
      pet: { ...s.pet, level: 10 },
      currencies: { ...s.currencies, gems: 500 },
      unlockedSlots: 4, // Already at max
    }));

    // Try to purchase slot 4 again (or 5 if it existed)
    const result = useGameStore.getState().purchasePetSlot(4);
    expect(result.success).toBe(false);
    expect(result.error).toBe('already_owned');
  });
});

describe('BCT-SLOT-UNLOCK-009: TestID Configuration', () => {
  it('SLOT_CONTAINER testid function works', () => {
    expect(SLOT_UNLOCK_TEST_IDS.SLOT_CONTAINER(1)).toBe('pet-slot-1');
    expect(SLOT_UNLOCK_TEST_IDS.SLOT_CONTAINER(2)).toBe('pet-slot-2');
  });

  it('UNLOCK_CTA testid function works', () => {
    expect(SLOT_UNLOCK_TEST_IDS.UNLOCK_CTA(2)).toBe('slot-unlock-2');
  });

  it('PREREQ_MESSAGE testid function works', () => {
    expect(SLOT_UNLOCK_TEST_IDS.PREREQ_MESSAGE(2)).toBe('slot-prereq-2');
  });

  it('PRICE_DISPLAY testid function works', () => {
    expect(SLOT_UNLOCK_TEST_IDS.PRICE_DISPLAY(2)).toBe('slot-price-2');
  });

  it('modal and button testids are defined', () => {
    expect(SLOT_UNLOCK_TEST_IDS.UNLOCK_MODAL).toBe('slot-unlock-modal');
    expect(SLOT_UNLOCK_TEST_IDS.CONFIRM_BUTTON).toBe('slot-unlock-confirm');
    expect(SLOT_UNLOCK_TEST_IDS.CANCEL_BUTTON).toBe('slot-unlock-cancel');
    expect(SLOT_UNLOCK_TEST_IDS.PET_SLOTS_SECTION).toBe('pet-slots-section');
  });
});
