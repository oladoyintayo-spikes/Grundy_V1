# Bible v1.7 Patch — Multi-Pet Runtime Clarifications

**Patch For:** GRUNDY_MASTER_BIBLE.md v1.6 → v1.7
**Purpose:** Resolve P9-B specification gaps for multi-pet runtime integration
**Author:** Design Team
**Date:** December 2025

---

## Summary

This patch addresses 7 critical specification gaps identified in `docs/P9B_SPEC_GAPS.md` that were blocking Phase 9-B (Multi-Pet Runtime Integration):

1. Energy scope (per-pet vs global)
2. Runaway auto-switch rules
3. Runaway slot handling
4. Switching constraints during neglect states
5. Alert routing clarification
6. Mood/bond offline accrual for multi-pet
7. Alert suppression/rate limits

---

## Patch Instructions

### 1. Update Version Header

**Location:** Top of file
**Change:** Version 1.6 → 1.7

### 2. Add Changelog Entry

**Location:** After v1.6 changelog entry
**Add:**
```
- v1.7: Multi-Pet Runtime Clarifications (P9-B) — Added §8.2.1 Energy Scope (global), §9.4.4 Multi-Pet Runaway Handling (auto-switch + slot rules), §9.4.5 Switching During Neglect States, §9.4.6 Multi-Pet Offline Rules (mood/bond/neglect fanout), §14.6 Multi-Pet Notifications (routing + suppression). Deferred Weight/Sickness runtime to P9-C.
```

---

## New Sections to Add

### §8.2.1 Energy Scope (Multi-Pet)

**Insert after:** §8.2 Energy System [Web 1.0]

```markdown
### 8.2.1 Energy Scope (Multi-Pet)

Energy is **GLOBAL** (shared across all owned pets).

| Attribute | Scope | Rationale |
|-----------|-------|-----------|
| Energy pool | Global | Prevents gaming system by switching pets; matches "one player" mental model |
| Energy regeneration | Global | 1 per 30 minutes regardless of active pet |
| First-free daily | Global | One free play per day total, not per pet |
| Daily cap (3 plays) | Global | Prevents circumventing session limits via pet switching |

**Design Rationale:** Energy gates mini-game access for the *player*, not the pet. Allowing per-pet energy would let players bypass daily caps by switching pets, undermining the "check-in" session design.

**Grundy Plus:** Max energy increases to 75 (global pool, not per-pet).
```

---

### §9.4.4 Multi-Pet Runaway Handling

**Insert after:** §9.4.3 Neglect & Withdrawal System

```markdown
### 9.4.4 Multi-Pet Runaway Handling

When managing multiple pets, runaway mechanics work as follows:

#### Active Pet Enters Runaway

When the **currently active pet** enters Runaway state:
1. **Auto-switch:** The game automatically switches to the next available non-runaway pet in slot order
2. **Toast notification:** "Your [PetName] has gone into hiding. Switching to [NextPet]..."
3. **If no available pets:** Show "All Pets Away" state (see below)

**Slot Order:** Pets are checked in `ownedPetIds` array order (acquisition order).

#### Runaway Pets in Slot UI

| Behavior | Rule |
|----------|------|
| Slot occupancy | Runaway pets **remain in their slot** (slot is not freed) |
| Pet selector visibility | Runaway pets **are visible** with a 🔒 lockout indicator |
| Selectability | Player **can select** a runaway pet to view recovery options |
| Recovery UI | Selecting a runaway pet shows the recovery modal (72h wait or 24h+25💎) |

#### "All Pets Away" State

If all owned pets are in Runaway state simultaneously:
- Home screen shows: "All your Grundies are in hiding. They still remember you. 💔"
- Recovery prompts shown for each pet
- Player must recover at least one pet to resume normal play
- No mini-games or feeding available (no active pet to receive rewards)

#### Recovery Priority

When multiple pets are runaway, the game suggests recovering in this order:
1. Pet closest to free recovery (72h timer)
2. Pet with highest bond (emotional connection)
3. Pet with highest level (progression investment)
```

---

### §9.4.5 Switching During Neglect States

