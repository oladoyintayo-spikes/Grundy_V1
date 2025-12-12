/**
 * BCT-SHOP Tests (Bible Compliance Tests for Shop)
 *
 * Tests Shop catalog, pricing, ordering, and recommendations
 * per Bible v1.6 §5.4, §11.5, §11.5.1, §14.7 and BCT v2.2.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */

import { describe, it, expect } from 'vitest';
import {
  INDIVIDUAL_FOOD_PRICES,
  SHOP_CATALOG,
  SHOP_QTY_SELECTOR,
  SHOP_TEST_IDS,
  getIndividualFoodItems,
  getIndividualFoodsSorted,
  getFoodBundles,
  getShopItemsByTab,
  getShopItemById,
  getShopRecommendations,
  type ShopItem,
  type RecommendationState,
} from '../constants/bible.constants';
import { FOODS } from '../data/foods';

// ============================================================================
// BCT-SHOP-001: Individual food prices match §5.4 Cost column
// ============================================================================

describe('BCT-SHOP-001: Individual food prices match §5.4 Cost column', () => {
  it('should have apple priced at 5 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.apple).toBe(5);
    expect(FOODS.apple.coinCost).toBe(5);
  });

  it('should have banana priced at 5 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.banana).toBe(5);
    expect(FOODS.banana.coinCost).toBe(5);
  });

  it('should have carrot priced at 5 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.carrot).toBe(5);
    expect(FOODS.carrot.coinCost).toBe(5);
  });

  it('should have cookie priced at 15 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.cookie).toBe(15);
    expect(FOODS.cookie.coinCost).toBe(15);
  });

  it('should have grapes priced at 15 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.grapes).toBe(15);
    expect(FOODS.grapes.coinCost).toBe(15);
  });

  it('should have spicy_taco priced at 25 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.spicy_taco).toBe(25);
    expect(FOODS.spicy_taco.coinCost).toBe(25);
  });

  it('should have hot_pepper priced at 25 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.hot_pepper).toBe(25);
    expect(FOODS.hot_pepper.coinCost).toBe(25);
  });

  it('should have birthday_cake priced at 50 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.birthday_cake).toBe(50);
    expect(FOODS.birthday_cake.coinCost).toBe(50);
  });

  it('should have dream_treat priced at 75 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.dream_treat).toBe(75);
    expect(FOODS.dream_treat.coinCost).toBe(75);
  });

  it('should have golden_feast priced at 150 coins', () => {
    expect(INDIVIDUAL_FOOD_PRICES.golden_feast).toBe(150);
    expect(FOODS.golden_feast.coinCost).toBe(150);
  });
});

// ============================================================================
// BCT-SHOP-002: Bundle + care item prices match Shop table (§11.5)
// ============================================================================

