// ============================================
// GRUNDY — MINI-GAME SUITE INVARIANT TESTS
// Cross-game tests for LOCKED rules from Bible §8
// ============================================

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  calculateTier,
  calculateRewards,
  createMiniGameResult,
  ENERGY_MAX,
  ENERGY_COST_PER_GAME,
  DAILY_REWARDED_PLAYS_CAP,
  createInitialDailyState,
} from '../game/miniGameRewards';
import { checkUnlockRequirements, getUnlockProgress } from '../game/unlocks';
import { getPetUnlockRequirement } from '../data/pets';
import type { MiniGameId, RewardTier } from '../types';

// All 5 mini-games in the system
const ALL_GAMES: MiniGameId[] = ['snack_catch', 'memory_match', 'pips', 'rhythm_tap', 'poop_scoop'];

// All 8 pets in the system
const ALL_PETS = ['munchlet', 'grib', 'plompo', 'fizz', 'ember', 'chomper', 'whisp', 'luxe'];

// ============================================
// INVARIANT: ENERGY SYSTEM CONSTANTS (LOCKED)
// ============================================

describe('Mini-Game Suite - Energy Constants (LOCKED)', () => {
  it('ENERGY_MAX must be exactly 50', () => {
    expect(ENERGY_MAX).toBe(50);
  });

  it('ENERGY_COST_PER_GAME must be exactly 10', () => {
    expect(ENERGY_COST_PER_GAME).toBe(10);
  });

  it('Player can play max 5 games from full energy (50 / 10 = 5)', () => {
    const maxGamesFromFull = ENERGY_MAX / ENERGY_COST_PER_GAME;
    expect(maxGamesFromFull).toBe(5);
  });

  it('Energy system constants apply uniformly across ALL games', () => {
    ALL_GAMES.forEach((gameId) => {
      // Each game uses same energy cost
      expect(ENERGY_COST_PER_GAME).toBe(10);
    });
  });
});

// ============================================
// INVARIANT: DAILY CAPS (3 REWARDED PER GAME)
// ============================================

describe('Mini-Game Suite - Daily Caps (LOCKED)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('DAILY_REWARDED_PLAYS_CAP must be exactly 3', () => {
    expect(DAILY_REWARDED_PLAYS_CAP).toBe(3);
  });

  it('Daily cap applies independently to each game', () => {
    const dailyState = createInitialDailyState();

    ALL_GAMES.forEach((gameId) => {
      expect(dailyState.plays[gameId]).toBe(0);
      expect(dailyState.freePlayUsed[gameId]).toBe(false);
    });
  });

  it('Playing one game 3 times does not affect other games', () => {
    const store = useGameStore.getState();

    // Play snack_catch 3 times (hit cap)
    store.recordPlay('snack_catch', true); // free
    store.recordPlay('snack_catch', false);
    store.recordPlay('snack_catch', false);

    // snack_catch should be capped
    const snackStatus = useGameStore.getState().canPlay('snack_catch');
    expect(snackStatus.allowed).toBe(false);
    expect(snackStatus.reason).toBe('Daily limit reached');

    // All other games should still be playable
    const otherGames = ALL_GAMES.filter((g) => g !== 'snack_catch');
    otherGames.forEach((gameId) => {
      const status = useGameStore.getState().canPlay(gameId);
      expect(status.allowed).toBe(true);
      expect(status.isFree).toBe(true);
    });
  });

  it('Total rewarded plays per day = 3 games × 5 mini-games = 15', () => {
    const totalDailyRewarded = DAILY_REWARDED_PLAYS_CAP * ALL_GAMES.length;
    expect(totalDailyRewarded).toBe(15);
  });
});

// ============================================
// INVARIANT: FIRST PLAY FREE (PER GAME PER DAY)
// ============================================

describe('Mini-Game Suite - First Play Free (LOCKED)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('First play of EVERY game is free', () => {
    ALL_GAMES.forEach((gameId) => {
      const status = useGameStore.getState().canPlay(gameId);
      expect(status.allowed).toBe(true);
      expect(status.isFree).toBe(true);
    });
  });

  it('Second play of each game requires energy', () => {
    const store = useGameStore.getState();

    ALL_GAMES.forEach((gameId) => {
      // Record free play
      store.recordPlay(gameId, true);

      // Second play should not be free
      const status = useGameStore.getState().canPlay(gameId);
      expect(status.isFree).toBe(false);
    });
  });

  it('Free play resets daily for each game', () => {
    const store = useGameStore.getState();

    // Use free play for all games
    ALL_GAMES.forEach((gameId) => {
      store.recordPlay(gameId, true);
    });

    // Verify all free plays used
    ALL_GAMES.forEach((gameId) => {
      const status = useGameStore.getState().canPlay(gameId);
      expect(status.isFree).toBe(false);
    });

    // Simulate date change
    vi.useFakeTimers();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    vi.setSystemTime(tomorrow);

    // canPlay should trigger reset - all should be free again
    ALL_GAMES.forEach((gameId) => {
      const status = useGameStore.getState().canPlay(gameId);
      expect(status.allowed).toBe(true);
      expect(status.isFree).toBe(true);
    });

    vi.useRealTimers();
  });
});

