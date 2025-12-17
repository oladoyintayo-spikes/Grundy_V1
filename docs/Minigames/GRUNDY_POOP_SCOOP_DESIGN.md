# GRUNDY — POOP SCOOP MINI-GAME DESIGN

**Version:** 1.0  
**Status:** Approved  
**Added:** December 2024

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Poop Scoop |
| **Type** | Action / Speed |
| **Duration** | 60 seconds |
| **Energy Cost** | 10 |
| **Daily Cap** | 3 rewarded plays |
| **Main Skill** | Speed, attention |
| **Unlock** | Player Level 4 |

---

## Concept

Clean up poop before it piles up! A fast-paced tapping game with humor. Keep the play area clean by quickly tapping to scoop poop before the stink meter fills.

**Core Mechanic:**
- Poop spawns randomly on the play area
- Tap poop to scoop it up
- Stink meter rises if poop lingers too long
- Stink meter full = game over
- Survive 60 seconds to win

---

## Gameplay

### Controls
- Tap poop to clean it
- Multi-touch supported (can tap multiple at once)
- Hold and drag for "sweep" clean (covers area)

### Win Condition
- Survive full 60 seconds without stink meter filling

### Fail Condition
- Stink meter reaches 100%

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│  🧹 POOP SCOOP         Time: 0:42       │
│                        Score: 340       │
├─────────────────────────────────────────┤
│  STINK: [████████░░░░░░░░░░░░] 40%     │
├─────────────────────────────────────────┤
│                                         │
│        💩              💩               │
│                                         │
│    💩         🌟                        │
│                        💩               │
│                                         │
│        💩                    💩         │
│                                         │
│            💩        💩                 │
│                                         │
│    ✨              💩                   │
│                        (stinking)       │
└─────────────────────────────────────────┘
```

---

## Poop Types

| Type | Visual | Points | Stink Rate | Spawn Rate |
|------|--------|--------|------------|------------|
| Normal 💩 | Brown pile | 10 | +2%/sec | 70% |
| Fresh 🟤 | Small, light | 5 | +1%/sec | 15% |
| Stinky 💩💨 | With stink lines | 20 | +5%/sec | 10% |
| Golden 🌟 | Golden sparkle | 50 | 0%/sec | 3% |
| Rainbow 🌈 | Multicolor | 30 + powerup | 0%/sec | 2% |

### Stink Mechanic
- Each poop adds to stink meter over time
- Older poop = faster stink buildup
- Clean quickly to prevent stink accumulation
- Stink slowly decreases when no poop on screen

---

## Scoring

| Action | Points |
|--------|--------|
| Clean normal poop | +10 |
| Clean fresh poop | +5 |
| Clean stinky poop | +20 |
| Clean golden poop | +50 |
| Clean rainbow poop | +30 + powerup |
| Quick clean (<1s) | +5 bonus |
| Combo (3+ rapid) | +2 per combo |
| Survival bonus | +3 per second survived |

**Streak System:**
- Clean 3+ poop within 2 seconds = streak
- Streak adds +2 points per poop
- Max streak bonus: +10

---

## Difficulty Progression (Within Game)

| Time | Spawn Rate | Poop Types | Stink Speed |
|------|------------|------------|-------------|
| 0-20s | 1/2 sec | Normal, Fresh | Slow |
| 20-40s | 1/1.5 sec | + Stinky | Medium |
| 40-60s | 1/sec | + Golden, Rainbow | Fast |

---

## Powerups (From Rainbow Poop)

| Powerup | Effect | Duration |
|---------|--------|----------|
| 🧲 Magnet | Auto-collect nearby poop | 3 seconds |
| ❄️ Freeze | No new poop spawns | 3 seconds |
| 💨 Air Fresh | Stink meter -30% | Instant |
| ⚡ Speed Scoop | Tap = clear 3×3 area | 4 seconds |

---

## Reward Tiers

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-199 | 2 | 3 | — |
| Silver | 200-399 | 5 | 5 | 20% common |
| Gold | 400-599 | 8 | 7 | 45% common |
| Rainbow | 600+ | 12 | 10 | 65% uncommon |

**No gems.** Mini-games provide small helpful gifts, not wealth.

---

## Pet Abilities

| Pet | Ability Name | Effect |
|-----|--------------|--------|
| **Munchlet** | Helpful Paws | Tap radius 30% larger |
| **Grib** | Chill Vibes | Stink meter fills 25% slower |
| **Plompo** | Heavy Steps | Each tap cleans 2×2 area |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Cleanup | Stinky poop worth 3× points |
| **Chomper** | Nom Nom | "Eats" poop for 2× points (eww but effective) |
| **Whisp** | Ghost Scoop | 3 auto-cleans per game (oldest poop) |
| **Luxe** | Diva Rage | Every 15 poop cleaned, clear all at once |

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
interface PoopScoopGameState {
  poops: PoopItem[]
  score: number
  stinkMeter: number          // 0-100
  timeRemaining: number
  streak: number
  poopsCleaned: number
  activePowerup: PowerupType | null
  powerupTimeLeft: number
  autoScoupsLeft: number      // Whisp ability
  divaRageCounter: number     // Luxe ability
  isGameOver: boolean
}

interface PoopItem {
  id: number
  type: 'normal' | 'fresh' | 'stinky' | 'golden' | 'rainbow'
  x: number                   // 0.0 to 1.0
  y: number                   // 0.0 to 1.0
  age: number                 // ms since spawn
  stinkContribution: number   // Current stink rate
}

type PowerupType = 'magnet' | 'freeze' | 'airfresh' | 'speedscoop'
```

