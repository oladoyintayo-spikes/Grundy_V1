// ============================================
// GRUNDY — AUDIO CONFIG TESTS
// Tests for audio system configuration and types
// P5-AUDIO-CORE, P6-AUDIO-ROOM, P6-AUDIO-TOD
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SOUND_CONFIG,
  MUSIC_CONFIG,
  AMBIENCE_CONFIG,
  ROOM_AMBIENCE_MAP,
  TIME_OF_DAY_VOLUME_MULTIPLIERS,
  AMBIENCE_AUDIO_PATHS,
  getAllSoundIds,
  getAllMusicTrackIds,
  getAllAmbienceTrackIds,
  getAllAmbienceAudioPaths,
} from '../audio/config';
import {
  audioManager,
  playUiTap,
  playUiConfirm,
  playUiBack,
  playPetHappy,
  playLevelUp,
  playMiniGameResult,
  startBackgroundMusic,
  stopBackgroundMusic,
} from '../audio/audioManager';
import { useGameStore } from '../game/store';
import type { SoundId, AmbienceTrackId } from '../audio/types';

describe('Audio Configuration', () => {
  describe('SOUND_CONFIG', () => {
    it('has all expected sound IDs', () => {
      const expectedIds: SoundId[] = [
        'ui_tap',
        'ui_confirm',
        'ui_back',
        'mini_bronze',
        'mini_silver',
        'mini_gold',
        'mini_rainbow',
        'pet_happy',
        'pet_level_up',
      ];

      expectedIds.forEach((id) => {
        expect(SOUND_CONFIG).toHaveProperty(id);
      });
    });

    it('all sounds have valid configuration', () => {
      getAllSoundIds().forEach((id) => {
        const config = SOUND_CONFIG[id];

        // Has id that matches key
        expect(config.id).toBe(id);

        // Has valid src path
        expect(config.src).toBeTruthy();
        expect(typeof config.src).toBe('string');
        expect(config.src).toMatch(/^\/audio\/.+\.mp3$/);

        // Has volume between 0 and 1
        expect(config.volume).toBeGreaterThanOrEqual(0);
        expect(config.volume).toBeLessThanOrEqual(1);
      });
    });

    it('getAllSoundIds returns all config keys', () => {
      const ids = getAllSoundIds();
      const configKeys = Object.keys(SOUND_CONFIG);

      expect(ids.length).toBe(configKeys.length);
      ids.forEach((id) => {
        expect(configKeys).toContain(id);
      });
    });
  });

  describe('MUSIC_CONFIG', () => {
    it('has bg_main track', () => {
      expect(MUSIC_CONFIG).toHaveProperty('bg_main');
    });

    it('all music tracks have valid configuration', () => {
      getAllMusicTrackIds().forEach((id) => {
        const config = MUSIC_CONFIG[id];

        // Has id that matches key
        expect(config.id).toBe(id);

        // Has valid src path
        expect(config.src).toBeTruthy();
        expect(typeof config.src).toBe('string');
        expect(config.src).toMatch(/^\/audio\/.+\.mp3$/);

        // Has volume between 0 and 1
        expect(config.volume).toBeGreaterThanOrEqual(0);
        expect(config.volume).toBeLessThanOrEqual(1);

        // Has loop property
        expect(typeof config.loop).toBe('boolean');
      });
    });

    it('bg_main track is configured to loop', () => {
      expect(MUSIC_CONFIG.bg_main.loop).toBe(true);
    });

    it('getAllMusicTrackIds returns all config keys', () => {
      const ids = getAllMusicTrackIds();
      const configKeys = Object.keys(MUSIC_CONFIG);

      expect(ids.length).toBe(configKeys.length);
      ids.forEach((id) => {
        expect(configKeys).toContain(id);
      });
    });
  });

  // ============================================
  // P6-AUDIO-ROOM: Ambience Configuration Tests
  // ============================================

  describe('AMBIENCE_CONFIG', () => {
    it('has all expected room ambience track IDs', () => {
      const expectedIds: AmbienceTrackId[] = [
        'ambience_living_room',
        'ambience_kitchen',
        'ambience_bedroom',
        'ambience_playroom',
        'ambience_yard',
      ];

      expectedIds.forEach((id) => {
        expect(AMBIENCE_CONFIG).toHaveProperty(id);
      });
    });

    it('has exactly 5 ambience tracks (one per room)', () => {
      expect(Object.keys(AMBIENCE_CONFIG).length).toBe(5);
    });

    it('all ambience tracks have valid configuration', () => {
      getAllAmbienceTrackIds().forEach((id) => {
        const config = AMBIENCE_CONFIG[id];

        // Has id that matches key
        expect(config.id).toBe(id);

        // Has valid src path with correct naming convention
        expect(config.src).toBeTruthy();
        expect(typeof config.src).toBe('string');
        expect(config.src).toMatch(/^\/audio\/.+_ambience\.mp3$/);

        // Has baseVolume between 0 and 1
        expect(config.baseVolume).toBeGreaterThanOrEqual(0);
        expect(config.baseVolume).toBeLessThanOrEqual(1);

        // Has loop property set to true
        expect(config.loop).toBe(true);
      });
    });

    it('getAllAmbienceTrackIds returns all config keys', () => {
      const ids = getAllAmbienceTrackIds();
      const configKeys = Object.keys(AMBIENCE_CONFIG);

      expect(ids.length).toBe(configKeys.length);
      ids.forEach((id) => {
        expect(configKeys).toContain(id);
      });
    });
  });

  describe('getAllAmbienceAudioPaths', () => {
    it('returns array of 5 audio paths', () => {
      const paths = getAllAmbienceAudioPaths();
      expect(paths.length).toBe(5);
    });

    it('returns paths matching the expected file naming convention', () => {
      const paths = getAllAmbienceAudioPaths();
      paths.forEach((path) => {
        expect(path).toMatch(/^\/audio\/.+_ambience\.mp3$/);
      });
    });

    it('includes all expected room ambience files', () => {
      const paths = getAllAmbienceAudioPaths();
      expect(paths).toContain('/audio/living_room_ambience.mp3');
      expect(paths).toContain('/audio/kitchen_ambience.mp3');
      expect(paths).toContain('/audio/bedroom_ambience.mp3');
      expect(paths).toContain('/audio/playroom_ambience.mp3');
      expect(paths).toContain('/audio/yard_ambience.mp3');
    });
  });

  describe('AMBIENCE_AUDIO_PATHS constant', () => {
    it('has all 5 room paths', () => {
      expect(AMBIENCE_AUDIO_PATHS.LIVING_ROOM).toBe('/audio/living_room_ambience.mp3');
      expect(AMBIENCE_AUDIO_PATHS.KITCHEN).toBe('/audio/kitchen_ambience.mp3');
      expect(AMBIENCE_AUDIO_PATHS.BEDROOM).toBe('/audio/bedroom_ambience.mp3');
      expect(AMBIENCE_AUDIO_PATHS.PLAYROOM).toBe('/audio/playroom_ambience.mp3');
      expect(AMBIENCE_AUDIO_PATHS.YARD).toBe('/audio/yard_ambience.mp3');
    });

    it('matches paths in getAllAmbienceAudioPaths', () => {
      const helperPaths = getAllAmbienceAudioPaths();
      const constantPaths = Object.values(AMBIENCE_AUDIO_PATHS);

      constantPaths.forEach((path) => {
        expect(helperPaths).toContain(path);
      });
    });
  });

  describe('ROOM_AMBIENCE_MAP', () => {
    it('maps all 5 rooms to their ambience tracks', () => {
      expect(ROOM_AMBIENCE_MAP.living_room).toBe('ambience_living_room');
      expect(ROOM_AMBIENCE_MAP.kitchen).toBe('ambience_kitchen');
      expect(ROOM_AMBIENCE_MAP.bedroom).toBe('ambience_bedroom');
      expect(ROOM_AMBIENCE_MAP.playroom).toBe('ambience_playroom');
      expect(ROOM_AMBIENCE_MAP.yard).toBe('ambience_yard');
    });

    it('all mapped tracks exist in AMBIENCE_CONFIG', () => {
      Object.values(ROOM_AMBIENCE_MAP).forEach((trackId) => {
        expect(AMBIENCE_CONFIG).toHaveProperty(trackId);
      });
    });
  });

  describe('TIME_OF_DAY_VOLUME_MULTIPLIERS', () => {
    it('has multipliers for all 4 time periods', () => {
      expect(TIME_OF_DAY_VOLUME_MULTIPLIERS).toHaveProperty('morning');
      expect(TIME_OF_DAY_VOLUME_MULTIPLIERS).toHaveProperty('day');
      expect(TIME_OF_DAY_VOLUME_MULTIPLIERS).toHaveProperty('evening');
      expect(TIME_OF_DAY_VOLUME_MULTIPLIERS).toHaveProperty('night');
    });

    it('all multipliers are between 0 and 1', () => {
      Object.values(TIME_OF_DAY_VOLUME_MULTIPLIERS).forEach((multiplier) => {
        expect(multiplier).toBeGreaterThan(0);
        expect(multiplier).toBeLessThanOrEqual(1);
      });
    });

    it('day period has full volume (1.0)', () => {
      expect(TIME_OF_DAY_VOLUME_MULTIPLIERS.day).toBe(1.0);
    });

    it('night period has lowest volume', () => {
      const { morning, day, evening, night } = TIME_OF_DAY_VOLUME_MULTIPLIERS;
      expect(night).toBeLessThan(morning);
      expect(night).toBeLessThan(day);
      expect(night).toBeLessThan(evening);
    });
  });

  describe('Sound IDs Type Coverage', () => {
    it('SOUND_CONFIG has exactly 9 sound effects', () => {
      expect(Object.keys(SOUND_CONFIG).length).toBe(9);
    });

    it('UI sounds are present', () => {
      expect(SOUND_CONFIG.ui_tap).toBeDefined();
      expect(SOUND_CONFIG.ui_confirm).toBeDefined();
      expect(SOUND_CONFIG.ui_back).toBeDefined();
    });

    it('mini-game tier sounds are present', () => {
      expect(SOUND_CONFIG.mini_bronze).toBeDefined();
      expect(SOUND_CONFIG.mini_silver).toBeDefined();
      expect(SOUND_CONFIG.mini_gold).toBeDefined();
      expect(SOUND_CONFIG.mini_rainbow).toBeDefined();
    });

    it('pet sounds are present', () => {
      expect(SOUND_CONFIG.pet_happy).toBeDefined();
      expect(SOUND_CONFIG.pet_level_up).toBeDefined();
    });
  });

  describe('Volume Ranges', () => {
    it('UI sounds have appropriate volumes (0.4-0.5)', () => {
      expect(SOUND_CONFIG.ui_tap.volume).toBeGreaterThanOrEqual(0.3);
      expect(SOUND_CONFIG.ui_tap.volume).toBeLessThanOrEqual(0.6);

      expect(SOUND_CONFIG.ui_confirm.volume).toBeGreaterThanOrEqual(0.4);
      expect(SOUND_CONFIG.ui_confirm.volume).toBeLessThanOrEqual(0.6);
    });

    it('mini-game result sounds have increasing volumes by tier', () => {
      const bronzeVol = SOUND_CONFIG.mini_bronze.volume;
      const silverVol = SOUND_CONFIG.mini_silver.volume;
      const goldVol = SOUND_CONFIG.mini_gold.volume;
      const rainbowVol = SOUND_CONFIG.mini_rainbow.volume;

      expect(silverVol).toBeGreaterThanOrEqual(bronzeVol);
      expect(goldVol).toBeGreaterThanOrEqual(silverVol);
      expect(rainbowVol).toBeGreaterThanOrEqual(goldVol);
    });

    it('background music has lower volume than SFX', () => {
      const bgVolume = MUSIC_CONFIG.bg_main.volume;
      const avgSfxVolume =
        Object.values(SOUND_CONFIG).reduce(
          (sum, config) => sum + config.volume,
          0
        ) / Object.keys(SOUND_CONFIG).length;

      expect(bgVolume).toBeLessThan(avgSfxVolume);
    });
  });
});