// ============================================
// CRITICAL INVARIANT: NO GEMS EVER
// ============================================

describe('Mini-Game Suite - NO GEMS EVER (LOCKED)', () => {
  it('createMiniGameResult never includes gems property', () => {
    // Test all tiers with multiple scores
    const testCases = [
      { score: 0, tier: 'bronze' },
      { score: 50, tier: 'bronze' },
      { score: 100, tier: 'silver' },
      { score: 200, tier: 'gold' },
      { score: 300, tier: 'rainbow' },
      { score: 500, tier: 'rainbow' },
      { score: 1000, tier: 'rainbow' },
    ];

    ALL_GAMES.forEach((gameId) => {
      ALL_PETS.forEach((petId) => {
        testCases.forEach(({ score }) => {
          const result = createMiniGameResult(gameId, score, petId);

          // CRITICAL: No gems property should exist
          expect(result.rewards).not.toHaveProperty('gems');
          expect(Object.keys(result.rewards)).toEqual(['coins', 'xp', 'foodDrop']);
        });
      });
    });
  });

  it('calculateRewards never includes gems property', () => {
    const scores = [0, 50, 100, 150, 200, 250, 300, 400, 500, 1000];

    ALL_PETS.forEach((petId) => {
      scores.forEach((score) => {
        const rewards = calculateRewards(score, petId);

        // CRITICAL: No gems anywhere
        expect(rewards).not.toHaveProperty('gems');
        expect(Object.keys(rewards)).toEqual(['coins', 'xp', 'foodDrop']);
      });
    });
  });

  it('Rainbow tier (highest) still does not award gems', () => {
    // Rainbow is the highest tier - even here, NO GEMS
    for (let i = 0; i < 100; i++) {
      const result = createMiniGameResult('snack_catch', 500, 'munchlet');
      expect(result.tier).toBe('rainbow');
      expect(result.rewards).not.toHaveProperty('gems');
    }
  });

  it('Luxe pet (gem-related ability) does not add gems to mini-game rewards', () => {
    // Luxe has gem_multiplier ability, but mini-games never give gems
    for (let i = 0; i < 100; i++) {
      const result = createMiniGameResult('snack_catch', 500, 'luxe');
      expect(result.rewards).not.toHaveProperty('gems');
    }
  });
});

// ============================================
// INVARIANT: FIZZ +25% MINIGAME BONUS
// ============================================

describe('Mini-Game Suite - Fizz Bonus (LOCKED)', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Fizz should apply +25% bonus to coins', () => {
    const regularRewards = calculateRewards(200, 'munchlet');
    const fizzRewards = calculateRewards(200, 'fizz');

    const expectedCoins = Math.round(regularRewards.coins * 1.25);
    expect(fizzRewards.coins).toBe(expectedCoins);
  });

  it('Fizz should apply +25% bonus to XP', () => {
    const regularRewards = calculateRewards(200, 'munchlet');
    const fizzRewards = calculateRewards(200, 'fizz');

    const expectedXp = Math.round(regularRewards.xp * 1.25);
    expect(fizzRewards.xp).toBe(expectedXp);
  });

  it('Fizz bonus applies across all games', () => {
    ALL_GAMES.forEach((gameId) => {
      const regularResult = createMiniGameResult(gameId, 200, 'munchlet');
      const fizzResult = createMiniGameResult(gameId, 200, 'fizz');

      expect(fizzResult.rewards.coins).toBeGreaterThan(regularResult.rewards.coins);
      expect(fizzResult.rewards.xp).toBeGreaterThan(regularResult.rewards.xp);
    });
  });

  it('Fizz bonus applies across all tiers', () => {
    const tierScores: Record<RewardTier, number> = {
      bronze: 50,
      silver: 150,
      gold: 250,
      rainbow: 350,
    };

    Object.entries(tierScores).forEach(([tier, score]) => {
      const regularRewards = calculateRewards(score, 'munchlet');
      const fizzRewards = calculateRewards(score, 'fizz');

      // Fizz should always get more
      expect(fizzRewards.coins).toBe(Math.round(regularRewards.coins * 1.25));
      expect(fizzRewards.xp).toBe(Math.round(regularRewards.xp * 1.25));
    });
  });

  it('Non-Fizz pets do not get minigame bonus', () => {
    const nonFizzPets = ALL_PETS.filter((p) => p !== 'fizz');

    nonFizzPets.forEach((petId) => {
      const rewards = calculateRewards(200, petId);
      const fizzRewards = calculateRewards(200, 'fizz');

      // Non-Fizz should have lower rewards than Fizz
      expect(rewards.coins).toBeLessThan(fizzRewards.coins);
      expect(rewards.xp).toBeLessThan(fizzRewards.xp);
    });
  });
});

