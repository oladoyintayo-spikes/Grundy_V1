# Grundy Web — Art Integration Notes

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Task IDs:** P5-ART-PETS, P5-ART-ROOMS, P5-ART-DOC
**Phase:** Web Phase 5 — Polish / Web 1.0

---

## Overview

This document describes the art/visual integration for the Grundy web prototype. The system replaces emoji placeholders with real pet sprites and adds room-specific visual layers.

---

## Pet Sprites (P5-ART-PETS)

### Source Files

Pet art is located in the repo at:

```
assets/pets/<petId>/
```

Each pet has multiple pose images (e.g., `chomper_idle.png`, `chomper_happy.png`).

### Sprite Config

**File:** `src/art/petSprites.ts`

This module:
- Imports all pet sprites from `assets/pets/<petId>/*.png`
- Maps `PetId + PetPose` to the correct sprite path
- Exports `PET_SPRITES` registry and `getPetSprite()` helper

#### Types

```typescript
type PetPose = 'idle' | 'happy' | 'sad' | 'sleeping';

interface PetSpriteSet {
  idle: string;
  happy: string;
  sad?: string;
  sleeping?: string;
}
```

#### Usage

```typescript
import { getPetSprite } from '../art/petSprites';

const sprite = getPetSprite('munchlet', 'happy');
// Returns the imported image path for munchlet's happy pose
```

### Adding/Replacing Pet Art

To add or replace art for a pet:

1. Place PNG files in `assets/pets/<petId>/` with naming convention:
   - `<petId>_idle.png` (required)
   - `<petId>_happy.png` (required)
   - `<petId>_sad.png` (optional)
   - `<petId>_sleeping.png` (optional)

2. Update `src/art/petSprites.ts`:
   - Add import statements for new files
   - Update the `PET_SPRITES` registry entry

3. Run tests: `npm test -- --run`

### PetAvatar Component

**File:** `src/components/pet/PetAvatar.tsx`

Two components for displaying pet sprites:

#### PetAvatar

Small, rounded avatar for header/nav:

```tsx
<PetAvatar petId="munchlet" pose="happy" size="sm" />
```

Props:
- `petId`: Pet ID string
- `pose`: PetPose ('idle' | 'happy' | 'sad' | 'sleeping')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `className`: Additional CSS classes
- `animated`: Enable pulse animation

#### PetDisplay

Larger, standalone display for main views:

```tsx
<PetDisplay petId={pet.id} pose={currentPose} breathing />
```

Props:
- `petId`: Pet ID string
- `pose`: PetPose
- `className`: Additional CSS classes
- `breathing`: Enable subtle breathing animation

### Pet Visuals Helper

**File:** `src/game/petVisuals.ts`

Maps game state to visual pose:

```typescript
import { getDefaultPoseForState } from '../game/petVisuals';

const pose = getDefaultPoseForState({
  mood: pet.mood,
  hunger: pet.hunger,
  isSleeping: false,
});
```

Priority order:
1. `isSleeping: true` → 'sleeping'
2. `hunger < 20` → 'sad'
3. `mood === 'ecstatic'` → 'happy'
4. `mood === 'happy' && hunger > 50` → 'happy'
5. `mood === 'sad'` → 'sad'
6. Default → 'idle'

Additional helpers:
- `getPoseForReaction(reaction)`: Map feeding reactions to poses
- `getHeaderPose(mood, hunger)`: Simplified pose for header avatar
- `getPositivePose()`, `getNeutralPose()`, `getNegativePose()`: Direct pose getters

---

## Room Scenes (P5-ART-ROOMS)

### Room Scene Config

**File:** `src/art/roomScenes.ts`

Defines foreground visuals layered on top of environment backgrounds:

```typescript
import { getRoomSceneSpec } from '../art/roomScenes';

const scene = getRoomSceneSpec('playroom', 'day');
// Returns: { label, foregroundClass, accentElements, nightOverlay? }
```

#### Room IDs

- `living_room` — Default home room
- `kitchen` — Warm, cozy visuals
- `bedroom` — Dark, restful atmosphere
- `playroom` — Fun, vibrant colors
- `yard` — Outdoor, natural setting

#### Time of Day

Each room adapts to time of day:
- `morning` — Soft morning light
- `day` — Bright, full light
- `evening` — Warm sunset tones
- `night` — Dark, restful overlay

#### Accent Elements

Visual props hinting at room contents (placeholders for future art):
- `plant`, `lamp`, `desk`, `bed`, `tree`, `toys`, `couch`, `rug`

### RoomScene Component

**File:** `src/components/environment/RoomScene.tsx`

Wraps content with room-specific visuals:

```tsx
<RoomScene showAccents={true}>
  <HomeView />
</RoomScene>
```

Layers:
1. Foreground gradient overlay (from `foregroundClass`)
2. Night-time darkening (from `nightOverlay`)
3. Accent element indicators (optional badges)
4. Main content (children)

Props:
- `children`: React content
- `showAccents`: Show placeholder accent badges (default: true)

---

## Integration Points

### AppHeader

**File:** `src/components/layout/AppHeader.tsx`

Uses `PetAvatar` with `getHeaderPose()`:

```tsx
const headerPose = getHeaderPose(pet.mood, pet.hunger);
<PetAvatar petId={pet.id} pose={headerPose} size="sm" />
```

### HomeView (GrundyPrototype)

**File:** `src/GrundyPrototype.tsx`

Uses `PetDisplay` with pose based on state/reaction:

```tsx
const currentPose = lastReaction
  ? getPoseForReaction(lastReaction)
  : getDefaultPoseForState({ mood: pet.mood, hunger: pet.hunger });

<PetDisplay petId={pet.id} pose={currentPose} breathing />
```

### MainApp Layout

Wraps home and games views in `RoomScene`:

```tsx
<RoomScene showAccents={true}>
  <HomeView />
</RoomScene>
```

---

## Future Expansion

### Additional Poses

To add more poses (e.g., 'eating', 'excited'):

1. Add files to `assets/pets/<petId>/<petId>_<pose>.png`
2. Expand `PetPose` type in `petSprites.ts`
3. Add imports and update `PET_SPRITES`
4. Update `getDefaultPoseForState()` logic if needed

### Room Props Art

Current accent elements are placeholder badges. To add real art:

1. Create art files in `assets/rooms/` or similar
2. Update `RoomScene` to render actual images
3. Add position/layout logic for props

### Animation

The `breathing` prop on `PetDisplay` adds subtle CSS animation. For more complex animations:

1. Consider CSS keyframe animations or framer-motion
2. Add animation state to `PetSpriteSet` if needed
3. Keep performance in mind for mobile

---

## Tests

**File:** `src/__tests__/artConfig.test.ts`

Covers:
- `PET_SPRITES` registry completeness
- `getPetSprite()` fallback behavior
- `getRoomSceneSpec()` for all rooms/times
- `getDefaultPoseForState()` logic
- Accent element helpers

Run: `npm test -- --run`

---

## Files Summary

| File | Purpose |
|------|---------|
| `src/art/petSprites.ts` | Pet sprite registry and helpers |
| `src/art/roomScenes.ts` | Room scene config and helpers |
| `src/components/pet/PetAvatar.tsx` | PetAvatar + PetDisplay components |
| `src/components/environment/RoomScene.tsx` | RoomScene wrapper component |
| `src/game/petVisuals.ts` | State-to-pose mapping helpers |
| `src/__tests__/artConfig.test.ts` | Art config tests |
| `assets/pets/<petId>/*.png` | Pet sprite source files |

---

*This documentation covers P5-ART-PETS, P5-ART-ROOMS, and P5-ART-DOC.*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
