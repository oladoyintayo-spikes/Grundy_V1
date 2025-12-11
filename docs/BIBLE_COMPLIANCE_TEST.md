# Grundy — Bible Compliance Test (BCT)

**Version:** 2.0
**Last Updated:** December 11, 2024 (P6-BCT-INTEGRATE)
**Bible Reference:** `docs/GRUNDY_MASTER_BIBLE.md` v1.4

---

## Purpose

This document defines the **Bible Compliance Tests (BCT)** — the contract for CE and QA review of any phase, patch, or hotfix.

All tests reference specific Bible sections. Passing these tests means the implementation matches the canonical design specification.

---

## Test Categories

| Category | Prefix | Bible Sections | Description |
|----------|--------|----------------|-------------|
| Core Loop | BCT-CORE-* | §4.3–4.4 | Feeding, cooldown, fullness |
| Economy | BCT-ECON-* | §8.2–8.3, §11 | Gems, rewards, daily caps |
| Evolution | BCT-EVOL-* | §6.1 | Evolution thresholds |
| HUD | BCT-HUD-* | §4.4 | Stats visibility, debug gating |
| Navigation | BCT-NAV-* | §14.5 | Pet switching, confirmations |
| Layout | BCT-LAYOUT-* | §14.6 | Mobile viewport constraints |
| Environment | BCT-ENV-* | §14.4 | Rooms, time-of-day |
| FTUE | BCT-FTUE-* | §7.4 | World Intro, onboarding |
| Art | BCT-ART-* | §13.7 | Sprite art, no emoji in prod |
| Mini-Games | BCT-GAME-* | §8 | Energy, rewards, daily caps |

---

## Core Loop Tests (BCT-CORE-*)

### BCT-CORE-001: Feeding Cooldown Exists

**Bible:** §4.3
**Requirement:** After feeding, a 30-minute digestion cooldown begins.

| Check | Expected |
|-------|----------|
| Feeding starts cooldown timer | Timer appears after any feed |
| Timer visible to player | UI shows countdown |
| Timer persists across refresh | Reloading page preserves timer |
| Timer resets on each feed | New feed restarts 30-min timer |

### BCT-CORE-002: Cooldown Reduces Feed Value

**Bible:** §4.3
**Requirement:** Feeding during cooldown gives 25% value.

| Check | Expected |
|-------|----------|
| Full value outside cooldown | 100% hunger/XP gain |
| Reduced value during cooldown | 25% hunger/XP gain |
| UI indicates reduced value | Feedback shows "Digesting..." |

### BCT-CORE-003: STUFFED Blocks Feeding

**Bible:** §4.4
**Requirement:** At fullness 91-100 (STUFFED), feeding is completely blocked.

| Check | Expected |
|-------|----------|
| Detect STUFFED state | Fullness >= 91 triggers STUFFED |
| Feed button disabled/blocked | Cannot initiate feeding |
| Pet refuses visually | Pet animation shows refusal |
| Clear feedback to player | "Too full!" or similar message |

---

## Economy Tests (BCT-ECON-*)

### BCT-ECON-001: No Gems from Mini-Games

**Bible:** §8.3
**Requirement:** Mini-games NEVER award gems under any circumstances.

| Check | Expected |
|-------|----------|
| Bronze tier rewards | Coins + XP only |
| Silver tier rewards | Coins + XP + food only |
| Gold tier rewards | Coins + XP + food only |
| Rainbow tier rewards | Coins + XP + rare food only — NO GEMS |

### BCT-ECON-002: Daily Mini-Game Cap

**Bible:** §8.2
**Requirement:** Maximum 3 rewarded plays per game per day.

| Check | Expected |
|-------|----------|
| First play | Full rewards |
| Second play | Full rewards |
| Third play | Full rewards |
| Fourth+ play | Reduced/no rewards (cap reached) |
| Cap resets daily | New day = 3 new plays |

### BCT-ECON-003: First Game Free

**Bible:** §8.2
**Requirement:** First daily game is FREE (costs 0 energy).

| Check | Expected |
|-------|----------|
| First play energy cost | 0 energy deducted |
| Subsequent plays | 10 energy per play |
| "First free" resets daily | New day = new free play |

---

## Evolution Tests (BCT-EVOL-*)

### BCT-EVOL-001: Evolution Thresholds

**Bible:** §6.1
**Requirement:** Youth=10, Evolved=25. These values are LOCKED.

