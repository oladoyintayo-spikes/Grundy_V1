# Grundy – Bible Compliance Test (Web 1.0 / Phase 6+)

## 1. Purpose

This document defines the **Bible Compliance Test** for the Grundy Web Edition.

**Goal:**

- Verify that the **Web build** behaves in accordance with **GRUNDY_MASTER_BIBLE v1.4**.
- Detect **design drift** between implementation and Bible.
- Feed concrete requirements into **spec tests, E2E tests, and QA passes**.

This is not a full regression plan. It focuses on **non-negotiable invariants and core experience rules** from the Bible.

---

## 2. Scope

- **Platform:** Web (First Light 1.0 + Phase 6 patches)
- **Engine:** Vite + React + TypeScript
- **Builds Covered:**
  - Production / player build
  - Dev/QA build (where debug HUD and placeholders may be enabled via flags)

Assumption: **GRUNDY_MASTER_BIBLE v1.4** is canonical.

---

## 3. Test Structure

Each test case has:

- **ID** – `BCT-<area>-<number>`
- **Spec Ref** – relevant section(s) in Bible v1.4
- **Type** – Manual / Spec / E2E
- **Steps**
- **Expected Result**

These should be mirrored as:

- Jest/Vitest **spec tests** (logic / state).
- Playwright/Cypress (or similar) **E2E tests** (FTUE, HUD, layout, nav).

---

## 4. Test Summary

| ID | Name | Type | Bible Ref |
|----|------|------|-----------|
| BCT-FEED-01 | Stuffed pets cannot be fed | Spec + Manual | §4.3–4.4 |
| BCT-FEED-02 | Cooldown exists and blocks rapid re-feeding | Spec + E2E | §4.3–4.4 |
| BCT-FEED-03 | No spam leveling via feeding while full | Spec + Manual | §4.3–4.4, §6.1 |
| BCT-EVO-01 | Evolution thresholds match Bible | Spec | §6.1 |
| BCT-ECON-01 | Mini-games never award gems | Spec + E2E | §8.2–8.3 |
| BCT-ECON-02 | Gem sources match Bible list | Spec | §8.3 |
| BCT-GAME-01 | Mini-game daily cap enforced | Spec + E2E | §8.2 |
| BCT-GAME-02 | First daily game is free | Spec | §8.2 |
| BCT-HUD-01 | Production HUD shows Bond only | E2E + Manual | §4.4 |
| BCT-HUD-02 | Dev/QA HUD gated behind flag | Spec + Manual | §4.4 |
| BCT-ROOMS-01 | Feeding uses Kitchen environment | Spec + E2E | §14.4 |
| BCT-ROOMS-02 | Sleeping uses Bedroom; Play uses Playroom | Spec + E2E | §14.4 |
| BCT-ROOMS-03 | Time-of-day visuals are correct | Spec + Manual | §14.4 |
| BCT-FTUE-01 | Lore text matches Bible exactly | E2E + Manual | §7.4 |
| BCT-FTUE-02 | Animation or smooth fallback behavior | E2E + Manual | §7.4 |
| BCT-NAV-01 | Home / Games / Settings always accessible | E2E | §14.5, §14.6 |
| BCT-PET-01 | Only active pet visible on Home | E2E + Manual | §14.5 |
| BCT-PET-02 | Switching pet is deliberate and confirmed | E2E | §14.5 |
| BCT-MOBILE-01 | No vertical scroll required for core loop | E2E | §14.6 |
| BCT-MOBILE-02 | Session stats / debug counters off main view | E2E + Manual | §4.4, §14.6 |
| BCT-ART-01 | Pet sprite art used in production | E2E + Manual | §13.7 |
| BCT-ART-02 | Emoji/orb only in dev/testing modes | Spec + Manual | §13.7 |

---

## 5. Detailed Test Cases

### 5.1 Core Loop – Feeding, Cooldown, Fullness

#### BCT-FEED-01 – Stuffed pets cannot be fed

- **Spec Ref:** §4.3–4.4 (Cooldown & fullness)
- **Type:** Spec + Manual
- **Steps:**
  1. Set pet hunger to 100/100 (via dev tools or repeated feeds).
  2. Attempt to feed again.
- **Expected:**
  - No XP or bond gain.
  - No hunger increase.
  - UI shows clear feedback (e.g. "Too full" / pet refuses).
  - Further feeding is blocked until hunger drops below the "stuffed" range.

#### BCT-FEED-02 – Cooldown exists and blocks rapid re-feeding

- **Spec Ref:** §4.3–4.4 (Cooldown invariant)
- **Type:** Spec + E2E
- **Steps:**
  1. Feed pet once from a normal hunger state.
  2. Immediately attempt to feed again, multiple times in quick succession.
- **Expected:**
  - A cooldown is enforced:
    - Either second feed is blocked, **or**
    - It applies reduced value per Bible rules.
  - Spam tapping does not produce full-value feeding or uncontrolled XP gain.

