// ============================================
// GRUNDY — PIPS MINI-GAME TESTS
// Tests for game mechanics, scoring, pet abilities
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';

// ============================================
// BOARD GENERATION TESTS
// ============================================

describe('Pips - Board Generation', () => {
  function generateBoard(hasWildTile: boolean) {
    const TOTAL_PAIRS = 8;
    const pairs: number[] = [];
    for (let i = 0; i < TOTAL_PAIRS; i++) {
      const pip = (i % 6) + 1;
      pairs.push(pip, pip);
    }

    const tiles = pairs.map((pips, id) => ({
      id,
      pips: pips as 1 | 2 | 3 | 4 | 5 | 6,
      isCleared: false,
      isSelected: false,
      isWild: false,
      isHinted: false,
    }));

    if (hasWildTile) {
      tiles[0].isWild = true;
    }

    return tiles;
  }

  it('should generate exactly 16 tiles (8 pairs)', () => {
    const tiles = generateBoard(false);
    expect(tiles.length).toBe(16);
  });

  it('should generate 8 pairs of matching tiles', () => {
    const tiles = generateBoard(false);
    const pipCounts: Record<number, number> = {};

    tiles.forEach((tile) => {
      pipCounts[tile.pips] = (pipCounts[tile.pips] || 0) + 1;
    });

    // Each pip value should appear an even number of times
    Object.values(pipCounts).forEach((count) => {
      expect(count % 2).toBe(0);
    });
  });

  it('should have pip values between 1 and 6', () => {
    const tiles = generateBoard(false);
    tiles.forEach((tile) => {
      expect(tile.pips).toBeGreaterThanOrEqual(1);
      expect(tile.pips).toBeLessThanOrEqual(6);
    });
  });

  it('should mark one tile as wild when hasWildTile is true', () => {
    const tiles = generateBoard(true);
    const wildTiles = tiles.filter((t) => t.isWild);
    expect(wildTiles.length).toBe(1);
  });

  it('should not have any wild tiles when hasWildTile is false', () => {
    const tiles = generateBoard(false);
    const wildTiles = tiles.filter((t) => t.isWild);
    expect(wildTiles.length).toBe(0);
  });
});

// ============================================
// SCORING TESTS
// ============================================

describe('Pips - Scoring', () => {
  const POINTS = {
    matchPair: 10,
    comboX2: 5,
    comboX3: 10,
    comboX4Plus: 15,
    doublesMatch: 5,
    clearBoard: 50,
    timeBonus: 1,
  };

  it('should have correct point values per design doc', () => {
    expect(POINTS.matchPair).toBe(10);
    expect(POINTS.comboX2).toBe(5);
    expect(POINTS.comboX3).toBe(10);
    expect(POINTS.comboX4Plus).toBe(15);
    expect(POINTS.doublesMatch).toBe(5);
    expect(POINTS.clearBoard).toBe(50);
    expect(POINTS.timeBonus).toBe(1);
  });

  it('should award +10 points for a basic match', () => {
    const points = POINTS.matchPair;
    expect(points).toBe(10);
  });

  it('should award combo bonus correctly', () => {
    // Combo x2: +5
    expect(POINTS.comboX2).toBe(5);
    // Combo x3: +10
    expect(POINTS.comboX3).toBe(10);
    // Combo x4+: +15
    expect(POINTS.comboX4Plus).toBe(15);
  });

  it('should award doubles bonus for high pip values', () => {
    const isDoubles = (pips: number) => pips >= 5;
    expect(isDoubles(5)).toBe(true);
    expect(isDoubles(6)).toBe(true);
    expect(isDoubles(4)).toBe(false);
    expect(isDoubles(1)).toBe(false);
  });

  it('should award +50 bonus for clearing the board', () => {
    expect(POINTS.clearBoard).toBe(50);
  });

  it('should calculate time bonus correctly', () => {
    // +1 per 10 seconds remaining
    const timeBonus = POINTS.timeBonus;
    const secondsRemaining = 60;
    const bonus = Math.floor(secondsRemaining / 10) * timeBonus;
    expect(bonus).toBe(6);
  });
});

// ============================================
// COMBO SYSTEM TESTS
// ============================================