describe('BCT-SHOP-002: Bundle + care item prices match Shop table', () => {
  it('should have food_apple_x5 priced at 20 coins', () => {
    const item = getShopItemById('food_apple_x5');
    expect(item).toBeDefined();
    expect(item!.price).toBe(20);
    expect(item!.currency).toBe('coins');
  });

  it('should have food_balanced_x5 priced at 40 coins', () => {
    const item = getShopItemById('food_balanced_x5');
    expect(item).toBeDefined();
    expect(item!.price).toBe(40);
    expect(item!.currency).toBe('coins');
  });

  it('should have food_spicy_x3 priced at 60 coins', () => {
    const item = getShopItemById('food_spicy_x3');
    expect(item).toBeDefined();
    expect(item!.price).toBe(60);
    expect(item!.currency).toBe('coins');
  });

  it('should have food_sweet_x3 priced at 50 coins', () => {
    const item = getShopItemById('food_sweet_x3');
    expect(item).toBeDefined();
    expect(item!.price).toBe(50);
    expect(item!.currency).toBe('coins');
  });

  it('should have food_rare_x1 priced at 75 coins', () => {
    const item = getShopItemById('food_rare_x1');
    expect(item).toBeDefined();
    expect(item!.price).toBe(75);
    expect(item!.currency).toBe('coins');
  });

  it('should have food_epic_x1 priced at 5 gems', () => {
    const item = getShopItemById('food_epic_x1');
    expect(item).toBeDefined();
    expect(item!.price).toBe(5);
    expect(item!.currency).toBe('gems');
  });

  it('should have food_legendary_x1 priced at 10 gems', () => {
    const item = getShopItemById('food_legendary_x1');
    expect(item).toBeDefined();
    expect(item!.price).toBe(10);
    expect(item!.currency).toBe('gems');
  });

  it('should have care_medicine priced at 50 coins', () => {
    const item = getShopItemById('care_medicine');
    expect(item).toBeDefined();
    expect(item!.price).toBe(50);
    expect(item!.currency).toBe('coins');
  });

  it('should have care_diet_food priced at 30 coins', () => {
    const item = getShopItemById('care_diet_food');
    expect(item).toBeDefined();
    expect(item!.price).toBe(30);
    expect(item!.currency).toBe('coins');
  });

  it('should have care_energy_drink priced at 25 coins', () => {
    const item = getShopItemById('care_energy_drink');
    expect(item).toBeDefined();
    expect(item!.price).toBe(25);
    expect(item!.currency).toBe('coins');
  });

  it('should have care_mood_boost priced at 40 coins', () => {
    const item = getShopItemById('care_mood_boost');
    expect(item).toBeDefined();
    expect(item!.price).toBe(40);
    expect(item!.currency).toBe('coins');
  });
});

// ============================================================================
// BCT-SHOP-003: Individual foods are coins-only
// ============================================================================

describe('BCT-SHOP-003: Individual foods are coins-only', () => {
  it('should have all individual foods priced in coins', () => {
    const individualFoods = getIndividualFoodItems();
    individualFoods.forEach(food => {
      expect(food.currency).toBe('coins');
    });
  });

  it('should not have any individual foods priced in gems', () => {
    const individualFoods = getIndividualFoodItems();
    const gemPricedFoods = individualFoods.filter(f => f.currency === 'gems');
    expect(gemPricedFoods.length).toBe(0);
  });
});

// ============================================================================
// BCT-SHOP-004: Food tab ordering: Bundles before Individual
// ============================================================================

describe('BCT-SHOP-004: Food tab ordering - Bundles before Individual', () => {
  it('should return bundles first in Food tab items', () => {
    const foodItems = getShopItemsByTab('food');
    const bundles = getFoodBundles();
    const individuals = getIndividualFoodsSorted();

    // First N items should be bundles
    const numBundles = bundles.length;
    for (let i = 0; i < numBundles; i++) {
      expect(foodItems[i].kind).toBe('bundle');
    }

    // Remaining items should be individual
    for (let i = numBundles; i < foodItems.length; i++) {
      expect(foodItems[i].kind).toBe('individual');
    }
  });

  it('should have all bundles in the Food tab', () => {
    const bundles = getFoodBundles();
    expect(bundles.length).toBeGreaterThan(0);
    bundles.forEach(bundle => {
      expect(bundle.tab).toBe('food');
      expect(bundle.kind).toBe('bundle');
    });
  });
});

// ============================================================================
// BCT-SHOP-005: Quantity selector min=1
// ============================================================================

