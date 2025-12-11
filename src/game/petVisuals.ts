// ============================================
// GRUNDY — PET VISUALS HELPER
// P5-ART-PETS: Maps game state to visual pose
// P6-ART-POSES: Extended pose support with fullness states
// ============================================

import type { PetPose } from '../art/petSprites';
import type { MoodState, ReactionType } from '../types';
import { FULLNESS_STATES, type FullnessState } from '../constants/bible.constants';

// ============================================
// STATE TO POSE MAPPING
// ============================================

export interface PetStateForPose {
  /** Current mood (happy, neutral, sad, ecstatic) */
  mood: MoodState;
  /** Hunger/Fullness level 0-100 (higher = more full) */
  hunger: number;
  /** Whether pet is explicitly sleeping (future feature) */
  isSleeping?: boolean;
  /** Whether pet is currently eating (transient state) */
  isEating?: boolean;
  /** Whether the food being eaten is loved (for eating_loved pose) */
  isEatingLoved?: boolean;
}

/**
 * Get the fullness state from hunger value.
 * Uses Bible §4.4 thresholds.
 */
export function getFullnessStateFromHunger(hunger: number): FullnessState {
  if (hunger >= FULLNESS_STATES.STUFFED.min) return 'STUFFED';
  if (hunger >= FULLNESS_STATES.SATISFIED.min) return 'SATISFIED';
  if (hunger >= FULLNESS_STATES.CONTENT.min) return 'CONTENT';
  if (hunger >= FULLNESS_STATES.PECKISH.min) return 'PECKISH';
  return 'HUNGRY';
}

/**
 * Determine the appropriate pose based on pet state.
 *
 * Priority order (P6-ART-POSES extended):
 * 1. Sleeping → sleeping pose
 * 2. Eating (loved) → eating_loved pose
 * 3. Eating → eating pose
 * 4. Very hungry (HUNGRY state, <21) → hungry pose
 * 5. Stuffed/Satisfied (>70) → satisfied pose
 * 6. Ecstatic mood → ecstatic pose
 * 7. Happy mood (hunger > 50) → happy pose
 * 8. Sad mood → sad pose
 * 9. Default → idle pose
 *
 * @param state - Current pet state
 * @returns The appropriate PetPose
 */
export function getDefaultPoseForState(state: PetStateForPose): PetPose {
  // Priority 1: Sleeping state
  if (state.isSleeping) {
    return 'sleeping';
  }

  // Priority 2: Eating loved food (transient)
  if (state.isEating && state.isEatingLoved) {
    return 'eating_loved';
  }

  // Priority 3: Eating (transient)
  if (state.isEating) {
    return 'eating';
  }

  // Priority 4: Very hungry (HUNGRY state) shows distress
  if (state.hunger < FULLNESS_STATES.PECKISH.min) {
    return 'hungry';
  }

  // Priority 5: Stuffed or Satisfied shows contentment
  if (state.hunger >= FULLNESS_STATES.SATISFIED.min) {
    return 'satisfied';
  }

  // Priority 6: Ecstatic mood shows maximum joy
  if (state.mood === 'ecstatic') {
    return 'ecstatic';
  }

  // Priority 7: Happy mood with decent hunger
  if (state.mood === 'happy' && state.hunger > 50) {
    return 'happy';
  }

  // Priority 8: Sad mood
  if (state.mood === 'sad') {
    return 'sad';
  }

  // Default: idle pose
  return 'idle';
}

/**
 * Get a positive pose for happy moments (after feeding, reactions).
 * Always returns 'happy' unless explicitly sleeping.
 *
 * @param isSleeping - Whether pet is sleeping
 * @returns 'happy' or 'sleeping'
 */
export function getPositivePose(isSleeping = false): PetPose {
  return isSleeping ? 'sleeping' : 'happy';
}

/**
 * Get a neutral pose for standard display.
 *
 * @returns 'idle'
 */
export function getNeutralPose(): PetPose {
  return 'idle';
}

/**
 * Get a negative pose for unhappy states.
 *
 * @returns 'sad'
 */
