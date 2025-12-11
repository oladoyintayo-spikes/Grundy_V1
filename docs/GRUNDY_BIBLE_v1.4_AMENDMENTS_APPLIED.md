# GRUNDY BIBLE — AMENDMENTS APPLIED (v1.4)

**Purpose:** All approved amendments ready to merge into GRUNDY_MASTER_BIBLE.md  
**Date:** December 2024  
**Status:** APPROVED — Ready to Apply

---

## HOW TO APPLY

1. Update version header to v1.4
2. Add changelog entry
3. Replace/add each section below in the corresponding location
4. Verify TOC is updated

---

## HEADER UPDATES

### Replace Lines 4-13 with:

```markdown
**Version:** 1.4  
**Last Updated:** December 2024  
**Status:** Production Reference  
**Platforms:** Web (First Light 1.0) [Current], Android/iOS [Unity Later]  
**Engine:** Web (Vite + React + TypeScript) [Current], Unity 2022 LTS [Planned Mobile]

**Changelog:**
- v1.4: Bible Compliance Update — Added platform phase tags (§1.6), navigation structure (§14.5), mobile layout constraints (§14.6), expanded cooldown spec (§4.3), dev HUD exception (§4.4), locked mini-game rules (§8.2-8.3), evolution thresholds locked (§6.1), FTUE fallback (§7.4), art vs emoji rule (§13.6), updated prototype gaps (§15.6)
- v1.3: Added authority statement, web prototype mapping (15.6), and related documents index (16.5)
- v1.2: Added Section 13.6 (Asset Manifest & State System) with stat-to-art mapping, state resolution logic, and ASSET_MANIFEST.md reference
- v1.1: Expanded Section 11 (Economy & Monetization) with complete shop catalog, pet slots, inventory slots, Grundy Plus benefits, season pass structure, advertising specs, and data schemas
```

### Update TOC (Lines 25-55) — Add new subsections:

```markdown
## TABLE OF CONTENTS

1. [Vision & Identity](#1-vision--identity)
    - 1.6 Platform & Phase Tags ← NEW
2. [The World (Lore)](#2-the-world-lore)
3. [The 8 Pets (Complete Profiles)](#3-the-8-pets-complete-profiles)
4. [Core Systems](#4-core-systems)
5. [Food & Feeding](#5-food--feeding)
6. [Progression & Unlocks](#6-progression--unlocks)
7. [Onboarding Flow](#7-onboarding-flow)
8. [Mini-Games](#8-mini-games)
9. [Cozy vs Classic Mode](#9-cozy-vs-classic-mode)
10. [Events & LiveOps](#10-events--liveops)
11. [Economy & Monetization](#11-economy--monetization)
    - 11.1 Currency Types
    - 11.2 Revenue Strategy
    - 11.3 Monetization Model
    - 11.4 Gem Economy
    - 11.5 The Shop (Complete)
    - 11.6 Pet Slots
    - 11.7 Inventory Slots
    - 11.8 Grundy Plus (Subscription)
    - 11.9 Season Pass [Unity Later]
    - 11.10 Advertising [Unity Later]
    - 11.11 Bundles & Starter Packs
    - 11.12 Economy Data Schema
12. [Sound & Vibration](#12-sound--vibration)
13. [Animation & Visuals](#13-animation--visuals)
    - 13.6 Asset Manifest & State System
    - 13.7 Production Art Rule ← NEW
14. [UI/UX Design](#14-uiux-design)
    - 14.5 Navigation Structure ← NEW
    - 14.6 Mobile Layout Constraints ← NEW
15. [Technical Specs](#15-technical-specs)
    - 15.6 Web Prototype Mapping
16. [Coverage Notes](#16-coverage-notes)
    - 16.5 Related Documents
```

---

# PHASE 1: CRITICAL AMENDMENTS (Core Loop)

These fix game-breaking issues and must be applied first.

---

## §1.6 Platform & Phase Tags [NEW SECTION]

**Location:** Insert after §1.5 The Aesthetic (after Line 96)

