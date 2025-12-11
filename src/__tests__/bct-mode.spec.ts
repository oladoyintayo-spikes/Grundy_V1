// ============================================
// BCT-MODE: Cozy vs Classic Mode Tests
// Bible §9.1-9.4, P6-FTUE-MODES
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MODE_CONFIG,
  isCozyMode,
  isClassicMode,
  getModeConfig,
  type GameMode,
} from '../constants/bible.constants';
import { decayMood, getMoodChangeFromReaction, updateMoodValue } from '../game/systems';
import { useGameStore } from '../game/store';
import { MODE_DESCRIPTIONS } from '../copy/ftue';

describe('BCT-MODE: Mode Configuration (P6-FTUE-MODES)', () => {
  // BCT-MODE-001: Mode config values
  describe('BCT-MODE-001: Mode config values', () => {
    it('Cozy mode has slower mood decay multiplier than Classic', () => {
      expect(MODE_CONFIG.cozy.moodDecayMultiplier).toBeLessThan(
        MODE_CONFIG.classic.moodDecayMultiplier
      );
    });

    it('Cozy mode has moodDecayMultiplier of 0.5', () => {
      expect(MODE_CONFIG.cozy.moodDecayMultiplier).toBe(0.5);
    });

    it('Classic mode has moodDecayMultiplier of 1.0 (baseline)', () => {
      expect(MODE_CONFIG.classic.moodDecayMultiplier).toBe(1.0);
    });
  });

  // BCT-MODE-002: Neglect system disabled in Cozy
  describe('BCT-MODE-002: Neglect disabled in Cozy', () => {
    it('Cozy mode has neglectEnabled = false', () => {
      expect(MODE_CONFIG.cozy.neglectEnabled).toBe(false);
    });

    it('Classic mode has neglectEnabled = true', () => {
      expect(MODE_CONFIG.classic.neglectEnabled).toBe(true);
    });
  });

  // BCT-MODE-003: Sickness system disabled in Cozy
  describe('BCT-MODE-003: Sickness disabled in Cozy', () => {
    it('Cozy mode has sicknessEnabled = false', () => {
      expect(MODE_CONFIG.cozy.sicknessEnabled).toBe(false);
    });

    it('Classic mode has sicknessEnabled = true', () => {
      expect(MODE_CONFIG.classic.sicknessEnabled).toBe(true);
    });
  });

  // BCT-MODE-004: Penalty severity differs by mode
  describe('BCT-MODE-004: Penalty severity multiplier', () => {
    it('Cozy mode has reduced penalty severity', () => {
      expect(MODE_CONFIG.cozy.penaltySeverityMultiplier).toBeLessThan(1.0);
    });

    it('Cozy mode penalty severity is 0.5 (half of Classic)', () => {
      expect(MODE_CONFIG.cozy.penaltySeverityMultiplier).toBe(0.5);
    });

    it('Classic mode has full penalty severity (1.0)', () => {
      expect(MODE_CONFIG.classic.penaltySeverityMultiplier).toBe(1.0);
    });
  });

  // BCT-MODE-005: Helper functions
  describe('BCT-MODE-005: Mode helper functions', () => {
    it('isCozyMode returns true for cozy', () => {
      expect(isCozyMode('cozy')).toBe(true);
    });

    it('isCozyMode returns false for classic', () => {
      expect(isCozyMode('classic')).toBe(false);
    });

    it('isClassicMode returns true for classic', () => {
      expect(isClassicMode('classic')).toBe(true);
    });

    it('isClassicMode returns false for cozy', () => {
      expect(isClassicMode('cozy')).toBe(false);
    });

    it('getModeConfig returns correct config for cozy', () => {
      const config = getModeConfig('cozy');
      expect(config.id).toBe('cozy');
      expect(config.neglectEnabled).toBe(false);
    });

    it('getModeConfig returns correct config for classic', () => {
      const config = getModeConfig('classic');
      expect(config.id).toBe('classic');
      expect(config.neglectEnabled).toBe(true);
    });
  });
});

