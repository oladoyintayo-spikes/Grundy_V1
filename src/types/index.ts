// ============================================
// GRUNDY WEB PROTOTYPE — TYPE DEFINITIONS
// ============================================

// --- Currency ---
// Per Bible: coins and gems (not bites/shinies)
export type CurrencyType = 'coins' | 'gems' | 'eventTokens';

// --- Affinity (from Bible) ---
export type Affinity = 'loved' | 'liked' | 'neutral' | 'disliked';

// --- Rarity ---
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// --- Mood State (string-based for store.ts compatibility) ---
export type MoodState = 'happy' | 'neutral' | 'sad' | 'ecstatic';

// --- Mood Tier (1-5 scale, alternative representation) ---
export type MoodTier = 1 | 2 | 3 | 4 | 5;

export interface MoodData {
  icon: string;
  label: string;
  multiplier: number;
}

// Mood tier data from mockup
export const MOOD_DATA: Record<MoodTier, MoodData> = {
  1: { icon: '😤', label: 'Grumpy', multiplier: 0.5 },
  2: { icon: '😕', label: 'Moody', multiplier: 0.75 },
  3: { icon: '😐', label: 'Neutral', multiplier: 1.0 },
  4: { icon: '😊', label: 'Happy', multiplier: 1.25 },
  5: { icon: '🤩', label: 'Ecstatic', multiplier: 1.5 },
};

// --- Evolution ---
// Bible (§6.1): Baby → Youth → Evolved
export type EvolutionStage = 'baby' | 'youth' | 'evolved';

// --- Reaction Type ---
// Includes 'ecstatic' for loved food reactions
export type ReactionType = 'ecstatic' | 'positive' | 'neutral' | 'negative';

// --- Pet Definition (static data) ---
export interface PetDefinition {
  id: string;
  name: string;
  emoji: string;
  color: string;
  personality: string;
  likes: string[];
  dislikes: string[];
}

// --- Pet Ability (Bible §3.7) ---
export type AbilityEffectType =
  | 'bond_bonus'           // Munchlet: +10% bond from feeding
  | 'mood_penalty_reduction' // Grib: -20% mood penalty from neglect
  | 'decay_reduction'      // Plompo: -20% hunger/energy decay rate
  | 'minigame_bonus'       // Fizz: +25% minigame score bonus
  | 'spicy_coin_bonus'     // Ember: 2× coins from spicy foods
  | 'no_dislikes'          // Chomper: No food dislikes (all neutral or better)
  | 'rare_xp_chance'       // Whisp: +50% chance of rare XP drops
  | 'gem_multiplier';      // Luxe: +100% gem drops from all sources

export interface PetAbility {
  id: string;
  name: string;
  description: string;
  effect: {
    type: AbilityEffectType;
    value: number;
  };
}

// --- Pet State (runtime state for store.ts) ---
export interface PetState {
  id: string;
  customName?: string;
  level: number;
  xp: number;
  bond: number;
  mood: MoodState;
  hunger: number;
  evolutionStage: EvolutionStage;
}

// --- Food Definition ---
export interface FoodDefinition {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  hunger: number;
  mood: number;
  xp: number;
  bond: number;
  coinCost: number;
  gemCost: number;
  affinity: Record<string, Affinity>;
  emoji: string;
}

// --- Feed Result ---
export interface FeedResult {
  success: boolean;
  foodId: string;
  affinity?: Affinity;
  reaction: ReactionType;
  xpGained: number;
  hungerRestored?: number;
  moodChange?: number;
  bondGained: number;
  coinsGained: number;
  leveledUp: boolean;
  newLevel?: number;
  evolved?: boolean;
  newStage?: EvolutionStage;
}

// --- Game Stats ---
export interface GameStats {
  totalFeeds: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  sessionStartTime: number;
  lastFeedTime: number;
}

// --- Game Settings ---
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSave: boolean;
}

// --- Game Config ---
export interface GameConfig {
  maxLevel: number;
  xpFormula: {
    base: number;
    multiplier: number;
  };
  maxBond: number;
  maxHunger: number;
  hungerDecayPerMinute: number;
  evolutionLevels: {
    youth: number;
    evolved: number;
  };
  moodModifiers: Record<MoodState, number>;
  reactionModifiers: Record<ReactionType, number>;
  coinRewards: Record<ReactionType, number>;
}

// --- Game Store (Zustand) ---
export interface GameStore {
  // State
  pet: PetState;
  currencies: Record<CurrencyType, number>;
  inventory: Record<string, number>;
  stats: GameStats;
  settings: GameSettings;

  // Actions
  feed: (foodId: string) => FeedResult | null;
  addCurrency: (type: CurrencyType, amount: number, source: string) => void;
  spendCurrency: (type: CurrencyType, amount: number, sink: string) => boolean;
  buyFood: (foodId: string, quantity: number) => boolean;
  addFood: (foodId: string, quantity: number) => void;
  updateMood: (mood: MoodState) => void;
  tick: (deltaMinutes: number) => void;
  selectPet: (petId: string) => void;
  resetGame: () => void;
}

// --- Legacy Currencies interface (for compatibility) ---
export interface Currencies {
  coins: number;
  gems: number;
  eventTokens?: number;
}

// --- Legacy Game State (for compatibility) ---
export interface GameState {
  pet: PetState;
  currencies: Currencies;
  inventory: Record<string, number>;
  stats: GameStats;
  selectedFood: string | null;
}

// --- Pet Captions (from mockup) ---
export interface PetCaptions {
  idle: string[];
  petting: string[];
  positive: string[];
  neutral: string[];
  negative: string[];
}

// --- Affinity Multipliers (from Bible) ---
export const AFFINITY_MULTIPLIERS: Record<Affinity, number> = {
  loved: 2.0,
  liked: 1.5,
  neutral: 1.0,
  disliked: 0.5,
};

// --- Config Constants ---
// TODO: P1-x - Align with Bible (youth=7, evolved=13)
export const EVOLUTION_LEVELS = {
  youth: 7,
  evolved: 13,
};

export const MAX_LEVEL = 20;
