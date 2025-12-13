# BIBLE v1.8 PATCH — Weight & Sickness Multi-Pet Rules

---

## Patch Metadata

| Field | Value |
|-------|-------|
| **Title** | Bible v1.8 Patch: Weight & Sickness Multi-Pet Rules |
| **Date** | December 12, 2025 |
| **Applies-to** | `docs/GRUNDY_MASTER_BIBLE.md` v1.7 |
| **Status** | Adopted |
| **Adopted** | December 13, 2025 |
| **Author** | Documentation Steward Agent |

---

## Errata / Reconciliations

### Alert Routing Section Reference

The original patch references **§14.6** for alert routing rules. Upon review:

- §14.6 in the Bible is "Mobile Layout Constraints" (viewport/touch target rules)
- Alert routing is canonically housed in **§11.6.1 Multi-Pet Notifications**

**Reconciliation:** All alert routing changes in this patch are applied to §11.6.1, not §14.6. The patch references to §14.6 should be read as §11.6.1 for the actual implementation.

### Section Cross-References

| Patch Reference | Canonical Location | Notes |
|-----------------|-------------------|-------|
| Alert routing §14.6 | §11.6.1 | Alert types, priority, routing rules |
| Weight System | §5.7, §9.4.7 | Base spec in §5.7, multi-pet runtime in §9.4.7 |
| Sickness System | §9.4.2, §9.4.7 | Base spec in §9.4.2, multi-pet runtime in §9.4.7 |

---

## Patch Contents

**Date:** December 12, 2025
**Purpose:** Formalize §9.4.7 Weight & Sickness for multi-pet runtime (Classic consequences)
**Applies to:** `docs/GRUNDY_MASTER_BIBLE.md`
**Prerequisite:** Bible v1.7 applied (P9 complete)
**Design Philosophy:** Actions have consequences. Classic Mode has stakes.

---

## Instructions

Add these sections to the Bible in the specified locations. Do not remove existing content unless explicitly marked for replacement.

---

## PATCH 1: Extend §9.4.6 Offline Rules Table

**Location:** §9.4.6 Multi-Pet Offline Rules → "Offline Stat Changes" table (line ~2604)

**Current Table:**
```
| Stat | Offline Behavior | Rate | Cap | Plus Bonus |
|------|------------------|------|-----|------------|
| **Neglect Days** | Accrue for all pets | +1 per calendar day | 14 days max | None |
| **Mood** | Decays for all pets | -5 per 24h offline | Min 30 | None |
| **Bond** | Decays for all pets | -2 per 24h offline | Min 0 | 50% slower decay |
| **Hunger** | Decays for all pets | -10 per 24h offline | Min 0 | None |
```

**Add these rows to the table:**
```
| **Weight** | Decays for all pets | -1 per hour | Min 0 | None |
| **Sickness Triggers** | Timers accumulate (Classic) | Per §9.4.7 | N/A | None |
| **Sickness Effects** | 2× decay runs (Classic) | Per §9.4.7 | N/A | None |
| **Care Mistakes** | Accumulate if sick (Classic) | +1 per hour sick | 4 per session | None |
```

---

## PATCH 1.5: Update §9.4.6 Order of Application

**Location:** §9.4.6 Multi-Pet Offline Rules → "Order of Application on Return" (line ~2611)

**Current:**
```
1. Calculate elapsed calendar days (for neglect)
2. Apply neglect day accrual to ALL owned pets
3. Evaluate neglect stage transitions for ALL pets
4. Apply mood/bond/hunger decay to ALL pets
5. Trigger any stage-transition alerts (batched, see §11.6.1)
6. If active pet is now Runaway → auto-switch (see §9.4.4)
7. Show "Welcome Back" summary if > 24h offline
```

**Replace with:**
```
1. Calculate elapsed time since last save
2. Cap elapsed time at 14 days
3. For each owned pet:
   a. Apply mood/bond/hunger decay
   b. Apply weight decay (-1/hr)
   c. Apply neglect day accrual (Classic)
   d. Evaluate neglect stage transitions (Classic)
   e. Check sickness trigger conditions (Classic, per §9.4.7):
      - Roll sickness chance for completed timers
   f. If sick: apply 2× stat decay for sick duration (Classic)
   g. If sick 1+ hours: add care mistakes (capped at 4) (Classic)
   h. Check for Runaway threshold (Classic)
4. Trigger any alerts (batched, see §11.6.1)
5. If active pet is now Runaway → auto-switch (see §9.4.4)
6. Show "Welcome Back" summary if > 24h offline
```

