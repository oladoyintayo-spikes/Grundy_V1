# GRUNDY MASTER BIBLE — v1.6 UPDATE (Shop + Inventory for Web)

**Update Type:** Additive + corrective (new sections + small consistency fixes)  
**Primary Goal:** Define **Shop + Inventory** behavior for Web (Phase 8), with BCT-ready rules.  

**Sections Added:**
- §5.8 Starting Resources
- §11.5.1 Individual Food Purchase (and purchase rules)
- §11.7.1 Inventory Stacking (slot + stack semantics)
- §14.7 Shop UI Structure [Web Phase 8]
- §14.8 Inventory UI Structure [Web Phase 8]

**Sections Modified (minor consistency):**
- Header / Changelog metadata
- §7.8 FTUE Rules (starter resources line references §5.8)
- §15.6 Web Prototype Mapping — **Known Prototype Gaps** table + “Critical Gaps” list updated to current reality

---

## Instructions (apply to `docs/GRUNDY_MASTER_BIBLE.md`)

1. Update the **Version / Last Updated / Changelog** at the top (see patch block below).
2. Apply the **minor consistency edit** to §7.8 FTUE Rules (see patch block below).
3. Insert the **new sections** at the specified locations.
4. Replace §15.6 “Known Prototype Gaps” table + “Critical Gaps” list with the updated versions below.

---

## PATCH: Header + Changelog (top of file)

Replace the header fields + prepend a v1.6 changelog line:

```markdown
**Version:** 1.6
**Last Updated:** December 2025
...
**Changelog:**
- v1.6: Shop + Inventory (Web Phase 8) — Added starter resources (§5.8), individual food purchase rules (§11.5.1), inventory stacking semantics (§11.7.1), and UI specs for Shop/Inventory (§14.7–§14.8). Updated §15.6 gaps to match current Web state.
- v1.5: ...
```

> **Note:** Keep prior changelog entries intact; just add v1.6 on top.

---

## PATCH: §7.8 FTUE Rules (minor consistency edit)

In §7.8 FTUE Rules, replace the starter resources bullet to align with §5.8:

```markdown
8. ✅ Starter resources provided (see §5.8)
```

(If the FTUE list currently hardcodes “10 gems”, remove that hardcode in favor of §5.8.)

---

## NEW SECTION: §5.8 Starting Resources

Insert after §5.7 Weight System (Snack Risk) and before **# 6. PROGRESSION & UNLOCKS**:

```markdown
## 5.8 Starting Resources

These values define what a **brand-new save** starts with.

### New Player Defaults

| Resource | Value | Rationale |
|----------|-------|-----------|
| Coins | 100 🪙 | Enables early Shop interactions without grinding |
| Gems | 0 💎 | Gems feel special when first earned; avoids early “spend it wrong” moments |
| Inventory Capacity | 15 slots | Matches §11.7 base capacity |

### Tutorial Starter Inventory

On a brand-new save, the player starts with:

| Item | Quantity | Notes |
|------|----------|------|
| Apple 🍎 | 2 | Common, safe, reliable |
| Banana 🍌 | 2 | Common, helps early affinity variety |
| Cookie 🍪 | 1 | Ensures at least one “Loved” reaction during tutorial |

> Starter items are **inventory items**, not “free feed events.”
```

---

## NEW SECTION: §11.5.1 Individual Food Purchase (and purchase rules)

Insert inside §11.5 **after “Shop Unlock Timeline”** and **before “Category 1: Food & Care Items”**:

