// ============================================
// GRUNDY — MINI-GAME INFRASTRUCTURE TESTS
// Tests for energy, daily tracking, rewards
// ============================================

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  calculateTier,
  calculateRewards,
  createMiniGameResult,
  ENERGY_MAX,
  ENERGY_COST_PER_GAME,
  ENERGY_REGEN_MS,
  DAILY_REWARDED_PLAYS_CAP,
  getTodayString,
  createInitialDailyState,
  createInitialEnergyState,
} from '../game/miniGameRewards';
import type { MiniGameId, RewardTier } from '../types';

describe('Energy System', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('starts at or caps at 50 energy', () => {
    const state = useGameStore.getState();
    expect(state.energy.current).toBe(ENERGY_MAX);
    expect(state.energy.max).toBe(ENERGY_MAX);
    expect(ENERGY_MAX).toBe(50);
  });

  it('deducts 10 energy per paid game', () => {
    const store = useGameStore.getState();
    const initialEnergy = store.energy.current;

    // First mark free play as used
    store.recordPlay('snack_catch', true);

    // Now use energy for second play
    const success = store.useEnergy(ENERGY_COST_PER_GAME);
    expect(success).toBe(true);

    const newState = useGameStore.getState();
    expect(newState.energy.current).toBe(initialEnergy - ENERGY_COST_PER_GAME);
    expect(ENERGY_COST_PER_GAME).toBe(10);
  });

  it('prevents play when energy < 10 (after free used)', () => {
    const store = useGameStore.getState();

    // Mark free play as used
    store.recordPlay('snack_catch', true);

    // Drain energy to below 10
    store.useEnergy(45); // 50 - 45 = 5

    const canPlayResult = store.canPlay('snack_catch');
    expect(canPlayResult.allowed).toBe(false);
    expect(canPlayResult.reason).toBe('Not enough energy');
  });

  it('regenerates 1 energy per 30 minutes', () => {
    const store = useGameStore.getState();

    // Use some energy
    store.useEnergy(20);
    const afterUse = useGameStore.getState();
    expect(afterUse.energy.current).toBe(30);

    // Mock time passing (30 minutes = 1800000ms)
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now + ENERGY_REGEN_MS);

    // Tick regen
    useGameStore.getState().tickEnergyRegen();

    const afterRegen = useGameStore.getState();
    expect(afterRegen.energy.current).toBe(31);

    vi.useRealTimers();
  });

  it('never exceeds 50 energy', () => {
    const store = useGameStore.getState();

    // Try to add energy when full
    store.addEnergy(10);
    const state = useGameStore.getState();
    expect(state.energy.current).toBe(ENERGY_MAX);

    // Use some, then add more than needed
    store.useEnergy(5);
    store.addEnergy(20);
    const afterAdd = useGameStore.getState();
    expect(afterAdd.energy.current).toBe(ENERGY_MAX);
  });

  it('returns correct time to next energy', () => {
    const store = useGameStore.getState();

    // When full, should be 0
    expect(store.getTimeToNextEnergy()).toBe(0);

    // Use some energy
    store.useEnergy(10);

    // Should return positive time
    const time = useGameStore.getState().getTimeToNextEnergy();
    expect(time).toBeGreaterThan(0);
    expect(time).toBeLessThanOrEqual(ENERGY_REGEN_MS);
  });
});

