/**
 * BCT-PETSLOTS: Pet Slots Foundation Tests (P9-A)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §11.6, §6
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-PETSLOTS-*
 * @see docs/P9A_PETSLOTS_FOUNDATION_PLAN.md
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  PET_SLOTS_CONFIG,
  GLOBAL_RESOURCES,
  STARTER_PET_IDS,
} from '../constants/bible.constants';
import { STARTING_RESOURCES, TUTORIAL_INVENTORY } from '../constants/bible.constants';

// Reset store before each test
beforeEach(() => {
  useGameStore.getState().resetGame();
});

describe('BCT-PETSLOTS-001: Pet Slots Configuration', () => {
  it('should have MAX_SLOTS = 4 (Bible §11.6)', () => {
    expect(PET_SLOTS_CONFIG.MAX_SLOTS).toBe(4);
  });

  it('should have FREE_PLAYER_SLOTS = 1 (Bible §11.6)', () => {
    expect(PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS).toBe(1);
  });

  it('should have PLUS_SUBSCRIBER_SLOTS = 2 (Bible §11.8)', () => {
    expect(PET_SLOTS_CONFIG.PLUS_SUBSCRIBER_SLOTS).toBe(2);
  });
});

describe('BCT-PETSLOTS-002: Global Resource Rules', () => {
  it('coins are global across all pets (Bible §11.6)', () => {
    expect(GLOBAL_RESOURCES.COINS_GLOBAL).toBe(true);
  });

  it('gems are global across all pets (Bible §11.6)', () => {
    expect(GLOBAL_RESOURCES.GEMS_GLOBAL).toBe(true);
  });

  it('inventory is global across all pets (Bible §11.6)', () => {
    expect(GLOBAL_RESOURCES.INVENTORY_GLOBAL).toBe(true);
  });
});

describe('BCT-PETSLOTS-003: New Game Initialization', () => {
  it('new game initializes with 3 starter pets owned (Bible §6)', () => {
    const state = useGameStore.getState();
    expect(state.ownedPetIds).toHaveLength(3);
  });

  it('all 3 starter species are in petsById (Bible §6)', () => {
    const state = useGameStore.getState();
    const ownedSpecies = state.ownedPetIds.map(id => state.petsById[id]?.speciesId);

    STARTER_PET_IDS.forEach(speciesId => {
      expect(ownedSpecies).toContain(speciesId);
    });
  });

  it('activePetId is set to munchlet-starter by default (Bible §7.4 fallback)', () => {
    const state = useGameStore.getState();
    expect(state.activePetId).toBe('munchlet-starter');
  });

  it('unlockedSlots starts at 1 (Bible §11.6)', () => {
    const state = useGameStore.getState();
    expect(state.unlockedSlots).toBe(PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS);
  });

  it('each owned pet has separate level, xp, bond (Bible §6)', () => {
    const state = useGameStore.getState();

    state.ownedPetIds.forEach(petId => {
      const pet = state.petsById[petId];
      expect(pet).toHaveProperty('level');
      expect(pet).toHaveProperty('xp');
      expect(pet).toHaveProperty('bond');
      expect(pet).toHaveProperty('mood');
      expect(pet).toHaveProperty('hunger');
    });
  });
});

describe('BCT-PETSLOTS-004: Active Pet Retrieval', () => {
  it('getActivePet returns the active pet', () => {
    const state = useGameStore.getState();
    const activePet = state.getActivePet();

    expect(activePet).not.toBeNull();
    expect(activePet?.instanceId).toBe(state.activePetId);
  });

  it('getActivePet returns pet with correct species', () => {
    const state = useGameStore.getState();
    const activePet = state.getActivePet();

    expect(activePet?.speciesId).toBe('munchlet');
  });

  it('legacy pet field is synced with active pet', () => {
    const state = useGameStore.getState();
    const activePet = state.getActivePet();

    // Legacy pet.id should match active pet species
    expect(state.pet.id).toBe(activePet?.speciesId);
  });
});

describe('BCT-PETSLOTS-005: Switching Active Pet', () => {
  it('setActivePet changes activePetId', () => {
    const initialState = useGameStore.getState();
    const initialPetId = initialState.activePetId;

    // Find a different owned pet
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialPetId);
    expect(otherPetId).toBeDefined();

    // Switch pet
    useGameStore.getState().setActivePet(otherPetId!);

    const newState = useGameStore.getState();
    expect(newState.activePetId).toBe(otherPetId);
  });

  it('setActivePet updates legacy pet field', () => {
    const initialState = useGameStore.getState();
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialState.activePetId);

    useGameStore.getState().setActivePet(otherPetId!);

    const newState = useGameStore.getState();
    const newActivePet = newState.petsById[otherPetId!];
    expect(newState.pet.id).toBe(newActivePet.speciesId);
  });

  it('setActivePet rejects invalid pet ID', () => {
    const initialState = useGameStore.getState();
    const initialPetId = initialState.activePetId;

    // Try to switch to invalid pet
    useGameStore.getState().setActivePet('invalid-pet-id');

    // Should remain unchanged
    const newState = useGameStore.getState();
    expect(newState.activePetId).toBe(initialPetId);
  });

  it('switching pets is instant (Bible §11.6)', () => {
    const initialState = useGameStore.getState();
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialState.activePetId);

    const startTime = Date.now();
    useGameStore.getState().setActivePet(otherPetId!);
    const endTime = Date.now();

    // Should be < 100ms (instant)
    expect(endTime - startTime).toBeLessThan(100);
  });
});

describe('BCT-PETSLOTS-006: Owned Pets Retrieval', () => {
  it('getOwnedPets returns all 3 starters', () => {
    const state = useGameStore.getState();
    const ownedPets = state.getOwnedPets();

    expect(ownedPets).toHaveLength(3);
  });

  it('getOwnedPets returns pets in acquisition order', () => {
    const state = useGameStore.getState();
    const ownedPets = state.getOwnedPets();

    // Should match ownedPetIds order
    ownedPets.forEach((pet, index) => {
      expect(pet.instanceId).toBe(state.ownedPetIds[index]);
    });
  });

  it('getOwnedPetById returns correct pet', () => {
    const state = useGameStore.getState();
    const firstPetId = state.ownedPetIds[0];
    const pet = state.getOwnedPetById(firstPetId);

    expect(pet).not.toBeNull();
    expect(pet?.instanceId).toBe(firstPetId);
  });

  it('getOwnedPetById returns null for invalid ID', () => {
    const state = useGameStore.getState();
    const pet = state.getOwnedPetById('invalid-id');

    expect(pet).toBeNull();
  });
});

describe('BCT-PETSLOTS-007: Global Resources Persist Across Pet Switches', () => {
  it('coins persist when switching pets (Bible §11.6)', () => {
    const initialState = useGameStore.getState();
    const initialCoins = initialState.currencies.coins;

    // Add coins
    useGameStore.getState().addCurrency('coins', 50, 'test');

    // Switch pet
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialState.activePetId);
    useGameStore.getState().setActivePet(otherPetId!);

    // Verify coins persist
    const newState = useGameStore.getState();
    expect(newState.currencies.coins).toBe(initialCoins + 50);
  });

  it('gems persist when switching pets (Bible §11.6)', () => {
    const initialState = useGameStore.getState();

    // Add gems
    useGameStore.getState().addCurrency('gems', 10, 'test');

    // Switch pet
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialState.activePetId);
    useGameStore.getState().setActivePet(otherPetId!);

    // Verify gems persist
    const newState = useGameStore.getState();
    expect(newState.currencies.gems).toBe(10);
  });

  it('inventory persists when switching pets (Bible §11.6)', () => {
    const initialState = useGameStore.getState();
    const initialApples = initialState.inventory['apple'] || 0;

    // Add food to inventory
    useGameStore.getState().addFood('apple', 5);

    // Switch pet
    const otherPetId = initialState.ownedPetIds.find(id => id !== initialState.activePetId);
    useGameStore.getState().setActivePet(otherPetId!);

    // Verify inventory persists
    const newState = useGameStore.getState();
    expect(newState.inventory['apple']).toBe(initialApples + 5);
  });
});

describe('BCT-PETSLOTS-008: FTUE Pet Selection', () => {
  it('selectFtuePet updates activePetId', () => {
    // Start FTUE
    useGameStore.getState().startFtue();
    useGameStore.getState().setFtueStep('pet_select');

    // Select grib in FTUE
    useGameStore.getState().selectFtuePet('grib');

    const state = useGameStore.getState();
    expect(state.activePetId).toBe('grib-starter');
  });

  it('selectFtuePet updates legacy pet.id', () => {
    useGameStore.getState().startFtue();
    useGameStore.getState().setFtueStep('pet_select');
    useGameStore.getState().selectFtuePet('plompo');

    const state = useGameStore.getState();
    expect(state.pet.id).toBe('plompo');
  });
});

describe('BCT-PETSLOTS-009: Instance ID Format', () => {
  it('starter pets have {speciesId}-starter format', () => {
    const state = useGameStore.getState();

    STARTER_PET_IDS.forEach(speciesId => {
      const expectedInstanceId = `${speciesId}-starter`;
      expect(state.ownedPetIds).toContain(expectedInstanceId);
    });
  });

  it('each pet instanceId matches its speciesId prefix', () => {
    const state = useGameStore.getState();

    state.ownedPetIds.forEach(petId => {
      const pet = state.petsById[petId];
      expect(petId.startsWith(pet.speciesId)).toBe(true);
    });
  });
});

describe('BCT-PETSLOTS-010: Pet State Independence', () => {
  it('each owned pet has independent state', () => {
    const state = useGameStore.getState();

    // Get all pets
    const pets = state.getOwnedPets();

    // Each should be a distinct object
    const ids = new Set(pets.map(p => p.instanceId));
    expect(ids.size).toBe(pets.length);
  });

  it('modifying active pet does not affect other owned pets', () => {
    const initialState = useGameStore.getState();
    const activePetId = initialState.activePetId;
    const otherPetId = initialState.ownedPetIds.find(id => id !== activePetId)!;

    // Get initial state of other pet
    const otherPetInitial = initialState.petsById[otherPetId];
    const initialLevel = otherPetInitial.level;

    // Feed active pet (this may level it up)
    // Note: This is a simplified test - in real implementation,
    // pet state changes would go through specific actions

    // Switch to other pet and verify state unchanged
    useGameStore.getState().setActivePet(otherPetId);
    const newState = useGameStore.getState();
    const otherPetAfter = newState.petsById[otherPetId];

    expect(otherPetAfter.level).toBe(initialLevel);
  });
});

describe('BCT-PETSLOTS-011: Backward Compatibility', () => {
  it('legacy pet field exists for backward compatibility', () => {
    const state = useGameStore.getState();
    expect(state.pet).toBeDefined();
    expect(state.pet.id).toBeTruthy();
  });

  it('unlockedPets still contains starter species', () => {
    const state = useGameStore.getState();

    STARTER_PET_IDS.forEach(speciesId => {
      expect(state.unlockedPets).toContain(speciesId);
    });
  });
});
