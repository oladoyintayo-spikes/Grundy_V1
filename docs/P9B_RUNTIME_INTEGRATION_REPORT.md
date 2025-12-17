# P9-B: Multi-Pet Runtime Integration Report

> ⚠️ **Historical Document** — This document is a historical record from Phase 9.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

**Phase:** P9-B Multi-Pet Runtime
**Bible Version:** v1.7
**BCT Version:** v2.3
**Date:** December 2025

---

## Bible v1.7 + BCT v2.3 Confirmation

All implementations strictly follow:
- Bible §8.2.1: Energy Scope (Multi-Pet)
- Bible §9.4.4: Multi-Pet Runaway Handling
- Bible §9.4.5: Switching During Neglect States
- Bible §9.4.6: Multi-Pet Offline Rules
- Bible §11.6.1: Multi-Pet Notifications

BCT Tests: `BCT-MULTIPET-001` through `BCT-MULTIPET-014` all passing.

---

## Crosswalk Table

| System | Scope | Storage Location | Offline Rules | Alerts | Tests |
|--------|-------|------------------|---------------|--------|-------|
| **Mood** | Per-pet | `petsById[id].moodValue` | -5/24h, floor 30 | Badge on critical | BCT-MULTIPET-009 |
| **Bond** | Per-pet | `petsById[id].bond` | -2/24h, floor 0 (Plus: -1/24h) | — | BCT-MULTIPET-010 |
| **Hunger** | Per-pet | `petsById[id].hunger` | -10/24h, floor 0 | Badge on critical | BCT-MULTIPET-009 |
| **Neglect** | Per-pet | `neglectByPetId[id]` | +1/day, cap 14 | Per-stage alerts | BCT-MULTIPET-011 |
| **Energy** | **Global** | `energy` (root) | Regenerates (1/30min) | — | BCT-MULTIPET-001-003 |
| **Coins** | Global | `currencies.coins` | No change | — | P9-A tests |
| **Gems** | Global | `currencies.gems` | No change | — | P9-A tests |
| **Inventory** | Global | `inventory` | No change | — | P9-A tests |

---

## Implementation Details

### A) Per-Pet Runtime Isolation

**Files Modified:**
- `src/game/store.ts` - Added `applyOfflineDecayToPet()`, `syncActivePetToStore()`
- `src/types/index.ts` - Added `AlertSuppressionState`, `OfflineReturnSummary`, `PetStatusBadge`

**Behavior:**
- Each pet in `petsById` maintains independent: `moodValue`, `bond`, `hunger`, `evolutionStage`
- Neglect state tracked per-pet in `neglectByPetId`
- Active pet changes sync to legacy `pet` field for backward compatibility

### B) Global Energy Under Multi-Pet

**Files Modified:**
- `src/constants/bible.constants.ts` - Added `MULTI_PET_ENERGY` constant

**Behavior:**
- Energy stored at store root (not in `petsById`)
- `dailyMiniGames` tracking is global (one free play total, 3 daily cap total)
- No per-pet energy or daily tracking

### C) Offline Fanout Across Pets

**Files Modified:**
- `src/constants/bible.constants.ts` - Added `OFFLINE_DECAY_RATES` constant
- `src/game/store.ts` - Added `calculateOfflineDecay()`, `applyOfflineFanout()` action

**Behavior:**
- On return from offline, decay applied to ALL owned pets simultaneously
- Rates per 24h:
  - Mood: -5 (floor 30)
  - Bond: -2 (floor 0); Plus: -1
  - Hunger: -10 (floor 0)
- Neglect: +1/day (cap 14) — handled by existing `updateNeglectOnLogin()`
- FTUE protection: No decay until FTUE complete
- Cozy mode: No decay (neglect disabled)

### D) Switching Constraints During Neglect States

**Files Modified:**
- `src/game/store.ts` - Updated `setActivePet()` action

**Behavior:**
- **Worried/Sad**: Switch allowed, badge shown
- **Withdrawn/Critical**: Switch allowed with warning toast
- **Runaway**: Can select for recovery UI viewing, cannot interact

**Return Value:** `{ success: boolean; warning?: string }`

### E) Runaway Handling (Auto-Switch)

**Files Modified:**
- `src/game/store.ts` - Added `findFirstAvailablePet()`, `autoSwitchOnRunaway()` action

**Behavior:**
1. When active pet enters runaway → auto-switch to first non-runaway in `ownedPetIds` order
2. If all pets runaway → set `allPetsAway: true` ("All Pets Away" state)
3. Runaway pets remain in slot with 🔒 indicator
4. Player can select runaway pet to view recovery options

**Slot Order:** `ownedPetIds` array (acquisition order)

### F) Notifications / Alert Routing & Suppression

**Files Modified:**
- `src/constants/bible.constants.ts` - Added `ALERT_SUPPRESSION`, `ALERT_BADGES`
- `src/types/index.ts` - Added `AlertType`, `AlertSeverity`, `PetAlert`, `AlertSuppressionState`
- `src/game/store.ts` - Added `alertSuppression` state, `getPetStatusBadges()`, `recordAlertShown()`, `canShowAlertForPet()`

**Behavior:**
- **Badge System:**
  - ⚠️ Warning (Worried/Sad)
  - 💔 Urgent (Withdrawn/Critical)
  - 🔒 Locked (Runaway)
