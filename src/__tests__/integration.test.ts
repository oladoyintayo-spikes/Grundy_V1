// ============================================
// GRUNDY — INTEGRATION TESTS
// Tests for feed flow and unlock flow
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../game/store';
import {
  processFeed,
  calculateReaction,
  calculateBondChange,
  calculateCoinReward,
  decayHunger,
} from '../game/systems';
import { getFoodById, STARTING_INVENTORY } from '../data/foods';
import { STARTER_PETS, getPetById } from '../data/pets';

describe('feed integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('Munchlet ability: +10% bond from feeding', () => {
    it('Munchlet gets +10% bond from feeding', () => {
      const food = getFoodById('apple')!;
      const reaction = calculateReaction('munchlet', food);

      // Calculate bond without ability
      const baseBond = food.bond;
      const bondWithAbility = calculateBondChange(food, reaction, 'munchlet');
      const bondWithoutAbility = calculateBondChange(food, reaction);

      // Only 'ecstatic' gets the 1.5x multiplier, not 'positive'
      // So for munchlet: bond * 1.10 (ability bonus)
      // The ability adds +10% to whatever the base calculation produces
      expect(bondWithAbility).toBeCloseTo(bondWithoutAbility * 1.10, 2);
    });

    it('other pets do not get bond bonus', () => {
      const food = getFoodById('apple')!;
      const reactionGrib = calculateReaction('grib', food);
      const bondGrib = calculateBondChange(food, reactionGrib, 'grib');
      const bondNoAbility = calculateBondChange(food, reactionGrib);

      expect(bondGrib).toBe(bondNoAbility);
    });
  });

  describe('Plompo ability: -20% hunger decay', () => {
    it('Plompo has slower hunger decay', () => {
      const initialHunger = 50;
      const minutes = 10;

      // Decay without ability
      const decayWithoutAbility = decayHunger(initialHunger, minutes);

      // Decay with Plompo's ability
      const decayWithAbility = decayHunger(initialHunger, minutes, 'plompo');

      // Plompo should lose less hunger (20% less decay)
      expect(decayWithAbility).toBeGreaterThan(decayWithoutAbility);

      // The difference should be 20% of the decay
      const normalDecay = initialHunger - decayWithoutAbility;
      const plompoDecay = initialHunger - decayWithAbility;
      expect(plompoDecay).toBeCloseTo(normalDecay * 0.8, 1);
    });

    it('other pets decay at normal rate', () => {
      const initialHunger = 50;
      const minutes = 10;

      const decayWithoutAbility = decayHunger(initialHunger, minutes);
      const decayMunchlet = decayHunger(initialHunger, minutes, 'munchlet');

      expect(decayMunchlet).toBe(decayWithoutAbility);
    });
  });

  describe('Chomper ability: no negative reactions', () => {
    it('Chomper has no negative reactions from disliked foods', () => {
      // Banana is disliked by some pets but Chomper should convert it to neutral
      const banana = getFoodById('banana')!;

      // For Whisp, banana is disliked (common food)
      const reactionWhisp = calculateReaction('whisp', banana);
      expect(reactionWhisp).toBe('negative');

      // For Chomper, even if food would be disliked, it becomes neutral or better
      const reactionChomper = calculateReaction('chomper', banana);
      expect(reactionChomper).not.toBe('negative');
    });

    it('Chomper converts disliked affinity to neutral', () => {
      // Find a food that Chomper would normally dislike
      // Actually Chomper likes everything per data, but the ability ensures no negatives
      const cookie = getFoodById('cookie')!;
      const reaction = calculateReaction('chomper', cookie);

      // Should never be negative
      expect(['ecstatic', 'positive', 'neutral']).toContain(reaction);
    });
  });

  describe('Ember ability: 2x coins from spicy foods', () => {
    it('Ember gets 2x coins from spicy food', () => {
      const taco = getFoodById('spicy_taco')!;
      const reaction = calculateReaction('ember', taco);

      const coinsEmber = calculateCoinReward(reaction, 'ember', taco);
      const coinsNormal = calculateCoinReward(reaction);

      // Ember should get 2x coins from spicy food
      expect(coinsEmber).toBe(coinsNormal * 2);
    });

    it('Ember gets normal coins from non-spicy food', () => {
      const apple = getFoodById('apple')!;
      const reaction = calculateReaction('ember', apple);

      const coinsEmber = calculateCoinReward(reaction, 'ember', apple);
      const coinsNormal = calculateCoinReward(reaction);

      expect(coinsEmber).toBe(coinsNormal);
    });
  });

  describe('feed flow with store', () => {
    it('feeding updates stats correctly', () => {
      const store = useGameStore.getState();
      const initialFeeds = store.stats.totalFeeds;

      // Add food to inventory
      store.addFood('apple', 1);

      // Feed
      const result = store.feed('apple');

      const newState = useGameStore.getState();
      expect(newState.stats.totalFeeds).toBe(initialFeeds + 1);
      expect(result?.success).toBe(true);
    });

    it('feeding without inventory fails', () => {
      const store = useGameStore.getState();

      // Ensure no golden_feast in inventory
      const result = store.feed('golden_feast');

      expect(result).toBeNull();
    });
  });
});

