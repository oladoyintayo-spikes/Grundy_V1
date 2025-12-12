// ============================================
// GRUNDY — MINI-GAME REWARDS SYSTEM
// Bible §8.3 - Reward tiers and calculations
// ============================================

import type { MiniGameId, RewardTier, MiniGameResult } from '../types';
import { applyMinigameBonus } from './abilities';

// ============================================
// CONSTANTS (LOCKED)
// ============================================

export const ENERGY_MAX = 50;
export const ENERGY_COST_PER_GAME = 10;
export const ENERGY_REGEN_MS = 30 * 60 * 1000; // 30 minutes
export const DAILY_REWARDED_PLAYS_CAP = 3;

// ============================================
// TIER CALCULATION
// ============================================

/**
 * Calculate reward tier based on score
 * Bible §8.3: Bronze 0-99, Silver 100-199, Gold 200-299, Rainbow 300+
 */
export function calculateTier(score: number): RewardTier {
  if (score >= 300) return 'rainbow';
  if (score >= 200) return 'gold';
  if (score >= 100) return 'silver';
  return 'bronze';
}

// ============================================
// REWARD CALCULATION
// ============================================

/**
 * Coin ranges per tier (LOCKED)
 * Web Edition mini-games award 0 gems always (Bible §8.3).
 * Unity may award gems for Rainbow tier; Web does not.
 */
const COIN_RANGES: Record<RewardTier, [number, number]> = {
  bronze: [2, 3],
  silver: [5, 7],
  gold: [8, 15],
  rainbow: [12, 22],
};

/**
 * XP values per tier
 */
const XP_VALUES: Record<RewardTier, number> = {
  bronze: 3,
  silver: 5,
  gold: 8,
  rainbow: 12,
};

/**
 * Food drop chances per tier
 */
const FOOD_DROP_CHANCES: Record<RewardTier, number> = {
  bronze: 0,
  silver: 0.4,
  gold: 0.75,
  rainbow: 1.0,
};

/**
 * Common foods that can drop (aligned with foods.ts)
 */
const COMMON_FOODS = ['apple', 'carrot', 'banana'];

/**
 * Rare foods that can drop (aligned with foods.ts)
 */
const RARE_FOODS = ['dream_treat', 'golden_feast'];

/**
 * Roll for food drop based on tier
 */
function rollFoodDrop(tier: RewardTier): string | null {
  const dropChance = FOOD_DROP_CHANCES[tier];

  if (Math.random() > dropChance) return null;

  // Rainbow tier guarantees rare food
  if (tier === 'rainbow') {
    return RARE_FOODS[Math.floor(Math.random() * RARE_FOODS.length)];
  }

  // Gold has 75% any, so 25% chance of rare if it drops
  if (tier === 'gold' && Math.random() < 0.25) {
    return RARE_FOODS[Math.floor(Math.random() * RARE_FOODS.length)];
  }

  // Default to common food
  return COMMON_FOODS[Math.floor(Math.random() * COMMON_FOODS.length)];
}

/**
 * Calculate rewards for a mini-game completion
 * Applies Fizz's +25% minigame bonus if applicable
 */
export function calculateRewards(
  score: number,
  petId: string
): MiniGameResult['rewards'] {
  const tier = calculateTier(score);

  // Get base coin range and randomize
  const [minCoins, maxCoins] = COIN_RANGES[tier];
  const baseCoins = Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
  const baseXp = XP_VALUES[tier];

  // Apply Fizz's +25% minigame bonus (applies to both coins and XP)
  const finalCoins = applyMinigameBonus(petId, baseCoins);
  const finalXp = applyMinigameBonus(petId, baseXp);

  // Roll for food drop
  const foodDrop = rollFoodDrop(tier);

  return {
    coins: finalCoins,
    xp: finalXp,
    foodDrop,
  };
}

/**
 * Create a complete MiniGameResult
 */
export function createMiniGameResult(
  gameId: MiniGameId,
  score: number,
  petId: string
): MiniGameResult {
  const tier = calculateTier(score);
  const rewards = calculateRewards(score, petId);

  return {
    gameId,
    score,
    tier,
    rewards,
  };
}

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Create initial daily mini-game state
 */
export function createInitialDailyState(): {
  date: string;
  plays: Record<MiniGameId, number>;
  freePlayUsed: Record<MiniGameId, boolean>;
} {
  return {
    date: getTodayString(),
    plays: {
      snack_catch: 0,
      memory_match: 0,
      pips: 0,
      rhythm_tap: 0,
      poop_scoop: 0,
    },
    freePlayUsed: {
      snack_catch: false,
      memory_match: false,
      pips: false,
      rhythm_tap: false,
      poop_scoop: false,
    },
  };
}

/**
 * Create initial energy state
 */
export function createInitialEnergyState(): {
  current: number;
  max: number;
  lastRegenTime: number;
  regenRateMs: number;
} {
  return {
    current: ENERGY_MAX,
    max: ENERGY_MAX,
    lastRegenTime: Date.now(),
    regenRateMs: ENERGY_REGEN_MS,
  };
}
