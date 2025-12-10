// ============================================
// GRUNDY — PET UNLOCK UTILITIES
// Helper functions for checking unlock requirements
// ============================================

import { UnlockRequirement, UnlockRequirementType } from '../types';
import { getPetUnlockRequirement, PETS } from '../data/pets';

/**
 * Check if a pet's unlock requirements are met based on game progress.
 * Note: This does NOT check if the pet is already unlocked.
 */
export function checkUnlockRequirements(
  petId: string,
  gameProgress: {
    maxBondAchieved?: number;
    minigamesCompleted?: number;
  }
): boolean {
  const requirement = getPetUnlockRequirement(petId);
  if (!requirement) return false;

  switch (requirement.type) {
    case 'free':
      return true;

    case 'bond_level':
      return (gameProgress.maxBondAchieved ?? 0) >= (requirement.value ?? 0);

    case 'minigames_completed':
      return (gameProgress.minigamesCompleted ?? 0) >= (requirement.value ?? 0);

    case 'premium':
      // Premium pets can only be unlocked with gems
      return false;

    default:
      return false;
  }
}

/**
 * Get display info for a locked pet.
 */
export function getUnlockRequirementText(petId: string): string {
  const requirement = getPetUnlockRequirement(petId);
  if (!requirement) return 'Unknown requirement';

  switch (requirement.type) {
    case 'free':
      return 'Free!';

    case 'bond_level':
      return `Reach bond level ${requirement.value}`;

    case 'minigames_completed':
      return `Complete ${requirement.value} minigames`;

    case 'premium':
      return `${requirement.gemSkipCost} gems`;

    default:
      return 'Unknown requirement';
  }
}

/**
 * Get the gem skip cost for a pet.
 * Returns undefined if the pet cannot be skipped with gems.
 */
export function getGemSkipCost(petId: string): number | undefined {
  const requirement = getPetUnlockRequirement(petId);
  return requirement?.gemSkipCost;
}

/**
 * Get all pets that can be unlocked with current progress.
 */
export function getUnlockablePets(
  unlockedPets: string[],
  gameProgress: {
    maxBondAchieved?: number;
    minigamesCompleted?: number;
  }
): string[] {
  const allPetIds = Object.keys(PETS);

  return allPetIds.filter((petId) => {
    // Skip already unlocked pets
    if (unlockedPets.includes(petId)) return false;

    // Check if requirements are met
    return checkUnlockRequirements(petId, gameProgress);
  });
}

/**
 * Get unlock progress percentage for a specific pet.
 */
export function getUnlockProgress(
  petId: string,
  gameProgress: {
    maxBondAchieved?: number;
    minigamesCompleted?: number;
  }
): number {
  const requirement = getPetUnlockRequirement(petId);
  if (!requirement) return 0;

  switch (requirement.type) {
    case 'free':
      return 100;

    case 'bond_level': {
      const current = gameProgress.maxBondAchieved ?? 0;
      const required = requirement.value ?? 1;
      return Math.min(100, Math.floor((current / required) * 100));
    }

    case 'minigames_completed': {
      const current = gameProgress.minigamesCompleted ?? 0;
      const required = requirement.value ?? 1;
      return Math.min(100, Math.floor((current / required) * 100));
    }

    case 'premium':
      return 0; // Premium pets show 0% until purchased

    default:
      return 0;
  }
}

/**
 * Get all unlock requirement types in use.
 */
export function getUnlockRequirementTypes(): UnlockRequirementType[] {
  return ['free', 'bond_level', 'minigames_completed', 'premium'];
}
