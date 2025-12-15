// ============================================
// GRUNDY — PET AVATAR COMPONENT
// P5-ART-PETS: Image-based pet avatar using sprite assets
// P5-A11Y-LABELS: Accessible alt text for pet images
// P6-ART-PRODUCTION: Stage-aware sprite resolution with no-orb guarantee
// P11-C: Cosmetic render layering support
// ============================================

import React from 'react';
import { getPetSprite, getStageAwarePetSprite, PetPose } from '../../art/petSprites';
import type { EvolutionStage } from '../../types';
import {
  COSMETIC_SLOTS,
  type CosmeticSlot,
  getCosmeticById,
} from '../../constants/bible.constants';

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
// P11-C: COSMETIC LAYER RENDERING
// Bible §11.5.3 Layer Order (back to front):
// aura → base sprite → skin → outfit → accessory → hat
// ============================================

/**
 * Emoji placeholders for cosmetic slots (dev build only).
 * Per Bible §13.7: emoji placeholders OK in dev/testing builds.
 */
const SLOT_PLACEHOLDER_EMOJI: Record<CosmeticSlot, string> = {
  hat: '🎩',
  accessory: '🧣',
  outfit: '👔',
  aura: '✨',
  skin: '🎨',
};

/**
 * Layer z-indices per Bible §11.5.3.
 * Aura renders behind pet, hat is topmost.
 */
const LAYER_Z_INDEX: Record<CosmeticSlot | 'base', number> = {
  aura: 1,      // Background effect behind pet
  skin: 3,      // Body replacement/overlay
  outfit: 4,    // Body covering
  accessory: 5, // Neck/body accent
  hat: 6,       // Topmost layer
  base: 2,      // Base pet sprite
};

/**
 * Position styles for cosmetic placeholder badges.
 * Designed to not obscure the pet sprite (corners/edges).
 */
const PLACEHOLDER_POSITIONS: Record<CosmeticSlot, React.CSSProperties> = {
  hat: { top: '2%', left: '50%', transform: 'translateX(-50%)' },
  accessory: { bottom: '35%', right: '5%' },
  outfit: { bottom: '20%', left: '5%' },
  aura: { top: '50%', left: '5%', transform: 'translateY(-50%)' },
  skin: { bottom: '5%', right: '5%' },
};

/**
 * Equipped cosmetics state per pet.
 * Maps slot to cosmetic ID.
 */
export type EquippedCosmeticsState = Partial<Record<CosmeticSlot, string>>;

export interface PetRenderProps {
  /** Pet ID (speciesId) for sprite resolution */
  petId: string;
  /** Current pose */
  pose: PetPose;
  /** Evolution stage for stage-aware sprite resolution */
  stage?: EvolutionStage;
  /** Equipped cosmetics by slot (optional - if not provided, no cosmetics render) */
  equippedCosmetics?: EquippedCosmeticsState;
  /** Container CSS classes */
  className?: string;
  /** Whether to apply breathing animation */
  breathing?: boolean;
  /** Display name for accessibility */
  petDisplayName?: string;
  /** Size variant: 'avatar' for small circular, 'display' for large main view */
  variant?: 'avatar' | 'display';
  /** Avatar size (only used when variant='avatar') */
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show cosmetic placeholder badges (default: true for display, false for avatar) */
  showCosmeticPlaceholders?: boolean;
}

/**
 * PetRender - Shared pet rendering component with cosmetic layer support.
 *
 * P11-C: Renders equipped cosmetics as visible layers on the pet.
 * Uses placeholder badges when cosmetic assets are not available (dev build).
 *
 * Layer order per Bible §11.5.3 (back to front):
 * aura → base sprite → skin → outfit → accessory → hat
 *
 * @example
 * ```tsx
 * <PetRender
 *   petId={pet.speciesId}
 *   pose={currentPose}
 *   stage={pet.evolutionStage}
 *   equippedCosmetics={equippedCosmetics}
 *   variant="display"
 * />
 * ```
 */
