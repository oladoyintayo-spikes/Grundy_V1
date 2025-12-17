# GRUNDY MASTER BIBLE — COMPREHENSIVE PATCH v1.11 (FINAL)

**Patch Version:** 1.11 FINAL  
**Base Version:** v1.10  
**Target Version:** v1.11  
**Author:** CE/Design  
**Date:** December 16, 2025  
**Status:** READY FOR REVIEW

---

## EXECUTIVE SUMMARY

This comprehensive patch updates the Bible from v1.10 to v1.11 with:

| Category | Changes | Lines Added |
|----------|---------|-------------|
| **Mini-Game Reconciliation** | Catalog audit, economy invariants, Pips added | ~120 |
| **Mobile Layout Fixes** | Flex stage, edge-to-edge, sprite scaling | ~80 |
| **Session Mini-Games** | 6 new long-form games + shared systems | ~200 |
| **Phase 12 Features** | Achievements, Login Streak, Mystery Box, Events | ~400 |
| **Notification System** | Unified triggers, in-app center, push (Unity) | ~400 |
| **Misc Updates** | TOC, status tables, cross-references | ~50 |
| **Total** | | **~1,250 lines** |

---

## TABLE OF CONTENTS

1. [Header & Changelog Update](#part-1-header--changelog)
2. [Mini-Game Reconciliation (§8.1)](#part-2-mini-game-reconciliation)
3. [Mobile Layout Fixes (§14.6)](#part-3-mobile-layout-fixes)
4. [Session Mini-Games (§8.5)](#part-4-session-mini-games)
5. [Notification System (§11.6 + §12.5)](#part-5-notification-system)
6. [Achievements System (§17)](#part-6-achievements-system)
7. [Login Streak & Mystery Box (§10.3)](#part-7-login-streak--mystery-box)
8. [Event Framework (§10.7)](#part-8-event-framework)
9. [Season Pass Updates (§11.9)](#part-9-season-pass-updates)
10. [Gap Table & Status Updates (§15.6)](#part-10-status-updates)
11. [TOC Updates](#part-11-toc-updates)

---

# PART 1: HEADER & CHANGELOG

## 1.1 Update Header

**Location:** Lines 1-10

**Replace:**
```markdown
**Version:** 1.10
**Last Updated:** December 14, 2025
```

**With:**
```markdown
**Version:** 1.11
**Last Updated:** December 16, 2025
```

## 1.2 Add Changelog Entry

**Location:** After line 11 (after v1.10 entry)

**Add:**
```markdown
- v1.11: Comprehensive Update — Mini-Games: Added Pips to burst catalog (§8.1); added §8.1.1 Mini-Game Economy Invariants (no gems, daily cap, play-for-fun after cap); added §8.5 Session Games (6 new games: Snake, Tetris, Runner, Bubble Pop, Pet Café, Merge). Mobile Layout: Changed §14.6 pet stage to flex-1; added edge-to-edge container spec; added pet sprite scaling (max-h-[45%], 400px cap). Notifications: Added §11.6.2 Notification Center (in-app history); restructured §11.6.3 as unified Trigger Engine; added §12.5-§12.8 Push Notifications [Unity Later] with explicit platform scope. Phase 12: Added §17 Achievements (25 achievements, 425💎); added §10.3.1 Login Streak Days 1-7; added §10.3.2 Mystery Box; added §10.7 Event Framework. Updated §15.6 status tables.
```

---

# PART 2: MINI-GAME RECONCILIATION

## 2.1 Update §8.0 Mini-Game Design Documents

**Location:** §8.0 (around line 1794)

**Replace entire section with:**

```markdown
## 8.0 Mini-Game Design Documents

Detailed specifications for each mini-game are in `docs/Minigames/`:

### Burst Games (30s - 2 min)

| Game | Design Doc | Duration | Main Skill | Status |
|------|------------|----------|------------|--------|
| Snack Catch | [GRUNDY_SNACK_CATCH_DESIGN.md](minigames/GRUNDY_SNACK_CATCH_DESIGN.md) | 60s | Reflexes | ✅ Implemented |
| Memory Match | [GRUNDY_MEMORY_MATCH_DESIGN.md](minigames/GRUNDY_MEMORY_MATCH_DESIGN.md) | 60-120s | Memory | ✅ Implemented |
| Rhythm Tap | [GRUNDY_RHYTHM_TAP_DESIGN.md](minigames/GRUNDY_RHYTHM_TAP_DESIGN.md) | 45-60s | Timing | ✅ Implemented |
| Poop Scoop | [GRUNDY_POOP_SCOOP_DESIGN.md](minigames/GRUNDY_POOP_SCOOP_DESIGN.md) | 60s | Speed | ✅ Implemented |
| Pips | [GRUNDY_PIPS_DESIGN.md](minigames/GRUNDY_PIPS_DESIGN.md) | 30-60s | Strategy | ✅ Implemented |

### Session Games (5 - 15+ min) [Phase 13+]

| Game | Design Doc | Duration | Main Skill | Status |
|------|------------|----------|------------|--------|
| Hungry Hungry Grundy | [GRUNDY_SNAKE_DESIGN.md](minigames/GRUNDY_SNAKE_DESIGN.md) | 5-15 min | Reflexes | 🔲 Phase 13 |
| Stack Snacks | [GRUNDY_STACK_SNACKS_DESIGN.md](minigames/GRUNDY_STACK_SNACKS_DESIGN.md) | 5-20 min | Spatial | 🔲 Phase 13 |
| Munch Run | [GRUNDY_MUNCH_RUN_DESIGN.md](minigames/GRUNDY_MUNCH_RUN_DESIGN.md) | 5-15 min | Reflexes | 🔲 Phase 13 |
| Bubble Pop Kitchen | [GRUNDY_BUBBLE_POP_DESIGN.md](minigames/GRUNDY_BUBBLE_POP_DESIGN.md) | 5-15 min | Aim | 🔲 Future |
| Pet Café | [GRUNDY_PET_CAFE_DESIGN.md](minigames/GRUNDY_PET_CAFE_DESIGN.md) | 5-15 min | Speed | 🔲 Future |
| Grundy Garden | [GRUNDY_GARDEN_DESIGN.md](minigames/GRUNDY_GARDEN_DESIGN.md) | 5-30+ min | Strategy | 🔲 Future |

Each design doc includes:
- Complete gameplay rules
- All 8 pet abilities (where applicable)
- Reward tiers (Bronze/Silver/Gold/Rainbow)
- Technical state interfaces
- Animation & sound specs
- Test cases

**See individual design docs for implementation details.**

> **Catalog Policy:** This list is extendable. New games may be added as long as they comply with §8.1.1 Mini-Game Economy Invariants.
```

## 2.2 Update §8.1 Overview

**Location:** §8.1 Overview (around line 1815)

**Replace with:**

```markdown
## 8.1 Overview

### Game Categories

| Category | Duration | Purpose | Examples |
|----------|----------|---------|----------|
| **Burst Games** | 30s - 2 min | Quick dopamine hits | Snack Catch, Memory Match, Rhythm Tap, Poop Scoop, Pips |
| **Session Games** | 5 - 15+ min | Fill cooldown time | Snake, Tetris, Runner, Bubble Pop, Pet Café, Merge |

### Universal Rules (All Games)

- All games cost **10 energy** to play
- Rewards scale with active pet level (+1% per level)
- Fizz gets +25% rewards on ALL mini-games
- Daily high scores tracked
- First daily game is FREE (costs 0 energy)
```

## 2.3 Add §8.1.1 Mini-Game Economy Invariants (NEW)

**Location:** After §8.1 Overview

**Add new subsection:**

```markdown
### 8.1.1 Mini-Game Economy Invariants

> ⚠️ **LOCKED DESIGN — APPLIES TO ALL GAMES (BURST + SESSION)**
>
> These invariants are non-negotiable and apply to every mini-game, current and future. They exist to prevent farming, preserve session rhythm, and maintain ethical monetization.

| Invariant | Value | Rationale |
|-----------|-------|-----------|
| **Gems awarded** | ❌ NEVER | Gems are premium currency; mini-games must not devalue them |
| **Daily rewarded plays** | 3 maximum | Preserves "check-in" session design |
| **First daily play** | FREE (0 energy) | Encourages daily engagement |
| **Energy cost** | 10 per play | Consistent across all games |
| **After daily cap** | ✅ Playable for fun | 0 coins, 0 XP, 0 food rewards |

#### "Play for Fun" Mode

After the daily rewarded cap (3 plays):
- Games **remain fully playable**
- Gameplay is identical (no artificial handicaps)
- High scores still track (bragging rights)
- **Zero rewards** (coins, XP, food)
- Energy still consumed (regenerates normally)

**Design Intent:** Players who love a game can keep playing. Players who want rewards come back tomorrow. No farming, no guilt.

#### Gem Income Sources (Reminder)

Mini-games are explicitly excluded from gem income. Per §11.4, gems come from:
- Level-up rewards
- Daily login streaks
- Achievements
- Special events
- Purchases

**Do not add gem rewards to any mini-game tier, including Rainbow, including future games.**

#### Adding New Games

New mini-games may be added to the catalog if they:
1. Comply with all invariants above
2. Have a complete design doc in `docs/Minigames/`
3. Are added to the §8.0 catalog table
4. Have BCT tests for economy compliance

> **The list is extendable; the rules are not.**
```

## 2.4 Update §8.2 Energy System

**Location:** §8.2 Energy System (around line 1832)

**Update to:**

```markdown
## 8.2 Energy System [Web 1.0]

| Attribute | Value |
|-----------|-------|
| Maximum | 50 (75 with Grundy Plus) |
| Cost per game | 10 |
| Regeneration | 1 per 30 minutes |
| First daily game | FREE (0 energy cost) |
| **Daily rewarded cap** | **3 plays** |
| **After cap** | **Playable for fun (0 rewards)** |

> ⚠️ **LOCKED RULES (see §8.1.1):**
> - Daily cap of **3 rewarded plays** is a design constraint
> - After cap, games remain playable but award **nothing**
> - First game each day is **always free**
> - These rules apply to **all games** (burst + session)
>
> Do not increase daily cap, add gem rewards, or remove energy costs without explicit approval.
```

## 2.5 Update §8.3 Reward Tiers

**Location:** §8.3 Reward Tiers (around line 1864)

**Update the locked invariant box:**

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
> Mini-games **NEVER** award gems — including Rainbow tier, including Session games, including future games. This is locked per §8.1.1.

### Rewards After Daily Cap

| Tier | Coins | XP | Food |
|------|-------|-----|------|
| Any | 0 | 0 | None |

After 3 rewarded plays, all tiers award nothing. Gameplay continues normally for fun/practice.
```

---

# PART 3: MOBILE LAYOUT FIXES

## 3.1 Update §14.6 Viewport Rule

**Location:** §14.6 Mobile Layout Constraints (around line 4651)

**Find and replace the Viewport Rule table row:**

**Before:**
```markdown
| Pet (main display) | ✅ Yes | Large, centered, 40-50% of viewport height |
```

**After:**
```markdown
| Pet (main display) | ✅ Yes | Large, centered; stage uses `flex-1` to fill space; pet sprite uses `max-h-[45%]` of stage |
```

## 3.2 Add Stage Container Styling Subsection

**Location:** After "Food Drawer Clarification" subsection in §14.6

**Add:**

```markdown
### Stage Container Styling

The pet stage container must render **edge-to-edge** without card-style chrome:

| Property | Required Value | Rationale |
|----------|----------------|-----------|
| Horizontal margins | `0` (none) | Stage spans full viewport width |
| Border radius | `0` (none) | No rounded corners on stage |
| Box shadow | `none` | No floating card appearance |
| Bottom margin | `0` | Stage sits flush against Action Bar |
| Background | TOD gradient (§14.4) | Seamless with time-of-day theming |

**Prohibited Styling:**
- `mx-4` or any horizontal margin classes
- `rounded-*` classes on stage container
- `shadow-*` classes on stage container
- `mb-*` gap between stage and Action Bar

**Allowed Overlays:**
- Poop indicator (positioned within stage)
- Cooldown banner (overlays stage, does not add margin)
- Status badges (positioned within stage)

> **Design Intent:** The stage should feel immersive, not like a card floating in a shell. The pet lives in the environment, edge to edge.
```

## 3.3 Add Pet Sprite Sizing Subsection

**Location:** After "Stage Container Styling" subsection

**Add:**

```markdown
### Pet Sprite Sizing

The pet sprite must scale responsively within the stage:

| Property | Value | Rationale |
|----------|-------|-----------|
| Max height | `45%` of stage height | Pet dominates stage without overflow |
| Max width | `80%` of stage width | Horizontal breathing room for effects |
| Desktop cap | `400px` max height | Prevents oversized pets on wide screens |
| Effect padding | `1rem` (16px) around sprite | Space for particles, reactions, cosmetics |

**Tailwind Implementation:**
```css
class="max-h-[45%] max-w-[80%] lg:max-h-[400px]"
```

**Scaling Behavior:**
- Small phones (360×640): Pet fills ~45% of stage vertically
- Large phones (414×896): Pet fills ~45% of stage vertically  
- Tablets/desktop: Pet caps at 400px height

> **Design Intent:** The pet should be the visual hero — large enough to see expressions and cosmetics, but not so large that effects clip or the stage feels cramped.
```

---

# PART 4: SESSION MINI-GAMES

## 4.1 Add §8.5 Session Mini-Games

**Location:** After §8.4 (Snack Catch section, around line 1910)

**Add new section:**

```markdown
## 8.5 Session Mini-Games [Phase 13+]

Session games provide longer play sessions (5-15+ minutes) for players waiting on feed cooldowns.

### 8.5.1 Session vs Burst Games

| Category | Duration | Energy | Reward Ceiling | Purpose |
|----------|----------|--------|----------------|---------|
| **Burst** | 30s - 2 min | 10 | Standard tiers | Quick engagement |
| **Session** | 5 - 15+ min | 10 | Higher score potential | Fill cooldown time |

**Key Difference:** Session games have the same energy cost but allow higher scores (and thus higher tier rewards) due to longer play time.

### 8.5.2 Session Game Rules

All rules from §8.1.1 Mini-Game Economy Invariants apply:

| Rule | Value | Notes |
|------|-------|-------|
| Energy cost | 10 (same as burst) | Don't penalize longer play |
| Daily cap | Shared (3 rewarded total) | Burst + Session share the cap |
| After cap | Play for fun (0 rewards) | Per §8.1.1 |
| **Gems** | ❌ NEVER | Per §8.1.1 — locked invariant |
| Pause | ✅ Allowed | Respect player time |
| Resume on app close | ❌ No | Prevents exploitation |

### 8.5.3 Session Game Catalog

| Priority | Game | Type | Duration | Design Doc | Status |
|----------|------|------|----------|------------|--------|
| P1 | Hungry Hungry Grundy | Snake | 5-15 min | [GRUNDY_SNAKE_DESIGN.md](minigames/GRUNDY_SNAKE_DESIGN.md) | 🔲 Phase 13 |
| P2 | Stack Snacks | Tetris | 5-20 min | [GRUNDY_STACK_SNACKS_DESIGN.md](minigames/GRUNDY_STACK_SNACKS_DESIGN.md) | 🔲 Phase 13 |
| P3 | Munch Run | Runner | 5-15 min | [GRUNDY_MUNCH_RUN_DESIGN.md](minigames/GRUNDY_MUNCH_RUN_DESIGN.md) | 🔲 Phase 13 |
| P4 | Bubble Pop Kitchen | Bubble | 5-15 min | [GRUNDY_BUBBLE_POP_DESIGN.md](minigames/GRUNDY_BUBBLE_POP_DESIGN.md) | 🔲 Future |
| P5 | Pet Café | Diner | 5-15 min | [GRUNDY_PET_CAFE_DESIGN.md](minigames/GRUNDY_PET_CAFE_DESIGN.md) | 🔲 Future |
| P6 | Grundy Garden | Merge | 5-30+ min | [GRUNDY_GARDEN_DESIGN.md](minigames/GRUNDY_GARDEN_DESIGN.md) | 🔲 Future |

> **See individual design documents for complete specifications.**

### 8.5.4 Session Game Reward Tiers

Session games use score-based tiers with higher thresholds:

| Tier | Coins | XP | Score Threshold |
|------|-------|-----|-----------------|
| Bronze | 5 🪙 | 10 | Game-specific |
| Silver | 15 🪙 | 20 | Game-specific |
| Gold | 30 🪙 | 35 | Game-specific |
| Platinum | 50 🪙 | 50 | Game-specific |
| Diamond | 75 🪙 | 75 | Game-specific |

> Score thresholds vary by game. See individual design docs for specific values.

### 8.5.5 Shared Session Game Systems

#### Pause System

| Trigger | Behavior |
|---------|----------|
| Pause button | Game pauses, overlay shown |
| App backgrounded | Auto-pause |
| App closed | Game ends (no resume) |
| Phone call | Auto-pause |

#### High Score Tracking

| Stat | Scope | Persistence |
|------|-------|-------------|
| Personal best | Per player, per game | Permanent |
| Today's best | Per player, per game | Resets midnight local |

#### Tutorial System

| Element | Behavior |
|---------|----------|
| First play | Mandatory tutorial |
| Skip option | After first completion |
| Help button | Re-show tutorial anytime |

#### Difficulty Scaling

| Phase | Timing | Effect |
|-------|--------|--------|
| Easy | 0-2 min | Learning curve |
| Medium | 2-5 min | Standard play |
| Hard | 5-10 min | Challenge zone |
| Expert | 10+ min | Maximum difficulty |
```

---

# PART 5: NOTIFICATION SYSTEM

## 5.1 Add Platform Scope to §11.6

**Location:** Before §11.6.1 Multi-Pet Notifications

**Add new preamble:**

```markdown
## 11.6 Notifications

> ⚠️ **PLATFORM SCOPE**
>
> | Platform | In-App (Toasts/Badges) | Notification Center | OS Push | App Icon Badge |
> |----------|------------------------|---------------------|---------|----------------|
> | **Web** | ✅ Yes (§11.6.1-11.6.3) | ✅ Yes (§11.6.2) | ❌ No | ❌ No |
> | **Unity** | ✅ Yes | ✅ Yes | ✅ Yes (§12.5) | ✅ Yes (§12.6) |
>
> **Web Edition** uses in-app notifications only. OS push notifications and app icon badges are **[Unity Later]** features.
```

## 5.2 Update §11.6.1 Multi-Pet Notifications

**Location:** §11.6.1 (around line 3652)

**Keep existing content but update the Web Implementation note:**

**Find:**
```markdown
**Web Implementation (Phase 9-B):**
- In-app toasts and badges only
- No push notifications (Web lacks reliable push infra)
- Settings badge shows if any pet needs attention
```

**Replace with:**
```markdown
**Web Implementation:**
- In-app toasts and badges only (per platform scope above)
- Notification Center for history (§11.6.2)
- Settings badge shows if any pet needs attention
- Deep links supported (same targets as Unity push)

**For Unity push notifications, see §12.5.**
```

## 5.3 Add §11.6.2 Notification Center (NEW)

**Location:** After §11.6.1

**Add new subsection:**

```markdown
### 11.6.2 Notification Center [Web Phase 12+]

The Notification Center provides a durable "what did I miss?" history for in-app alerts.

#### Access

- **Location:** Bell icon (🔔) in header
- **Badge:** Shows count of unread notifications
- **Tap:** Opens Notification Center overlay

#### UI Layout

```
┌─────────────────────────────────────┐
│  🔔 Notifications              [X]  │
├─────────────────────────────────────┤
│                                     │
│  ● Munchlet is hungry!         2h   │
│    Hunger dropped below 30          │
│                                     │
│  ● Energy full!                5h   │
│    Ready to play mini-games         │
│                                     │
│  ○ Daily reward claimed        1d   │
│    Day 4 streak: Energy refill      │
│                                     │
│  ○ Whisp leveled up!           2d   │
│    Now Level 12                     │
│                                     │
│           [Mark All Read]           │
│                                     │
└─────────────────────────────────────┘

● = Unread    ○ = Read
```

#### Notification Types Logged

| Type | Logged? | Example |
|------|---------|---------|
| Neglect stage changes | ✅ Yes | "Munchlet became Worried" |
| Hunger critical | ✅ Yes | "Munchlet is hungry!" |
| Sickness onset (Classic) | ✅ Yes | "Whisp is sick!" |
| Runaway | ✅ Yes | "Grib has gone into hiding" |
| Level up | ✅ Yes | "Munchlet reached Level 10!" |
| Evolution ready | ✅ Yes | "Whisp is ready to evolve!" |
| Achievement unlocked | ✅ Yes | "Achievement: Snack Master" |
| Daily reward available | ✅ Yes | "Daily reward ready!" |
| Energy full | ✅ Yes | "Energy full!" |
| Event start/end | ✅ Yes | "Winter Wonderland started!" |

#### Rules

| Rule | Value |
|------|-------|
| Max stored | 50 notifications |
| Overflow behavior | Oldest deleted |
| Persistence | Saved to local storage |
| Clear on read | Badge decrements |
| "Mark All Read" | Clears badge to 0 |
| Tap notification | Deep links to relevant screen |

#### Deep Link Targets

| Notification Type | Opens To |
|-------------------|----------|
| Hunger/Feeding | Home (pet view) |
| Neglect warning | Home (pet view) |
| Sickness | Home (pet view) |
| Runaway | Home (pet view) |
| Level up | Home (pet view) |
| Evolution ready | Evolution screen |
| Achievement | Achievements screen |
| Daily reward | Login rewards screen |
| Energy full | Mini-Games hub |
| Event | Event hub |

> **Design Intent:** Players returning after time away can quickly see what happened and take action. The Notification Center complements toasts (ephemeral) with history (persistent).
```

## 5.4 Add §11.6.3 Notification Trigger Engine (NEW)

**Location:** After §11.6.2

**Add new subsection:**

```markdown
### 11.6.3 Notification Trigger Engine

> **One trigger engine, two delivery mechanisms.**
>
> The same trigger logic powers both in-app notifications (Web + Unity) and OS push (Unity only). This ensures consistent behavior across platforms.

#### Trigger Definitions

##### Care Triggers (Both Modes)

| Trigger ID | Condition | Delay | Message | Urgency |
|------------|-----------|-------|---------|---------|
| `FEED_REMINDER` | Cooldown done + Hunger < 70 | 30 min | "🍎 {Pet} is getting hungry!" | Normal |
| `HUNGRY` | Hunger < 30 | Immediate | "😟 {Pet} is really hungry!" | High |
| `STARVING` | Hunger = 0 | 15 min | "⚠️ {Pet} hasn't eaten in a while!" | Urgent |
| `ENERGY_FULL` | Energy = Max | Immediate | "⚡ Energy full! Ready to play?" | Low |

##### Neglect Triggers (Classic Mode Only)

| Trigger ID | Days Absent | Message | Urgency |
|------------|-------------|---------|---------|
| `NEGLECT_WORRIED` | 2 | "💭 {Pet} is wondering where you are..." | Normal |
| `NEGLECT_SAD` | 4 | "💔 {Pet} really misses you!" | High |
| `NEGLECT_PRE_WITHDRAWN` | 6 | "⚠️ {Pet} needs you soon!" | Urgent |
| `NEGLECT_WITHDRAWN` | 7 | "😔 {Pet} has become withdrawn." | Urgent |
| `NEGLECT_CRITICAL` | 10 | "🚨 {Pet} may go into hiding soon!" | Critical |
| `NEGLECT_PRE_RUNAWAY` | 13 | "🚨 Last chance! {Pet} will hide tomorrow!" | Critical |

##### Positive Triggers (Both Modes)

| Trigger ID | Condition | Message | Urgency |
|------------|-----------|---------|---------|
| `STREAK` | Login streak continues | "🔥 Day {N} streak!" | Low |
| `LEVEL_UP` | Pet levels up | "🎉 {Pet} reached Level {N}!" | Normal |
| `EVOLUTION_READY` | At evolution threshold | "✨ {Pet} is ready to evolve!" | High |
| `ACHIEVEMENT` | Achievement unlocked | "🏆 Achievement: {Name}!" | Normal |

##### Event Triggers (Both Modes)

| Trigger ID | Condition | Message | Urgency |
|------------|-----------|---------|---------|
| `EVENT_START` | New event begins | "🎪 {Event} has started!" | Normal |
| `EVENT_ENDING` | 24h before end | "⏰ {Event} ends tomorrow!" | High |
| `DAILY_REWARD` | Daily reward available | "🎁 Daily reward ready!" | Low |

#### Delivery Mechanisms

| Mechanism | Platform | Behavior |
|-----------|----------|----------|
| **In-App Toast** | Web + Unity | Ephemeral popup (4s), tap to dismiss or act |
| **In-App Badge** | Web + Unity | Pet icon badge, header badge, Notification Center |
| **Notification Center** | Web + Unity | Persistent history, deep links |
| **OS Push** | Unity only | System notification, quiet hours apply |
| **App Icon Badge** | Unity only | Home screen badge count |

#### Scheduling Rules (All Platforms)

| Rule | Value | Applies To |
|------|-------|------------|
| Daily cap | 3 notifications | OS Push only |
| Minimum gap | 2 hours | OS Push only |
| Batch on return | ✅ Yes | In-App + Push |
| Quiet hours | 10 PM - 8 AM local | OS Push only |
| Cooldown per trigger | 30 min | All mechanisms |

#### Multi-Pet Routing

| Scenario | In-App | OS Push |
|----------|--------|---------|
| 1 pet needs attention | Names that pet | Names that pet |
| 2+ pets need attention | Batched summary | "Your pets need you!" |
| Mix of urgencies | Highest first | Highest urgency |

#### Cozy Mode Adjustments

| Trigger | Cozy Mode Behavior |
|---------|-------------------|
| `NEGLECT_*` | **Disabled** (neglect doesn't exist) |
| `SICK_*` | **Disabled** (sickness doesn't exist) |
| `FEED_REMINDER` | Reduced urgency (Low) |
| `STARVING` | Gentler: "Your pet would love a snack!" |
```

## 5.5 Add §12.5 Push Notifications [Unity Later]

**Location:** New section after §12.4 Audio Settings

**Add:**

```markdown
## §12.5 Push Notifications [Unity Later]

> ⚠️ **PLATFORM SCOPE: UNITY ONLY**
>
> This section (§12.5–§12.8) describes OS-level push notifications for **Unity/mobile builds only**.
>
> **Web Edition does NOT support push notifications.** Web uses in-app notifications per §11.6.
>
> Do not implement push infrastructure for Web.

### 12.5.1 Overview

Push notifications remind players to care for their pets via OS-level alerts (iOS/Android notification center).

| Attribute | Value |
|-----------|-------|
| Trigger source | §11.6.3 Notification Trigger Engine |
| Daily cap | 3 push notifications max |
| Quiet hours | 10 PM - 8 AM (local time) |
| Permission | Required (user opt-in) |

### 12.5.2 Push Notification Content

#### Format

```
Title: Grundy (or pet name)
Body: {Emoji} {Message from trigger}
Action: Tap → Deep link per §11.6.2
```

#### Examples

```
┌─────────────────────────────────────┐
│ 🍎 Munchlet                         │
│ Time for a snack! Your pet is       │
│ getting hungry.                      │
│                              2m ago  │
└─────────────────────────────────────┘
```

```
┌─────────────────────────────────────┐
│ 😔 Grundy                           │
│ Whisp has become withdrawn. They    │
│ need extra love.                    │
│                             15m ago  │
└─────────────────────────────────────┘
```

### 12.5.3 Scheduling Rules

| Rule | Value | Rationale |
|------|-------|-----------|
| Quiet hours | 10 PM - 8 AM (local) | Respect sleep |
| Daily cap | 3 push max | Prevent spam |
| Minimum gap | 2 hours between pushes | Prevent clustering |
| Queue during quiet | ✅ Yes (max 2 queued) | Deliver at 8:01 AM |

### 12.5.4 Sound & Vibration

| Urgency | Sound | Vibration |
|---------|-------|-----------|
| Low | Silent | None |
| Normal | Default system | Short (100ms) |
| High | Custom chime | Medium (200ms) |
| Urgent | Alert chime | Long (400ms) |
| Critical | Urgent tone | Pattern: 200-100-200ms |

### 12.5.5 Permission Flow

#### First Launch

```
┌─────────────────────────────────────┐
│      🔔 Stay Connected!             │
│                                     │
│   Would you like notifications      │
│   when your pet needs you?          │
│                                     │
│   We'll only send important         │
│   reminders, never spam.            │
│                                     │
│      [Not Now]    [Allow]           │
└─────────────────────────────────────┘
```

#### Rules

- Never block gameplay for permission
- Soft re-prompt after 7 days if declined
- Settings shows toggle to enable/disable
```

## 5.6 Add §12.6 App Icon Badge [Unity Later]

**Location:** After §12.5

**Add:**

```markdown
## §12.6 App Icon Badge [Unity Later]

> **Unity Only.** Web does not support app icon badges.

### 12.6.1 Badge Count Calculation

| Condition | Badge +1 | Clears When |
|-----------|----------|-------------|
| Pet hungry (Hunger < 30) | Per pet | Fed |
| Pet sick (Classic) | Per pet | Cured |
| Pet withdrawn | Per pet | Recovered |
| Pet runaway | Per pet | Returned |
| Unclaimed daily reward | +1 | Claimed |
| Pending evolution | Per pet | Evolved |
| Unread achievement | Per achievement | Viewed |

### 12.6.2 Badge Behavior

| Event | Badge Update |
|-------|--------------|
| App backgrounded | Schedule update |
| Push fires | Update count |
| App opened | Clear to 0 |

### 12.6.3 Badge Display

| Count | Display |
|-------|---------|
| 0 | Hidden |
| 1-9 | Number |
| 10+ | "9+" |
```

## 5.7 Add §12.7 Notification Channels [Unity Later]

**Location:** After §12.6

**Add:**

```markdown
## §12.7 Notification Channels [Unity Later]

> **Android 8+ Only.** iOS uses categories instead.

### 12.7.1 Channel Definitions

| Channel ID | Name | Default | Sound |
|------------|------|---------|-------|
| `care_reminders` | Care Reminders | ON | Default |
| `neglect_warnings` | Neglect Warnings | ON | Alert |
| `events` | Events & Rewards | ON | Default |
| `milestones` | Milestones | ON | Celebration |

### 12.7.2 iOS Categories

| Category | Actions |
|----------|---------|
| `CARE` | "Feed Now" |
| `NEGLECT` | "Visit Pet" |
| `EVENT` | "See Event" |
| `MILESTONE` | "Celebrate!" |
```

## 5.8 Add §12.8 Notification Settings [Unity Later]

**Location:** After §12.7

**Add:**

```markdown
## §12.8 Notification Settings [Unity Later]

### 12.8.1 Settings UI

```
┌─────────────────────────────────────┐
│          Notifications              │
├─────────────────────────────────────┤
│  Push Notifications     [  ON  ]    │
│  ─────────────────────────────────  │
│  Care Reminders         [  ON  ]    │
│  Neglect Warnings       [  ON  ]    │
│  Events & Rewards       [  ON  ]    │
│  Milestones             [  ON  ]    │
│  ─────────────────────────────────  │
│  Quiet Hours            [  ON  ]    │
│  10:00 PM - 8:00 AM                 │
│  [Customize Times]                  │
└─────────────────────────────────────┘
```

### 12.8.2 Defaults

| Setting | Default |
|---------|---------|
| Push Notifications | ON |
| Care Reminders | ON |
| Neglect Warnings | ON (hidden in Cozy) |
| Events & Rewards | ON |
| Milestones | ON |
| Quiet Hours | ON, 10PM-8AM |
```

---

# PART 6: ACHIEVEMENTS SYSTEM

## 6.1 Add §17 Achievements System

**Location:** New section after §16 (Coverage Notes)

**Add:**

```markdown
---

# 17. ACHIEVEMENTS SYSTEM [Phase 12-A]

## 17.1 Overview

Achievements reward players for milestones and exploration, providing gem income for free players.

| Attribute | Value |
|-----------|-------|
| Total achievements | 25 |
| Total gem rewards | 425 💎 |
| Categories | 5 |

## 17.2 Achievement Categories

### 17.2.1 Feeding Achievements (5 achievements, 75💎)

| ID | Name | Requirement | Reward |
|----|------|-------------|--------|
| ACH_FEED_001 | First Bite | Feed your pet once | 5 💎 |
| ACH_FEED_002 | Snack Master | Feed 50 times | 10 💎 |
| ACH_FEED_003 | Gourmet | Feed 250 times | 15 💎 |
| ACH_FEED_004 | Master Chef | Feed 1,000 times | 20 💎 |
| ACH_FEED_005 | Legendary Feeder | Feed 5,000 times | 25 💎 |

### 17.2.2 Bond Achievements (5 achievements, 75💎)

| ID | Name | Requirement | Reward |
|----|------|-------------|--------|
| ACH_BOND_001 | New Friend | Bond Level 1 | 5 💎 |
| ACH_BOND_002 | Good Friends | Bond Level 5 | 10 💎 |
| ACH_BOND_003 | Best Friends | Bond Level 10 | 15 💎 |
| ACH_BOND_004 | Soulmates | Bond Level 15 | 20 💎 |
| ACH_BOND_005 | Eternal Bond | Bond Level 20 | 25 💎 |

### 17.2.3 Collection Achievements (5 achievements, 75💎)

| ID | Name | Requirement | Reward |
|----|------|-------------|--------|
| ACH_COLL_001 | Pet Owner | Own first pet | 5 💎 |
| ACH_COLL_002 | Pet Collector | Own 3 pets | 10 💎 |
| ACH_COLL_003 | Pet Enthusiast | Own 5 pets | 15 💎 |
| ACH_COLL_004 | Pet Master | Own all 8 pets | 20 💎 |
| ACH_COLL_005 | Fashion Forward | Own 10 cosmetics | 25 💎 |

### 17.2.4 Mini-Game Achievements (5 achievements, 100💎)

| ID | Name | Requirement | Reward |
|----|------|-------------|--------|
| ACH_GAME_001 | First Play | Complete any game | 5 💎 |
| ACH_GAME_002 | Game Lover | Complete 25 games | 15 💎 |
| ACH_GAME_003 | Game Expert | Complete 100 games | 20 💎 |
| ACH_GAME_004 | Gold Standard | Gold in all 5 burst games | 25 💎 |
| ACH_GAME_005 | Rainbow Chaser | Rainbow tier in any game | 35 💎 |

### 17.2.5 Journey Achievements (5 achievements, 100💎)

| ID | Name | Requirement | Reward |
|----|------|-------------|--------|
| ACH_JOUR_001 | Day One | First login | 5 💎 |
| ACH_JOUR_002 | Weekly Warrior | 7-day login streak | 15 💎 |
| ACH_JOUR_003 | Monthly Master | 30-day login streak | 25 💎 |
| ACH_JOUR_004 | Evolution! | Evolve any pet | 25 💎 |
| ACH_JOUR_005 | Rare Form | Achieve Rare Form evolution | 30 💎 |

## 17.3 Achievement UI

### Toast (On Unlock)

```
┌─────────────────────────────────────┐
│  🏆 ACHIEVEMENT UNLOCKED!           │
│  "Snack Master"                     │
│  Reward: +10 💎                     │
└─────────────────────────────────────┘
```

### Achievements Screen

```
┌─────────────────────────────────────┐
│  🏆 Achievements      15/25         │
├─────────────────────────────────────┤
│  FEEDING                    3/5     │
│  ├─ ✅ First Bite           5💎     │
│  ├─ ✅ Snack Master        10💎     │
│  ├─ ✅ Gourmet             15💎     │
│  ├─ 🔒 Master Chef         20💎     │
│  │     847/1,000 feeds              │
│  └─ 🔒 Legendary Feeder    25💎     │
│                                     │
│  BOND                       2/5     │
│  ...                                │
└─────────────────────────────────────┘
```

## 17.4 Achievement Rules

| Rule | Value |
|------|-------|
| Retroactive | ✅ Yes |
| Multi-pet | Aggregates across all pets |
| Gem delivery | Instant on unlock |
| Notification | Toast + Notification Center |
```

---

# PART 7: LOGIN STREAK & MYSTERY BOX

## 7.1 Add §10.3.1 Daily Login Streak

**Location:** After §10.3 Login Rewards

**Add:**

```markdown
### §10.3.1 Daily Login Streak [Phase 12-B]

#### Days 1-7 Rewards

| Day | Reward | Value |
|-----|--------|-------|
| 1 | Coins | 50 🪙 |
| 2 | Common Food Bundle | 3× random common |
| 3 | Coins | 75 🪙 |
| 4 | Energy Refill | Full restore |
| 5 | Coins | 100 🪙 |
| 6 | Uncommon Food | 1× random uncommon |
| **7** | **Mystery Box** | See §10.3.2 |

#### Streak Rules

| Rule | Value |
|------|-------|
| Reset time | Midnight local |
| Grace period | None |
| After Day 7 | Resets to Day 1 |

#### Streak UI

```
┌─────────────────────────────────────┐
│        🔥 Login Streak: Day 4       │
├─────────────────────────────────────┤
│  [✅] [✅] [✅] [⭐] [ ] [ ] [🎁]   │
│   1    2    3    4   5   6   7      │
│                                     │
│  Today's Reward: ⚡ Energy Refill   │
│         [Claim Reward]              │
└─────────────────────────────────────┘
```
```

## 7.2 Add §10.3.2 Mystery Box

**Location:** After §10.3.1

**Add:**

```markdown
### §10.3.2 Mystery Box [Phase 12-B]

The Day 7 login streak reward.

#### Loot Table

| Outcome | Weight | Contents |
|---------|--------|----------|
| Coins | 40% | 150-300 🪙 |
| Rare Food | 30% | 2× random rare |
| Cosmetic | 20% | 1× random common cosmetic |
| Gems | 10% | 15-25 💎 |

#### Rules

| Rule | Value |
|------|-------|
| Guaranteed | ✅ Always gives something |
| Duplicate cosmetics | Convert to 10💎 |
| Animation | Box shake → open → reveal |

#### UI

```
┌─────────────────────────────────────┐
│            🎁                       │
│         Mystery Box                 │
│    "What's inside? Tap to open!"    │
│          [Open Box]                 │
└─────────────────────────────────────┘

         ↓ Opens to ↓

┌─────────────────────────────────────┐
│            ✨🎉✨                    │
│      You received:                  │
│         💎 20 Gems!                 │
│          [Collect]                  │
└─────────────────────────────────────┘
```
```

---

# PART 8: EVENT FRAMEWORK

## 8.1 Add §10.7 Event Framework

**Location:** New section in §10

**Add:**

```markdown
## §10.7 Event Framework [Phase 12-D]

Events are time-limited content with special themes and rewards.

### 10.7.1 Event Structure

| Component | Description |
|-----------|-------------|
| Duration | 7-14 days |
| Currency | Event-specific (expires at end) |
| Shop | Exclusive items |
| Goals | Optional objectives |

### 10.7.2 Event Currency

| Rule | Value |
|------|-------|
| Cap | 9,999 per event |
| Earn methods | Games, feeding, login |
| **Expiry** | **Hard delete at event end** |

### 10.7.3 Event Shop

| Item Type | Price Range |
|-----------|-------------|
| Event cosmetics | 100-500 tokens |
| Event food | 25-100 tokens |
| Coins | 10 tokens = 50🪙 |

### 10.7.4 Test Event: Winter Wonderland

| Attribute | Value |
|-----------|-------|
| Duration | 14 days |
| Currency | ❄️ Snowflakes |

**Earning:**
| Activity | Snowflakes |
|----------|------------|
| Daily login | 25 ❄️ |
| Feed pet | 5 ❄️ |
| Mini-game | 15 ❄️ |
| Gold tier | +10 ❄️ bonus |

**Shop:**
| Item | Price |
|------|-------|
| 🎅 Santa Hat | 300 ❄️ |
| ⛄ Snowman Buddy | 400 ❄️ |
| 🎄 Holiday Sweater | 500 ❄️ |
| ❄️ Frost Aura | 350 ❄️ |
| 100 Coins | 50 ❄️ |
```

---

# PART 9: SEASON PASS UPDATES

## 9.1 Update §11.9 Season Pass

**Location:** §11.9

**Add implementation split:**

```markdown
### §11.9.1 Implementation Split

| Component | Platform | Status |
|-----------|----------|--------|
| Free Track | Web [Phase 12-C] | 🔲 Not started |
| Premium Track | Unity [Later] | 🔲 Not started |
| Premium Purchase | Unity [Later] | 🔲 Not started |

**Web:** Free Track only (no premium purchase)
**Unity:** Full pass with Free + Premium tracks
```

---

# PART 10: STATUS UPDATES

## 10.1 Update §15.6 Feature Status

**Location:** §15.6

**Update table:**

```markdown
### Current Feature Status (December 2025)

| Feature | Status | Phase |
|---------|--------|-------|
| Feeding + Reactions | ✅ Implemented | — |
| Cooldown System | ✅ Implemented | P6 |
| Mini-Games (Burst) | ✅ Implemented | — |
| Shop + Inventory | ✅ Implemented | P8 |
| Pet Slots | ✅ Implemented | P9 |
| Weight + Sickness | ✅ Implemented | P10 |
| Gem Sources | ✅ Implemented | P11-0 |
| Cosmetics | ✅ Implemented | P11 |
| **Achievements** | 🔲 Spec ready | **P12-A** |
| **Login Streak + Mystery Box** | 🔲 Spec ready | **P12-B** |
| **Season Pass Free** | 🔲 Spec ready | **P12-C** |
| **Event Framework** | 🔲 Spec ready | **P12-D** |
| **Session Mini-Games** | 🔲 Spec ready | **P13** |
| **Notification Center** | 🔲 Spec ready | **P12** |
| Push Notifications | 🔲 Spec ready | [Unity Later] |
```

## 10.2 Update Phase Numbering

**Location:** §15.6 Phase Numbering

**Update:**

```markdown
### Phase Numbering (December 2025)

| Phase | Theme | Status |
|-------|-------|--------|
| Phase 8-11 | Core Systems | ✅ Complete |
| **Phase 12-A** | Achievements | 🔲 Spec ready |
| **Phase 12-B** | Login Streak + Mystery Box | 🔲 Spec ready |
| **Phase 12-C** | Season Pass (Free) | 🔲 Spec ready |
| **Phase 12-D** | Event Framework | 🔲 Spec ready |
| **Phase 13** | Session Mini-Games (P1-P3) | 🔲 Spec ready |
| Phase 14 | Session Mini-Games (P4-P6) | 🔲 Future |
```

---

# PART 11: TOC UPDATES

## 11.1 Update Table of Contents

**Add entries:**

```markdown
8. [Mini-Games](#8-mini-games)
    - 8.1.1 Mini-Game Economy Invariants
    - 8.5 Session Mini-Games [Phase 13+]
...
10. [Events & LiveOps](#10-events--liveops)
    - 10.3.1 Daily Login Streak [Phase 12-B]
    - 10.3.2 Mystery Box [Phase 12-B]
    - 10.7 Event Framework [Phase 12-D]
...
11. [Economy & Monetization](#11-economy--monetization)
    - 11.6.2 Notification Center [Phase 12]
    - 11.6.3 Notification Trigger Engine
...
12. [Sound & Vibration](#12-sound--vibration)
    - 12.5 Push Notifications [Unity Later]
    - 12.6 App Icon Badge [Unity Later]
    - 12.7 Notification Channels [Unity Later]
    - 12.8 Notification Settings [Unity Later]
...
17. [Achievements System](#17-achievements-system) [Phase 12-A]
```

---

# BCT TEST PLAN SUMMARY

| Category | Tests |
|----------|-------|
| Mini-Game Invariants | ~15 |
| Mobile Layout | 31 (existing) |
| Session Games | ~50 (across P1-P3) |
| Notification Center | ~15 |
| Notification Triggers | ~20 |
| Achievements | ~40 |
| Login Streak | ~15 |
| Mystery Box | ~10 |
| Event Framework | ~15 |
| Push (Unity) | ~30 |
| **Total New** | **~241** |

---

# VERIFICATION CHECKLIST

| Section | Complete |
|---------|----------|
| Mini-game catalog reconciled (Pips added) | ✅ |
| §8.1.1 Economy Invariants added | ✅ |
| "Play for fun" explicit | ✅ |
| §14.6 Mobile layout fixes | ✅ |
| §8.5 Session games | ✅ |
| Platform scope banner on notifications | ✅ |
| §11.6.2 Notification Center | ✅ |
| §11.6.3 Unified Trigger Engine | ✅ |
| §12.5-12.8 Push [Unity Later] | ✅ |
| Deep-link parity (Web + Unity) | ✅ |
| §17 Achievements | ✅ |
| §10.3.1-10.3.2 Login Streak + Mystery Box | ✅ |
| §10.7 Event Framework | ✅ |
| §11.9 Season Pass split | ✅ |
| §15.6 Status tables | ✅ |
| TOC updates | ✅ |

---

# IMPLEMENTATION SEQUENCE

| Order | Phase | Content | Effort |
|-------|-------|---------|--------|
| 1 | 12-A | Achievements | 3-4 days |
| 2 | 12-B | Login Streak + Mystery Box | 2-3 days |
| 3 | 12 | Notification Center | 2-3 days |
| 4 | 12-C | Season Pass (Free Track) | 2-3 days |
| 5 | 12-D | Event Framework | 4-5 days |
| 6 | 13 | Snake | 2-3 days |
| 7 | 13 | Tetris | 4-5 days |
| 8 | 13 | Runner | 4-5 days |
| 9 | Unity | Push Notifications | With Unity |

---

**END OF COMPREHENSIVE PATCH v1.11 (FINAL)**
