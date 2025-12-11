// ============================================
// GRUNDY — PET AVATAR COMPONENT
// P5-ART-PETS: Image-based pet avatar using sprite assets
// P5-A11Y-LABELS: Accessible alt text for pet images
// P6-ART-PRODUCTION: Stage-aware sprite resolution with no-orb guarantee
// ============================================

import React from 'react';
import { getPetSprite, getStageAwarePetSprite, PetPose } from '../../art/petSprites';
import type { EvolutionStage } from '../../types';

// ============================================
// POSE LABELS FOR ALT TEXT (P5-A11Y-LABELS)
// Extended for P6-ART-POSES
// ============================================

const POSE_LABELS: Record<PetPose, string> = {
  idle: 'resting',
  happy: 'happy',
  sad: 'sad',
  sleeping: 'sleeping',
  eating: 'eating',
  eating_loved: 'enjoying favorite food',
  ecstatic: 'ecstatic',
  excited: 'excited',
  hungry: 'hungry',
  satisfied: 'satisfied',
  crying: 'crying',
};

// ============================================
// TYPES
// ============================================

export interface PetAvatarProps {
  /** Pet ID from the game store */
  petId: string;
  /** Pose to display (P6-ART-POSES: idle, happy, sad, sleeping, eating, eating_loved, ecstatic, excited, hungry, satisfied, crying) */
  pose: PetPose;
  /** Evolution stage for stage-aware sprite resolution (P6-ART-PRODUCTION) */
  stage?: EvolutionStage;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a subtle animation pulse */
  animated?: boolean;
  /** Display name for accessibility (P5-A11Y-LABELS) */
  petDisplayName?: string;
}

// ============================================
// SIZE CLASSES
// ============================================

const sizeClassMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
} as const;

const imageSizeMap = {
  sm: 'w-8 h-8',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
} as const;

// ============================================
// COMPONENT
// ============================================

/**
 * PetAvatar - Displays a pet's sprite in a rounded container.
 *
 * Uses real art from assets/pets/<petId>/*.png via the petSprites config.
 * Falls back to munchlet's idle sprite if pet is not found.
 *
 * @example
 * ```tsx
 * <PetAvatar petId="munchlet" pose="happy" size="lg" />
 * <PetAvatar petId={pet.id} pose={currentPose} size="md" animated />
 * ```
 */
export function PetAvatar({
  petId,
  pose,
  stage,
  size = 'md',
  className = '',
  animated = false,
  petDisplayName,
}: PetAvatarProps) {
  // Use stage-aware resolution when stage is provided (P6-ART-PRODUCTION)
  const src = stage
    ? getStageAwarePetSprite(petId, stage, pose)
    : getPetSprite(petId, pose);
  const containerClass = sizeClassMap[size];
  const imageClass = imageSizeMap[size];

  // Generate accessible alt text (P5-A11Y-LABELS)
  const displayName = petDisplayName || petId;
  const poseDescription = POSE_LABELS[pose] || pose;
  const altText = `${displayName}, ${poseDescription}`;

  return (
    <div
      className={[
        'rounded-full bg-black/20 flex items-center justify-center shadow-md overflow-hidden',
        containerClass,
        animated && 'animate-pulse-slow',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={src}
        alt={altText}
        className={`${imageClass} object-contain`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

// ============================================
// LARGE PET DISPLAY
// ============================================

export interface PetDisplayProps {
  /** Pet ID from the game store */
  petId: string;
  /** Pose to display (P6-ART-POSES: idle, happy, sad, sleeping, eating, eating_loved, ecstatic, excited, hungry, satisfied, crying) */
  pose: PetPose;
  /** Evolution stage for stage-aware sprite resolution (P6-ART-PRODUCTION) */
  stage?: EvolutionStage;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to apply a subtle breathing animation */
  breathing?: boolean;
  /** Display name for accessibility (P5-A11Y-LABELS) */
  petDisplayName?: string;
}

/**
 * PetDisplay - A larger, standalone pet sprite for main views.
 *
 * Used in HomeView where the pet is prominently displayed.
 * Shows the full sprite without a circular container.
 *
 * @example
 * ```tsx
 * <PetDisplay petId={pet.id} pose="happy" breathing />
 * ```
 */
export function PetDisplay({
  petId,
  pose,
  stage,
  className = '',
  breathing = false,
  petDisplayName,
}: PetDisplayProps) {
  // Use stage-aware resolution when stage is provided (P6-ART-PRODUCTION)
  const src = stage
    ? getStageAwarePetSprite(petId, stage, pose)
    : getPetSprite(petId, pose);

  // Generate accessible alt text (P5-A11Y-LABELS)
  const displayName = petDisplayName || petId;
  const poseDescription = POSE_LABELS[pose] || pose;
  const altText = `${displayName}, ${poseDescription}`;

  return (
    <div
      data-testid="active-pet"
      className={[
        'flex items-center justify-center',
        breathing && 'animate-breath',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={src}
        alt={altText}
        className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

export default PetAvatar;
