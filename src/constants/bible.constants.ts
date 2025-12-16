/**
 * GRUNDY BIBLE CONSTANTS
 *
 * These values are LOCKED per GRUNDY_MASTER_BIBLE v1.6 and BCT v2.2.
 * Do not modify without explicit Bible version bump.
 *
 * This is the SINGLE SOURCE OF TRUTH for Bible-locked values.
 * Both runtime code and tests import from this file.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.6)
 * @see docs/BIBLE_COMPLIANCE_TEST.md (v2.2)
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
// §5.8 Starting Resources (LOCKED - BCT-ECON)
// ============================================================================

export const STARTING_RESOURCES = {
  /** Starting coins for new player. BCT-ECON-001 */
  COINS: 100,
  /** Starting gems for new player. BCT-ECON-002 */
  GEMS: 0,
} as const;

/**
 * Tutorial starting inventory per Bible §5.8.
 * BCT-ECON-003: 2× Apple, BCT-ECON-004: 2× Banana, BCT-ECON-005: 1× Cookie
 */
export const TUTORIAL_INVENTORY: Record<string, number> = {
  apple: 2,
  banana: 2,
  cookie: 1,
} as const;

// ============================================================================
// §11.7 Inventory System (LOCKED - BCT-INV)
// ============================================================================

export const INVENTORY_CONFIG = {
  /** Base inventory capacity. BCT-INV-001 */
  BASE_CAPACITY: 15,
  /** Maximum stack per item ID. BCT-INV-003 */
  STACK_MAX: 99,
} as const;

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
  // Navigation - P6-NAV-GROUNDWORK (legacy bottom nav)
  GLOBAL_NAV: 'global-nav',
  NAV_HOME: 'nav-home',
  NAV_GAMES: 'nav-games',
  NAV_SETTINGS: 'nav-settings',
  // Bible v1.10: Action Bar (replaces legacy bottom nav)
  ACTION_BAR: 'action-bar',
  ACTION_BAR_FEED: 'action-bar-feed',
  ACTION_BAR_GAMES: 'action-bar-games',
  ACTION_BAR_MENU: 'action-bar-menu',
  // Bible v1.10: Menu Overlay
  MENU_OVERLAY: 'menu-overlay',
  MENU_OVERLAY_PANEL: 'menu-overlay-panel',
  MENU_OVERLAY_SCRIM: 'menu-overlay-scrim',
  MENU_OVERLAY_CLOSE: 'menu-overlay-close',
  MENU_OPTION_SWITCH_PET: 'menu-option-switch-pet',
  MENU_OPTION_SHOP: 'menu-option-shop',
  MENU_OPTION_INVENTORY: 'menu-option-inventory',
  MENU_OPTION_GAMES: 'menu-option-games',
  MENU_OPTION_SETTINGS: 'menu-option-settings',
  MENU_OPTION_HOME: 'menu-option-home',
  MENU_PET_BADGE: 'menu-pet-badge',
  // Bible v1.10: Food Drawer
  FOOD_DRAWER: 'food-drawer',
  FOOD_DRAWER_PANEL: 'food-drawer-panel',
  FOOD_DRAWER_SCRIM: 'food-drawer-scrim',
  FOOD_DRAWER_GRID: 'food-drawer-grid',
  FOOD_DRAWER_FIRST_ITEM: 'food-drawer-first-item',
  FOOD_DRAWER_STUFFED: 'food-drawer-stuffed',
  FOOD_DRAWER_COOLDOWN: 'food-drawer-cooldown',
  // Bible v1.10: Header menu
  APP_HEADER: 'app-header',
  HEADER_MENU_BUTTON: 'header-menu-button',
  // Bible v1.10: Cooldown Banner
  COOLDOWN_BANNER_STUFFED: 'cooldown-banner-stuffed',
  COOLDOWN_BANNER_ACTIVE: 'cooldown-banner-active',
  COOLDOWN_TIMER: 'cooldown-timer',
  // View containers - P6-NAV-GROUNDWORK
  HOME_VIEW: 'home-view',
  GAMES_VIEW: 'games-view',
  SETTINGS_VIEW: 'settings-view',
  // Room selector - REMOVED per Bible §14.4: Rooms are NOT navigable (activity-driven only)
  // These constants are kept for reference but should NOT be used in production UI
  // @deprecated Room tabs removed - rooms switch automatically via activity
  ROOM_SELECTOR: 'room-selector', // DEPRECATED - no longer rendered
  ROOM_TAB_LIVING: 'room-tab-living', // DEPRECATED
  ROOM_TAB_KITCHEN: 'room-tab-kitchen', // DEPRECATED
  ROOM_TAB_BEDROOM: 'room-tab-bedroom', // DEPRECATED
  ROOM_TAB_PLAYROOM: 'room-tab-playroom', // DEPRECATED
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
// §11.5 / §14.7 Shop Catalog (LOCKED - BCT-SHOP)
// ============================================================================

/**
 * Shop tab identifiers per Bible §14.7.
 */
export type ShopTab = 'food' | 'care' | 'cosmetics' | 'gems';

/**
 * Shop item kind for categorization.
 * - 'bundle': Multi-item packages (fixed qty 1)
 * - 'individual': Single foods with qty selector (1-10)
 * - 'care_item': Care consumables (fixed qty 1)
 */
export type ShopItemKind = 'bundle' | 'individual' | 'care_item';

/**
 * Currency types accepted in Shop.
 */
export type ShopCurrency = 'coins' | 'gems';

/**
 * Shop item definition per Bible §11.5.
 */
