/**
 * BCT-P10D: Mini-Game Gating Tests
 * Bible v1.8 §9.4.7 - Health conditions block mini-games (Classic only)
 *
 * Tests:
 * - Sick pets cannot play mini-games (Classic only)
 * - Obese pets (weight >= 81) cannot play mini-games (Classic only)
 * - Overweight pets (61-80) CAN still play
 * - Cozy mode bypasses ALL health gates
 * - Gate order: sick first, obese second (deterministic)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';
import { getMinigameGateReason, type MinigameGateResult } from '../game/store';
import { MINIGAME_GATING } from '../constants/bible.constants';

// ============================================
// Test Helpers
// ============================================

function resetStore() {
  useGameStore.getState().resetGame();
}

function setupPetState(
  weight: number,
  isSick: boolean,
  mode: 'cozy' | 'classic' = 'classic'
) {
  resetStore();
  useGameStore.getState().selectPlayMode(mode);
  useGameStore.getState().completeFtue();

  const state = useGameStore.getState();
  const activePetId = state.activePetId;
  const currentPetsById = state.petsById;

  if (currentPetsById[activePetId]) {
    useGameStore.setState({
      petsById: {
        ...currentPetsById,
        [activePetId]: {
          ...currentPetsById[activePetId],
          weight,
          isSick,
          sickStartTimestamp: isSick ? Date.now() : null,
        },
      },
    });
  }
}

// ============================================
// BCT-P10D-001: Constants Verification
// ============================================

describe('BCT-P10D-001: Constants Verification', () => {
  it('MINIGAME_GATING.OBESE_THRESHOLD should be 81 per Bible', () => {
    expect(MINIGAME_GATING.OBESE_THRESHOLD).toBe(81);
  });
});

// ============================================
// BCT-P10D-002-008: Gating Logic Tests (Classic Mode)
// ============================================

describe('BCT-P10D: Gating Logic - Classic Mode', () => {
  beforeEach(() => {
    resetStore();
  });

  it('BCT-P10D-002: Classic + sick pet (isSick=true, weight=50) → blocked with reason "sick"', () => {
    const result = getMinigameGateReason({ isSick: true, weight: 50 }, 'classic');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe('sick');
    }
  });

  it('BCT-P10D-003: Classic + obese pet (isSick=false, weight=81) → blocked with reason "obese"', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 81 }, 'classic');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe('obese');
    }
  });

  it('BCT-P10D-004: Classic + obese pet (isSick=false, weight=100) → blocked with reason "obese"', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 100 }, 'classic');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe('obese');
    }
  });

  it('BCT-P10D-005: Classic + overweight pet (isSick=false, weight=80) → ALLOWED (overweight ≠ obese)', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 80 }, 'classic');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-006: Classic + overweight pet (isSick=false, weight=61) → ALLOWED', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 61 }, 'classic');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-007: Classic + healthy pet (isSick=false, weight=50) → allowed', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 50 }, 'classic');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-008: Classic + sick AND obese pet → blocked with reason "sick" (sick checked first)', () => {
    const result = getMinigameGateReason({ isSick: true, weight: 90 }, 'classic');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      // Gate order: sick is checked before obese
      expect(result.reason).toBe('sick');
    }
  });
});

// ============================================
// BCT-P10D-009-012: Gating Logic Tests (Cozy Mode - ALL ALLOWED)
// ============================================

describe('BCT-P10D: Gating Logic - Cozy Mode (All Allowed)', () => {
  beforeEach(() => {
    resetStore();
  });

  it('BCT-P10D-009: Cozy + sick pet → ALLOWED (Cozy immune to sickness gate)', () => {
    const result = getMinigameGateReason({ isSick: true, weight: 50 }, 'cozy');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-010: Cozy + obese pet (weight=100) → ALLOWED (Cozy immune to weight gate)', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 100 }, 'cozy');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-011: Cozy + sick AND obese pet → ALLOWED', () => {
    const result = getMinigameGateReason({ isSick: true, weight: 95 }, 'cozy');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-012: Cozy + healthy pet → allowed', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 30 }, 'cozy');
    expect(result.allowed).toBe(true);
  });
});

// ============================================
// BCT-P10D-013-016: Store Integration Tests (canPlay)
// ============================================

describe('BCT-P10D: Store Integration (canPlay)', () => {
  beforeEach(() => {
    resetStore();
  });

  it('BCT-P10D-013: canPlay returns blocked when pet is sick (Classic)', () => {
    setupPetState(50, true, 'classic');
    const result = useGameStore.getState().canPlay('snack_catch');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Your pet is sick');
  });

  it('BCT-P10D-014: canPlay returns blocked when pet is obese (Classic)', () => {
    setupPetState(85, false, 'classic');
    const result = useGameStore.getState().canPlay('snack_catch');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Your pet is too heavy');
  });

  it('BCT-P10D-015: canPlay returns allowed when pet is overweight but not obese (Classic)', () => {
    setupPetState(75, false, 'classic');
    const result = useGameStore.getState().canPlay('snack_catch');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-016: canPlay returns allowed when pet is sick in Cozy mode', () => {
    setupPetState(50, true, 'cozy');
    const result = useGameStore.getState().canPlay('snack_catch');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-017: canPlay returns allowed when pet is obese in Cozy mode', () => {
    setupPetState(100, false, 'cozy');
    const result = useGameStore.getState().canPlay('snack_catch');
    expect(result.allowed).toBe(true);
  });
});

// ============================================
// BCT-P10D-018-020: Regression Guards
// ============================================

describe('BCT-P10D: Regression Guards', () => {
  beforeEach(() => {
    resetStore();
  });

  it('BCT-P10D-018: Gating check does not modify pet state (no side effects)', () => {
    setupPetState(50, true, 'classic');

    const stateBefore = useGameStore.getState();
    const petBefore = stateBefore.petsById[stateBefore.activePetId];
    const weightBefore = petBefore?.weight;
    const isSickBefore = petBefore?.isSick;

    // Call canPlay multiple times
    useGameStore.getState().canPlay('snack_catch');
    useGameStore.getState().canPlay('memory_match');
    useGameStore.getState().canPlay('pips');

    const stateAfter = useGameStore.getState();
    const petAfter = stateAfter.petsById[stateAfter.activePetId];

    expect(petAfter?.weight).toBe(weightBefore);
    expect(petAfter?.isSick).toBe(isSickBefore);
  });

  it('BCT-P10D-019: Gating check does not consume energy', () => {
    setupPetState(50, true, 'classic');

    const energyBefore = useGameStore.getState().energy.current;

    // Call canPlay multiple times
    useGameStore.getState().canPlay('snack_catch');
    useGameStore.getState().canPlay('memory_match');

    const energyAfter = useGameStore.getState().energy.current;
    expect(energyAfter).toBe(energyBefore);
  });

  it('BCT-P10D-020: Gating check is deterministic (same input = same output)', () => {
    // Test helper function determinism
    const pet = { isSick: true, weight: 85 };

    const result1 = getMinigameGateReason(pet, 'classic');
    const result2 = getMinigameGateReason(pet, 'classic');
    const result3 = getMinigameGateReason(pet, 'classic');

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
    expect(result1.allowed).toBe(false);
    if (!result1.allowed) {
      expect(result1.reason).toBe('sick'); // Sick checked first
    }
  });
});

// ============================================
// BCT-P10D-021: Weight Threshold Edge Cases
// ============================================

describe('BCT-P10D: Weight Threshold Edge Cases', () => {
  it('BCT-P10D-021: weight=80 (overweight max) → ALLOWED', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 80 }, 'classic');
    expect(result.allowed).toBe(true);
  });

  it('BCT-P10D-022: weight=81 (obese min) → BLOCKED', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 81 }, 'classic');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe('obese');
    }
  });

  it('BCT-P10D-023: weight=0 (normal min) → ALLOWED', () => {
    const result = getMinigameGateReason({ isSick: false, weight: 0 }, 'classic');
    expect(result.allowed).toBe(true);
  });
});
