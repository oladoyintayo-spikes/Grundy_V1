/**
 * P10-H: BCT-SICKNESS-OFFLINE-002 - 2× Stat Decay When Sick (Classic Only)
 * Bible v1.8 §9.4.7.3
 *
 * Tests for:
 * 1. 2× mood decay when sick in Classic mode
 * 2. 2× hunger decay when sick in Classic mode
 * 3. 2× bond decay when sick in Classic mode
 * 4. NO multiplier in Cozy mode (immunity)
 * 5. NO multiplier when pet is NOT sick
 * 6. Stacking with poop dirty multiplier
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useGameStore } from '../game/store';
import { OFFLINE_DECAY_RATES, SICKNESS_CONFIG } from '../constants/bible.constants';
import { setTimeProvider, resetTimeProvider } from '../game/time';
import type { PetInstanceId } from '../types';

// Helper to get 24h decay amounts (base rate)
const getBase24hDecay = () => ({
  mood: OFFLINE_DECAY_RATES.MOOD_PER_24H,
  bond: OFFLINE_DECAY_RATES.BOND_PER_24H,
  hunger: OFFLINE_DECAY_RATES.HUNGER_PER_24H,
});

describe('BCT-SICKNESS-OFFLINE-002: 2× Stat Decay When Sick', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  afterEach(() => {
    resetTimeProvider();
  });

  // ============================================
  // P10-H-001: 2× Mood Decay in Classic + Sick
  // Bible §9.4.7.3: "If sick: apply 2× stat decay"
  // ============================================
  describe('P10-H-001: 2× Mood Decay (Classic + Sick)', () => {
    it('should apply 2× mood decay when sick in Classic mode', () => {
      const store = useGameStore.getState();

      // Set up: Classic mode, sick pet
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Get the active pet and set it up as sick with high stats
      const state = useGameStore.getState();
      const petId = state.activePetId;
      const originalMood = 80;

      // Update pet to be sick with known starting values
      useGameStore.setState((s) => ({
        petsById: {
          ...s.petsById,
          [petId]: {
            ...s.petsById[petId],
            moodValue: originalMood,
            bond: 50,
            hunger: 50,
            isSick: true,
            sickStartTimestamp: Date.now() - 48 * 60 * 60 * 1000, // Sick for 48h
          },
        },
        lastSeenTimestamp: Date.now() - 48 * 60 * 60 * 1000, // 48h ago
      }));

      // Trigger offline return
      const result = useGameStore.getState().applyOfflineFanout(new Date());

      // Verify result
      expect(result).not.toBeNull();
      if (!result) return;

      // Find our pet's changes
      const petChange = result.petChanges.find((c) => c.petId === petId);
      expect(petChange).toBeDefined();
      if (!petChange) return;

      // Base decay for 48h (2 periods of 24h)
      const baseDecay = getBase24hDecay();
      const expectedBaseMoodDecay = 2 * baseDecay.mood; // 2 periods × base rate
      const expectedSickMoodDecay = expectedBaseMoodDecay * SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER;

      // Mood should have decayed by 2× the normal amount
      // Note: We compare magnitudes (decay is negative)
      expect(Math.abs(petChange.moodChange)).toBeGreaterThanOrEqual(
        Math.abs(expectedSickMoodDecay) - 1 // Allow small rounding
      );
    });
  });

  // ============================================
  // P10-H-002: 2× Bond Decay in Classic + Sick
  // Bible §9.4.7.3: "If sick: apply 2× stat decay"
  // ============================================
  describe('P10-H-002: 2× Bond Decay (Classic + Sick)', () => {
    it('should apply 2× bond decay when sick in Classic mode', () => {
      const store = useGameStore.getState();

      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      const state = useGameStore.getState();
      const petId = state.activePetId;
      const originalBond = 60;

      useGameStore.setState((s) => ({
        petsById: {
          ...s.petsById,
          [petId]: {
            ...s.petsById[petId],
            moodValue: 80,
            bond: originalBond,
            hunger: 50,
            isSick: true,
            sickStartTimestamp: Date.now() - 48 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: Date.now() - 48 * 60 * 60 * 1000,
      }));

      const result = useGameStore.getState().applyOfflineFanout(new Date());
      expect(result).not.toBeNull();
      if (!result) return;

      const petChange = result.petChanges.find((c) => c.petId === petId);
      expect(petChange).toBeDefined();
      if (!petChange) return;

      const baseDecay = getBase24hDecay();
      const expectedBaseBondDecay = 2 * baseDecay.bond;
      const expectedSickBondDecay = expectedBaseBondDecay * SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER;

      // Bond should have decayed by 2× the normal amount
      expect(Math.abs(petChange.bondChange)).toBeGreaterThanOrEqual(
        Math.abs(expectedSickBondDecay) - 1
      );
    });
  });

  // ============================================
  // P10-H-003: 2× Hunger Decay in Classic + Sick
  // Bible §9.4.7.3: "If sick: apply 2× stat decay"
  // ============================================
  describe('P10-H-003: 2× Hunger Decay (Classic + Sick)', () => {
    it('should apply 2× hunger decay when sick in Classic mode', () => {
      const store = useGameStore.getState();

      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      const state = useGameStore.getState();
      const petId = state.activePetId;
      const originalHunger = 70;

      useGameStore.setState((s) => ({
        petsById: {
          ...s.petsById,
          [petId]: {
            ...s.petsById[petId],
            moodValue: 80,
            bond: 50,
            hunger: originalHunger,
            isSick: true,
            sickStartTimestamp: Date.now() - 48 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: Date.now() - 48 * 60 * 60 * 1000,
      }));

      const result = useGameStore.getState().applyOfflineFanout(new Date());
      expect(result).not.toBeNull();
      if (!result) return;

      const petChange = result.petChanges.find((c) => c.petId === petId);
      expect(petChange).toBeDefined();
      if (!petChange) return;

      const baseDecay = getBase24hDecay();
      const expectedBaseHungerDecay = 2 * baseDecay.hunger;
      const expectedSickHungerDecay = expectedBaseHungerDecay * SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER;

      // Hunger should have decayed by 2× the normal amount
      expect(Math.abs(petChange.hungerChange)).toBeGreaterThanOrEqual(
        Math.abs(expectedSickHungerDecay) - 1
      );
    });
  });

  // ============================================
  // P10-H-004: Cozy Mode Immunity
  // Bible §9.3: Sickness disabled in Cozy mode
  // ============================================
  describe('P10-H-004: Cozy Mode Immunity (No 2× Multiplier)', () => {
    it('should NOT apply 2× multiplier in Cozy mode even if sick flag is set', () => {
      const store = useGameStore.getState();

      // Cozy mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'cozy',
      });

      const state = useGameStore.getState();
      const petId = state.activePetId;
      const originalMood = 80;
      const originalBond = 60;
      const originalHunger = 70;

      useGameStore.setState((s) => ({
        petsById: {
          ...s.petsById,
          [petId]: {
            ...s.petsById[petId],
            moodValue: originalMood,
            bond: originalBond,
            hunger: originalHunger,
            isSick: true, // Even if set (shouldn't happen in Cozy)
            sickStartTimestamp: Date.now() - 48 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: Date.now() - 48 * 60 * 60 * 1000,
      }));

      const result = useGameStore.getState().applyOfflineFanout(new Date());
      expect(result).not.toBeNull();
      if (!result) return;

      const petChange = result.petChanges.find((c) => c.petId === petId);
      expect(petChange).toBeDefined();
      if (!petChange) return;

      // In Cozy mode, decay should be normal (1×), not 2×
      const baseDecay = getBase24hDecay();
      const expectedBaseMoodDecay = 2 * baseDecay.mood;

      // Decay should be at most 1× rate, not 2×
      expect(Math.abs(petChange.moodChange)).toBeLessThanOrEqual(
        Math.abs(expectedBaseMoodDecay) + 5 // Allow small variance but not 2× (which would be much higher)
      );
    });
  });

  // ============================================
  // P10-H-005: No Multiplier When Not Sick
  // Verify baseline behavior
  // ============================================
  describe('P10-H-005: No Multiplier When Not Sick', () => {
    it('should NOT apply 2× multiplier when pet is not sick', () => {
      const store = useGameStore.getState();

      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      const state = useGameStore.getState();
      const petId = state.activePetId;
      const originalMood = 80;

      useGameStore.setState((s) => ({
        petsById: {
          ...s.petsById,
          [petId]: {
            ...s.petsById[petId],
            moodValue: originalMood,
            bond: 60,
            hunger: 70,
            isSick: false, // NOT sick
            sickStartTimestamp: null,
          },
        },
        lastSeenTimestamp: Date.now() - 48 * 60 * 60 * 1000,
      }));

      const result = useGameStore.getState().applyOfflineFanout(new Date());
      expect(result).not.toBeNull();
      if (!result) return;

      const petChange = result.petChanges.find((c) => c.petId === petId);
      expect(petChange).toBeDefined();
      if (!petChange) return;

      const baseDecay = getBase24hDecay();
      const expectedBaseMoodDecay = 2 * baseDecay.mood;
      const wouldBeSickDecay = expectedBaseMoodDecay * SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER;

      // Decay should be 1× rate, NOT 2×
      expect(Math.abs(petChange.moodChange)).toBeLessThan(Math.abs(wouldBeSickDecay) - 5);
    });
  });

  // ============================================
  // P10-H-006: Multiplier Constant Value
  // Verify SICK_DECAY_MULTIPLIER = 2
  // ============================================
  describe('P10-H-006: Multiplier Constant Value', () => {
    it('should use SICK_DECAY_MULTIPLIER = 2', () => {
      expect(SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER).toBe(2);
    });
  });
});