| Check | Expected |
|-------|----------|
| Level 1-9 | Baby stage |
| Level 10-24 | Youth stage |
| Level 25+ | Evolved stage |
| Threshold values hardcoded | Not configurable |

---

## HUD Tests (BCT-HUD-*)

### BCT-HUD-001: Production HUD Bond-Only

**Bible:** §4.4
**Requirement:** Production HUD shows Bond only. Other stats hidden.

| Check | Expected |
|-------|----------|
| Bond visible | Bond meter/number displayed |
| Hunger hidden | No hunger bar in production |
| Mood hidden | No mood bar in production |
| XP hidden | No XP bar in production |
| Energy hidden from main HUD | Energy may show in mini-game context only |

### BCT-HUD-002: Debug HUD Gated

**Bible:** §4.4
**Requirement:** Debug stats gated behind `import.meta.env.DEV`.

| Check | Expected |
|-------|----------|
| Dev build | Debug stats visible (optional) |
| Production build | No debug stats visible |
| No accidental exposure | Debug HUD code stripped/disabled in prod |

---

## Navigation Tests (BCT-NAV-*)

### BCT-NAV-001: Pet Switch Confirmation

**Bible:** §14.5
**Requirement:** Switching pets shows confirmation modal.

| Check | Expected |
|-------|----------|
| Tap different pet | Confirmation modal appears |
| Modal shows pet names | "Switch to Grib?" |
| Stay option | Cancels switch, returns to current pet |
| Switch option | Confirms switch, loads new pet |
| Current state auto-saved | No data loss on switch |

---

## Layout Tests (BCT-LAYOUT-*)

### BCT-LAYOUT-001: Mobile Viewport Constraint

**Bible:** §14.6
**Requirement:** On phone (360×640 to 414×896), pet + actions + nav + currencies visible without scroll.

| Check | Expected |
|-------|----------|
| Pet visible | Large, centered, no scroll needed |
| Primary actions visible | Feed button visible without scroll |
| Navigation visible | Bottom nav visible |
| Currencies visible | Coins/gems visible |
| No vertical scroll needed | All above fits in viewport |

---

## Environment Tests (BCT-ENV-*)

### BCT-ENV-001: Activity-to-Room Mapping

**Bible:** §14.4
**Requirement:** Activities trigger room context switches.

| Check | Expected |
|-------|----------|
| Feeding activity | Kitchen background |
| Sleeping activity | Bedroom background |
| Playing activity | Playroom background |
| Default/idle | Living room + time-of-day |

### BCT-ENV-002: Time-of-Day

**Bible:** §14.4
**Requirement:** Background reflects time of day.

| Check | Expected |
|-------|----------|
| Morning (6-12) | Morning tint/background |
| Afternoon (12-18) | Day tint/background |
| Evening (18-21) | Evening tint/background |
| Night (21-6) | Night tint/background |

---

## FTUE Tests (BCT-FTUE-*)

### BCT-FTUE-001: World Intro Copy Locked

**Bible:** §7.4
**Requirement:** World Intro shows exact canonical text.

| Check | Expected |
|-------|----------|
| Line 1 | "Sometimes, when a big feeling is left behind…" |
| Line 2 | "A tiny spirit called a Grundy wakes up." |
| Line 3 | "One of them just found *you*." |
| No modifications | Text matches exactly |

### BCT-FTUE-002: FTUE Completion Time

**Bible:** §7
**Requirement:** FTUE completes in <60 seconds.

| Check | Expected |
|-------|----------|
| Total FTUE time | <60 seconds |
| No blocking steps | Player can progress smoothly |

---

## Art Tests (BCT-ART-*)

### BCT-ART-001: No Emoji in Production

**Bible:** §13.7
**Requirement:** Production builds use sprites, not emoji/orb placeholders.

| Check | Expected |
|-------|----------|
| Pet display | Sprite from assets/pets/, not emoji |
| All pet states | Sprites for idle, happy, sad, etc. |
| Visual regression | No emoji visible in production |

---

## Mini-Game Tests (BCT-GAME-*)

### BCT-GAME-001: Energy Cost

**Bible:** §8.2
**Requirement:** Each mini-game play costs 10 energy (except first free).

| Check | Expected |
|-------|----------|
| Starting energy | 50 max |
| Cost per game | 10 energy |
| Insufficient energy | Cannot play (or warning shown) |

### BCT-GAME-002: Reward Tiers

