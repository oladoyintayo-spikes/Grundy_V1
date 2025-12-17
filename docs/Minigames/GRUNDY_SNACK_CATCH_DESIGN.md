# GRUNDY — SNACK CATCH MINI-GAME DESIGN

**Version:** 1.0  
**Status:** Approved  
**Added:** December 2024

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Snack Catch |
| **Type** | Arcade / Reflex |
| **Duration** | 60 seconds |
| **Energy Cost** | 10 |
| **Daily Cap** | 3 rewarded plays |
| **Main Skill** | Reflexes, hand-eye coordination |
| **Unlock** | Player Level 2 |

---

## Concept

Catch falling food in a basket while avoiding bad items. A classic arcade-style game that tests reflexes and rewards knowledge of your pet's food preferences.

**Core Mechanic:**
- Food falls from top of screen at varying speeds
- Move basket left/right to catch items
- Pet's favorite foods = bonus points
- Disliked foods and bad items = lose points
- Survive 60 seconds, maximize score

---

## Gameplay

### Controls
- **Touch:** Drag basket horizontally
- **Alternative:** Tap left/right sides to move
- One-handed play optimized

### Win Condition
- Survive full 60 seconds
- Score determines reward tier

### Fail Condition
- None (always completes, score varies)

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│  🎯 SNACK CATCH        Time: 0:47       │
│                        Score: 185       │
├─────────────────────────────────────────┤
│                                         │
│        🍎          💣                   │
│                                         │
│              🍌                         │
│    🥕                      🍇           │
│                                         │
│                    🍪                   │
│         🌶️                              │
│                                         │
│              ┌─────────┐                │
│              │  🧺     │                │
│              └─────────┘                │
│                                         │
│          Combo: x5 🔥                   │
└─────────────────────────────────────────┘
```

---

## Items

### Food Items (from foods.ts)

| Item | Base Points | With Affinity |
|------|-------------|---------------|
| Any food | +10 | Modified by pet preference |
| Loved food | +10 | → +30 |
| Liked food | +10 | → +20 |
| Neutral food | +10 | → +10 |
| Disliked food | +10 | → -15 |

### Bad Items

| Item | Points | Spawn Rate |
|------|--------|------------|
| 💣 Bomb | -25 | 10% |
| 🗑️ Trash | -20 | 8% |
| 🪨 Rock | -15 | 7% |

### Special Items (Rare)

| Item | Effect | Spawn Rate |
|------|--------|------------|
| ⭐ Star | +50 points | 3% |
| 🌈 Rainbow | 2x points for 5s | 2% |
| 🧲 Magnet | Auto-catch for 3s | 2% |

---

## Scoring

| Action | Points |
|--------|--------|
| Catch loved food | +30 |
| Catch liked food | +20 |
| Catch neutral food | +10 |
| Catch disliked food | -15 |
| Catch bad item | -20 to -25 |
| Catch star | +50 |
| Combo bonus (per streak) | +2 (max +10) |
| Miss food (falls off) | 0 (no penalty) |

**Combo System:**
- Consecutive catches without miss = combo
- Each combo level adds +2 points
- Max combo bonus: +10 per catch
- Missing any item or catching bad item resets combo

---

## Difficulty Progression (Within Game)

| Time | Fall Speed | Spawn Rate | Bad Item % |
|------|------------|------------|------------|
| 0-20s | Slow | 1/sec | 5% |
| 20-40s | Medium | 1.5/sec | 15% |
| 40-60s | Fast | 2/sec | 25% |

---

## Reward Tiers

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-99 | 2 | 3 | — |
| Silver | 100-199 | 5 | 5 | 20% common |
| Gold | 200-299 | 8 | 7 | 40% common |
| Rainbow | 300+ | 12 | 10 | 60% uncommon |

**No gems.** Mini-games provide small helpful gifts, not wealth.

---

## Pet Abilities

| Pet | Ability Name | Effect |
|-----|--------------|--------|
| **Munchlet** | Comfort Zone | Basket 20% wider |
| **Grib** | Zen Focus | Bad items fall 30% slower |
| **Plompo** | Slow Fall | ALL items fall 20% slower |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Hands | Spicy foods worth 3× points |
| **Chomper** | Iron Stomach | Bad items only -5 points (not -20/-25) |
| **Whisp** | Ghostly Dodge | One free pass through bad item per game |
| **Luxe** | Lucky Drops | 2× chance for special items (star/rainbow/magnet) |

---

## Anti-Spam Mechanics

| Mechanic | Value | Purpose |
|----------|-------|---------|
| Energy cost | 10 | Limits to 5 plays from full |
| Daily cap | 3 rewarded | Prevents farming |
| First daily | FREE | Encourages engagement |
| After cap | Play for fun | No rewards, just practice |
| Session length | 60s | Time investment per play |

---

## Technical Notes

### State

```typescript
interface SnackCatchGameState {
  score: number
  combo: number
  timeRemaining: number
  basketX: number           // 0.0 to 1.0 (screen position)
  fallingItems: FallingItem[]
  activePowerup: 'rainbow' | 'magnet' | null
  powerupTimeLeft: number
  ghostDodgeUsed: boolean   // Whisp ability
}

