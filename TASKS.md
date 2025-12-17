# TASKS.md

**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current

## Grundy Development Task List

**Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md` v1.11
**Pre-Flight Report:** December 9, 2024 ✅

---

## Web Edition Phase Structure

| Web Phase | Theme | Status |
|-----------|-------|--------|
| Web Phase 0 | Setup & Toolchain | ✅ COMPLETE |
| Web Phase 1 | Core Loop & Data | ✅ COMPLETE |
| Web Phase 2 | Mini-Games & Infra | ✅ COMPLETE |
| Web Phase 3 | Navigation & Environment | 🟡 IN PROGRESS |
| Web Phase 4 | FTUE / Onboarding | ✅ COMPLETE |
| Web Phase 5 | Polish / Web 1.0 | ✅ COMPLETE |
| Web Phase 6 | Bible v1.4 Compliance | ✅ TIER 1 COMPLETE |
| Web Phase 7 | Classic Mode | ✅ CE/QA APPROVED |
| Web Phase 8 | Shop + Inventory | ✅ CE/QA APPROVED |
| Web Phase 9 | Pet Slots / Multi-Pet | ✅ CE/QA APPROVED |
| Web Phase 10 | Weight & Sickness | ✅ COMPLETE |
| Web Phase 11 | Cosmetics System | ✅ COMPLETE |

---

## How To Use This File

1. **Find next task** — Look for first `⬜ TODO` in your assigned phase
2. **Read Bible section** — Understand the spec before coding
3. **Implement** — Follow patterns in `ORCHESTRATOR.md`
4. **Test** — All tests must pass
5. **Update status** — Change `⬜ TODO` to `✅ DONE`
6. **Commit** — Use conventional commit format with task ID
7. **Repeat** — Move to next task

### Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | TODO — Not started |
| 🔄 | IN PROGRESS — Being worked on |
| ✅ | DONE — Complete and tested |
| ⏸️ | BLOCKED — Waiting on dependency |
| ❌ | CANCELLED — No longer needed |

---

## PRE-FLIGHT REPORT SUMMARY

> Completed: December 9, 2024

### Critical Blockers Identified

| Issue | Severity | Impact |
|-------|----------|--------|
| No `vite.config.ts` | 🔴 CRITICAL | `npm run dev/build` fails |
| No `src/main.tsx` | 🔴 CRITICAL | App can't mount to DOM |
| No `src/App.tsx` | 🔴 CRITICAL | No app shell |
| No `tailwind.config.js` | 🔴 CRITICAL | Tailwind classes ignored |
| No `postcss.config.js` | 🔴 CRITICAL | CSS processing broken |
| Type errors in `systems.ts` | 🔴 CRITICAL | TypeScript compile fails |
| No `public/` folder | 🔴 CRITICAL | PWA won't work |

### Data Misalignments

| Issue | Code | Bible | Resolution |
|-------|------|-------|------------|
| Pet count | 3 pets | 8 pets | Add missing 5 in Phase 1 |
| Pet names | sprout, ripple | munchlet, fizz | Fix in Phase 1 |
| Food count | 8 foods | 10 foods | Add Dream Treat, Golden Feast |
| Currency types | bites/shinies | coins/gems | Standardize to coins/gems |
| Evolution levels | youth=10, adult=25 | youth=7, evolved=13 | Use Bible values |

### Decisions Made

1. **Pet name migration:** Fix in Phase 1 (prototype is throwaway)
2. **Store architecture:** Keep prototype isolated; Zustand for production
3. **Starting inventory:** Bible wins → 100 coins, 0 gems
4. **Evolution levels:** Bible wins → youth=7, evolved=13
5. **Test infrastructure:** P0-2 creates scaffold, not "verify existing"

---

## GAP ANALYSIS: Code vs Bible

> Last analyzed: December 10, 2024 (Phase 1 Planning)

### System Status Overview

| System | Bible Section | Status | Gap Summary |
|--------|---------------|--------|-------------|
| **Toolchain** | — | 🟢 ALIGNED | Phase 0 complete: build, tests, PWA, deploy, error boundary |
| **FTUE / Onboarding** | 7 | 🔴 MISSING | No FTUE components exist |
| **Core Loop (Feeding)** | 4, 5 | 🟡 PARTIAL | Basic feeding in GrundyPrototype.tsx only |
| **Lore Journal** | 6.4 | 🔴 MISSING | Not implemented |
| **Mini-Games** | 8 | 🔴 MISSING | No SnackCatch or hub exists |
| **Shop & Economy** | 11 | 🟡 PARTIAL | Basic shop in prototype |
| **Pet Slots** | 11.6 | 🔴 MISSING | Not implemented |
| **Cozy vs Classic** | 9 | 🔴 MISSING | No mode system exists |
| **Art / Sprite States** | 13.6 | 🟡 PARTIAL | 120 sprites exist, no state logic |
| **Sound & Vibration** | 12 | 🔴 MISSING | Not implemented |
| **Pet Abilities** | 3.7 | 🔴 MISSING | Not implemented → P1-ABILITY |
| **Progression** | 6 | 🟡 NEEDS AUDIT | XP formula present, evolution levels conflict |
| **PWA / Deploy** | 15 | 🟢 ALIGNED | P0-4,5 complete: manifest, GH Pages |
| **Pet Data** | 3 | 🟠 MISALIGNED | Only 3 pets (need 8) → P1-DATA-1 |
| **Food Data** | 5 | 🟠 MISALIGNED | Only 8 foods (need 10) → P1-DATA-3,4 |
| **Currency Types** | 11 | 🟢 ALIGNED | Fixed in P0 (coins/gems) |

### Gap Legend

| Status | Meaning |
|--------|---------|
| 🟢 ALIGNED | Code matches Bible spec |
| 🟡 PARTIAL | Some features implemented, gaps remain |
| 🔴 MISSING | Not implemented at all |
| 🟠 MISALIGNED | Implemented but conflicts with Bible |

---

## WEB PHASE 0: Setup & Toolchain ✅

> ⚠️ COMPLETE — All infrastructure tasks done. Ready for Phase 1.

### P0-0: Scaffold Missing Toolchain

> Pre-Flight revealed critical missing files. Must complete first.

| ID | Task | Status | File | Notes |
|----|------|--------|------|-------|
| P0-0a | Create Vite config | ⬜ | `vite.config.ts` | Standard Vite + React + path aliases |
| P0-0b | Create app entry point | ⬜ | `src/main.tsx` | ReactDOM.createRoot, import App |
| P0-0c | Create app shell | ⬜ | `src/App.tsx` | Import GrundyPrototype, basic wrapper |
| P0-0d | Create CSS entry | ⬜ | `src/index.css` | `@tailwind base/components/utilities` |
| P0-0e | Create Tailwind config | ⬜ | `tailwind.config.js` | Content: `src/**/*.{ts,tsx}` |
| P0-0f | Create PostCSS config | ⬜ | `postcss.config.js` | tailwindcss + autoprefixer |
| P0-0g | Create public folder | ⬜ | `public/` | Empty folder for static assets |
| P0-0h | Fix systems.ts types | ⬜ | `src/game/systems.ts` | Remove refs to non-existent properties |
| P0-0i | Standardize currency | ⬜ | `src/types/index.ts` | Change to `'coins' \| 'gems' \| 'eventTokens'` |
| P0-0j | Run npm install | ⬜ | — | Install all dependencies |

**Validation Checkpoint:**
```bash
npm install        # Must complete without errors
npm run build      # Must exit 0
```

### P0-1: Verify Build

| ID | Task | Status | Acceptance Criteria |
|----|------|--------|---------------------|
| P0-1 | Verify build compiles | ⬜ | `npm run build` succeeds with no errors |

### P0-2: Test Infrastructure

| ID | Task | Status | Acceptance Criteria |
|----|------|--------|---------------------|
| P0-2a | Verify Vitest installed | ⬜ | `vitest` in devDependencies |
| P0-2b | Create test setup file | ⬜ | `src/test/setup.ts` exists |
| P0-2c | Create smoke test | ⬜ | `src/__tests__/smoke.test.ts` with 1 passing test |
| P0-2 | Run test suite | ⬜ | `npm test` passes |

### P0-3 through P0-8: Verification & Deploy

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P0-0 | Scaffold missing toolchain | ✅ | — | vite.config.ts, main.tsx, App.tsx, index.css, tailwind/postcss configs exist |
| P0-1 | Verify build compiles | ✅ | — | `npm run build` succeeds with no errors |
| P0-2 | Verify tests pass | ✅ | — | `npm test` passes all existing tests |
| P0-3 | Hide DevPanel in production | ✅ | — | N/A: No DevPanel exists yet; README gems fixed (0→10) |
| P0-4 | Verify PWA manifest exists | ✅ | 15.2 | manifest.json created, index.html linked; icons need replacement |
| P0-5 | Deploy to GitHub Pages | ✅ | — | Workflow created; URL: oladoyintayo-spikes.github.io/Grundy_V1/ |
| P0-6 | Add loading state for initial render | ✅ | — | Spinner + paw emoji shown until React mounts |
| P0-7 | Mobile viewport verification | ✅ | — | Viewport meta OK; safe-area padding + overflow-x guard added |
| P0-8 | Add error boundary | ✅ | — | ErrorBoundary component wraps app; friendly fallback UI with reload |

**Phase 0 Exit Criteria:**
- [x] `npm run build` exits 0
- [x] `npm test` passes
- [x] Game loads in browser at localhost
- [x] No TypeScript errors
- [x] No console errors on load

**✅ PHASE 0 COMPLETE** — All infrastructure tasks done. Ready for Phase 1.

---

## WEB PHASE 1: Core Loop & Data ✅

> **Theme:** Unify the data layer and align with Bible specs.
>
> **Status:** COMPLETE — All data layer, core loop, abilities, and documentation aligned.

### P1-DATA: Complete Data Definitions

> Make `src/data/` files the single source of truth, aligned with Bible §3 and §5.

| ID | Task | Status | Bible | Blocked By | Notes |
|----|------|--------|-------|------------|-------|
| P1-DATA-1 | Add 5 missing pets to `pets.ts` | ✅ | §3.2 | — | Added Fizz, Ember, Chomper, Whisp, Luxe |
| P1-DATA-2 | Add unlock requirements to pets | ✅ | §3.2 | P1-DATA-1 | UnlockRequirement type + gemSkipCost for all 8 pets |
| P1-DATA-3 | Add 2 missing foods to `foods.ts` | ✅ | §5.4 | — | Added Dream Treat, Golden Feast with 8-pet affinities |
| P1-DATA-4 | Complete affinity matrix (80 entries) | ✅ | §5.5 | P1-DATA-1,3 | All 10 foods × 8 pets = 80 entries |
| P1-DATA-5 | Add ability definitions to pets | ✅ | §3.2 | P1-DATA-1 | All 8 pets have abilities in pets.ts |

### P1-CORE: Fix Store & Core Loop

> Ensure store.ts works correctly with complete data.

| ID | Task | Status | Bible | Blocked By | Notes |
|----|------|--------|-------|------------|-------|
| P1-CORE-1 | Fix default pet ID to `'munchlet'` | ✅ | — | P1-DATA-1 | Fixed in store.ts:30 |
| P1-CORE-2 | Add `selectPet(petId)` action | ✅ | — | P1-CORE-1 | Implemented in store.ts |
| P1-CORE-3 | Add `unlockedPets: string[]` to state | ✅ | §3.2 | P1-DATA-2 | unlockedPets + unlockPet/unlockPetWithGems actions |
| P1-CORE-4 | Audit XP/evolution formulas | ✅ | §6.1-2 | — | Audited; code wins for evolution (BIB-01/02 in backlog) |

### P1-ABILITY: Implement Pet Abilities

> Each pet's special ability triggers correctly per Bible §3.7.

| ID | Task | Status | Bible | Blocked By | Notes |
|----|------|--------|-------|------------|-------|
| P1-ABILITY-1 | Create ability effect system | ✅ | §3.7 | P1-DATA-5 | `abilities.ts` with helper functions |
| P1-ABILITY-2 | Implement starter abilities | ✅ | §3.7 | P1-ABILITY-1 | Munchlet +10% bond, Grib -20% mood, Plompo -20% decay |
| P1-ABILITY-3 | Implement unlock pet abilities | ✅ | §3.7 | P1-ABILITY-1 | Fizz, Ember, Chomper, Whisp, Luxe all implemented |
| P1-ABILITY-4 | Add ability trigger indicators | ✅ | §3.7 | P1-ABILITY-2 | AbilityIndicator component, toast-style triggers with auto-expire |

### P1-TEST: Test Coverage for Data Layer

> Prevent regressions as we expand data.

| ID | Task | Status | Scope | Blocked By | Notes |
|----|------|--------|-------|------------|-------|
| P1-TEST-1 | Add pet data validation tests | ✅ | `pets.ts` | P1-DATA-1 | 16 tests: 8 pets, abilities, unlock requirements |
| P1-TEST-2 | Add food data validation tests | ✅ | `foods.ts` | P1-DATA-4 | 16 tests: 10 foods, 80 affinities, prices |
| P1-TEST-3 | Add ability unit tests | ✅ | `abilities.ts` | P1-ABILITY-2 | 51 tests: all 8 abilities + 24 integration tests |

### P1-DOC: Documentation Alignment

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P1-DOC-1 | Apply Bible Update Backlog | ✅ | `BIBLE_UPDATE_BACKLOG.md` | Bible §6.1 updated: Baby 1-9, Youth 10-24, Evolved 25+ |
| P1-DOC-2 | Update README with current status | ✅ | `README.md` | Progression section updated to match code |
| P1-DOC-3 | Add mini-game design doc references | ✅ | Bible §8, TASKS.md | Added §8.0 + design doc links in P8 tasks |

**✅ PHASE 1 DOCUMENTATION COMPLETE**

### CE-P2: Chief Engineer Planning Tasks

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| CE-P2-01 | Create Phase 8 mini-game implementation prompts | ✅ | prompts/phase2/ | 6 prompts: INFRA, SNACK, MEMORY, PIPS, RHYTHM, POOP |

### P2-DOC: Phase 2 Documentation Alignment

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P2-DOC-2 | Align Bible & mini-game docs to NO-GEMS rule | ✅ | Bible §8, DEV_STATUS | Mini-games never award gems; Rainbow = coins/XP/food only |

### CE-P3: Chief Engineer Planning Tasks

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| CE-P3-PLAN | Normalize TASKS.md to Web Phases 3-5 | ✅ | TASKS.md, DEV_STATUS, Roadmap | Web Phase structure + P3-ENV + P4-FTUE + P5-POLISH |

### P1-ART: Asset Creation (Deferred)

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P1-ART-1 | Create PWA icons | ⏸️ | `public/` | Blocked until branding finalized |

---

### Phase 1 Execution Order

```
1. P1-DATA-1 (Add 5 pets) ──┬──▶ 2. P1-DATA-2 (Unlock requirements)
                            │
                            ├──▶ 3. P1-DATA-5 (Ability definitions)
                            │
                            └──▶ 5. P1-CORE-1 (Fix default pet)
                                        │
                                        └──▶ 6. P1-CORE-2,3 (Selection, unlock tracking)

