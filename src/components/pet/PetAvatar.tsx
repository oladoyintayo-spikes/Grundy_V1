// ============================================
// GRUNDY — PET AVATAR COMPONENT
// P5-ART-PETS: Image-based pet avatar using sprite assets
// ============================================

import React from 'react';
import { getPetSprite, PetPose } from '../../art/petSprites';

// ============================================
// TYPES
// ============================================

export interface PetAvatarProps {
  /** Pet ID from the game store */
  petId: string;
  /** Pose to display (idle, happy, sad, sleeping) */
  pose: PetPose;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a subtle animation pulse */
  animated?: boolean;
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
  size = 'md',
  className = '',
  animated = false,
}: PetAvatarProps) {
  const src = getPetSprite(petId, pose);
  const containerClass = sizeClassMap[size];
  const imageClass = imageSizeMap[size];

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
        alt={`${petId} ${pose}`}
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
  /** Pose to display (idle, happy, sad, sleeping) */
  pose: PetPose;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to apply a subtle breathing animation */
  breathing?: boolean;
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
  className = '',
  breathing = false,
}: PetDisplayProps) {
  const src = getPetSprite(petId, pose);

  return (
    <div
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
        alt={`${petId} ${pose}`}
        className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

export default PetAvatar;
