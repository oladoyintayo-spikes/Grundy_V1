# Claude Code Prompt: Grundy P8-SNACK-1 – Snack Catch Mini-Game

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

**Workstream:** P8-SNACK
**Task:**

- P8-SNACK-1 — Implement Snack Catch game (60s arcade)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

---

## Read FIRST

1. `docs/Minigames/GRUNDY_SNACK_CATCH_DESIGN.md` — **Complete specification** for this game
2. `src/game/store.ts` — Current store structure
3. `src/types/index.ts` — Shared type definitions
4. `src/game/miniGameRewards.ts` — Reward tier calculator (from P8-INFRA)
5. `src/components/MiniGameSession.tsx` — Game session wrapper (from P8-INFRA)
6. `src/data/foods.ts` — Food data for spawnable items
7. `TASKS.md` — This task row for context

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

### 1. Implement Snack Catch Game Component

Create `src/components/games/SnackCatch.tsx`:

**Core Mechanics (from design doc):**
- 60-second game timer
- Food falls from top of screen at varying speeds
- Player moves basket horizontally to catch items
- Pet's food affinities affect scoring:
  - Loved food: +30 points
  - Liked food: +20 points
  - Neutral food: +10 points
  - Disliked food: -15 points
- Bad items (bomb, trash, rock): -15 to -25 points
- Special items (star +50, rainbow 2x, magnet auto-catch)
- Combo system: +2 per consecutive catch (max +10)

**Difficulty Progression:**
| Time | Fall Speed | Spawn Rate | Bad Item % |
|------|------------|------------|------------|
| 0-20s | Slow | 1/sec | 5% |
| 20-40s | Medium | 1.5/sec | 15% |
| 40-60s | Fast | 2/sec | 25% |

### 2. Implement Game State

Use the state interface from the design doc:

```typescript
interface SnackCatchGameState {
  score: number;
  combo: number;
  timeRemaining: number;
  basketX: number;           // 0.0 to 1.0 (screen position)
  fallingItems: FallingItem[];
  activePowerup: 'rainbow' | 'magnet' | null;
  powerupTimeLeft: number;
  ghostDodgeUsed: boolean;   // Whisp ability
}

interface FallingItem {
  id: number;
  type: 'food' | 'bad' | 'special';
  itemId: string;            // e.g., 'apple', 'bomb', 'star'
  x: number;                 // 0.0 to 1.0
  y: number;                 // 0.0 (top) to 1.0 (bottom)
  speed: number;
}
```

### 3. Implement Pet Abilities

All 8 pet abilities as defined in the design doc:

| Pet | Ability | Effect |
|-----|---------|--------|
| **Munchlet** | Comfort Zone | Basket 20% wider |
| **Grib** | Zen Focus | Bad items fall 30% slower |
| **Plompo** | Slow Fall | ALL items fall 20% slower |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Hands | Spicy foods worth 3× points |
| **Chomper** | Iron Stomach | Bad items only -5 points |
| **Whisp** | Ghostly Dodge | One free pass through bad item |
| **Luxe** | Lucky Drops | 2× chance for special items |

### 4. Implement Scoring & Rewards

**Reward Tiers (from design doc):**

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-99 | 2 | 3 | — |
| Silver | 100-199 | 5 | 5 | 20% common |
| Gold | 200-299 | 8 | 7 | 40% common |
| Rainbow | 300+ | 12 | 10 | 60% uncommon |

Use the shared `MiniGameSession` wrapper and `calculateRewardTier` from P8-INFRA.

### 5. Controls

- **Touch:** Drag basket horizontally
- **Alternative:** Tap left/right sides to move basket
- Smooth movement (lerp to target position)

---

## Technical Requirements

### Component Structure

```typescript
interface SnackCatchProps {
  petId: string;  // Active pet for abilities
  onComplete: (result: { score: number }) => void;
}

function SnackCatch({ petId, onComplete }: SnackCatchProps): JSX.Element;
```

### Game Loop

```typescript
// Pseudocode
useEffect(() => {
  const gameLoop = setInterval(() => {
    // 1. Update timer
    // 2. Move falling items
    // 3. Check collisions with basket
    // 4. Spawn new items based on time
    // 5. Check for game end
  }, 16); // ~60fps

  return () => clearInterval(gameLoop);
}, []);
```

### Spawn Logic (from design doc)

```typescript
function spawnItem(gameTime: number, petId: string): FallingItem {
  const badChance = gameTime < 20 ? 0.05 : gameTime < 40 ? 0.15 : 0.25;
  let specialChance = 0.07;

  // Luxe doubles special item chance
  if (petId === 'luxe') specialChance *= 2;

  const roll = Math.random();
  if (roll < specialChance) return createSpecialItem();
  if (roll < specialChance + badChance) return createBadItem();
  return createFoodItem(); // Uses foods from foods.ts
}
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/games/SnackCatch.tsx` | create | Main game component |
| `src/components/games/SnackCatch.css` | create | Game-specific styles |
| `src/game/miniGameRewards.ts` | modify | Add snack_catch reward config |
| `src/__tests__/snackCatch.test.ts` | create | Game-specific tests |

---

## Test Requirements

Create `src/__tests__/snackCatch.test.ts` with tests for:

**Test Cases (from design doc TC-301 to TC-312):**

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

## Integration Points

- **Energy System:** Game starts via `MiniGameSession` which handles energy
- **Food Data:** Import foods from `src/data/foods.ts` for spawnable items
- **Pet Affinity:** Use `getAffinity(petId, foodId)` for scoring
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
- Mark **P8-SNACK-1** as `✅ DONE` in TASKS.md.

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