4. P1-DATA-3 (Add 2 foods) ──▶ 7. P1-DATA-4 (Affinity matrix)
                                        │
                                        └──▶ 9. P1-TEST-1,2 (Data tests)

8. P1-ABILITY-1 (Effect system) ──▶ 10. P1-ABILITY-2,3 (Abilities)
                                              │
                                              └──▶ 11. P1-ABILITY-4, P1-TEST-3

P1-CORE-4, P1-DOC-1,2 ── Can run in parallel
```

---

### Phase 1 Exit Criteria

| Check | Validation | Status |
|-------|------------|--------|
| All 8 pets defined | `getAllPets().length === 8` | ✅ |
| All 10 foods defined | `getAllFoods().length === 10` | ✅ |
| Affinity matrix complete | 80 entries, no `undefined` | ✅ |
| Default pet is `munchlet` | `resetGame()` → `pet.id === 'munchlet'` | ✅ |
| All 8 abilities implemented | Unit tests pass | ✅ |
| All tests pass | `npm test -- --run` exits 0 | ✅ |
| Build passes | `npm run build` exits 0 | ✅ |

**✅ PHASE 1 COMPLETE** — Data layer, core loop, abilities, and documentation all aligned.

### P1-CORE: Core System Naming Alignment

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-CORE-2 | Rename 'adult' evolution stage to 'evolved' | ✅ | types, config, systems, prototype | All references updated; Bible naming §6.1 |

### P1-UI: UI Integration

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-UI-01 | Connect GrundyPrototype.tsx to Zustand store | ✅ | GrundyPrototype.tsx, store.ts | Uses Zustand store + canonical pets.ts + foods.ts |

---

## POST-WEB 1.0 SYSTEMS

> These features are planned for after the Web 1.0 release.

### Shop System (Phase 8)

> Bible v1.6: §5.8, §11.5, §11.5.1, §14.7 — Complete shop implementation.
> BCT v2.2: BCT-SHOP-001 through BCT-SHOP-025

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P8-SHOP-01 | Audit shop vs Bible v1.6 | ✅ | §11.5, §11.5.1 | Catalog constants in bible.constants.ts |
| P8-SHOP-02 | Implement shop tabs (Food, Care, Cosmetics, Gems) | ✅ | §14.7 | ShopView with 4-tab structure |
| P8-SHOP-03 | Implement individual food purchase UI | ✅ | §11.5.1 | Quantity selector 1-10, coins-only (Shop-A UI only) |
| P8-SHOP-04 | Implement bundle purchase + decomposition | ✅ | §11.5.1, §11.7.1 | Shop-B: Bundles decompose to base items; shopPurchase.ts |
| P8-SHOP-05 | Implement visibility rules | ✅ | §14.7 | Medicine (Classic), Diet (weight≥31), Gems tab (Lv5+) |
| P8-SHOP-06 | Add "Recommended" section | ✅ | §14.7 | getShopRecommendations() with priority rules |
| P8-SHOP-07 | Implement purchase flow | ✅ | §11.5.1 | Shop-B: purchaseShopItem action, currency deduction, BCT tests |
| P8-SHOP-08 | Add starting resources | ✅ | §5.8 | Already implemented: 100 coins, 0 gems, starter inventory |

---

### Inventory System (Phase 8)

> Bible v1.6: §11.7, §11.7.1, §14.8 — Inventory slots and stacking.
> BCT v2.2: BCT-INV-001 through BCT-INV-017, BCT-ECON-004 through BCT-ECON-008

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P8-INV-01 | Add inventory capacity | ✅ | §11.7 | Base 15 slots |
| P8-INV-02 | Implement stacking semantics | ✅ | §11.7.1 | Max 99 per item id, slot = unique item id |
| P8-INV-03 | Implement capacity check | ✅ | §11.7.1 | Block purchase if new slot needed + none available OR stack > 99 |
| P8-INV-04 | Add expansion items | ⬜ | §11.7 | 25/50/100/150 gems for +5 slots each (deferred to future phase) |
| P8-INV-05 | Show capacity in UI | ✅ | §14.8 | "X/15" header, Food/Care tabs |
| P8-INV-06 | Implement item detail modal | ✅ | §14.8 | Quantity, rarity, affinities, "Use on Pet" action |
| P8-INV-07 | Implement empty state | ✅ | §14.8 | "Go to Shop" CTA when empty |

### Phase 8 CE/QA Sign-Off

> **Status:** ✅ CE/QA APPROVED (2025-12-12)
>
> - **Audit Report:** [`docs/P8_SHOPB_AUDIT_REPORT.md`](docs/P8_SHOPB_AUDIT_REPORT.md)
> - **Sign-Off Notes:** [`docs/CEQA_PHASE8_SIGNOFF_NOTES.md`](docs/CEQA_PHASE8_SIGNOFF_NOTES.md)
> - **Audit Commit:** `947e1b9`
>
> All Shop + Inventory BCT tests pass (778 BCT, 1434 total). Atomicity, blocking, bundle decomposition, and recommendations validated per Bible v1.6 / BCT v2.2.

---

## PHASE 9: Pet Slots (Multi-Pet)

> Bible v1.7: §11.6, §8.2.1, §9.4.4–9.4.7, §14.6 — Multi-pet care system with runtime clarifications.
> BCT v2.3: BCT-PETSLOTS-001 thru 011 (P9-A), BCT-MULTIPET-001 thru 014 (P9-B)

### P9-DOC: Documentation Updates

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P9-DOC-01 | Apply Bible v1.7 patch (multi-pet runtime) | ✅ | §8.2.1, §9.4.4–9.4.7, §14.6 | Energy scope, runaway handling, switching constraints, offline rules, alerts |
| P9-DOC-02 | Update BCT v2.2 → v2.3 | ✅ | — | Added BCT-PETSLOTS (11), BCT-MULTIPET (14) |
| P9-DOC-03 | Update repo references | ✅ | — | ORCHESTRATOR, TASKS, DEV_STATUS, SOP updated to v1.7/v2.3 |

### P9-A: Pet Slots Foundation (COMPLETE)

> Multi-pet data model, save migration, initialization, switching UI, BCT tests.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P9-A-01 | Multi-pet data model | ✅ | §11.6 | petsById, ownedPetIds, activePetId |
| P9-A-02 | Save migration v1→v2 | ✅ | §15.3 | Migrate single-pet to multi-pet |
| P9-A-03 | New-game initialization | ✅ | §6 | 3 starters owned, 1 slot unlocked |
| P9-A-04 | Pet switching UI | ✅ | §11.6 | Settings view pet selector |
| P9-A-05 | BCT tests | ✅ | — | 33 BCT-PETSLOTS tests passing |

### P9-B: Multi-Pet Runtime (COMPLETE)

> Runtime integration: mood/neglect/alerts/runaway rules across multiple pets.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P9-B-01 | Global energy scope | ✅ | §8.2.1 | Energy shared across all pets |
| P9-B-02 | Runaway auto-switch | ✅ | §9.4.4 | Auto-switch to next available pet |
| P9-B-03 | Switching constraints | ✅ | §9.4.5 | Allow switching to/from neglected pets |
| P9-B-04 | Offline multi-pet rules | ✅ | §9.4.6 | Decay/neglect applies to all pets |
| P9-B-05 | Alert routing & suppression | ✅ | §14.6 | Per-pet alerts, batching, cooldowns |
| P9-B-06 | BCT-MULTIPET tests | ✅ | — | 14 BCT-MULTIPET compliance tests |

### P9-B-UI: Multi-Pet UI Wiring (COMPLETE)

> UI components for multi-pet status display and welcome back experience.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P9-B-UI-01 | Multi-pet badges | ✅ | §14.6 | Status badges for all owned pets |
| P9-B-UI-02 | Welcome back modal | ✅ | §9.4.6 | Summary of offline events per pet |
| P9-B-UI-03 | BCT-MULTIPET-UI tests | ✅ | — | 21 BCT-MULTIPET-UI compliance tests |

### P9-C: Weight & Sickness Specification (COMPLETE)

> **SPEC COMPLETE:** Weight & Sickness specified in Bible v1.8 §9.4.7. Runtime implementation moves to Phase 10.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P9-C-SPEC | Bible v1.8 patch applied | ✅ DONE | §9.4.7 | Patch artifact in `docs/patches/` |
| P9-C-BCT | BCT v2.4 planned suites | ✅ DONE | — | ~52 new tests specified |

> See [`docs/patches/BIBLE_v1.8_PATCH_WEIGHT_SICKNESS_MULTIPET.md`](docs/patches/BIBLE_v1.8_PATCH_WEIGHT_SICKNESS_MULTIPET.md) for full specification.

---

## PHASE 10: Weight & Sickness Runtime

> Bible v1.8: §5.7, §9.4.7, §11.6.1 — Per-pet weight and sickness systems.
> BCT v2.4: BCT-WEIGHT-*, BCT-SICKNESS-*, BCT-SICKNESS-OFFLINE-*, BCT-ALERT-HEALTH-*, BCT-COZY-IMMUNITY-*

### P10-DOC: Documentation (COMPLETE)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-DOC-01 | Bible v1.8 patch applied | ✅ DONE | §9.4.7 | Full §9.4.7 subsections |
| P10-DOC-02 | BCT v2.4 test suites defined | ✅ DONE | — | ~52 planned tests |
| P10-DOC-03 | Governance sweep | ✅ DONE | — | ORCHESTRATOR, TASKS, DEV_STATUS updated |

### P10-B/B1.5/B2: Poop System + Offline Order (COMPLETE)

> **Commit:** `c1095b1` (via PR #88)
> **Branch:** `claude/p10-b2-poop-ui-polish-01QyRrnRXgT1nMMoqTWKJtbk`

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-B | Offline weight/sickness order | ✅ DONE | §9.4.7 | Order: weight decay → sickness triggers → stat decay |
| P10-B1.5 | Poop state model + spawn + clean | ✅ DONE | §9.5 | isPoopDirty, poopDirtyStartTimestamp, feedingsSinceLastPoop |
| P10-B2-01 | Poop UI indicator | ✅ DONE | §9.5, §14 | Visual indicator when poop dirty |
| P10-B2-02 | Tap-to-clean interaction | ✅ DONE | §9.5 | cleanPoop() action with race guard |
| P10-B2-03 | Cleaning rewards | ✅ DONE | §9.5 | +2 Happiness, +0.1 Bond |
| P10-B2-04 | Mood decay 2× after 60m dirty | ✅ DONE | §9.5 | Online + offline (save-time anchored) |
| P10-B2-05 | BCT tests | ✅ DONE | — | 18 tests in `bct-p10b2-poop-ui-rewards.spec.ts` |

**Verification Notes:**
- Bond decimals audit: ✅ PASS — bond typed as `number`, no integer coercion in state
- Offline 60m threshold: Uses save-time-anchored approach (intentional approximation)

### P10-C/D: Feeding Triggers + Mini-Game Health Gating (COMPLETE)

> **P10-C Commit:** `8992656` — Feeding-time triggers (weight gain + sickness)
> **P10-D Commit:** `ce23fd7` — Mini-game health gating (Classic-only)
> **Traceability:** P10-D implemented under branch `claude/p10-b2-merge-readiness-01V13tp3PSDSWFZKxeQbuT5Z` (naming mismatch); merged to main via PR #91.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-C | Feeding triggers (weight gain + sickness) | ✅ DONE | §5.7, §9.4.7 | Snack weight gain, immediate sickness triggers |
| P10-D | Mini-game health gating | ✅ DONE | §9.4.7 | Sick/Obese block mini-games (Classic only); Cozy bypasses |
| P10-D-BCT | BCT tests | ✅ DONE | — | 23 tests in `bct-p10d-minigame-gating.spec.ts` |

### P10-A: Weight State Model (COMPLETE)

> **Commit:** `6281137` — feat(P10-A): add weight+sickness state foundations

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-A-01 | Per-pet weight state (0-100) | ✅ DONE | §9.4.7.1 | Independent tracking per pet |
| P10-A-02 | Weight constants in bible.constants.ts | ✅ DONE | §9.4.7.1 | WEIGHT_THRESHOLDS, WEIGHT_EFFECTS, WEIGHT_GAIN |
| P10-A-03 | BCT-WEIGHT-001 tests | ✅ DONE | — | Per-pet tracking, persistence |

### P10-B: Weight Gain & Decay (COMPLETE)

> **Commit:** `08493f3` — feat(P10-B): apply offline order for weight+sickness

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-B-01 | Weight gain on feeding | ✅ DONE | §5.7, §9.4.7.1 | Cookie +5, Candy +10, etc. |
| P10-B-02 | Weight decay runtime | ✅ DONE | §9.4.7.1 | -1/hr online and offline |
| P10-B-03 | BCT-WEIGHT-002..003 tests | ✅ DONE | — | Gain and decay verification |

### P10-C: Sickness State Model (COMPLETE)

> **Commit:** `8992656` — feat(P10-C): feeding-time triggers (weight gain + sickness)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-C-01 | Per-pet sickness state | ✅ DONE | §9.4.7.2 | isSick boolean, Classic only |
| P10-C-02 | Sickness constants in bible.constants.ts | ✅ DONE | §9.4.7.2 | SICKNESS_TRIGGERS, SICKNESS_EFFECTS |
| P10-C-03 | Trigger timers (hunger=0, poop) | ✅ DONE | §9.4.7.2 | 30min/2hr timers with chance rolls |
| P10-C-04 | BCT-SICKNESS-001..003 tests | ✅ DONE | — | Classic only, trigger verification |

### P10-D: Sickness Offline Accumulation (COMPLETE)

> **Commit:** `ce23fd7` — feat(P10-D): mini-game health gating (Classic-only)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-D-01 | Timer accumulation offline | ✅ DONE | §9.4.7.3 | Timers run during absence |
| P10-D-02 | 2× stat decay offline | ✅ DONE | §9.4.7.3 | If sick, apply 2× decay (P10-H) |
| P10-D-03 | Care mistake offline cap | ✅ DONE | §9.4.7.2 | +1/hr, max 4 per session |
| P10-D-04 | BCT-SICKNESS-OFFLINE-* tests | ✅ DONE | — | 8 tests for offline behavior |

### P10-E: Sickness Recovery (COMPLETE)

> **Commit:** `de23458` — feat(P10-E): recovery flows (medicine + diet food + ad stub)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-E-01 | Medicine item | ✅ DONE | §9.4.7.4 | 50🪙, instant cure |
| P10-E-02 | Shop integration (Care tab) | ✅ DONE | §9.4.7.4 | Classic only, hidden in Cozy |
| P10-E-03 | BCT-SICKNESS-004..006 tests | ✅ DONE | — | Recovery verification |

### P10-F: Alert Wiring (COMPLETE)

> **Commit:** `35fbd06` — feat(P10-F): health alerts engine (weight + sickness)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-F-01 | Weight Warning alert (Obese) | ✅ DONE | §11.6.1 | Toast: "{Pet} is getting too heavy!" |
| P10-F-02 | Weight Recovery alert | ✅ DONE | §11.6.1 | Toast: "{Pet} is back to healthy weight!" |
| P10-F-03 | Sickness Onset alert | ✅ DONE | §11.6.1 | Toast + badge: "{Pet} is sick!" |
| P10-F-04 | BCT-ALERT-HEALTH-* tests | ✅ DONE | — | 28 tests in `bct-p10f-health-alerts.spec.ts` |

### P10-G: Cozy Mode Immunity (COMPLETE — Built into all P10 tasks)

> **Note:** Cozy immunity is verified throughout Phase 10. No separate implementation needed.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-G-01 | Sickness disabled in Cozy | ✅ DONE | §9.3, §9.4.7.2 | isSick always false, Cozy bypass in all sickness code |
| P10-G-02 | Obese visual only in Cozy | ✅ DONE | §9.3 | No gameplay effects — mini-game gating bypassed |
| P10-G-03 | BCT-COZY-IMMUNITY-* tests | ✅ DONE | — | Cozy bypass tested in P10-D, P10-H tests |

### P10-H: Integration & Edge Cases (COMPLETE)

> **Commit:** `c5e58cf` — feat(P10-H): 2× stat decay when sick during offline (Classic)

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P10-H-01 | Multi-pet sickness scenarios | ✅ DONE | §9.4.7.6 | All pets apply offline sickness processing |
| P10-H-02 | Weight + Sickness interaction | ✅ DONE | §9.4.7.5 | Overweight snack → 5% sick chance (P10-C) |
| P10-H-03 | Sickness + Neglect co-existence | ✅ DONE | §9.4.3 | Both can progress simultaneously |
| P10-H-04 | Final integration tests | ✅ DONE | — | 6 tests in `bct-p10h-sick-decay.spec.ts` |
| P10-H-05 | 2× offline stat decay when sick | ✅ DONE | §9.4.7.3 | BCT-SICKNESS-OFFLINE-002: mood/bond/hunger 2× (Classic only) |

**P10-H Implementation:**
- **Branch:** `claude/p10-b2-merge-readiness-01V13tp3PSDSWFZKxeQbuT5Z`
- **Commit:** `c5e58cf866adabacbc9a3fc9153dc900fd5fe052`
- **Tests:** +6 tests in `src/__tests__/bct-p10h-sick-decay.spec.ts`

---

## Phase 10 Complete ✅

**All Phase 10 tasks complete.** Weight system, sickness mechanics, poop system, mini-game gating, recovery flows, health alerts, and offline processing fully implemented with BCT coverage.

### Phase 10 Summary

| Task | Description | Commit |
|------|-------------|--------|
| P10-A | State foundations (weight, isSick, timestamps) | `6281137` |
| P10-B | Offline order-of-application (§9.4.6 steps) | `08493f3` |
| P10-B1.5 | Poop state (isPoopDirty, spawn, clean) | `ee1224b` |
| P10-B2 | Poop UI + rewards + 2× mood decay | `c1095b1` |
| P10-C | Feeding triggers (snack weight, sickness) | `8992656` |
| P10-D | Mini-game gating (sick/obese blocked) | `ce23fd7` |
| P10-E | Recovery flows (Medicine, Diet Food, ad stub) | `de23458` |
| P10-F | Alert wiring (weight + sickness alerts) | `35fbd06` |
| P10-G | Cozy mode immunity (verified throughout) | (integrated) |
| P10-H | Sick offline 2× decay (BCT-SICKNESS-OFFLINE-002) | `c5e58cf` |

### Baselines at Phase 10 Close

- **Total Tests:** 1742
- **BCT Tests:** 999
- **Build:** PASS
- **Bible:** v1.8
- **BCT Spec:** v2.4

### Phase 10 Implementation Sequence

```
P10-A (Weight model) ──┬──▶ P10-B (Weight gain/decay)
                       │
