# P9 Phase 9 Audit Report

**Document:** P9_PHASE9_AUDIT_REPORT.md
**Auditor:** Claude (Web Implementer Agent)
**Date:** December 2025
**Bible Version:** v1.7
**BCT Version:** v2.3

---

## 1. Version Confirmation

| Canonical Document | Location | Version Confirmed |
|--------------------|----------|-------------------|
| GRUNDY_MASTER_BIBLE | `docs/GRUNDY_MASTER_BIBLE.md` | v1.7 (via `docs/patches/BIBLE_v1.7_PATCH.md`) |
| BIBLE_COMPLIANCE_TEST | `docs/BIBLE_COMPLIANCE_TEST.md` | v2.3 |

**Patch Verification:**
- Bible v1.7 adds: §8.2.1 (Energy Scope), §9.4.4-9.4.6 (Multi-Pet Runtime), §14.6 (Notifications)
- BCT v2.3 adds: BCT-MULTIPET-001 through BCT-MULTIPET-014

---

## 2. Deliverables Index

### Phase 9-A: Pet Slots Foundation

| File | Purpose | Bible Ref |
|------|---------|-----------|
| `src/types/index.ts` | Added `OwnedPetState`, `PetInstanceId` types | §11.6 |
| `src/constants/bible.constants.ts` | Added `PET_SLOTS_CONFIG`, `GLOBAL_RESOURCES`, `STARTER_PET_IDS` | §11.6, §6 |
| `src/game/store.ts` | Multi-pet state: `petsById`, `ownedPetIds`, `activePetId`, save migration | §11.6 |
| `src/__tests__/bct-petslots.spec.ts` | P9-A BCT tests (11 tests) | BCT v2.3 |
| `docs/P9A_PETSLOTS_FOUNDATION_PLAN.md` | Planning document | — |

### Phase 9-B: Multi-Pet Runtime Integration

| File | Purpose | Bible Ref |
|------|---------|-----------|
| `src/constants/bible.constants.ts` | Added `MULTI_PET_ENERGY`, `OFFLINE_DECAY_RATES`, `ALERT_SUPPRESSION`, `ALERT_BADGES` | §8.2.1, §9.4.6, §14.6 |
| `src/types/index.ts` | Added `AlertSuppressionState`, `OfflineReturnSummary`, `PetStatusBadge`, `AlertBadge` | §14.6 |
| `src/game/store.ts` | Runtime: `applyOfflineFanout`, `autoSwitchOnRunaway`, `getPetStatusBadges`, alert suppression | §9.4.4-9.4.6 |
| `src/__tests__/bct-multipet.spec.ts` | P9-B BCT tests (19 tests) | BCT v2.3 |
| `docs/P9B_RUNTIME_INTEGRATION_REPORT.md` | Implementation report | — |

### Phase 9-B-UI: Multi-Pet UI Wiring

| File | Purpose | Bible Ref |
|------|---------|-----------|
| `src/components/multipet/index.tsx` | UI components: badges, welcome back modal, all pets away | §14.6, §9.4.4 |
| `src/GrundyPrototype.tsx` | Integration of multi-pet UI components | §14.6 |
| `src/__tests__/bct-multipet-ui.spec.ts` | P9-B-UI BCT tests (21 tests) | BCT v2.3 |

---

## 3. Atomicity Proof: petsById vs. Shared Currencies

### Per-Pet (Isolated in `petsById[petId]`)

```typescript
// src/game/store.ts:192-211
function createOwnedPet(speciesId: string, suffix: string = 'starter'): OwnedPetState {
  const basePet = createInitialPet(speciesId);
  const instanceId: PetInstanceId = `${speciesId}-${suffix}`;
  return {
    ...basePet,
    instanceId,
    speciesId: speciesId as OwnedPetState['speciesId'],
  };
}
```

