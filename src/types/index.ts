// ============================================
// GRUNDY WEB PROTOTYPE — TYPE DEFINITIONS
// ALIGNED WITH: grundy_interactive_mockup.html
// ============================================

// --- Currency ---
export type CurrencyType = 'bites' | 'shinies' | 'eventTokens';

// --- Affinity (from mockup) ---
export type Affinity = 'loved' | 'liked' | 'neutral' | 'disliked';

// --- Rarity ---
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// --- Mood (1-5 scale from mockup) ---
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
export type EvolutionStage = 'baby' | 'youth' | 'evolved';

// --- Pet ---
export interface PetDefinition {
  id: string;
  name: string;
  emoji: string;
  color: string;
  personality: string;
  likes: string[];
  dislikes: string[];
}

export interface PetState {
  id: string;
  name: string;
  type: string;
  level: number;
  xp: number;
  xpToNext: number;
  hunger: number;
  mood: MoodTier;
  energy: number;
  bond: number;
  evolutionStage: EvolutionStage;
}

// --- Food ---
export type ReactionType = 'neutral' | 'positive' | 'negative';

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

// --- Feeding ---
export interface FeedResult {
  success: boolean;
  foodId: string;
  affinity: Affinity;
  reaction: ReactionType;
  xpGained: number;
  hungerRestored: number;
  moodChange: number;
  bondGained: number;
  coinsGained: number;
  leveledUp: boolean;
  newLevel?: number;
  evolved?: boolean;
  newStage?: EvolutionStage;
}

// --- Game State ---
export interface Currencies {
  bites: number;
  shinies: number;
  eventTokens?: number;
}

export interface GameStats {
  feedCount: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  sessionStartTime: number;
}

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

// --- Affinity Multipliers (from mockup) ---
export const AFFINITY_MULTIPLIERS: Record<Affinity, number> = {
  loved: 2.0,
  liked: 1.5,
  neutral: 1.0,
  disliked: 0.5,
};

// --- Config Constants ---
export const EVOLUTION_LEVELS = {
  youth: 7,
  evolved: 13,
};

export const MAX_LEVEL = 20;