describe('unlock integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('starter pets', () => {
    it('starters are unlocked by default', () => {
      const state = useGameStore.getState();

      expect(state.unlockedPets).toContain('munchlet');
      expect(state.unlockedPets).toContain('grib');
      expect(state.unlockedPets).toContain('plompo');
    });

    it('starter pets have free unlock requirement', () => {
      STARTER_PETS.forEach(petId => {
        const pet = getPetById(petId);
        expect(pet?.unlockRequirement.type).toBe('free');
      });
    });

    it('exactly 3 pets are unlocked at start', () => {
      const state = useGameStore.getState();
      expect(state.unlockedPets.length).toBe(3);
    });
  });

  describe('unlock pets', () => {
    it('Fizz requires bond level 25 or 50 gems', () => {
      const fizz = getPetById('fizz');
      expect(fizz?.unlockRequirement.type).toBe('bond_level');
      expect(fizz?.unlockRequirement.value).toBe(25);
      expect(fizz?.unlockRequirement.gemSkipCost).toBe(50);
    });

    it('Ember requires bond level 50 or 75 gems', () => {
      const ember = getPetById('ember');
      expect(ember?.unlockRequirement.type).toBe('bond_level');
      expect(ember?.unlockRequirement.value).toBe(50);
      expect(ember?.unlockRequirement.gemSkipCost).toBe(75);
    });

    it('Chomper requires 10 minigames or 100 gems', () => {
      const chomper = getPetById('chomper');
      expect(chomper?.unlockRequirement.type).toBe('minigames_completed');
      expect(chomper?.unlockRequirement.value).toBe(10);
      expect(chomper?.unlockRequirement.gemSkipCost).toBe(100);
    });

    it('Whisp requires bond level 75 or 125 gems', () => {
      const whisp = getPetById('whisp');
      expect(whisp?.unlockRequirement.type).toBe('bond_level');
      expect(whisp?.unlockRequirement.value).toBe(75);
      expect(whisp?.unlockRequirement.gemSkipCost).toBe(125);
    });

    it('Luxe is premium only (150 gems)', () => {
      const luxe = getPetById('luxe');
      expect(luxe?.unlockRequirement.type).toBe('premium');
      expect(luxe?.unlockRequirement.gemSkipCost).toBe(150);
    });
  });

  describe('unlockPetWithGems', () => {
    it('can unlock Fizz with gems', () => {
      const store = useGameStore.getState();

      // Give enough gems (BCT-ECON-002: start with 0 gems)
      store.addCurrency('gems', 100, 'test');

      const result = store.unlockPetWithGems('fizz');

      const newState = useGameStore.getState();
      expect(result).toBe(true);
      expect(newState.unlockedPets).toContain('fizz');
      expect(newState.currencies.gems).toBe(100 - 50); // Started with 0, added 100, spent 50
    });

    it('cannot unlock with insufficient gems', () => {
      const store = useGameStore.getState();

      // Default 0 gems is not enough for Fizz (50) - BCT-ECON-002
      const result = store.unlockPetWithGems('fizz');

      const newState = useGameStore.getState();
      expect(result).toBe(false);
      expect(newState.unlockedPets).not.toContain('fizz');
    });

    it('cannot unlock already unlocked pet', () => {
      const store = useGameStore.getState();

      const result = store.unlockPetWithGems('munchlet');

      expect(result).toBe(false);
    });
  });

  describe('isPetUnlocked', () => {
    it('returns true for starter pets', () => {
      const store = useGameStore.getState();

      expect(store.isPetUnlocked('munchlet')).toBe(true);
      expect(store.isPetUnlocked('grib')).toBe(true);
      expect(store.isPetUnlocked('plompo')).toBe(true);
    });

    it('returns false for locked pets', () => {
      const store = useGameStore.getState();

      expect(store.isPetUnlocked('fizz')).toBe(false);
      expect(store.isPetUnlocked('ember')).toBe(false);
      expect(store.isPetUnlocked('luxe')).toBe(false);
    });
  });

  describe('selectPet', () => {
    it('can select different pet', () => {
      const store = useGameStore.getState();

      store.selectPet('grib');

      const newState = useGameStore.getState();
      expect(newState.pet.id).toBe('grib');
    });
  });
});
