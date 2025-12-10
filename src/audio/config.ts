// ============================================
// GRUNDY — AUDIO CONFIG
// Sound and music configuration registry
// P5-AUDIO-CORE
// ============================================

import type { SoundConfig, MusicConfig, SoundId, MusicTrackId } from './types';

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
