# GRUNDY — Stack Snacks (Tetris) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-20 minutes  
**Priority:** P2  
**Complexity:** Medium (4-5 days)  
**Inspiration:** Tetris

---

## Overview

Food-shaped tetrominoes fall from the top. Rotate and place them to complete horizontal lines. Completed lines clear and award points. Game ends when stack reaches top.

**Core Fantasy:** Stack your snacks perfectly!

---

## Gameplay

```
     [Next: 🍕🍕]
         🍕🍕
    ┌──────────────┐
    │      🍎      │
    │      🍎🍎    │
    │    🍔🍎🍔    │
    │  🍕🍔🍔🍔🥗  │
    │🥗🍕🍕🍕🥗🥗🥗│  ← About to clear!
    └──────────────┘
```

---

## Core Loop

```
Piece spawns → Move/Rotate → Place → Clear lines → Score → Repeat until topped out
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Grid size | 10 wide × 20 tall |
| Piece types | 7 standard tetrominoes |
| Start speed | 1 tile/sec fall |
| Speed increase | +0.15 per level |
| Level up | Every 10 lines cleared |
| Max level | 15 |
| Lock delay | 0.5 seconds |
| Orientation | Portrait |

---

## Controls

| Input | Action |
|-------|--------|
| Swipe left | Move piece left |
| Swipe right | Move piece right |
| Swipe down | Soft drop (faster fall) |
| Tap | Rotate clockwise |
| Swipe up | Hard drop (instant place) |
| Double tap | Hold piece (swap) |

### On-Screen Buttons (Alternative)

```
┌─────────────────────────────────┐
│                                 │
│         [GAME AREA]             │
│                                 │
├─────────────────────────────────┤
│  [◀️]  [🔄]  [▶️]    [⬇️ Drop]  │
└─────────────────────────────────┘
```

---

## Piece Types (Tetrominoes)

Each piece is themed as a food type:

| Shape | Name | Food Theme | Color | Preview |
|-------|------|------------|-------|---------|
| I | Line | Carrot sticks | 🥕 Orange | ▪▪▪▪ |
| O | Square | Toast slices | 🍞 Brown | ▪▪<br>▪▪ |
| T | Tee | Pizza slices | 🍕 Red | ▪▪▪<br>&nbsp;▪ |
| S | Zigzag | Sushi roll | 🍣 Pink | &nbsp;▪▪<br>▪▪ |
| Z | Zigzag | Hot dog | 🌭 Yellow | ▪▪<br>&nbsp;▪▪ |
| J | Jay | Broccoli | 🥦 Green | ▪<br>▪▪▪ |
| L | Ell | Cheese wedge | 🧀 Yellow | &nbsp;&nbsp;▪<br>▪▪▪ |

---

## Scoring

### Line Clears

| Action | Base Points | With Level Multiplier |
|--------|-------------|----------------------|
| Single (1 line) | 100 | 100 × level |
| Double (2 lines) | 300 | 300 × level |
| Triple (3 lines) | 500 | 500 × level |
| Tetris (4 lines) | 800 | 800 × level |

### Other Points

| Action | Points |
|--------|--------|
| Soft drop | 1 per tile dropped |
| Hard drop | 2 per tile dropped |
| T-Spin | +400 bonus |
| T-Spin Single | +800 |
| T-Spin Double | +1200 |
| T-Spin Triple | +1600 |

### Combo System

| Consecutive Clears | Multiplier |
|--------------------|------------|
| 1st clear | 1.0x |
| 2nd clear | 1.25x |
| 3rd clear | 1.5x |
| 4th clear | 1.75x |
| 5th+ clear | 2.0x |

**Combo resets when a piece locks without clearing lines.**

---

## Difficulty Scaling (Levels)

| Level | Fall Speed | Lines to Next |
|-------|------------|---------------|
| 1 | 1.0 tiles/sec | 10 |
| 2 | 1.15 tiles/sec | 10 |
| 3 | 1.30 tiles/sec | 10 |
| 4 | 1.45 tiles/sec | 10 |
| 5 | 1.60 tiles/sec | 10 |
| 6 | 1.80 tiles/sec | 10 |
| 7 | 2.0 tiles/sec | 10 |
| 8 | 2.3 tiles/sec | 10 |
| 9 | 2.6 tiles/sec | 10 |
| 10 | 3.0 tiles/sec | 10 |
| 11 | 3.5 tiles/sec | 10 |
| 12 | 4.0 tiles/sec | 10 |
| 13 | 5.0 tiles/sec | 10 |
| 14 | 6.0 tiles/sec | 10 |
| 15 | 8.0 tiles/sec | ∞ (max) |

---

## Rewards

| Lines Cleared | Tier | Coin Reward | XP |
|---------------|------|-------------|-----|
| 0-9 | Bronze | 5 🪙 | 10 |
| 10-29 | Silver | 15 🪙 | 25 |
| 30-59 | Gold | 30 🪙 | 40 |
| 60-99 | Platinum | 50 🪙 | 60 |
| 100+ | Diamond | 75 🪙 | 80 |

**Economy Rules:**
- Energy cost: 10
- Daily cap: Shared with all mini-games (3/day free)
- Gems: ❌ NEVER awarded

---

## Game Features

### Next Piece Preview

Shows the next 3 pieces:

```
┌─────────┐
│ NEXT    │
├─────────┤
│  🍕🍕   │  ← Next
│  🍕🍕   │
├─────────┤
│  🥕🥕🥕🥕│  ← 2nd
├─────────┤
│  🧀     │  ← 3rd
│  🧀🧀🧀 │
└─────────┘
```

### Hold Piece

- Double tap to hold current piece
- Swaps with previously held piece
- Can only hold once per piece
- Held piece shown in "HOLD" box

```
┌─────────┐
│ HOLD    │
├─────────┤
│  🍣🍣   │
│    🍣🍣 │
└─────────┘
```

### Ghost Piece

- Semi-transparent preview showing where piece will land
- Helps with hard drops
- Can be toggled off in settings

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────────────┐
│ ⏸️   Score: 12,450    Level: 7         │
├─────────────────────────────────────────┤
│ ┌──────┐                    ┌────────┐  │
│ │ HOLD │                    │ NEXT   │  │
│ │ 🍣🍣 │  ┌──────────────┐  │ 🍕🍕   │  │
│ │   🍣🍣│  │              │  │ 🍕🍕   │  │
│ └──────┘  │              │  ├────────┤  │
│           │              │  │ 🥕🥕🥕🥕│  │
│           │   [PLAY      │  ├────────┤  │
│           │    FIELD]    │  │ 🧀     │  │
│           │              │  │ 🧀🧀🧀 │  │
│           │              │  └────────┘  │
│           │              │              │
│           │      🍞🍞    │  Lines: 47   │
│           │   🍎🍞🍞🥦   │              │
│           │🥦🍎🍎🍎🥦🥦🥦│              │
│           └──────────────┘              │
├─────────────────────────────────────────┤
│     [◀️]    [🔄]    [▶️]    [⬇️]        │
└─────────────────────────────────────────┘
```