P10-C (Sickness model) ┴──▶ P10-D (Offline accumulation)
                              │
                              └──▶ P10-E (Recovery)
                                      │
                                      └──▶ P10-F (Alerts)
                                              │
                                              └──▶ P10-G (Cozy immunity)
                                                      │
                                                      └──▶ P10-H (Integration)
```

### Phase 9 DevStatus Summary

> **DevStatus:** P9-A + P9-B + P9-B-UI COMPLETE — Ready for CE Review
>
> - **Audit Report:** [`docs/P9_PHASE9_AUDIT_REPORT.md`](docs/P9_PHASE9_AUDIT_REPORT.md)
> - **BCT Tests:** 51 tests (BCT-PETSLOTS-001..011 + BCT-MULTIPET-001..014 + BCT-MULTIPET-UI-001..021)
>
> **Deferrals:**
> - P9-C (Weight/Sickness) — §9.4.7 deferred to future phase
> - P9-SLOTS-02..06 — Slot purchase/UI deferred to post-CE review
> - Push notification infrastructure — deferred (no FCM/APNs in web)
> - Plus subscription detection — deferred (no IAP in web prototype)

### Phase 9 CE/QA Sign-Off

> **Status:** ✅ CE/QA APPROVED (2025-12-12)
>
> - **Audit Report:** [`docs/P9_PHASE9_AUDIT_REPORT.md`](docs/P9_PHASE9_AUDIT_REPORT.md)
> - **Sign-Off Notes:** [`docs/CEQA_PHASE9_SIGNOFF_NOTES.md`](docs/CEQA_PHASE9_SIGNOFF_NOTES.md)
> - **Closeout Pack:** [`docs/CEQA_PHASE9_CLOSEOUT_PACK.md`](docs/CEQA_PHASE9_CLOSEOUT_PACK.md)
> - **Audit Commit:** `83ce657`
>
> All P9-A/P9-B/P9-B-UI BCT tests pass (51 tests). Multi-pet data model, runtime integration, and UI wiring validated per Bible v1.7 / BCT v2.3.

### P9-SLOTS: Slot Purchase & UI

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P9-SLOTS-01 | Add pet slots to state | ✅ | §11.6 | `unlockedSlots`, selectors/actions |
| P9-SLOTS-02 | Implement slot purchase | ✅ | §11.6 | 100/150/200 gems — commit `930be64` |
| P9-SLOTS-03 | Update pet selector | ⬜ | §11.6 | Assign/swap slots |
| P9-SLOTS-04 | Implement parallel decay | ⬜ | §11.6 | All slotted pets decay |
| P9-SLOTS-05 | Update notifications | ⬜ | §11.6 | Any pet can trigger |
| P9-SLOTS-06 | Add slot UI | ✅ | §11.6 | Settings → Pet Slots section — commit `930be64` |

### P9-C Slot Unlock (Post-CE Patch)

> **Commits:** Implementation `930be64` · Delta Audit `207facc`
>
> **Delta Addendum:** [`docs/P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md`](docs/P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md)
>
> **What Landed:**
> - Slot unlock model: Slot 1 always owned, slots 2-4 unlockable with gem purchase
> - Sequential prerequisites: Slot 2 requires Level 5+, Slot 3 requires Slot 2, Slot 4 requires Slot 3
> - Gem pricing: 100/150/200 💎 for slots 2/3/4 with atomic purchase (no partial mutation on failure)
> - Settings UI: Pet Slots section with unlock CTA, prereq display, and confirmation modal
> - BCT tests: 40 tests in `src/__tests__/bct-slot-unlock.spec.ts`
>
> **Deferral:**
> - Plus discount logic present but Plus detection is not implemented on Web (`hasPlusSubscription=false`) — discount remains effectively deferred until Plus detection exists.

---

## PHASE 7: Classic Mode (Complete)

> Bible Section 9 — Full neglect system.

### P7-NEGLECT-SYSTEM ✅

> Bible §9.4.3 — Neglect & Withdrawal System (Classic Mode Only)
>
> **Status:** COMPLETE — Per-pet neglect tracking, 5-stage ladder, calendar-day semantics, offline cap, recovery paths, and UI indicators implemented.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P7-NEGLECT-1 | NEGLECT_CONFIG | ✅ | §9.4.3 | Stage thresholds, recovery costs, offline cap |
| P7-NEGLECT-2 | NeglectState type | ✅ | §9.4.3 | Per-pet tracking with all fields |
| P7-NEGLECT-3 | Store slice | ✅ | §9.4.3 | updateNeglectOnLogin, registerCareEvent, recovery actions |
| P7-NEGLECT-4 | BCT-NEGLECT tests | ✅ | BCT | 49 tests covering all 23 BCT specs |
| P7-NEGLECT-5 | UI indicators | ✅ | §9.4.3 | NeglectBadge, RunawayScreen, WithdrawalRecoveryPanel |

### P7 Remaining Tasks

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P7-1 | Implement sickness trigger | ⬜ | 9.4.2 | Hunger=0 4h OR overweight/dirty |
| P7-2 | Implement sick state | ⬜ | 9.4.2 | 2× decay, can't play games |
| P7-3 | Implement medicine | ⬜ | 9.4.2 | Instant cure |
| P7-4 | Implement weight system | ⬜ | 5.7 | Hidden 0-100, visual stages |
| P7-5 | Implement neglect warnings | ✅ | 9.4.3 | 5-stage warning (P7-NEGLECT-SYSTEM) |
| P7-6 | Implement runaway | ✅ | 9.4.3 | Pet leaves after Day 14 neglect |
| P7-7 | Implement return options | ✅ | 9.4.3 | 72h wait OR 24h+25 gems, bond -50% |
| P7-8 | Hide care items in Cozy | ⬜ | 9.4 | Medicine not visible in Cozy mode |

---

## WEB PHASE 2: Mini-Games & Infra ✅

> Bible Section 8 — All 5 mini-games implemented and tested.
> Design docs: `docs/minigames/`
>
> **Status:** COMPLETE — Energy system, rewards, daily caps, and all 5 games working.

### P8-INFRA: Mini-Game Infrastructure

| ID | Task | Status | Files | Notes |
|----|------|--------|-------|-------|
| P8-INFRA-1 | Energy system (50 max, 10/game, regen) | ✅ | store.ts, types, miniGameRewards.ts | First daily free, 30min regen |
| P8-INFRA-2 | Reward tier calculator | ✅ | miniGameRewards.ts | Bronze/Silver/Gold/Rainbow, Fizz +25% |
| P8-INFRA-3 | Mini-game hub UI | ✅ | components/MiniGameHub.tsx | Game selection, energy display |
| P8-INFRA-4 | Game session wrapper | ✅ | components/MiniGameWrapper.tsx | Ready/Play/Results flow |
| P8-INFRA-5 | Stats tracking (minigamesCompleted) | ✅ | store.ts | For Chomper unlock, completeGame action |

### P8-SNACK: Snack Catch

| ID | Task | Status | Design Doc | Notes |
|----|------|--------|------------|-------|
| P8-SNACK-1 | Implement Snack Catch game | ✅ | [GRUNDY_SNACK_CATCH_DESIGN.md](docs/Minigames/GRUNDY_SNACK_CATCH_DESIGN.md) | 60s arcade; all 8 pet abilities |

### P8-MEMORY: Memory Match

| ID | Task | Status | Design Doc | Notes |
|----|------|--------|------------|-------|
| P8-MEMORY-1 | Implement Memory Match game | ✅ | [GRUNDY_MEMORY_MATCH_DESIGN.md](docs/minigames/GRUNDY_MEMORY_MATCH_DESIGN.md) | 90s card matching; all 8 pet abilities |

### P8-PIPS: Pips

| ID | Task | Status | Design Doc | Notes |
|----|------|--------|------------|-------|
| P8-PIPS-1 | Implement Pips game | ✅ | [GRUNDY_PIPS_DESIGN.md](docs/minigames/GRUNDY_PIPS_DESIGN.md) | 120s tile matching; all 8 pet abilities |

### P8-RHYTHM: Rhythm Tap

| ID | Task | Status | Design Doc | Notes |
|----|------|--------|------------|-------|
| P8-RHYTHM-1 | Implement Rhythm Tap game | ✅ | [GRUNDY_RHYTHM_TAP_DESIGN.md](docs/minigames/GRUNDY_RHYTHM_TAP_DESIGN.md) | Music/timing; all 8 pet abilities |

### P8-POOP: Poop Scoop

| ID | Task | Status | Design Doc | Notes |
|----|------|--------|------------|-------|
| P8-POOP-1 | Implement Poop Scoop game | ✅ | [GRUNDY_POOP_SCOOP_DESIGN.md](docs/minigames/GRUNDY_POOP_SCOOP_DESIGN.md) | 60s action; all 8 pet abilities |

### P8-TEST: Mini-Game Tests

| ID | Task | Status | Files | Notes |
|----|------|--------|-------|-------|
| P8-TEST-1 | Energy system tests | ✅ | __tests__/miniGameInfra.test.ts | Deduction, regen, daily free, caps |
| P8-TEST-2 | Reward calculation tests | ✅ | __tests__/miniGameInfra.test.ts | Tier thresholds, Fizz bonus, no gems |
| P8-TEST-3 | Snack Catch tests | ✅ | __tests__/snackCatch.test.ts | 27 tests: scoring, abilities, combo, difficulty |
| P8-TEST-4 | Memory Match tests | ✅ | __tests__/memoryMatch.test.ts | 39 tests: cards, scoring, abilities, win/lose |
| P8-TEST-5 | Pips tests | ✅ | __tests__/pips.test.ts | 38 tests: board, scoring, combos, abilities |
| P8-TEST-6 | Rhythm Tap tests | ✅ | __tests__/rhythmTap.test.ts | 43 tests: beats, scoring, judgment, abilities |
| P8-TEST-7 | Poop Scoop tests | ✅ | __tests__/poopScoop.test.ts | 41 tests: cleanup, scoring, danger, abilities |
| P8-TEST-8 | Unified mini-game invariant tests | ✅ | __tests__/miniGameSuite.test.ts | 40 tests: cross-game invariants, all 5 games |

### Execution Order

```
P8-INFRA (must be first)
    ↓
