// ============================================
// GRUNDY — GAME SYSTEMS
// Pure functions for game logic
// ============================================

import {
  PetState,
  MoodState,
  EvolutionStage,
  ReactionType,
  FoodDefinition,
  FeedResult,
  Affinity
} from '../types';
import { GAME_CONFIG, getXPForLevel } from '../data/config';
import { getPetById } from '../data/pets';
import { getFoodById } from '../data/foods';
import {
  applyNoDislikesAbility,
  applyBondBonus,
  applySpicyCoinBonus,
  applyRareXPChance,
  applyDecayReduction
} from './abilities';
import {
  EVOLUTION_THRESHOLDS,
  FULLNESS_STATES,
  COOLDOWN,
  type FullnessState
} from '../constants/bible.constants';

// ============================================
// PET SYSTEM
// ============================================

export function createInitialPet(petId: string, customName?: string): PetState {
  return {
    id: petId,
    customName: customName || '',
    level: 1,
    xp: 0,
    bond: 0,
    mood: 'neutral',
    hunger: 50,
    evolutionStage: 'baby',
  };
}

export function getEvolutionStage(level: number): EvolutionStage {
  // Use bible.constants.ts as single source of truth (Bible §6.1 LOCKED)
  if (level >= EVOLUTION_THRESHOLDS.EVOLVED) return 'evolved';
  if (level >= EVOLUTION_THRESHOLDS.YOUTH) return 'youth';
  return 'baby';
}

export function decayHunger(current: number, minutesElapsed: number, petId?: string): number {
  let decay = minutesElapsed * GAME_CONFIG.hungerDecayPerMinute;

  // Apply Plompo's Slow Metabolism ability: -20% decay rate
  if (petId) {
    decay = applyDecayReduction(petId, decay);
  }

  return Math.max(0, current - decay);
}

// ============================================
// FULLNESS SYSTEM (Bible §4.4)
// ============================================

/**
 * Get the fullness state for a given hunger/fullness value.
 * Note: In Grundy, "hunger" gauge is actually fullness (0=empty, 100=full/stuffed)
 * @see Bible §4.4 Fullness States
 */
export function getFullnessState(fullness: number): FullnessState {
  if (fullness >= FULLNESS_STATES.STUFFED.min) return 'STUFFED';
  if (fullness >= FULLNESS_STATES.SATISFIED.min) return 'SATISFIED';
  if (fullness >= FULLNESS_STATES.CONTENT.min) return 'CONTENT';
  if (fullness >= FULLNESS_STATES.PECKISH.min) return 'PECKISH';
  return 'HUNGRY';
}

/**
 * Get the feed value multiplier for a given fullness level.
 * Returns 0 for STUFFED (feeding blocked), reduced values for higher fullness.
 * @see Bible §4.4 - STUFFED blocks feeding entirely
 */
export function getFullnessFeedValue(fullness: number): number {
  const state = getFullnessState(fullness);
  return FULLNESS_STATES[state].feedValue;
}

/**
 * Check if pet is too full to feed (STUFFED state).
 * @see Bible §4.4 - "LOCKED RULE: When fullness reaches STUFFED (91-100),
 *                    feeding is completely blocked, not just reduced."
 */
export function isStuffed(fullness: number): boolean {
  return fullness >= FULLNESS_STATES.STUFFED.min;
}

// ============================================
// COOLDOWN SYSTEM (Bible §4.3)
// ============================================

/**
 * Check if currently in feeding cooldown.
 * @param lastFeedCooldownStart Timestamp when cooldown started (ms)
 * @param now Current timestamp (ms), defaults to Date.now()
 */
export function isOnCooldown(lastFeedCooldownStart: number, now: number = Date.now()): boolean {
  if (lastFeedCooldownStart === 0) return false;
  return (now - lastFeedCooldownStart) < COOLDOWN.DURATION_MS;
}

/**
 * Get remaining cooldown time in milliseconds.
 * @param lastFeedCooldownStart Timestamp when cooldown started (ms)
 * @param now Current timestamp (ms)
 */
