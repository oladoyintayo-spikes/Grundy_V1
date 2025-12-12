# P9-A Pet Slots Foundation Plan

**Phase:** P9-A-PETSLOTS-DATA+SWITCH v2.1
**Bible Version:** v1.6
**BCT Version:** v2.2
**Author:** Claude (Web Implementer Agent)
**Status:** VERIFIED — All blocking requirements satisfied

---

## Pre-Implementation Bible Verification (BLOCKING Gate)

All required items have been verified against Bible v1.6:

### 1. Slot Capacity / Max Owned Pets ✅

**Bible §11.6 Pet Slot Pricing:**

| Slot | Cost | Cumulative | Discount with Plus |
|------|------|------------|-------------------|
| 1st | FREE | — | — |
| 2nd | 100 💎 | 100 💎 | 80 💎 (20% off) |
| 3rd | 150 💎 | 250 💎 | 120 💎 (20% off) |
| 4th | 200 💎 | 450 💎 | 160 💎 (20% off) |

**Maximum = 4 pet slots**

### 2. Slot Pricing and Currency ✅

**Bible §11.6:** All pet slots (2nd, 3rd, 4th) are purchased with **Gems (💎)**.

- Also documented in §11.5 Category 3: Utility Items table:
  - `util_pet_slot_2`: 100 💎 (Level 5+ unlock)
  - `util_pet_slot_3`: 150 💎 (Own slot 2)
  - `util_pet_slot_4`: 200 💎 (Own slot 3)

### 3. Coins are GLOBAL ✅

**Bible §11.6 Pet Slot Rules:**
> "All slotted pets share: Coins, Gems, Inventory"

**Bible §6 Core Rules:**
> "SHARED across all pets: Coins, Gems, Food Inventory"

### 4. Gems are GLOBAL ✅

Same citations as above — gems are explicitly shared across all pets.

### 5. Inventory is GLOBAL ✅

Same citations as above — food inventory is explicitly shared across all pets.

### 6. Starter Pet Ownership Model ✅

**Bible §6 Core Rules:**
> "All 3 STARTERS always available (Munchlet, Grib, Plompo)"
> "Player picks which starter to play FIRST"
> "Can switch between starters anytime"
> "Each pet has SEPARATE: Level, XP, Bond, Mood, Hunger"

**Interpretation:**
- Player **OWNS all 3 starters** from the start (not pick-one)
- Player picks which one to **play first** during FTUE Pet Selection step (Bible §7.3)
- If no selection made, default to 'munchlet' (existing behavior)

### 7. Active Pet Selection Persistence ⚠️

**Not explicitly stated** in Bible. However:

- Bible §15 Data Schema shows `activePetId` in GlobalState interface
- Bible §14.5 Pet Switching UX: "Auto-save first — Save current pet's state before switching"
- Current codebase uses Zustand persist, which saves all state

**Implementation Choice:** Implement persistence as safe default. Document as "implementation choice pending explicit spec."

---

## Deferred to P9-B (NOT implemented in P9-A)

Per prompt instructions, the following are explicitly deferred:

1. **Switching animation details** — instant vs animated (Bible silent on specific transitions)
2. **Per-pet runtime behaviors** — mood, bond, neglect, energy per-pet tracking
3. **Notification routing** — which pet triggers alerts/push
4. **Runaway handling with multiple pets** — auto-switch rules
5. **Slot unlock purchase flow integration** — Shop integration, Grundy Plus, bundles

---

## Data Model / Store Shape (P9-A Minimal)

### Terminology

Following prompt requirements:
- **SpeciesId** = one of 8 canonical species (`munchlet`, `grib`, `plompo`, `fizz`, `ember`, `chomper`, `whisp`, `luxe`)
- **PetInstanceId** = unique id for an owned pet instance (UUID-like string format: `{speciesId}-{timestamp}`)

The existing `PetId` type in the codebase refers to species, so we keep it as-is and introduce `PetInstanceId` for instances.

### New Store Shape

