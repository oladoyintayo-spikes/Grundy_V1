// ============================================
// GRUNDY — GAME CONFIGURATION
// SPEC: See specs/game_config.yaml
// ============================================

import { GameConfig, MoodState, ReactionType } from '../types';

export const GAME_CONFIG: GameConfig = {
  // Leveling
  maxLevel: 50,
  xpFormula: {
    base: 20,
    multiplier: 1.4,
  },
  
  // Pet stats
  maxBond: 100,
  maxHunger: 100,
  hungerDecayPerMinute: 0.1, // 1% per 10 minutes
  
  // Evolution thresholds
  evolutionLevels: {
    youth: 10,
    evolved: 25,
  },
  
  // Mood XP modifiers
  moodModifiers: {
    happy: 1.1,      // +10%
    neutral: 1.0,
    sad: 0.8,        // -20%
    ecstatic: 1.2,   // +20%
  } as Record<MoodState, number>,
  
  // Reaction XP modifiers
  reactionModifiers: {
    ecstatic: 1.5,   // +50%
    positive: 1.2,   // +20%
    neutral: 1.0,
    negative: 0.5,   // -50%
  } as Record<ReactionType, number>,
  
  // Coin rewards per reaction
  coinRewards: {
    ecstatic: 15,
    positive: 10,
    neutral: 5,
    negative: 3,
  } as Record<ReactionType, number>,
};

// XP required for each level (pre-calculated for quick lookup)
export const XP_TABLE: number[] = [];
for (let level = 0; level <= GAME_CONFIG.maxLevel + 1; level++) {
  XP_TABLE[level] = Math.round(
    GAME_CONFIG.xpFormula.base + (level * level * GAME_CONFIG.xpFormula.multiplier)
  );
}

// Get XP required to reach a level
export function getXPForLevel(level: number): number {
  return XP_TABLE[level] || XP_TABLE[GAME_CONFIG.maxLevel];
}

// Get XP required for NEXT level
export function getXPToNextLevel(currentLevel: number): number {
  return getXPForLevel(currentLevel + 1);
}

// Calculate total XP needed from 0 to reach a level
export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l <= level; l++) {
    total += getXPForLevel(l);
  }
  return total;
}
