// ============================================
// GRUNDY — INVENTORY VIEW
// Main inventory screen with tabs and slot counter
// Bible §14.8, BCT-INV-009 to BCT-INV-013
// P11-B: Added Cosmetics section (BCT-COS-UI-INV-001 to BCT-COS-UI-INV-003)
// ============================================

import React, { useState, useMemo } from 'react';
import type { InventoryTab, FoodDefinition } from '../../types';
import { useInventory, useInventoryCapacity, useGameStore } from '../../game/store';
import { getFoodById, getAllFoods } from '../../data/foods';
import { InventoryItemCard } from './InventoryItemCard';
import { InventoryDetailModal } from './InventoryDetailModal';
import { playUiTap, playUiBack } from '../../audio/audioManager';
// P11-B: Cosmetics imports
import {
  COSMETIC_CATALOG,
  COSMETIC_SLOTS,
  getCosmeticById,
  type CosmeticSlot,
  type CosmeticDefinition,
} from '../../constants/bible.constants';

// Focus ring class for keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

// Rarity sort order
const RARITY_ORDER: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

interface InventoryViewProps {
  onClose: () => void;
  onNavigateToShop: () => void;
  onNavigateToFeed: (foodId: string) => void;
}

export function InventoryView({ onClose, onNavigateToShop, onNavigateToFeed }: InventoryViewProps) {
  const inventory = useInventory();
  const inventoryCapacity = useInventoryCapacity();
  const getUsedSlots = useGameStore((state) => state.getUsedSlots);

  // P11-B: Cosmetics state
  const activePetId = useGameStore((state) => state.activePetId);
  const getPetOwnedCosmetics = useGameStore((state) => state.getPetOwnedCosmetics);
  const getPetEquippedCosmetics = useGameStore((state) => state.getPetEquippedCosmetics);
  const equipCosmetic = useGameStore((state) => state.equipCosmetic);
  const unequipCosmetic = useGameStore((state) => state.unequipCosmetic);

  // Local state
  const [activeTab, setActiveTab] = useState<InventoryTab>('food');
  const [selectedItem, setSelectedItem] = useState<{ item: FoodDefinition; quantity: number } | null>(null);

  // BCT-INV-002: Count used slots (unique item IDs with qty > 0)
  const usedSlots = getUsedSlots();

  // P11-B: Get owned and equipped cosmetics for active pet
  const ownedCosmeticIds = activePetId ? getPetOwnedCosmetics(activePetId) : [];
  const equippedCosmetics = activePetId ? getPetEquippedCosmetics(activePetId) : {};

  // P11-B: Group owned cosmetics by slot (using COSMETIC_SLOTS order)
  const cosmeticsBySlot = useMemo(() => {
    const grouped: Record<CosmeticSlot, CosmeticDefinition[]> = {
      hat: [],
      accessory: [],
      outfit: [],
      aura: [],
      skin: [],
    };
    for (const cosmeticId of ownedCosmeticIds) {
      const cosmetic = getCosmeticById(cosmeticId);
      if (cosmetic) {
        grouped[cosmetic.slot].push(cosmetic);
      }
    }
    return grouped;
  }, [ownedCosmeticIds]);

  // P11-B: Rarity colors for badges
  const rarityColors: Record<string, string> = {
    common: 'bg-slate-500 text-white',
    uncommon: 'bg-green-600 text-white',
    rare: 'bg-blue-600 text-white',
    epic: 'bg-purple-600 text-white',
    legendary: 'bg-amber-500 text-black',
  };

  // P11-B: Slot emoji mapping
  const slotEmojis: Record<CosmeticSlot, string> = {
    hat: '🎩',
    accessory: '🧣',
    outfit: '👔',
    aura: '✨',
    skin: '🎨',
  };

  // Get inventory items with their definitions
  const inventoryItems = useMemo(() => {
    const items: { item: FoodDefinition; quantity: number }[] = [];

    for (const [itemId, quantity] of Object.entries(inventory)) {
      if (quantity <= 0) continue;
      const foodDef = getFoodById(itemId);
      if (foodDef) {
        items.push({ item: foodDef, quantity });
      }
    }

    // Sort by rarity (BCT-SHOP-021 spec)
    items.sort((a, b) => RARITY_ORDER[a.item.rarity] - RARITY_ORDER[b.item.rarity]);

    return items;
  }, [inventory]);

  // BCT-INV-009 & BCT-INV-010: Filter by tab
  // Currently all items are food, care items will be filtered when added
  const filteredItems = useMemo(() => {
    if (activeTab === 'food') {
      // BCT-INV-009: Food tab filters to food only
      return inventoryItems; // All current items are food
    } else {
      // BCT-INV-010: Care tab filters to care only
      // No care items exist yet - return empty
      return [];
    }
  }, [inventoryItems, activeTab]);

  const handleTabChange = (tab: InventoryTab) => {
    playUiTap();
    setActiveTab(tab);
  };

  const handleItemSelect = (item: FoodDefinition, quantity: number) => {
    playUiTap();
    setSelectedItem({ item, quantity });
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  // BCT-INV-017: Use on Pet routes to feeding flow
  const handleUseOnPet = () => {
    if (selectedItem) {
      setSelectedItem(null);
      onNavigateToFeed(selectedItem.item.id);
    }
  };

  const handleClose = () => {
    playUiBack();
    onClose();
  };

  const handleGoToShop = () => {
    playUiTap();
    onNavigateToShop();
  };

  // P11-B: Cosmetics equip/unequip handlers
  const handleEquipCosmetic = (cosmeticId: string) => {
    if (!activePetId) return;
    playUiTap();
    const result = equipCosmetic(activePetId, cosmeticId);
    if (!result.success) {
      console.warn(`[P11-B] Equip failed: ${result.error}`);
    }
  };

  const handleUnequipCosmetic = (slot: CosmeticSlot) => {
    if (!activePetId) return;
    playUiTap();
    const result = unequipCosmetic(activePetId, slot);
    if (!result.success) {
      console.warn(`[P11-B] Unequip failed: ${result.error}`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      data-testid="inventory-modal"
    >
      <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header with Slot Counter - BCT-INV-012 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎒</span>
            <h2 className="text-lg font-bold text-white">Inventory</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* BCT-INV-012: Slot counter X/15 */}
            <span
              className="text-sm text-slate-400"
              data-testid="inventory-slot-counter"
            >
              {usedSlots}/{inventoryCapacity}
            </span>
            <button
              onClick={handleClose}
              className={`text-slate-400 hover:text-white text-2xl p-1 ${FOCUS_RING_CLASS}`}
              aria-label="Close inventory"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Tabs - BCT-INV-009 & BCT-INV-010 */}
        <div className="flex border-b border-slate-700" role="tablist" aria-label="Inventory tabs">
          <button
            onClick={() => handleTabChange('food')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${FOCUS_RING_CLASS}
              ${activeTab === 'food'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'}`}
            role="tab"
            aria-selected={activeTab === 'food'}
            data-testid="inventory-tab-food"
          >
            Food
          </button>
          <button
            onClick={() => handleTabChange('care')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${FOCUS_RING_CLASS}
              ${activeTab === 'care'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'}`}
            role="tab"
            aria-selected={activeTab === 'care'}
            data-testid="inventory-tab-care"
          >
            Care
          </button>
          {/* P11-B: Cosmetics Tab */}
          <button
            onClick={() => handleTabChange('cosmetics')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${FOCUS_RING_CLASS}
              ${activeTab === 'cosmetics'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'}`}
            role="tab"
            aria-selected={activeTab === 'cosmetics'}
            data-testid="inventory-tab-cosmetics"
          >
            Cosmetics
          </button>
        </div>

        {/* Items Grid (Food/Care tabs) */}
        {activeTab !== 'cosmetics' && (
          <div className="flex-1 overflow-auto p-4" data-testid="inventory-items">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {filteredItems.map(({ item, quantity }) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    quantity={quantity}
                    onSelect={() => handleItemSelect(item, quantity)}
                  />
                ))}
              </div>
            ) : (
              /* BCT-INV-013: Empty state shows Shop CTA */
              <div
                className="flex flex-col items-center justify-center h-full min-h-[200px] text-center"
                data-testid="inventory-empty-state"
              >
                <span className="text-4xl mb-4" aria-hidden="true">
                  {activeTab === 'food' ? '🍽️' : '💊'}
                </span>
                <p className="text-slate-400 mb-4">
                  {activeTab === 'food'
                    ? 'No food in your inventory!'
                    : 'No care items yet.'}
                </p>
                {activeTab === 'food' && (
                  <button
                    onClick={handleGoToShop}
                    className={`px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all active:scale-95 ${FOCUS_RING_CLASS}`}
                    data-testid="inventory-shop-cta"
                  >
                    Go to Shop
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* P11-B: Cosmetics Section (BCT-COS-UI-INV-001 to BCT-COS-UI-INV-003) */}
        {activeTab === 'cosmetics' && (
          <div className="flex-1 overflow-auto p-4" data-testid="inventory-cosmetics-section">
            {ownedCosmeticIds.length === 0 ? (
              /* BCT-COS-UI-INV-003: Empty state when owned cosmetics = 0 */
              <div
                className="flex flex-col items-center justify-center h-full min-h-[200px] text-center"
                data-testid="inventory-cosmetics-empty"
              >
                <span className="text-4xl mb-4" aria-hidden="true">✨</span>
                <p className="text-slate-400 mb-2">No cosmetics yet</p>
                <p className="text-xs text-slate-500">
                  Visit the Shop to view available cosmetics
                </p>
              </div>
            ) : (
              /* BCT-COS-UI-INV-001: Owned cosmetics grouped by slot in COSMETIC_SLOTS order */
              <div className="space-y-4">
                {COSMETIC_SLOTS.map((slot) => {
                  const slotCosmetics = cosmeticsBySlot[slot];
                  const equippedInSlot = equippedCosmetics[slot];

                  return (
                    <div key={slot} data-testid={`inventory-cosmetics-slot-${slot}`}>
                      {/* Slot Header */}
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <span>{slotEmojis[slot]}</span>
                        <span className="capitalize font-medium">{slot}</span>
                        {equippedInSlot && (
                          <span
                            className="text-xs text-amber-400"
                            data-testid={`inventory-cosmetic-equipped-${slot}`}
                          >
                            ★ Equipped
                          </span>
                        )}
                      </div>

                      {slotCosmetics.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {slotCosmetics.map((cosmetic) => {
                            const isEquipped = equippedInSlot === cosmetic.id;

                            return (
                              <div
                                key={cosmetic.id}
                                className={`
                                  p-3 rounded-xl border-2 transition-all
                                  ${isEquipped
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-green-500/30 bg-slate-800'}
                                `}
                                data-testid={`inventory-cosmetic-row-${cosmetic.id}`}
                              >
                                {/* Cosmetic Info */}
                                <div className="flex items-start gap-2 mb-2">
                                  <span className="text-xl">{slotEmojis[cosmetic.slot]}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">
                                      {cosmetic.displayName}
                                    </div>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${rarityColors[cosmetic.rarity]}`}
                                    >
                                      {cosmetic.rarity}
                                    </span>
                                  </div>
                                </div>

                                {/* BCT-COS-UI-INV-002: Equip/Unequip controls */}
                                {isEquipped ? (
                                  <button
                                    onClick={() => handleUnequipCosmetic(cosmetic.slot)}
                                    className={`
                                      w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all
                                      bg-amber-600 text-white hover:bg-amber-500 active:scale-95
                                      ${FOCUS_RING_CLASS}
                                    `}
                                    data-testid={`inventory-cosmetic-unequip-${slot}`}
                                  >
                                    Unequip
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEquipCosmetic(cosmetic.id)}
                                    className={`
                                      w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all
                                      bg-green-600 text-white hover:bg-green-500 active:scale-95
                                      ${FOCUS_RING_CLASS}
                                    `}
                                    data-testid={`inventory-cosmetic-equip-${cosmetic.id}`}
                                  >
                                    Equip
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 py-2 pl-6">
                          No {slot} cosmetics owned
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <InventoryDetailModal
          item={selectedItem.item}
          quantity={selectedItem.quantity}
          onClose={handleCloseDetail}
          onUseOnPet={handleUseOnPet}
        />
      )}
    </div>
  );
}

export default InventoryView;
