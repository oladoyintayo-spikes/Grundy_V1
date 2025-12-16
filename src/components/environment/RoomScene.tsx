// ============================================
// GRUNDY — ROOM SCENE COMPONENT
// P5-ART-ROOMS, P6-ART-PROPS: Foreground visuals layered on environment
// ============================================

import React from 'react';
import { useGameStore } from '../../game/store';
import { getRoomSceneSpec, getAccentDisplay } from '../../art/roomScenes';
import { RoomProps } from './RoomProps';

// ============================================
// TYPES
// ============================================

export interface RoomSceneProps {
  /** Content to render inside the room scene */
  children?: React.ReactNode;
  /** Whether to show accent element badge indicators (DEBUG ONLY - keep false in production) */
  showAccents?: boolean;
  /** Whether to show visual room props (P6-ART-PROPS) */
  showProps?: boolean;
}

// ============================================
// COMPONENT
// ============================================

/**
 * RoomScene - Wraps content with room-specific foreground visuals.
 *
 * This component layers on TOP of the environment background gradient
 * from GrundyPrototype, adding:
 * - Room-specific foreground overlay (gradient)
 * - Night-time darkening effect
 * - Placeholder accent element indicators
 *
 * The children (pet display, UI) sit on top of these layers.
 *
 * @example
 * ```tsx
 * <RoomScene>
 *   <PetDisplay petId={pet.id} pose={currentPose} />
 * </RoomScene>
 * ```
 */
export function RoomScene({ children, showAccents = false, showProps = true }: RoomSceneProps) {
  const environment = useGameStore((state) => state.environment);
  const { timeOfDay, room } = environment;

  const scene = getRoomSceneSpec(room, timeOfDay);

  return (
    <div data-testid="room-background" className="relative flex-1 flex flex-col overflow-hidden">
      {/* Foreground overlay gradient */}
      <div
        className={[
          'pointer-events-none absolute inset-0 z-0',
          scene.foregroundClass,
        ].join(' ')}
        aria-hidden="true"
      />

      {/* Night-time darkening overlay */}
      {scene.nightOverlay && (
        <div
          className={[
            'pointer-events-none absolute inset-0 z-0',
            scene.nightOverlay,
          ].join(' ')}
          aria-hidden="true"
        />
      )}

      {/* Room props (P6-ART-PROPS): Visual decorative elements */}
      {showProps && (
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <RoomProps room={room} />
        </div>
      )}

      {/* Accent element indicators (debug badges - off by default) */}
      {showAccents && scene.accentElements.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex gap-2 opacity-60">
          {scene.accentElements.map((elem) => {
            const display = getAccentDisplay(elem);
            return (
              <span
                key={elem}
                className="px-2 py-1 rounded-full bg-black/30 border border-white/10 text-xs text-slate-300 flex items-center gap-1"
                title={display.label}
              >
                <span className="text-sm">{display.icon}</span>
                <span className="hidden sm:inline">{display.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default RoomScene;
