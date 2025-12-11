# TASKS.md
## Grundy Development Task List

**Last Updated:** December 11, 2024 (P6-TASKS-TIER1-COMPLETE)
**Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md`
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

### Shop System

> Bible Section 11.5 — Complete shop implementation.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P4-1 | Audit shop vs Bible | ⬜ | 11.5 | Document gaps |
| P4-2 | Implement shop tabs | ⬜ | 11.5 | Food, Cosmetics, Utility, Bundles, Event |
| P4-3 | Implement tab visibility | ⬜ | 11.5 | Utility Lv5+, Bundles Lv3+, Event during events |
| P4-4 | Add all Bible items | ⬜ | 11.5 | Complete catalog |
| P4-5 | Implement visibility rules | ⬜ | 11.5 | Level-locked gray, owned shows ✓ |
| P4-6 | Add "Recommended" section | ⬜ | 11.5 | Context-aware recommendations |
| P4-7 | Add gem confirm dialog | ⬜ | 11.1 | Confirm for ≥50 gems |
| P4-8 | Add shop milestones | ⬜ | 11.5 | Achievement badges |

---

## PHASE 5: Inventory System

> Bible Section 11.7 — Inventory expansion.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P5-1 | Add inventory capacity | ⬜ | 11.7 | Default 15 |
| P5-2 | Implement capacity check | ⬜ | 11.7 | Block if full |
| P5-3 | Add expansion items | ⬜ | 11.7 | 25/50/100/150 gems |
| P5-4 | Implement expansion | ⬜ | 11.7 | +5 per purchase, max 35 |
| P5-5 | Show capacity in UI | ⬜ | 11.7 | "12/15" display |

---

## PHASE 6: Pet Slots (Multi-Pet)

> Bible Section 11.6 — Multi-pet care system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P6-1 | Add pet slots to state | ⬜ | 11.6 | `activeSlots`, `maxSlots` |
| P6-2 | Implement slot purchase | ⬜ | 11.6 | 100/150/200 gems |
| P6-3 | Update pet selector | ⬜ | 11.6 | Assign/swap slots |
| P6-4 | Implement parallel decay | ⬜ | 11.6 | All slotted pets decay |
| P6-5 | Update notifications | ⬜ | 11.6 | Any pet can trigger |
| P6-6 | Add slot UI | ⬜ | 11.6 | Active indicator, quick-switch |

---

## PHASE 7: Classic Mode

> Bible Section 9 — Full neglect system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P7-1 | Implement sickness trigger | ⬜ | 9.4 | Hunger=0 4h OR overweight/dirty |
| P7-2 | Implement sick state | ⬜ | 9.4 | 2× decay, can't play games |
| P7-3 | Implement medicine | ⬜ | 9.4 | Instant cure |
| P7-4 | Implement weight system | ⬜ | 5.7 | Hidden 0-100, visual stages |
| P7-5 | Implement neglect warnings | ⬜ | 9.4 | 4-stage warning |
| P7-6 | Implement runaway | ⬜ | 9.4 | Pet leaves after neglect |
| P7-7 | Implement return options | ⬜ | 9.4 | 48h wait OR 25 gems, bond -50% |
| P7-8 | Hide care items in Cozy | ⬜ | 9.4 | Medicine not visible |

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
| P6-QA-BCT | Bible Compliance tests (spec + E2E integration) | 6 | ✅ Done | — | 133 BCT tests passing; npm run test:bible command works |

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
| P6-QA-BCT | Bible Compliance tests (spec + E2E integration) | 6 | ✅ Complete | Unassigned | 133 BCT tests passing; npm run test:bible works; E2E file exists ✅ |

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
| P6-ART-PRODUCTION | Verify sprites in production builds | 🟡 | PetAvatar | Bible §13.7 — Verify no emoji fallback in prod |
| P6-ART-TEST | Add visual regression test | ⬜ | Tests | Bible §13.7 — Test no emoji where sprites should be |

### P6-BRANDING: Branding & Visual Polish (QA Deferrals)

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-BRANDING | Replace placeholder PWA icons | ⬜ | public/icons/ | Real branded icons for manifest & PWA (QA-001) |
| P6-ART-POSES | Extended pet sprite poses | ✅ | assets/pets/ | 11 poses wired: idle, happy, sad, sleeping, eating, eating_loved, ecstatic, excited, hungry, satisfied, crying |
| P6-T2-PET-BEHAVIORS | Pet pose behavior wiring | ✅ | PetAvatar, Store | Transient eating poses, mood-based expressions, pose priority system |
| P6-ART-PROPS | Room-specific prop art | ⬜ | assets/rooms/ | Replace placeholder accent badges (ART_NOTES) |
| P6-ABILITY-UI | Ability activation indicators | ✅ | Components | P1-ABILITY-4 — AbilityIndicator component, toast-style triggers |

### P6-AUDIO: Audio Assets & Polish

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-AUDIO-ASSETS | Add real audio files | ⬜ | public/audio/ | Hook actual SFX/BGM assets (QA-002) |
| P6-AUDIO-ROOM | Room-specific music | ⬜ | Audio system | Different tracks per room (AUDIO_NOTES) |
| P6-AUDIO-TOD | Time-of-day ambience | ⬜ | Audio system | Morning/evening/night variations (AUDIO_NOTES) |

### P6-PWA: PWA Enhancements

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-PWA-PRECACHE | vite-plugin-pwa integration | ⬜ | vite.config.ts, SW | Richer precache manifest (PWA_NOTES) |
| P6-PWA-UI | "Install Grundy" button | ⬜ | SettingsView | Uses existing promptInstall() (QA-005) |
| P6-PWA-UPDATE | Update notification | ⬜ | App shell | "New version available" toast (PWA_NOTES) |

### P6-FTUE: FTUE & Modes

| ID | Task | Status | Scope | Notes |
|----|------|--------|-------|-------|
| P6-FTUE-INTRO | FTUE lore & intro from Bible | ✅ | FTUE, bible.constants.ts | Lore lines pulled from bible.constants.ts; "*you*" emphasis preserved |
| P6-FTUE-MODES | Cozy vs Classic differentiation | ⬜ | Game logic | Actual gameplay differences per mode |

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

## PHASE 10: Lore Journal

> Bible Section 6.4 — Fragment collection system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P10-1 | Create journal data | ⬜ | 6.4 | Fragments, unlock states |
| P10-2 | Create journal UI | ⬜ | 6.4 | Codex view |
| P10-3 | Implement unlocks | ⬜ | 6.4 | Bond level triggers |
| P10-4 | Implement general lore | ⬜ | 6.4 | Tutorial, 7 days, 3 pets |
| P10-5 | Add preference notes | ⬜ | 6.4 | Auto-fill discovered |
| P10-6 | Implement rewards | ⬜ | 6.4 | Titles, cosmetics |

---

## PHASE 11: Cosmetics System

> Bible Section 11.5 (Cosmetics category).

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-1 | Add cosmetics to state | ⬜ | 11.5 | owned, equipped |
| P11-2 | Create cosmetics data | ⬜ | 11.5 | All items with rarity |
| P11-3 | Implement purchase | ⬜ | 11.5 | Gems only |
| P11-4 | Implement equip | ⬜ | 11.5 | Hat, accessory, aura |
| P11-5 | Render cosmetics | ⬜ | 11.5 | Overlay on sprite |
| P11-6 | Implement rarity badges | ⬜ | 11.5 | Common→Legendary borders |

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

- `docs/GRUNDY_MASTER_BIBLE.md` v1.3
- `docs/ASSET_MANIFEST.md` (120 sprites)
- `Pre_flight_2025-12-09.md` (diagnostic report)
- `ORCHESTRATOR.md` (agent workflow)

---

*Update this file as you complete tasks. Keep it accurate.*
