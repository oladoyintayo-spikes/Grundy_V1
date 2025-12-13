/**
 * P10-F: Health Alerts Engine (Bible v1.8 §11.6.1)
 *
 * Pure functions for computing health alerts based on pet state.
 * No side effects - returns data structures only.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §11.6.1
 */

import type { OwnedPetState, PlayMode, PetInstanceId } from '../types';
import {
  HEALTH_ALERT_THRESHOLDS,
  HEALTH_ALERT_CONFIGS,
  type HealthAlertId,
  type HealthAlertConfig,
} from '../constants/bible.constants';

/**
 * Health alert result from computation.
 * Pure data structure - no side effects.
 */
export interface HealthAlertResult {
  id: HealthAlertId;
  petId: PetInstanceId;
  label: string;
  toastMessage?: string;
  showBadge: boolean;
  showToast: boolean;
}

/**
 * State needed to track weight transitions for weight_recovery alert.
 * The weight_recovery alert is one-time when weight drops below threshold.
 */
export interface WeightAlertState {
  /** Whether pet was previously obese (weight >= 81) */
  wasObese: boolean;
}

/**
 * State needed to track sickness transitions for sickness_onset alert.
 * The sickness_onset alert fires once when pet becomes sick.
 */
export interface SicknessAlertState {
  /** Whether sickness_onset has already fired for current sick period */
  sickOnsetFired: boolean;
}

/**
 * Combined alert tracking state for a pet.
 */
export interface PetAlertTrackingState {
  weight: WeightAlertState;
  sickness: SicknessAlertState;
}

/**
 * Compute current health alerts for a pet.
 * Pure function - no side effects.
 *
 * @param pet Pet state to evaluate
 * @param mode Current play mode (cozy or classic)
 * @param nowMs Current timestamp in milliseconds
 * @param prevState Previous alert tracking state (for transition detection)
 * @returns Array of active health alerts
 */
export function computeHealthAlerts(
  pet: OwnedPetState,
  mode: PlayMode,
  nowMs: number,
  prevState?: PetAlertTrackingState
): HealthAlertResult[] {
  const alerts: HealthAlertResult[] = [];
  const isClassic = mode === 'classic';

  // --- Weight Alerts (Both Modes) ---

  // weight_warning_obese: weight >= 81
  if (pet.weight >= HEALTH_ALERT_THRESHOLDS.OBESE_WEIGHT) {
    const config = HEALTH_ALERT_CONFIGS.weight_warning_obese;
    alerts.push({
      id: 'weight_warning_obese',
      petId: pet.instanceId,
      label: config.label,
      toastMessage: config.toastMessage,
      showBadge: config.showBadge,
      showToast: true, // Toast on trigger
    });
  }

  // weight_recovery: weight drops below 81 (one-time transition)
  // Only fires if previously was obese and now is not
  if (
    prevState?.weight.wasObese &&
    pet.weight < HEALTH_ALERT_THRESHOLDS.OBESE_WEIGHT
  ) {
    const config = HEALTH_ALERT_CONFIGS.weight_recovery;
    alerts.push({
      id: 'weight_recovery',
      petId: pet.instanceId,
      label: config.label,
      toastMessage: config.toastMessage,
      showBadge: config.showBadge,
      showToast: true, // One-time toast
    });
  }

  // --- Sickness Alerts (Classic Mode Only) ---

  if (isClassic && pet.isSick) {
    // sickness_onset: fires once when pet becomes sick
    if (!prevState?.sickness.sickOnsetFired) {
      const config = HEALTH_ALERT_CONFIGS.sickness_onset;
      alerts.push({
        id: 'sickness_onset',
        petId: pet.instanceId,
        label: config.label,
        toastMessage: config.toastMessage,
        showBadge: config.showBadge,
        showToast: true, // Toast + badge on onset
      });
    }

    // sickness_reminder: badge only after 30+ minutes sick
    if (pet.sickStartTimestamp !== null) {
      const sickMinutes = (nowMs - pet.sickStartTimestamp) / (60 * 1000);
      if (sickMinutes >= HEALTH_ALERT_THRESHOLDS.SICKNESS_REMINDER_MINUTES) {
        const config = HEALTH_ALERT_CONFIGS.sickness_reminder;
        alerts.push({
          id: 'sickness_reminder',
          petId: pet.instanceId,
          label: config.label,
          // No toast for reminder
          showBadge: config.showBadge,
          showToast: false,
        });
      }
    }
  }

  return alerts;
}

