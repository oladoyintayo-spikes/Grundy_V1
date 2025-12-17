# GRUNDY — Pet Café (Diner Dash) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-15 minutes  
**Priority:** P5 — Future  
**Complexity:** High (7-10 days)  
**Inspiration:** Diner Dash, Cooking Mama

---

## Overview

Run a café serving food to visiting Grundy pets. Match food orders quickly to earn tips. Manage multiple customers simultaneously as difficulty increases.

**Core Fantasy:** Be the best café owner in Grundy Town!

---

## Gameplay

```
┌─────────────────────────────────────────┐
│  🐰        🐱        🐸        🐼       │  ← Customers
│ "🍎"      "🍕"      "🍔"      "🥗"      │  ← Their orders
│                                         │
│  ⏱️30s    ⏱️25s     ⏱️20s    ⏱️35s     │  ← Patience timers
├─────────────────────────────────────────┤
│                                         │
│    [🍎] [🍕] [🍔] [🥗] [🍰] [🍣]        │  ← Your inventory
│                                         │
│         Tap food, then customer         │
└─────────────────────────────────────────┘
```

---

## Core Loop

```
Customer arrives → Shows order → Select food → Tap customer → Earn tips → New customer
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Seats | 4 customer slots |
| Food types | 8 (unlocks over levels) |
| Patience | 15-45 seconds (varies by customer) |
| Wave size | 10 customers per wave |
| Levels | 30+ |
| Orientation | Portrait |

---

## Controls

| Input | Action |
|-------|--------|
| Tap food | Select food item |
| Tap customer | Serve selected food to customer |
| Tap wrong customer | Food returns, small time penalty |
| Swipe food to customer | Quick serve (shortcut) |

**UI Feedback:**
- Selected food highlights and floats slightly
- Valid customers glow when food selected
- Wrong food shows X and shakes

---

## Customers (Grundy Pets)

| Pet | Patience | Tip Bonus | Unlock |
|-----|----------|-----------|--------|
| 🐰 Munchlet | Normal | 1.0x | Level 1 |
| 🐱 Whisp | Slow | 1.2x | Level 3 |
| 🐸 Plompo | Fast | 0.8x | Level 5 |
| 🐼 Grib | Very Slow | 1.5x | Level 8 |
| 🦊 Fizz | Normal | 1.0x | Level 12 |
| 🐉 Ember | Very Fast | 0.6x | Level 15 |
| 🦁 Chomper | Fast | 0.9x | Level 20 |
| 👑 Luxe | Slow | 2.0x | Level 25 |

### Customer Moods

| Mood | Visual | Patience Left | Tip Multiplier |
|------|--------|---------------|----------------|
| 😊 Happy | Hearts | >70% | 1.5x |
| 😐 Neutral | Normal | 30-70% | 1.0x |
| 😠 Impatient | Sweat drops | 10-30% | 0.5x |
| 💢 Angry | Steam | <10% | 0.25x |
| 💨 Left | Empty seat | 0% | 0x + Penalty |

---

## Food Items

| Food | Unlock | Base Tip | Prep Time |
|------|--------|----------|-----------|
| 🍎 Apple | Level 1 | 10 🪙 | Instant |
| 🥕 Carrot | Level 1 | 10 🪙 | Instant |
| 🍕 Pizza | Level 2 | 20 🪙 | Instant |
| 🍔 Burger | Level 4 | 20 🪙 | Instant |
| 🥗 Salad | Level 6 | 25 🪙 | Instant |
| 🍰 Cake | Level 10 | 30 🪙 | Instant |
| 🍣 Sushi | Level 15 | 35 🪙 | Instant |
| 🍱 Bento | Level 20 | 50 🪙 | Instant |

### Complex Orders (Level 15+)

Some customers request multiple items:

```
🐼: "🍕 + 🥗"     ← Combo order
```

Combo orders:
- Must serve both items
- Higher tip reward
- Tap first food, then second, then customer

---

## Level Structure

### Wave System

Each level has 3 waves:

| Wave | Customers | Difficulty |
|------|-----------|------------|
| Wave 1 | 8 | Easy |
| Wave 2 | 10 | Medium |
| Wave 3 | 12 | Hard |

### Level Goals

| Type | Description |
|------|-------------|
| Serve All | Serve X customers without losing Y |
| Tip Target | Earn X total tips |
| Perfect Wave | Serve a wave with all Happy customers |
| Speed Round | Serve X customers in Y seconds |

### Difficulty Progression

| Level Range | Foods | Customers | Specials |
|-------------|-------|-----------|----------|
| 1-5 | 2-3 | 2 at once | None |
| 6-10 | 4-5 | 3 at once | None |
| 11-15 | 5-6 | 4 at once | Combos |
| 16-20 | 6-7 | 4 at once | VIPs |
| 21-30 | 8 | 4 at once | All |

---

## Scoring

### Base Tips

| Action | Tips |
|--------|------|
| Correct order | Food base value |
| Happy customer | +50% |
| Neutral customer | +0% |
| Impatient customer | -50% |
| Wrong order | -25% of base |
| Customer left | -50 🪙 penalty |

### Combo Bonuses

| Combo | Bonus |
|-------|-------|
| 2 in a row | +10% |
| 3 in a row | +20% |
| 4 in a row | +30% |
| 5+ in a row | +50% |

**Combo breaks on:**
- Wrong order served
- Customer leaves
- Wave ends

### Star Rating

| Stars | Condition |
|-------|-----------|
| ⭐ | Complete level |
| ⭐⭐ | ≤2 customers left unhappy |
| ⭐⭐⭐ | All customers happy (no one below neutral) |

---

## Special Customers

### VIP Customers (Level 16+)

| VIP | Visual | Effect |
|-----|--------|--------|
| 👑 Royal | Crown | 3x tips, half patience |
| ⭐ Celebrity | Sparkles | 2x tips, attracts crowd |
| 🎩 Critic | Monocle | 4x tips, very fast patience |

### Group Orders (Level 20+)

2-3 customers arrive together wanting the same food:

```
🐰🐱: "🍕🍕"     ← Group wants 2 pizzas
```

Serve one pizza, then another to complete.

---

## Rewards

### Per Level

| Stars | Coin Reward |
|-------|-------------|
| ⭐ | 15 🪙 |
| ⭐⭐ | 25 🪙 |
| ⭐⭐⭐ | 40 🪙 |

**Plus:** All tips earned during level

### First Clear Bonus

| Stars | Bonus |
|-------|-------|
| ⭐ | +10 🪙 |
| ⭐⭐ | +15 🪙 |
| ⭐⭐⭐ | +25 🪙 |

**Economy Rules:**
- Energy cost: 10 per session
- Session = 1 level attempt
- Daily cap: Shared with all mini-games
- Gems: ❌ NEVER awarded

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────────────┐
│ Level 8     Wave 2/3     Tips: 145 🪙   │
├─────────────────────────────────────────┤
│                                         │
│    🐰         🐱         🐸             │
│   "🍎"       "🍕"       "🍔"            │
│  ████░░     ███░░░     █████░           │
│   😊         😐         😊              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   [🍎]  [🥕]  [🍕]  [🍔]  [🥗]         │
│                                         │
│              Selected: 🍕               │
│                                         │
└─────────────────────────────────────────┘
```

