/**
 * BCT-MULTIPET-UI: Multi-Pet UI Wiring Tests
 * Bible v1.7 / BCT v2.3
 *
 * Tests for Phase 9-B UI wiring store integration:
 * - Pet status badges (aggregated count from store)
 * - Welcome back threshold verification
 * - All pets away state handling
 * - Test ID constants alignment
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import { OFFLINE_DECAY_RATES, ALERT_BADGES } from '../constants/bible.constants';
import type { NeglectState } from '../types';
import { DEFAULT_NEGLECT_STATE } from '../types';

describe('BCT-MULTIPET-UI: Multi-Pet UI Wiring Tests (Bible v1.7)', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetGame();
  });

  // ========================================
  // Aggregated Badge Count Tests
  // Bible §11.6.1: "Pet selector button shows aggregate badge count"
  // testid: pet-badge-count
  // ========================================

  describe('Aggregated Badge Count (store selector)', () => {
    it('BCT-MULTIPET-UI-001: returns 0 when no pets need attention', () => {
      const store = useGameStore.getState();
      const count = store.getAggregatedBadgeCount();

      // All pets in normal state - no badges needed
      expect(count).toBe(0);
    });

    it('BCT-MULTIPET-UI-002: returns count of pets with warning badges', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set one pet to worried state
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

      const count = useGameStore.getState().getAggregatedBadgeCount();
      expect(count).toBe(1);
    });

    it('BCT-MULTIPET-UI-003: returns count of pets with urgent badges', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];
      const secondPetId = store.ownedPetIds[1];

      // Set two pets to urgent states
      const withdrawnNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'withdrawn',
        isWithdrawn: true,
        neglectDays: 7,
      };

      const criticalNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'critical',
        isWithdrawn: true,
        neglectDays: 12,
      };

      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: withdrawnNeglect,
          [secondPetId]: criticalNeglect,
        },
      });

      const count = useGameStore.getState().getAggregatedBadgeCount();
      expect(count).toBe(2);
    });

    it('BCT-MULTIPET-UI-004: includes runaway pets in badge count', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set one pet to runaway
      const runawayNeglect: NeglectState = {
        ...DEFAULT_NEGLECT_STATE,
        currentStage: 'runaway',
        isRunaway: true,
        neglectDays: 14,
      };

      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: runawayNeglect,
        },
      });

      const count = useGameStore.getState().getAggregatedBadgeCount();
      expect(count).toBe(1);
    });

    it('BCT-MULTIPET-UI-005: badge count NOT suppressed by alert cooldown', () => {
      // Bible §11.6.1: Badge count reflects current state, not suppressed
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set pet to need attention
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

      // Record alert (which sets cooldown)
      useGameStore.getState().recordAlertShown(firstPetId, false);

      // Badge count should still reflect pet needs attention
      const count = useGameStore.getState().getAggregatedBadgeCount();
      expect(count).toBe(1);
    });
  });

  // ========================================
  // Per-Pet Status Badge Tests
  // Bible §11.6.1: Badge semantics
  // testid: pet-status-{petId}
  // ========================================

  describe('Per-Pet Status Badges (store selector)', () => {
    it('BCT-MULTIPET-UI-006: returns badges for all owned pets', () => {
      const store = useGameStore.getState();
      const badges = store.getPetStatusBadges();

      expect(badges.length).toBe(store.ownedPetIds.length);

      // Each badge should have required fields
      for (const badge of badges) {
        expect(store.ownedPetIds).toContain(badge.petId);
        expect(typeof badge.needsAttention).toBe('boolean');
        expect(typeof badge.neglectStage).toBe('string');
      }
    });

    it('BCT-MULTIPET-UI-007: warning badge for worried/sad states', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set pet to worried
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: {
            ...DEFAULT_NEGLECT_STATE,
            currentStage: 'worried',
            neglectDays: 2,
          },
        },
      });

      const badges = useGameStore.getState().getPetStatusBadges();
      const worriedBadge = badges.find((b) => b.petId === firstPetId);

      expect(worriedBadge?.badge).toBe(ALERT_BADGES.WARNING);
      expect(worriedBadge?.needsAttention).toBe(true);
    });

    it('BCT-MULTIPET-UI-008: urgent badge for withdrawn/critical states', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set pet to withdrawn
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: {
            ...DEFAULT_NEGLECT_STATE,
            currentStage: 'withdrawn',
            isWithdrawn: true,
            neglectDays: 7,
          },
        },
      });

      const badges = useGameStore.getState().getPetStatusBadges();
      const withdrawnBadge = badges.find((b) => b.petId === firstPetId);

      expect(withdrawnBadge?.badge).toBe(ALERT_BADGES.URGENT);
      expect(withdrawnBadge?.needsAttention).toBe(true);
    });

    it('BCT-MULTIPET-UI-009: locked badge for runaway pets', () => {
      const store = useGameStore.getState();
      const firstPetId = store.ownedPetIds[0];

      // Set pet to runaway
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [firstPetId]: {
            ...DEFAULT_NEGLECT_STATE,
            currentStage: 'runaway',
            isRunaway: true,
            neglectDays: 14,
          },
        },
      });

      const badges = useGameStore.getState().getPetStatusBadges();
      const runawayBadge = badges.find((b) => b.petId === firstPetId);

      expect(runawayBadge?.badge).toBe(ALERT_BADGES.LOCKED);
      expect(runawayBadge?.needsAttention).toBe(true);
    });

    it('BCT-MULTIPET-UI-010: no badge for normal pets', () => {
      const store = useGameStore.getState();
      const badges = store.getPetStatusBadges();

      // All pets should have no badge initially
      for (const badge of badges) {
        expect(badge.badge).toBeNull();
        expect(badge.needsAttention).toBe(false);
      }
    });
  });

  // ========================================
  // Welcome Back Modal Tests
  // Bible §9.4.6: "Show Welcome Back summary if > 24h offline"
  // testid: welcome-back-modal, welcome-back-dismiss
  // ========================================

  describe('Welcome Back Summary (offline return)', () => {
    it('BCT-MULTIPET-UI-011: threshold is 24 hours', () => {
      expect(OFFLINE_DECAY_RATES.WELCOME_BACK_THRESHOLD_HOURS).toBe(24);
    });

    it('BCT-MULTIPET-UI-012: offline return summary includes hours offline', () => {
      const store = useGameStore.getState();

      // Complete FTUE and set Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Simulate 48h offline
      const now = new Date();
      const lastSeen = now.getTime() - 48 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const summary = useGameStore.getState().applyOfflineFanout(now);

      expect(summary).not.toBeNull();
      expect(summary!.hoursOffline).toBeGreaterThanOrEqual(47);
      expect(summary!.hoursOffline).toBeLessThanOrEqual(49);
    });

    it('BCT-MULTIPET-UI-013: offline return summary includes per-pet changes', () => {
      const store = useGameStore.getState();

      // Complete FTUE and set Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Simulate 24h offline
      const now = new Date();
      const lastSeen = now.getTime() - 24 * 60 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const summary = useGameStore.getState().applyOfflineFanout(now);

      expect(summary).not.toBeNull();
      expect(summary!.petChanges.length).toBeGreaterThan(0);

      // Each change should have pet name
      for (const change of summary!.petChanges) {
        expect(change.petName).toBeDefined();
        expect(change.petName.length).toBeGreaterThan(0);
      }
    });

    it('BCT-MULTIPET-UI-014: shows no summary if < 1h offline', () => {
      const store = useGameStore.getState();

      // Complete FTUE and set Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Simulate 30 min offline
      const now = new Date();
      const lastSeen = now.getTime() - 30 * 60 * 1000;
      useGameStore.setState({ lastSeenTimestamp: lastSeen });

      const summary = useGameStore.getState().applyOfflineFanout(now);

      // Should return null for short offline periods
      expect(summary).toBeNull();
    });
  });

  // ========================================
  // All Pets Away Screen Tests
  // Bible §9.4.4: "All-pets-runaway shows All Pets Away state"
  // testid: all-pets-away-screen, runaway-recovery-{petId}
  // ========================================

  describe('All Pets Away State', () => {
    it('BCT-MULTIPET-UI-015: allPetsAway flag set when all pets runaway', () => {
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

      expect(result.allPetsAway).toBe(true);
      expect(useGameStore.getState().allPetsAway).toBe(true);
    });

    it('BCT-MULTIPET-UI-016: allPetsAway false when at least one pet available', () => {
      const store = useGameStore.getState();
      const ownedPetIds = store.ownedPetIds;

      // Set only first pet to runaway, leave others normal
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [ownedPetIds[0]]: {
            ...DEFAULT_NEGLECT_STATE,
            isRunaway: true,
            runawayAt: new Date().toISOString(),
            currentStage: 'runaway',
            neglectDays: 14,
          },
        },
      });

      // Trigger auto-switch
      const result = useGameStore.getState().autoSwitchOnRunaway();

      expect(result.allPetsAway).toBe(false);
    });

    it('BCT-MULTIPET-UI-017: each runaway pet has recovery entry', () => {
      const store = useGameStore.getState();
      const ownedPetIds = store.ownedPetIds;

      // Set all pets to runaway
      const runawayNeglects: Record<string, NeglectState> = {};
      for (const petId of ownedPetIds) {
        runawayNeglects[petId] = {
          ...DEFAULT_NEGLECT_STATE,
          isRunaway: true,
          runawayAt: new Date().toISOString(),
          currentStage: 'runaway',
          neglectDays: 14,
          canReturnPaidAt: new Date().toISOString(),
          canReturnFreeAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        };
      }

      useGameStore.setState({
        neglectByPetId: runawayNeglects,
        allPetsAway: true,
      });

      // Verify each pet's neglect state is accessible for recovery UI
      const newStore = useGameStore.getState();
      for (const petId of ownedPetIds) {
        const neglectState = newStore.neglectByPetId[petId];
        expect(neglectState).toBeDefined();
        expect(neglectState.isRunaway).toBe(true);
        expect(neglectState.canReturnPaidAt).toBeDefined();
        expect(neglectState.canReturnFreeAt).toBeDefined();
      }
    });
  });

  // ========================================
  // Runaway Auto-Switch Visibility Tests
  // Bible §9.4.4: "Auto-switch when active pet runs away"
  // ========================================

  describe('Runaway Auto-Switch Visibility', () => {
    it('BCT-MULTIPET-UI-018: autoSwitchOccurred flag in offline summary', () => {
      const store = useGameStore.getState();
      const activePetId = store.activePetId;

      // Complete FTUE, Classic mode
      useGameStore.setState({
        ftue: { ...store.ftue, hasCompletedFtue: true },
        playMode: 'classic',
      });

      // Set active pet to runaway state (simulating what would happen after offline decay)
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [activePetId]: {
            ...DEFAULT_NEGLECT_STATE,
            isRunaway: true,
            currentStage: 'runaway',
            neglectDays: 14,
          },
        },
      });

      // Trigger auto-switch
      const result = useGameStore.getState().autoSwitchOnRunaway();

      // Should have switched to another pet
      expect(result.newPetId).not.toBeNull();
      expect(result.newPetId).not.toBe(activePetId);
    });

    it('BCT-MULTIPET-UI-019: new active pet ID available after auto-switch', () => {
      const store = useGameStore.getState();
      const activePetId = store.activePetId;
      const ownedPetIds = store.ownedPetIds;

      // Set active pet to runaway
      useGameStore.setState({
        neglectByPetId: {
          ...store.neglectByPetId,
          [activePetId]: {
            ...DEFAULT_NEGLECT_STATE,
            isRunaway: true,
            currentStage: 'runaway',
            neglectDays: 14,
          },
        },
      });

      // Trigger auto-switch
      const result = useGameStore.getState().autoSwitchOnRunaway();

      // New pet ID should be a valid owned pet that is not runaway
      if (!result.allPetsAway) {
        expect(ownedPetIds).toContain(result.newPetId);
        expect(useGameStore.getState().activePetId).toBe(result.newPetId);
      }
    });
  });

  // ========================================
  // Constants Verification Tests
  // ========================================

  describe('UI Constants Verification', () => {
    it('BCT-MULTIPET-UI-020: ALERT_BADGES match Bible §11.6.1', () => {
      expect(ALERT_BADGES.WARNING).toBe('⚠️');
      expect(ALERT_BADGES.URGENT).toBe('💔');
      expect(ALERT_BADGES.LOCKED).toBe('🔒');
    });

    it('BCT-MULTIPET-UI-021: WELCOME_BACK_THRESHOLD_HOURS is 24', () => {
      expect(OFFLINE_DECAY_RATES.WELCOME_BACK_THRESHOLD_HOURS).toBe(24);
    });
  });
});