P8-SNACK / P8-MEMORY (can be parallel)
    ↓
P8-RHYTHM / P8-POOP
    ↓
P8-TEST
```

### Mini-Game Rules (LOCKED)

| Rule | Value |
|------|-------|
| Energy cost | 10 per game |
| Daily cap | 3 rewarded plays per game |
| First daily | FREE |
| Gems from mini-games | **NEVER** |
| Rewards | Small helpful gifts only |

---

## WEB PHASE 3: Navigation & Environment 🟡

> App shell, navigation chrome, time-of-day theming, and rooms.

### P3-NAV: App Shell & Navigation

| ID | Task | Status | Files | Notes |
|----|------|--------|-------|-------|
| P3-NAV-1 | Introduce AppView model (home/games/settings) | ✅ | types, navigation.ts | Local state in GrundyPrototype |
| P3-NAV-2 | Add app header (pet + coins + energy) | ✅ | AppHeader.tsx | Shows active pet, coins, energy |
| P3-NAV-3 | Add bottom nav + view switching | ✅ | BottomNav.tsx | 3-tab navigation bar |
| P3-NAV-4 | Wire Mini-Game Hub into Games view | ✅ | GrundyPrototype.tsx | Games tab shows MiniGameHub + sessions |

### P3-ENV: Time-of-Day & Rooms

| ID | Task | Status | Files | Notes |
|----|------|--------|-------|-------|
| P3-ENV-1 | Time-of-day theming (Morning/Day/Evening/Night) | ⬜ | theme.ts, types | Background gradients + theme state |
| P3-ENV-2 | Room contexts (Kitchen/Bedroom/Playroom/Yard) | ⬜ | rooms.ts, types | Simple enum + mapping to views |
| P3-ENV-3 | Hook nav/views into room/time context | ⬜ | GrundyPrototype.tsx | Home/Games use appropriate room + theme |

**Web Phase 3 Exit Criteria:**
- [x] App header shows pet, coins, energy
- [x] Bottom nav switches between Home/Games/Settings
- [x] Games tab shows mini-game hub
- [ ] Time-of-day theming applied
- [ ] Rooms integrated into views

---

## WEB PHASE 4: FTUE / Onboarding ✅

> Bible Section 7 — Complete onboarding flow.
> Splash → Age Gate → World Intro → Pet Selection → Guided First Session

### P4-FTUE: Onboarding Core

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P4-FTUE-CORE | Implement full FTUE flow in UI | ✅ | 7.x | Splash → Age Gate → World Intro → Pet Select → Mode Select → First Session |
| P4-FTUE-LORE | Lock World Intro backstory across docs | ✅ | 7.4 | Lore Codex, Bible, Onboarding aligned |

### P4-FTUE: Screen Implementation (from Bible §7)

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P4-1 | Audit current FTUE vs Bible | ✅ | 7.x | FTUE_AUDIT.md created |
| P4-2 | Implement world intro | ✅ | 7.3 | 5-second auto-advance, LOCKED copy |
| P4-3 | Add pet origin snippets | ✅ | 7.4 | 2-line origin + loves/hates for all 8 pets |
| P4-4 | Implement locked pet teasers | ✅ | 7.4 | 5 locked pets show partial lore + unlock level |
| P4-5 | Add personality dialogue | ✅ | 7.6 | Pet-specific greetings and after-feeding lines |
| P4-6 | Implement mode select | ✅ | 7.7 | Cozy vs Classic with feature descriptions |
| P4-7 | Enforce FTUE rules | ✅ | 7.8 | Shop gated, first reaction always positive |
| P4-8 | Verify <60s timing | ✅ | 7.1 | 30-42s total, well under 60s target |

**Web Phase 4 Exit Criteria:**
- [x] New player can complete FTUE in <60s (30-42s)
- [x] Mode selection works (Cozy vs Classic)
- [x] First feeding always positive (pet greetings always positive)
- [x] World Intro shows LOCKED copy (canonical 3-line text)

**✅ PHASE 4 COMPLETE** — Full FTUE flow implemented. See `docs/FTUE_AUDIT.md` for details.

---

## WEB PHASE 5: Polish / Web 1.0 🟡

> Final polish, sound, PWA support, art integration, and release.

### P5-AUDIO: Audio System

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-AUDIO-CORE | Audio manager + sound/music prefs | ✅ | Audio, store | audioManager, SOUND_CONFIG, MUSIC_CONFIG |
| P5-AUDIO-HOOKS | Hook core events to SFX/BGM | ✅ | Components | UI taps, mini-game results, pet SFX, BGM |
| P5-AUDIO-DOC | Audio notes documentation | ✅ | docs/ | AUDIO_NOTES.md created |

### P5-PWA: PWA Support

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-PWA-CORE | Manifest + SW + registration | ✅ | public/, src/pwa | manifest.webmanifest + service-worker.js wired |
| P5-PWA-SHELL | Shell-focused offline behavior | ✅ | service-worker.js | App shell loads offline from cache |
| P5-PWA-DOC | PWA documentation | ✅ | docs/ | PWA_NOTES.md added |

### P5-ART: Art Integration

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-ART-PETS | Pet avatar visuals (real art) | ✅ | src/art, components | PetAvatar + petSprites using assets/pets/* |
| P5-ART-ROOMS | Room foreground visuals | ✅ | src/art, components | RoomScene + roomScenes config for all rooms |
| P5-ART-DOC | Art integration documentation | ✅ | docs/ | ART_NOTES.md created |

### P5-UX-A11Y: UX & Accessibility Sweep

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-UX-KEYS | Keyboard navigation & focus styles | ✅ | All interactive components | FOCUS_RING_CLASS pattern, tabIndex, keyboard handlers |
| P5-UX-CONTRAST | Contrast/readability updates | ✅ | Text colors | slate-400 → slate-300 for better contrast |
| P5-A11Y-LABELS | ARIA labels and semantics | ✅ | All components | aria-current, aria-label, aria-pressed, roles |
| P5-A11Y-DOC | UX/A11Y documentation | ✅ | docs/ | UX_A11Y_NOTES.md created |

### P5-QA: Web 1.0 QA

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-QA-SMOKE | Core smoke testing across app | ✅ | All views | Covered in QA_PLAN_WEB1 + QA_WEB1_ISSUES |
| P5-QA-FTUE | FTUE end-to-end validation | ✅ | FTUE flow | New & returning player behavior validated |
| P5-QA-MINIGAMES | Mini-game invariants & sanity checks | ✅ | Mini-games | Daily caps, energy rules, reward behavior, NO GEMS verified |
| P5-QA-PWA | Basic PWA/offline sanity checks | ✅ | PWA | Manifest, SW, installability, offline shell verified |
| P5-QA-REPORT | QA docs for Web 1.0 | ✅ | docs/ | QA_PLAN_WEB1.md + QA_WEB1_ISSUES.md created |

### P5-POLISH: Web 1.0 Readiness

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-SOUND-1 | Add basic SFX/BGM + sound settings | ✅ | Audio, store | Replaced by P5-AUDIO tasks |
| P5-PWA-1 | Add PWA manifest, icons, service worker | ✅ | public/, sw.js | Replaced by P5-PWA tasks |
| P5-ART-1 | Integrate final pet + room art assets | ✅ | assets/ | Replaced by P5-ART tasks |
| P5-QA-1 | Full Web 1.0 test pass & release checklist | ✅ | All | QA complete; release tagging next |

### P5-RELEASE: Web 1.0 Release

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P5-RELEASE-VERSION | Version bump for Web 1.0 | ✅ | src/version.ts, package.json | GRUNDY_WEB_VERSION = 1.0.0 |
| P5-RELEASE-NOTES | Release notes for Web 1.0 | ✅ | docs/ | RELEASE_NOTES_WEB1.0.md |
| P5-RELEASE-TAG-INSTR | Git tagging instructions | ✅ | docs/ | RELEASE_TAG_WEB1.0.md |
| P5-RELEASE-STATUS | Update dev status for Web 1.0 | ✅ | GRUNDY_DEV_STATUS.md | Phase 5 marked complete |
| P5-RELEASE-1.0 | Web Edition 1.0 ready for tagging | ✅ | All | QA complete; ready for external release |

**Web Phase 5 Exit Criteria:**
- [x] Sound system working with mute
- [x] PWA installable on mobile
- [x] Final art integrated
- [x] All tests passing (600+ tests)
- [x] Web 1.0 release versioned and documented

---

## WEB PHASE 6: Bible v1.4 Compliance

> **Phase 6 = Bring Web 1.0 up to Bible v1.4 specification.**
> Full backlog: `docs/PHASE6_BACKLOG.md`
> Review process: `docs/GRUNDY_PHASE_REVIEW_SOP.md`
> Test contract: `docs/BIBLE_COMPLIANCE_TEST.md`

### Phase 6 Tier 1 Summary

> **Tier 1** = Core compliance work that must ship for Phase 6.
> See detailed subtask tables below for implementation specifics.

| ID | Task | Phase | Status | Bible | Notes |
|----|------|-------|--------|-------|-------|
| P6-CORE-LOOP | Feeding, fullness, cooldown, evolution thresholds | 6 | ✅ Done | §4.3–4.4, §6.1 | BCT-FEED-*, BCT-EVOL-001; implemented |
| P6-ECON-WEB | Mini-game caps & Web gem rules | 6 | ✅ Done | §8.2–8.3 | BCT-ECON-*, BCT-GAME-*; already verified in code+tests |
| P6-HUD-CLEANUP | Production HUD vs debug HUD | 6 | ✅ Done | §4.4 | BCT-HUD-001, BCT-HUD-002; implemented |
| P6-PET-HOME | Active pet & Home behavior | 6 | ✅ Done | §14.5 | BCT-NAV-001; pet switch confirmation implemented |
| P6-ENV-ROOMS | Rooms Lite & time-of-day behavior | 6 | ✅ Done | §14.4 | BCT-ENV-*, BCT-ROOMS-*; implemented |
| P6-FTUE-INTRO | FTUE lore & intro performance | 6 | ✅ Done | §7.4 | BCT-FTUE-001, BCT-FTUE-002; lore from bible.constants.ts |
| P6-MOBILE-LAYOUT | Mobile core loop & nav | 6 | ✅ Done | §14.5–14.6 | BCT-LAYOUT-001, BCT-NAV-*; no-scroll viewport implemented |
| P6-QA-BCT | Bible Compliance tests (spec + E2E integration) | 6 | ✅ Done | — | 598 BCT tests passing; npm run test:bible command works |

### Tier 1 ↔ Subtask Mapping

| Tier 1 ID | Subtasks |
|-----------|----------|
| P6-CORE-LOOP | P6-CORE-COOLDOWN, P6-CORE-STUFFED, P6-CORE-SPAM |
| P6-ECON-WEB | P6-ECON-GEMS ✅, P6-ECON-CAP ✅, P6-ECON-FREE ✅ |
| P6-HUD-CLEANUP | P6-HUD-PRODUCTION, P6-HUD-DEBUG |
| P6-PET-HOME | P6-NAV-CONFIRM |
| P6-ENV-ROOMS | P6-ENV-ROOMS, P6-ENV-UI, P6-ENV-TOD, P6-MOOD-SYSTEM |
| P6-FTUE-INTRO | P6-FTUE-MODES |
| P6-MOBILE-LAYOUT | P6-MOBILE-LAYOUT, P6-NAV-GROUNDWORK |
| P6-QA-BCT | BCT spec tests, E2E tests, CI integration |

---

### Phase 6 Tier 1 Overview

| ID | Title | Phase | Status | Owner | Notes |
|----|-------|-------|--------|-------|-------|
| P6-CORE-LOOP | Feeding, fullness, cooldown, evolution thresholds | 6 | ✅ Complete | Unassigned | Bible §4.3–4.4, §6.1; BCT-FEED-*, BCT-EVOL-001 ✅ |
| P6-ECON-WEB | Mini-game caps & Web gem rules | 6 | ✅ Complete | Unassigned | Bible §8.2–8.3; BCT-ECON-*, BCT-GAME-*; Already verified ✅ |
| P6-HUD-CLEANUP | Production HUD vs debug HUD | 6 | ✅ Complete | Unassigned | Bible §4.4; BCT-HUD-* ✅ |
| P6-PET-HOME | Active pet & Home behavior | 6 | ✅ Complete | Unassigned | Bible §14.5; BCT-NAV-*, BCT-PET-* ✅ |
| P6-ENV-ROOMS | Rooms Lite & time-of-day behavior | 6 | ✅ Complete | Unassigned | Bible §14.4; BCT-ROOMS-*, BCT-ENV-* ✅ |
| P6-FTUE-INTRO | FTUE lore & intro performance | 6 | ✅ Complete | Unassigned | Bible §7.4; BCT-FTUE-*; lore from bible.constants.ts ✅ |
| P6-MOBILE-LAYOUT | Mobile core loop & nav | 6 | ✅ Complete | Unassigned | Bible §14.5–14.6; BCT-LAYOUT-*, BCT-NAV-*; no-scroll viewport ✅ |
| P6-QA-BCT | Bible Compliance tests (spec + E2E integration) | 6 | ✅ Complete | Unassigned | 598 BCT tests passing; npm run test:bible works; E2E file exists ✅ |

---

### P6-CORE: Core Loop Hardening (Bible §4.3–4.4)

> Enforce feeding rules that prevent spam-leveling and preserve "Daily Moments" rhythm.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-CORE-COOLDOWN | Implement 30-min feeding cooldown | ✅ | Store, HomeView | Bible §4.3 — Timer visible, 25% value during cooldown |
| P6-CORE-STUFFED | Block feeding when STUFFED (91-100) | ✅ | Store, FoodTray | Bible §4.4 — Pet refuses food entirely at STUFFED state |
| P6-CORE-SPAM | Prevent spam-feed exploitation | ✅ | Store | Bible §4.3 — Cooldown resets on each feed |

### P6-HUD: HUD Cleanup (Bible §4.4)

> Production HUD shows Bond only. Debug stats gated behind dev flag.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-HUD-PRODUCTION | Production HUD: Bond-only visible | ✅ | AppHeader, HomeView | Bible §4.4 — Bond + currencies visible; debug stats hidden |
| P6-HUD-DEBUG | Gate debug HUD behind dev flag | ✅ | Components | Bible §4.4 — `import.meta.env.DEV` check; DebugHud gated |

### P6-MOBILE: Mobile Layout & Navigation (Bible §14.5–14.6)

> On phone, pet + primary actions + nav + currencies visible without scroll.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-MOBILE-LAYOUT | Enforce mobile viewport constraints | ✅ | Layout, CSS | Bible §14.6 — Pet, actions, nav, currencies without scroll |
| P6-NAV-GROUNDWORK | Navigation structure groundwork | ✅ | BottomNav, App | Bible §14.5 — View test IDs (home-view, games-view, settings-view) |
| P6-NAV-CONFIRM | Add pet switch confirmation | ✅ | PetSelector | Bible §14.5 — "Switch to Grib?" modal with reassurance message |

### P6-ENV: Rooms Lite & Environment (Bible §14.4)

> Time-of-day + activity→room mapping per Bible spec.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-ENV-ROOMS | Implement activity→room mapping | ✅ | Environment system | Bible §14.4 — Feeding=Kitchen, Sleeping=Bedroom, Playing=Playroom |
| P6-ENV-UI | Room selection UI | ✅ | HomeView | Bible §14.4 — Explicit room switcher with precedence rule |
| P6-ENV-TOD | Time-of-day consistency | ✅ | Environment | Bible §14.4 — ToD ranges aligned: Morning 6-12, Day 12-17, Evening 17-21, Night 21-6 |
| P6-MOOD-SYSTEM | Full mood decay system | ✅ | Store, pet logic | Bible §4.5 — moodValue 0-100, decay, Grib/Plompo abilities |

### P6-ART: Art Integration (Bible §13.7)

> Sprite art in production; emoji/orb only in dev placeholders.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-ART-PRODUCTION | Stage-aware sprite resolution | ✅ | petSprites.ts, PetAvatar | Bible §13.7 — No orb fallback when sprites exist; resolvePetSprite + getStageAwarePetSprite |
| P6-ART-TEST | BCT-ART tests for sprite coverage | ✅ | bct-art.spec.ts | Bible §13.7 — 401 tests: BCT-ART-01 thru BCT-ART-06 for coverage, fallback, no-orb guarantee |

### P6-BRANDING: Branding & Visual Polish (QA Deferrals)

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-BRANDING | Replace placeholder PWA icons | ✅ | public/icons/ | Grundy icons wired: favicon, apple-touch-icon, manifest 192/512; manifest name/colors aligned |
| P6-ART-POSES | Extended pet sprite poses | ✅ | assets/pets/ | 11 poses wired: idle, happy, sad, sleeping, eating, eating_loved, ecstatic, excited, hungry, satisfied, crying |
| P6-T2-PET-BEHAVIORS | Pet pose behavior wiring | ✅ | PetAvatar, Store | Transient eating poses, mood-based expressions, pose priority system |
| P6-ART-PROPS | Room-specific prop art | ✅ | RoomProps.tsx | Visual props for Kitchen/Bedroom/Playroom/Living Room/Yard; CSS-based shapes |
| P6-ABILITY-UI | Ability activation indicators | ✅ | Components | P1-ABILITY-4 — AbilityIndicator component, toast-style triggers, bounce-in animation |
| P6-ABILITY-INTEGRATION | Wire ability triggers to store actions | ✅ | Store, GrundyPrototype | Munchlet/Grib/Ember/Chomper feed triggers + Fizz minigame trigger + Luxe gem trigger |

### P6-AUDIO: Audio Assets & Polish

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-AUDIO-ASSETS | Audio configuration audit | ✅ | src/audio/ | Config clean (no placeholder names); audio files not yet present |
| P6-AUDIO-ROOM | Room-specific ambience | ✅ | Audio system | Ambience config per room + crossfade (AUDIO_NOTES) |
| P6-AUDIO-TOD | Time-of-day volume variations | ✅ | Audio system | Volume multipliers: morning 0.9, day 1.0, evening 0.8, night 0.6 |

### P6-PWA: PWA Enhancements

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-PWA-PRECACHE | Shell + icons precaching | ✅ | service-worker.js | Shell assets, icons, splash precached |
| P6-PWA-UI | "Install Grundy" button | ✅ | SettingsView | Uses promptInstall(); shows when available (QA-005) |
| P6-PWA-UPDATE | Update notification | ✅ | App shell | "New version available" toast with refresh button |

### P6-FTUE: FTUE & Modes

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-FTUE-INTRO | FTUE lore & intro from Bible | ✅ | FTUE, bible.constants.ts | Lore lines pulled from bible.constants.ts; "*you*" emphasis preserved |
| P6-FTUE-MODES | Cozy vs Classic differentiation | ✅ | Game logic, bible.constants.ts | MODE_CONFIG with decay/penalty multipliers; mood/penalty wiring; FTUE copy updated; 38 BCT-MODE tests |

### P6-DOC: Documentation

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-DOC-BIBLE | Bible v1.4 merge | ✅ | docs/ | Merged v1.4 amendments |
| P6-DOC-ALIGN | Docs alignment to Bible v1.4 | ✅ | docs/ | PHASE6_BACKLOG, DEV_STATUS, TASKS, ROADMAP aligned |
| P6-DOC-ROADMAP | Roadmap update | ⬜ | docs/ | Phase 6+ roadmap from Web 1.0 baseline |

---

## DEFERRED SYSTEMS

> These tasks are planned for after Web 1.0 release.

### Art / Sprite State System (Deferred)

> Bible Section 13.6 — Connect stats to visual states.
> **Rationale:** Deferred until Web Phase 5 art integration.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P2-1 | Create `getDisplayState()` | ⬜ | 13.6 | Returns correct state based on priority |
| P2-2 | Implement transient states | ⬜ | 13.6 | Eating, excited, pooping states |
| P2-3 | Implement need states | ⬜ | 13.6 | Hungry, sad, crying at thresholds |
| P2-4 | Implement ambient states | ⬜ | 13.6 | Happy, ecstatic based on mood |
| P2-5 | Connect sprites to states | ⬜ | 13.6 | Pet shows correct sprite |
| P2-6 | Implement eating reactions | ⬜ | 13.6 | loved, liked, neutral, disliked |

### Sound & Vibration (Partially Implemented)

> Bible Section 12 — Audio feedback.
> **Note:** Core audio system implemented in P5-AUDIO. These tasks remain for extended features.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P9-1 | Create sound manager | ✅ | 12.1 | Web Audio + mute (via P5-AUDIO-CORE) |
| P9-2 | Implement UI sounds | ✅ | 12.1 | Tap, confirm, back (via P5-AUDIO-HOOKS) |
| P9-3 | Implement feeding sounds | 🟡 | 12.1 | pet_happy implemented; reaction variants deferred |
| P9-4 | Implement reward sounds | ✅ | 12.1 | mini_* tier sounds, level_up (via P5-AUDIO-HOOKS) |
| P9-5 | Implement pet sounds | 🟡 | 12.1 | pet_happy done; sad, hungry deferred |
| P9-6 | Implement vibration | ⬜ | 12.3 | Android patterns |
| P9-7 | Add volume settings | ⬜ | 12.4 | Master, Music, SFX sliders (toggles implemented) |

---

## PHASE 10.5: Lore Journal

> Bible Section 6.4 — Fragment collection system. (Renumbered from Phase 10; Weight & Sickness shipped as Phase 10 in Bible v1.8)

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P10-1 | Create journal data | ⬜ | 6.4 | Fragments, unlock states |
| P10-2 | Create journal UI | ⬜ | 6.4 | Codex view |
| P10-3 | Implement unlocks | ⬜ | 6.4 | Bond level triggers |
| P10-4 | Implement general lore | ⬜ | 6.4 | Tutorial, 7 days, 3 pets |
| P10-5 | Add preference notes | ⬜ | 6.4 | Auto-fill discovered |
| P10-6 | Implement rewards | ⬜ | 6.4 | Titles, cosmetics |

---

## PHASE 11-0: Gem Sources (Prerequisite)

> Bible Section 11.4 — Gem source implementations required before cosmetics. **Must complete before Phase 11.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-0-1 | Level-up gem award | ✅ | 11.4 | +5💎 on level up |
| P11-0-2 | First feed daily gem | ✅ | 11.4 | +1💎 on first feed each day |
| P11-0-3 | Login streak Day 7 gem | ✅ | 11.4 | +10💎 on 7-day streak |
| P11-0-4 | Gem sources BCT tests | ✅ | 11.4 | ~10 specs pass |

> **P11-0 Status:** ✅ COMPLETE — Branch: `claude/apply-bible-patch-3PPHc`, Commit: `3f319a4`

---

## PHASE 11-A: Cosmetics Foundations

> Bible Section 11.5.2–11.5.4. **Data layer + equip/unequip logic. No UI, no purchase, no render.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-A-1 | Add cosmetics to state | ✅ | 11.5.2 | Per-pet ownedCosmeticIds[], equippedCosmetics{} |
| P11-A-2 | Create stub catalog | ✅ | 11.5 | COSMETIC_CATALOG with test items |
| P11-A-3 | Implement equip/unequip | ✅ | 11.5.3 | equipCosmetic, unequipCosmetic actions |
| P11-A-4 | Ownership helpers | ✅ | 11.5.2 | petOwnsCosmetic, getPetCosmeticIds |
| P11-A-5 | Save migration v5→v6 | ✅ | — | Inject cosmetic fields into existing pets |
| P11-A-6 | P11-A BCT tests | ✅ | 11.5.2-4 | 7 BCT specs (OWN, EQ, UNEQ, MULTI, GEMS, NOSTAT) |

> **P11-A Status:** ✅ COMPLETE — Branch: `claude/apply-bible-patch-3PPHc`, Commit: `0ab4531`
>
> **BCT Specs Added:** BCT-COS-OWN-001, BCT-COS-EQ-001, BCT-COS-EQ-002, BCT-COS-UNEQ-001, BCT-COS-MULTI-001, BCT-COS-GEMS-001, BCT-COS-NOSTAT-001
>
> **Notes:** Catalog contains stub items for testing; real catalog population deferred to P11-B.

---

## PHASE 11-B: Cosmetics UI Wiring ✅

> Bible Section 11.5.2–11.5.4, §14.7.3, §14.8.3 (Pet-bound cosmetics). **Completed.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-B-1 | Shop cosmetics tab UI | ✅ | 14.7.3 | View cosmetics in shop |
| P11-B-2 | Inventory cosmetics UI | ✅ | 14.8.3 | Equip/unequip flows |
| P11-B-3 | BCT-COS-UI tests | ✅ | 11.5.2-4 | 6 BCT specs |

> **P11-B Status:** ✅ COMPLETE — Commit: `73f4e20`

---

## PHASE 11-C: Cosmetics Render Layering ✅

> Bible Section 11.5.3, §13.7 (Layer rendering). **Completed.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-C-1 | PetRender shared component | ✅ | 11.5.3 | Single render component for all surfaces |
| P11-C-2 | Layer z-order | ✅ | 11.5.3 | base < hat < accessory < outfit < aura |
| P11-C-3 | Placeholder badges | ✅ | 13.7 | Dev mode slot indicators |
| P11-C-4 | BCT-COS-RENDER tests | ✅ | 11.5.3 | 4 BCT specs |

> **P11-C Status:** ✅ COMPLETE — Commit: `0746627`

---

## PHASE 11-C1: Render Closeout ✅

> Multi-surface consistency. **Completed.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-C1-1 | PetAvatar→PetRender migration | ✅ | 11.5.3 | Delegates to shared component |
| P11-C1-2 | Multi-surface consistency | ✅ | 14.5 | HomeView, Inventory, Shop |
| P11-C1-3 | Compact mode placeholder suppression | ✅ | 13.7 | No placeholders in small avatars |

> **P11-C1 Status:** ✅ COMPLETE — Commit: `9dd71ac`

---

## PHASE 11-D: Cosmetics Purchase Plumbing ✅

> Bible Section 11.5.2 (Gem deduction, ownership grant). **Completed.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-D-1 | buyCosmetic store action | ✅ | 11.5.2 | Atomic gem deduction + ownership |
| P11-D-2 | ALREADY_OWNED error handling | ✅ | 11.5.2 | Prevents duplicate purchase |
| P11-D-3 | INSUFFICIENT_GEMS error | ✅ | 11.5.2 | Blocks when gems < price |
| P11-D-4 | No auto-equip | ✅ | 11.5.2 | Purchase != equip |
| P11-D-5 | BCT-COS-BUY tests | ✅ | 11.5.2 | 4 BCT specs |

> **P11-D Status:** ✅ COMPLETE — Commit: `9a61c92`

---

## PHASE 11-D1: Purchase UX Polish ✅

> Bible Section 11.5.2 (UX safety). **Completed.**

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-D1-1 | purchasingIds double-tap protection | ✅ | 11.5.2 | Prevents duplicate deductions |
| P11-D1-2 | shop-gems-balance test ID | ✅ | 14.7 | Visible balance in shop |
| P11-D1-3 | Immediate ownership feedback | ✅ | 11.5.2 | Sync state update |
| P11-D1-4 | BCT-COS-BUY-UI tests | ✅ | 11.5.2 | 2 BCT specs |

> **P11-D1 Status:** ✅ COMPLETE — Commit: `3032d9a`
>
> **Phase 11 Total BCT:** 31 specs (P11-0: 8, P11-A: 7, P11-B: 6, P11-C: 4, P11-D: 4, P11-D1: 2)

---

## PHASE 12: Future Systems (Deferred)

> Post-MVP features.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P12-1 | Season Pass design | ⏸️ | 11.9 | 30-tier system |
| P12-2 | Season Pass implementation | ⏸️ | 11.9 | Free + Premium tracks |
| P12-3 | Ad SDK integration | ⏸️ | 11.10 | Interstitials + rewarded |
| P12-4 | Rewarded ad placements | ⏸️ | 11.10 | 6 types |
| P12-5 | LiveOps scheduler | ⏸️ | 10 | Time-based events |
| P12-6 | Achievements system | ⏸️ | — | Full framework |

---

## TESTING TASKS

> Run after each phase completion.

| ID | Task | Status | Scope |
|----|------|--------|-------|
| T-1 | Core loop tests | ⬜ | Feed → XP → Level → Rewards |
| T-2 | Economy tests | ⬜ | Buy → Spend → Balance |
| T-3 | Multi-pet tests | ⬜ | Switch → State preserved |
| T-4 | Persistence tests | ⬜ | Refresh → State restored |
| T-5 | Mobile tests | ⬜ | Touch interactions |
| T-6 | PWA tests | ⬜ | Install to home |
| T-7 | FTUE tests | ⬜ | Complete <60s |
| T-8 | Mini-game tests | ⬜ | Rewards match Bible |

---

## TASK DEPENDENCIES

```
PHASE 0 (Pre-Flight + Toolchain) ←── BLOCKING
    │
    ▼
