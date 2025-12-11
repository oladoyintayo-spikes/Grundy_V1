/**
 * Bible Compliance Tests: Pet Behaviors (P6-T2-PET-BEHAVIORS)
 * Tests feeding animation, mood transitions, and pose system
 *
 * BCT-PET-BEHAVIOR-01: Feeding sets transient eating pose
 * BCT-PET-BEHAVIOR-02: Pose reflects mood value
 * BCT-PET-BEHAVIOR-03: Transient pose expires after duration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../game/store';
import { getDefaultPoseForState, getEatingPoseForReaction } from '../game/petVisuals';
import type { PetPose } from '../types';

describe('BCT-PET-BEHAVIOR: Pet Behaviors (P6-T2-PET-BEHAVIORS)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    // Add some food to inventory for testing
    useGameStore.getState().addFood('cookie', 10);
  });

  describe('BCT-PET-BEHAVIOR-01: Feeding sets transient eating pose', () => {
    it('getEatingPoseForReaction returns eating_loved for ecstatic reaction', () => {
      expect(getEatingPoseForReaction('ecstatic')).toBe('eating_loved');
    });

    it('getEatingPoseForReaction returns eating for other reactions', () => {
      expect(getEatingPoseForReaction('positive')).toBe('eating');
      expect(getEatingPoseForReaction('neutral')).toBe('eating');
      expect(getEatingPoseForReaction('negative')).toBe('eating');
    });

    it('successful feed sets transient pose on pet', () => {
      const result = useGameStore.getState().feed('cookie');

      expect(result?.success).toBe(true);

      const pet = useGameStore.getState().pet;
      expect(pet.transientPose).toBeDefined();
      // Pose should be eating or eating_loved depending on the reaction
      expect(['eating', 'eating_loved']).toContain(pet.transientPose?.pose);
      expect(pet.transientPose?.expiresAt).toBeGreaterThan(Date.now());
    });

    it('transient pose duration is ~2 seconds', () => {
      const beforeFeed = Date.now();
      useGameStore.getState().feed('cookie');
      const afterFeed = Date.now();

      const pet = useGameStore.getState().pet;
      const duration = pet.transientPose!.expiresAt - beforeFeed;

      // Should be ~2000ms (with some tolerance for execution time)
      expect(duration).toBeGreaterThanOrEqual(1900);
      expect(duration).toBeLessThanOrEqual(2100 + (afterFeed - beforeFeed));
    });
  });

  describe('BCT-PET-BEHAVIOR-02: Pose reflects mood value', () => {
    it('ecstatic mood (>=85) returns ecstatic pose', () => {
      const pose = getDefaultPoseForState({
        mood: 'ecstatic',
        moodValue: 90,
        hunger: 50,
      });
      expect(pose).toBe('ecstatic');
    });

    it('happy mood (>=60, hunger >50) returns happy pose', () => {
      const pose = getDefaultPoseForState({
        mood: 'happy',
        moodValue: 70,
        hunger: 60,
      });
      expect(pose).toBe('happy');
    });

    it('unhappy mood (<40) returns sad pose', () => {
      const pose = getDefaultPoseForState({
        mood: 'neutral',
        moodValue: 30,
        hunger: 50,
      });
      expect(pose).toBe('sad');
    });

    it('very unhappy mood (<10) returns crying pose', () => {
      const pose = getDefaultPoseForState({
        mood: 'sad',
        moodValue: 5,
        hunger: 50,
      });
      expect(pose).toBe('crying');
    });

    it('fullness overrides mood for hungry state', () => {
      const pose = getDefaultPoseForState({
        mood: 'happy',
        moodValue: 70,
        hunger: 10, // HUNGRY state
      });
      expect(pose).toBe('hungry');
    });

    it('fullness overrides mood for satisfied state', () => {
      const pose = getDefaultPoseForState({
        mood: 'neutral',
        moodValue: 50,
        hunger: 80, // SATISFIED state
      });
      expect(pose).toBe('satisfied');
    });
  });

  describe('BCT-PET-BEHAVIOR-03: Transient pose takes priority', () => {
    it('active transient pose overrides mood-based pose', () => {
      const futureTime = Date.now() + 5000; // 5 seconds in future
      const pose = getDefaultPoseForState({
        mood: 'happy',
        moodValue: 70,
        hunger: 50,
        transientPose: {
          pose: 'eating',
          expiresAt: futureTime,
        },
      });
      expect(pose).toBe('eating');
    });

    it('expired transient pose is ignored', () => {
      const pastTime = Date.now() - 1000; // 1 second in past
      const pose = getDefaultPoseForState({
        mood: 'happy',
        moodValue: 70,
        hunger: 60,
        transientPose: {
          pose: 'eating',
          expiresAt: pastTime,
        },
      });
      expect(pose).toBe('happy'); // Falls back to mood-based pose
    });
  });

  describe('BCT-PET-BEHAVIOR-04: Store transient pose actions', () => {
    it('setTransientPose sets pose with duration', () => {
      const store = useGameStore.getState();
      const beforeSet = Date.now();
      store.setTransientPose('excited', 3000);
      const afterSet = Date.now();

      const pet = useGameStore.getState().pet;
      expect(pet.transientPose?.pose).toBe('excited');

      const expectedExpiry = beforeSet + 3000;
      expect(pet.transientPose?.expiresAt).toBeGreaterThanOrEqual(expectedExpiry);
      expect(pet.transientPose?.expiresAt).toBeLessThanOrEqual(afterSet + 3000);
    });

    it('clearTransientPose removes transient pose', () => {
      const store = useGameStore.getState();
      store.setTransientPose('eating', 2000);
      expect(useGameStore.getState().pet.transientPose).toBeDefined();

      store.clearTransientPose();
      expect(useGameStore.getState().pet.transientPose).toBeUndefined();
    });
  });

  describe('BCT-PET-BEHAVIOR-05: Feeding updates mood value', () => {
    it('feeding with positive reaction increases moodValue', () => {
      const store = useGameStore.getState();
      store.setMoodValue(50);

      const beforeMood = useGameStore.getState().pet.moodValue;
      store.feed('cookie'); // Cookie gives positive/neutral reaction
      const afterMood = useGameStore.getState().pet.moodValue;

      // Mood should increase (neutral food gives +3, positive gives +8, etc.)
      expect(afterMood).toBeGreaterThanOrEqual(beforeMood);
    });

    it('feeding syncs mood state string with moodValue', () => {
      const store = useGameStore.getState();
      store.setMoodValue(82); // Just below ecstatic threshold

      store.feed('cookie');

      const pet = useGameStore.getState().pet;
      // After feeding, mood state should match the new moodValue
      if (pet.moodValue >= 85) {
        expect(pet.mood).toBe('ecstatic');
      } else if (pet.moodValue >= 60) {
        expect(pet.mood).toBe('happy');
      }
    });
  });
});