```markdown
### 11.5.1 Individual Food Purchase

Players can buy foods **individually** OR as **bundles**.

| Purchase Type | Available | Notes |
|---------------|-----------|-------|
| Individual (1× to 10×) | All foods listed in §5.4 | Precision buying for specific needs |
| Bundles | Items listed under “Food & Care Items” | Discounted stockpiling; some are contextual |

#### Individual Food Prices (canonical)

Individual food prices match §5.4 “Complete Food Table” **Cost** column and are **coins only**.

#### Item IDs and Inventory Behavior

- **Individual foods** use the **base food id** from the food dataset (e.g., `apple`, `banana`, `cookie`).
- **Bundles** use their existing shop ids (e.g., `food_apple_x5`, `food_spicy_x3`).
- **Inventory stores consumables by base item id** (see §11.7.1).  
  - Bundles must **decompose into base items** when added to inventory.
  - Example: buying `food_apple_x5` adds `inventory.apple += 5`.

#### Quantity Selector Rules (individual purchases)

| Rule | Value |
|------|-------|
| Minimum | 1 |
| Maximum | 10 per transaction |
| Stack limit | 99 max per item id (see §11.7.1) |

#### Purchase Flow (coins + inventory)

1. Compute `totalCost = unitCost * quantity`
2. If `coins < totalCost` → block purchase with “Not enough coins!”
3. Validate inventory:
   - If purchase would exceed **slot capacity** (new slot required but no slots free) → block with “Inventory full!”
   - If purchase would exceed **stack max** for any item id → block with “Inventory full!”
4. On success: deduct coins, add items to inventory

> “Inventory full” is the single error message for both slot exhaustion and stack overflow.
```

---

## NEW SECTION: §11.7.1 Inventory Stacking

Insert immediately after §11.7 “Overview”:

```markdown
### 11.7.1 Inventory Stacking

Inventory is a **slot-based** collection of **stacking consumables**.

#### Definitions

- **Slot**: one unique item id present in inventory with quantity > 0
- **Stack**: the quantity for an item id
- **Base Capacity**: 15 slots (see §11.7)

#### Stack Rules

| Rule | Value | Notes |
|------|-------|------|
| Stack max | 99 per item id | Hard cap |
| Slot counting | Unique ids only | `apple: 50` uses 1 slot |
| Zero quantity | Removes the slot | Item disappears from inventory |

#### What counts as “Inventory Full”

A purchase must be blocked if:
- It would create a **new slot** but no slots remain, OR
- It would increase any item stack above **99**

#### Bundle Decomposition

Bundle items must add **multiple base items** to inventory.
All bundle decomposition must respect:
- Slot availability (for any new ids introduced)
- Stack max 99 per id
```

---

## NEW SECTION: §14.7 Shop UI Structure [Web Phase 8]

Insert after §14.6 Mobile Layout Constraints:

```markdown
## 14.7 Shop UI Structure [Web Phase 8]

### Web Shop Tabs (Web Edition)

The Web Shop UI uses four tabs for clarity and future-proofing:

| Tab | Purpose | Status |
|-----|---------|--------|
| Food | Bundles + Individual foods | Active |
| Care | Care consumables (some contextual) | Active |
| Cosmetics | Future cosmetics system | “Coming Soon” stub |
| Gems | Future IAP / gem purchase | Locked stub (see level gating) |

> This is a **Web UI subset** over the broader Shop categories defined in §11.5.

### Food Tab Layout

- **Bundles** section appears first (“Best Value”)
- **Individual Foods** section appears second
- Individual foods are sorted by rarity: **Common → Uncommon → Rare → Epic → Legendary**
  - Within rarity, alphabetical is acceptable

### Care Tab Layout

- Shows care items from §11.5 “Food & Care Items”
- Contextual items may be hidden unless eligible:
  - `care_diet_food` shown only when `weight >= 31` (Chubby+)
  - `care_medicine` shown only in **Classic mode**
- Includes a “Recommended For You” section when triggers exist

### “Recommended For You” (Web Phase 8, deterministic)

The Shop may highlight up to **3** recommended items using this priority order:

1. Sick (Classic) → `care_medicine`
2. Energy < 20 → `care_energy_drink`
3. Hunger < 30 → `food_balanced_x5` (or the closest available “balanced” bundle)
4. Mood < 40 → `care_mood_boost`
5. Weight >= 31 → `care_diet_food`

If none apply, the Recommended section is hidden.

> If a recommended item is not eligible/visible (mode gating, weight gating), skip it and continue down the priority list.

### Purchase Modal

When selecting an item to buy:
- Shows item name, icon, description, unit cost, and total cost
- Supports quantity selection **for individual foods only** (1–10)
- Bundles and care items are always quantity = 1 (Web Phase 8)

### Purchase Feedback

- Success: toast/snackbar “Purchased!”
- Failure (coins): “Not enough coins!”
- Failure (inventory): “Inventory full!”
```

