# GRUNDY_ROADMAP_v2.md

# Grundy Web Edition — Development Roadmap

**Version:** 2.1
**Last Updated:** December 11, 2024 (P6-DOC-ALIGN)
**Current:** Web 1.0 RELEASED | Phase 6 In Progress

---

## Overview

**Web 1.0 is RELEASED.** This roadmap now tracks **Phase 6+** — bringing Web 1.0 up to Bible v1.4 compliance, then extending with new features.

### Web Edition Goals (Web 1.0 — COMPLETE)

1. **Playable core loop** — Feed, bond, evolve ✅
2. **5 mini-games** — Snack Catch, Memory Match, Pips, Rhythm Tap, Poop Scoop ✅
3. **Navigation shell** — Home, Games, Settings ✅
4. **FTUE** — New player onboarding in <60 seconds ✅
5. **PWA** — Installable on mobile devices ✅

### Phase 6 Goals (Bible v1.4 Compliance)

1. **Core loop hardening** — Feeding cooldown, STUFFED block
2. **HUD cleanup** — Bond-only in production; debug stats gated
3. **Mobile layout** — Viewport constraints per Bible §14.6
4. **Rooms Lite** — Activity→room mapping per Bible §14.4
5. **Navigation** — Pet switch confirmations per Bible §14.5

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
Web Phase 3: Navigation & Environment ✅
    │
    ▼
Web Phase 4: FTUE / Onboarding ✅
    │
    ▼
Web Phase 5: Polish / Web 1.0 ✅
    │
    ▼
[ WEB 1.0 RELEASE ] ← COMPLETE
    │
    ▼
Web Phase 6: Bible v1.4 Compliance 🟡
    │
    ▼
Web Phase 7+: Extended Features
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

### Web Phase 3: Navigation & Environment ✅

**Theme:** App shell, navigation, time-of-day theming.

| Task Group | Status | Tasks |
|------------|--------|-------|
| P3-NAV: App Shell | ✅ | AppView model, header, bottom nav, Games tab |
| P3-ENV: Environment | ✅ | Time-of-day theming, rooms, view integration |

**Exit Criteria:**
- [x] App header shows pet, coins, energy
- [x] Bottom nav switches Home/Games/Settings
- [x] Games tab shows mini-game hub
- [x] Time-of-day theming applied
- [x] Rooms integrated into views

---

### Web Phase 4: FTUE / Onboarding ✅

**Theme:** New player experience from Bible §7.

| Screen | Status | Description |
|--------|--------|-------------|
| Splash | ✅ | Title + "Tap to Start" |
| Age Gate | ✅ | "I'm old enough" single tap |
| World Intro | ✅ | 10-second lore snippet (LOCKED copy) |
| Pet Selection | ✅ | 3 starters, origin snippets, locked teasers |
| Mode Select | ✅ | Cozy vs Classic |
| First Session | ✅ | Guided feeding, first reaction always positive |

**World Intro Copy (LOCKED):**
> Sometimes, when a big feeling is left behind…
> A tiny spirit called a Grundy wakes up.
> One of them just found *you*.

**Exit Criteria:**
- [x] New player completes FTUE in <60s (30-42s achieved)
- [x] Mode selection works
- [x] First feeding always positive
- [x] World Intro shows LOCKED copy

---

### Web Phase 5: Polish / Web 1.0 ✅

**Theme:** Final polish for release.

| Task | Status | Description |
|------|--------|-------------|
| P5-AUDIO | ✅ | Audio manager, SFX/BGM, settings |
| P5-PWA | ✅ | Manifest, service worker, install prompt |
| P5-ART | ✅ | Pet sprites, room scenes, integration |
| P5-UX-A11Y | ✅ | Keyboard nav, focus styles, ARIA |
| P5-QA | ✅ | Full test pass, 616 tests |
| P5-RELEASE | ✅ | Web 1.0.0 versioned and tagged |

**Exit Criteria:**
- [x] Sound system working with mute
- [x] PWA installable on mobile
- [x] Final art integrated
- [x] All tests passing (616 tests)
- [x] Web 1.0 release tagged

---

### Web Phase 6: Bible v1.4 Compliance 🟡

**Theme:** Bring Web 1.0 up to Bible v1.4 specification.

> **Full backlog:** `docs/PHASE6_BACKLOG.md`

| Task Group | Status | Bible Section |
|------------|--------|---------------|
| P6-CORE: Core Loop Hardening | ⬜ | §4.3–4.4 |
| P6-HUD: HUD Cleanup | ⬜ | §4.4 |
| P6-MOBILE: Layout & Nav | ⬜ | §14.5–14.6 |
| P6-ENV: Rooms Lite | ⬜ | §14.4 |
| P6-ART: Art Integration | 🟡 | §13.7 |
| P6-DOC: Documentation | ✅ | — |

**Key Tasks:**

| ID | Task | Status | Notes |
|----|------|--------|-------|
| P6-CORE-COOLDOWN | 30-min feeding cooldown | ⬜ | Bible §4.3 |
| P6-CORE-STUFFED | STUFFED blocks feeding | ⬜ | Bible §4.4 |
| P6-HUD-PRODUCTION | Bond-only production HUD | ⬜ | Bible §4.4 |
| P6-HUD-DEBUG | Gate debug HUD | ⬜ | Bible §4.4 |
| P6-MOBILE-LAYOUT | Mobile viewport constraints | ⬜ | Bible §14.6 |
| P6-NAV-CONFIRM | Pet switch confirmation | ⬜ | Bible §14.5 |
| P6-ENV-ROOMS | Activity→room mapping | ⬜ | Bible §14.4 |
| P6-DOC-BIBLE | Bible v1.4 merge | ✅ | Complete |
| P6-DOC-ALIGN | Docs alignment | ✅ | Complete |

**Exit Criteria:**
- [ ] Feeding cooldown enforced (Bible §4.3)
- [ ] STUFFED blocks feeding (Bible §4.4)
- [ ] Production HUD: Bond-only (Bible §4.4)
- [ ] Debug HUD gated behind dev flag (Bible §4.4)
- [ ] Mobile viewport constraints met (Bible §14.6)
- [ ] Pet switch shows confirmation (Bible §14.5)
- [ ] Activity→room mapping works (Bible §14.4)
- [ ] No emoji in production sprites (Bible §13.7)

---

## Post-Phase 6 Systems

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

- `docs/GRUNDY_MASTER_BIBLE.md` (v1.4) — Design source of truth
- `docs/PHASE6_BACKLOG.md` — Phase 6 task backlog
- `TASKS.md` — Detailed task list
- `ORCHESTRATOR.md` — Agent workflow
- `GRUNDY_DEV_STATUS.md` — Current status

---

*This roadmap tracks the Web Edition only. Unity Edition has a separate roadmap.*
*Phase 6 = Bible v1.4 compliance. Later phases = extended features beyond Bible v1.4 baseline.*
