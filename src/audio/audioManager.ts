// ============================================
// GRUNDY — AUDIO MANAGER
// Central audio controller for SFX, BGM, and Ambience
// P5-AUDIO-CORE, P6-AUDIO-ROOM, P6-AUDIO-TOD
// ============================================

import {
  SOUND_CONFIG,
  MUSIC_CONFIG,
  AMBIENCE_CONFIG,
  ROOM_AMBIENCE_MAP,
  TIME_OF_DAY_VOLUME_MULTIPLIERS,
} from './config';
import type { SoundId, MusicTrackId, AmbienceTrackId } from './types';
import type { RewardTier, RoomId, TimeOfDay } from '../types';

/**
 * Check if we're in a browser environment with audio support.
 * Returns false in test environments or SSR.
 */
function isAudioEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

/**
 * Central audio manager class.
 * Handles all sound effects, background music, and room ambience.
 * Safe to use in non-browser environments (fails silently).
 * P6-AUDIO-ROOM, P6-AUDIO-TOD: Added ambience support with room/TOD awareness.
 */
class AudioManager {
  private soundCache = new Map<SoundId, HTMLAudioElement>();
  private musicCache = new Map<MusicTrackId, HTMLAudioElement>();
  private ambienceCache = new Map<AmbienceTrackId, HTMLAudioElement>();
  private musicCurrent: MusicTrackId | null = null;
  private ambienceCurrent: AmbienceTrackId | null = null;
  private currentTimeOfDay: TimeOfDay = 'day';
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  soundEnabled = true;
  musicEnabled = true;
  ambienceEnabled = true;

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

  // ============================================
  // P6-AUDIO-ROOM: AMBIENCE MANAGEMENT
  // ============================================

  /**
   * Enable or disable ambience.
   * P6-AUDIO-ROOM: Added for ambience control.
   */
  setAmbienceEnabled(enabled: boolean): void {
    this.ambienceEnabled = enabled;
    if (!enabled) {
      this.stopAmbience();
    }
  }

  /**
   * Calculate the volume for ambience based on base volume and time-of-day.
   * P6-AUDIO-TOD: Time-of-day volume adjustment.
   */
  private calculateAmbienceVolume(baseVolume: number): number {
    const multiplier = TIME_OF_DAY_VOLUME_MULTIPLIERS[this.currentTimeOfDay];
    return baseVolume * multiplier;
  }

  /**
   * Update the current time-of-day and adjust ambience volume accordingly.
   * P6-AUDIO-TOD: Called when time-of-day changes.
   */
  setTimeOfDay(timeOfDay: TimeOfDay): void {
    if (this.currentTimeOfDay === timeOfDay) return;

    this.currentTimeOfDay = timeOfDay;

    // Update volume of currently playing ambience
    if (this.ambienceCurrent && isAudioEnvironment()) {
      const audio = this.ambienceCache.get(this.ambienceCurrent);
      const config = AMBIENCE_CONFIG[this.ambienceCurrent];
      if (audio && config) {
        audio.volume = this.calculateAmbienceVolume(config.baseVolume);
      }
    }
  }

  /**
   * Play ambience for a specific room.
   * P6-AUDIO-ROOM: Room-specific ambience.
   */
  playAmbienceForRoom(room: RoomId): void {
    const trackId = ROOM_AMBIENCE_MAP[room];
    this.playAmbience(trackId);
  }

  /**
   * Play an ambience track by ID.
   * Handles crossfade from current ambience.
   * P6-AUDIO-ROOM: Core ambience playback.
   */
  playAmbience(id: AmbienceTrackId): void {
    if (!this.ambienceEnabled || !isAudioEnvironment()) return;

    const config = AMBIENCE_CONFIG[id];
    if (!config) return;

    // Don't restart if same track is playing
    if (this.ambienceCurrent === id) return;

    // Stop any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // Fade out current ambience before starting new one
    const oldAudio = this.ambienceCurrent ? this.ambienceCache.get(this.ambienceCurrent) : null;

    // Create and prepare new audio
    const newAudio = new Audio(config.src);
    newAudio.volume = 0; // Start silent for fade-in
    newAudio.loop = config.loop;
    this.ambienceCache.set(id, newAudio);

    const targetVolume = this.calculateAmbienceVolume(config.baseVolume);
    const fadeDuration = 500; // 500ms fade
    const fadeSteps = 10;
    const fadeStepDuration = fadeDuration / fadeSteps;
    const volumeStep = targetVolume / fadeSteps;
    let currentStep = 0;

    // Start playing the new audio
    void newAudio.play().catch(() => {
      // Fail silently
    });

    // Crossfade
    this.fadeInterval = setInterval(() => {
      currentStep++;

      // Fade in new audio
      newAudio.volume = Math.min(targetVolume, volumeStep * currentStep);

      // Fade out old audio
      if (oldAudio) {
        const oldVolume = Math.max(0, oldAudio.volume - volumeStep);
        oldAudio.volume = oldVolume;
      }

      // Complete fade
      if (currentStep >= fadeSteps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }

        // Stop and clean up old audio
        if (oldAudio && this.ambienceCurrent) {
          oldAudio.pause();
          oldAudio.currentTime = 0;
          // Remove from cache to free memory
          this.ambienceCache.delete(this.ambienceCurrent);
        }
      }
    }, fadeStepDuration);

    this.ambienceCurrent = id;
  }

  /**
   * Stop any currently playing ambience.
   * P6-AUDIO-ROOM: Stop ambience.
   */
  stopAmbience(): void {
    if (!isAudioEnvironment()) return;

    // Stop any ongoing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (!this.ambienceCurrent) return;

    const current = this.ambienceCache.get(this.ambienceCurrent);
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
    this.ambienceCurrent = null;
  }

  /**
   * Get current ambience state.
   * P6-AUDIO-ROOM: Check if ambience is playing.
   */
  isAmbiencePlaying(): boolean {
    return this.ambienceCurrent !== null;
  }

  /**
   * Get the currently playing ambience track ID.
   * P6-AUDIO-ROOM: For debugging and state inspection.
   */
  getCurrentAmbienceTrack(): AmbienceTrackId | null {
    return this.ambienceCurrent;
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

// ============================================
// P6-AUDIO-ROOM: AMBIENCE CONVENIENCE HELPERS
// ============================================

/**
 * Start room ambience for the given room.
 * P6-AUDIO-ROOM: Room-specific ambience.
 */
export function startRoomAmbience(room: RoomId): void {
  audioManager.playAmbienceForRoom(room);
}

/**
 * Stop any playing ambience.
 * P6-AUDIO-ROOM: Stop ambience.
 */
export function stopRoomAmbience(): void {
  audioManager.stopAmbience();
}

/**
 * Update the time-of-day for ambience volume adjustment.
 * P6-AUDIO-TOD: Time-based volume changes.
 */
export function updateTimeOfDay(timeOfDay: TimeOfDay): void {
  audioManager.setTimeOfDay(timeOfDay);
}

/**
 * Enable or disable ambience playback.
 * P6-AUDIO-ROOM: Ambience toggle control.
 */
export function setAmbienceEnabled(enabled: boolean): void {
  audioManager.setAmbienceEnabled(enabled);
}
