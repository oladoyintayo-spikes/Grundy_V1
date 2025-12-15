/**
 * ShopView Component
 *
 * Shop UI per Bible §14.7 / BCT v2.2.
 * - 4-tab structure: Food, Care, Cosmetics (stub), Gems (stub/locked)
 * - Food tab: Bundles section above Individual section
 * - Care tab: Care items with visibility conditions
 * - Recommended section when triggers apply
 * - Quantity selector for individual foods (1-10)
 *
 * Shop-A: UI + catalog correctness only.
 * No purchase plumbing (currency deduction, inventory mutation).
 */

import { useState, useMemo } from 'react';
import {
  ShopTab,
  ShopItem,
  SHOP_TEST_IDS,
  SHOP_QTY_SELECTOR,
  getFoodBundles,
  getIndividualFoodsSorted,
  getShopItemsByTab,
  getShopRecommendations,
  getShopItemById,
  type RecommendationState,
  // P11-B: Cosmetics imports
  COSMETIC_CATALOG,
  COSMETIC_SLOTS,
  type CosmeticSlot,
  type CosmeticDefinition,
} from '../../constants/bible.constants';
import { useGameStore } from '../../game/store';

// Focus ring class for accessibility
const FOCUS_RING_CLASS = 'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900';

interface ShopViewProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current coins balance (for UI hints, no deduction in Shop-A) */
  coins: number;
  /** Current gems balance (for UI hints) */
  gems: number;
  /** Current pet level (for level-gated items) */
  petLevel: number;
  /** Current game mode ('cozy' | 'classic') */
  gameMode: 'cozy' | 'classic';
  /** Current pet state for recommendations */
  petState: {
    hunger: number;
    mood: number;
    energy: number;
    weight: number;
    isSick: boolean;
  };
  /** Current inventory for display */
  inventory: Record<string, number>;
  /** Optional: placeholder for future purchase handler */
  onPurchase?: (itemId: string, quantity: number) => void;
  /** P11-B: Active pet ID for cosmetics (optional for backwards compat) */
  activePetId?: string;
}

/**
 * Shop Tab Button Component
 */