describe('Daily Play Tracking', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('first play of day is free (no energy cost)', () => {
    const store = useGameStore.getState();
    const canPlayResult = store.canPlay('snack_catch');

    expect(canPlayResult.allowed).toBe(true);
    expect(canPlayResult.isFree).toBe(true);
  });

  it('tracks plays per game separately', () => {
    const store = useGameStore.getState();

    // Play snack_catch
    store.recordPlay('snack_catch', true);
    store.recordPlay('snack_catch', false);

    // memory_match should still be free
    const memoryStatus = store.canPlay('memory_match');
    expect(memoryStatus.isFree).toBe(true);

    // snack_catch should not be free
    const snackStatus = useGameStore.getState().canPlay('snack_catch');
    expect(snackStatus.isFree).toBe(false);
  });

  it('caps at 3 rewarded plays per game', () => {
    const store = useGameStore.getState();

    // Play 3 times
    store.recordPlay('snack_catch', true);
    store.recordPlay('snack_catch', false);
    store.recordPlay('snack_catch', false);

    const canPlayResult = useGameStore.getState().canPlay('snack_catch');
    expect(canPlayResult.allowed).toBe(false);
    expect(canPlayResult.reason).toBe('Daily limit reached');
    expect(DAILY_REWARDED_PLAYS_CAP).toBe(3);
  });

  it('resets counts when date changes', () => {
    const store = useGameStore.getState();

    // Play until capped
    store.recordPlay('snack_catch', true);
    store.recordPlay('snack_catch', false);
    store.recordPlay('snack_catch', false);

    // Simulate date change by directly modifying state (mocking)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    // Mock getTodayString to return tomorrow
    vi.useFakeTimers();
    vi.setSystemTime(tomorrow);

    // canPlay should trigger reset
    const canPlayResult = useGameStore.getState().canPlay('snack_catch');
    expect(canPlayResult.allowed).toBe(true);
    expect(canPlayResult.isFree).toBe(true);

    vi.useRealTimers();
  });

  it('correctly marks free play as used', () => {
    const store = useGameStore.getState();

    // First play should be free
    const firstStatus = store.canPlay('snack_catch');
    expect(firstStatus.isFree).toBe(true);

    // Record free play
    store.recordPlay('snack_catch', true);

    // Second play should not be free
    const secondStatus = useGameStore.getState().canPlay('snack_catch');
    expect(secondStatus.isFree).toBe(false);
  });
});

describe('Reward Calculator', () => {
  it('returns bronze for 0–99', () => {
    expect(calculateTier(0)).toBe('bronze');
    expect(calculateTier(50)).toBe('bronze');
    expect(calculateTier(99)).toBe('bronze');
  });

  it('returns silver for 100–199', () => {
    expect(calculateTier(100)).toBe('silver');
    expect(calculateTier(150)).toBe('silver');
    expect(calculateTier(199)).toBe('silver');
  });

  it('returns gold for 200–299', () => {
    expect(calculateTier(200)).toBe('gold');
    expect(calculateTier(250)).toBe('gold');
    expect(calculateTier(299)).toBe('gold');
  });

  it('returns rainbow for 300+', () => {
    expect(calculateTier(300)).toBe('rainbow');
    expect(calculateTier(500)).toBe('rainbow');
    expect(calculateTier(1000)).toBe('rainbow');
  });

  it('never awards gems in result shape', () => {
    // Test multiple times with different scores
    const scores = [50, 150, 250, 350];
    scores.forEach((score) => {
      const result = createMiniGameResult('snack_catch', score, 'munchlet');
      // Result shape doesn't include gems
      expect(result.rewards).not.toHaveProperty('gems');
      expect(Object.keys(result.rewards)).toEqual(['coins', 'xp', 'foodDrop']);
    });
  });

  it('applies Fizz +25% bonus when petId=fizz', () => {
    // Mock random to get consistent results
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const regularRewards = calculateRewards(150, 'munchlet');
    const fizzRewards = calculateRewards(150, 'fizz');

    // Fizz should get ~25% more (rounded)
    expect(fizzRewards.coins).toBeGreaterThan(regularRewards.coins);
    expect(fizzRewards.xp).toBeGreaterThan(regularRewards.xp);

    // Calculate expected bonus (1.25x, rounded)
    const expectedCoins = Math.round(regularRewards.coins * 1.25);
    const expectedXp = Math.round(regularRewards.xp * 1.25);

    expect(fizzRewards.coins).toBe(expectedCoins);
    expect(fizzRewards.xp).toBe(expectedXp);

    vi.restoreAllMocks();
  });

  it('applies food drop chances by tier', () => {
    // Run multiple times to test probability distribution
    let bronzeDrops = 0;
    let silverDrops = 0;
    let goldDrops = 0;
    let rainbowDrops = 0;
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      const bronzeResult = calculateRewards(50, 'munchlet');
      const silverResult = calculateRewards(150, 'munchlet');
      const goldResult = calculateRewards(250, 'munchlet');
      const rainbowResult = calculateRewards(350, 'munchlet');

      if (bronzeResult.foodDrop) bronzeDrops++;
      if (silverResult.foodDrop) silverDrops++;
      if (goldResult.foodDrop) goldDrops++;
      if (rainbowResult.foodDrop) rainbowDrops++;
    }

    // Bronze should have 0% drop rate
    expect(bronzeDrops).toBe(0);

    // Rainbow should have 100% drop rate
    expect(rainbowDrops).toBe(iterations);

    // Silver (~40%) and Gold (~75%) should be in between
    // Allow some variance for random
    expect(silverDrops).toBeGreaterThan(0);
    expect(goldDrops).toBeGreaterThan(silverDrops);
  });

  it('returns coins within expected ranges per tier', () => {
    // Test each tier multiple times
    const tiers: Array<{ score: number; tier: RewardTier; minCoins: number; maxCoins: number }> = [
      { score: 50, tier: 'bronze', minCoins: 2, maxCoins: 3 },
      { score: 150, tier: 'silver', minCoins: 5, maxCoins: 7 },
      { score: 250, tier: 'gold', minCoins: 8, maxCoins: 15 },
      { score: 350, tier: 'rainbow', minCoins: 12, maxCoins: 22 },
    ];

    tiers.forEach(({ score, tier, minCoins, maxCoins }) => {
      for (let i = 0; i < 50; i++) {
        const result = createMiniGameResult('snack_catch', score, 'munchlet');
        expect(result.tier).toBe(tier);
        expect(result.rewards.coins).toBeGreaterThanOrEqual(minCoins);
        expect(result.rewards.coins).toBeLessThanOrEqual(maxCoins);
      }
    });
  });
});

