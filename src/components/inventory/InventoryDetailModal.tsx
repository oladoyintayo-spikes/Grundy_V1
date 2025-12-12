// ============================================
// GRUNDY — INVENTORY DETAIL MODAL
// Shows item details: quantity, rarity, affinities
// Bible §14.8, BCT-INV-014 to BCT-INV-017
// ============================================

import React from 'react';
import type { FoodDefinition, Rarity, Affinity } from '../../types';
import { getAllPets } from '../../data/pets';
import { playUiTap, playUiBack } from '../../audio/audioManager';

// Focus ring class for keyboard navigation
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800';

// Rarity display info
const RARITY_INFO: Record<Rarity, { label: string; color: string; emoji: string }> = {
  common: { label: 'Common', color: 'text-slate-400', emoji: '' },
  uncommon: { label: 'Uncommon', color: 'text-green-400', emoji: '' },
  rare: { label: 'Rare', color: 'text-blue-400', emoji: '' },
  epic: { label: 'Epic', color: 'text-purple-400', emoji: '' },
  legendary: { label: 'Legendary', color: 'text-amber-400', emoji: '' },
};

// Affinity display info - BCT-INV-016
const AFFINITY_INFO: Record<Affinity, { emoji: string; label: string; color: string }> = {
  loved: { emoji: '', label: 'Loved', color: 'text-pink-400' },
  liked: { emoji: '', label: 'Liked', color: 'text-green-400' },
  neutral: { emoji: '', label: 'Neutral', color: 'text-slate-400' },
  disliked: { emoji: '', label: 'Disliked', color: 'text-red-400' },
};

interface InventoryDetailModalProps {
  item: FoodDefinition;
  quantity: number;
  onClose: () => void;
  onUseOnPet: () => void;
}

export function InventoryDetailModal({ item, quantity, onClose, onUseOnPet }: InventoryDetailModalProps) {
  const rarityInfo = RARITY_INFO[item.rarity];
  const allPets = getAllPets();

  const handleClose = () => {
    playUiBack();
    onClose();
  };

  const handleUseOnPet = () => {
    playUiTap();
    onUseOnPet();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      data-testid="inventory-detail-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
    >
      <div
        className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{item.emoji}</span>
            <div>
              <h2 id="item-detail-title" className="text-lg font-bold text-white">{item.name}</h2>
              {/* BCT-INV-015: Rarity */}
              <span className={`text-sm ${rarityInfo.color}`} data-testid="item-rarity">
                {rarityInfo.emoji} {rarityInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`text-slate-400 hover:text-white text-2xl p-1 ${FOCUS_RING_CLASS}`}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4">{item.description}</p>

        {/* BCT-INV-014: Quantity */}
        <div className="bg-slate-700/50 rounded-lg p-3 mb-4" data-testid="item-quantity">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">In Inventory</span>
            <span className="text-xl font-bold text-amber-400">x{quantity}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400 block">Hunger</span>
            <span className="text-orange-400 font-bold">+{item.hunger}</span>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400 block">Mood</span>
            <span className={item.mood >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
              {item.mood >= 0 ? '+' : ''}{item.mood}
            </span>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400 block">XP</span>
            <span className="text-purple-400 font-bold">+{item.xp}</span>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400 block">Bond</span>
            <span className="text-pink-400 font-bold">+{item.bond}</span>
          </div>
        </div>

        {/* BCT-INV-016: Affinities for all pets */}
        <div className="mb-4" data-testid="item-affinities">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Pet Reactions</h3>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {allPets.map((pet) => {
              const affinity = item.affinity[pet.id] || 'neutral';
              const affinityInfo = AFFINITY_INFO[affinity];
              return (
                <div
                  key={pet.id}
                  className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-1.5"
                  data-testid={`affinity-${pet.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pet.emoji}</span>
                    <span className="text-sm text-slate-300">{pet.name}</span>
                  </div>
                  <span className={`text-sm ${affinityInfo.color}`}>
                    {affinityInfo.emoji} {affinityInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BCT-INV-017: Use on Pet Button */}
        <button
          onClick={handleUseOnPet}
          disabled={quantity <= 0}
          className={`
            w-full py-3 px-4 rounded-xl font-bold transition-all
            ${quantity > 0
              ? 'bg-green-500 hover:bg-green-600 text-white active:scale-95'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'}
            ${FOCUS_RING_CLASS}
          `}
          data-testid="inventory-use-on-pet"
        >
          Use on Pet
        </button>
      </div>
    </div>
  );
}

export default InventoryDetailModal;