export interface ShopItem {
  id: string;
  /** Which tab this item appears in */
  tab: 'food' | 'care';
  /** Item kind determines UI behavior */
  kind: ShopItemKind;
  /** Display name (may differ from base food name for bundles) */
  displayName: string;
  /** Description text */
  description: string;
  /** Price amount */
  price: number;
  /** Currency type (coins or gems) */
  currency: ShopCurrency;
  /** Emoji icon */
  emoji: string;
  /** Minimum level required to see this item (optional) */
  levelRequired?: number;
  /** For bundles: decomposition mapping { baseItemId: quantity } */
  decomposition?: Record<string, number>;
  /** Visibility condition: 'classic_only' | 'weight_chubby' | null */
  visibilityCondition?: 'classic_only' | 'weight_chubby' | null;
}

/**
 * Individual food prices per Bible §5.4 Cost column.
 * BCT-SHOP-001: Individual food prices match §5.4 Cost column.
 * BCT-SHOP-003: Individual foods are coins-only.
 */
export const INDIVIDUAL_FOOD_PRICES: Record<string, number> = {
  // Common (5 coins)
  apple: 5,
  banana: 5,
  carrot: 5,
  lollipop: 10,
  // Uncommon (15-20 coins)
  cookie: 15,
  grapes: 15,
  candy: 20,
  // Rare (25-30 coins)
  spicy_taco: 25,
  hot_pepper: 25,
  ice_cream: 30,
  // Epic (50-75 coins)
  birthday_cake: 50,
  dream_treat: 75,
  // Legendary (150 coins)
  golden_feast: 150,
} as const;

/**
 * Shop catalog per Bible §11.5 and §14.7.
 * BCT-SHOP-002: Bundle + care item prices match Shop table.
 */
export const SHOP_CATALOG: ShopItem[] = [
  // ============================================================================
  // Food Bundles (appear first in Food tab per BCT-SHOP-004)
  // ============================================================================
  {
    id: 'food_apple_x5',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Apple Bundle',
    description: '5× Apples',
    price: 20,
    currency: 'coins',
    emoji: '🍎',
    decomposition: { apple: 5 },
  },
  {
    id: 'food_balanced_x5',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Balanced Meal Pack',
    description: '5× mixed common foods',
    price: 40,
    currency: 'coins',
    emoji: '🥗',
    // Bible-strict: Only Common foods (apple, banana, carrot, lollipop)
    // Candy is Uncommon per §5.4, so NOT included here
    decomposition: { apple: 2, banana: 1, carrot: 1, lollipop: 1 },
  },
  {
    id: 'food_spicy_x3',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Spicy Sampler',
    description: '3× Hot Peppers + 2× Tacos',
    price: 60,
    currency: 'coins',
    emoji: '🌶️',
    decomposition: { hot_pepper: 3, spicy_taco: 2 },
  },
  {
    id: 'food_sweet_x3',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Sweet Treats',
    description: '3× Cookies + 2× Candy',
    price: 50,
    currency: 'coins',
    emoji: '🍪',
    decomposition: { cookie: 3, candy: 2 },
  },
  {
    id: 'food_rare_x1',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Rare Food Box',
    description: '1× random Rare food',
    price: 75,
    currency: 'coins',
    emoji: '📦',
    levelRequired: 5,
    decomposition: { spicy_taco: 1 }, // Simplified: gives taco
  },
  {
    id: 'food_epic_x1',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Epic Feast',
    description: '1× Birthday Cake or Dream Treat',
    price: 5,
    currency: 'gems',
    emoji: '🎂',
    levelRequired: 10,
    decomposition: { birthday_cake: 1 },
  },
  {
    id: 'food_legendary_x1',
    tab: 'food',
    kind: 'bundle',
    displayName: 'Golden Feast',
    description: '1× Golden Feast',
    price: 10,
    currency: 'gems',
    emoji: '👑',
    levelRequired: 15,
    decomposition: { golden_feast: 1 },
  },

  // ============================================================================
  // Care Items (Care tab)
  // ============================================================================
  {
    id: 'care_medicine',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Medicine',
    description: 'Cures sickness instantly',
    price: 50,
    currency: 'coins',
    emoji: '💊',
    visibilityCondition: 'classic_only',
  },
  {
    id: 'care_diet_food',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Diet Food',
    description: '-20 weight, +5 hunger',
    price: 30,
    currency: 'coins',
    emoji: '🥗',
    visibilityCondition: 'weight_chubby',
  },
  {
    id: 'care_energy_drink',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Energy Drink',
    description: '+50 energy instantly',
    price: 25,
    currency: 'coins',
    emoji: '⚡',
  },
  {
    id: 'care_mood_boost',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Mood Boost',
    description: '+30 happiness instantly',
    price: 40,
    currency: 'coins',
    emoji: '💖',
  },
  {
    id: 'care_cleaning_brush',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Cleaning Brush',
    description: 'Auto-clean poop 1 hour',
    price: 10,
    currency: 'coins',
    emoji: '🧹',
  },
  {
    id: 'care_sleep_potion',
    tab: 'care',
    kind: 'care_item',
    displayName: 'Sleep Potion',
    description: 'Skip to wake time',
    price: 20,
    currency: 'coins',
    emoji: '😴',
  },
];

/**
 * Get all individual foods for Shop display.
 * These use base food IDs and prices from INDIVIDUAL_FOOD_PRICES.
 * BCT-SHOP-003: All individual foods are coins-only.
 */
