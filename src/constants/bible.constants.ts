/**
 * GRUNDY BIBLE CONSTANTS
 *
 * These values are LOCKED per GRUNDY_MASTER_BIBLE v1.4.
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
  'One of them just found you.',
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
  GLOBAL_NAV: 'global-nav',
  NAV_HOME: 'nav-home',
  NAV_GAMES: 'nav-games',
  NAV_SETTINGS: 'nav-settings',
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
