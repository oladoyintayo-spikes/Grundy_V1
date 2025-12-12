# P8-SHOP-B Audit Report

**Phase 8 Closeout Proof Packet + Phase 9 Regression Baseline**

---

## (i) Scope & Canonical Versions

| Field | Value |
|-------|-------|
| **Bible Version** | v1.6 |
| **BCT Version** | v2.2 |
| **Date** | 2025-12-12 |
| **Commit SHA** | `12fc312` (hygiene commit), continuing on branch |
| **Branch** | `claude/enable-playwright-e2e-01Hay5nQHzsVFW4FkBxzFqoh` |
| **Auditor** | Claude (Opus 4.5) |

---

## (ii) Bible/BCT Crosswalk Table

| Audited Behavior | Bible Section | BCT Test(s) | Status |
|------------------|---------------|-------------|--------|
| Individual food prices | §5.4 | BCT-SHOP-001 | ✅ Pass |
| Bundle + care item prices | §11.5 | BCT-SHOP-002 | ✅ Pass |
| Individual foods coins-only | §11.5 | BCT-SHOP-003 | ✅ Pass |
| Food tab: Bundles before Individual | §14.7 | BCT-SHOP-004 | ✅ Pass |
| Quantity selector min=1, max=10 | §11.5.1 | BCT-SHOP-005, BCT-SHOP-006 | ✅ Pass |
| Currency deducted, inventory updated | §11.5 | BCT-SHOP-010 | ✅ Pass |
| Insufficient coins blocks purchase | §11.5 | BCT-SHOP-011 | ✅ Pass |
| Inventory full blocks purchase | §11.7 | BCT-SHOP-012 | ✅ Pass |
| Stack limit (99) blocks purchase | §11.7.1 | BCT-SHOP-013 | ✅ Pass |
| Medicine visibility (Classic only) | §14.7 | BCT-SHOP-014, BCT-SHOP-015 | ✅ Pass |
| Diet Food visibility (weight ≥31) | §14.7 | BCT-SHOP-016, BCT-SHOP-017 | ✅ Pass |
| Gems tab gating (Level 5) | §14.7 | BCT-SHOP-018, BCT-SHOP-019 | ✅ Pass |
| Cosmetics tab stub | §14.7 | BCT-SHOP-020 | ✅ Pass |
| Individual foods sorted by rarity | §14.7 | BCT-SHOP-021 | ✅ Pass |
| Recommendations hidden when no triggers | §14.7 | BCT-SHOP-022 | ✅ Pass |
| Recommendations priority: sick→medicine | §14.7 | BCT-SHOP-023 | ✅ Pass |
| Recommendations: energy drink at low energy | §14.7 | BCT-SHOP-024 | ✅ Pass |
| Recommendations: balanced pack at low hunger | §14.7 | BCT-SHOP-025 | ✅ Pass |
| Bundle decomposition correctness | §11.5, §11.7.1 | BCT-INV-007, BCT-INV-008 | ✅ Pass |
| Balanced pack = Common-only foods | §5.4, §11.5 | BCT-INV-008 (explicit test) | ✅ Pass |
| Inventory base capacity = 15 | §11.7 | BCT-INV-001 | ✅ Pass |
| Stack max = 99 | §11.7.1 | BCT-INV-003 | ✅ Pass |

---

## (iii) Tangible Manual Verification Plan (UI)

### Test Case 1: Purchase Success (Single Item)
1. Open Shop (click 🏪 button)
2. Navigate to Food tab → Individual Foods section
3. Note current coin balance (e.g., 100)
4. Select "Apple" (5 coins)
5. Click "Buy"
6. **Expected**: Coin balance decreases by 5. Inventory shows +1 Apple.

### Test Case 2: Purchase Success (Bundle)
1. Open Shop → Food tab → Bundles section
2. Note current coin balance
3. Select "Apple Bundle" (20 coins)
4. Click "Buy"
5. **Expected**: Coin balance decreases by 20. Inventory shows +5 Apples.

### Test Case 3: Purchase Blocked (Insufficient Coins)
1. Ensure coins < 20
2. Open Shop → Food tab → Bundles
3. Select "Apple Bundle" (20 coins)
4. **Expected**: Buy button disabled or shows "Not enough". No state change.

### Test Case 4: Purchase Blocked (Capacity Full)
1. Fill inventory to 15 unique items
2. Open Shop → Food tab → Individual Foods
3. Select a NEW food item not in inventory
4. **Expected**: Purchase fails with "Inventory full!" error. No state change.

### Test Case 5: Purchase Blocked (Stack Max)
1. Have 95+ of an item (e.g., Apple)
2. Open Shop → Food tab
3. Try to buy 5+ more of that item
4. **Expected**: Purchase fails with stack limit error. No state change.

### Currency/Inventory Delta Verification
- Before each test: Note `coins`, `gems`, and relevant inventory quantities
- After each test: Verify exact expected changes occurred (or no changes for blocked cases)

---

