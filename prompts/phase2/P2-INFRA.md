# Claude Code Prompt: Grundy P8-INFRA – Mini-Game Infrastructure

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

**Workstream:** P8-INFRA
**Tasks:**

- P8-INFRA-1 — Energy system (50 max, 10/game, regen)
- P8-INFRA-2 — Reward tier calculator
- P8-INFRA-3 — Mini-game hub UI
- P8-INFRA-4 — Game session wrapper
- P8-INFRA-5 — Stats tracking (minigamesCompleted)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

---

## Read FIRST

1. `docs/Minigames/*.md` — All 5 mini-game design docs (for reward tiers, energy rules)
2. `src/game/store.ts` — Current store structure
3. `src/types/index.ts` — Shared type definitions
4. `TASKS.md` — Phase 8 task context

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

### 1. Energy System Store Slice (P8-INFRA-1)

Add the following to the store (or a new slice):

```typescript
interface EnergyState {
  current: number;        // 0–50
  max: number;            // 50
  lastRegenTime: number;  // timestamp (ms)
  regenRate: number;      // 1 per 30 min = 1800000 ms
}
```

Implement:
- `deductEnergy(amount: number)` — Deduct energy, return success/fail
- `regenerateEnergy()` — Calculate and apply regen based on time elapsed
- Energy capped at 50 (max)
- Auto-call regen on relevant store access

### 2. Daily Play Tracking (P8-INFRA-1 continued)

Add daily play tracking:

```typescript
interface DailyPlayState {
  date: string;                           // YYYY-MM-DD
  plays: Record<string, number>;          // gameId -> count
  freePlayUsed: Record<string, boolean>;  // gameId -> used today
}
```

Game IDs: `'snack_catch'`, `'memory_match'`, `'pips'`, `'rhythm_tap'`, `'poop_scoop'`

Logic:
- Reset `plays` and `freePlayUsed` when date changes
- Track per-game plays
- First play of each game each day is FREE (no energy cost)
- After 3 rewarded plays, can still play for fun (no rewards)

### 3. Reward Tier Calculator (P8-INFRA-2)

Create a utility function:

```typescript
type RewardTier = 'bronze' | 'silver' | 'gold' | 'rainbow';

interface RewardTierConfig {
  thresholds: { bronze: number; silver: number; gold: number; rainbow: number };
  rewards: Record<RewardTier, { coins: number; xp: number; foodDropChance: number; foodRarity: string }>;
}

function calculateRewardTier(score: number, config: RewardTierConfig): RewardTier;
function getRewards(tier: RewardTier, config: RewardTierConfig): { coins: number; xp: number; foodDrop?: string };
```

Each game has its own thresholds (from design docs). The calculator is generic.

### 4. Mini-Game Hub UI (P8-INFRA-3)

Create `src/components/MiniGameHub.tsx`:

- Display all 5 games with:
  - Game name and icon/emoji
  - Short description
  - "Play" button (or "Locked" if requirements not met)
  - Daily plays remaining (e.g., "2/3 plays today")
- Show current energy: `{current}/{max}`
- Show energy regen timer if not full
- Handle unlock requirements from design docs:
  - Snack Catch: Level 2
  - Memory Match: Level 3
  - Pips: Level 3
  - Poop Scoop: Level 4
  - Rhythm Tap: Level 5

### 5. Game Session Wrapper (P8-INFRA-4)

Create `src/components/MiniGameSession.tsx`:

A wrapper component that handles the game lifecycle:

```typescript
interface MiniGameSessionProps {
  gameId: string;
  children: React.ReactNode;  // The actual game component
  onComplete: (result: MiniGameResult) => void;
}
```

Flow:
1. **Pre-game:** Check energy, deduct if needed (or use free play)
2. **During game:** Render children (the game component)
3. **Post-game:** Show results screen with rewards
4. Apply rewards via `applyMiniGameResult(result)`

### 6. Result & Reward Application (P8-INFRA-4 continued)