describe('Audio Store Integration', () => {
  // These tests use a fresh store for each test
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.setState({
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        autoSave: true,
      },
    });
  });

  it('store has soundEnabled setting', () => {
    const state = useGameStore.getState();
    expect(state.settings).toHaveProperty('soundEnabled');
    expect(typeof state.settings.soundEnabled).toBe('boolean');
  });

  it('store has musicEnabled setting', () => {
    const state = useGameStore.getState();
    expect(state.settings).toHaveProperty('musicEnabled');
    expect(typeof state.settings.musicEnabled).toBe('boolean');
  });

  it('store has setSoundEnabled action', () => {
    const state = useGameStore.getState();
    expect(typeof state.setSoundEnabled).toBe('function');
  });

  it('store has setMusicEnabled action', () => {
    const state = useGameStore.getState();
    expect(typeof state.setMusicEnabled).toBe('function');
  });

  it('setSoundEnabled updates state', () => {
    // Start enabled
    useGameStore.setState({
      settings: { soundEnabled: true, musicEnabled: true, autoSave: true },
    });

    // Disable
    useGameStore.getState().setSoundEnabled(false);
    expect(useGameStore.getState().settings.soundEnabled).toBe(false);

    // Re-enable
    useGameStore.getState().setSoundEnabled(true);
    expect(useGameStore.getState().settings.soundEnabled).toBe(true);
  });

  it('setMusicEnabled updates state', () => {
    // Start enabled
    useGameStore.setState({
      settings: { soundEnabled: true, musicEnabled: true, autoSave: true },
    });

    // Disable
    useGameStore.getState().setMusicEnabled(false);
    expect(useGameStore.getState().settings.musicEnabled).toBe(false);

    // Re-enable
    useGameStore.getState().setMusicEnabled(true);
    expect(useGameStore.getState().settings.musicEnabled).toBe(true);
  });

  it('default settings have sound and music enabled', () => {
    useGameStore.getState().resetGame();

    const state = useGameStore.getState();
    expect(state.settings.soundEnabled).toBe(true);
    expect(state.settings.musicEnabled).toBe(true);
  });
});

