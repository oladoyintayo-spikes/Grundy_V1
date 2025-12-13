// ============================================
// GRUNDY WEB PROTOTYPE — TYPE DEFINITIONS
// ============================================

// P9-C-SLOTS: Import slot types from bible.constants
import type { SlotPurchaseResult, SlotStatus } from '../constants/bible.constants';

// Re-export for convenience
export type { SlotPurchaseResult, SlotStatus };

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

// --- Inventory Types (Bible §11.7, §14.8) ---
export type InventoryTab = 'food' | 'care';
export type InventoryMap = Record<string, number>;
/** Item category for filtering inventory tabs */
export type ItemCategory = 'food' | 'care';

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

// --- Neglect State (Bible §9.4.3, Classic Mode Only) ---
import type { NeglectStageId } from '../constants/bible.constants';

/**
 * Per-pet neglect tracking state.
 * Bible §9.4.3: Classic Mode only, per-pet tracking.
 */
export interface NeglectState {
  /** ISO date string of last qualifying care action (feed or play) */
  lastCareDate: string | null;
  /** ISO date string of when player last opened the app */
  lastSeenDate: string | null;
  /** Current consecutive neglect days (0-14, capped) */
  neglectDays: number;
  /** Current neglect stage derived from neglectDays */
  currentStage: NeglectStageId;
  /** True if pet is in withdrawn state (neglect >= 7) */
  isWithdrawn: boolean;
  /** ISO timestamp when withdrawal started */
  withdrawnAt: string | null;
  /** Consecutive care days completed toward recovery (0-7) */
  recoveryDaysCompleted: number;
  /** True if pet has run away (neglect >= 14) */
  isRunaway: boolean;
  /** ISO timestamp when runaway was triggered */
  runawayAt: string | null;
  /** ISO timestamp when free return becomes available (72h after runaway) */
  canReturnFreeAt: string | null;
  /** ISO timestamp when paid return becomes available (24h after runaway) */
  canReturnPaidAt: string | null;
  /** True if still in grace period (first 48h after account creation) */
  isInGracePeriod: boolean;
  /** ISO timestamp when account was created (for grace period calc) */
  accountCreatedAt: string | null;
}

/**
 * Default neglect state for new pets.
 */
export const DEFAULT_NEGLECT_STATE: NeglectState = {
  lastCareDate: null,
  lastSeenDate: null,
  neglectDays: 0,
  currentStage: 'normal',
  isWithdrawn: false,
  withdrawnAt: null,
  recoveryDaysCompleted: 0,
  isRunaway: false,
  runawayAt: null,
  canReturnFreeAt: null,
  canReturnPaidAt: null,
  isInGracePeriod: true,
  accountCreatedAt: null,
};

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

// --- Owned Pet State (P9-A Multi-Pet Foundation) ---
// Re-export types from bible.constants.ts
import type { PetInstanceId, SpeciesId } from '../constants/bible.constants';
export type { PetInstanceId, SpeciesId };

/**
 * Owned pet instance state (extends PetState with instance tracking).
 * Bible §11.6: Each pet has SEPARATE: Level, XP, Bond, Mood, Hunger.
 * P9-A: Minimal foundation for multi-pet ownership.
 * P10-A: Weight & Sickness state fields (Bible v1.8 §9.4.7).
 */
export interface OwnedPetState extends PetState {
  /** Unique instance ID for this owned pet (format: {speciesId}-{suffix}) */
  instanceId: PetInstanceId;
  /** Species ID (one of 8 canonical species) - duplicates 'id' for clarity */
  speciesId: SpeciesId;

  // --- P10-A: Weight & Sickness Foundations (Bible v1.8 §9.4.7) ---

  /**
   * Pet weight value (0-100). Default 0 for new pets.
   * Bible §5.7, §9.4.7.1: Per-pet weight tracking.
   */
  weight: number;

  /**
   * Whether the pet is currently sick. Default false.
   * Bible §9.4.7.2: Sickness state (Classic Mode only).
   */
  isSick: boolean;

  /**
   * Timestamp (ms) when the pet became sick. Null if not sick.
   * Bible §9.4.7.2: For tracking sickness duration and effects.
   */
  sickStartTimestamp: number | null;