---

## NEW SECTION: §14.8 Inventory UI Structure [Web Phase 8]

Insert immediately after §14.7:

```markdown
## 14.8 Inventory UI Structure [Web Phase 8]

### Inventory Tabs

| Tab | Shows | Notes |
|-----|-------|------|
| Food | Food consumables | Uses base food ids |
| Care | Care consumables | Includes eligible contextual care items |

### Inventory Header

- Slot counter always visible: `X / 15` (or expanded capacity if applicable)
- Optional: sort (future) — default: rarity desc

### Item Cards

Each item card shows:
- Icon + name
- Rarity (badge or subtle label)
- Quantity badge (e.g., “×12”)

### Item Detail Modal

On click:
- Shows item name, icon, rarity
- Shows quantity owned
- For foods: shows affinity reactions for all pets (Loved/Liked/Neutral/Disliked)
- Primary action: **“Use on Pet”**
  - Navigates into the feeding flow with this item preselected (or opens feed modal)

### Empty State

If inventory is empty:
- Show a friendly empty message
- Show CTA button: “Go to Shop”
```

---

## UPDATE: §15.6 Web Prototype Mapping (Known Prototype Gaps + Critical Gaps)

In §15.6, replace the “Known Prototype Gaps” table and “Critical Gaps (Phase 6 Priority)” list with the following:

```markdown
### Known Prototype Gaps (Updated December 2025)

| Feature | Bible Spec | Web Status | Target Phase |
|---------|------------|-----------:|--------------|
| Shop (Food/Care) | §11.5, §11.5.1, §14.7 | ❌ Not implemented | Phase 8 |
| Inventory (slots + stacking) | §11.7, §11.7.1, §14.8 | ❌ Not implemented | Phase 8 |
| Pet Slots (multi-pet) | §11.7 + Utility / slot specs | ❌ Not implemented | Phase 9 |
| Sickness System (Classic) | §5.4 risk + Classic systems | ❌ Not implemented | Phase 9 |
| Weight consequences (beyond meter) | §5.7 | ⚠️ Design-defined; runtime TBD | Phase 9 |
| Care Mistakes (Classic) | Classic-only systems | ❌ Not implemented | Phase 9+ |
| Lore Journal | Phase 10 | ❌ Not implemented | Phase 10 |
| Cosmetics system | §11.5 Category 2 + Phase 11 | ❌ Not implemented | Phase 11 |
| LiveOps layer | Phase 12+ | ❌ Not implemented | Phase 12+ |

### Critical Gaps (Next Priority)

The following gaps block Phase 8 delivery:

| Gap | Bible Section | Why it matters |
|-----|--------------|----------------|
| No Shop runtime | §11.5–§11.5.1, §14.7 | Players can’t acquire items intentionally |
| No Inventory runtime | §11.7–§11.7.1, §14.8 | Shop has nowhere to put purchases |
| No bundle decomposition | §11.7.1 | Bundles must become real consumables |

> Earlier Phase 6 “critical gaps” (cooldowns, fullness, HUD separation, room mapping, etc.) have been addressed in Web 1.x and should not be listed here as pending.
```

---

## END OF v1.6 UPDATE

**Summary of Changes**
- Starter resources are now canonical (§5.8) and referenced by FTUE (§7.8).
- Shop now supports individual foods + purchase rules (§11.5.1).
- Inventory stacking + slot semantics are explicitly defined (§11.7.1).
- Web UI specs for Shop/Inventory are defined (§14.7–§14.8).
- §15.6 “Known Prototype Gaps” updated to match current Web reality (Phase 0–7 complete; Phase 8+ pending).