describe('BCT-MODE: Mood Decay Integration (P6-FTUE-MODES)', () => {
  const testMood = 80;
  const testMinutes = 10;

  // BCT-MODE-006: Decay is slower in Cozy mode
  describe('BCT-MODE-006: Decay rate differences', () => {
    it('Cozy mode mood decay is slower than Classic', () => {
      const cozyResult = decayMood(testMood, testMinutes, undefined, 'cozy');
      const classicResult = decayMood(testMood, testMinutes, undefined, 'classic');

      // Cozy should retain more mood (less decay)
      expect(cozyResult).toBeGreaterThan(classicResult);
    });

    it('Cozy mode decays at 50% of Classic rate', () => {
      const cozyResult = decayMood(testMood, testMinutes, undefined, 'cozy');
      const classicResult = decayMood(testMood, testMinutes, undefined, 'classic');

      const cozyDecay = testMood - cozyResult;
      const classicDecay = testMood - classicResult;

      // Cozy decay should be 50% of Classic decay
      expect(cozyDecay).toBeCloseTo(classicDecay * 0.5, 5);
    });

    it('No mode parameter uses baseline decay (no mode multiplier)', () => {
      const noModeResult = decayMood(testMood, testMinutes);
      const classicResult = decayMood(testMood, testMinutes, undefined, 'classic');

      // Without mode, should be same as classic (multiplier 1.0)
      expect(noModeResult).toBeCloseTo(classicResult, 5);
    });
  });
});

describe('BCT-MODE: Penalty Severity Integration (P6-FTUE-MODES)', () => {
  // BCT-MODE-007: Negative food reaction penalty differences
  describe('BCT-MODE-007: Negative reaction penalties', () => {
    it('Cozy mode has gentler dislike penalty than Classic', () => {
      const cozyChange = getMoodChangeFromReaction('negative', undefined, 'cozy');
      const classicChange = getMoodChangeFromReaction('negative', undefined, 'classic');

      // Both are negative, but cozy should be less severe (closer to 0)
      expect(cozyChange).toBeGreaterThan(classicChange);
    });

    it('Cozy mode dislike penalty is 50% of Classic', () => {
      const cozyChange = getMoodChangeFromReaction('negative', undefined, 'cozy');
      const classicChange = getMoodChangeFromReaction('negative', undefined, 'classic');

      // Cozy penalty should be half of Classic penalty
      expect(cozyChange).toBeCloseTo(classicChange * 0.5, 5);
    });

    it('Positive reactions are not affected by mode', () => {
      const cozyChange = getMoodChangeFromReaction('positive', undefined, 'cozy');
      const classicChange = getMoodChangeFromReaction('positive', undefined, 'classic');

      // Positive reactions should be the same in both modes
      expect(cozyChange).toBe(classicChange);
    });

    it('Ecstatic reactions are not affected by mode', () => {
      const cozyChange = getMoodChangeFromReaction('ecstatic', undefined, 'cozy');
      const classicChange = getMoodChangeFromReaction('ecstatic', undefined, 'classic');

      expect(cozyChange).toBe(classicChange);
    });

    it('Neutral reactions are not affected by mode', () => {
      const cozyChange = getMoodChangeFromReaction('neutral', undefined, 'cozy');
      const classicChange = getMoodChangeFromReaction('neutral', undefined, 'classic');

      expect(cozyChange).toBe(classicChange);
    });
  });

  // BCT-MODE-008: updateMoodValue respects mode
  describe('BCT-MODE-008: updateMoodValue mode integration', () => {
    it('updateMoodValue applies mode penalty for negative reactions', () => {
      const startMood = 70;
      const cozyResult = updateMoodValue(startMood, 'negative', undefined, 'cozy');
      const classicResult = updateMoodValue(startMood, 'negative', undefined, 'classic');

      // Cozy should have higher resulting mood (less penalty)
      expect(cozyResult).toBeGreaterThan(classicResult);
    });
  });
});

