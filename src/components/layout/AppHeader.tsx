// ============================================
// GRUNDY — APP HEADER
// Top navigation bar with pet info + currencies
// P3-NAV-2, P3-ENV-3, P5-ART-PETS
// ============================================

import React from 'react';
import { useGameStore } from '../../game/store';
import { getPetById } from '../../data/pets';
import { TIME_LABELS, ROOM_LABELS } from '../../game/environment';
import { PetAvatar } from '../pet/PetAvatar';
import { getHeaderPose } from '../../game/petVisuals';

// ============================================
// ENVIRONMENT BADGE
// Shows current time-of-day and room
// ============================================
function EnvironmentBadge() {
  const environment = useGameStore((state) => state.environment);

  return (
    <div className="text-[10px] text-slate-400 mt-0.5">
      {TIME_LABELS[environment.timeOfDay]} · {ROOM_LABELS[environment.room]}
    </div>
  );
}

export function AppHeader() {
  const pet = useGameStore((state) => state.pet);
  const currencies = useGameStore((state) => state.currencies);
  const energy = useGameStore((state) => state.energy);

  // Get pet display data from canonical pets.ts
  const petData = getPetById(pet.id);
  const petName = petData?.name ?? pet.id;

  // Determine pose based on pet state (P5-ART-PETS)
  const headerPose = getHeaderPose(pet.mood, pet.hunger);

  return (
    <header className="px-4 py-3 flex items-center justify-between bg-slate-900/80 border-b border-white/10 backdrop-blur">
      {/* Pet info */}
      <div className="flex items-center gap-3">
        {/* Pet avatar using real sprites (P5-ART-PETS) */}
        <PetAvatar petId={pet.id} pose={headerPose} size="sm" />
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Your Grundy</span>
          <span className="text-sm font-semibold text-white">
            {petName} · Lv {pet.level}
          </span>
          <EnvironmentBadge />
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