```markdown
## 1.6 Platform & Phase Tags

This Bible describes the **full Grundy design**. Not all features are implemented in every build.

### Tag Definitions

| Tag | Meaning |
|-----|---------|
| **[Web 1.0]** | Implemented in Web Edition 1.0 "First Light" |
| **[Web Phase 6+]** | Design locked, targeted for Web Phase 6 or later |
| **[Unity Later]** | Reserved for Unity/mobile builds |
| **[Future]** | Designed but not yet scheduled |

### How to Read Tagged Sections

When a section or feature includes a tag:

```
## 9.4 Classic Mode Specifics [Web Phase 6+]
```

This means:
- The **design is final** (do not change without approval)
- The **implementation is not yet in Web 1.0**
- It is **targeted for Phase 6 or later**

### Current Implementation Status

| Section | Tag | Status |
|---------|-----|--------|
| §4.3 Cooldown System | [Web Phase 6+] | Not yet implemented |
| §4.4 Fullness States | [Web Phase 6+] | Not yet implemented |
| §9.4 Classic Mode (full) | [Web Phase 6+] | Mode select exists; consequences partial |
| §14.4 Rooms (activity-based) | [Web Phase 6+] | Time-of-day only in Web 1.0 |
| §14.5 Navigation Structure | [Web Phase 6+] | Pet tabs visible; needs menu-based |
| §8 Mini-Games | [Web 1.0] | 5 games implemented |
| §11.9 Season Pass | [Unity Later] | Not in Web |
| §11.10 Rewarded Ads | [Unity Later] | Not in Web |

> **Maintenance Note:** Update these tags as implementations land. The goal is to keep the Bible honest about what exists vs. what's designed.
```

---

## §4.3 Cooldown System [REPLACE SECTION]

**Location:** Replace Lines 972-981

```markdown
## 4.3 Cooldown System [Web Phase 6+]

After feeding, a 30-minute digestion cooldown begins.

| Cooldown State | Feed Value |
|----------------|------------|
| No cooldown | 100% |
| During cooldown | 25% |

### Implementation Requirements

| Requirement | Specification |
|-------------|---------------|
| Timer start | Immediately after ANY feeding action |
| Timer duration | 30 minutes (see Tuning Note) |
| Timer persistence | Survives page refresh/app restart |
| Timer display | Always visible when active |
| Feeding during cooldown | Allowed, but at 25% effectiveness |
| Timer reset | Each feeding restarts the timer |

### UI Display

```
┌─────────────────────────────────────┐
│  ⏱️ Digesting... 24:32              │
│  (Feeding now gives 25% value)      │
└─────────────────────────────────────┘
```

### Tuning Note

> The exact cooldown duration (30 minutes) may be tuned per platform based on session data. However, two rules are **mandatory and non-negotiable**:
> 
> 1. **A cooldown MUST exist** — spam-feeding must be prevented
> 2. **STUFFED blocks feeding** — at fullness 91-100, feeding is refused entirely
>
> These constraints preserve the "Daily Moments" rhythm and prevent trivializing progression.

> **Design Intent:** Cooldown prevents spam-feeding. Players can still feed during cooldown (for emergencies) but with reduced benefit.
```

---

## §4.4 Stats System [ADD TO EXISTING]

**Location:** Insert after "Bond is visible. Everything else is hidden." (after Line 985)

```markdown
**Bond is visible. Everything else is hidden.** The pet's behavior communicates needs.

### Production HUD Rule

> The player-facing HUD shows **Bond only**. All other stats (hunger, mood, XP, energy) are communicated through:
> - Pet animations and expressions
> - Thought bubbles and icons
> - Contextual UI cues (e.g., food tray grays out when stuffed)
>
> **No raw stat bars or numbers** for hidden stats in production builds.

### Developer/QA Exception

> Developer and QA builds may expose additional debug stats (XP bars, hunger meters, cooldown timers, feed counters, session timers). These **must not appear in player-facing builds**.
>
> Implementation should gate debug HUD behind a dev flag:
> ```typescript
> if (import.meta.env.DEV) {
>   showDebugHUD();
> }
> ```
>
> Production builds must strip or disable all debug UI.
```

---

## §4.4 Fullness States [ADD TAG]

**Location:** Update the Fullness States header (Line 1006)

```markdown
### Fullness States (Hidden) [Web Phase 6+]

| State | Range | Pet Behavior | Feed Value |
|-------|-------|--------------|------------|
| HUNGRY | 0-20 | Begs | 100% |
| PECKISH | 21-40 | Glances | 75% |
| CONTENT | 41-70 | Ignores | 50% |
| SATISFIED | 71-90 | Shakes head | 25% |
| STUFFED | 91-100 | Turns away | **Blocked** |

> ⚠️ **LOCKED RULE:** When fullness reaches STUFFED (91-100), feeding is **completely blocked**, not just reduced. Pet refuses food entirely. This is mandatory behavior across all platforms.
```

---