## (iv) State Integrity / Atomicity Proof

### Validation Order (src/game/shopPurchase.ts:259-311)

The `purchaseShopItem()` function validates in this order:

1. **Quantity validation** (line 266-268): Reject if qty < 1 or > 10
2. **SKU + price lookup** (line 271-274): Call `calculatePrice()`, reject if null
3. **Currency check** (line 278-281): Compare funds vs price, reject if insufficient
4. **Decomposition** (line 284-288): Call `decomposeShopItem()`, reject if null
5. **Inventory constraints** (line 290-298): Call `canAddItemsToInventory()`, reject if not allowed

### Mutation Location (src/game/store.ts:1464-1517)

The store's `purchaseShopItem` action:

```typescript
purchaseShopItem: (itemId, quantity, options) => {
  const state = get();
  const purchaseState = { coins, gems, inventory, inventoryCapacity };

  // Execute pure validation
  const result = executePurchase(purchaseState, itemId, quantity, options);

  // ONLY mutate if success
  if (result.success && result.itemsAdded) {
    set((s) => {
      // Update currencies
      const newCurrencies = { ... };
      // Update inventory
      const newInventory = { ... };
      return { currencies: newCurrencies, inventory: newInventory };
    });
  }

  return result;
}
```

### Atomicity Guarantee

- **Pure validation first**: `executePurchase()` is a pure function that performs ALL validation before returning
- **Single `set()` call**: Mutations happen in ONE atomic Zustand `set()` call
- **Guard clause**: `if (result.success && result.itemsAdded)` ensures no mutation on failure
- **No partial state**: Currency AND inventory update together in same `set()` call

### Tests Proving Atomicity

- `BCT-SHOP-011`: Insufficient funds → no state change
- `BCT-SHOP-012`: Inventory full → no state change
- `BCT-SHOP-013`: Stack limit → no state change

---

## (v) Bundle Decomposition Validation

### Truth Table Compliance (Bible v1.6 §11.5 / BCT v2.2)

| Bundle ID | Expected Decomposition | Code Value (bible.constants.ts) | Match |
|-----------|------------------------|----------------------------------|-------|
| `food_apple_x5` | `{ apple: 5 }` | `{ apple: 5 }` | ✅ |
| `food_balanced_x5` | `{ apple: 2, banana: 1, carrot: 1, lollipop: 1 }` | `{ apple: 2, banana: 1, carrot: 1, lollipop: 1 }` | ✅ |
| `food_spicy_x3` | `{ hot_pepper: 3, spicy_taco: 2 }` | `{ hot_pepper: 3, spicy_taco: 2 }` | ✅ |
| `food_sweet_x3` | `{ cookie: 3, candy: 2 }` | `{ cookie: 3, candy: 2 }` | ✅ |
| `food_legendary_x1` | `{ golden_feast: 1 }` | `{ golden_feast: 1 }` | ✅ |

### Balanced Pack Bible-Strictness

**Requirement**: Bible §11.5 says "5× mixed common foods". Bible §5.4 defines:
- **Common**: apple, banana, carrot, lollipop
- **Uncommon**: candy

**Verification**: `food_balanced_x5` decomposition uses ONLY Common foods:
```typescript
decomposition: { apple: 2, banana: 1, carrot: 1, lollipop: 1 }  // Total: 5
```
Candy is **NOT** included. ✅

### Random Bundle Determinism Mechanism

**Location**: `src/game/shopPurchase.ts`

**Interface** (lines 56-65):
```typescript
export interface PurchaseOptions {
  /**
   * For bundles with random choices (food_rare_x1, food_epic_x1),
   * this function selects which item to give.
   * @param choices Array of possible item IDs
   * @returns Selected item ID
   * @default Random selection
   */
  randomSelector?: (choices: string[]) => string;
}
```

**Pool Definitions** (lines 77-82):
```typescript
export const RANDOM_BUNDLE_POOLS: Record<string, string[]> = {
  food_rare_x1: ['spicy_taco', 'hot_pepper', 'ice_cream'],
  food_epic_x1: ['birthday_cake', 'dream_treat'],
};
```

**Usage in decomposeShopItem** (lines 116-121):
```typescript
if (RANDOM_BUNDLE_POOLS[itemId]) {
  const pool = RANDOM_BUNDLE_POOLS[itemId];
  const selectedItem = randomSelector(pool);  // Uses injected or default
  return { [selectedItem]: 1 };
}
```

**Test Proof** (bct-shop.spec.ts:894-916):
```typescript
it('should use injected selector for food_rare_x1', () => {
  const selector = () => 'hot_pepper';
  const decomposed = decomposeShopItem('food_rare_x1', 1, { randomSelector: selector });
  expect(decomposed).toEqual({ hot_pepper: 1 });
});
```

No monkeypatching required. Tests inject deterministic selectors cleanly. ✅

---

## (vi) Recommendations Validation (§14.7)

### Implementation Location

`src/constants/bible.constants.ts:903-964` — `getShopRecommendations()`

