// ============================================
// GRUNDY — AUDIO TYPES
// Type definitions for audio system
// P5-AUDIO-CORE, P6-AUDIO-ROOM, P6-AUDIO-TOD
// ============================================

import type { RoomId, TimeOfDay } from '../types';

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
 * Ambience track IDs for room-specific atmosphere.
 * P6-AUDIO-ROOM: Each room has its own ambience track.
 */
export type AmbienceTrackId =
  | 'ambience_living_room'
  | 'ambience_kitchen'
  | 'ambience_bedroom'
  | 'ambience_playroom'
  | 'ambience_yard';

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

/**
 * Configuration for an ambience track.
 * P6-AUDIO-ROOM: Room-specific atmosphere sounds.
 */
export interface AmbienceConfig {
  id: AmbienceTrackId;
  src: string;
  baseVolume: number; // 0.0–1.0, base volume before time-of-day adjustments
  loop: boolean;
}

/**
 * P6-AUDIO-TOD: Volume multipliers for time-of-day.
 * Applied to ambience tracks to create subtle time-based variations.
 */
export type TimeOfDayVolumeMultipliers = Record<TimeOfDay, number>;

/**
 * P6-AUDIO-ROOM: Mapping from room to ambience track.
 */
export type RoomAmbienceMap = Record<RoomId, AmbienceTrackId>;