export function getCooldownRemaining(lastFeedCooldownStart: number, now: number = Date.now()): number {
  if (lastFeedCooldownStart === 0) return 0;
  const elapsed = now - lastFeedCooldownStart;
  return Math.max(0, COOLDOWN.DURATION_MS - elapsed);
}

/**
 * Get the feed value multiplier considering cooldown state.
 * @see Bible §4.3 - "During cooldown: 25%"
 */
export function getCooldownFeedValue(lastFeedCooldownStart: number, now: number = Date.now()): number {
  return isOnCooldown(lastFeedCooldownStart, now) ? COOLDOWN.REDUCED_VALUE : 1.0;
}

/**
 * Calculate combined feed value multiplier from fullness and cooldown.
 * Fullness feedValue × Cooldown feedValue
 * Returns 0 if STUFFED (completely blocked).
 */
export function getCombinedFeedValue(
  fullness: number,
  lastFeedCooldownStart: number,
  now: number = Date.now()
): number {
  const fullnessValue = getFullnessFeedValue(fullness);
  // If stuffed, return 0 immediately (blocked)
  if (fullnessValue === 0) return 0;

  const cooldownValue = getCooldownFeedValue(lastFeedCooldownStart, now);
  return fullnessValue * cooldownValue;
}

export function getMoodEmoji(mood: MoodState): string {
  switch (mood) {
    case 'ecstatic': return '🤩';
    case 'happy': return '😊';
    case 'neutral': return '😐';
    case 'sad': return '😢';
  }
}

export function getEvolutionEmoji(stage: EvolutionStage): string {
  switch (stage) {
    case 'baby': return '🥒';
    case 'youth': return '🌿';
    case 'evolved': return '🌳';
  }
}

// ============================================
// FEEDING SYSTEM
// ============================================

export function calculateReaction(petId: string, food: FoodDefinition): ReactionType {
  // Use the affinity matrix from food definitions
  // food.affinity maps petId -> 'loved' | 'liked' | 'neutral' | 'disliked'
  let affinity: Affinity = food.affinity[petId] || 'neutral';

  // Apply Chomper's Iron Stomach ability: No food dislikes
  affinity = applyNoDislikesAbility(petId, affinity);

  // Map affinity to reaction type
  switch (affinity) {
    case 'loved':
      return 'ecstatic';
    case 'liked':
      return 'positive';
    case 'disliked':
      return 'negative';
    case 'neutral':
    default:
      // For neutral affinity, check food rarity for bonus
      // Epic/Legendary foods give positive reaction even if neutral affinity
      if (food.rarity === 'epic' || food.rarity === 'legendary') {
        return 'positive';
      }
      // Rare foods have a chance to be positive
      // TODO: P1-x - Add randomization per Bible spec
      if (food.rarity === 'rare') {
        return 'positive';
      }
      return 'neutral';
  }
}

export function calculateXPGain(
  food: FoodDefinition,
  reaction: ReactionType,
  mood: MoodState,
  hunger: number,
  petId?: string
): number {
  let xp = food.xp;

  // Apply reaction modifier
  xp *= GAME_CONFIG.reactionModifiers[reaction];

  // Apply mood modifier
  xp *= GAME_CONFIG.moodModifiers[mood];

  // Apply hunger penalty if very hungry
  if (hunger < 20) {
    xp *= 0.5;
  }

  xp = Math.round(xp);

  // Apply Whisp's Lucky Nibbles ability: +50% chance of rare XP drops
  if (petId) {
    xp = applyRareXPChance(petId, xp);
  }

  return xp;
}

export function calculateBondChange(food: FoodDefinition, reaction: ReactionType, petId?: string): number {
  let bond = food.bond;

  if (reaction === 'ecstatic') {
    bond *= 1.5;
  } else if (reaction === 'negative') {
    bond = -Math.abs(bond) * 0.5;
  }

  // Apply Munchlet's Comfort Food ability: +10% bond from feeding
  if (petId) {
    bond = applyBondBonus(petId, bond);
  }

  return bond;
}

