// ============================================
// GRUNDY WEB PROTOTYPE — TYPE DEFINITIONS
// ============================================

// --- App View (Navigation) ---
export type AppView = 'home' | 'games' | 'settings';

// --- Environment Types (P3-ENV) ---
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type RoomId = 'living_room' | 'kitchen' | 'bedroom' | 'playroom' | 'yard';

// --- FTUE Types (Bible §7) ---
export type FtueStep =
  | 'splash'
  | 'age_gate'
  | 'world_intro'
  | 'pet_select'
  | 'mode_select'
  | 'first_session'
  | 'complete';

export type PlayMode = 'cozy' | 'classic';

export interface FtueState {
  activeStep: FtueStep | null;
  hasCompletedFtue: boolean;
  selectedPetId: string | null;
  selectedMode: PlayMode | null;
}

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

// --- Pet Unlock Requirements (Bible §3.2, §6) ---
export type UnlockRequirementType =
  | 'free'                // Starter pets - unlocked from beginning
  | 'bond_level'          // Unlock when any pet reaches bond level
  | 'minigames_completed' // Unlock after completing X minigames
  | 'premium';            // Gem-only unlock (can also skip other requirements)

export interface UnlockRequirement {
  type: UnlockRequirementType;
  value?: number;         // Required amount (bond level, minigame count)
  gemSkipCost?: number;   // Cost to unlock with gems instead
}

// --- Pet Pose for transient animations (P6-T2-PET-BEHAVIORS) ---
export type PetPose = 'idle' | 'happy' | 'sad' | 'sleeping' | 'eating' | 'eating_loved' | 'ecstatic' | 'excited' | 'hungry' | 'satisfied' | 'crying';

export interface TransientPose {
  pose: PetPose;
  expiresAt: number; // Unix timestamp (ms)
}

// --- Ability Trigger (P1-ABILITY-4) ---
export interface AbilityTrigger {
  id: string;
  abilityName: string;
  message: string;
  triggeredAt: number; // Unix timestamp (ms)
}

// --- Pet State (runtime state for store.ts) ---
export interface PetState {
  id: string;
  customName?: string;
  level: number;
  xp: number;
  bond: number;
  mood: MoodState;
  /** Numeric mood value 0-100, per Bible §4.5 */
  moodValue: number;
  hunger: number;
  evolutionStage: EvolutionStage;
  /** Transient pose for feeding animation (P6-T2-PET-BEHAVIORS) */
  transientPose?: TransientPose;
  /** Timestamp of last mood update for decay calculation */
  lastMoodUpdate?: number;
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
  /** Feed value multiplier applied (fullness × cooldown). Bible §4.3-4.4 */
  feedValueMultiplier?: number;
  /** True if pet was on cooldown during this feed. Bible §4.3 */
  wasOnCooldown?: boolean;
  /** True if feeding was blocked (STUFFED state). Bible §4.4 */
  wasBlocked?: boolean;
}

// --- Game Stats ---
export interface GameStats {
  totalFeeds: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  sessionStartTime: number;
  lastFeedTime: number;
  minigamesCompleted: number; // For Chomper unlock and analytics
  /** Timestamp when feeding cooldown started (ms). 0 = no cooldown. Bible §4.3 */
  lastFeedCooldownStart: number;
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
  unlockedPets: string[];  // Pet IDs that the player has unlocked
  energy: EnergyState;     // Mini-game energy system
  dailyMiniGames: DailyMiniGameState; // Daily play tracking
  ftue: FtueState;         // FTUE / Onboarding state
  playMode: PlayMode;      // Cozy vs Classic mode
  environment: {           // Environment state (P3-ENV)
    timeOfDay: TimeOfDay;
    room: RoomId;
    lastUpdated: number;
  };
  /** Active ability triggers for UI display (P1-ABILITY-4) */
  abilityTriggers: AbilityTrigger[];

  // Actions
  feed: (foodId: string) => FeedResult | null;
  addCurrency: (type: CurrencyType, amount: number, source: string) => void;
  spendCurrency: (type: CurrencyType, amount: number, sink: string) => boolean;
  buyFood: (foodId: string, quantity: number) => boolean;
  addFood: (foodId: string, quantity: number) => void;
  updateMood: (mood: MoodState) => void;
  tick: (deltaMinutes: number) => void;
  selectPet: (petId: string) => void;
  unlockPet: (petId: string) => boolean;      // Unlock via requirements met
  unlockPetWithGems: (petId: string) => boolean; // Unlock by spending gems
  isPetUnlocked: (petId: string) => boolean;  // Check if pet is unlocked
  resetGame: () => void;

  // Mini-game actions
  tickEnergyRegen: () => void;
  useEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  getTimeToNextEnergy: () => number;
  resetDailyIfNeeded: () => void;
  canPlay: (gameId: MiniGameId) => CanPlayResult;
  recordPlay: (gameId: MiniGameId, isFree: boolean) => void;
  completeGame: (result: MiniGameResult) => void;

  // FTUE actions
  startFtue: () => void;
  setFtueStep: (step: FtueStep) => void;
  selectFtuePet: (petId: string) => void;
  selectPlayMode: (mode: PlayMode) => void;
  completeFtue: () => void;

  // Environment actions (P3-ENV)
  refreshTimeOfDay: () => void;
  setRoom: (room: RoomId) => void;
  syncEnvironmentWithView: (view: AppView) => void;

  // Audio settings actions (P5-AUDIO)
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;

  // Mood system actions (P6-MOOD-SYSTEM)
  tickMoodDecay: (deltaMinutes: number) => void;
  setMoodValue: (value: number) => void;

  // Ability trigger actions (P1-ABILITY-4)
  addAbilityTrigger: (trigger: AbilityTrigger) => void;
  clearExpiredAbilityTriggers: () => void;

  // Pet behavior actions (P6-T2-PET-BEHAVIORS)
  setTransientPose: (pose: PetPose, durationMs: number) => void;
  clearTransientPose: () => void;
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
// Import from bible.constants.ts for single source of truth
import { EVOLUTION_THRESHOLDS } from '../constants/bible.constants';

// Re-export for backward compatibility - values are locked per Bible §6.1
export const EVOLUTION_LEVELS = {
  youth: EVOLUTION_THRESHOLDS.YOUTH,
  evolved: EVOLUTION_THRESHOLDS.EVOLVED,
};

export const MAX_LEVEL = 50; // Bible §6.2

// ============================================
// MINI-GAME TYPES (Bible §8)
// ============================================

export type MiniGameId =
  | 'snack_catch'
  | 'memory_match'
  | 'pips'
  | 'rhythm_tap'
  | 'poop_scoop';

export type RewardTier = 'bronze' | 'silver' | 'gold' | 'rainbow';

export interface MiniGameResult {
  gameId: MiniGameId;
  score: number;
  tier: RewardTier;
  rewards: {
    coins: number;
    xp: number;
    foodDrop: string | null; // food ID or null
  };
}

export interface EnergyState {
  current: number;        // 0–50
  max: number;            // 50 (constant)
  lastRegenTime: number;  // Unix timestamp (ms)
  regenRateMs: number;    // 1800000 (30 min in ms)
}

export interface DailyMiniGameState {
  date: string;                             // 'YYYY-MM-DD'
  plays: Record<MiniGameId, number>;        // gameId -> play count today
  freePlayUsed: Record<MiniGameId, boolean>; // gameId -> free used?
}

export interface CanPlayResult {
  allowed: boolean;
  reason?: string;
  isFree: boolean;
}
