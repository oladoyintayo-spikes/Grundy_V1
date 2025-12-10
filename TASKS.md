# TASKS.md
## Grundy Development Task List

**Last Updated:** December 10, 2024  
**Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md`  
**Pre-Flight Report:** December 9, 2024 ✅

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

## PHASE 0: Pre-Flight & Toolchain (BLOCKING)

> ⚠️ NOTHING ELSE CAN PROCEED UNTIL PHASE 0 IS COMPLETE

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

## PHASE 1: Complete Data Layer & Core Loop Alignment

> **Theme:** Unify the data layer and align with Bible specs.
>
> **Primary Bottleneck:** store.ts uses `'sprout'` as default pet, but this ID doesn't exist in pets.ts. The affinity matrix only covers 3×8=24 entries; Bible requires 8×10=80.

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
| P1-CORE-4 | Audit XP/evolution formulas | ⬜ | §6.1-2 | — | Verify against Bible; document any code-wins decisions |

### P1-ABILITY: Implement Pet Abilities

> Each pet's special ability triggers correctly per Bible §3.7.

| ID | Task | Status | Bible | Blocked By | Notes |
|----|------|--------|-------|------------|-------|
| P1-ABILITY-1 | Create ability effect system | ✅ | §3.7 | P1-DATA-5 | `abilities.ts` with helper functions |
| P1-ABILITY-2 | Implement starter abilities | ✅ | §3.7 | P1-ABILITY-1 | Munchlet +10% bond, Grib -20% mood, Plompo -20% decay |
| P1-ABILITY-3 | Implement unlock pet abilities | ✅ | §3.7 | P1-ABILITY-1 | Fizz, Ember, Chomper, Whisp, Luxe all implemented |
| P1-ABILITY-4 | Add ability trigger indicators | ⬜ | §3.7 | P1-ABILITY-2 | Show "+25% 🎮" when ability activates (UI work) |

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
| P1-DOC-1 | Apply Bible Update Backlog | ⬜ | `BIBLE_UPDATE_BACKLOG.md` | Evolution levels: code wins (youth=10, adult=25) |
| P1-DOC-2 | Update README starting gems | ⬜ | `README.md` | Line 203 says 0 gems, should be 10 |

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
| All 8 pets defined | `getAllPets().length === 8` | ⬜ |
| All 10 foods defined | `getAllFoods().length === 10` | ⬜ |
| Affinity matrix complete | 80 entries, no `undefined` | ⬜ |
| Default pet is `munchlet` | `resetGame()` → `pet.id === 'munchlet'` | ⬜ |
| All 8 abilities implemented | Unit tests pass | ⬜ |
| All tests pass | `npm test -- --run` exits 0 | ⬜ |
| Build passes | `npm run build` exits 0 | ⬜ |

### P1-CORE: Core System Naming Alignment

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-CORE-2 | Rename 'adult' evolution stage to 'evolved' | ✅ | types, config, systems, prototype | All references updated; Bible naming §6.1 |

### P1-UI: UI Integration

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-UI-01 | Connect GrundyPrototype.tsx to Zustand store | ✅ | GrundyPrototype.tsx, store.ts | Uses Zustand store + canonical pets.ts + foods.ts |

---

## PHASE 2: Art / Sprite State System

> Bible Section 13.6 — Connect stats to visual states.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P2-1 | Create `getDisplayState()` | ⬜ | 13.6 | Returns correct state based on priority |
| P2-2 | Implement transient states | ⬜ | 13.6 | Eating, excited, pooping states |
| P2-3 | Implement need states | ⬜ | 13.6 | Hungry, sad, crying at thresholds |
| P2-4 | Implement ambient states | ⬜ | 13.6 | Happy, ecstatic based on mood |
| P2-5 | Connect sprites to states | ⬜ | 13.6 | Pet shows correct sprite |
| P2-6 | Implement eating reactions | ⬜ | 13.6 | loved, liked, neutral, disliked |

**Phase 2 Exit Criteria:**
- [ ] Pet sprite changes based on state
- [ ] All eating animations work
- [ ] State priority order correct

---

## PHASE 3: FTUE / Onboarding Alignment

> Bible Section 7 — Complete onboarding flow.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P3-1 | Audit current FTUE vs Bible | ⬜ | 7.x | Document all gaps |
| P3-2 | Implement world intro | ⬜ | 7.3 | 5-second lore snippet |
| P3-3 | Add pet origin snippets | ⬜ | 7.4 | 2-line origin + loves/hates |
| P3-4 | Implement locked pet teasers | ⬜ | 7.4 | Partial lore for locked pets |
| P3-5 | Add personality dialogue | ⬜ | 7.6 | Pet-specific greetings |
| P3-6 | Implement mode select | ⬜ | 7.7 | Cozy vs Classic choice |
| P3-7 | Enforce FTUE rules | ⬜ | 7.8 | No monetization, first reaction positive |
| P3-8 | Verify <60s timing | ⬜ | 7.1 | Total onboarding under 60 seconds |

**Phase 3 Exit Criteria:**
- [ ] New player can complete FTUE in <60s
- [ ] Mode selection works
- [ ] First feeding always positive

---

## PHASE 4: Shop System

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

## PHASE 8: Mini-Games

> Bible Section 8 — Complete all 4 mini-games.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P8-1 | Audit Snack Catch | ⬜ | 8.3 | Match Bible scoring |
| P8-2 | Implement energy system | ⬜ | 8.2 | 50 max, 10/game, first free |
| P8-3 | Implement Memory Match | ⬜ | 8.4 | 4×4, 60s |
| P8-4 | Implement Rhythm Tap | ⬜ | 8.5 | Timing, 30-60s |
| P8-5 | Implement Poop Scoop | ⬜ | 8.6 | Tap-to-clean, 60s |
| P8-6 | Implement pet abilities | ⬜ | 8.1 | Whisp peek, Plompo slow-mo |
| P8-7 | Add daily high scores | ⬜ | 8.1 | Track per game |

---

## PHASE 9: Sound & Vibration

> Bible Section 12 — Audio feedback.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P9-1 | Create sound manager | ⬜ | 12.1 | Web Audio + mute |
| P9-2 | Implement UI sounds | ⬜ | 12.1 | Tap, menu, modal |
| P9-3 | Implement feeding sounds | ⬜ | 12.1 | Basic, liked, loved, disliked |
| P9-4 | Implement reward sounds | ⬜ | 12.1 | XP, coin, gem, level up |
| P9-5 | Implement pet sounds | ⬜ | 12.1 | Happy, sad, hungry |
| P9-6 | Implement vibration | ⬜ | 12.3 | Android patterns |
| P9-7 | Add volume settings | ⬜ | 12.4 | Master, Music, SFX, Vibration |

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