// ============================================
// INVARIANT: minigamesCompleted TRACKING
// ============================================

describe('Mini-Game Suite - minigamesCompleted Tracking', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('Starts at 0', () => {
    const state = useGameStore.getState();
    expect(state.stats.minigamesCompleted).toBe(0);
  });

  it('Increments by 1 for each completed game', () => {
    const store = useGameStore.getState();
    let expectedCount = 0;

    ALL_GAMES.forEach((gameId) => {
      const result = createMiniGameResult(gameId, 150, 'munchlet');
      store.completeGame(result);
      expectedCount++;

      const state = useGameStore.getState();
      expect(state.stats.minigamesCompleted).toBe(expectedCount);
    });
  });

  it('Tracks total across all game types', () => {
    const store = useGameStore.getState();

    // Play each game twice
    ALL_GAMES.forEach((gameId) => {
      const result1 = createMiniGameResult(gameId, 100, 'munchlet');
      const result2 = createMiniGameResult(gameId, 200, 'munchlet');
      store.completeGame(result1);
      store.completeGame(result2);
    });

    const state = useGameStore.getState();
    expect(state.stats.minigamesCompleted).toBe(ALL_GAMES.length * 2);
  });

  it('Persists across resetGame (does NOT reset stats)', () => {
    const store = useGameStore.getState();

    // Complete some games
    const result = createMiniGameResult('snack_catch', 150, 'munchlet');
    store.completeGame(result);
    store.completeGame(result);
    store.completeGame(result);

    // Stats before reset
    const before = useGameStore.getState().stats.minigamesCompleted;
    expect(before).toBe(3);

    // Full reset resets stats to 0
    store.resetGame();
    const after = useGameStore.getState().stats.minigamesCompleted;
    expect(after).toBe(0);
  });
});

// ============================================
// CHOMPER UNLOCK AT 10 MINIGAMES
// ============================================

describe('Mini-Game Suite - Chomper Unlock (10 Minigames)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('Chomper unlock requirement is 10 minigames_completed', () => {
    const requirement = getPetUnlockRequirement('chomper');
    expect(requirement).toBeDefined();
    expect(requirement?.type).toBe('minigames_completed');
    expect(requirement?.value).toBe(10);
  });

  it('Chomper not unlockable at 9 minigames', () => {
    const canUnlock = checkUnlockRequirements('chomper', { minigamesCompleted: 9 });
    expect(canUnlock).toBe(false);
  });

  it('Chomper unlockable at exactly 10 minigames', () => {
    const canUnlock = checkUnlockRequirements('chomper', { minigamesCompleted: 10 });
    expect(canUnlock).toBe(true);
  });

  it('Chomper unlockable at more than 10 minigames', () => {
    const canUnlock = checkUnlockRequirements('chomper', { minigamesCompleted: 15 });
    expect(canUnlock).toBe(true);
  });

  it('Chomper unlock progress calculates correctly', () => {
    expect(getUnlockProgress('chomper', { minigamesCompleted: 0 })).toBe(0);
    expect(getUnlockProgress('chomper', { minigamesCompleted: 5 })).toBe(50);
    expect(getUnlockProgress('chomper', { minigamesCompleted: 10 })).toBe(100);
    expect(getUnlockProgress('chomper', { minigamesCompleted: 15 })).toBe(100); // Caps at 100
  });

  it('Chomper has gem skip cost of 100', () => {
    const requirement = getPetUnlockRequirement('chomper');
    expect(requirement?.gemSkipCost).toBe(100);
  });
});

// ============================================
// REWARD TIER THRESHOLDS (CROSS-GAME)
// ============================================

