# BIBLE v1.10 PATCH — UI Navigation & Main View Layout

**Patch Version:** 1.10  
**Date:** December 14, 2025  
**Author:** UI Refresh Working Session  
**Applies to:** `docs/GRUNDY_MASTER_BIBLE.md`  
**Secondary:** `docs/GRUNDY_ONBOARDING_FLOW.md` (no changes expected)  
**Prerequisite:** Bible v1.9 applied  

---

## Purpose

Adopt Menu-first navigation (now, not "future"), remove "Play" ambiguity by standardizing on "Games," replace Food Tray requirement with Food Drawer while preserving one-tap feed + ≥4 foods visible, and add layout guardrails to prevent UI refresh from breaking Poop/Cooldown/Time-of-Day and currency visibility rules.

---

## Design Philosophy

UI must protect the core loop: **quick check-in, one-handed, no-scroll main view**. We can modernize navigation and surfaces, but we do NOT dilute required affordances (feed access, currency visibility, poop cleaning, cooldown clarity).

---

## Table of Contents

1. [Patch 1: Navigation Structure — Adopt Menu-First Now (§14.5)](#patch-1-navigation-structure--adopt-menu-first-now-145)
2. [Patch 2: Mobile Layout Constraints — Replace Food Tray with Food Drawer (§14.6)](#patch-2-mobile-layout-constraints--replace-food-tray-with-food-drawer-146)
3. [Patch 3: Terminology — "Mini-Games" vs "Games" Labeling (§14.5, §14.6)](#patch-3-terminology--mini-games-vs-games-labeling-145-146)
4. [Patch 4: Layout Safety — Keep Poop + Cooldown + Time-of-Day From Being Obscured (§14.6 + refs)](#patch-4-layout-safety--keep-poop--cooldown--time-of-day-from-being-obscured-146--refs)
5. [Changelog Entry](#changelog-entry)
6. [Design Rationale](#design-rationale)
7. [BCT Impact](#bct-impact)
8. [Implementation Notes](#implementation-notes)
9. [Cross-Reference Updates](#cross-reference-updates)
10. [Verification Checklist](#verification-checklist)

---

## Instructions

Apply patches in order. Do not remove existing content unless explicitly marked **[REPLACE]**.  
For insertions, add text at the specified location marked **[INSERT AFTER]** or **[INSERT BEFORE]**.

---

## PATCH 1: Navigation Structure — Adopt Menu-First Now (§14.5)

### Problem

§14.5 currently describes menu-first navigation as "future" and states Web 1.0 uses bottom tabs. The UI refresh direction adopts menu overlay + action bar now, so Bible must reflect the canonical navigation model.

### Location

`§14.5 Navigation Structure [Web Phase 6+]`

### Current Text (Lines ~4537-4561)

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
```

### [REPLACE] With

```markdown
## 14.5 Navigation Structure [Web Phase 6+]

> **Current State (Canonical):** Web uses a **Menu Overlay + Action Bar** navigation model.
> - Menu Overlay is the primary router to "Switch Pet / Shop / Inventory / Games / Settings / Home"
> - Action Bar provides one-tap access to core loop actions (Feed + Games + Menu)
> - This replaces the older bottom-tab navigation pattern.

### Main Screen Layout

- **Only active pet visible** on home screen
- No "pet bar" showing all 8 pets simultaneously
- Pet selector accessed via Menu only

### Menu Entry Point

- Menu icon in the header (top bar) is allowed and recommended
- A "Menu" (or "More") button in the Action Bar is also allowed
- **At least one Menu entry point must be always visible during gameplay**
- Tapping opens a slide-up overlay panel (mobile-friendly)

### Menu Options (Canonical)

| Option | Icon | Action |
|--------|------|--------|
| Switch Pet | 🐾 | Opens Pet Selector modal |
| Shop | 🛒 | Opens Shop screen |
| Inventory | 🎒 | Opens Inventory screen |
| Games | 🎮 | Opens Mini-Game Hub |
| Settings | ⚙️ | Opens Settings panel |
| Home | 🏠 | Return to welcome (with confirmation) |

> **Note:** If Cosmetics is surfaced in UI before fully unlocked, it must be clearly marked "Coming Soon" and must not imply purchasable cosmetics beyond the current phase gating rules (see §11.5.2).

### Action Bar (Bottom)

The Action Bar is a bottom-anchored row providing quick access to core actions:

| Button | Icon | Action | Required |
|--------|------|--------|----------|
| Feed | 🍎 | Opens Food Drawer | ✅ Yes |
| Games | 🎮 | Opens Mini-Game Hub | ✅ Yes |
| Menu | ⋯ | Opens Menu Overlay | ✅ Yes |

> **Design Intent:** The Action Bar keeps the core loop (feed, play, navigate) within thumb reach. It does not replace the Menu; it complements it for speed.

### Action Bar Constraints

- Action Bar buttons must not introduce navigation destinations beyond what the Menu defines
- Feed button opens the Food Drawer (not a navigation destination)
- Games button routes to the same destination as Menu → Games
- Menu button opens the same overlay as the header Menu icon
```

---

## PATCH 2: Mobile Layout Constraints — Replace Food Tray with Food Drawer (§14.6)

### Problem

§14.6 requires "Food tray" visible in main view, but the adopted UI refresh uses a Food Drawer. We must preserve the intent (quick feed access, no scrolling, ≥4 foods visible immediately) without forcing a permanent tray.

### Location

`§14.6 Mobile Layout Constraints [Web 1.0]` — Viewport Rule table

### Current Text (Line ~4626)

```markdown
| Food tray | ✅ Yes | At least 4 food items visible |
```

### [REPLACE] With

```markdown
| Food access (Tray or Drawer) | ✅ Yes | Player must be able to feed in ≤1 tap from main view. If using a Drawer, opening it must immediately show ≥4 food items without scrolling. |
```

### [INSERT AFTER] Viewport Rule Table

Add the following new subsection after the Viewport Rule table and before "Prohibited in Main View":

```markdown
### Food Drawer Clarification (Allowed)

A **Food Drawer** is an approved replacement for an always-visible Food Tray if **ALL** of the following are true:

1. **Feed is available from the main view** — One tap opens the drawer (Feed button in Action Bar)
2. **≥4 food items visible immediately** — Drawer contents show at least 4 food items without scrolling
3. **Empty foods may show** — Disabled state is allowed, but must not hide the player's available foods
4. **Does not obscure required indicators** — Drawer must not permanently block Poop, Cooldown, or Currency displays (see "UI Overlay Safety Rules")

> **Design Intent:** The Food Drawer modernizes the feeding UI while preserving the "quick check-in" philosophy. Players can still feed their pet in ≤2 interactions (tap Feed → tap food item).
```

---

## PATCH 3: Terminology — "Mini-Games" vs "Games" Labeling (§14.5, §14.6)

### Problem

"Play" in an action bar is ambiguous (play-with-pet vs mini-games). The UI must use clear player language while staying Bible-consistent.

### Locations

- §14.5 Menu Options table
- §14.6 Viewport Rule row "Primary actions"
- Any references to "Play" as a navigation label

### Changes

**§14.5 Menu Options:** Already updated in Patch 1 — uses "Games" not "Mini-Games" or "Play"

**§14.6 Primary Actions Row:**

### Current Text (Line ~4623)

```markdown
| Primary actions | ✅ Yes | Feed button, at least one mini-game entry |
```

### [REPLACE] With

```markdown
| Primary actions | ✅ Yes | Feed button (opens Food Drawer) + Games button (opens Mini-Game Hub) |
```

### [INSERT AFTER] §14.6 "Design Intent" Blockquote

```markdown
### Terminology: "Games" vs "Mini-Games" vs "Play"

| Term | Usage |
|------|-------|
| **Games** | Canonical UI label for buttons and menu items |
| **Mini-Games** | Canonical Bible/design term (functionally equivalent to "Games") |
| **Play** | ❌ Not a canonical navigation label — ambiguous with "play with pet" |

> When the Bible says "Mini-Games," implementations may use the shorter label "Games" in UI. Both refer to the same destination (Mini-Game Hub per §8).
```

---

## PATCH 4: Layout Safety — Keep Poop + Cooldown + Time-of-Day From Being Obscured (§14.6 + refs)

### Problem

UI refresh overlays (Food Drawer, Menu Overlay) can accidentally hide critical gameplay affordances: poop cleaning, feed cooldown clarity, and time-of-day tint/background cues. Bible requirements must be protected during UI refactors.

### Location

`§14.6 Mobile Layout Constraints` — after "Design Intent" blockquote (or after Terminology patch)

### [INSERT] New Subsection

```markdown
### UI Overlay Safety Rules (Required)

Overlays (Food Drawer, Menu Overlay, Inventory, Shop sheets) must **NOT** break critical feedback loops:

#### 1. Poop Cleaning Must Remain Possible

- If poop is dirty (see §9.5 Poop System, §9.4.2 Sickness Triggers), the player must have a clear, tappable affordance to clean it
- Overlays must not permanently cover or block the Poop Indicator / Clean action
- Acceptable: Overlay covers poop temporarily; dismissing overlay reveals poop indicator
- Unacceptable: Overlay has no dismiss path, or poop indicator is never visible when dirty

#### 2. Feeding Cooldown Must Be Clear

- If feeding is on cooldown (see §4.3), the UI must clearly communicate this state
- Recommended: Disabled feed state + remaining time visible (e.g., "⏱️ Digesting... 24:32")
- Required: UI must not allow spam-feeding attempts without feedback
- Cooldown timer, when active, should be visible on the main view (not hidden behind overlays)

#### 3. Currency Display Must Persist

- Coins AND Gems must remain visible on the main view header (see §14.6 Viewport Rule)
- Overlays may have their own currency display, but the header must not be permanently hidden
- Exception: Full-screen modals (e.g., Mini-Game active play) may hide header temporarily

#### 4. Time-of-Day Context Must Persist

- Time-of-day tint/background cues (see §14.4) must continue to render in the home experience
- Even if Rooms Lite is simplified, TOD gradients must apply to the main view background
- Overlays may have their own backgrounds, but dismissing them must return to TOD-appropriate view

> **Design Philosophy:** UI polish is encouraged; breaking gameplay clarity is not. Every overlay must have a clear dismiss path, and critical affordances must be reachable within 1-2 taps of dismissing any overlay.
```

---

## Changelog Entry

Add to Bible header changelog after v1.9 entry:

```markdown
- v1.10: UI Navigation & Layout Update — Adopted Menu-first + Action Bar as canonical navigation (§14.5), replacing "future" language. Approved Food Drawer as alternative to Food Tray with ≥4 foods visible constraint (§14.6). Standardized "Games" terminology, deprecated "Play" as nav label. Added UI Overlay Safety Rules protecting Poop, Cooldown, Currency, and TOD visibility. No game design changes.
```

---

## Design Rationale

| Decision | Reasoning |
|----------|-----------|
| **Menu-first + Action Bar** | Cleaner UI, fewer persistent tabs, scales better for Phase 11+ (cosmetics, gems, events) |
| **"Games" label** | Removes confusion — players interpret "Play" as interacting with pet |
| **Food Drawer approval** | Modern, mobile-friendly, but preserves §14.6 spirit: fast, no-scroll, one-handed |
| **Overlay Safety Rules** | Guardrail: UI polish is allowed, breaking gameplay clarity is not |
| **Inventory in Menu** | Inventory remains a dedicated screen (§14.8); Menu provides a clean entry point |

---

## BCT Impact

Tests to review/update:

| Area | Change |
|------|--------|
| Navigation tests | Update from "bottom tabs" to "Action Bar + Menu Overlay" |
| Viewport rule tests | Change "Food tray visible" → "Food access (tray or drawer)" |
| Currency display tests | Ensure BOTH coins AND gems are validated as visible |
| Overlay tests | Add tests for dismiss behavior, poop accessibility |
| Terminology tests | Update any "Play" button references to "Games" |

### New BCT Test Specifications

```
BCT-NAV-001: Menu Overlay contains Switch Pet, Shop, Inventory, Games, Settings, Home
BCT-NAV-002: Action Bar contains Feed, Games, Menu buttons
BCT-NAV-003: Feed button opens Food Drawer in ≤1 tap
BCT-NAV-004: Games button opens Mini-Game Hub
BCT-NAV-005: Menu button opens same overlay as header menu icon

BCT-DRAWER-001: Food Drawer shows ≥4 food items without scrolling
BCT-DRAWER-002: Food Drawer can be dismissed to reveal main view
BCT-DRAWER-003: Poop indicator accessible after drawer dismiss

BCT-OVERLAY-001: Poop indicator visible or accessible when poop is dirty
BCT-OVERLAY-002: Cooldown timer visible on main view when active
BCT-OVERLAY-003: Coins AND Gems visible in header on main view
BCT-OVERLAY-004: TOD background renders on main view
```

---

## Implementation Notes

- **Engine-agnostic:** React/React Native patterns map cleanly to Unity (UGUI bottom action bar + modal sheet overlay)
- **Action Bar semantics:** Feed (opens drawer), Games (opens hub), Menu (opens overlay)
- **Do not silently rename gameplay concepts** — only UI labels change (Mini-Games ↔ Games)
- **Overlay z-index:** Food Drawer and Menu Overlay should be z-index 40-50; Poop Indicator should be z-index 10-20 (below overlays but visible when overlays dismissed)

### Component Mapping

| Bible Concept | React Component | Unity Equivalent |
|---------------|-----------------|------------------|
| Menu Overlay | `<MenuOverlay>` | Modal Panel + Animator |
| Action Bar | `<BottomNav>` / `<ActionBar>` | UGUI HorizontalLayoutGroup |
| Food Drawer | `<FoodDrawer>` | Bottom Sheet + ScrollRect |
| Poop Indicator | `<PoopIndicator>` | World-space UI or Overlay |
| Cooldown Timer | `<CooldownBanner>` | Text + Timer component |

---

## Cross-Reference Updates

After Bible patch is adopted, update:

| Document | Update Needed |
|----------|---------------|
| `ORCHESTRATOR.md` | Bump Bible version reference to v1.10 |
| `TASKS.md` | Update any items citing §14.5/§14.6 constraints |
| `UI Integration Guide` | Ensure coins + gems visible requirement is explicit |
| `BCT test files` | Add new BCT-NAV and BCT-OVERLAY tests |

---

## Verification Checklist

After applying this patch, verify:

- [ ] §14.5 no longer frames menu-first navigation as "future"
- [ ] §14.5 includes Action Bar specification (Feed, Games, Menu)
- [ ] Menu Options include: Switch Pet, Shop, Inventory, Games, Settings, Home
- [ ] §14.6 Viewport Rule no longer requires a visible "Food tray" specifically
- [ ] §14.6 Food Drawer explicitly allowed with ≥4 foods visible constraint
- [ ] §14.6 Primary Actions row updated to "Feed button + Games button"
- [ ] §14.6 Terminology section clarifies Games vs Mini-Games vs Play
- [ ] §14.6 UI Overlay Safety Rules added (Poop, Cooldown, Currency, TOD)
- [ ] Bible header changelog includes v1.10 entry
- [ ] No "Play" appears as a canonical navigation label

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Game Design | | | |
| Docs & Governance | | | |
| Chief Engineer | | | |

---

## Summary of Changes

| Section | Change Type | Summary |
|---------|-------------|---------|
| §14.5 | Major rewrite | Menu-first + Action Bar is NOW canonical |
| §14.5 | Addition | Action Bar specification added |
| §14.5 | Addition | Inventory added to Menu Options |
| §14.5 | Rename | Mini-Games → Games in menu |
| §14.6 | Row update | Food tray → Food access (Tray or Drawer) |
| §14.6 | Addition | Food Drawer Clarification subsection |
| §14.6 | Row update | Primary actions updated |
| §14.6 | Addition | Terminology subsection (Games vs Play) |
| §14.6 | Addition | UI Overlay Safety Rules subsection |
| Header | Addition | v1.10 changelog entry |

---

**End of Patch Document**
