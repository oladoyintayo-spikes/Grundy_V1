# GRUNDY — Hungry Hungry Grundy (Snake) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-15 minutes  
**Priority:** P1 — Implement First  
**Complexity:** Low (2-3 days)  
**Inspiration:** Classic Snake

---

## Overview

Control your pet as it slithers around eating food. Each food eaten makes your tail grow longer. Avoid hitting walls, obstacles, or your own tail.

**Core Fantasy:** Your hungry Grundy can't stop eating!

---

## Gameplay

```
┌─────────────────────────────┐
│         🍎                  │
│                             │
│    🐾🟡🟡🟡🟡               │  ← Pet head + tail
│                   💩        │  ← Obstacle (poop)
│                             │
│  🍕              🥗         │  ← Food spawns
│                             │
└─────────────────────────────┘

Controls: Swipe or D-pad to change direction
```

---

## Core Loop

```
Start (length 3) → Eat food → Grow longer → Avoid collision → Repeat until crash
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Grid size | 15×20 tiles (portrait) |
| Start length | 3 segments |
| Start speed | 5 tiles/sec |
| Speed increase | +0.5 every 10 foods eaten |
| Max speed | 12 tiles/sec |
| Food on screen | 1-3 items at once |
| Orientation | Portrait (mobile-first) |

---

## Controls

| Input | Action |
|-------|--------|
| Swipe up | Move up |
| Swipe down | Move down |
| Swipe left | Move left |
| Swipe right | Move right |
| Tap pause button | Pause game |

**Alternative:** On-screen D-pad (optional, accessibility)

```
       [🔼]
   [◀️]    [▶️]
       [🔽]
```

---

## Food Types & Effects

| Food | Rarity | Points | Growth | Spawn Rate |
|------|--------|--------|--------|------------|
| 🍎 Apple | Common | 10 | +1 | 20% |
| 🥕 Carrot | Common | 10 | +1 | 20% |
| 🍞 Bread | Common | 10 | +1 | 20% |
| 🍕 Pizza | Uncommon | 25 | +1 | 10% |
| 🍔 Burger | Uncommon | 25 | +1 | 10% |
| 🥗 Salad | Uncommon | 25 | +1 | 5% |
| 🍰 Cake | Rare | 50 | +2 | 5% |
| 🍣 Sushi | Rare | 50 | +2 | 3% |
| ⭐ Star Food | Rare | 100 | +2 | 2% |
| 💜 Pet Favorite | Special | 2x points | +1 | 5% |

### Power-Ups

| Power-Up | Effect | Duration | Spawn Condition |
|----------|--------|----------|-----------------|
| 💊 Shrink Pill | -3 segments | Instant | After length 15 |
| ⚡ Speed Boost | +50% speed, 2x points | 5 seconds | After 500 points |
| 🛡️ Shield | Ignore 1 collision | Until used | After length 20 |

---

## Obstacles

| Obstacle | Appearance | Behavior | Spawn Condition |
|----------|------------|----------|-----------------|
| Wall | Screen edge | Instant game over | Always |
| Own Tail | Yellow segments | Instant game over | Always |
| 💩 Poop Pile | Brown pile | Instant game over | After length 15 |
| 🪨 Rock | Gray rock | Instant game over | After length 25 |

**Obstacle Spawn Rules:**
- Poop piles spawn in random empty cells
- Maximum 3 poop piles on screen
- Rocks spawn at higher difficulties only

---

## Difficulty Scaling

| Phase | Length | Speed | Obstacles | Foods |
|-------|--------|-------|-----------|-------|
| Easy | 3-10 | 5-6 tiles/sec | None | 2 on screen |
| Medium | 11-20 | 7-8 tiles/sec | 1-2 poop | 2-3 on screen |
| Hard | 21-35 | 9-10 tiles/sec | 2-3 poop | 3 on screen |
| Expert | 36+ | 11-12 tiles/sec | 3 poop + rocks | 3 on screen |

---

## Scoring

| Action | Points |
|--------|--------|
| Common food | 10 |
| Uncommon food | 25 |
| Rare food | 50 |
| Pet favorite | 2x base |
| Speed boost active | 2x all |

### Milestone Bonuses

| Milestone | Bonus |
|-----------|-------|
| Length 10 | +50 points |
| Length 25 | +100 points |
| Length 50 | +250 points |
| Length 100 | +500 points |

---

## Rewards

| Score Range | Tier | Coin Reward | XP |
|-------------|------|-------------|-----|
| 0-99 | Bronze | 5 🪙 | 10 |
| 100-299 | Silver | 15 🪙 | 20 |
| 300-599 | Gold | 30 🪙 | 35 |
| 600-999 | Platinum | 50 🪙 | 50 |
| 1000+ | Diamond | 75 🪙 | 75 |

**Economy Rules:**
- Energy cost: 10 (same as burst games)
- Daily cap: Shared with all mini-games (3/day free)
- Gems: ❌ NEVER awarded (per Bible §11.4)

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────┐
│ ⏸️     Score: 247    🏆 892     │  ← Header
├─────────────────────────────────┤
│                                 │
│                                 │
│                                 │
│         [GAME AREA]             │
│         15×20 grid              │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│         Length: 12              │  ← Footer
└─────────────────────────────────┘
```

