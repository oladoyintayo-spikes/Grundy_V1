# GRUNDY — Munch Run (Endless Runner) Design Document

**Game Type:** Session Mini-Game  
**Duration:** 5-15 minutes  
**Priority:** P3  
**Complexity:** Medium (4-5 days)  
**Inspiration:** Temple Run, Subway Surfers

---

## Overview

Your pet runs automatically through a scrolling environment. Swipe to change lanes, jump, or slide to avoid obstacles while collecting food and coins.

**Core Fantasy:** Run, jump, and munch your way to a high score!

---

## Gameplay

```
        Lane 1    Lane 2    Lane 3
          │         │         │
    ════════════════════════════════
          │    🍎   │         │
          │         │   🌳    │  ← Obstacle (jump over)
          │         │         │
          │   💩    │         │  ← Obstacle (change lane)
          │         │    🍕   │
          │         │         │
          │    🐾   │         │  ← Your pet
    ════════════════════════════════

Controls: Swipe left/right = change lanes
          Swipe up = jump
          Swipe down = slide
```

---

## Core Loop

```
Auto-run → Collect food → Dodge obstacles → Speed increases → Until collision
```

---

## Specifications

| Attribute | Value |
|-----------|-------|
| Lanes | 3 |
| Start speed | 8 meters/sec |
| Max speed | 20 meters/sec |
| Speed increase | +0.5 every 100m |
| Jump height | Clears 1-tile obstacles |
| Slide distance | Passes under 2-tile high obstacles |
| Lane change time | 0.15 seconds |
| Orientation | Portrait |

---

## Controls

| Input | Action | Use Case |
|-------|--------|----------|
| Swipe left | Move to left lane | Dodge obstacles |
| Swipe right | Move to right lane | Dodge obstacles |
| Swipe up | Jump | Clear low obstacles, pits |
| Swipe down | Slide | Pass under high obstacles |
| Tap (while airborne) | Double jump | Extended height (power-up) |

**Input Detection:**
- Swipe threshold: 30px minimum
- Swipe direction: Dominant axis wins
- Queue inputs: 1 input buffered during animation

---

## Obstacles

| Obstacle | Visual | Height | Counter | Frequency |
|----------|--------|--------|---------|-----------|
| 💩 Poop pile | Brown pile | Low (1 tile) | Jump | Common |
| 🪨 Rock | Gray boulder | Low (1 tile) | Jump or lane change | Common |
| 🌳 Tree branch | Brown/green | High (2 tiles) | Slide | Common |
| 🚧 Barrier | Yellow/black | Medium | Jump | Uncommon |
| 🕳️ Pit | Black hole | Ground gap | Jump | Rare |
| 🧱 Wall | Full lane block | Full height | Lane change only | Uncommon |

### Obstacle Patterns

| Pattern | Description | Difficulty |
|---------|-------------|------------|
| Single | One obstacle, any lane | Easy |
| Double | Two obstacles, two lanes | Medium |
| Gap | One safe lane | Hard |
| Jump-Slide | Low then high in sequence | Medium |
| Pit + Side | Pit center, obstacles on sides | Hard |

---

## Collectibles

| Item | Visual | Points | Effect | Spawn |
|------|--------|--------|--------|-------|
| 🍎 Common food | Apple, carrot | 10 | — | 60% |
| 🍕 Uncommon food | Pizza, burger | 25 | — | 25% |
| 🍰 Rare food | Cake, sushi | 50 | — | 10% |
| 🪙 Coin | Gold coin | 5 | +5 bonus coins | 30% |
| 💜 Pet favorite | Glowing food | 2x points | — | 5% |

### Power-Ups

| Power-Up | Visual | Effect | Duration |
|----------|--------|--------|----------|
| ⭐ Star | Gold star | Invincibility | 5 seconds |
| 🧲 Magnet | Magnet icon | Auto-collect nearby items | 8 seconds |
| 🦶 Speed Boost | Lightning bolt | +50% speed + invincibility | 3 seconds |
| 🦘 Super Jump | Spring icon | Double jump ability | 10 seconds |
| 💰 Coin Frenzy | Coin shower | 2x coin value | 8 seconds |