describe('BCT-MODE: Store Integration (P6-FTUE-MODES)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  // BCT-MODE-009: Store defaults to Cozy mode
  describe('BCT-MODE-009: Store mode persistence', () => {
    it('Store defaults to cozy mode', () => {
      const state = useGameStore.getState();
      expect(state.playMode).toBe('cozy');
    });

    it('selectPlayMode changes mode', () => {
      const store = useGameStore.getState();
      store.selectPlayMode('classic');

      expect(useGameStore.getState().playMode).toBe('classic');
    });

    it('selectPlayMode can switch back to cozy', () => {
      const store = useGameStore.getState();
      store.selectPlayMode('classic');
      store.selectPlayMode('cozy');

      expect(useGameStore.getState().playMode).toBe('cozy');
    });
  });

  // BCT-MODE-010: FTUE mode selection
  describe('BCT-MODE-010: FTUE mode selection', () => {
    it('FTUE mode selection updates both ftue.selectedMode and playMode', () => {
      const store = useGameStore.getState();
      store.selectPlayMode('classic');

      const state = useGameStore.getState();
      expect(state.ftue.selectedMode).toBe('classic');
      expect(state.playMode).toBe('classic');
    });
  });
});

describe('BCT-MODE: FTUE Copy Accuracy (P6-FTUE-MODES)', () => {
  // BCT-MODE-011: Mode descriptions match config
  describe('BCT-MODE-011: FTUE mode descriptions', () => {
    it('Cozy mode description exists', () => {
      const cozyDesc = MODE_DESCRIPTIONS.find((m) => m.id === 'cozy');
      expect(cozyDesc).toBeDefined();
    });

    it('Classic mode description exists', () => {
      const classicDesc = MODE_DESCRIPTIONS.find((m) => m.id === 'classic');
      expect(classicDesc).toBeDefined();
    });

    it('Cozy mode features mention slower decay', () => {
      const cozyDesc = MODE_DESCRIPTIONS.find((m) => m.id === 'cozy');
      const hasDecayFeature = cozyDesc?.features.some(
        (f) => f.toLowerCase().includes('decay') || f.toLowerCase().includes('slower')
      );
      expect(hasDecayFeature).toBe(true);
    });

    it('Cozy mode features mention no neglect', () => {
      const cozyDesc = MODE_DESCRIPTIONS.find((m) => m.id === 'cozy');
      const hasNeglectFeature = cozyDesc?.features.some(
        (f) => f.toLowerCase().includes('neglect') || f.toLowerCase().includes('no neglect')
      );
      expect(hasNeglectFeature).toBe(true);
    });

    it('Classic mode features mention neglect', () => {
      const classicDesc = MODE_DESCRIPTIONS.find((m) => m.id === 'classic');
      const hasNeglectFeature = classicDesc?.features.some((f) =>
        f.toLowerCase().includes('neglect')
      );
      expect(hasNeglectFeature).toBe(true);
    });
  });
});

describe('BCT-MODE: Feature Flags (P6-FTUE-MODES)', () => {
  // BCT-MODE-012: Care mistakes flag
  describe('BCT-MODE-012: Care mistakes flag', () => {
    it('Cozy mode has careMistakesEnabled = false', () => {
      expect(MODE_CONFIG.cozy.careMistakesEnabled).toBe(false);
    });

    it('Classic mode has careMistakesEnabled = true', () => {
      expect(MODE_CONFIG.classic.careMistakesEnabled).toBe(true);
    });
  });

  // BCT-MODE-013: Welcome Back bonus flag
  describe('BCT-MODE-013: Welcome Back bonus flag', () => {
    it('Cozy mode has welcomeBackBonusEnabled = true', () => {
      expect(MODE_CONFIG.cozy.welcomeBackBonusEnabled).toBe(true);
    });

    it('Classic mode has welcomeBackBonusEnabled = false', () => {
      expect(MODE_CONFIG.classic.welcomeBackBonusEnabled).toBe(false);
    });
  });
});