### Priority Order (Bible §14.7)

| Priority | Trigger Condition | Recommended Item |
|----------|-------------------|------------------|
| 1 | Sick + Classic Mode | `care_medicine` |
| 2 | Energy < 20 | `care_energy_drink` |
| 3 | Hunger < 30 | `food_balanced_x5` |
| 4 | Mood < 40 | `care_mood_boost` |
| 5 | Weight ≥ 31 | `care_diet_food` |

### Constraints Verified

- **Max 3 recommendations**: Enforced by `if (recommendations.length >= 3) break;`
- **State dependence**: Each trigger uses state properties (isSick, energy, hunger, mood, weight)
- **Visibility conditions respected**: Medicine skipped in Cozy mode, Diet Food skipped if weight < 31

### BCT Coverage

| Test ID | Coverage |
|---------|----------|
| BCT-SHOP-022 | Hidden when no triggers |
| BCT-SHOP-023 | Sick → medicine priority |
| BCT-SHOP-024 | Low energy → energy drink |
| BCT-SHOP-025 | Low hunger → balanced pack |
| Additional tests | Max 3 limit, priority ordering, mood/weight triggers |

---

## (vii) UI Wiring Proof

### Evidence Method: Code-Path Trace

**1. Store Action Binding** (src/GrundyPrototype.tsx:897)
```typescript
const purchaseShopItem = useGameStore((state) => state.purchaseShopItem);
```

**2. ShopView Prop Wiring** (src/GrundyPrototype.tsx:1081-1084)
```typescript
onPurchase={(itemId, quantity) => {
  const result = purchaseShopItem(itemId, quantity);
  return result.success;
}}
```

**3. ShopView Handler Flow** (src/components/shop/ShopView.tsx)
- `FoodTabContent` receives `onPurchase` prop (line 351)
- `ShopItemCard` receives `onPurchase` prop (line 374)
- Buy button calls `onPurchase` on click (line 258)

**4. Store Action** (src/game/store.ts:1464-1517)
```typescript
purchaseShopItem: (itemId, quantity, options) => {
  const result = executePurchase(purchaseState, itemId, quantity, options);
  if (result.success && result.itemsAdded) {
    set((s) => { /* mutations */ });
  }
  return result;
}
```

**5. Purchase Engine** (src/game/shopPurchase.ts:259)
```typescript
export function purchaseShopItem(state, itemId, quantity, options): PurchaseResult
```

### Complete Chain
```
Shop UI "Buy" button click
  → ShopItemCard.onPurchase()
  → FoodTabContent.onPurchase(itemId, qty)
  → GrundyPrototype.purchaseShopItem(itemId, qty)
  → useGameStore.purchaseShopItem action
  → shopPurchase.executePurchase() [pure validation]
  → Zustand set() [atomic mutation]
```

✅ UI is correctly wired to purchase engine

---

## (viii) Environment Notes

### Playwright Setup

```bash
npx playwright install chromium
```

**Note**: This audit does not depend solely on E2E tests. The primary evidence is:
- BCT unit/integration tests (85 tests in bct-shop.spec.ts)
- Code inspection and path tracing
- Manual verification plan for QA

### Local Commands

```bash
# Type check
npx tsc --noEmit

# Unit tests
npm test -- --run

# Bible compliance tests only
npm run test:bible

# Production build
npm run build

# E2E tests (if Playwright configured)
npm run test:e2e
```

---

## Selector Semantics Verification (Audit E)

### Active TestIDs (Post-GOV Hygiene)

| TestID | Location | Semantic |
|--------|----------|----------|
| `inventory-modal` | InventoryView.tsx:111 | Container/modal |
| `inventory-use-on-pet` | InventoryDetailModal.tsx:157 | Action button |
| `feed-preselected-banner` | GrundyPrototype.tsx:442 | Banner/container (renamed from `feed-preselected-item`) |
| `feed-now-button` | GrundyPrototype.tsx:460 | Action button |

### Deprecated References

- `feed-preselected-item`: **0 occurrences** (fully renamed in commit `12fc312`)

---

## Findings Summary

| Audit Area | Status | Notes |
|------------|--------|-------|
| A. Atomic Purchase Semantics | ✅ Pass | Pure validation → single atomic mutation |
| B. Blocking + Player Feedback | ✅ Pass | All 5 error cases covered with BCT tests |
| C. Bundle Decomposition | ✅ Pass | Truth Table matches, Common-only balanced pack verified |
| D. Recommendations Logic | ✅ Pass | Priority, max 3, state-dependence all verified |
| E. Selector Semantics | ✅ Pass | No deprecated refs, all semantically correct |
| F. UI Wiring | ✅ Pass | Complete chain traced from button to engine |

---

## Issues / Follow-Ups

**None identified.** All audit objectives satisfied.

---

*Report generated: 2025-12-12*
*Auditor: Claude (Opus 4.5)*
*Phase: P8-SHOP-B Closeout*