---

## PATCH 2: Add §9.4.7 Weight & Sickness Multi-Pet Rules (New Section)

**Location:** After §9.4.6 Multi-Pet Offline Rules

**Add:**

### §9.4.7 Weight & Sickness Multi-Pet Rules

#### §9.4.7.1 Weight System (Per-Pet, Both Modes)

| Rule | Value |
|------|-------|
| **Scope** | Per-pet (each pet tracks independent weight 0-100) |
| **Gain** | Snack risk % = absolute points (e.g., +5% weight = +5 points) |
| **Decay** | -1 point per hour (runs offline, 14-day cap) |
| **Floor** | 0 (cannot go negative) |
| **Ceiling** | 100 (cannot exceed) |
| **Starting Weight** | 0 (Normal) for new pets |

**Weight States:**

| Range | State | Visual | Gameplay Effect |
|-------|-------|--------|-----------------|
| 0-30 | Normal | Standard sprite | No effect |
| 31-60 | Chubby | 10% wider, rounder | Visual only |
| 61-80 | Overweight | 20% wider, waddle | Happiness decay 1.5× |
| 81-100 | Obese | 30% wider, sweat drops | Happiness decay 2×, **cannot play mini-games** |

**Weight Gain by Food:**

| Food | Weight Risk | Points Added |
|------|-------------|--------------|
| Cookie 🍪 | +5% | +5 |
| Candy 🍬 | +10% | +10 |
| Ice Cream 🍦 | +10% | +10 |
| Lollipop 🍭 | +8% | +8 |
| All other foods | 0% | 0 |

**Weight Recovery:**

| Method | Effect | Cost |
|--------|--------|------|
| Natural decay | -1 per hour | Free |
| Diet Food 🥗 | -20 weight, +5 hunger | 30🪙 |
| No snacks for 24hr | Decay continues normally | Free |

**Offline Weight Behavior:**
- Weight decays -1 per hour while offline
- 14-day cap (maximum -336 points, but floors at 0)
- Weight gain only occurs from feeding (requires active play)

---

#### §9.4.7.2 Sickness System (Per-Pet, Classic Only)

**Mode Restriction:** Sickness is **disabled in Cozy Mode**. Pets cannot get sick in Cozy Mode regardless of conditions.

| Rule | Value |
|------|-------|
| **Scope** | Per-pet, Classic mode only |
| **State** | Binary: `isSick = true/false` |
| **Trigger Timers** | **Run offline** — accumulate toward thresholds |
| **Sickness Effects** | **Run offline** — 2× stat decay applies |
| **Recovery** | Medicine (50🪙) or Watch Ad (1/day limit) |

**Sickness Triggers:**

| Condition | Timer/Check | Chance | Offline Behavior |
|-----------|-------------|--------|------------------|
| Hunger = 0 | 30 minutes | 20% | Timer accumulates offline |
| Poop uncleaned | 2 hours | 15% | Timer accumulates offline |
| Snack when Overweight (61+) | Immediate | 5% per snack | N/A (requires active feeding) |
| Hot Pepper 🌶️ food | Immediate | 5% always | N/A (requires active feeding) |

**Trigger Timer Rules:**
- Timers start when condition becomes true
- Timers pause when condition becomes false
- Timers accumulate across online and offline time
- When timer completes, roll sickness chance once
- After roll (pass or fail), timer resets for that trigger type

**Sick State Effects:**

| Effect | Value | Offline? |
|--------|-------|----------|
| All stat decay | 2× faster | ✅ Yes |
| Mini-games | **Blocked** | N/A |
| Care mistake | +1 per hour untreated | ✅ Yes (capped) |
| Visual | Green face, thermometer | — |
| Animation | Shiver, sweat drops | — |

**Care Mistake Accumulation (Sickness):**
- While sick and untreated: +1 care mistake per hour
- **Offline cap:** Maximum 4 care mistakes per offline session
- Timer starts when pet becomes sick
- Resets when cured

