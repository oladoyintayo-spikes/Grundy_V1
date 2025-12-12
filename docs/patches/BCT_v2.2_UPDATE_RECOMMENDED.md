# BIBLE COMPLIANCE TEST — v2.2 UPDATE (Shop + Inventory)

**Update Type:** Additive (new test specifications)  
**Tests Added:**
- BCT-SHOP-001 through BCT-SHOP-025
- BCT-INV-001 through BCT-INV-017
- BCT-ECON-001 through BCT-ECON-005  
**Total New Tests:** 47

---

## Instructions

Add these test specifications to `docs/BIBLE_COMPLIANCE_TEST.md` under new sections:
- **BCT-SHOP**
- **BCT-INV**
- **BCT-ECON**

These tests are scoped to the **Web Phase 8** Shop + Inventory implementation defined in Bible v1.6 (§5.8, §11.5.1, §11.7.1, §14.7–§14.8), and existing Shop baseline in §11.5.

---

## BCT-SHOP: Shop System Tests

### Pricing & Catalog Tests

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-001 | Individual food prices match §5.4 | §5.4, §11.5.1 | Unit price for each individual food equals §5.4 Cost column |
| BCT-SHOP-002 | Bundle + care item prices match Shop table | §11.5 | Each shop item id has correct price (coins/gems) as defined in §11.5 |
| BCT-SHOP-003 | Individual foods are coins-only | §11.5.1 | All individual food purchases require coins; gem cost must be null/0 |
| BCT-SHOP-004 | Food tab ordering: Bundles before Individual | §14.7 | UI renders Bundles section above Individual section |

### Quantity Selector & Cost Math

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-005 | Quantity selector min=1 | §11.5.1 | Quantity cannot be set below 1 |
| BCT-SHOP-006 | Quantity selector max=10 | §11.5.1 | Quantity cannot be set above 10 |
| BCT-SHOP-007 | Total cost = unitCost × quantity | §11.5.1 | Purchase modal displays totalCost correctly for individual foods |

### Purchase Flow (Coins + Inventory)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-008 | Successful purchase deducts coins | §11.5.1 | coins decreases by totalCost; no other currency changes |
| BCT-SHOP-009 | Successful individual purchase adds to inventory | §11.5.1, §11.7.1 | inventory[foodId] += quantity (base ids) |
| BCT-SHOP-010 | Successful bundle purchase decomposes to base items | §11.7.1 | Buying bundle increases multiple base ids (no bundle id stored in inventory) |
| BCT-SHOP-011 | Insufficient coins blocks purchase | §11.5.1 | Returns error “Not enough coins!”, no state change |
| BCT-SHOP-012 | Slot exhaustion blocks purchase | §11.7.1 | Returns error “Inventory full!”, no state change |
| BCT-SHOP-013 | Stack overflow blocks purchase (99+) | §11.7.1 | Returns error “Inventory full!”, no state change |

### Visibility & Gating

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-014 | Medicine hidden in Cozy mode | §11.5, §14.7 | `care_medicine` not in Care list when mode = cozy |
| BCT-SHOP-015 | Medicine visible in Classic mode | §11.5, §14.7 | `care_medicine` present when mode = classic |
| BCT-SHOP-016 | Diet Food hidden when weight < 31 | §5.7, §11.5, §14.7 | `care_diet_food` not present when weight < 31 |
| BCT-SHOP-017 | Diet Food visible when weight >= 31 | §5.7, §11.5, §14.7 | `care_diet_food` present when weight >= 31 |
| BCT-SHOP-018 | Gems tab locked below Level 5 | §11.5, §14.7 | Gems tab shows locked state when player level < 5 |
| BCT-SHOP-019 | Gems tab unlocks at Level 5+ | §11.5, §14.7 | Gems tab becomes active when player level >= 5 |
| BCT-SHOP-020 | Cosmetics tab is “Coming Soon” stub | §14.7 | Cosmetics tab renders stub state (no purchasable cosmetics in Web Phase 8) |

### Sorting

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-021 | Individual foods sorted by rarity | §14.7 | UI order is Common → Uncommon → Rare → Epic → Legendary |

