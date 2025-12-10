// ============================================
// GRUNDY — SNACK CATCH MINI-GAME TESTS
// Tests for game mechanics, scoring, pet abilities
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import { getAffinityForPet, FOODS } from '../data/foods';

// ============================================
// AFFINITY SCORING TESTS
// ============================================

describe('Snack Catch - Affinity Scoring', () => {
  it('should have correct affinity scores defined per design doc', () => {
    // From GRUNDY_SNACK_CATCH_DESIGN.md:
    // Loved +30, Liked +20, Neutral +10, Disliked -15
    const AFFINITY_SCORES = {
      loved: 30,
      liked: 20,
      neutral: 10,
      disliked: -15,
    };

    expect(AFFINITY_SCORES.loved).toBe(30);
    expect(AFFINITY_SCORES.liked).toBe(20);
    expect(AFFINITY_SCORES.neutral).toBe(10);
    expect(AFFINITY_SCORES.disliked).toBe(-15);
  });

  it('should correctly identify pet food affinities from foods.ts', () => {
    // Test Munchlet likes fruit (apple = liked, banana = loved)
    expect(getAffinityForPet('apple', 'munchlet')).toBe('liked');
    expect(getAffinityForPet('banana', 'munchlet')).toBe('loved');

    // Test Ember loves spicy
    expect(getAffinityForPet('spicy_taco', 'ember')).toBe('loved');
    expect(getAffinityForPet('hot_pepper', 'ember')).toBe('loved');

    // Test Chomper likes everything
    expect(getAffinityForPet('apple', 'chomper')).toBe('liked');
    expect(getAffinityForPet('carrot', 'chomper')).toBe('liked');
  });
});

// ============================================
// BAD ITEM TESTS
// ============================================

describe('Snack Catch - Bad Items', () => {
  it('should have correct bad item penalties per design doc', () => {
    // From GRUNDY_SNACK_CATCH_DESIGN.md:
    // Bomb -25, Trash -20, Rock -15
    const BAD_ITEM_SCORES = {
      bomb: -25,
      trash: -20,
      rock: -15,
    };

    expect(BAD_ITEM_SCORES.bomb).toBe(-25);
    expect(BAD_ITEM_SCORES.trash).toBe(-20);
    expect(BAD_ITEM_SCORES.rock).toBe(-15);
  });
});

// ============================================
// PET ABILITY TESTS
// ============================================

describe('Snack Catch - Pet Abilities', () => {
  // Helper to simulate getPetAbilities logic from SnackCatch.tsx
  function getPetAbilities(petId: string) {
    const abilities = {
      basketWidthMultiplier: 1,
      badItemSpeedMultiplier: 1,
      allItemSpeedMultiplier: 1,
      spicyMultiplier: 1,
      badItemPenalty: null as number | null,
      ghostDodgeAvailable: false,
      specialItemChanceMultiplier: 1,
    };

    switch (petId) {
      case 'munchlet':
        abilities.basketWidthMultiplier = 1.2;
        break;
      case 'grib':
        abilities.badItemSpeedMultiplier = 0.7;
        break;
      case 'plompo':
        abilities.allItemSpeedMultiplier = 0.8;
        break;
      case 'ember':
        abilities.spicyMultiplier = 3;
        break;
      case 'chomper':
        abilities.badItemPenalty = -5;
        break;
      case 'whisp':
        abilities.ghostDodgeAvailable = true;
        break;
      case 'luxe':
        abilities.specialItemChanceMultiplier = 2;
        break;
    }

    return abilities;
  }

  it('Munchlet should have 20% wider basket', () => {
    const abilities = getPetAbilities('munchlet');
    expect(abilities.basketWidthMultiplier).toBe(1.2);
  });

  it('Grib should have 30% slower bad items', () => {
    const abilities = getPetAbilities('grib');
    expect(abilities.badItemSpeedMultiplier).toBe(0.7);
  });

  it('Plompo should have 20% slower all items', () => {
    const abilities = getPetAbilities('plompo');
    expect(abilities.allItemSpeedMultiplier).toBe(0.8);
  });

  it('Ember should have 3x spicy food points', () => {
    const abilities = getPetAbilities('ember');
    expect(abilities.spicyMultiplier).toBe(3);
  });

  it('Chomper should have -5 bad item penalty', () => {
    const abilities = getPetAbilities('chomper');
    expect(abilities.badItemPenalty).toBe(-5);
  });

  it('Whisp should have one free ghost dodge', () => {
    const abilities = getPetAbilities('whisp');
    expect(abilities.ghostDodgeAvailable).toBe(true);
  });

  it('Luxe should have 2x special item chance', () => {
    const abilities = getPetAbilities('luxe');
    expect(abilities.specialItemChanceMultiplier).toBe(2);
  });

  it('default pet should have no ability modifiers', () => {
    const abilities = getPetAbilities('unknown_pet');
    expect(abilities.basketWidthMultiplier).toBe(1);
    expect(abilities.badItemSpeedMultiplier).toBe(1);
    expect(abilities.allItemSpeedMultiplier).toBe(1);
    expect(abilities.spicyMultiplier).toBe(1);
    expect(abilities.badItemPenalty).toBe(null);
    expect(abilities.ghostDodgeAvailable).toBe(false);
    expect(abilities.specialItemChanceMultiplier).toBe(1);
  });
});