PHASE 1 (Core Alignment + Data Fixes)
    │
    ▼
PHASE 2 (Art/Sprite States)
    │
    ▼
┌───┬───┬───┬───┐
│   │   │   │   │
▼   ▼   ▼   ▼   ▼
P3  P4  P7  P8  P9
FTUE Shop Classic Mini Sound
        │
        ▼
      P5 (Inventory)
        │
        ▼
      P6 (Pet Slots)
        │
        ▼
┌───────┴───────┐
│               │
▼               ▼
P10             P11
Lore            Cosmetics
        │
        ▼
      P12 (Future)
```

---

## QUICK REFERENCE

### Bible Section Lookup

| Topic | Section |
|-------|---------|
| Vision & Pillars | 1 |
| Lore & World | 2 |
| Pet profiles & abilities | 3 |
| Core systems (mood, bond) | 4 |
| Food & feeding | 5 |
| Progression & unlocks | 6 |
| Onboarding (FTUE) | 7 |
| Mini-games | 8 |
| Cozy/Classic modes | 9 |
| Events & LiveOps | 10 |
| Economy & Shop | 11 |
| Sound & Vibration | 12 |
| Animation & Art | 13 |
| UI/UX | 14 |
| Technical specs | 15 |
| Coverage notes | 16 |

### File Lookup

| Feature | Primary File |
|---------|--------------|
| Game state | `src/game/store.ts` |
| Pet data | `src/data/pets.ts` |
| Food data | `src/data/foods.ts` |
| Shop data | `src/data/shop.ts` |
| Types | `src/types/index.ts` |
| Config | `src/data/config.ts` |
| Systems | `src/game/systems.ts` |

### P0-0 File Templates

When creating P0-0 files, use these patterns:

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**src/main.tsx:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**src/App.tsx:**
```typescript
import GrundyPrototype from './GrundyPrototype'

