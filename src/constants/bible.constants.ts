/**
 * GRUNDY BIBLE CONSTANTS
 *
 * These values are LOCKED per GRUNDY_MASTER_BIBLE v1.5.
 * Do not modify without explicit Bible version bump.
 *
 * This is the SINGLE SOURCE OF TRUTH for Bible-locked values.
 * Both runtime code and tests import from this file.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md
 */

// ============================================================================
// Platform Types
// ============================================================================

export type Platform = 'web' | 'unity';

// ============================================================================
// §6.1 Evolution Thresholds (LOCKED)
// ============================================================================

export const EVOLUTION_THRESHOLDS = {
  /** Level at which Baby evolves to Youth */
  YOUTH: 10,
  /** Level at which Youth evolves to Evolved */
  EVOLVED: 25,
} as const;

export const EVOLUTION_STAGES = {
  BABY: 'baby',
  YOUTH: 'youth',
  EVOLVED: 'evolved',
} as const;

// ============================================================================
// §4.3-4.4 Feeding System (LOCKED)
// ============================================================================

export const FULLNESS_STATES = {
  HUNGRY: { min: 0, max: 20, feedValue: 1.0 },
  PECKISH: { min: 21, max: 40, feedValue: 0.75 },
  CONTENT: { min: 41, max: 70, feedValue: 0.5 },
  SATISFIED: { min: 71, max: 90, feedValue: 0.25 },
  STUFFED: { min: 91, max: 100, feedValue: 0 },
} as const;

export const COOLDOWN = {
  /** Cooldown duration in milliseconds (30 minutes) */
  DURATION_MS: 30 * 60 * 1000,
  /** Feed value multiplier during cooldown */
  REDUCED_VALUE: 0.25,
} as const;

// ============================================================================
// §8.2-8.3 Mini-Game Economy (LOCKED)
// ============================================================================

export const MINIGAME_RULES = {
  /** Maximum plays per day */
  DAILY_CAP: 3,
  /** Energy cost per game */
  ENERGY_COST: 10,
  /** Maximum energy */
  MAX_ENERGY: 50,
  /** Energy regeneration rate (ms per 1 energy) */
  ENERGY_REGEN_MS: 30 * 60 * 1000,
  /** First game of day is free */
  FIRST_GAME_FREE: true,
} as const;

export const REWARD_TIERS = {
  BRONZE: { coins: { min: 2, max: 3 }, xp: 3, gems: 0 },
  SILVER: { coins: { min: 5, max: 7 }, xp: 5, gems: 0 },
  GOLD: { coins: { min: 8, max: 15 }, xp: 8, gems: 0 },
  RAINBOW: { coins: { min: 12, max: 22 }, xp: 12, gems: 0 },
} as const;

/**
 * LOCKED INVARIANT: Mini-games NEVER award gems on Web.
 * @see Bible §8.3 - "Mini-games NEVER award gems under any circumstances"
 */
export const MINIGAME_GEMS_ALLOWED = false;

// ============================================================================
// §8.3 Gem Sources (With Platform Flags)
// ============================================================================

export interface GemSource {
  id: string;
  label: string;
  type: 'core' | 'miniGame' | 'login' | 'achievement' | 'monetization';
  enabledOn: Platform[];
}

export const GEM_SOURCES: GemSource[] = [
  { id: 'level_up', label: 'Level Up', type: 'core', enabledOn: ['web', 'unity'] },
  { id: 'first_feed_daily', label: 'First Feed Daily', type: 'core', enabledOn: ['web', 'unity'] },
  { id: 'daily_login_day7', label: 'Daily Login (Day 7)', type: 'login', enabledOn: ['web', 'unity'] },
  { id: 'achievements', label: 'Achievements', type: 'achievement', enabledOn: ['web', 'unity'] },
  { id: 'first_feed_daily_plus', label: 'First Feed (Plus Bonus)', type: 'monetization', enabledOn: ['web', 'unity'] },
  { id: 'season_pass_premium', label: 'Season Pass (Premium)', type: 'monetization', enabledOn: ['unity'] },
  { id: 'mini_game_rainbow', label: 'Rainbow Tier', type: 'miniGame', enabledOn: ['unity'] },
] as const;

