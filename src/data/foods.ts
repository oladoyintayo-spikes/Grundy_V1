// ============================================
// GRUNDY — FOOD DEFINITIONS
// DATA SOURCE: grundy_interactive_mockup.html (authoritative)
// SPEC: grundy_complete_game_bible.md
// ============================================

import { FoodDefinition, Affinity } from '../types';

// =============================================================================
// FOOD DEFINITIONS - EXACT VALUES FROM INTERACTIVE MOCKUP
// =============================================================================

export const FOODS: Record<string, FoodDefinition> = {
  // === COMMON (1-2 XP) ===
  apple: {
    id: 'apple',
    name: 'Apple',
    description: 'A crisp, refreshing snack.',
    rarity: 'common',
    hunger: 12,
    mood: 1,
    xp: 2,
    bond: 0.5,
    coinCost: 5,
    gemCost: 0,
    affinity: { munchlet: 'liked', grib: 'neutral', plompo: 'neutral' },
    emoji: '🍎',
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    description: 'Sweet and nutritious.',
    rarity: 'common',
    hunger: 10,
    mood: 1,
    xp: 2,
    bond: 0.5,
    coinCost: 5,
    gemCost: 0,
    affinity: { munchlet: 'loved', grib: 'neutral', plompo: 'liked' },
    emoji: '🍌',
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    description: 'Crunchy and healthy.',
    rarity: 'common',
    hunger: 8,
    mood: 0,
    xp: 1,
    bond: 0.3,
    coinCost: 5,
    gemCost: 0,
    affinity: { munchlet: 'neutral', grib: 'liked', plompo: 'neutral' },
    emoji: '🥕',
  },

  // === UNCOMMON (3-4 XP) ===
  cookie: {
    id: 'cookie',
    name: 'Cookie',
    description: 'Sweet and crumbly, a classic favorite.',
    rarity: 'uncommon',
    hunger: 15,
    mood: 2,
    xp: 4,
    bond: 1.0,
    coinCost: 15,
    gemCost: 0,
    affinity: { munchlet: 'loved', grib: 'disliked', plompo: 'loved' },
    emoji: '🍪',
  },
  grapes: {
    id: 'grapes',
    name: 'Grapes',
    description: 'Juicy little bursts of flavor.',
    rarity: 'uncommon',
    hunger: 14,
    mood: 1,
    xp: 3,
    bond: 0.8,
    coinCost: 15,
    gemCost: 0,
    affinity: { munchlet: 'liked', grib: 'liked', plompo: 'liked' },
    emoji: '🍇',
  },

  // === RARE (5-6 XP) ===
  spicy_taco: {
    id: 'spicy_taco',
    name: 'Spicy Taco',
    description: 'Hot and zesty - handle with care!',
    rarity: 'rare',
    hunger: 20,
    mood: 2,
    xp: 6,
    bond: 1.5,
    coinCost: 25,
    gemCost: 0,
    affinity: { munchlet: 'disliked', grib: 'loved', plompo: 'disliked' },
    emoji: '🌮',
  },
  hot_pepper: {
    id: 'hot_pepper',
    name: 'Hot Pepper',
    description: 'Extremely spicy - only for the bold!',
    rarity: 'rare',
    hunger: 18,
    mood: -1,
    xp: 5,
    bond: 1.2,
    coinCost: 25,
    gemCost: 0,
    affinity: { munchlet: 'disliked', grib: 'loved', plompo: 'disliked' },
    emoji: '🌶️',
  },

  // === EPIC (10 XP) ===
  birthday_cake: {
    id: 'birthday_cake',
    name: 'Birthday Cake',
    description: 'A celebration in every bite!',
    rarity: 'epic',
    hunger: 25,
    mood: 3,
    xp: 10,
    bond: 2.5,
    coinCost: 50,
    gemCost: 0,
    affinity: { munchlet: 'loved', grib: 'neutral', plompo: 'loved' },
    emoji: '🎂',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getFoodById(id: string): FoodDefinition | undefined {
  return FOODS[id];
}

export function getAllFoods(): FoodDefinition[] {
  return Object.values(FOODS);
}

export function getFoodsByRarity(rarity: string): FoodDefinition[] {
  return Object.values(FOODS).filter(f => f.rarity === rarity);
}

export function getShopFoods(): FoodDefinition[] {
  return Object.values(FOODS).filter(f => f.coinCost > 0);
}

export function getAffinityForPet(foodId: string, petId: string): Affinity {
  const food = FOODS[foodId];
  if (!food) return 'neutral';
  return food.affinity[petId] || 'neutral';
}

// =============================================================================
// STARTING INVENTORY - FROM MOCKUP
// =============================================================================

export const STARTING_INVENTORY: Record<string, number> = {
  apple: 3,
  banana: 5,
  cookie: 2,
  spicy_taco: 1,
  birthday_cake: 1,
  carrot: 4,
  grapes: 2,
  hot_pepper: 2,
};
