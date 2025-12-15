// ============================================
// GRUNDY — GAME STORE (Zustand)
// Central state management with persistence
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GameStore,
  PetState,
  OwnedPetState,
  PetInstanceId,
  CurrencyType,
  MoodState,
  FeedResult,
  GameStats,
  GameSettings,
  MiniGameId,
  MiniGameResult,
  CanPlayResult,
  EnergyState,
  DailyMiniGameState,
  FtueState,
  FtueStep,
  PlayMode,
  AppView,
  RoomId,
  AbilityTrigger,
  PetPose,
  NeglectState,
  DEFAULT_NEGLECT_STATE,
  ShopPurchaseResult,
  ShopPurchaseOptions,
  // P9-B: Multi-pet alert types
  AlertSuppressionState,
  OfflineReturnSummary,
  PetStatusBadge,
  AlertBadge,
  // P10-E: Recovery action types
  RecoveryResult,
  // P11-0: Gem source types
  LoginStreakState,
  LoginStreakResult,
  // P11-A: Cosmetic types
  CosmeticEquipResult,
  // P11-D: Cosmetic purchase types
  BuyCosmeticResult,
} from '../types';
// P11-0: Deterministic date key utility for gem sources
import { getLocalDateKey, isYesterday, isSameDay } from '../utils/dateKey';
import {
  DEFAULT_ENVIRONMENT,
  getTimeOfDay,
  getDefaultRoomForView,
} from './environment';
import { STARTING_INVENTORY, getFoodById } from '../data/foods';
import { GAME_CONFIG, getXPForLevel } from '../data/config';
import { STARTER_PETS, getPetUnlockRequirement } from '../data/pets';
import {
  createInitialPet,
  processFeed,
  getMoodAfterReaction,
  getEvolutionStage,
  decayHunger,
  isStuffed,
  isOnCooldown,
  getCombinedFeedValue,
  getFullnessState,
  updateMoodValue,
  decayMood,
  syncMoodState,
  getMoodXPMultiplier,
} from './systems';
import { getEatingPoseForReaction } from './petVisuals';
import { hasAbilityEffect, applyGemMultiplier, isSpicyFood } from './abilities';
import {
  ENERGY_MAX,
  ENERGY_COST_PER_GAME,
  DAILY_REWARDED_PLAYS_CAP,
  getTodayString,
  createInitialDailyState,
  createInitialEnergyState
} from './miniGameRewards';
// Bible §14.4: Activity-to-room mapping
// Bible §9.4.3: Neglect system constants
// Bible §11.6: Pet Slots constants (P9-A)
// Bible §8.2.1, §9.4.6, §11.6.1: Multi-pet runtime constants (P9-B)
import {
  ROOM_ACTIVITY_MAP,
  MODE_CONFIG,
  NEGLECT_CONFIG,
  NEGLECT_STAGES,
  getNeglectStage,
  STARTING_RESOURCES,
  INVENTORY_CONFIG,
  PET_SLOTS_CONFIG,
  STARTER_PET_IDS,
  OFFLINE_DECAY_RATES,
  ALERT_SUPPRESSION,
  ALERT_BADGES,
  type NeglectStageId,
  type PetInstanceId as BiblePetInstanceId,
  // P9-C-SLOTS: Slot unlock system
  purchaseSlot as purchaseSlotFn,
  getAllSlotStatuses,
  type SlotPurchaseResult,
  type SlotPurchaseState,
  type SlotStatus,
  // P10-B1.5: Poop frequency constants
  POOP_FREQUENCY,
  // P10-B2: Poop cleaning rewards and mood decay acceleration
  POOP_CLEANING_REWARDS,
  POOP_MOOD_DECAY,
  // P10-C: Feeding-time triggers (weight gain + sickness)
  SNACK_WEIGHT_GAIN,
  FEEDING_SICKNESS_TRIGGERS,
  // P10-D: Mini-game gating thresholds
  MINIGAME_GATING,
  // P10-E: Recovery effects
  RECOVERY_EFFECTS,
  // P10-H: Sickness config (for offline sick decay multiplier)
  SICKNESS_CONFIG,
  // P11-A: Cosmetics system
  getCosmeticSlot,
  getCosmeticById,
  type CosmeticSlot,
} from '../constants/bible.constants';
// P10-C: Deterministic RNG for sickness chance rolls
import { randomFloat } from './rng';
// P8-SHOP-PURCHASE: Shop purchase engine
import { purchaseShopItem as executePurchase } from './shopPurchase';
// P10-B: Offline weight/sickness order-of-application
import {
  calculateOfflineDurationMinutes,
  applyOfflineOrderToPet,
  type OfflineOrderResult,
} from './offlineSickness';

// ============================================
// ABILITY TRIGGER MESSAGES (P1-ABILITY-4)
// ============================================

const ABILITY_TRIGGER_MESSAGES: Record<string, { id: string; message: string }> = {
  bond_bonus: { id: 'bond_bonus', message: 'Comfort Food: +10% bond!' },
  mood_penalty_reduction: { id: 'mood_penalty_reduction', message: 'Chill Vibes: mood penalty reduced!' },
  decay_reduction: { id: 'decay_reduction', message: 'Slow Metabolism active' },
  minigame_bonus: { id: 'minigame_bonus', message: 'Hyperactive: +25% rewards!' },
  spicy_coin_bonus: { id: 'spicy_coin_bonus', message: 'Spicy Lover: 2× coins!' },
  no_dislikes: { id: 'no_dislikes', message: 'Iron Stomach: no dislikes!' },
  rare_xp_chance: { id: 'rare_xp_chance', message: 'Lucky Nibbles: rare XP bonus!' },
  gem_multiplier: { id: 'gem_multiplier', message: 'Golden Touch: 2× gems!' },
};

/**
 * Create an ability trigger with current timestamp
 */
function createAbilityTrigger(effectType: string): AbilityTrigger | null {
  const template = ABILITY_TRIGGER_MESSAGES[effectType];
  if (!template) return null;

  return {
    id: template.id,
    abilityName: template.message.split(':')[0] || template.id,
    message: template.message,
    triggeredAt: Date.now(),
  };
}

// ============================================
// NEGLECT SYSTEM HELPERS (P7-NEGLECT-SYSTEM)
// ============================================

/**
 * Calculate calendar days between two ISO date strings.
 * Bible §9.4.3: Calendar-day semantics (midnight to midnight).
 */
function calculateCalendarDays(startDateISO: string, endDateISO: string): number {
  // Parse dates (YYYY-MM-DD format)
  const start = new Date(startDateISO + 'T00:00:00');
  const end = new Date(endDateISO + 'T00:00:00');

  // Calculate difference in days
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / msPerDay));
}

/**
 * Reset neglect state to healthy defaults.
 * Used when pet recovers from withdrawn/runaway.
 */
function resetNeglectState(current: NeglectState, now: Date): NeglectState {
  const todayISO = now.toISOString().split('T')[0];
  return {
    ...current,
    neglectDays: 0,
    currentStage: 'normal',
    isWithdrawn: false,
    withdrawnAt: null,
    recoveryDaysCompleted: 0,
    isRunaway: false,
    runawayAt: null,
    canReturnFreeAt: null,
    canReturnPaidAt: null,
    lastCareDate: todayISO,
    lastSeenDate: todayISO,
  };
}

// ============================================
// P9-A: MULTI-PET HELPERS
// Bible §11.6: Player owns all 3 starters
// ============================================

/**
 * Create an owned pet instance from a species ID.
 * P9-A: Generates unique instance ID and initializes state.
 */
function createOwnedPet(speciesId: string, suffix: string = 'starter'): OwnedPetState {
  const basePet = createInitialPet(speciesId);
  const instanceId: PetInstanceId = `${speciesId}-${suffix}`;
  // Type assertion needed since speciesId comes from STARTER_PET_IDS array
  return {
    ...basePet,
    instanceId,
    speciesId: speciesId as OwnedPetState['speciesId'],
    // P10-A: Weight & Sickness foundations (Bible v1.8 §9.4.7)
    weight: 0,
    isSick: false,
    sickStartTimestamp: null,
    hungerZeroMinutesAccum: 0,
    poopDirtyMinutesAccum: 0,
    offlineSickCareMistakesAccruedThisSession: 0,
    // P10-B1.5: Poop state (Bible v1.8 §9.5)
    isPoopDirty: false,
    poopDirtyStartTimestamp: null,
    feedingsSinceLastPoop: 0,
    // P11-A: Cosmetic state (Bible §11.5.2-§11.5.4)
    ownedCosmeticIds: [],
    equippedCosmetics: {},
  };
}

/**
 * Create initial multi-pet state with all 3 starters.
 * Bible §6: "All 3 STARTERS always available (Munchlet, Grib, Plompo)"
 * Bible §6: "Player picks which starter to play FIRST" (handled by FTUE)
 */
function createInitialMultiPetState(): {
  petsById: Record<PetInstanceId, OwnedPetState>;
  ownedPetIds: PetInstanceId[];
  activePetId: PetInstanceId;
} {
  const petsById: Record<PetInstanceId, OwnedPetState> = {};
  const ownedPetIds: PetInstanceId[] = [];

  // Create all 3 starter pets per Bible §6
  for (const speciesId of STARTER_PET_IDS) {
    const pet = createOwnedPet(speciesId, 'starter');
    petsById[pet.instanceId] = pet;
    ownedPetIds.push(pet.instanceId);
  }

  // Default to munchlet (first starter) - Bible §7.4 fallback
  const activePetId = 'munchlet-starter';

  return { petsById, ownedPetIds, activePetId };
}

// ============================================
// P9-B: MULTI-PET RUNTIME HELPERS
// Bible §8.2.1, §9.4.4-9.4.6, §11.6.1
// ============================================

/**
 * Create initial alert suppression state.
 * Bible §11.6.1: Alert suppression rules.
 */
function createInitialAlertSuppressionState(): AlertSuppressionState {
  return {
    lastAlertByPet: {},
    sessionAlertCount: 0,
    sessionStart: Date.now(),
  };
}

/**
 * Calculate offline stat decay for a single pet.
 * Bible §9.4.6: Offline decay rates per 24 hours.
 * @param hoursOffline Number of hours the player was offline
 * @param hasPlusSubscription Whether player has Grundy Plus
 * @returns Decay amounts to apply
 */
function calculateOfflineDecay(
  hoursOffline: number,
  hasPlusSubscription: boolean = false
): { moodDecay: number; bondDecay: number; hungerDecay: number } {
  // Calculate number of 24h periods (use full periods for deterministic behavior)
  const periods24h = Math.floor(hoursOffline / 24);

  // Bible §9.4.6 rates: per 24h offline
  const moodDecay = periods24h * OFFLINE_DECAY_RATES.MOOD_PER_24H;
  const bondDecayRate = hasPlusSubscription
    ? OFFLINE_DECAY_RATES.BOND_PER_24H_PLUS
    : OFFLINE_DECAY_RATES.BOND_PER_24H;
  const bondDecay = periods24h * bondDecayRate;
  const hungerDecay = periods24h * OFFLINE_DECAY_RATES.HUNGER_PER_24H;

  return { moodDecay, bondDecay, hungerDecay };
}

/**
 * Apply offline decay to a single pet's state.
 * Bible §9.4.6: Floor values for mood (30), bond (0), hunger (0).
 * P10-B2: Applies 2× mood decay multiplier when poop was dirty for 60+ minutes.
 * P10-H: Applies 2× decay to mood/bond/hunger when sick in Classic mode (Bible §9.4.7.3).
 *
 * @param pet - The pet state to update
 * @param decay - Decay amounts to apply
 * @param offlineMinutes - Total minutes offline (for poop dirty duration check)
 * @param lastSeenTimestamp - When player was last active (for calculating dirty duration)
 * @param gameMode - Current game mode (for sick decay multiplier)
 */
function applyOfflineDecayToPet(
  pet: OwnedPetState,
  decay: { moodDecay: number; bondDecay: number; hungerDecay: number },
  offlineMinutes?: number,
  lastSeenTimestamp?: number,
  gameMode?: PlayMode
): OwnedPetState {
  let effectiveMoodDecay = decay.moodDecay;
  let effectiveBondDecay = decay.bondDecay;
  let effectiveHungerDecay = decay.hungerDecay;

  // P10-H: Apply 2× decay multiplier for sick pets in Classic mode (Bible §9.4.7.3)
  // "If sick: apply 2× stat decay for sick duration (Classic)"
  const isSickClassic = gameMode === 'classic' && pet.isSick;
  if (isSickClassic) {
    const sickMultiplier = SICKNESS_CONFIG.SICK_DECAY_MULTIPLIER;
    effectiveMoodDecay *= sickMultiplier;
    effectiveBondDecay *= sickMultiplier;
    effectiveHungerDecay *= sickMultiplier;
  }

  // P10-B2: Apply 2× mood decay multiplier if poop was dirty for 60+ minutes
  // Note: This stacks with sickness multiplier if both conditions apply
  if (pet.isPoopDirty && pet.poopDirtyStartTimestamp !== null && lastSeenTimestamp !== undefined) {
    // Calculate how long poop was dirty at save time
    const dirtyMinutesAtSave = (lastSeenTimestamp - pet.poopDirtyStartTimestamp) / (1000 * 60);
    // If poop was dirty for 60+ minutes at save time, apply 2× multiplier to offline mood decay
    if (dirtyMinutesAtSave >= POOP_MOOD_DECAY.ACCELERATION_THRESHOLD_MINUTES) {
      effectiveMoodDecay = effectiveMoodDecay * POOP_MOOD_DECAY.ACCELERATION_MULTIPLIER;
    }
  }

  return {
    ...pet,
    moodValue: Math.max(
      OFFLINE_DECAY_RATES.MOOD_FLOOR,
      (pet.moodValue ?? 50) - effectiveMoodDecay
    ),
    bond: Math.max(
      OFFLINE_DECAY_RATES.BOND_FLOOR,
      pet.bond - effectiveBondDecay
    ),
    hunger: Math.max(
      OFFLINE_DECAY_RATES.HUNGER_FLOOR,
      pet.hunger - effectiveHungerDecay
    ),
  };
}

