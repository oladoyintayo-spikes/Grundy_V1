/**
 * P10-B: Offline Weight & Sickness Order-of-Application
 * Bible v1.8 §9.4.6, §9.4.7
 *
 * Implements the offline calculation order for weight decay, sickness triggers,
 * sickness effects, and care mistake accumulation.
 */

import type { OwnedPetState } from '../types';
import { OFFLINE_DECAY_RATES, SICKNESS_CONFIG, isClassicMode, type GameMode } from '../constants/bible.constants';
import { randomFloat } from './rng';
import { nowMs } from './time';

// ============================================
// P10-B: OFFLINE SESSION BOUNDARIES
// Bible v1.8 §9.4.6, §9.4.7
// ============================================

/**
 * Maximum offline duration in minutes (14-day cap).
 * Bible v1.8 §9.4.6: "Cap elapsed time at 14 days"
 */
export const MAX_OFFLINE_MINUTES = OFFLINE_DECAY_RATES.MAX_OFFLINE_DAYS * 24 * 60;

/**
 * Calculate the offline duration in minutes, applying the 14-day cap.
 * Bible v1.8 §9.4.6: "Cap elapsed time at 14 days"
 *
 * @param lastSeenTimestamp - Timestamp when player was last active
 * @param nowTimestamp - Current timestamp (optional, defaults to nowMs())
 * @returns Offline duration in minutes, capped at 14 days
 */
export function calculateOfflineDurationMinutes(
  lastSeenTimestamp: number,
  nowTimestamp: number = nowMs()
): number {
  const elapsedMs = nowTimestamp - lastSeenTimestamp;
  if (elapsedMs <= 0) return 0;

  const elapsedMinutes = elapsedMs / (1000 * 60);
  return Math.min(elapsedMinutes, MAX_OFFLINE_MINUTES);
}

// ============================================
// P10-B: WEIGHT DECAY (BOTH MODES)
// Bible v1.8 §9.4.7.1
// ============================================

/**
 * Apply weight decay for offline duration.
 * Bible v1.8 §9.4.7.1: -1 point per hour, floor 0
 *
 * Weight decay runs in BOTH Cozy and Classic modes.
 *
 * @param currentWeight - Current weight value (0-100)
 * @param offlineMinutes - Minutes offline (already capped)
 * @returns New weight value
 */
export function applyWeightDecay(
  currentWeight: number,
  offlineMinutes: number
): number {
  const hoursOffline = offlineMinutes / 60;
  const decay = Math.floor(hoursOffline) * OFFLINE_DECAY_RATES.WEIGHT_PER_HOUR;
  return Math.max(OFFLINE_DECAY_RATES.WEIGHT_FLOOR, currentWeight - decay);
}

// ============================================
// P10-B: SICKNESS TRIGGERS (CLASSIC ONLY)
// Bible v1.8 §9.4.7.2, §9.4.7.3
// ============================================

/**
 * Result of sickness trigger evaluation.
 */
export interface SicknessTriggerResult {
  /** Whether the pet became sick from this evaluation */
  becameSick: boolean;
  /** Trigger that caused sickness (if any) */
  trigger: 'hunger' | 'poop' | null;
  /** Updated hunger timer accumulator */
  newHungerZeroMinutesAccum: number;
  /** Updated poop timer accumulator */
  newPoopDirtyMinutesAccum: number;
}

/**
 * Evaluate sickness triggers based on conditions at save time.
 * Bible v1.8 §9.4.7.3: "Check sickness trigger conditions at save time"
 *
 * IMPORTANT: This evaluates whether conditions EXISTED at save time.
 * For P10-B, we check if accumulators have built up enough to trigger.
 *
 * @param hungerAtSave - Was hunger = 0 at save time?
 * @param poopAtSave - Was poop uncleaned at save time?
 * @param currentHungerAccum - Current hunger=0 timer accumulator
 * @param currentPoopAccum - Current poop uncleaned timer accumulator
 * @param offlineMinutes - Minutes offline
 * @returns Trigger evaluation result
 */