# PHASE 2: HIGH PRIORITY AMENDMENTS (UX & Economy)

---

## §6.1 Evolution Stages [ADD LOCKED DESIGNATION]

**Location:** Insert after the Evolution Stages table (after Line 1232)

```markdown
### Evolution Stages

| Stage | Levels | Look |
|-------|--------|------|
| Baby | 1-9 | Simple, small |
| Youth | 10-24 | Growing, developing |
| Evolved | 25+ | Full design |

> ⚠️ **LOCKED THRESHOLDS:** Youth=10, Evolved=25. These values are final.
>
> "Slower reveal, more anticipation" — do not lower thresholds to speed progression. This was an explicit design decision to make evolution feel meaningful.

Care quality affects appearance in Classic mode (see Section 9).
```

---

## §8.2 Energy System [REPLACE SECTION]

**Location:** Replace Lines 1666-1673

```markdown
## 8.2 Energy System [Web 1.0]

| Attribute | Value |
|-----------|-------|
| Maximum | 50 |
| Cost per game | 10 |
| Regeneration | 1 per 30 minutes |
| First daily game | FREE |
| **Daily cap** | **3 plays maximum** |

> ⚠️ **LOCKED RULES:**
> - Daily cap of **3 plays** is a design constraint to preserve session rhythm
> - First game each day is **always free** (costs 0 energy)
> - These rules exist to prevent grinding and maintain the "check-in" design
>
> Do not increase daily cap or remove energy costs without explicit approval.
```

---

## §8.3 Reward Tiers [REPLACE NOTE]

**Location:** Replace the Note after the reward table (Line 1684)

```markdown
## 8.3 Reward Tiers [Web 1.0]

| Tier | Coins | XP | Food |
|------|-------|-----|------|
| Bronze | 2-3 | 3 | — |
| Silver | 5-7 | 5 | 40% common |
| Gold | 8-15 | 8 | 75% any |
| Rainbow | 12-22 | 12 | Rare guaranteed |

> ⚠️ **LOCKED INVARIANT — NO GEMS FROM MINI-GAMES**
> 
> Mini-games **NEVER** award gems under any circumstances — including Rainbow tier. This is a locked design constraint.
>
> **Gem income comes exclusively from:**
> - Level-up rewards
> - Daily login streaks  
> - Achievements
> - Special events
> - Purchases
>
> **Rationale:** 
> - Preserves gem value as premium currency
> - Prevents mini-game grinding for premium rewards
> - Maintains ethical monetization balance
>
> **Do not add gem rewards to any mini-game tier, including Rainbow.**
```

---

## §14.5 Navigation Structure [NEW SECTION]

**Location:** Insert after §14.4 Environments (after Line 3233)

```markdown
## 14.5 Navigation Structure [Web Phase 6+]

> **Current State:** Web 1.0 uses a bottom navigation bar (Home / Games / Settings). This section describes the **future menu-based structure** that will replace it in Phase 6+.

### Main Screen Layout

- **Only active pet visible** on home screen
- No "pet bar" showing all 8 pets simultaneously
- Pet selector accessed via Menu only

### Menu Button

- Hamburger icon (☰) in top-left corner
- Always visible during gameplay
- Tap to open slide-out menu

### Menu Options

| Option | Icon | Action |
|--------|------|--------|
| Switch Pet | 🐾 | Opens Pet Selector modal |
| Shop | 🛒 | Opens Shop screen |
| Mini-Games | 🎮 | Opens Mini-Game Hub |
| Settings | ⚙️ | Opens Settings panel |
| Home | 🏠 | Return to welcome (with confirmation) |

### Pet Switching UX

Switching Grundies is a **deliberate action**. Implementations must:

1. **Show lock status** — Clearly distinguish locked vs available pets
2. **Auto-save first** — Save current pet's state before switching
3. **Confirm switch** — Show confirmation when leaving current pet

```
┌─────────────────────────────────────┐
│        Switch to Grib?              │
│                                     │
│  Munchlet's progress will be saved. │
│  You can return anytime!            │
│                                     │
│     [Stay]        [Switch]          │
└─────────────────────────────────────┘
```

### Home Button Behavior

```
┌─────────────────────────────────────┐
│        Return to Home?              │
│                                     │
│  Your progress is auto-saved.       │
│  You can continue anytime!          │
│                                     │
│     [Stay]        [Go Home]         │
└─────────────────────────────────────┘
```

### Reset Progress (in Settings)

```
┌─────────────────────────────────────┐
│     ⚠️ Reset ALL Progress?          │
│                                     │
│  This will delete ALL pets, items,  │
│  and progress! Cannot be undone!    │
│                                     │
│     [Cancel]       [Reset]          │
└─────────────────────────────────────┘
```

### Save Model

Primary save model is **auto-save on significant actions**. Manual "Reset / New Save" flows must use clear confirmation UI.

> **Design Intent:** Navigation should feel deliberate. Switching pets or resetting requires confirmation to prevent accidental loss.
```