#### BCT-FEED-03 – No spam leveling via feeding while full

- **Spec Ref:** §4.3–4.4 (Fullness), §6.1 (Evolution thresholds)
- **Type:** Spec + Manual
- **Steps:**
  1. Raise pet hunger to "full"/"stuffed" and XP near evolution threshold.
  2. Attempt repeated feeds while pet is full or stuffed.
- **Expected:**
  - XP does **not** climb indefinitely while pet is full/stuffed.
  - Evolution cannot be brute-forced by ignoring fullness/cooldown rules.

---

### 5.2 Evolution – Thresholds

#### BCT-EVO-01 – Evolution thresholds match Bible

- **Spec Ref:** §6.1 (Locked thresholds)
- **Type:** Spec
- **Steps:**
  1. Inspect evolution trigger levels in code/config.
  2. Verify that all evolution checks use these shared values.
- **Expected:**
  - Youth evolution triggers at level **10**.
  - Evolved evolution triggers at level **25**.
  - No other values are used for these specific evolution thresholds.

---

### 5.3 Economy & Mini-games

#### BCT-ECON-01 – Mini-games never award gems

- **Spec Ref:** §8.2–8.3 (No-gems-from-mini-games invariant)
- **Type:** Spec + E2E
- **Steps:**
  1. Play **each mini-game** through all reward tiers (Bronze → Rainbow).
  2. Inspect reward payloads (UI + internal state).
- **Expected:**
  - `gems` awarded = **0** for all mini-games at all tiers.
  - Rewards are limited to allowed types (coins, tickets, cosmetics, boosts, etc.).

#### BCT-ECON-02 – Gem sources match Bible list

- **Spec Ref:** §8.3 (Allowed gem sources)
- **Type:** Spec
- **Steps:**
  1. Enumerate all in-game sources where gems can be obtained.
  2. Compare against Bible v1.4 gem source list.
- **Expected:**
  - All gem sources correspond exactly to allowed list.
  - No undocumented or "hidden" gem sources exist.

#### BCT-GAME-01 – Mini-game daily cap enforced

- **Spec Ref:** §8.2 (Energy system & daily cap)
- **Type:** Spec + E2E
- **Steps:**
  1. Start a new in-game day (or reset daily state via dev tools).
  2. Play 3 mini-games during that day using normal flow.
  3. Attempt to start a 4th mini-game.
- **Expected:**
  - The 4th game is blocked or clearly marked unavailable.
  - Daily cap of **3 plays maximum** is enforced.

#### BCT-GAME-02 – First daily game is free

- **Spec Ref:** §8.2 ("First game free" rule)
- **Type:** Spec
- **Steps:**
  1. Start a new in-game day.
  2. Record current energy value.
  3. Play the **first** mini-game of the day.
  4. After it ends, record energy again.
- **Expected:**
  - First mini-game of the day costs **0 energy**.
  - Subsequent mini-games consume **10 energy** each.

---

### 5.4 HUD & Stats Visibility

#### BCT-HUD-01 – Production HUD shows Bond only

- **Spec Ref:** §4.4 (HUD visibility rules)
- **Type:** E2E + Manual
- **Steps:**
  1. Launch the **production build** (no dev/QA flags enabled).
  2. Open the main pet/home screen.
- **Expected:**
  - Bond is visible (bar or equivalent indicator).
  - No explicit Hunger or XP bars visible to the player.
  - No debug counters shown on the main view.

#### BCT-HUD-02 – Dev/QA HUD gated behind flag

- **Spec Ref:** §4.4 (Developer/QA exception)
- **Type:** Spec + Manual
- **Steps:**
  1. Start build with a dev flag enabled.
  2. Open the main pet/home screen.
  3. Disable the flag and reload.
- **Expected:**
  - With flag **on**: debug HUD may show hunger, XP, cooldown timers.
  - With flag **off**: all debug HUD elements disappear.

---

### 5.5 Environments – Rooms Lite & Time-of-Day

#### BCT-ROOMS-01 – Feeding uses Kitchen environment

- **Spec Ref:** Rooms Lite §14.4
- **Type:** Spec + E2E
- **Steps:**
  1. From default home state, initiate a feeding action.
- **Expected:**
  - Background switches to **Kitchen** while feeding.
  - After feeding completes, environment returns to appropriate room.

#### BCT-ROOMS-02 – Sleeping uses Bedroom; Play uses Playroom

- **Spec Ref:** §14.4 (Rooms Lite mapping)
- **Type:** Spec + E2E
- **Steps:**
  1. Put the pet to sleep via sleep action.
  2. Start a play/mini-game session from a normal state.
- **Expected:**
  - Sleep: **Bedroom** environment is shown.
  - Play: **Playroom** environment while playing.

#### BCT-ROOMS-03 – Time-of-day visuals are correct

- **Spec Ref:** §14.4 + time-of-day rules
- **Type:** Spec + Manual
- **Steps:**
  1. Using dev controls, set time-of-day to morning, afternoon, evening, night.
  2. Observe environment for each setting.
