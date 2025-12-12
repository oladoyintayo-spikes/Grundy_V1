# GRUNDY MASTER BIBLE — v1.6 UPDATE (RECOMMENDED)

**Update Type:** Additive (new sections + minor corrections)  
**Target File:** `docs/GRUNDY_MASTER_BIBLE.md`  
**Canonical Baseline:** Bible v1.5 (Production Reference)  
**New Version:** v1.6 (December 2025)

---

## Why this update exists

Phase 0–7 are complete for Web (“First Light” + Phase 6 compliance + Phase 7 Neglect runtime).  
Phase 8+ is next (Shop + Inventory), and we want the Bible to:

1) Specify Shop/Inventory clearly (design locked, implementation pending), and  
2) Stop lying about what’s already implemented (Phase 6/7 items still marked “not yet implemented”).

---

## Scope (v1.6)

### Add
- **§5.8 Starting Resources** (starter coins / gems / initial inventory assumptions)
- **§11.5.1 Individual Food Purchase** (quantity selector, affordability checks, atomic transaction rules)
- **§11.7.1 Inventory Stacking** (slot/stack semantics + bundle decomposition behavior)
- **§14.7 Shop UI Structure [Web Phase 8]**
- **§14.8 Inventory UI Structure [Web Phase 8]**

### Fix / Cleanup
- **§1.6 Current Implementation Status** table must reflect Phase 6 + Phase 7 reality.
- **End-of-document footer** must NOT be stuck on “December 2024 (v1.4)”.
- Remove any remaining “hardcoded starter gems” copy; FTUE must reference §5.8.

### Non-goals
- Do **NOT** implement Shop/Inventory code here.
- Do **NOT** change any locked invariants (mini-game rewards, FTUE copy, evo thresholds, etc.).

---

## Step-by-step instructions (apply to `docs/GRUNDY_MASTER_BIBLE.md`)

### 1) Update header metadata + changelog
At the top of the file:
- Set:
  - `**Version:** 1.6`
  - `**Last Updated:** December 2025`
- Add a changelog line **above** v1.5:

> `- v1.6: Shop + Inventory (Web Phase 8) — Added starter resources (§5.8), individual food purchase rules (§11.5.1), inventory stacking semantics (§11.7.1), and UI specs for Shop/Inventory (§14.7–§14.8). Updated §1.6 and end footer for accuracy.`

### 2) Update §1.6 Tag Definitions (add Phase 8 tags)
In the Tag Definitions table, add:

- `**[Web Phase 8]**` — Designed/locked for Web Phase 8 (Shop + Inventory)  
- `**[Web Phase 8+]**` — Designed/locked for Web Phase 8 or later (Pet Slots + expansions)

### 3) Fix §1.6 “Current Implementation Status” table
Replace the stale statuses (Phase 6/7 items marked “not yet implemented”) with an honest table like:

| Section | Tag | Status |
|---------|-----|--------|
| §4.3 Cooldown System | [Web Phase 6+] | Implemented (Web Phase 6) |
| §4.4 Fullness States | [Web Phase 6+] | Implemented (Web Phase 6) |
| §9 Cozy vs Classic Mode | [Web Phase 6+] | Implemented (Mode Config + helpers) |
| §9.4.3 Neglect & Withdrawal | [Web Phase 6+] | Implemented (Web Phase 7, Classic-only) |
| §14.4 Rooms (activity-based) | [Web Phase 6+] | Implemented (activity→room mapping + TOD) |
| §14.5 Navigation Structure | [Web 1.0] | Implemented (Home/Games/Settings + Settings pet switch) |
| §11.5 Shop (Phase 8 subset) | [Web Phase 8] | Not yet implemented |
| §11.7 Inventory (Phase 8 subset) | [Web Phase 8] | Not yet implemented |
| §11.6 Pet Slots | [Web Phase 8+] | Not yet implemented |
| §11.9 Season Pass | [Unity Later] | Not in Web |
| §11.10 Rewarded Ads | [Unity Later] | Not in Web |

> Note: if you want Navigation tagged differently, keep **status** accurate even if tags shift.

### 4) Insert §5.8 Starting Resources (new)
Under Section 5 (Food & Feeding), add:

#### `## 5.8 Starting Resources [Web Phase 8]`

**Design intent:** ensure Shop/Inventory has a clear baseline.

**Start state (new player after FTUE completion):**
- Coins: **100**
- Gems: **0**
- Starter Inventory: **empty** (unless you explicitly choose “starter snack pack”; if so, list it here)
- No starter gem grants in Web.

