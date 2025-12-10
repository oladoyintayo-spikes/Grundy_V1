// ============================================
// GRUNDY — FTUE PET SELECTION SCREEN
// Bible §7.5 — Starter selection + locked teasers
// P4-3: Pet origin snippets
// P4-4: Locked pet teasers
// ============================================

import React, { useState } from 'react';
import {
  FTUE_COPY,
  STARTER_PET_IDS,
  LOCKED_PET_IDS,
  getPetLore,
  PET_UNLOCK_LEVELS,
} from '../../copy/ftue';
import { getPetById } from '../../data/pets';

interface FtuePetSelectProps {
  onSelectPet: (petId: string) => void;
}

export function FtuePetSelect({ onSelectPet }: FtuePetSelectProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [viewedLockedPet, setViewedLockedPet] = useState<string | null>(null);

  const selectedLore = selectedPetId ? getPetLore(selectedPetId) : null;
  const lockedLore = viewedLockedPet ? getPetLore(viewedLockedPet) : null;

  const handleSelectStarter = (petId: string) => {
    setSelectedPetId(petId);
    setViewedLockedPet(null);
  };

  const handleTapLocked = (petId: string) => {
    setViewedLockedPet(petId);
    setSelectedPetId(null);
  };

  const handleConfirm = () => {
    if (selectedPetId) {
      onSelectPet(selectedPetId);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#2D1B4E] to-[#1A1025] px-4 py-6 overflow-y-auto">
      {/* Title */}
      <div className="text-2xl font-bold text-white text-center mb-6">
        {FTUE_COPY.petSelect.title}
      </div>

      {/* Starter Pets (Selectable) */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {STARTER_PET_IDS.map((petId) => {
          const pet = getPetById(petId);
          const lore = getPetLore(petId);
          const isSelected = selectedPetId === petId;

          return (
            <button
              key={petId}
              onClick={() => handleSelectStarter(petId)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-amber-600/30 ring-2 ring-amber-400 scale-105'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'
              }`}
            >
              <div className="text-3xl mb-1">{pet?.emoji}</div>
              <div className="text-sm text-white font-medium">{lore?.name}</div>
              <div className="text-[10px] text-emerald-400">FREE</div>
            </button>
          );
        })}
      </div>

      {/* Locked Pets (Teasers) */}
      <div className="text-xs text-slate-500 text-center mb-2">Coming soon...</div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {LOCKED_PET_IDS.map((petId) => {
          const pet = getPetById(petId);
          const unlockLevel = PET_UNLOCK_LEVELS[petId];
          const isViewing = viewedLockedPet === petId;

          return (
            <button
              key={petId}
              onClick={() => handleTapLocked(petId)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all opacity-60 ${
                isViewing ? 'bg-slate-700/50 ring-1 ring-slate-500' : 'bg-slate-800/30'
              }`}
            >
              <div className="text-xl mb-1 grayscale">
                {pet?.emoji}
                <span className="text-xs">🔒</span>
              </div>
              <div className="text-[10px] text-slate-400">Lv.{unlockLevel}</div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700/50 my-4" />

      {/* Lore Panel */}
      <div className="flex-1 bg-slate-800/30 rounded-xl p-4 mb-4 min-h-[180px]">
        {selectedLore ? (
          // Selected starter pet - full lore
          <div className="text-center">
            <div className="text-3xl mb-2">{getPetById(selectedPetId!)?.emoji}</div>
            <div className="text-lg font-bold text-white mb-1">
              ✨ {selectedLore.name} ✨
            </div>
            <div className="text-sm text-amber-400 mb-3">"{selectedLore.title}"</div>
            <div className="text-sm text-slate-300 mb-4 italic">
              "{selectedLore.shortOrigin}"
            </div>
            <div className="text-sm text-slate-400">
              <div className="mb-1">♡ Loves {selectedLore.loves.toLowerCase()}</div>
              <div>✗ Hates {selectedLore.hates.toLowerCase()}</div>
            </div>
          </div>
        ) : lockedLore ? (
          // Locked pet teaser
          <div className="text-center">
            <div className="text-3xl mb-2 grayscale opacity-60">
              {getPetById(viewedLockedPet!)?.emoji}
            </div>
            <div className="text-lg font-bold text-slate-400 mb-1">
              ✨ {lockedLore.name} ✨
            </div>
            <div className="text-sm text-slate-500 mb-3">"{lockedLore.title}"</div>
            <div className="text-sm text-slate-400 mb-4 italic">
              "{lockedLore.teaser}"
            </div>
            <div className="text-sm text-slate-500">
              🔒 {FTUE_COPY.petSelect.unlockLevel(PET_UNLOCK_LEVELS[viewedLockedPet!])}
            </div>
          </div>
        ) : (
          // No selection
          <div className="text-center text-slate-500 pt-8">
            Tap a pet to learn more about them
          </div>
        )}
      </div>

      {/* Choose Button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedPetId}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedPetId
            ? 'bg-amber-600 hover:bg-amber-500 text-white'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {selectedPetId
          ? `${FTUE_COPY.petSelect.chooseButton} ${selectedLore?.name}`
          : FTUE_COPY.petSelect.chooseButton}
      </button>
    </div>
  );
}