**Bible:** §8.3
**Requirement:** Reward tiers match Bible specification.

| Tier | Coins | XP | Food | Gems |
|------|-------|-----|------|------|
| Bronze | 2-3 | 3 | — | NEVER |
| Silver | 5-7 | 5 | 40% common | NEVER |
| Gold | 8-15 | 8 | 75% any | NEVER |
| Rainbow | 12-22 | 12 | Rare guaranteed | NEVER |

---

## Automated Test Implementation

### Constants (Single Source of Truth)

All Bible-locked values are defined in a single constants file:

```
src/constants/bible.constants.ts
```

This file exports:
- Evolution thresholds (§6.1)
- Fullness states and cooldown values (§4.3-4.4)
- Mini-game rules and reward tiers (§8.2-8.3)
- Gem source definitions with platform flags
- FTUE locked copy (§7.4)
- Room activity mappings (§14.4)
- UI test IDs for E2E testing

**Both runtime code and tests import from this file.**

### Spec Tests (Unit/Integration)

BCT spec tests verify that `bible.constants.ts` values match the Bible:

| File | Tests |
|------|-------|
| `src/__tests__/bct-evolution.spec.ts` | BCT-EVO-01 |
| `src/__tests__/bct-core-loop.spec.ts` | BCT-FEED-01, 02, 03 |
| `src/__tests__/bct-economy.spec.ts` | BCT-ECON-01, 02, BCT-GAME-01, 02, 03 |
| `src/__tests__/bct-environments.spec.ts` | BCT-ROOMS-01, 02, 03, BCT-FTUE-01, 02 |

**Run:** `npm test -- run src/__tests__/bct-*.spec.ts`

### E2E Tests (Playwright)

E2E tests verify the running application matches Bible spec:

```
e2e/bible-compliance.e2e.ts
```

Tests verify:
- BCT-HUD-01: Bond visible, debug hidden
- BCT-NAV-01: Navigation accessible
- BCT-PET-01: Single active pet
- BCT-MOBILE-01: No scroll required
- BCT-CURRENCY-01: Currency display

**Run:** `npx playwright test e2e/bible-compliance.e2e.ts`

### Test Coverage by Bible Section

| Bible Section | Spec Tests | E2E Tests |
|--------------|------------|-----------|
| §4.3-4.4 (Feeding/Cooldown) | ✅ bct-core-loop.spec.ts | — |
| §6.1 (Evolution) | ✅ bct-evolution.spec.ts | — |
| §7.4 (FTUE) | ✅ bct-environments.spec.ts | ⏳ (skipped) |
| §8.2-8.3 (Mini-games) | ✅ bct-economy.spec.ts | — |
| §14.4 (Rooms) | ✅ bct-environments.spec.ts | — |
| §14.5-14.6 (Navigation/Layout) | — | ✅ bible-compliance.e2e.ts |

---

## Test Execution

### For Phase Reviews

Run **all BCT tests** before declaring a phase complete.

### For Patches

Run BCT tests **relevant to the patch scope**:
- Feeding patch → BCT-CORE-*, BCT-ECON-*
- Mini-game patch → BCT-GAME-*, BCT-ECON-*
- UI patch → BCT-HUD-*, BCT-LAYOUT-*, BCT-NAV-*

### For Hotfixes

Run **at minimum** the BCT tests for the affected area:
- Feeding hotfix → BCT-CORE-001, BCT-CORE-002, BCT-CORE-003
- Mini-game hotfix → BCT-GAME-001, BCT-GAME-002, BCT-ECON-001
- HUD hotfix → BCT-HUD-001, BCT-HUD-002

---

## Pass/Fail Criteria

| Result | Meaning |
|--------|---------|
| PASS | Implementation matches Bible specification |
| FAIL | Implementation deviates from Bible; fix required |
| N/A | Test not applicable to this phase/patch |
| BLOCKED | Cannot test (dependency missing) |

---

## Document Hierarchy

```
GRUNDY_MASTER_BIBLE.md          ← Design specification (what SHOULD be)
    │
    ▼
BIBLE_COMPLIANCE_TEST.md        ← Test contract (how to VERIFY)
    │
    ▼
GRUNDY_PHASE_REVIEW_SOP.md      ← Process (WHO reviews WHEN)
```

---

*This document is the contract for CE and QA review. All phases, patches, and hotfixes must pass relevant BCT tests before deployment.*