/**
 * Find the first non-runaway pet in ownedPetIds order.
 * Bible §9.4.4: Auto-switch to next available pet in slot order.
 * @returns PetInstanceId of first available pet, or null if all are runaway
 */
function findFirstAvailablePet(
  ownedPetIds: PetInstanceId[],
  neglectByPetId: Record<string, NeglectState>
): PetInstanceId | null {
  for (const petId of ownedPetIds) {
    const neglectState = neglectByPetId[petId];
    // Pet is available if no neglect state or not runaway
    if (!neglectState || !neglectState.isRunaway) {
      return petId;
    }
  }
  return null; // All pets are runaway
}

/**
 * Get the pet's display name from instance ID.
 * Extracts species name and capitalizes first letter.
 */
function getPetDisplayName(instanceId: PetInstanceId): string {
  // instanceId format: "{speciesId}-{suffix}" e.g., "munchlet-starter"
  const speciesId = instanceId.split('-')[0];
  return speciesId.charAt(0).toUpperCase() + speciesId.slice(1);
}

/**
 * Get alert badge for a pet based on neglect state.
 * Bible §11.6.1: ⚠️ (Worried/Sad), 💔 (Withdrawn/Critical), 🔒 (Runaway)
 */
function getAlertBadgeForPet(neglectState: NeglectState | null): AlertBadge | null {
  if (!neglectState) return null;

  if (neglectState.isRunaway) {
    return ALERT_BADGES.LOCKED;
  }
  if (neglectState.currentStage === 'withdrawn' || neglectState.currentStage === 'critical') {
    return ALERT_BADGES.URGENT;
  }
  if (neglectState.currentStage === 'worried' || neglectState.currentStage === 'sad') {
    return ALERT_BADGES.WARNING;
  }
  return null;
}

/**
 * Check if an alert can be shown based on suppression rules.
 * Bible §11.6.1: 30-min cooldown per pet, 5 non-critical per session, runaway bypasses.
 */
function canShowAlert(
  petId: PetInstanceId,
  isRunaway: boolean,
  suppression: AlertSuppressionState,
  now: number = Date.now()
): boolean {
  // Runaway always bypasses suppression
  if (isRunaway) {
    return true;
  }

  // Check session limit
  if (suppression.sessionAlertCount >= ALERT_SUPPRESSION.SESSION_LIMIT) {
    return false;
  }

  // Check per-pet cooldown
  const lastAlert = suppression.lastAlertByPet[petId] ?? 0;
  const cooldownMs = ALERT_SUPPRESSION.COOLDOWN_MINUTES * 60 * 1000;
  if (now - lastAlert < cooldownMs) {
    return false;
  }

  return true;
}

/**
 * P10-D: Check if pet health state blocks mini-games (Classic Mode only).
 * Bible v1.8: Sick pets and Obese pets (weight >= 81) cannot play mini-games.
 * Cozy Mode bypasses ALL health gates.
 *
 * Gate order (deterministic):
 * 1. Cozy mode → allowed (short-circuit)
 * 2. Sick → blocked with reason 'sick'
 * 3. Obese (weight >= 81) → blocked with reason 'obese'
 * 4. Otherwise → allowed
 */
export type MinigameGateResult = { allowed: true } | { allowed: false; reason: 'sick' | 'obese' };

export function getMinigameGateReason(
  pet: { isSick: boolean; weight: number },
  mode: 'cozy' | 'classic'
): MinigameGateResult {
  // 1. Cozy mode bypasses ALL health gates
  if (mode === 'cozy') {
    return { allowed: true };
  }

  // 2. Sick check (Classic only)
  if (pet.isSick) {
    return { allowed: false, reason: 'sick' };
  }

  // 3. Obese check: weight >= 81 (Classic only)
  if (pet.weight >= MINIGAME_GATING.OBESE_THRESHOLD) {
    return { allowed: false, reason: 'obese' };
  }

  // 4. All gates passed
  return { allowed: true };
}

