# P9-B Specification Gaps Report

**Phase:** P9-B-PETSLOTS-RUNTIME v1.3
**Bible Version:** v1.6
**BCT Version:** v2.2
**Author:** Claude (Web Implementer Agent)
**Status:** BLOCKED

---

## Summary

Bible verification for P9-B runtime integration has identified **7 critical specification gaps** that prevent implementation. This document lists the missing or ambiguous specifications that require Bible clarification before P9-B can proceed.

---

## Verification Methodology

### Search Terms Used (via `rg`)
- `per.pet|per-pet|separate.*pet|each.*pet.*separate`
- `shared.*across.*pet|global.*pet`
- `mood.*per|bond.*per|neglect.*per|energy.*per`
- `SEPARATE|separate.*level|separate.*xp`
- `energy.*global|energy.*shared|energy.*pet`
- `offline.*neglect|offline.*accrual|offline.*cap`
- `notification.*pet|alert.*pet|which.*pet.*trigger`
- `runaway.*switch|switch.*runaway|active.*runaway|auto.switch`
- `switch.*withdrawn|switch.*runaway|switch.*restrict`
- `multi.pet|multiple.*pet`
- `mood.*offline|bond.*offline|offline.*mood|offline.*bond`
- `push.*notif|notification.*push|web.*notif`

### Sections Reviewed
- §3.2 Pet Overview (unlock rules)
- §4.6 Energy System
- §6 Progression & Unlocks (Core Rules)
- §8.2 Energy System [Web 1.0]
- §9.3 Cozy Mode Specifics
- §9.4.3 Neglect & Withdrawal System
- §11.6 Pet Slots
- §11.8 Grundy Plus
- §15.3 Data Structure
- §15.6 Prototype Gaps

---

## Items Verified as PRESENT

### 1. Per-Pet vs Global Scope (Partial)

| System | Scope | Bible Citation |
|--------|-------|----------------|
| **Mood** | Per-pet | §6 Core Rules: "Each pet has SEPARATE: Level, XP, Bond, Mood, Hunger"; §15.3 PetState; §11.6 "Each slot is independent (separate hunger, mood, bond)" |
| **Bond** | Per-pet | §6 Core Rules; §15.3 PetState; §11.6 Pet Slot Rules |
| **Hunger** | Per-pet | §6 Core Rules; §15.3 PetState; §11.6 Pet Slot Rules |
| **Level/XP** | Per-pet | §6 Core Rules; §15.3 PetState |
| **Evolution Stage** | Per-pet | §15.3 PetState |
| **Neglect timers/stages** | Per-pet | §9.4.3: "Neglect is tracked **per pet**...Each pet has its own independent `lastCareDate` and `neglectDays` counter" |
| **Coins** | Global | §6 Core Rules: "SHARED across all pets: Coins, Gems, Food Inventory"; §15.3 GlobalState |
| **Gems** | Global | §6 Core Rules; §15.3 GlobalState |
| **Inventory** | Global | §6 Core Rules; §15.3 GlobalState |

### 2. Offline Handling (Partial)

| System | Rule | Bible Citation |
|--------|------|----------------|
| **Neglect offline** | Days accrue, capped at 14 | §9.4.3 Offline Handling: "App not opened for 20 days → Capped at 14 days (instant runaway, not worse)" |

### 3. Recovery Options

| Stage | Free Recovery | Paid Recovery | Bible Citation |
|-------|---------------|---------------|----------------|
| Withdrawn | 7 care days | 15💎 | §9.4.3 Stage Details |
| Critical | 7 care days | 15💎 | §9.4.3 Stage Details |
| Runaway | 72h wait | 24h + 25💎 | §9.4.3 Stage Details |

---

## CRITICAL GAPS (Blocking)

### GAP-1: Energy Scope (Per-Pet vs Global)

**Status:** MISSING

**What Bible Says:**
- §8.2 defines energy as 50 max, 10 per game, 1/30min regen
- §11.8 Grundy Plus: "Mini-game energy | 50 max | 75 max"
- §15.3 Data Structure does NOT list energy in PetState OR GlobalState