**Insert after:** §9.4.4 Multi-Pet Runaway Handling

```markdown
### 9.4.5 Switching During Neglect States

| Current State | Switch TO | Switch FROM | Notes |
|---------------|-----------|-------------|-------|
| Normal | ✅ Allowed | ✅ Allowed | No restrictions |
| Worried | ✅ Allowed | ✅ Allowed | Warning badge shown |
| Sad | ✅ Allowed | ✅ Allowed | Warning badge shown |
| Withdrawn | ✅ Allowed | ✅ Allowed | Player should care for withdrawn pets |
| Critical | ✅ Allowed | ✅ Allowed | Urgent indicator shown |
| Runaway | ✅ Allowed* | N/A (auto-switch) | *To view recovery UI only; cannot interact |

**Key Rules:**
- Switching is **always allowed** to enable players to care for neglected pets
- Switching to a Withdrawn/Critical pet shows a warning: "This Grundy needs extra care to recover"
- Switching FROM a runaway pet is handled by auto-switch (player never "leaves" a runaway pet manually)
- Switching does NOT reset or transfer neglect counters (per §9.4.3)

**No "Switching to Avoid Consequences":** Players cannot evade neglect by constantly switching. Each pet's neglect counter is independent and continues regardless of which pet is active.
```

---

### §9.4.6 Multi-Pet Offline Rules

**Insert after:** §9.4.5 Switching During Neglect States

```markdown
### 9.4.6 Multi-Pet Offline Rules

When the player is offline (app closed), stats change for **all owned pets** simultaneously.

#### Offline Stat Changes

| Stat | Offline Behavior | Rate | Cap | Plus Bonus |
|------|------------------|------|-----|------------|
| **Neglect Days** | Accrue for all pets | +1 per calendar day | 14 days max | None |
| **Mood** | Decays for all pets | -5 per 24h offline | Min 30 | None |
| **Bond** | Decays for all pets | -2 per 24h offline | Min 0 | 50% slower decay |
| **Hunger** | Decays for all pets | -10 per 24h offline | Min 0 | None |

#### Order of Application on Return

When the player returns after offline period:
1. Calculate elapsed calendar days (for neglect)
2. Apply neglect day accrual to ALL owned pets
3. Evaluate neglect stage transitions for ALL pets
4. Apply mood/bond/hunger decay to ALL pets
5. Trigger any stage-transition alerts (batched, see §14.6)
6. If active pet is now Runaway → auto-switch (see §9.4.4)
7. Show "Welcome Back" summary if > 24h offline

#### Caps and Protections

- **Neglect cap:** 14 days maximum (extended absence doesn't compound beyond runaway)
- **Mood floor:** 30 minimum (pet stays sad but not broken)
- **Bond floor:** 0 minimum (bond can be fully lost but recoverable)
- **FTUE protection:** No offline decay until FTUE complete
- **48h grace period:** No offline decay for first 48h after account creation

#### Grundy Plus Offline Benefits

| Benefit | Effect |
|---------|--------|
| 50% slower bond decay | -1 per 24h instead of -2 |
| 2× welcome back rewards | Returning after 24h+ gives bonus XP |
```

---

### §14.6 Multi-Pet Notifications

**Insert as new section in §14 UI Specifications**