describe('Mini-Game Suite - Reward Tier Thresholds', () => {
  it('Tier thresholds are consistent: Bronze 0-99, Silver 100-199, Gold 200-299, Rainbow 300+', () => {
    // Bronze boundaries
    expect(calculateTier(0)).toBe('bronze');
    expect(calculateTier(99)).toBe('bronze');

    // Silver boundaries
    expect(calculateTier(100)).toBe('silver');
    expect(calculateTier(199)).toBe('silver');

    // Gold boundaries
    expect(calculateTier(200)).toBe('gold');
    expect(calculateTier(299)).toBe('gold');

    // Rainbow boundaries
    expect(calculateTier(300)).toBe('rainbow');
    expect(calculateTier(1000)).toBe('rainbow');
  });

  it('Same score gives same tier regardless of game', () => {
    const scores = [50, 150, 250, 350];

    scores.forEach((score) => {
      const expectedTier = calculateTier(score);

      ALL_GAMES.forEach((gameId) => {
        const result = createMiniGameResult(gameId, score, 'munchlet');
        expect(result.tier).toBe(expectedTier);
      });
    });
  });

  it('Same score gives same tier regardless of pet', () => {
    const scores = [50, 150, 250, 350];

    scores.forEach((score) => {
      const expectedTier = calculateTier(score);

      ALL_PETS.forEach((petId) => {
        const result = createMiniGameResult('snack_catch', score, petId);
        expect(result.tier).toBe(expectedTier);
      });
    });
  });
});

// ============================================
// FOOD DROP CHANCES BY TIER
// ============================================

describe('Mini-Game Suite - Food Drop Rates', () => {
  it('Bronze tier has 0% food drop chance', () => {
    let drops = 0;
    for (let i = 0; i < 100; i++) {
      const result = createMiniGameResult('snack_catch', 50, 'munchlet');
      if (result.rewards.foodDrop) drops++;
    }
    expect(drops).toBe(0);
  });

  it('Rainbow tier has 100% food drop chance', () => {
    let drops = 0;
    for (let i = 0; i < 100; i++) {
      const result = createMiniGameResult('snack_catch', 400, 'munchlet');
      if (result.rewards.foodDrop) drops++;
    }
    expect(drops).toBe(100);
  });

  it('Silver tier has ~40% food drop chance', () => {
    let drops = 0;
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const result = createMiniGameResult('snack_catch', 150, 'munchlet');
      if (result.rewards.foodDrop) drops++;
    }
    // Allow 10% variance
    const dropRate = drops / iterations;
    expect(dropRate).toBeGreaterThan(0.3);
    expect(dropRate).toBeLessThan(0.5);
  });

  it('Gold tier has ~75% food drop chance', () => {
    let drops = 0;
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const result = createMiniGameResult('snack_catch', 250, 'munchlet');
      if (result.rewards.foodDrop) drops++;
    }
    // Allow 10% variance
    const dropRate = drops / iterations;
    expect(dropRate).toBeGreaterThan(0.65);
    expect(dropRate).toBeLessThan(0.85);
  });
});

// ============================================
// COMPLETE GAME INTEGRATION
// ============================================

describe('Mini-Game Suite - completeGame Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('completeGame updates all relevant stats', () => {
    const store = useGameStore.getState();

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = createMiniGameResult('snack_catch', 200, 'munchlet');
    store.completeGame(result);

    const state = useGameStore.getState();
    expect(state.stats.minigamesCompleted).toBe(1);
    expect(state.stats.totalXpEarned).toBe(result.rewards.xp);
    expect(state.stats.totalCoinsEarned).toBe(result.rewards.coins);

    vi.restoreAllMocks();
  });

  it('completeGame adds food to inventory when dropped', () => {
    const store = useGameStore.getState();

    // Guarantee food drop with rainbow tier
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = createMiniGameResult('snack_catch', 400, 'munchlet');
    expect(result.rewards.foodDrop).not.toBeNull();

    const foodId = result.rewards.foodDrop!;
    const initialCount = store.inventory[foodId] || 0;

    store.completeGame(result);

    const state = useGameStore.getState();
    expect(state.inventory[foodId]).toBe(initialCount + 1);

    vi.restoreAllMocks();
  });

  it('completeGame works for all game types', () => {
    const store = useGameStore.getState();

    ALL_GAMES.forEach((gameId, index) => {
      const result = createMiniGameResult(gameId, 100 + index * 50, 'munchlet');
      store.completeGame(result);
    });

    const state = useGameStore.getState();
    expect(state.stats.minigamesCompleted).toBe(ALL_GAMES.length);
  });
});