export function getIndividualFoodItems(): ShopItem[] {
  return Object.entries(INDIVIDUAL_FOOD_PRICES).map(([id, price]) => ({
    id,
    tab: 'food' as const,
    kind: 'individual' as const,
    displayName: id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Purchase individual ${id.replace(/_/g, ' ')}`,
    price,
    currency: 'coins' as const,
    emoji: getFoodEmoji(id),
  }));
}

/**
 * Get food emoji by ID.
 */
function getFoodEmoji(foodId: string): string {
  const emojiMap: Record<string, string> = {
    apple: '🍎',
    banana: '🍌',
    carrot: '🥕',
    cookie: '🍪',
    grapes: '🍇',
    candy: '🍬',
    lollipop: '🍭',
    spicy_taco: '🌮',
    hot_pepper: '🌶️',
    ice_cream: '🍦',
    birthday_cake: '🎂',
    dream_treat: '⭐',
    golden_feast: '👑',
  };
  return emojiMap[foodId] || '🍽️';
}

/**
 * Get Shop items filtered by tab.
 */
export function getShopItemsByTab(tab: ShopTab): ShopItem[] {
  if (tab === 'food') {
    // Food tab: Bundles first, then individual foods
    const bundles = SHOP_CATALOG.filter(item => item.tab === 'food' && item.kind === 'bundle');
    const individuals = getIndividualFoodItems();
    return [...bundles, ...individuals];
  }
  if (tab === 'care') {
    return SHOP_CATALOG.filter(item => item.tab === 'care');
  }
  // Cosmetics and Gems tabs return empty (stubs)
  return [];
}

/**
 * Get bundles only for Food tab.
 * BCT-SHOP-004: Food tab renders Bundles section above Individual section.
 */
export function getFoodBundles(): ShopItem[] {
  return SHOP_CATALOG.filter(item => item.tab === 'food' && item.kind === 'bundle');
}

/**
 * Get individual foods sorted by rarity.
 * BCT-SHOP-021: Individual foods sorted by rarity (Common → Uncommon → Rare → Epic → Legendary).
 */
export function getIndividualFoodsSorted(): ShopItem[] {
  const rarityOrder: Record<string, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
  };

  // Map food IDs to their rarities
  const foodRarities: Record<string, string> = {
    apple: 'common',
    banana: 'common',
    carrot: 'common',
    lollipop: 'common',
    cookie: 'uncommon',
    grapes: 'uncommon',
    candy: 'uncommon',
    spicy_taco: 'rare',
    hot_pepper: 'rare',
    ice_cream: 'rare',
    birthday_cake: 'epic',
    dream_treat: 'epic',
    golden_feast: 'legendary',
  };

  return getIndividualFoodItems().sort((a, b) => {
    const rarityA = rarityOrder[foodRarities[a.id] || 'common'] || 0;
    const rarityB = rarityOrder[foodRarities[b.id] || 'common'] || 0;
    if (rarityA !== rarityB) return rarityA - rarityB;
    return a.displayName.localeCompare(b.displayName);
  });
}

/**
 * Quantity selector bounds per Bible §11.5.1.
 * BCT-SHOP-005: Quantity selector min=1.
 * BCT-SHOP-006: Quantity selector max=10.
 */
export const SHOP_QTY_SELECTOR = {
  MIN: 1,
  MAX: 10,
} as const;

/**
 * Get Shop item by ID.
 */
export function getShopItemById(id: string): ShopItem | undefined {
  // Check catalog first
  const catalogItem = SHOP_CATALOG.find(item => item.id === id);
  if (catalogItem) return catalogItem;

  // Check individual foods
  if (INDIVIDUAL_FOOD_PRICES[id] !== undefined) {
    return getIndividualFoodItems().find(item => item.id === id);
  }

  return undefined;
}

// ============================================================================
// §14.7 Shop Recommendations (LOCKED - BCT-SHOP-022 to 025)
// ============================================================================

/**
 * Recommendation trigger conditions.
 * Priority order per Bible §14.7:
 * 1. Sick (Classic) → care_medicine
 * 2. Energy < 20 → care_energy_drink
 * 3. Hunger < 30 → food_balanced_x5
 * 4. Mood < 40 → care_mood_boost
 * 5. Weight >= 31 → care_diet_food
 */
export interface RecommendationTrigger {
  priority: number;
  itemId: string;
  condition: (state: RecommendationState) => boolean;
}

export interface RecommendationState {
  isSick: boolean;
  isClassicMode: boolean;
  energy: number;
  hunger: number;
  mood: number;
  weight: number;
}

export const SHOP_RECOMMENDATION_TRIGGERS: RecommendationTrigger[] = [
  {
    priority: 1,
    itemId: 'care_medicine',
    condition: (state) => state.isSick && state.isClassicMode,
  },
  {
    priority: 2,
    itemId: 'care_energy_drink',
    condition: (state) => state.energy < 20,
  },
  {
    priority: 3,
    itemId: 'food_balanced_x5',
    condition: (state) => state.hunger < 30,
  },
  {
    priority: 4,
    itemId: 'care_mood_boost',
    condition: (state) => state.mood < 40,
  },
  {
    priority: 5,
    itemId: 'care_diet_food',
    condition: (state) => state.weight >= 31,
  },
];

/**
 * Get recommended Shop items based on current state.
 * BCT-SHOP-022: Recommended section hidden when no triggers.
 * BCT-SHOP-023: Recommended prioritizes sick→medicine.
 * BCT-SHOP-024: Recommended includes energy drink at low energy.
 * BCT-SHOP-025: Recommended includes balanced pack at low hunger.
 *
 * @param state Current game state for recommendation triggers
 * @returns Array of recommended item IDs (max 3), ordered by priority
 */
export function getShopRecommendations(state: RecommendationState): string[] {
  const recommendations: string[] = [];

  // Check triggers in priority order
  for (const trigger of SHOP_RECOMMENDATION_TRIGGERS) {
    if (recommendations.length >= 3) break;

    if (trigger.condition(state)) {
      // Verify item is eligible (visibility conditions)
      const item = getShopItemById(trigger.itemId);
      if (item) {
        // Check visibility conditions
        if (item.visibilityCondition === 'classic_only' && !state.isClassicMode) {
          continue; // Skip - not in classic mode
        }
        if (item.visibilityCondition === 'weight_chubby' && state.weight < 31) {
          continue; // Skip - not chubby
        }
        recommendations.push(trigger.itemId);
      }
    }
  }

  return recommendations;
}

// ============================================================================
// Shop TestIDs (BCT-SHOP)
// ============================================================================

export const SHOP_TEST_IDS = {
  // Entry
  SHOP_BUTTON: 'shop-button',
  // View
  SHOP_VIEW: 'shop-view',
  // Tabs
  TAB_FOOD: 'shop-tab-food',
  TAB_CARE: 'shop-tab-care',
  TAB_COSMETICS: 'shop-tab-cosmetics',
  TAB_GEMS: 'shop-tab-gems',
  // Sections
  SECTION_BUNDLES: 'shop-section-bundles',
  SECTION_INDIVIDUAL: 'shop-section-individual',
  SECTION_RECOMMENDED: 'shop-recommended-section',
  // Item helpers (use with item id)
  itemCard: (id: string) => `shop-item-${id}`,
  itemPrice: (id: string) => `shop-item-price-${id}`,
  qtyMinus: (id: string) => `shop-qty-minus-${id}`,
  qtyPlus: (id: string) => `shop-qty-plus-${id}`,
  qtyValue: (id: string) => `shop-qty-value-${id}`,
} as const;

// ============================================================================
// §11.6 Pet Slots (LOCKED - P9-A)
// ============================================================================

/**
 * Pet slot configuration per Bible §11.6.
 * Player starts with 1 slot (FREE), can purchase up to 4.
 */
export const PET_SLOTS_CONFIG = {
  /** Maximum number of pet slots per Bible §11.6 */
  MAX_SLOTS: 4,
  /** Starting slots for free players */
  FREE_PLAYER_SLOTS: 1,
  /** Starting slots for Grundy Plus subscribers (Bible §11.8: 2 included) */
  PLUS_SUBSCRIBER_SLOTS: 2,
} as const;

/**
 * Pet slot pricing per Bible §11.6.
 * All slots are purchased with gems (💎).
 */
export const PET_SLOT_PRICES = {
  /** 2nd slot: 100💎, or 80💎 with Plus (20% off) */
  SLOT_2: { base: 100, plusDiscount: 80 },
  /** 3rd slot: 150💎, or 120💎 with Plus (20% off) */
  SLOT_3: { base: 150, plusDiscount: 120 },
  /** 4th slot: 200💎, or 160💎 with Plus (20% off) */
  SLOT_4: { base: 200, plusDiscount: 160 },
} as const;

/**
 * Get slot price for a given slot number.
 * @param slotNumber The slot to price (2, 3, or 4)
 * @param hasPlusSubscription Whether player has Grundy Plus
 * @returns Gem cost, or undefined if slot 1 (free) or invalid
 */
export function getPetSlotPrice(slotNumber: number, hasPlusSubscription: boolean = false): number | undefined {
  if (slotNumber === 1) return 0; // Free
  if (slotNumber === 2) return hasPlusSubscription ? PET_SLOT_PRICES.SLOT_2.plusDiscount : PET_SLOT_PRICES.SLOT_2.base;
  if (slotNumber === 3) return hasPlusSubscription ? PET_SLOT_PRICES.SLOT_3.plusDiscount : PET_SLOT_PRICES.SLOT_3.base;
  if (slotNumber === 4) return hasPlusSubscription ? PET_SLOT_PRICES.SLOT_4.plusDiscount : PET_SLOT_PRICES.SLOT_4.base;
  return undefined;
}

/**
 * Global resource rules per Bible §11.6 and §6.
 * "All slotted pets share: Coins, Gems, Inventory"
 * "SHARED across all pets: Coins, Gems, Food Inventory"
 */
export const GLOBAL_RESOURCES = {
  /** Coins are shared across all pets */
  COINS_GLOBAL: true,
  /** Gems are shared across all pets */
  GEMS_GLOBAL: true,
  /** Food inventory is shared across all pets */
  INVENTORY_GLOBAL: true,
} as const;

// ============================================================================
// P9-B: Multi-Pet Runtime Constants (Bible v1.7)
// ============================================================================

/**
 * Bible §8.2.1: Energy Scope (Multi-Pet)
 * Energy is GLOBAL across all owned pets.
 */
export const MULTI_PET_ENERGY = {
  /** Energy is global (shared pool across all pets) */
  SCOPE: 'global' as const,
  /** First-free daily is global (one per day total, not per pet) */
  FIRST_FREE_GLOBAL: true,
  /** Daily cap (3 plays) is global across all pets */
  DAILY_CAP_GLOBAL: true,
} as const;

/**
 * Bible §9.4.6: Multi-Pet Offline Rules
 * Stat decay rates per 24 hours offline.
 */
export const OFFLINE_DECAY_RATES = {
  /** Mood decay per 24h offline */
  MOOD_PER_24H: 5,
  /** Mood floor (minimum value) */
  MOOD_FLOOR: 30,
  /** Bond decay per 24h offline (standard) */
  BOND_PER_24H: 2,
  /** Bond decay per 24h offline (Grundy Plus: 50% slower) */
  BOND_PER_24H_PLUS: 1,
  /** Bond floor (minimum value) */
  BOND_FLOOR: 0,
  /** Hunger decay per 24h offline */
  HUNGER_PER_24H: 10,
  /** Hunger floor (minimum value) */
  HUNGER_FLOOR: 0,
  /** Neglect cap (maximum days) */
  NEGLECT_CAP_DAYS: 14,
  /** Welcome back threshold (show summary if offline longer than this) */
  WELCOME_BACK_THRESHOLD_HOURS: 24,
  // P10-B: Weight & Sickness offline rules (Bible v1.8 §9.4.7)
  /** Weight decay per hour offline */
  WEIGHT_PER_HOUR: 1,
  /** Weight floor (minimum value) */
  WEIGHT_FLOOR: 0,
  /** Maximum offline duration in days (14-day cap) */
  MAX_OFFLINE_DAYS: 14,
} as const;

/**
 * P10-B: Sickness system constants (Bible v1.8 §9.4.7.2)
 * Classic Mode only - disabled in Cozy Mode.
 */
export const SICKNESS_CONFIG = {
  /** Hunger=0 trigger timer threshold in minutes */
  HUNGER_TRIGGER_MINUTES: 30,
  /** Hunger=0 sickness chance (20%) */
  HUNGER_TRIGGER_CHANCE: 0.20,
  /** Poop uncleaned trigger timer threshold in minutes */
  POOP_TRIGGER_MINUTES: 120,
  /** Poop uncleaned sickness chance (15%) */
  POOP_TRIGGER_CHANCE: 0.15,
  /** Sickness stat decay multiplier (2×) */
  SICK_DECAY_MULTIPLIER: 2,
  /** Care mistakes per hour while sick */
  CARE_MISTAKES_PER_HOUR: 1,
  /** Maximum care mistakes per offline session */
  CARE_MISTAKES_OFFLINE_CAP: 4,
} as const;

/**
 * P10-C: Snack weight gain by food (Bible v1.8 §5.7, §9.4.7.1)
 * Only snacks add weight; all other foods add 0.
 */
export const SNACK_WEIGHT_GAIN: Record<string, number> = {
  cookie: 5,      // +5% weight risk
  candy: 10,      // +10% weight risk
  ice_cream: 10,  // +10% weight risk
  lollipop: 8,    // +8% weight risk
} as const;

/**
 * P10-C: Immediate feeding-time sickness triggers (Bible v1.8 §9.4.7.2)
 * These triggers are checked immediately on feeding (not timer-based).
 * Classic Mode only.
 */
export const FEEDING_SICKNESS_TRIGGERS = {
  /** Hot Pepper 🌶️ sickness chance (5% always) */
  HOT_PEPPER_CHANCE: 0.05,
  /** Snack when Overweight (61+) sickness chance (5% per snack) */
  OVERWEIGHT_SNACK_CHANCE: 0.05,
  /** Weight threshold for overweight sickness trigger */
  OVERWEIGHT_THRESHOLD: 61,
} as const;

/**
 * P10-D: Mini-game gating thresholds (Bible v1.8 §9.4.7)
 * Health conditions that block mini-games (Classic Mode only).
 */
export const MINIGAME_GATING = {
  /** Weight threshold for Obese (blocks mini-games in Classic) */
  OBESE_THRESHOLD: 81,
  // Sick check uses isSick boolean directly
} as const;

/**
 * P10-B1.5: Poop frequency by pet type (Bible v1.8 §9.5)
 * Values extracted directly from Bible "Poop Frequency by Pet" table.
 * Key = species ID, Value = number of feedings before poop spawns.
 */
export const POOP_FREQUENCY: Record<string, number> = {
  munchlet: 4,  // Average
  grib: 3,      // Messy
  plompo: 5,    // Efficient
  fizz: 3,      // Hyper digestion
  ember: 4,     // Average
  chomper: 2,   // Constant eating = constant pooping
  whisp: 6,     // Ethereal, minimal waste
  luxe: 4,      // Average (but complains more)
} as const;

/**
 * P10-B2: Poop cleaning rewards (Bible v1.8 §9.5)
 * Rewards granted when player cleans poop.
 */
export const POOP_CLEANING_REWARDS = {
  /** Happiness (mood) boost from cleaning */
  HAPPINESS_BOOST: 2,
  /** Bond boost from cleaning */
  BOND_BOOST: 0.1,
} as const;

/**
 * P10-B2: Poop mood decay acceleration (Bible v1.8 §9.5)
 * Mood decays faster when poop is dirty for extended periods.
 */
export const POOP_MOOD_DECAY = {
  /** Minutes of dirty poop before mood decay accelerates */
  ACCELERATION_THRESHOLD_MINUTES: 60,
  /** Mood decay multiplier when poop has been dirty >= threshold */
  ACCELERATION_MULTIPLIER: 2,
} as const;

/**
 * P10-E: Recovery item effects (Bible v1.8 §9.4.7.4, §11.5)
 * Effect values only - prices are in SHOP_CATALOG.
 */
export const RECOVERY_EFFECTS = {
  /** Diet Food 🥗: -20 weight, +5 hunger (Bible §11.5) */
  DIET_FOOD: {
    WEIGHT_REDUCTION: 20,
    HUNGER_GAIN: 5,
  },
  /** Medicine 💊: Instant cure (effect is binary, no numeric values) */
  // Medicine effect is handled in action logic (set isSick=false, sickStartTimestamp=null)
} as const;

/**
 * P10-E: Diet Food visibility threshold (Bible §11.5, §14.7)
 * Diet Food button/shop item shown when weight >= this value (Chubby+).
 */
export const DIET_FOOD_THRESHOLD = 31;

/**
 * P10-E: Ad recovery stub config (Bible §9.4.7.4)
 * Ads are [Unity Later] - Web Edition returns stub failure.
 */
export const AD_RECOVERY = {
  /** Whether ad recovery is enabled on this platform */
  WEB_ENABLED: false,
  /** Ad cooldown period in hours (for future Unity implementation) */
  COOLDOWN_HOURS: 24,
} as const;

/**
 * Bible §11.6.1: Alert Suppression Rules
 */
export const ALERT_SUPPRESSION = {
  /** Minimum minutes between alerts for same pet (except runaway) */
  COOLDOWN_MINUTES: 30,
  /** Maximum non-critical alerts per session */
  SESSION_LIMIT: 5,
  /** Runaway alerts bypass suppression */
  RUNAWAY_BYPASSES: true,
} as const;

// ============================================================================
// P10-F: Health Alerts Configuration (Bible v1.8 §11.6.1)
// ============================================================================

/**
 * Health alert identifiers.
 */
export type HealthAlertId =
  | 'weight_warning_obese'
  | 'weight_recovery'
  | 'sickness_onset'
  | 'sickness_reminder';

/**
 * Health alert configuration per Bible v1.8 §11.6.1.
 */
export interface HealthAlertConfig {
  id: HealthAlertId;
  /** Alert label for display */
  label: string;
  /** Toast message (undefined = no toast) */
  toastMessage?: string;
  /** Whether badge is shown on pet avatar */
  showBadge: boolean;
  /** 'both' | 'classic' - which modes show this alert */
  modeScope: 'both' | 'classic';
}

/**
 * Health alert threshold configuration (Bible v1.8 §11.6.1).
 */
export const HEALTH_ALERT_THRESHOLDS = {
  /** Weight threshold for obese warning (>= triggers alert) */
  OBESE_WEIGHT: 81,
  /** Minutes sick before sickness reminder badge shows */
  SICKNESS_REMINDER_MINUTES: 30,
} as const;

/**
 * Health alert configurations per Bible v1.8 §11.6.1.
 * Used by computeHealthAlerts() pure function.
 */
export const HEALTH_ALERT_CONFIGS: Record<HealthAlertId, HealthAlertConfig> = {
  weight_warning_obese: {
    id: 'weight_warning_obese',
    label: 'Obese',
    toastMessage: 'Your Grundy is overweight! Try some diet food.',
    showBadge: false, // Toast only per Bible
    modeScope: 'both',
  },
  weight_recovery: {
    id: 'weight_recovery',
    label: 'Healthy Weight',
    toastMessage: 'Your Grundy is back to a healthy weight!',
    showBadge: false, // Toast only, one-time
    modeScope: 'both',
  },
  sickness_onset: {
    id: 'sickness_onset',
    label: 'Sick',
    toastMessage: 'Your Grundy got sick! Give them some medicine.',
    showBadge: true, // Toast + badge
    modeScope: 'classic',
  },
  sickness_reminder: {
    id: 'sickness_reminder',
    label: 'Still Sick',
    // No toast for reminder - badge only per Bible
    showBadge: true,
    modeScope: 'classic',
  },
} as const;

/**
 * Alert badge types per Bible §11.6.1
 */
export const ALERT_BADGES = {
  /** Warning badge for Worried/Sad state */
  WARNING: '⚠️',
  /** Urgent badge for Withdrawn/Critical state */
  URGENT: '💔',
  /** Locked badge for Runaway state */
  LOCKED: '🔒',
} as const;

/**
 * Pet slot test IDs for BCT tests.
 */
export const PET_SLOTS_TEST_IDS = {
  PET_SWITCHER: 'pet-switcher',
  PET_SWITCH_BUTTON: (speciesId: string) => `pet-switch-${speciesId}`,
  ACTIVE_PET_INDICATOR: 'active-pet-indicator',
  OWNED_PETS_LIST: 'owned-pets-list',
} as const;

// ============================================================================
// §11.6 Pet Slot Unlock System (P9-C-SLOTS)
// ============================================================================

/**
 * Slot prerequisite types.
 */
export type SlotPrereqType = 'level' | 'slot_owned';

/**
 * Slot prerequisite definition.
 */
export interface SlotPrereq {
  type: SlotPrereqType;
  /** For 'level': minimum level required. For 'slot_owned': slot number that must be owned. */
  value: number;
  /** Human-readable description */
  description: string;
}

/**
 * Slot prerequisite configuration per Bible §11.5 Utility Items table.
 * - Slot 2: Level 5+ required
 * - Slot 3: Own slot 2
 * - Slot 4: Own slot 3
 */
export const PET_SLOT_PREREQS: Record<number, SlotPrereq> = {
  2: { type: 'level', value: 5, description: 'Reach Level 5' },
  3: { type: 'slot_owned', value: 2, description: 'Own 2nd slot' },
  4: { type: 'slot_owned', value: 3, description: 'Own 3rd slot' },
} as const;

/**
 * Slot unlock TestIDs per task spec.
 */
export const SLOT_UNLOCK_TEST_IDS = {
  /** Slot container: data-testid="pet-slot-{n}" */
  SLOT_CONTAINER: (slotNumber: number) => `pet-slot-${slotNumber}`,
  /** Unlock CTA: data-testid="slot-unlock-{n}" */
  UNLOCK_CTA: (slotNumber: number) => `slot-unlock-${slotNumber}`,
  /** Unlock modal */
  UNLOCK_MODAL: 'slot-unlock-modal',
  /** Confirm button */
  CONFIRM_BUTTON: 'slot-unlock-confirm',
  /** Cancel button */
  CANCEL_BUTTON: 'slot-unlock-cancel',
  /** Prereq message: data-testid="slot-prereq-{n}" */
  PREREQ_MESSAGE: (slotNumber: number) => `slot-prereq-${slotNumber}`,
  /** Price display: data-testid="slot-price-{n}" */
  PRICE_DISPLAY: (slotNumber: number) => `slot-price-${slotNumber}`,
  /** Pet slots section */
  PET_SLOTS_SECTION: 'pet-slots-section',
} as const;

/**
 * Check if slot prerequisite is met.
 * @param slotNumber The slot to check (2, 3, or 4)
 * @param playerLevel Current player level
 * @param unlockedSlots Number of slots currently owned
 * @returns { met: boolean, reason?: string }
 */
export function checkSlotPrereq(
  slotNumber: number,
  playerLevel: number,
  unlockedSlots: number
): { met: boolean; reason?: string } {
  // Slot 1 is always free/available
  if (slotNumber === 1) {
    return { met: true };
  }

  const prereq = PET_SLOT_PREREQS[slotNumber];
  if (!prereq) {
    return { met: false, reason: 'Invalid slot number' };
  }

  if (prereq.type === 'level') {
    if (playerLevel < prereq.value) {
      return { met: false, reason: `Requires Level ${prereq.value}` };
    }
    return { met: true };
  }

  if (prereq.type === 'slot_owned') {
    // Must own the previous slot (sequential unlock)
    if (unlockedSlots < prereq.value) {
      return { met: false, reason: `Requires ${ordinal(prereq.value)} slot` };
    }
    return { met: true };
  }

  return { met: false, reason: 'Unknown prerequisite type' };
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, 4th).
 */
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Result of a slot purchase attempt.
 */
export interface SlotPurchaseResult {
  success: boolean;
  error?: 'insufficient_gems' | 'prereq_not_met' | 'already_owned' | 'max_slots' | 'invalid_slot';
  /** New gems balance after purchase (if successful) */
  newGems?: number;
  /** New unlocked slots count (if successful) */
  newUnlockedSlots?: number;
  /** Cost of the slot */
  cost?: number;
}

/**
 * Slot purchase state needed for validation.
 */
export interface SlotPurchaseState {
  gems: number;
  unlockedSlots: number;
  playerLevel: number;
  hasPlusSubscription: boolean;
}

/**
 * Attempt to purchase a pet slot.
 * Pure function - does not mutate state.
 *
 * @param state Current state
 * @param slotNumber Slot to purchase (2, 3, or 4)
 * @returns SlotPurchaseResult
 */
export function purchaseSlot(
  state: SlotPurchaseState,
  slotNumber: number
): SlotPurchaseResult {
  // Validate slot number
  if (slotNumber < 2 || slotNumber > PET_SLOTS_CONFIG.MAX_SLOTS) {
    return { success: false, error: 'invalid_slot' };
  }

  // Check if already owned
  if (state.unlockedSlots >= slotNumber) {
    return { success: false, error: 'already_owned' };
  }

  // Check max slots
  if (slotNumber > PET_SLOTS_CONFIG.MAX_SLOTS) {
    return { success: false, error: 'max_slots' };
  }

  // Check prerequisites (sequential unlock)
  const prereqCheck = checkSlotPrereq(slotNumber, state.playerLevel, state.unlockedSlots);
  if (!prereqCheck.met) {
    return { success: false, error: 'prereq_not_met' };
  }

  // Get price
  const cost = getPetSlotPrice(slotNumber, state.hasPlusSubscription);
  if (cost === undefined) {
    return { success: false, error: 'invalid_slot' };
  }

  // Check sufficient gems
  if (state.gems < cost) {
    return { success: false, error: 'insufficient_gems' };
  }

  // Success - return new state values
  return {
    success: true,
    newGems: state.gems - cost,
    newUnlockedSlots: slotNumber,
    cost,
  };
}

/**
 * Get slot status for UI display.
 */
export interface SlotStatus {
  slotNumber: number;
  isOwned: boolean;
  isLocked: boolean;
  canUnlock: boolean;
  price?: number;
  prereqMet: boolean;
  prereqReason?: string;
}

/**
 * Get status for all slots (1-4).
 */
export function getAllSlotStatuses(
  unlockedSlots: number,
  playerLevel: number,
  gems: number,
  hasPlusSubscription: boolean = false
): SlotStatus[] {
  const statuses: SlotStatus[] = [];

  for (let slotNumber = 1; slotNumber <= PET_SLOTS_CONFIG.MAX_SLOTS; slotNumber++) {
    const isOwned = slotNumber <= unlockedSlots;
    const prereqCheck = checkSlotPrereq(slotNumber, playerLevel, unlockedSlots);
    const price = slotNumber === 1 ? 0 : getPetSlotPrice(slotNumber, hasPlusSubscription);

    statuses.push({
      slotNumber,
      isOwned,
      isLocked: !isOwned,
      canUnlock: !isOwned && prereqCheck.met && (price !== undefined ? gems >= price : false),
      price: slotNumber === 1 ? undefined : price,
      prereqMet: prereqCheck.met,
      prereqReason: prereqCheck.reason,
    });
  }

  return statuses;
}

// ============================================================================
// §11.5 Cosmetics System (P11-A Foundations)
// ============================================================================

/**
 * Cosmetic slot types per Bible §11.5.3.
 * Each slot accepts specific cosmetic prefixes.
 */
export const COSMETIC_SLOTS = ['hat', 'accessory', 'outfit', 'aura', 'skin'] as const;
export type CosmeticSlot = typeof COSMETIC_SLOTS[number];

/**
 * Slot to valid prefixes mapping per Bible §11.5.3.
 *
 * Guardrail: COSMETIC_CATALOG is authoritative.
 * Slot/rarity/price must come from catalog fields.
 * Prefixes are optional conveniences; do NOT enforce or infer schema from IDs.
 */
export const COSMETIC_SLOT_PREFIXES: Record<CosmeticSlot, string[]> = {
  hat: ['cos_hat_'],
  accessory: ['cos_scarf_', 'cos_accessory_'],
  outfit: ['cos_outfit_'],
  aura: ['cos_aura_'],
  skin: ['cos_skin_'],
};

/**
 * Rarity tiers and gem price ranges per Bible §11.5.4.
 * Cosmetics are GEMS-ONLY (Bible §11.1).
 */
export type CosmeticRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const COSMETIC_RARITY_CONFIG: Record<CosmeticRarity, { minGems: number; maxGems: number }> = {
  common: { minGems: 10, maxGems: 20 },
  uncommon: { minGems: 20, maxGems: 40 },
  rare: { minGems: 40, maxGems: 70 },
  epic: { minGems: 70, maxGems: 120 },
  legendary: { minGems: 120, maxGems: 300 },
};

/**
 * Cosmetic definition for catalog.
 * Note: Full catalog is defined elsewhere; this is the schema.
 */
export interface CosmeticDefinition {
  id: string;
  displayName: string;
  slot: CosmeticSlot;
  rarity: CosmeticRarity;
  priceGems: number;
  spriteKey?: string;
  unlockLevel?: number;
}

/**
 * Determine the slot for a cosmetic ID based on prefix mapping.
 * Returns undefined if cosmetic ID doesn't match any known prefix.
 */
export function getCosmeticSlot(cosmeticId: string): CosmeticSlot | undefined {
  for (const [slot, prefixes] of Object.entries(COSMETIC_SLOT_PREFIXES)) {
    if (prefixes.some(prefix => cosmeticId.startsWith(prefix))) {
      return slot as CosmeticSlot;
    }
  }
  return undefined;
}

/**
 * Validate that a cosmetic ID matches its expected slot.
 */
export function validateCosmeticSlot(cosmeticId: string, expectedSlot: CosmeticSlot): boolean {
  const detectedSlot = getCosmeticSlot(cosmeticId);
  return detectedSlot === expectedSlot;
}

/**
 * STUB: Cosmetic catalog for P11-A foundations.
 * Real catalog will be populated in P11-B Shop UI phase.
 * These test cosmetics enable unit testing of equip/unequip logic.
 */
export const COSMETIC_CATALOG: CosmeticDefinition[] = [
  // Test cosmetics for BCT validation
  { id: 'cos_hat_cap_blue', displayName: 'Blue Cap', slot: 'hat', rarity: 'common', priceGems: 15 },
  { id: 'cos_hat_bow_pink', displayName: 'Pink Bow', slot: 'hat', rarity: 'uncommon', priceGems: 25 },
  { id: 'cos_accessory_scarf_red', displayName: 'Red Scarf', slot: 'accessory', rarity: 'common', priceGems: 12 },
  { id: 'cos_outfit_sweater', displayName: 'Cozy Sweater', slot: 'outfit', rarity: 'rare', priceGems: 50 },
  { id: 'cos_aura_sparkle', displayName: 'Sparkle Aura', slot: 'aura', rarity: 'epic', priceGems: 85 },
  { id: 'cos_skin_golden', displayName: 'Golden Skin', slot: 'skin', rarity: 'legendary', priceGems: 200, unlockLevel: 25 },
];

/**
 * Get cosmetic definition by ID.
 */
export function getCosmeticById(cosmeticId: string): CosmeticDefinition | undefined {
  return COSMETIC_CATALOG.find(c => c.id === cosmeticId);
}

/**
 * Validate cosmetic price is within rarity range (for future shop validation).
 */
export function isValidCosmeticPrice(rarity: CosmeticRarity, priceGems: number): boolean {
  const config = COSMETIC_RARITY_CONFIG[rarity];
  return priceGems >= config.minGems && priceGems <= config.maxGems;
}

// ============================================================================
// Type Exports
// ============================================================================

/** Unique identifier for an owned pet instance */
export type PetInstanceId = string;

/** Species identifier (one of the 8 canonical pets) */
export type SpeciesId = typeof ALL_PET_IDS[number];

export type EvolutionStage = typeof EVOLUTION_STAGES[keyof typeof EVOLUTION_STAGES];
export type FullnessState = keyof typeof FULLNESS_STATES;
export type RewardTier = keyof typeof REWARD_TIERS;
export type RoomType = typeof ROOM_ACTIVITY_MAP[keyof typeof ROOM_ACTIVITY_MAP];
/** @deprecated Use SpeciesId instead. PetId refers to species. */
export type PetId = typeof ALL_PET_IDS[number];
export type TimeOfDay = keyof typeof TIME_OF_DAY;
export type TestId = typeof TEST_IDS[keyof typeof TEST_IDS];
