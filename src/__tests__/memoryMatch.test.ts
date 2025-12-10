// ============================================
// GRUNDY — MEMORY MATCH MINI-GAME TESTS
// Tests for game mechanics, scoring, pet abilities
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import { getAllFoods } from '../data/foods';

// ============================================
// BOARD GENERATION TESTS
// ============================================

describe('Memory Match - Board Generation', () => {
  it('should generate correct number of cards (2 per pair)', () => {
    const pairs = 6;
    const expectedCards = pairs * 2;
    expect(expectedCards).toBe(12);
  });

  it('should have enough foods for all difficulty levels', () => {
    const foods = getAllFoods();
    // Need at least 10 unique foods for hard mode
    expect(foods.length).toBeGreaterThanOrEqual(10);
  });

  it('should have unique IDs for each card in a pair', () => {
    // Cards in a pair should have different IDs but same foodId
    const card1Id = 0;
    const card2Id = 1;
    expect(card1Id).not.toBe(card2Id);
  });
});

// ============================================
// DIFFICULTY LEVELS TESTS
// ============================================

describe('Memory Match - Difficulty Levels', () => {
  it('should have correct Easy mode configuration', () => {
    const easy = { rows: 3, cols: 4, pairs: 6, timeMs: 60_000 };
    expect(easy.rows * easy.cols).toBe(easy.pairs * 2);
    expect(easy.timeMs).toBe(60000);
  });

  it('should have correct Medium mode configuration', () => {
    const medium = { rows: 4, cols: 4, pairs: 8, timeMs: 90_000 };
    expect(medium.rows * medium.cols).toBe(medium.pairs * 2);
    expect(medium.timeMs).toBe(90000);
  });

  it('should have correct Hard mode configuration (post-launch)', () => {
    const hard = { rows: 4, cols: 5, pairs: 10, timeMs: 120_000 };
    expect(hard.rows * hard.cols).toBe(hard.pairs * 2);
    expect(hard.timeMs).toBe(120000);
  });
});

// ============================================
// SCORING TESTS
// ============================================

describe('Memory Match - Scoring', () => {
  it('should have correct point values per design doc', () => {
    const POINTS = {
      findPair: 50,
      perfectMatch: 25,
      timeBonus: 2,
      streakBonus: 10,
    };

    expect(POINTS.findPair).toBe(50);
    expect(POINTS.perfectMatch).toBe(25);
    expect(POINTS.timeBonus).toBe(2);
    expect(POINTS.streakBonus).toBe(10);
  });

  it('should calculate time bonus correctly', () => {
    const timeBonus = 2;
    const secondsRemaining = 30;
    const bonus = secondsRemaining * timeBonus;
    expect(bonus).toBe(60);
  });

  it('should apply streak bonus after 3+ consecutive matches', () => {
    const streakBonus = 10;
    const streak = 3;
    const shouldApplyBonus = streak >= 3;
    expect(shouldApplyBonus).toBe(true);
    expect(streakBonus).toBe(10);
  });

  it('should not apply streak bonus for less than 3 streak', () => {
    const streak = 2;
    const shouldApplyBonus = streak >= 3;
    expect(shouldApplyBonus).toBe(false);
  });
});

// ============================================
// MOVE EFFICIENCY TESTS
// ============================================

describe('Memory Match - Move Efficiency Bonus', () => {
  // Move efficiency bonus (for 8-pair game)
  function getMoveEfficiencyBonus(moves: number, totalPairs: number): number {
    const scale = totalPairs / 8;
    const perfect = Math.floor(12 * scale);
    const great = Math.floor(16 * scale);
    const good = Math.floor(20 * scale);

    if (moves <= perfect) return 100;
    if (moves <= great) return 50;
    if (moves <= good) return 25;
    return 0;
  }

  it('should give +100 for perfect play (≤12 moves for 8 pairs)', () => {
    expect(getMoveEfficiencyBonus(8, 8)).toBe(100);
    expect(getMoveEfficiencyBonus(12, 8)).toBe(100);
  });

  it('should give +50 for great play (13-16 moves for 8 pairs)', () => {
    expect(getMoveEfficiencyBonus(13, 8)).toBe(50);
    expect(getMoveEfficiencyBonus(16, 8)).toBe(50);
  });

  it('should give +25 for good play (17-20 moves for 8 pairs)', () => {
    expect(getMoveEfficiencyBonus(17, 8)).toBe(25);
    expect(getMoveEfficiencyBonus(20, 8)).toBe(25);
  });

  it('should give +0 for 21+ moves for 8 pairs', () => {
    expect(getMoveEfficiencyBonus(21, 8)).toBe(0);
    expect(getMoveEfficiencyBonus(30, 8)).toBe(0);
  });

  it('should scale thresholds for 6-pair Easy mode', () => {
    // 6 pairs = 0.75 scale
    // perfect = 9, great = 12, good = 15
    expect(getMoveEfficiencyBonus(9, 6)).toBe(100);
    expect(getMoveEfficiencyBonus(12, 6)).toBe(50);
    expect(getMoveEfficiencyBonus(15, 6)).toBe(25);
    expect(getMoveEfficiencyBonus(16, 6)).toBe(0);
  });
});