---

## Environments (Themes)

| Environment | Unlock | Visual Style |
|-------------|--------|--------------|
| 🏡 Garden | Default | Green grass, flowers |
| 🏖️ Beach | 1000m total | Sand, ocean, palm trees |
| 🌲 Forest | 5000m total | Trees, mushrooms |
| 🏔️ Mountain | 10000m total | Snow, rocks, clouds |
| 🌙 Night | 20000m total | Stars, moon, fireflies |

**Environment transitions happen every 500m during a run.**

---

## Difficulty Scaling

| Distance | Speed | Obstacles | Power-Ups |
|----------|-------|-----------|-----------|
| 0-500m | 8-10 m/s | Singles only | Common |
| 500-1500m | 10-13 m/s | Singles + Doubles | All available |
| 1500-3000m | 13-16 m/s | Doubles + Patterns | Less frequent |
| 3000-5000m | 16-18 m/s | Complex patterns | Rare |
| 5000m+ | 18-20 m/s | Maximum difficulty | Very rare |

---

## Scoring

| Source | Points |
|--------|--------|
| Distance | 1 per meter |
| Common food | 10 |
| Uncommon food | 25 |
| Rare food | 50 |
| Pet favorite | 2x food value |
| Coins | 5 (bonus, not score) |
| Near miss | +10 bonus |

### Multipliers

| Condition | Multiplier |
|-----------|------------|
| Speed boost active | 2x all points |
| No hits for 500m | 1.5x distance points |
| Combo (collect 10+ in a row) | +10% per item |

---

## Rewards

| Distance | Tier | Coin Reward | XP |
|----------|------|-------------|-----|
| 0-499m | Bronze | 5 🪙 | 10 |
| 500-1499m | Silver | 15 🪙 | 25 |
| 1500-2999m | Gold | 30 🪙 | 40 |
| 3000-4999m | Platinum | 50 🪙 | 60 |
| 5000m+ | Diamond | 75 🪙 | 80 |

**Bonus Coins:** All 🪙 collected during run are added on top of tier reward.

**Economy Rules:**
- Energy cost: 10
- Daily cap: Shared with all mini-games (3/day free)
- Gems: ❌ NEVER awarded

---

## UI Layout

### Game Screen

```
┌─────────────────────────────────┐
│ ⏸️  1,247m    Score: 3,450     │
├─────────────────────────────────┤
│         🍎        🪙           │
│                                 │
│    🌳                          │
│              🍕                 │
│                        💩      │
│                                 │
│              🐾                 │  ← Your pet
│ ═══════════════════════════════│
│                                 │
├─────────────────────────────────┤
│  🪙 47       ⭐ Active: 3s     │
└─────────────────────────────────┘
```

### Power-Up Active Indicator

```
┌─────────────────────┐
│ ⭐ INVINCIBLE! 3s   │  ← Countdown bar
└─────────────────────┘
```

### Game Over Screen

```
┌─────────────────────────────────┐
│                                 │
│       GAME OVER! 🏃            │
│                                 │
│     Distance: 2,847m            │
│     Score: 8,230                │
│     Best: 5,124m                │
│                                 │
│     Coins Collected: 47 🪙      │
│                                 │
│     Tier: GOLD ⭐               │
│     Reward: +30 🪙  +47 🪙      │
│             +40 XP              │
│                                 │
│  [🔄 Play Again]  [🏠 Exit]     │
│                                 │
└─────────────────────────────────┘
```

---

## Visual Style

| Element | Style |
|---------|-------|
| Pet | Current pet sprite, running animation |
| Ground | Scrolling texture per environment |
| Obstacles | 3D-ish sprites with shadows |
| Collectibles | Floating, slight bobbing |
| Power-ups | Glowing, pulsing |
| Background | Parallax scrolling (3 layers) |

### Animations

| Event | Animation |
|-------|-----------|
| Running | Pet runs with 4-frame cycle |
| Jump | Pet tucks legs, arc trajectory |
| Slide | Pet crouches/rolls |
| Lane change | Quick sidestep |
| Collect food | Food flies to score, +points popup |
| Power-up | Flash effect, icon appears |
| Hit obstacle | Trip animation, tumble |
| Near miss | Sweat drop, close call effect |