- **Suppression Rules:**
  - Cooldown: 30 minutes per pet
  - Session limit: 5 non-critical alerts
  - Runaway bypasses suppression
- **Batching:** Offline return generates `OfflineReturnSummary` for "Welcome Back" UI

---

## Proof Notes

### Runaway Auto-Switch

```typescript
// BCT-MULTIPET-004: Verified in bct-multipet.spec.ts
// When active pet becomes runaway, autoSwitchOnRunaway() is called
// Result: { newPetId: PetInstanceId | null, allPetsAway: boolean }

// Implementation in store.ts:
autoSwitchOnRunaway: () => {
  const newPetId = findFirstAvailablePet(ownedPetIds, neglectByPetId);
  if (newPetId && newPetId !== activePetId) {
    set({ activePetId: newPetId, ... });
  }
  return { newPetId, allPetsAway: newPetId === null };
}
```

### All-Away State Behavior

```typescript
// BCT-MULTIPET-005: Verified in bct-multipet.spec.ts
// When all pets are runaway:
// - allPetsAway = true
// - No mini-games or feeding available
// - Recovery prompts shown for each pet
```

### Suppression Cooldown & Daily Caps

```typescript
// BCT-MULTIPET-012, 013: Verified in bct-multipet.spec.ts
const ALERT_SUPPRESSION = {
  COOLDOWN_MINUTES: 30,      // Per-pet cooldown
  SESSION_LIMIT: 5,          // Non-critical alerts per session
  RUNAWAY_BYPASSES: true,    // Critical path always fires
};
```

### Offline Fanout Math

```typescript
// BCT-MULTIPET-009, 010, 011: Verified in bct-multipet.spec.ts
function calculateOfflineDecay(hoursOffline, hasPlusSubscription) {
  const periods24h = Math.floor(hoursOffline / 24);
  return {
    moodDecay: periods24h * 5,           // -5/24h
    bondDecay: periods24h * (hasPlusSubscription ? 1 : 2),  // -2/24h (Plus: -1)
    hungerDecay: periods24h * 10,        // -10/24h
  };
}

// Floors enforced in applyOfflineDecayToPet():
// - moodValue: floor 30
// - bond: floor 0
// - hunger: floor 0
```

---

## Verification Results

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ PASS |
| `npm test -- --run` | ✅ PASS (1467+ tests) |
| `npm run test:bible` | ✅ PASS |
| `npm run build` | ✅ PASS |

---

## Files Changed

| File | Description |
|------|-------------|
| `src/constants/bible.constants.ts` | Added `MULTI_PET_ENERGY`, `OFFLINE_DECAY_RATES`, `ALERT_SUPPRESSION`, `ALERT_BADGES` |
| `src/types/index.ts` | Added P9-B types: `AlertSeverity`, `AlertType`, `AlertBadge`, `PetAlert`, `AlertSuppressionState`, `PetStatusBadge`, `OfflineReturnSummary` |
| `src/game/store.ts` | Added P9-B helpers and actions: `calculateOfflineDecay()`, `applyOfflineDecayToPet()`, `findFirstAvailablePet()`, `getPetDisplayName()`, `getAlertBadgeForPet()`, `canShowAlert()`, `applyOfflineFanout()`, `autoSwitchOnRunaway()`, `getPetStatusBadges()`, `getAggregatedBadgeCount()`, `recordAlertShown()`, `canShowAlertForPet()`, `syncActivePetToStore()`, `updateLastSeen()` |
| `src/__tests__/bct-multipet.spec.ts` | Created 19 BCT-MULTIPET tests |

---

## BCT Test Summary

| Test ID | Description | Status |
|---------|-------------|--------|
| BCT-MULTIPET-001 | Energy is global (shared pool) | ✅ PASS |
| BCT-MULTIPET-002 | First-free daily game is global | ✅ PASS |
| BCT-MULTIPET-003 | Daily cap (3 plays) is global | ✅ PASS |
| BCT-MULTIPET-004 | Runaway triggers auto-switch | ✅ PASS |
| BCT-MULTIPET-005 | All-pets-runaway shows empty state | ✅ PASS |
| BCT-MULTIPET-006 | Runaway pets remain in slot | ✅ PASS |
| BCT-MULTIPET-007 | Runaway pets selectable for recovery | ✅ PASS |
| BCT-MULTIPET-008 | Switching TO withdrawn/critical allowed | ✅ PASS |
| BCT-MULTIPET-009 | Offline mood decays for all pets | ✅ PASS |
| BCT-MULTIPET-010 | Offline bond decays for all pets | ✅ PASS |
| BCT-MULTIPET-011 | Offline neglect accrues for all pets | ✅ PASS |
| BCT-MULTIPET-012 | Neglect alerts fire once per transition | ✅ PASS |
| BCT-MULTIPET-013 | Alert cooldown is 30 minutes per pet | ✅ PASS |
| BCT-MULTIPET-014 | Offline return batches alerts | ✅ PASS |

**Total:** 19 tests, 19 passing

---

## Notes

- **Deferred:** Weight & Sickness runtime (P9-C per Bible §9.4.7)
- **Web-only:** No push notifications implemented (Web lacks reliable push infra per Bible §11.6.1)
- **Plus subscription:** Bond decay rate bonus implemented but Plus detection TBD

---

*Report generated: December 2025*
*Bible: v1.7 | BCT: v2.3 | Phase: P9-B*
