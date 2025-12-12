/**
 * BCT-INV: Inventory System Tests
 * BCT-ECON: Starting Resources Tests (004-008)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §5.8, §11.7, §11.7.1, §14.8
 * @see docs/BIBLE_COMPLIANCE_TEST.md v2.2 BCT-INV-*, BCT-ECON-*
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  INVENTORY_CONFIG,
  STARTING_RESOURCES,
  TUTORIAL_INVENTORY,
} from '../constants/bible.constants';
import { useGameStore } from '../game/store';

// Reset store before each test
beforeEach(() => {
  useGameStore.getState().resetGame();
});

// ============================================================================
// BCT-INV: Inventory Slot & Stack Semantics (§11.7)
// ============================================================================

describe('BCT-INV-001: Base capacity is 15 slots', () => {
  it('should have INVENTORY_CONFIG.BASE_CAPACITY === 15', () => {
    expect(INVENTORY_CONFIG.BASE_CAPACITY).toBe(15);
  });

  it('initial state should have inventoryCapacity === 15', () => {
    const state = useGameStore.getState();
    expect(state.inventoryCapacity).toBe(15);
  });
});

describe('BCT-INV-002: Slot counts unique item ids only', () => {
  it('should count unique item IDs with qty > 0', () => {
    const state = useGameStore.getState();
    // Tutorial inventory has apple, banana, cookie = 3 unique items
    const usedSlots = state.getUsedSlots();
    expect(usedSlots).toBe(3);
  });

  it('should count slots correctly after adding items', () => {
    const state = useGameStore.getState();
    state.addFood('carrot', 5);
    const usedSlots = state.getUsedSlots();
    expect(usedSlots).toBe(4); // apple, banana, cookie, carrot
  });

  it('stacking does not increase slot count', () => {
    const state = useGameStore.getState();
    const slotsBefore = state.getUsedSlots();
    state.addFood('apple', 10); // Add more apples (existing item)
    const slotsAfter = state.getUsedSlots();
    expect(slotsAfter).toBe(slotsBefore); // Same slot count
  });
});

describe('BCT-INV-003: Stack max is 99 per id', () => {
  it('should have INVENTORY_CONFIG.STACK_MAX === 99', () => {
    expect(INVENTORY_CONFIG.STACK_MAX).toBe(99);
  });

  it('cannot exceed 99 per item', () => {
    const state = useGameStore.getState();
    // Try to add 200 apples (starting with 2)
    state.addFood('apple', 200);
    const newState = useGameStore.getState();
    expect(newState.inventory.apple).toBeLessThanOrEqual(99);
  });
});

describe('BCT-INV-004: Quantity reaching 0 removes slot', () => {
  it('removing all of an item frees the slot', () => {
    const state = useGameStore.getState();
    const slotsBefore = state.getUsedSlots();

    // Apple starts at 2, remove all
    // Directly set via inventory for testing (simulating feed consumption)
    useGameStore.setState((prev) => ({
      inventory: {
        ...prev.inventory,
        apple: 0,
      },
    }));

    const newState = useGameStore.getState();
    // Slot counter should only count items with qty > 0
    const slotsAfter = newState.getUsedSlots();
    // Apple has qty 0, but key still exists - getUsedSlots filters qty > 0
    expect(slotsAfter).toBe(slotsBefore - 1);
  });
});

describe('BCT-INV-005: Purchase blocked when new slot required but none available', () => {
  it('should block when slots are full and adding new item', () => {
    const state = useGameStore.getState();

    // Fill up to capacity (15 slots)
    const itemsToFill = [
      'carrot', 'grapes', 'spicy_taco', 'hot_pepper',
      'birthday_cake', 'dream_treat', 'golden_feast',
      'item8', 'item9', 'item10', 'item11', 'item12'
    ];

    for (const itemId of itemsToFill) {
      useGameStore.setState((prev) => ({
        inventory: {
          ...prev.inventory,
          [itemId]: 1,
        },
      }));
    }

    const newState = useGameStore.getState();
    const usedSlots = newState.getUsedSlots();
    expect(usedSlots).toBe(15); // Full

    // Now try to add a completely new item
    const result = newState.canAddToInventory('new_item_not_in_inventory', 1);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Inventory full!');
  });
});

describe('BCT-INV-006: Purchase allowed when item already exists (no new slot)', () => {
  it('should allow stacking existing item even when slots full', () => {
    const state = useGameStore.getState();

    // Fill up to capacity with 15 unique items including apple
    const itemsToFill = [
      'carrot', 'grapes', 'spicy_taco', 'hot_pepper',
      'birthday_cake', 'dream_treat', 'golden_feast',
      'item8', 'item9', 'item10', 'item11', 'item12'
    ];

    for (const itemId of itemsToFill) {
      useGameStore.setState((prev) => ({
        inventory: {
          ...prev.inventory,
          [itemId]: 1,
        },
      }));
    }

    const newState = useGameStore.getState();
    expect(newState.getUsedSlots()).toBe(15); // Full

    // Apple already exists from tutorial inventory
    const result = newState.canAddToInventory('apple', 5);
    expect(result.allowed).toBe(true);
  });
});

// ============================================================================
// BCT-ECON: Starting Resources (§5.8)
// ============================================================================

describe('BCT-ECON-001: New player starts with 100 coins', () => {
  it('should have STARTING_RESOURCES.COINS === 100', () => {
    expect(STARTING_RESOURCES.COINS).toBe(100);
  });

  it('initial state should have coins === 100', () => {
    const state = useGameStore.getState();
    expect(state.currencies.coins).toBe(100);
  });
});

describe('BCT-ECON-002: New player starts with 0 gems', () => {
  it('should have STARTING_RESOURCES.GEMS === 0', () => {
    expect(STARTING_RESOURCES.GEMS).toBe(0);
  });

  it('initial state should have gems === 0', () => {
    const state = useGameStore.getState();
    expect(state.currencies.gems).toBe(0);
  });
});

describe('BCT-ECON-003: Tutorial inventory: 2x Apple', () => {
  it('should have TUTORIAL_INVENTORY.apple === 2', () => {
    expect(TUTORIAL_INVENTORY.apple).toBe(2);
  });

  it('initial state should have inventory.apple === 2', () => {
    const state = useGameStore.getState();
    expect(state.inventory.apple).toBe(2);
  });
});

describe('BCT-ECON-004: Tutorial inventory: 2x Banana', () => {
  it('should have TUTORIAL_INVENTORY.banana === 2', () => {
    expect(TUTORIAL_INVENTORY.banana).toBe(2);
  });

  it('initial state should have inventory.banana === 2', () => {
    const state = useGameStore.getState();
    expect(state.inventory.banana).toBe(2);
  });
});

describe('BCT-ECON-005: Tutorial inventory: 1x Cookie', () => {
  it('should have TUTORIAL_INVENTORY.cookie === 1', () => {
    expect(TUTORIAL_INVENTORY.cookie).toBe(1);
  });

  it('initial state should have inventory.cookie === 1', () => {
    const state = useGameStore.getState();
    expect(state.inventory.cookie).toBe(1);
  });
});

// ============================================================================
// Additional inventory tests (store integration)
// ============================================================================

describe('Inventory store integration', () => {
  it('addFood respects stack limit', () => {
    const state = useGameStore.getState();
    // Add enough to go over limit
    state.addFood('apple', 100);
    const newState = useGameStore.getState();
    // Should be capped at 99
    expect(newState.inventory.apple).toBeLessThanOrEqual(INVENTORY_CONFIG.STACK_MAX);
  });

  it('canAddToInventory returns reason for stack overflow', () => {
    // Set apple to 98
    useGameStore.setState((prev) => ({
      inventory: {
        ...prev.inventory,
        apple: 98,
      },
    }));

    const state = useGameStore.getState();
    // Try to add 5 more (would exceed 99)
    const result = state.canAddToInventory('apple', 5);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Inventory full!');
  });
});