### Game Over Screen

```
┌─────────────────────────────────┐
│                                 │
│       GAME OVER! 📦            │
│                                 │
│     Final Score: 24,680         │
│     Lines: 73                   │
│     Level: 9                    │
│     Best: 45,200                │
│                                 │
│     Tier: GOLD ⭐               │
│     Reward: +30 🪙  +40 XP      │
│                                 │
│  [🔄 Play Again]  [🏠 Exit]     │
│                                 │
└─────────────────────────────────┘
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Grid | Dark background with subtle lines |
| Pieces | Food-colored blocks with icons |
| Ghost piece | 30% opacity outline |
| Cleared line | Flash white, then disappear |
| Level up | Screen flash, fanfare |

### Animations

| Event | Animation |
|-------|-----------|
| Piece move | Smooth slide |
| Piece rotate | Snap rotation |
| Soft drop | Normal fall speed × 20 |
| Hard drop | Instant + trail effect |
| Line clear | Flash → collapse → shake |
| Tetris (4 lines) | Big flash + "TETRIS!" text |
| Level up | Border glow + sound |
| Game over | Stack grays out, pieces fall |

---

## Audio

| Event | Sound |
|-------|-------|
| Piece move | Click |
| Piece rotate | Whoosh |
| Piece lock | Thunk |
| Single clear | Ding |
| Double clear | Double ding |
| Triple clear | Triple ding |
| Tetris | Fanfare + "TETRIS!" voice |
| Combo | Rising pitch per combo |
| Level up | Achievement sound |
| Game over | Crash + sad trombone |

---

## Tutorial

**First Play Only:**

1. "Swipe to move pieces!" → Arrow prompts
2. "Tap to rotate!" → Rotation demo
3. "Complete lines to clear them!" → Line clears
4. "Swipe up for hard drop!" → Drop demo
5. "Go!" → Start at Level 1

**Duration:** ~20 seconds

---

## State Management

```typescript
interface TetrisGameState {
  // Grid
  grid: Cell[][];              // 10×20 array
  