// Initial state factory
function createInitialState() {
  // P9-A: Initialize multi-pet state
  const multiPetState = createInitialMultiPetState();
  const activePet = multiPetState.petsById[multiPetState.activePetId];

  return {
    // P9-A: Keep legacy 'pet' field synced with active pet for backward compat
    pet: activePet ? { ...activePet, id: activePet.speciesId } : createInitialPet('munchlet'),
    currencies: {
      coins: STARTING_RESOURCES.COINS, // BCT-ECON-004: 100
      gems: STARTING_RESOURCES.GEMS,   // BCT-ECON-005: 0
      eventTokens: 0,
    } as Record<CurrencyType, number>,
    inventory: { ...STARTING_INVENTORY }, // BCT-ECON-006-008: 2 apple, 2 banana, 1 cookie
    inventoryCapacity: INVENTORY_CONFIG.BASE_CAPACITY, // BCT-INV-001: 15
    stats: {
      totalFeeds: 0,
      totalXpEarned: 0,
      totalCoinsEarned: 0,
      sessionStartTime: Date.now(),
      lastFeedTime: 0,
      minigamesCompleted: 0, // For Chomper unlock and analytics
      lastFeedCooldownStart: 0, // Bible §4.3 - Cooldown persists across refresh
    } as GameStats,
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      autoSave: true,
    } as GameSettings,
    unlockedPets: [...STARTER_PETS], // Start with munchlet, grib, plompo (species unlocks)
    energy: createInitialEnergyState(),
    dailyMiniGames: createInitialDailyState(),
    ftue: {
      activeStep: null,
      hasCompletedFtue: false,
      selectedPetId: null,
      selectedMode: null,
    } as FtueState,
    playMode: 'cozy' as PlayMode, // Default to Cozy mode (Bible §9)
    environment: { ...DEFAULT_ENVIRONMENT },
    abilityTriggers: [] as AbilityTrigger[], // P1-ABILITY-4
    // P7-NEGLECT-SYSTEM: Per-pet neglect tracking (Classic Mode only)
    neglectByPetId: {} as Record<string, NeglectState>,
    accountCreatedAt: null as string | null,
    // P8-SHOP-CATALOG: Shop UI state (Shop-A: UI only, no purchase logic)
    isShopOpen: false,
    shopActiveTab: 'food' as 'food' | 'care' | 'cosmetics' | 'gems',
    // P9-A: Multi-pet foundation state
    petsById: multiPetState.petsById,
    ownedPetIds: multiPetState.ownedPetIds,
    activePetId: multiPetState.activePetId,
    unlockedSlots: PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS, // Bible §11.6: starts with 1 slot
    // P9-B: Alert suppression state (Bible §11.6.1)
    alertSuppression: createInitialAlertSuppressionState(),
    // P9-B: Last seen timestamp for offline fanout calculation
    lastSeenTimestamp: Date.now(),
    // P9-B: All pets away state
    allPetsAway: false,
    // P11-0: Gem source state (Bible §10.3, §11.4)
    loginStreak: {
      lastLoginDateKey: null,
      loginStreakDay: 1,
    } as LoginStreakState,
    lastFirstFeedDateKey: null as string | null,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialState(),
      
      // ========================================
      // FEEDING (Bible §4.3-4.4)
      // ========================================
      feed: (foodId: string): FeedResult | null => {
        const state = get();
        const now = Date.now();

        // Bible §4.4: STUFFED pets cannot be fed (91-100 fullness blocks feeding entirely)
        if (isStuffed(state.pet.hunger)) {
          console.log(`[Feeding] Blocked: Pet is STUFFED (fullness=${state.pet.hunger})`);
          return {
            success: false,
            foodId,
            reaction: 'neutral',
            xpGained: 0,
            bondGained: 0,
            coinsGained: 0,
            leveledUp: false,
            wasBlocked: true,
            feedValueMultiplier: 0,
          };
        }

        // Calculate feed value multiplier (fullness × cooldown)
        const feedValueMultiplier = getCombinedFeedValue(
          state.pet.hunger,
          state.stats.lastFeedCooldownStart,
          now
        );
        const wasOnCooldown = isOnCooldown(state.stats.lastFeedCooldownStart, now);

        // Process the base feed
        const result = processFeed(state.pet, foodId, state.inventory);

        if (!result || !result.success) {
          return null;
        }

        // Apply fullness/cooldown multiplier to gains (Bible §4.3-4.4)
        const adjustedXP = Math.round(result.xpGained * feedValueMultiplier);
        const adjustedBond = result.bondGained * feedValueMultiplier;
        const adjustedCoins = Math.round(result.coinsGained * feedValueMultiplier);

        if (wasOnCooldown) {
          console.log(`[Feeding] On cooldown: applying ${feedValueMultiplier}x multiplier`);
        }

        // Apply all changes
        // P6-T2-PET-BEHAVIORS: Set transient eating pose
        const eatingPose = getEatingPoseForReaction(result.reaction);
        const transientPoseDurationMs = 2000; // 2 seconds
        const feedTime = Date.now(); // Use separate var to avoid shadowing 'now'

        set((state) => {
          // Update inventory
          const newInventory = { ...state.inventory };
          newInventory[foodId] = (newInventory[foodId] || 0) - 1;
          if (newInventory[foodId] <= 0) {
            delete newInventory[foodId];
          }

          // P6-MOOD-SYSTEM: Update mood value using Bible §4.5 system
          // P6-FTUE-MODES: Pass playMode for penalty severity adjustment
          const newMoodValue = updateMoodValue(state.pet.moodValue ?? 50, result.reaction, state.pet.id, state.playMode);

          // Update pet with adjusted gains
          const newPet: PetState = {
            ...state.pet,
            xp: state.pet.xp + adjustedXP,
            bond: Math.min(GAME_CONFIG.maxBond, state.pet.bond + adjustedBond),
            hunger: Math.min(GAME_CONFIG.maxHunger, state.pet.hunger +
              (result.reaction === 'ecstatic' ? 20 :
               result.reaction === 'positive' ? 15 :
               result.reaction === 'negative' ? 5 : 10)),
            mood: syncMoodState(newMoodValue),
            moodValue: newMoodValue,
            lastMoodUpdate: feedTime,
            // P6-T2-PET-BEHAVIORS: Set transient pose for eating animation
            transientPose: {
              pose: eatingPose,
              expiresAt: feedTime + transientPoseDurationMs,
            },
          };

          // P10-B1.5: Handle poop spawn on feeding (Bible v1.8 §9.5)
          // Update petsById directly for poop state (OwnedPetState fields)
          const activePetId = state.activePetId;
          const currentOwnedPet = state.petsById[activePetId];
          let updatedPetsById = state.petsById;

          if (currentOwnedPet) {
            const speciesId = currentOwnedPet.speciesId;
            const poopThreshold = POOP_FREQUENCY[speciesId] ?? 4; // Default to 4 if unknown
            const newFeedingCount = (currentOwnedPet.feedingsSinceLastPoop ?? 0) + 1;

            let newIsPoopDirty = currentOwnedPet.isPoopDirty ?? false;
            let newPoopDirtyStartTimestamp = currentOwnedPet.poopDirtyStartTimestamp ?? null;
            let newFeedingsSinceLastPoop = newFeedingCount;

            // Check if poop should spawn (only if no existing poop)
            if (!newIsPoopDirty && newFeedingCount >= poopThreshold) {
              newIsPoopDirty = true;
              newPoopDirtyStartTimestamp = feedTime;
              newFeedingsSinceLastPoop = 0; // Reset counter after spawn
            }

            // P10-C: Apply snack weight gain (Bible v1.8 §5.7, §9.4.7.1)
            // Weight gain applies in both Cozy and Classic modes
            const weightGain = SNACK_WEIGHT_GAIN[foodId] ?? 0;
            const currentWeight = currentOwnedPet.weight ?? 0;
            const newWeight = Math.min(100, currentWeight + weightGain);

            // P10-C: Immediate sickness triggers (Bible v1.8 §9.4.7.2)
            // Classic Mode only - Cozy mode is immune to all sickness
            let newIsSick = currentOwnedPet.isSick ?? false;
            let newSickStartTimestamp = currentOwnedPet.sickStartTimestamp ?? null;

            // Only check triggers if not already sick and in Classic mode
            if (!newIsSick && state.playMode === 'classic') {
              let becameSick = false;

              // 1. Hot Pepper trigger (5% always)
              if (foodId === 'hot_pepper') {
                if (randomFloat() < FEEDING_SICKNESS_TRIGGERS.HOT_PEPPER_CHANCE) {
                  becameSick = true;
                }
              }

              // 2. Overweight snack trigger (5% per snack when weight >= 61)
              // Only check if not already sick from hot pepper (early exit)
              if (!becameSick) {
                const isSnack = SNACK_WEIGHT_GAIN[foodId] !== undefined;
                const isOverweight = newWeight >= FEEDING_SICKNESS_TRIGGERS.OVERWEIGHT_THRESHOLD;
                if (isSnack && isOverweight) {
                  if (randomFloat() < FEEDING_SICKNESS_TRIGGERS.OVERWEIGHT_SNACK_CHANCE) {
                    becameSick = true;
                  }
                }
              }

              if (becameSick) {
                newIsSick = true;
                newSickStartTimestamp = feedTime;
                console.log(`[P10-C] Pet ${activePetId} became sick from feeding ${foodId} (weight: ${newWeight})`);
              }
            }

            updatedPetsById = {
              ...state.petsById,
              [activePetId]: {
                ...currentOwnedPet,
                // Sync core pet fields
                level: newPet.level,
                xp: newPet.xp,
                bond: newPet.bond,
                mood: newPet.mood,
                moodValue: newPet.moodValue,
                hunger: newPet.hunger,
                evolutionStage: newPet.evolutionStage,
                transientPose: newPet.transientPose,
                lastMoodUpdate: newPet.lastMoodUpdate,
                // P10-B1.5: Poop state updates
                isPoopDirty: newIsPoopDirty,
                poopDirtyStartTimestamp: newPoopDirtyStartTimestamp,
                feedingsSinceLastPoop: newFeedingsSinceLastPoop,
                // P10-C: Weight and sickness state updates
                weight: newWeight,
                isSick: newIsSick,
                sickStartTimestamp: newSickStartTimestamp,
              },
            };
          }

          // Handle level up (with adjusted XP)
          let leveledUp = false;
          let newLevel = state.pet.level;
          const xpNeeded = getXPForLevel(state.pet.level + 1);
          if (newPet.xp >= xpNeeded && state.pet.level < GAME_CONFIG.maxLevel) {
            leveledUp = true;
            newLevel = state.pet.level + 1;
            newPet.level = newLevel;
            // Reset XP to overflow amount
            newPet.xp = newPet.xp - xpNeeded;
            // Check evolution
            newPet.evolutionStage = getEvolutionStage(newLevel);
          }

          // Update currencies with adjusted coins
          const newCurrencies = { ...state.currencies };
          newCurrencies.coins += adjustedCoins;

          // Level up bonus
          if (leveledUp) {
            newCurrencies.coins += 20; // Level up coin bonus
            // P11-0: Award +5💎 per level gained (Bible §11.4)
            // Luxe's Golden Touch ability: +100% gem drops
            const levelsGained = newLevel - state.pet.level;
            const baseGems = 5 * levelsGained;
            const finalGems = applyGemMultiplier(state.pet.id, baseGems);
            newCurrencies.gems += finalGems;
            console.log(`[P11-0] Level up! +${finalGems}💎 (${levelsGained} level${levelsGained > 1 ? 's' : ''} × 5)`);
          }

          // Update stats - Bible §4.3: Each feeding restarts the cooldown timer
          const newStats: GameStats = {
            ...state.stats,
            totalFeeds: state.stats.totalFeeds + 1,
            totalXpEarned: state.stats.totalXpEarned + adjustedXP,
            totalCoinsEarned: state.stats.totalCoinsEarned + adjustedCoins,
            lastFeedTime: now,
            lastFeedCooldownStart: now, // Reset cooldown on each feed
          };

          // P11-0: First feed daily gem source (Bible §11.4)
          // Award +1💎 on the first successful feed per local calendar day
          const todayKey = getLocalDateKey();
          let newLastFirstFeedDateKey = state.lastFirstFeedDateKey;
          if (!isSameDay(state.lastFirstFeedDateKey, todayKey)) {
            // First feed of the day - award +1💎
            newCurrencies.gems += 1;
            newLastFirstFeedDateKey = todayKey;
            console.log(`[P11-0] First feed daily! +1💎 (date: ${todayKey})`);
          }

          return {
            pet: newPet,
            currencies: newCurrencies,
            inventory: newInventory,
            stats: newStats,
            // P10-B1.5: Include updated petsById with poop state
            petsById: updatedPetsById,
            // P11-0: Update last first feed date
            lastFirstFeedDateKey: newLastFirstFeedDateKey,
          };
        });

        // Bible §14.4: Switch to kitchen when feeding
        get().setRoom(ROOM_ACTIVITY_MAP.feeding as RoomId);

        // P1-ABILITY-4: Emit ability triggers based on what abilities were applied
        const food = getFoodById(foodId);
        const petId = state.pet.id;

        // Munchlet: bond_bonus - always triggers on feed
        if (hasAbilityEffect(petId, 'bond_bonus')) {
          const trigger = createAbilityTrigger('bond_bonus');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        // Grib: mood_penalty_reduction - triggers on negative reaction
        if (hasAbilityEffect(petId, 'mood_penalty_reduction') && result.reaction === 'negative') {
          const trigger = createAbilityTrigger('mood_penalty_reduction');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        // Ember: spicy_coin_bonus - triggers on spicy food
        if (food && hasAbilityEffect(petId, 'spicy_coin_bonus') && isSpicyFood(food)) {
          const trigger = createAbilityTrigger('spicy_coin_bonus');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        // Chomper: no_dislikes - triggers when original affinity was 'disliked'
        if (food && hasAbilityEffect(petId, 'no_dislikes') && food.affinity[petId] === 'disliked') {
          const trigger = createAbilityTrigger('no_dislikes');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        // Luxe: gem_multiplier - triggers when level milestone (5, 10, 15...) gives gems
        const newPetState = get().pet;
        if (
          hasAbilityEffect(petId, 'gem_multiplier') &&
          newPetState.level !== state.pet.level &&
          newPetState.level % 5 === 0
        ) {
          const trigger = createAbilityTrigger('gem_multiplier');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        // Return result with adjusted values and cooldown info
        return {
          ...result,
          xpGained: adjustedXP,
          bondGained: adjustedBond,
          coinsGained: adjustedCoins,
          feedValueMultiplier,
          wasOnCooldown,
          wasBlocked: false,
        };
      },

      // ========================================
      // P10-B1.5: POOP CLEANING (Bible v1.8 §9.5)
      // ========================================

      /**
       * P10-B1.5/B2: Clean poop for the specified pet with rewards.
       * Bible v1.8 §9.5: Sets isPoopDirty = false, clears timestamp.
       * P10-B2: Awards +2 Happiness (mood) and +0.1 Bond.
       * Does NOT reset feedingsSinceLastPoop counter.
       */
      cleanPoop: (petId: PetInstanceId) => {
        const state = get();
        const pet = state.petsById[petId];

        if (!pet) {
          console.warn(`[cleanPoop] Pet not found: ${petId}`);
          return;
        }

        // Race-safe guard: only award rewards if poop is actually dirty
        if (!pet.isPoopDirty) {
          console.log(`[cleanPoop] No poop to clean for ${petId} (race guard)`);
          return;
        }

        // P10-B2: Calculate reward values
        const moodBoost = POOP_CLEANING_REWARDS.HAPPINESS_BOOST;
        const bondBoost = POOP_CLEANING_REWARDS.BOND_BOOST;
        const newMoodValue = Math.min(100, (pet.moodValue ?? 50) + moodBoost);
        const newBond = Math.min(100, pet.bond + bondBoost);

        const updatedPet = {
          ...pet,
          isPoopDirty: false,
          poopDirtyStartTimestamp: null,
          // P10-B2: Apply cleaning rewards
          moodValue: newMoodValue,
          bond: newBond,
          // Do NOT reset feedingsSinceLastPoop per Bible §9.5
          // Do NOT reset poopDirtyMinutesAccum here (handled by sickness trigger)
        };

        set({
          petsById: {
            ...state.petsById,
            [petId]: updatedPet,
          },
          // Also update legacy pet field if this is the active pet
          ...(petId === state.activePetId ? {
            pet: { ...updatedPet, id: updatedPet.speciesId },
          } : {}),
        });

        console.log(`[cleanPoop] Cleaned poop for ${petId}, +${moodBoost} mood, +${bondBoost} bond`);
      },

      // ========================================
      // P10-E: RECOVERY ACTIONS
      // ========================================

      /**
       * P10-E: Use medicine to cure sickness (Bible v1.8 §9.4.7.4).
       * Classic mode only. Consumes 1 medicine from inventory.
       */
      useMedicine: (petId: PetInstanceId): RecoveryResult => {
        const state = get();

        // Guard: Classic mode only
        if (state.playMode === 'cozy') {
          console.log(`[useMedicine] COZY_MODE - medicine not needed in Cozy`);
          return { success: false, reason: 'COZY_MODE' };
        }

        const pet = state.petsById[petId];
        if (!pet) {
          console.warn(`[useMedicine] Pet not found: ${petId}`);
          return { success: false, reason: 'NO_ITEM' };
        }

        // Guard: Pet must be sick
        if (!pet.isSick) {
          console.log(`[useMedicine] Pet ${petId} is not sick`);
          return { success: false, reason: 'NOT_SICK' };
        }

        // Guard: Must have medicine in inventory
        const medicineCount = state.inventory['care_medicine'] || 0;
        if (medicineCount <= 0) {
          console.log(`[useMedicine] No medicine in inventory`);
          return { success: false, reason: 'NO_ITEM' };
        }

        // Apply cure inside set() for atomicity
        set((s) => {
          const currentPet = s.petsById[petId];
          // Race guard: check still sick
          if (!currentPet || !currentPet.isSick) {
            return s;
          }

          const updatedPet = {
            ...currentPet,
            isSick: false,
            sickStartTimestamp: null,
          };

          const newInventory = {
            ...s.inventory,
            care_medicine: (s.inventory['care_medicine'] || 0) - 1,
          };

          return {
            ...s,
            petsById: {
              ...s.petsById,
              [petId]: updatedPet,
            },
            inventory: newInventory,
            // Update legacy pet if active
            ...(petId === s.activePetId ? {
              pet: { ...updatedPet, id: updatedPet.speciesId },
            } : {}),
          };
        });

        console.log(`[useMedicine] Cured ${petId} with medicine, inventory now ${(get().inventory['care_medicine'] || 0)}`);
        return { success: true };
      },

      /**
       * P10-E: Use diet food to reduce weight (Bible v1.8 §11.5).
       * -20 weight, +5 hunger. Consumes 1 diet food from inventory.
       */
      useDietFood: (petId: PetInstanceId): RecoveryResult => {
        const state = get();

        const pet = state.petsById[petId];
        if (!pet) {
          console.warn(`[useDietFood] Pet not found: ${petId}`);
          return { success: false, reason: 'NO_ITEM' };
        }

        // Guard: Must have diet food in inventory
        const dietFoodCount = state.inventory['care_diet_food'] || 0;
        if (dietFoodCount <= 0) {
          console.log(`[useDietFood] No diet food in inventory`);
          return { success: false, reason: 'NO_ITEM' };
        }

        // Apply effect inside set() for atomicity
        set((s) => {
          const currentPet = s.petsById[petId];
          if (!currentPet) {
            return s;
          }

          const newWeight = Math.max(0, (currentPet.weight ?? 0) - RECOVERY_EFFECTS.DIET_FOOD.WEIGHT_REDUCTION);
          const newHunger = Math.min(100, (currentPet.hunger ?? 0) + RECOVERY_EFFECTS.DIET_FOOD.HUNGER_GAIN);

          const updatedPet = {
            ...currentPet,
            weight: newWeight,
            hunger: newHunger,
          };

          const newInventory = {
            ...s.inventory,
            care_diet_food: (s.inventory['care_diet_food'] || 0) - 1,
          };

          return {
            ...s,
            petsById: {
              ...s.petsById,
              [petId]: updatedPet,
            },
            inventory: newInventory,
            // Update legacy pet if active
            ...(petId === s.activePetId ? {
              pet: { ...updatedPet, id: updatedPet.speciesId },
            } : {}),
          };
        });

        const newPet = get().petsById[petId];
        console.log(`[useDietFood] ${petId} weight now ${newPet?.weight ?? 0}, hunger now ${newPet?.hunger ?? 0}`);
        return { success: true };
      },

      /**
       * P10-E: Ad recovery stub - Web Edition no-op (Bible v1.8 §9.4.7.4).
       * Ads are [Unity Later]. Returns failure without modifying any state.
       */
      useAdRecovery: (_petId: PetInstanceId): RecoveryResult => {
        // Web Edition: PURE NO-OP
        // Do NOT modify any state, do NOT set any timestamps
        console.log(`[useAdRecovery] WEB_ADS_DISABLED - ads not available on Web`);
        return { success: false, reason: 'WEB_ADS_DISABLED' };
      },

      // ========================================
      // CURRENCY
      // ========================================
      addCurrency: (type: CurrencyType, amount: number, source: string) => {
        if (amount <= 0) return;
        
        set((state) => ({
          currencies: {
            ...state.currencies,
            [type]: state.currencies[type] + amount,
          },
        }));
        
        console.log(`[Economy] +${amount} ${type} from ${source}`);
      },
      
      spendCurrency: (type: CurrencyType, amount: number, sink: string): boolean => {
        const state = get();
        
        if (amount <= 0 || state.currencies[type] < amount) {
          return false;
        }
        
        set((state) => ({
          currencies: {
            ...state.currencies,
            [type]: state.currencies[type] - amount,
          },
        }));
        
        console.log(`[Economy] -${amount} ${type} for ${sink}`);
        return true;
      },
      
      // ========================================
      // INVENTORY
      // ========================================
      buyFood: (foodId: string, quantity: number): boolean => {
        const state = get();
        const food = getFoodById(foodId);

        if (!food) return false;

        // BCT-SHOP-012, BCT-SHOP-013: Check inventory constraints first
        const invCheck = get().canAddToInventory(foodId, quantity);
        if (!invCheck.allowed) {
          console.log(`[Shop] Purchase blocked: ${invCheck.reason}`);
          return false;
        }

        const totalCost = food.coinCost * quantity;

        if (food.coinCost > 0) {
          // BCT-SHOP-011: Insufficient coins blocks purchase
          if (state.currencies.coins < totalCost) {
            console.log('[Shop] Purchase blocked: Not enough coins!');
            return false;
          }

          set((state) => ({
            currencies: {
              ...state.currencies,
              coins: state.currencies.coins - totalCost,
            },
            inventory: {
              ...state.inventory,
              [foodId]: Math.min(
                (state.inventory[foodId] || 0) + quantity,
                INVENTORY_CONFIG.STACK_MAX
              ),
            },
          }));
        } else if (food.gemCost > 0) {
          const gemCost = food.gemCost * quantity;
          if (state.currencies.gems < gemCost) {
            console.log('[Shop] Purchase blocked: Not enough gems!');
            return false;
          }

          set((state) => ({
            currencies: {
              ...state.currencies,
              gems: state.currencies.gems - gemCost,
            },
            inventory: {
              ...state.inventory,
              [foodId]: Math.min(
                (state.inventory[foodId] || 0) + quantity,
                INVENTORY_CONFIG.STACK_MAX
              ),
            },
          }));
        }

        return true;
      },
      
      addFood: (foodId: string, quantity: number) => {
        const state = get();
        const check = get().canAddToInventory(foodId, quantity);
        if (!check.allowed) {
          console.log(`[Inventory] Cannot add ${quantity}x ${foodId}: ${check.reason}`);
          return;
        }

        set((state) => {
          const newQty = (state.inventory[foodId] || 0) + quantity;
          // BCT-INV-004: If quantity reaches 0, remove slot
          if (newQty <= 0) {
            const { [foodId]: _, ...rest } = state.inventory;
            return { inventory: rest };
          }
          return {
            inventory: {
              ...state.inventory,
              [foodId]: Math.min(newQty, INVENTORY_CONFIG.STACK_MAX), // BCT-INV-003
            },
          };
        });
      },

      // BCT-INV-002: Slot counts unique item ids only
      getUsedSlots: (): number => {
        const state = get();
        return Object.entries(state.inventory).filter(([_, qty]) => qty > 0).length;
      },

      // BCT-INV-005 & BCT-INV-006: Check if item can be added
      canAddToInventory: (itemId: string, quantity: number): { allowed: boolean; reason?: string } => {
        const state = get();
        const currentQty = state.inventory[itemId] || 0;
        const newQty = currentQty + quantity;

        // BCT-INV-003: Stack max is 99
        if (newQty > INVENTORY_CONFIG.STACK_MAX) {
          return { allowed: false, reason: 'Inventory full!' };
        }

        // BCT-INV-006: If item already exists, no new slot needed
        if (currentQty > 0) {
          return { allowed: true };
        }

        // BCT-INV-005: New slot required - check capacity
        const usedSlots = Object.entries(state.inventory).filter(([_, qty]) => qty > 0).length;
        if (usedSlots >= state.inventoryCapacity) {
          return { allowed: false, reason: 'Inventory full!' };
        }

        return { allowed: true };
      },
      
      // ========================================
      // MOOD
      // ========================================
      updateMood: (mood: MoodState) => {
        set((state) => ({
          pet: {
            ...state.pet,
            mood,
          },
        }));
      },
      
      // ========================================
      // TIME-BASED UPDATES
      // ========================================
      tick: (deltaMinutes: number) => {
        set((state) => ({
          pet: {
            ...state.pet,
            // Pass petId to apply Plompo's Slow Metabolism ability
            hunger: decayHunger(state.pet.hunger, deltaMinutes, state.pet.id),
          },
        }));
      },
      
      // ========================================
      // PET SELECTION
      // ========================================
      selectPet: (petId: string) => {
        set((state) => ({
          pet: {
            ...state.pet,
            id: petId,
          },
        }));
      },

      // ========================================
      // PET UNLOCKING
      // ========================================
      unlockPet: (petId: string): boolean => {
        const state = get();

        // Already unlocked
        if (state.unlockedPets.includes(petId)) {
          return false;
        }

        const requirement = getPetUnlockRequirement(petId);
        if (!requirement) {
          return false;
        }

        // Free pets should already be unlocked, but handle edge case
        if (requirement.type === 'free') {
          set((state) => ({
            unlockedPets: [...state.unlockedPets, petId],
          }));
          console.log(`[Unlock] Pet ${petId} unlocked (free)`);
          return true;
        }

        // Premium pets can only be unlocked with gems
        if (requirement.type === 'premium') {
          return false;
        }

        // TODO: Add checks for bond_level and minigames_completed
        // when those tracking systems are implemented
        // For now, these unlocks require gem skip

        return false;
      },

      unlockPetWithGems: (petId: string): boolean => {
        const state = get();

        // Already unlocked
        if (state.unlockedPets.includes(petId)) {
          return false;
        }

        const requirement = getPetUnlockRequirement(petId);
        if (!requirement || !requirement.gemSkipCost) {
          return false;
        }

        // Check if player has enough gems
        if (state.currencies.gems < requirement.gemSkipCost) {
          return false;
        }

        // Spend gems and unlock
        set((state) => ({
          currencies: {
            ...state.currencies,
            gems: state.currencies.gems - requirement.gemSkipCost!,
          },
          unlockedPets: [...state.unlockedPets, petId],
        }));

        console.log(`[Unlock] Pet ${petId} unlocked with ${requirement.gemSkipCost} gems`);
        return true;
      },

      isPetUnlocked: (petId: string): boolean => {
        return get().unlockedPets.includes(petId);
      },

      // ========================================
      // ENERGY SYSTEM
      // ========================================
      tickEnergyRegen: () => {
        const state = get();
        const now = Date.now();
        const elapsed = now - state.energy.lastRegenTime;
        const energyToAdd = Math.floor(elapsed / state.energy.regenRateMs);

        if (energyToAdd > 0 && state.energy.current < ENERGY_MAX) {
          const newEnergy = Math.min(
            state.energy.current + energyToAdd,
            ENERGY_MAX
          );

          set({
            energy: {
              ...state.energy,
              current: newEnergy,
              lastRegenTime: now - (elapsed % state.energy.regenRateMs),
            },
          });
        }
      },

      useEnergy: (amount: number): boolean => {
        const state = get();
        if (state.energy.current < amount) {
          return false;
        }

        set({
          energy: {
            ...state.energy,
            current: state.energy.current - amount,
          },
        });
        return true;
      },

      addEnergy: (amount: number) => {
        const state = get();
        const newEnergy = Math.min(state.energy.current + amount, ENERGY_MAX);

        set({
          energy: {
            ...state.energy,
            current: newEnergy,
          },
        });
      },

      getTimeToNextEnergy: (): number => {
        const state = get();
        if (state.energy.current >= ENERGY_MAX) {
          return 0;
        }

        const now = Date.now();
        const elapsed = now - state.energy.lastRegenTime;
        return state.energy.regenRateMs - elapsed;
      },

      // ========================================
      // DAILY PLAY TRACKING
      // ========================================
      resetDailyIfNeeded: () => {
        const state = get();
        const today = getTodayString();

        if (state.dailyMiniGames.date !== today) {
          set({
            dailyMiniGames: createInitialDailyState(),
          });
        }
      },

      canPlay: (gameId: MiniGameId): CanPlayResult => {
        const state = get();

        // P10-D: Health gates FIRST (before any other checks)
        // Get active pet's health state for gating check
        const activePet = state.petsById[state.activePetId];
        if (activePet) {
          const healthGate = getMinigameGateReason(
            { isSick: activePet.isSick ?? false, weight: activePet.weight ?? 0 },
            state.playMode
          );
          if (!healthGate.allowed) {
            const reasonText = healthGate.reason === 'sick'
              ? 'Your pet is sick'
              : 'Your pet is too heavy';
            return { allowed: false, reason: reasonText, isFree: false };
          }
        }

        // Reset daily if needed
        const today = getTodayString();
        if (state.dailyMiniGames.date !== today) {
          // Will be reset on next action, but use fresh state
          return { allowed: true, isFree: true };
        }

        const plays = state.dailyMiniGames.plays[gameId] ?? 0;
        const freeUsed = state.dailyMiniGames.freePlayUsed[gameId] ?? false;

        // First play of day is free (no energy cost)
        if (!freeUsed) {
          return { allowed: true, isFree: true };
        }

        // Daily cap: 3 rewarded plays per game
        if (plays >= DAILY_REWARDED_PLAYS_CAP) {
          return { allowed: false, reason: 'Daily limit reached', isFree: false };
        }

        // Check energy for paid plays
        if (state.energy.current < ENERGY_COST_PER_GAME) {
          return { allowed: false, reason: 'Not enough energy', isFree: false };
        }

        return { allowed: true, isFree: false };
      },

      recordPlay: (gameId: MiniGameId, isFree: boolean) => {
        const state = get();

        // First ensure daily is reset
        const today = getTodayString();
        const dailyState = state.dailyMiniGames.date === today
          ? state.dailyMiniGames
          : createInitialDailyState();

        set({
          dailyMiniGames: {
            ...dailyState,
            date: today,
            plays: {
              ...dailyState.plays,
              [gameId]: (dailyState.plays[gameId] ?? 0) + 1,
            },
            freePlayUsed: {
              ...dailyState.freePlayUsed,
              [gameId]: dailyState.freePlayUsed[gameId] || isFree,
            },
          },
        });
      },

      // ========================================
      // MINI-GAME COMPLETION
      // ========================================
      completeGame: (result: MiniGameResult) => {
        const state = get();

        // Award coins
        if (result.rewards.coins > 0) {
          set((s) => ({
            currencies: {
              ...s.currencies,
              coins: s.currencies.coins + result.rewards.coins,
            },
          }));
          console.log(`[MiniGame] +${result.rewards.coins} coins from ${result.gameId}`);
        }

        // Award XP to pet
        if (result.rewards.xp > 0) {
          const pet = state.pet;
          let newXp = pet.xp + result.rewards.xp;
          let newLevel = pet.level;
          let newStage = pet.evolutionStage;

          // Check for level up
          const xpNeeded = getXPForLevel(pet.level + 1);
          if (newXp >= xpNeeded) {
            newLevel = pet.level + 1;
            newXp = newXp - xpNeeded;
            newStage = getEvolutionStage(newLevel);
            console.log(`[MiniGame] Level up! Now level ${newLevel}`);
          }

          set((s) => ({
            pet: {
              ...s.pet,
              xp: newXp,
              level: newLevel,
              evolutionStage: newStage,
            },
          }));
        }

        // Award food drop if any
        if (result.rewards.foodDrop) {
          set((s) => ({
            inventory: {
              ...s.inventory,
              [result.rewards.foodDrop!]: (s.inventory[result.rewards.foodDrop!] || 0) + 1,
            },
          }));
          console.log(`[MiniGame] +1 ${result.rewards.foodDrop} drop`);
        }

        // Update stats
        set((s) => ({
          stats: {
            ...s.stats,
            minigamesCompleted: s.stats.minigamesCompleted + 1,
            totalXpEarned: s.stats.totalXpEarned + result.rewards.xp,
            totalCoinsEarned: s.stats.totalCoinsEarned + result.rewards.coins,
          },
        }));

        // P1-ABILITY-4: Fizz minigame_bonus trigger
        if (hasAbilityEffect(state.pet.id, 'minigame_bonus')) {
          const trigger = createAbilityTrigger('minigame_bonus');
          if (trigger) get().addAbilityTrigger(trigger);
        }

        console.log(`[MiniGame] Completed ${result.gameId} with ${result.tier} tier (score: ${result.score})`);
      },

      // ========================================
      // FTUE (Bible §7)
      // ========================================
      startFtue: () => {
        set((state) => ({
          ftue: {
            ...state.ftue,
            activeStep: 'splash',
            hasCompletedFtue: false,
          },
        }));
      },

      setFtueStep: (step: FtueStep) => {
        set((state) => ({
          ftue: {
            ...state.ftue,
            activeStep: step,
          },
        }));
      },

      selectFtuePet: (petId: string) => {
        const state = get();

        // P9-A: Find the pet instance for this species
        const instanceId = `${petId}-starter`;
        const ownedPet = state.petsById?.[instanceId];

        set((prev) => ({
          ftue: {
            ...prev.ftue,
            selectedPetId: petId,
          },
          // P9-A: Update activePetId to the starter instance
          activePetId: instanceId,
          // Also set legacy pet field for backward compat
          pet: ownedPet
            ? { ...ownedPet, id: ownedPet.speciesId }
            : { ...prev.pet, id: petId },
        }));
      },

      selectPlayMode: (mode: PlayMode) => {
        set((state) => ({
          ftue: {
            ...state.ftue,
            selectedMode: mode,
          },
          playMode: mode,
        }));
      },

      completeFtue: () => {
        set((state) => ({
          ftue: {
            ...state.ftue,
            activeStep: 'complete',
            hasCompletedFtue: true,
          },
        }));
        console.log('[FTUE] Onboarding complete');
      },

      // ========================================
      // ENVIRONMENT (P3-ENV)
      // ========================================
      refreshTimeOfDay: () => {
        const newTimeOfDay = getTimeOfDay();
        set((state) => ({
          environment: {
            ...state.environment,
            timeOfDay: newTimeOfDay,
            lastUpdated: Date.now(),
          },
        }));
      },

      setRoom: (room: RoomId) => {
        set((state) => ({
          environment: {
            ...state.environment,
            room,
            lastUpdated: Date.now(),
          },
        }));
      },

      syncEnvironmentWithView: (view: AppView) => {
        const newRoom = getDefaultRoomForView(view);
        const newTimeOfDay = getTimeOfDay();
        set((state) => ({
          environment: {
            ...state.environment,
            room: newRoom,
            timeOfDay: newTimeOfDay,
            lastUpdated: Date.now(),
          },
        }));
      },

      // ========================================
      // AUDIO SETTINGS (P5-AUDIO)
      // ========================================
      setSoundEnabled: (enabled: boolean) => {
        // Import dynamically to avoid circular dependency in tests
        import('../audio/audioManager').then(({ audioManager }) => {
          audioManager.setSoundEnabled(enabled);
        });
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: enabled,
          },
        }));
      },

      setMusicEnabled: (enabled: boolean) => {
        // Import dynamically to avoid circular dependency in tests
        import('../audio/audioManager').then(({ audioManager }) => {
          audioManager.setMusicEnabled(enabled);
        });
        set((state) => ({
          settings: {
            ...state.settings,
            musicEnabled: enabled,
          },
        }));
      },

      // ========================================
      // MOOD SYSTEM (P6-MOOD-SYSTEM)
      // ========================================
      tickMoodDecay: (deltaMinutes: number) => {
        set((state) => {
          // P10-B2: Get active pet's poop state for mood decay acceleration
          const activePet = state.petsById[state.activePetId];
          const poopOptions = activePet ? {
            isPoopDirty: activePet.isPoopDirty ?? false,
            poopDirtyStartTimestamp: activePet.poopDirtyStartTimestamp ?? null,
          } : undefined;

          // P6-FTUE-MODES: Pass playMode for decay multiplier
          // P10-B2: Pass poop state for 2× decay when dirty 60+ minutes
          const newMoodValue = decayMood(
            state.pet.moodValue ?? 50,
            deltaMinutes,
            state.pet.id,
            state.playMode,
            poopOptions
          );
          return {
            pet: {
              ...state.pet,
              moodValue: newMoodValue,
              mood: syncMoodState(newMoodValue),
              lastMoodUpdate: Date.now(),
            },
          };
        });
      },

      setMoodValue: (value: number) => {
        set((state) => ({
          pet: {
            ...state.pet,
            moodValue: Math.max(0, Math.min(100, value)),
            mood: syncMoodState(value),
          },
        }));
      },

      // ========================================
      // ABILITY TRIGGERS (P1-ABILITY-4)
      // ========================================
      addAbilityTrigger: (trigger: AbilityTrigger) => {
        set((state) => ({
          abilityTriggers: [...state.abilityTriggers, trigger],
        }));
        console.log(`[Ability] ${trigger.abilityName}: ${trigger.message}`);
      },

      clearExpiredAbilityTriggers: () => {
        const now = Date.now();
        const TRIGGER_DURATION_MS = 3000; // Triggers show for 3 seconds
        set((state) => ({
          abilityTriggers: state.abilityTriggers.filter(
            (trigger) => now - trigger.triggeredAt < TRIGGER_DURATION_MS
          ),
        }));
      },

      // ========================================
      // PET BEHAVIOR (P6-T2-PET-BEHAVIORS)
      // ========================================
      setTransientPose: (pose: PetPose, durationMs: number) => {
        set((state) => ({
          pet: {
            ...state.pet,
            transientPose: {
              pose,
              expiresAt: Date.now() + durationMs,
            },
          },
        }));
      },

      clearTransientPose: () => {
        set((state) => ({
          pet: {
            ...state.pet,
            transientPose: undefined,
          },
        }));
      },

      // ========================================
      // NEGLECT SYSTEM (P7-NEGLECT-SYSTEM)
      // Bible §9.4.3: Classic Mode Only
      // ========================================

      /**
       * Initialize neglect state for a pet.
       * Called when a pet is first adopted or the system initializes.
       */
      initNeglectForPet: (petId: string, now: Date = new Date()) => {
        const state = get();

        // Skip if already initialized
        if (state.neglectByPetId[petId]) {
          return;
        }

        const nowISO = now.toISOString();
        const todayISO = now.toISOString().split('T')[0];

        // Set account created timestamp if not set
        const accountCreatedAt = state.accountCreatedAt ?? nowISO;

        const newNeglectState: NeglectState = {
          ...DEFAULT_NEGLECT_STATE,
          lastCareDate: todayISO,
          lastSeenDate: todayISO,
          isInGracePeriod: true,
          accountCreatedAt,
        };

        set({
          neglectByPetId: {
            ...state.neglectByPetId,
            [petId]: newNeglectState,
          },
          accountCreatedAt,
        });

        console.log(`[Neglect] Initialized state for pet ${petId}`);
      },

      /**
       * Update neglect state on app login/restore.
       * Calculates neglect days based on time since last seen.
       * Bible §9.4.3: Classic Mode only, calendar-day semantics, offline cap.
       */
      updateNeglectOnLogin: (now: Date = new Date()) => {
        const state = get();

        // Mode gate: Skip if neglect disabled (Cozy mode)
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return;
        }

        // FTUE Protection: Skip if FTUE not completed
        if (!state.ftue.hasCompletedFtue) {
          return;
        }

        const todayISO = now.toISOString().split('T')[0];
        const nowTimestamp = now.getTime();
        const updatedNeglect: Record<string, NeglectState> = {};

        for (const [petId, neglectState] of Object.entries(state.neglectByPetId)) {
          let newState = { ...neglectState };

          // Update last seen to today
          const lastSeenDate = newState.lastSeenDate ?? todayISO;

          // Check grace period (first 48 hours after account creation)
          if (newState.isInGracePeriod && newState.accountCreatedAt) {
            const accountCreatedMs = new Date(newState.accountCreatedAt).getTime();
            const gracePeriodMs = NEGLECT_CONFIG.GRACE_PERIOD_HOURS * 60 * 60 * 1000;
            if (nowTimestamp - accountCreatedMs >= gracePeriodMs) {
              newState.isInGracePeriod = false;
              console.log(`[Neglect] Grace period ended for pet ${petId}`);
            }
          }

          // Skip neglect calculation if still in grace period
          if (newState.isInGracePeriod) {
            newState.lastSeenDate = todayISO;
            updatedNeglect[petId] = newState;
            continue;
          }

          // Calculate calendar days since last care
          const lastCareDate = newState.lastCareDate ?? todayISO;
          const daysSinceLastCare = calculateCalendarDays(lastCareDate, todayISO);

          // Apply offline cap (Bible §9.4.3: max 14 days)
          const cappedDays = Math.min(daysSinceLastCare, NEGLECT_CONFIG.MAX_DAYS);

          // Only update if days have increased
          if (cappedDays > newState.neglectDays) {
            const oldStage = newState.currentStage;
            newState.neglectDays = cappedDays;

            // Determine new stage
            const stageConfig = getNeglectStage(cappedDays);
            newState.currentStage = stageConfig.id;

            // Handle stage transitions
            if (stageConfig.id !== oldStage) {
              console.log(`[Neglect] Pet ${petId} stage: ${oldStage} -> ${stageConfig.id} (${cappedDays} days)`);

              // Withdrawn state entry (Day 7+)
              if (stageConfig.id === 'withdrawn' && !newState.isWithdrawn) {
                newState.isWithdrawn = true;
                newState.withdrawnAt = now.toISOString();
                newState.recoveryDaysCompleted = 0;

                // Apply immediate bond penalty (-25%)
                // Note: Bond penalty applied via canInteractWithPet checks
                console.log(`[Neglect] Pet ${petId} is now WITHDRAWN`);
              }

              // Runaway state entry (Day 14)
              if (stageConfig.id === 'runaway' && !newState.isRunaway) {
                newState.isRunaway = true;
                newState.runawayAt = now.toISOString();

                // Set return availability timestamps
                const paidReturnMs = nowTimestamp + (NEGLECT_CONFIG.RUNAWAY_PAID_WAIT_HOURS * 60 * 60 * 1000);
                const freeReturnMs = nowTimestamp + (NEGLECT_CONFIG.RUNAWAY_FREE_WAIT_HOURS * 60 * 60 * 1000);
                newState.canReturnPaidAt = new Date(paidReturnMs).toISOString();
                newState.canReturnFreeAt = new Date(freeReturnMs).toISOString();

                console.log(`[Neglect] Pet ${petId} has RUN AWAY! Free return at ${newState.canReturnFreeAt}`);
              }
            }
          }

          newState.lastSeenDate = todayISO;
          updatedNeglect[petId] = newState;
        }

        set({ neglectByPetId: updatedNeglect });
      },

      /**
       * Register a qualifying care action (feed or play).
       * Bible §9.4.3: Only feed and play count as care.
       */
      registerCareEvent: (petId: string, now: Date = new Date()) => {
        const state = get();

        // Mode gate: Skip if neglect disabled (Cozy mode)
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return;
        }

        // Initialize if needed
        if (!state.neglectByPetId[petId]) {
          get().initNeglectForPet(petId, now);
        }

        const neglectState = state.neglectByPetId[petId];
        if (!neglectState) return;

        // Can't care for a runaway pet
        if (neglectState.isRunaway) {
          console.log(`[Neglect] Cannot care for runaway pet ${petId}`);
          return;
        }

        const todayISO = now.toISOString().split('T')[0];
        const lastCareDate = neglectState.lastCareDate;

        // Check if this is a new care day (different calendar day)
        const isNewCareDay = lastCareDate !== todayISO;

        let newState = { ...neglectState };
        newState.lastCareDate = todayISO;

        // Handle recovery from withdrawn state
        if (newState.isWithdrawn) {
          if (isNewCareDay) {
            newState.recoveryDaysCompleted++;
            console.log(`[Neglect] Pet ${petId} recovery progress: ${newState.recoveryDaysCompleted}/${NEGLECT_CONFIG.FREE_RECOVERY_CARE_DAYS} days`);

            // Check if free recovery complete
            if (newState.recoveryDaysCompleted >= NEGLECT_CONFIG.FREE_RECOVERY_CARE_DAYS) {
              newState = resetNeglectState(newState, now);
              console.log(`[Neglect] Pet ${petId} recovered from withdrawn state (free path)`);
            }
          }
        } else {
          // Not withdrawn: reset neglect counter on care
          newState.neglectDays = 0;
          newState.currentStage = 'normal';
        }

        set({
          neglectByPetId: {
            ...state.neglectByPetId,
            [petId]: newState,
          },
        });
      },

      /**
       * Get current neglect state for a pet.
       */
      getNeglectState: (petId: string): NeglectState | null => {
        const state = get();
        return state.neglectByPetId[petId] ?? null;
      },

      /**
       * Spend gems to recover from withdrawn state.
       * Bible §9.4.3: 15 gems for instant withdrawal recovery.
       */
      recoverFromWithdrawnWithGems: (petId: string): boolean => {
        const state = get();

        // Mode gate
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return false;
        }

        const neglectState = state.neglectByPetId[petId];
        if (!neglectState || !neglectState.isWithdrawn || neglectState.isRunaway) {
          return false;
        }

        // Check gems
        const gemCost = NEGLECT_CONFIG.WITHDRAWN_RECOVERY_GEMS;
        if (state.currencies.gems < gemCost) {
          console.log(`[Neglect] Not enough gems for withdrawal recovery (need ${gemCost}, have ${state.currencies.gems})`);
          return false;
        }

        // Spend gems
        const newCurrencies = {
          ...state.currencies,
          gems: state.currencies.gems - gemCost,
        };

        // Reset neglect state
        const newNeglectState = resetNeglectState(neglectState, new Date());

        set({
          currencies: newCurrencies,
          neglectByPetId: {
            ...state.neglectByPetId,
            [petId]: newNeglectState,
          },
        });

        console.log(`[Neglect] Pet ${petId} recovered from withdrawn with ${gemCost} gems`);
        return true;
      },

      /**
       * Spend gems to speed up runaway return.
       * Bible §9.4.3: 25 gems after 24h wait.
       */
      recoverFromRunawayWithGems: (petId: string): boolean => {
        const state = get();
        const now = new Date();

        // Mode gate
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return false;
        }

        const neglectState = state.neglectByPetId[petId];
        if (!neglectState || !neglectState.isRunaway) {
          return false;
        }

        // Check if paid return is available (24h wait)
        if (neglectState.canReturnPaidAt) {
          const paidReturnTime = new Date(neglectState.canReturnPaidAt).getTime();
          if (now.getTime() < paidReturnTime) {
            console.log(`[Neglect] Paid return not yet available for pet ${petId}`);
            return false;
          }
        }

        // Check gems
        const gemCost = NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS;
        if (state.currencies.gems < gemCost) {
          console.log(`[Neglect] Not enough gems for runaway recovery (need ${gemCost}, have ${state.currencies.gems})`);
          return false;
        }

        // Spend gems
        const newCurrencies = {
          ...state.currencies,
          gems: state.currencies.gems - gemCost,
        };

        // Apply bond penalty and reset state
        const newNeglectState = resetNeglectState(neglectState, now);

        // Apply -50% bond penalty
        const currentBond = state.pet.bond;
        const bondPenalty = Math.floor(currentBond * 0.5);
        const newBond = Math.max(0, currentBond - bondPenalty);

        set({
          currencies: newCurrencies,
          neglectByPetId: {
            ...state.neglectByPetId,
            [petId]: newNeglectState,
          },
          pet: {
            ...state.pet,
            bond: newBond,
          },
        });

        console.log(`[Neglect] Pet ${petId} returned from runaway with ${gemCost} gems (bond: ${currentBond} -> ${newBond})`);
        return true;
      },

      /**
       * Call back a runaway pet (free path after 72h).
       * Bible §9.4.3: Free return after 72h wait.
       */
      callBackRunawayPet: (petId: string, now: Date = new Date()): boolean => {
        const state = get();

        // Mode gate
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return false;
        }

        const neglectState = state.neglectByPetId[petId];
        if (!neglectState || !neglectState.isRunaway) {
          return false;
        }

        // Check if free return is available (72h wait)
        if (neglectState.canReturnFreeAt) {
          const freeReturnTime = new Date(neglectState.canReturnFreeAt).getTime();
          if (now.getTime() < freeReturnTime) {
            console.log(`[Neglect] Free return not yet available for pet ${petId}`);
            return false;
          }
        }

        // Reset neglect state
        const newNeglectState = resetNeglectState(neglectState, now);

        // Apply -50% bond penalty
        const currentBond = state.pet.bond;
        const bondPenalty = Math.floor(currentBond * 0.5);
        const newBond = Math.max(0, currentBond - bondPenalty);

        set({
          neglectByPetId: {
            ...state.neglectByPetId,
            [petId]: newNeglectState,
          },
          pet: {
            ...state.pet,
            bond: newBond,
          },
        });

        console.log(`[Neglect] Pet ${petId} returned from runaway (free path) (bond: ${currentBond} -> ${newBond})`);
        return true;
      },

      /**
       * Check if pet can be interacted with (not locked out).
       * Bible §9.4.3: Runaway pets are locked out.
       */
      canInteractWithPet: (petId: string): boolean => {
        const state = get();

        // Mode gate: In Cozy mode, always can interact
        if (!MODE_CONFIG[state.playMode].neglectEnabled) {
          return true;
        }

        const neglectState = state.neglectByPetId[petId];
        if (!neglectState) {
          return true;
        }

        // Runaway pets are locked out
        return !neglectState.isRunaway;
      },

      // ========================================
      // SHOP UI (P8-SHOP-CATALOG, Shop-A: UI only)
      // ========================================
      openShop: () => {
        set({ isShopOpen: true });
      },

      closeShop: () => {
        set({ isShopOpen: false });
      },

      setShopTab: (tab: 'food' | 'care' | 'cosmetics' | 'gems') => {
        set({ shopActiveTab: tab });
      },

      // ========================================
      // SHOP PURCHASE (P8-SHOP-PURCHASE, Shop-B)
      // BCT-SHOP-010: Currency deducted, inventory updated
      // BCT-SHOP-011: Insufficient coins blocks purchase
      // BCT-SHOP-012: Inventory full blocks purchase
      // BCT-SHOP-013: Stack limit blocks purchase
      // BCT-INV-007: Purchase adds correct quantity
      // BCT-INV-008: Bundle decomposed correctly
      // ========================================
      purchaseShopItem: (
        itemId: string,
        quantity: number = 1,
        options: ShopPurchaseOptions = {}
      ): ShopPurchaseResult => {
        const state = get();

        // Build purchase state
        const purchaseState = {
          coins: state.currencies.coins,
          gems: state.currencies.gems,
          inventory: state.inventory,
          inventoryCapacity: state.inventoryCapacity,
        };

        // Execute purchase
        const result = executePurchase(purchaseState, itemId, quantity, options);

        if (result.success && result.itemsAdded) {
          // Apply state changes
          set((s) => {
            // Update currencies
            const newCurrencies = {
              ...s.currencies,
              coins: result.newCoins ?? s.currencies.coins,
              gems: result.newGems ?? s.currencies.gems,
            };

            // Update inventory with decomposed items
            const newInventory = { ...s.inventory };
            for (const [addItemId, addQty] of Object.entries(result.itemsAdded!)) {
              const currentQty = newInventory[addItemId] || 0;
              newInventory[addItemId] = Math.min(
                currentQty + addQty,
                INVENTORY_CONFIG.STACK_MAX
              );
            }

            return {
              currencies: newCurrencies,
              inventory: newInventory,
            };
          });

          console.log(
            `[Shop] Purchased ${itemId} ×${quantity} for ${result.totalCost} ${result.currency}. ` +
            `Items added: ${JSON.stringify(result.itemsAdded)}`
          );
        } else {
          console.log(`[Shop] Purchase failed: ${result.error}`);
        }

        return result;
      },

      // ========================================
      // P9-A: MULTI-PET FOUNDATION
      // Bible §11.6: Pet Slots system
      // ========================================

      /**
       * Get the currently active pet.
       * Returns null if no pets owned (should never happen in normal play).
       */
      getActivePet: (): OwnedPetState | null => {
        const state = get();
        if (!state.activePetId || !state.petsById) {
          return null;
        }
        return state.petsById[state.activePetId] ?? null;
      },

      /**
       * Switch to a different owned pet.
       * Bible §11.6: "Switching between slotted pets is instant"
       * Bible §9.4.5: Switching constraints during neglect states
       * @returns Object with success status and optional warning message
       */
      setActivePet: (petId: PetInstanceId): { success: boolean; warning?: string } => {
        const state = get();

        // Validate pet exists in owned pets
        if (!state.petsById || !state.petsById[petId]) {
          console.warn(`[MultiPet] Cannot switch to unknown pet: ${petId}`);
          return { success: false };
        }

        const newActivePet = state.petsById[petId];
        const neglectState = state.neglectByPetId[petId];

        // Bible §9.4.5: Check if switching to runaway pet
        // Runaway pets can be selected to view recovery UI, but player can't interact
        let warning: string | undefined;
        if (neglectState?.isRunaway) {
          // Allow selection for recovery UI viewing
          console.log(`[MultiPet] Selected runaway pet ${petId} for recovery view`);
          warning = `${getPetDisplayName(petId)} has run away. You can only view recovery options.`;
        } else if (neglectState?.currentStage === 'withdrawn' || neglectState?.currentStage === 'critical') {
          // Bible §9.4.5: Show warning for withdrawn/critical pets
          warning = `${getPetDisplayName(petId)} needs extra care to recover`;
          console.log(`[MultiPet] Warning: ${warning}`);
        }

        // Update both activePetId and legacy pet field for backward compat
        set({
          activePetId: petId,
          // Keep legacy 'pet' field synced
          pet: { ...newActivePet, id: newActivePet.speciesId },
        });

        console.log(`[MultiPet] Switched active pet to ${newActivePet.speciesId} (${petId})`);
        return { success: true, warning };
      },

      /**
       * Get all owned pets in acquisition order.
       */
      getOwnedPets: (): OwnedPetState[] => {
        const state = get();
        if (!state.ownedPetIds || !state.petsById) {
          return [];
        }
        return state.ownedPetIds
          .map(id => state.petsById[id])
          .filter((pet): pet is OwnedPetState => pet != null);
      },

      /**
       * Get owned pet by instance ID.
       */
      getOwnedPetById: (petId: PetInstanceId): OwnedPetState | null => {
        const state = get();
        if (!state.petsById) {
          return null;
        }
        return state.petsById[petId] ?? null;
      },

      // ========================================
      // P9-C-SLOTS: PET SLOT UNLOCK
      // Bible §11.6: Pet Slot pricing and prerequisites
      // ========================================

      /**
       * Purchase a pet slot.
       * Bible §11.6: Slot 2 requires Level 5+, Slot 3 requires Slot 2, Slot 4 requires Slot 3.
       * Atomic: No state changes on failure.
       *
       * @param slotNumber The slot to purchase (2, 3, or 4)
       * @returns SlotPurchaseResult with success status and new state values
       */
      purchasePetSlot: (slotNumber: number): SlotPurchaseResult => {
        const state = get();

        // Build purchase state
        // Note: Plus subscription detection not implemented on Web - always false
        // DEFERRED: Plus slot pricing requires Plus detection
        const purchaseState: SlotPurchaseState = {
          gems: state.currencies.gems,
          unlockedSlots: state.unlockedSlots,
          playerLevel: state.pet.level,
          hasPlusSubscription: false, // DEFERRED: Plus subscription not detected on Web
        };

        // Use pure function to validate and calculate
        const result = purchaseSlotFn(purchaseState, slotNumber);

        if (!result.success) {
          console.log(`[Slots] Purchase failed for slot ${slotNumber}: ${result.error}`);
          return result;
        }

        // Atomic state update
        set((s) => ({
          currencies: {
            ...s.currencies,
            gems: result.newGems!,
          },
          unlockedSlots: result.newUnlockedSlots!,
        }));

        console.log(
          `[Slots] Purchased slot ${slotNumber} for ${result.cost} gems. ` +
          `New total: ${result.newUnlockedSlots} slots, ${result.newGems} gems remaining.`
        );

        return result;
      },

      /**
       * Get slot status for all slots.
       * For UI display of owned/locked/unlock-able states.
       */
      getSlotStatuses: (): SlotStatus[] => {
        const state = get();
        return getAllSlotStatuses(
          state.unlockedSlots,
          state.pet.level,
          state.currencies.gems,
          false // DEFERRED: Plus subscription not detected on Web
        );
      },

      // ========================================
      // P11-A: COSMETICS SYSTEM (Bible §11.5.2-§11.5.4)
      // Pet-bound ownership + equip/unequip logic
      // ========================================

      /**
       * Equip a cosmetic on a pet.
       * Bible §11.5.3: Requires ownership, replaces existing in same slot.
       */
      equipCosmetic: (petId: PetInstanceId, cosmeticId: string): CosmeticEquipResult => {
        const state = get();
        const pet = state.petsById[petId];

        // Validate pet exists
        if (!pet) {
          console.warn(`[P11-A] equipCosmetic: Pet not found: ${petId}`);
          return { success: false, error: 'INVALID_PET' };
        }

        // Validate cosmetic exists in catalog
        const cosmeticDef = getCosmeticById(cosmeticId);
        if (!cosmeticDef) {
          console.warn(`[P11-A] equipCosmetic: Cosmetic not found in catalog: ${cosmeticId}`);
          return { success: false, error: 'NOT_FOUND' };
        }

        // Validate pet owns this cosmetic (Bible §11.5.2: pet-bound ownership)
        if (!pet.ownedCosmeticIds.includes(cosmeticId)) {
          console.warn(`[P11-A] equipCosmetic: Pet ${petId} does not own cosmetic ${cosmeticId}`);
          return { success: false, error: 'NOT_OWNED' };
        }

        // Determine slot from cosmetic ID prefix
        const slot = getCosmeticSlot(cosmeticId);
        if (!slot) {
          console.warn(`[P11-A] equipCosmetic: Could not determine slot for ${cosmeticId}`);
          return { success: false, error: 'SLOT_MISMATCH' };
        }

        // Verify slot matches definition
        if (slot !== cosmeticDef.slot) {
          console.warn(`[P11-A] equipCosmetic: Slot mismatch - ID suggests ${slot}, catalog says ${cosmeticDef.slot}`);
          return { success: false, error: 'SLOT_MISMATCH' };
        }

        // Get previous cosmetic in slot (if any) for return value
        const previousCosmeticId = pet.equippedCosmetics[slot] ?? null;

        // Bible §11.5.3: One cosmetic per slot; equipping replaces previous
        set((s) => ({
          petsById: {
            ...s.petsById,
            [petId]: {
              ...s.petsById[petId],
              equippedCosmetics: {
                ...s.petsById[petId].equippedCosmetics,
                [slot]: cosmeticId,
              },
            },
          },
        }));

        console.log(`[P11-A] Equipped ${cosmeticId} on ${petId} (slot: ${slot})${previousCosmeticId ? `, replaced ${previousCosmeticId}` : ''}`);
        return { success: true, previousCosmeticId };
      },

      /**
       * Unequip a cosmetic slot on a pet.
       * Bible §11.5.3: Cosmetic remains owned by pet after unequip.
       */
      unequipCosmetic: (petId: PetInstanceId, slot: CosmeticSlot): CosmeticEquipResult => {
        const state = get();
        const pet = state.petsById[petId];

        // Validate pet exists
        if (!pet) {
          console.warn(`[P11-A] unequipCosmetic: Pet not found: ${petId}`);
          return { success: false, error: 'INVALID_PET' };
        }

        // Get previous cosmetic in slot (if any)
        const previousCosmeticId = pet.equippedCosmetics[slot] ?? null;

        // Clear the slot
        set((s) => {
          const newEquipped = { ...s.petsById[petId].equippedCosmetics };
          delete newEquipped[slot];
          return {
            petsById: {
              ...s.petsById,
              [petId]: {
                ...s.petsById[petId],
                equippedCosmetics: newEquipped,
              },
            },
          };
        });

        console.log(`[P11-A] Unequipped slot ${slot} on ${petId}${previousCosmeticId ? ` (was: ${previousCosmeticId})` : ''}`);
        return { success: true, previousCosmeticId };
      },

      /**
       * Check if a pet owns a specific cosmetic.
       * Bible §11.5.2: Pet-bound ownership check.
       */
      petOwnsCosmetic: (petId: PetInstanceId, cosmeticId: string): boolean => {
        const state = get();
        const pet = state.petsById[petId];
        if (!pet) return false;
        return pet.ownedCosmeticIds.includes(cosmeticId);
      },

      /**
       * Get all cosmetic IDs owned by a pet.
       */
      getPetOwnedCosmetics: (petId: PetInstanceId): string[] => {
        const state = get();
        const pet = state.petsById[petId];
        if (!pet) return [];
        return [...pet.ownedCosmeticIds];
      },

      /**
       * Get equipped cosmetics for a pet.
       */
      getPetEquippedCosmetics: (petId: PetInstanceId): Partial<Record<CosmeticSlot, string>> => {
        const state = get();
        const pet = state.petsById[petId];
        if (!pet) return {};
        return { ...pet.equippedCosmetics };
      },

      /**
       * Purchase a cosmetic with gems for a specific pet.
       * Bible §11.5.2: Pet-bound ownership, gems-only currency.
       * Does NOT auto-equip after purchase.
       */
      buyCosmetic: (petId: PetInstanceId, cosmeticId: string): BuyCosmeticResult => {
        const state = get();

        // Validate pet exists
        const pet = state.petsById[petId];
        if (!pet) {
          console.warn(`[P11-D] buyCosmetic: Pet not found: ${petId}`);
          return { success: false, error: 'INVALID_PET' };
        }

        // Validate cosmetic exists in catalog
        const cosmeticDef = getCosmeticById(cosmeticId);
        if (!cosmeticDef) {
          console.warn(`[P11-D] buyCosmetic: Cosmetic not found in catalog: ${cosmeticId}`);
          return { success: false, error: 'INVALID_COSMETIC' };
        }

        // Check if pet already owns this cosmetic (Bible §11.5.2: pet-bound ownership)
        if (pet.ownedCosmeticIds.includes(cosmeticId)) {
          console.warn(`[P11-D] buyCosmetic: Pet ${petId} already owns cosmetic ${cosmeticId}`);
          return { success: false, error: 'ALREADY_OWNED' };
        }

        // Check sufficient gems (Bible §11.5.2: gems-only currency)
        const priceGems = cosmeticDef.priceGems;
        if (state.currencies.gems < priceGems) {
          console.warn(`[P11-D] buyCosmetic: Insufficient gems (have ${state.currencies.gems}, need ${priceGems})`);
          return { success: false, error: 'INSUFFICIENT_GEMS' };
        }

        // Execute purchase: deduct gems and add to pet's owned cosmetics
        set((s) => ({
          currencies: {
            ...s.currencies,
            gems: s.currencies.gems - priceGems,
          },
          petsById: {
            ...s.petsById,
            [petId]: {
              ...s.petsById[petId],
              ownedCosmeticIds: [...s.petsById[petId].ownedCosmeticIds, cosmeticId],
            },
          },
        }));

        const remainingGems = state.currencies.gems - priceGems;
        console.log(`[P11-D] Purchased cosmetic ${cosmeticId} for pet ${petId} (spent ${priceGems} gems, remaining: ${remainingGems})`);

        return {
          success: true,
          gemsSpent: priceGems,
          remainingGems,
        };
      },

      // ========================================
      // P9-B: MULTI-PET RUNTIME
      // Bible §8.2.1, §9.4.4-9.4.6, §11.6.1
      // ========================================

      /**
       * Apply offline fanout to all owned pets.
       * Bible §9.4.6: Stats change for ALL owned pets simultaneously when offline.
       * P10-B: Adds weight decay + sickness triggers per §9.4.7
       * @param now Current timestamp
       * @returns OfflineReturnSummary with all changes applied
       */
      applyOfflineFanout: (now: Date = new Date()): OfflineReturnSummary | null => {
        const state = get();
        const currentTimestamp = now.getTime();

        // Skip if FTUE not complete (Bible §9.4.6: FTUE protection)
        if (!state.ftue.hasCompletedFtue) {
          return null;
        }

        const lastSeen = state.lastSeenTimestamp ?? currentTimestamp;

        // P10-B: Calculate offline duration with 14-day cap
        const offlineMinutes = calculateOfflineDurationMinutes(lastSeen, currentTimestamp);
        const hoursOffline = offlineMinutes / 60;

        // Skip if not enough time has passed (< 1 hour)
        if (hoursOffline < 1) {
          set({ lastSeenTimestamp: currentTimestamp });
          return null;
        }

        const isCozy = !MODE_CONFIG[state.playMode].neglectEnabled;
        console.log(`[P10-B] Applying offline fanout: ${hoursOffline.toFixed(1)}h offline (mode: ${state.playMode})`);

        // Calculate base stat decay amounts (TODO: check for Plus subscription)
        const decay = calculateOfflineDecay(hoursOffline, false);

        const petChanges: OfflineReturnSummary['petChanges'] = [];
        const updatedPetsById: Record<PetInstanceId, OwnedPetState> = {};

        // Apply decay to ALL owned pets
        for (const petId of state.ownedPetIds) {
          const pet = state.petsById[petId];
          if (!pet) continue;

          const originalMood = pet.moodValue ?? 50;
          const originalBond = pet.bond;
          const originalHunger = pet.hunger;
          const originalWeight = pet.weight;

          // Apply base stat decay (mood/bond/hunger)
          // P10-B2: Pass lastSeen timestamp for poop mood decay acceleration calculation
          // P10-H: Pass gameMode for sick decay multiplier (2× in Classic)
          let updatedPet = applyOfflineDecayToPet(pet, decay, offlineMinutes, lastSeen, state.playMode);

          // P10-B: Apply weight decay + sickness order-of-application
          // Bible §9.4.6, §9.4.7: Weight decays in both modes; sickness Classic only
          const offlineOrderResult = applyOfflineOrderToPet({
            pet: updatedPet,
            offlineMinutes,
            gameMode: state.playMode,
            // For sickness triggers: check if hunger was 0 at save time
            hungerWasZeroAtSave: pet.hunger === 0,
            // P10-B1.5: Use actual poop state instead of hunger proxy (Bible v1.8 §9.5)
            poopWasUncleanedAtSave: pet.isPoopDirty ?? false,
            currentTimestamp,
          });

          // Merge P10-B changes into pet
          updatedPet = offlineOrderResult.pet;
          updatedPetsById[petId] = updatedPet;

          // Get neglect state changes (already handled by updateNeglectOnLogin for Classic)
          const neglectState = state.neglectByPetId[petId];
          const neglectDaysAdded = isCozy ? 0 : (neglectState?.neglectDays ?? 0);
          const newNeglectStage = isCozy ? null : (neglectState?.currentStage ?? null);
          const becameRunaway = isCozy ? false : (neglectState?.isRunaway ?? false);

          petChanges.push({
            petId,
            petName: getPetDisplayName(petId),
            moodChange: (updatedPet.moodValue ?? 50) - originalMood,
            bondChange: updatedPet.bond - originalBond,
            hungerChange: updatedPet.hunger - originalHunger,
            neglectDaysAdded,
            newNeglectStage,
            becameRunaway,
            // P10-B: Add weight/sickness changes to summary
            weightChange: offlineOrderResult.weightChange,
            becameSick: offlineOrderResult.becameSick,
            sicknessTrigger: offlineOrderResult.sicknessTrigger,
            careMistakesAdded: offlineOrderResult.careMistakesAdded,
          });

          if (offlineOrderResult.becameSick) {
            console.log(`[P10-B] Pet ${petId} became sick from ${offlineOrderResult.sicknessTrigger} trigger`);
          }
        }

        // Check if active pet is now runaway and needs auto-switch (Classic only)
        let autoSwitchOccurred = false;
        let newActivePetId: PetInstanceId | null = null;

        if (!isCozy) {
          const activeNeglect = state.neglectByPetId[state.activePetId];
          if (activeNeglect?.isRunaway) {
            // Find first available pet
            newActivePetId = findFirstAvailablePet(state.ownedPetIds, state.neglectByPetId);
            autoSwitchOccurred = newActivePetId !== null && newActivePetId !== state.activePetId;
          }
        }

        // Check if all pets are away (Classic only)
        const allPetsAway = isCozy ? false : findFirstAvailablePet(state.ownedPetIds, state.neglectByPetId) === null;

        // Apply updates
        set({
          petsById: { ...state.petsById, ...updatedPetsById },
          lastSeenTimestamp: currentTimestamp,
          allPetsAway,
          ...(autoSwitchOccurred && newActivePetId ? {
            activePetId: newActivePetId,
            pet: { ...updatedPetsById[newActivePetId], id: updatedPetsById[newActivePetId].speciesId },
          } : {}),
        });

        // Also sync the legacy pet field if it's the active pet
        if (updatedPetsById[state.activePetId] && !autoSwitchOccurred) {
          set((s) => ({
            pet: { ...updatedPetsById[s.activePetId], id: updatedPetsById[s.activePetId].speciesId },
          }));
        }

        const summary: OfflineReturnSummary = {
          hoursOffline,
          petChanges,
          autoSwitchOccurred,
          newActivePetId,
          allPetsAway,
        };

        console.log(`[P10-B] Offline fanout complete:`, summary);
        return summary;
      },

      /**
       * Auto-switch to next available pet when current pet enters runaway.
       * Bible §9.4.4: Auto-switch to first non-runaway pet in slot order.
       * @returns New active pet ID, or null if all pets are runaway
       */
      autoSwitchOnRunaway: (): { newPetId: PetInstanceId | null; allPetsAway: boolean } => {
        const state = get();

        // Find first available pet
        const newPetId = findFirstAvailablePet(state.ownedPetIds, state.neglectByPetId);
        const allPetsAway = newPetId === null;

        if (allPetsAway) {
          console.log('[P9-B] All pets are runaway - entering "All Pets Away" state');
          set({ allPetsAway: true });
          return { newPetId: null, allPetsAway: true };
        }

        if (newPetId && newPetId !== state.activePetId) {
          const newPet = state.petsById[newPetId];
          console.log(`[P9-B] Auto-switching from runaway pet to ${newPet?.speciesId} (${newPetId})`);

          set({
            activePetId: newPetId,
            pet: newPet ? { ...newPet, id: newPet.speciesId } : state.pet,
            allPetsAway: false,
          });
        }

        return { newPetId, allPetsAway: false };
      },

      /**
       * Get status badges for all owned pets.
       * Bible §11.6.1: Badge system for pet selector.
       */
      getPetStatusBadges: (): PetStatusBadge[] => {
        const state = get();

        return state.ownedPetIds.map((petId) => {
          const neglectState = state.neglectByPetId[petId] ?? null;
          const badge = getAlertBadgeForPet(neglectState);
          const needsAttention = badge !== null;
          const neglectStage = neglectState?.currentStage ?? 'normal';

          return {
            petId,
            badge,
            needsAttention,
            neglectStage,
          };
        });
      },

      /**
       * Get count of pets needing attention (for aggregate badge).
       * Bible §11.6.1: Aggregate badge count on pet selector.
       */
      getAggregatedBadgeCount: (): number => {
        const badges = get().getPetStatusBadges();
        return badges.filter((b) => b.needsAttention).length;
      },

      /**
       * Record that an alert was shown (for suppression tracking).
       * Bible §11.6.1: Alert suppression rules.
       */
      recordAlertShown: (petId: PetInstanceId, isRunaway: boolean = false) => {
        const state = get();
        const now = Date.now();

        set({
          alertSuppression: {
            ...state.alertSuppression,
            lastAlertByPet: {
              ...state.alertSuppression.lastAlertByPet,
              [petId]: now,
            },
            // Only increment session count for non-runaway alerts
            sessionAlertCount: isRunaway
              ? state.alertSuppression.sessionAlertCount
              : state.alertSuppression.sessionAlertCount + 1,
          },
        });
      },

      /**
       * Check if alert can be shown for a pet.
       * Bible §11.6.1: Alert suppression rules.
       */
      canShowAlertForPet: (petId: PetInstanceId): boolean => {
        const state = get();
        const neglectState = state.neglectByPetId[petId];
        const isRunaway = neglectState?.isRunaway ?? false;
        return canShowAlert(petId, isRunaway, state.alertSuppression);
      },

      /**
       * Sync changes from legacy pet field to petsById.
       * Called after feeding/playing to keep multi-pet state in sync.
       */
      syncActivePetToStore: () => {
        const state = get();
        const activePetId = state.activePetId;
        const legacyPet = state.pet;

        if (!activePetId || !state.petsById[activePetId]) {
          return;
        }

        // Sync relevant fields from legacy pet to petsById
        const currentPet = state.petsById[activePetId];
        const updatedPet: OwnedPetState = {
          ...currentPet,
          level: legacyPet.level,
          xp: legacyPet.xp,
          bond: legacyPet.bond,
          mood: legacyPet.mood,
          moodValue: legacyPet.moodValue,
          hunger: legacyPet.hunger,
          evolutionStage: legacyPet.evolutionStage,
          transientPose: legacyPet.transientPose,
          lastMoodUpdate: legacyPet.lastMoodUpdate,
          // P10-B1.5: Sync poop state fields (Bible v1.8 §9.5)
          isPoopDirty: (legacyPet as OwnedPetState).isPoopDirty ?? currentPet.isPoopDirty,
          poopDirtyStartTimestamp: (legacyPet as OwnedPetState).poopDirtyStartTimestamp ?? currentPet.poopDirtyStartTimestamp,
          feedingsSinceLastPoop: (legacyPet as OwnedPetState).feedingsSinceLastPoop ?? currentPet.feedingsSinceLastPoop,
        };

        set({
          petsById: {
            ...state.petsById,
            [activePetId]: updatedPet,
          },
        });
      },

      /**
       * Update lastSeenTimestamp (call on app focus/activity).
       */
      updateLastSeen: () => {
        set({ lastSeenTimestamp: Date.now() });
      },

      // ========================================
      // P11-0: GEM SOURCE ACTIONS (Bible §10.3, §11.4)
      // ========================================

      /**
       * Process login streak on app initialization.
       * Call once per app session during hydration.
       * Bible §10.3, §11.4: Awards +10💎 on Day 7, resets streak immediately after.
       */
      processLoginStreak: (): LoginStreakResult => {
        const state = get();
        const todayKey = getLocalDateKey();
        const { lastLoginDateKey, loginStreakDay } = state.loginStreak;

        // Same-day re-open: no processing needed
        if (isSameDay(lastLoginDateKey, todayKey)) {
          console.log(`[P11-0] Same-day login, no streak processing (day ${loginStreakDay})`);
          return {
            newDayLogin: false,
            previousStreakDay: loginStreakDay,
            newStreakDay: loginStreakDay,
            gemsAwarded: 0,
            streakReset: false,
            day7Claimed: false,
          };
        }

        // New day login - process streak
        const previousStreakDay = loginStreakDay;
        let newStreakDay: number;
        let streakReset = false;
        let gemsAwarded = 0;
        let day7Claimed = false;

        // Check if yesterday (consecutive) or missed day(s)
        if (isYesterday(lastLoginDateKey, todayKey)) {
          // Consecutive day - increment streak
          newStreakDay = loginStreakDay + 1;
          console.log(`[P11-0] Consecutive day! Streak: ${loginStreakDay} → ${newStreakDay}`);
        } else {
          // Missed day(s) or first login - reset to Day 1
          newStreakDay = 1;
          streakReset = lastLoginDateKey !== null;
          console.log(`[P11-0] Streak reset to Day 1 ${lastLoginDateKey ? '(missed day)' : '(first login)'}`);
        }

        // Check for Day 7 reward
        if (newStreakDay >= 7) {
          // Award +10💎 for Day 7
          gemsAwarded = 10;
          day7Claimed = true;
          // Reset to Day 1 immediately after claiming
          newStreakDay = 1;
          console.log(`[P11-0] Day 7 reached! +10💎, streak reset to Day 1`);
        }

        // Update state
        set((s) => ({
          currencies: {
            ...s.currencies,
            gems: s.currencies.gems + gemsAwarded,
          },
          loginStreak: {
            lastLoginDateKey: todayKey,
            loginStreakDay: newStreakDay,
          },
        }));

        return {
          newDayLogin: true,
          previousStreakDay,
          newStreakDay,
          gemsAwarded,
          streakReset,
          day7Claimed,
        };
      },

      // ========================================
      // RESET
      // ========================================
      resetGame: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'grundy-save',
      version: 6, // P11-A: Bumped for cosmetic state fields
      migrate: (persistedState: unknown, version: number) => {
        let state = persistedState as Record<string, unknown>;

        // P9-A: Migration from v1 (single-pet) to v2 (multi-pet)
        if (version < 2) {
          console.log('[Migration] Migrating save from v1 to v2 (multi-pet)');

          // Check if already has multi-pet fields (partial migration)
          if (state.petsById && state.ownedPetIds && state.activePetId) {
            console.log('[Migration] Save already has multi-pet fields, skipping');
          } else {
            // Get legacy pet data
            const legacyPet = state.pet as PetState | undefined;
            if (!legacyPet || !legacyPet.id) {
              console.warn('[Migration] No legacy pet found, using fresh state');
              const freshMultiPet = createInitialMultiPetState();
              state = {
                ...state,
                petsById: freshMultiPet.petsById,
                ownedPetIds: freshMultiPet.ownedPetIds,
                activePetId: freshMultiPet.activePetId,
                unlockedSlots: PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS,
              };
            } else {
              // Create instance ID for legacy pet
              const legacySpeciesId = legacyPet.id as string;
              const legacyInstanceId = `${legacySpeciesId}-legacy`;

              // Convert legacy pet to owned pet (preserve all progress)
              // Type assertion needed for migration from untyped legacy data
              const legacyOwnedPet = {
                ...legacyPet,
                instanceId: legacyInstanceId,
                speciesId: legacySpeciesId,
              } as OwnedPetState;

              // Build petsById with legacy pet and other starters
              const petsById: Record<PetInstanceId, OwnedPetState> = {};
              const ownedPetIds: PetInstanceId[] = [];

              // Add legacy pet first (preserves progress)
              petsById[legacyInstanceId] = legacyOwnedPet;
              ownedPetIds.push(legacyInstanceId);

              // Add other starters (fresh state)
              for (const speciesId of STARTER_PET_IDS) {
                if (speciesId !== legacySpeciesId) {
                  const starterInstanceId = `${speciesId}-starter`;
                  petsById[starterInstanceId] = createOwnedPet(speciesId, 'starter');
                  ownedPetIds.push(starterInstanceId);
                }
              }

              console.log(`[Migration] Migrated pet ${legacySpeciesId} to multi-pet structure`);
              console.log(`[Migration] Owned pets: ${ownedPetIds.join(', ')}`);

              state = {
                ...state,
                petsById,
                ownedPetIds,
                activePetId: legacyInstanceId, // Keep playing the same pet
                unlockedSlots: PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS,
              };
            }
          }
        }

        // P10-A: Migration from v2 to v3 - inject weight/sickness fields
        // Bible v1.8 §9.4.7: Weight & Sickness Multi-Pet Rules
        if (version < 3) {
          console.log('[Migration] Migrating save from v2 to v3 (weight/sickness fields)');

          const petsById = state.petsById as Record<string, Record<string, unknown>> | undefined;
          if (petsById) {
            // Inject default weight/sickness fields into each pet
            for (const petId of Object.keys(petsById)) {
              const pet = petsById[petId];
              if (pet.weight === undefined) pet.weight = 0;
              if (pet.isSick === undefined) pet.isSick = false;
              if (pet.sickStartTimestamp === undefined) pet.sickStartTimestamp = null;
              if (pet.hungerZeroMinutesAccum === undefined) pet.hungerZeroMinutesAccum = 0;
              if (pet.poopDirtyMinutesAccum === undefined) pet.poopDirtyMinutesAccum = 0;
              if (pet.offlineSickCareMistakesAccruedThisSession === undefined) {
                pet.offlineSickCareMistakesAccruedThisSession = 0;
              }
            }
            console.log(`[Migration] Injected weight/sickness defaults into ${Object.keys(petsById).length} pets`);
          }
        }

        // P10-B1.5: Migration from v3 to v4 - inject poop state fields
        // Bible v1.8 §9.5: Poop state tracking
        if (version < 4) {
          console.log('[Migration] Migrating save from v3 to v4 (poop state fields)');

          const petsById = state.petsById as Record<string, Record<string, unknown>> | undefined;
          if (petsById) {
            // Inject default poop state fields into each pet
            for (const petId of Object.keys(petsById)) {
              const pet = petsById[petId];
              if (pet.isPoopDirty === undefined) pet.isPoopDirty = false;
              if (pet.poopDirtyStartTimestamp === undefined) pet.poopDirtyStartTimestamp = null;
              if (pet.feedingsSinceLastPoop === undefined) pet.feedingsSinceLastPoop = 0;
            }
            console.log(`[Migration] Injected poop state defaults into ${Object.keys(petsById).length} pets`);
          }
        }

        // P11-0: Migration from v4 to v5 - inject gem source state fields
        // Bible v1.10 §10.3, §11.4: Login streak and daily feed gem tracking
        if (version < 5) {
          console.log('[Migration] Migrating save from v4 to v5 (gem source state fields)');

          // Inject login streak state with safe defaults
          if (state.loginStreak === undefined) {
            state.loginStreak = {
              lastLoginDateKey: null,
              loginStreakDay: 1,
            };
            console.log('[Migration] Injected loginStreak default state');
          }

          // Inject lastFirstFeedDateKey
          if (state.lastFirstFeedDateKey === undefined) {
            state.lastFirstFeedDateKey = null;
            console.log('[Migration] Injected lastFirstFeedDateKey = null');
          }
        }

        // P11-A: Migration from v5 to v6 (cosmetic state fields)
        if (version < 6) {
          console.log('[Migration] Migrating save from v5 to v6 (cosmetic state fields)');

          const petsById = state.petsById as Record<string, Record<string, unknown>> | undefined;
          if (petsById) {
            // Inject cosmetic state fields into each pet
            for (const petId of Object.keys(petsById)) {
              const pet = petsById[petId];
              if (pet.ownedCosmeticIds === undefined) {
                pet.ownedCosmeticIds = [];
              }
              if (pet.equippedCosmetics === undefined) {
                pet.equippedCosmetics = {};
              }
            }
            console.log(`[Migration] Injected cosmetic state into ${Object.keys(petsById).length} pets`);
          }
        }

        return state;
      },
    }
  )
);

