# GRUNDY — Grundy Garden (Merge Game) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-30+ minutes (endless)  
**Priority:** P6 — Future  
**Complexity:** Medium (4-5 days)  
**Inspiration:** Merge Dragons, 2048

---

## Overview

Merge identical items to create higher-tier foods. Discover all food types in the collection. Relaxing, zen-like endless gameplay.

**Core Fantasy:** Grow your garden of delicious treats!

---

## Gameplay

```
┌─────────────────────────────────────┐
│  🥬   🥬   🥕   🍎   ·    ·    ·   │
│  🥕   🥗   🥕   ·    ·    ·    ·   │
│  🍎   🍎   🥗   🥗   ·    ·    ·   │
│  ·    ·    ·    🍱   ·    ·    ·   │
│  ·    ·    ·    ·    ·    ·    ·   │
├─────────────────────────────────────┤
│  Drag items together to merge!      │
│  🥬+🥬=🥗  🥗+🥗=🍱  🍱+🍱=⭐      │
└─────────────────────────────────────┘

Discovery: 12/30 foods unlocked
```

---

## Core Loop

```
Items spawn → Drag to merge → Higher tier created → Board fills → Clear space → Repeat
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Grid size | 7 wide × 5 tall (35 cells) |
| Merge chains | 5 different chains |
| Items per chain | 6 tiers |
| Total items | 30 unique foods |
| Spawn rate | 1 new item every 3 merges |
| Game over | Board full, no merges possible |
| Orientation | Portrait |

---

## Controls

| Input | Action |
|-------|--------|
| Tap item | Select item |
| Drag item | Move to adjacent cell |
| Drag onto same item | Merge items |
| Double tap | Quick merge (finds nearest match) |
| Pinch | Zoom out to see full board |

**Merge Rules:**
- Can only merge identical items
- Items must be adjacent (8 directions)
- Merging 2 creates 1 higher tier
- Merging 3+ creates 1 higher tier + bonus

---

## Merge Chains

### Chain 1: Vegetables 🥬

| Tier | Item | Points | Spawn? |
|------|------|--------|--------|
| 1 | 🥬 Lettuce | 5 | ✅ Yes |
| 2 | 🥕 Carrot | 15 | ✅ Yes |
| 3 | 🥗 Salad | 50 | ❌ No |
| 4 | 🥙 Wrap | 150 | ❌ No |
| 5 | 🍱 Bento | 500 | ❌ No |
| 6 | 👑 Royal Feast | 2000 | ❌ No |

### Chain 2: Fruits 🍎

| Tier | Item | Points | Spawn? |
|------|------|--------|--------|
| 1 | 🍎 Apple | 5 | ✅ Yes |
| 2 | 🍊 Orange | 15 | ✅ Yes |
| 3 | 🍇 Grapes | 50 | ❌ No |
| 4 | 🥧 Fruit Pie | 150 | ❌ No |
| 5 | 🎂 Fruit Cake | 500 | ❌ No |
| 6 | 🏆 Champion Cake | 2000 | ❌ No |

### Chain 3: Grains 🍞

| Tier | Item | Points | Spawn? |
|------|------|--------|--------|
| 1 | 🌾 Wheat | 5 | ✅ Yes |
| 2 | 🍞 Bread | 15 | ✅ Yes |
| 3 | 🥐 Croissant | 50 | ❌ No |
| 4 | 🍕 Pizza | 150 | ❌ No |
| 5 | 🎪 Feast Table | 500 | ❌ No |
| 6 | 💎 Diamond Dish | 2000 | ❌ No |

### Chain 4: Proteins 🥚

| Tier | Item | Points | Spawn? |
|------|------|--------|--------|
| 1 | 🥚 Egg | 5 | ✅ Yes |
| 2 | 🍳 Fried Egg | 15 | ✅ Yes |
| 3 | 🍔 Burger | 50 | ❌ No |
| 4 | 🥩 Steak | 150 | ❌ No |
| 5 | 🍖 Feast Meat | 500 | ❌ No |
| 6 | ⭐ Star Roast | 2000 | ❌ No |

### Chain 5: Sweets 🍬

| Tier | Item | Points | Spawn? |
|------|------|--------|--------|
| 1 | 🍬 Candy | 5 | ✅ Yes |
| 2 | 🍪 Cookie | 15 | ✅ Yes |
| 3 | 🧁 Cupcake | 50 | ❌ No |
| 4 | 🍰 Cake Slice | 150 | ❌ No |
| 5 | 🎂 Full Cake | 500 | ❌ No |
| 6 | 🌟 Golden Cake | 2000 | ❌ No |

---

## Scoring

### Merge Points

| Action | Points |
|--------|--------|
| Tier 1 → Tier 2 | 10 |
| Tier 2 → Tier 3 | 30 |
| Tier 3 → Tier 4 | 100 |
| Tier 4 → Tier 5 | 300 |
| Tier 5 → Tier 6 | 1000 |

### Bonus Points

| Bonus | Points | Condition |
|-------|--------|-----------|
| 3-merge | +50% | Merge 3 items at once |
| 4-merge | +100% | Merge 4 items at once |
| 5-merge | +200% | Merge 5+ items at once |
| Chain combo | +25% per step | Multiple merges in quick succession |
| Discovery | +100 | First time creating an item |

---

## Discovery Collection

Players permanently unlock items in their collection:

```
┌─────────────────────────────────────┐
│        FOOD COLLECTION 🍽️          │
│         24/30 Discovered            │
├─────────────────────────────────────┤
│ 🥬 ✓  🥕 ✓  🥗 ✓  🥙 ✓  🍱 ✓  👑 ✓ │
│ 🍎 ✓  🍊 ✓  🍇 ✓  🥧 ✓  🎂 ✓  🏆 ✓ │
│ 🌾 ✓  🍞 ✓  🥐 ✓  🍕 ✓  🎪 ✓  💎 ❓ │
│ 🥚 ✓  🍳 ✓  🍔 ✓  🥩 ✓  🍖 ✓  ⭐ ❓ │
│ 🍬 ✓  🍪 ✓  🧁 ✓  🍰 ✓  🎂 ❓  🌟 ❓ │
├─────────────────────────────────────┤
│   Tap an item to see its recipe!    │
└─────────────────────────────────────┘
```

**Collection Benefits:**
- Permanent progress across sessions
- Completion rewards at milestones
- Bragging rights for completionists

---

## Game Modes

### Endless Mode (Default)

- Play until board is full
- No time limit
- High score tracking
- Save and resume anytime

### Challenge Mode (Future)

| Challenge | Goal | Time |
|-----------|------|------|
| Speed Run | Create Tier 5 item | 3 minutes |
| Collection | Discover 5 new items | 5 minutes |
| Score Attack | Reach 5000 points | 2 minutes |
| Clear Board | Empty the board | No limit |

---

## Rewards

### Session Rewards

| Score Range | Tier | Coin Reward |
|-------------|------|-------------|
| 0-499 | Bronze | 5 🪙 |
| 500-1499 | Silver | 15 🪙 |
| 1500-3999 | Gold | 30 🪙 |
| 4000-9999 | Platinum | 50 🪙 |
| 10000+ | Diamond | 75 🪙 |

### Discovery Milestones

| Milestone | Reward |
|-----------|--------|
| 10 items discovered | 25 🪙 |
| 20 items discovered | 50 🪙 |
| 30 items (complete) | 100 🪙 + Title |

**Economy Rules:**
- Energy cost: 10 per session
- Session ends on game over
- Daily cap: Shared with all mini-games
- Gems: ❌ NEVER awarded

---

## Special Items

### Power-Ups (Spawn Randomly)

| Item | Visual | Effect | Spawn Rate |
|------|--------|--------|------------|
| 🧹 Broom | Broom | Removes any 1 item | 5% |
| 🔀 Shuffle | Arrows | Randomizes board layout | 3% |
| ⬆️ Upgrade | Arrow up | Upgrades random item 1 tier | 2% |
| 💫 Wild | Rainbow | Matches any item | 1% |

### Using Power-Ups

- Tap power-up to select
- Tap target (if applicable)
- One-time use

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────────┐
│ Score: 2,450    Best: 8,720         │
├─────────────────────────────────────┤
│                                     │
│  🥬   🥬   🥕   🍎   🍬   ·    ·   │
│                                     │
│  🥕   🥗   🥕   🍪   ·    ·    ·   │
│                                     │
│  🍎   🍎   🥗   🥗   🌾   ·    ·   │
│                                     │
│  🍬   ·    ·    🍱   🍞   ·    ·   │
│                                     │
│  ·    ·    ·    ·    ·    ·    ·   │
│                                     │
├─────────────────────────────────────┤
│  Next spawn in: 2 merges            │
│  Collection: 18/30  [📖 View]       │
└─────────────────────────────────────┘
```