describe('BCT-SHOP-005: Quantity selector min=1', () => {
  it('should have minimum quantity of 1', () => {
    expect(SHOP_QTY_SELECTOR.MIN).toBe(1);
  });

  it('should not allow quantity below 1', () => {
    // This is enforced in UI - testing the constant
    expect(SHOP_QTY_SELECTOR.MIN).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// BCT-SHOP-006: Quantity selector max=10
// ============================================================================

describe('BCT-SHOP-006: Quantity selector max=10', () => {
  it('should have maximum quantity of 10', () => {
    expect(SHOP_QTY_SELECTOR.MAX).toBe(10);
  });

  it('should not allow quantity above 10', () => {
    // This is enforced in UI - testing the constant
    expect(SHOP_QTY_SELECTOR.MAX).toBeLessThanOrEqual(10);
  });
});

// ============================================================================
// BCT-SHOP-014: Medicine hidden in Cozy mode
// ============================================================================

describe('BCT-SHOP-014: Medicine hidden in Cozy mode', () => {
  it('should have care_medicine marked as classic_only', () => {
    const medicine = getShopItemById('care_medicine');
    expect(medicine).toBeDefined();
    expect(medicine!.visibilityCondition).toBe('classic_only');
  });
});

// ============================================================================
// BCT-SHOP-015: Medicine visible in Classic mode
// ============================================================================

describe('BCT-SHOP-015: Medicine visible in Classic mode', () => {
  it('should have care_medicine in catalog', () => {
    const medicine = getShopItemById('care_medicine');
    expect(medicine).toBeDefined();
    expect(medicine!.tab).toBe('care');
  });
});

// ============================================================================
// BCT-SHOP-016/017: Diet Food visibility based on weight
// ============================================================================

describe('BCT-SHOP-016/017: Diet Food visibility based on weight', () => {
  it('should have care_diet_food marked as weight_chubby condition', () => {
    const dietFood = getShopItemById('care_diet_food');
    expect(dietFood).toBeDefined();
    expect(dietFood!.visibilityCondition).toBe('weight_chubby');
  });
});

// ============================================================================
// BCT-SHOP-018/019: Gems tab gating based on level
// ============================================================================

describe('BCT-SHOP-018/019: Gems tab gating', () => {
  it('should have gem-priced bundles with level requirements', () => {
    const epicBundle = getShopItemById('food_epic_x1');
    expect(epicBundle).toBeDefined();
    expect(epicBundle!.levelRequired).toBe(10);

    const legendaryBundle = getShopItemById('food_legendary_x1');
    expect(legendaryBundle).toBeDefined();
    expect(legendaryBundle!.levelRequired).toBe(15);
  });
});

// ============================================================================
// BCT-SHOP-020: Cosmetics tab is "Coming Soon" stub
// ============================================================================

describe('BCT-SHOP-020: Cosmetics tab is stub', () => {
  it('should return empty items for cosmetics tab', () => {
    const cosmeticsItems = getShopItemsByTab('cosmetics');
    expect(cosmeticsItems).toEqual([]);
  });
});

// ============================================================================
// BCT-SHOP-021: Individual foods sorted by rarity
// ============================================================================

describe('BCT-SHOP-021: Individual foods sorted by rarity', () => {
  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const foodRarities: Record<string, string> = {
    apple: 'common',
    banana: 'common',
    carrot: 'common',
    lollipop: 'common',
    cookie: 'uncommon',
    grapes: 'uncommon',
    candy: 'uncommon',
    spicy_taco: 'rare',
    hot_pepper: 'rare',
    ice_cream: 'rare',
    birthday_cake: 'epic',
    dream_treat: 'epic',
    golden_feast: 'legendary',
  };

  it('should sort individual foods Common → Uncommon → Rare → Epic → Legendary', () => {
    const sortedFoods = getIndividualFoodsSorted();

    let lastRarityIndex = -1;
    sortedFoods.forEach(food => {
      const rarity = foodRarities[food.id] || 'common';
      const rarityIndex = rarityOrder.indexOf(rarity);
      expect(rarityIndex).toBeGreaterThanOrEqual(lastRarityIndex);
      lastRarityIndex = rarityIndex;
    });
  });
});

// ============================================================================
// BCT-SHOP-022: Recommended section hidden when no triggers
// ============================================================================

describe('BCT-SHOP-022: Recommended section hidden when no triggers', () => {
  it('should return empty recommendations when no conditions match', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 50,
      hunger: 80,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).toEqual([]);
  });
});

// ============================================================================
// BCT-SHOP-023: Recommended prioritizes sick→medicine
// ============================================================================

describe('BCT-SHOP-023: Recommended prioritizes sick→medicine', () => {
  it('should recommend care_medicine first when sick in classic mode', () => {
    const state: RecommendationState = {
      isSick: true,
      isClassicMode: true,
      energy: 10, // Also triggers energy drink
      hunger: 20, // Also triggers balanced pack
      mood: 30,   // Also triggers mood boost
      weight: 50, // Also triggers diet food
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations[0]).toBe('care_medicine');
  });

  it('should not recommend medicine when sick in cozy mode', () => {
    const state: RecommendationState = {
      isSick: true,
      isClassicMode: false,
      energy: 50,
      hunger: 80,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).not.toContain('care_medicine');
  });
});

// ============================================================================
// BCT-SHOP-024: Recommended includes energy drink at low energy
// ============================================================================

describe('BCT-SHOP-024: Recommended includes energy drink at low energy', () => {
  it('should recommend care_energy_drink when energy < 20', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 15,
      hunger: 80,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).toContain('care_energy_drink');
  });

  it('should not recommend energy drink when energy >= 20', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 25,
      hunger: 80,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).not.toContain('care_energy_drink');
  });
});