**Per-pet fields (Bible §6):**
- `level`, `xp`, `bond`, `mood`, `moodValue`, `hunger`, `evolutionStage`
- Stored in: `state.petsById[petId]`
- Neglect state: `state.neglectByPetId[petId]`

### Global (Shared at Store Root)

```typescript
// src/game/store.ts:367-374
currencies: {
  coins: STARTING_RESOURCES.COINS, // BCT-ECON-004: 100
  gems: STARTING_RESOURCES.GEMS,   // BCT-ECON-005: 0
  eventTokens: 0,
},
inventory: { ...STARTING_INVENTORY }, // BCT-ECON-006-008
energy: createInitialEnergyState(),
```

**Global fields (Bible §11.6):**
- `currencies.coins`, `currencies.gems` — shared wallet
- `inventory` — shared food inventory
- `energy` — shared energy pool (Bible §8.2.1)

**Proof via constants:**
```typescript
// src/constants/bible.constants.ts
export const GLOBAL_RESOURCES = {
  COINS_GLOBAL: true,
  GEMS_GLOBAL: true,
  INVENTORY_GLOBAL: true,
};
export const MULTI_PET_ENERGY = {
  SCOPE: 'global' as const,
  // ...
};
```

---

## 4. Runtime Isolation Proof

### Feeding/Playing Affects Active Pet Only

```typescript
// src/game/store.ts:429-609 (feed action)
feed: (foodId: string): FeedResult | null => {
  const state = get();
  // Operations on state.pet (synced with activePetId)
  // ...
  set((state) => {
    const newPet: PetState = {
      ...state.pet,
      xp: state.pet.xp + adjustedXP,
      bond: Math.min(GAME_CONFIG.maxBond, state.pet.bond + adjustedBond),
      // ...
    };
    return { pet: newPet, /* ... */ };
  });
}
```

### Sync Active Pet to Multi-Pet Store

```typescript
// src/game/store.ts:2050-2080
syncActivePetToStore: () => {
  const state = get();
  const activePetId = state.activePetId;
  const legacyPet = state.pet;
  // Sync relevant fields from legacy pet to petsById
  const updatedPet: OwnedPetState = {
    ...currentPet,
    level: legacyPet.level,
    xp: legacyPet.xp,
    bond: legacyPet.bond,
    // ...
  };
  set({ petsById: { ...state.petsById, [activePetId]: updatedPet } });
}
```

---

## 5. Offline Fanout Math Proof

### Bible §9.4.6 Rates

| Stat | Rate per 24h | Floor | Plus Bonus |
|------|--------------|-------|------------|
| Mood | -5 | 30 | None |
| Bond | -2 | 0 | -1 (50% slower) |
| Hunger | -10 | 0 | None |

### Implementation

```typescript
// src/constants/bible.constants.ts:164-174
export const OFFLINE_DECAY_RATES = {
  MOOD_PER_24H: 5,
  BOND_PER_24H: 2,
  BOND_PER_24H_PLUS: 1,
  HUNGER_PER_24H: 10,
  MOOD_FLOOR: 30,
  BOND_FLOOR: 0,
  HUNGER_FLOOR: 0,
  NEGLECT_CAP_DAYS: 14,
  WELCOME_BACK_THRESHOLD_HOURS: 24,
};
```

### Decay Calculation

```typescript
// src/game/store.ts:237-253
function calculateOfflineDecay(
  hoursOffline: number,
  hasPlusSubscription: boolean = false
): { moodDecay: number; bondDecay: number; hungerDecay: number } {
  const periods24h = Math.floor(hoursOffline / 24);
  const moodDecay = periods24h * OFFLINE_DECAY_RATES.MOOD_PER_24H;
  const bondDecayRate = hasPlusSubscription
    ? OFFLINE_DECAY_RATES.BOND_PER_24H_PLUS
    : OFFLINE_DECAY_RATES.BOND_PER_24H;
  const bondDecay = periods24h * bondDecayRate;
  const hungerDecay = periods24h * OFFLINE_DECAY_RATES.HUNGER_PER_24H;
  return { moodDecay, bondDecay, hungerDecay };
}
```