export function getGemSourcesForPlatform(platform: Platform): GemSource[] {
  return GEM_SOURCES.filter(source => source.enabledOn.includes(platform));
}

export function isGemSourceEnabled(sourceId: string, platform: Platform): boolean {
  const source = GEM_SOURCES.find(s => s.id === sourceId);
  return source?.enabledOn.includes(platform) ?? false;
}

export function hasMiniGameGems(platform: Platform): boolean {
  return GEM_SOURCES.some(
    source => source.type === 'miniGame' && source.enabledOn.includes(platform)
  );
}

// ============================================================================
// §7.4 FTUE Locked Copy
// ============================================================================

export const FTUE_LORE_LINES = [
  'Sometimes, when a big feeling is left behind\u2026',
  'A tiny spirit called a Grundy wakes up.',
  'One of them just found *you*.',
] as const;

export const FTUE_LORE_TEXT = {
  LINE_1: FTUE_LORE_LINES[0],
  LINE_2: FTUE_LORE_LINES[1],
  LINE_3: FTUE_LORE_LINES[2],
} as const;

export const FTUE_LORE_FULL = FTUE_LORE_LINES.join('\n');

export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function containsAllFtueLore(renderedText: string): boolean {
  const normalized = normalizeText(renderedText);
  return FTUE_LORE_LINES.every(line => normalized.includes(line));
}

// ============================================================================
// §9 Cozy vs Classic Mode Configuration (P6-FTUE-MODES)
// ============================================================================

export type GameMode = 'cozy' | 'classic';

/**
 * Mode configuration parameters.
 * Bible §9.1-9.4: Cozy is gentler, Classic has consequences.
 */
export interface ModeConfig {
  id: GameMode;
  label: string;
  description: string;
  /** Multiplier for mood decay rate. Bible §9.3: Cozy is gentler. */
  moodDecayMultiplier: number;
  /** Multiplier for negative mood penalties (e.g., disliked food). */
  penaltySeverityMultiplier: number;
  /** Whether neglect system is enabled. Bible §9.4.3: Classic only. */
  neglectEnabled: boolean;
  /** Whether sickness system is enabled. Bible §9.4: Classic only. */
  sicknessEnabled: boolean;
  /** Whether care mistakes are tracked. Bible §9.4: Classic only. */
  careMistakesEnabled: boolean;
  /** Whether Welcome Back bonus is given. Bible §9.3: Cozy only. */
  welcomeBackBonusEnabled: boolean;
}

/**
 * Central mode configuration.
 * Bible §9.1-9.4: Mode-specific gameplay parameters.
 */
export const MODE_CONFIG: Record<GameMode, ModeConfig> = {
  cozy: {
    id: 'cozy',
    label: 'Cozy Mode',
    description: 'Gentler mood decay, no neglect. Perfect for relaxed play.',
    moodDecayMultiplier: 0.5, // 50% slower decay than classic
    penaltySeverityMultiplier: 0.5, // Halved negative mood penalties
    neglectEnabled: false,
    sicknessEnabled: false,
    careMistakesEnabled: false,
    welcomeBackBonusEnabled: true,
  },
  classic: {
    id: 'classic',
    label: 'Classic Mode',
    description: 'Normal decay, full challenge with neglect and sickness.',
    moodDecayMultiplier: 1.0, // Baseline decay
    penaltySeverityMultiplier: 1.0, // Full penalties
    neglectEnabled: true,
    sicknessEnabled: true,
    careMistakesEnabled: true,
    welcomeBackBonusEnabled: false,
  },
};

/**
 * Helper: Check if mode is Cozy.
 */
export const isCozyMode = (mode: GameMode): boolean => mode === 'cozy';

/**
 * Helper: Check if mode is Classic.
 */
export const isClassicMode = (mode: GameMode): boolean => mode === 'classic';

/**
 * Get mode config for a given mode.
 */
export function getModeConfig(mode: GameMode): ModeConfig {
  return MODE_CONFIG[mode];
}

