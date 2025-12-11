/**
 * Bible Compliance Tests: Mood System (P6-MOOD-SYSTEM)
 * Tests mood tiers, decay, and ability effects per Bible §4.5
 *
 * BCT-MOOD-01: Mood tiers match Bible §4.5
 * BCT-MOOD-02: Mood changes from feeding reactions
 * BCT-MOOD-03: Grib ability reduces mood penalty from dislikes
 * BCT-MOOD-04: Plompo ability reduces mood decay rate
 * BCT-MOOD-05: Mood value syncs with mood state string
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  getMoodTier,
  moodValueToState,
  moodStateToValue,
  MOOD_TIERS,
  MOOD_MODIFIERS,
} from '../constants/bible.constants';
import {
  decayMood,
  updateMoodValue,
  syncMoodState,
  getMoodChangeFromReaction,
  getMoodXPMultiplier,
  isHappyMood,
} from '../game/systems';

describe('BCT-MOOD: Mood System (P6-MOOD-SYSTEM)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('BCT-MOOD-01: Mood tiers match Bible §4.5', () => {
    it('ECSTATIC tier is 85-100 range', () => {
      expect(MOOD_TIERS.ECSTATIC.min).toBe(85);
      expect(MOOD_TIERS.ECSTATIC.max).toBe(100);
    });

    it('HAPPY tier is 60-84 range', () => {
      expect(MOOD_TIERS.HAPPY.min).toBe(60);
      expect(MOOD_TIERS.HAPPY.max).toBe(84);
    });

    it('CONTENT tier is 40-59 range', () => {
      expect(MOOD_TIERS.CONTENT.min).toBe(40);
      expect(MOOD_TIERS.CONTENT.max).toBe(59);
    });

    it('LOW tier is 20-39 range', () => {
      expect(MOOD_TIERS.LOW.min).toBe(20);
      expect(MOOD_TIERS.LOW.max).toBe(39);
    });

    it('UNHAPPY tier is 0-19 range', () => {
      expect(MOOD_TIERS.UNHAPPY.min).toBe(0);
      expect(MOOD_TIERS.UNHAPPY.max).toBe(19);
    });

    it('getMoodTier returns correct tier for boundary values', () => {
      expect(getMoodTier(100)).toBe('ECSTATIC');
      expect(getMoodTier(85)).toBe('ECSTATIC');
      expect(getMoodTier(84)).toBe('HAPPY');
      expect(getMoodTier(60)).toBe('HAPPY');
      expect(getMoodTier(59)).toBe('CONTENT');
      expect(getMoodTier(40)).toBe('CONTENT');
      expect(getMoodTier(39)).toBe('LOW');
      expect(getMoodTier(20)).toBe('LOW');
      expect(getMoodTier(19)).toBe('UNHAPPY');
      expect(getMoodTier(0)).toBe('UNHAPPY');
    });
  });

  describe('BCT-MOOD-02: Mood changes from feeding reactions', () => {
    it('loved food (ecstatic reaction) boosts mood by 15', () => {
      const change = getMoodChangeFromReaction('ecstatic');
      expect(change).toBe(MOOD_MODIFIERS.LOVED_FOOD_MOOD_BOOST);
      expect(change).toBe(15);
    });

    it('liked food (positive reaction) boosts mood by 8', () => {
      const change = getMoodChangeFromReaction('positive');
      expect(change).toBe(MOOD_MODIFIERS.LIKED_FOOD_MOOD_BOOST);
      expect(change).toBe(8);
    });

    it('neutral food changes mood by 3', () => {
      const change = getMoodChangeFromReaction('neutral');
      expect(change).toBe(MOOD_MODIFIERS.NEUTRAL_FOOD_MOOD_CHANGE);
      expect(change).toBe(3);
    });

    it('disliked food (negative reaction) reduces mood by 10', () => {
      const change = getMoodChangeFromReaction('negative');
      expect(change).toBe(MOOD_MODIFIERS.DISLIKED_FOOD_MOOD_PENALTY);
      expect(change).toBe(-10);
    });

    it('updateMoodValue clamps to 0-100 range', () => {
      // Test upper bound
      expect(updateMoodValue(95, 'ecstatic')).toBe(100);
      // Test lower bound
      expect(updateMoodValue(5, 'negative')).toBe(0);
    });
  });

  describe('BCT-MOOD-03: Grib ability reduces mood penalty from dislikes', () => {
    it('Grib gets -20% mood penalty from negative reactions', () => {
      // Grib (id: 'grib') should have mood_penalty_reduction ability
      const gribPenalty = getMoodChangeFromReaction('negative', 'grib');
      const normalPenalty = getMoodChangeFromReaction('negative', 'munchlet');

      // Grib should have 20% less penalty (-10 * 0.8 = -8)
      expect(gribPenalty).toBe(-8);
      expect(normalPenalty).toBe(-10);
    });
  });

  describe('BCT-MOOD-04: Plompo ability reduces mood decay rate', () => {
    it('Plompo gets -20% mood decay rate', () => {
      const baseMood = 50;
      const minutes = 10;

      // Normal decay
      const normalDecay = decayMood(baseMood, minutes, 'munchlet');
      // Plompo decay (20% slower)
      const plompoDecay = decayMood(baseMood, minutes, 'plompo');

      // Calculate expected values
      const expectedNormal = baseMood - (minutes * MOOD_MODIFIERS.DECAY_PER_MINUTE);
      const expectedPlompo = baseMood - (minutes * MOOD_MODIFIERS.DECAY_PER_MINUTE * 0.8);

      expect(normalDecay).toBeCloseTo(expectedNormal);
      expect(plompoDecay).toBeCloseTo(expectedPlompo);
      expect(plompoDecay).toBeGreaterThan(normalDecay);
    });
  });

  describe('BCT-MOOD-05: Mood value syncs with mood state string', () => {
    it('moodValueToState returns correct string for each tier', () => {
      expect(moodValueToState(90)).toBe('ecstatic');
      expect(moodValueToState(70)).toBe('happy');
      expect(moodValueToState(50)).toBe('neutral');
      expect(moodValueToState(30)).toBe('neutral'); // LOW tier also maps to neutral
      expect(moodValueToState(10)).toBe('sad');
    });

    it('moodStateToValue returns approximate numeric value', () => {
      expect(moodStateToValue('ecstatic')).toBe(90);
      expect(moodStateToValue('happy')).toBe(70);
      expect(moodStateToValue('neutral')).toBe(50);
      expect(moodStateToValue('sad')).toBe(15);
    });

    it('syncMoodState is consistent with moodValueToState', () => {
      expect(syncMoodState(90)).toBe(moodValueToState(90));
      expect(syncMoodState(50)).toBe(moodValueToState(50));
      expect(syncMoodState(10)).toBe(moodValueToState(10));
    });
  });

  describe('BCT-MOOD-06: Happy mood XP bonus', () => {
    it('feeding while happy (mood >= 60) gives +10% XP per Bible §4.5', () => {
      expect(isHappyMood(60)).toBe(true);
      expect(isHappyMood(59)).toBe(false);

      expect(getMoodXPMultiplier(70)).toBe(1.1);
      expect(getMoodXPMultiplier(50)).toBe(1.0);
    });
  });

  describe('BCT-MOOD-07: Store integration', () => {
    it('pet starts with moodValue of 50 (CONTENT tier)', () => {
      const pet = useGameStore.getState().pet;
      expect(pet.moodValue).toBe(50);
      expect(getMoodTier(pet.moodValue)).toBe('CONTENT');
    });

    it('tickMoodDecay reduces mood over time', () => {
      const store = useGameStore.getState();
      store.setMoodValue(70);

      const beforeMood = useGameStore.getState().pet.moodValue;
      useGameStore.getState().tickMoodDecay(10);
      const afterMood = useGameStore.getState().pet.moodValue;

      expect(afterMood).toBeLessThan(beforeMood);
    });

    it('setMoodValue updates both moodValue and mood state', () => {
      const store = useGameStore.getState();
      store.setMoodValue(90);

      const pet = useGameStore.getState().pet;
      expect(pet.moodValue).toBe(90);
      expect(pet.mood).toBe('ecstatic');
    });
  });
});
