# Grundy — Bible Compliance Test (BCT)

---
**Document Version:** 2.6
**Last Updated:** December 17, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Bible Reference:** `docs/GRUNDY_MASTER_BIBLE.md` v1.11

**Changelog:**
- v2.6 (Dec 17, 2025): Phase 12-0 Notification System. Activated BCT-NOTIF-001→007 (§11.6.2 Notification Center). Activated BCT-TRIGGER-001→005 (§11.6.3 Trigger Conditions). Tests in `bct-notifications.spec.ts`.
- v2.5 (Dec 17, 2025): Bible v1.11 alignment. Added BCT-ECON-009→012 (§8.1.1 Economy Invariants). Added BCT-LAYOUT-002→007 (§14.6 Mobile Layout). Reserved Phase 12 IDs: ACH, STREAK, MBOX, NOTIF, TRIGGER, EVENT. Reserved Phase 13 IDs: SESSION. Added Contract Rules block. Removed placeholder test code.
- v2.4 (Dec 16, 2025): P9/P10/P11 complete. Weight & Sickness (BCT-WEIGHT-*, BCT-SICKNESS-*). Phase 11 Cosmetics (BCT-COS-*). Multi-Pet runtime (BCT-MULTIPET-*, BCT-PETSLOTS-*).
- v2.3 (Dec 14, 2025): Multi-Pet Runtime tests for P9-B.
- v2.2 (Dec 12, 2025): Shop + Inventory specs (BCT-SHOP-*, BCT-INV-*, BCT-ECON-004→008).
- v2.1 (Dec 10, 2025): Neglect & Withdrawal tests (BCT-NEGLECT-*).
- v2.0: Initial BCT specification.

---

## Purpose

This document defines the **Bible Compliance Tests (BCT)** — the contract for CE and QA review of any phase, patch, or hotfix.

All tests reference specific Bible sections. Passing these tests means the implementation matches the canonical design specification.

---

## Contract Rules

- **Bible** (`docs/GRUNDY_MASTER_BIBLE.md`) is the design SoT.
- **TASKS** (`TASKS.md`) is the status SoT.
- This BCT doc contains:
  - ✅ **Implemented BCT IDs** — tests exist in repo, verified passing
  - 🔲 **Reserved BCT IDs** — ID reservation only, no test files, no code blocks
