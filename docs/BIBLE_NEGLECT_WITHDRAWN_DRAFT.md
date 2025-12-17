# BIBLE UPDATE: §9.4.3 Neglect & Withdrawal System

> ⚠️ **Historical Document** — This document is a draft from Bible v1.5.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

**For:** GRUNDY_MASTER_BIBLE.md
**Replaces:** Current "Neglect & Runaway System" subsection in §9.4 (lines 1882-1898)
**Version:** 1.5 (proposed)
**Status:** DRAFT v3 - Final Review (Integrated into Bible)

---

## §9.4.3 Neglect & Withdrawal System (Classic Mode Only)

> *"They forgive. They always forgive. But they don't forget."*  
> — Warning found in margins of the Codex

### Overview

In Classic Mode, pets require consistent care. Prolonged absence causes emotional withdrawal, and severe neglect causes the pet to go into hiding. This system creates meaningful stakes without permadeath.

**Cozy Mode:** Neglect & Withdrawal mechanics are **completely disabled** in Cozy Mode:
- Neglect Days never increase
- Worried / Sad / Withdrawn / Critical / Runaway states never trigger
- All recovery paths and gem costs for neglect are Classic-only
- Neglect-related fields remain at zero/default even after long periods of inactivity

See §9.3 for full Cozy Mode specifics.

---

### Protection Rules

#### FTUE Protection
Neglect & Withdrawal systems are **disabled until FTUE is complete**. A pet cannot become Worried, Sad, Withdrawn, or Runaway during onboarding. The neglect counter begins only after the player completes the tutorial and enters normal gameplay.

#### New Player Grace Period
For the **first 48 hours after account creation**, Neglect & Withdrawal are disabled. No Neglect Days accumulate during this window. This prevents new players who are still exploring from immediately falling into the Neglect ladder.

#### Per-Pet Tracking
Neglect is tracked **per pet**, starting from the day they join your home (adoption). Each pet has its own independent `lastCareDate` and `neglectDays` counter.

- An unused pet that has never been cared for will still accumulate Neglect Days once adopted
- Switching active pets does not transfer or reset neglect counters
- **Active Pet Irrelevance:** Being the "active pet" does not by itself count as care. Only Feed or Play actions reset Neglect Days for that specific pet.

---

### System Separation

This system is **independent** from other Classic Mode mechanics:

| System | Tracks | Triggered By | Consequence |
|--------|--------|--------------|-------------|
| **Care Mistakes** (§9.4.1) | Quality of care when present | Hourly stat failures | Evolution branches |
| **Sickness** (§9.4.2) | Stat neglect while playing | Hunger=0, uncleaned poop, etc. | Sick state, needs Medicine |
| **Neglect & Withdrawal** (§9.4.3) | Presence/absence | Days without any care action | Withdrawn → Runaway |