### Fanout to All Pets

```typescript
// src/game/store.ts:1874-1903
// Apply decay to ALL owned pets
for (const petId of state.ownedPetIds) {
  const pet = state.petsById[petId];
  if (!pet) continue;
  // Apply stat decay
  const updatedPet = applyOfflineDecayToPet(pet, decay);
  updatedPetsById[petId] = updatedPet;
  // ...
}
```

---

## 6. Runaway Handling Proof

### Bible §9.4.4 Requirements

1. Auto-switch to next available pet when active pet enters runaway
2. "All Pets Away" state if all pets runaway
3. Runaway pets remain in slot with 🔒 indicator
4. Player can select runaway pet for recovery UI

### Implementation

```typescript
// src/game/store.ts:284-297
function findFirstAvailablePet(
  ownedPetIds: PetInstanceId[],
  neglectByPetId: Record<string, NeglectState>
): PetInstanceId | null {
  for (const petId of ownedPetIds) {
    const neglectState = neglectByPetId[petId];
    if (!neglectState || !neglectState.isRunaway) {
      return petId;
    }
  }
  return null; // All pets are runaway
}
```

```typescript
// src/game/store.ts:1954-1979
autoSwitchOnRunaway: () => {
  const state = get();
  const newPetId = findFirstAvailablePet(state.ownedPetIds, state.neglectByPetId);
  const allPetsAway = newPetId === null;

  if (allPetsAway) {
    set({ allPetsAway: true });
    return { newPetId: null, allPetsAway: true };
  }

  if (newPetId && newPetId !== state.activePetId) {
    set({
      activePetId: newPetId,
      pet: newPet ? { ...newPet, id: newPet.speciesId } : state.pet,
      allPetsAway: false,
    });
  }
  return { newPetId, allPetsAway: false };
}
```

### Slot Order: Acquisition Order

```
// Pets checked in ownedPetIds array order (insertion order)
for (const petId of ownedPetIds) { ... }
```

---

## 7. Alerts Routing & Suppression Proof

### Bible §14.6.1-14.6.2 Requirements

| Rule | Value |
|------|-------|
| Cooldown per pet | 30 minutes |
| Session limit | 5 non-critical alerts |
| Runaway override | Always fires immediately |
| Badge semantics | ⚠️ Warning, 💔 Urgent, 🔒 Locked |

### Implementation

```typescript
// src/constants/bible.constants.ts:178-183
export const ALERT_SUPPRESSION = {
  COOLDOWN_MINUTES: 30,
  SESSION_LIMIT: 5,
  RUNAWAY_BYPASSES: true,
};

export const ALERT_BADGES = {
  WARNING: '⚠️',
  URGENT: '💔',
  LOCKED: '🔒',
};
```

```typescript
// src/game/store.ts:332-356
function canShowAlert(
  petId: PetInstanceId,
  isRunaway: boolean,
  suppression: AlertSuppressionState,
  now: number = Date.now()
): boolean {
  // Runaway always bypasses suppression
  if (isRunaway) return true;
  // Check session limit
  if (suppression.sessionAlertCount >= ALERT_SUPPRESSION.SESSION_LIMIT) return false;
  // Check per-pet cooldown
  const lastAlert = suppression.lastAlertByPet[petId] ?? 0;
  const cooldownMs = ALERT_SUPPRESSION.COOLDOWN_MINUTES * 60 * 1000;
  if (now - lastAlert < cooldownMs) return false;
  return true;
}
```

---

## 8. UI Wiring Proof

### Test IDs Implemented

