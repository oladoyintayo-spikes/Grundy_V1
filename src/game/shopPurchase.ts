/**
 * GRUNDY — SHOP PURCHASE ENGINE
 *
 * Pure functions for shop purchase logic with bundle decomposition.
 * DATA SOURCE: docs/GRUNDY_MASTER_BIBLE.md §11.5, §11.7
 *
 * Bible v1.6 / BCT v2.2
 */

import {
  SHOP_CATALOG,
  INDIVIDUAL_FOOD_PRICES,
  INVENTORY_CONFIG,
  getShopItemById,
  type ShopItem,
  type ShopCurrency,
} from '../constants/bible.constants';
import { getFoodById } from '../data/foods';

// ============================================================================
// TYPES
// ============================================================================

/**
 * State needed for purchase validation.
 */
export interface PurchaseState {
  coins: number;
  gems: number;
  inventory: Record<string, number>;
  inventoryCapacity: number;
}

/**
 * Result of a purchase attempt.
 */
export interface PurchaseResult {
  success: boolean;
  error?: 'insufficient_funds' | 'inventory_full' | 'stack_limit' | 'invalid_item' | 'invalid_quantity';
  /** New coins balance after purchase (if successful) */
  newCoins?: number;
  /** New gems balance after purchase (if successful) */
  newGems?: number;
  /** Items added to inventory { itemId: quantity } */
  itemsAdded?: Record<string, number>;
  /** Total cost (for display/logging) */
  totalCost?: number;
  /** Currency used */
  currency?: ShopCurrency;
}

/**
 * Options for purchase with optional random selector injection.
 * Used for deterministic testing of random bundles.
 */
export interface PurchaseOptions {
  /**
   * For bundles with random choices (food_rare_x1, food_epic_x1),
   * this function selects which item to give.
   * @param choices Array of possible item IDs
   * @returns Selected item ID
   * @default Random selection
   */
  randomSelector?: (choices: string[]) => string;
}

// ============================================================================
// RANDOM BUNDLE CONFIGURATION
// ============================================================================

/**
 * Bundles with random item selection.
 * Key = bundle ID, Value = array of possible base item IDs.
 *
 * Bible §11.5: Random bundles give 1 random item from pool.
 */
export const RANDOM_BUNDLE_POOLS: Record<string, string[]> = {
  // Rare Food Box: 1× random Rare food
  food_rare_x1: ['spicy_taco', 'hot_pepper', 'ice_cream'],
  // Epic Feast: 1× Birthday Cake or Dream Treat
  food_epic_x1: ['birthday_cake', 'dream_treat'],
};

/**
 * Default random selector using Math.random().
 */