### Spawn Logic

```typescript
function spawnPoop(gameTime: number): PoopItem {
  const spawnRate = gameTime < 20 ? 0.7 : gameTime < 40 ? 0.85 : 1.0
  
  // Type selection based on time
  const types = ['normal', 'fresh']
  if (gameTime > 20) types.push('stinky')
  if (gameTime > 40) types.push('golden', 'rainbow')
  
  const weights = {
    normal: 70,
    fresh: 15,
    stinky: gameTime > 20 ? 10 : 0,
    golden: gameTime > 40 ? 3 : 0,
    rainbow: gameTime > 40 ? 2 : 0
  }
  
  return {
    id: Date.now(),
    type: weightedRandom(types, weights),
    x: Math.random() * 0.8 + 0.1,  // Avoid edges
    y: Math.random() * 0.7 + 0.15,
    age: 0,
    stinkContribution: getStinkRate(type)
  }
}
```

### Stink Calculation

```typescript
function updateStink(state: PoopScoopGameState, deltaMs: number): number {
  let stinkDelta = 0
  
  state.poops.forEach(poop => {
    const ageMultiplier = 1 + (poop.age / 5000)  // Older = worse
    stinkDelta += poop.stinkContribution * ageMultiplier * (deltaMs / 1000)
  })
  
  // Decrease if no poop
  if (state.poops.length === 0) {
    stinkDelta = -2 * (deltaMs / 1000)
  }
  
  return Math.max(0, Math.min(100, state.stinkMeter + stinkDelta))
}
```

---

## Animations

| Event | Animation |
|-------|-----------|
| Poop spawn | Pop in with small bounce |
| Poop aging | Gets larger, stink lines appear |
| Poop clean | Squish + sparkles + float away |
| Golden clean | Explosion of coins |
| Rainbow clean | Rainbow burst + powerup icon |
| Streak | Numbers fly up in sequence |
| Stink rising | Meter pulses, screen edges green |
| Stink critical (80%+) | Screen shakes slightly |
| Game over | Stink explosion, flies swarm |
| Win | Sparkle clean, "Fresh!" text |

---

## Sound Effects

| Event | Sound |
|-------|-------|
| Poop spawn | Soft "plop" |
| Normal clean | Satisfying "squish" |
| Golden clean | Coin jingle |
| Rainbow clean | Magical chime |
| Streak | Rising "ding ding ding" |
| Stink warning | Fly buzzing |
| Stink critical | Alarm beep |
| Game over | Sad trombone + splat |
| Win | Cheerful "ta-da!" |

---

## Integration Points

- **Energy System:** Deduct 10 on game start
- **Stats Tracking:** Increment `minigamesCompleted` on finish
- **Unlock Check:** After game, check if Ember unlocks (10 games)
- **Pet Ability:** Apply active pet's ability at game start

---

## Test Cases

| TC | Test | Expected |
|----|------|----------|
| TC-601 | Poop spawns randomly | Valid positions within bounds |
| TC-602 | Tap cleans poop | Poop removed, points added |
| TC-603 | Stink meter rises | Increases with poop on screen |
| TC-604 | Stink meter decreases | Falls when screen clean |
| TC-605 | Game over at 100% stink | End screen shows |
| TC-606 | Survive 60s = win | Victory screen |
| TC-607 | Golden poop bonus | +50 points |
| TC-608 | Rainbow gives powerup | Random powerup activates |
| TC-609 | Magnet auto-collects | Nearby poop cleaned |
| TC-610 | Freeze stops spawns | No new poop for 3s |
| TC-611 | Streak system | 3+ rapid = bonus |
| TC-612 | Plompo 2×2 area | Each tap cleans area |
| TC-613 | Whisp auto-scoops | 3 auto-cleans per game |
| TC-614 | Luxe diva rage | Every 15, clear all |
| TC-615 | Energy deducted | -10 on game start |

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

*END OF POOP SCOOP DESIGN*
