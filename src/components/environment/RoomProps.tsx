// ============================================
// GRUNDY — ROOM PROPS COMPONENT
// P6-ART-PROPS: Visual props for room differentiation
// Bible §14.4: Rooms Lite - subtle background decoration
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
// DESIGN NOTES
// ============================================
// Props should feel like subtle room atmosphere (furniture shadows)
// NOT like UI panels or drawers.
//
// Key principles:
// - Low opacity (15-25%) - background decoration only
// - No hard borders - avoid "sheet edge" appearance
// - Safe zone: props stay above bottom-16 (Action Bar height)
// - Non-interactive: pointer-events-none, aria-hidden
// ============================================

// ============================================
// KITCHEN PROPS
// Countertop, cabinet silhouette, warm atmosphere
// ============================================

function KitchenProps() {
  return (
    <>
      {/* Counter/table surface - elevated above Action Bar safe zone */}
      <div
        data-testid="room-kitchen-counter"
        className="absolute bottom-20 left-4 right-4 h-8 bg-gradient-to-t from-amber-900/20 to-transparent rounded-lg"
        aria-hidden="true"
      />
      {/* Cabinet silhouette on left */}
      <div
        className="absolute bottom-28 left-4 w-10 h-16 bg-amber-950/15 rounded-t-lg"
        aria-hidden="true"
      />
      {/* Fridge silhouette on right */}
      <div
        className="absolute bottom-28 right-4 w-12 h-24 bg-slate-700/15 rounded-t-md"
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
      {/* Bed platform - elevated above Action Bar safe zone */}
      <div
        data-testid="room-bedroom-bed"
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-gradient-to-t from-indigo-900/20 to-transparent rounded-xl"
        aria-hidden="true"
      />
      {/* Pillow accent */}
      <div
        className="absolute bottom-26 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-300/10 rounded-lg"
        aria-hidden="true"
      />
      {/* Bedside lamp on right - soft glow */}
      <div
        className="absolute bottom-32 right-8 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-6 h-6 bg-amber-400/15 rounded-full blur-sm" />
        <div className="w-1.5 h-4 bg-slate-600/20 -mt-1" />
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
      {/* Toy shelf on left - subtle */}
      <div
        data-testid="room-playroom-shelf"
        className="absolute bottom-24 left-4 w-12 h-14 bg-pink-900/15 rounded-lg flex flex-col items-center justify-center gap-1 p-1"
        aria-hidden="true"
      >
        {/* Toy blocks - very subtle */}
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 bg-red-400/20 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-blue-400/20 rounded-sm" />
        </div>
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 bg-yellow-400/20 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-green-400/20 rounded-sm" />
        </div>
      </div>
      {/* Rug/play mat - elevated, softer */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gradient-to-t from-purple-800/15 to-transparent rounded-t-full"
        aria-hidden="true"
      />
      {/* Ball on right */}
      <div
        className="absolute bottom-24 right-10 w-8 h-8 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full"
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
      {/* Sofa - elevated above Action Bar, narrower, softer */}
      <div
        data-testid="room-livingroom-sofa"
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-gradient-to-t from-slate-700/20 to-transparent rounded-t-lg"
        aria-hidden="true"
      />
      {/* Sofa back - subtle */}
      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-slate-600/15 rounded-t-md"
        aria-hidden="true"
      />
      {/* Plant on left */}
      <div
        className="absolute bottom-28 left-8 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-5 h-6 bg-emerald-600/20 rounded-full" />
        <div className="w-3 h-3 bg-amber-800/20 rounded-sm -mt-1" />
      </div>
      {/* Coffee table - subtle */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-8 w-14 h-2 bg-amber-900/15 rounded-sm"
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
        className="absolute bottom-20 left-6 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-12 h-16 bg-emerald-700/20 rounded-full" />
        <div className="w-3 h-8 bg-amber-900/20 -mt-2" />
      </div>
      {/* Grass strip - elevated, very subtle */}
      <div
        className="absolute bottom-16 left-0 right-0 h-4 bg-gradient-to-t from-emerald-800/15 to-transparent"
        aria-hidden="true"
      />
      {/* Bush on right */}
      <div
        className="absolute bottom-20 right-8 w-10 h-8 bg-emerald-600/15 rounded-full"
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
 * These are subtle CSS-based shapes that give each room
 * a distinct visual identity without distracting from
 * the pet or looking like UI elements.
 *
 * Bible §14.4: Rooms Lite - background decoration only
 * Bible §14.6: Action Bar is sole bottom UI - props must not look like UI
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