// ============================================================================
// BCT-SHOP-025: Recommended includes balanced pack at low hunger
// ============================================================================

describe('BCT-SHOP-025: Recommended includes balanced pack at low hunger', () => {
  it('should recommend food_balanced_x5 when hunger < 30', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 50,
      hunger: 20,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).toContain('food_balanced_x5');
  });

  it('should not recommend balanced pack when hunger >= 30', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 50,
      hunger: 35,
      mood: 70,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).not.toContain('food_balanced_x5');
  });
});

// ============================================================================
// Additional Recommendation Tests
// ============================================================================

describe('BCT-SHOP Recommendations: Priority Order and Max Count', () => {
  it('should return max 3 recommendations', () => {
    const state: RecommendationState = {
      isSick: true,
      isClassicMode: true,
      energy: 10,
      hunger: 20,
      mood: 30,
      weight: 50,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it('should maintain priority order: sick > energy > hunger > mood > weight', () => {
    const state: RecommendationState = {
      isSick: true,
      isClassicMode: true,
      energy: 10,
      hunger: 20,
      mood: 30,
      weight: 50,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations[0]).toBe('care_medicine');
    expect(recommendations[1]).toBe('care_energy_drink');
    expect(recommendations[2]).toBe('food_balanced_x5');
  });

  it('should recommend mood boost when mood < 40', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 50,
      hunger: 80,
      mood: 35,
      weight: 10,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).toContain('care_mood_boost');
  });

  it('should recommend diet food when weight >= 31', () => {
    const state: RecommendationState = {
      isSick: false,
      isClassicMode: false,
      energy: 50,
      hunger: 80,
      mood: 70,
      weight: 35,
    };

    const recommendations = getShopRecommendations(state);
    expect(recommendations).toContain('care_diet_food');
  });
});

// ============================================================================
// Shop TestIDs
// ============================================================================

describe('BCT-SHOP TestIDs are defined', () => {
  it('should have all required testid constants', () => {
    expect(SHOP_TEST_IDS.SHOP_BUTTON).toBe('shop-button');
    expect(SHOP_TEST_IDS.SHOP_VIEW).toBe('shop-view');
    expect(SHOP_TEST_IDS.TAB_FOOD).toBe('shop-tab-food');
    expect(SHOP_TEST_IDS.TAB_CARE).toBe('shop-tab-care');
    expect(SHOP_TEST_IDS.TAB_COSMETICS).toBe('shop-tab-cosmetics');
    expect(SHOP_TEST_IDS.TAB_GEMS).toBe('shop-tab-gems');
    expect(SHOP_TEST_IDS.SECTION_BUNDLES).toBe('shop-section-bundles');
    expect(SHOP_TEST_IDS.SECTION_INDIVIDUAL).toBe('shop-section-individual');
    expect(SHOP_TEST_IDS.SECTION_RECOMMENDED).toBe('shop-recommended-section');
  });

  it('should have item card testid function', () => {
    expect(SHOP_TEST_IDS.itemCard('apple')).toBe('shop-item-apple');
    expect(SHOP_TEST_IDS.itemCard('food_apple_x5')).toBe('shop-item-food_apple_x5');
  });

  it('should have item price testid function', () => {
    expect(SHOP_TEST_IDS.itemPrice('apple')).toBe('shop-item-price-apple');
  });

  it('should have quantity selector testid functions', () => {
    expect(SHOP_TEST_IDS.qtyMinus('apple')).toBe('shop-qty-minus-apple');
    expect(SHOP_TEST_IDS.qtyPlus('apple')).toBe('shop-qty-plus-apple');
    expect(SHOP_TEST_IDS.qtyValue('apple')).toBe('shop-qty-value-apple');
  });
});

// ============================================================================
// SHOP PURCHASE TESTS (P8-SHOP-PURCHASE, Shop-B)
// ============================================================================

import {
  purchaseShopItem,
  decomposeShopItem,
  canAddItemsToInventory,
  calculatePrice,
  RANDOM_BUNDLE_POOLS,
  type PurchaseState,
} from '../game/shopPurchase';
import { INVENTORY_CONFIG } from '../constants/bible.constants';

// ============================================================================
// BCT-SHOP-010: Currency deducted, inventory updated
// ============================================================================

describe('BCT-SHOP-010: Currency deducted, inventory updated', () => {
  it('should deduct coins and add item for individual food purchase', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 1);

    expect(result.success).toBe(true);
    expect(result.newCoins).toBe(95); // 100 - 5
    expect(result.itemsAdded).toEqual({ apple: 1 });
    expect(result.totalCost).toBe(5);
    expect(result.currency).toBe('coins');
  });

  it('should deduct coins for bundle purchase', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'food_apple_x5', 1);

    expect(result.success).toBe(true);
    expect(result.newCoins).toBe(80); // 100 - 20
    expect(result.itemsAdded).toEqual({ apple: 5 });
    expect(result.totalCost).toBe(20);
    expect(result.currency).toBe('coins');
  });

  it('should deduct gems for gem-priced items', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 10,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'food_epic_x1', 1);

    expect(result.success).toBe(true);
    expect(result.newGems).toBe(5); // 10 - 5
    expect(result.newCoins).toBe(100); // Unchanged
    expect(result.currency).toBe('gems');
  });

  it('should handle quantity multiplier for individual foods', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 5);

    expect(result.success).toBe(true);
    expect(result.newCoins).toBe(75); // 100 - (5 * 5)
    expect(result.itemsAdded).toEqual({ apple: 5 });
    expect(result.totalCost).toBe(25);
  });
});