/**
 * Compute new alert tracking state from current pet state.
 * Used to track transitions for one-time alerts.
 *
 * @param pet Current pet state
 * @param prevState Previous tracking state
 * @param alertsFired Alerts that were fired this computation
 * @returns Updated tracking state
 */
export function computeNextAlertState(
  pet: OwnedPetState,
  prevState: PetAlertTrackingState | undefined,
  alertsFired: HealthAlertResult[]
): PetAlertTrackingState {
  const sickOnsetFired =
    alertsFired.some(a => a.id === 'sickness_onset') ||
    (prevState?.sickness.sickOnsetFired ?? false);

  return {
    weight: {
      wasObese: pet.weight >= HEALTH_ALERT_THRESHOLDS.OBESE_WEIGHT,
    },
    sickness: {
      // Reset sickOnsetFired when pet is no longer sick
      sickOnsetFired: pet.isSick ? sickOnsetFired : false,
    },
  };
}

/**
 * Get initial alert tracking state for a pet.
 * Used when no previous state exists.
 *
 * @param pet Current pet state
 * @returns Initial tracking state
 */
export function getInitialAlertState(pet: OwnedPetState): PetAlertTrackingState {
  return {
    weight: {
      wasObese: pet.weight >= HEALTH_ALERT_THRESHOLDS.OBESE_WEIGHT,
    },
    sickness: {
      // If pet starts sick, don't fire onset (treat as already known)
      sickOnsetFired: pet.isSick,
    },
  };
}

/**
 * Check if an alert config applies to the current mode.
 *
 * @param config Alert configuration
 * @param mode Current play mode
 * @returns True if alert applies to this mode
 */
export function alertAppliesToMode(
  config: HealthAlertConfig,
  mode: PlayMode
): boolean {
  if (config.modeScope === 'both') return true;
  if (config.modeScope === 'classic' && mode === 'classic') return true;
  return false;
}

/**
 * Get the appropriate badge emoji for a health alert.
 * Per Bible §11.6.1: Sickness uses 🏥 badge.
 *
 * @param alertId Health alert identifier
 * @returns Badge emoji or null if no badge
 */
export function getHealthAlertBadge(alertId: HealthAlertId): string | null {
  switch (alertId) {
    case 'sickness_onset':
    case 'sickness_reminder':
      return '🏥'; // Medical badge for sickness
    case 'weight_warning_obese':
    case 'weight_recovery':
      return null; // No badge for weight alerts (toast only)
    default:
      return null;
  }
}

/**
 * Aggregate health alerts for multi-pet badge display.
 * Returns pets that need attention due to health issues.
 *
 * @param petsById All owned pets
 * @param mode Current play mode
 * @param nowMs Current timestamp
 * @param alertStateByPet Alert tracking state by pet ID
 * @returns Array of pet IDs with active health badges
 */
export function getPetsWithHealthBadges(
  petsById: Record<PetInstanceId, OwnedPetState>,
  mode: PlayMode,
  nowMs: number,
  alertStateByPet: Record<PetInstanceId, PetAlertTrackingState>
): PetInstanceId[] {
  const petsWithBadges: PetInstanceId[] = [];

  for (const [petId, pet] of Object.entries(petsById)) {
    const alerts = computeHealthAlerts(
      pet,
      mode,
      nowMs,
      alertStateByPet[petId]
    );

    // Check if any alert should show a badge
    const hasBadge = alerts.some(alert => alert.showBadge);
    if (hasBadge) {
      petsWithBadges.push(petId as PetInstanceId);
    }
  }

  return petsWithBadges;
}