- **Never** include placeholder tests or `expect(true).toBe(true)` examples.
- **Never** assert a phase is implemented unless TASKS confirms it.
- **Cite Bible sections**, not hardcoded values (values change, sections don't).

---

## Quick Start

Run all Bible Compliance Tests:

```bash
# Spec tests (unit/integration) — runs ~120+ BCT tests
npm run test:bible

# E2E tests (requires browser) — runs against running app
npm run test:bible:e2e

# All tests (includes non-BCT tests)
npm test -- --run
```

---

## Test Categories

| Category | Prefix | Bible Sections | Description |
|----------|--------|----------------|-------------|
| Core Loop | BCT-CORE-* | §4.3–4.4 | Feeding, cooldown, fullness |
| Economy | BCT-ECON-* | §5.8, §8.2–8.3, §11 | Starting resources, gems, rewards, daily caps |
| Evolution | BCT-EVOL-* | §6.1 | Evolution thresholds |
| HUD | BCT-HUD-* | §4.4 | Stats visibility, debug gating |
| Navigation | BCT-NAV-* | §14.5 | Pet switching, confirmations |
| Layout | BCT-LAYOUT-* | §14.6 | Mobile viewport constraints |
| Environment | BCT-ENV-* | §14.4 | Rooms, time-of-day |
| FTUE | BCT-FTUE-* | §7.4 | World Intro, onboarding |
| Art | BCT-ART-* | §13.7 | Sprite art, no emoji in prod |
| Mini-Games | BCT-GAME-* | §8 | Energy, rewards, daily caps |
| Neglect | BCT-NEGLECT-* | §9.4.3 | Neglect & Withdrawal (Classic) |
| Shop | BCT-SHOP-* | §5.4, §11.5, §14.7 | Prices, purchase flow, gating, UI |
| Inventory | BCT-INV-* | §11.7, §14.8 | Capacity, stacking, decomposition, UI |
| Multi-Pet | BCT-MULTIPET-* | §8.2.1, §9.4.4–9.4.6, §14.6 | Energy scope, runaway handling, switching, offline, alerts |
| Pet Slots | BCT-PETSLOTS-* | §11.6, §6 | Multi-pet ownership, slots, global resources |
| Weight | BCT-WEIGHT-* | §5.7, §9.4.7.1 | Weight states, gain, decay, offline |
| Sickness | BCT-SICKNESS-* | §9.4.2, §9.4.7.2 | Sickness triggers, effects, recovery |
| Sickness Offline | BCT-SICKNESS-OFFLINE-* | §9.4.7.3 | Offline timer accumulation, 2× decay |
| Alert Health | BCT-ALERT-HEALTH-* | §11.6.1 | Weight/Sickness alert routing |
| Cozy Immunity | BCT-COZY-IMMUNITY-* | §9.3 | Sickness/Obese immunity in Cozy |
| **Achievements** | BCT-ACH-* | §17 | 🔲 Reserved (P12-A) |
| **Login Streak** | BCT-STREAK-* | §10.3.1 | 🔲 Reserved (P12-B) |
| **Mystery Box** | BCT-MBOX-* | §10.3.2 | 🔲 Reserved (P12-B) |
| **Notifications** | BCT-NOTIF-* | §11.6.2 | 🔲 Reserved (P12-0) |
| **Triggers** | BCT-TRIGGER-* | §11.6.3 | 🔲 Reserved (P12-0) |
| Notifications | BCT-NOTIF-* | §11.6.2 | ✅ Notification Center (P12-0) |
| Triggers | BCT-TRIGGER-* | §11.6.3 | ✅ Trigger conditions & suppression (P12-0) |
| **Events** | BCT-EVENT-* | §10.7 | 🔲 Reserved (P12-D) |
| **Session Games** | BCT-SESSION-* | §8.5 | 🔲 Reserved (P13) |

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

### BCT-ECON-004: Starting Coins

**Bible:** §5.8
**Requirement:** New player starts with 100 coins.

| Check | Expected |
|-------|----------|
| Fresh save coins | initialState.coins === 100 |

### BCT-ECON-005: Starting Gems

**Bible:** §5.8
**Requirement:** New player starts with 0 gems.

| Check | Expected |
|-------|----------|
| Fresh save gems | initialState.gems === 0 |

### BCT-ECON-006: Tutorial Inventory — Apples

**Bible:** §5.8
**Requirement:** New save includes 2× Apple in starting inventory.

| Check | Expected |
|-------|----------|
| Tutorial apple count | inventory.apple === 2 |

### BCT-ECON-007: Tutorial Inventory — Bananas

**Bible:** §5.8
**Requirement:** New save includes 2× Banana in starting inventory.

| Check | Expected |
|-------|----------|
| Tutorial banana count | inventory.banana === 2 |

### BCT-ECON-008: Tutorial Inventory — Cookie

**Bible:** §5.8
**Requirement:** New save includes 1× Cookie in starting inventory.

| Check | Expected |
|-------|----------|
| Tutorial cookie count | inventory.cookie === 1 |

### BCT-ECON-009: After-Cap Rewards Zero

**Bible:** §8.1.1
**Requirement:** After daily cap (3 plays), all rewards = 0.

| Check | Expected |
|-------|----------|
| Coins after play 4+ | 0 |
| XP after play 4+ | 0 |
| Food after play 4+ | None |
| Gems after play 4+ | 0 (always — see BCT-ECON-001) |

### BCT-ECON-010: Games Remain Playable After Cap

**Bible:** §8.1.1
**Requirement:** Mini-games playable for fun after cap (no lockout).

| Check | Expected |
|-------|----------|
| Play 4+ permitted | Yes — game launches |
| Gameplay quality | Identical (no handicaps) |
| High scores | Still tracked |

### BCT-ECON-011: Energy Cost Uniform

**Bible:** §8.1.1
**Requirement:** All mini-games cost Bible §8.2 energy value per play.

| Check | Expected |
|-------|----------|
| All burst games | Bible §8.2 energy cost |
| All session games | Bible §8.2 energy cost |
| First daily play | 0 (free) |

### BCT-ECON-012: Rainbow Tier Zero Gems (Explicit)

**Bible:** §8.1.1
**Requirement:** Even Rainbow tier awards 0 gems. No exceptions.

| Check | Expected |
|-------|----------|
| Rainbow tier any game | gems === 0 |
| Rationale | Prevents "special tier" loophole |

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

### BCT-LAYOUT-001: Mobile Viewport No-Scroll

**Bible:** §14.6
**Requirement:** On phone viewport (360×640 to 414×896), all critical elements visible without scrolling.

| Check | Expected |
|-------|----------|
| Pet sprite | Visible without scroll |
| Feed action | Accessible without scroll |
| Navigation | Visible without scroll |
| Currency display | Visible without scroll |

### BCT-LAYOUT-002: Stage Fills Available Space

**Bible:** §14.6 (flex-1 stage)
**Requirement:** Pet stage expands to fill vertical space between header and action bar.

| Check | Expected |
|-------|----------|
| Stage height | Dynamic (not fixed px) |
| Stage fills gap | No dead space above/below stage |

### BCT-LAYOUT-003: Stage Edge-to-Edge

**Bible:** §14.6
**Requirement:** Stage has no horizontal margins (full-width).

| Check | Expected |
|-------|----------|
| Stage width | 100% of container |
| Horizontal gaps | None |

### BCT-LAYOUT-004: Stage No Decorative Styling

**Bible:** §14.6
**Requirement:** Stage has no border-radius or box-shadow.

| Check | Expected |
|-------|----------|
| Rounded corners | None |
| Drop shadow | None |

### BCT-LAYOUT-005: Sprite Proportional to Stage

**Bible:** §14.6
**Requirement:** Pet sprite scales relative to stage height (Bible §14.6 ratio).

| Check | Expected |
|-------|----------|
| Sprite max height | Bible §14.6 percentage of stage |
| Sprite not clipped | Fully visible |

### BCT-LAYOUT-006: Sprite Desktop Cap

**Bible:** §14.6
**Requirement:** On large screens, sprite has maximum height cap per Bible §14.6.

| Check | Expected |
|-------|----------|
| Desktop sprite height | ≤ Bible §14.6 desktop cap |
| Sprite remains proportional | Yes |

### BCT-LAYOUT-007: Food Drawer Constraint

**Bible:** §14.6
**Requirement:** Food Drawer shows ≥4 foods visible without scrolling when open.

| Check | Expected |
|-------|----------|
| Visible food items | ≥ 4 when drawer open |
| Scroll required | No (for first 4) |

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

### BCT-ART-01: Asset Coverage

**Bible:** §13.7
**Requirement:** All pets have idle sprites for all stages; core poses available for all pets.

| Check | Expected |
|-------|----------|
| Idle sprites | All 8 pets × 3 stages have idle sprite |
| Core poses | idle, happy, sad, sleeping available for all pets |
| Registry complete | PET_SPRITES has 8 entries; PET_SPRITES_BY_STAGE has 24 combos |

### BCT-ART-02: Fallback Chain

**Bible:** §13.7
**Requirement:** Pose fallback chain works correctly for missing poses.

| Check | Expected |
|-------|----------|
| POSE_FALLBACKS defined | All 11 poses have fallback chain |
| idle has empty chain | idle is ultimate fallback |
| eating_loved falls back | → eating → ecstatic → happy → idle |

### BCT-ART-03: No-Orb Guarantee

**Bible:** §13.7
**Requirement:** Known pet/stage combos never show orb/emoji fallback in production.

| Check | Expected |
|-------|----------|
| resolvePetSprite returns sprite | Non-null for all known combos |
| getStageAwarePetSprite always resolves | Returns sprite for all 8 pets × 3 stages × 11 poses |
| hasSpriteForStage returns true | All known combos have sprites |

### BCT-ART-04: Stage-Aware Resolution

**Bible:** §13.7
**Requirement:** Sprite resolution is stage-aware; unknown inputs handled gracefully.

| Check | Expected |
|-------|----------|
| PET_SPRITES_BY_STAGE structure | baby, youth, evolved for all pets |
| Unknown pet returns null | resolvePetSprite handles gracefully |
| Fallback to munchlet | getStageAwarePetSprite uses munchlet as last resort |

### BCT-ART-05: Extended Poses (P6-ART-POSES)

**Bible:** §13.7
**Requirement:** 11 poses wired: 4 core + 7 extended.

| Check | Expected |
|-------|----------|
| CORE_POSES | idle, happy, sad, sleeping (4) |
| EXTENDED_POSES | eating, eating_loved, ecstatic, excited, hungry, satisfied, crying (7) |
| Total poses | 11 poses defined |

### BCT-ART-06: Legacy API Compatibility

**Bible:** §13.7
**Requirement:** getPetSprite() still works for backward compatibility.

| Check | Expected |
|-------|----------|
| getPetSprite works | Returns sprite for all pets/poses |
| Unknown pet fallback | Falls back to munchlet |
| Missing pose fallback | Uses fallback chain |

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

## Neglect & Withdrawal Tests (BCT-NEGLECT-*)

### BCT-NEGLECT-001: Worried State Trigger

**Bible:** §9.4.3
**Requirement:** Day 2 of neglect triggers Worried state.

| Check | Expected |
|-------|----------|
| 2 neglect days | Worried state triggered |
| Visual | Worried pose, "..." thought bubble |
| Penalty | None |

### BCT-NEGLECT-002: Sad State Trigger

**Bible:** §9.4.3
**Requirement:** Day 4 of neglect triggers Sad state.

| Check | Expected |
|-------|----------|
| 4 neglect days | Sad state triggered |
| Visual | Sad pose, thought bubble |
| Penalty | None |

### BCT-NEGLECT-003: Withdrawn State Trigger

**Bible:** §9.4.3
**Requirement:** Day 7 of neglect triggers Withdrawn state.

| Check | Expected |
|-------|----------|
| 7 neglect days | Withdrawn state triggered |
| Visual | Desaturated appearance, 💔 badge |
| Immediate effect | Bond -25% |

### BCT-NEGLECT-004: Withdrawal Bond Penalty

**Bible:** §9.4.3
**Requirement:** Day 7 applies -25% bond instantly.

| Check | Expected |
|-------|----------|
| Bond before withdrawal | 100% |
| Bond after withdrawal triggers | 75% |
| Instant application | No delay |

### BCT-NEGLECT-005: Withdrawn Ongoing Penalties

**Bible:** §9.4.3
**Requirement:** Withdrawn state reduces bond gains by 50%, mood gains by 25%.

| Check | Expected |
|-------|----------|
| Bond gain modifier | 50% reduction |
| Mood gain modifier | 25% reduction |
| Until recovered | Penalties persist |

### BCT-NEGLECT-006: Critical State Trigger

**Bible:** §9.4.3
**Requirement:** Day 10 triggers Critical warning.

| Check | Expected |
|-------|----------|
| 10 neglect days | Critical state triggered |
| Visual | Withdrawn + pulsing "!" indicator |
| Penalty | Same as Withdrawn |

### BCT-NEGLECT-007: Runaway State Trigger

**Bible:** §9.4.3
**Requirement:** Day 14 triggers Runaway.

| Check | Expected |
|-------|----------|
| 14 neglect days | Runaway state triggered |
| Visual | Pet disappears |
| Effect | Pet locked out |

### BCT-NEGLECT-008: Free Withdrawal Recovery

**Bible:** §9.4.3
**Requirement:** 7 consecutive care days clears withdrawal.

| Check | Expected |
|-------|----------|
| 7 care days | Withdrawal cleared |
| Visual restored | Desaturation removed |
| Bond gains | Return to 100% |
| Neglect counter | Resets to 0 |

### BCT-NEGLECT-009: Paid Withdrawal Recovery

**Bible:** §9.4.3
**Requirement:** 15 gems clears withdrawal instantly.

| Check | Expected |
|-------|----------|
| Gem cost | 15 💎 |
| Effect | Instant recovery |
| Result | Same as free recovery |

### BCT-NEGLECT-010: Free Runaway Return

**Bible:** §9.4.3
**Requirement:** 72h wait enables free return from runaway.

| Check | Expected |
|-------|----------|
| Wait time | 72 hours |
| Action | Tap "Call Back" |
| Bond penalty | -50% on return |

### BCT-NEGLECT-011: Paid Runaway Return

**Bible:** §9.4.3
**Requirement:** 24h + 25 gems enables paid return.

| Check | Expected |
|-------|----------|
| Wait time | 24 hours |
| Gem cost | 25 💎 |
| Bond penalty | -50% on return |

### BCT-NEGLECT-012: Runaway Bond Penalty

**Bible:** §9.4.3
**Requirement:** Runaway return applies -50% bond.

| Check | Expected |
|-------|----------|
| Bond on return | Reduced by 50% |
| Applied | On return, not during lockout |

### BCT-NEGLECT-013: Offline Neglect Cap

**Bible:** §9.4.3
**Requirement:** Offline neglect capped at 14 days.

| Check | Expected |
|-------|----------|
| 20 days offline | 14 neglect days (capped) |
| 30 days offline | 14 neglect days (capped) |
| Max consequence | Runaway (not worse) |

### BCT-NEGLECT-014: Cozy Mode Exempt

**Bible:** §9.4.3
**Requirement:** Cozy mode disables all neglect mechanics.

| Check | Expected |
|-------|----------|
| Neglect Days | Never increase |
| Worried/Sad/Withdrawn | Never trigger |
| Recovery costs | Not applicable |
| Fields | Remain zero/default |

### BCT-NEGLECT-015: Feed Resets Counter

**Bible:** §9.4.3
**Requirement:** Feed action resets neglect counter.

| Check | Expected |
|-------|----------|
| Feed action | Neglect counter = 0 |
| lastCareDate | Updated |

### BCT-NEGLECT-016: Play Resets Counter

**Bible:** §9.4.3
**Requirement:** Play action resets neglect counter.

| Check | Expected |
|-------|----------|
| Play action | Neglect counter = 0 |
| lastCareDate | Updated |

### BCT-NEGLECT-017: Passive Actions No Reset

**Bible:** §9.4.3
**Requirement:** Passive actions (view, clean, switch pet) do NOT reset counter.

| Check | Expected |
|-------|----------|
| View pet | No counter reset |
| Clean poop | No counter reset |
| Switch pet | No counter reset |
| Open app | No counter reset |

### BCT-NEGLECT-018: Sickness Independence

**Bible:** §9.4.3
**Requirement:** Sickness and Withdrawal are independent systems.

| Check | Expected |
|-------|----------|
| Sickness trigger | Does not affect neglect |
| Withdrawal trigger | Does not affect sickness |
| Cannot coexist | Sickness = present, Withdrawal = absent |

### BCT-NEGLECT-019: Care Mistakes Independence

**Bible:** §9.4.3
**Requirement:** Care Mistakes and Neglect are independent systems.

| Check | Expected |
|-------|----------|
| Care mistakes | Track quality when present |
| Neglect | Tracks absence |
| Independent counters | Both can be zero or non-zero |

### BCT-NEGLECT-020: FTUE Protection

**Bible:** §9.4.3
**Requirement:** Neglect disabled during onboarding.

| Check | Expected |
|-------|----------|
| During FTUE | Neglect counter frozen |
| No states trigger | Worried/Sad/Withdrawn/Runaway blocked |
| After FTUE | Neglect system activates |

### BCT-NEGLECT-021: Grace Period

**Bible:** §9.4.3
**Requirement:** No neglect for first 48h after account creation.

| Check | Expected |
|-------|----------|
| First 48 hours | No Neglect Days accrue |
| After 48 hours | Neglect system activates |

### BCT-NEGLECT-022: Per-Pet Tracking

**Bible:** §9.4.3
**Requirement:** Each pet has independent neglect counter.

| Check | Expected |
|-------|----------|
| Pet A neglected | Only Pet A counter increases |
| Pet B cared for | Pet B counter stays 0 |
| Independent | No transfer between pets |

### BCT-NEGLECT-023: Active Pet No Care

**Bible:** §9.4.3
**Requirement:** Active pet status does not count as care.

| Check | Expected |
|-------|----------|
| Set as active | Not a care action |
| Still needs feed/play | Counter not reset by selection |

---

## Shop Tests (BCT-SHOP-*)

### Pricing & Catalog Tests

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-001 | Individual food prices match §5.4 | §5.4, §11.5.1 | Unit price for each individual food equals §5.4 Cost column |
| BCT-SHOP-002 | Bundle + care item prices match Shop table | §11.5 | Each shop item id has correct price (coins/gems) as defined in §11.5 |
| BCT-SHOP-003 | Individual foods are coins-only | §11.5.1 | All individual food purchases require coins; gem cost must be null/0 |
| BCT-SHOP-004 | Food tab ordering: Bundles before Individual | §14.7 | UI renders Bundles section above Individual section |

### Quantity Selector & Cost Math

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-005 | Quantity selector min=1 | §11.5.1 | Quantity cannot be set below 1 |
| BCT-SHOP-006 | Quantity selector max=10 | §11.5.1 | Quantity cannot be set above 10 |
| BCT-SHOP-007 | Total cost = unitCost × quantity | §11.5.1 | Purchase modal displays totalCost correctly for individual foods |

### Purchase Flow (Coins + Inventory)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-008 | Successful purchase deducts coins | §11.5.1 | coins decreases by totalCost; no other currency changes |
| BCT-SHOP-009 | Successful individual purchase adds to inventory | §11.5.1, §11.7.1 | inventory[foodId] += quantity (base ids) |
| BCT-SHOP-010 | Successful bundle purchase decomposes to base items | §11.7.1 | Buying bundle increases multiple base ids (no bundle id stored in inventory) |
| BCT-SHOP-011 | Insufficient coins blocks purchase | §11.5.1 | Returns error "Not enough coins!", no state change |
| BCT-SHOP-012 | Slot exhaustion blocks purchase | §11.7.1 | Returns error "Inventory full!", no state change |
| BCT-SHOP-013 | Stack overflow blocks purchase (99+) | §11.7.1 | Returns error "Inventory full!", no state change |

### Visibility & Gating

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-014 | Medicine hidden in Cozy mode | §11.5, §14.7 | `care_medicine` not in Care list when mode = cozy |
| BCT-SHOP-015 | Medicine visible in Classic mode | §11.5, §14.7 | `care_medicine` present when mode = classic |
| BCT-SHOP-016 | Diet Food hidden when weight < 31 | §5.7, §11.5, §14.7 | `care_diet_food` not present when weight < 31 |
| BCT-SHOP-017 | Diet Food visible when weight >= 31 | §5.7, §11.5, §14.7 | `care_diet_food` present when weight >= 31 |
| BCT-SHOP-018 | Gems tab locked below Level 5 | §11.5, §14.7 | Gems tab shows locked state when player level < 5 |
| BCT-SHOP-019 | Gems tab unlocks at Level 5+ | §11.5, §14.7 | Gems tab becomes active when player level >= 5 |
| BCT-SHOP-020 | Cosmetics tab is "Coming Soon" stub | §14.7 | Cosmetics tab renders stub state (no purchasable cosmetics in Web Phase 8) |

### Sorting

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-021 | Individual foods sorted by rarity | §14.7 | UI order is Common → Uncommon → Rare → Epic → Legendary |

### Recommendations (Deterministic)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-022 | Recommended section hidden when no triggers | §14.7 | No "Recommended For You" section when all trigger conditions false |
| BCT-SHOP-023 | Recommended prioritizes sick→medicine | §14.7 | When classic + sick, first recommendation is `care_medicine` |
| BCT-SHOP-024 | Recommended includes energy drink at low energy | §14.7 | When energy < 20, includes `care_energy_drink` unless superseded by sick |
| BCT-SHOP-025 | Recommended includes balanced pack at low hunger | §14.7 | When hunger < 30, includes `food_balanced_x5` unless superseded by higher priorities |

> Recommendation tests should validate **presence + ordering** (priority) and must also verify that ineligible items are skipped.

---

## Inventory Tests (BCT-INV-*)

### Slot & Stack Semantics

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-001 | Base capacity is 15 slots | §11.7 | initialState.inventoryCapacity === 15 |
| BCT-INV-002 | Slot counts unique item ids only | §11.7.1 | inventoryUsedSlots = count(keys with qty>0) |
| BCT-INV-003 | Stack max is 99 per id | §11.7.1 | inventory[itemId] cannot exceed 99 |
| BCT-INV-004 | Quantity reaching 0 removes slot | §11.7.1 | Setting qty to 0 removes key or marks as empty |
| BCT-INV-005 | Purchase blocked when new slot required but none available | §11.7.1 | "Inventory full!", no state change |
| BCT-INV-006 | Purchase allowed when item already exists (no new slot) | §11.7.1 | If item exists and stack allows, purchase succeeds |

### Bundle Decomposition

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-007 | Apple bundle adds 5 apples | §11.5, §11.7.1 | Buying `food_apple_x5` results in `inventory.apple += 5` |
| BCT-INV-008 | Spicy sampler decomposes correctly | §11.5, §11.7.1 | Buying `food_spicy_x3` adds `hot_pepper += 3` and `spicy_taco += 2` |

#### Bundle Decomposition Truth Table (Bible v1.6 §11.5 / §11.7.1)

Deterministic bundle decompositions (Inventory stores base IDs only):

| Bundle ID | Decomposition | Notes |
|-----------|---------------|-------|
| `food_apple_x5` | `{ apple: 5 }` | |
| `food_balanced_x5` | `{ apple: 2, banana: 1, carrot: 1, lollipop: 1 }` | Bible §11.5 says "5× mixed common foods." Bible §5.4 defines Candy as Uncommon, so balanced pack must remain common-only and may repeat a common. |
| `food_spicy_x3` | `{ hot_pepper: 3, spicy_taco: 2 }` | |
| `food_sweet_x3` | `{ cookie: 3, candy: 2 }` | |
| `food_legendary_x1` | `{ golden_feast: 1 }` | |

Non-deterministic bundles (runtime selection; deterministic in tests via injected selector/seed):

| Bundle ID | Selection Rule |
|-----------|----------------|
| `food_rare_x1` | 1× random Rare food (from rarity pool: spicy_taco, hot_pepper, ice_cream) |
| `food_epic_x1` | Birthday Cake OR Dream Treat (Bible-defined choice) |

**Implementation rule:** Decomposition occurs on purchase (Shop-B), and Inventory stores only base item IDs.

**Primary refs:** Bible v1.6 §11.5, §11.7.1; BCT v2.2 Shop/Inventory bundle expectations.

### Inventory UI (Web)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-009 | Food tab filters to food only | §14.8 | Food tab renders only food items |
| BCT-INV-010 | Care tab filters to care only | §14.8 | Care tab renders only care items |
| BCT-INV-011 | Item card shows quantity badge | §14.8 | Each item card displays "×N" |
| BCT-INV-012 | Slot counter shows X/15 | §14.8 | Header displays used/total slots |
| BCT-INV-013 | Empty state shows Shop CTA | §14.8 | When inventory empty, "Go to Shop" CTA exists |

### Item Detail & Use Flow

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-014 | Detail modal shows quantity | §14.8 | Quantity displayed in modal |
| BCT-INV-015 | Detail modal shows rarity | §14.8 | Rarity displayed in modal |
| BCT-INV-016 | Detail modal shows affinities | §14.8 | For foods, affinity reactions for all pets are displayed |
| BCT-INV-017 | "Use on Pet" routes to feeding flow | §14.8 | Button triggers feed flow with item preselected |

---

## Pet Slots Tests (BCT-PETSLOTS-*)

### Slot Configuration

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-PETSLOTS-001 | Max slots is 4 | §11.6 | PET_SLOTS_CONFIG.MAX_SLOTS === 4 |
| BCT-PETSLOTS-002 | Free player slots is 1 | §11.6 | PET_SLOTS_CONFIG.FREE_PLAYER_SLOTS === 1 |
| BCT-PETSLOTS-003 | Plus subscriber slots is 2 | §11.8 | PET_SLOTS_CONFIG.PLUS_SUBSCRIBER_SLOTS === 2 |

### Global Resource Rules

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-PETSLOTS-004 | Coins are global | §11.6 | Coins persist across pet switches |
| BCT-PETSLOTS-005 | Gems are global | §11.6 | Gems persist across pet switches |
| BCT-PETSLOTS-006 | Inventory is global | §11.6 | Inventory persists across pet switches |

### Per-Pet State Independence

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-PETSLOTS-007 | Each pet has separate level | §6 | Pet levels are independent |
| BCT-PETSLOTS-008 | Each pet has separate bond | §6 | Pet bond is independent |
| BCT-PETSLOTS-009 | Each pet has separate mood | §6 | Pet mood is independent |
| BCT-PETSLOTS-010 | Each pet has separate hunger | §6 | Pet hunger is independent |
| BCT-PETSLOTS-011 | Switching pets is instant | §11.6 | Switch completes < 100ms |

---

## Multi-Pet Runtime Tests (BCT-MULTIPET-*)

### Energy Scope (Global)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-001 | Energy is global (shared pool) | §8.2.1 | Single energy pool shared across all owned pets |
| BCT-MULTIPET-002 | First-free daily game is global | §8.2.1 | One free play per day total, not per pet |
| BCT-MULTIPET-003 | Daily cap (3 plays) is global | §8.2.1 | 3 rewarded plays per day across all pets |

### Runaway Auto-Switch

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-004 | Runaway triggers auto-switch | §9.4.4 | When active pet enters runaway, auto-switch to next available pet in slot order |
| BCT-MULTIPET-005 | All-pets-runaway shows empty state | §9.4.4 | If all pets runaway, show "All Pets Away" state with recovery prompts |

### Runaway Slot Handling

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-006 | Runaway pets remain in slot | §9.4.4 | Runaway pets stay in their slot with 🔒 lockout indicator |
| BCT-MULTIPET-007 | Runaway pets are selectable for recovery | §9.4.4 | Player can select runaway pet to view recovery UI |

### Switching Constraints

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-008 | Switching TO withdrawn/critical allowed | §9.4.5 | Players can switch to neglected pets to care for them |

### Offline Multi-Pet Rules

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-009 | Offline mood decays for all pets | §9.4.6 | Mood decays -5/24h for ALL owned pets (floor 30) |
| BCT-MULTIPET-010 | Offline bond decays for all pets | §9.4.6 | Bond decays -2/24h for ALL owned pets (floor 0); Plus: -1/24h |
| BCT-MULTIPET-011 | Offline neglect accrues for all pets | §9.4.6 | Neglect +1/day for ALL owned pets (cap 14) |

### Multi-Pet Alert Routing & Suppression

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-MULTIPET-012 | Neglect alerts fire once per transition | §14.6.2 | Stage transition alerts fire once, not repeatedly |
| BCT-MULTIPET-013 | Alert cooldown is 30 minutes per pet | §14.6.2 | Minimum 30 minutes between alerts for same pet (except runaway) |
| BCT-MULTIPET-014 | Offline return batches alerts | §14.6.2 | Returning from offline shows batched "Welcome Back" summary |

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
| `src/__tests__/bct-hud.spec.ts` | BCT-HUD-001, 002 |
| `src/__tests__/bct-pet-nav.spec.ts` | BCT-PET-01, 02, BCT-NAV-001 |
| `src/__tests__/bct-env.spec.ts` | BCT-ENV-001, 002 |
| `src/__tests__/bct-mobile-layout.spec.ts` | BCT-LAYOUT-001 |
| `src/__tests__/bct-art.spec.ts` | BCT-ART-01 thru 06 (401 tests) |
| `src/__tests__/bct-petslots.spec.ts` | BCT-PETSLOTS-001 thru 011 (P9-A) |
| `src/__tests__/bct-multipet.spec.ts` | BCT-MULTIPET-001 thru 014 (P9-B) |

**Run:**

```bash
npm run test:bible
```

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

**Run:**

```bash
npm run test:bible:e2e
```

> Note: E2E tests require the dev server running. The script automatically starts it via Playwright.

### Test Coverage by Bible Section

| Bible Section | Spec Tests | E2E Tests |
|--------------|------------|-----------|
| §4.3-4.4 (Feeding/Cooldown) | ✅ bct-core-loop.spec.ts | — |
| §4.4 (HUD) | ✅ bct-hud.spec.ts | ✅ BCT-HUD-01 |
| §6 (Per-Pet Stats) | ✅ bct-petslots.spec.ts | — |
| §6.1 (Evolution) | ✅ bct-evolution.spec.ts | — |
| §7.4 (FTUE) | ✅ bct-environments.spec.ts | ⏳ (skipped) |
| §8.2-8.3 (Mini-games) | ✅ bct-economy.spec.ts | — |
| §8.2.1 (Energy Scope) | ⏳ bct-multipet.spec.ts (P9-B) | — |
| §9.4.3 (Neglect) | ✅ bct-neglect.spec.ts | — |
| §9.4.4-9.4.6 (Multi-Pet Runtime) | ⏳ bct-multipet.spec.ts (P9-B) | — |
| §11.6 (Pet Slots) | ✅ bct-petslots.spec.ts | — |
| §14.4 (Rooms/Environment) | ✅ bct-environments.spec.ts, bct-env.spec.ts | — |
| §14.5 (Navigation/Pet) | ✅ bct-pet-nav.spec.ts | ✅ BCT-NAV-01, BCT-PET-01 |
| §14.6 (Mobile Layout) | ✅ bct-mobile-layout.spec.ts | ✅ BCT-MOBILE-01 |
| §14.6.1-14.6.2 (Multi-Pet Alerts) | ⏳ bct-multipet.spec.ts (P9-B) | — |

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

## Weight Tests (BCT-WEIGHT-*) — P10 COMPLETE

> **Status:** Implemented in P10 Weight/Sickness runtime (December 2025).
> **Bible Reference:** §5.7, §9.4.7.1

### BCT-WEIGHT-001: Per-Pet Weight Tracking

**Bible:** §9.4.7.1
**Requirement:** Each pet tracks independent weight 0-100.

| Check | Expected |
|-------|----------|
| Weight is per-pet | Each pet has independent weight value |
| Weight persists | Saved and restored on reload |
| Starting weight | 0 for new pets |

### BCT-WEIGHT-002: Weight Gain from Snacks

**Bible:** §5.7, §9.4.7.1
**Requirement:** Snack risk % adds absolute points to weight.

| Check | Expected |
|-------|----------|
| Cookie adds +5 | Weight increases by 5 points |
| Candy adds +10 | Weight increases by 10 points |
| Ice Cream adds +10 | Weight increases by 10 points |
| Non-snack foods add 0 | No weight change from regular food |

### BCT-WEIGHT-003: Weight Decay

**Bible:** §9.4.7.1
**Requirement:** Weight decays -1 per hour.

| Check | Expected |
|-------|----------|
| Online decay | -1 per hour while playing |
| Offline decay | -1 per hour while away |
| Floor at 0 | Cannot go negative |
| 14-day cap | Max -336 points from offline |

### BCT-WEIGHT-004 through BCT-WEIGHT-012

*Additional planned tests for weight states, visual changes, Obese mini-game blocking, and weight recovery.*

---

## Sickness Tests (BCT-SICKNESS-*) — P10 COMPLETE

> **Status:** Implemented in P10 Weight/Sickness runtime (December 2025).
> **Bible Reference:** §9.4.2, §9.4.7.2

### BCT-SICKNESS-001: Classic Mode Only

**Bible:** §9.4.7.2
**Requirement:** Sickness is disabled in Cozy Mode.

| Check | Expected |
|-------|----------|
| Cozy Mode | `isSick` always false |
| Classic Mode | Sickness can trigger normally |

### BCT-SICKNESS-002: Hunger Timer Trigger

**Bible:** §9.4.7.2
**Requirement:** Hunger=0 for 30min triggers 20% sickness chance.

| Check | Expected |
|-------|----------|
| Timer starts | When hunger reaches 0 |
| Timer pauses | When hunger > 0 |
| Roll chance | 20% on timer completion |

### BCT-SICKNESS-003: Poop Timer Trigger

**Bible:** §9.4.7.2
**Requirement:** Uncleaned poop for 2hr triggers 15% sickness chance.

| Check | Expected |
|-------|----------|
| Timer starts | When poop appears |
| Timer pauses | When poop cleaned |
| Roll chance | 15% on timer completion |

### BCT-SICKNESS-004 through BCT-SICKNESS-018

*Additional planned tests for sick state effects, 2× decay, mini-game blocking, care mistakes, medicine recovery.*

---

## Sickness Offline Tests (BCT-SICKNESS-OFFLINE-*) — P10 COMPLETE

> **Status:** Implemented in P10 Weight/Sickness runtime (December 2025).
> **Bible Reference:** §9.4.7.3

### BCT-SICKNESS-OFFLINE-001: Timer Accumulation

**Bible:** §9.4.7.3
**Requirement:** Sickness trigger timers accumulate during offline.

| Check | Expected |
|-------|----------|
| Hunger=0 at save | 30-min timer accumulates |
| Poop uncleaned at save | 2-hr timer accumulates |
| Timer > threshold | Roll sickness on return |

### BCT-SICKNESS-OFFLINE-002: Sick Effects Run Offline

**Bible:** §9.4.7.3
**Requirement:** If sick during offline, 2× stat decay applies.

| Check | Expected |
|-------|----------|
| Mood decay | 2× normal rate |
| Hunger decay | 2× normal rate |
| Bond decay | 2× normal rate |

### BCT-SICKNESS-OFFLINE-003 through BCT-SICKNESS-OFFLINE-008

*Additional planned tests for care mistake accumulation (1/hr, cap 4), multi-pet offline sickness.*

---

## Alert Health Tests (BCT-ALERT-HEALTH-*) — P10 COMPLETE

> **Status:** Implemented in P10 Weight/Sickness runtime (December 2025).
> **Bible Reference:** §11.6.1

### BCT-ALERT-HEALTH-001: Obese Weight Warning

**Bible:** §11.6.1
**Requirement:** Toast when pet enters Obese state.

| Check | Expected |
|-------|----------|
| Weight >= 81 | Toast: "{Pet} is getting too heavy!" |
| Routing | Per-pet |

### BCT-ALERT-HEALTH-002: Weight Recovery Alert

**Bible:** §11.6.1
**Requirement:** Toast when pet returns to Normal weight.

| Check | Expected |
|-------|----------|
| Weight < 31 | Toast: "{Pet} is back to healthy weight!" |
| Routing | Per-pet |

### BCT-ALERT-HEALTH-003: Sickness Onset Alert

**Bible:** §11.6.1
**Requirement:** Toast and badge when pet becomes sick.

| Check | Expected |
|-------|----------|
| Pet becomes sick | Toast: "{Pet} is sick!" + badge |
| Classic only | Alert only in Classic Mode |

### BCT-ALERT-HEALTH-004 through BCT-ALERT-HEALTH-008

*Additional planned tests for sickness reminder, priority ordering, suppression rules.*

---

## Cozy Immunity Tests (BCT-COZY-IMMUNITY-*) — P10 COMPLETE

> **Status:** Implemented in P10 Weight/Sickness runtime (December 2025).
> **Bible Reference:** §9.3

### BCT-COZY-IMMUNITY-001: No Sickness in Cozy

**Bible:** §9.3
**Requirement:** Sickness system completely disabled in Cozy Mode.

| Check | Expected |
|-------|----------|
| Hunger=0 trigger | Does not fire |
| Poop trigger | Does not fire |
| Snack trigger | Does not fire |
| `isSick` | Always false |

### BCT-COZY-IMMUNITY-002: Obese Visual Only

**Bible:** §9.3
**Requirement:** Obese state in Cozy is visual only — no gameplay effects.

| Check | Expected |
|-------|----------|
| Weight >= 81 | Visual change (30% wider) |
| Happiness decay | Normal (not 2×) |
| Mini-games | **Not blocked** |

### BCT-COZY-IMMUNITY-003 through BCT-COZY-IMMUNITY-006

*Additional planned tests for neglect immunity, care mistakes immunity, evolution always positive.*

---

## Phase 11-0 — Gem Sources

> **Status:** ✅ Implemented. Bible v1.10 §10.3, §11.4.

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-GEM-LEVELUP-001 | Level-up awards +5💎 per level gained | §11.4 |
| BCT-GEM-DAILYFEED-001 | First successful feed of day awards +1💎 | §11.4 |
| BCT-GEM-DAILYFEED-002 | Second+ feed same day awards 0 daily gems | §11.4 |
| BCT-GEM-DAILYFEED-003 | STUFFED-blocked feed awards 0💎 | §4.4, §11.4 |
| BCT-GEM-STREAK-001 | Day 7 login streak awards +10💎 and resets to Day 1 | §10.3, §11.4 |
| BCT-GEM-STREAK-002 | Missing day resets streak to Day 1 (0💎) | §10.3 |
| BCT-GEM-STREAK-003 | Same-day reopen does not advance streak | §10.3 |
| BCT-GEM-NOMINIGAME-001 | Mini-games award 0💎 (all tiers including Rainbow) | §8.3, §11.4 |

---

## Phase 11 — Cosmetics

> **Status:** P11-A Foundations + P11-B UI Wiring implemented. P11-C Render + Purchase pending.

### Implemented Test Categories (P11-A, P11-B)

| Category | Count | Coverage | Status |
|----------|-------|----------|--------|
| **BCT-GEM-SOURCES** | **8** | Level-up, first-feed, login streak gem awards (Phase 11-0) | ✅ Implemented |
| **BCT-COS-OWN** | **1** | Pet-bound ownership (no cross-pet equip) | ✅ Implemented |
| **BCT-COS-EQ** | **2** | Equip requires ownership + one-per-slot | ✅ Implemented |
| **BCT-COS-UNEQ** | **1** | Unequip clears slot | ✅ Implemented |
| **BCT-COS-MULTI** | **1** | Same SKU multi-pet allowed | ✅ Implemented |
| **BCT-COS-GEMS** | **1** | Cosmetics gems-only (coins not permitted) | ✅ Implemented |
| **BCT-COS-NOSTAT** | **1** | Equip/unequip doesn't affect stats | ✅ Implemented |
| **BCT-COS-UI-SHOP** | **3** | Shop cosmetics panel: catalog, controls, price | ✅ Implemented (P11-B) |
| **BCT-COS-UI-INV** | **3** | Inventory cosmetics: slot grouping, equip, empty | ✅ Implemented (P11-B) |
| **BCT-COS-RENDER** | **4** | Cosmetic layer rendering: visibility, order, pet switching, multi-surface | ✅ Implemented (P11-C) |

### Planned Test Categories (Purchase)

| Category | Count | Coverage | Status |
|----------|-------|----------|--------|
| **BCT-COSMETICS-PURCHASE** | ~12 | Gems deducted, bound to active pet, duplicate blocked | Pending (P11-B) |
| **BCT-COSMETICS-RENDER** | ~4 | Layer order, fallback on missing asset | Pending (P11-C) |
| **BCT-COSMETICS-RARITY** | ~4 | Rarity tier → UI mapping | Pending (P11-B) |

---

### Phase 11 P11-A Foundations — Implemented Specs

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-COS-OWN-001 | Cosmetics are pet-bound (no cross-pet equip) | §11.5.2 |
| BCT-COS-EQ-001 | Equip requires ownership + matching slot | §11.5.3 |
| BCT-COS-EQ-002 | One cosmetic per slot; equipping replaces previous | §11.5.3 |
| BCT-COS-UNEQ-001 | Unequip clears slot (cosmetic remains owned) | §11.5.3 |
| BCT-COS-MULTI-001 | Same cosmetic ID can be owned by multiple pets | §11.5.2 |
| BCT-COS-GEMS-001 | Cosmetics catalog is gems-only (no coin pricing) | §11.1, §11.5.2 |
| BCT-COS-NOSTAT-001 | Equipping cosmetics does not affect pet stats | §11.5.3 |

---

### Phase 11 P11-B Cosmetics UI Wiring — Implemented Specs

> **Status:** ✅ P11-B UI Wiring implemented.

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-COS-UI-SHOP-001 | Shop shows Cosmetics panel listing catalog items | §14.7.3 |
| BCT-COS-UI-SHOP-002 | Owned cosmetics show equip/unequip; non-owned are locked | §14.7.3 |
| BCT-COS-UI-SHOP-003 | Price display with gem balance | §11.5.2 |
| BCT-COS-UI-INV-001 | Inventory includes Cosmetics section grouped by slot | §14.8.3 |
| BCT-COS-UI-INV-002 | Equipped state visible and consistent with store | §14.8.3 |
| BCT-COS-UI-INV-003 | Inventory empty state when owned cosmetics = 0 | §14.8.3 |

---

## Phase 11 — P11-C: Cosmetics Render Layering

> **Status:** ✅ Implemented. Bible §11.5.3.

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-COS-RENDER-001 | Equipped cosmetics render as visible layers | §11.5.3 |
| BCT-COS-RENDER-002 | Layering respects canonical order (Aura→Skin→Outfit→Accessory→Hat) | §11.5.3 |
| BCT-COS-RENDER-003 | Switching active pet updates rendered cosmetic layers | §11.5.2 |
| BCT-COS-RENDER-004 | Multi-surface consistency via shared PetRender component | §11.5.3 |

**Layer Order (back to front):** Aura → Base sprite → Skin → Outfit → Accessory → Hat

---

## Phase 11 — P11-D: Cosmetics Purchase Plumbing

> **Status:** ✅ Implemented. Bible §11.5.2, §11.1.

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-COS-BUY-001 | Buy button shown for non-owned cosmetics (sufficient gems) | §11.5.2 |
| BCT-COS-BUY-002 | Disabled button when insufficient gems | §11.5.2 |
| BCT-COS-BUY-003 | Purchase deducts gems and grants pet-bound ownership | §11.5.2 |
| BCT-COS-BUY-004 | No auto-equip after purchase (ownership only) | §11.5.2 |

### P11-D Error Codes

| Error | Condition |
|-------|-----------|
| `INSUFFICIENT_GEMS` | Player gems < priceGems |
| `ALREADY_OWNED` | Pet already owns this cosmetic |
| `INVALID_COSMETIC` | cosmeticId not in COSMETIC_CATALOG |
| `INVALID_PET` | petId not found in petsById |

---

## Phase 11 — P11-D1: Cosmetics Purchase UX Polish

> **Status:** ✅ Implemented. Bible §11.5.2.

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-COS-BUY-UI-001 | After purchase, Shop updates immediately (no auto-equip) | §11.5.2 |
| BCT-COS-BUY-UI-002 | Double-tap protection prevents multiple deductions | §11.5.2 |

---

## Reserved IDs — Phase 12

> **Status:** 🔲 Reserved — ID reservation only. No tests until implementation.
> **Enable when:** TASKS.md shows Phase 12-X as COMPLETE.

### §17 Achievements (Phase 12-A)

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-ACH-001 | Total achievements = Bible §17.1 count | §17.1 |
| BCT-ACH-002 | Total gem rewards = Bible §17.1 sum | §17.1 |
| BCT-ACH-003 | Categories = Bible §17.3 list | §17.3 |
| BCT-ACH-004 | Retroactive unlock supported | §17 |
| BCT-ACH-005 | Gems delivered instantly on unlock | §17 |

### §10.3.1 Login Streak (Phase 12-B)

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-STREAK-001 | 7-day cycle, then reset | §10.3.1 |
| BCT-STREAK-002 | Day 7 = Mystery Box | §10.3.1 |
| BCT-STREAK-003 | No grace period (strict consecutive) | §10.3.1 |
| BCT-STREAK-004 | Manual claim required | §10.3.1 |

### §10.3.2 Mystery Box (Phase 12-B)

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-MBOX-001 | Loot table weights per Bible §10.3.2 | §10.3.2 |
| BCT-MBOX-002 | Guaranteed minimum value | §10.3.2 |
| BCT-MBOX-003 | Source = Day 7 only (not purchasable) | §10.3.2 |

### §11.6.2 Notification Center (Phase 12-0)
### §11.6.2 Notification Center (Phase 12-0) ✅

> **Status:** ✅ Active — Tests implemented in `bct-notifications.spec.ts`
> **Bible:** §11.6.2

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-NOTIF-001 | Max 50 notifications stored | §11.6.2 |
| BCT-NOTIF-002 | Overflow drops oldest by timestamp (tail trim) | §11.6.2 |
| BCT-NOTIF-003 | Unread count accurate | §11.6.2 |
| BCT-NOTIF-004 | Mark as read works (single + all) | §11.6.2 |
| BCT-NOTIF-005 | Ordering by timestamp desc (newest first) | §11.6.2 |
| BCT-NOTIF-006 | Hydration round-trip preserves ordering + read state | §11.6.2 |
| BCT-NOTIF-007 | Hydration hardening (sorts, clamps to 50, sanitizes deepLinks) | §11.6.2 |

### §11.6.3 Trigger Engine (Phase 12-0) ✅

### §11.6.3 Trigger Engine (Phase 12-0)
> **Status:** ✅ Active — Tests implemented in `bct-notifications.spec.ts`
> **Bible:** §11.6.3

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-TRIGGER-001 | Event→notification mapping works | §11.6.3 |
| BCT-TRIGGER-002 | Same-type cooldown uses Bible §11.6.3 values | §11.6.3 |
| BCT-TRIGGER-003 | Timestamp ordering is deterministic | §11.6.3 |
| BCT-TRIGGER-004 | Navigation target sanitization (unknown → 'home') | §11.6.3 |
| BCT-TRIGGER-005 | Session limit enforced (max 5 non-critical) | §11.6.3 |

### §10.7 Event Framework (Phase 12-D)

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-EVENT-001 | Currency expires per Bible §10.7.3 timing | §10.7.3 |
| BCT-EVENT-002 | Leftover conversion per Bible §10.7.3 rate | §10.7.3 |
| BCT-EVENT-003 | Expiry warnings per Bible §10.7.3 schedule | §10.7.3 |

---

## Reserved IDs — Phase 13

> **Status:** 🔲 Reserved — ID reservation only. No tests until implementation.

### §8.5 Session Mini-Games (Phase 13)

| ID | Requirement | Bible |
|----|-------------|-------|
| BCT-SESSION-001 | Energy cost = Bible §8.5 value | §8.5 |
| BCT-SESSION-002 | Daily cap shared with burst (Bible §8.5) | §8.5 |
| BCT-SESSION-003 | Gems = 0 (same invariant as burst) | §8.1.1, §8.5 |
| BCT-SESSION-004 | Score-to-tier mapping per Bible §8.5 | §8.5 |
| BCT-SESSION-005 | Playable after cap (0 rewards) | §8.1.1, §8.5 |
| BCT-SESSION-006 | Six games per Bible §8.5 catalog | §8.5 |

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

---
**Document Version:** 2.5 | **Bible Alignment:** v1.11 | **Updated:** December 17, 2025