**What's Missing:**
- Is mini-game energy shared across all pets (global), or does each pet have their own energy pool (per-pet)?
- If per-pet: does energy regen for all pets simultaneously, or only active pet?
- If global: confirmed implementation matches current codebase

**Suggested Bible Clarification:**
Add to §8.2 or §15.3:
```
Energy is [GLOBAL|PER-PET]. [If per-pet: Energy regenerates for all owned pets simultaneously regardless of active pet selection.]
```

---

### GAP-2: Runaway Auto-Switch Rules

**Status:** MISSING

**What Bible Says:**
- §9.4.3: "Pet disappears from home screen, replaced with empty bed/cushion"
- §9.4.3: "Pet locked out (cannot interact)"

**What's Missing:**
- When the **active pet** reaches Runaway state, what happens to the UI?
- Does the game automatically switch to another owned pet?
- If auto-switch: which pet is selected (first in list, most recently used, highest level)?
- If no auto-switch: what does the player see on the home screen?
- Can the player manually switch away from a runaway pet?

**Suggested Bible Clarification:**
Add to §9.4.3 or §11.6:
```
### Active Pet Runaway
When the active pet enters Runaway state:
- [OPTION A: Auto-switch] The game automatically switches to the next available non-runaway pet in slot order. If all pets are runaway, show [empty state / recovery prompt].
- [OPTION B: Manual] The player must manually switch to another pet. The home screen shows the runaway message until they switch or recover.
```

---

### GAP-3: Runaway Slot Handling

**Status:** MISSING

**What Bible Says:**
- §11.6: "Pet slots allow caring for multiple pets simultaneously"
- §9.4.3: Runaway causes 24h lockout

**What's Missing:**
- Does a runaway pet continue to occupy its slot?
- Can the player "see" a runaway pet in the pet selector?
- Is the runaway pet selectable (to view recovery options) or completely hidden?
- What UI indicator shows which pets are runaway vs available?

**Suggested Bible Clarification:**
Add to §11.6 Pet Slot Rules:
```
- Runaway pets [remain in / are removed from] their slot
- Runaway pets [are visible with lockout indicator / are hidden] in pet selector
- Player [can / cannot] select a runaway pet to view recovery options
```

---

### GAP-4: Switching Constraints During Withdrawal/Runaway

**Status:** MISSING

**What Bible Says:**
- §11.6: "Switching between slotted pets is instant"
- §9.4.3: "Switching active pets does not transfer or reset neglect counters"

**What's Missing:**
- Can the player switch TO a pet that is Withdrawn/Critical? (Presumably yes, to care for them)
- Can the player switch FROM a pet that is Runaway? (The pet is "locked out")
- Can the player switch TO a pet that is Runaway? (To view recovery UI)
- Any UI messaging when switching to/from a neglected pet?

**Suggested Bible Clarification:**
Add to §11.6 or §9.4.3:
```
### Switching Constraints
- Switching TO Withdrawn/Critical pets: [Allowed / Blocked with message]
- Switching FROM Runaway pets: [Allowed / Blocked until recovered]
- Switching TO Runaway pets: [Allowed for recovery UI / Blocked]
```

---

### GAP-5: Alert Routing Clarification

**Status:** AMBIGUOUS

**What Bible Says:**
- §11.6 Pet Slot Rules: "Notifications can come from any active pet"

**What's Ambiguous:**
- "any active pet" — does this mean:
  - (a) any pet in an active slot (all owned pets), OR
  - (b) only the currently selected active pet?
- Where do multi-pet alerts appear (in-app only, or push)?
- If multiple pets need attention, how are alerts prioritized/aggregated?

**What's Missing:**
- Alert display location (HUD badge? Settings icon? Dedicated notification center?)
- Alert suppression rules (rate limits, cooldowns between alerts)
- Alert aggregation (show per-pet or summarized?)

