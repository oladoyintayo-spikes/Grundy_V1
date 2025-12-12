// ============================================
// GRUNDY — INVENTORY VIEW
// Main inventory screen with tabs and slot counter
// Bible §14.8, BCT-INV-009 to BCT-INV-013
// ============================================

import React, { useState, useMemo } from 'react';
import type { InventoryTab, FoodDefinition } from '../../types';
import { useInventory, useInventoryCapacity, useGameStore } from '../../game/store';
import { getFoodById, getAllFoods } from '../../data/foods';
import { InventoryItemCard } from './InventoryItemCard';
import { InventoryDetailModal } from './InventoryDetailModal';
import { playUiTap, playUiBack } from '../../audio/audioManager';

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

  // Local state
  const [activeTab, setActiveTab] = useState<InventoryTab>('food');
  const [selectedItem, setSelectedItem] = useState<{ item: FoodDefinition; quantity: number } | null>(null);

  // BCT-INV-002: Count used slots (unique item IDs with qty > 0)
  const usedSlots = getUsedSlots();

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

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      data-testid="inventory-view"
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
        </div>

        {/* Items Grid */}
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