export function PetRender({
  petId,
  pose,
  stage,
  equippedCosmetics = {},
  className = '',
  breathing = false,
  petDisplayName,
  variant = 'display',
  avatarSize = 'md',
  showCosmeticPlaceholders,
}: PetRenderProps) {
  // Determine whether to show placeholders based on variant
  const shouldShowPlaceholders = showCosmeticPlaceholders ?? (variant === 'display');

  // Get sprite source
  const src = stage
    ? getStageAwarePetSprite(petId, stage, pose)
    : getPetSprite(petId, pose);

  // Generate accessible alt text
  const displayName = petDisplayName || petId;
  const poseDescription = POSE_LABELS[pose] || pose;
  const equippedSlots = Object.keys(equippedCosmetics).filter(
    (slot) => equippedCosmetics[slot as CosmeticSlot]
  );
  const cosmeticsDesc = equippedSlots.length > 0
    ? `, wearing ${equippedSlots.join(', ')}`
    : '';
  const altText = `${displayName}, ${poseDescription}${cosmeticsDesc}`;

  // Render cosmetic layer placeholder
  const renderCosmeticLayer = (slot: CosmeticSlot) => {
    const cosmeticId = equippedCosmetics[slot];
    if (!cosmeticId) return null;

    const cosmetic = getCosmeticById(cosmeticId);
    const emoji = SLOT_PLACEHOLDER_EMOJI[slot];
    const position = PLACEHOLDER_POSITIONS[slot];
    const zIndex = LAYER_Z_INDEX[slot];

    // TODO: When cosmetic assets exist, render actual sprite instead of placeholder
    // For now, render placeholder badge per task spec (P11-C assets missing)
    return (
      <div
        key={slot}
        data-testid={`pet-render-layer-${slot}`}
        data-cosmetic-id={cosmeticId}
        className="absolute pointer-events-none"
        style={{
          ...position,
          zIndex,
        }}
      >
        {shouldShowPlaceholders && (
          <div
            data-testid={`pet-render-layer-placeholder-${slot}`}
            className="relative"
            title={cosmetic?.displayName || cosmeticId}
          >
            {/* Placeholder badge with DEV indicator */}
            <span
              className="text-lg sm:text-xl drop-shadow-md"
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}
            >
              {emoji}
            </span>
            <span
              className="absolute -bottom-1 -right-1 text-[8px] bg-amber-500 text-black px-0.5 rounded font-mono"
            >
              DEV
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render for avatar variant (small circular)
  if (variant === 'avatar') {
    const sizeClassMap = {
      sm: 'w-10 h-10',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
      xl: 'w-32 h-32',
    };
    const imageSizeMap = {
      sm: 'w-8 h-8',
      md: 'w-14 h-14',
      lg: 'w-20 h-20',
      xl: 'w-28 h-28',
    };

    return (
      <div
        data-testid="pet-render-root"
        className={[
          'relative rounded-full bg-black/20 flex items-center justify-center shadow-md overflow-hidden',
          sizeClassMap[avatarSize],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Base pet sprite */}
        <img
          data-testid="pet-render-base"
          src={src}
          alt={altText}
          className={`${imageSizeMap[avatarSize]} object-contain`}
          style={{ zIndex: LAYER_Z_INDEX.base }}
          loading="lazy"
          draggable={false}
        />
        {/* Cosmetic layers (rendered in z-order) */}
        {shouldShowPlaceholders && COSMETIC_SLOTS.map((slot) => renderCosmeticLayer(slot))}
      </div>
    );
  }

  // Render for display variant (large main view)
  return (
    <div
      data-testid="pet-render-root"
      className={[
        'relative flex items-center justify-center',
        breathing && 'animate-breath',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Aura layer (background, behind pet) - render first if equipped */}
      {equippedCosmetics.aura && renderCosmeticLayer('aura')}

      {/* Base pet sprite */}
      <img
        data-testid="pet-render-base"
        src={src}
        alt={altText}
        className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
        style={{ position: 'relative', zIndex: LAYER_Z_INDEX.base }}
        loading="lazy"
        draggable={false}
      />

      {/* Cosmetic layers (rendered in z-order, excluding aura which is above) */}
      {COSMETIC_SLOTS.filter((slot) => slot !== 'aura').map((slot) =>
        renderCosmeticLayer(slot)
      )}
    </div>
  );
}

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
  /** P11-C: Equipped cosmetics to render as visible layers */
  equippedCosmetics?: EquippedCosmeticsState;
}

/**
 * PetDisplay - A larger, standalone pet sprite for main views.
 *
 * Used in HomeView where the pet is prominently displayed.
 * Shows the full sprite without a circular container.
 *
 * P11-C: Now supports cosmetic layer rendering via equippedCosmetics prop.
 *
 * @example
 * ```tsx
 * <PetDisplay petId={pet.id} pose="happy" breathing />
 * <PetDisplay petId={pet.id} pose="happy" equippedCosmetics={equippedCosmetics} />
 * ```
 */
export function PetDisplay({
  petId,
  pose,
  stage,
  className = '',
  breathing = false,
  petDisplayName,
  equippedCosmetics,
}: PetDisplayProps) {
  // P11-C: Use PetRender for cosmetic layer support
  return (
    <div data-testid="active-pet">
      <PetRender
        petId={petId}
        pose={pose}
        stage={stage}
        className={className}
        breathing={breathing}
        petDisplayName={petDisplayName}
        equippedCosmetics={equippedCosmetics}
        variant="display"
        showCosmeticPlaceholders={true}
      />
    </div>
  );
}

// ============================================
// POOP INDICATOR (P10-B2)
// ============================================

export interface PoopIndicatorProps {
  /** Whether poop is currently dirty */
  isPoopDirty: boolean;
  /** Callback when user taps to clean */
  onClean: () => void;
  /** Additional CSS classes for positioning */
  className?: string;
}

/**
 * PoopIndicator - Shows a 💩 emoji when pet has poop to clean.
 * P10-B2: Visual indicator with tap-to-clean interaction.
 *
 * @example
 * ```tsx
 * <PoopIndicator
 *   isPoopDirty={pet.isPoopDirty}
 *   onClean={() => cleanPoop(petId)}
 * />
 * ```
 */
export function PoopIndicator({
  isPoopDirty,
  onClean,
  className = '',
}: PoopIndicatorProps) {
  if (!isPoopDirty) return null;

  return (
    <button
      data-testid="poop-indicator"
      onClick={onClean}
      className={[
        'text-3xl sm:text-4xl cursor-pointer transition-transform',
        'hover:scale-110 active:scale-90',
        'animate-bounce',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Clean poop"
      title="Tap to clean!"
    >
      💩
    </button>
  );
}

export default PetAvatar;