### Wave Complete

```
┌─────────────────────────────────────────┐
│                                         │
│         WAVE 2 COMPLETE! 🎉            │
│                                         │
│     Customers Served: 10/10             │
│     Perfect Serves: 7                   │
│     Tips Earned: 180 🪙                 │
│                                         │
│     Combo Best: 5x                      │
│                                         │
│         [➡️ Next Wave]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Level Complete

```
┌─────────────────────────────────────────┐
│                                         │
│      LEVEL 8 COMPLETE! ⭐⭐⭐           │
│                                         │
│     Total Tips: 485 🪙                  │
│     Perfect Serves: 22/30               │
│     Best Combo: 8x                      │
│                                         │
│     Reward: +40 🪙                      │
│     First Clear: +25 🪙                 │
│                                         │
│  [➡️ Next Level]  [🏠 Exit]             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Customers | Pet sprites, seated at counter |
| Food | Existing food sprites with plates |
| Counter | Cozy café aesthetic |
| Background | Kitchen visible behind |
| Patience bar | Color gradient (green → red) |

### Animations

| Event | Animation |
|-------|-----------|
| Customer arrives | Hops into seat |
| Order bubble | Pops up with bounce |
| Select food | Food lifts, glows |
| Serve food | Food slides to customer |
| Happy eat | Hearts, munch animation |
| Angry | Steam puffs, foot tap |
| Customer leaves (happy) | Waves, drops coins |
| Customer leaves (angry) | Storms off, sad cloud |
| Combo | Combo counter pops up |

