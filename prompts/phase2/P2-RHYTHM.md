# Claude Code Prompt: Grundy P8-RHYTHM-1 – Rhythm Tap Mini-Game

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

**Workstream:** P8-RHYTHM
**Task:**

- P8-RHYTHM-1 — Implement Rhythm Tap game (45-60s music/timing)

This is a **code + tests** implementation task.
Do NOT change design docs or `ORCHESTRATOR.md` in this task.

---

## Read FIRST

1. `docs/Minigames/GRUNDY_RHYTHM_TAP_DESIGN.md` — **Complete specification** for this game
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

### 1. Implement Rhythm Tap Game Component

Create `src/components/games/RhythmTap.tsx`:

**Core Mechanics (from design doc):**
- Notes fall in 4 lanes
- Tap when note reaches the target line
- Perfect/Good/OK/Miss timing windows
- Build combos for multipliers
- Complete the song to finish
- Score determines reward tier

### 2. Implement Game State

Use the state interface from the design doc:

```typescript
interface RhythmTapGameState {
  song: SongData;
  notes: RhythmNote[];
  score: number;
  combo: number;
  maxCombo: number;
  perfectCount: number;
  goodCount: number;
  okCount: number;
  missCount: number;
  isFeverActive: boolean;
  songProgress: number;        // 0.0 to 1.0
  ghostNotesUsed: number;      // Whisp ability
  secondChanceUsed: boolean;   // Chomper ability
}

interface RhythmNote {
  id: number;
  lane: 0 | 1 | 2 | 3;
  type: 'single' | 'hold' | 'double';
  targetTime: number;          // ms from song start
  holdDuration?: number;       // ms for hold notes
  isHit: boolean;
  rating?: 'perfect' | 'good' | 'ok' | 'miss';
}

interface SongData {
  id: string;
  name: string;
  bpm: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### 3. Implement Timing Windows

| Rating | Window | Points | Combo |
|--------|--------|--------|-------|
| Perfect | ±50ms | 100 | +1 |
| Good | ±100ms | 50 | +1 |
| OK | ±150ms | 25 | Keeps |
| Miss | >150ms | 0 | Resets |

### 4. Implement Pet Abilities

All 8 pet abilities as defined in the design doc:

| Pet | Ability | Effect |
|-----|---------|--------|
| **Munchlet** | Comfort Rhythm | "OK" timing window expanded to ±200ms |
| **Grib** | Steady Beat | Notes fall 15% slower |
| **Plompo** | Heavy Beats | Hold notes worth 2× points |
| **Fizz** | Fever Boost | +25% points during fever mode |
| **Ember** | Fire Streak | 15+ combo = auto-hit for 2 seconds |
| **Chomper** | Second Chance | First miss per song doesn't break combo |
| **Whisp** | Ghost Notes | Miss up to 3 notes without penalty |
| **Luxe** | Golden Combo | Combo multiplier maxes at 3.0× instead of 2.5× |

### 5. Implement Combo System

**Combo Multiplier:**

| Combo | Multiplier |
|-------|------------|
| 0-9 | 1.0× |
| 10-24 | 1.25× |
| 25-49 | 1.5× |
| 50-99 | 2.0× |
| 100+ | 2.5× (or 3.0× with Luxe) |

**Fever Mode:**
- Activates at 50+ combo
- All notes worth 1.5× during fever
- Screen glows, particles fly

### 6. Implement Songs (Procedural)

| Song | BPM | Duration | Notes | Unlock |
|------|-----|----------|-------|--------|
| Morning Munch | 80 | 45s | ~50 | Default |
| Snack Time | 100 | 50s | ~70 | Default |
| Dinner Dance | 120 | 55s | ~90 | Lv 7 |
| Feast Frenzy | 140 | 60s | ~120 | Lv 10 |

### 7. Implement Rewards

**Reward Tiers (based on accuracy):**

| Tier | Accuracy | Coins | XP | Food Drop |
|------|----------|-------|-----|-----------|
| Bronze | <60% | 3 | 3 | — |
| Silver | 60-79% | 6 | 5 | 30% common |
| Gold | 80-94% | 10 | 7 | 50% common |
| Rainbow | 95%+ | 15 | 10 | 70% uncommon |

**Accuracy = (Perfect + Good) / Total Notes**

---

## Technical Requirements

### Component Structure

```typescript
interface RhythmTapProps {
  petId: string;  // Active pet for abilities
  songId: string; // Which song to play
  onComplete: (result: { score: number; accuracy: number }) => void;
}