function App() {
  return <GrundyPrototype />
}

export default App
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## WEB PHASE 12: ACHIEVEMENTS, LOGIN STREAK, NOTIFICATIONS, SEASON PASS, EVENTS

> **Bible v1.11 Reference:** §17 (Achievements), §10.3.1-2 (Login Streak + Mystery Box), §11.6.2-3 (Notification Center), §11.9 (Season Pass), §10.7 (Event Framework)

### Phase 12-A: Achievements [Bible §17]

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P12-ACH-STORE | Create achievements store | ⬜ | src/store | Achievement state, unlock tracking |
| P12-ACH-DATA | Implement 25 achievements per §17.2 | ⬜ | src/data | Achievement definitions |
| P12-ACH-UI | Create achievement UI (toast + screen) | ⬜ | src/components | Achievements screen, unlock toasts |
| P12-ACH-BCT | Add BCT tests (~40) | ⬜ | src/__tests__ | BCT-ACH-* test suite |

### Phase 12-B: Login Streak + Mystery Box [Bible §10.3.1-2]

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P12-STREAK-STORE | Implement 7-day streak tracker | ⬜ | src/store | currentDay, lastClaimDate, streaksCompleted |
| P12-STREAK-UI | Create streak UI | ⬜ | src/components | Daily reward modal, progress indicator |
| P12-MYSTERY-STORE | Implement Mystery Box loot table | ⬜ | src/game | 5-tier probability table per §10.3.2 |
| P12-MYSTERY-UI | Create Mystery Box UI | ⬜ | src/components | Box opening animation, reveal |
| P12-STREAK-BCT | Add BCT tests (~25) | ⬜ | src/__tests__ | BCT-STREAK-*, BCT-MYSTERY-* |