| Test ID | Component | File |
|---------|-----------|------|
| `pet-badge-count` | `AggregatedBadgeCount` | `src/components/multipet/index.tsx:69` |
| `pet-status-{petId}` | `PetStatusRow` | `src/components/multipet/index.tsx:105` |
| `welcome-back-modal` | `WelcomeBackModal` | `src/components/multipet/index.tsx:181` |
| `welcome-back-dismiss` | `WelcomeBackModal` button | `src/components/multipet/index.tsx:269` |
| `all-pets-away-screen` | `AllPetsAwayScreen` | `src/components/multipet/index.tsx:300` |
| `runaway-recovery-{petId}` | `AllPetsAwayScreen` buttons | `src/components/multipet/index.tsx:342` |
| `multipet-dev-diagnostics` | `MultiPetDevDiagnostics` (DEV only) | `src/components/multipet/index.tsx:543` |

### GrundyPrototype.tsx Integration

```tsx
// src/GrundyPrototype.tsx - Imports
import {
  AggregatedBadgeCount,
  PetStatusRow,
  AllPetsAwayScreen,
  WelcomeBackModal,
  AutoSwitchToast,
  MultiPetDevDiagnostics,
  useMultiPetUI,
} from './components/multipet';

// useMultiPetUI hook usage
const {
  welcomeBackSummary,
  showWelcomeBack,
  autoSwitchInfo,
  showAutoSwitchToast,
  dismissWelcomeBack,
  dismissAutoSwitchToast,
} = useMultiPetUI();

// AggregatedBadgeCount on Switch Pet button
<button>
  🐾 Switch Pet
  <AggregatedBadgeCount />
</button>

// AllPetsAwayScreen conditional rendering
{allPetsAway && <AllPetsAwayScreen onSelectPet={handleSelectPet} />}

// WelcomeBackModal at app level
{showWelcomeBack && welcomeBackSummary && (
  <WelcomeBackModal summary={welcomeBackSummary} onDismiss={dismissWelcomeBack} />
)}
```

---

## 9. Test Coverage Mapping

### BCT-PETSLOTS Tests (P9-A)

| BCT ID | Description | Test File | Status |
|--------|-------------|-----------|--------|
| BCT-PETSLOTS-001 | Max slots is 4 | `bct-petslots.spec.ts:23` | ✅ PASS |
| BCT-PETSLOTS-002 | Free player slots is 1 | `bct-petslots.spec.ts:27` | ✅ PASS |
| BCT-PETSLOTS-003 | Plus subscriber slots is 2 | `bct-petslots.spec.ts:31` | ✅ PASS |
| BCT-PETSLOTS-004 | Coins are global | `bct-petslots.spec.ts:37` | ✅ PASS |
| BCT-PETSLOTS-005 | Gems are global | `bct-petslots.spec.ts:41` | ✅ PASS |
| BCT-PETSLOTS-006 | Inventory is global | `bct-petslots.spec.ts:45` | ✅ PASS |
| BCT-PETSLOTS-007 | Each pet has separate level | `bct-petslots.spec.ts:75` | ✅ PASS |
| BCT-PETSLOTS-008 | Each pet has separate bond | `bct-petslots.spec.ts:75` | ✅ PASS |
| BCT-PETSLOTS-009 | Each pet has separate mood | `bct-petslots.spec.ts:75` | ✅ PASS |
| BCT-PETSLOTS-010 | Each pet has separate hunger | `bct-petslots.spec.ts:75` | ✅ PASS |
| BCT-PETSLOTS-011 | Switching pets is instant | `bct-petslots.spec.ts:153` | ✅ PASS |

### BCT-MULTIPET Tests (P9-B)