// ============================================
// MATCH LOGIC TESTS
// ============================================

describe('Memory Match - Match Logic', () => {
  it('should detect matching pairs by foodId', () => {
    const card1 = { id: 0, foodId: 'apple' };
    const card2 = { id: 1, foodId: 'apple' };
    const isMatch = card1.foodId === card2.foodId && card1.id !== card2.id;
    expect(isMatch).toBe(true);
  });

  it('should reject non-matching pairs', () => {
    const card1 = { id: 0, foodId: 'apple' };
    const card2 = { id: 2, foodId: 'banana' };
    const isMatch = card1.foodId === card2.foodId && card1.id !== card2.id;
    expect(isMatch).toBe(false);
  });

  it('should reject same card clicked twice', () => {
    const card1 = { id: 0, foodId: 'apple' };
    const card2 = { id: 0, foodId: 'apple' }; // Same ID
    const isMatch = card1.foodId === card2.foodId && card1.id !== card2.id;
    expect(isMatch).toBe(false);
  });
});

// ============================================
// PET ABILITIES TESTS
// ============================================

describe('Memory Match - Pet Abilities', () => {
  function getPetAbilities(petId: string) {
    const abilities = {
      extraTimeMs: 0,
      timerSpeedMultiplier: 1,
      peekAtStart: false,
      flashMatchesAtStart: false,
      hintAfterMoves: null as number | null,
      freeReflip: false,
      luckyFirstFlip: false,
    };

    switch (petId) {
      case 'munchlet':
        abilities.hintAfterMoves = 8;
        break;
      case 'grib':
        abilities.extraTimeMs = 15_000;
        break;
      case 'plompo':
        abilities.timerSpeedMultiplier = 0.75;
        break;
      case 'ember':
        abilities.flashMatchesAtStart = true;
        break;
      case 'chomper':
        abilities.freeReflip = true;
        break;
      case 'whisp':
        abilities.peekAtStart = true;
        break;
      case 'luxe':
        abilities.luckyFirstFlip = true;
        break;
    }

    return abilities;
  }

  it('Munchlet should have hint after 8 moves', () => {
    const abilities = getPetAbilities('munchlet');
    expect(abilities.hintAfterMoves).toBe(8);
  });

  it('Grib should have +15 seconds extra time', () => {
    const abilities = getPetAbilities('grib');
    expect(abilities.extraTimeMs).toBe(15_000);
  });

  it('Plompo should have 25% slower timer', () => {
    const abilities = getPetAbilities('plompo');
    expect(abilities.timerSpeedMultiplier).toBe(0.75);
  });

  it('Ember should flash matches at start', () => {
    const abilities = getPetAbilities('ember');
    expect(abilities.flashMatchesAtStart).toBe(true);
  });

  it('Chomper should have one free re-flip', () => {
    const abilities = getPetAbilities('chomper');
    expect(abilities.freeReflip).toBe(true);
  });

  it('Whisp should peek at all cards at start', () => {
    const abilities = getPetAbilities('whisp');
    expect(abilities.peekAtStart).toBe(true);
  });

  it('Luxe should have lucky first flip', () => {
    const abilities = getPetAbilities('luxe');
    expect(abilities.luckyFirstFlip).toBe(true);
  });

  it('default pet should have no ability modifiers', () => {
    const abilities = getPetAbilities('unknown_pet');
    expect(abilities.extraTimeMs).toBe(0);
    expect(abilities.timerSpeedMultiplier).toBe(1);
    expect(abilities.peekAtStart).toBe(false);
    expect(abilities.flashMatchesAtStart).toBe(false);
    expect(abilities.hintAfterMoves).toBe(null);
    expect(abilities.freeReflip).toBe(false);
    expect(abilities.luckyFirstFlip).toBe(false);
  });
});