describe('Stats Tracking', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('increments minigamesCompleted on game completion', () => {
    const store = useGameStore.getState();
    const initialCount = store.stats.minigamesCompleted;

    // Complete a game
    const result = createMiniGameResult('snack_catch', 150, 'munchlet');
    store.completeGame(result);

    const newState = useGameStore.getState();
    expect(newState.stats.minigamesCompleted).toBe(initialCount + 1);
  });

  it('updates totalXpEarned and totalCoinsEarned', () => {
    const store = useGameStore.getState();
    const initialXp = store.stats.totalXpEarned;
    const initialCoins = store.stats.totalCoinsEarned;

    // Complete a game with known rewards
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = createMiniGameResult('snack_catch', 150, 'munchlet');
    store.completeGame(result);

    const newState = useGameStore.getState();
    expect(newState.stats.totalXpEarned).toBe(initialXp + result.rewards.xp);
    expect(newState.stats.totalCoinsEarned).toBe(initialCoins + result.rewards.coins);

    vi.restoreAllMocks();
  });

  it('awards food drop to inventory', () => {
    const store = useGameStore.getState();

    // Mock random to ensure food drop
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    // Create a rainbow result (guaranteed drop)
    const result = createMiniGameResult('snack_catch', 350, 'munchlet');
    expect(result.rewards.foodDrop).not.toBeNull();

    const foodId = result.rewards.foodDrop!;
    const initialCount = store.inventory[foodId] || 0;

    store.completeGame(result);

    const newState = useGameStore.getState();
    expect(newState.inventory[foodId]).toBe(initialCount + 1);

    vi.restoreAllMocks();
  });

  it('starts with minigamesCompleted = 0', () => {
    const store = useGameStore.getState();
    expect(store.stats.minigamesCompleted).toBe(0);
  });
});

describe('Helper Functions', () => {
  it('getTodayString returns correct format', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('createInitialDailyState has correct structure', () => {
    const state = createInitialDailyState();

    expect(state.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(state.plays).toBeDefined();
    expect(state.freePlayUsed).toBeDefined();

    // All games should be initialized
    const gameIds: MiniGameId[] = ['snack_catch', 'memory_match', 'pips', 'rhythm_tap', 'poop_scoop'];
    gameIds.forEach((id) => {
      expect(state.plays[id]).toBe(0);
      expect(state.freePlayUsed[id]).toBe(false);
    });
  });

  it('createInitialEnergyState has correct values', () => {
    const state = createInitialEnergyState();

    expect(state.current).toBe(ENERGY_MAX);
    expect(state.max).toBe(ENERGY_MAX);
    expect(state.regenRateMs).toBe(ENERGY_REGEN_MS);
    expect(state.lastRegenTime).toBeLessThanOrEqual(Date.now());
  });
});