// ============================================================================
// §9.4.3 Neglect & Withdrawal System (Classic Mode Only)
// ============================================================================

/**
 * Neglect stage identifiers.
 * Bible §9.4.3: 5-stage ladder from Normal to Runaway.
 */
export type NeglectStageId =
  | 'normal'
  | 'worried'
  | 'sad'
  | 'withdrawn'
  | 'critical'
  | 'runaway';

/**
 * Configuration for a single neglect stage.
 */
export interface NeglectStageConfig {
  id: NeglectStageId;
  /** Days without care to reach this stage (inclusive) */
  minDays: number;
  /** Immediate bond penalty when entering this stage (fraction, e.g., 0.25 = -25%) */
  bondPenalty: number;
  /** Ongoing bond gain multiplier while in this stage */
  bondGainMultiplier: number;
  /** Ongoing mood gain multiplier while in this stage */
  moodGainMultiplier: number;
  /** Whether pet is locked out of interaction */
  isLockedOut: boolean;
}

/**
 * Neglect stage ladder per Bible §9.4.3.
 * Ordered by minDays ascending.
 */
export const NEGLECT_STAGES: NeglectStageConfig[] = [
  { id: 'normal', minDays: 0, bondPenalty: 0, bondGainMultiplier: 1.0, moodGainMultiplier: 1.0, isLockedOut: false },
  { id: 'worried', minDays: 2, bondPenalty: 0, bondGainMultiplier: 1.0, moodGainMultiplier: 1.0, isLockedOut: false },
  { id: 'sad', minDays: 4, bondPenalty: 0, bondGainMultiplier: 1.0, moodGainMultiplier: 1.0, isLockedOut: false },
  { id: 'withdrawn', minDays: 7, bondPenalty: 0.25, bondGainMultiplier: 0.5, moodGainMultiplier: 0.75, isLockedOut: false },
  { id: 'critical', minDays: 10, bondPenalty: 0, bondGainMultiplier: 0.5, moodGainMultiplier: 0.75, isLockedOut: false },
  { id: 'runaway', minDays: 14, bondPenalty: 0.50, bondGainMultiplier: 0, moodGainMultiplier: 0, isLockedOut: true },
];

/**
 * Neglect system constants per Bible §9.4.3.
 */
export const NEGLECT_CONFIG = {
  /** Maximum days capped for offline absence. Bible: "Capped at 14 days" */
  MAX_DAYS: 14,
  /** Grace period for new players (hours). Bible: "First 48 hours" */
  GRACE_PERIOD_HOURS: 48,
  /** Consecutive care days for free withdrawal recovery. Bible: "7 consecutive care days" */
  FREE_RECOVERY_CARE_DAYS: 7,
  /** Hours to wait before free runaway return. Bible: "72 hours" */
  RUNAWAY_FREE_WAIT_HOURS: 72,
  /** Hours to wait before paid runaway return. Bible: "24 hours" */
  RUNAWAY_PAID_WAIT_HOURS: 24,
  /** Gem cost to recover from withdrawn state. Bible: "15 💎" */
  WITHDRAWN_RECOVERY_GEMS: 15,
  /** Gem cost to speed up runaway return. Bible: "25 💎" */
  RUNAWAY_RECOVERY_GEMS: 25,
} as const;

/**
 * Get the neglect stage for a given number of neglect days.
 * Returns the highest stage where neglectDays >= minDays.
 */
export function getNeglectStage(neglectDays: number): NeglectStageConfig {
  // Iterate in reverse to find highest matching stage
  for (let i = NEGLECT_STAGES.length - 1; i >= 0; i--) {
    if (neglectDays >= NEGLECT_STAGES[i].minDays) {
      return NEGLECT_STAGES[i];
    }
  }
  return NEGLECT_STAGES[0]; // Default to normal
}

/**
 * Get neglect stage by ID.
 */
export function getNeglectStageById(stageId: NeglectStageId): NeglectStageConfig {
  return NEGLECT_STAGES.find(s => s.id === stageId) ?? NEGLECT_STAGES[0];
}

