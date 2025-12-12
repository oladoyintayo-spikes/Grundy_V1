// ============================================
// GRUNDY — DATA VALIDATION TESTS
// Validates pets.ts and foods.ts data integrity
// ============================================

import { describe, it, expect } from 'vitest';
import { PETS, STARTER_PETS, UNLOCK_PETS, getAllPets, getPetById } from '../data/pets';
import { FOODS, getAllFoods, getFoodById, getAffinityForPet } from '../data/foods';

describe('pets data', () => {
  const allPets = getAllPets();
  const allPetIds = Object.keys(PETS);

  it('should have exactly 8 pets', () => {
    expect(allPets.length).toBe(8);
    expect(allPetIds.length).toBe(8);
  });

  it('should have valid IDs for all pets', () => {
    const expectedIds = ['munchlet', 'grib', 'plompo', 'fizz', 'ember', 'chomper', 'whisp', 'luxe'];

    expectedIds.forEach(id => {
      expect(allPetIds).toContain(id);
      const pet = getPetById(id);
      expect(pet).toBeDefined();
      expect(pet?.id).toBe(id);
    });
  });

  it('should have abilities defined for all pets', () => {
    allPets.forEach(pet => {
      expect(pet.ability).toBeDefined();
      expect(pet.ability.id).toBeTruthy();
      expect(pet.ability.name).toBeTruthy();
      expect(pet.ability.description).toBeTruthy();
      expect(pet.ability.effect).toBeDefined();
      expect(pet.ability.effect.type).toBeTruthy();
      expect(typeof pet.ability.effect.value).toBe('number');
    });
  });

  it('should have correct starter pets (munchlet, grib, plompo)', () => {
    expect(STARTER_PETS).toEqual(['munchlet', 'grib', 'plompo']);
    expect(STARTER_PETS.length).toBe(3);

    STARTER_PETS.forEach(id => {
      const pet = getPetById(id);
      expect(pet).toBeDefined();
      expect(pet?.unlockRequirement.type).toBe('free');
    });
  });

  it('should have correct unlock pets (fizz, ember, chomper, whisp, luxe)', () => {
    expect(UNLOCK_PETS).toEqual(['fizz', 'ember', 'chomper', 'whisp', 'luxe']);
    expect(UNLOCK_PETS.length).toBe(5);

    UNLOCK_PETS.forEach(id => {
      const pet = getPetById(id);
      expect(pet).toBeDefined();
      expect(pet?.unlockRequirement.type).not.toBe('free');
    });
  });

  it('should have unlock requirements for all pets', () => {
    allPets.forEach(pet => {
      expect(pet.unlockRequirement).toBeDefined();
      expect(pet.unlockRequirement.type).toBeTruthy();
    });
  });

  it('should have captions defined for all pets', () => {
    allPets.forEach(pet => {
      expect(pet.captions).toBeDefined();
      expect(pet.captions.idle.length).toBeGreaterThan(0);
      expect(pet.captions.petting.length).toBeGreaterThan(0);
      expect(pet.captions.positive.length).toBeGreaterThan(0);
      expect(pet.captions.neutral.length).toBeGreaterThan(0);
      expect(pet.captions.negative.length).toBeGreaterThan(0);
    });
  });

  it('should have required fields for all pets', () => {
    allPets.forEach(pet => {
      expect(pet.id).toBeTruthy();
      expect(pet.name).toBeTruthy();
      expect(pet.emoji).toBeTruthy();
      expect(pet.color).toBeTruthy();
      expect(pet.personality).toBeTruthy();
      expect(Array.isArray(pet.likes)).toBe(true);
      expect(Array.isArray(pet.dislikes)).toBe(true);
    });
  });
});

describe('foods data', () => {
  const allFoods = getAllFoods();
  const allFoodIds = Object.keys(FOODS);
  const allPetIds = Object.keys(PETS);

  it('should have exactly 13 foods', () => {
    // 10 original + lollipop, candy, ice_cream (added in P8-SHOP-PURCHASE)
    expect(allFoods.length).toBe(13);
    expect(allFoodIds.length).toBe(13);
  });

  it('should have affinities for all 8 pets', () => {
    allFoods.forEach(food => {
      expect(food.affinity).toBeDefined();

      allPetIds.forEach(petId => {
        const affinity = getAffinityForPet(food.id, petId);
        expect(affinity).toBeDefined();
        expect(['loved', 'liked', 'neutral', 'disliked']).toContain(affinity);
      });
    });
  });

  it('should have valid prices for all foods', () => {
    allFoods.forEach(food => {
      expect(typeof food.coinCost).toBe('number');
      expect(typeof food.gemCost).toBe('number');
      expect(food.coinCost >= 0).toBe(true);
      expect(food.gemCost >= 0).toBe(true);
      // At least one currency cost should be set
      expect(food.coinCost > 0 || food.gemCost > 0).toBe(true);
    });
  });

  it('should have valid rarities', () => {
    const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

    allFoods.forEach(food => {
      expect(validRarities).toContain(food.rarity);
    });
  });

  it('should have valid stat values', () => {
    allFoods.forEach(food => {
      expect(typeof food.hunger).toBe('number');
      expect(typeof food.mood).toBe('number');
      expect(typeof food.xp).toBe('number');
      expect(typeof food.bond).toBe('number');
      expect(food.hunger > 0).toBe(true);
      expect(food.xp > 0).toBe(true);
    });
  });

  it('should have required fields for all foods', () => {
    allFoods.forEach(food => {
      expect(food.id).toBeTruthy();
      expect(food.name).toBeTruthy();
      expect(food.description).toBeTruthy();
      expect(food.emoji).toBeTruthy();
    });
  });

  it('should have foods of all rarities', () => {
    const rarities = new Set(allFoods.map(f => f.rarity));

    expect(rarities.has('common')).toBe(true);
    expect(rarities.has('uncommon')).toBe(true);
    expect(rarities.has('rare')).toBe(true);
    expect(rarities.has('epic')).toBe(true);
    expect(rarities.has('legendary')).toBe(true);
  });

  it('should have 104 total affinity entries (13 foods × 8 pets)', () => {
    let totalEntries = 0;

    allFoods.forEach(food => {
      const affinityKeys = Object.keys(food.affinity);
      totalEntries += affinityKeys.length;
    });

    // 13 foods × 8 pets = 104
    expect(totalEntries).toBe(104);
  });
});