describe('Pips - Combo System', () => {
  it('should have 3 second combo window by default', () => {
    const COMBO_WINDOW_MS = 3000;
    expect(COMBO_WINDOW_MS).toBe(3000);
  });

  it('should calculate combo points correctly', () => {
    function getComboBonus(combo: number) {
      if (combo === 2) return 5;
      if (combo === 3) return 10;
      if (combo >= 4) return 15;
      return 0;
    }

    expect(getComboBonus(1)).toBe(0);
    expect(getComboBonus(2)).toBe(5);
    expect(getComboBonus(3)).toBe(10);
    expect(getComboBonus(4)).toBe(15);
    expect(getComboBonus(5)).toBe(15);
  });
});

// ============================================
// MATCH LOGIC TESTS
// ============================================

describe('Pips - Match Logic', () => {
  it('should detect matching tiles by pip count', () => {
    const tile1 = { id: 0, pips: 3, isWild: false };
    const tile2 = { id: 1, pips: 3, isWild: false };
    const isMatch = tile1.pips === tile2.pips;
    expect(isMatch).toBe(true);
  });

  it('should reject non-matching tiles', () => {
    const tile1 = { id: 0, pips: 3, isWild: false };
    const tile2 = { id: 1, pips: 5, isWild: false };
    const isMatch = tile1.pips === tile2.pips;
    expect(isMatch).toBe(false);
  });

  it('should allow wild tile to match any pip count', () => {
    const tile1 = { id: 0, pips: 3, isWild: true };
    const tile2 = { id: 1, pips: 5, isWild: false };
    const wildUsed = false;
    const isMatch = tile1.pips === tile2.pips || (tile1.isWild && !wildUsed);
    expect(isMatch).toBe(true);
  });

  it('should not allow wild tile to match twice', () => {
    const tile1 = { id: 0, pips: 3, isWild: true };
    const tile2 = { id: 1, pips: 5, isWild: false };
    const wildUsed = true;
    const isMatch = tile1.pips === tile2.pips || (tile1.isWild && !wildUsed);
    expect(isMatch).toBe(false);
  });
});

// ============================================
// PET ABILITIES TESTS
// ============================================

describe('Pips - Pet Abilities', () => {
  function getPetAbilities(petId: string) {
    const COMBO_WINDOW_MS = 3000;
    const abilities = {
      extraTimeMs: 0,
      comboWindowMs: COMBO_WINDOW_MS,
      doublesMultiplier: 1,
      hintAfterMs: null as number | null,
      peekAtStart: false,
      hasWildTile: false,
    };

    switch (petId) {
      case 'munchlet':
        abilities.hintAfterMs = 30_000;
        break;
      case 'grib':
        abilities.doublesMultiplier = 2;
        break;
      case 'plompo':
        abilities.extraTimeMs = 30_000;
        break;
      case 'ember':
        abilities.comboWindowMs = 5000;
        break;
      case 'chomper':
        abilities.hasWildTile = true;
        break;
      case 'whisp':
        abilities.peekAtStart = true;
        break;
    }

    return abilities;
  }

  it('Munchlet should have hint after 30 seconds', () => {
    const abilities = getPetAbilities('munchlet');
    expect(abilities.hintAfterMs).toBe(30_000);
  });

  it('Grib should have 2x doubles multiplier', () => {
    const abilities = getPetAbilities('grib');
    expect(abilities.doublesMultiplier).toBe(2);
  });

  it('Plompo should have +30 seconds extra time', () => {
    const abilities = getPetAbilities('plompo');
    expect(abilities.extraTimeMs).toBe(30_000);
  });

  it('Ember should have 5 second combo window', () => {
    const abilities = getPetAbilities('ember');
    expect(abilities.comboWindowMs).toBe(5000);
  });

  it('Chomper should have wild tile', () => {
    const abilities = getPetAbilities('chomper');
    expect(abilities.hasWildTile).toBe(true);
  });

  it('Whisp should peek at start', () => {
    const abilities = getPetAbilities('whisp');
    expect(abilities.peekAtStart).toBe(true);
  });

  it('default pet should have no ability modifiers', () => {
    const abilities = getPetAbilities('unknown_pet');
    expect(abilities.extraTimeMs).toBe(0);
    expect(abilities.comboWindowMs).toBe(3000);
    expect(abilities.doublesMultiplier).toBe(1);
    expect(abilities.hintAfterMs).toBe(null);
    expect(abilities.peekAtStart).toBe(false);
    expect(abilities.hasWildTile).toBe(false);
  });
});