---

#### §9.4.7.3 Offline Calculation Order

When player returns after absence (Classic Mode):

```
1. Calculate elapsed time since last save
2. Cap elapsed time at 14 days
3. For each owned pet:
   a. Apply base stat decay (hunger, mood) for elapsed time
   b. Apply weight decay (-1/hr) for elapsed time
   c. Check sickness trigger conditions at save time:
      - If Hunger was 0: accumulate toward 30-min timer
      - If Poop was uncleaned: accumulate toward 2-hr timer
   d. For each completed trigger timer:
      - Roll sickness chance (20% hunger, 15% poop)
      - Only one roll per trigger type per return
   e. If pet becomes sick (or was already sick):
      - Apply 2× stat decay for sick duration
      - Add care mistakes (1/hr, cap 4)
   f. Apply neglect progression per §9.4.3
   g. Check for Runaway threshold
4. If active pet is Runaway, trigger auto-switch per §9.4.4
5. Show Welcome Back modal with status summary
```

**Example Scenario:**

Player leaves with:
- Pet A: Hunger = 0, Poop = 1 uncleaned
- Gone for 3 hours

On return:
1. Hunger=0 timer: 3 hours accumulated → 30 min threshold met → roll 20%
2. Poop timer: 3 hours accumulated → 2 hr threshold met → roll 15%
3. If either roll succeeds → pet is sick
4. If sick: 3 hours × 2× decay applied to stats
5. If sick: 3 care mistakes added (hours 0-1, 1-2, 2-3)
6. Show status: "Your pet got sick while you were away!"

---

#### §9.4.7.4 Sickness Recovery

| Method | Cost | Availability | Effect |
|--------|------|--------------|--------|
| Medicine 💊 | 50🪙 | Always | Instant cure |
| Watch Ad | Free | Once per 24 hours | Instant cure |

**Post-Recovery:**
- `isSick` set to false immediately
- All sickness timers reset
- Care mistake timer stops (no further accumulation)
- Pet needs feeding to restore stats lost during sickness
- No "immunity period" — can get sick again immediately if conditions met

**Medicine Availability:**
- Sold in Shop → Care tab (Classic Mode only, hidden in Cozy)
- Appears in "Recommended" section when pet is sick
- Can be stockpiled in inventory (stacks to 99)

---

#### §9.4.7.5 Interactions with Other Systems

**Weight + Sickness Interaction:**
- Feeding snacks when Overweight (61+): 5% sickness chance per snack
- This check happens immediately on feeding, not timer-based
- Weight state is checked at moment of feeding

**Sickness + Neglect Interaction:**
- Sickness and Neglect are **independent systems** (see §9.4.3 "vs. Sickness" table)
- Neglect tracks absence duration (§9.4.3)
- Sickness tracks care quality (hunger, poop, feeding choices)
- Both can progress simultaneously during offline periods
- Sickness does NOT directly cause Neglect progression
- Severe Neglect does NOT directly cause Sickness (but unsafe conditions left behind can)

**Sickness + Mini-Games:**
- Sick pets cannot play mini-games
- Obese pets cannot play mini-games
- If both conditions: still blocked (not double-blocked)
- Energy is global — other healthy pets can still play

**Sickness + Evolution:**
- Care mistakes from untreated sickness count toward evolution branch
- Per evolution stage: 4+ mistakes → "Troubled/Neglected" badge
- Resets at each evolution (Baby → Youth → Evolved)

---

#### §9.4.7.6 Multi-Pet Sickness Scenarios

**Scenario: Multiple Pets Sick**
- Each pet tracks sickness independently
- Medicine cures one pet at a time
- Player must prioritize which pet to cure first
- Care mistakes accumulate independently per pet

**Scenario: Switch Away from Sick Pet**
- Switching is allowed (per §9.4.5)
- Sick pet continues to accumulate:
  - 2× stat decay (while time passes)
  - Care mistakes (1/hr, capped)
- Toast warning: "This pet is sick and needs medicine!"

**Scenario: All Pets Sick**
- No gameplay block (unlike All Pets Runaway)
- Mini-games blocked for all pets
- Player can still feed, clean, use items
- Strong incentive to cure at least one pet