A player can:
- Be **present and sloppy** → Sickness + Care Mistakes (but not Withdrawn)
- Be **absent** → Withdrawn → Runaway (but not Sick, since they weren't there)
- Be **present and careful** → No penalties

---

### Neglect Definition

A **neglect day** is any calendar day (midnight to midnight, local time) where:
- No feeding action was performed, AND
- No play action was performed

A **care day** is any day with at least one feed OR play action.

**Passive actions do NOT count as care:**
- Viewing pet
- Opening the app
- Cleaning poop
- Switching active pet

Only **feed** and **play** reset the neglect counter.

#### Calendar Day Definition
Day boundaries are calculated using the **player's local calendar date at login**. We treat "calendar day" as the unit, not rolling 24-hour windows.

*Implementation note:* For multi-device players, the server should normalize dates to a single canonical timezone (e.g., UTC) when available. If offline/local-only, use the device date as source of truth.

---

### Neglect Timeline

| Day | Stage | Visual Change | Mechanical Effect |
|-----|-------|---------------|-------------------|
| 0 | **Normal** | Mood-based pose | Full bond gains |
| 2 | **Worried** | Worried pose, "..." thought bubble | Warning only (no penalty) |
| 4 | **Sad** | Sad pose, thought bubble | Warning only (no penalty) |
| 7 | **Withdrawn** | Desaturated appearance | -25% bond instantly, -50% bond gains |
| 10 | **Critical** | Withdrawn + "!" indicator | Final warning before hiding |
| 14 | **Runaway** | Pet disappears | 24h lockout, -50% bond on return |

---

### Stage Details

#### Worried (Day 2)
- **Visual:** Pet displays worried pose variant
- **Thought Bubble:** "..." (ellipsis only)
- **Notification:** "Your pet is wondering where you are... 💭" (gentle)
- **Penalty:** None
- **Recovery:** Single care action returns to Normal

#### Sad (Day 4)
- **Visual:** Pet displays sad pose variant
- **Thought Bubble:** Shows UI copy (see below)
- **Notification:** "Your pet misses you! 💔" (moderate urgency)
- **Penalty:** None
- **Recovery:** Single care action returns to Normal

#### Withdrawn (Day 7)
- **Visual:** 
  - Uses `sad` pose with desaturation filter applied
  - CSS: `filter: saturate(0.5) brightness(0.9);`
  - 💔 badge displayed on pet card
  - *Future art pass (optional):* Dedicated `{pet}_withdrawn.png` sprites with hunched shoulders, downcast eyes
- **Thought Bubble:** "..." (no longer speaks)
- **Notification:** "Your pet has become withdrawn... 😔" (urgent)
- **Immediate Penalty:** 
  - Bond reduced by 25% instantly
- **Ongoing Penalty:**
  - Bond gains reduced by 50% until recovered
  - Mood gains reduced by 25% until recovered
- **Recovery:** See Recovery Paths below

#### Critical (Day 10)
- **Visual:** Same as Withdrawn + pulsing "!" indicator
- **Thought Bubble:** None
- **Notification:** "Your pet is pulling away. It may go into hiding soon. ⚠️" (critical)
- **Penalty:** Same as Withdrawn (no additional penalty)
- **Recovery:** Same as Withdrawn

#### Runaway (Day 14)
- **Visual:** Pet disappears from home screen, replaced with empty bed/cushion
- **Message:** Shows UI copy (see below)
- **Notification:** "Your pet has gone into hiding. They still remember you. 😢"
- **Effects:**
  - Pet locked out (cannot interact)
  - 24-hour minimum wait before return option
- **Recovery:** See Recovery Paths below

---

### Canonical UI Copy

These are the exact UI lines to use. Do not paraphrase or "get creative" with tone.

| State | UI Text |
|-------|---------|
| **Worried** | "Your Grundy is starting to worry you won't come back." |
| **Sad** | "Your Grundy feels forgotten. It's trying not to, but it hurts." |
| **Withdrawn** | "Your Grundy is here, but it's pulled away. It needs time and gentle care to trust again." |
| **Critical** | "Your Grundy has gone quiet and distant. It's protecting itself from getting hurt again." |
| **Runaway** | "Your Grundy has gone into hiding. It still remembers you. It just doesn't feel safe yet." |
| **Return Message** | "Your Grundy came back! They remember, but they're willing to try again. 💕" |

**Tone principle:** The pet is protecting itself, not punishing the player. Frame it as the pet's emotional response, not the player's failure.

---

### Recovery Paths

#### Gem Costs (Tunable)

These values are **tunable balance parameters** and may be adjusted by the live team without changing the emotional logic of the system.

**Default values for Web v1.5:**
- Withdrawn → **15 💎** to restore trust immediately
- Runaway → **25 💎** to shorten the wait to 24 hours

#### From Withdrawn State (Days 7-13)

| Path | Requirement | Result |
|------|-------------|--------|
| **Free (Time)** | 7 consecutive care days | Full recovery, withdrawal cleared |
| **Paid (Gems)** | 15 💎 (tunable) | Instant recovery, withdrawal cleared |

**On recovery from withdrawal:**
- Visual returns to normal (desaturation removed)
- Bond gains return to 100%
- Mood gains return to 100%
- Neglect counter resets to 0
- 💔 badge removed

#### From Runaway State (Day 14+)

| Path | Requirement | Result |
|------|-------------|--------|
| **Free (Time)** | Wait 72 hours, then tap "Call Back" | Pet returns, bond -50% |
| **Paid (Gems)** | Wait 24 hours, then pay 25 💎 (tunable) | Pet returns, bond -50% |

**On return from runaway:**
- Pet reappears with "welcome back" animation
- Bond reduced by 50% (applied on return)
- Withdrawal cleared (fresh start)
- Neglect counter resets to 0
- Message: (see Canonical UI Copy)

**No gems available?**
- Free path (72h wait) is always available
- Message: "Your pet will come back in [X hours]. They just need time."

---

### Offline Handling

| Scenario | Rule |
|----------|------|
| App not opened for 5 days | 5 neglect days accrued |
| App not opened for 20 days | Capped at 14 days (instant runaway, not worse) |
| Return after extended absence | Lockout timer starts on app open |

**Offline cap rationale:** Players who return after a month should not face worse consequences than players who return after 2 weeks. Both hit runaway with the same recovery path.

#### Implementation Note

When the player returns:

```typescript
// Calculate neglect on app open
const days_since_last_care = Math.max(0, calendarDaysBetween(lastCareDate, today));
const neglect_days = Math.min(days_since_last_care, 14);

// Neglect cannot exceed 14 days, even if the player is gone longer
```

---

### Warning Notification Schedule

| Neglect Days | Notification | Urgency |
|--------------|--------------|---------|
| 2 | "Your pet is wondering where you are... 💭" | Gentle |
| 4 | "Your pet misses you! 💔" | Moderate |
| 6 | "Your pet needs you soon! ⚠️" | Urgent |
| 7 | "Your pet has become withdrawn... 😔" | Critical |
| 10 | "Your pet is pulling away. It may go into hiding soon. ⚠️" | Emergency |
| 13 | "Last chance to reconnect before your pet goes into hiding. 🚨" | Emergency |

**Notification settings:** Players can disable neglect notifications in Settings, but this does not disable the neglect system itself.

---

### Ability Interactions

| Ability | Effect on Neglect? |
|---------|-------------------|
| Plompo's -20% decay | ❌ No effect (neglect is binary per day, not a decay rate) |
| Grib's -20% mood penalty | ❌ No effect on neglect (only affects food reactions) |
| All other abilities | ❌ No effect |

**Design rationale:** Neglect is a consequence of player behavior, not pet stats. No ability can substitute for actually caring for your pet.

---

### Relationship to Other Systems

#### vs. Care Mistakes (§9.4.1)
| Aspect | Care Mistakes | Neglect |
|--------|---------------|---------|
| Tracks | Hourly stat failures | Daily absence |
| Question | "How well do you care?" | "Do you show up?" |
| Consequence | Evolution branch (Rare/Standard/Altered) | Withdrawn → Runaway |
| Resets | At each evolution | On any care action |

**They are independent.** A pet with 0 Care Mistakes can become Withdrawn (player was absent). A pet with many Care Mistakes may never become Withdrawn (player was present but sloppy).

#### vs. Sickness (§9.4.2)
| Aspect | Sickness | Withdrawal |
|--------|----------|------------|
| Triggered by | Stat failures while playing | Days without playing |
| Visual | Green face, thermometer | Desaturated, pulled away |
| Cure | Medicine (50 coins / ad) | 7 care days / 15💎 |
| Can happen together? | No — Sickness requires presence, Withdrawal requires absence |

#### vs. Altered Form Evolution
| Aspect | Altered Form | Withdrawn State |
|--------|--------------|-----------------|
| What it is | Permanent evolution branch | Temporary emotional state |
| Triggered by | 4+ Care Mistakes per stage | 7+ days absent |
| Visual | Different evolved appearance | Desaturated current appearance |
| Recovery | 30 days good care (optional) | 7 care days / 15💎 |
| Affects | Evolution outcome | Current bond/mood gains |

**"Altered Form" and "Withdrawn" are different things.** A pet can be:
- Withdrawn but destined for Rare Form (absent player who was perfect when present)
- Not Withdrawn but destined for Altered Form (present player who made many mistakes)

---

### UI/UX Requirements

#### Pet Display (Withdrawn State)

Withdrawn state reuses the existing `sad` pose sprite with a CSS filter applied:

```css
.pet-withdrawn {
  filter: saturate(0.5) brightness(0.9);
}
```

**No new sprite assets required.** The desaturation creates a visually distinct "emotionally pulled away" appearance.

*Future enhancement (optional):* Dedicated `{pet}_withdrawn.png` sprites can be added following the pattern in §13.6. Until then, the filter approach ships immediately with zero art dependencies.

#### State Resolution Priority

Withdrawn state fits into the existing state resolution logic (§13.6) as follows:

```typescript
function getDisplayState(pet: PetState): DisplayState {
  // 1. Transient states (eating, excited, pooping)
  // ...existing checks...
  
  // 2. Status states - WITHDRAWN ADDED HERE
  if (pet.isWithdrawn) return 'sad'; // Uses sad sprite + CSS filter
  if (pet.isSick) return 'sick';
  if (pet.isSleeping) return 'sleeping';
  
  // 3. Need states, 4. Ambient states, 5. Default
  // ...existing logic...
}
```

The `isWithdrawn` flag triggers the CSS filter class separately from sprite selection.

#### Withdrawal Badge
- Position: Top-left of pet avatar
- Icon: 💔 (broken heart)
- Size: 24px
- Tooltip: "Your pet is withdrawn. Show them you care!"

#### Runaway Screen
- Empty pet area with cushion/bed graphic
- Message: (see Canonical UI Copy)
- Button (after 24h): "Call Back (25 💎)" 
- Button (after 72h): "Call Back (Free)"
- Countdown timer showing time until free option

---

### Data Schema

```typescript
interface NeglectState {
  // Tracking
  lastCareDate: string | null;      // ISO date of last feed or play action
  neglectDays: number;               // Current consecutive neglect days (0-14)
  
  // Withdrawal
  isWithdrawn: boolean;              // True if neglect >= 7
  withdrawnAt: string | null;        // ISO date when withdrawal started
  recoveryDaysCompleted: number;     // Care days toward recovery (0-7)
  
  // Runaway
  isRunaway: boolean;                // True if neglect >= 14
  runawayAt: string | null;          // ISO timestamp when runaway triggered
  canReturnFreeAt: string | null;    // ISO timestamp when free return available
  canReturnPaidAt: string | null;    // ISO timestamp when paid return available
}

// Default state (Classic Mode)
const DEFAULT_NEGLECT_STATE: NeglectState = {
  lastCareDate: null,
  neglectDays: 0,
  isWithdrawn: false,
  withdrawnAt: null,
  recoveryDaysCompleted: 0,
  isRunaway: false,
  runawayAt: null,
  canReturnFreeAt: null,
  canReturnPaidAt: null,
};
```

---

### State Transitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEGLECT STATE MACHINE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  NORMAL ──(2 days)──► WORRIED ──(2 days)──► SAD                    │
│     ▲                    │                    │                     │
│     │                    │ care               │ care                │
│     │                    ▼                    ▼                     │
│     └────────────────────┴────────────────────┘                     │
│                                                                     │
│  SAD ──(3 days)──► WITHDRAWN ──(3 days)──► CRITICAL                │
│                        │                       │                    │
│                        │ 7 care days           │ care               │
│                        │ OR 15 gems            │                    │
│                        ▼                       ▼                    │
│                     NORMAL ◄───────────────────┘                    │
│                                                                     │
│  CRITICAL ──(4 days)──► RUNAWAY                                    │
│                            │                                        │
│                            │ 72h + free call back                   │
│                            │ OR 24h + 25 gems                       │
│                            ▼                                        │
│                         NORMAL (bond -50%)                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Testing Requirements (BCT)

| Test ID | Description | Expected |
|---------|-------------|----------|
| BCT-NEGLECT-001 | Day 2 triggers Worried state | Pass |
| BCT-NEGLECT-002 | Day 4 triggers Sad state | Pass |
| BCT-NEGLECT-003 | Day 7 triggers Withdrawn state | Pass |
| BCT-NEGLECT-004 | Day 7 applies -25% bond instantly | Pass |
| BCT-NEGLECT-005 | Withdrawn state reduces bond gains by 50% | Pass |
| BCT-NEGLECT-006 | Day 10 triggers Critical warning | Pass |
| BCT-NEGLECT-007 | Day 14 triggers Runaway | Pass |
| BCT-NEGLECT-008 | 7 consecutive care days clears withdrawal | Pass |
| BCT-NEGLECT-009 | 15 gems clears withdrawal instantly | Pass |
| BCT-NEGLECT-010 | 72h wait enables free return from runaway | Pass |
| BCT-NEGLECT-011 | 24h + 25 gems enables paid return | Pass |
| BCT-NEGLECT-012 | Runaway return applies -50% bond | Pass |
| BCT-NEGLECT-013 | Offline neglect capped at 14 days | Pass |
| BCT-NEGLECT-014 | Cozy mode disables all neglect mechanics (fields remain zero/default after long inactivity) | Pass |
| BCT-NEGLECT-015 | Feed action resets neglect counter | Pass |
| BCT-NEGLECT-016 | Play action resets neglect counter | Pass |
| BCT-NEGLECT-017 | Passive actions (view, clean, switch pet) do NOT reset counter | Pass |
| BCT-NEGLECT-018 | Sickness and Withdrawal are independent | Pass |
| BCT-NEGLECT-019 | Care Mistakes and Neglect are independent | Pass |
| BCT-NEGLECT-020 | FTUE protection: neglect disabled during onboarding | Pass |
| BCT-NEGLECT-021 | New player grace period: no neglect for first 48h | Pass |
| BCT-NEGLECT-022 | Per-pet tracking: each pet has independent neglect counter | Pass |
| BCT-NEGLECT-023 | Active pet status does not count as care | Pass |

---

### Summary Table

| Event | Days | Immediate Cost | Ongoing Cost | Recovery (Free) | Recovery (Paid) |
|-------|------|----------------|--------------|-----------------|-----------------|
| Worried | 2 | None | None | 1 care action | — |
| Sad | 4 | None | None | 1 care action | — |
| **Withdrawn** | 7 | -25% bond | -50% bond gains, -25% mood gains | 7 care days | 15 💎 |
| Critical | 10 | None (same as Withdrawn) | Same as Withdrawn | 7 care days | 15 💎 |
| **Runaway** | 14 | Pet gone | Locked out | 72h wait | 24h + 25 💎 |

**On return from runaway:** -50% bond (additional to withdrawal's -25%)

---

### Design Rationale

1. **7 days for withdrawal** — A week of absence is a clear choice, not an accident. Vacation-friendly.

2. **14 days for runaway** — Two weeks gives ample warning. Matches Tamagotchi-era expectations.

3. **-25% bond at withdrawal** — Immediate consequence creates urgency without being devastating.

4. **Free recovery paths** — No player should be locked out because they can't pay. Time investment is always an option.

5. **Gem costs as tunable parameters** — The structure is sacred; the numbers are flexible. Live team can rebalance without "breaking the Bible."

6. **Offline cap at 14** — Returning players shouldn't face worse punishment than 2-week absentees.

7. **Day-based (not stat-based)** — Simple, clear, predictable. "Did you interact today?" is the only question.

8. **Independent from Sickness/Care Mistakes** — Each system answers a different question. No confusion, no overlap.

9. **Zero new art required** — CSS filter on existing `sad` sprite ships immediately. Dedicated withdrawn sprites are optional future polish.

10. **FTUE + 48h protection** — New players get a safe onboarding window before consequences begin.

11. **Per-pet tracking** — Multi-pet edge cases are explicit. No ambiguity about which pet is being neglected.

12. **Tone: pet protecting itself** — The pet is responding emotionally, not punishing the player. Firm but not judgmental.

---

## Bible Constants Addition

```typescript
// bible.constants.ts

export const NEGLECT_THRESHOLDS = {
  WORRIED: 2,       // days
  SAD: 4,           // days
  WITHDRAWN: 7,     // days
  CRITICAL: 10,     // days
  RUNAWAY: 14,      // days
  OFFLINE_CAP: 14,  // max days accrued offline
  GRACE_PERIOD_HOURS: 48, // new player protection window
} as const;

export const WITHDRAWAL_EFFECTS = {
  INSTANT_BOND_LOSS: 0.25,  // 25% bond lost when withdrawal triggers
  BOND_GAIN_PENALTY: 0.50,  // 50% reduction in bond gains
  MOOD_GAIN_PENALTY: 0.25,  // 25% reduction in mood gains
} as const;

// Tunable balance parameters - may be adjusted without changing system logic
export const WITHDRAWAL_RECOVERY = {
  FREE_CARE_DAYS: 7,  // consecutive care days to recover
  GEM_COST: 15,       // gems for instant recovery (tunable)
} as const;

// Tunable balance parameters - may be adjusted without changing system logic
export const RUNAWAY_RECOVERY = {
  FREE_WAIT_HOURS: 72,    // hours until free return
  PAID_WAIT_HOURS: 24,    // hours until paid return available
  GEM_COST: 25,           // gems for paid return (tunable)
  BOND_PENALTY: 0.50,     // 50% bond lost on return
} as const;

// Canonical UI copy - do not paraphrase
export const NEGLECT_UI_COPY = {
  WORRIED: "Your Grundy is starting to worry you won't come back.",
  SAD: "Your Grundy feels forgotten. It's trying not to, but it hurts.",
  WITHDRAWN: "Your Grundy is here, but it's pulled away. It needs time and gentle care to trust again.",
  CRITICAL: "Your Grundy has gone quiet and distant. It's protecting itself from getting hurt again.",
  RUNAWAY: "Your Grundy has gone into hiding. It still remembers you. It just doesn't feel safe yet.",
  RETURN: "Your Grundy came back! They remember, but they're willing to try again. 💕",
} as const;
```

---

## Integration Checklist

### Files to Update

| File | Change |
|------|--------|
| `docs/GRUNDY_MASTER_BIBLE.md` | Replace §9.4 "Neglect & Runaway System" (lines 1882-1898) with this section |
| `src/constants/bible.constants.ts` | Add `NEGLECT_THRESHOLDS`, `WITHDRAWAL_EFFECTS`, `WITHDRAWAL_RECOVERY`, `RUNAWAY_RECOVERY`, `NEGLECT_UI_COPY` |
| `src/store/petStore.ts` | Add `NeglectState` to `PetState` interface |
| `src/game/systems.ts` | Add `checkNeglect()`, `applyWithdrawal()`, `handleRunaway()` |
| `docs/BIBLE_COMPLIANCE_TEST.md` | Add BCT-NEGLECT-* test specifications (23 tests) |

### What This Replaces

**Old (lines 1882-1898):**
```markdown
### Neglect & Runaway System

**NO permadeath. Pet runs away instead.**

**Neglect path:**
1. Pet sad, warns you
2. Pet sick
3. Pet threatens to leave
4. **Pet runs away** (48h lockout)

**Return options:**
- Wait 48 hours, OR
- Pay 25 gems

**Consequences:**
- Bond -50%
- Rebuild trust over time
```

**New:** This entire document (§9.4.3)

### What Stays Unchanged

- §9.4.1 Care Mistakes System (lines 1847-1859)
- §9.4.2 Sickness System (lines 1861-1880)
- §9.4.4 Evolution Branches (lines 1900-1934)

---

## Approval Checklist

- [ ] Terminology approved ("Withdrawn" not "Corrupted")
- [ ] Timeline approved (2/4/7/10/14 days)
- [ ] Gem costs approved as tunable (15💎 withdrawal, 25💎 runaway)
- [ ] Bond penalties approved (-25% withdrawal, -50% runaway)
- [ ] System separation approved (independent from Sickness/Care Mistakes)
- [ ] FTUE + 48h grace period approved
- [ ] Per-pet tracking rules approved
- [ ] Calendar day definition approved
- [ ] Canonical UI copy approved
- [ ] Tone approved (pet protecting itself, not punishing player)
- [ ] Cozy Mode complete exemption confirmed
- [ ] Ready for Bible v1.5 integration

---

**END OF DRAFT v3**