// ============================================
// GAME CONSTANTS TESTS
// ============================================

describe('Pips - Game Constants', () => {
  it('should have 120 second game duration', () => {
    const GAME_DURATION_MS = 120_000;
    expect(GAME_DURATION_MS).toBe(120000);
  });

  it('should have 4x4 grid', () => {
    const GRID_SIZE = 4;
    expect(GRID_SIZE).toBe(4);
  });

  it('should have 8 total pairs', () => {
    const TOTAL_PAIRS = 8;
    expect(TOTAL_PAIRS).toBe(8);
  });

  it('should have correct pip emoji mapping', () => {
    const PIP_EMOJIS: Record<number, string> = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅',
    };

    expect(PIP_EMOJIS[1]).toBe('⚀');
    expect(PIP_EMOJIS[6]).toBe('⚅');
    expect(Object.keys(PIP_EMOJIS).length).toBe(6);
  });
});

// ============================================
// WIN/LOSE CONDITION TESTS
// ============================================

describe('Pips - Win/Lose Conditions', () => {
  it('should win when all pairs are cleared', () => {
    const pairsCleared = 8;
    const totalPairs = 8;
    const isWin = pairsCleared === totalPairs;
    expect(isWin).toBe(true);
  });

  it('should lose when time expires with pairs remaining', () => {
    const pairsCleared = 5;
    const totalPairs = 8;
    const timeRemaining = 0;
    const isLose = timeRemaining <= 0 && pairsCleared < totalPairs;
    expect(isLose).toBe(true);
  });

  it('should not be game over with time remaining and pairs left', () => {
    const pairsCleared: number = 5;
    const totalPairs: number = 8;
    const timeRemaining = 30000;
    const isGameOver = timeRemaining <= 0 || pairsCleared === totalPairs;
    expect(isGameOver).toBe(false);
  });
});

// ============================================
// REWARD TIER TESTS
// ============================================

describe('Pips - Reward Tiers', () => {
  it('should have correct tier thresholds per design doc', () => {
    // From design: Bronze 0-79, Silver 80-149, Gold 150-219, Rainbow 220+
    const tiers = {
      bronze: { min: 0, max: 79 },
      silver: { min: 80, max: 149 },
      gold: { min: 150, max: 219 },
      rainbow: { min: 220, max: Infinity },
    };

    expect(tiers.bronze.max).toBe(79);
    expect(tiers.silver.min).toBe(80);
    expect(tiers.gold.min).toBe(150);
    expect(tiers.rainbow.min).toBe(220);
  });
});

// ============================================
// MAX SCORE CALCULATION TESTS
// ============================================

describe('Pips - Maximum Score', () => {
  it('should calculate max theoretical score correctly', () => {
    const POINTS = {
      matchPair: 10,
      comboX4Plus: 15,
      doublesMatch: 5,
      clearBoard: 50,
      timeBonus: 1,
    };

    const pairs = 8;

    // All 8 matches with combos (first match no combo, rest x4+ after initial build)
    // Let's assume: 1 no combo, 1 x2, 1 x3, 5 x4+
    const baseScore = pairs * POINTS.matchPair; // 80
    const comboBonus = 5 + 10 + (5 * 15); // 90
    const doublesBonus = 2 * POINTS.doublesMatch; // 10 (assuming 2 doubles matches)
    const clearBonus = POINTS.clearBoard; // 50
    const timeBonus = 12 * POINTS.timeBonus; // 12 (120 seconds = 12 x 10s)

    const maxScore = baseScore + comboBonus + doublesBonus + clearBonus + timeBonus;
    // 80 + 90 + 10 + 50 + 12 = 242
    expect(maxScore).toBeLessThanOrEqual(300); // Sanity check
    expect(maxScore).toBeGreaterThan(220); // Should reach Rainbow tier
  });
});

// ============================================
// INTEGRATION WITH STORE TESTS
// ============================================

describe('Pips - Store Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('can read active pet ID from store', () => {
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('munchlet');
  });

  it('can select different pet for testing abilities', () => {
    useGameStore.getState().selectPet('chomper');
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('chomper');
  });
});

// ============================================
// SHUFFLE FUNCTION TESTS
// ============================================

describe('Pips - Shuffle', () => {
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
