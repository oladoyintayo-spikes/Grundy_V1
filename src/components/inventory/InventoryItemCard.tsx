// ============================================
// GRUNDY — INVENTORY ITEM CARD
// Individual item card with quantity badge
// Bible §14.8, BCT-INV-011
// ============================================

import React from 'react';
import type { FoodDefinition, Rarity } from '../../types';

// Focus ring class for keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

// Rarity color mapping
const RARITY_COLORS: Record<Rarity, { bg: string; border: string; badge: string }> = {
  common: { bg: 'bg-slate-700/50', border: 'border-slate-500/30', badge: 'bg-slate-500' },
  uncommon: { bg: 'bg-green-900/30', border: 'border-green-500/30', badge: 'bg-green-600' },
  rare: { bg: 'bg-blue-900/30', border: 'border-blue-500/30', badge: 'bg-blue-600' },
  epic: { bg: 'bg-purple-900/30', border: 'border-purple-500/30', badge: 'bg-purple-600' },
  legendary: { bg: 'bg-amber-900/30', border: 'border-amber-500/30', badge: 'bg-amber-600' },
};

interface InventoryItemCardProps {
  item: FoodDefinition;
  quantity: number;
  onSelect: () => void;
}

export function InventoryItemCard({ item, quantity, onSelect }: InventoryItemCardProps) {
  const colors = RARITY_COLORS[item.rarity];

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-3 rounded-xl border-2 transition-all duration-200
        flex flex-col items-center justify-center min-w-[80px] min-h-[90px]
        ${colors.bg} ${colors.border}
        hover:scale-105 hover:border-amber-400/50 active:scale-95
        ${FOCUS_RING_CLASS}
      `}
      data-testid="inventory-item-card"
      data-item-id={item.id}
      aria-label={`${item.name}, quantity ${quantity}, ${item.rarity} rarity`}
    >
      {/* Item Emoji */}
      <span className="text-3xl mb-1" aria-hidden="true">{item.emoji}</span>

      {/* Item Name */}
      <span className="text-xs text-slate-300 text-center truncate w-full px-1">
        {item.name}
      </span>

      {/* Quantity Badge - BCT-INV-011 */}
      <span
        className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-bold text-white ${colors.badge}`}
        data-testid={`inventory-qty-${item.id}`}
      >
        x{quantity}
      </span>
    </button>
  );
}

export default InventoryItemCard;