describe('Audio Manager Helpers', () => {
  it('exports playUiTap helper', () => {
    expect(typeof playUiTap).toBe('function');
  });

  it('exports playUiConfirm helper', () => {
    expect(typeof playUiConfirm).toBe('function');
  });

  it('exports playUiBack helper', () => {
    expect(typeof playUiBack).toBe('function');
  });

  it('exports playPetHappy helper', () => {
    expect(typeof playPetHappy).toBe('function');
  });

  it('exports playLevelUp helper', () => {
    expect(typeof playLevelUp).toBe('function');
  });

  it('exports playMiniGameResult helper', () => {
    expect(typeof playMiniGameResult).toBe('function');
  });

  it('exports startBackgroundMusic helper', () => {
    expect(typeof startBackgroundMusic).toBe('function');
  });

  it('exports stopBackgroundMusic helper', () => {
    expect(typeof stopBackgroundMusic).toBe('function');
  });

  it('audioManager can be disabled safely in test environment', () => {
    // Should not throw in test environment (no window/Audio)
    expect(() => audioManager.playSound('ui_tap')).not.toThrow();
    expect(() => audioManager.playMusic('bg_main')).not.toThrow();
    expect(() => audioManager.stopMusic()).not.toThrow();
    expect(() => audioManager.setSoundEnabled(false)).not.toThrow();
    expect(() => audioManager.setMusicEnabled(false)).not.toThrow();
  });
});