---

## PATCH 3: Add Weight Gain Clarification to §5.7

**Location:** §5.7 Weight System (Snack Risk) — after the code block, before Visual Weight Stages

**Add:**

> **Weight Risk Calculation:** Snack risk percentages represent absolute points added to the 0-100 weight scale, not percentages of current weight.
>
> Example: Cookie (+5% weight) always adds exactly 5 points whether the pet's current weight is 10 or 80.
>
> Weight gain only occurs from active feeding. Weight does not increase offline.

---

## PATCH 4: Extend §11.6.1 Alert Routing for Weight & Sickness

**Location:** §11.6.1 Multi-Pet Notifications → "Alert Routing" table (line ~3195)

**Add to existing alert type table:**

| Alert Type | Routing | Display |
|------------|---------|---------|
| Weight Warning (Obese) | Per-pet | Toast: "{Pet} is getting too heavy!" |
| Weight Recovery | Per-pet | Toast: "{Pet} is back to healthy weight!" |
| Sickness Onset | Per-pet (Classic) | Toast + badge: "{Pet} is sick!" |
| Sickness Reminder | Per-pet (Classic) | Badge only (after 30min cooldown) |

**Add to Alert Priority list (insert between Hunger/Mood and existing items):**

```
3. Sickness (any pet, Classic only)
4. Obese Warning (any pet)
```

**Update "Multi-Pet Runtime Summary" table at end of §11.6.1 (line ~3242):**

Add these rows:
```
| Weight | Per-pet | Decays all pets (-1/hr, floor 0) | §9.4.7 |
| Sickness | Per-pet | Triggers accumulate, effects apply | §9.4.7, Classic only |
```

---

## PATCH 5: Update §9.3 Cozy Mode Immunity List

**Location:** §9.3 Cozy Mode Specifics → Core Promise section

**Current:**
```
### Core Promise
- Pet cannot die
- Pet cannot get sick
- No care mistakes recorded
- Evolution is always positive
- Notifications are gentle and optional
```

**Replace with:**
```
### Core Promise
- Pet cannot die
- Pet cannot get sick (sickness system disabled)
- Pet cannot get Obese penalties (weight visual only, no gameplay effects)
- No care mistakes recorded
- Evolution is always positive
- Notifications are gentle and optional
- Neglect system disabled (no Worried → Runaway progression)
```

**Rationale:** Explicitly confirm that Obese in Cozy Mode is visual-only with no mini-game block.

---

## PATCH 6: Add Sickness to Care Mistakes Triggers in §9.4

**Location:** §9.4 Classic Mode Specifics → Care Mistakes System

**Current:**
```
Triggers:
- Hunger = 0 for 30+ minutes → +1 mistake
- Happiness < 20 for 2+ hours → +1 mistake
- Poop uncleaned for 2+ hours → +1 mistake
- Pet sick and untreated for 1+ hour → +1 mistake
```

**Replace with:**
```
Triggers:
- Hunger = 0 for 30+ minutes → +1 mistake
- Happiness < 20 for 2+ hours → +1 mistake
- Poop uncleaned for 2+ hours → +1 mistake
- Pet sick and untreated → +1 mistake per hour (max 4 per offline session)

All triggers run offline. Timers accumulate during absence.
```

---

## PATCH 7: Reconcile §9.4.3 Sickness/Neglect Co-Existence (CRITICAL)

**Location:** §9.4.3 Neglect & Withdrawal System → "Relationship to Other Systems" → "vs. Sickness" table (line ~2362)

**Current:**
```markdown
**vs. Sickness (§9.4.2):**
| Aspect | Sickness | Withdrawal |
|--------|----------|------------|
| Triggered by | Stat failures while playing | Days without playing |
| Visual | Green face, thermometer | Desaturated, pulled away |
| Cure | Medicine (50 coins / ad) | 7 care days / 15💎 |
| Can happen together? | No — Sickness requires presence, Withdrawal requires absence |
```