### Phase 12: Notification Center [Bible §11.6.2-3] ✅

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P12-NOTIF-STORE | Create notification history store | ✅ | src/stores | notificationStore.ts with Zustand |
| P12-NOTIF-ENGINE | Implement trigger engine per §11.6.3 | ✅ | src/services | eventEmitter.ts, notificationMapper.ts, suppression logic |
| P12-NOTIF-UI | Create Notification Center UI | ✅ | src/components | Toast.tsx, ToastManager.tsx, NotificationCenter.tsx |
| P12-NOTIF-LINK | Add deep links | ✅ | src/utils | navigationUtils.ts with navigateToTarget() |
| P12-NOTIF-BCT | Add BCT tests (~35) | ✅ | src/__tests__ | bct-notifications.spec.ts (BCT-NOTIF-*, BCT-TRIGGER-*) |

### Phase 12-C: Season Pass Free Track [Bible §11.9]

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P12-PASS-STORE | Create season pass store | ⬜ | src/store | Free track only (Web) |
| P12-PASS-REWARDS | Implement free track rewards | ⬜ | src/data | Reward tiers per §11.9 |
| P12-PASS-UI | Create season pass UI | ⬜ | src/components | Progress, reward claims |
| P12-PASS-BCT | Add BCT tests (~20) | ⬜ | src/__tests__ | BCT-PASS-* |