```markdown
## 14.6 Multi-Pet Notifications

### 14.6.1 Alert Routing

Alerts can originate from **any owned pet**, not just the active pet.

| Alert Type | Routing | Display |
|------------|---------|---------|
| Neglect stage transition | Per-pet | Toast + badge on pet icon |
| Hunger critical (< 20) | Per-pet | Badge on pet icon only |
| Mood critical (< 30) | Per-pet | Badge on pet icon only |
| Runaway | Per-pet → auto-switch | Modal + toast |

**Badge System:**
- Pet selector button shows aggregate badge count (e.g., "2" if 2 pets need attention)
- Individual pet icons in selector show specific badges:
  - ⚠️ Warning (Worried/Sad)
  - 💔 Urgent (Withdrawn/Critical)
  - 🔒 Locked (Runaway)

**Web Implementation (Phase 9-B):**
- In-app toasts and badges only
- No push notifications (Web lacks reliable push infra)
- Settings badge shows if any pet needs attention

### 14.6.2 Alert Suppression Rules

To prevent alert spam:

| Rule | Specification |
|------|---------------|
| Stage transition alerts | Fire **once per transition** (not repeated while in stage) |
| Multi-pet batching | If returning from offline, batch alerts into single summary toast |
| Cooldown | Minimum 30 minutes between alerts for same pet (except runaway) |
| Session limit | Maximum 5 non-critical alerts per session |
| Runaway override | Runaway alerts always fire immediately (critical path) |

**Alert Priority (highest to lowest):**
1. Runaway (any pet)
2. Critical (any pet)
3. Withdrawn (any pet)
4. Sad (active pet only)
5. Worried (active pet only)
6. Hunger/Mood low (active pet only)

**Batched Return Alert Example:**
> "Welcome back! While you were away:
> - Munchlet became Worried (2 days)
> - Grib became Sad (4 days)
> Your pets missed you! 💕"
```

---

### §9.4.7 Weight & Sickness Runtime (DEFERRED)

**Insert after:** §9.4.6 Multi-Pet Offline Rules

```markdown
### 9.4.7 Weight & Sickness Runtime (DEFERRED)

**Status:** Deferred to P9-C

The following systems are design-defined but runtime implementation is deferred:

| System | Bible Spec | Status | Target |
|--------|------------|--------|--------|
| Weight consequences | §5.7 | Design-defined | P9-C |
| Sickness (Classic) | §5.4 risk | Design-defined | P9-C |

These systems do not block P9-B multi-pet runtime integration. When implemented:
- Weight will be **per-pet** (matches feeding which is per-pet)
- Sickness will be **per-pet** (Classic mode only)
```

---

## Summary Table (Add to §11.6 Pet Slot Rules)

**Insert in:** §11.6 after "Pet Slot Rules" list

```markdown
### Multi-Pet Runtime Summary

| System | Scope | Offline Behavior | Notes |
|--------|-------|------------------|-------|
| Mood | Per-pet | Decays all pets (-5/24h, floor 30) | §9.4.6 |
| Bond | Per-pet | Decays all pets (-2/24h, floor 0) | Plus: 50% slower |
| Hunger | Per-pet | Decays all pets (-10/24h, floor 0) | §9.4.6 |
| Neglect | Per-pet | Accrues all pets (+1/day, cap 14) | §9.4.3, §9.4.6 |
| Energy | **Global** | Regenerates (1/30min) | §8.2.1 |
| Coins | Global | No change | §6, §15.3 |
| Gems | Global | No change | §6, §15.3 |
| Inventory | Global | No change | §6, §15.3 |

**Key Multi-Pet Rules:**
- Auto-switch on runaway (§9.4.4)
- Switching always allowed (§9.4.5)
- Alerts from any pet (§14.6)
- Offline applies to all pets (§9.4.6)
```

---

## BCT Compliance Requirements (for v2.3)

The following compliance tests should be added:

```
BCT-MULTIPET-001: Energy is global (shared pool across all pets)
BCT-MULTIPET-002: First-free daily game is global (one per day total)
BCT-MULTIPET-003: Daily cap (3 plays) is global across all pets
BCT-MULTIPET-004: Runaway triggers auto-switch to next available pet
BCT-MULTIPET-005: All-pets-runaway shows "All Pets Away" state
BCT-MULTIPET-006: Runaway pets remain in slot with lockout indicator
BCT-MULTIPET-007: Player can select runaway pet to view recovery UI
BCT-MULTIPET-008: Switching TO withdrawn/critical pets is allowed
BCT-MULTIPET-009: Offline mood decays for all pets simultaneously
BCT-MULTIPET-010: Offline bond decays for all pets simultaneously
BCT-MULTIPET-011: Offline neglect accrues for all pets simultaneously
BCT-MULTIPET-012: Neglect alerts fire once per stage transition
BCT-MULTIPET-013: Alert cooldown is 30 minutes minimum per pet
BCT-MULTIPET-014: Offline return batches alerts into summary
```
