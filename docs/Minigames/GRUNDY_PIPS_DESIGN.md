# GRUNDY — PIPS MINI-GAME DESIGN

**Version:** 1.0  
**Status:** Approved  
**Added:** December 2024

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Pips |
| **Type** | Puzzle / Match |
| **Duration** | 120 seconds |
| **Energy Cost** | 10 |
| **Daily Cap** | 3 rewarded plays |
| **Main Skill** | Pattern recognition |
| **Unlock** | Player Level 3 |

---

## Concept

Clear a board of domino tiles by matching pip counts. A relaxed but engaging puzzle game.

**Core Mechanic:**
- 4×4 grid of domino halves (16 tiles)
- Each tile shows 1-6 pips (dice faces)
- Tap two tiles with **same pip count** to clear both
- Clear all tiles to win
- Bonus for chain combos (matches within 3 seconds)

---

## Gameplay

### Controls
- Tap first tile to select (highlights)
- Tap second tile to attempt match
- If match: both tiles clear with animation
- If no match: both tiles shake, selection resets

### Win Condition
- Clear all 8 pairs before time runs out

### Fail Condition
- Time expires with tiles remaining

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│  🎲 PIPS              Time: 1:47        │
│                       Pairs: 5/8        │
├─────────────────────────────────────────┤
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ⚂ │ │ ⚀ │ │ ⚄ │ │ ⚂ │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ⚃ │ │ ⚁ │ │ ⚀ │ │ ⚄ │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ⚅ │ │ ⚃ │ │ ⚁ │ │ ⚅ │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ⚂ │ │ ⚂ │ │ ⚃ │ │ ⚃ │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│          Combo: x2 🔥                   │
└─────────────────────────────────────────┘
```

---

## Scoring

| Action | Points |
|--------|--------|
| Match pair | +10 |
| Combo x2 (within 3s) | +5 bonus |
| Combo x3 | +10 bonus |
| Combo x4+ | +15 bonus |
| Doubles match (⚅⚅, ⚄⚄, etc.) | +5 bonus |
| Clear board | +50 bonus |
| Time bonus | +1 per 10 sec remaining |

**Max theoretical score:** ~250 points (perfect play)

---

## Reward Tiers

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-79 | 2 | 3 | — |
| Silver | 80-149 | 5 | 5 | 20% common |
| Gold | 150-219 | 8 | 7 | 40% common |
| Rainbow | 220+ | 12 | 10 | 60% uncommon |

**No gems.** Mini-games provide small helpful gifts, not wealth.

---

## Pet Abilities

| Pet | Ability Name | Effect |
|-----|--------------|--------|
| **Munchlet** | Hint | After 30s, one valid pair glows for 3s |
| **Grib** | Double Bonus | 2× points for doubles (⚅⚅, ⚄⚄) |
| **Plompo** | Extra Time | +30 seconds (150s total) |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Streak | Combo window extended to 5s |
| **Chomper** | Wild Tile | One random tile matches anything (once per game) |
| **Whisp** | Peek | See all matching pairs highlighted for 3s at start |
| **Luxe** | Lucky Drop | 2× chance for food reward |

---

## Anti-Spam Mechanics

| Mechanic | Value | Purpose |
|----------|-------|---------|
| Energy cost | 10 | Limits to 5 plays from full |
| Daily cap | 3 rewarded | Prevents farming |
| First daily | FREE | Encourages engagement |
| After cap | Play for fun | No rewards, just practice |
| Session length | 120s | Time investment per play |

---

## Difficulty Levels (Future)

| Level | Grid | Pairs | Time | Unlock |
|-------|------|-------|------|--------|
| Easy | 4×4 | 8 | 120s | Default |
| Medium | 4×5 | 10 | 120s | Player Lv 8 |
| Hard | 5×6 | 15 | 150s | Player Lv 15 |

**Launch with Easy only.** Add Medium/Hard post-launch.

---

## Board Generation Rules

1. Generate exactly 8 pairs (16 tiles total)
2. Each pip value (1-6) appears 2-4 times
3. Shuffle positions randomly
4. Verify at least one valid match exists
5. If no matches possible (shouldn't happen with pairs), regenerate

---

## Animations

| Event | Animation |
|-------|-----------|
| Tile select | Gentle bounce + glow border |
| Match success | Tiles shrink + sparkle + float up |
| Match fail | Tiles shake horizontally |
| Combo | Fire emoji floats up |
| Board clear | Confetti burst |
| Time warning (30s) | Timer pulses red |
| Game over | Tiles fade, results overlay |

---

## Sound Effects

| Event | Sound |
|-------|-------|
| Tile tap | Soft click |
| Match | Satisfying "ding" |
| Combo | Rising chime |
| Fail match | Soft buzz |
| Board clear | Victory jingle |
| Time warning | Gentle tick |

---

## Technical Notes

### State

```typescript
interface PipsGameState {
  tiles: PipTile[]           // 16 tiles
  selectedTile: number | null
  pairsCleared: number
  score: number
  combo: number
  timeRemaining: number
  isComplete: boolean
}

interface PipTile {
  id: number
  pips: 1 | 2 | 3 | 4 | 5 | 6
  isCleared: boolean
  isSelected: boolean
  isWild: boolean           // Chomper ability
}
```

### Board Generation

```typescript
function generateBoard(): PipTile[] {
  const pairs: number[] = []
  // Generate 8 pairs from pip values 1-6
  for (let i = 0; i < 8; i++) {
    const pip = (i % 6) + 1
    pairs.push(pip, pip)
  }
  // Shuffle
  return shuffle(pairs).map((pips, id) => ({
    id,
    pips,
    isCleared: false,
    isSelected: false,
    isWild: false
  }))
}
```

---

## Integration Points

- **Energy System:** Deduct 10 on game start
- **Stats Tracking:** Increment `minigamesCompleted` on finish
- **Unlock Check:** After game, check if Ember unlocks (10 games)
- **Pet Ability:** Apply active pet's ability at game start
- **Rewards:** Calculate tier, apply Fizz bonus if active, grant rewards

---

## Test Cases

| TC | Test | Expected |
|----|------|----------|
| TC-201 | Board generates 16 tiles | 8 pairs present |
| TC-202 | Matching tiles clear | Both removed, +10 points |
| TC-203 | Non-matching tiles shake | Selection resets |
| TC-204 | Combo within 3s | Bonus points awarded |
| TC-205 | Clear all tiles | +50 bonus, game ends |
| TC-206 | Time expires | Game ends, rewards based on score |
| TC-207 | Whisp peek works | 3s highlight at start |
| TC-208 | Plompo extra time | Timer starts at 150s |
| TC-209 | Chomper wild tile | One tile matches any |
| TC-210 | Energy deducted | -10 on game start |

---

*END OF PIPS DESIGN*