---

## Audio

| Event | Sound |
|-------|-------|
| Customer arrive | Door chime |
| Order appear | Pop |
| Select food | Click |
| Serve food | Whoosh + plate clatter |
| Correct order | Cha-ching |
| Wrong order | Buzzer |
| Customer happy | Munch + satisfied sigh |
| Customer impatient | Foot tapping |
| Customer leaves happy | Thank you + coins |
| Customer leaves angry | Door slam |
| Combo | Rising ding per combo |
| Wave complete | Celebration jingle |

---

## State Management

```typescript
interface CafeGameState {
  // Level
  currentLevel: number;
  currentWave: number;
  
  // Customers
  seats: (Customer | null)[];    // 4 seats
  customerQueue: Customer[];
  customersServed: number;
  customersLost: number;
  
  // Selection
  selectedFood: Food | null;
  
  // Score
  tips: number;
  combo: number;
  perfectServes: number;
  
  // Status
  waveState: 'playing' | 'complete' | 'failed';
  levelState: 'playing' | 'complete' | 'failed';
  
  // Unlocks
  unlockedFoods: Food[];
  unlockedCustomers: CustomerType[];
  
  // Stats
  totalTips: number;
  bestCombo: number;
}

interface Customer {
  type: CustomerType;
  order: Food[];           // Can be 1 or 2 items
  patience: number;        // 0-100
  patienceRate: number;    // Decrease per second
  mood: Mood;
  served: Food[];          // Items already given
  isVIP: boolean;
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-CAFE-CUSTOMER-001 | Customers arrive and show orders |
| BCT-CAFE-SELECT-001 | Tapping food selects it |
| BCT-CAFE-SERVE-001 | Tapping customer serves food |
| BCT-CAFE-CORRECT-001 | Correct order awards tips |
| BCT-CAFE-WRONG-001 | Wrong order penalizes |
| BCT-CAFE-PATIENCE-001 | Patience decreases over time |
| BCT-CAFE-MOOD-001 | Mood reflects patience level |
| BCT-CAFE-LEAVE-001 | Customer leaves at 0 patience |
| BCT-CAFE-COMBO-001 | Consecutive serves build combo |
| BCT-CAFE-COMBO-002 | Combo breaks on miss |
| BCT-CAFE-WAVE-001 | Wave completes after all customers |
| BCT-CAFE-LEVEL-001 | Level completes after all waves |
| BCT-CAFE-STAR-001 | Stars awarded correctly |

---

## Implementation Notes

### Customer Spawning

- Gap between customers: 3-8 seconds (random)
- Max 4 customers at once
- Faster spawn in later waves
- VIPs spawn with special announcement

### Patience System

- Base patience: 20-40 seconds (by customer type)
- Patience decreases in real-time
- Mood thresholds at 70%, 30%, 10%
- Visual countdown bar

### Combo System

- Combo starts at serve #1
- Each consecutive correct serve adds +1
- Combo breaks on any miss
- Combo resets between waves

---

## Future Enhancements (Post-MVP)

- [ ] Upgrades (faster serving, auto-refill)
- [ ] Decorations (customer patience bonus)
- [ ] Special events (rush hour, happy hour)
- [ ] Multi-station cooking
- [ ] Endless mode

---

## References

- Bible §7.5.5 Session Games
- Bible §11.4 Gem Sources (NO gems from mini-games)
- Bible §7.1 Mini-Game Economy Rules
