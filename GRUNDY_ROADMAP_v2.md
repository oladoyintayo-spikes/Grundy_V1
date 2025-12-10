# GRUNDY_ROADMAP_v2.md

# Grundy Web Edition — Development Roadmap

**Version:** 2.0
**Last Updated:** December 10, 2024 (CE-P3-PLAN)
**Target:** Web 1.0 Release

---

## Overview

This roadmap defines the path to **Web 1.0** — the first complete, playable version of Grundy for web browsers. The Unity edition will follow separately.

### Web Edition Goals

1. **Playable core loop** — Feed, bond, evolve
2. **5 mini-games** — Snack Catch, Memory Match, Pips, Rhythm Tap, Poop Scoop
3. **Navigation shell** — Home, Games, Settings
4. **FTUE** — New player onboarding in <60 seconds
5. **PWA** — Installable on mobile devices

---

## Web Phase Structure

```
Web Phase 0: Setup & Toolchain ✅
    │
    ▼
Web Phase 1: Core Loop & Data ✅
    │
    ▼
Web Phase 2: Mini-Games & Infra ✅
    │
    ▼
Web Phase 3: Navigation & Environment 🟡
    │
    ▼
Web Phase 4: FTUE / Onboarding
    │
    ▼
Web Phase 5: Polish / Web 1.0
    │
    ▼
[ WEB 1.0 RELEASE ]
```

---

## Phase Details

### Web Phase 0: Setup & Toolchain ✅

**Theme:** Get the build working.

| Deliverable | Status |
|-------------|--------|
| Vite + React + TypeScript | ✅ |
| Tailwind CSS | ✅ |
| Vitest test suite | ✅ |
| PWA manifest | ✅ |
| GitHub Pages deploy | ✅ |
| Error boundary | ✅ |

---

### Web Phase 1: Core Loop & Data ✅

**Theme:** Complete data layer aligned with Bible specs.

| Deliverable | Status |
|-------------|--------|
| 8 pets with abilities | ✅ |
| 10 foods with 80-entry affinity matrix | ✅ |
| Pet unlock system | ✅ |
| Zustand store | ✅ |
| Evolution thresholds (Baby/Youth/Evolved) | ✅ |
| Documentation alignment | ✅ |

---

### Web Phase 2: Mini-Games & Infra ✅

**Theme:** All 5 mini-games from Bible §8.

| Deliverable | Status | Tests |
|-------------|--------|-------|
| Energy system (50 max, 10/game) | ✅ | — |
| Reward tier calculator | ✅ | — |
| Mini-game hub UI | ✅ | — |
| Snack Catch | ✅ | 27 |
| Memory Match | ✅ | 39 |
| Pips | ✅ | 38 |
| Rhythm Tap | ✅ | 43 |
| Poop Scoop | ✅ | 41 |
| Unified test suite | ✅ | 40 |

**Rules (LOCKED):**
- 10 energy per game
- 3 rewarded plays daily per game
- First daily FREE
- Mini-games NEVER award gems

---

### Web Phase 3: Navigation & Environment 🟡

**Theme:** App shell, navigation, time-of-day theming.

| Task Group | Status | Tasks |
|------------|--------|-------|
| P3-NAV: App Shell | ✅ | AppView model, header, bottom nav, Games tab |
| P3-ENV: Environment | ⬜ | Time-of-day theming, rooms, view integration |

**Exit Criteria:**
- [x] App header shows pet, coins, energy
- [x] Bottom nav switches Home/Games/Settings
- [x] Games tab shows mini-game hub
- [ ] Time-of-day theming applied
- [ ] Rooms integrated into views

---

### Web Phase 4: FTUE / Onboarding ⬜

**Theme:** New player experience from Bible §7.

| Screen | Status | Description |
|--------|--------|-------------|
| Splash | ⬜ | Title + "Tap to Start" |
| Age Gate | ⬜ | Birth year picker (COPPA) |
| World Intro | ⬜ | 10-second lore snippet (LOCKED copy) |
| Pet Selection | ⬜ | 3 starters, origin snippets, locked teasers |
| Mode Select | ⬜ | Cozy vs Classic |
| First Session | ⬜ | Guided feeding, first reaction always positive |

**World Intro Copy (LOCKED):**
> Sometimes, when a big feeling is left behind…
> A tiny spirit called a Grundy wakes up.
> One of them just found *you*.

**Exit Criteria:**
- [ ] New player completes FTUE in <60s
- [ ] Mode selection works
- [ ] First feeding always positive
- [ ] World Intro shows LOCKED copy

---

### Web Phase 5: Polish / Web 1.0 ⬜

**Theme:** Final polish for release.

| Task | Status | Description |
|------|--------|-------------|
| P5-SOUND-1 | ⬜ | Basic SFX/BGM + mute setting |
| P5-PWA-1 | ⬜ | Icons, service worker, offline support |
| P5-ART-1 | ⬜ | Replace emoji placeholders with final art |
| P5-QA-1 | ⬜ | Full test pass + release checklist |

**Exit Criteria:**
- [ ] Sound system working with mute
- [ ] PWA installable on mobile
- [ ] Final art integrated
- [ ] All tests passing
- [ ] Web 1.0 release tagged

---

## Post-Web 1.0 Systems

These features are planned for after the initial web release:

| System | Bible Section | Priority |
|--------|---------------|----------|
| Art / Sprite State System | §13.6 | Medium |
| Sound & Vibration (full) | §12 | Medium |
| Shop & Economy | §11.5 | High |
| Inventory Expansion | §11.7 | Medium |
| Pet Slots (Multi-Pet) | §11.6 | Medium |
| Classic Mode | §9 | Low |
| Lore Journal | §6.4 | Low |
| Cosmetics | §11.5 | Low |
| Season Pass | §11.9 | Future |

---

## Test Coverage Target

| Phase | Tests | Status |
|-------|-------|--------|
| Phase 0-1 | 102 | ✅ |
| Phase 2 (Mini-Games) | 228 | ✅ |
| **Total** | **320+** | ✅ |

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

## Sources

- `docs/GRUNDY_MASTER_BIBLE.md` — Design source of truth
- `TASKS.md` — Detailed task list
- `ORCHESTRATOR.md` — Agent workflow
- `GRUNDY_DEV_STATUS.md` — Current status

---

*This roadmap tracks the Web Edition only. Unity Edition has a separate roadmap.*
