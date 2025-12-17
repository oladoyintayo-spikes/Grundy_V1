# GRUNDY — Bubble Pop Kitchen (Bubble Shooter) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-15 minutes  
**Priority:** P4 — Future  
**Complexity:** Medium-High (5-7 days)  
**Inspiration:** Bubble Witch, Puzzle Bobble

---

## Overview

Shoot food bubbles upward to match 3+ of the same type. Clear the board before bubbles reach the danger line. Progress through levels with increasing difficulty.

**Core Fantasy:** Pop your way through a kitchen of colorful treats!

---

## Gameplay

```
    🍎🍕🍔🥗🍎🍕🍎
     🍔🥗🍎🍕🍔🥗
    🥗🍎🍕🍔🥗🍎🥗
     🍕🍔🥗🍎🍕🍔     ← Ceiling bubbles
    
    ─────────────────  ← Danger line
    
    
         🍎           ← Your shot (aiming)
        /
       🐾             ← Launcher (your pet)
    [🍕]              ← Next bubble
```

---

## Core Loop

```
Aim → Shoot → Match 3+ → Clear → Ceiling lowers → Repeat until level cleared or lost
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Grid type | Hexagonal offset |
| Grid width | 9 bubbles |
| Grid height | 12 rows max |
| Bubble types | 6 food colors |
| Match minimum | 3 bubbles |
| Ceiling drop | Every 5 shots |
| Aim assist | Trajectory line (first bounce) |
| Orientation | Portrait |

---

## Controls

| Input | Action |
|-------|--------|
| Touch & drag | Aim launcher |
| Release | Shoot bubble |
| Tap bubble queue | Swap current/next bubble |

**Aim System:**
- Touch anywhere to start aiming
- Drag to adjust angle
- Dotted line shows trajectory
- Line shows first wall bounce
- Release to fire

---

## Bubble Types

| Bubble | Food | Color | Hex Code |
|--------|------|-------|----------|
| 🍎 | Apple | Red | #E74C3C |
| 🍕 | Pizza | Orange | #E67E22 |
| 🥗 | Salad | Green | #27AE60 |
| 🍔 | Burger | Brown | #8B4513 |
| 🍇 | Grapes | Purple | #9B59B6 |
| 🧁 | Cupcake | Pink | #FF69B4 |

### Special Bubbles

| Bubble | Effect | Spawn |
|--------|--------|-------|
| 🌈 Rainbow | Matches any color | Level 10+ |
| 💣 Bomb | Clears 3×3 area | Level 15+ |
| ⭐ Star | Clears all of one color | Level 20+ |
| 🔥 Fire | Burns through row | Level 25+ |

---

## Level Structure

### Level Progression

| Level Range | Grid Rows | Colors | Special |
|-------------|-----------|--------|---------|
| 1-10 | 5-6 rows | 3-4 | None |
| 11-20 | 6-7 rows | 4-5 | Rainbow |
| 21-30 | 7-8 rows | 5-6 | + Bomb |
| 31-40 | 8-9 rows | 6 | + Star |
| 41-50 | 9-10 rows | 6 | + Fire |
| 51+ | 10+ rows | 6 | All |

### Level Goals

| Type | Description |
|------|-------------|
| Clear All | Remove all bubbles |
| Score Target | Reach X points |
| Limited Shots | Clear with N bubbles |
| Rescue | Drop trapped items |

---

## Scoring

### Basic Points

| Action | Points |
|--------|--------|
| 3-match | 30 |
| 4-match | 50 |
| 5-match | 80 |
| 6+ match | 120 |

### Bonus Points

| Bonus | Points | Condition |
|-------|--------|-----------|
| Drop bonus | 10 per bubble | Bubbles that fall after match |
| Combo | +25% per consecutive clear | Chain clears |
| Bank shot | +50% | Hit wall before matching |
| Precision | +100 | Clear with 1 bubble left |
| No ceiling drop | +200 | Clear before ceiling moves |

### Star Rating (Per Level)

| Stars | Condition |
|-------|-----------|
| ⭐ | Complete level |
| ⭐⭐ | Complete with 50%+ shots remaining |
| ⭐⭐⭐ | Complete with 70%+ shots remaining |

---

## Rewards

### Per Level

| Stars | Coin Reward |
|-------|-------------|
| ⭐ | 5 🪙 |
| ⭐⭐ | 10 🪙 |
| ⭐⭐⭐ | 20 🪙 |

### First Clear Bonus

| Stars | First Clear Bonus |
|-------|-------------------|
| ⭐ | +5 🪙 |
| ⭐⭐ | +10 🪙 |
| ⭐⭐⭐ | +15 🪙 |

**Economy Rules:**
- Energy cost: 10 per session (not per level)
- Session = up to 5 level attempts
- Daily cap: Shared with all mini-games
- Gems: ❌ NEVER awarded

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────┐
│ Level 15    ⭐⭐⭐    Score: 1,240│
├─────────────────────────────────┤
│    🍎🍕🍔🥗🍎🍕🍎              │
│     🍔🥗🍎🍕🍔🥗               │
│    🥗🍎🍕🍔🥗🍎🥗              │
│     🍕🍔🥗🍎🍕🍔               │
│                                 │
│                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │ ← Danger
│                                 │
│                                 │
│          ╱                      │
│         ╱                       │ ← Aim line
│        🍎                       │
│       🐾                        │ ← Launcher
├─────────────────────────────────┤
│   [🍕 Next]    Shots: 12        │
└─────────────────────────────────┘
```