// ============================================================================
// BCT-SHOP-011: Insufficient coins blocks purchase
// ============================================================================

describe('BCT-SHOP-011: Insufficient coins blocks purchase', () => {
  it('should fail when not enough coins for individual food', () => {
    const state: PurchaseState = {
      coins: 3,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 1);

    expect(result.success).toBe(false);
    expect(result.error).toBe('insufficient_funds');
  });

  it('should fail when not enough coins for bundle', () => {
    const state: PurchaseState = {
      coins: 15,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'food_apple_x5', 1); // Costs 20

    expect(result.success).toBe(false);
    expect(result.error).toBe('insufficient_funds');
  });

  it('should fail when not enough gems for gem items', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 2,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'food_epic_x1', 1); // Costs 5 gems

    expect(result.success).toBe(false);
    expect(result.error).toBe('insufficient_funds');
  });

  it('should fail when quantity multiplier exceeds balance', () => {
    const state: PurchaseState = {
      coins: 20,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 5); // Costs 25 (5 * 5)

    expect(result.success).toBe(false);
    expect(result.error).toBe('insufficient_funds');
  });
});

// ============================================================================
// BCT-SHOP-012: Inventory full blocks purchase
// ============================================================================

describe('BCT-SHOP-012: Inventory full blocks purchase', () => {
  it('should fail when inventory slots are full and adding new item', () => {
    // Fill all 15 slots with different items
    const fullInventory: Record<string, number> = {};
    for (let i = 0; i < 15; i++) {
      fullInventory[`item_${i}`] = 1;
    }

    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: fullInventory,
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 1);

    expect(result.success).toBe(false);
    expect(result.error).toBe('inventory_full');
  });

  it('should succeed when adding to existing stack even at capacity', () => {
    // Fill 15 slots, but one is apple
    const inventory: Record<string, number> = { apple: 5 };
    for (let i = 1; i < 15; i++) {
      inventory[`item_${i}`] = 1;
    }

    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory,
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 1);

    expect(result.success).toBe(true);
    expect(result.itemsAdded).toEqual({ apple: 1 });
  });

  it('should fail when bundle decomposition requires new slots at capacity', () => {
    // Fill 14 slots, have apple but not banana/carrot/lollipop
    const inventory: Record<string, number> = { apple: 1 };
    for (let i = 1; i < 15; i++) {
      inventory[`item_${i}`] = 1;
    }

    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory,
      inventoryCapacity: 15,
    };

    // food_balanced_x5 decomposes to apple, banana, carrot, lollipop
    const result = purchaseShopItem(state, 'food_balanced_x5', 1);

    expect(result.success).toBe(false);
    expect(result.error).toBe('inventory_full');
  });
});

