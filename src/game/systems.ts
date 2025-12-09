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
  CurrencyType
} from '../types';
import { GAME_CONFIG, getXPForLevel } from '../data/config';
import { getPetById } from '../data/pets';
import { getFoodById } from '../data/foods';

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
  if (level >= GAME_CONFIG.evolutionLevels.adult) return 'adult';
  if (level >= GAME_CONFIG.evolutionLevels.youth) return 'youth';
  return 'baby';
}

export function decayHunger(current: number, minutesElapsed: number): number {
  const decay = minutesElapsed * GAME_CONFIG.hungerDecayPerMinute;
  return Math.max(0, current - decay);
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
    case 'adult': return '🌳';
  }
}

// ============================================
// FEEDING SYSTEM
// ============================================

export function calculateReaction(petId: string, food: FoodDefinition): ReactionType {
  const pet = getPetById(petId);
  if (!pet) return 'neutral';
  
  // Check favorites first (highest priority)
  if (food.favoriteFor.includes(petId)) {
    return 'ecstatic';
  }
  
  // Check hated
  if (food.hatedBy.includes(petId)) {
    return 'negative';
  }
  
  // Check category preferences
  if (food.tags.includes(pet.favoriteCategory)) {
    return 'positive';
  }
  
  if (food.tags.includes(pet.hatedCategory)) {
    return 'negative';
  }
  
  // Premium foods always positive
  if (food.category === 'premium') {
    return 'positive';
  }
  
  // Rare foods usually positive
  if (food.category === 'rare') {
    return 'positive';
  }
  
  return 'neutral';
}

export function calculateXPGain(
  food: FoodDefinition, 
  reaction: ReactionType, 
  mood: MoodState,
  hunger: number
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
  
  return Math.round(xp);
}

export function calculateBondChange(food: FoodDefinition, reaction: ReactionType): number {
  let bond = food.bond;
  
  if (reaction === 'ecstatic') {
    bond *= 1.5;
  } else if (reaction === 'negative') {
    bond = -Math.abs(bond) * 0.5;
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

export function calculateCoinReward(reaction: ReactionType): number {
  return GAME_CONFIG.coinRewards[reaction];
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
  
  // Calculate reaction
  const reaction = calculateReaction(pet.id, food);
  
  // Calculate gains
  const xpGained = calculateXPGain(food, reaction, pet.mood, pet.hunger);
  const bondGained = calculateBondChange(food, reaction);
  const coinsGained = calculateCoinReward(reaction);
  
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