---

## §14.6 Mobile Layout Constraints [NEW SECTION]

**Location:** Insert after §14.5 Navigation Structure

```markdown
## 14.6 Mobile Layout Constraints [Web 1.0]

### Viewport Rule

On a typical phone viewport (360×640 to 414×896), the following must be visible **without vertical scrolling**:

| Element | Required | Notes |
|---------|----------|-------|
| Pet (main display) | ✅ Yes | Large, centered, 40-50% of viewport height |
| Primary actions | ✅ Yes | Feed button, at least one mini-game entry |
| Global nav | ✅ Yes | Home / Games / Settings accessible |
| Currency display | ✅ Yes | Coins and gems visible |
| Food tray | ✅ Yes | At least 4 food items visible |

### Prohibited in Main View

The following must **NOT** appear in the main scrollable area:

| Element | Where It Belongs |
|---------|------------------|
| Session stats / timers | Behind a drawer or panel |
| Detailed logs | Secondary screen |
| Debug counters | Dev builds only (see §4.4) |
| Extended inventory | Dedicated inventory screen |

### Design Intent

> Grundy is designed for **one-handed, quick check-in** mobile play. If the user has to scroll to see their pet or tap a button, the layout has failed.
>
> Extra dashboards, stats, and logs are welcome — but they must live in **drawers, panels, or secondary screens**, not the main column.
```

---

# PHASE 3: MEDIUM PRIORITY AMENDMENTS (Polish & Documentation)

---

## §7.4 World Intro [ADD FALLBACK]

**Location:** Insert after the Animation Sequence table (after Line 1437)

```markdown
### Animation Sequence

| Time | Action |
|------|--------|
| 0.0s | Screen fades in |
| 0.5s | Line 1 fades in |
| 2.5s | Line 2 fades in |
| 5.0s | Line 3 fades in (emphasized) |
| 6.0s | Continue button appears |
| 10.0s | Auto-advance if no tap |

### Minimum Acceptable Fallback

> If the full staged timing sequence cannot be implemented on a given platform, the **minimum acceptable behavior** is:
>
> 1. Text appears as **one cohesive block** with a smooth fade
> 2. **No stutter or jank** during transitions
> 3. **Copy must remain unchanged** (see Locked Copy below)
>
> The staged fade-in is part of the emotional tone. Implementations should strive for the full sequence, but a graceful fallback is acceptable over a broken animation.

### Locked Copy

The World Intro text is **LOCKED**:

```
Sometimes, when a big feeling is left behind…
A tiny spirit called a Grundy wakes up.
One of them just found *you*.
```

> ⚠️ Do not modify this copy. It is the canonical introduction to the Grundy world.
```

---

## §13.7 Production Art Rule [NEW SECTION]

**Location:** Insert after §13.6 Asset Manifest & State System (after Line 3176)

```markdown
## 13.7 Production Art Rule

> ⚠️ **EMOJI/ORB ARE PLACEHOLDERS ONLY**
>
> | Build Type | Pet Display | Acceptable |
> |------------|-------------|------------|
> | Development/Testing | Colored orb or emoji (🟡🟢🟣) | ✅ Temporary |
> | Production/Release | Full sprites from `assets/pets/<petId>/` | ✅ Required |
> | App Store Build | Complete sprite set for all states | ✅ Mandatory |
>
> **Production builds must use the defined sprite set and display-state system.**
>
> A visual regression test should verify that NO emoji or placeholder orb appears where pet art should display.

### Test Requirement

```typescript
// Production build check
test('no emoji placeholders in production', () => {
  const petDisplay = render(<PetAvatar petId="munchlet" />);
  expect(petDisplay).not.toContainEmoji();
  expect(petDisplay).toHaveSprite('munchlet_idle.png');
});
```
```

---

## §14.4 Environments [ADD PLATFORM NOTE]

**Location:** Insert after the Environments table (after Line 3233)