### Phase 12-D: Event Framework [Bible §10.7]

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P12-EVENT-STORE | Create event system store | ⬜ | src/store | Event, EventProgress types |
| P12-EVENT-CURRENCY | Implement event currency | ⬜ | src/game | Earning, spending, expiry |
| P12-EVENT-SHOP | Create event shop UI | ⬜ | src/components | Event-exclusive items |
| P12-EVENT-TEST | Create test event (Winter Wonderland) | ⬜ | src/data | First event per §10.7.7 |
| P12-EVENT-BCT | Add BCT tests (~15) | ⬜ | src/__tests__ | BCT-EVENT-* |

---

## WEB PHASE 13: SESSION MINI-GAMES [Bible §8.5]

> **Bible v1.11 Reference:** §8.5 Session Mini-Games

### Phase 13: Session Mini-Games

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P13-SHARED | Implement shared systems (pause, tutorial, high scores) | ⬜ | src/games | Common session game infrastructure |
| P13-SNAKE | Implement Snake (P1) | ⬜ | src/games/snake | Hungry Hungry Grundy per GRUNDY_SNAKE_DESIGN.md |
| P13-TETRIS | Implement Tetris (P2) | ⬜ | src/games/tetris | Stack Snacks per GRUNDY_STACK_SNACKS_DESIGN.md |
| P13-RUNNER | Implement Runner (P3) | ⬜ | src/games/runner | Munch Run per GRUNDY_MUNCH_RUN_DESIGN.md |
| P13-BCT | Add BCT tests (~50) | ⬜ | src/__tests__ | BCT-SESSION-* |

---

## [UNITY LATER] PUSH NOTIFICATIONS [Bible §12.5-§12.8]

> **Platform Tag:** These tasks are deferred to Unity/mobile builds. Web Edition uses in-app notifications only.

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| UNITY-PUSH | OS push infrastructure | ⬜ | Unity | §12.5 Push Notifications |
| UNITY-BADGE | App icon badge | ⬜ | Unity | §12.6 App Icon Badge |
| UNITY-CHANNELS | Notification channels | ⬜ | Unity | §12.7 Android channels |
| UNITY-SETTINGS | Settings UI | ⬜ | Unity | §12.8 Notification Settings |

---

## Notes

### Pre-Flight Findings (December 9, 2024)

1. **README describes full prototype that doesn't exist** — Only GrundyPrototype.tsx exists
2. **GrundyPrototype.tsx is functional** — Use as starting point, not throwaway
3. **120 sprites confirmed** — Art assets are ready
4. **store.ts and systems.ts exist** — But have type errors and wrong pet names
5. **No public/ folder** — Must create for PWA

### Assumptions

1. GrundyPrototype.tsx is the intended prototype to wrap with App.tsx
2. Deprecated pet names are legacy and will be fixed in P1-A
3. Bible values override any conflicting code values
4. Vitest is the test framework (per package.json)

### Sources

- `docs/GRUNDY_MASTER_BIBLE.md` v1.11
- `docs/ASSET_MANIFEST.md` (120 sprites)
- `Pre_flight_2025-12-09.md` (diagnostic report)
- `ORCHESTRATOR.md` (agent workflow)

---

*Update this file as you complete tasks. Keep it accurate.*

---

**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
