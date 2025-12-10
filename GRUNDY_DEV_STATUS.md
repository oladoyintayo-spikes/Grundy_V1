# GRUNDY_DEV_STATUS.md

# Grundy Web Prototype — Development Status

**Last Updated:** December 10, 2024 (CE-P3-PLAN)
**Current Phase:** Web Phase 3 — IN PROGRESS (Navigation ✅, Environment ⬜)
**Next Phase:** Web Phase 4 (FTUE / Onboarding)

---

## Source of Truth

| Resource | Location |
|----------|----------|
| **Design SoT** | `docs/GRUNDY_MASTER_BIBLE.md` |
| **Task List** | `TASKS.md` |
| **Agent Workflow** | `ORCHESTRATOR.md` |
| **Bible Update Log** | `BIBLE_UPDATE_BACKLOG.md` |

---

## Web Edition Phase Structure

| Web Phase | Theme | Status | Summary |
|-----------|-------|--------|---------|
| **Web Phase 0** | Setup & Toolchain | ✅ COMPLETE | Infrastructure, toolchain, PWA, GitHub Pages deploy |
| **Web Phase 1** | Core Loop & Data | ✅ COMPLETE | Data layer, core loop, abilities, docs alignment |
| **Web Phase 2** | Mini-Games & Infra | ✅ COMPLETE | All 5 mini-games implemented and tested |
| **Web Phase 3** | Navigation & Environment | 🟡 IN PROGRESS | P3-NAV ✅, P3-ENV ⬜ |
| **Web Phase 4** | FTUE / Onboarding | ⬜ NOT STARTED | Splash → Age Gate → World Intro → Pet Select |
| **Web Phase 5** | Polish / Web 1.0 | ⬜ NOT STARTED | Sound, PWA, art integration, release |

### Post-Web 1.0

| System | Status | Summary |
|--------|--------|---------|
| Art / Sprite States | ⬜ DEFERRED | Connect stats to visual states (getDisplayState) |
| Sound & Vibration | ⬜ DEFERRED | Audio feedback, vibration patterns |
| Shop & Economy | ⬜ NOT STARTED | Shop tabs, gem confirm, milestones |
| Inventory | ⬜ NOT STARTED | Capacity, expansion items |
| Pet Slots | ⬜ NOT STARTED | Multi-pet care system |
| Classic Mode | ⬜ NOT STARTED | Sickness, neglect, runaway |

---

## Web Phase 1 — COMPLETE

**Theme:** Complete Data Layer & Core Loop Alignment

### Deliverables

| Area | Status | Details |
|------|--------|---------|
| **Pet Data** | ✅ | 8 pets with unique abilities (Munchlet, Grib, Plompo, Fizz, Ember, Chomper, Whisp, Luxe) |
| **Food Data** | ✅ | 10 foods with complete 80-entry affinity matrix |
| **Pet Unlock System** | ✅ | Starter pets (3) + unlock requirements for 5 premium pets |
| **Ability System** | ✅ | All 8 pet abilities implemented and tested |
| **Store Integration** | ✅ | Zustand store with pet selection, unlocking, feeding |
| **Evolution Thresholds** | ✅ | Aligned: Baby 1-9, Youth 10-24, Evolved 25+ |
| **Documentation** | ✅ | Bible §6.1, README, and backlog all synchronized |
| **Test Coverage** | ✅ | 102 Vitest tests passing |

### Evolution Threshold Alignment (P1-DOC-1)

| Stage | Old Bible | Code (SoT) | New Bible |
|-------|-----------|------------|-----------|
| Baby | 1-6 | 1-9 | 1-9 |
| Youth | 7-12 | 10-24 | 10-24 |
| Evolved | 13+ | 25+ | 25+ |

**Rationale:** Code wins for pacing. Slower evolution aligns with "Curved progression — fast early, slow late" design philosophy (Bible §6.2).

### Exit Criteria Met

| Check | Status |
|-------|--------|
| All 8 pets defined | ✅ |
| All 10 foods defined | ✅ |
| Affinity matrix complete (80 entries) | ✅ |
| Default pet is `munchlet` | ✅ |
| All 8 abilities implemented | ✅ |
| All tests pass (`npm test -- --run`) | ✅ |
| Build passes (`npm run build`) | ✅ |
| Bible/Code/README aligned | ✅ |