/**
 * Check if a stage is considered "penalized" (Withdrawn or worse).
 */
export function isNeglectPenaltyStage(stageId: NeglectStageId): boolean {
  return stageId === 'withdrawn' || stageId === 'critical' || stageId === 'runaway';
}

/**
 * Canonical UI copy for neglect states per Bible §9.4.3.
 */
export const NEGLECT_UI_COPY: Record<NeglectStageId, string> = {
  normal: '',
  worried: 'Your Grundy is starting to worry you won\'t come back.',
  sad: 'Your Grundy feels forgotten. It\'s trying not to, but it hurts.',
  withdrawn: 'Your Grundy is here, but it\'s pulled away. It needs time and gentle care to trust again.',
  critical: 'Your Grundy has gone quiet and distant. It\'s protecting itself from getting hurt again.',
  runaway: 'Your Grundy has gone into hiding. It still remembers you. It just doesn\'t feel safe yet.',
};

/**
 * Return message when pet comes back from runaway.
 */
export const NEGLECT_RETURN_MESSAGE = 'Your Grundy came back! They remember, but they\'re willing to try again. 💕';

// ============================================================================
// §4.5 Mood System (LOCKED)
// ============================================================================

export const MOOD_TIERS = {
  ECSTATIC: { min: 85, max: 100, label: 'Ecstatic', positiveOdds: 0.8 },
  HAPPY: { min: 60, max: 84, label: 'Happy', positiveOdds: 0.6 },
  CONTENT: { min: 40, max: 59, label: 'Content', positiveOdds: 0.5 },
  LOW: { min: 20, max: 39, label: 'Low', positiveOdds: 0.4 },
  UNHAPPY: { min: 0, max: 19, label: 'Unhappy', positiveOdds: 0.4 },
} as const;

export const MOOD_MODIFIERS = {
  /** XP bonus when feeding while happy (mood >= 60) */
  HAPPY_FEED_XP_BONUS: 0.10,
  /** Mood boost from feeding a loved food */
  LOVED_FOOD_MOOD_BOOST: 15,
  /** Mood boost from feeding a liked food */
  LIKED_FOOD_MOOD_BOOST: 8,
  /** Mood change from feeding a neutral food */
  NEUTRAL_FOOD_MOOD_CHANGE: 3,
  /** Mood penalty from feeding a disliked food */
  DISLIKED_FOOD_MOOD_PENALTY: -10,
  /** Base mood decay per minute when neglected */
  DECAY_PER_MINUTE: 0.5,
} as const;

export type MoodTier = keyof typeof MOOD_TIERS;

/**
 * Get mood tier from numeric value
 */
export function getMoodTier(moodValue: number): MoodTier {
  if (moodValue >= MOOD_TIERS.ECSTATIC.min) return 'ECSTATIC';
  if (moodValue >= MOOD_TIERS.HAPPY.min) return 'HAPPY';
  if (moodValue >= MOOD_TIERS.CONTENT.min) return 'CONTENT';
  if (moodValue >= MOOD_TIERS.LOW.min) return 'LOW';
  return 'UNHAPPY';
}

/**
 * Convert numeric mood (0-100) to MoodState string for backward compatibility
 */
export function moodValueToState(moodValue: number): 'ecstatic' | 'happy' | 'neutral' | 'sad' {
  const tier = getMoodTier(moodValue);
  switch (tier) {
    case 'ECSTATIC': return 'ecstatic';
    case 'HAPPY': return 'happy';
    case 'CONTENT': return 'neutral';
    case 'LOW': return 'neutral';
    case 'UNHAPPY': return 'sad';
  }
}

/**
 * Convert MoodState string to approximate numeric mood
 */
export function moodStateToValue(mood: 'ecstatic' | 'happy' | 'neutral' | 'sad'): number {
  switch (mood) {
    case 'ecstatic': return 90;
    case 'happy': return 70;
    case 'neutral': return 50;
    case 'sad': return 15;
  }
}

// ============================================================================
// §14.4 Rooms Lite
// ============================================================================