function RhythmTap({ petId, songId, onComplete }: RhythmTapProps): JSX.Element;
```

### Note Generation (from design doc)

```typescript
function generateSong(bpm: number, duration: number): RhythmNote[] {
  const beatInterval = 60000 / bpm;  // ms per beat
  const notes: RhythmNote[] = [];
  let time = beatInterval * 2;       // 2 beat lead-in

  while (time < duration * 1000 - beatInterval * 2) {
    const pattern = pickPattern(bpm);
    pattern.forEach(note => {
      notes.push({
        id: notes.length,
        lane: note.lane,
        type: note.type,
        targetTime: time + note.offset,
        holdDuration: note.holdDuration,
        isHit: false
      });
    });
    time += beatInterval * pattern.beats;
  }

  return notes;
}
```

### Hit Detection

```typescript
function checkHit(note: RhythmNote, tapTime: number): 'perfect' | 'good' | 'ok' | 'miss' {
  const diff = Math.abs(tapTime - note.targetTime);
  if (diff <= 50) return 'perfect';
  if (diff <= 100) return 'good';
  if (diff <= 150) return 'ok';
  return 'miss';
}
```

---

## Visual Layout (from design doc)

```
┌─────────────────────────────────────────┐
│  🎵 RHYTHM TAP         Score: 1250      │
│                        Combo: 12x       │
├─────────────────────────────────────────┤
│         │    │    │    │                │
│         │    │ 🔵 │    │                │
│         │ 🟢 │    │    │                │
│         │    │    │ 🟡 │                │
│         │    │    │    │                │
│  ───────┼────┼────┼────┼───────        │
│    🎯   │ 🎯 │ 🎯 │ 🎯 │   🎯          │
│  ───────┴────┴────┴────┴───────        │
│                                         │
│   [ 🟢 ]  [ 🔵 ]  [ 🟡 ]  [ 🔴 ]       │
│                                         │
│  ████████████░░░░░░░░  Song: 65%        │
└─────────────────────────────────────────┘
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/games/RhythmTap.tsx` | create | Main game component |
| `src/components/games/RhythmTap.css` | create | Game-specific styles |
| `src/game/miniGameRewards.ts` | modify | Add rhythm_tap reward config |
| `src/game/songPatterns.ts` | create | Song/pattern generation utilities |
| `src/__tests__/rhythmTap.test.ts` | create | Game-specific tests |

---

## Test Requirements

Create `src/__tests__/rhythmTap.test.ts` with tests for:

**Test Cases (from design doc TC-501 to TC-513):**

| TC | Test | Expected |
|----|------|----------|
| TC-501 | Notes fall in lanes | 4 lanes, correct positions |
| TC-502 | Tap detection works | Correct lane = hit |
| TC-503 | Timing windows correct | Perfect/Good/OK/Miss |
| TC-504 | Combo builds | +1 per hit |
| TC-505 | Combo resets on miss | Returns to 0 |
| TC-506 | Fever activates at 50 | Screen effect + bonus |
| TC-507 | Hold notes work | Hold = continuous points |
| TC-508 | Double notes work | Both lanes must be hit |
| TC-509 | Song completes | Results at end |
| TC-510 | Accuracy calculates | (P+G)/Total correct |
| TC-511 | Grib slower notes | Fall speed -15% |
| TC-512 | Ember auto-hit | 2s auto at 15+ combo |
| TC-513 | Energy deducted | -10 on game start |

---

## Integration Points

- **Energy System:** Game starts via `MiniGameSession` which handles energy
- **Stats Tracking:** `MiniGameSession` handles incrementing `minigamesCompleted`
- **Pet Ability:** Check active pet at game start, apply ability modifiers
- **Song Unlock:** Check player level for harder songs

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
- Mark **P8-RHYTHM-1** as `✅ DONE` in TASKS.md.

---

## IMPORTANT: Completion Signal

When finished, your response **MUST** begin with `STATUS: COMPLETED` or `STATUS: PARTIAL`.

Do NOT start any other tasks outside this scope.
STOP after reporting.