**Compatibility notes**
- Mini-games on Web still award **no gems** (Bible/BCT invariant).
- Any gem acquisition sources (non-mini-game) remain as previously defined; this section only pins start state.

### 5) Update FTUE references to Starting Resources (no hardcoded gems)
Find any FTUE rules that reference starter gem amounts (e.g., “10 gems”).
- Replace with: “see §5.8 Starting Resources”.

### 6) Insert §11.5.1 Individual Food Purchase (new)
Under §11.5 The Shop (Complete), insert:

#### `### 11.5.1 Individual Food Purchase [Web Phase 8]`

Rules:
- Shop sells **foods** (and Phase 8 bundles). Non-food “care items” stay **Future** unless already implemented.
- Purchase uses **coins** (gems are not required for Phase 8 Shop baseline unless you explicitly decide otherwise).
- Quantity selector:
  - Default qty = 1
  - Range: 1–99 (UI may cap lower; logic caps at max-stack rules)
- Affordability: if coins < price × qty → block purchase, show clear error.
- Transaction atomicity:
  - On success: decrement coins, add items to inventory (stacking rules §11.7.1)
  - On failure: no partial inventory writes, no partial coin decrement.

Bundles:
- Buying a bundle decomposes into its item list and applies stacking rules exactly as if purchased individually.

### 7) Insert §11.7.1 Inventory Stacking (new)
Under §11.7 Inventory Slots, insert:

#### `### 11.7.1 Inventory Stacking [Web Phase 8]`

Definitions:
- Inventory is keyed by `itemId`.
- Each `itemId` has a stack count up to **99** (unless item overrides).
- If a purchase would exceed max stack:
  - Block purchase with a clear error (no partial adds)
  - OR (if you prefer) clamp and refund excess — but pick **one** behavior and lock it (recommended: block).

Bundle decomposition:
- Decompose bundles before writing inventory.
- Apply stacking in a deterministic order (listed order or sorted by itemId; pick one and lock).

### 8) Insert UI specs for Shop/Inventory (new)
Under §14 UI/UX Design:

#### `## 14.7 Shop UI Structure [Web Phase 8]`
- Entry point (Phase 8): via **Settings** and/or a Home “Shop” action (keep BottomNav stable unless you explicitly choose to expand it).
- Tabs/Categories: Food (Phase 8), Bundles (Phase 8), Care (Future), Cosmetics (Future), Gems (Unity Later / optional).
- For Phase 8 baseline: only Food + Bundles must be functional.

#### `## 14.8 Inventory UI Structure [Web Phase 8]`
- Inventory list/grid of owned items with stack counts.
- Filter by type (Food now; others Future).
- “Use” action for food routes back into Feed flow (if implemented later, keep it spec-only here).

### 9) Fix §15.6 and/or “Known Prototype Gaps” if it still claims Phase 6/7 are missing
If §15.6 still says cooldown/fullness/neglect/rooms are missing, update it to match reality:
- Mark Phase 6 + Phase 7 work as done.
- Keep Shop/Inventory/Pet Slots explicitly pending.

### 10) Fix the end-of-document footer (the v1.4 issue)
At the very bottom, update:

`**Last Updated:** December 2024 (v1.4)` → `**Last Updated:** December 2025 (v1.6)`

Also ensure the footer version matches the header version (no mixed v1.5/v1.4).

---

## Verification checklist (doc-only)
Run these repo checks after editing:

```bash
rg "\*\*Version:\*\*" docs/GRUNDY_MASTER_BIBLE.md
rg "Last Updated:" docs/GRUNDY_MASTER_BIBLE.md
rg "December 2024 \(v1\.4\)" docs/GRUNDY_MASTER_BIBLE.md
rg "Current Implementation Status" -n docs/GRUNDY_MASTER_BIBLE.md
rg "## 5\.8 Starting Resources" docs/GRUNDY_MASTER_BIBLE.md
rg "### 11\.5\.1 Individual Food Purchase" docs/GRUNDY_MASTER_BIBLE.md
rg "### 11\.7\.1 Inventory Stacking" docs/GRUNDY_MASTER_BIBLE.md
rg "## 14\.7 Shop UI Structure" docs/GRUNDY_MASTER_BIBLE.md
rg "## 14\.8 Inventory UI Structure" docs/GRUNDY_MASTER_BIBLE.md
```

Expected:
- Exactly one header version line (“Version: 1.6”) and one footer “Last Updated: December 2025 (v1.6)”.
- No lingering “December 2024 (v1.4)” footer text.

