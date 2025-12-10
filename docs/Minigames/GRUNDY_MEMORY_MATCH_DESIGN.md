# GRUNDY — MEMORY MATCH MINI-GAME DESIGN

**Version:** 1.0  
**Status:** Approved  
**Added:** December 2024

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Memory Match |
| **Type** | Puzzle / Memory |
| **Duration** | 60-120 seconds (varies by difficulty) |
| **Energy Cost** | 10 |
| **Daily Cap** | 3 rewarded plays |
| **Main Skill** | Memory, attention |
| **Unlock** | Player Level 3 |

---

## Concept

Classic card-matching game with food items. Flip cards to find matching pairs. Tests memory and rewards efficient play.

**Core Mechanic:**
- Grid of face-down cards showing food items
- Tap to flip cards (2 at a time)
- Matching pairs stay revealed
- Find all pairs to win
- Fewer moves = higher score

---

## Gameplay

### Controls
- Tap card to flip
- Can only have 2 cards face-up at once
- Third tap while 2 are up = auto-flip back + flip new card

### Win Condition
- Find all pairs before time expires

### Fail Condition
- Time expires with pairs remaining

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│  🧠 MEMORY MATCH       Time: 1:12       │
│                        Moves: 8         │
│                        Pairs: 3/8       │
├─────────────────────────────────────────┤
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ? │ │🍎│ │ ? │ │ ? │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ? │ │ ? │ │🍎│ │ ? │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │🍌│ │🍌│ │ ? │ │ ? │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ? │ │ ? │ │ ? │ │ ? │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Difficulty Levels

| Level | Grid | Pairs | Time | Unlock |
|-------|------|-------|------|--------|
| Easy | 3×4 | 6 | 60s | Default |
| Medium | 4×4 | 8 | 90s | Player Lv 5 |
| Hard | 4×5 | 10 | 120s | Player Lv 10 |

**Launch with Easy + Medium.** Add Hard post-launch.

---

## Scoring

| Action | Points |
|--------|--------|
| Find pair | +50 |
| Perfect match (first try) | +25 bonus |
| Time bonus | +2 per second remaining |
| Streak bonus (3+ pairs in row) | +10 per pair |

**Move Efficiency Bonus:**

| Moves (8-pair game) | Bonus |
|---------------------|-------|
| ≤12 (perfect) | +100 |
| 13-16 (great) | +50 |
| 17-20 (good) | +25 |
| 21+ | +0 |

**Max theoretical score (Medium):** ~700 points

---

## Reward Tiers

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-199 | 2 | 3 | — |
| Silver | 200-399 | 5 | 5 | 25% common |
| Gold | 400-549 | 8 | 7 | 50% common |
| Rainbow | 550+ | 12 | 10 | 70% uncommon |

**No gems.** Mini-games provide small helpful gifts, not wealth.

---

## Pet Abilities

| Pet | Ability Name | Effect |
|-----|--------------|--------|
| **Munchlet** | Helpful Hint | One pair glows briefly after 8 moves |
| **Grib** | Calm Mind | +15 seconds added to timer |
| **Plompo** | Slow Time | Timer runs 25% slower |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Memory | Matched pairs flash location once before game |
| **Chomper** | Second Bite | One free re-flip per game (undo last flip) |
| **Whisp** | Spirit Peek | See all cards for 3 seconds at game start |
| **Luxe** | Lucky Guess | First flip each game is guaranteed a match |

---

## Anti-Spam Mechanics

| Mechanic | Value | Purpose |
|----------|-------|---------|
| Energy cost | 10 | Limits to 5 plays from full |
| Daily cap | 3 rewarded | Prevents farming |
| First daily | FREE | Encourages engagement |
| After cap | Play for fun | No rewards, just practice |
| Session length | 60-120s | Time investment per play |

---

## Card Content

Cards use food items from `foods.ts`:
- apple, banana, carrot, grapes, cookie
- pizza, birthday_cake, spicy_taco
- hot_pepper, dream_treat, golden_feast

