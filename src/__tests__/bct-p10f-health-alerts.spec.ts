/**
 * BCT P10-F: Health Alerts Tests (Bible v1.8 §11.6.1)
 *
 * Tests for weight and sickness alert computation.
 * Pure function testing - no store mutations.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §11.6.1
 */

import { describe, it, expect } from 'vitest';
import {
  computeHealthAlerts,
  computeNextAlertState,
  getInitialAlertState,
  alertAppliesToMode,
  getHealthAlertBadge,
  getPetsWithHealthBadges,
  type HealthAlertResult,
  type PetAlertTrackingState,
} from '../game/healthAlerts';
import {
  HEALTH_ALERT_THRESHOLDS,
  HEALTH_ALERT_CONFIGS,
  type HealthAlertId,
} from '../constants/bible.constants';
import type { OwnedPetState, PlayMode, PetInstanceId } from '../types';

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * Create a test pet with overrides.
 */
const createTestPet = (overrides?: Partial<OwnedPetState>): OwnedPetState => ({
  id: 'munchlet',
  customName: undefined,
  level: 1,
  xp: 0,
  bond: 50,
  mood: 'happy',
  moodValue: 70,
  hunger: 50,
  evolutionStage: 'baby',
  instanceId: 'munchlet-001' as PetInstanceId,
  speciesId: 'munchlet' as OwnedPetState['speciesId'],
  weight: 0,
  isSick: false,
  sickStartTimestamp: null,
  hungerZeroMinutesAccum: 0,
  poopDirtyMinutesAccum: 0,
  offlineSickCareMistakesAccruedThisSession: 0,
  isPoopDirty: false,
  poopDirtyStartTimestamp: null,
  feedingsSinceLastPoop: 0,
  ...overrides,
});

const NOW_MS = Date.now();

// ============================================================================
// P10-F-001: HEALTH_ALERT_THRESHOLDS Bible Compliance
// ============================================================================

describe('P10-F-001: HEALTH_ALERT_THRESHOLDS Bible Compliance', () => {
  it('BCT-P10F-001: OBESE_WEIGHT threshold is 81', () => {
    expect(HEALTH_ALERT_THRESHOLDS.OBESE_WEIGHT).toBe(81);
  });

  it('BCT-P10F-002: SICKNESS_REMINDER_MINUTES threshold is 30', () => {
    expect(HEALTH_ALERT_THRESHOLDS.SICKNESS_REMINDER_MINUTES).toBe(30);
  });
});

// ============================================================================
// P10-F-002: Weight Alert - weight_warning_obese
// ============================================================================

describe('P10-F-002: Weight Alert - weight_warning_obese', () => {
  it('BCT-P10F-003: weight >= 81 triggers weight_warning_obese alert', () => {
    const pet = createTestPet({ weight: 81 });
    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    const obeseAlert = alerts.find(a => a.id === 'weight_warning_obese');
    expect(obeseAlert).toBeDefined();
    expect(obeseAlert?.showToast).toBe(true);
    expect(obeseAlert?.showBadge).toBe(false); // Toast only per Bible
  });

  it('BCT-P10F-004: weight = 80 does NOT trigger weight_warning_obese', () => {
    const pet = createTestPet({ weight: 80 });
    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    const obeseAlert = alerts.find(a => a.id === 'weight_warning_obese');
    expect(obeseAlert).toBeUndefined();
  });

  it('BCT-P10F-005: weight_warning_obese triggers in both Cozy and Classic modes', () => {
    const pet = createTestPet({ weight: 85 });

    const classicAlerts = computeHealthAlerts(pet, 'classic', NOW_MS);
    const cozyAlerts = computeHealthAlerts(pet, 'cozy', NOW_MS);

    expect(classicAlerts.find(a => a.id === 'weight_warning_obese')).toBeDefined();
    expect(cozyAlerts.find(a => a.id === 'weight_warning_obese')).toBeDefined();
  });

  it('BCT-P10F-006: weight_warning_obese has toast message', () => {
    const pet = createTestPet({ weight: 90 });
    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    const obeseAlert = alerts.find(a => a.id === 'weight_warning_obese');
    expect(obeseAlert?.toastMessage).toBeDefined();
    expect(obeseAlert?.toastMessage).toContain('overweight');
  });
});

// ============================================================================
// P10-F-003: Weight Alert - weight_recovery
// ============================================================================

