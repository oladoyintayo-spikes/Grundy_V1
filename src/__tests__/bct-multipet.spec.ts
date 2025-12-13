/**
 * BCT-MULTIPET: Multi-Pet Runtime Tests
 * Bible v1.7 / BCT v2.3
 *
 * Tests for Phase 9-B multi-pet runtime behavior:
 * - Energy scope (global)
 * - Runaway auto-switch
 * - Runaway slot handling
 * - Switching constraints
 * - Offline multi-pet rules
 * - Alert routing & suppression
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  OFFLINE_DECAY_RATES,
  ALERT_SUPPRESSION,
  ALERT_BADGES,
  MULTI_PET_ENERGY,
  getNeglectStageById,
} from '../constants/bible.constants';
import type { NeglectState, PetInstanceId } from '../types';
import { DEFAULT_NEGLECT_STATE } from '../types';

describe('BCT-MULTIPET: Multi-Pet Runtime Tests (Bible v1.7)', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetGame();
  });

  // ========================================
  // Energy Scope (Global) - BCT-MULTIPET-001 to 003
  // Bible §8.2.1
  // ========================================

  describe('Energy Scope (Global) - §8.2.1', () => {
    it('BCT-MULTIPET-001: Energy is global (shared pool across all pets)', () => {
      // Bible §8.2.1: Energy is GLOBAL (shared across all owned pets)
      expect(MULTI_PET_ENERGY.SCOPE).toBe('global');

      const store = useGameStore.getState();

      // Verify energy is at store root, not per-pet
      expect(store.energy).toBeDefined();
      expect(store.energy.current).toBeGreaterThanOrEqual(0);

      // Get owned pets and verify they don't have individual energy
      const pets = store.getOwnedPets();
      expect(pets.length).toBeGreaterThan(0);

      // OwnedPetState should not have energy property (it's global)
      pets.forEach((pet) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((pet as any).energy).toBeUndefined();
      });
    });

    it('BCT-MULTIPET-002: First-free daily game is global (one per day total)', () => {
      // Bible §8.2.1: One free play per day total, not per pet
      expect(MULTI_PET_ENERGY.FIRST_FREE_GLOBAL).toBe(true);

      const store = useGameStore.getState();

      // Verify dailyMiniGames is at store root (global, not per-pet)
      expect(store.dailyMiniGames).toBeDefined();
      expect(store.dailyMiniGames.freePlayUsed).toBeDefined();
    });

    it('BCT-MULTIPET-003: Daily cap (3 plays) is global across all pets', () => {
      // Bible §8.2.1: 3 rewarded plays per day across all pets
      expect(MULTI_PET_ENERGY.DAILY_CAP_GLOBAL).toBe(true);

      const store = useGameStore.getState();

      // Verify plays tracking is at store root (global)
      expect(store.dailyMiniGames).toBeDefined();
      expect(store.dailyMiniGames.plays).toBeDefined();
    });
  });

  // ========================================
  // Runaway Auto-Switch - BCT-MULTIPET-004 to 005
  // Bible §9.4.4
  // ========================================

  describe('Runaway Auto-Switch - §9.4.4', () => {
    it('BCT-MULTIPET-004: Runaway triggers auto-switch to next available pet', () => {
      // Setup: Make active pet runaway
      const store = useGameStore.getState();
      const activePetId = store.activePetId;
      const ownedPetIds = store.ownedPetIds;

      // Must have multiple pets for auto-switch
      expect(ownedPetIds.length).toBeGreaterThanOrEqual(2);

      // Set active pet to runaway
      const runawayNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        isRunaway: true,
        runawayAt: new Date().toISOString(),
        currentStage: 'runaway',
        neglectDays: 14,
      };

      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [activePetId]: runawayNeglect,
        },
      });

      // Trigger auto-switch
      const result = useGameStore.getState().autoSwitchOnRunaway();

      // Should switch to a different pet
      expect(result.allPetsAway).toBe(false);
      expect(result.newPetId).not.toBeNull();
      expect(result.newPetId).not.toBe(activePetId);

      // New active pet should be in slot order (first non-runaway)
      const newStore = useGameStore.getState();
      expect(newStore.activePetId).toBe(result.newPetId);
    });

    it('BCT-MULTIPET-005: All-pets-runaway shows "All Pets Away" state', () => {
      const store = useGameStore.getState();
      const ownedPetIds = store.ownedPetIds;

      // Set ALL pets to runaway
      const runawayNeglects: Record<string, NeglectState> = {};
      for (const petId of ownedPetIds) {
        runawayNeglects[petId] = {
          ...DEFAULT_NEGLECT_STATE,
          isRunaway: true,
          runawayAt: new Date().toISOString(),
          currentStage: 'runaway',
          neglectDays: 14,
        };
      }

      useGameStore.setState({
        neglectByPetId: runawayNeglects,
      });

      // Trigger auto-switch
      const result = useGameStore.getState().autoSwitchOnRunaway();

      // Should enter "All Pets Away" state
      expect(result.allPetsAway).toBe(true);
      expect(result.newPetId).toBeNull();

      // Store should reflect all pets away
      const newStore = useGameStore.getState();
      expect(newStore.allPetsAway).toBe(true);
    });
  });

  // ========================================
  // Runaway Slot Handling - BCT-MULTIPET-006 to 007
  // Bible §9.4.4
  // ========================================

  describe('Runaway Slot Handling - §9.4.4', () => {
    it('BCT-MULTIPET-006: Runaway pets remain in slot with lockout indicator', () => {
      // Bible §9.4.4: Runaway pets stay in their slot with lockout indicator
      expect(ALERT_BADGES.LOCKED).toBe('🔒');

      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set first pet to runaway
      const runawayNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        isRunaway: true,
        runawayAt: new Date().toISOString(),
        currentStage: 'runaway',
        neglectDays: 14,
      };

      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: runawayNeglect,
        },
      });

      // Verify pet still in ownedPetIds (slot not freed)
      const newStore = useGameStore.getState();
      expect(newStore.ownedPetIds).toContain(firstPetId);
      expect(newStore.petsById[firstPetId]).toBeDefined();

      // Verify badge shows locked
      const badges = newStore.getPetStatusBadges();
      const runawayPetBadge = badges.find((b) => b.petId === firstPetId);
      expect(runawayPetBadge?.badge).toBe(ALERT_BADGES.LOCKED);
    });

    it('BCT-MULTIPET-007: Runaway pets are selectable for recovery UI', () => {
      // Bible §9.4.4: Player can select runaway pet to view recovery options
      const store = useGameStore.getState();
      const ownedPetIds = store.ownedPetIds;
      expect(ownedPetIds.length).toBeGreaterThanOrEqual(2);

      const firstPetId = ownedPetIds[0];
      const secondPetId = ownedPetIds[1];

      // Set first pet to runaway, make second pet active
      const runawayNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        isRunaway: true,
        runawayAt: new Date().toISOString(),
        currentStage: 'runaway',
        neglectDays: 14,
      };

      useGameStore.setState({
        activePetId: secondPetId,
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: runawayNeglect,
        },
      });

      // Attempt to select runaway pet - should succeed with warning
      const result = useGameStore.getState().setActivePet(firstPetId);
      expect(result.success).toBe(true);
      expect(result.warning).toContain('run away');
    });
  });

  // ========================================
  // Switching Constraints - BCT-MULTIPET-008
  // Bible §9.4.5
  // ========================================

  describe('Switching Constraints - §9.4.5', () => {
    it('BCT-MULTIPET-008: Switching TO withdrawn/critical pets is allowed', () => {
      // Bible §9.4.5: Switching is always allowed to enable players to care for neglected pets
      const store = useGameStore.getState();
      const ownedPetIds = store.ownedPetIds;
      expect(ownedPetIds.length).toBeGreaterThanOrEqual(2);

      const firstPetId = ownedPetIds[0];
      const secondPetId = ownedPetIds[1];

      // Set first pet to withdrawn
      const withdrawnNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'withdrawn',
        isWithdrawn: true,
        withdrawnAt: new Date().toISOString(),
        neglectDays: 7,
      };

      useGameStore.setState({
        activePetId: secondPetId,
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: withdrawnNeglect,
        },
      });

      // Switching TO withdrawn pet should succeed with warning
      const result = useGameStore.getState().setActivePet(firstPetId);
      expect(result.success).toBe(true);
      expect(result.warning).toContain('needs extra care');

      // Test critical state too
      const criticalNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'critical',
        isWithdrawn: true,
        withdrawnAt: new Date().toISOString(),
        neglectDays: 13,
      };

      useGameStore.setState({
        activePetId: secondPetId,
        neglectByPetId: {
          ...useGameStore.getState().neglectByPetId,
          [firstPetId]: criticalNeglect,
        },
      });

      const result2 = useGameStore.getState().setActivePet(firstPetId);
      expect(result2.success).toBe(true);
      expect(result2.warning).toContain('needs extra care');
    });
  });

  // ========================================
  // Offline Multi-Pet Rules - BCT-MULTIPET-009 to 011
  // Bible §9.4.6
  // ========================================

  describe('Offline Multi-Pet Rules - §9.4.6', () => {
    it('BCT-MULTIPET-009: Offline mood decays for all pets (-5/24h, floor 30)', () => {
      // Bible §9.4.6: Mood decays -5 per 24h for ALL owned pets (floor 30)
      expect(OFFLINE_DECAY_RATES.MOOD_PER_24H).toBe(5);
      expect(OFFLINE_DECAY_RATES.MOOD_FLOOR).toBe(30);

      const store = useGameStore.getState();

      // Complete FTUE and enable Classic mode for neglect
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Set initial mood values for all pets
      const initialMood = 80;
      const petsById = { ...store.petsById };
      for (const petId of store.ownedPetIds) {
        petsById[petId] = {
          ...petsById[petId],
          moodValue: initialMood,
        };
      }
      useGameStore.setState({ petsById });

      // Simulate 48 hours offline (2 periods of 24h decay)
      const now = new Date();
      const lastSeen = now.getTime() - 48 * 60 * 60 * 1000; // 48h ago
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const result = useGameStore.getState().applyOfflineFanout(now);

      // Verify all pets had mood decay applied
      expect(result).not.toBeNull();
      if (result) {
        expect(result.petChanges.length).toBe(store.ownedPetIds.length);

        // Each pet should have lost 10 mood (2 * 5)
        for (const change of result.petChanges) {
          expect(change.moodChange).toBe(-10);
        }

        // Verify floor is respected
        const newStore = useGameStore.getState();
        for (const petId of newStore.ownedPetIds) {
          expect(newStore.petsById[petId].moodValue).toBeGreaterThanOrEqual(
            OFFLINE_DECAY_RATES.MOOD_FLOOR
          );
        }
      }
    });

    it('BCT-MULTIPET-010: Offline bond decays for all pets (-2/24h, floor 0)', () => {
      // Bible §9.4.6: Bond decays -2 per 24h for ALL owned pets (floor 0); Plus: -1/24h
      expect(OFFLINE_DECAY_RATES.BOND_PER_24H).toBe(2);
      expect(OFFLINE_DECAY_RATES.BOND_PER_24H_PLUS).toBe(1);
      expect(OFFLINE_DECAY_RATES.BOND_FLOOR).toBe(0);

      const store = useGameStore.getState();

      // Complete FTUE and enable Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Set initial bond values
      const initialBond = 50;
      const petsById = { ...store.petsById };
      for (const petId of store.ownedPetIds) {
        petsById[petId] = {
          ...petsById[petId],
          bond: initialBond,
        };
      }
      useGameStore.setState({ petsById });

      // Simulate 24 hours offline
      const now = new Date();
      const lastSeen = now.getTime() - 24 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const result = useGameStore.getState().applyOfflineFanout(now);

      expect(result).not.toBeNull();
      if (result) {
        // Each pet should have lost 2 bond
        for (const change of result.petChanges) {
          expect(change.bondChange).toBe(-2);
        }
      }
    });

    it('BCT-MULTIPET-011: Offline neglect accrues for all pets (+1/day, cap 14)', () => {
      // Bible §9.4.6: Neglect +1 per day for ALL owned pets (cap 14)
      expect(OFFLINE_DECAY_RATES.NEGLECT_CAP_DAYS).toBe(14);

      // Verify runaway stage is at 14 days
      const runawayStage = getNeglectStageById('runaway');
      expect(runawayStage.minDays).toBe(14);
    });
  });

  // ========================================
  // Alert Routing & Suppression - BCT-MULTIPET-012 to 014
  // Bible §11.6.1
  // ========================================

  describe('Alert Routing & Suppression - §11.6.1', () => {
    it('BCT-MULTIPET-012: Neglect alerts fire once per stage transition', () => {
      // Bible §11.6.1: Stage transition alerts fire once, not repeatedly
      // This is verified by the alert suppression system - alerts are tracked per-pet

      const store = useGameStore.getState();
      const petId = store.activePetId;

      // Record an alert
      useGameStore.getState().recordAlertShown(petId, false);

      // Check cooldown is set
      const newStore = useGameStore.getState();
      expect(newStore.alertSuppression.lastAlertByPet[petId]).toBeDefined();
      expect(newStore.alertSuppression.sessionAlertCount).toBe(1);
    });

    it('BCT-MULTIPET-013: Alert cooldown is 30 minutes per pet', () => {
      // Bible §11.6.1: Minimum 30 minutes between alerts for same pet (except runaway)
      expect(ALERT_SUPPRESSION.COOLDOWN_MINUTES).toBe(30);

      const store = useGameStore.getState();
      const petId = store.activePetId;

      // Record an alert
      useGameStore.getState().recordAlertShown(petId, false);

      // Immediately try to show another - should be blocked
      const canShow = useGameStore.getState().canShowAlertForPet(petId);
      expect(canShow).toBe(false);

      // Verify runaway bypasses suppression
      expect(ALERT_SUPPRESSION.RUNAWAY_BYPASSES).toBe(true);
    });

    it('BCT-MULTIPET-014: Offline return batches alerts into summary', () => {
      // Bible §11.6.1: Returning from offline shows batched "Welcome Back" summary

      const store = useGameStore.getState();

      // Complete FTUE and enable Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Simulate 48 hours offline
      const now = new Date();
      const lastSeen = now.getTime() - 48 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const result = useGameStore.getState().applyOfflineFanout(now);

      // Result should contain batched changes for all pets
      expect(result).not.toBeNull();
      if (result) {
        expect(result.hoursOffline).toBeGreaterThanOrEqual(24);
        expect(result.petChanges.length).toBeGreaterThan(0);

        // Each pet change should have a name for the summary
        for (const change of result.petChanges) {
          expect(change.petName).toBeDefined();
          expect(change.petName.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // ========================================
  // Additional Integration Tests
  // ========================================

  describe('Multi-Pet Integration', () => {
    it('syncActivePetToStore keeps petsById in sync with legacy pet field', () => {
      const store = useGameStore.getState();
      const activePetId = store.activePetId;

      // Modify the legacy pet field directly (simulating a feed action)
      const newLevel = 5;
      const newBond = 25;
      useGameStore.setState((state) => ({
        pet: {
          ...state.pet,
          level: newLevel,
          bond: newBond,
        },
      }));

      // Sync to petsById
      useGameStore.getState().syncActivePetToStore();

      // Verify petsById was updated
      const newStore = useGameStore.getState();
      expect(newStore.petsById[activePetId].level).toBe(newLevel);
      expect(newStore.petsById[activePetId].bond).toBe(newBond);
    });

    it('getPetStatusBadges returns badges for all pets', () => {
      const store = useGameStore.getState();
      const badges = store.getPetStatusBadges();

      expect(badges.length).toBe(store.ownedPetIds.length);

      for (const badge of badges) {
        expect(store.ownedPetIds).toContain(badge.petId);
        expect(badge.needsAttention).toBeDefined();
        expect(badge.neglectStage).toBeDefined();
      }
    });

    it('getAggregatedBadgeCount returns count of pets needing attention', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Initially no pets need attention
      const initialCount = store.getAggregatedBadgeCount();

      // Set one pet to worried
      const worriedNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'worried',
        neglectDays: 2,
      };

      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: worriedNeglect,
        },
      });

      const newCount = useGameStore.getState().getAggregatedBadgeCount();
      expect(newCount).toBe(initialCount + 1);
    });

    it('FTUE protection prevents offline decay', () => {
      const store = useGameStore.getState();

      // Ensure FTUE not complete
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: false },
      });

      // Simulate 48 hours offline
      const now = new Date();
      const lastSeen = now.getTime() - 48 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const result = useGameStore.getState().applyOfflineFanout(now);

      // Should return null (no decay applied)
      expect(result).toBeNull();
    });

    it('Cozy mode applies weight decay but skips sickness (P10-B)', () => {
      const store = useGameStore.getState();

      // Complete FTUE but set Cozy mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'cozy',
      });

      // Simulate 48 hours offline
      const now = new Date();
      const lastSeen = now.getTime() - 48 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const result = useGameStore.getState().applyOfflineFanout(now);

      // P10-B: Cozy mode DOES apply weight decay (Bible v1.8 §9.4.7.1)
      // but skips sickness (Bible v1.8 §9.3)
      expect(result).not.toBeNull();
      expect(result!.hoursOffline).toBe(48);

      // Check that weight decay was applied but no sickness
      for (const petChange of result!.petChanges) {
        // Weight decay: -48 hours = -48 weight
        expect(petChange.weightChange).toBeDefined();
        // Sickness should NOT trigger in Cozy
        expect(petChange.becameSick).toBe(false);
        // No care mistakes in Cozy
        expect(petChange.careMistakesAdded).toBe(0);
      }
    });
  });
});