export function getNegativePose(): PetPose {
  return 'sad';
}

/**
 * Get the ecstatic pose for maximum happiness.
 *
 * @returns 'ecstatic'
 */
export function getEcstaticPose(): PetPose {
  return 'ecstatic';
}

/**
 * Get the excited pose for high energy states.
 *
 * @returns 'excited'
 */
export function getExcitedPose(): PetPose {
  return 'excited';
}

/**
 * Get the hungry pose for low fullness states.
 *
 * @returns 'hungry'
 */
export function getHungryPose(): PetPose {
  return 'hungry';
}

/**
 * Get the satisfied pose for high fullness states.
 *
 * @returns 'satisfied'
 */
export function getSatisfiedPose(): PetPose {
  return 'satisfied';
}

/**
 * Get the crying pose for distress states.
 *
 * @returns 'crying'
 */
export function getCryingPose(): PetPose {
  return 'crying';
}

// ============================================
// REACTION TO POSE MAPPING
// ============================================

/**
 * Get the appropriate pose for a feeding reaction.
 * Uses extended poses for better expression.
 *
 * @param reaction - The feeding reaction type
 * @param isLoved - Whether the food was loved (for eating_loved)
 * @returns The appropriate pose for the reaction
 */
export function getPoseForReaction(reaction: ReactionType, isLoved = false): PetPose {
  switch (reaction) {
    case 'ecstatic':
      return isLoved ? 'eating_loved' : 'ecstatic';
    case 'positive':
      return 'happy';
    case 'negative':
      return 'sad';
    case 'neutral':
    default:
      return 'idle';
  }
}

/**
 * Get the eating pose based on reaction type.
 * For use during feeding animation.
 *
 * @param reaction - The feeding reaction type
 * @returns The appropriate eating pose
 */
export function getEatingPoseForReaction(reaction: ReactionType): PetPose {
  if (reaction === 'ecstatic') {
    return 'eating_loved';
  }
  return 'eating';
}

// ============================================
// HEADER POSE (simplified for small avatar)
// ============================================

/**
 * Get the pose for header/nav display.
 * Uses a simplified logic suitable for small avatars.
 * Now includes fullness-based poses.
 *
 * @param mood - Current pet mood
 * @param hunger - Current hunger level
 * @returns Appropriate pose for header display
 */
export function getHeaderPose(mood: MoodState, hunger: number): PetPose {
  // Very hungry shows distress
  if (hunger < FULLNESS_STATES.PECKISH.min) {
    return 'hungry';
  }

  // Stuffed shows contentment
  if (hunger >= FULLNESS_STATES.STUFFED.min) {
    return 'satisfied';
  }

  // Ecstatic mood shows maximum joy
  if (mood === 'ecstatic') {
    return 'ecstatic';
  }

  // Happy mood shows happy
  if (mood === 'happy') {
    return 'happy';
  }

  // Sad mood shows sad
  if (mood === 'sad') {
    return 'sad';
  }

  // Default to idle
  return 'idle';
}

// ============================================
// FULLNESS-BASED POSE MAPPING
// ============================================

/**
 * Get the appropriate pose based on fullness state alone.
 * Useful for showing hunger-specific visuals.
 *
 * @param fullness - The fullness state
 * @returns The appropriate pose for the fullness level
 */
export function getPoseForFullness(fullness: FullnessState): PetPose {
  switch (fullness) {
    case 'HUNGRY':
      return 'hungry';
    case 'PECKISH':
      return 'sad'; // Slightly uncomfortable
    case 'CONTENT':
      return 'idle';
    case 'SATISFIED':
      return 'satisfied';
    case 'STUFFED':
      return 'satisfied'; // Same visual as satisfied
    default:
      return 'idle';
  }
}

/**
 * Get pose based on hunger value directly.
 * Convenience wrapper around getPoseForFullness.
 *
 * @param hunger - Hunger/fullness value 0-100
 * @returns The appropriate pose
 */
export function getPoseForHungerValue(hunger: number): PetPose {
  const fullnessState = getFullnessStateFromHunger(hunger);
  return getPoseForFullness(fullnessState);
}