### New Discovery Popup

```
┌─────────────────────────────────────┐
│                                     │
│      ✨ NEW DISCOVERY! ✨           │
│                                     │
│            🍕                       │
│          PIZZA                      │
│                                     │
│     "A delicious combination        │
│      of bread and toppings!"        │
│                                     │
│         +100 bonus points           │
│                                     │
│          [Continue]                 │
│                                     │
└─────────────────────────────────────┘
```

### Game Over Screen

```
┌─────────────────────────────────────┐
│                                     │
│        GARDEN FULL! 🌱              │
│                                     │
│     Final Score: 4,280              │
│     Best Score: 8,720               │
│                                     │
│     Items Discovered: 2 new!        │
│     Highest Tier: 🍱 Bento          │
│                                     │
│     Tier: GOLD ⭐                   │
│     Reward: +30 🪙                  │
│                                     │
│  [🔄 Play Again]  [🏠 Exit]         │
│                                     │
└─────────────────────────────────────┘
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Board | Garden soil/grass texture |
| Items | Food sprites on plates/leaves |
| Empty cells | Subtle indentation |
| Merge effect | Items combine with sparkles |
| Background | Cozy garden scene |

### Animations

| Event | Animation |
|-------|-----------|
| Spawn | Pop up from ground with wiggle |
| Select | Slight lift + glow |
| Drag | Item follows finger, others shift |
| Merge | Items fly together, flash, new item pops |
| Discovery | Big sparkle burst, floating text |
| Chain combo | Rapid sequence with rising multiplier |
| Board full | Items shake, "no moves" indicator |
| Game over | Items sink into ground |

---

## Audio

| Event | Sound |
|-------|-------|
| Select item | Soft pop |
| Drag | Sliding sound |
| Invalid move | Gentle thunk |
| Merge (low tier) | Small pop |
| Merge (mid tier) | Medium chime |
| Merge (high tier) | Triumphant fanfare |
| Chain combo | Rising musical scale |
| Discovery | Magic sparkle + "wow" |
| New item spawn | Sprout sound |
| Power-up | Magic whoosh |
| Game over | Garden sigh |

---

## State Management

```typescript
interface GardenGameState {
  // Board
  grid: (Item | null)[][];    // 7×5 grid
  
