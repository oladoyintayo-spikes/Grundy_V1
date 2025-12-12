# BIBLE COMPLIANCE TEST — v2.2 UPDATE (RECOMMENDED)

**Update Type:** Draft test specifications for Shop + Inventory (Phase 8)  
**Target Doc:** `docs/BIBLE_COMPLIANCE_TEST.md`  
**Status:** **DRAFT — DO NOT ACTIVATE IN CI UNTIL PHASE 8 MERGES**  

> Rationale: Web Phase 0–7 are stable and passing BCT v2.1.  
> Shop + Inventory are Phase 8 features. We keep v2.2 as a spec update, then activate tests when the code lands.

---

## Goals (v2.2)

- Define BCT coverage for **coins-based Food purchases** and **Inventory stacking**.
- Ensure rules are pulled from `src/constants/bible.constants.ts` once Phase 8 is implemented.
- Avoid adding failing tests to the current canonical suite until Phase 8 is ready.

---

## Dependencies (Bible refs)

- §5.8 Starting Resources (v1.6)
- §11.5.1 Individual Food Purchase (v1.6)
- §11.7.1 Inventory Stacking (v1.6)
- §11.11 Bundles & Starter Packs (existing Bible section, if used)

---

## Activation rule

When Shop/Inventory implementation PR lands:
- Add `bct-shop.spec.ts` and `bct-inventory.spec.ts` to the BCT runner.
- Until then:
  - Keep these specs in the **doc only**, OR
  - Gate the tests behind a `FEATURE_SHOP_PHASE8` flag and `describe.skip` by default.

---

## Proposed new tests (24 total)

### A) Shop — Food + Bundles (12)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-001 | Starting coins are 100 | §5.8 | New save has coins=100 |
| BCT-SHOP-002 | Starting gems are 0 | §5.8 | New save has gems=0 |
| BCT-SHOP-003 | Price matrix (food) exists + non-negative | §11.5.1 | Every shop food has price >= 0 |
| BCT-SHOP-004 | Quantity selector defaults to 1 | §11.5.1 | UI/model qty starts at 1 |
| BCT-SHOP-005 | Insufficient coins blocks purchase | §11.5.1 | Error returned, no state change |
| BCT-SHOP-006 | Purchase deducts coins exactly | §11.5.1 | coins -= price*qty |
| BCT-SHOP-007 | Purchase adds item(s) to inventory | §11.5.1 / §11.7.1 | inventory[itemId] += qty |
| BCT-SHOP-008 | Purchase is atomic (no partial writes) | §11.5.1 | On failure: coins & inventory unchanged |
| BCT-SHOP-009 | Bundle decomposes into items | §11.5.1 / §11.7.1 | Inventory updated per bundle contents |
| BCT-SHOP-010 | Bundle purchase respects stacking cap | §11.7.1 | If any item would exceed cap → block (atomic) |
| BCT-SHOP-011 | Max stack (99) blocks overflow purchase | §11.7.1 | Block when result > 99 |
| BCT-SHOP-012 | No gems are awarded by Shop purchase | §11.5.1 | gems unchanged after purchase |

> Note: remove “Gems tab” / “Medicine visible” tests until you explicitly decide to monetize gems on Web and/or implement sickness/care items.

### B) Inventory — stacking semantics (12)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-001 | Empty inventory on new save (unless starter pack) | §5.8 | inventory is empty (or matches starter pack definition) |
| BCT-INV-002 | Adding a new item creates a stack | §11.7.1 | inventory[itemId] created with count |
| BCT-INV-003 | Adding same item increments count | §11.7.1 | count increases deterministically |
| BCT-INV-004 | Stack cap is 99 | §11.7.1 | cap constant enforced |
| BCT-INV-005 | Overflow blocks (recommended behavior) | §11.7.1 | no partial, returns error |
| BCT-INV-006 | Bundle decomposition order is deterministic | §11.7.1 | consistent results across runs |
| BCT-INV-007 | Multiple items in bundle update correctly | §11.7.1 | each item updated accurately |
| BCT-INV-008 | Inventory counts never go negative | §11.7.1 | invariants hold after ops |
| BCT-INV-009 | Consuming an item decrements count | §11.7.1 | count -= 1 (if consume exists) |
| BCT-INV-010 | Consuming at 0 blocks | §11.7.1 | error, no state change |
| BCT-INV-011 | Inventory serialization is stable | §11.7.1 | save/load roundtrip identical |
| BCT-INV-012 | Inventory UI shows stack counts | §14.8 | rendered count matches state |

> If “consume” is not implemented in Phase 8, keep INV-009/010 as **Future** tests and replace with UI-only checks.

---

## Suggested doc patch structure in `docs/BIBLE_COMPLIANCE_TEST.md`

Add a new section:

- `## Shop & Inventory (Phase 8) — BCT v2.2 Draft`

Include the two tables above, plus the activation rule.

