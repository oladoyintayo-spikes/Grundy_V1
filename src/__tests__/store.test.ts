// ============================================
// GRUNDY — STORE SMOKE TESTS
// Verifies basic store functionality
// ============================================

import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../game/store'

describe('GameStore', () => {
  // Reset store before each test to ensure clean state
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  describe('initialization', () => {
    it('should initialize with default currency values', () => {
      const state = useGameStore.getState()

      expect(state.currencies.coins).toBe(100)
      expect(state.currencies.gems).toBe(10)
      expect(state.currencies.eventTokens).toBe(0)
    })

    it('should initialize pet with correct defaults', () => {
      const state = useGameStore.getState()

      expect(state.pet).toBeDefined()
      expect(state.pet.level).toBe(1)
      expect(state.pet.xp).toBe(0)
      expect(state.pet.mood).toBe('neutral')
      expect(state.pet.evolutionStage).toBe('baby')
    })

    it('should initialize with starting inventory', () => {
      const state = useGameStore.getState()

      expect(state.inventory).toBeDefined()
      // Check at least some items exist from STARTING_INVENTORY
      expect(Object.keys(state.inventory).length).toBeGreaterThan(0)
    })

    it('should initialize stats correctly', () => {
      const state = useGameStore.getState()

      expect(state.stats.totalFeeds).toBe(0)
      expect(state.stats.totalXpEarned).toBe(0)
      expect(state.stats.totalCoinsEarned).toBe(0)
    })

    it('should initialize settings correctly', () => {
      const state = useGameStore.getState()

      expect(state.settings.soundEnabled).toBe(true)
      expect(state.settings.musicEnabled).toBe(true)
      expect(state.settings.autoSave).toBe(true)
    })
  })

  describe('currency actions', () => {
    it('should add currency correctly', () => {
      const store = useGameStore.getState()
      const initialCoins = store.currencies.coins

      store.addCurrency('coins', 50, 'test')

      const newState = useGameStore.getState()
      expect(newState.currencies.coins).toBe(initialCoins + 50)
    })

    it('should not add zero or negative currency', () => {
      const store = useGameStore.getState()
      const initialCoins = store.currencies.coins

      store.addCurrency('coins', 0, 'test')
      store.addCurrency('coins', -10, 'test')

      const newState = useGameStore.getState()
      expect(newState.currencies.coins).toBe(initialCoins)
    })

    it('should spend currency when sufficient balance', () => {
      const store = useGameStore.getState()
      const initialCoins = store.currencies.coins

      const result = store.spendCurrency('coins', 50, 'test')

      expect(result).toBe(true)
      const newState = useGameStore.getState()
      expect(newState.currencies.coins).toBe(initialCoins - 50)
    })

    it('should fail to spend currency when insufficient balance', () => {
      const store = useGameStore.getState()
      const initialCoins = store.currencies.coins

      const result = store.spendCurrency('coins', 9999, 'test')

      expect(result).toBe(false)
      const newState = useGameStore.getState()
      expect(newState.currencies.coins).toBe(initialCoins)
    })
  })

  describe('inventory actions', () => {
    it('should add food to inventory', () => {
      const store = useGameStore.getState()
      const initialApples = store.inventory['apple'] || 0

      store.addFood('apple', 5)

      const newState = useGameStore.getState()
      expect(newState.inventory['apple']).toBe(initialApples + 5)
    })
  })

  describe('reset', () => {
    it('should reset game to initial state', () => {
      const store = useGameStore.getState()

      // Modify state
      store.addCurrency('coins', 1000, 'test')
      store.addFood('apple', 100)

      // Reset
      store.resetGame()

      // Verify reset
      const newState = useGameStore.getState()
      expect(newState.currencies.coins).toBe(100)
      expect(newState.currencies.gems).toBe(10)
      expect(newState.pet.level).toBe(1)
    })
  })
})