// Selector hooks for convenience
export const usePet = () => useGameStore((state) => state.pet);
export const useCurrencies = () => useGameStore((state) => state.currencies);
export const useInventory = () => useGameStore((state) => state.inventory);
export const useInventoryCapacity = () => useGameStore((state) => state.inventoryCapacity);
export const useStats = () => useGameStore((state) => state.stats);
export const useUnlockedPets = () => useGameStore((state) => state.unlockedPets);
export const useEnergy = () => useGameStore((state) => state.energy);
export const useDailyMiniGames = () => useGameStore((state) => state.dailyMiniGames);
export const useFtue = () => useGameStore((state) => state.ftue);
export const usePlayMode = () => useGameStore((state) => state.playMode);
export const useEnvironment = () => useGameStore((state) => state.environment);
export const useSettings = () => useGameStore((state) => state.settings);
export const useAbilityTriggers = () => useGameStore((state) => state.abilityTriggers);

// Shop selectors (P8-SHOP-CATALOG)
export const useIsShopOpen = () => useGameStore((state) => state.isShopOpen);
export const useShopActiveTab = () => useGameStore((state) => state.shopActiveTab);

// P9-A: Multi-pet selectors
export const usePetsById = () => useGameStore((state) => state.petsById);
export const useOwnedPetIds = () => useGameStore((state) => state.ownedPetIds);
export const useActivePetId = () => useGameStore((state) => state.activePetId);
export const useUnlockedSlots = () => useGameStore((state) => state.unlockedSlots);

/** Get the currently active pet (convenience hook) */
export const useActivePet = () => {
  const store = useGameStore();
  return store.getActivePet();
};

/** Get all owned pets in acquisition order (convenience hook) */
export const useOwnedPets = () => {
  const store = useGameStore();
  return store.getOwnedPets();
};

/** Get the setActivePet action */
export const useSetActivePet = () => useGameStore((state) => state.setActivePet);

// FTUE helper: Check if FTUE should be shown
export function shouldShowFtue(state: { ftue: FtueState }): boolean {
  return !state.ftue.hasCompletedFtue;
}