interface FallingItem {
  id: number
  type: 'food' | 'bad' | 'special'
  itemId: string            // e.g., 'apple', 'bomb', 'star'
  x: number                 // 0.0 to 1.0
  y: number                 // 0.0 (top) to 1.0 (bottom)
  speed: number
}
```

### Spawn Logic

```typescript
function spawnItem(gameTime: number): FallingItem {
  const badChance = gameTime < 20 ? 0.05 : gameTime < 40 ? 0.15 : 0.25
  const specialChance = 0.07
  
  const roll = Math.random()
  if (roll < specialChance) return createSpecialItem()
  if (roll < specialChance + badChance) return createBadItem()
  return createFoodItem() // Uses foods from foods.ts
}
```

---

## Animations

| Event | Animation |
|-------|-----------|
| Item spawn | Fade in at top |
| Basket move | Smooth lerp to touch position |
| Catch food | Item shrinks into basket + sparkle |
| Catch bad | Basket shakes + puff of smoke |
| Combo increase | Fire emoji rises |
| Combo break | Combo counter shatters |
| Star catch | Screen flash + big "+50" |
| Rainbow active | Rainbow trail on basket |
| Magnet active | Items curve toward basket |
| Game end | Items fade, results overlay |

---

## Sound Effects

| Event | Sound |
|-------|-------|
| Food catch | Soft "pop" |
| Bad item catch | Buzzer |
| Star catch | Magical chime |
| Combo x5 | Rising tone |
| Combo x10 | Triumphant chord |
| Combo break | Sad trombone (short) |
| Time warning (10s) | Ticking |
| Game end | Results fanfare |

---

## Integration Points

- **Energy System:** Deduct 10 on game start
- **Food Data:** Use foods.ts for spawnable items
- **Pet Affinity:** Check active pet's food preferences for scoring
- **Stats Tracking:** Increment `minigamesCompleted` on finish
- **Unlock Check:** After game, check if Ember unlocks (10 games)
- **Pet Ability:** Apply active pet's ability at game start

---

## Test Cases

| TC | Test | Expected |
|----|------|----------|
| TC-301 | Basket moves with touch | Smooth horizontal movement |
| TC-302 | Foods spawn and fall | Varied items at correct rates |
| TC-303 | Catch detection works | Items within basket X = caught |
| TC-304 | Score updates correctly | Points match affinity |
| TC-305 | Combo builds | +2 per consecutive catch |
| TC-306 | Combo resets on miss | Counter returns to 0 |
| TC-307 | Bad items penalize | Score decreases |
| TC-308 | Speed increases over time | Faster at 20s, 40s marks |
| TC-309 | Game ends at 60s | Results screen shows |
| TC-310 | Munchlet wider basket | Hitbox 20% larger |
| TC-311 | Chomper reduced penalty | Bad items only -5 |
| TC-312 | Energy deducted | -10 on game start |

---

## Economy Compliance

**Aligned with Bible v1.11 §8.1.1**

This game complies with Mini-Game Economy Invariants:
- ❌ No gems awarded (any tier)
- ✅ Daily rewarded cap: 3 plays (shared)
- ✅ After cap: Playable for fun (0 rewards)
- ✅ Energy cost: 10 per play

See `docs/GRUNDY_MASTER_BIBLE.md` §8.1.1 for authoritative rules.

---

**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11

---

*END OF SNACK CATCH DESIGN*