**Replace with:**
```markdown
**vs. Sickness (§9.4.2):**
| Aspect | Sickness | Withdrawal |
|--------|----------|------------|
| Triggered by | Unsafe conditions (hunger=0, poop) | Days without care actions |
| Visual | Green face, thermometer | Desaturated, pulled away |
| Cure | Medicine (50 coins / ad) | 7 care days / 15💎 |
| Can happen together? | **Yes** — see note below |

**Sickness + Withdrawal Co-Existence (v1.8):**
- Absence *alone* does not cause sickness
- However, if unsafe conditions existed at save time (hunger=0, poop uncleaned), sickness triggers can fire on return per §9.4.7
- Therefore: a pet can be both Sick and Withdrawn simultaneously
- Example: Player leaves with hungry pet, returns 5 days later → pet is Sad (neglect) AND may have become Sick (hunger timer completed offline)

**Conceptual separation remains:**
- Withdrawal = "Did you show up?"
- Sickness = "What state did you leave them in?"
```

**Rationale:** This preserves the conceptual distinction (absence vs. care quality) while acknowledging the runtime reality that both systems can progress during the same offline period.

---

## Summary of Changes

| Patch | Section | Change |
|-------|---------|--------|
| 1 | §9.4.6 | Extend offline table: Weight decay, Sickness timers/effects, Care mistakes |
| 1.5 | §9.4.6 | Update Order of Application to include weight/sickness steps |
| 2 | §9.4.7 | **New section:** Complete Weight & Sickness multi-pet rules |
| 3 | §5.7 | Add weight gain math clarification |
| 4 | §11.6.1 | Add alert types for Weight Warning, Sickness Onset/Reminder |
| 5 | §9.3 | Clarify Cozy Mode immunity (no Obese penalties) |
| 6 | §9.4 | Update Care Mistakes to show offline accumulation + 4-cap |
| **7** | **§9.4.3** | **Reconcile Sickness/Neglect co-existence (critical fix)** |

---

## Design Rationale

### Why Consequences Run Offline

| Decision | Rationale |
|----------|-----------|
| Sickness timers accumulate | Classic Mode promises stakes; players chose this mode |
| 2× decay runs offline | Sickness should matter, not just be visual |
| Care mistakes accumulate | Evolution branches need real pressure |
| 4-mistake cap per session | Prevents "return from vacation to disaster" |
| 14-day offline cap | Existing fairness guardrail applies |

### Monetization Pressure Points

| Pressure | Item | Price |
|----------|------|-------|
| Cure sickness | Medicine 💊 | 50🪙 |
| Manage weight | Diet Food 🥗 | 30🪙 |
| Fast runaway recovery | Gem purchase | 25💎 |
| Avoid all consequences | Cozy Mode | Free (but no stakes) |

### Player Choice Flow

```
New Player
    ↓
Cozy Mode (default) ← No sickness, no weight penalties, no stress
    ↓
Level 10 unlock
    ↓
Classic Mode (opt-in) → Stakes matter, consequences real
    ↓
Neglect pet → Sickness → Care mistakes → Worse evolution
    ↓
Monetization opportunity: Medicine, Diet Food, Gem recovery
```

---

## BCT Impact

### New Test Categories Required

| Category | Test Count (Est.) | Coverage |
|----------|-------------------|----------|
| BCT-WEIGHT-MULTI | 12 | Per-pet scope, gain, decay, offline, states |
| BCT-SICKNESS-MULTI | 18 | Per-pet scope, triggers, timers, offline, recovery |
| BCT-SICKNESS-OFFLINE | 8 | Timer accumulation, 2× decay, care mistakes |
| BCT-ALERT-WEIGHT | 4 | Obese toast, recovery toast |
| BCT-ALERT-SICK | 4 | Onset alert, reminder toast |
| BCT-COZY-IMMUNITY | 6 | Sickness disabled, Obese visual-only |
| **Total** | **~52** | — |

### Constants to Add to bible.constants.ts

