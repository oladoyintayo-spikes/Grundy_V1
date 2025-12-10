# Claude Code Prompt: Grundy P8-MEMORY-1 – Memory Match Mini-Game

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

**Workstream:** P8-MEMORY
**Task:**

- P8-MEMORY-1 — Implement Memory Match game (card matching puzzle)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

---

## Read FIRST

1. `docs/Minigames/GRUNDY_MEMORY_MATCH_DESIGN.md` — **Complete specification** for this game
2. `src/game/store.ts` — Current store structure
3. `src/types/index.ts` — Shared type definitions
4. `src/game/miniGameRewards.ts` — Reward tier calculator (from P8-INFRA)
5. `src/components/MiniGameSession.tsx` — Game session wrapper (from P8-INFRA)
6. `src/data/foods.ts` — Food data for card images
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

### 1. Implement Memory Match Game Component

Create `src/components/games/MemoryMatch.tsx`:

**Core Mechanics (from design doc):**
- Grid of face-down cards with food items
- Tap to flip cards (2 at a time)
- Matching pairs stay revealed
- Find all pairs to win
- Fewer moves = higher score
- Time limit varies by difficulty

**Difficulty Levels:**
| Level | Grid | Pairs | Time | Unlock |
|-------|------|-------|------|--------|
| Easy | 3×4 | 6 | 60s | Default |
| Medium | 4×4 | 8 | 90s | Player Lv 5 |
| Hard | 4×5 | 10 | 120s | Player Lv 10 |

**Launch with Easy + Medium.** Hard can be added post-launch.

### 2. Implement Game State

Use the state interface from the design doc:

```typescript
interface MemoryMatchGameState {
  cards: MemoryCard[];
  flippedIndices: number[];    // Max 2
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  streak: number;
  timeRemaining: number;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  abilityUsed: boolean;        // For one-time abilities
}

interface MemoryCard {
  id: number;
  foodId: string;              // From foods.ts
  isFlipped: boolean;
  isMatched: boolean;
  position: { row: number; col: number };
}
```

### 3. Implement Pet Abilities

All 8 pet abilities as defined in the design doc:

| Pet | Ability | Effect |
|-----|---------|--------|
| **Munchlet** | Helpful Hint | One pair glows briefly after 8 moves |
| **Grib** | Calm Mind | +15 seconds added to timer |
| **Plompo** | Slow Time | Timer runs 25% slower |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Memory | Matched pairs flash location once before game |
| **Chomper** | Second Bite | One free re-flip per game (undo last flip) |
| **Whisp** | Spirit Peek | See all cards for 3 seconds at game start |
| **Luxe** | Lucky Guess | First flip each game is guaranteed a match |

### 4. Implement Scoring

**Scoring (from design doc):**

| Action | Points |
|--------|--------|
| Find pair | +50 |
| Perfect match (first try) | +25 bonus |
| Time bonus | +2 per second remaining |
| Streak bonus (3+ pairs in row) | +10 per pair |

**Move Efficiency Bonus (8-pair game):**

| Moves | Bonus |
|-------|-------|
| ≤12 (perfect) | +100 |
| 13-16 (great) | +50 |
| 17-20 (good) | +25 |
| 21+ | +0 |

### 5. Implement Rewards

**Reward Tiers (from design doc):**

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-199 | 2 | 3 | — |
| Silver | 200-399 | 5 | 5 | 25% common |
| Gold | 400-549 | 8 | 7 | 50% common |
| Rainbow | 550+ | 12 | 10 | 70% uncommon |

Use the shared `MiniGameSession` wrapper and `calculateRewardTier` from P8-INFRA.

---

## Technical Requirements

### Component Structure

```typescript
interface MemoryMatchProps {
  petId: string;  // Active pet for abilities
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (result: { score: number; won: boolean }) => void;
}

function MemoryMatch({ petId, difficulty, onComplete }: MemoryMatchProps): JSX.Element;
```

### Board Generation (from design doc)

```typescript
function generateBoard(pairs: number): MemoryCard[] {
  // 1. Pick random foods
  const foods = shuffle(getAllFoods()).slice(0, pairs);

  // 2. Create pairs
  const cards: MemoryCard[] = [];
  foods.forEach((food, i) => {
    cards.push({ id: i * 2, foodId: food.id, isFlipped: false, isMatched: false });
    cards.push({ id: i * 2 + 1, foodId: food.id, isFlipped: false, isMatched: false });
  });

  // 3. Shuffle positions
  return shuffle(cards).map((card, i) => ({
    ...card,
    position: { row: Math.floor(i / 4), col: i % 4 }
  }));
}
```

### Match Logic

```typescript
function checkMatch(card1: MemoryCard, card2: MemoryCard): boolean {
  return card1.foodId === card2.foodId && card1.id !== card2.id;
}
```

### Card Flip Logic

- Max 2 cards flipped at once
- Third tap while 2 are up = auto-flip back first two + flip new card
- Non-match: cards flip back after 1 second delay
- Match: cards stay revealed

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/games/MemoryMatch.tsx` | create | Main game component |
| `src/components/games/MemoryMatch.css` | create | Game-specific styles |
| `src/game/miniGameRewards.ts` | modify | Add memory_match reward config |
| `src/__tests__/memoryMatch.test.ts` | create | Game-specific tests |

---

## Test Requirements

Create `src/__tests__/memoryMatch.test.ts` with tests for:

**Test Cases (from design doc TC-401 to TC-413):**

| TC | Test | Expected |
|----|------|----------|
| TC-401 | Board generates correct pairs | N pairs = 2N cards |
| TC-402 | Cards flip on tap | 3D flip animation |
| TC-403 | Max 2 cards flipped | Third tap flips back first two |
| TC-404 | Match detection | Same foodId = match |
| TC-405 | Matched cards stay | isMatched = true |
| TC-406 | Non-match flips back | After 1 second |
| TC-407 | Move counter increments | +1 per pair of flips |
| TC-408 | Win when all matched | Results screen |
| TC-409 | Lose when time expires | Results screen |
| TC-410 | Whisp peek works | 3s preview at start |
| TC-411 | Chomper undo works | One re-flip allowed |
| TC-412 | Score calculates correctly | Pairs + time + efficiency |
| TC-413 | Energy deducted | -10 on game start |

---

## Integration Points

- **Energy System:** Game starts via `MiniGameSession` which handles energy
- **Food Data:** Import foods from `src/data/foods.ts` for card images
- **Stats Tracking:** `MiniGameSession` handles incrementing `minigamesCompleted`
- **Pet Ability:** Check active pet at game start, apply ability modifiers
- **Difficulty Unlock:** Check player level for Medium/Hard access

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
- Mark **P8-MEMORY-1** as `✅ DONE` in TASKS.md.

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