### Remaining Polish (Low Priority)

| Task | Status | Notes |
|------|--------|-------|
| P1-ABILITY-4 | ⬜ | UI indicators for ability triggers (nice-to-have) |
| P1-ART-1 | ⏸️ | PWA icons (blocked on branding) |

---

## Web Phase 2 — COMPLETE (Mini-Games)

**Theme:** Bible Section 8 — All 5 mini-games implemented.

### Mini-Games Implemented

| Game | Tests | Status | Notes |
|------|-------|--------|-------|
| Snack Catch | 27 | ✅ | 60s arcade catch game |
| Memory Match | 39 | ✅ | 90s card matching game |
| Pips | 38 | ✅ | 120s tile matching game |
| Rhythm Tap | 43 | ✅ | Music/timing rhythm game |
| Poop Scoop | 41 | ✅ | 60s cleanup action game |
| Unified Suite | 40 | ✅ | Cross-game invariants |

### Rules Enforced (LOCKED)

| Rule | Value |
|------|-------|
| Energy cost | 10 per game |
| Daily cap | 3 rewarded plays per game |
| First daily | FREE |
| Gems from mini-games | **NEVER** |
| Rewards | Small helpful gifts only |

---

## FTUE / Narrative

### World Intro Backstory (LOCKED)

The following copy is canonical and used across all onboarding documentation:

> Sometimes, when a big feeling is left behind…
> A tiny spirit called a Grundy wakes up.
> One of them just found *you*.

| Document | Status | Section |
|----------|--------|---------|
| `GRUNDY_ONBOARDING_FLOW.md` | ✅ | Screen 2 – World Intro |
| `GRUNDY_LORE_CODEX.md` | ✅ | Short World Intro (FTUE Copy) |
| `GRUNDY_MASTER_BIBLE.md` | ✅ | §7.4 Screen 2: World Intro |

**Task ID:** P4-FTUE-LORE (completed December 10, 2024)

---

## Build & Test Status

| Command | Status | Notes |
|---------|--------|-------|
| `npm run build` | ✅ PASSING | Production build succeeds |
| `npm test -- --run` | ✅ PASSING | 320 tests passing |

---

## Known Issues

*No critical issues at this time.*

### Resolved Issues

| Issue | Resolution | Date |
|-------|------------|------|
| Evolution threshold drift (Bible 7/13 vs Code 10/25) | Bible updated to match code (P1-DOC-1) | 2024-12-10 |
| Evolution stage naming (`adult` vs `evolved`) | Code renamed to `evolved` (P1-CORE-2) | 2024-12-10 |
| README starting gems (showed 0, should be 10) | README updated | 2024-12-10 |
| Mini-game gem reward discrepancy | Bible §8 updated: mini-games never award gems; Rainbow tier = coins/XP/food only (P2-DOC-2) | 2024-12-10 |

---

## What's Working

### Core Features
- Pet feeding with affinity-based reactions
- XP gain and level progression
- Mood system with decay
- Currency system (coins/gems)
- Pet selection and switching
- Pet unlock via gems

### Data Layer
- 8 pets with abilities and unlock requirements
- 10 foods with full affinity matrix
- Config-driven evolution thresholds
- XP formula: `20 + (L² × 1.4)`

### Infrastructure
- React 18 + TypeScript (strict mode)
- Zustand state management with persistence
- Vitest test suite (102 tests)
- Vite build system
- PWA manifest
- GitHub Pages deployment
- Error boundary

---

## Next Steps (Web Phase 3 → 4)

### Web Phase 3: Environment (Remaining)

1. P3-ENV-1: Time-of-day theming (Morning/Day/Evening/Night)
2. P3-ENV-2: Room contexts (Kitchen/Bedroom/Playroom/Yard)
3. P3-ENV-3: Hook nav/views into room/time context

### Web Phase 4: FTUE / Onboarding

1. P4-FTUE-CORE: Implement full FTUE flow in UI
2. P4-1: Audit current FTUE vs Bible
3. P4-2: Implement world intro screen
4. P4-3: Add pet origin snippets
5. P4-6: Implement mode select (Cozy vs Classic)
6. P4-8: Verify <60s timing

---

## Verification Commands

```bash
# Build
npm run build

# Test
npm test -- --run

# Development
npm run dev
```

---

*This file is auto-maintained. For task details, see `TASKS.md`.*