---

## Audio

| Event | Sound |
|-------|-------|
| Footsteps | Rhythmic patter (matches speed) |
| Jump | Boing/whoosh |
| Slide | Swoosh |
| Lane change | Quick slide |
| Collect food | Munch |
| Collect coin | Cha-ching |
| Power-up | Magic chime |
| Invincibility | Upbeat jingle (loops) |
| Near miss | Gasp |
| Speed milestone | Whoosh + ding |
| Hit obstacle | Crash/bonk |
| Game over | Tumble + sad sound |

---

## Tutorial

**First Play Only:**

1. "Swipe left or right to change lanes!" → Lane demo
2. "Swipe up to jump over obstacles!" → Jump demo
3. "Swipe down to slide under obstacles!" → Slide demo
4. "Collect food for points!" → Food highlighted
5. "How far can you run?" → Game starts

**Duration:** ~20 seconds

---

## State Management

```typescript
interface RunnerGameState {
  // Position
  distance: number;           // meters traveled
  currentLane: number;        // 0, 1, 2
  verticalState: 'ground' | 'jumping' | 'sliding';
  
  // Motion
  speed: number;              // meters per second
  jumpProgress: number;       // 0-1 for arc
  slideProgress: number;      // 0-1 for duration
  
  // Score
  score: number;
  coinsCollected: number;
  combo: number;
  
  // Power-ups
  activePowerUps: PowerUp[];
  
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  
  // World
  currentEnvironment: Environment;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  
  // Stats
  bestDistance: number;
  totalDistance: number;     // Lifetime stat
}
```

---

## BCT Test Requirements

| BCT ID | Description |
|--------|-------------|
| BCT-RUNNER-INIT-001 | Game starts in center lane |
| BCT-RUNNER-LANE-001 | Swipe left moves left |
| BCT-RUNNER-LANE-002 | Swipe right moves right |
| BCT-RUNNER-LANE-003 | Cannot move past edge lanes |
| BCT-RUNNER-JUMP-001 | Swipe up triggers jump |
| BCT-RUNNER-JUMP-002 | Jump clears low obstacles |
| BCT-RUNNER-SLIDE-001 | Swipe down triggers slide |
| BCT-RUNNER-SLIDE-002 | Slide clears high obstacles |
| BCT-RUNNER-COLLECT-001 | Food adds points |
| BCT-RUNNER-COLLECT-002 | Coins add to coin count |
| BCT-RUNNER-COLLISION-001 | Obstacle collision ends game |
| BCT-RUNNER-SPEED-001 | Speed increases with distance |
| BCT-RUNNER-POWERUP-001 | Star grants invincibility |
| BCT-RUNNER-POWERUP-002 | Magnet auto-collects |
| BCT-RUNNER-REWARD-001 | Coins awarded by tier |

---

## Duration Estimates

| Skill Level | Typical Distance | Typical Duration |
|-------------|------------------|------------------|
| Beginner | 300-800m | 1-3 minutes |
| Intermediate | 1500-3000m | 4-7 minutes |
| Expert | 5000m+ | 10-15+ minutes |

---

## Implementation Notes

### Spawning System

- Obstacles spawn 50m ahead of player
- Use spawn tables for difficulty curves
- Guarantee at least one safe path
- Minimum gap between obstacles: 15m
- Collectibles spawn in patterns (lines, arcs)

### Collision Detection

- Player hitbox: 0.8 × 0.8 × 1.5 (width × depth × height)
- Obstacle hitboxes vary by type
- Power-up invincibility = no collision check
- Near miss detection: 0.3m tolerance

### Performance

- Object pooling for obstacles/collectibles
- Despawn objects 20m behind player
- LOD for distant objects
- Target 60fps on mobile

---

## Future Enhancements (Post-MVP)

- [ ] Daily challenges (collect 100 apples, no jumping)
- [ ] Character skins (different run animations)
- [ ] Missions (3 active at a time)
- [ ] Revive with coins option
- [ ] Multiplayer race mode

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
