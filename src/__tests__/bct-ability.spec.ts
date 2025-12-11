/**
 * Bible Compliance Tests: Pet Abilities (P1-ABILITY-4)
 * Tests ability trigger indicators per Bible §3.7, §4.10
 *
 * BCT-ABILITY-01: Ability triggers are stored in state
 * BCT-ABILITY-02: Ability triggers auto-expire
 * BCT-ABILITY-03: Each pet has correct ability per Bible §3.2
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  hasAbilityEffect,
  getAbilityValue,
  applyBondBonus,
  applyMoodPenaltyReduction,
  applyMoodDecayReduction,
  applyMinigameBonus,
  applySpicyCoinBonus,
  applyNoDislikesAbility,
  applyRareXPChance,
  applyGemMultiplier,
} from '../game/abilities';
import type { AbilityTrigger } from '../types';

describe('BCT-ABILITY: Pet Abilities (P1-ABILITY-4)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('BCT-ABILITY-01: Ability triggers are stored in state', () => {
    it('initial state has empty abilityTriggers array', () => {
      const triggers = useGameStore.getState().abilityTriggers;
      expect(triggers).toEqual([]);
    });

    it('addAbilityTrigger adds to state', () => {
      const trigger: AbilityTrigger = {
        id: 'bond_bonus',
        abilityName: 'Comfort Food',
        message: '+10% bond gained!',
        triggeredAt: Date.now(),
      };

      useGameStore.getState().addAbilityTrigger(trigger);

      const triggers = useGameStore.getState().abilityTriggers;
      expect(triggers).toHaveLength(1);
      expect(triggers[0]).toEqual(trigger);
    });

    it('multiple triggers stack correctly', () => {
      const trigger1: AbilityTrigger = {
        id: 'bond_bonus',
        abilityName: 'Comfort Food',
        message: '+10% bond!',
        triggeredAt: Date.now(),
      };
      const trigger2: AbilityTrigger = {
        id: 'mood_penalty_reduction',
        abilityName: 'Chill Vibes',
        message: '-20% mood penalty!',
        triggeredAt: Date.now() + 100,
      };

      useGameStore.getState().addAbilityTrigger(trigger1);
      useGameStore.getState().addAbilityTrigger(trigger2);

      const triggers = useGameStore.getState().abilityTriggers;
      expect(triggers).toHaveLength(2);
    });
  });

  describe('BCT-ABILITY-02: Ability triggers auto-expire', () => {
    it('clearExpiredAbilityTriggers removes old triggers', () => {
      const oldTrigger: AbilityTrigger = {
        id: 'test',
        abilityName: 'Test',
        message: 'Old',
        triggeredAt: Date.now() - 5000, // 5 seconds ago (expired)
      };
      const newTrigger: AbilityTrigger = {
        id: 'test2',
        abilityName: 'Test2',
        message: 'New',
        triggeredAt: Date.now(), // Just now (not expired)
      };

      useGameStore.getState().addAbilityTrigger(oldTrigger);
      useGameStore.getState().addAbilityTrigger(newTrigger);

      expect(useGameStore.getState().abilityTriggers).toHaveLength(2);

      useGameStore.getState().clearExpiredAbilityTriggers();

      const remaining = useGameStore.getState().abilityTriggers;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].message).toBe('New');
    });
  });

  describe('BCT-ABILITY-03: Each pet has correct ability per Bible §3.2', () => {
    it('Munchlet has bond_bonus (+10% bond growth)', () => {
      expect(hasAbilityEffect('munchlet', 'bond_bonus')).toBe(true);
      expect(getAbilityValue('munchlet', 'bond_bonus')).toBe(0.1);
    });

    it('Grib has mood_penalty_reduction (-20% mood penalty from dislikes)', () => {
      expect(hasAbilityEffect('grib', 'mood_penalty_reduction')).toBe(true);
      expect(getAbilityValue('grib', 'mood_penalty_reduction')).toBe(0.2);
    });

    it('Plompo has decay_reduction (-20% mood/hunger decay rate)', () => {
      expect(hasAbilityEffect('plompo', 'decay_reduction')).toBe(true);
      expect(getAbilityValue('plompo', 'decay_reduction')).toBe(0.2);
    });

    it('Fizz has minigame_bonus (+25% mini-game rewards)', () => {
      expect(hasAbilityEffect('fizz', 'minigame_bonus')).toBe(true);
      expect(getAbilityValue('fizz', 'minigame_bonus')).toBe(0.25);
    });

    it('Ember has spicy_coin_bonus (2x coins from spicy foods)', () => {
      expect(hasAbilityEffect('ember', 'spicy_coin_bonus')).toBe(true);
      expect(getAbilityValue('ember', 'spicy_coin_bonus')).toBe(2);
    });

    it('Chomper has no_dislikes (all foods neutral+)', () => {
      expect(hasAbilityEffect('chomper', 'no_dislikes')).toBe(true);
      expect(getAbilityValue('chomper', 'no_dislikes')).toBe(1);
    });

    it('Whisp has rare_xp_chance (+50% chance of rare XP)', () => {
      expect(hasAbilityEffect('whisp', 'rare_xp_chance')).toBe(true);
      expect(getAbilityValue('whisp', 'rare_xp_chance')).toBe(0.5);
    });

    it('Luxe has gem_multiplier (+100% gem drops)', () => {
      expect(hasAbilityEffect('luxe', 'gem_multiplier')).toBe(true);
      expect(getAbilityValue('luxe', 'gem_multiplier')).toBe(2);
    });
  });

  describe('BCT-ABILITY-04: Ability application functions work correctly', () => {
    it('applyBondBonus gives Munchlet +10% bond', () => {
      const baseBond = 1.0;
      expect(applyBondBonus('munchlet', baseBond)).toBe(1.1);
      expect(applyBondBonus('grib', baseBond)).toBe(1.0); // No effect
    });

    it('applyMoodPenaltyReduction gives Grib -20% mood penalty', () => {
      const basePenalty = -10;
      expect(applyMoodPenaltyReduction('grib', basePenalty)).toBe(-8);
      expect(applyMoodPenaltyReduction('munchlet', basePenalty)).toBe(-10); // No effect
    });

    it('applyMoodDecayReduction gives Plompo -20% decay rate', () => {
      const baseDecay = 5;
      expect(applyMoodDecayReduction('plompo', baseDecay)).toBe(4);
      expect(applyMoodDecayReduction('munchlet', baseDecay)).toBe(5); // No effect
    });

    it('applyMinigameBonus gives Fizz +25% score', () => {
      const baseScore = 100;
      expect(applyMinigameBonus('fizz', baseScore)).toBe(125);
      expect(applyMinigameBonus('munchlet', baseScore)).toBe(100); // No effect
    });

    it('applyNoDislikesAbility converts disliked to neutral for Chomper', () => {
      expect(applyNoDislikesAbility('chomper', 'disliked')).toBe('neutral');
      expect(applyNoDislikesAbility('chomper', 'liked')).toBe('liked'); // Only converts disliked
      expect(applyNoDislikesAbility('munchlet', 'disliked')).toBe('disliked'); // No effect
    });

    it('applyGemMultiplier gives Luxe 2x gems', () => {
      const baseGems = 5;
      expect(applyGemMultiplier('luxe', baseGems)).toBe(10);
      expect(applyGemMultiplier('munchlet', baseGems)).toBe(5); // No effect
    });
  });
});