```typescript
// Weight System (Bible v1.8 §9.4.7.1)
export const WEIGHT_MIN = 0;
export const WEIGHT_MAX = 100;
export const WEIGHT_STARTING = 0;
export const WEIGHT_DECAY_PER_HOUR = 1;
export const WEIGHT_OFFLINE_CAP_DAYS = 14;

export const WEIGHT_THRESHOLDS = {
  NORMAL: { min: 0, max: 30 },
  CHUBBY: { min: 31, max: 60 },
  OVERWEIGHT: { min: 61, max: 80 },
  OBESE: { min: 81, max: 100 },
} as const;

export const WEIGHT_EFFECTS = {
  NORMAL: { happinessDecayMult: 1.0, canPlayMinigames: true },
  CHUBBY: { happinessDecayMult: 1.0, canPlayMinigames: true },
  OVERWEIGHT: { happinessDecayMult: 1.5, canPlayMinigames: true },
  OBESE: { happinessDecayMult: 2.0, canPlayMinigames: false },
} as const;

export const WEIGHT_GAIN = {
  cookie: 5,
  candy: 10,
  ice_cream: 10,
  lollipop: 8,
} as const;

// Sickness System (Bible v1.8 §9.4.7.2)
export const SICKNESS_TRIGGERS = {
  HUNGER_ZERO: { timerMinutes: 30, chance: 0.20 },
  POOP_UNCLEANED: { timerMinutes: 120, chance: 0.15 },
  SNACK_OVERWEIGHT: { immediate: true, chance: 0.05 },
  HOT_PEPPER: { immediate: true, chance: 0.05 },
} as const;

export const SICKNESS_EFFECTS = {
  STAT_DECAY_MULTIPLIER: 2.0,
  CAN_PLAY_MINIGAMES: false,
  CARE_MISTAKE_PER_HOUR: 1,
  CARE_MISTAKE_OFFLINE_CAP: 4,
} as const;

export const SICKNESS_RECOVERY = {
  MEDICINE_COST_COINS: 50,
  AD_COOLDOWN_HOURS: 24,
} as const;
```

### Test File Structure

```
src/__tests__/
├── bct-weight.spec.ts           # BCT-WEIGHT-MULTI (12 tests)
├── bct-sickness.spec.ts         # BCT-SICKNESS-MULTI (18 tests)
├── bct-sickness-offline.spec.ts # BCT-SICKNESS-OFFLINE (8 tests)
├── bct-alert-health.spec.ts     # BCT-ALERT-WEIGHT + BCT-ALERT-SICK (8 tests)
└── bct-cozy-immunity.spec.ts    # BCT-COZY-IMMUNITY (6 tests)
```

---

## Verification Checklist

After applying this patch, verify:

- [ ] §9.4.6 table includes Weight, Sickness Triggers, Sickness Effects, Care Mistakes rows
- [ ] §9.4.6 Order of Application includes weight/sickness steps (3a-3h)
- [ ] §9.4.7 exists with complete subsections (§9.4.7.1 through §9.4.7.6)
- [ ] §9.4.3 "vs. Sickness" table says "Can happen together? **Yes**" (PATCH 7)
- [ ] §5.7 includes weight gain math clarification
- [ ] §11.6.1 includes Weight Warning, Sickness Onset, Sickness Reminder alerts
- [ ] §11.6.1 Multi-Pet Runtime Summary table includes Weight and Sickness rows
- [ ] §9.3 Core Promise includes Obese immunity and Neglect disabled
- [ ] §9.4 Care Mistakes shows offline accumulation + 4-cap
- [ ] Bible header updated to v1.8

---

## Implementation Sequence (Recommended)

| Phase | Scope | Tests |
|-------|-------|-------|
| P10-A | Weight state model + per-pet storage | 6 |
| P10-B | Weight gain on feeding + decay runtime | 6 |
| P10-C | Sickness state model + triggers | 10 |
| P10-D | Sickness offline accumulation | 8 |
| P10-E | Sickness recovery (Medicine item) | 4 |
| P10-F | Alert wiring (Weight + Sickness) | 8 |
| P10-G | Cozy Mode immunity verification | 6 |
| P10-H | Integration + edge cases | 4 |
| **Total** | — | **~52** |

---

## Cross-Reference Updates

After applying Bible v1.8, update these documents:

| Document | Update |
|----------|--------|
| `ORCHESTRATOR.md` | Add Bible v1.8 reference, P10 phase plan |
| `TASKS.md` | Add P10-A through P10-H tasks |
| `GRUNDY_DEV_STATUS.md` | Update current Bible version |
| `docs/BIBLE_COMPLIANCE_TEST.md` | Add BCT v2.4 with ~52 new tests |

---

*End of Bible v1.8 Patch*
