// ============================================
// GRUNDY — AUDIO TYPES
// Type definitions for audio system
// P5-AUDIO-CORE
// ============================================

/**
 * Sound effect IDs used throughout the app.
 * Add new sounds here and in SOUND_CONFIG.
 */
export type SoundId =
  | 'ui_tap'
  | 'ui_confirm'
  | 'ui_back'
  | 'mini_bronze'
  | 'mini_silver'
  | 'mini_gold'
  | 'mini_rainbow'
  | 'pet_happy'
  | 'pet_level_up';

/**
 * Background music track IDs.
 * Add new tracks here and in MUSIC_CONFIG.
 */
export type MusicTrackId = 'bg_main';

/**
 * Configuration for a sound effect.
 */
export interface SoundConfig {
  id: SoundId;
  src: string;
  volume: number; // 0.0–1.0
}

/**
 * Configuration for a music track.
 */
export interface MusicConfig {
  id: MusicTrackId;
  src: string;
  volume: number; // 0.0–1.0
  loop: boolean;
}
