// ============================================
// GRUNDY — APP HEADER
// Top navigation bar with pet info + currencies
// P3-NAV-2, P3-ENV-3, P5-ART-PETS, P5-A11Y-LABELS
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
    <div className="text-[10px] text-slate-300 mt-0.5" aria-label={`${TIME_LABELS[environment.timeOfDay]} in ${ROOM_LABELS[environment.room]}`}>
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
    <header
      className="px-4 py-3 flex items-center justify-between bg-slate-900/80 border-b border-white/10 backdrop-blur"
      role="banner"
    >
      {/* Pet info */}
      <div className="flex items-center gap-3">
        {/* Pet avatar using real sprites (P5-ART-PETS, P5-A11Y-LABELS) */}
        <PetAvatar
          petId={pet.id}
          pose={headerPose}
          size="sm"
          petDisplayName={petName}
        />
        <div className="flex flex-col">
          {/* App title as h1 for screen readers (P5-A11Y-LABELS) */}
          <h1 className="sr-only">Grundy</h1>
          <span className="text-xs text-slate-300">Your Grundy</span>
          <span className="text-sm font-semibold text-slate-50">
            {petName} · Lv {pet.level}
          </span>
          <EnvironmentBadge />
        </div>
      </div>

      {/* Currencies */}
      <div className="flex items-center gap-2 text-sm" role="status" aria-label="Resources">
        {/* Bond display (Bible §4.4: Bond is visible) */}
        <div
          className="px-2 py-1 rounded-full bg-pink-500/20 flex items-center gap-1"
          aria-label={`Bond level ${pet.bond}`}
          data-testid="hud-bond"
        >
          <span aria-hidden="true">💕</span>
          <span className="text-pink-400 font-medium">{Math.round(pet.bond)}</span>
        </div>
        <div
          className="px-2 py-1 rounded-full bg-yellow-500/20 flex items-center gap-1"
          aria-label={`${currencies.coins ?? 0} coins`}
          data-testid="hud-coins"
        >
          <span aria-hidden="true">🪙</span>
          <span className="text-yellow-400 font-medium">{currencies.coins ?? 0}</span>
        </div>
        {/* Gems display */}
        <div
          className="px-2 py-1 rounded-full bg-purple-500/20 flex items-center gap-1"
          aria-label={`${currencies.gems ?? 0} gems`}
          data-testid="hud-gems"
        >
          <span aria-hidden="true">💎</span>
          <span className="text-purple-400 font-medium">{currencies.gems ?? 0}</span>
        </div>
        {energy && (
          <div
            className="px-2 py-1 rounded-full bg-blue-500/20 flex items-center gap-1"
            aria-label={`${energy.current} of ${energy.max} energy`}
          >
            <span aria-hidden="true">⚡</span>
            <span className="text-blue-400 font-medium">{energy.current}/{energy.max}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