describe('P10-F-003: Weight Alert - weight_recovery', () => {
  it('BCT-P10F-007: weight dropping below 81 triggers weight_recovery (one-time)', () => {
    const pet = createTestPet({ weight: 75 }); // Now below threshold
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: true }, // Was obese before
      sickness: { sickOnsetFired: false },
    };

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);

    const recoveryAlert = alerts.find(a => a.id === 'weight_recovery');
    expect(recoveryAlert).toBeDefined();
    expect(recoveryAlert?.showToast).toBe(true);
  });

  it('BCT-P10F-008: weight below 81 without prior obese does NOT trigger weight_recovery', () => {
    const pet = createTestPet({ weight: 50 });
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: false }, // Was NOT obese
      sickness: { sickOnsetFired: false },
    };

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);

    const recoveryAlert = alerts.find(a => a.id === 'weight_recovery');
    expect(recoveryAlert).toBeUndefined();
  });

  it('BCT-P10F-009: weight_recovery triggers in both modes', () => {
    const pet = createTestPet({ weight: 70 });
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: true },
      sickness: { sickOnsetFired: false },
    };

    const classicAlerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);
    const cozyAlerts = computeHealthAlerts(pet, 'cozy', NOW_MS, prevState);

    expect(classicAlerts.find(a => a.id === 'weight_recovery')).toBeDefined();
    expect(cozyAlerts.find(a => a.id === 'weight_recovery')).toBeDefined();
  });
});

// ============================================================================
// P10-F-004: Sickness Alert - sickness_onset
// ============================================================================

describe('P10-F-004: Sickness Alert - sickness_onset', () => {
  it('BCT-P10F-010: isSick=true in Classic triggers sickness_onset (first time)', () => {
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: NOW_MS,
    });

    // No previous state = first time seeing this pet
    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    const sickAlert = alerts.find(a => a.id === 'sickness_onset');
    expect(sickAlert).toBeDefined();
    expect(sickAlert?.showToast).toBe(true);
    expect(sickAlert?.showBadge).toBe(true); // Toast + badge per Bible
  });

  it('BCT-P10F-011: sickness_onset does NOT fire again if already fired', () => {
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: NOW_MS - 10 * 60 * 1000, // Sick for 10 min
    });
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: false },
      sickness: { sickOnsetFired: true }, // Already fired
    };

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);

    const sickAlert = alerts.find(a => a.id === 'sickness_onset');
    expect(sickAlert).toBeUndefined();
  });

  it('BCT-P10F-012: sickness_onset does NOT trigger in Cozy mode', () => {
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: NOW_MS,
    });

    const alerts = computeHealthAlerts(pet, 'cozy', NOW_MS);

    const sickAlert = alerts.find(a => a.id === 'sickness_onset');
    expect(sickAlert).toBeUndefined();
  });

  it('BCT-P10F-013: sickness_onset has toast message about medicine', () => {
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: NOW_MS,
    });

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    const sickAlert = alerts.find(a => a.id === 'sickness_onset');
    expect(sickAlert?.toastMessage).toContain('medicine');
  });
});

// ============================================================================
// P10-F-005: Sickness Alert - sickness_reminder
// ============================================================================

describe('P10-F-005: Sickness Alert - sickness_reminder', () => {
  it('BCT-P10F-014: sickness_reminder shows badge after 30+ minutes sick', () => {
    const sickStartMs = NOW_MS - 35 * 60 * 1000; // 35 min ago
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: sickStartMs,
    });
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: false },
      sickness: { sickOnsetFired: true }, // Onset already fired
    };

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);

    const reminderAlert = alerts.find(a => a.id === 'sickness_reminder');
    expect(reminderAlert).toBeDefined();
    expect(reminderAlert?.showBadge).toBe(true);
    expect(reminderAlert?.showToast).toBe(false); // Badge only
  });

  it('BCT-P10F-015: sickness_reminder does NOT show at 29 minutes', () => {
    const sickStartMs = NOW_MS - 29 * 60 * 1000; // 29 min ago
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: sickStartMs,
    });
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: false },
      sickness: { sickOnsetFired: true },
    };

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS, prevState);

    const reminderAlert = alerts.find(a => a.id === 'sickness_reminder');
    expect(reminderAlert).toBeUndefined();
  });

  it('BCT-P10F-016: sickness_reminder does NOT trigger in Cozy mode', () => {
    const sickStartMs = NOW_MS - 60 * 60 * 1000; // 60 min ago
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: sickStartMs,
    });

    const alerts = computeHealthAlerts(pet, 'cozy', NOW_MS);

    const reminderAlert = alerts.find(a => a.id === 'sickness_reminder');
    expect(reminderAlert).toBeUndefined();
  });
});

// ============================================================================
// P10-F-006: Alert State Tracking
// ============================================================================

describe('P10-F-006: Alert State Tracking', () => {
  it('BCT-P10F-017: computeNextAlertState tracks wasObese correctly', () => {
    const pet = createTestPet({ weight: 85 });
    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);
    const nextState = computeNextAlertState(pet, undefined, alerts);

    expect(nextState.weight.wasObese).toBe(true);
  });

  it('BCT-P10F-018: computeNextAlertState resets sickOnsetFired when pet recovers', () => {
    const pet = createTestPet({ isSick: false }); // No longer sick
    const prevState: PetAlertTrackingState = {
      weight: { wasObese: false },
      sickness: { sickOnsetFired: true }, // Was sick before
    };

    const nextState = computeNextAlertState(pet, prevState, []);

    expect(nextState.sickness.sickOnsetFired).toBe(false);
  });

  it('BCT-P10F-019: getInitialAlertState marks existing sick pet as onset fired', () => {
    const pet = createTestPet({
      isSick: true,
      sickStartTimestamp: NOW_MS,
    });

    const initialState = getInitialAlertState(pet);

    // If pet starts sick, treat as already known (no duplicate onset toast)
    expect(initialState.sickness.sickOnsetFired).toBe(true);
  });
});

