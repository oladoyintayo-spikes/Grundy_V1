# Grundy Web Edition – Release 1.0.0

**Release Date:** December 10, 2024
**Codename:** First Light

---

## Overview

Grundy Web Edition 1.0.0 is the first public release of the Grundy virtual pet game for web browsers. This release delivers a complete core gameplay experience featuring 8 unique pets with distinct abilities, 5 mini-games with an energy-based reward system, a streamlined first-time user experience (FTUE), audio hooks, PWA support for installability and offline shell access, and baseline accessibility features.

---

## Highlights

### Core Loop & Pets

- **8 unique pets** with XP, levels, and evolution thresholds:
  - **Starters (unlocked):** Munchlet, Grib, Plompo
  - **Unlockable:** Fizz, Ember, Chomper, Whisp, Luxe
- **Evolution stages:** Baby (1-9), Youth (10-24), Evolved (25+)
- **Hunger, happiness, and mood** state machine for pet care
- **80-entry food affinity matrix** with positive/neutral/negative reactions
- **8 pet abilities** integrated into feeding and mini-game systems:
  - Munchlet: +10% bond from feeding
  - Grib: +20% mischief event chance
  - Plompo: -20% hunger decay
  - Fizz: +25% mini-game rewards
  - Ember: 2x coins from spicy foods
  - Chomper: No negative food reactions
  - Whisp: +5% rare item find
  - Luxe: +10% gem multiplier (future use)
- **Starter pet selection** during FTUE with 5 locked pet teasers

### Mini-Games & Rewards

- **5 mini-games implemented:**
  - Snack Catch (60s arcade catch)
  - Memory Match (90s card matching)
  - Pips (120s tile matching)
  - Rhythm Tap (music/timing rhythm)
  - Poop Scoop (60s cleanup action)
- **Energy system:**
  - 50 max energy
  - 10 energy per play
  - 1 energy regenerated per 30 minutes
  - First play per game per day is FREE
- **Reward tiers:** Bronze / Silver / Gold / Rainbow
- **Rewards include:** Coins, XP, and food drops per tier
- **NO GEMS from mini-games** (locked invariant enforced in code and tests)
- **Fizz's +25% mini-game bonus** integrated into reward calculations

### Navigation, Environment & Art

- **App shell** with Home / Games / Settings views
- **Time-of-day theming:** morning, day, evening, night (based on system time)
- **Rooms:** living_room (default), playroom (games), kitchen/bedroom/yard (future behaviors)
- **Pet avatars** use real sprite assets from `assets/pets/<petId>/*.png`
- **4 pet poses:** idle, happy, sad, sleeping
- **RoomScene overlays** layered over environment gradients

### FTUE & Modes

- **Complete FTUE flow:** splash → age gate → world intro → pet select → mode select → first session → complete
- **Target completion time:** 30-42 seconds (well under 60s goal)
- **Locked World Intro text:**

  > Sometimes, when a big feeling is left behind…
  > A tiny spirit called a Grundy wakes up.
  > One of them just found *you*.

- **Play modes:** Cozy vs Classic (recorded for future behavior differentiation)
- **Shop gated** until FTUE completion (no monetization during onboarding)

### Audio

- **Central audio manager** with sound/music preferences (toggles in Settings)
- **Sound effects configured:**
  - UI: tap, confirm, back
  - Mini-games: bronze, silver, gold, rainbow tier sounds
  - Pet: happy, level_up
- **Background music** track configured
- **Settings persistence** via Zustand store

### PWA & Offline Shell

- **Web manifest** with app name, icons, theme colors, and display mode
- **Service worker** for installability and shell caching
- **Caching strategy:** Network-first with cache fallback
- **Offline support:** Core shell loads after first visit
- **Install prompt** infrastructure captured for future UI button

### UX & Accessibility

- **Keyboard navigation** with consistent focus ring pattern (amber-400)
- **Semantic landmarks:** banner, navigation, main, dialog, status, region, article
- **ARIA attributes:** aria-current, aria-label, aria-pressed, aria-hidden
- **Pet avatar alt text** with display names and pose labels
- **Contrast improvements** for text against gradients and overlays
- **Heading hierarchy** maintained across all screens

### QA Summary

- **QA documentation:** `docs/QA_PLAN_WEB1.md` and `docs/QA_WEB1_ISSUES.md`
- **600+ automated tests** covering core loop, mini-games, FTUE, audio, PWA, art, and accessibility
- **No S1/S2 blockers** discovered during Web 1.0 QA
- **All remaining issues** are S3/S4 severity and deferred to Phase 6

---

## Known Limitations / Deferred Items (Phase 6+)

The following non-blocking items are documented and deferred to Phase 6:

| ID | Item | Notes |
|----|------|-------|
| P6-BRANDING | Replace placeholder PWA icons | Icons are 70-byte placeholders; need branded artwork |
| P6-AUDIO-ASSETS | Add real audio files | Audio config references files not yet created |
| P6-ENV-UI | Explicit room selection UI | Time-of-day works; room switching is automatic |
| P6-PWA-UI | "Install Grundy" button | Infrastructure exists; needs UI button in Settings |
| P9-7 | Volume sliders | Toggles exist; sliders are nice-to-have |

### Additional Notes

- **Mobile Safari untested** (Chromium simulation only during QA)
- **Real screen reader testing** not performed (semantic checks only)
- **Cozy vs Classic differentiation** recorded but not yet gameplay-affecting

---

## Technical Details

### Dependencies

- React 18.2.0
- TypeScript 5.0.0
- Zustand 4.4.0 (state management with persistence)
- Vite 4.3.0 (build system)
- Tailwind CSS 3.3.2 (styling)
- Vitest 0.32.0 (testing)

### Build & Test

```bash
# Development
npm run dev

# Production build
npm run build

# Run tests
npm test -- --run
```

### Test Coverage

- 600+ tests across 18 test files
- Core loop, abilities, feeding, unlocks
- All 5 mini-games with invariant checks
- FTUE flow and state management
- Audio configuration and manager
- PWA manifest and service worker
- Art configuration (sprites, rooms)
- Accessibility patterns and ARIA

---

## Upgrade Notes

- **Future 1.1.x versions** will build on this Web 1.0 baseline with:
  - Deeper Cozy/Classic mode differentiation
  - More pet poses and art states
  - Richer offline support via vite-plugin-pwa
  - Expanded accessibility features
  - Real audio assets
- **Unity Edition** will be ported from this Web 1.0 design and versioned on its own track

---

## Files Changed for 1.0.0

| File | Change |
|------|--------|
| `src/version.ts` | Created – GRUNDY_WEB_VERSION = '1.0.0' |
| `package.json` | Updated – version: "1.0.0" |
| `docs/RELEASE_NOTES_WEB1.0.md` | Created – This file |
| `docs/RELEASE_TAG_WEB1.0.md` | Created – Tagging instructions |
| `TASKS.md` | Updated – P5-RELEASE-* tasks marked complete |
| `GRUNDY_DEV_STATUS.md` | Updated – Web Phase 5 complete |

---

*Grundy Web Edition 1.0.0 – First Light*
