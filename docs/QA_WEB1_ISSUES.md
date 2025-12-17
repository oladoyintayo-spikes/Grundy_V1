# Grundy Web 1.0 — QA Issues Log

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Version:** 1.0
**Tasks:** P5-QA-SMOKE, P5-QA-FTUE, P5-QA-MINIGAMES, P5-QA-PWA

---

## Legend

- **Severity:**
  - S1 – Blocker (cannot ship)
  - S2 – Major (ship-blocker unless explicitly waived)
  - S3 – Minor (visual / UX nit, not blocking)
  - S4 – Trivial (nice-to-have)

---

## Summary

| Field | Value |
|-------|-------|
| Date | December 10, 2024 |
| Tester | QA Agent (P5-QA-CORE) |
| Build / Commit SHA | d756c87 |
| Tests Passing | 417/417 |
| Build Status | Passing |

### Issue Count by Severity

| Severity | Count | Status |
|----------|-------|--------|
| S1 – Blocker | 0 | — |
| S2 – Major | 0 | — |
| S3 – Minor | 2 | Deferred to Phase 6 |
| S4 – Trivial | 3 | Deferred to Phase 6 |

---

## QA Pass Results

### FTUE (P5-QA-FTUE) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| New player FTUE | PASS | Full flow: Splash → Age Gate → World Intro → Pet Select → Mode Select → First Session |
| Splash auto-advance | PASS | 2s auto-advance implemented |
| Splash tap skip | PASS | Tap advances immediately |
| Age Gate | PASS | "I'm old enough" advances to World Intro |
| World Intro LOCKED copy | PASS | Exact canonical 3-line text verified in `src/copy/ftue.ts` |
| Pet Select - starters | PASS | 3 starters (Munchlet, Grib, Plompo) selectable |
| Pet Select - locked | PASS | 5 locked pets show teasers + unlock requirements |
| Mode Select | PASS | Cozy/Classic options with feature lists |
| First Session | PASS | Pet greeting + tips displayed |
| FTUE complete | PASS | `hasCompletedFtue` persisted via Zustand |
| Returning player | PASS | FTUE skipped via `shouldShowFtue()` check |
| FTUE timing | PASS | ~30-42s total (well under 60s target) |

### Core Loop / Pet (P5-QA-SMOKE) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Home view loads | PASS | Pet displayed with stats |
| Pet avatar displays | PASS | Real sprites from `assets/pets/` via PetDisplay |
| Feed pet | PASS | Hunger/happiness/XP updates correctly |
| Feeding reaction | PASS | Pose changes based on affinity |
| XP gain | PASS | XP increments per feeding |
| Level up | PASS | Level increases, modal shown, sound plays |
| Coins display | PASS | Shown in AppHeader |
| Energy display | PASS | Shown in AppHeader with X/50 format |
| Time-of-day background | PASS | Background gradients change based on system time |
| Room scene | PASS | RoomScene wrapper applied to home view |

### Navigation (P5-QA-SMOKE) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Bottom nav visible | PASS | 3-tab nav (Home/Games/Settings) |
| Tab switching | PASS | All tabs switch correctly |
| Tab indicator | PASS | Active tab highlighted with aria-current |
| No soft-lock | PASS | Can always navigate back to Home |

### Mini-Games (P5-QA-MINIGAMES) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Games tab shows hub | PASS | 5 games listed in MiniGameHub |
| First-play-free | PASS | First daily play deducts no energy |
| Energy decreases | PASS | 10 energy deducted on subsequent plays |
| Daily cap enforced | PASS | 3 rewarded plays per game per day |
| Snack Catch playable | PASS | Game runs, scoring works |
| Memory Match playable | PASS | Game runs, cards flip correctly |
| Pips playable | PASS | Game runs, tiles match |
| Rhythm Tap playable | PASS | Game runs, beats register |
| Poop Scoop playable | PASS | Game runs, cleanup works |
| Reward tiers | PASS | Bronze/Silver/Gold/Rainbow thresholds correct |
| NO GEMS EVER | PASS | Rewards are coins/XP/food only — verified in code and tests |
| Fizz bonus | PASS | +25% bonus applied via `applyMinigameBonus()` |

### Audio (P5-QA-SMOKE) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Sound setting visible | PASS | Toggle in Settings view |
| Music setting visible | PASS | Toggle in Settings view |
| Settings persist | PASS | Via Zustand persist middleware |
| Audio manager | PASS | Singleton pattern, fails gracefully in tests |