export function calculateHungerRestore(reaction: ReactionType): number {
  switch (reaction) {
    case 'ecstatic': return 20;
    case 'positive': return 15;
    case 'neutral': return 10;
    case 'negative': return 5;
  }
}

export function calculateCoinReward(reaction: ReactionType, petId?: string, food?: FoodDefinition): number {
  let coins = GAME_CONFIG.coinRewards[reaction];

  // Apply Ember's Spicy Lover ability: 2× coins from spicy foods
  if (petId && food) {
    coins = applySpicyCoinBonus(petId, food, coins);
  }

  return coins;
}

export function processFeed(
  pet: PetState,
  foodId: string,
  inventory: Record<string, number>
): FeedResult | null {
  // Check inventory
  if (!inventory[foodId] || inventory[foodId] <= 0) {
    return null;
  }

  const food = getFoodById(foodId);
  if (!food) return null;

  // Calculate reaction (includes Chomper's Iron Stomach ability)
  const reaction = calculateReaction(pet.id, food);

  // Calculate gains (with ability effects)
  const xpGained = calculateXPGain(food, reaction, pet.mood, pet.hunger, pet.id);
  const bondGained = calculateBondChange(food, reaction, pet.id);
  const coinsGained = calculateCoinReward(reaction, pet.id, food);

  // Check level up
  const newXP = pet.xp + xpGained;
  const xpNeeded = getXPForLevel(pet.level + 1);
  const leveledUp = newXP >= xpNeeded && pet.level < GAME_CONFIG.maxLevel;
  const newLevel = leveledUp ? pet.level + 1 : pet.level;

  // Check evolution
  const currentStage = pet.evolutionStage;
  const newStage = getEvolutionStage(newLevel);
  const evolved = newStage !== currentStage;

  return {
    success: true,
    foodId,
    reaction,
    xpGained,
    bondGained,
    coinsGained,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    evolved,
    newStage: evolved ? newStage : undefined,
  };
}

// ============================================
// MOOD SYSTEM
// ============================================

export function getMoodAfterReaction(currentMood: MoodState, reaction: ReactionType): MoodState {
  if (reaction === 'ecstatic') {
    // Improve mood
    switch (currentMood) {
      case 'sad': return 'neutral';
      case 'neutral': return 'happy';
      case 'happy': return 'ecstatic';
      default: return currentMood;
    }
  } else if (reaction === 'negative') {
    // Worsen mood
    switch (currentMood) {
      case 'ecstatic': return 'happy';
      case 'happy': return 'neutral';
      case 'neutral': return 'sad';
      default: return currentMood;
    }
  }
  
  return currentMood;
}

// ============================================
// PROGRESSION SYSTEM
// ============================================

export function getLevelProgress(xp: number, level: number): number {
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpIntoLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  
  if (xpNeeded <= 0) return 1;
  return Math.min(1, Math.max(0, xpIntoLevel / xpNeeded));
}

export function getXPDisplay(xp: number, level: number): { current: number; needed: number } {
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  
  return {
    current: xp - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
  };
}

// ============================================
// REACTION DISPLAY
// ============================================

export function getReactionEmoji(reaction: ReactionType): string {
  switch (reaction) {
    case 'ecstatic': return '🤩';
    case 'positive': return '😋';
    case 'neutral': return '😊';
    case 'negative': return '😖';
  }
}

export function getReactionMessage(reaction: ReactionType, petName: string): string {
  switch (reaction) {
    case 'ecstatic': return `${petName} LOVES it! ✨`;
    case 'positive': return `${petName} enjoys it!`;
    case 'neutral': return `${petName} eats it.`;
    case 'negative': return `${petName} doesn't like this...`;
  }
}

export function getReactionColor(reaction: ReactionType): string {
  switch (reaction) {
    case 'ecstatic': return 'text-yellow-400';
    case 'positive': return 'text-green-400';
    case 'neutral': return 'text-blue-400';
    case 'negative': return 'text-red-400';
  }
}