  // Score
  score: number;
  bestScore: number;
  
  // Spawning
  mergesSinceSpawn: number;
  spawnThreshold: number;      // Usually 3
  
  // Selection
  selectedCell: Position | null;
  isDragging: boolean;
  
  // Collection
  discoveredItems: Set<ItemType>;
  newDiscoveries: ItemType[];  // This session
  
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  
  // Power-ups
  availablePowerUps: PowerUp[];
  
  // Stats
  totalMerges: number;
  highestTier: number;
  sessionsPlayed: number;
}

interface Item {
  type: ItemType;
  chain: ChainType;
  tier: number;          // 1-6
  isNew: boolean;        // Just spawned
  isPowerUp: boolean;
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-MERGE-INIT-001 | Game starts with random items |
| BCT-MERGE-SELECT-001 | Tapping selects item |
| BCT-MERGE-DRAG-001 | Dragging moves item |
| BCT-MERGE-COMBINE-001 | Same items merge |
| BCT-MERGE-TIER-001 | Merge creates next tier |
| BCT-MERGE-INVALID-001 | Different items don't merge |
| BCT-MERGE-SPAWN-001 | New item spawns after 3 merges |
| BCT-MERGE-SCORE-001 | Points calculated correctly |
| BCT-MERGE-DISCOVERY-001 | New items added to collection |
| BCT-MERGE-GAMEOVER-001 | Game ends when board full |
| BCT-MERGE-SAVE-001 | Collection persists across sessions |
| BCT-MERGE-POWERUP-001 | Power-ups work correctly |

---

## Duration Estimates

| Play Style | Typical Duration | Typical Score |
|------------|------------------|---------------|
| Quick session | 3-5 minutes | 500-1500 |
| Normal session | 10-15 minutes | 2000-5000 |
| Long session | 20-30+ minutes | 5000-15000 |

---

## Implementation Notes

### Merge Detection

1. On drag release, check if target cell has same item
2. If match, animate merge and create new item
3. Check for chain reactions (new item adjacent to matches)
4. After merge, increment spawn counter

### Spawn System

- Track merges since last spawn
- Spawn at threshold (default 3)
- Spawn in random empty cell
- Only spawn Tier 1-2 items
- Prefer spawning items player has fewer of

### Game Over Detection

After each action:
1. Check if any empty cells exist → continue
2. Check if any adjacent matching pairs exist → continue
3. Otherwise → game over

### Save System

- Auto-save on pause/background
- Save: score, board state, collection
- Resume: exactly where left off
- Collection: persists permanently

---

## Future Enhancements (Post-MVP)

- [ ] Themed events (holiday items)
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Undo button (limited uses)
- [ ] Board upgrades (larger grid)
- [ ] Seasonal collections

---

## Economy Compliance

**Aligned with Bible v1.11 §8.1.1**

This game complies with Mini-Game Economy Invariants:
- ❌ No gems awarded (any tier)
- ✅ Daily rewarded cap: 3 plays (shared with burst games)
- ✅ After cap: Playable for fun (0 rewards)
- ✅ Energy cost: 10 per play

See `docs/GRUNDY_MASTER_BIBLE.md` §8.1.1 for authoritative rules.

---

## References

- Bible §8.5 Session Mini-Games
- Bible §8.1.1 Mini-Game Economy Invariants
- Bible §11.4 Gem Sources (NO gems from mini-games)

---

**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