  /**
   * Accumulated minutes at hunger=0 for offline sickness trigger calc.
   * Bible §9.4.7.3: Timer accumulation for offline triggers.
   * Default 0, reset on feeding.
   */
  hungerZeroMinutesAccum: number;

  /**
   * Accumulated minutes with uncleaned poop for offline sickness trigger calc.
   * Bible §9.4.7.3: Timer accumulation for offline triggers.
   * Default 0, reset on cleaning.
   */
  poopDirtyMinutesAccum: number;

  /**
   * Care mistakes accrued during current offline session while sick.
   * Bible §9.4.7.2: Care mistake offline cap (+1/hr, max 4 per session).
   * Reset on app open / offline session start.
   */
  offlineSickCareMistakesAccruedThisSession: number;

  // --- P10-B1.5: Poop State (Bible v1.8 §9.5) ---

  /**
   * Whether uncleaned poop exists for this pet. Default false.
   * Bible §9.5: Poop spawns after N feedings per pet type.
   */
  isPoopDirty: boolean;

  /**
   * Timestamp (ms) when poop appeared. Null if no poop.
   * Bible §9.5: For tracking poop duration toward sickness trigger.
   */
  poopDirtyStartTimestamp: number | null;

  /**
   * Counter of feedings since last poop spawn.
   * Bible §9.5: Poop spawns after N feedings per pet type table.
   * Reset to 0 when poop spawns.
   */
  feedingsSinceLastPoop: number;
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
  /** Inventory capacity (slots). Bible §11.7: Base is 15. BCT-INV-001 */
  inventoryCapacity: number;
  stats: GameStats;
  settings: GameSettings;
  unlockedPets: string[];  // Species IDs that the player has unlocked
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
  /** Per-pet neglect tracking (P7-NEGLECT-SYSTEM, Classic Mode only) */
  neglectByPetId: Record<string, NeglectState>;
  /** ISO timestamp when account was created (for grace period calculation) */
  accountCreatedAt: string | null;

  // Shop UI state (P8-SHOP-CATALOG, Shop-A: UI only, no purchase logic)
  /** Whether shop modal is open */
  isShopOpen: boolean;
  /** Active shop tab */
  shopActiveTab: 'food' | 'care' | 'cosmetics' | 'gems';

  // P9-A: Multi-pet foundation state
  /** All owned pets keyed by instance ID. Bible §11.6: supports up to 4 slots. */
  petsById: Record<PetInstanceId, OwnedPetState>;
  /** Ordered list of owned pet instance IDs (order = acquisition order) */
  ownedPetIds: PetInstanceId[];
  /** Currently active pet instance ID. Persists across sessions. */
  activePetId: PetInstanceId;
  /** Number of pet slots unlocked (1-4). Bible §11.6: starts at 1. */
  unlockedSlots: number;
  // P9-B: Multi-pet runtime state
  /** Alert suppression state for preventing spam. Bible §11.6.1 */
  alertSuppression: AlertSuppressionState;
  /** Timestamp of last app activity (for offline fanout calculation) */
  lastSeenTimestamp: number;
  /** True if all pets are in runaway state. Bible §9.4.4 */
  allPetsAway: boolean;

  // Actions
  feed: (foodId: string) => FeedResult | null;
  /** P10-B1.5: Clean poop for specified pet (Bible v1.8 §9.5) */
  cleanPoop: (petId: PetInstanceId) => void;
  /** P10-E: Use medicine to cure sickness (Bible v1.8 §9.4.7.4). Classic only. */
  useMedicine: (petId: PetInstanceId) => RecoveryResult;
  /** P10-E: Use diet food to reduce weight (Bible v1.8 §11.5). */
  useDietFood: (petId: PetInstanceId) => RecoveryResult;
  /** P10-E: Ad recovery stub - Web Edition no-op (Bible v1.8 §9.4.7.4). */
  useAdRecovery: (petId: PetInstanceId) => RecoveryResult;
  addCurrency: (type: CurrencyType, amount: number, source: string) => void;
  spendCurrency: (type: CurrencyType, amount: number, sink: string) => boolean;
  buyFood: (foodId: string, quantity: number) => boolean;
  addFood: (foodId: string, quantity: number) => void;
  /** Get count of used inventory slots (unique item IDs). BCT-INV-002 */
  getUsedSlots: () => number;
  /** Check if item can be added (slot/stack space). BCT-INV-005, BCT-INV-006 */
  canAddToInventory: (itemId: string, quantity: number) => { allowed: boolean; reason?: string };
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

