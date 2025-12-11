// ============================================
// GRUNDY — GAME STORE (Zustand)
// Central state management with persistence
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameStore,
  PetState,
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
} from '../types';
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
  getFullnessState
} from './systems';
import { applyGemMultiplier } from './abilities';
import {
  ENERGY_MAX,
  ENERGY_COST_PER_GAME,
  DAILY_REWARDED_PLAYS_CAP,
  getTodayString,
  createInitialDailyState,
  createInitialEnergyState
} from './miniGameRewards';

// Initial state factory
function createInitialState() {
  return {
    pet: createInitialPet('munchlet'), // Bible-compliant default starter
    currencies: {
      coins: 100,
      gems: 10,
      eventTokens: 0,
    } as Record<CurrencyType, number>,
    inventory: { ...STARTING_INVENTORY },
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
    unlockedPets: [...STARTER_PETS], // Start with munchlet, grib, plompo
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
        set((state) => {
          // Update inventory
          const newInventory = { ...state.inventory };
          newInventory[foodId] = (newInventory[foodId] || 0) - 1;
          if (newInventory[foodId] <= 0) {
            delete newInventory[foodId];
          }

          // Update pet with adjusted gains
          const newPet: PetState = {
            ...state.pet,
            xp: state.pet.xp + adjustedXP,
            bond: Math.min(GAME_CONFIG.maxBond, state.pet.bond + adjustedBond),
            hunger: Math.min(GAME_CONFIG.maxHunger, state.pet.hunger +
              (result.reaction === 'ecstatic' ? 20 :
               result.reaction === 'positive' ? 15 :
               result.reaction === 'negative' ? 5 : 10)),
            mood: getMoodAfterReaction(state.pet.mood, result.reaction),
          };

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
            if (newLevel % 5 === 0) {
              // Apply Luxe's Golden Touch ability: +100% gem drops
              const baseGems = 5;
              const finalGems = applyGemMultiplier(state.pet.id, baseGems);
              newCurrencies.gems += finalGems;
            }
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

          return {
            pet: newPet,
            currencies: newCurrencies,
            inventory: newInventory,
            stats: newStats,
          };
        });

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
        
        const totalCost = food.coinCost * quantity;
        
        if (food.coinCost > 0) {
          if (state.currencies.coins < totalCost) return false;
          
          set((state) => ({
            currencies: {
              ...state.currencies,
              coins: state.currencies.coins - totalCost,
            },
            inventory: {
              ...state.inventory,
              [foodId]: (state.inventory[foodId] || 0) + quantity,
            },
          }));
        } else if (food.gemCost > 0) {
          const gemCost = food.gemCost * quantity;
          if (state.currencies.gems < gemCost) return false;
          
          set((state) => ({
            currencies: {
              ...state.currencies,
              gems: state.currencies.gems - gemCost,
            },
            inventory: {
              ...state.inventory,
              [foodId]: (state.inventory[foodId] || 0) + quantity,
            },
          }));
        }
        
        return true;
      },
      
      addFood: (foodId: string, quantity: number) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [foodId]: (state.inventory[foodId] || 0) + quantity,
          },
        }));
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

        // First, reset daily if needed
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
        set((state) => ({
          ftue: {
            ...state.ftue,
            selectedPetId: petId,
          },
          // Also set as active pet
          pet: {
            ...state.pet,
            id: petId,
          },
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
      // RESET
      // ========================================
      resetGame: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'grundy-save',
      version: 1,
    }
  )
);

// Selector hooks for convenience
export const usePet = () => useGameStore((state) => state.pet);
export const useCurrencies = () => useGameStore((state) => state.currencies);
export const useInventory = () => useGameStore((state) => state.inventory);
export const useStats = () => useGameStore((state) => state.stats);
export const useUnlockedPets = () => useGameStore((state) => state.unlockedPets);
export const useEnergy = () => useGameStore((state) => state.energy);
export const useDailyMiniGames = () => useGameStore((state) => state.dailyMiniGames);
export const useFtue = () => useGameStore((state) => state.ftue);
export const usePlayMode = () => useGameStore((state) => state.playMode);
export const useEnvironment = () => useGameStore((state) => state.environment);
export const useSettings = () => useGameStore((state) => state.settings);

// FTUE helper: Check if FTUE should be shown
export function shouldShowFtue(state: { ftue: FtueState }): boolean {
  return !state.ftue.hasCompletedFtue;
}