### Level Complete Screen

```
┌─────────────────────────────────┐
│                                 │
│      LEVEL 15 COMPLETE! 🎉     │
│                                 │
│         ⭐⭐⭐                   │
│                                 │
│     Score: 2,450                │
│     Shots Left: 8/15            │
│                                 │
│     Reward: +20 🪙              │
│                                 │
│  [➡️ Next Level]  [🏠 Exit]     │
│                                 │
└─────────────────────────────────┘
```

### Level Failed Screen

```
┌─────────────────────────────────┐
│                                 │
│        LEVEL FAILED 😢         │
│                                 │
│     Bubbles hit danger line!    │
│                                 │
│     Best on this level: ⭐⭐    │
│                                 │
│  [🔄 Try Again]  [🏠 Exit]      │
│                                 │
└─────────────────────────────────┘
```

---

## Level Map

Players progress through a world map:

```
     ⭐⭐⭐    ⭐⭐    ⭐⭐⭐
      15 ──── 14 ──── 13
       │             │
      ⭐⭐          ⭐⭐⭐
      16 ──── 17 ──── 12
       │       │      │
      🔒      ⭐     ⭐⭐
      18      11 ──── 10
                      │
                    ...
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Bubbles | Round with food icon, glossy |
| Background | Kitchen theme per world |
| Launcher | Pet holding slingshot |
| Aim line | Dotted, fades at distance |
| Pop effect | Burst particles, food flies out |

### Animations

| Event | Animation |
|-------|-----------|
| Shoot | Bubble launches with trail |
| Attach | Bubble snaps into grid |
| Match | Bubbles flash, pop outward |
| Drop | Bubbles fall with gravity |
| Ceiling drop | Grid slides down with shake |
| Level complete | Remaining bubbles pop in sequence |

---

## Audio

| Event | Sound |
|-------|-------|
| Aim | Stretch/tension sound |
| Shoot | Pop/whoosh |
| Attach | Click |
| Match 3 | Pop trio |
| Match 4+ | Bigger pop + chime |
| Combo | Rising pitch |
| Bubbles drop | Cascade of pops |
| Ceiling drop | Rumble + thunk |
| Level complete | Celebration fanfare |
| Level failed | Sad deflate |

---

## State Management

```typescript
interface BubbleGameState {
  // Level
  currentLevel: number;
  levelGoal: LevelGoal;
  
  // Grid
  grid: Bubble[][];           // Hexagonal grid
  
  // Launcher
  currentBubble: Bubble;
  nextBubble: Bubble;
  aimAngle: number;
  
  // Progress
  score: number;
  shotsRemaining: number;
  shotsFired: number;
  ceilingPosition: number;
  
  // Combo
  lastClearCount: number;
  comboMultiplier: number;
  
  // Status
  isAiming: boolean;
  isShooting: boolean;
  isClearing: boolean;
  levelState: 'playing' | 'complete' | 'failed';
  
  // Stars
  starsEarned: number;
  
  // Lifetime
  levelsCompleted: number;
  totalStars: number;
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-BUBBLE-AIM-001 | Touch and drag aims launcher |
| BCT-BUBBLE-SHOOT-001 | Release fires bubble |
| BCT-BUBBLE-ATTACH-001 | Bubble attaches to grid |
| BCT-BUBBLE-MATCH-001 | 3+ same color clears |
| BCT-BUBBLE-DROP-001 | Orphaned bubbles fall |
| BCT-BUBBLE-SCORE-001 | Points calculate correctly |
| BCT-BUBBLE-COMBO-001 | Combo multiplier applies |
| BCT-BUBBLE-CEILING-001 | Ceiling drops every 5 shots |
| BCT-BUBBLE-FAIL-001 | Game fails at danger line |
| BCT-BUBBLE-WIN-001 | Level completes when cleared |
| BCT-BUBBLE-STAR-001 | Stars awarded by shots left |
| BCT-BUBBLE-SWAP-001 | Can swap current/next bubble |

---

## Implementation Notes

### Physics

- Bubble speed: 1500 pixels/sec
- Bubble bounces off walls (angle reflection)
- Bubble snaps to nearest grid position
- Gravity for falling bubbles: 980 px/sec²

### Hexagonal Grid

- Odd rows offset by half bubble width
- Each bubble has 6 neighbors
- Flood fill for orphan detection
- Use axial coordinates for calculations

### Match Detection

1. Find all connected same-color bubbles
2. If count ≥ 3, mark for removal
3. After removal, detect orphaned clusters
4. Drop orphaned bubbles

---

## Future Enhancements (Post-MVP)

- [ ] Boss levels (special large bubbles)
- [ ] Power-up shop (pre-level purchases)
- [ ] Daily puzzles (handcrafted levels)
- [ ] Endless mode
- [ ] Social features (send lives)

---

## References

- Bible §7.5.4 Session Games
- Bible §11.4 Gem Sources (NO gems from mini-games)
- Bible §7.1 Mini-Game Economy Rules