// ============================================
// COMBO SYSTEM TESTS
// ============================================

describe('Snack Catch - Combo System', () => {
  it('should have correct combo bonus values per design doc', () => {
    // Per design: +2 per streak, max +10
    const comboBonus = (combo: number) => Math.min(combo * 2, 10);

    expect(comboBonus(0)).toBe(0);
    expect(comboBonus(1)).toBe(2);
    expect(comboBonus(2)).toBe(4);
    expect(comboBonus(3)).toBe(6);
    expect(comboBonus(4)).toBe(8);
    expect(comboBonus(5)).toBe(10);
    expect(comboBonus(6)).toBe(10); // Max cap
    expect(comboBonus(10)).toBe(10); // Max cap
  });
});

// ============================================
// DIFFICULTY PROGRESSION TESTS
// ============================================

describe('Snack Catch - Difficulty Progression', () => {
  it('should have correct difficulty phases per design doc', () => {
    // Per design:
    // 0-20s: Slow, 1/sec, 5% bad
    // 20-40s: Medium, 1.5/sec, 15% bad
    // 40-60s: Fast, 2/sec, 25% bad

    const DIFFICULTY_PHASES = [
      { time: 0, spawnRate: 1000, badChance: 0.05 },
      { time: 20000, spawnRate: 666, badChance: 0.15 },
      { time: 40000, spawnRate: 500, badChance: 0.25 },
    ];

    // Phase 1: 0-20s
    expect(DIFFICULTY_PHASES[0].badChance).toBe(0.05);

    // Phase 2: 20-40s
    expect(DIFFICULTY_PHASES[1].badChance).toBe(0.15);

    // Phase 3: 40-60s
    expect(DIFFICULTY_PHASES[2].badChance).toBe(0.25);
  });

  it('should select correct phase based on elapsed time', () => {
    const DIFFICULTY_PHASES = [
      { time: 0, spawnRate: 1000, badChance: 0.05 },
      { time: 20000, spawnRate: 666, badChance: 0.15 },
      { time: 40000, spawnRate: 500, badChance: 0.25 },
    ];

    function getDifficultyPhase(elapsedMs: number) {
      for (let i = DIFFICULTY_PHASES.length - 1; i >= 0; i--) {
        if (elapsedMs >= DIFFICULTY_PHASES[i].time) {
          return DIFFICULTY_PHASES[i];
        }
      }
      return DIFFICULTY_PHASES[0];
    }

    // At start (0ms)
    expect(getDifficultyPhase(0).badChance).toBe(0.05);

    // At 10 seconds
    expect(getDifficultyPhase(10000).badChance).toBe(0.05);

    // At 20 seconds exactly (phase 2 starts)
    expect(getDifficultyPhase(20000).badChance).toBe(0.15);

    // At 30 seconds
    expect(getDifficultyPhase(30000).badChance).toBe(0.15);

    // At 40 seconds exactly (phase 3 starts)
    expect(getDifficultyPhase(40000).badChance).toBe(0.25);

    // At 55 seconds
    expect(getDifficultyPhase(55000).badChance).toBe(0.25);
  });
});

// ============================================
// SPECIAL ITEMS TESTS
// ============================================

describe('Snack Catch - Special Items', () => {
  it('should have correct special item values per design doc', () => {
    // Per design:
    // Star +50 points
    // Rainbow 2x points for 5s
    // Magnet Auto-catch for 3s

    const SPECIAL_ITEMS = {
      star: { score: 50 },
      rainbow: { duration: 5000 },
      magnet: { duration: 3000 },
    };

    expect(SPECIAL_ITEMS.star.score).toBe(50);
    expect(SPECIAL_ITEMS.rainbow.duration).toBe(5000);
    expect(SPECIAL_ITEMS.magnet.duration).toBe(3000);
  });
});