Define a common result shape:

```typescript
interface MiniGameResult {
  gameId: string;
  score: number;
  tier: RewardTier;
  rewards: {
    coins: number;
    xp: number;
    foodDrop?: string;  // foodId if dropped
  };
  isRewardedPlay: boolean;  // false if over daily cap
}
```

Create `applyMiniGameResult(result: MiniGameResult)`:
- Add coins to store
- Add XP to pet
- Add food to inventory (if dropped)
- Increment `minigamesCompleted` stat
- Increment daily play count for this game
- Check Chomper unlock condition (10 minigames)

### 7. Stats Tracking (P8-INFRA-5)

Add to `GameStats` interface:

```typescript
interface GameStats {
  // ... existing fields
  minigamesCompleted: number;
  minigamesPerGame: Record<string, number>;  // gameId -> completions
}
```

Used for:
- Chomper unlock (requires 10 minigames completed)
- Potential future achievements

---

## Technical Requirements

### New Types (add to `src/types/index.ts`)

```typescript
// Mini-game types
export type MiniGameId = 'snack_catch' | 'memory_match' | 'pips' | 'rhythm_tap' | 'poop_scoop';
export type RewardTier = 'bronze' | 'silver' | 'gold' | 'rainbow';

export interface EnergyState {
  current: number;
  max: number;
  lastRegenTime: number;
  regenRate: number;  // ms per 1 energy
}

export interface DailyPlayState {
  date: string;
  plays: Record<MiniGameId, number>;
  freePlayUsed: Record<MiniGameId, boolean>;
}

export interface MiniGameResult {
  gameId: MiniGameId;
  score: number;
  tier: RewardTier;
  rewards: {
    coins: number;
    xp: number;
    foodDrop?: string;
  };
  isRewardedPlay: boolean;
}
```

### Store Updates (extend `GameStore`)

```typescript
interface GameStore {
  // ... existing

  // Energy
  energy: EnergyState;
  dailyPlays: DailyPlayState;

  // Actions
  deductEnergy: (amount: number) => boolean;
  regenerateEnergy: () => void;
  canPlayGame: (gameId: MiniGameId) => { canPlay: boolean; isFree: boolean; reason?: string };
  startGame: (gameId: MiniGameId) => boolean;
  completeGame: (result: MiniGameResult) => void;
}
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/types/index.ts` | modify | Add mini-game types |
| `src/game/store.ts` | modify | Add energy, daily plays, mini-game actions |
| `src/game/miniGameRewards.ts` | create | Reward tier calculator, configs per game |
| `src/components/MiniGameHub.tsx` | create | Game selection screen |
| `src/components/MiniGameSession.tsx` | create | Game lifecycle wrapper |
| `src/__tests__/miniGame.test.ts` | create | Tests for energy, rewards, daily tracking |

---

## Test Requirements

Create `src/__tests__/miniGame.test.ts` with tests for:

### Energy System
- [ ] Initial energy is 50
- [ ] Deduct 10 reduces to 40
- [ ] Cannot deduct if insufficient energy
- [ ] Regeneration adds 1 per 30 minutes elapsed
- [ ] Energy caps at 50

### Daily Play Tracking
- [ ] First play is free (no energy deducted)
- [ ] Second play deducts energy
- [ ] After 3 plays, `isRewardedPlay` is false
- [ ] Date change resets plays and freePlayUsed

### Reward Calculator
- [ ] Score 50 → Bronze
- [ ] Score 150 → Silver (for snack_catch thresholds)
- [ ] Score 250 → Gold
- [ ] Score 350 → Rainbow
- [ ] Rewards match config for each tier

### Integration
- [ ] `startGame` deducts energy and tracks play
- [ ] `completeGame` applies rewards and increments stats
- [ ] Chomper unlocks at 10 minigames completed

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
- Mark **P8-INFRA-1** through **P8-INFRA-5** as `✅ DONE` in TASKS.md.

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
