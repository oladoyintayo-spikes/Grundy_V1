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
  GameSettings
} from '../types';
import { STARTING_INVENTORY, getFoodById } from '../data/foods';
import { GAME_CONFIG, getXPForLevel } from '../data/config';
import { 
  createInitialPet, 
  processFeed, 
  getMoodAfterReaction,
  getEvolutionStage,
  decayHunger
} from './systems';

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
    } as GameStats,
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      autoSave: true,
    } as GameSettings,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialState(),
      
      // ========================================
      // FEEDING
      // ========================================
      feed: (foodId: string): FeedResult | null => {
        const state = get();
        
        // Process the feed
        const result = processFeed(state.pet, foodId, state.inventory);
        
        if (!result || !result.success) {
          return null;
        }
        
        // Apply all changes
        set((state) => {
          // Update inventory
          const newInventory = { ...state.inventory };
          newInventory[foodId] = (newInventory[foodId] || 0) - 1;
          if (newInventory[foodId] <= 0) {
            delete newInventory[foodId];
          }
          
          // Update pet
          const newPet: PetState = {
            ...state.pet,
            xp: state.pet.xp + result.xpGained,
            bond: Math.min(GAME_CONFIG.maxBond, state.pet.bond + result.bondGained),
            hunger: Math.min(GAME_CONFIG.maxHunger, state.pet.hunger + 
              (result.reaction === 'ecstatic' ? 20 : 
               result.reaction === 'positive' ? 15 : 
               result.reaction === 'negative' ? 5 : 10)),
            mood: getMoodAfterReaction(state.pet.mood, result.reaction),
          };
          
          // Handle level up
          if (result.leveledUp && result.newLevel) {
            newPet.level = result.newLevel;
            // Reset XP to overflow amount
            const xpNeeded = getXPForLevel(result.newLevel);
            newPet.xp = newPet.xp - xpNeeded;
            
            // Check evolution
            newPet.evolutionStage = getEvolutionStage(result.newLevel);
          }
          
          // Update currencies
          const newCurrencies = { ...state.currencies };
          newCurrencies.coins += result.coinsGained;
          
          // Level up bonus
          if (result.leveledUp) {
            newCurrencies.coins += 20; // Level up coin bonus
            if (result.newLevel && result.newLevel % 5 === 0) {
              newCurrencies.gems += 5; // Milestone gem bonus
            }
          }
          
          // Update stats
          const newStats: GameStats = {
            ...state.stats,
            totalFeeds: state.stats.totalFeeds + 1,
            totalXpEarned: state.stats.totalXpEarned + result.xpGained,
            totalCoinsEarned: state.stats.totalCoinsEarned + result.coinsGained,
            lastFeedTime: Date.now(),
          };
          
          return {
            pet: newPet,
            currencies: newCurrencies,
            inventory: newInventory,
            stats: newStats,
          };
        });
        
        return result;
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
            hunger: decayHunger(state.pet.hunger, deltaMinutes),
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