// ============================================================================
// BCT-SHOP-013: Stack limit blocks purchase
// ============================================================================

describe('BCT-SHOP-013: Stack limit blocks purchase', () => {
  it('should fail when purchase would exceed stack limit of 99', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: { apple: 95 },
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 5); // Would make 100 > 99

    expect(result.success).toBe(false);
    expect(result.error).toBe('stack_limit');
  });

  it('should succeed when purchase reaches exactly 99', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: { apple: 94 },
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 5); // Makes exactly 99

    expect(result.success).toBe(true);
    expect(result.itemsAdded).toEqual({ apple: 5 });
  });

  it('should verify INVENTORY_CONFIG.STACK_MAX is 99', () => {
    expect(INVENTORY_CONFIG.STACK_MAX).toBe(99);
  });
});

// ============================================================================
// BCT-INV-007: Purchase adds correct quantity
// ============================================================================

describe('BCT-INV-007: Purchase adds correct quantity', () => {
  it('should add exactly the purchased quantity for individual food', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: { apple: 3 },
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'apple', 5);

    expect(result.success).toBe(true);
    expect(result.itemsAdded).toEqual({ apple: 5 });
  });

  it('should add exactly the decomposed quantities for bundles', () => {
    const state: PurchaseState = {
      coins: 100,
      gems: 0,
      inventory: {},
      inventoryCapacity: 15,
    };

    const result = purchaseShopItem(state, 'food_apple_x5', 1);

    expect(result.success).toBe(true);
    expect(result.itemsAdded).toEqual({ apple: 5 });
  });
});

// ============================================================================
// BCT-INV-008: Bundle decomposed correctly
// ============================================================================

describe('BCT-INV-008: Bundle decomposed correctly', () => {
  it('should decompose food_apple_x5 to 5 apples', () => {
    const decomposed = decomposeShopItem('food_apple_x5', 1);
    expect(decomposed).toEqual({ apple: 5 });
  });

  it('should decompose food_balanced_x5 to Bible-strict Common foods only', () => {
    const decomposed = decomposeShopItem('food_balanced_x5', 1);
    // Bible-strict: apple, banana, carrot, lollipop (all Common)
    // Candy is Uncommon, so NOT included
    expect(decomposed).toEqual({ apple: 2, banana: 1, carrot: 1, lollipop: 1 });
  });

  it('should decompose food_spicy_x3 to hot_pepper and spicy_taco', () => {
    const decomposed = decomposeShopItem('food_spicy_x3', 1);
    expect(decomposed).toEqual({ hot_pepper: 3, spicy_taco: 2 });
  });

  it('should decompose food_sweet_x3 to cookies and candy', () => {
    const decomposed = decomposeShopItem('food_sweet_x3', 1);
    expect(decomposed).toEqual({ cookie: 3, candy: 2 });
  });

  it('should decompose food_legendary_x1 to golden_feast', () => {
    const decomposed = decomposeShopItem('food_legendary_x1', 1);
    expect(decomposed).toEqual({ golden_feast: 1 });
  });

  it('should decompose individual food to itself with quantity', () => {
    const decomposed = decomposeShopItem('apple', 3);
    expect(decomposed).toEqual({ apple: 3 });
  });
});

