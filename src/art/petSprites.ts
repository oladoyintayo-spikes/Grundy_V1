// ============================================
// GRUNDY — PET SPRITES
// P5-ART-PETS: Maps PetId + PetPose to sprite assets
// All art imported from assets/pets/<petId>/*.png
// ============================================

// --- Munchlet sprites ---
import munchletIdle from '../../assets/pets/munchlet/munchlet_idle.png';
import munchletHappy from '../../assets/pets/munchlet/munchlet_happy.png';
import munchletSad from '../../assets/pets/munchlet/munchlet_sad.png';
import munchletSleeping from '../../assets/pets/munchlet/munchlet_sleeping.png';

// --- Grib sprites ---
import gribIdle from '../../assets/pets/grib/grib_idle.png';
import gribHappy from '../../assets/pets/grib/grib_happy.png';
import gribSad from '../../assets/pets/grib/grib_sad.png';
import gribSleeping from '../../assets/pets/grib/grib_sleeping.png';

// --- Plompo sprites ---
import plompoIdle from '../../assets/pets/plompo/plompo_idle.png';
import plompoHappy from '../../assets/pets/plompo/plompo_happy.png';
import plompoSad from '../../assets/pets/plompo/plompo_sad.png';
import plompoSleeping from '../../assets/pets/plompo/plompo_sleeping.png';

// --- Fizz sprites ---
import fizzIdle from '../../assets/pets/fizz/fizz_idle.png';
import fizzHappy from '../../assets/pets/fizz/fizz_happy.png';
import fizzSad from '../../assets/pets/fizz/fizz_sad.png';
import fizzSleeping from '../../assets/pets/fizz/fizz_sleeping.png';

// --- Ember sprites ---
import emberIdle from '../../assets/pets/ember/ember_idle.png';
import emberHappy from '../../assets/pets/ember/ember_happy.png';
import emberSad from '../../assets/pets/ember/ember_sad.png';
import emberSleeping from '../../assets/pets/ember/ember_sleeping.png';

// --- Chomper sprites ---
import chomperIdle from '../../assets/pets/chomper/chomper_idle.png';
import chomperHappy from '../../assets/pets/chomper/chomper_happy.png';
import chomperSad from '../../assets/pets/chomper/chomper_sad.png';
import chomperSleeping from '../../assets/pets/chomper/chomper_sleeping.png';

// --- Whisp sprites ---
import whispIdle from '../../assets/pets/whisp/whisp_idle.png';
import whispHappy from '../../assets/pets/whisp/whisp_happy.png';
import whispSad from '../../assets/pets/whisp/whisp_sad.png';
import whispSleeping from '../../assets/pets/whisp/whisp_sleeping.png';

// --- Luxe sprites ---
import luxeIdle from '../../assets/pets/luxe/luxe_idle.png';
import luxeHappy from '../../assets/pets/luxe/luxe_happy.png';
import luxeSad from '../../assets/pets/luxe/luxe_sad.png';
import luxeSleeping from '../../assets/pets/luxe/luxe_sleeping.png';

// ============================================
// TYPES
// ============================================

/**
 * Pet pose states for sprite selection.
 * Maps to available art in assets/pets/<petId>/*.png
 */
export type PetPose = 'idle' | 'happy' | 'sad' | 'sleeping';

/**
 * Sprite set for a pet with required and optional poses.
 * - idle & happy are required (always available)
 * - sad & sleeping are optional (may fall back to idle)
 */
export interface PetSpriteSet {
  idle: string;
  happy: string;
  sad?: string;
  sleeping?: string;
}

/**
 * All 8 pet IDs from Bible §3
 */
export type PetId =
  | 'munchlet'
  | 'grib'
  | 'plompo'
  | 'fizz'
  | 'ember'
  | 'chomper'
  | 'whisp'
  | 'luxe';

// ============================================
// SPRITE REGISTRY
// ============================================

/**
 * Master sprite registry mapping each PetId to its sprite set.
 * All 8 pets have complete sprite sets (idle, happy, sad, sleeping).
 */
export const PET_SPRITES: Record<PetId, PetSpriteSet> = {
  munchlet: {
    idle: munchletIdle,
    happy: munchletHappy,
    sad: munchletSad,
    sleeping: munchletSleeping,
  },
  grib: {
    idle: gribIdle,
    happy: gribHappy,
    sad: gribSad,
    sleeping: gribSleeping,
  },
  plompo: {
    idle: plompoIdle,
    happy: plompoHappy,
    sad: plompoSad,
    sleeping: plompoSleeping,
  },
  fizz: {
    idle: fizzIdle,
    happy: fizzHappy,
    sad: fizzSad,
    sleeping: fizzSleeping,
  },
  ember: {
    idle: emberIdle,
    happy: emberHappy,
    sad: emberSad,
    sleeping: emberSleeping,
  },
  chomper: {
    idle: chomperIdle,
    happy: chomperHappy,
    sad: chomperSad,
    sleeping: chomperSleeping,
  },
  whisp: {
    idle: whispIdle,
    happy: whispHappy,
    sad: whispSad,
    sleeping: whispSleeping,
  },
  luxe: {
    idle: luxeIdle,
    happy: luxeHappy,
    sad: luxeSad,
    sleeping: luxeSleeping,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the sprite path for a specific pet and pose.
 *
 * @param petId - The pet ID (munchlet, grib, plompo, fizz, ember, chomper, whisp, luxe)
 * @param pose - The pose to display (idle, happy, sad, sleeping)
 * @returns The sprite path (imported image URL)
 *
 * Fallback behavior:
 * - If the pet ID is not found, returns munchlet's idle sprite
 * - If the requested pose is not available, falls back to idle
 */
export function getPetSprite(petId: string, pose: PetPose): string {
  const set = PET_SPRITES[petId as PetId];

  // Fallback for unknown pet IDs
  if (!set) {
    console.warn(`[petSprites] Unknown petId: ${petId}, falling back to munchlet`);
    return PET_SPRITES.munchlet.idle;
  }

  // Get requested pose or fall back to idle
  switch (pose) {
    case 'happy':
      return set.happy;
    case 'sad':
      return set.sad ?? set.idle;
    case 'sleeping':
      return set.sleeping ?? set.idle;
    case 'idle':
    default:
      return set.idle;
  }
}

/**
 * Check if a pet has a specific pose available.
 *
 * @param petId - The pet ID
 * @param pose - The pose to check
 * @returns True if the pose exists for this pet
 */
export function hasPetPose(petId: string, pose: PetPose): boolean {
  const set = PET_SPRITES[petId as PetId];
  if (!set) return false;

  switch (pose) {
    case 'idle':
    case 'happy':
      return true; // Always available
    case 'sad':
      return set.sad !== undefined;
    case 'sleeping':
      return set.sleeping !== undefined;
    default:
      return false;
  }
}

/**
 * Get all available poses for a pet.
 *
 * @param petId - The pet ID
 * @returns Array of available pose names
 */
export function getAvailablePoses(petId: string): PetPose[] {
  const set = PET_SPRITES[petId as PetId];
  if (!set) return [];

  const poses: PetPose[] = ['idle', 'happy'];
  if (set.sad) poses.push('sad');
  if (set.sleeping) poses.push('sleeping');

  return poses;
}

/**
 * List of all pet IDs in the sprite registry.
 */
export const ALL_PET_IDS: PetId[] = [
  'munchlet',
  'grib',
  'plompo',
  'fizz',
  'ember',
  'chomper',
  'whisp',
  'luxe',
];