export function evaluateSicknessTriggers(
  hungerAtSave: boolean,
  poopAtSave: boolean,
  currentHungerAccum: number,
  currentPoopAccum: number,
  offlineMinutes: number
): SicknessTriggerResult {
  let newHungerAccum = currentHungerAccum;
  let newPoopAccum = currentPoopAccum;
  let becameSick = false;
  let trigger: 'hunger' | 'poop' | null = null;

  // Accumulate hunger=0 timer if condition was true at save
  if (hungerAtSave) {
    newHungerAccum += offlineMinutes;

    // Check if threshold met
    if (newHungerAccum >= SICKNESS_CONFIG.HUNGER_TRIGGER_MINUTES) {
      // Roll sickness chance (Bible: "roll sickness chance once")
      const roll = randomFloat();
      if (roll < SICKNESS_CONFIG.HUNGER_TRIGGER_CHANCE) {
        becameSick = true;
        trigger = 'hunger';
      }
      // Bible §9.4.7.2: "After roll (pass or fail), timer resets for that trigger type"
      newHungerAccum = 0;
    }
  }

  // Accumulate poop timer if condition was true at save
  if (poopAtSave && !becameSick) {
    newPoopAccum += offlineMinutes;

    // Check if threshold met
    if (newPoopAccum >= SICKNESS_CONFIG.POOP_TRIGGER_MINUTES) {
      // Roll sickness chance
      const roll = randomFloat();
      if (roll < SICKNESS_CONFIG.POOP_TRIGGER_CHANCE) {
        becameSick = true;
        trigger = 'poop';
      }
      // Timer resets after roll
      newPoopAccum = 0;
    }
  }

  return {
    becameSick,
    trigger,
    newHungerZeroMinutesAccum: newHungerAccum,
    newPoopDirtyMinutesAccum: newPoopAccum,
  };
}

// ============================================
// P10-B: SICKNESS EFFECTS (CLASSIC ONLY)
// Bible v1.8 §9.4.7.2
// ============================================

/**
 * Calculate sick duration in minutes.
 * Uses sickStartTimestamp to determine how long the pet has been sick.
 *
 * @param sickStartTimestamp - When the pet became sick (null if not sick)
 * @param currentTimestamp - Current timestamp
 * @returns Minutes sick, or 0 if not sick
 */
export function calculateSickDurationMinutes(
  sickStartTimestamp: number | null,
  currentTimestamp: number = nowMs()
): number {
  if (sickStartTimestamp === null) return 0;
  const elapsedMs = currentTimestamp - sickStartTimestamp;
  return Math.max(0, elapsedMs / (1000 * 60));
}

/**
 * Result of sickness effects application.
 */
export interface SicknessEffectsResult {
  /** Additional care mistakes accrued */
  careMistakesAdded: number;
  /** Updated offline care mistakes counter */
  newOfflineSickCareMistakesAccruedThisSession: number;
}

/**
 * Apply sickness effects for offline duration.
 * Bible v1.8 §9.4.7.2: "+1 care mistake per hour untreated"
 *
 * @param sickDurationMinutes - How long the pet was sick during offline period
 * @param currentOfflineCareMistakes - Current session's offline care mistakes
 * @returns Effects result with care mistakes added
 */
export function applySicknessEffects(
  sickDurationMinutes: number,
  currentOfflineCareMistakes: number
): SicknessEffectsResult {
  // Calculate care mistakes: +1 per hour sick (Bible §9.4.7.2)
  const sickHours = Math.floor(sickDurationMinutes / 60);
  const potentialMistakes = sickHours * SICKNESS_CONFIG.CARE_MISTAKES_PER_HOUR;

  // Apply offline cap: max 4 per session (Bible §9.4.7.2)
  const remainingCapacity = SICKNESS_CONFIG.CARE_MISTAKES_OFFLINE_CAP - currentOfflineCareMistakes;
  const careMistakesAdded = Math.min(potentialMistakes, Math.max(0, remainingCapacity));

  return {
    careMistakesAdded,
    newOfflineSickCareMistakesAccruedThisSession: currentOfflineCareMistakes + careMistakesAdded,
  };
}

// ============================================
// P10-B: FULL OFFLINE APPLICATION ORDER
// Bible v1.8 §9.4.6, §9.4.7.3
// ============================================

/**
 * Input parameters for offline order-of-application.
 */
export interface OfflineOrderInput {
  /** The pet to process */
  pet: OwnedPetState;
  /** Minutes offline (already capped at 14 days) */
  offlineMinutes: number;
  /** Game mode (cozy/classic) */
  gameMode: GameMode;
  /** Was hunger=0 at save time? (for sickness trigger) */
  hungerWasZeroAtSave: boolean;
  /** Was poop uncleaned at save time? (for sickness trigger) */
  poopWasUncleanedAtSave: boolean;
  /** Current timestamp (for sick duration calculation) */
  currentTimestamp?: number;
}

/**
 * Result of offline order-of-application.
 */