**Easy (6 pairs):** Random 6 foods
**Medium (8 pairs):** Random 8 foods  
**Hard (10 pairs):** All 10 foods + 1 duplicate set

---

## Technical Notes

### State

```typescript
interface MemoryMatchGameState {
  cards: MemoryCard[]
  flippedIndices: number[]    // Max 2
  matchedPairs: number
  totalPairs: number
  moves: number
  streak: number
  timeRemaining: number
  score: number
  difficulty: 'easy' | 'medium' | 'hard'
  abilityUsed: boolean        // For one-time abilities
}

interface MemoryCard {
  id: number
  foodId: string              // From foods.ts
  isFlipped: boolean
  isMatched: boolean
  position: { row: number, col: number }
}
```

### Board Generation

```typescript
function generateBoard(pairs: number): MemoryCard[] {
  // 1. Pick random foods
  const foods = shuffle(getAllFoods()).slice(0, pairs)
  
  // 2. Create pairs
  const cards: MemoryCard[] = []
  foods.forEach((food, i) => {
    cards.push({ id: i * 2, foodId: food.id, isFlipped: false, isMatched: false })
    cards.push({ id: i * 2 + 1, foodId: food.id, isFlipped: false, isMatched: false })
  })
  
  // 3. Shuffle positions
  return shuffle(cards).map((card, i) => ({
    ...card,
    position: { row: Math.floor(i / 4), col: i % 4 }
  }))
}
```

### Match Logic

```typescript
function checkMatch(card1: MemoryCard, card2: MemoryCard): boolean {
  return card1.foodId === card2.foodId && card1.id !== card2.id
}
```

---

## Animations

| Event | Animation |
|-------|-----------|
| Card flip | 3D rotation (Y-axis), 200ms |
| Match found | Cards glow green + shrink slightly |
| No match | Cards shake + flip back after 1s |
| Streak (3+) | Fire trail between cards |
| Whisp peek | All cards flip up, glow, flip back |
| Luxe lucky | First card has golden border |
| Timer warning (15s) | Timer pulses red |
| Win | Confetti burst + cards fly off |
| Lose | Cards fade to gray |

---

## Sound Effects

| Event | Sound |
|-------|-------|
| Card flip | Soft "whoosh" |
| Match | Cheerful "ding ding" |
| No match | Soft "bonk" |
| Streak x3 | Rising chimes |
| Perfect game | Victory fanfare |
| Time warning | Gentle tick-tock |
| Game win | Success jingle |
| Game lose | Sad descending tone |

---

## Integration Points

- **Energy System:** Deduct 10 on game start
- **Food Data:** Use foods.ts for card images
- **Stats Tracking:** Increment `minigamesCompleted` on finish
- **Unlock Check:** After game, check if Ember unlocks (10 games)
- **Pet Ability:** Apply active pet's ability at game start
- **Difficulty Unlock:** Check player level for Medium/Hard

---

## Test Cases

| TC | Test | Expected |
|----|------|----------|
| TC-401 | Board generates correct pairs | N pairs = 2N cards |
| TC-402 | Cards flip on tap | 3D flip animation |
| TC-403 | Max 2 cards flipped | Third tap flips back first two |
| TC-404 | Match detection | Same foodId = match |
| TC-405 | Matched cards stay | isMatched = true |
| TC-406 | Non-match flips back | After 1 second |
| TC-407 | Move counter increments | +1 per pair of flips |
| TC-408 | Win when all matched | Results screen |
| TC-409 | Lose when time expires | Results screen |
| TC-410 | Whisp peek works | 3s preview at start |
| TC-411 | Chomper undo works | One re-flip allowed |
| TC-412 | Score calculates correctly | Pairs + time + efficiency |
| TC-413 | Energy deducted | -10 on game start |

---

*END OF MEMORY MATCH DESIGN*
