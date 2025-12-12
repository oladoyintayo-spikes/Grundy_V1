// ============================================
// GRUNDY — ROOM PROPS COMPONENT
// P6-ART-PROPS: Visual props for room differentiation
// ============================================

import React from 'react';
import type { RoomId } from '../../types';

// ============================================
// TYPES
// ============================================

interface RoomPropsProps {
  room: RoomId;
}

// ============================================
// KITCHEN PROPS
// Countertop, cabinet silhouette, warm atmosphere
// ============================================

function KitchenProps() {
  return (
    <>
      {/* Counter/table surface at bottom */}
      <div
        data-testid="room-kitchen-counter"
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/60 to-amber-800/30 border-t border-amber-700/30"
        aria-hidden="true"
      />
      {/* Cabinet silhouette on left */}
      <div
        className="absolute bottom-16 left-4 w-12 h-24 bg-amber-950/40 rounded-t-lg border-x border-t border-amber-800/20"
        aria-hidden="true"
      />
      {/* Fridge silhouette on right */}
      <div
        className="absolute bottom-16 right-4 w-14 h-32 bg-slate-700/30 rounded-t-md border-x border-t border-slate-600/20"
        aria-hidden="true"
      />
    </>
  );
}

// ============================================
// BEDROOM PROPS
// Bed silhouette, lamp, cozy sleeping area
// ============================================

function BedroomProps() {
  return (
    <>
      {/* Bed platform at bottom */}
      <div
        data-testid="room-bedroom-bed"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-t from-indigo-900/50 to-indigo-800/30 rounded-t-xl border-x border-t border-indigo-700/30"
        aria-hidden="true"
      />
      {/* Pillow accent */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-6 bg-slate-300/20 rounded-lg"
        aria-hidden="true"
      />
      {/* Bedside lamp on right */}
      <div
        className="absolute bottom-16 right-6 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-8 h-8 bg-amber-400/30 rounded-full blur-sm" />
        <div className="w-2 h-6 bg-slate-600/40 -mt-1" />
      </div>
    </>
  );
}

// ============================================
// PLAYROOM PROPS
// Toy shelf, playful blocks, fun atmosphere
// ============================================

function PlayroomProps() {
  return (
    <>
      {/* Toy shelf on left */}
      <div
        data-testid="room-playroom-shelf"
        className="absolute bottom-20 left-3 w-16 h-20 bg-pink-900/30 rounded-lg border border-pink-700/20 flex flex-col items-center justify-center gap-1 p-1"
        aria-hidden="true"
      >
        {/* Toy blocks */}
        <div className="flex gap-0.5">
          <div className="w-3 h-3 bg-red-400/40 rounded-sm" />
          <div className="w-3 h-3 bg-blue-400/40 rounded-sm" />
        </div>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 bg-yellow-400/40 rounded-sm" />
          <div className="w-3 h-3 bg-green-400/40 rounded-sm" />
        </div>
      </div>
      {/* Rug/play mat at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-gradient-to-t from-purple-800/40 to-purple-700/20 rounded-t-full"
        aria-hidden="true"
      />
      {/* Ball on right */}
      <div
        className="absolute bottom-8 right-8 w-10 h-10 bg-gradient-to-br from-red-400/40 to-orange-400/40 rounded-full"
        aria-hidden="true"
      />
    </>
  );
}

// ============================================
// LIVING ROOM PROPS
// Sofa silhouette, plant, cozy living space
// ============================================

function LivingRoomProps() {
  return (
    <>
      {/* Sofa at bottom */}
      <div
        data-testid="room-livingroom-sofa"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-t from-slate-700/50 to-slate-600/30 rounded-t-lg border-x border-t border-slate-500/20"
        aria-hidden="true"
      />
      {/* Sofa back */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-slate-600/30 rounded-t-md"
        aria-hidden="true"
      />
      {/* Plant on left */}
      <div
        className="absolute bottom-14 left-6 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-6 h-8 bg-emerald-600/40 rounded-full" />
        <div className="w-4 h-4 bg-amber-800/40 rounded-sm -mt-1" />
      </div>
      {/* Coffee table */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-12 w-20 h-3 bg-amber-900/30 rounded-sm"
        aria-hidden="true"
      />
    </>
  );
}

// ============================================
// YARD PROPS
// Tree, outdoor elements
// ============================================

function YardProps() {
  return (
    <>
      {/* Tree on left */}
      <div
        data-testid="room-yard-tree"
        className="absolute bottom-0 left-4 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-16 h-20 bg-emerald-700/40 rounded-full" />
        <div className="w-4 h-12 bg-amber-900/40 -mt-2" />
      </div>
      {/* Grass at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-800/40 to-emerald-700/20"
        aria-hidden="true"
      />
      {/* Bush on right */}
      <div
        className="absolute bottom-4 right-6 w-12 h-10 bg-emerald-600/30 rounded-full"
        aria-hidden="true"
      />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * RoomProps - Renders room-specific decorative props.
 *
 * These are simple CSS-based shapes that give each room
 * a distinct visual identity without distracting from
 * the pet or HUD.
 */
export function RoomProps({ room }: RoomPropsProps) {
  switch (room) {
    case 'kitchen':
      return <KitchenProps />;
    case 'bedroom':
      return <BedroomProps />;
    case 'playroom':
      return <PlayroomProps />;
    case 'yard':
      return <YardProps />;
    case 'living_room':
    default:
      return <LivingRoomProps />;
  }
}

export default RoomProps;
