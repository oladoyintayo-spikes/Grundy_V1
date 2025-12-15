# BIBLE v1.9 PATCH — Cosmetics System (Pet-Bound Ownership) + Currency Consistency

**Date:** December 14, 2025  
**Version:** 1.9  
**Purpose:** Define pet-bound cosmetic ownership, fix currency inconsistencies, update gap table, establish gem source prerequisites for Phase 11  
**Applies to:** `docs/GRUNDY_MASTER_BIBLE.md`  
**Secondary:** `docs/GRUNDY_ONBOARDING_FLOW.md` (minor alignment)  
**Prerequisite:** Bible v1.8 applied (P10 complete)  
**Design Philosophy:** Cosmetics are visual-only, never affect stats. Pet-bound ownership drives meaningful gem sinks. Grind OR pay.

---

## Table of Contents

1. [Patch 1: Currency Consistency Fix (§11.1)](#patch-1-currency-consistency-fix-111)
2. [Patch 2: Cosmetic Ownership Model (§11.5.2 — New)](#patch-2-cosmetic-ownership-model-1152--new)
3. [Patch 3: Cosmetic Slots & Equip Rules (§11.5.3 — New)](#patch-3-cosmetic-slots--equip-rules-1153--new)
4. [Patch 4: Cosmetic Rarity Display (§11.5.4 — New)](#patch-4-cosmetic-rarity-display-1154--new)
5. [Patch 5: Shop UI — Cosmetics Tab (§14.7)](#patch-5-shop-ui--cosmetics-tab-147)
6. [Patch 6: Inventory UI — Cosmetics Section (§14.8)](#patch-6-inventory-ui--cosmetics-section-148)
7. [Patch 7: Gem Source Implementation Tags (§11.4)](#patch-7-gem-source-implementation-tags-114)
8. [Patch 8: Gap Table Update (§15.6)](#patch-8-gap-table-update-156)
9. [Patch 9: Phase Numbering Clarification (§15.6)](#patch-9-phase-numbering-clarification-156)
10. [Patch 10: Cozy Mode Cosmetics Note (§9.3)](#patch-10-cozy-mode-cosmetics-note-93)
11. [Patch 11: Onboarding Copy Fix (GRUNDY_ONBOARDING_FLOW.md)](#patch-11-onboarding-copy-fix)
12. [Design Rationale](#design-rationale)
13. [BCT Impact](#bct-impact)
14. [Implementation Notes](#implementation-notes)
15. [Cross-Reference Updates](#cross-reference-updates)
16. [Verification Checklist](#verification-checklist)

---

## Instructions

Apply patches in order. Do not remove existing content unless explicitly marked "**Replace with:**". For new sections, insert at the specified location.

---

## PATCH 1: Currency Consistency Fix (§11.1)

**Problem:** §11.1 implies coins can buy "common cosmetics", but §11.5 Category 2 defines ALL cosmetics as gems-only. This creates player confusion.

**Location:** §11.1 Currency Types → "Currency Hierarchy" section (line ~3020)

**Current:**
```
### Currency Hierarchy

Coins → Common/Uncommon items, Care items, Food
Gems → Rare+ cosmetics, Pet unlocks, Premium bundles, Utility
Event Tokens → Event-exclusive items only (cannot mix)
```

**Replace with:**
```
### Currency Hierarchy

| Currency | Can Purchase | Cannot Purchase |
|----------|--------------|-----------------|
| **Coins 🪙** | Food, Care items | All cosmetics, Pet unlocks, Utility, Premium bundles |
| **Gems 💎** | All cosmetics, Pet unlocks, Utility, Premium bundles | Common food/care (no gem-dumping into basics) |
| **Event Tokens** | Event-exclusive items only | Cannot convert to coins/gems |

**Design Intent:**
- Coins = everyday gameplay currency (feeding, care)
- Gems = aspirational currency (cosmetics, unlocks, premium)
- Clear separation prevents confusion and supports monetization
```

**Location:** §11.1 Currency Types → main table (line ~3008)

**Current (if exists):**
```
| Coins | 🪙 | Feeding, mini-games, daily login, achievements | Food, care items, common cosmetics |
```

**Replace with:**
```
| Coins | 🪙 | Feeding, mini-games, daily login, achievements | Food, Care items |
```

**Rationale:** Cosmetics are a primary gem sink. Allowing coin purchases (even "common") undermines the gem economy and contradicts §11.5 Category 2.

---

## PATCH 2: Cosmetic Ownership Model (§11.5.2 — New)

**Location:** After §11.5 "Category 2: Cosmetics (Gems Only)" table (after line ~3311)

**Add:**

---

### §11.5.2 Cosmetic Ownership Model [Phase 11]

#### Core Principle: Pet-Bound Purchase

**A cosmetic purchase is bound to exactly one pet, permanently, from the moment of purchase. The same cosmetic SKU may be purchased separately for multiple pets.**

This is a deliberate monetization and design decision:
- Each purchase is bound to the active pet at time of purchase
- Purchases cannot be transferred, traded, or reassigned between pets
- If a player wants the same cosmetic on multiple pets, they purchase it separately for each pet
- This creates meaningful gem sinks while keeping cosmetics purely visual (no pay-to-win)

**Clarification:** The unit of ownership is the *purchase*, not the SKU. Pet A owning `cos_hat_cap_blue` does not prevent Pet B from purchasing `cos_hat_cap_blue` — these are separate purchases bound to separate pets.

#### Ownership Rules

| Rule | Behavior |
|------|----------|
| **Purchase binding** | Cosmetic is bound to the active pet at time of purchase |
| **Permanent ownership** | Once purchased, pet owns it forever (no expiration) |
| **Non-transferable** | Cannot move cosmetic to another pet under any circumstance |
| **Per-pet inventory** | Each pet has its own cosmetic inventory |
| **No trading** | Cosmetics cannot be traded between accounts or pets |

#### Multi-Pet Purchase Scenarios

| Scenario | Behavior |
|----------|----------|
| Buy Blue Cap for Pet A | Pet A owns Blue Cap |
| Want Blue Cap on Pet B too | Must purchase Blue Cap again for Pet B |
| Pet A already owns Blue Cap | Cannot repurchase for Pet A (show "Owned ✓") |
| Pet B wants Pet A's Blue Cap | Cannot transfer; must buy separately |

#### Ownership State Schema

```typescript
interface CosmeticsState {
  // Ownership is per-pet (not global)
  cosmeticsOwnedByPetId: Record<string, string[]>;  // petId → array of owned cosmetic IDs
  
  // Equipped state is also per-pet
  cosmeticsEquippedByPetId: Record<string, {
    hat: string | null;
    accessory: string | null;
    outfit: string | null;
    aura: string | null;
    skin: string | null;
  }>;
}

// Example state
{
  cosmeticsOwnedByPetId: {
    'munchlet': ['cos_hat_cap_blue', 'cos_aura_sparkle'],
    'grib': ['cos_hat_bow_pink'],
    'plompo': []  // No cosmetics purchased yet
  },
  cosmeticsEquippedByPetId: {
    'munchlet': { hat: 'cos_hat_cap_blue', accessory: null, outfit: null, aura: 'cos_aura_sparkle', skin: null },
    'grib': { hat: 'cos_hat_bow_pink', accessory: null, outfit: null, aura: null, skin: null },
    'plompo': { hat: null, accessory: null, outfit: null, aura: null, skin: null }
  }
}
```

#### Why Pet-Bound (Not Global)?

| Alternative | Problem |
|-------------|---------|
| Global ownership (account-wide) | One purchase covers all pets → weak gem sink |
| Transferable (swap between pets) | Same issue + complex UX for "who has it now?" |
| **Pet-bound (chosen)** | Clear ownership, meaningful purchases, simple UX |

**Player Psychology:** Players naturally think of each pet as an individual. "Dressing up Munchlet" is different from "dressing up Grib." Pet-bound ownership aligns with this mental model.

---

## PATCH 3: Cosmetic Slots & Equip Rules (§11.5.3 — New)

**Location:** After new §11.5.2

**Add:**

---

### §11.5.3 Cosmetic Slots & Equip Rules [Phase 11]

#### Cosmetic Types & Slots

| Slot | Accepted Item Prefixes | Visual Layer | Limit |
|------|------------------------|--------------|-------|
| **Hat** | `cos_hat_*` | Top of head | 1 per pet |
| **Accessory** | `cos_scarf_*`, `cos_accessory_*` | Neck/body accent | 1 per pet |
| **Outfit** | `cos_outfit_*` | Body covering | 1 per pet |
| **Aura** | `cos_aura_*` | Background effect | 1 per pet |
| **Skin** | `cos_skin_*` | Full body replacement | 1 per pet |

#### Equip Rules

| Rule | Behavior |
|------|----------|
| **Equip** | Place owned cosmetic into its slot |
| **Unequip** | Remove from slot; cosmetic remains owned by pet |
| **Swap (same slot)** | Equipping new item auto-unequips previous in that slot |
| **Ownership required** | Cannot equip cosmetic not owned by this pet |
| **Cross-pet block** | Cannot equip another pet's cosmetic (hard block) |

#### Equip Attempt on Non-Owned Cosmetic

If user attempts to equip a cosmetic not owned by the active pet:

1. **Block the action** — do not equip
2. **Show message:** "This cosmetic belongs to [Pet Name] and can't be transferred."
3. **Offer CTA:** "Buy for [Active Pet]?" → navigates to shop purchase flow

#### Render Layer Order

When rendering pet with cosmetics, apply layers bottom-to-top:

```
1. Base sprite (pet body + current expression/state)
2. Skin (if equipped — replaces base body texture)
3. Outfit (body covering, on top of skin/base)
4. Aura (background particle effect, renders behind pet but above room)
5. Accessory (neck/body accent)
6. Hat (on top of head, topmost layer)
```

**Fallback:** If any cosmetic asset is missing, render without it (no crash). Log warning for debugging.

#### Cosmetics and Gameplay (Invariants)

| Question | Answer | Enforcement |
|----------|--------|-------------|
| Do cosmetics affect stats? | **Never** | BCT-COSMETICS-INVARIANT-001 |
| Do cosmetics affect abilities? | **No** | BCT-COSMETICS-INVARIANT-002 |
| Do cosmetics affect evolution? | **No** | BCT-COSMETICS-INVARIANT-003 |
| Do cosmetics affect XP/bond gain? | **No** | BCT-COSMETICS-INVARIANT-004 |
| Can cosmetics expire? | **No** — permanent | — |
| Can cosmetics be transferred? | **No** — pet-bound | BCT-COSMETICS-NONTRANSFER-001 |

---

## PATCH 4: Cosmetic Rarity Display (§11.5.4 — New)

**Location:** After new §11.5.3

**Add:**

---

### §11.5.4 Cosmetic Rarity Display [Phase 11]

#### Rarity Tiers (Reference: §11.5 Category 2)

| Rarity | Gem Range | Notes |
|--------|-----------|-------|
| Common | 10-20 💎 | Entry-level cosmetics |
| Uncommon | 20-40 💎 | Slight visual flair |
| Rare | 40-70 💎 | Noticeable quality |
| Epic | 70-120 💎 | Standout pieces |
| Legendary | 120-300 💎 | Ultimate flex items |

#### Visual Presentation (UI Layer)

**Note:** The following visual specifications are for the UI layer only. `bible.constants.ts` stores rarity tiers and gem ranges; the UI maps these to presentation styles.

| Rarity | Border Style | Glow Effect | Badge |
|--------|--------------|-------------|-------|
| Common | Gray solid | None | — |
| Uncommon | Green solid | None | — |
| Rare | Blue solid | Subtle pulse | ✦ |
| Epic | Purple solid | Medium pulse | ✦✦ |
| Legendary | Gold gradient | Sparkle animation | ✦✦✦ |

**Recommended Colors (UI reference, not in constants):**
- Common: `#9CA3AF`
- Uncommon: `#22C55E`
- Rare: `#3B82F6`
- Epic: `#A855F7`
- Legendary: `#F59E0B` → `#EAB308` (gradient)

#### Where Rarity Indicators Appear

| UI Surface | Border | Glow | Badge | Notes |
|------------|--------|------|-------|-------|
| Shop → Cosmetics tab | ✅ | ✅ | ✅ | Full treatment |
| Inventory → Cosmetics | ✅ | ✅ | ✅ | Full treatment |
| Equipped slot preview | ✅ | ❌ | ❌ | Simplified |
| Pet avatar (gameplay) | ❌ | ❌ | ❌ | No indicator (clean look) |
| Cosmetic detail modal | ✅ | ✅ | ✅ | Full treatment + rarity label |

#### Rarity Label Text

| Rarity | Label | Color |
|--------|-------|-------|
| Common | "Common" | Gray |
| Uncommon | "Uncommon" | Green |
| Rare | "Rare" | Blue |
| Epic | "Epic" | Purple |
| Legendary | "Legendary" | Gold |

---

## PATCH 5: Shop UI — Cosmetics Tab (§14.7)

**Location:** §14.7 Shop UI → Add new subsection or extend existing

**Add:**

---

### §14.7.3 Cosmetics Tab [Phase 11]

#### Tab Position & Access

- **Position:** 3rd tab (after Food, Care)
- **Unlock:** Available after Bond ≥ 1 (same as shop unlock)
- **Mode:** Available in both Cozy and Classic (cosmetics are visual-only)

#### Pet Context

**Critical:** Cosmetics tab always operates in context of the **active pet**.

- Header shows: "Cosmetics for [Pet Name]" or pet avatar indicator
- All ownership checks are against active pet
- Switching pets updates the tab view

#### Layout

| Element | Specification |
|---------|---------------|
| Filter bar | All / Hat / Accessory / Outfit / Aura / Skin |
| Sort | Rarity (default), Price, Name |
| Grid | 2 columns (mobile), 3-4 columns (tablet/desktop) |
| Item card size | 80x80px minimum touch target |

#### Item Card States

| State | Visual | Action |
|-------|--------|--------|
| **Available** | Price badge (💎), rarity border | Tap → Purchase flow |
| **Owned by active pet** | "Owned ✓" badge, rarity border | Tap → Equip flow |
| **Owned by other pet** | "Owned by [Pet]" label, dimmed | Tap → "Buy for [Active Pet]?" |
| **Locked** | Lock icon, unlock requirement | Tap → Show requirement |

#### Purchase Flow

```
1. Tap available cosmetic
   ↓
2. Detail modal opens:
   - Full preview on active pet (live render)
   - Name, rarity badge, description
   - Price: "X 💎"
   - Active pet name confirmation
   ↓
3. Tap "Buy for [Pet Name]"
   ↓
4. Confirmation (required for 50+ gems per §11.4):
   "Spend X💎 on [Item] for [Pet]?"
   [Cancel] [Confirm]
   ↓
5. On confirm:
   - Deduct gems
   - Add to pet's cosmeticsOwnedByPetId
   - Toast: "[Item] purchased for [Pet]!"
   - Card updates to "Owned ✓"
```

#### "Owned by Other Pet" Flow

```
1. Tap cosmetic owned by different pet
   ↓
2. Detail modal opens:
   - Preview on active pet
   - "This cosmetic belongs to [Other Pet]"
   - "Cosmetics are pet-bound and cannot be transferred."
   ↓
3. CTA: "Buy for [Active Pet] — X💎"
   ↓
4. Standard purchase flow continues
```

#### Unlock Requirements Display

For cosmetics with unlock gates (e.g., "Level 10+", "Bond ≥ 5"):

```
┌─────────────────┐
│   🔒 Locked     │
│                 │
│  [Item Icon]    │
│                 │
│  Level 10+      │
│  (You: Lv 7)    │
└─────────────────┘
```

---

## PATCH 6: Inventory UI — Cosmetics Section (§14.8)

**Location:** §14.8 Inventory UI → Add new subsection

**Add:**

---

### §14.8.3 Cosmetics Inventory [Phase 11]

#### Access & Organization

- **Location:** New section/tab within Inventory (after Food items)
- **Context:** Shows cosmetics owned by **active pet only**
- **Empty state:** "No cosmetics yet. Visit the Shop!"

#### Layout

| Element | Specification |
|---------|---------------|
| Filter bar | All / Hat / Accessory / Outfit / Aura / Skin / Equipped |
| Grid | Matches shop grid (2-3 columns) |
| Sort | Equipped first, then by rarity |

#### Item Card Display

Each card shows:
- Cosmetic icon with rarity border
- Name
- Slot type indicator (hat/accessory/etc.)
- "Equipped" badge if currently equipped

#### Detail Modal

Tapping a cosmetic opens detail modal:

```
┌────────────────────────────────┐
│        [Cosmetic Name]         │
│      ✦✦ Epic • Hat             │
├────────────────────────────────┤
│                                │
│     [Live Preview on Pet]      │
│                                │
├────────────────────────────────┤
│  Owned by: [Pet Name]          │
│  Status: Equipped / Not Equipped│
├────────────────────────────────┤
│  [Equip]  or  [Unequip]        │
└────────────────────────────────┘
```

#### Equip Flow

```
1. Tap owned cosmetic (not equipped)
   ↓
2. Detail modal shows "Equip" button
   ↓
3. Tap "Equip"
   ↓
4. If slot occupied:
   - Previous item auto-unequips
   - Toast: "Swapped [Old] for [New]"
   ↓
5. If slot empty:
   - Item equipped
   - Toast: "Equipped [Item]!"
   ↓
6. Pet avatar updates immediately
```

#### Unequip Flow

```
1. Tap equipped cosmetic
   ↓
2. Detail modal shows "Unequip" button
   ↓
3. Tap "Unequip"
   ↓
4. Item removed from slot, remains in inventory
   ↓
5. Toast: "Unequipped [Item]"
```

#### Viewing Other Pets' Cosmetics

- Inventory shows **only active pet's cosmetics**
- To see another pet's cosmetics: switch active pet first
- No "browse all pets' cosmetics" view (keeps UX simple)

---

## PATCH 7: Gem Source Implementation Tags (§11.4)

**Location:** §11.4 Gem Economy → "Gem Income Sources" table (line ~3106)

**Current:**
```
| Source | Gems | Frequency | Notes |
|--------|------|-----------|-------|
| Level up | 5 | Per level | Reliable progression |
| First feed daily | 1 | Daily | Free players: 1/day |
| First feed daily (Plus) | 3 | Daily | Plus subscribers: 3/day |
| Mini-game Rainbow tier | 1-3 | Per achievement | **Unity only**; Web Edition awards 0 gems (see §8.3) |
| Daily login (Day 7) | 10 | Weekly | Streak reward |
| Achievements | 5-50 | One-time | Milestone rewards |
| Season Pass (Premium) | ~100 | Per season | Spread across tiers |
```

**Replace with:**
```
### Gem Income Sources

| Source | Gems | Frequency | Implementation | Notes |
|--------|------|-----------|----------------|-------|
| Level up | 5 | Per level | **[Phase 11-0]** | Primary free player income |
| First feed daily | 1 | Daily | **[Phase 11-0]** | Free players: 1💎/day |
| First feed daily (Plus) | 3 | Daily | **[Unity Later]** | Plus subscribers: 3💎/day |
| Mini-game Rainbow tier | 1-3 | Per achievement | **[Unity Only]** | Web Edition awards 0 gems (§8.3) |
| Daily login (Day 7) | 10 | Weekly | **[Phase 11-0]** | Streak reward |
| Achievements | 5-50 | One-time | **[Phase 12]** | Requires Achievements system |
| Season Pass (Premium) | ~100 | Per season | **[Phase 12]** | Spread across tiers |

### Phase 11-0: Gem Source Prerequisites

**Before implementing cosmetics purchase (P11-C), these gem sources MUST be implemented:**

| Source | Gems | Why Required |
|--------|------|--------------|
| Level up | +5💎 | Primary free player progression reward |
| First feed daily | +1💎 | Daily engagement incentive |
| Daily login Day 7 | +10💎 | Weekly streak bonus |

**Free Player Gem Math (with P11-0):**

| Timeframe | Gems Earned | Can Afford |
|-----------|-------------|------------|
| Daily | 1 (first feed) | — |
| Weekly | 7 (feeds) + 10 (streak) = 17 | 1 Common |
| Monthly | ~75 | 3-4 Common or 1-2 Uncommon |
| 3 months | ~225 | 1 Rare + extras |

**Rationale:** Without gem sources, cosmetics are paid-only, which violates the "grind OR pay" promise in §11.3. Players must have an earnable path to cosmetics.
```

---

## PATCH 8: Gap Table Update (§15.6)

**Location:** §15.6 Web Prototype Mapping → "Known Prototype Gaps" table (line ~4689)

**Replace entire table with:**

```
### Known Prototype Gaps (Updated December 2025)

| Feature | Bible Spec | Web Status | Target Phase |
|---------|------------|------------|--------------|
| Shop (Food/Care) | §11.5, §11.5.1, §14.7 | ✅ **Implemented** | Phase 8 ✓ |
| Inventory (slots + stacking) | §11.7, §11.7.1, §14.8 | ✅ **Implemented** | Phase 8 ✓ |
| Pet Slots (multi-pet) | §11.6 + Utility specs | ✅ **Implemented** | Phase 9 ✓ |
| Sickness System (Classic) | §9.4.7.2, §9.4.7.3 | ✅ **Implemented** | Phase 10 ✓ |
| Weight System | §9.4.7.1, §5.7 | ✅ **Implemented** | Phase 10 ✓ |
| Poop System | §9.5 | ✅ **Implemented** | Phase 10 ✓ |
| Care Mistakes (Classic) | §9.4 | ✅ **Implemented** | Phase 10 ✓ |
| Health Alerts | §11.6.1 | ✅ **Implemented** | Phase 10 ✓ |
| Gem Sources (free player) | §11.4 | ❌ Not implemented | **Phase 11-0** |
| Cosmetics (pet-bound) | §11.5.2, §11.5.3, §11.5.4 | ❌ Not implemented | **Phase 11** |
| Lore Journal | §6.4 | ❌ Not implemented | Phase 10.5 |
| Achievements | — | ❌ Not implemented | Phase 12 |
| Season Pass | §11.9 | ❌ Not implemented | Phase 12 |
| LiveOps layer | §10 | ❌ Not implemented | Phase 12+ |
| Ads (rewarded/interstitial) | §11.10 | ❌ Not implemented | [Unity Later] |

### Critical Gaps (Phase 11 Blockers)

| Gap | Bible Section | Why It Blocks Phase 11 |
|-----|---------------|------------------------|
| Gem sources | §11.4 | Free players need earnable gems before cosmetics |

> **Note:** Phase 8/9/10 gaps have been resolved. Update this table as implementations land.
```

---

## PATCH 9: Phase Numbering Clarification (§15.6)

**Location:** §15.6 Web Prototype Mapping → After gap table

**Add:**

```
### Phase Numbering Clarification (December 2025)

| Phase | Theme | Status | Notes |
|-------|-------|--------|-------|
| Phase 8 | Shop + Inventory | ✅ CE/QA Approved | Merged to main |
| Phase 9 | Pet Slots / Multi-Pet | ✅ CE/QA Approved | Merged to main |
| Phase 10 | Weight & Sickness Systems | ✅ CE/QA Approved | Bible v1.8 |
| **Phase 10.5** | Lore Journal | ⬜ Not started | Originally "Phase 10" in TASKS.md |
| **Phase 11-0** | Gem Sources | ⬜ Not started | Prerequisite for cosmetics |
| **Phase 11** | Cosmetics System | ⬜ Not started | Bible v1.9 |
| Phase 12 | Achievements, Season Pass, Ads, LiveOps | ⬜ Deferred | — |

**Why Phase 10.5?** TASKS.md originally labeled Lore Journal as "Phase 10". Since Weight & Sickness shipped as Phase 10 (Bible v1.8), Lore Journal is renumbered to Phase 10.5 to avoid confusion.

**Why Phase 11-0?** Gem sources are a hard prerequisite for cosmetics. Without them, free players cannot earn gems, making cosmetics paid-only (violates §11.3 "grind OR pay").
```

---

## PATCH 10: Cozy Mode Cosmetics Note (§9.3)

**Location:** §9.3 Cozy Mode → Near "What Cozy Mode Disables" or "Core Promise"

**Add:**

```
### Cosmetics in Cozy Mode [Phase 11]

| Aspect | Cozy Behavior | Notes |
|--------|---------------|-------|
| Cosmetic purchases | ✅ Allowed | Gems-only, same as Classic |
| Cosmetic equipping | ✅ Allowed | Full functionality |
| Cosmetic rendering | ✅ Full support | No difference from Classic |
| Pet-bound ownership | ✅ Same rules | No mode-specific exceptions |

**Rationale:** Cosmetics are purely visual and have no gameplay effects. They work identically in both Cozy and Classic modes. Cozy players can enjoy full cosmetic customization without any mode-related restrictions.
```

---

## PATCH 11: Onboarding Copy Fix

**File:** `docs/GRUNDY_ONBOARDING_FLOW.md`

**Location:** Any section that mentions currency usage (e.g., tutorial or economy intro)

**Current (if exists):**
```
Coins: food and cosmetics
```

**Replace with:**
```
Coins: food and care items
Gems: pets, cosmetics, and special utility
```

**Rationale:** Prevents teaching players a rule we immediately contradict when cosmetics go live. Currency roles should be clear from onboarding.

---

## Design Rationale

### Why Pet-Bound Ownership?

| Design Option | Pros | Cons | Revenue Impact |
|---------------|------|------|----------------|
| Global (account owns) | Player-friendly, one purchase | Weak gem sink | Lower |
| Transferable (swap) | Flexible | Complex UX, still weak sink | Lower |
| **Pet-Bound (chosen)** | Clear ownership, simple UX | "Buy twice" perception | Higher |

**Decision:** Pet-bound ownership aligns with:
1. **Monetization goals** — Cosmetics become meaningful gem sinks
2. **Player mental model** — Players think of pets as individuals
3. **UX simplicity** — No "who has it now?" tracking needed

### Why Fix Currency Inconsistency?

| Problem | Impact |
|---------|--------|
| §11.1 says coins buy "common cosmetics" | Players expect coins to work |
| §11.5 says all cosmetics are gems-only | Players are confused/frustrated |
| Onboarding mentions coins for cosmetics | First impression is wrong |

**Decision:** Align all documentation to gems-only for cosmetics. Coins are for food/care only.

### Why Gem Sources Before Cosmetics?

| Without P11-0 | With P11-0 |
|---------------|------------|
| Free players have 0💎 | Free players earn ~75💎/month |
| Cosmetics are paid-only | Cosmetics are earnable (slow but possible) |
| Violates "grind OR pay" | Honors design philosophy |
| Players feel paywalled | Players feel progression |

**Decision:** P11-0 is a hard prerequisite. Do not ship cosmetics without gem sources.

### Why No Cross-Pet Transfer?

| With Transfer | Without Transfer |
|---------------|------------------|
| Buy once, share across 4 pets | Buy for each pet separately |
| Weak gem sink | Strong gem sink |
| Complex "unequip from Pet A" UX | Simple "belongs to this pet" UX |

**Decision:** Non-transfer creates meaningful purchases. The UX is cleaner and the monetization is stronger.

---

## BCT Impact

### New Test Categories Required

| Category | Count | Coverage |
|----------|-------|----------|
| **BCT-GEM-SOURCES** | 10 | Level-up, first-feed, login streak awards |
| **BCT-COSMETICS-OWNERSHIP** | 8 | Pet-bound model, ownership persistence, multi-pet same SKU |
| **BCT-COSMETICS-PURCHASE** | 12 | Gems deducted, bound to active pet, duplicate blocked, "owned by other" flow |
| **BCT-COSMETICS-EQUIP** | 10 | Slot rules, swap behavior, ownership guard (block if not owned) |
| **BCT-COSMETICS-INVARIANT** | 4 | Stats unaffected, abilities unaffected |
| **BCT-COSMETICS-RENDER** | 4 | Layer order, fallback on missing asset |
| **BCT-COSMETICS-RARITY** | 4 | Rarity tier → UI mapping |
| **Total** | **~52** | — |

### Key Test Specifications

#### BCT-COSMETICS-OWNERSHIP-001
```
Given: Pet A has purchased cos_hat_cap_blue
When: User switches to Pet B and views shop
Then: cos_hat_cap_blue shows "Owned by Munchlet" (or similar)
And: CTA shows "Buy for [Pet B] — X💎"
And: Pet B can purchase the same SKU
```

#### BCT-COSMETICS-OWNERSHIP-002
```
Given: Pet A owns cos_hat_cap_blue
And: Pet B purchases cos_hat_cap_blue
Then: Both Pet A and Pet B have cos_hat_cap_blue in their cosmeticsOwnedByPetId
And: Both can equip independently
```

#### BCT-COSMETICS-EQUIP-GUARD-001
```
Given: Pet A owns cos_hat_cap_blue
And: Pet B does NOT own cos_hat_cap_blue
When: Code attempts equipCosmetic('cos_hat_cap_blue', 'pet_b')
Then: Action is blocked (returns false or throws)
And: Pet B's equipped state is unchanged
```

#### BCT-COSMETICS-INVARIANT-001
```
Given: Pet has equipped cos_aura_rainbow (Legendary)
When: Pet gains XP from feeding
Then: XP gain is unchanged from baseline (no cosmetic bonus)
```

#### BCT-GEM-SOURCES-001
```
Given: Pet is level 4
When: Pet reaches level 5
Then: Player receives +5 gems
And: Toast displays "+5💎 Level Up!"
```

### Constants to Add (bible.constants.ts)

```typescript
// Cosmetic Slots (Bible v1.9 §11.5.3)
export const COSMETIC_SLOTS = ['hat', 'accessory', 'outfit', 'aura', 'skin'] as const;
export type CosmeticSlot = typeof COSMETIC_SLOTS[number];

export const COSMETIC_SLOT_PREFIXES: Record<CosmeticSlot, string[]> = {
  hat: ['cos_hat_'],
  accessory: ['cos_scarf_', 'cos_accessory_'],
  outfit: ['cos_outfit_'],
  aura: ['cos_aura_'],
  skin: ['cos_skin_'],
} as const;

// Cosmetic Rarity Tiers (Bible v1.9 §11.5.4)
// NOTE: Visual presentation (colors, gradients) should be handled in UI layer,
// not in bible.constants.ts, to keep tests stable.
export const COSMETIC_RARITY = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type CosmeticRarity = typeof COSMETIC_RARITY[number];

export const COSMETIC_RARITY_GEM_RANGE: Record<CosmeticRarity, { min: number; max: number }> = {
  common: { min: 10, max: 20 },
  uncommon: { min: 20, max: 40 },
  rare: { min: 40, max: 70 },
  epic: { min: 70, max: 120 },
  legendary: { min: 120, max: 300 },
} as const;

// Gem Sources (Bible v1.9 §11.4)
export const GEM_SOURCES = {
  LEVEL_UP: 5,
  FIRST_FEED_DAILY: 1,
  FIRST_FEED_DAILY_PLUS: 3,  // [Unity Later]
  LOGIN_STREAK_DAY_7: 10,
} as const;
```

---

## Implementation Notes

### State Shape (Recommended)

```typescript
// In store.ts or dedicated cosmetics slice

interface CosmeticsSlice {
  // Per-pet ownership (NOT global)
  cosmeticsOwnedByPetId: Record<string, string[]>;
  
  // Per-pet equipped state
  cosmeticsEquippedByPetId: Record<string, {
    hat: string | null;
    accessory: string | null;
    outfit: string | null;
    aura: string | null;
    skin: string | null;
  }>;
}

// Actions
purchaseCosmeticForPet(cosmeticId: string, petId: string): void;
equipCosmetic(cosmeticId: string, petId: string): void;
unequipCosmetic(slot: CosmeticSlot, petId: string): void;

// Selectors
getCosmeticsOwnedByPet(petId: string): string[];
getEquippedCosmetics(petId: string): EquippedCosmetics;
doesPetOwnCosmetic(petId: string, cosmeticId: string): boolean;
getPetsThatOwnCosmetic(cosmeticId: string): string[];  // For "Owned by [Pet]" UI in shop
```

### Save Migration (v4 → v5)

```typescript
// Add to save migration logic
if (saveVersion < 5) {
  // Initialize empty cosmetics state
  state.cosmeticsOwnedByPetId = {};
  state.cosmeticsEquippedByPetId = {};
  
  // Initialize for all owned pets
  for (const petId of state.ownedPets) {
    state.cosmeticsOwnedByPetId[petId] = [];
    state.cosmeticsEquippedByPetId[petId] = {
      hat: null,
      accessory: null,
      outfit: null,
      aura: null,
      skin: null,
    };
  }
  
  state.saveVersion = 5;
}
```

### Gem Sources Implementation (P11-0)

```typescript
// Level-up gem award
function onLevelUp(newLevel: number) {
  awardGems(GEM_SOURCES.LEVEL_UP);
  showToast(`+${GEM_SOURCES.LEVEL_UP}💎 Level Up!`);
}

// First feed daily tracking
interface DailyState {
  hasClaimedFirstFeedGem: boolean;
  lastFirstFeedDate: string | null;  // ISO date string
}

function onFeed() {
  const today = new Date().toISOString().split('T')[0];
  if (state.lastFirstFeedDate !== today) {
    state.hasClaimedFirstFeedGem = false;
  }
  
  if (!state.hasClaimedFirstFeedGem) {
    awardGems(GEM_SOURCES.FIRST_FEED_DAILY);
    showToast(`+${GEM_SOURCES.FIRST_FEED_DAILY}💎 Daily Bonus!`);
    state.hasClaimedFirstFeedGem = true;
    state.lastFirstFeedDate = today;
  }
}

// Login streak (Day 7)
function onDailyLogin() {
  state.loginStreak = calculateStreak(state.lastLoginDate);
  if (state.loginStreak === 7) {
    awardGems(GEM_SOURCES.LOGIN_STREAK_DAY_7);
    showToast(`+${GEM_SOURCES.LOGIN_STREAK_DAY_7}💎 Week Streak!`);
  }
}
```

---

## Implementation Sequence (Recommended)

| Phase | Scope | Prereq | Tests | Deliverables |
|-------|-------|--------|-------|--------------|
| **P11-0** | Gem Sources | None | 10 | Level-up, first-feed, login streak gems |
| **P11-A** | Cosmetics State | P11-0 | 8 | State shape, save migration v6 |
| **P11-B** | Cosmetics Data | P11-A | 4 | All items from §11.5 Category 2 |
| **P11-C** | Purchase Flow | P11-B | 12 | Pet-bound purchase, duplicate block, "Buy for [Pet]" when owned by other |
| **P11-D** | Equip System | P11-C | 10 | Slot rules, ownership guard (block if not owned by active pet) |
| **P11-E** | Render Layer | P11-D | 4 | Overlay system, fallback handling |
| **P11-F** | Rarity UI | P11-E | 4 | Borders, badges, glow effects |
| **P11-G** | Shop Integration | P11-F | — | Cosmetics tab per §14.7.3 |
| **P11-H** | Inventory Integration | P11-G | — | Cosmetics section per §14.8.3 |
| **P11-I** | BCT Gap Analysis | P11-H | — | Full BCT suite verification |
| **P11-J** | CE/QA Gate | P11-I | — | Three-gate approval |
| **Total** | — | — | **~52** | — |

**Note:** Non-transfer logic is distributed across P11-C (shop "owned by other pet" state) and P11-D (equip ownership guard), not a separate phase.

---

## Cross-Reference Updates

After applying Bible v1.9, update these documents:

| Document | Update Required |
|----------|-----------------|
| `TASKS.md` | Add P11-0 (Gem Sources) before P11-1; rename Phase 10 Lore Journal → Phase 10.5 |
| `GRUNDY_DEV_STATUS.md` | Update Bible version to v1.9; update gap table |
| `GRUNDY_ONBOARDING_FLOW.md` | Fix currency copy (Patch 11) |
| `docs/BIBLE_COMPLIANCE_TEST.md` | Add BCT v2.5 with ~52 new test specs |
| `ORCHESTRATOR.md` | Add P11 phase plan reference |

---

## Verification Checklist

After applying this patch, verify:

### Core Sections
- [ ] §11.1 currency hierarchy updated (coins = food/care only)
- [ ] §11.5.2 exists with pet-bound ownership model
- [ ] §11.5.3 exists with slot definitions and equip rules
- [ ] §11.5.4 exists with rarity display specs
- [ ] §14.7.3 exists with Cosmetics tab UI spec
- [ ] §14.8.3 exists with Cosmetics inventory spec

### Implementation Tags
- [ ] §11.4 gem sources table has implementation tags
- [ ] P11-0 prerequisite section added

### Gap Table & Phase Numbers
- [ ] §15.6 gap table shows P8/P9/P10 as ✅ Implemented
- [ ] §15.6 includes Phase 11-0 as blocker
- [ ] §15.6 includes phase numbering clarification

### Mode Support
- [ ] §9.3 includes cosmetics note (works in both modes)

### Secondary Documents
- [ ] GRUNDY_ONBOARDING_FLOW.md currency copy updated

### Header Update
- [ ] Bible header version updated to v1.9
- [ ] Changelog entry added

---

## Known Errata (Carried Forward)

| Issue | Status | Notes |
|-------|--------|-------|
| §9.5 vs §9.4.7.2 poop sickness % | Open | Implementation uses 15% (§9.4.7.2 precedence) |

---

## Summary of Changes

| Patch | Section | Change Type |
|-------|---------|-------------|
| 1 | §11.1 | **Fix** — Currency consistency (coins ≠ cosmetics) |
| 2 | §11.5.2 | **New** — Pet-bound ownership model |
| 3 | §11.5.3 | **New** — Slots, equip rules, non-transfer |
| 4 | §11.5.4 | **New** — Rarity display specs |
| 5 | §14.7.3 | **New** — Cosmetics shop tab UI |
| 6 | §14.8.3 | **New** — Cosmetics inventory UI |
| 7 | §11.4 | **Update** — Gem source implementation tags |
| 8 | §15.6 | **Update** — Gap table (P8-P10 complete) |
| 9 | §15.6 | **New** — Phase numbering clarification |
| 10 | §9.3 | **New** — Cozy mode cosmetics note |
| 11 | Onboarding | **Fix** — Currency copy alignment |

---

*End of Bible v1.9 Patch*