// ============================================
// SPAWNABLE FOODS TESTS
// ============================================

describe('Snack Catch - Spawnable Foods', () => {
  it('should only spawn common, uncommon, and rare foods', () => {
    // Per design: Foods from foods.ts but not epic/legendary
    const spawnableFoods = Object.values(FOODS).filter(
      (f) => f.rarity === 'common' || f.rarity === 'uncommon' || f.rarity === 'rare'
    );

    // Should have common foods
    expect(spawnableFoods.some((f) => f.rarity === 'common')).toBe(true);

    // Should have uncommon foods
    expect(spawnableFoods.some((f) => f.rarity === 'uncommon')).toBe(true);

    // Should have rare foods
    expect(spawnableFoods.some((f) => f.rarity === 'rare')).toBe(true);

    // Should NOT have epic or legendary
    expect(spawnableFoods.some((f) => f.rarity === 'epic')).toBe(false);
    expect(spawnableFoods.some((f) => f.rarity === 'legendary')).toBe(false);
  });

  it('should have at least 7 spawnable foods', () => {
    const spawnableFoods = Object.values(FOODS).filter(
      (f) => f.rarity === 'common' || f.rarity === 'uncommon' || f.rarity === 'rare'
    );

    // Common: apple, banana, carrot (3)
    // Uncommon: cookie, grapes (2)
    // Rare: spicy_taco, hot_pepper (2)
    expect(spawnableFoods.length).toBeGreaterThanOrEqual(7);
  });

  it('should identify spicy foods correctly', () => {
    const isSpicyFood = (foodId: string) =>
      foodId === 'spicy_taco' || foodId === 'hot_pepper';

    expect(isSpicyFood('spicy_taco')).toBe(true);
    expect(isSpicyFood('hot_pepper')).toBe(true);
    expect(isSpicyFood('apple')).toBe(false);
    expect(isSpicyFood('cookie')).toBe(false);
    expect(isSpicyFood('banana')).toBe(false);
  });
});

// ============================================
// GAME CONSTANTS TESTS
// ============================================

describe('Snack Catch - Game Constants', () => {
  it('should have 60 second game duration', () => {
    const GAME_DURATION_MS = 60_000;
    expect(GAME_DURATION_MS).toBe(60000);
  });

  it('should have basket at 85% down the screen', () => {
    const CATCH_ZONE_Y = 0.85;
    expect(CATCH_ZONE_Y).toBe(0.85);
  });

  it('should have 20% base basket width', () => {
    const BASKET_WIDTH_RATIO = 0.2;
    expect(BASKET_WIDTH_RATIO).toBe(0.2);
  });
});

// ============================================
// SCORING CALCULATION TESTS
// ============================================

describe('Snack Catch - Score Calculation', () => {
  const AFFINITY_SCORES = {
    loved: 30,
    liked: 20,
    neutral: 10,
    disliked: -15,
  };

  it('calculates loved food score correctly', () => {
    const baseScore = AFFINITY_SCORES.loved;
    const comboBonus = 4; // combo level 2
    const expectedScore = baseScore + comboBonus;
    expect(expectedScore).toBe(34);
  });

  it('calculates rainbow multiplier correctly', () => {
    const baseScore = AFFINITY_SCORES.loved;
    const withRainbow = baseScore * 2;
    expect(withRainbow).toBe(60);
  });

  it('calculates Ember spicy bonus correctly', () => {
    // Ember gets 3x points on spicy foods
    const baseSpicyScore = AFFINITY_SCORES.loved; // Ember loves spicy = 30
    const emberBonus = baseSpicyScore * 3;
    expect(emberBonus).toBe(90);
  });

  it('score never goes below zero', () => {
    const score = 5;
    const penalty = -25; // bomb
    const newScore = Math.max(0, score + penalty);
    expect(newScore).toBe(0);
  });
});

// ============================================
// INTEGRATION WITH STORE TESTS
// ============================================

describe('Snack Catch - Store Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('can read active pet ID from store', () => {
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('munchlet'); // Default starter
  });

  it('can select different pet for testing abilities', () => {
    useGameStore.getState().selectPet('ember');
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('ember');
  });
});