**Suggested Bible Clarification:**
Update §11.6 or add §14.X:
```
### Multi-Pet Alert Routing
- Alerts trigger for: [all owned pets / only active pet]
- In-app alerts appear as: [HUD badge on pet icon / Settings badge / Modal]
- Alert aggregation: [Each pet shows its own alert / Summarized as "2 pets need attention"]
- Rate limit: [Max 1 alert per pet per [hour/session]]
```

---

### GAP-6: Mood/Bond Offline Accrual for Multi-Pet

**Status:** MISSING

**What Bible Says:**
- §11.8 Grundy Plus: "Bond decay (away) | Normal | 50% slower decay"
- Implies bond can decay while away, but no explicit rules

**What's Missing:**
- Does bond decay for ALL owned pets while offline, or only active pet?
- Does mood change while offline? (Current implementation: mood decay is runtime-only)
- If offline accrual applies to all pets: what caps/protections exist?
- How does offline bond/mood interact with Grundy Plus 50% slower decay?

**Suggested Bible Clarification:**
Add to §9.X or §11.X:
```
### Offline Stat Changes (Multi-Pet)
- Bond: [Decays for all pets / Only active pet / No offline decay]
- Bond offline decay rate: [X per day, capped at Y]
- Mood: [Decays for all pets / Only active pet / No offline decay]
- Mood offline decay rate: [X per day, capped at Y]
- Grundy Plus: 50% slower bond decay applies to [all pets / active pet only]
```

---

### GAP-7: Alert Suppression/Rate Limits

**Status:** MISSING

**What Bible Says:**
- §9.4.3 defines notification copy for each neglect stage
- No mention of frequency, suppression, or rate limits

**What's Missing:**
- How often can the same alert fire? (Per session? Per day? Once per stage transition?)
- Are alerts cumulative or does each stage replace the previous?
- For multiple pets: can alerts from different pets fire simultaneously?
- Any "do not disturb" or muting options?

**Suggested Bible Clarification:**
Add to §9.4.3 or §14.X:
```
### Alert Frequency Rules
- Neglect alerts fire: [Once per stage transition / Daily while in stage / On each app open]
- Multi-pet stacking: [Each pet fires independently / Aggregated into single alert]
- Cooldown between alerts: [None / X minutes minimum]
```

---

## Non-Critical Gaps (Can Defer)

### Weight System (Web)

**Status:** Design-defined but runtime TBD

**Bible §15.6:** "Weight consequences (beyond meter) | ⚠️ Design-defined; runtime TBD | Phase 9"

**Recommendation:** Weight runtime can be deferred to P9-C or later since it's not blocking multi-pet core functionality.

---

### Sickness System (Classic)

**Status:** Not implemented

**Bible §15.6:** "Sickness System (Classic) | ❌ Not implemented | Phase 9"

**Recommendation:** Sickness can be deferred to P9-C or later since it requires separate implementation work.

---

## Recommended Resolution Path

1. **Bible Patch Required:** Add explicit multi-pet runtime rules for:
   - GAP-1: Energy scope
   - GAP-2: Runaway auto-switch
   - GAP-3: Runaway slot handling
   - GAP-4: Switching constraints
   - GAP-5: Alert routing
   - GAP-6: Offline stat accrual
   - GAP-7: Alert frequency

2. **Minimum Viable Clarification:** If full Bible patch is delayed, provide explicit answers to these questions in a P9-B design decision document that can be ratified later.

3. **Implementation Fallback:** If P9-B must ship without Bible clarification, document assumptions clearly:
   - Energy: Assume GLOBAL (matches current implementation)
   - Runaway auto-switch: Assume NO auto-switch (manual navigation required)
   - Alert routing: Assume active pet only (simplest implementation)
   - Offline accrual: Assume neglect-only (matches current implementation)

---

## Conclusion

P9-B implementation is **BLOCKED** pending Bible v1.7 clarification of the 7 critical gaps identified above. The existing P9-A multi-pet foundation is stable and functional for basic pet switching and ownership, but runtime behavior integration requires explicit specification of edge cases involving runaway handling, alert routing, and offline accrual across multiple pets.