export interface OfflineOrderResult {
  /** Updated pet state */
  pet: OwnedPetState;
  /** Weight change applied */
  weightChange: number;
  /** Whether pet became sick during offline */
  becameSick: boolean;
  /** Trigger that caused sickness (if any) */
  sicknessTrigger: 'hunger' | 'poop' | null;
  /** Care mistakes added during offline */
  careMistakesAdded: number;
  /** Was Cozy mode short-circuit applied? */
  cozyShortCircuit: boolean;
}

/**
 * Apply the full offline order-of-application to a pet.
 * Bible v1.8 §9.4.6, §9.4.7.3
 *
 * Order:
 * 1. Apply weight decay (-1/hr) - BOTH modes
 * 2. (Classic only) Check sickness trigger conditions
 * 3. (Classic only) If sick: add care mistakes (capped at 4/session)
 *
 * @param input - Offline order input parameters
 * @returns Result with updated pet and changes summary
 */
export function applyOfflineOrderToPet(input: OfflineOrderInput): OfflineOrderResult {
  const {
    pet,
    offlineMinutes,
    gameMode,
    hungerWasZeroAtSave,
    poopWasUncleanedAtSave,
    currentTimestamp = nowMs(),
  } = input;

  let updatedPet = { ...pet };
  let weightChange = 0;
  let becameSick = false;
  let sicknessTrigger: 'hunger' | 'poop' | null = null;
  let careMistakesAdded = 0;
  const cozyShortCircuit = !isClassicMode(gameMode);

  // Step 1: Apply weight decay (BOTH modes)
  // Bible v1.8 §9.4.7.1: Weight decay -1/hr runs offline
  const originalWeight = pet.weight;
  const newWeight = applyWeightDecay(originalWeight, offlineMinutes);
  weightChange = newWeight - originalWeight;
  updatedPet.weight = newWeight;

  // Cozy Mode short-circuit: skip sickness logic
  // Bible v1.8 §9.3: "Pet cannot get sick (sickness system disabled)"
  if (cozyShortCircuit) {
    // Reset session counter on offline return (session boundary)
    updatedPet.offlineSickCareMistakesAccruedThisSession = 0;
    return {
      pet: updatedPet,
      weightChange,
      becameSick: false,
      sicknessTrigger: null,
      careMistakesAdded: 0,
      cozyShortCircuit: true,
    };
  }

  // Classic Mode: Apply sickness logic
  // Reset session counter at start of offline processing (session boundary)
  updatedPet.offlineSickCareMistakesAccruedThisSession = 0;

  // Step 2: Check sickness triggers (if pet wasn't already sick)
  if (!pet.isSick) {
    const triggerResult = evaluateSicknessTriggers(
      hungerWasZeroAtSave,
      poopWasUncleanedAtSave,
      pet.hungerZeroMinutesAccum,
      pet.poopDirtyMinutesAccum,
      offlineMinutes
    );

    updatedPet.hungerZeroMinutesAccum = triggerResult.newHungerZeroMinutesAccum;
    updatedPet.poopDirtyMinutesAccum = triggerResult.newPoopDirtyMinutesAccum;

    if (triggerResult.becameSick) {
      becameSick = true;
      sicknessTrigger = triggerResult.trigger;
      updatedPet.isSick = true;
      updatedPet.sickStartTimestamp = currentTimestamp - (offlineMinutes * 60 * 1000);
    }
  }

  // Step 3: Apply sickness effects if pet is/was sick
  if (updatedPet.isSick) {
    // Calculate how long pet was sick during offline period
    let sickDuration = offlineMinutes;
    if (becameSick) {
      // Pet became sick during offline - use partial duration
      // Assume became sick midway through offline for simplicity
      // (More accurate: use trigger time, but Bible doesn't specify)
      sickDuration = offlineMinutes;
    } else if (pet.sickStartTimestamp !== null) {
      // Pet was already sick - use actual duration
      sickDuration = Math.min(
        offlineMinutes,
        (currentTimestamp - pet.sickStartTimestamp) / (1000 * 60)
      );
    }

    // Apply care mistakes (capped at 4 per session)
    const effectsResult = applySicknessEffects(
      sickDuration,
      0 // Start fresh for this session
    );

    careMistakesAdded = effectsResult.careMistakesAdded;
    updatedPet.offlineSickCareMistakesAccruedThisSession =
      effectsResult.newOfflineSickCareMistakesAccruedThisSession;
  }

  return {
    pet: updatedPet,
    weightChange,
    becameSick,
    sicknessTrigger,
    careMistakesAdded,
    cozyShortCircuit: false,
  };
}
