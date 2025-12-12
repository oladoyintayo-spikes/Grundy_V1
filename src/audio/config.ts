// ============================================
// GRUNDY — AUDIO CONFIG
// Sound and music configuration registry
// P5-AUDIO-CORE, P6-AUDIO-ROOM, P6-AUDIO-TOD
// ============================================

import type {
  SoundConfig,
  MusicConfig,
  AmbienceConfig,
  SoundId,
  MusicTrackId,
  AmbienceTrackId,
  TimeOfDayVolumeMultipliers,
  RoomAmbienceMap,
} from './types';

/**
 * Sound effects configuration.
 * All SFX entries must be listed here with valid paths.
 * Designers can swap audio files without code changes.
 */
export const SOUND_CONFIG: Record<SoundId, SoundConfig> = {
  ui_tap: {
    id: 'ui_tap',
    src: '/audio/ui_tap.mp3',
    volume: 0.4,
  },
  ui_confirm: {
    id: 'ui_confirm',
    src: '/audio/ui_confirm.mp3',
    volume: 0.5,
  },
  ui_back: {
    id: 'ui_back',
    src: '/audio/ui_back.mp3',
    volume: 0.4,
  },
  mini_bronze: {
    id: 'mini_bronze',
    src: '/audio/mini_bronze.mp3',
    volume: 0.5,
  },
  mini_silver: {
    id: 'mini_silver',
    src: '/audio/mini_silver.mp3',
    volume: 0.6,
  },
  mini_gold: {
    id: 'mini_gold',
    src: '/audio/mini_gold.mp3',
    volume: 0.7,
  },
  mini_rainbow: {
    id: 'mini_rainbow',
    src: '/audio/mini_rainbow.mp3',
    volume: 0.8,
  },
  pet_happy: {
    id: 'pet_happy',
    src: '/audio/pet_happy.mp3',
    volume: 0.5,
  },
  pet_level_up: {
    id: 'pet_level_up',
    src: '/audio/pet_level_up.mp3',
    volume: 0.7,
  },
};

/**
 * Music tracks configuration.
 * Background music and ambient tracks.
 */
export const MUSIC_CONFIG: Record<MusicTrackId, MusicConfig> = {
  bg_main: {
    id: 'bg_main',
    src: '/audio/bg_main.mp3',
    volume: 0.35,
    loop: true,
  },
};

// ============================================
// P6-AUDIO-ROOM: AMBIENCE CONFIGURATION
// Room-specific atmosphere sounds
// ============================================

/**
 * Ambience tracks configuration.
 * Each room has its own ambient soundscape.
 * P6-AUDIO-ROOM: Room-specific ambience.
 */
export const AMBIENCE_CONFIG: Record<AmbienceTrackId, AmbienceConfig> = {
  ambience_living_room: {
    id: 'ambience_living_room',
    src: '/audio/ambience_living_room.mp3',
    baseVolume: 0.2,
    loop: true,
  },
  ambience_kitchen: {
    id: 'ambience_kitchen',
    src: '/audio/ambience_kitchen.mp3',
    baseVolume: 0.15,
    loop: true,
  },
  ambience_bedroom: {
    id: 'ambience_bedroom',
    src: '/audio/ambience_bedroom.mp3',
    baseVolume: 0.1,
    loop: true,
  },
  ambience_playroom: {
    id: 'ambience_playroom',
    src: '/audio/ambience_playroom.mp3',
    baseVolume: 0.25,
    loop: true,
  },
  ambience_yard: {
    id: 'ambience_yard',
    src: '/audio/ambience_yard.mp3',
    baseVolume: 0.2,
    loop: true,
  },
};

/**
 * P6-AUDIO-ROOM: Maps each room to its ambience track.
 */
export const ROOM_AMBIENCE_MAP: RoomAmbienceMap = {
  living_room: 'ambience_living_room',
  kitchen: 'ambience_kitchen',
  bedroom: 'ambience_bedroom',
  playroom: 'ambience_playroom',
  yard: 'ambience_yard',
};

/**
 * P6-AUDIO-TOD: Volume multipliers for time-of-day.
 * Creates subtle atmosphere changes throughout the day.
 * - Morning: Brighter, moderate volume
 * - Day: Full volume, lively
 * - Evening: Slightly softer, winding down
 * - Night: Quietest, peaceful
 */
export const TIME_OF_DAY_VOLUME_MULTIPLIERS: TimeOfDayVolumeMultipliers = {
  morning: 0.9,
  day: 1.0,
  evening: 0.8,
  night: 0.6,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all sound IDs for validation.
 */
export function getAllSoundIds(): SoundId[] {
  return Object.keys(SOUND_CONFIG) as SoundId[];
}

/**
 * Get all music track IDs for validation.
 */
export function getAllMusicTrackIds(): MusicTrackId[] {
  return Object.keys(MUSIC_CONFIG) as MusicTrackId[];
}

/**
 * Get all ambience track IDs for validation.
 */
export function getAllAmbienceTrackIds(): AmbienceTrackId[] {
  return Object.keys(AMBIENCE_CONFIG) as AmbienceTrackId[];
}