```markdown
## 14.4 Environments [Web Phase 6+]

**Activity-based backgrounds (Rooms Lite)**

| Activity | Background |
|----------|------------|
| Feeding | Kitchen |
| Sleeping | Bedroom |
| Playing | Playroom |
| Default | Living room + time-of-day |

Not navigable. Context switches automatically based on activity.

### Platform Status Note

> **Web 1.0** ships a simplified version of Rooms Lite:
> - Static living room background
> - Time-of-day tint (morning/day/evening/night)
> - No activity-based room switching yet
>
> Full activity-based switching (Feeding→Kitchen, Sleeping→Bedroom, Playing→Playroom) is required for the "complete" implementation and is targeted for **Web Phase 6+**.
```

---

## §15.6 Known Prototype Gaps [REPLACE TABLE]

**Location:** Replace Lines 3414-3422

```markdown
### Known Prototype Gaps (Updated December 2024)

| Feature | Bible Spec | Web 1.0 Status | Target Phase |
|---------|------------|----------------|--------------|
| Pet Slots (multi-pet) | 1-4 slots | ✅ Implemented | — |
| Mini-Games | 4+ games | ✅ 5 games | — |
| FTUE | Full onboarding | ✅ Implemented | — |
| Audio System | SFX + music | ✅ Implemented | — |
| PWA Support | Installable | ✅ Implemented | — |
| **Feeding cooldown** | 30-min timer | ❌ Not implemented | Phase 6 |
| **Fullness states** | 5 states, STUFFED blocks | ❌ Not implemented | Phase 6 |
| **Navigation** | Menu-based pet select | ❌ Not implemented | Phase 6 |
| **Room switching** | Activity-based | ⚠️ Partial (time-of-day only) | Phase 6 |
| Classic Mode | Full neglect system | ⚠️ Partial | Phase 6+ |
| Shop categories | 4 tabs + event | ⚠️ Basic only | Phase 6+ |
| Season Pass | 30-tier hybrid | ❌ Not implemented | Unity |
| Inventory expansion | 15→35 slots | ❌ Not implemented | Unity |
| Rewarded ads | 6 opportunities | ❌ Not implemented | Unity |

*This table should be updated as the prototype catches up.*

### Critical Gaps (Phase 6 Priority)

The following gaps break core Bible requirements and are the **first priority for Phase 6**:

| Gap | Bible Section | Impact |
|-----|---------------|--------|
| No cooldown | §4.3 | Players can spam-feed, trivializing progression |
| No fullness block | §4.4 | STUFFED state doesn't prevent feeding |
| All pets at top | §14.5 | Violates "deliberate switching" design |
| Home button broken | §14.5 | Navigation dead end |

> **Note:** These are tagged [Web Phase 6+] throughout the Bible. Phase 6.0.1 (the first Phase 6 patch) should prioritize these core loop fixes before other Phase 6 features.
```

---

# APPLICATION CHECKLIST

After applying all amendments:

- [ ] Version updated to 1.4
- [ ] Changelog entry added
- [ ] §1.6 Platform & Phase Tags added
- [ ] §4.3 Cooldown expanded with tuning note
- [ ] §4.4 Dev HUD exception added
- [ ] §4.4 Fullness STUFFED locked rule added
- [ ] §6.1 Evolution thresholds marked locked
- [ ] §7.4 FTUE fallback + locked copy added
- [ ] §8.2 Daily cap (3 plays) added
- [ ] §8.3 No gems invariant strengthened
- [ ] §13.7 Production Art Rule added
- [ ] §14.4 Rooms platform note added
- [ ] §14.5 Navigation Structure added
- [ ] §14.6 Mobile Layout Constraints added
- [ ] §15.6 Prototype Gaps table updated
- [ ] TOC updated with new sections
- [ ] Phase tags applied to relevant sections

---

# SUMMARY OF LOCKED RULES

For quick reference, these rules are now explicitly **LOCKED** in the Bible:

| Rule | Section | Value |
|------|---------|-------|
| Evolution thresholds | §6.1 | Youth=10, Evolved=25 |
| Mini-game daily cap | §8.2 | 3 plays maximum |
| First game free | §8.2 | Always |
| No gems from mini-games | §8.3 | NEVER |
| STUFFED blocks feeding | §4.4 | Mandatory |
| Cooldown must exist | §4.3 | Mandatory (duration tunable) |
| World Intro copy | §7.4 | Locked text |
| Bond visible, stats hidden | §4.4 | Production requirement |

---

**Document Status:** Ready to merge into GRUNDY_MASTER_BIBLE.md  
**Approved By:** Amos  
**Date:** December 2024
