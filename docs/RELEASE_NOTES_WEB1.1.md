# Grundy Web Edition – Release 1.1.0

> ⚠️ **Historical Document** — This document is a release record from Web 1.1.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

**Release Date:** December 14, 2025
**Codename:** Phase 10 Complete

---

## Overview

Grundy Web Edition 1.1.0 delivers the complete Weight & Sickness Systems, implementing Bible v1.8 specifications for pet health mechanics. This release adds weight management, sickness triggers and recovery, poop system with UI, mini-game gating for unhealthy pets, health alerts, and comprehensive offline processing with sick decay multipliers.

---

## What's New

### Weight System (§9.4.7.1)

- **Per-pet weight tracking** (0-100 scale)
- **Weight states:** Normal (0-30), Chubby (31-60), Overweight (61-80), Obese (81-100)
- **Snack weight gain:** Cookie +5, Candy +10, Ice Cream +10, Lollipop +8
- **Natural decay:** -1 weight per hour (runs offline, 14-day cap)
- **Visual indicators:** Pet sprite scales based on weight state

### Sickness System (§9.4.7.2)

- **Classic Mode only** — Cozy Mode pets cannot get sick
- **Sickness triggers:**
  - Hunger = 0 for 30 minutes → 20% chance
  - Poop uncleaned for 2 hours → 15% chance
  - Hot Pepper food → 5% chance always
  - Snack when Overweight (61+) → 5% per snack
- **Sick effects:** 2× stat decay (mood, bond, hunger), mini-games blocked
- **Care mistakes:** +1 per hour untreated (capped at 4 per offline session)

### Poop System (§9.5)

- **Poop spawning:** After 3-4 feedings (varies by pet)
- **Visual indicator:** 💩 appears near pet when dirty
- **Tap-to-clean interaction:** Satisfying sparkle effect
- **Cleaning rewards:** +2 Happiness, +0.1 Bond
- **Mood decay:** 2× faster after 60 minutes dirty

### Recovery Flows (§9.4.7.4)

- **Medicine 💊:** 50🪙, instant cure for sickness
- **Diet Food 🥗:** 30🪙, -20 weight, +5 hunger
- **Watch Ad:** Free recovery stub (returns `WEB_ADS_DISABLED`)

### Mini-Game Gating (§9.4.7.5)

- **Sick pets:** Cannot play mini-games (Classic Mode)
- **Obese pets (weight ≥81):** Cannot play mini-games (Classic Mode)
- **Cozy Mode:** All gating bypassed — pets can always play

### Health Alerts (§11.6.1)

- **Weight Warning (Obese):** Toast when pet reaches weight ≥81
- **Weight Recovery:** Toast when pet drops below obese threshold
- **Sickness Onset:** Toast + badge when pet becomes sick
- **Sickness Reminder:** Badge after 30-minute cooldown

### Offline Processing (§9.4.7.3)

- **14-day offline cap:** Maximum stat decay limited
- **Cozy short-circuit:** Sickness triggers skipped in Cozy Mode
- **Sick decay multiplier:** 2× stat decay (mood, bond, hunger) when sick
- **Sickness triggers run offline:** Timers accumulate during absence
- **Order of application:** Weight decay → Sickness triggers → Stat decay

### Cozy Mode Immunity (§9.3)

- Pets cannot get sick regardless of conditions
- No sickness penalties or care mistakes
- Weight is visual only (no gameplay effects)
- Mini-game gating bypassed

---

## Phase 10 Task Summary

| Task | Description |
|------|-------------|
| P10-A | State foundations (weight, isSick, timestamps) |
| P10-B | Offline order-of-application (14-day cap, Cozy short-circuit) |
| P10-B1.5 | Poop state (spawn, clean, sickness trigger) |
| P10-B2 | Poop UI + rewards + 2× mood decay |
| P10-C | Feeding triggers (weight gain, sickness chances) |
| P10-D | Mini-game gating (sick/obese blocked in Classic) |
| P10-E | Recovery flows (Medicine, Diet Food, Ad stub) |
| P10-F | Health alerts engine |
| P10-G | BCT gap analysis (full coverage confirmed) |
| P10-H | Sick offline 2× decay |

---

## Verification Baseline

| Metric | Value |
|--------|-------|
| Total Tests | 1,742 |
| BCT Tests | 999 |
| P10-Specific Tests | 195 |
| Build | PASS |
| TypeScript | PASS |
| Bible Version | v1.8 |
| BCT Spec Version | v2.4 |
| Save Version | 4 |

---

## Constraints

- ❌ **NO GEMS EVER** from mini-games (Web Edition invariant)
- ❌ **Push notifications DEFERRED** (Web lacks reliable push infra)
- ❌ **Ad recovery is stub** (Unity Later)

---

## Known Limitations / Deferred

- **Lore Journal:** Not started (Phase 10.5 or later)
- **Cosmetics System:** Not started (Phase 11)
- **LiveOps Layer:** Deferred (Phase 12+)
- **Offline 60m Poop Threshold:** Save-time-anchored approximation (intentional for Web v1.x)

---

## Testing Instructions

### Run Locally
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Run BCT Tests
```bash
npm run test:bible
```

### Run All Tests
```bash
npm test -- --run
```

---

## Upgrade Notes

- **Save Version:** Remains at v4 (no migration required from 1.0.0)
- **Breaking Changes:** None — backwards compatible with 1.0.0 saves

---

*Release prepared by automated gate pack. See `CURRENT_SPRINT.md` for CE/QA evidence.*