function defaultRandomSelector(choices: string[]): string {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// ============================================================================
// DECOMPOSITION
// ============================================================================

/**
 * Decompose a bundle or individual item into base inventory items.
 *
 * @param itemId Shop item ID (bundle or individual food)
 * @param quantity Purchase quantity (only > 1 for individual foods)
 * @param options Purchase options with optional random selector
 * @returns Mapping of { baseItemId: quantity } or null if invalid
 */
export function decomposeShopItem(
  itemId: string,
  quantity: number,
  options: PurchaseOptions = {}
): Record<string, number> | null {
  const randomSelector = options.randomSelector ?? defaultRandomSelector;

  // Check if it's a bundle from SHOP_CATALOG
  const shopItem = SHOP_CATALOG.find(item => item.id === itemId);

  if (shopItem && shopItem.kind === 'bundle') {
    // Handle random bundles
    if (RANDOM_BUNDLE_POOLS[itemId]) {
      const pool = RANDOM_BUNDLE_POOLS[itemId];
      const selectedItem = randomSelector(pool);
      // Random bundles always give qty 1
      return { [selectedItem]: 1 };
    }

    // Fixed decomposition bundle
    if (shopItem.decomposition) {
      return { ...shopItem.decomposition };
    }

    // Bundle without decomposition - shouldn't happen but handle gracefully
    return null;
  }

  // Check if it's an individual food
  if (INDIVIDUAL_FOOD_PRICES[itemId] !== undefined) {
    return { [itemId]: quantity };
  }

  // Check if it's a care item (care items go directly to... future care inventory)
  if (shopItem && shopItem.kind === 'care_item') {
    // Care items are direct-use, not inventory items
    // For now, return the item ID directly
    return { [itemId]: 1 };
  }

  // Invalid item
  return null;
}

// ============================================================================
// INVENTORY VALIDATION
// ============================================================================

/**
 * Check if items can be added to inventory respecting constraints.
 *
 * BCT-INV-001: Base capacity 15
 * BCT-INV-002: Slots count unique IDs only
 * BCT-INV-003: Stack max 99
 * BCT-INV-005: New item requires available slot
 * BCT-INV-006: Existing item uses existing slot
 *
 * @param inventory Current inventory
 * @param capacity Inventory capacity
 * @param itemsToAdd Items to add { itemId: quantity }
 * @returns { allowed: boolean, reason?: string }
 */
export function canAddItemsToInventory(
  inventory: Record<string, number>,
  capacity: number,
  itemsToAdd: Record<string, number>
): { allowed: boolean; reason?: 'inventory_full' | 'stack_limit' } {
  // Calculate current used slots (unique IDs with qty > 0)
  const currentSlots = new Set(
    Object.entries(inventory)
      .filter(([_, qty]) => qty > 0)
      .map(([id]) => id)
  );

  // Check each item to add
  for (const [itemId, addQty] of Object.entries(itemsToAdd)) {
    const currentQty = inventory[itemId] || 0;
    const newQty = currentQty + addQty;

    // BCT-INV-003: Stack max 99
    if (newQty > INVENTORY_CONFIG.STACK_MAX) {
      return { allowed: false, reason: 'stack_limit' };
    }

    // BCT-INV-005/006: New slot needed if item doesn't exist
    if (currentQty === 0 && !currentSlots.has(itemId)) {
      // Would need a new slot
      if (currentSlots.size >= capacity) {
        return { allowed: false, reason: 'inventory_full' };
      }
      // Reserve the slot for this item
      currentSlots.add(itemId);
    }
  }

  return { allowed: true };
}

// ============================================================================
// PRICE CALCULATION
// ============================================================================

/**
 * Calculate total price for a shop purchase.
 *
 * @param itemId Shop item ID
 * @param quantity Purchase quantity
 * @returns { price: number, currency: ShopCurrency } or null if invalid
 */
export function calculatePrice(
  itemId: string,
  quantity: number
): { price: number; currency: ShopCurrency } | null {
  // Check catalog first (bundles, care items)
  const shopItem = SHOP_CATALOG.find(item => item.id === itemId);
  if (shopItem) {
    // Bundles and care items are always qty 1
    const effectiveQty = shopItem.kind === 'bundle' || shopItem.kind === 'care_item' ? 1 : quantity;
    return {
      price: shopItem.price * effectiveQty,
      currency: shopItem.currency,
    };
  }

  // Check individual foods
  if (INDIVIDUAL_FOOD_PRICES[itemId] !== undefined) {
    return {
      price: INDIVIDUAL_FOOD_PRICES[itemId] * quantity,
      currency: 'coins',
    };
  }

  return null;
}

// ============================================================================
// PURCHASE FUNCTION
// ============================================================================

/**
 * Process a shop purchase.
 *
 * BCT-SHOP-010: Currency deducted, inventory updated
 * BCT-SHOP-011: Insufficient coins blocks purchase
 * BCT-SHOP-012: Inventory full blocks purchase
 * BCT-SHOP-013: Stack limit blocks purchase
 * BCT-INV-007: Purchase adds correct quantity
 * BCT-INV-008: Bundle decomposed correctly
 *
 * @param state Current game state
 * @param itemId Shop item ID to purchase
 * @param quantity Quantity (only > 1 for individual foods)
 * @param options Purchase options
 * @returns PurchaseResult
 */
export function purchaseShopItem(
  state: PurchaseState,
  itemId: string,
  quantity: number = 1,
  options: PurchaseOptions = {}
): PurchaseResult {
  // Validate quantity
  if (quantity < 1 || quantity > 10) {
    return { success: false, error: 'invalid_quantity' };
  }

  // Calculate price
  const priceInfo = calculatePrice(itemId, quantity);
  if (!priceInfo) {
    return { success: false, error: 'invalid_item' };
  }

  const { price, currency } = priceInfo;

  // BCT-SHOP-011: Check sufficient funds
  const currentFunds = currency === 'coins' ? state.coins : state.gems;
  if (currentFunds < price) {
    return { success: false, error: 'insufficient_funds' };
  }

  // Decompose item into base inventory items
  const itemsToAdd = decomposeShopItem(itemId, quantity, options);
  if (!itemsToAdd) {
    return { success: false, error: 'invalid_item' };
  }

  // BCT-SHOP-012/013, BCT-INV-005/006: Check inventory constraints
  const invCheck = canAddItemsToInventory(
    state.inventory,
    state.inventoryCapacity,
    itemsToAdd
  );
  if (!invCheck.allowed) {
    return { success: false, error: invCheck.reason };
  }

  // Calculate new balances
  const newCoins = currency === 'coins' ? state.coins - price : state.coins;
  const newGems = currency === 'gems' ? state.gems - price : state.gems;

  return {
    success: true,
    newCoins,
    newGems,
    itemsAdded: itemsToAdd,
    totalCost: price,
    currency,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if an item is a bundle.
 */
export function isBundle(itemId: string): boolean {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  return item?.kind === 'bundle';
}

/**
 * Check if an item is a care item.
 */
export function isCareItem(itemId: string): boolean {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  return item?.kind === 'care_item';
}

/**
 * Get the decomposition preview for a bundle (for UI display).
 * Returns human-readable format.
 */
export function getBundleContents(itemId: string): string | null {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  if (!item || item.kind !== 'bundle') {
    return null;
  }

  // Random bundles
  if (RANDOM_BUNDLE_POOLS[itemId]) {
    const pool = RANDOM_BUNDLE_POOLS[itemId];
    return `1× random (${pool.join(' or ')})`;
  }

  // Fixed decomposition
  if (item.decomposition) {
    return Object.entries(item.decomposition)
      .map(([id, qty]) => `${qty}× ${id}`)
      .join(', ');
  }

  return null;
}
