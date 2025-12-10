// ============================================
// GRUNDY — APP HEADER
// Top navigation bar with pet info + currencies
// P3-NAV-2
// ============================================

import React from 'react';
import { useGameStore } from '../../game/store';
import { getPetById } from '../../data/pets';

export function AppHeader() {
  const pet = useGameStore((state) => state.pet);
  const currencies = useGameStore((state) => state.currencies);
  const energy = useGameStore((state) => state.energy);

  // Get pet display data from canonical pets.ts
  const petData = getPetById(pet.id);
  const petName = petData?.name ?? pet.id;
  const petEmoji = petData?.emoji ?? '🐾';

  return (
    <header className="px-4 py-3 flex items-center justify-between bg-slate-900/80 border-b border-white/10 backdrop-blur">
      {/* Pet info */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
          {petEmoji}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Your Grundy</span>
          <span className="text-sm font-semibold text-white">
            {petName} · Lv {pet.level}
          </span>
        </div>
      </div>

      {/* Currencies */}
      <div className="flex items-center gap-2 text-sm text-white">
        <div className="px-2 py-1 rounded-full bg-yellow-500/20 flex items-center gap-1">
          <span>🪙</span>
          <span className="text-yellow-400 font-medium">{currencies.coins ?? 0}</span>
        </div>
        {energy && (
          <div className="px-2 py-1 rounded-full bg-blue-500/20 flex items-center gap-1">
            <span>⚡</span>
            <span className="text-blue-400 font-medium">{energy.current}/{energy.max}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