| BCT ID | Description | Test File | Status |
|--------|-------------|-----------|--------|
| BCT-MULTIPET-001 | Energy is global | `bct-multipet.spec.ts:38` | ✅ PASS |
| BCT-MULTIPET-002 | First-free daily is global | `bct-multipet.spec.ts:59` | ✅ PASS |
| BCT-MULTIPET-003 | Daily cap is global | `bct-multipet.spec.ts:70` | ✅ PASS |
| BCT-MULTIPET-004 | Runaway triggers auto-switch | `bct-multipet.spec.ts:88` | ✅ PASS |
| BCT-MULTIPET-005 | All-pets-runaway shows empty state | `bct-multipet.spec.ts:126` | ✅ PASS |
| BCT-MULTIPET-006 | Runaway pets remain in slot | `bct-multipet.spec.ts:165` | ✅ PASS |
| BCT-MULTIPET-007 | Runaway pets selectable for recovery | `bct-multipet.spec.ts:199` | ✅ PASS |
| BCT-MULTIPET-008 | Switching TO withdrawn allowed | `bct-multipet.spec.ts:238` | ✅ PASS |
| BCT-MULTIPET-009 | Offline mood decays all pets | `bct-multipet.spec.ts:298` | ✅ PASS |
| BCT-MULTIPET-010 | Offline bond decays all pets | `bct-multipet.spec.ts:349` | ✅ PASS |
| BCT-MULTIPET-011 | Offline neglect accrues all pets | `bct-multipet.spec.ts:390` | ✅ PASS |
| BCT-MULTIPET-012 | Alerts fire once per transition | `bct-multipet.spec.ts:406` | ✅ PASS |
| BCT-MULTIPET-013 | Alert cooldown 30 min per pet | `bct-multipet.spec.ts:422` | ✅ PASS |
| BCT-MULTIPET-014 | Offline return batches alerts | `bct-multipet.spec.ts:440` | ✅ PASS |

### BCT-MULTIPET-UI Tests (P9-B-UI)

| BCT ID | Description | Test File | Status |
|--------|-------------|-----------|--------|
| BCT-MULTIPET-UI-001 | Badge count 0 when no attention | `bct-multipet-ui.spec.ts:31` | ✅ PASS |
| BCT-MULTIPET-UI-002 | Badge count for warning pets | `bct-multipet-ui.spec.ts:39` | ✅ PASS |
| BCT-MULTIPET-UI-003 | Badge count for urgent pets | `bct-multipet-ui.spec.ts:61` | ✅ PASS |
| BCT-MULTIPET-UI-004 | Badge count includes runaway | `bct-multipet-ui.spec.ts:93` | ✅ PASS |
| BCT-MULTIPET-UI-005 | Badge not suppressed by cooldown | `bct-multipet-ui.spec.ts:116` | ✅ PASS |
| BCT-MULTIPET-UI-006 | Badges for all owned pets | `bct-multipet-ui.spec.ts:151` | ✅ PASS |
| BCT-MULTIPET-UI-007 | Warning badge for worried/sad | `bct-multipet-ui.spec.ts:165` | ✅ PASS |
| BCT-MULTIPET-UI-008 | Urgent badge for withdrawn/critical | `bct-multipet-ui.spec.ts:188` | ✅ PASS |
| BCT-MULTIPET-UI-009 | Locked badge for runaway | `bct-multipet-ui.spec.ts:212` | ✅ PASS |
| BCT-MULTIPET-UI-010 | No badge for normal pets | `bct-multipet-ui.spec.ts:236` | ✅ PASS |
| BCT-MULTIPET-UI-011 | Welcome back threshold 24h | `bct-multipet-ui.spec.ts:255` | ✅ PASS |
| BCT-MULTIPET-UI-012 | Summary includes hours offline | `bct-multipet-ui.spec.ts:259` | ✅ PASS |
| BCT-MULTIPET-UI-013 | Summary includes per-pet changes | `bct-multipet-ui.spec.ts:280` | ✅ PASS |
| BCT-MULTIPET-UI-014 | No summary if < 1h offline | `bct-multipet-ui.spec.ts:306` | ✅ PASS |
| BCT-MULTIPET-UI-015 | allPetsAway flag set correctly | `bct-multipet-ui.spec.ts:334` | ✅ PASS |
| BCT-MULTIPET-UI-016 | allPetsAway false when one available | `bct-multipet-ui.spec.ts:361` | ✅ PASS |
| BCT-MULTIPET-UI-017 | Each runaway has recovery entry | `bct-multipet-ui.spec.ts:385` | ✅ PASS |
| BCT-MULTIPET-UI-018 | Auto-switch occurred in summary | `bct-multipet-ui.spec.ts:426` | ✅ PASS |
| BCT-MULTIPET-UI-019 | New active pet ID after switch | `bct-multipet-ui.spec.ts:457` | ✅ PASS |
| BCT-MULTIPET-UI-020 | ALERT_BADGES match Bible | `bct-multipet-ui.spec.ts:491` | ✅ PASS |
| BCT-MULTIPET-UI-021 | WELCOME_BACK_THRESHOLD is 24h | `bct-multipet-ui.spec.ts:497` | ✅ PASS |

