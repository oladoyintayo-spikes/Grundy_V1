// ============================================
// GRUNDY — AUDIO MANAGER
// Central audio controller for SFX and BGM
// P5-AUDIO-CORE
// ============================================

import { SOUND_CONFIG, MUSIC_CONFIG } from './config';
import type { SoundId, MusicTrackId } from './types';
import type { RewardTier } from '../types';

/**
 * Check if we're in a browser environment with audio support.
 * Returns false in test environments or SSR.
 */
function isAudioEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

/**
 * Central audio manager class.
 * Handles all sound effects and background music.
 * Safe to use in non-browser environments (fails silently).
 */
class AudioManager {
  private soundCache = new Map<SoundId, HTMLAudioElement>();
  private musicCache = new Map<MusicTrackId, HTMLAudioElement>();
  private musicCurrent: MusicTrackId | null = null;

  soundEnabled = true;
  musicEnabled = true;

  /**
   * Enable or disable sound effects.
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Enable or disable background music.
   * When disabled, stops any playing music.
   * When enabled, restarts the current track if one was playing.
   */
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  /**
   * Play a sound effect by ID.
   * Fire-and-forget; failures are logged but don't throw.
   */
  playSound(id: SoundId): void {
    if (!this.soundEnabled || !isAudioEnvironment()) return;

    const config = SOUND_CONFIG[id];
    if (!config) return;

    let audio = this.soundCache.get(id);
    if (!audio) {
      audio = new Audio(config.src);
      audio.volume = config.volume;
      this.soundCache.set(id, audio);
    } else {
      // Reset for re-play
      audio.currentTime = 0;
    }

    void audio.play().catch(() => {
      // Fail silently; no console spam in prod
    });
  }

  /**
   * Start playing background music.
   * If the same track is already playing, does nothing.
   */
  playMusic(id: MusicTrackId): void {
    if (!this.musicEnabled || !isAudioEnvironment()) return;

    const config = MUSIC_CONFIG[id];
    if (!config) return;

    // Don't restart if same track is playing
    if (this.musicCurrent === id) return;

    // Stop any current music
    this.stopMusic();

    const audio = new Audio(config.src);
    audio.volume = config.volume;
    audio.loop = config.loop;
    this.musicCache.set(id, audio);
    this.musicCurrent = id;

    void audio.play().catch(() => {
      // Fail silently
    });
  }

  /**
   * Stop any currently playing background music.
   */
  stopMusic(): void {
    if (!isAudioEnvironment()) return;

    if (!this.musicCurrent) return;
    const current = this.musicCache.get(this.musicCurrent);
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
    this.musicCurrent = null;
  }

  /**
   * Get current music state.
   */
  isPlaying(): boolean {
    return this.musicCurrent !== null;
  }
}

// Singleton instance
export const audioManager = new AudioManager();

// ============================================
// CONVENIENCE HELPERS
// ============================================

/**
 * Play UI tap sound (button presses, nav changes).
 */
export function playUiTap(): void {
  audioManager.playSound('ui_tap');
}

/**
 * Play UI confirm sound (primary actions).
 */
export function playUiConfirm(): void {
  audioManager.playSound('ui_confirm');
}

/**
 * Play UI back sound (going back, canceling).
 */
export function playUiBack(): void {
  audioManager.playSound('ui_back');
}

/**
 * Play pet happy sound (successful feed).
 */
export function playPetHappy(): void {
  audioManager.playSound('pet_happy');
}

/**
 * Play level up sound.
 */
export function playLevelUp(): void {
  audioManager.playSound('pet_level_up');
}

/**
 * Play mini-game result sound based on tier.
 */
export function playMiniGameResult(tier: RewardTier): void {
  switch (tier) {
    case 'bronze':
      audioManager.playSound('mini_bronze');
      break;
    case 'silver':
      audioManager.playSound('mini_silver');
      break;
    case 'gold':
      audioManager.playSound('mini_gold');
      break;
    case 'rainbow':
      audioManager.playSound('mini_rainbow');
      break;
  }
}

/**
 * Start background music (after FTUE).
 */
export function startBackgroundMusic(): void {
  audioManager.playMusic('bg_main');
}

/**
 * Stop background music.
 */
export function stopBackgroundMusic(): void {
  audioManager.stopMusic();
}