export const ROOM_ACTIVITY_MAP = {
  feeding: 'kitchen',
  sleeping: 'bedroom',
  playing: 'playroom',
  default: 'living_room',
} as const;

export const TIME_OF_DAY = {
  MORNING: { start: 6, end: 12 },
  AFTERNOON: { start: 12, end: 17 },
  EVENING: { start: 17, end: 21 },
  NIGHT: { start: 21, end: 6 },
} as const;

// ============================================================================
// §3 Pet Definitions
// ============================================================================

export const PETS = {
  MUNCHLET: { id: 'munchlet', emoji: '\uD83D\uDFE1', tier: 'starter' },
  GRIB: { id: 'grib', emoji: '\uD83D\uDFE2', tier: 'starter' },
  PLOMPO: { id: 'plompo', emoji: '\uD83D\uDFE3', tier: 'starter' },
  FIZZ: { id: 'fizz', emoji: '\uD83D\uDD35', tier: 'earnable' },
  EMBER: { id: 'ember', emoji: '\uD83D\uDFE0', tier: 'earnable' },
  CHOMPER: { id: 'chomper', emoji: '\uD83D\uDD34', tier: 'earnable' },
  WHISP: { id: 'whisp', emoji: '\u26AA', tier: 'premium' },
  LUXE: { id: 'luxe', emoji: '\u2728', tier: 'premium' },
} as const;

export const ALL_PET_IDS = Object.values(PETS).map(p => p.id);
export const STARTER_PET_IDS = Object.values(PETS).filter(p => p.tier === 'starter').map(p => p.id);

// ============================================================================
// §14.5-14.6 UI & Layout
// ============================================================================

export const MOBILE_VIEWPORT = {
  MIN_WIDTH: 360,
  MIN_HEIGHT: 640,
  COMMON_WIDTH: 390,
  COMMON_HEIGHT: 844,
} as const;

export const TEST_IDS = {
  // Navigation - P6-NAV-GROUNDWORK
  GLOBAL_NAV: 'global-nav',
  NAV_HOME: 'nav-home',
  NAV_GAMES: 'nav-games',
  NAV_SETTINGS: 'nav-settings',
  // View containers - P6-NAV-GROUNDWORK
  HOME_VIEW: 'home-view',
  GAMES_VIEW: 'games-view',
  SETTINGS_VIEW: 'settings-view',
  // Room selector - P6-ENV-UI
  ROOM_SELECTOR: 'room-selector',
  ROOM_TAB_LIVING: 'room-tab-living',
  ROOM_TAB_KITCHEN: 'room-tab-kitchen',
  ROOM_TAB_BEDROOM: 'room-tab-bedroom',
  ROOM_TAB_PLAYROOM: 'room-tab-playroom',
  // HUD
  HUD_BOND: 'hud-bond',
  HUD_COINS: 'hud-coins',
  HUD_GEMS: 'hud-gems',
  ACTIVE_PET: 'active-pet',
  FEED_BUTTON: 'feed-button',
  PLAY_BUTTON: 'play-button',
  SLEEP_BUTTON: 'sleep-button',
  FTUE_SCREEN: 'ftue-screen',
  FTUE_LORE: 'ftue-lore',
  ROOM_BACKGROUND: 'room-background',
  ROOM_LABEL: 'room-label',
  DEBUG_PANEL: 'debug-panel',
  DEBUG_HUD: 'debug-hud',
  SESSION_TIMER: 'session-timer',
  FEED_COUNTER: 'feed-counter',
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type EvolutionStage = typeof EVOLUTION_STAGES[keyof typeof EVOLUTION_STAGES];
export type FullnessState = keyof typeof FULLNESS_STATES;
export type RewardTier = keyof typeof REWARD_TIERS;
export type RoomType = typeof ROOM_ACTIVITY_MAP[keyof typeof ROOM_ACTIVITY_MAP];
export type PetId = typeof ALL_PET_IDS[number];
export type TimeOfDay = keyof typeof TIME_OF_DAY;
export type TestId = typeof TEST_IDS[keyof typeof TEST_IDS];
