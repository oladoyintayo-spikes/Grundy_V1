// ============================================
// GRUNDY — ABILITY UNIT TESTS
// Tests for pet ability effects (Bible §3.7)
// ============================================

import { describe, it, expect, vi } from 'vitest';
import {
  hasAbilityEffect,
  getAbilityValue,
  applyBondBonus,
  applyMoodPenaltyReduction,
  applyDecayReduction,
  applyMinigameBonus,
  applySpicyCoinBonus,
  applyNoDislikesAbility,
  applyRareXPChance,
  applyGemMultiplier,
  isSpicyFood,
} from '../game/abilities';
import { getFoodById } from '../data/foods';

describe('ability system', () => {
  describe('hasAbilityEffect', () => {
    it('returns true for Munchlet bond_bonus', () => {
      expect(hasAbilityEffect('munchlet', 'bond_bonus')).toBe(true);
    });

    it('returns true for Grib mood_penalty_reduction', () => {
      expect(hasAbilityEffect('grib', 'mood_penalty_reduction')).toBe(true);
    });

    it('returns true for Plompo decay_reduction', () => {
      expect(hasAbilityEffect('plompo', 'decay_reduction')).toBe(true);
    });

    it('returns true for Fizz minigame_bonus', () => {
      expect(hasAbilityEffect('fizz', 'minigame_bonus')).toBe(true);
    });

    it('returns true for Ember spicy_coin_bonus', () => {
      expect(hasAbilityEffect('ember', 'spicy_coin_bonus')).toBe(true);
    });

    it('returns true for Chomper no_dislikes', () => {
      expect(hasAbilityEffect('chomper', 'no_dislikes')).toBe(true);
    });

    it('returns true for Whisp rare_xp_chance', () => {
      expect(hasAbilityEffect('whisp', 'rare_xp_chance')).toBe(true);
    });

    it('returns true for Luxe gem_multiplier', () => {
      expect(hasAbilityEffect('luxe', 'gem_multiplier')).toBe(true);
    });

    it('returns false for non-existent ability', () => {
      expect(hasAbilityEffect('munchlet', 'gem_multiplier')).toBe(false);
      expect(hasAbilityEffect('grib', 'bond_bonus')).toBe(false);
    });

    it('returns false for non-existent pet', () => {
      expect(hasAbilityEffect('nonexistent', 'bond_bonus')).toBe(false);
    });
  });

  describe('getAbilityValue', () => {
    it('returns 0.10 for Munchlet bond_bonus', () => {
      expect(getAbilityValue('munchlet', 'bond_bonus')).toBe(0.10);
    });

    it('returns 0.20 for Grib mood_penalty_reduction', () => {
      expect(getAbilityValue('grib', 'mood_penalty_reduction')).toBe(0.20);
    });

    it('returns 0.20 for Plompo decay_reduction', () => {
      expect(getAbilityValue('plompo', 'decay_reduction')).toBe(0.20);
    });

    it('returns 0.25 for Fizz minigame_bonus', () => {
      expect(getAbilityValue('fizz', 'minigame_bonus')).toBe(0.25);
    });

    it('returns 2.0 for Ember spicy_coin_bonus', () => {
      expect(getAbilityValue('ember', 'spicy_coin_bonus')).toBe(2.0);
    });

    it('returns 1.0 for Chomper no_dislikes', () => {
      expect(getAbilityValue('chomper', 'no_dislikes')).toBe(1.0);
    });

    it('returns 0.50 for Whisp rare_xp_chance', () => {
      expect(getAbilityValue('whisp', 'rare_xp_chance')).toBe(0.50);
    });

    it('returns 2.0 for Luxe gem_multiplier', () => {
      expect(getAbilityValue('luxe', 'gem_multiplier')).toBe(2.0);
    });

    it('returns 0 for non-matching ability type', () => {
      expect(getAbilityValue('munchlet', 'gem_multiplier')).toBe(0);
    });
  });

  describe('applyBondBonus (Munchlet)', () => {
    it('adds 10% for Munchlet', () => {
      const baseBond = 10;
      const result = applyBondBonus('munchlet', baseBond);
      expect(result).toBe(11); // 10 * 1.10 = 11
    });

    it('returns base value for other pets', () => {
      const baseBond = 10;
      expect(applyBondBonus('grib', baseBond)).toBe(10);
      expect(applyBondBonus('plompo', baseBond)).toBe(10);
      expect(applyBondBonus('luxe', baseBond)).toBe(10);
    });

    it('handles zero bond', () => {
      expect(applyBondBonus('munchlet', 0)).toBe(0);
    });
  });

  describe('applyMoodPenaltyReduction (Grib)', () => {
    it('reduces mood penalty by 20% for Grib', () => {
      const basePenalty = 10;
      const result = applyMoodPenaltyReduction('grib', basePenalty);
      expect(result).toBe(8); // 10 * 0.80 = 8
    });

    it('returns base value for other pets', () => {
      const basePenalty = 10;
      expect(applyMoodPenaltyReduction('munchlet', basePenalty)).toBe(10);
      expect(applyMoodPenaltyReduction('plompo', basePenalty)).toBe(10);
    });

    it('handles zero penalty', () => {
      expect(applyMoodPenaltyReduction('grib', 0)).toBe(0);
    });
  });

  describe('applyDecayReduction (Plompo)', () => {
    it('reduces decay by 20% for Plompo', () => {
      const baseDecay = 10;
      const result = applyDecayReduction('plompo', baseDecay);
      expect(result).toBe(8); // 10 * 0.80 = 8
    });

    it('returns base value for other pets', () => {
      const baseDecay = 10;
      expect(applyDecayReduction('munchlet', baseDecay)).toBe(10);
      expect(applyDecayReduction('grib', baseDecay)).toBe(10);
    });

    it('handles zero decay', () => {
      expect(applyDecayReduction('plompo', 0)).toBe(0);
    });
  });

  describe('applyMinigameBonus (Fizz)', () => {
    it('adds 25% for Fizz', () => {
      const baseScore = 100;
      const result = applyMinigameBonus('fizz', baseScore);
      expect(result).toBe(125); // 100 * 1.25 = 125
    });

    it('returns base value for other pets', () => {
      const baseScore = 100;
      expect(applyMinigameBonus('munchlet', baseScore)).toBe(100);
      expect(applyMinigameBonus('grib', baseScore)).toBe(100);
    });

    it('rounds result to integer', () => {
      const baseScore = 33;
      const result = applyMinigameBonus('fizz', baseScore);
      expect(result).toBe(41); // 33 * 1.25 = 41.25, rounded to 41
    });
  });

  describe('isSpicyFood', () => {
    it('returns true for spicy_taco', () => {
      const taco = getFoodById('spicy_taco')!;
      expect(isSpicyFood(taco)).toBe(true);
    });

    it('returns true for hot_pepper', () => {
      const pepper = getFoodById('hot_pepper')!;
      expect(isSpicyFood(pepper)).toBe(true);
    });

    it('returns false for apple', () => {
      const apple = getFoodById('apple')!;
      expect(isSpicyFood(apple)).toBe(false);
    });

    it('returns false for birthday_cake', () => {
      const cake = getFoodById('birthday_cake')!;
      expect(isSpicyFood(cake)).toBe(false);
    });
  });

  describe('applySpicyCoinBonus (Ember)', () => {
    it('doubles coins for Ember with spicy food', () => {
      const taco = getFoodById('spicy_taco')!;
      const baseCoins = 10;
      const result = applySpicyCoinBonus('ember', taco, baseCoins);
      expect(result).toBe(20); // 10 * 2 = 20
    });

    it('returns base coins for Ember with non-spicy food', () => {
      const apple = getFoodById('apple')!;
      const baseCoins = 10;
      const result = applySpicyCoinBonus('ember', apple, baseCoins);
      expect(result).toBe(10);
    });

    it('returns base coins for other pets with spicy food', () => {
      const taco = getFoodById('spicy_taco')!;
      const baseCoins = 10;
      expect(applySpicyCoinBonus('munchlet', taco, baseCoins)).toBe(10);
      expect(applySpicyCoinBonus('grib', taco, baseCoins)).toBe(10);
    });
  });

  describe('applyNoDislikesAbility (Chomper)', () => {
    it('converts dislike to neutral for Chomper', () => {
      const result = applyNoDislikesAbility('chomper', 'disliked');
      expect(result).toBe('neutral');
    });

    it('keeps liked affinity for Chomper', () => {
      expect(applyNoDislikesAbility('chomper', 'liked')).toBe('liked');
    });

    it('keeps loved affinity for Chomper', () => {
      expect(applyNoDislikesAbility('chomper', 'loved')).toBe('loved');
    });

    it('keeps neutral affinity for Chomper', () => {
      expect(applyNoDislikesAbility('chomper', 'neutral')).toBe('neutral');
    });

    it('keeps original disliked affinity for other pets', () => {
      expect(applyNoDislikesAbility('munchlet', 'disliked')).toBe('disliked');
      expect(applyNoDislikesAbility('grib', 'disliked')).toBe('disliked');
    });
  });

  describe('applyRareXPChance (Whisp)', () => {
    it('returns base XP when random fails for Whisp', () => {
      // Mock Math.random to return a high value (no rare drop)
      vi.spyOn(Math, 'random').mockReturnValue(0.99);

      const baseXP = 100;
      const result = applyRareXPChance('whisp', baseXP);
      expect(result).toBe(100);

      vi.restoreAllMocks();
    });

    it('returns bonus XP when random succeeds for Whisp', () => {
      // Mock Math.random to return a low value (rare drop triggers)
      // totalChance = 0.10 + (0.10 * 0.50) = 0.15
      vi.spyOn(Math, 'random').mockReturnValue(0.05);

      const baseXP = 100;
      const result = applyRareXPChance('whisp', baseXP);
      expect(result).toBe(150); // 100 * 1.5 = 150

      vi.restoreAllMocks();
    });

    it('returns base XP for other pets', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.05);

      const baseXP = 100;
      expect(applyRareXPChance('munchlet', baseXP)).toBe(100);
      expect(applyRareXPChance('grib', baseXP)).toBe(100);

      vi.restoreAllMocks();
    });
  });

  describe('applyGemMultiplier (Luxe)', () => {
    it('doubles gems for Luxe', () => {
      const baseGems = 5;
      const result = applyGemMultiplier('luxe', baseGems);
      expect(result).toBe(10); // 5 * 2 = 10
    });

    it('returns base gems for other pets', () => {
      const baseGems = 5;
      expect(applyGemMultiplier('munchlet', baseGems)).toBe(5);
      expect(applyGemMultiplier('grib', baseGems)).toBe(5);
    });

    it('handles zero gems', () => {
      expect(applyGemMultiplier('luxe', 0)).toBe(0);
    });

    it('rounds result to integer', () => {
      const baseGems = 3;
      const result = applyGemMultiplier('luxe', baseGems);
      expect(result).toBe(6); // 3 * 2 = 6
    });
  });

  describe('ability coverage', () => {
    it('each pet has a unique ability type', () => {
      const abilityTypes = [
        { pet: 'munchlet', type: 'bond_bonus' },
        { pet: 'grib', type: 'mood_penalty_reduction' },
        { pet: 'plompo', type: 'decay_reduction' },
        { pet: 'fizz', type: 'minigame_bonus' },
        { pet: 'ember', type: 'spicy_coin_bonus' },
        { pet: 'chomper', type: 'no_dislikes' },
        { pet: 'whisp', type: 'rare_xp_chance' },
        { pet: 'luxe', type: 'gem_multiplier' },
      ];

      abilityTypes.forEach(({ pet, type }) => {
        expect(hasAbilityEffect(pet, type as any)).toBe(true);
      });

      // Verify uniqueness - no two pets share the same ability type
      const types = abilityTypes.map(a => a.type);
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(8);
    });
  });
});
