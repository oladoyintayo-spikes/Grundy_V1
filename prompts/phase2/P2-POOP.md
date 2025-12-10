# Claude Code Prompt: Grundy P8-POOP-1 – Poop Scoop Mini-Game

ROLE: Web Implementer Agent for the Grundy project.

You implement features. You operate under `ORCHESTRATOR.md`.

---

## Pre-Flight

Before starting, sync to latest main:

```bash
git checkout main
git pull origin main
```

---

## Scope

**Workstream:** P8-POOP
**Task:**

- P8-POOP-1 — Implement Poop Scoop game (60s action)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

---

## Read FIRST

1. `docs/Minigames/GRUNDY_POOP_SCOOP_DESIGN.md` — **Complete specification** for this game
2. `src/game/store.ts` — Current store structure
3. `src/types/index.ts` — Shared type definitions
4. `src/game/miniGameRewards.ts` — Reward tier calculator (from P8-INFRA)
5. `src/components/MiniGameSession.tsx` — Game session wrapper (from P8-INFRA)
6. `TASKS.md` — This task row for context

---

## Mini-Game Rules (LOCKED)

These rules come from the Bible and are **NOT** negotiable:

| Rule | Value |
|------|-------|
| Energy cost | 10 per game |
| Daily cap | 3 rewarded plays per game |
| First daily play | FREE |
| Gems from mini-games | **NEVER** |
| Rewards | Coins, XP, food drops only |

If the current code conflicts with these rules, follow the rules above and call out the discrepancy in your output.

---

## Objectives

### 1. Implement Poop Scoop Game Component

Create `src/components/games/PoopScoop.tsx`:

**Core Mechanics (from design doc):**
- Poop spawns randomly on the play area
- Tap poop to scoop it up (clean it)
- Stink meter rises if poop lingers too long
- Stink meter full (100%) = game over
- Survive 60 seconds to win
- Multi-touch supported
- Hold and drag for "sweep" clean (covers area)

### 2. Implement Game State

Use the state interface from the design doc:

```typescript
interface PoopScoopGameState {
  poops: PoopItem[];
  score: number;
  stinkMeter: number;          // 0-100
  timeRemaining: number;
  streak: number;
  poopsCleaned: number;
  activePowerup: PowerupType | null;
  powerupTimeLeft: number;
  autoScoopsLeft: number;      // Whisp ability
  divaRageCounter: number;     // Luxe ability
  isGameOver: boolean;
}

interface PoopItem {
  id: number;
  type: 'normal' | 'fresh' | 'stinky' | 'golden' | 'rainbow';
  x: number;                   // 0.0 to 1.0
  y: number;                   // 0.0 to 1.0
  age: number;                 // ms since spawn
  stinkContribution: number;   // Current stink rate
}

type PowerupType = 'magnet' | 'freeze' | 'airfresh' | 'speedscoop';
```

### 3. Implement Poop Types

| Type | Visual | Points | Stink Rate | Spawn Rate |
|------|--------|--------|------------|------------|
| Normal 💩 | Brown pile | 10 | +2%/sec | 70% |
| Fresh 🟤 | Small, light | 5 | +1%/sec | 15% |
| Stinky 💩💨 | With stink lines | 20 | +5%/sec | 10% |
| Golden 🌟 | Golden sparkle | 50 | 0%/sec | 3% |
| Rainbow 🌈 | Multicolor | 30 + powerup | 0%/sec | 2% |

### 4. Implement Pet Abilities

All 8 pet abilities as defined in the design doc:

| Pet | Ability | Effect |
|-----|---------|--------|
| **Munchlet** | Helpful Paws | Tap radius 30% larger |
| **Grib** | Chill Vibes | Stink meter fills 25% slower |
| **Plompo** | Heavy Steps | Each tap cleans 2×2 area |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Cleanup | Stinky poop worth 3× points |
| **Chomper** | Nom Nom | "Eats" poop for 2× points |
| **Whisp** | Ghost Scoop | 3 auto-cleans per game (oldest poop) |
| **Luxe** | Diva Rage | Every 15 poop cleaned, clear all at once |

### 5. Implement Stink Mechanic

- Each poop adds to stink meter over time
- Older poop = faster stink buildup (age multiplier)
- Clean quickly to prevent stink accumulation
- Stink slowly decreases when no poop on screen

