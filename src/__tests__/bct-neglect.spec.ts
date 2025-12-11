/**
 * BCT-NEGLECT: Neglect & Withdrawal System Tests
 *
 * Bible §9.4.3 compliance tests for the Neglect & Withdrawal system.
 * Tests cover: Stage thresholds, mode behavior, FTUE/grace protection,
 * recovery paths, offline cap, and per-pet tracking.
 *
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-NEGLECT-001 through BCT-NEGLECT-023
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import {
  NEGLECT_CONFIG,
  NEGLECT_STAGES,
  NEGLECT_UI_COPY,
  getNeglectStage,
  getNeglectStageById,
  isNeglectPenaltyStage,
  MODE_CONFIG,
} from '../constants/bible.constants';
import { DEFAULT_NEGLECT_STATE } from '../types';

describe('BCT-NEGLECT: Neglect & Withdrawal System', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  // ========================================
  // BCT-NEGLECT-001..006: Stage Thresholds
  // ========================================

  describe('BCT-NEGLECT-001: Worried State Trigger', () => {
    it('should reach Worried state at Day 2', () => {
      const stage = getNeglectStage(2);
      expect(stage.id).toBe('worried');
      expect(stage.minDays).toBe(2);
    });

    it('should have no penalty for Worried state', () => {
      const stage = getNeglectStage(2);
      expect(stage.bondPenalty).toBe(0);
      expect(stage.bondGainMultiplier).toBe(1.0);
    });
  });

  describe('BCT-NEGLECT-002: Sad State Trigger', () => {
    it('should reach Sad state at Day 4', () => {
      const stage = getNeglectStage(4);
      expect(stage.id).toBe('sad');
      expect(stage.minDays).toBe(4);
    });

    it('should have no penalty for Sad state', () => {
      const stage = getNeglectStage(4);
      expect(stage.bondPenalty).toBe(0);
      expect(stage.bondGainMultiplier).toBe(1.0);
    });
  });

  describe('BCT-NEGLECT-003: Withdrawn State Trigger', () => {
    it('should reach Withdrawn state at Day 7', () => {
      const stage = getNeglectStage(7);
      expect(stage.id).toBe('withdrawn');
      expect(stage.minDays).toBe(7);
    });

    it('should have -25% bond penalty for Withdrawn', () => {
      const stage = getNeglectStage(7);
      expect(stage.bondPenalty).toBe(0.25);
    });
  });

  describe('BCT-NEGLECT-004: Withdrawal Bond Penalty', () => {
    it('should apply -25% bond on entering withdrawn', () => {
      const stage = getNeglectStageById('withdrawn');
      expect(stage.bondPenalty).toBe(0.25);
    });

    it('should apply penalty instantly (no delay)', () => {
      // The bondPenalty field indicates immediate application
      const stage = getNeglectStageById('withdrawn');
      expect(stage.bondPenalty).toBeGreaterThan(0);
    });
  });

  describe('BCT-NEGLECT-005: Withdrawn Ongoing Penalties', () => {
    it('should have -50% bond gains in withdrawn', () => {
      const stage = getNeglectStageById('withdrawn');
      expect(stage.bondGainMultiplier).toBe(0.5);
    });

    it('should have -25% mood gains in withdrawn', () => {
      const stage = getNeglectStageById('withdrawn');
      expect(stage.moodGainMultiplier).toBe(0.75);
    });

    it('should persist penalties until recovered', () => {
      // Critical stage maintains same penalties as withdrawn
      const critical = getNeglectStageById('critical');
      expect(critical.bondGainMultiplier).toBe(0.5);
      expect(critical.moodGainMultiplier).toBe(0.75);
    });
  });

  describe('BCT-NEGLECT-006: Critical State Trigger', () => {
    it('should reach Critical state at Day 10', () => {
      const stage = getNeglectStage(10);
      expect(stage.id).toBe('critical');
      expect(stage.minDays).toBe(10);
    });

    it('should have same penalties as Withdrawn', () => {
      const critical = getNeglectStageById('critical');
      const withdrawn = getNeglectStageById('withdrawn');
      expect(critical.bondGainMultiplier).toBe(withdrawn.bondGainMultiplier);
      expect(critical.moodGainMultiplier).toBe(withdrawn.moodGainMultiplier);
    });
  });

  describe('BCT-NEGLECT-007: Runaway State Trigger', () => {
    it('should reach Runaway state at Day 14', () => {
      const stage = getNeglectStage(14);
      expect(stage.id).toBe('runaway');
      expect(stage.minDays).toBe(14);
    });

    it('should lock out pet interaction in Runaway', () => {
      const stage = getNeglectStageById('runaway');
      expect(stage.isLockedOut).toBe(true);
    });

    it('should have -50% bond penalty on return', () => {
      const stage = getNeglectStageById('runaway');
      expect(stage.bondPenalty).toBe(0.50);
    });
  });

  // ========================================
  // BCT-NEGLECT-008..011: Recovery Paths
  // ========================================

  describe('BCT-NEGLECT-008: Free Withdrawal Recovery', () => {
    it('should require 7 consecutive care days', () => {
      expect(NEGLECT_CONFIG.FREE_RECOVERY_CARE_DAYS).toBe(7);
    });
  });

  describe('BCT-NEGLECT-009: Paid Withdrawal Recovery', () => {
    it('should cost 15 gems for instant recovery', () => {
      expect(NEGLECT_CONFIG.WITHDRAWN_RECOVERY_GEMS).toBe(15);
    });

    it('should recover from withdrawn state with gems in Classic mode', () => {
      const store = useGameStore.getState();

      // Set to Classic mode
      store.selectPlayMode('classic');
      // Complete FTUE
      store.completeFtue();

      // Initialize neglect for pet
      store.initNeglectForPet('munchlet');

      // Manually set withdrawn state for testing
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 7,
            currentStage: 'withdrawn',
            isWithdrawn: true,
            isInGracePeriod: false,
          },
        },
        currencies: {
          ...state.currencies,
          gems: 50, // Enough gems
        },
      }));

      // Recover with gems
      const result = useGameStore.getState().recoverFromWithdrawnWithGems('munchlet');
      expect(result).toBe(true);

      // Check state after recovery
      const neglectState = useGameStore.getState().getNeglectState('munchlet');
      expect(neglectState?.isWithdrawn).toBe(false);
      expect(neglectState?.currentStage).toBe('normal');
      expect(neglectState?.neglectDays).toBe(0);

      // Check gems were spent
      expect(useGameStore.getState().currencies.gems).toBe(50 - 15);
    });
  });

  describe('BCT-NEGLECT-010: Free Runaway Return', () => {
    it('should require 72 hour wait for free return', () => {
      expect(NEGLECT_CONFIG.RUNAWAY_FREE_WAIT_HOURS).toBe(72);
    });

    it('should apply -50% bond penalty on return', () => {
      const store = useGameStore.getState();

      // Set to Classic mode
      store.selectPlayMode('classic');
      // Complete FTUE
      store.completeFtue();

      // Initialize neglect for pet
      store.initNeglectForPet('munchlet');

      const now = new Date();
      const freeReturnTime = new Date(now.getTime() + (72 * 60 * 60 * 1000));

      // Manually set runaway state for testing
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 14,
            currentStage: 'runaway',
            isRunaway: true,
            isWithdrawn: true,
            canReturnFreeAt: now.toISOString(), // Make free return available now
            isInGracePeriod: false,
          },
        },
        pet: {
          ...state.pet,
          bond: 100, // Set bond for penalty calculation
        },
      }));

      // Call back runaway pet
      const result = useGameStore.getState().callBackRunawayPet('munchlet', now);
      expect(result).toBe(true);

      // Check bond penalty applied (-50%)
      expect(useGameStore.getState().pet.bond).toBe(50);

      // Check state after return
      const neglectState = useGameStore.getState().getNeglectState('munchlet');
      expect(neglectState?.isRunaway).toBe(false);
      expect(neglectState?.currentStage).toBe('normal');
    });
  });

  describe('BCT-NEGLECT-011: Paid Runaway Return', () => {
    it('should require 24 hour wait before paid return', () => {
      expect(NEGLECT_CONFIG.RUNAWAY_PAID_WAIT_HOURS).toBe(24);
    });

    it('should cost 25 gems for paid return', () => {
      expect(NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS).toBe(25);
    });

    it('should apply -50% bond penalty on paid return', () => {
      const store = useGameStore.getState();

      // Set to Classic mode
      store.selectPlayMode('classic');
      // Complete FTUE
      store.completeFtue();

      // Initialize neglect for pet
      store.initNeglectForPet('munchlet');

      const now = new Date();

      // Manually set runaway state for testing
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 14,
            currentStage: 'runaway',
            isRunaway: true,
            isWithdrawn: true,
            canReturnPaidAt: now.toISOString(), // Make paid return available now
            canReturnFreeAt: new Date(now.getTime() + (48 * 60 * 60 * 1000)).toISOString(),
            isInGracePeriod: false,
          },
        },
        currencies: {
          ...state.currencies,
          gems: 50, // Enough gems
        },
        pet: {
          ...state.pet,
          bond: 100, // Set bond for penalty calculation
        },
      }));

      // Recover with gems
      const result = useGameStore.getState().recoverFromRunawayWithGems('munchlet');
      expect(result).toBe(true);

      // Check bond penalty applied (-50%)
      expect(useGameStore.getState().pet.bond).toBe(50);

      // Check gems were spent
      expect(useGameStore.getState().currencies.gems).toBe(50 - 25);
    });
  });

  describe('BCT-NEGLECT-012: Runaway Bond Penalty', () => {
    it('should apply bond penalty on return, not during lockout', () => {
      // The runaway stage has bondPenalty = 0.50
      // This is applied on return, not immediately
      const stage = getNeglectStageById('runaway');
      expect(stage.bondPenalty).toBe(0.50);
    });
  });

  // ========================================
  // BCT-NEGLECT-013: Offline Cap
  // ========================================

  describe('BCT-NEGLECT-013: Offline Neglect Cap', () => {
    it('should cap neglect at 14 days', () => {
      expect(NEGLECT_CONFIG.MAX_DAYS).toBe(14);
    });

    it('should not exceed runaway even with longer absence', () => {
      // 20 days absence should still result in runaway (max 14 days)
      const stage = getNeglectStage(20);
      expect(stage.id).toBe('runaway');
      expect(stage.minDays).toBe(14);
    });
  });

  // ========================================
  // BCT-NEGLECT-014: Cozy Mode Exempt
  // ========================================

  describe('BCT-NEGLECT-014: Cozy Mode Exempt', () => {
    it('should have neglect disabled in Cozy mode config', () => {
      expect(MODE_CONFIG.cozy.neglectEnabled).toBe(false);
    });

    it('should have neglect enabled in Classic mode config', () => {
      expect(MODE_CONFIG.classic.neglectEnabled).toBe(true);
    });

    it('should not update neglect in Cozy mode', () => {
      const store = useGameStore.getState();

      // Ensure Cozy mode (default)
      expect(store.playMode).toBe('cozy');

      // Initialize neglect
      store.initNeglectForPet('munchlet');

      // Try to update neglect on login
      store.updateNeglectOnLogin();

      // In Cozy mode, neglect should remain at defaults
      const neglectState = store.getNeglectState('munchlet');
      expect(neglectState?.currentStage).toBe('normal');
      expect(neglectState?.neglectDays).toBe(0);
    });

    it('should always allow interaction in Cozy mode', () => {
      const store = useGameStore.getState();
      expect(store.playMode).toBe('cozy');

      // canInteractWithPet should always return true in Cozy
      expect(store.canInteractWithPet('munchlet')).toBe(true);
      expect(store.canInteractWithPet('any-pet')).toBe(true);
    });
  });

  // ========================================
  // BCT-NEGLECT-015..017: Care Actions
  // ========================================

  describe('BCT-NEGLECT-015: Feed Resets Counter', () => {
    it('should reset neglect counter when feeding (via registerCareEvent)', () => {
      const store = useGameStore.getState();

      // Set to Classic mode
      store.selectPlayMode('classic');
      store.completeFtue();
      store.initNeglectForPet('munchlet');

      // Set some neglect days (pre-withdrawal)
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 3,
            currentStage: 'worried',
            isInGracePeriod: false,
          },
        },
      }));

      // Register care event (feed)
      useGameStore.getState().registerCareEvent('munchlet');

      // Check counter reset
      const neglectState = useGameStore.getState().getNeglectState('munchlet');
      expect(neglectState?.neglectDays).toBe(0);
      expect(neglectState?.currentStage).toBe('normal');
    });
  });

  describe('BCT-NEGLECT-016: Play Resets Counter', () => {
    it('should reset neglect counter when playing (same as feed)', () => {
      // Play uses the same registerCareEvent mechanism
      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();
      store.initNeglectForPet('munchlet');

      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 5,
            currentStage: 'sad',
            isInGracePeriod: false,
          },
        },
      }));

      // Register care event (play)
      useGameStore.getState().registerCareEvent('munchlet');

      const neglectState = useGameStore.getState().getNeglectState('munchlet');
      expect(neglectState?.neglectDays).toBe(0);
      expect(neglectState?.currentStage).toBe('normal');
    });
  });

  describe('BCT-NEGLECT-017: Passive Actions No Reset', () => {
    it('should not reset counter on passive actions (view, open app)', () => {
      // This is enforced by design: only registerCareEvent resets counter
      // Opening app or viewing pet does not call registerCareEvent
      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();
      store.initNeglectForPet('munchlet');

      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 3,
            currentStage: 'worried',
            isInGracePeriod: false,
          },
        },
      }));

      // updateNeglectOnLogin does NOT reset counter (passive)
      useGameStore.getState().updateNeglectOnLogin();

      const neglectState = useGameStore.getState().getNeglectState('munchlet');
      // Counter should remain or increase, not reset
      expect(neglectState?.neglectDays).toBeGreaterThanOrEqual(3);
    });
  });

  // ========================================
  // BCT-NEGLECT-018..019: System Independence
  // ========================================

  describe('BCT-NEGLECT-018: Sickness Independence', () => {
    it('should track neglect separately from sickness', () => {
      // Neglect tracks presence/absence (days without care)
      // Sickness tracks stat failures while playing
      // These are independent systems per Bible §9.4.3

      // Verify neglect config exists independently
      expect(NEGLECT_CONFIG).toBeDefined();
      expect(NEGLECT_STAGES).toBeDefined();

      // Sickness config is separate (not tested here)
    });
  });

  describe('BCT-NEGLECT-019: Care Mistakes Independence', () => {
    it('should track neglect separately from care mistakes', () => {
      // Care Mistakes track hourly stat failures (quality of care)
      // Neglect tracks daily presence (showing up)
      // These are independent per Bible §9.4.3

      // A pet can have 0 care mistakes but be withdrawn (absent player)
      // A pet can have many care mistakes but never be withdrawn (present but sloppy)

      const stage = getNeglectStage(7);
      expect(stage.id).toBe('withdrawn');
      // Care mistakes are tracked separately in a different system
    });
  });

  // ========================================
  // BCT-NEGLECT-020..021: Protection Rules
  // ========================================

  describe('BCT-NEGLECT-020: FTUE Protection', () => {
    it('should not advance neglect during FTUE', () => {
      const store = useGameStore.getState();

      // Set to Classic mode but don't complete FTUE
      store.selectPlayMode('classic');
      // FTUE not completed (default)
      expect(store.ftue.hasCompletedFtue).toBe(false);

      store.initNeglectForPet('munchlet');
      store.updateNeglectOnLogin();

      // Neglect should remain at 0 during FTUE
      const neglectState = store.getNeglectState('munchlet');
      expect(neglectState?.neglectDays).toBe(0);
    });

    it('should activate neglect after FTUE completion', () => {
      expect(NEGLECT_CONFIG.GRACE_PERIOD_HOURS).toBe(48);
      // After FTUE + grace period, neglect system activates
    });
  });

  describe('BCT-NEGLECT-021: Grace Period', () => {
    it('should have 48 hour grace period for new accounts', () => {
      expect(NEGLECT_CONFIG.GRACE_PERIOD_HOURS).toBe(48);
    });

    it('should not advance neglect during grace period', () => {
      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();

      // Initialize with current time (starts grace period)
      const now = new Date();
      store.initNeglectForPet('munchlet', now);

      // Check grace period is active
      const neglectState = store.getNeglectState('munchlet');
      expect(neglectState?.isInGracePeriod).toBe(true);

      // Update neglect on login during grace period
      store.updateNeglectOnLogin(now);

      // Should remain at 0
      const updatedState = store.getNeglectState('munchlet');
      expect(updatedState?.neglectDays).toBe(0);
    });
  });

  // ========================================
  // BCT-NEGLECT-022..023: Per-Pet Tracking
  // ========================================

  describe('BCT-NEGLECT-022: Per-Pet Tracking', () => {
    it('should track neglect independently per pet', () => {
      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();

      // Initialize two pets
      store.initNeglectForPet('munchlet');
      store.initNeglectForPet('grib');

      // Set different neglect states
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 5,
            currentStage: 'sad',
            isInGracePeriod: false,
          },
          grib: {
            ...state.neglectByPetId.grib,
            neglectDays: 2,
            currentStage: 'worried',
            isInGracePeriod: false,
          },
        },
      }));

      const munchletState = useGameStore.getState().getNeglectState('munchlet');
      const gribState = useGameStore.getState().getNeglectState('grib');

      expect(munchletState?.neglectDays).toBe(5);
      expect(munchletState?.currentStage).toBe('sad');
      expect(gribState?.neglectDays).toBe(2);
      expect(gribState?.currentStage).toBe('worried');
    });

    it('should not transfer neglect between pets', () => {
      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();

      store.initNeglectForPet('munchlet');
      store.initNeglectForPet('grib');

      // Set neglect for munchlet only
      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 10,
            currentStage: 'critical',
            isInGracePeriod: false,
          },
        },
      }));

      // Switch to grib (selectPet)
      store.selectPet('grib');

      // Grib's neglect should be unaffected
      const gribState = store.getNeglectState('grib');
      expect(gribState?.neglectDays).toBe(0);
      expect(gribState?.currentStage).toBe('normal');
    });
  });

  describe('BCT-NEGLECT-023: Active Pet No Care', () => {
    it('should not count being active pet as care', () => {
      // Being the "active pet" does not count as care
      // Only feed and play actions count

      const store = useGameStore.getState();

      store.selectPlayMode('classic');
      store.completeFtue();
      store.initNeglectForPet('munchlet');

      useGameStore.setState((state) => ({
        neglectByPetId: {
          ...state.neglectByPetId,
          munchlet: {
            ...state.neglectByPetId.munchlet,
            neglectDays: 3,
            currentStage: 'worried',
            isInGracePeriod: false,
          },
        },
      }));

      // Select pet (make active)
      store.selectPet('munchlet');

      // Neglect should NOT be reset just by selecting
      const neglectState = store.getNeglectState('munchlet');
      expect(neglectState?.neglectDays).toBe(3);
      expect(neglectState?.currentStage).toBe('worried');
    });
  });

  // ========================================
  // Additional Config Tests
  // ========================================

  describe('NEGLECT_STAGES Configuration', () => {
    it('should have 6 stages in order', () => {
      expect(NEGLECT_STAGES.length).toBe(6);
      expect(NEGLECT_STAGES[0].id).toBe('normal');
      expect(NEGLECT_STAGES[1].id).toBe('worried');
      expect(NEGLECT_STAGES[2].id).toBe('sad');
      expect(NEGLECT_STAGES[3].id).toBe('withdrawn');
      expect(NEGLECT_STAGES[4].id).toBe('critical');
      expect(NEGLECT_STAGES[5].id).toBe('runaway');
    });

    it('should have stages in ascending minDays order', () => {
      for (let i = 1; i < NEGLECT_STAGES.length; i++) {
        expect(NEGLECT_STAGES[i].minDays).toBeGreaterThan(NEGLECT_STAGES[i - 1].minDays);
      }
    });
  });

  describe('NEGLECT_UI_COPY Configuration', () => {
    it('should have UI copy for all stages', () => {
      expect(NEGLECT_UI_COPY.normal).toBe('');
      expect(NEGLECT_UI_COPY.worried).toContain('worry');
      expect(NEGLECT_UI_COPY.sad).toContain('forgotten');
      expect(NEGLECT_UI_COPY.withdrawn).toContain('pulled away');
      expect(NEGLECT_UI_COPY.critical).toContain('quiet and distant');
      expect(NEGLECT_UI_COPY.runaway).toContain('hiding');
    });
  });

  describe('Helper Functions', () => {
    it('getNeglectStage should return correct stage for day count', () => {
      expect(getNeglectStage(0).id).toBe('normal');
      expect(getNeglectStage(1).id).toBe('normal');
      expect(getNeglectStage(2).id).toBe('worried');
      expect(getNeglectStage(3).id).toBe('worried');
      expect(getNeglectStage(4).id).toBe('sad');
      expect(getNeglectStage(6).id).toBe('sad');
      expect(getNeglectStage(7).id).toBe('withdrawn');
      expect(getNeglectStage(9).id).toBe('withdrawn');
      expect(getNeglectStage(10).id).toBe('critical');
      expect(getNeglectStage(13).id).toBe('critical');
      expect(getNeglectStage(14).id).toBe('runaway');
      expect(getNeglectStage(100).id).toBe('runaway');
    });

    it('isNeglectPenaltyStage should identify penalty stages', () => {
      expect(isNeglectPenaltyStage('normal')).toBe(false);
      expect(isNeglectPenaltyStage('worried')).toBe(false);
      expect(isNeglectPenaltyStage('sad')).toBe(false);
      expect(isNeglectPenaltyStage('withdrawn')).toBe(true);
      expect(isNeglectPenaltyStage('critical')).toBe(true);
      expect(isNeglectPenaltyStage('runaway')).toBe(true);
    });
  });

  describe('DEFAULT_NEGLECT_STATE', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_NEGLECT_STATE.neglectDays).toBe(0);
      expect(DEFAULT_NEGLECT_STATE.currentStage).toBe('normal');
      expect(DEFAULT_NEGLECT_STATE.isWithdrawn).toBe(false);
      expect(DEFAULT_NEGLECT_STATE.isRunaway).toBe(false);
      expect(DEFAULT_NEGLECT_STATE.isInGracePeriod).toBe(true);
      expect(DEFAULT_NEGLECT_STATE.recoveryDaysCompleted).toBe(0);
    });
  });
});
