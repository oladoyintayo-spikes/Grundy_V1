# Phase 9 CE/QA Closeout Pack

> ⚠️ **Historical Document** — This document is a historical record from Phase 9.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

**Document:** CEQA_PHASE9_CLOSEOUT_PACK.md
**Date:** December 12, 2025
**Bible Version:** v1.7
**BCT Version:** v2.3

---

## What Shipped in Phase 9

### P9-A: Pet Slots Foundation ✅

| Deliverable | Description | Bible |
|-------------|-------------|-------|
| Multi-pet data model | `petsById`, `ownedPetIds`, `activePetId` | §11.6 |
| Save migration v1→v2 | Single-pet to multi-pet state migration | §15.3 |
| New-game initialization | 3 starters owned, 1 slot unlocked | §6 |
| Pet switching UI | Settings view pet selector | §11.6 |
| BCT tests | 11 BCT-PETSLOTS tests | BCT v2.3 |

### P9-B: Multi-Pet Runtime ✅

| Deliverable | Description | Bible |
|-------------|-------------|-------|
| Global energy scope | Energy shared across all pets | §8.2.1 |
| Runaway auto-switch | Auto-switch to next available pet | §9.4.4 |
| Switching constraints | Allow switching to/from neglected pets | §9.4.5 |
| Offline multi-pet rules | Decay/neglect applies to all pets | §9.4.6 |
| Alert routing & suppression | Per-pet alerts, batching, 30-min cooldown | §14.6 |
| BCT tests | 14 BCT-MULTIPET tests + 5 integration | BCT v2.3 |

### P9-B-UI: Multi-Pet UI Wiring ✅

| Deliverable | Description | Bible |
|-------------|-------------|-------|
| Multi-pet badges | Status badges for all owned pets | §14.6 |
| Welcome back modal | Summary of offline events per pet | §9.4.6 |
| All Pets Away screen | Recovery UI when all pets runaway | §9.4.4 |
| Auto-switch toast | Notification when auto-switch occurs | §9.4.4 |
| BCT tests | 21 BCT-MULTIPET-UI tests | BCT v2.3 |

### P9-C: Weight & Sickness — DEFERRED

| Item | Status | Bible Reference |
|------|--------|-----------------|
| Weight runtime | ⬜ Deferred | §5.7, §9.4.7 |
| Sickness runtime | ⬜ Deferred | §5.4, §9.4.7 |

---

## Pointers to Key Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| **Audit Report** | [`docs/P9_PHASE9_AUDIT_REPORT.md`](P9_PHASE9_AUDIT_REPORT.md) | Full Phase 9 audit with code proofs |
| **Runtime Integration Report** | [`docs/P9B_RUNTIME_INTEGRATION_REPORT.md`](P9B_RUNTIME_INTEGRATION_REPORT.md) | P9-B implementation details |
| **Spec Gaps Analysis** | [`docs/P9B_SPEC_GAPS.md`](P9B_SPEC_GAPS.md) | Runtime clarification analysis |
| **Bible v1.7 Patch** | [`docs/patches/BIBLE_v1.7_PATCH.md`](patches/BIBLE_v1.7_PATCH.md) | Multi-pet runtime clarifications |
| **Signoff Notes** | [`docs/CEQA_PHASE9_SIGNOFF_NOTES.md`](CEQA_PHASE9_SIGNOFF_NOTES.md) | CE review checklist |

---

## How to Verify

### Build & Type Check

```bash
# TypeScript type check (expected: 0 errors)
npx tsc --noEmit

# Production build (expected: "built in ~3s")
npm run build
```

### Test Suite

```bash
# Full test suite (expected: 1507 tests passing)
npm test -- --run

# BCT-only tests (expected: 851 tests passing)
npm run test:bible
```

### Expected Outcomes

| Command | Expected |
|---------|----------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ Built successfully |
| `npm test -- --run` | ✅ ~1547 tests passing |
| `npm run test:bible` | ✅ ~891 BCT tests passing |

> **Note:** Test counts updated after P9-C Slot Unlock post-CE patch (+40 tests). Previous baseline: 1507 unit / 851 BCT.

### Phase 9 Specific Tests