- **Expected:**
  - Background/lighting clearly respond to time-of-day.
  - No mismatched combinations.

---

### 5.6 FTUE – Lore, Flow, Fallback

#### BCT-FTUE-01 – Lore text matches Bible exactly

- **Spec Ref:** FTUE §7.4 (Locked intro copy)
- **Type:** E2E + Manual
- **Steps:**
  1. Start a **fresh install** or clear all save data.
  2. Play through FTUE until lore screen.
- **Expected:**
  - Lore text matches the locked copy from Bible v1.4 exactly.
  - No alternate phrases, added lines, or missing lines.

#### BCT-FTUE-02 – Animation or smooth fallback behavior

- **Spec Ref:** §7.4 (Timing + fallback)
- **Type:** E2E + Manual
- **Steps:**
  1. Observe lore screen behavior from first appearance to completion.
- **Expected:**
  - Either staged fade-in per Bible timing, **or** single smooth fade-in (fallback).
  - No stutter, jank, or double renders.

---

### 5.7 Navigation, Pet Switching, and Reset

#### BCT-NAV-01 – Home / Games / Settings always accessible

- **Spec Ref:** Nav §14.5 + Mobile layout §14.6
- **Type:** E2E
- **Steps:**
  1. On desktop and phone viewport, load main game screen.
  2. Without scrolling, locate navigation.
- **Expected:**
  - Home, Games, Settings are clearly visible and tappable without vertical scroll.
  - Home button actually returns to the home view when pressed.

#### BCT-PET-01 – Only active pet visible on Home

- **Spec Ref:** Pet switching UX §14.5
- **Type:** E2E + Manual
- **Steps:**
  1. From a normal save, navigate to the main home screen.
- **Expected:**
  - A single **active pet** is presented as the main character.
  - There is **no always-visible tab row** of all 8 pets on the primary home view.

#### BCT-PET-02 – Switching pet is deliberate and confirmed

- **Spec Ref:** §14.5 (Switching & reset)
- **Type:** E2E
- **Steps:**
  1. Navigate to pet switching / manage pets UI.
  2. Attempt to switch to another pet.
- **Expected:**
  - UI clearly shows which pet is active vs locked/available.
  - Confirmation dialog appears for switching/resetting.
  - Current pet state is auto-saved before switch.

---

### 5.8 Mobile Layout & Viewport Rules

#### BCT-MOBILE-01 – No vertical scroll required for core loop

- **Spec Ref:** Mobile layout §14.6
- **Type:** E2E
- **Steps:**
  1. Open game on a common phone viewport (e.g., 390×844).
  2. Inspect the main pet/home screen **without scrolling**.
- **Expected:**
  - Visible without any scroll: Pet, Primary actions, Global nav, Currencies.
  - Vertical scrolling is **not required** for the basic check-in loop.

#### BCT-MOBILE-02 – Session stats / debug counters off the main view

- **Spec Ref:** §4.4, §14.4, §14.6 (HUD + layout)
- **Type:** E2E + Manual
- **Steps:**
  1. On mobile, inspect main game screen in a **production build**.
- **Expected:**
  - No QA/debug-only fields appear in the primary column.
  - Such information is only in drawers, secondary screens, or dev-flagged views.

---

### 5.9 Art – Pet Sprites vs Placeholders

#### BCT-ART-01 – Pet sprite art used in production

- **Spec Ref:** Art §13.7 (Production art rule)
- **Type:** E2E + Manual
- **Steps:**
  1. In production build, start a new game and choose each available pet.
- **Expected:**
  - Each pet renders using its sprite art from `assets/pets/<petId>/...`.
  - No emoji or generic orb is used as the primary visual.

#### BCT-ART-02 – Emoji/orb only in dev/testing modes

- **Spec Ref:** §13.7 (Placeholder art exception)
- **Type:** Spec + Manual
- **Steps:**
  1. Enable any dev/testing flag designed to show placeholder art.
  2. Inspect pet visuals.
- **Expected:**
  - Only dev/QA or explicit debug modes may show simplified emoji/orb forms.
  - Production builds never fall back to placeholder art.

---

## 6. Implementation Guidance

For **QA & Dev**:

- Each **BCT test case** should have a corresponding:
  - **Spec test** (where logic is testable in isolation).
  - **E2E test** (for full flow, device/layout checks) where applicable.

- CI should:
  - Run Bible Compliance **spec tests** on every PR.
  - Run a minimal Bible Compliance **E2E suite** before tagging any release.

If a BCT test fails:

- Treat it as a **design regression**, not just a cosmetic bug.
- Default response: **Fix implementation** to match the Bible.
- Only if the design itself truly needs to change:
  - Update **GRUNDY_MASTER_BIBLE** (bump version),  
  - Update this Bible Compliance Test to match,  
  - Then adjust tests and implementation.

**Assumption: Bible is right; implementation moves toward it.**
