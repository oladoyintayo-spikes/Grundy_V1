# Claude Code Prompt: Grundy P8-PIPS-1 – Pips Mini-Game

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

**Workstream:** P8-PIPS
**Task:**

- P8-PIPS-1 — Implement Pips game (120s domino puzzle)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

**Assumption:** P8-PIPS-1 task ID may need to be added to TASKS.md if not present.

---

## Read FIRST

1. `docs/Minigames/GRUNDY_PIPS_DESIGN.md` — **Complete specification** for this game
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

### 1. Implement Pips Game Component

Create `src/components/games/Pips.tsx`:

**Core Mechanics (from design doc):**
- 4×4 grid of domino halves (16 tiles)
- Each tile shows 1-6 pips (dice faces)
- Tap two tiles with **same pip count** to clear both
- Clear all tiles to win
- 120-second time limit
- Bonus for chain combos (matches within 3 seconds)

### 2. Implement Game State

Use the state interface from the design doc:

```typescript
interface PipsGameState {
  tiles: PipTile[];           // 16 tiles
  selectedTile: number | null;
  pairsCleared: number;
  score: number;
  combo: number;
  lastMatchTime: number;      // For combo timing
  timeRemaining: number;
  isComplete: boolean;
}

interface PipTile {
  id: number;
  pips: 1 | 2 | 3 | 4 | 5 | 6;
  isCleared: boolean;
  isSelected: boolean;
  isWild: boolean;           // Chomper ability
}
```

### 3. Implement Pet Abilities

All 8 pet abilities as defined in the design doc:

| Pet | Ability | Effect |
|-----|---------|--------|
| **Munchlet** | Hint | After 30s, one valid pair glows for 3s |
| **Grib** | Double Bonus | 2× points for doubles (⚅⚅, ⚄⚄) |
| **Plompo** | Extra Time | +30 seconds (150s total) |
| **Fizz** | Score Boost | +25% final score |
| **Ember** | Hot Streak | Combo window extended to 5s |
| **Chomper** | Wild Tile | One random tile matches anything (once per game) |
| **Whisp** | Peek | See all matching pairs highlighted for 3s at start |
| **Luxe** | Lucky Drop | 2× chance for food reward |

### 4. Implement Scoring

**Scoring (from design doc):**

| Action | Points |
|--------|--------|
| Match pair | +10 |
| Combo x2 (within 3s) | +5 bonus |
| Combo x3 | +10 bonus |
| Combo x4+ | +15 bonus |
| Doubles match (⚅⚅, ⚄⚄, etc.) | +5 bonus |
| Clear board | +50 bonus |
| Time bonus | +1 per 10 sec remaining |

**Max theoretical score:** ~250 points (perfect play)

### 5. Implement Rewards

**Reward Tiers (from design doc):**

| Tier | Score | Coins | XP | Food Drop |
|------|-------|-------|-----|-----------|
| Bronze | 0-79 | 2 | 3 | — |
| Silver | 80-149 | 5 | 5 | 20% common |
| Gold | 150-219 | 8 | 7 | 40% common |
| Rainbow | 220+ | 12 | 10 | 60% uncommon |

Use the shared `MiniGameSession` wrapper and `calculateRewardTier` from P8-INFRA.

---

## Technical Requirements

### Component Structure

```typescript
interface PipsProps {
  petId: string;  // Active pet for abilities
  onComplete: (result: { score: number; won: boolean }) => void;
}

function Pips({ petId, onComplete }: PipsProps): JSX.Element;
```

### Board Generation (from design doc)

```typescript
function generateBoard(): PipTile[] {
  const pairs: number[] = [];
  // Generate 8 pairs from pip values 1-6
  for (let i = 0; i < 8; i++) {
    const pip = (i % 6) + 1;
    pairs.push(pip, pip);
  }
  // Shuffle
  return shuffle(pairs).map((pips, id) => ({
    id,
    pips: pips as 1 | 2 | 3 | 4 | 5 | 6,
    isCleared: false,
    isSelected: false,
    isWild: false
  }));
}
```

### Match Logic

```typescript
function checkMatch(tile1: PipTile, tile2: PipTile): boolean {
  // Wild tile matches anything
  if (tile1.isWild || tile2.isWild) return true;
  return tile1.pips === tile2.pips;
}
```

### Combo System

- Match within 3 seconds of previous match = combo
- Combo resets if no match within window
- Ember extends window to 5 seconds

---

## Visual Layout (from design doc)

```
┌─────────────────────────────────────────┐
│  🎲 PIPS              Time: 1:47        │
│                       Pairs: 5/8        │
├─────────────────────────────────────────┤
│                                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│   │ ⚂ │ │ ⚀ │ │ ⚄ │ │ ⚂ │              │
│   └───┘ └───┘ └───┘ └───┘              │
│                                         │
│   [... 4x4 grid of pip tiles ...]       │
│                                         │
│          Combo: x2 🔥                   │
└─────────────────────────────────────────┘
```

Use dice face emojis: ⚀ ⚁ ⚂ ⚃ ⚄ ⚅ (or styled dots)

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/games/Pips.tsx` | create | Main game component |
| `src/components/games/Pips.css` | create | Game-specific styles |
| `src/game/miniGameRewards.ts` | modify | Add pips reward config |
| `src/__tests__/pips.test.ts` | create | Game-specific tests |

---

## Test Requirements

Create `src/__tests__/pips.test.ts` with tests for:

**Test Cases (from design doc TC-201 to TC-210):**

| TC | Test | Expected |
|----|------|----------|
| TC-201 | Board generates 16 tiles | 8 pairs present |
| TC-202 | Matching tiles clear | Both removed, +10 points |
| TC-203 | Non-matching tiles shake | Selection resets |
| TC-204 | Combo within 3s | Bonus points awarded |
| TC-205 | Clear all tiles | +50 bonus, game ends |
| TC-206 | Time expires | Game ends, rewards based on score |
| TC-207 | Whisp peek works | 3s highlight at start |
| TC-208 | Plompo extra time | Timer starts at 150s |
| TC-209 | Chomper wild tile | One tile matches any |
| TC-210 | Energy deducted | -10 on game start |

---

## Integration Points

- **Energy System:** Game starts via `MiniGameSession` which handles energy
- **Stats Tracking:** `MiniGameSession` handles incrementing `minigamesCompleted`
- **Pet Ability:** Check active pet at game start, apply ability modifiers
- **Rewards:** Use shared calculator, apply Fizz/Luxe bonuses

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
- Add **P8-PIPS-1** to TASKS.md if not present
- Mark **P8-PIPS-1** as `✅ DONE`

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