// ============================================================================
// Random Bundle Deterministic Testing
// ============================================================================

describe('Random bundles with deterministic selector', () => {
  it('should use injected selector for food_rare_x1', () => {
    // Deterministically select hot_pepper
    const selector = () => 'hot_pepper';
    const decomposed = decomposeShopItem('food_rare_x1', 1, { randomSelector: selector });
    expect(decomposed).toEqual({ hot_pepper: 1 });
  });

  it('should use injected selector for food_epic_x1', () => {
    // Deterministically select dream_treat
    const selector = () => 'dream_treat';
    const decomposed = decomposeShopItem('food_epic_x1', 1, { randomSelector: selector });
    expect(decomposed).toEqual({ dream_treat: 1 });
  });

  it('should have correct pool for food_rare_x1', () => {
    expect(RANDOM_BUNDLE_POOLS['food_rare_x1']).toEqual(['spicy_taco', 'hot_pepper', 'ice_cream']);
  });

  it('should have correct pool for food_epic_x1', () => {
    expect(RANDOM_BUNDLE_POOLS['food_epic_x1']).toEqual(['birthday_cake', 'dream_treat']);
  });
});

// ============================================================================
// Price Calculation Tests
// ============================================================================

describe('Shop Price Calculation', () => {
  it('should calculate correct price for individual food with quantity', () => {
    const priceInfo = calculatePrice('apple', 5);
    expect(priceInfo).toEqual({ price: 25, currency: 'coins' });
  });

  it('should calculate correct price for bundle (ignores quantity)', () => {
    const priceInfo = calculatePrice('food_apple_x5', 3);
    expect(priceInfo).toEqual({ price: 20, currency: 'coins' }); // Bundles are qty 1
  });

  it('should calculate correct price for gem items', () => {
    const priceInfo = calculatePrice('food_epic_x1', 1);
    expect(priceInfo).toEqual({ price: 5, currency: 'gems' });
  });

  it('should return null for invalid item', () => {
    const priceInfo = calculatePrice('nonexistent_item', 1);
    expect(priceInfo).toBeNull();
  });
});

// ============================================================================
// Inventory Validation Tests
// ============================================================================

describe('Inventory Validation', () => {
  it('should allow adding to empty inventory', () => {
    const result = canAddItemsToInventory({}, 15, { apple: 5 });
    expect(result.allowed).toBe(true);
  });

  it('should allow stacking existing items', () => {
    const result = canAddItemsToInventory({ apple: 10 }, 15, { apple: 5 });
    expect(result.allowed).toBe(true);
  });

  it('should reject when exceeding stack limit', () => {
    const result = canAddItemsToInventory({ apple: 95 }, 15, { apple: 10 });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('stack_limit');
  });

  it('should reject when adding new items at capacity', () => {
    const fullInv: Record<string, number> = {};
    for (let i = 0; i < 15; i++) {
      fullInv[`item_${i}`] = 1;
    }
    const result = canAddItemsToInventory(fullInv, 15, { apple: 1 });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('inventory_full');
  });

  it('should allow adding multiple new items if slots available', () => {
    const result = canAddItemsToInventory({}, 15, { apple: 2, banana: 1, carrot: 1, lollipop: 1 });
    expect(result.allowed).toBe(true);
  });
});
