// ============================================
// GRUNDY — PET VISUALS HELPER
// P5-ART-PETS: Maps game state to visual pose
// ============================================

import type { PetPose } from '../art/petSprites';
import type { MoodState } from '../types';

// ============================================
// STATE TO POSE MAPPING
// ============================================

export interface PetStateForPose {
  /** Current mood (happy, neutral, sad, ecstatic) */
  mood: MoodState;
  /** Hunger level 0-100 */
  hunger: number;
  /** Whether pet is explicitly sleeping (future feature) */
  isSleeping?: boolean;
}

/**
 * Determine the appropriate pose based on pet state.
 *
 * Priority order:
 * 1. Sleeping → sleeping pose
 * 2. Very hungry (hunger < 20) → sad pose
 * 3. Ecstatic mood → happy pose
 * 4. Happy mood (hunger > 50) → happy pose
 * 5. Sad mood → sad pose
 * 6. Default → idle pose
 *
 * @param state - Current pet state
 * @returns The appropriate PetPose
 */
export function getDefaultPoseForState(state: PetStateForPose): PetPose {
  // Priority 1: Sleeping state (future feature)
  if (state.isSleeping) {
    return 'sleeping';
  }

  // Priority 2: Very hungry overrides mood
  if (state.hunger < 20) {
    return 'sad';
  }

  // Priority 3: Ecstatic mood always shows happy
  if (state.mood === 'ecstatic') {
    return 'happy';
  }

  // Priority 4: Happy mood with decent hunger
  if (state.mood === 'happy' && state.hunger > 50) {
    return 'happy';
  }

  // Priority 5: Sad mood
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

// ============================================
// REACTION TO POSE MAPPING
// ============================================

import type { ReactionType } from '../types';

/**
 * Get the appropriate pose for a feeding reaction.
 *
 * @param reaction - The feeding reaction type
 * @returns The appropriate pose for the reaction
 */
export function getPoseForReaction(reaction: ReactionType): PetPose {
  switch (reaction) {
    case 'ecstatic':
    case 'positive':
      return 'happy';
    case 'negative':
      return 'sad';
    case 'neutral':
    default:
      return 'idle';
  }
}

// ============================================
// HEADER POSE (simplified for small avatar)
// ============================================

/**
 * Get the pose for header/nav display.
 * Uses a simplified logic suitable for small avatars.
 *
 * @param mood - Current pet mood
 * @param hunger - Current hunger level
 * @returns Appropriate pose for header display
 */
export function getHeaderPose(mood: MoodState, hunger: number): PetPose {
  // Very hungry shows distress
  if (hunger < 30) {
    return 'sad';
  }

  // Ecstatic or happy mood shows happy
  if (mood === 'ecstatic' || mood === 'happy') {
    return 'happy';
  }

  // Default to idle
  return 'idle';
}