### Recommendations (Deterministic)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-SHOP-022 | Recommended section hidden when no triggers | §14.7 | No “Recommended For You” section when all trigger conditions false |
| BCT-SHOP-023 | Recommended prioritizes sick→medicine | §14.7 | When classic + sick, first recommendation is `care_medicine` |
| BCT-SHOP-024 | Recommended includes energy drink at low energy | §14.7 | When energy < 20, includes `care_energy_drink` unless superseded by sick |
| BCT-SHOP-025 | Recommended includes balanced pack at low hunger | §14.7 | When hunger < 30, includes `food_balanced_x5` unless superseded by higher priorities |

> Recommendation tests should validate **presence + ordering** (priority) and must also verify that ineligible items are skipped.

---

## BCT-INV: Inventory System Tests

### Slot & Stack Semantics

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-001 | Base capacity is 15 slots | §11.7 | initialState.inventoryCapacity === 15 |
| BCT-INV-002 | Slot counts unique item ids only | §11.7.1 | inventoryUsedSlots = count(keys with qty>0) |
| BCT-INV-003 | Stack max is 99 per id | §11.7.1 | inventory[itemId] cannot exceed 99 |
| BCT-INV-004 | Quantity reaching 0 removes slot | §11.7.1 | Setting qty to 0 removes key or marks as empty |
| BCT-INV-005 | Purchase blocked when new slot required but none available | §11.7.1 | “Inventory full!”, no state change |
| BCT-INV-006 | Purchase allowed when item already exists (no new slot) | §11.7.1 | If item exists and stack allows, purchase succeeds |

### Bundle Decomposition

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-007 | Apple bundle adds 5 apples | §11.5, §11.7.1 | Buying `food_apple_x5` results in `inventory.apple += 5` |
| BCT-INV-008 | Spicy sampler decomposes correctly | §11.5, §11.7.1 | Buying `food_spicy_x3` adds `hot_pepper += 3` and `spicy_taco += 2` |

### Inventory UI (Web)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-009 | Food tab filters to food only | §14.8 | Food tab renders only food items |
| BCT-INV-010 | Care tab filters to care only | §14.8 | Care tab renders only care items |
| BCT-INV-011 | Item card shows quantity badge | §14.8 | Each item card displays “×N” |
| BCT-INV-012 | Slot counter shows X/15 | §14.8 | Header displays used/total slots |
| BCT-INV-013 | Empty state shows Shop CTA | §14.8 | When inventory empty, “Go to Shop” CTA exists |

### Item Detail & Use Flow

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-INV-014 | Detail modal shows quantity | §14.8 | Quantity displayed in modal |
| BCT-INV-015 | Detail modal shows rarity | §14.8 | Rarity displayed in modal |
| BCT-INV-016 | Detail modal shows affinities | §14.8 | For foods, affinity reactions for all pets are displayed |
| BCT-INV-017 | “Use on Pet” routes to feeding flow | §14.8 | Button triggers feed flow with item preselected |

---

## BCT-ECON: Economy Tests (Starting Resources)

| ID | Description | Bible Ref | Expected Result |
|----|-------------|-----------|-----------------|
| BCT-ECON-001 | New player starts with 100 coins | §5.8 | initialState.coins === 100 |
| BCT-ECON-002 | New player starts with 0 gems | §5.8 | initialState.gems === 0 |
| BCT-ECON-003 | Tutorial inventory: 2× Apple | §5.8 | inventory.apple === 2 |
| BCT-ECON-004 | Tutorial inventory: 2× Banana | §5.8 | inventory.banana === 2 |
| BCT-ECON-005 | Tutorial inventory: 1× Cookie | §5.8 | inventory.cookie === 1 |

---

## Summary

| Category | Test Count | Coverage |
|----------|------------|----------|
| BCT-SHOP | 25 | Prices, purchase flow, gating, UI structure, recommendations |
| BCT-INV | 17 | Capacity, stacking, decomposition, UI, detail/use flow |
| BCT-ECON | 5 | Starting resources + tutorial inventory |
| **Total** | **47** | — |

---

## END OF v2.2 UPDATE