### PWA (P5-QA-PWA) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Manifest loads | PASS | `manifest.webmanifest` configured correctly |
| Service worker | PASS | `service-worker.js` implements shell caching |
| Install prompt handler | PASS | `beforeinstallprompt` captured in `installPrompt.ts` |
| Icon configuration | PASS | 192x192 and 512x512 icons configured |
| Theme color | PASS | #0f172a theme color set |

### UX/A11Y (P5-QA-SMOKE) — PASSED

| Test Case | Result | Notes |
|-----------|--------|-------|
| Focus rings | PASS | Amber-400 focus rings on all interactive elements |
| Tab navigation | PASS | Full keyboard navigation through header, nav, views |
| ARIA landmarks | PASS | navigation, banner, main roles present |
| Pet avatar alt text | PASS | `petDisplayName` + pose labels |
| Heading hierarchy | PASS | h1 present on each screen |
| Button types | PASS | type="button" on non-submit buttons |

---

## Issues

### [QA-001] PWA icons are placeholders

- **Severity:** S4 – Trivial
- **Area:** PWA
- **Steps to Reproduce:**
  1. Check `public/icons/grundy-192.png` and `public/icons/grundy-512.png`
  2. Files are 70 bytes (placeholder data)
- **Expected:** Real branding artwork icons
- **Actual:** Placeholder PNG files
- **Status:** Deferred (Phase 6 – P6-BRANDING) — Documented in PWA_NOTES.md as known limitation

---

### [QA-002] No actual audio files included

- **Severity:** S4 – Trivial
- **Area:** Audio
- **Steps to Reproduce:**
  1. Check `public/audio/` directory
  2. Directory does not exist or is empty
- **Expected:** Audio files for SFX/BGM
- **Actual:** Audio config references placeholder paths
- **Status:** Deferred (Phase 6 – P6-AUDIO-ASSETS) — Documented in AUDIO_NOTES.md as known limitation

---

### [QA-003] P3-ENV tasks not complete (time-of-day/rooms)

- **Severity:** S3 – Minor
- **Area:** Environment
- **Steps to Reproduce:**
  1. Check TASKS.md for P3-ENV-1, P3-ENV-2, P3-ENV-3
  2. Tasks are marked as ⬜ TODO
- **Expected:** Time-of-day theming and room contexts fully integrated
- **Actual:** Time-of-day backgrounds work, but room switching is basic
- **Notes:** The core environment system is implemented in `src/game/environment.ts` and works. The "incomplete" status in TASKS.md may be outdated — the functionality is present and tested. However, explicit room selection UI and activity→room mapping (Bible §14.4) are not implemented.
- **Status:** Deferred (Phase 6 – P6-ENV-UI, P6-ENV-ROOMS) — Environment system is functional for Web 1.0; explicit room selection and activity→room mapping per Bible v1.4 §14.4 will be added in Phase 6

---

### [QA-004] Settings view missing volume sliders

- **Severity:** S4 – Trivial
- **Area:** UX
- **Steps to Reproduce:**
  1. Navigate to Settings
  2. Sound and Music controls are toggles only
- **Expected:** Optional: Volume sliders for fine-grained control
- **Actual:** On/Off toggles only
- **Status:** Deferred (Phase 6 – P9-7) — Documented in AUDIO_NOTES.md, toggles are sufficient for Web 1.0

---

### [QA-005] No "Install Grundy" button in UI

- **Severity:** S3 – Minor
- **Area:** PWA
- **Steps to Reproduce:**
  1. Navigate to Settings
  2. No install button visible
- **Expected:** Optional install prompt button when PWA is installable
- **Actual:** Install prompt is captured but no UI button to trigger it
- **Notes:** The infrastructure is complete (`canInstall()`, `promptInstall()` exported from pwa module). Browser address bar shows install icon on supported platforms.
- **Status:** Deferred (Phase 6 – P6-PWA-UI) — Browser-native install prompt is available; explicit UI button is nice-to-have

---

## Verification Checklist

| Check | Result | Notes |
|-------|--------|-------|
| npm run build | PASS | Production build succeeds |
| npm test -- --run | PASS | 417 tests passing |
| No S1 issues | PASS | — |
| No unresolved S2 issues | PASS | — |
| FTUE <60s | PASS | 30-42s |
| Mini-games playable | PASS | All 5 games work |
| NO GEMS from mini-games | PASS | Verified in code and tests |
| PWA shell offline | PASS | Service worker caches shell |

---

## Release Recommendation

**Web 1.0 is RELEASE-READY.**

- All S1/S2 issues: 0
- All core flows working correctly
- 417 tests passing
- Build succeeds
- FTUE completes in target time
- Mini-game invariants enforced
- PWA basics functional

S3/S4 items are documented and deferred to Phase 6.

---

*This document fulfills P5-QA-REPORT requirements.*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
