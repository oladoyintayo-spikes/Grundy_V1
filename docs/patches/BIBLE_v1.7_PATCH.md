# BIBLE v1.7 PATCH — Multi-Pet Runtime Specifications

**Date:** December 12, 2025  
**Purpose:** Resolve P9-B blocking gaps for multi-pet runtime behavior  
**Applies to:** `docs/GRUNDY_MASTER_BIBLE.md`  
**Prerequisite:** Bible v1.6 + P9-A merged

---

## Instructions

Add these sections to the Bible in the specified locations. Do not remove existing content unless explicitly marked for replacement.

---

## PATCH 1: Energy Scope (§8.2 Addition)

**Location:** After existing §8.2 Energy System table

**Add:**

### §8.2.1 Energy Scope (Multi-Pet)

Energy is **GLOBAL** across all owned pets. Playing a mini-game with any pet consumes from the shared energy pool.

| Rule | Value |
|------|-------|
| Scope | Global (shared across all pets) |
| First daily game | Free: costs 0 energy, no minimum threshold required |
| Regeneration | Applies to global pool regardless of active pet |

**Rationale:** Energy is a session-gating mechanic, not a pet care stat. Players should not need to track multiple energy pools.

---

## PATCH 2: Multi-Pet Runaway Rules (§9.4.4 New Section)

**Location:** After §9.4.3 (Neglect Offline Rules)

**Add:**

### §9.4.4 Multi-Pet Runaway Handling

When the active pet runs away:

1. **Auto-switch** to the first non-runaway pet in `ownedPetIds` order
2. If **no available pets**, show "All Pets Away" screen:
   - Display per-pet recovery timers (remaining hours until free return)
   - Display per-pet gem return option (25💎 each)
   - Player can recover pets individually
3. Runaway pets **remain owned** and **occupy their slot**
4. Runaway pets are shown as "Away" and **cannot be selected** as active until recovered

| State | Selectable | Slot Status | Recovery |
|-------|------------|-------------|----------|
| Runaway | ❌ No | Occupied (grayed "Away") | Wait 48h OR pay 25💎 |
| Recovered | ✅ Yes | Normal | Bond -50% applied |

**Slot Rule:** Slots are **not freed** by runaway. The pet remains in the slot until recovered.

---

## PATCH 3: Switching Constraints During Neglect (§9.4.5 New Section)

**Location:** After §9.4.4

**Add:**

### §9.4.5 Switching During Neglect States

| Neglect Stage | Switch Allowed | UI Behavior |
|---------------|----------------|-------------|
| Normal | ✅ Yes | No message |
| Worried | ✅ Yes | No message |
| Sad | ✅ Yes | No message |
| Withdrawn | ✅ Yes | Toast: "This pet needs care!" |
| Critical | ✅ Yes | Toast: "This pet needs care urgently!" |
| Runaway | ❌ No | Selection disabled; tooltip: "Pet has run away" |

**UI Rules:**
- Withdrawn/Critical warnings use **toast** (no extra clicks required)
- Runaway pets show **disabled state** with explanation text on the selection card

---

## PATCH 4: Multi-Pet Notifications (§14.6 New Section)

**Location:** After §14.5 (Pet Switching UI) or at end of §14

**Add:**

### §14.6 Multi-Pet Notifications

#### §14.6.1 Routing Rules

| Channel | Scope | Behavior |
|---------|-------|----------|
| In-app HUD | Active pet only | Shows active pet's status + badge count for others |
| Alerts list | All pets | Shows all pets with attention states |
| Push notifications | Capability-dependent | Only if PWA notifications enabled |

**In-app Badge:** The pet switcher shows a badge count indicating how many non-active pets need attention (Withdrawn or worse).

**Push Notification Routing (if enabled):**
- Cozy Mode: Active pet only, gentle reminders
- Classic Mode: Any pet reaching **Critical or Runaway** threshold

#### §14.6.2 Alert Frequency Rules

| Rule | Value |
|------|-------|
| Same alert, same pet | Max once per 4 hours |
| Total daily alerts | Max 6 (excluding Critical/Runaway) |
| Critical/Runaway alerts | Always delivered (bypass limits) |
| Cozy mode total | Max 2 gentle reminders per day |
| User control | Can disable all non-critical in Settings |

**"Daily" Definition:** Resets at midnight in device local time.

**Suppression Scope:** Rate limits apply to notifications and toasts, **not** to passive UI elements (badges, status indicators).

---

## PATCH 5: Multi-Pet Offline Accrual (§9.4.6 New Section)

**Location:** After §9.4.5

**Add:**

### §9.4.6 Multi-Pet Offline Rules

When player returns after absence, apply time-based changes to **each owned pet independently**:

| System | Offline Behavior | Notes |
|--------|------------------|-------|
| Hunger | Decays per existing single-pet formula | Floors at 0 |
| Mood | Decays per existing single-pet formula | Floors at 0 |
| Bond | **No offline decay** | Bond only changes through interaction |
| Neglect (Classic) | Progresses per pet per §9.4.3 | 14-day cap per pet |

**Bond Exception:** Bond does not decay offline, but explicit events still apply (e.g., runaway return penalty of -50%).

**Offline Cap:** Maximum offline time applied is **14 days** per pet. Excess time is ignored.

**Application Order:**
1. Calculate elapsed time since last save
2. Cap at 14 days
3. Apply decay formulas to each pet in `ownedPetIds`
4. Apply neglect progression to each pet (Classic mode only)
5. Determine if any pet has reached Runaway
6. If active pet is now Runaway, trigger auto-switch per §9.4.4

---

## PATCH 6: Weight and Sickness Scope (§9.4.7 New Section — DEFERRED)

**Location:** Note for future patch

**Status:** DEFERRED to P9-C or later phase

Weight system and Sickness system multi-pet rules are not blocking for P9-B. When implemented:
- Weight: Expected to be **per-pet**
- Sickness: Expected to be **per-pet** (Classic mode only)

---

## Summary of Changes

| Patch | Section | Content |
|-------|---------|---------|
| 1 | §8.2.1 | Energy is GLOBAL; first game free clarification |
| 2 | §9.4.4 | Runaway auto-switch, slot handling, "All Pets Away" screen |
| 3 | §9.4.5 | Switching allowed with warnings; runaway = locked |
| 4 | §14.6 | Alert routing (in-app vs push); frequency limits |
| 5 | §9.4.6 | Offline accrual per-pet; bond exception; 14-day cap |
| 6 | §9.4.7 | Weight/Sickness deferred (placeholder) |

---

## Verification Checklist

After applying this patch, verify:

- [ ] §8.2.1 exists and specifies GLOBAL energy
- [ ] §9.4.4 exists with runaway auto-switch rules
- [ ] §9.4.5 exists with switching constraint table
- [ ] §14.6 exists with notification routing and frequency rules
- [ ] §9.4.6 exists with offline accrual rules
- [ ] Bible header updated to v1.7

---

## BCT Impact

This patch enables the following BCT test categories:

| Category | Tests Enabled |
|----------|---------------|
| BCT-ENERGY-MULTI | Energy global scope, first-free rules |
| BCT-RUNAWAY-MULTI | Auto-switch, slot handling, recovery |
| BCT-SWITCH-NEGLECT | Switching constraints by stage |
| BCT-ALERT-ROUTING | In-app vs push, frequency limits |
| BCT-OFFLINE-MULTI | Per-pet accrual, caps, bond exception |

---

*End of Bible v1.7 Patch*