---

## 10. Grep Sanity Checks

### Check 1: Per-Pet Store Structure

```bash
grep -E "petsById\[|ownedPetIds|activePetId" src/game/store.ts | head -10
```

**Result:** ✅ 30+ occurrences found

### Check 2: Energy is Global

```bash
grep -E "energy.*global|ENERGY.*GLOBAL|SCOPE.*global" src/constants/bible.constants.ts
```

**Result:** ✅ `SCOPE: 'global' as const,`

### Check 3: Offline Decay Rates

```bash
grep -E "OFFLINE_DECAY|MOOD_PER_24H|BOND_PER_24H" src/constants/bible.constants.ts
```

**Result:**
```
export const OFFLINE_DECAY_RATES = {
  MOOD_PER_24H: 5,
  BOND_PER_24H: 2,
  BOND_PER_24H_PLUS: 1,
```

### Check 4: Alert Suppression

```bash
grep -E "ALERT_SUPPRESSION|COOLDOWN_MINUTES|SESSION_LIMIT" src/constants/bible.constants.ts
```

**Result:**
```
export const ALERT_SUPPRESSION = {
  COOLDOWN_MINUTES: 30,
  SESSION_LIMIT: 5,
```

### Check 5: Alert Badges

```bash
grep "ALERT_BADGES" src/constants/bible.constants.ts -A 5
```

**Result:**
```
export const ALERT_BADGES = {
  /** Warning badge for Worried/Sad state */
  WARNING: '⚠️',
  /** Urgent badge for Withdrawn/Critical state */
  URGENT: '💔',
  /** Locked badge for Runaway state */
  LOCKED: '🔒',
```

### Check 6: Test Count Verification

```bash
grep -c "BCT-PETSLOTS" src/__tests__/bct-petslots.spec.ts       # 13
grep -c "BCT-MULTIPET" src/__tests__/bct-multipet.spec.ts       # 22
grep -c "BCT-MULTIPET-UI" src/__tests__/bct-multipet-ui.spec.ts # 23
```

---

## Verification Results

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ PASS (0 errors) |
| `npm test -- --run` | ✅ PASS (1507 tests) |
| `npm run test:bible` | ✅ PASS (851 tests) |
| `npm run build` | ✅ PASS |

---

## Summary

Phase 9 implementation is **COMPLETE** and **BIBLE-COMPLIANT**:

| Phase | Status | Tests |
|-------|--------|-------|
| P9-A: Pet Slots Foundation | ✅ Complete | 11 BCT tests |
| P9-B: Multi-Pet Runtime | ✅ Complete | 14 BCT tests + 5 integration |
| P9-B-UI: UI Wiring | ✅ Complete | 21 BCT tests |
| P9-C: Weight/Sickness | ⏳ Deferred | Per Bible §9.4.7 |

**Total Phase 9 Tests:** 51 BCT tests, all passing

---

*Report generated: December 2025*
*Bible: v1.7 | BCT: v2.3 | Phase: P9*