```typescript
// New types (src/types/index.ts)
export type PetInstanceId = string;

// Pet instance state (extends existing PetState)
export interface OwnedPetState extends PetState {
  instanceId: PetInstanceId;  // Unique instance ID
  speciesId: string;          // Species (was 'id' in PetState)
}

// Store additions
interface GameStore {
  // Existing fields remain for backward compatibility during migration
  pet: PetState;  // Active pet (kept for selector compatibility)

  // NEW: Multi-pet fields
  petsById: Record<PetInstanceId, OwnedPetState>;  // All owned pets
  ownedPetIds: PetInstanceId[];                     // Ordered list of owned pet IDs
  activePetId: PetInstanceId;                       // Currently active pet

  // Existing: Keep unlockedPets for species unlock tracking
  unlockedPets: string[];  // Species IDs that are unlocked

  // NEW: Pet slot tracking
  unlockedSlots: number;  // Number of slots unlocked (1-4)

  // NEW: Actions
  getActivePet: () => OwnedPetState | null;
  setActivePet: (petId: PetInstanceId) => void;
  getOwnedPets: () => OwnedPetState[];
}
```

### Why This Shape is Minimal

1. **`petsById`** — Record for O(1) lookup of any owned pet by instance ID
2. **`ownedPetIds`** — Ordered array preserves acquisition order for UI display
3. **`activePetId`** — Single source of truth for which pet is active
4. **`unlockedSlots`** — Tracks slot progression (1-4), defaults to 1
5. Keeps existing `pet` field for backward compatibility with selectors

### PetState Reuse

The existing `PetState` interface is sufficient for per-pet state:

```typescript
interface PetState {
  id: string;              // Species ID (kept for compatibility)
  customName?: string;     // Player-given name
  level: number;
  xp: number;
  bond: number;
  mood: MoodState;
  moodValue: number;
  hunger: number;
  evolutionStage: EvolutionStage;
  transientPose?: TransientPose;
  lastMoodUpdate?: number;
}
```

For P9-A, we extend this with `instanceId` and `speciesId` in `OwnedPetState`.

---

## Save/Load Migration Plan

### Legacy Save Structure (Pre-P9-A)

```typescript
{
  pet: PetState,           // Single pet with id = species
  unlockedPets: string[],  // Species IDs
  currencies: {...},
  inventory: {...},
  // ... other fields
}
```

### New Save Structure (P9-A)

```typescript
{
  pet: PetState,                    // Kept for backward compat, synced with active pet
  petsById: Record<string, OwnedPetState>,
  ownedPetIds: string[],
  activePetId: string,
  unlockedSlots: number,
  unlockedPets: string[],           // Species unlocks (unchanged)
  currencies: {...},
  inventory: {...},
  // ... other fields
}
```

### Migration Logic

On load, detect legacy save (missing `petsById`):

```typescript
function migrateToMultiPet(state: LegacyState): NewState {
  // Generate instance ID for legacy pet
  const instanceId = `${state.pet.id}-legacy`;

  // Convert legacy pet to owned pet
  const ownedPet: OwnedPetState = {
    ...state.pet,
    instanceId,
    speciesId: state.pet.id,
  };

  // Create all 3 starter pets (Bible §6: player owns all starters)
  const STARTERS = ['munchlet', 'grib', 'plompo'];
  const petsById: Record<string, OwnedPetState> = {};
  const ownedPetIds: string[] = [];

  // First, add the legacy pet (preserves progress)
  petsById[instanceId] = ownedPet;
  ownedPetIds.push(instanceId);

  // Add other starters that aren't the legacy pet
  for (const species of STARTERS) {
    if (species !== state.pet.id) {
      const newInstanceId = `${species}-starter`;
      petsById[newInstanceId] = createInitialPet(species, newInstanceId);
      ownedPetIds.push(newInstanceId);
    }
  }

  return {
    ...state,
    petsById,
    ownedPetIds,
    activePetId: instanceId,  // Keep playing the same pet
    unlockedSlots: 1,          // Default to 1 slot
  };
}
```

### Fallback Behavior

- **If `activePetId` missing/invalid:** Default to `ownedPetIds[0]`
- **If `ownedPetIds` missing/empty:** Initialize with 3 starters, active = munchlet
- **If migration fails:** Log error, fall back to fresh game state, do NOT corrupt save

---

## New Game Initialization

### Bible Requirements (§6 + §7)

- Player owns all 3 starters (Munchlet, Grib, Plompo)
- Player picks which to play first during FTUE
- Default to Munchlet if no selection

### Implementation