const ShopTabButton = ({
  tab,
  activeTab,
  onClick,
  isLocked,
  isStub,
}: {
  tab: ShopTab;
  activeTab: ShopTab;
  onClick: () => void;
  isLocked?: boolean;
  isStub?: boolean;
}) => {
  const isActive = tab === activeTab;
  const tabLabels: Record<ShopTab, string> = {
    food: 'Food',
    care: 'Care',
    cosmetics: 'Cosmetics',
    gems: 'Gems',
  };

  const tabEmojis: Record<ShopTab, string> = {
    food: '🍎',
    care: '💊',
    cosmetics: '✨',
    gems: '💎',
  };

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all
        ${isActive
          ? 'bg-amber-500 text-white'
          : isLocked
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
        ${FOCUS_RING_CLASS}
      `}
      data-testid={SHOP_TEST_IDS[`TAB_${tab.toUpperCase()}` as keyof typeof SHOP_TEST_IDS]}
    >
      <span className="mr-1">{tabEmojis[tab]}</span>
      {tabLabels[tab]}
      {isLocked && <span className="ml-1 text-xs">🔒</span>}
      {isStub && !isLocked && <span className="ml-1 text-xs opacity-60">(Soon)</span>}
    </button>
  );
};

/**
 * Quantity Selector Component for Individual Foods
 * BCT-SHOP-005: min=1, BCT-SHOP-006: max=10
 */
const QuantitySelector = ({
  itemId,
  quantity,
  onQuantityChange,
}: {
  itemId: string;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}) => {
  const canDecrease = quantity > SHOP_QTY_SELECTOR.MIN;
  const canIncrease = quantity < SHOP_QTY_SELECTOR.MAX;

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={() => canDecrease && onQuantityChange(quantity - 1)}
        disabled={!canDecrease}
        className={`
          w-7 h-7 rounded-lg text-lg font-bold transition-all
          ${canDecrease
            ? 'bg-slate-600 text-white hover:bg-slate-500 active:scale-95'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
          ${FOCUS_RING_CLASS}
        `}
        data-testid={SHOP_TEST_IDS.qtyMinus(itemId)}
        aria-label={`Decrease quantity for ${itemId}`}
      >
        -
      </button>
      <span
        className="w-8 text-center text-white font-bold"
        data-testid={SHOP_TEST_IDS.qtyValue(itemId)}
      >
        {quantity}
      </span>
      <button
        onClick={() => canIncrease && onQuantityChange(quantity + 1)}
        disabled={!canIncrease}
        className={`
          w-7 h-7 rounded-lg text-lg font-bold transition-all
          ${canIncrease
            ? 'bg-slate-600 text-white hover:bg-slate-500 active:scale-95'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
          ${FOCUS_RING_CLASS}
        `}
        data-testid={SHOP_TEST_IDS.qtyPlus(itemId)}
        aria-label={`Increase quantity for ${itemId}`}
      >
        +
      </button>
    </div>
  );
};

/**
 * Shop Item Card Component
 */
const ShopItemCard = ({
  item,
  coins,
  gems,
  inventory,
  quantity,
  onQuantityChange,
  onPurchase,
  isLevelLocked,
}: {
  item: ShopItem;
  coins: number;
  gems: number;
  inventory: Record<string, number>;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  onPurchase?: () => void;
  isLevelLocked?: boolean;
}) => {
  const isIndividual = item.kind === 'individual';
  const qty = quantity || 1;
  const totalCost = item.price * qty;
  const canAfford = item.currency === 'coins' ? coins >= totalCost : gems >= totalCost;
  const ownedQty = inventory[item.id] || 0;

  const currencyIcon = item.currency === 'coins' ? '🪙' : '💎';
  const currencyColor = item.currency === 'coins' ? 'text-yellow-400' : 'text-purple-400';

  return (
    <div
      className={`
        p-3 rounded-xl border-2 transition-all
        ${isLevelLocked
          ? 'border-slate-700 bg-slate-800/50 opacity-60'
          : canAfford
            ? 'border-green-500/30 bg-slate-800 hover:border-green-500/60'
            : 'border-slate-700 bg-slate-800/80'}
      `}
      data-testid={SHOP_TEST_IDS.itemCard(item.id)}
    >
      {/* Item Header */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-2xl">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{item.displayName}</div>
          <div className="text-xs text-slate-400 truncate">{item.description}</div>
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-center justify-between mb-2">
        <div
          className={`flex items-center gap-1 ${currencyColor}`}
          data-testid={SHOP_TEST_IDS.itemPrice(item.id)}
        >
          <span>{currencyIcon}</span>
          <span className="font-bold">{isIndividual ? totalCost : item.price}</span>
          {isIndividual && qty > 1 && (
            <span className="text-xs text-slate-400">({item.price} each)</span>
          )}
        </div>
        {ownedQty > 0 && (
          <span className="text-xs text-slate-400">Own: {ownedQty}</span>
        )}
      </div>

      {/* Level Lock Message */}
      {isLevelLocked && item.levelRequired && (
        <div className="text-xs text-amber-400/70 mb-2">
          Unlocks at Level {item.levelRequired}
        </div>
      )}

      {/* Quantity Selector (individual foods only) */}
      {isIndividual && !isLevelLocked && onQuantityChange && (
        <QuantitySelector
          itemId={item.id}
          quantity={qty}
          onQuantityChange={onQuantityChange}
        />
      )}

      {/* Purchase Button (Shop-A: placeholder, no actual purchase) */}
      {!isLevelLocked && onPurchase && (
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`
            w-full mt-2 py-2 px-3 rounded-lg text-sm font-medium transition-all
            ${canAfford
              ? 'bg-green-600 text-white hover:bg-green-500 active:scale-95'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
            ${FOCUS_RING_CLASS}
          `}
        >
          {canAfford ? 'Buy' : 'Not enough'}
        </button>
      )}
    </div>
  );
};

/**
 * Recommended Section Component
 */
const RecommendedSection = ({
  recommendations,
  coins,
  gems,
  inventory,
}: {
  recommendations: string[];
  coins: number;
  gems: number;
  inventory: Record<string, number>;
}) => {
  if (recommendations.length === 0) return null;

  return (
    <div
      className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl"
      data-testid={SHOP_TEST_IDS.SECTION_RECOMMENDED}
    >
      <h3 className="text-sm font-bold text-amber-400 mb-2">Recommended For You</h3>
      <div className="flex gap-2 overflow-x-auto">
        {recommendations.map(itemId => {
          const item = getShopItemById(itemId);
          if (!item) return null;
          const canAfford = item.currency === 'coins' ? coins >= item.price : gems >= item.price;
          const currencyIcon = item.currency === 'coins' ? '🪙' : '💎';

          return (
            <div
              key={itemId}
              className={`
                flex-shrink-0 p-2 rounded-lg border
                ${canAfford
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-slate-600 bg-slate-800'}
              `}
              data-testid={SHOP_TEST_IDS.itemCard(itemId)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <div className="text-xs text-white font-medium">{item.displayName}</div>
                  <div className="text-xs text-amber-400">
                    {currencyIcon} {item.price}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Food Tab Content
 * BCT-SHOP-004: Bundles section above Individual section
 * BCT-SHOP-021: Individual foods sorted by rarity
 */
const FoodTabContent = ({
  coins,
  gems,
  petLevel,
  inventory,
  quantities,
  onQuantityChange,
  onPurchase,
}: {
  coins: number;
  gems: number;
  petLevel: number;
  inventory: Record<string, number>;
  quantities: Record<string, number>;
  onQuantityChange: (itemId: string, qty: number) => void;
  onPurchase?: (itemId: string, qty: number) => void;
}) => {
  const bundles = getFoodBundles();
  const individualFoods = getIndividualFoodsSorted();

  return (
    <div className="space-y-4">
      {/* Bundles Section */}
      <div data-testid={SHOP_TEST_IDS.SECTION_BUNDLES}>
        <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-1">
          <span>📦</span> Bundles <span className="text-xs text-green-400">(Best Value)</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {bundles.map(item => {
            const isLevelLocked = item.levelRequired !== undefined && petLevel < item.levelRequired;
            return (
              <ShopItemCard
                key={item.id}
                item={item}
                coins={coins}
                gems={gems}
                inventory={inventory}
                isLevelLocked={isLevelLocked}
                onPurchase={onPurchase ? () => onPurchase(item.id, 1) : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Individual Foods Section */}
      <div data-testid={SHOP_TEST_IDS.SECTION_INDIVIDUAL}>
        <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-1">
          <span>🍽️</span> Individual Foods
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {individualFoods.map(item => (
            <ShopItemCard
              key={item.id}
              item={item}
              coins={coins}
              gems={gems}
              inventory={inventory}
              quantity={quantities[item.id] || 1}
              onQuantityChange={(qty) => onQuantityChange(item.id, qty)}
              onPurchase={onPurchase ? () => onPurchase(item.id, quantities[item.id] || 1) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Care Tab Content
 * BCT-SHOP-014/015: Medicine visibility (Classic only)
 * BCT-SHOP-016/017: Diet Food visibility (weight >= 31)
 */
const CareTabContent = ({
  coins,
  gems,
  gameMode,
  petWeight,
  inventory,
  onPurchase,
}: {
  coins: number;
  gems: number;
  gameMode: 'cozy' | 'classic';
  petWeight: number;
  inventory: Record<string, number>;
  onPurchase?: (itemId: string, qty: number) => void;
}) => {
  const careItems = getShopItemsByTab('care').filter(item => {
    // Apply visibility conditions
    if (item.visibilityCondition === 'classic_only' && gameMode !== 'classic') {
      return false;
    }
    if (item.visibilityCondition === 'weight_chubby' && petWeight < 31) {
      return false;
    }
    return true;
  });

  return (
    <div data-testid="shop-section-care">
      <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-1">
        <span>💊</span> Care Items
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {careItems.map(item => (
          <ShopItemCard
            key={item.id}
            item={item}
            coins={coins}
            gems={gems}
            inventory={inventory}
            onPurchase={onPurchase ? () => onPurchase(item.id, 1) : undefined}
          />
        ))}
      </div>
      {careItems.length === 0 && (
        <div className="text-center text-slate-400 py-8">
          No care items available right now
        </div>
      )}
    </div>
  );
};

/**
 * P11-B: Cosmetics Tab Content
 * BCT-COS-UI-SHOP-001: Shows catalog items with slot/rarity/priceGems
 * BCT-COS-UI-SHOP-002: Owned cosmetics show equip/unequip; non-owned are locked
 * BCT-COS-UI-SHOP-003: Price shown is informational only; no buy CTA
 */
const CosmeticsTabContent = ({
  activePetId,
}: {
  activePetId: string | undefined;
}) => {
  const getPetOwnedCosmetics = useGameStore((s) => s.getPetOwnedCosmetics);
  const getPetEquippedCosmetics = useGameStore((s) => s.getPetEquippedCosmetics);
  const equipCosmetic = useGameStore((s) => s.equipCosmetic);
  const unequipCosmetic = useGameStore((s) => s.unequipCosmetic);
  const storeActivePetId = useGameStore((s) => s.activePetId);

  // Use passed activePetId or fallback to store
  const petId = activePetId ?? storeActivePetId;

  // Get ownership and equipped state for active pet
  const ownedCosmeticIds = petId ? getPetOwnedCosmetics(petId) : [];
  const equippedCosmetics = petId ? getPetEquippedCosmetics(petId) : {};

  // Rarity colors for badges
  const rarityColors: Record<string, string> = {
    common: 'bg-slate-500 text-white',
    uncommon: 'bg-green-600 text-white',
    rare: 'bg-blue-600 text-white',
    epic: 'bg-purple-600 text-white',
    legendary: 'bg-amber-500 text-black',
  };

  // Slot emoji mapping
  const slotEmojis: Record<CosmeticSlot, string> = {
    hat: '🎩',
    accessory: '🧣',
    outfit: '👔',
    aura: '✨',
    skin: '🎨',
  };

  const handleEquip = (cosmeticId: string) => {
    if (!petId) return;
    const result = equipCosmetic(petId, cosmeticId);
    if (!result.success) {
      console.warn(`[P11-B] Equip failed: ${result.error}`);
    }
  };

  const handleUnequip = (slot: CosmeticSlot) => {
    if (!petId) return;
    const result = unequipCosmetic(petId, slot);
    if (!result.success) {
      console.warn(`[P11-B] Unequip failed: ${result.error}`);
    }
  };

  // Group cosmetics by slot for display (using COSMETIC_SLOTS order)
  const cosmeticsBySlot = useMemo(() => {
    const grouped: Record<CosmeticSlot, CosmeticDefinition[]> = {
      hat: [],
      accessory: [],
      outfit: [],
      aura: [],
      skin: [],
    };
    for (const cosmetic of COSMETIC_CATALOG) {
      grouped[cosmetic.slot].push(cosmetic);
    }
    return grouped;
  }, []);

  return (
    <div data-testid="shop-cosmetics-panel">
      <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1">
        <span>✨</span> Cosmetics
        <span className="text-xs text-slate-500 ml-2">(View Only — No Purchase)</span>
      </h3>

      {/* Render cosmetics grouped by slot in COSMETIC_SLOTS order */}
      <div className="space-y-4">
        {COSMETIC_SLOTS.map((slot) => {
          const slotCosmetics = cosmeticsBySlot[slot];
          if (slotCosmetics.length === 0) return null;

          const equippedInSlot = equippedCosmetics[slot];

          return (
            <div key={slot} className="space-y-2">
              {/* Slot Header */}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{slotEmojis[slot]}</span>
                <span className="capitalize font-medium">{slot}</span>
                {equippedInSlot && (
                  <span className="text-xs text-amber-400" data-testid={`shop-cosmetic-equipped-${equippedInSlot}`}>
                    ★ Equipped
                  </span>
                )}
              </div>

              {/* Cosmetic Cards */}
              <div className="grid grid-cols-2 gap-2">
                {slotCosmetics.map((cosmetic) => {
                  const isOwned = ownedCosmeticIds.includes(cosmetic.id);
                  const isEquipped = equippedInSlot === cosmetic.id;

                  return (
                    <div
                      key={cosmetic.id}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${isEquipped
                          ? 'border-amber-500 bg-amber-500/10'
                          : isOwned
                            ? 'border-green-500/30 bg-slate-800'
                            : 'border-slate-700 bg-slate-800/50 opacity-70'}
                      `}
                      data-testid={`shop-cosmetic-card-${cosmetic.id}`}
                    >
                      {/* Item Header */}
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{slotEmojis[cosmetic.slot]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {cosmetic.displayName}
                          </div>
                          {/* Rarity Badge */}
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${rarityColors[cosmetic.rarity]}`}
                            data-testid={`shop-cosmetic-rarity-${cosmetic.id}`}
                          >
                            {cosmetic.rarity}
                          </span>
                        </div>
                      </div>

                      {/* Price Display (informational only - BCT-COS-UI-SHOP-003) */}
                      <div
                        className="flex items-center gap-1 text-purple-400 text-sm mb-2"
                        data-testid={`shop-cosmetic-price-${cosmetic.id}`}
                      >
                        <span>💎</span>
                        <span className="font-bold">{cosmetic.priceGems}</span>
                      </div>

                      {/* Ownership & Equip State */}
                      {isOwned ? (
                        <div data-testid={`shop-cosmetic-owned-${cosmetic.id}`}>
                          {isEquipped ? (
                            <button
                              onClick={() => handleUnequip(cosmetic.slot)}
                              className={`
                                w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all
                                bg-amber-600 text-white hover:bg-amber-500 active:scale-95
                                ${FOCUS_RING_CLASS}
                              `}
                              data-testid={`shop-cosmetic-unequip-${cosmetic.slot}`}
                            >
                              Unequip
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquip(cosmetic.id)}
                              className={`
                                w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all
                                bg-green-600 text-white hover:bg-green-500 active:scale-95
                                ${FOCUS_RING_CLASS}
                              `}
                              data-testid={`shop-cosmetic-equip-${cosmetic.id}`}
                            >
                              Equip
                            </button>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-medium text-center bg-slate-700 text-slate-400"
                          data-testid={`shop-cosmetic-locked-${cosmetic.id}`}
                        >
                          🔒 Not Owned
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {COSMETIC_CATALOG.length === 0 && (
        <div className="text-center text-slate-400 py-8">
          No cosmetics available yet
        </div>
      )}
    </div>
  );
};

/**
 * Stub Tab Content (Gems only now - Cosmetics has full content)
 * BCT-SHOP-018/019: Gems tab locked below Level 5
 */
const StubTabContent = ({
  tab,
  petLevel,
}: {
  tab: 'gems';
  petLevel: number;
}) => {
  const isGemsLocked = petLevel < 5;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">💎</span>
      <h3 className="text-lg font-bold text-slate-300 mb-1">Gem Shop</h3>
      <p className="text-sm text-slate-400">
        {isGemsLocked
          ? `Unlocks at Level 5 (Currently Level ${petLevel})`
          : 'Coming Soon!'}
      </p>
      {isGemsLocked && (
        <div className="mt-3 text-2xl">🔒</div>
      )}
    </div>
  );
};

/**
 * Main ShopView Component
 */
export function ShopView({
  isOpen,
  onClose,
  coins,
  gems,
  petLevel,
  gameMode,
  petState,
  inventory,
  onPurchase,
  activePetId,
}: ShopViewProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>('food');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Calculate recommendations
  const recommendations = useMemo(() => {
    const state: RecommendationState = {
      isSick: petState.isSick,
      isClassicMode: gameMode === 'classic',
      energy: petState.energy,
      hunger: petState.hunger,
      mood: petState.mood,
      weight: petState.weight,
    };
    return getShopRecommendations(state);
  }, [petState, gameMode]);

  // Handle quantity change
  const handleQuantityChange = (itemId: string, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(SHOP_QTY_SELECTOR.MIN, Math.min(SHOP_QTY_SELECTOR.MAX, qty)),
    }));
  };

  // Gems tab is locked below level 5
  const isGemsLocked = petLevel < 5;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      data-testid={SHOP_TEST_IDS.SHOP_VIEW}
    >
      <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <h2 className="text-lg font-bold text-white">Shop</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Currency Display */}
            <div className="flex items-center gap-1 text-yellow-400">
              <span>🪙</span>
              <span className="font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <span>💎</span>
              <span className="font-bold">{gems}</span>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg
                text-slate-400 hover:text-white hover:bg-slate-700
                transition-all ${FOCUS_RING_CLASS}
              `}
              aria-label="Close shop"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 bg-slate-800">
          <ShopTabButton
            tab="food"
            activeTab={activeTab}
            onClick={() => setActiveTab('food')}
          />
          <ShopTabButton
            tab="care"
            activeTab={activeTab}
            onClick={() => setActiveTab('care')}
          />
          <ShopTabButton
            tab="cosmetics"
            activeTab={activeTab}
            onClick={() => setActiveTab('cosmetics')}
          />
          <ShopTabButton
            tab="gems"
            activeTab={activeTab}
            onClick={() => !isGemsLocked && setActiveTab('gems')}
            isLocked={isGemsLocked}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Recommended Section (shown on Food and Care tabs) */}
          {(activeTab === 'food' || activeTab === 'care') && (
            <RecommendedSection
              recommendations={recommendations}
              coins={coins}
              gems={gems}
              inventory={inventory}
            />
          )}

          {/* Tab Content */}
          {activeTab === 'food' && (
            <FoodTabContent
              coins={coins}
              gems={gems}
              petLevel={petLevel}
              inventory={inventory}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              onPurchase={onPurchase}
            />
          )}

          {activeTab === 'care' && (
            <CareTabContent
              coins={coins}
              gems={gems}
              gameMode={gameMode}
              petWeight={petState.weight}
              inventory={inventory}
              onPurchase={onPurchase}
            />
          )}

          {activeTab === 'cosmetics' && (
            <CosmeticsTabContent activePetId={activePetId} />
          )}

          {activeTab === 'gems' && (
            <StubTabContent
              tab="gems"
              petLevel={petLevel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopView;