```typescript
function updateStink(state: PoopScoopGameState, deltaMs: number): number {
  let stinkDelta = 0;

  state.poops.forEach(poop => {
    const ageMultiplier = 1 + (poop.age / 5000);  // Older = worse
    stinkDelta += poop.stinkContribution * ageMultiplier * (deltaMs / 1000);
  });

  // Decrease if no poop (Grib reduces this decay)
  if (state.poops.length === 0) {
    stinkDelta = -2 * (deltaMs / 1000);
  }

  return Math.max(0, Math.min(100, state.stinkMeter + stinkDelta));
}
```

### 6. Implement Powerups (From Rainbow Poop)

| Powerup | Effect | Duration |
|---------|--------|----------|
| 🧲 Magnet | Auto-collect nearby poop | 3 seconds |
| ❄️ Freeze | No new poop spawns | 3 seconds |
| 💨 Air Fresh | Stink meter -30% | Instant |
| ⚡ Speed Scoop | Tap = clear 3×3 area | 4 seconds |

### 7. Implement Difficulty Progression

| Time | Spawn Rate | Poop Types | Stink Speed |
|------|------------|------------|-------------|
| 0-20s | 1/2 sec | Normal, Fresh | Slow |
| 20-40s | 1/1.5 sec | + Stinky | Medium |
| 40-60s | 1/sec | + Golden, Rainbow | Fast |

### 8. Implement Scoring & Rewards

**Scoring:**

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

**Reward Tiers (from design doc):**

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-199 | 2 | 3 | — |
| Silver | 200-399 | 5 | 5 | 20% common |
| Gold | 400-599 | 8 | 7 | 45% common |
| Rainbow | 600+ | 12 | 10 | 65% uncommon |

---

## Technical Requirements

### Component Structure

```typescript
interface PoopScoopProps {
  petId: string;  // Active pet for abilities
  onComplete: (result: { score: number; survived: boolean }) => void;
}

function PoopScoop({ petId, onComplete }: PoopScoopProps): JSX.Element;
```

### Spawn Logic (from design doc)

```typescript
function spawnPoop(gameTime: number): PoopItem {
  const types = ['normal', 'fresh'];
  if (gameTime > 20) types.push('stinky');
  if (gameTime > 40) types.push('golden', 'rainbow');

  const weights = {
    normal: 70,
    fresh: 15,
    stinky: gameTime > 20 ? 10 : 0,
    golden: gameTime > 40 ? 3 : 0,
    rainbow: gameTime > 40 ? 2 : 0
  };

  return {
    id: Date.now(),
    type: weightedRandom(types, weights),
    x: Math.random() * 0.8 + 0.1,  // Avoid edges
    y: Math.random() * 0.7 + 0.15,
    age: 0,
    stinkContribution: getStinkRate(type)
  };
}
```

---

## Visual Layout (from design doc)

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

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/games/PoopScoop.tsx` | create | Main game component |
| `src/components/games/PoopScoop.css` | create | Game-specific styles |
| `src/game/miniGameRewards.ts` | modify | Add poop_scoop reward config |
| `src/__tests__/poopScoop.test.ts` | create | Game-specific tests |

---

## Test Requirements

Create `src/__tests__/poopScoop.test.ts` with tests for:

**Test Cases (from design doc TC-601 to TC-615):**

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

## Integration Points

- **Energy System:** Game starts via `MiniGameSession` which handles energy
- **Stats Tracking:** `MiniGameSession` handles incrementing `minigamesCompleted`
- **Pet Ability:** Check active pet at game start, apply ability modifiers

---

## After Changes

Run:

```bash
npm run build
npm test -- --run
```

Both **MUST** pass.

If they do not pass and you cannot fix within this scope:
- Leave `STATUS: PARTIAL` and explain what failed and why.

---

## Output

At the very top of your response:

- `STATUS: COMPLETED` if all scoped tasks are done and tests pass, OR
- `STATUS: PARTIAL` if blocked (explain why).

Then include:

1. **Implementation Summary** (table of files changed).
2. **Key Technical Changes** (bullets).
3. **Tests Added/Updated** (table).
4. **Verification** (build/test results).
5. **Issues / Follow-Ups** (any remaining gaps).

---

## TASKS.md

When finished:
- Mark **P8-POOP-1** as `✅ DONE` in TASKS.md.

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