// ============================================================================
// P10-F-007: Alert Config Mode Scope
// ============================================================================

describe('P10-F-007: Alert Config Mode Scope', () => {
  it('BCT-P10F-020: weight_warning_obese applies to both modes', () => {
    const config = HEALTH_ALERT_CONFIGS.weight_warning_obese;

    expect(alertAppliesToMode(config, 'classic')).toBe(true);
    expect(alertAppliesToMode(config, 'cozy')).toBe(true);
  });

  it('BCT-P10F-021: sickness_onset applies only to Classic', () => {
    const config = HEALTH_ALERT_CONFIGS.sickness_onset;

    expect(alertAppliesToMode(config, 'classic')).toBe(true);
    expect(alertAppliesToMode(config, 'cozy')).toBe(false);
  });

  it('BCT-P10F-022: sickness_reminder applies only to Classic', () => {
    const config = HEALTH_ALERT_CONFIGS.sickness_reminder;

    expect(alertAppliesToMode(config, 'classic')).toBe(true);
    expect(alertAppliesToMode(config, 'cozy')).toBe(false);
  });
});

// ============================================================================
// P10-F-008: Health Alert Badges
// ============================================================================

describe('P10-F-008: Health Alert Badges', () => {
  it('BCT-P10F-023: sickness alerts return medical badge emoji', () => {
    expect(getHealthAlertBadge('sickness_onset')).toBe('🏥');
    expect(getHealthAlertBadge('sickness_reminder')).toBe('🏥');
  });

  it('BCT-P10F-024: weight alerts return null (no badge)', () => {
    expect(getHealthAlertBadge('weight_warning_obese')).toBeNull();
    expect(getHealthAlertBadge('weight_recovery')).toBeNull();
  });
});

// ============================================================================
// P10-F-009: Multi-Pet Health Badge Aggregation
// ============================================================================

describe('P10-F-009: Multi-Pet Health Badge Aggregation', () => {
  it('BCT-P10F-025: getPetsWithHealthBadges returns pets with sickness badges', () => {
    const sickPet = createTestPet({
      instanceId: 'grib-001' as PetInstanceId,
      id: 'grib',
      speciesId: 'grib' as OwnedPetState['speciesId'],
      isSick: true,
      sickStartTimestamp: NOW_MS - 35 * 60 * 1000, // 35 min ago
    });
    const healthyPet = createTestPet({
      instanceId: 'munchlet-001' as PetInstanceId,
      isSick: false,
    });

    const petsById: Record<PetInstanceId, OwnedPetState> = {
      'grib-001': sickPet,
      'munchlet-001': healthyPet,
    };
    const alertStateByPet: Record<PetInstanceId, PetAlertTrackingState> = {
      'grib-001': { weight: { wasObese: false }, sickness: { sickOnsetFired: true } },
      'munchlet-001': { weight: { wasObese: false }, sickness: { sickOnsetFired: false } },
    };

    const petsWithBadges = getPetsWithHealthBadges(petsById, 'classic', NOW_MS, alertStateByPet);

    expect(petsWithBadges).toContain('grib-001');
    expect(petsWithBadges).not.toContain('munchlet-001');
  });

  it('BCT-P10F-026: getPetsWithHealthBadges returns empty in Cozy mode', () => {
    const sickPet = createTestPet({
      instanceId: 'grib-001' as PetInstanceId,
      isSick: true,
      sickStartTimestamp: NOW_MS - 60 * 60 * 1000,
    });

    const petsById: Record<PetInstanceId, OwnedPetState> = {
      'grib-001': sickPet,
    };
    const alertStateByPet: Record<PetInstanceId, PetAlertTrackingState> = {
      'grib-001': { weight: { wasObese: false }, sickness: { sickOnsetFired: true } },
    };

    // Cozy mode - sickness badges don't show
    const petsWithBadges = getPetsWithHealthBadges(petsById, 'cozy', NOW_MS, alertStateByPet);

    expect(petsWithBadges).toHaveLength(0);
  });
});

// ============================================================================
// P10-F-010: No Alerts When Pet Is Healthy
// ============================================================================

describe('P10-F-010: No Alerts When Pet Is Healthy', () => {
  it('BCT-P10F-027: healthy pet in Classic mode returns no alerts', () => {
    const pet = createTestPet({
      weight: 30,
      isSick: false,
    });

    const alerts = computeHealthAlerts(pet, 'classic', NOW_MS);

    expect(alerts).toHaveLength(0);
  });

  it('BCT-P10F-028: healthy pet in Cozy mode returns no alerts', () => {
    const pet = createTestPet({
      weight: 30,
      isSick: false,
    });

    const alerts = computeHealthAlerts(pet, 'cozy', NOW_MS);

    expect(alerts).toHaveLength(0);
  });
});