```typescript
function createInitialMultiPetState(): MultiPetState {
  const STARTERS = ['munchlet', 'grib', 'plompo'];
  const petsById: Record<string, OwnedPetState> = {};
  const ownedPetIds: string[] = [];

  for (const species of STARTERS) {
    const instanceId = `${species}-starter`;
    petsById[instanceId] = createInitialOwnedPet(species, instanceId);
    ownedPetIds.push(instanceId);
  }

  return {
    petsById,
    ownedPetIds,
    activePetId: 'munchlet-starter',  // Default
    unlockedSlots: 1,
  };
}
```

---

## Minimal UI: Active Pet Switching

### Bible Reference

**§14.5 Pet Switching UX:**
> "Switching Grundies is a deliberate action. Implementations must:
> 1. Show lock status — Clearly distinguish locked vs available pets
> 2. Auto-save first — Save current pet's state before switching
> 3. Confirm switch — Show confirmation when leaving current pet"

**§11.6 Pet Slot Rules:**
> "Switching between slotted pets is instant"

### Implementation Approach

**Location:** Settings page (existing pet selector area)

**Minimal UI Requirements:**
1. Show current active pet
2. Show all owned pets with ability to switch
3. Instant switch (no animation for P9-A)
4. Auto-save handled by Zustand persist
5. Skip confirmation for MVP (can add in P9-B)

**Component: `<PetSwitcher />`**

```tsx
function PetSwitcher() {
  const ownedPets = useOwnedPets();
  const activePetId = useActivePetId();
  const setActivePet = useSetActivePet();

  return (
    <div data-testid="pet-switcher">
      {ownedPets.map((pet) => (
        <button
          key={pet.instanceId}
          onClick={() => setActivePet(pet.instanceId)}
          className={pet.instanceId === activePetId ? 'active' : ''}
          data-testid={`pet-switch-${pet.speciesId}`}
        >
          {pet.speciesId}
        </button>
      ))}
    </div>
  );
}
```

---

## Integration Guardrails

### Inventory "Use on Pet"

Applies to **active pet only**. No changes needed — existing code references `state.pet` which will be synced with active pet.

### Shop Purchases / Inventory

Remain **GLOBAL** per Bible §11.6. No changes to shop purchase logic.

### Neglect/Mood Runtime

Remains **as-is** for P9-A. Per-pet runtime behaviors deferred to P9-B.

---

## Test Requirements

### BCT-Style Tests Required

1. **BCT-PETSLOTS-001:** Legacy save migration converts single pet to multi-pet structure
2. **BCT-PETSLOTS-002:** Legacy pet progress (level, xp, bond) preserved after migration
3. **BCT-PETSLOTS-003:** New game initializes with 3 starter pets owned
4. **BCT-PETSLOTS-004:** `activePetId` persists across save/load
5. **BCT-PETSLOTS-005:** Switching active pet updates selectors and displayed pet
6. **BCT-PETSLOTS-006:** Coins, gems, inventory remain global (not per-pet)
7. **BCT-PETSLOTS-007:** Invalid `activePetId` falls back to `ownedPetIds[0]`
8. **BCT-PETSLOTS-008:** `getOwnedPets()` returns all owned pets
9. **BCT-PETSLOTS-009:** `getActivePet()` returns correct active pet state

### Optional E2E Test

- Switch active pet via UI, confirm displayed pet changes

---

## Implementation Order

1. Add types (`OwnedPetState`, `PetInstanceId`) to `src/types/index.ts`
2. Add constants to `src/constants/bible.constants.ts`
3. Update store schema in `src/game/store.ts`
4. Implement save migration in persist middleware
5. Update `createInitialState()` for new game
6. Add selectors (`getActivePet`, `getOwnedPets`, etc.)
7. Add `setActivePet` action
8. Create `<PetSwitcher />` component
9. Add BCT tests
10. Run verification suite

---

## Assumptions / Implementation Choices

1. **Instance ID format:** `{speciesId}-{suffix}` where suffix is `starter`, `legacy`, or timestamp
2. **Persistence:** Implemented via existing Zustand persist (implementation choice pending explicit spec)
3. **Skip switch confirmation:** Not implemented in P9-A minimal (can add later)
4. **No slot purchase flow:** Slot unlocking deferred to Shop integration (P9-B)
5. **`pet` field kept:** For backward compatibility with existing selectors