### Pause Overlay

```
┌─────────────────────────────────┐
│                                 │
│          ⏸️ PAUSED              │
│                                 │
│      Score: 247                 │
│      Length: 12                 │
│                                 │
│      [▶️ Resume]                │
│      [🏠 Quit]                  │
│                                 │
└─────────────────────────────────┘
```

### Game Over Screen

```
┌─────────────────────────────────┐
│                                 │
│        GAME OVER! 🐍            │
│                                 │
│      Final Score: 347           │
│      Length: 18                 │
│      Best: 892                  │
│                                 │
│      Tier: GOLD ⭐              │
│      Reward: +30 🪙  +35 XP     │
│                                 │
│   [🔄 Play Again]  [🏠 Exit]    │
│                                 │
└─────────────────────────────────┘
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Pet head | Current pet's sprite (small) |
| Tail segments | Rounded circles, pet's color |
| Food | Existing food sprites |
| Background | Subtle grid pattern |
| Obstacles | Poop/rock sprites from game |

### Animation

| Event | Animation |
|-------|-----------|
| Eating food | Pet bounces, +points floats up |
| Growing | New segment pops in |
| Power-up | Glow effect on pet |
| Collision | Screen shake, crash effect |
| Game over | Pet looks sad, fade out |

---

## Audio

| Event | Sound |
|-------|-------|
| Move tick | Subtle tick (optional) |
| Eat food | Munch/chomp |
| Eat rare food | Sparkle + munch |
| Power-up | Magic chime |
| Speed up | Whoosh |
| Near miss | Tense sound |
| Collision | Crash/bonk |
| Game over | Sad trombone |
| New high score | Fanfare |

---

## Tutorial

**First Play Only:**

1. "Swipe to move your Grundy!" → Arrow prompts
2. "Eat food to grow!" → Food highlighted
3. "Don't hit the walls or your tail!" → Danger zones flash
4. "Go!" → Tutorial ends, game starts slow

**Duration:** ~15 seconds

---

## State Management

```typescript
interface SnakeGameState {
  // Grid
  gridWidth: number;           // 15
  gridHeight: number;          // 20
  
  // Snake
  segments: Position[];        // Head is [0]
  direction: Direction;        // 'up' | 'down' | 'left' | 'right'
  nextDirection: Direction;    // Queued input
  
  // Game
  score: number;
  speed: number;               // tiles per second
  isPlaying: boolean;
  isPaused: boolean;
  
  // Food
  foods: FoodItem[];
  
  // Obstacles
  obstacles: Obstacle[];
  
  // Power-ups
  activeEffects: Effect[];
  
  // Stats
  foodEaten: number;
  timeElapsed: number;
  bestScore: number;
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-SNAKE-INIT-001 | Game initializes with length 3 |
| BCT-SNAKE-MOVE-001 | Swipe changes direction |
| BCT-SNAKE-MOVE-002 | Cannot reverse into self |
| BCT-SNAKE-GROW-001 | Eating food increases length |
| BCT-SNAKE-FOOD-001 | Food spawns in empty cells |
| BCT-SNAKE-FOOD-002 | Food points match spec |
| BCT-SNAKE-COLLISION-001 | Wall collision ends game |
| BCT-SNAKE-COLLISION-002 | Self collision ends game |
| BCT-SNAKE-COLLISION-003 | Obstacle collision ends game |
| BCT-SNAKE-SPEED-001 | Speed increases per 10 foods |
| BCT-SNAKE-OBSTACLE-001 | Poop spawns after length 15 |
| BCT-SNAKE-SCORE-001 | Score calculates correctly |
| BCT-SNAKE-REWARD-001 | Coins awarded by tier |
| BCT-SNAKE-PAUSE-001 | Pause stops game loop |
| BCT-SNAKE-RESUME-001 | Resume continues game |

---

## Duration Estimates

| Skill Level | Typical Duration | Typical Score |
|-------------|------------------|---------------|
| Beginner | 2-4 minutes | 50-150 |
| Intermediate | 5-8 minutes | 200-500 |
| Expert | 10-15+ minutes | 600-1500+ |

---

## Implementation Notes

### Performance
- Use requestAnimationFrame for smooth movement
- Only redraw changed cells
- Limit obstacle count for mobile performance

### Mobile Considerations
- Large touch targets for swipe detection
- Swipe threshold: 30px minimum
- Prevent accidental direction changes
- Handle interruptions (calls, notifications)

### Accessibility
- Optional D-pad for players who prefer buttons
- High contrast mode for visibility
- Screen reader announces score changes

---

## Future Enhancements (Post-MVP)

- [ ] Weekly challenges (specific food types only)
- [ ] Different pet skins for snake body
- [ ] Maze mode (walls inside arena)
- [ ] Two-player split screen (tablet)
- [ ] Global leaderboards

---

## References

- Bible §7.5.1 Session Games
- Bible §11.4 Gem Sources (NO gems from mini-games)
- Bible §7.1 Mini-Game Economy Rules
