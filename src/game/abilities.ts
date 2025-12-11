// ============================================
// GRUNDY — PET ABILITY SYSTEM
// Bible §3.7 - Each pet has a unique passive ability
// ============================================

import { AbilityEffectType, PetAbility, FoodDefinition, Affinity } from '../types';
import { getPetAbility, getPetById } from '../data/pets';

// ============================================
// ABILITY QUERY FUNCTIONS
// ============================================

/**
 * Check if a pet has a specific ability effect type
 */
export function hasAbilityEffect(petId: string, effectType: AbilityEffectType): boolean {
  const ability = getPetAbility(petId);
  return ability?.effect.type === effectType;
}

/**
 * Get the ability effect value for a pet (returns 0 if no match)
 */
export function getAbilityValue(petId: string, effectType: AbilityEffectType): number {
  const ability = getPetAbility(petId);
  if (ability?.effect.type === effectType) {
    return ability.effect.value;
  }
  return 0;
}

/**
 * Get the full ability data for a pet
 */
export function getAbility(petId: string): PetAbility | undefined {
  return getPetAbility(petId);
}

// ============================================
// ABILITY EFFECT APPLICATIONS
// ============================================

/**
 * Apply Munchlet's Comfort Food ability: +10% bond from feeding
 */
export function applyBondBonus(petId: string, baseBond: number): number {
  if (hasAbilityEffect(petId, 'bond_bonus')) {
    const bonus = getAbilityValue(petId, 'bond_bonus');
    return baseBond * (1 + bonus);
  }
  return baseBond;
}

/**
 * Apply Grib's Chill Vibes ability: -20% mood penalty from neglect
 * Reduces the severity of negative mood changes
 */
export function applyMoodPenaltyReduction(petId: string, moodPenalty: number): number {
  if (hasAbilityEffect(petId, 'mood_penalty_reduction')) {
    const reduction = getAbilityValue(petId, 'mood_penalty_reduction');
    return moodPenalty * (1 - reduction);
  }
  return moodPenalty;
}

/**
 * Apply Plompo's Slow Metabolism ability: -20% hunger/energy decay rate
 */
export function applyDecayReduction(petId: string, baseDecay: number): number {
  if (hasAbilityEffect(petId, 'decay_reduction')) {
    const reduction = getAbilityValue(petId, 'decay_reduction');
    return baseDecay * (1 - reduction);
  }
  return baseDecay;
}

/**
 * Apply Plompo's Slow Metabolism ability to mood decay: -20% mood decay rate
 * Bible §4.10: Plompo - "-20% mood decay rate"
 */
export function applyMoodDecayReduction(petId: string, baseMoodDecay: number): number {
  if (hasAbilityEffect(petId, 'decay_reduction')) {
    const reduction = getAbilityValue(petId, 'decay_reduction');
    return baseMoodDecay * (1 - reduction);
  }
  return baseMoodDecay;
}

/**
 * Apply Fizz's Hyperactive ability: +25% minigame score bonus
 */
export function applyMinigameBonus(petId: string, baseScore: number): number {
  if (hasAbilityEffect(petId, 'minigame_bonus')) {
    const bonus = getAbilityValue(petId, 'minigame_bonus');
    return Math.round(baseScore * (1 + bonus));
  }
  return baseScore;
}

/**
 * Check if food is spicy (for Ember's ability)
 */
export function isSpicyFood(food: FoodDefinition): boolean {
  // Foods that contain "spicy", "hot", "pepper", "taco" in name or description
  const spicyKeywords = ['spicy', 'hot', 'pepper', 'taco', 'chili'];
  const name = food.name.toLowerCase();
  const desc = food.description.toLowerCase();

  return spicyKeywords.some(keyword =>
    name.includes(keyword) || desc.includes(keyword)
  );
}

/**
 * Apply Ember's Spicy Lover ability: 2× coins from spicy foods
 */
export function applySpicyCoinBonus(petId: string, food: FoodDefinition, baseCoins: number): number {
  if (hasAbilityEffect(petId, 'spicy_coin_bonus') && isSpicyFood(food)) {
    const multiplier = getAbilityValue(petId, 'spicy_coin_bonus');
    return Math.round(baseCoins * multiplier);
  }
  return baseCoins;
}

/**
 * Apply Chomper's Iron Stomach ability: No food dislikes
 * Converts 'disliked' affinity to 'neutral'
 */
export function applyNoDislikesAbility(petId: string, affinity: Affinity): Affinity {
  if (hasAbilityEffect(petId, 'no_dislikes') && affinity === 'disliked') {
    return 'neutral';
  }
  return affinity;
}

/**
 * Apply Whisp's Lucky Nibbles ability: +50% chance of rare XP drops
 * Returns bonus XP if the rare drop triggers
 */
export function applyRareXPChance(petId: string, baseXP: number): number {
  if (hasAbilityEffect(petId, 'rare_xp_chance')) {
    const bonusChance = getAbilityValue(petId, 'rare_xp_chance');
    // Base 10% chance of rare XP, increased by ability
    const baseChance = 0.10;
    const totalChance = baseChance + (baseChance * bonusChance);

    if (Math.random() < totalChance) {
      // Rare XP drop: +50% bonus XP
      return Math.round(baseXP * 1.5);
    }
  }
  return baseXP;
}

/**
 * Apply Luxe's Golden Touch ability: +100% gem drops from all sources
 */
export function applyGemMultiplier(petId: string, baseGems: number): number {
  if (hasAbilityEffect(petId, 'gem_multiplier')) {
    const multiplier = getAbilityValue(petId, 'gem_multiplier');
    return Math.round(baseGems * multiplier);
  }
  return baseGems;
}

// ============================================
// UNIFIED ABILITY APPLICATION
// ============================================

export interface AbilityContext {
  petId: string;
  action: 'feed' | 'decay' | 'minigame' | 'gem_drop';
  baseValue: number;
  food?: FoodDefinition;
  affinity?: Affinity;
}

/**
 * Apply all relevant abilities for a given context
 * Returns the modified value after ability effects
 */
export function applyAbilities(context: AbilityContext): number {
  const { petId, action, baseValue, food, affinity } = context;

  switch (action) {
    case 'feed':
      // This is handled by specific functions for bond/coins/xp
      return baseValue;
    case 'decay':
      return applyDecayReduction(petId, baseValue);
    case 'minigame':
      return applyMinigameBonus(petId, baseValue);
    case 'gem_drop':
      return applyGemMultiplier(petId, baseValue);
    default:
      return baseValue;
  }
}