```bash
# P9-A tests (11 tests)
npm test -- --run src/__tests__/bct-petslots.spec.ts

# P9-B tests (19 tests)
npm test -- --run src/__tests__/bct-multipet.spec.ts

# P9-B-UI tests (21 tests)
npm test -- --run src/__tests__/bct-multipet-ui.spec.ts

# P9-C Slot Unlock tests (40 tests) — Post-CE patch
npm test -- --run src/__tests__/bct-slot-unlock.spec.ts
```

---

## Known Deferrals / Not In Scope

### Deferred to Future Phases

| Item | Reason | Bible Reference |
|------|--------|-----------------|
| **P9-C (Weight/Sickness)** | Deferred per design decision | §9.4.7 |
| **P9-SLOTS-02..06** | Slot purchase/UI deferred to post-CE | §11.6 |

### Not In Scope for Web Prototype

| Item | Reason |
|------|--------|
| Push notification infrastructure | No FCM/APNs in web prototype |
| Plus subscription detection | No IAP in web prototype — `hasPlusSubscription` defaults to false |
| Slot purchase gems flow | Deferred — P9-SLOTS-02 |

### Pending Items (Post-CE)

| ID | Task | Status |
|----|------|--------|
| P9-SLOTS-02 | Implement slot purchase (100/150/200 gems) | ✅ Done (`930be64`) |
| P9-SLOTS-03 | Update pet selector (assign/swap slots) | ⬜ Pending |
| P9-SLOTS-04 | Implement parallel decay (all slotted pets) | ⬜ Pending |
| P9-SLOTS-05 | Update notifications (any pet can trigger) | ⬜ Pending |
| P9-SLOTS-06 | Add slot UI (active indicator, quick-switch) | ✅ Done (`930be64`) |

### Post-CE Patch: P9-C Slot Unlock

> **Commits:** Implementation `930be64` · Delta Audit `207facc`
>
> **Delta Addendum:** [`docs/P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md`](P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md)
>
> **Deferral:** Plus subscription discount logic present but Plus detection not implemented on Web (`hasPlusSubscription=false`).

---

## Phase 9 Test Summary

| Test Suite | Tests | Status |
|------------|-------|--------|
| BCT-PETSLOTS (P9-A) | 11 | ✅ All passing |
| BCT-MULTIPET (P9-B) | 14 + 5 | ✅ All passing |
| BCT-MULTIPET-UI (P9-B-UI) | 21 | ✅ All passing |
| BCT-SLOT-UNLOCK (P9-C post-CE) | 40 | ✅ All passing |
| **Total Phase 9 BCT** | **91** | ✅ All passing |

---

## Files Modified in Phase 9

### Core Implementation

| File | Changes |
|------|---------|
| `src/types/index.ts` | Added `OwnedPetState`, `PetInstanceId`, `AlertSuppressionState`, `OfflineReturnSummary`, `PetStatusBadge`, `AlertBadge` |
| `src/constants/bible.constants.ts` | Added `PET_SLOTS_CONFIG`, `GLOBAL_RESOURCES`, `MULTI_PET_ENERGY`, `OFFLINE_DECAY_RATES`, `ALERT_SUPPRESSION`, `ALERT_BADGES` |
| `src/game/store.ts` | Multi-pet state, `petsById`, save migration, `applyOfflineFanout`, `autoSwitchOnRunaway`, `getPetStatusBadges` |
| `src/components/multipet/index.tsx` | UI components: badges, modals, all pets away screen |
| `src/GrundyPrototype.tsx` | Multi-pet UI integration |

### Test Files

| File | Tests |
|------|-------|
| `src/__tests__/bct-petslots.spec.ts` | 11 BCT-PETSLOTS tests |
| `src/__tests__/bct-multipet.spec.ts` | 19 BCT-MULTIPET tests |
| `src/__tests__/bct-multipet-ui.spec.ts` | 21 BCT-MULTIPET-UI tests |

### Documentation

| File | Purpose |
|------|---------|
| `docs/P9_PHASE9_AUDIT_REPORT.md` | Full audit report |
| `docs/P9B_RUNTIME_INTEGRATION_REPORT.md` | Runtime implementation report |
| `docs/P9B_SPEC_GAPS.md` | Spec gap analysis |
| `docs/patches/BIBLE_v1.7_PATCH.md` | Bible v1.7 patch notes |

---

*Generated: December 12, 2025*
*Bible: v1.7 | BCT: v2.3 | Phase: P9*