  // Neglect system actions (P7-NEGLECT-SYSTEM, Classic Mode only)
  /** Initialize neglect state for a pet */
  initNeglectForPet: (petId: string, now?: Date) => void;
  /** Update neglect state on app login/restore */
  updateNeglectOnLogin: (now?: Date) => void;
  /** Register a qualifying care action (feed or play) */
  registerCareEvent: (petId: string, now?: Date) => void;
  /** Get current neglect state for a pet */
  getNeglectState: (petId: string) => NeglectState | null;
  /** Spend gems to recover from withdrawn state */
  recoverFromWithdrawnWithGems: (petId: string) => boolean;
  /** Spend gems to speed up runaway return */
  recoverFromRunawayWithGems: (petId: string) => boolean;
  /** Call back a runaway pet (free path after 72h) */
  callBackRunawayPet: (petId: string, now?: Date) => boolean;
  /** Check if pet can be interacted with (not locked out) */
  canInteractWithPet: (petId: string) => boolean;

  // Shop UI actions (P8-SHOP-CATALOG, Shop-A: UI only)
  openShop: () => void;
  closeShop: () => void;
  setShopTab: (tab: 'food' | 'care' | 'cosmetics' | 'gems') => void;

  // Shop purchase action (P8-SHOP-PURCHASE, Shop-B)
  purchaseShopItem: (
    itemId: string,
    quantity?: number,
    options?: ShopPurchaseOptions
  ) => ShopPurchaseResult;

  // P9-A: Multi-pet foundation actions
  /** Get the currently active pet. Returns null if no pets owned (should never happen). */
  getActivePet: () => OwnedPetState | null;
  /** Switch to a different owned pet. Bible §11.6, §9.4.5: Switching with constraints */
  setActivePet: (petId: PetInstanceId) => { success: boolean; warning?: string };
  /** Get all owned pets in acquisition order */
  getOwnedPets: () => OwnedPetState[];
  /** Get owned pet by instance ID */
  getOwnedPetById: (petId: PetInstanceId) => OwnedPetState | null;

  // P9-B: Multi-pet runtime actions (Bible §8.2.1, §9.4.4-9.4.6, §11.6.1)
  /** Apply offline stat decay to all owned pets. Bible §9.4.6 */
  applyOfflineFanout: (now?: Date) => OfflineReturnSummary | null;
  /** Auto-switch to next available pet when current pet enters runaway. Bible §9.4.4 */
  autoSwitchOnRunaway: () => { newPetId: PetInstanceId | null; allPetsAway: boolean };
  /** Get status badges for all owned pets. Bible §11.6.1 */
  getPetStatusBadges: () => PetStatusBadge[];
  /** Get count of pets needing attention. Bible §11.6.1 */
  getAggregatedBadgeCount: () => number;
  /** Record that an alert was shown (for suppression tracking). Bible §11.6.1 */
  recordAlertShown: (petId: PetInstanceId, isRunaway?: boolean) => void;
  /** Check if alert can be shown for a pet. Bible §11.6.1 */
  canShowAlertForPet: (petId: PetInstanceId) => boolean;
  /** Sync changes from legacy pet field to petsById */
  syncActivePetToStore: () => void;
  /** Update lastSeenTimestamp (call on app focus/activity) */
  updateLastSeen: () => void;

  // P9-C-SLOTS: Slot unlock actions (Bible §11.6)
  /** Purchase a pet slot with gems. Returns result with success/error status. */
  purchasePetSlot: (slotNumber: number) => SlotPurchaseResult;
  /** Get status for all slots (1-4) for UI display. */
  getSlotStatuses: () => SlotStatus[];
}

// --- Shop Purchase Types (P8-SHOP-PURCHASE) ---
export interface ShopPurchaseResult {
  success: boolean;
  error?: 'insufficient_funds' | 'inventory_full' | 'stack_limit' | 'invalid_item' | 'invalid_quantity';
  newCoins?: number;
  newGems?: number;
  itemsAdded?: Record<string, number>;
  totalCost?: number;
  currency?: 'coins' | 'gems';
}