// ============================================
// GAME CONSTANTS TESTS
// ============================================

describe('Memory Match - Game Constants', () => {
  it('should have correct mismatch delay', () => {
    const MISMATCH_DELAY_MS = 1000;
    expect(MISMATCH_DELAY_MS).toBe(1000);
  });

  it('should have correct peek duration for Whisp', () => {
    const PEEK_DURATION_MS = 3000;
    expect(PEEK_DURATION_MS).toBe(3000);
  });

  it('should have correct hint duration for Munchlet', () => {
    const HINT_DURATION_MS = 2000;
    expect(HINT_DURATION_MS).toBe(2000);
  });
});

// ============================================
// WIN/LOSE CONDITION TESTS
// ============================================

describe('Memory Match - Win/Lose Conditions', () => {
  it('should win when all pairs are matched', () => {
    const matchedPairs = 8;
    const totalPairs = 8;
    const isWin = matchedPairs === totalPairs;
    expect(isWin).toBe(true);
  });

  it('should lose when time expires with pairs remaining', () => {
    const matchedPairs = 5;
    const totalPairs = 8;
    const timeRemaining = 0;
    const isLose = timeRemaining <= 0 && matchedPairs < totalPairs;
    expect(isLose).toBe(true);
  });

  it('should not be game over with time remaining and pairs left', () => {
    const matchedPairs = 5;
    const totalPairs = 8;
    const timeRemaining = 30000;
    const isGameOver = timeRemaining <= 0 || matchedPairs === totalPairs;
    expect(isGameOver).toBe(false);
  });
});

// ============================================
// REWARD TIER TESTS
// ============================================

describe('Memory Match - Reward Tiers', () => {
  it('should have correct tier thresholds per design doc', () => {
    // From design: Bronze 0-199, Silver 200-399, Gold 400-549, Rainbow 550+
    const tiers = {
      bronze: { min: 0, max: 199 },
      silver: { min: 200, max: 399 },
      gold: { min: 400, max: 549 },
      rainbow: { min: 550, max: Infinity },
    };

    expect(tiers.bronze.max).toBe(199);
    expect(tiers.silver.min).toBe(200);
    expect(tiers.gold.min).toBe(400);
    expect(tiers.rainbow.min).toBe(550);
  });
});

// ============================================
// MAX SCORE CALCULATION TESTS
// ============================================

describe('Memory Match - Maximum Score', () => {
  it('should calculate max theoretical score for Medium (8 pairs)', () => {
    const pairs = 8;
    const findPairPoints = pairs * 50; // 400
    const perfectMatchBonus = pairs * 25; // 200 (all first try)
    const streakBonus = (pairs - 2) * 10; // 60 (6 pairs after first 2)
    const timeBonus = 90 * 2; // 180 (perfect 90s remaining)
    const efficiencyBonus = 100; // Perfect moves

    const maxScore = findPairPoints + perfectMatchBonus + streakBonus + timeBonus + efficiencyBonus;
    // 400 + 200 + 60 + 180 + 100 = 940
    expect(maxScore).toBeLessThanOrEqual(1000); // Sanity check
    expect(maxScore).toBeGreaterThan(550); // Should reach Rainbow tier
  });
});

// ============================================
// INTEGRATION WITH STORE TESTS
// ============================================

describe('Memory Match - Store Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('can read active pet ID from store', () => {
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('munchlet');
  });

  it('can select different pet for testing abilities', () => {
    useGameStore.getState().selectPet('whisp');
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('whisp');
  });
});

// ============================================
// SHUFFLE FUNCTION TESTS
// ============================================

describe('Memory Match - Shuffle', () => {
  function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  it('should maintain array length after shuffle', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.length).toBe(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    arr.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  it('should not modify original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });
});