  // Current piece
  currentPiece: Tetromino;
  piecePosition: Position;
  pieceRotation: number;       // 0, 90, 180, 270
  
  // Queue
  nextPieces: Tetromino[];     // Next 3
  heldPiece: Tetromino | null;
  canHold: boolean;
  
  // Game state
  score: number;
  level: number;
  linesCleared: number;
  combo: number;
  
  // Status
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  
  // Timing
  fallTimer: number;
  lockTimer: number;
  
  // Stats
  timeElapsed: number;
  tetrisCount: number;
  bestScore: number;
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-TETRIS-INIT-001 | Game initializes with empty grid |
| BCT-TETRIS-SPAWN-001 | Pieces spawn at top center |
| BCT-TETRIS-MOVE-001 | Pieces move left/right |
| BCT-TETRIS-ROTATE-001 | Pieces rotate correctly |
| BCT-TETRIS-ROTATE-002 | Wall kick works |
| BCT-TETRIS-DROP-001 | Soft drop increases fall speed |
| BCT-TETRIS-DROP-002 | Hard drop places instantly |
| BCT-TETRIS-LOCK-001 | Pieces lock after delay |
| BCT-TETRIS-CLEAR-001 | Complete lines clear |
| BCT-TETRIS-CLEAR-002 | Multiple lines clear together |
| BCT-TETRIS-SCORE-001 | Score calculates correctly |
| BCT-TETRIS-COMBO-001 | Combo multiplier applies |
| BCT-TETRIS-LEVEL-001 | Level increases every 10 lines |
| BCT-TETRIS-SPEED-001 | Fall speed increases per level |
| BCT-TETRIS-HOLD-001 | Hold swaps piece correctly |
| BCT-TETRIS-GAMEOVER-001 | Game ends when topped out |
| BCT-TETRIS-REWARD-001 | Coins awarded by tier |

---

## Duration Estimates

| Skill Level | Typical Duration | Typical Lines |
|-------------|------------------|---------------|
| Beginner | 3-5 minutes | 10-30 |
| Intermediate | 7-12 minutes | 40-80 |
| Expert | 15-25+ minutes | 100-200+ |

---

## Implementation Notes

### Rotation System

Use SRS (Super Rotation System):
- Standard rotation states (0, R, 2, L)
- Wall kick tests for each rotation
- T-Spin detection for bonus points

### Randomizer

Use 7-bag randomizer:
- All 7 pieces in a "bag"
- Draw randomly from bag
- Refill when empty
- Prevents long droughts

### Lock Delay

- 0.5 second delay before piece locks
- Reset on successful move/rotate
- Max 15 resets per piece (prevents infinite stalling)

---

## Future Enhancements (Post-MVP)

- [ ] Marathon mode (200 lines goal)
- [ ] Sprint mode (40 lines fastest time)
- [ ] VS CPU mode
- [ ] Custom skins for pieces
- [ ] Daily challenges

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