export interface ShopPurchaseOptions {
  /** For random bundles, inject a selector for deterministic testing */
  randomSelector?: (choices: string[]) => string;
}

// --- P10-E: Recovery Action Types (Bible §9.4.7.4) ---

/** Recovery action result */
export interface RecoveryResult {
  success: boolean;
  reason?: 'COZY_MODE' | 'NOT_SICK' | 'NO_ITEM' | 'NOT_OVERWEIGHT' | 'WEB_ADS_DISABLED';
}

/** Recovery action type */
export type RecoveryActionType = 'medicine' | 'diet_food' | 'ad_recovery';

// --- P9-B: Multi-Pet Alert Types (Bible §11.6.1) ---

/** Alert severity levels per Bible §11.6.1 */
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Alert types that can be routed */
export type AlertType =
  | 'neglect_stage_transition'
  | 'hunger_critical'
  | 'mood_critical'
  | 'runaway'
  // P10-F: Weight and sickness alerts (Bible v1.8 §11.6.1)
  | 'weight_warning_obese'
  | 'weight_recovery'
  | 'sickness_onset'
  | 'sickness_reminder';

// P10-F: Import health alert types from bible.constants
import type { HealthAlertId } from '../constants/bible.constants';
export type { HealthAlertId };

/** Alert badge type per Bible §11.6.1 */
export type AlertBadge = '⚠️' | '💔' | '🔒' | '🏥';

/** Individual pet alert for routing */
export interface PetAlert {
  /** Pet instance ID this alert is for */
  petId: PetInstanceId;
  /** Species name for display */
  petName: string;
  /** Type of alert */
  type: AlertType;
  /** Severity level */
  severity: AlertSeverity;
  /** Human-readable message */
  message: string;
  /** Timestamp when alert was generated */
  timestamp: number;
  /** Whether this alert has been shown to user */
  shown: boolean;
}

/**
 * P10-F: Health alert for weight/sickness (Bible v1.8 §11.6.1).
 * Pure data structure - no side effects.
 */
export interface HealthAlert {
  /** Alert type identifier */
  id: HealthAlertId;
  /** Pet instance ID this alert is for */
  petId: PetInstanceId;
  /** Human-readable label for badge/tag */
  label: string;
  /** Toast message if alert should show toast */
  toastMessage?: string;
  /** Whether this alert shows a badge on pet icon */
  showBadge: boolean;
  /** Whether this alert shows a toast notification */
  showToast: boolean;
}

/** Alert suppression state per Bible §11.6.1 */
export interface AlertSuppressionState {
  /** Last alert timestamp per pet (for cooldown) */
  lastAlertByPet: Record<PetInstanceId, number>;
  /** Count of non-critical alerts shown this session */
  sessionAlertCount: number;
  /** Session start timestamp */
  sessionStart: number;
}

/** Pet status badge info for UI */
export interface PetStatusBadge {
  petId: PetInstanceId;
  badge: AlertBadge | null;
  needsAttention: boolean;
  neglectStage: string;
}

/** Offline return summary for "Welcome Back" UI */
export interface OfflineReturnSummary {
  /** Time offline in hours */
  hoursOffline: number;
  /** Changes per pet */
  petChanges: Array<{
    petId: PetInstanceId;
    petName: string;
    moodChange: number;
    bondChange: number;
    hungerChange: number;
    neglectDaysAdded: number;
    newNeglectStage: string | null;
    becameRunaway: boolean;
    // P10-B: Weight & Sickness offline changes
    /** Weight change during offline (Bible v1.8 §9.4.7.1) */
    weightChange?: number;
    /** Whether pet became sick during offline (Bible v1.8 §9.4.7.2) */
    becameSick?: boolean;
    /** Trigger that caused sickness (if any) */
    sicknessTrigger?: 'hunger' | 'poop' | null;
    /** Care mistakes added during offline (capped at 4) */
    careMistakesAdded?: number;
  }>;
  /** Whether auto-switch occurred */
  autoSwitchOccurred: boolean;
  /** New active pet after auto-switch (if applicable) */
  newActivePetId: PetInstanceId | null;
  /** Whether all pets are runaway */
  allPetsAway: boolean;
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
