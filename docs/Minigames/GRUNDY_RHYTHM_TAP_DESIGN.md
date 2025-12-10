# GRUNDY — RHYTHM TAP MINI-GAME DESIGN

**Version:** 1.0  
**Status:** Approved  
**Added:** December 2024

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Rhythm Tap |
| **Type** | Music / Rhythm |
| **Duration** | 45-60 seconds |
| **Energy Cost** | 10 |
| **Daily Cap** | 3 rewarded plays |
| **Main Skill** | Timing, rhythm |
| **Unlock** | Player Level 5 |

---

## Concept

Tap falling notes in time with procedurally generated music. A rhythm game that rewards timing precision and builds combos for multipliers.

**Core Mechanic:**
- Notes fall in 4 lanes
- Tap when note reaches the target line
- Perfect/Good/Miss timing windows
- Build combos for multipliers
- Complete the song to win

---

## Gameplay

### Controls
- 4 tap zones at bottom of screen
- Tap the zone when note reaches target line
- Hold notes: Press and hold until note ends
- One-handed play possible (thumb across zones)

### Win Condition
- Complete the song (survive to end)
- Score determines reward tier

### Fail Condition
- None (always completes, score varies)
- Optional: "Health bar" mode for Hard difficulty

---

## Visual Layout

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
│         │ 🔵 │    │    │                │
│         │    │ 🟢 │    │                │
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

## Timing Windows

| Rating | Window | Points | Combo |
|--------|--------|--------|-------|
| Perfect | ±50ms | 100 | +1 |
| Good | ±100ms | 50 | +1 |
| OK | ±150ms | 25 | Keeps |
| Miss | >150ms | 0 | Resets |

---

## Note Types

| Type | Visual | Behavior | Points |
|------|--------|----------|--------|
| Single | 🔵/🟢/🟡/🔴 | Tap once | 100 (Perfect) |
| Hold | Long bar | Hold until end | 100 + 10/beat held |
| Double | Two notes same row | Tap both zones | 150 (Perfect) |

---

## Songs (Procedural)

| Song | BPM | Duration | Notes | Unlock |
|------|-----|----------|-------|--------|
| Morning Munch | 80 | 45s | ~50 | Default |
| Snack Time | 100 | 50s | ~70 | Default |
| Dinner Dance | 120 | 55s | ~90 | Lv 7 |
| Feast Frenzy | 140 | 60s | ~120 | Lv 10 |

**Procedural Generation:**
- Notes generated based on BPM
- Patterns follow musical rules (no impossible sequences)
- Difficulty scales with BPM

---

## Scoring

| Action | Points |
|--------|--------|
| Perfect tap | 100 |
| Good tap | 50 |
| OK tap | 25 |
| Miss | 0 |
| Hold (per beat) | +10 |
| Double note (Perfect) | 150 |

**Combo Multiplier:**

| Combo | Multiplier |
|-------|------------|
| 0-9 | 1.0× |
| 10-24 | 1.25× |
| 25-49 | 1.5× |
| 50-99 | 2.0× |
| 100+ | 2.5× |

**Fever Mode:**
- Activates at 50+ combo
- All notes worth 1.5× during fever
- Screen glows, particles fly

---

## Reward Tiers

| Tier | Accuracy | Coins | XP | Food Drop |
|------|----------|-------|-----|-----------|
| Bronze | <60% | 3 | 3 | — |
| Silver | 60-79% | 6 | 5 | 30% common |
| Gold | 80-94% | 10 | 7 | 50% common |
| Rainbow | 95%+ | 15 | 10 | 70% uncommon |

**Accuracy = (Perfect + Good) / Total Notes**

**No gems.** Mini-games provide small helpful gifts, not wealth.

---

## Pet Abilities

| Pet | Ability Name | Effect |
|-----|--------------|--------|
| **Munchlet** | Comfort Rhythm | "OK" timing window expanded to ±200ms |
| **Grib** | Steady Beat | Notes fall 15% slower |
| **Plompo** | Heavy Beats | Hold notes worth 2× points |
| **Fizz** | Fever Boost | +25% points during fever mode |
| **Ember** | Fire Streak | 15+ combo = auto-hit for 2 seconds |
| **Chomper** | Second Chance | First miss per song doesn't break combo |
| **Whisp** | Ghost Notes | Miss up to 3 notes without penalty |
| **Luxe** | Golden Combo | Combo multiplier maxes at 3.0× instead of 2.5× |

---

## Anti-Spam Mechanics

| Mechanic | Value | Purpose |
|----------|-------|---------|
| Energy cost | 10 | Limits to 5 plays from full |
| Daily cap | 3 rewarded | Prevents farming |
| First daily | FREE | Encourages engagement |
| After cap | Play for fun | No rewards, just practice |
| Session length | 45-60s | Time investment per play |

---

## Technical Notes

### State

```typescript
interface RhythmTapGameState {
  song: SongData
  notes: RhythmNote[]
  score: number
  combo: number
  maxCombo: number
  perfectCount: number
  goodCount: number
  okCount: number
  missCount: number
  isFeverActive: boolean
  songProgress: number        // 0.0 to 1.0
  ghostNotesUsed: number      // Whisp ability
  secondChanceUsed: boolean   // Chomper ability
}

interface RhythmNote {
  id: number
  lane: 0 | 1 | 2 | 3
  type: 'single' | 'hold' | 'double'
  targetTime: number          // ms from song start
  holdDuration?: number       // ms for hold notes
  isHit: boolean
  rating?: 'perfect' | 'good' | 'ok' | 'miss'
}

interface SongData {
  id: string
  name: string
  bpm: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
}
```

### Note Generation

```typescript
function generateSong(bpm: number, duration: number): RhythmNote[] {
  const beatInterval = 60000 / bpm  // ms per beat
  const notes: RhythmNote[] = []
  let time = beatInterval * 2       // 2 beat lead-in
  
  while (time < duration * 1000 - beatInterval * 2) {
    // Generate note pattern
    const pattern = pickPattern(bpm)
    pattern.forEach(note => {
      notes.push({
        id: notes.length,
        lane: note.lane,
        type: note.type,
        targetTime: time + note.offset,
        holdDuration: note.holdDuration
      })
    })
    time += beatInterval * pattern.beats
  }
  
  return notes
}
```

### Hit Detection

```typescript
function checkHit(note: RhythmNote, tapTime: number): Rating {
  const diff = Math.abs(tapTime - note.targetTime)
  if (diff <= 50) return 'perfect'
  if (diff <= 100) return 'good'
  if (diff <= 150) return 'ok'
  return 'miss'
}
```

---

## Animations

| Event | Animation |
|-------|-----------|
| Note spawn | Fade in at top of lane |
| Note fall | Smooth descent to target |
| Perfect hit | Note explodes with stars |
| Good hit | Note pops with sparkles |
| OK hit | Note fades with small puff |
| Miss | Note falls through, X mark |
| Combo x10 | Numbers catch fire |
| Combo x50 | Screen border glows |
| Fever mode | Background pulses, particles |
| Song end | Notes clear, results fly in |

---

## Sound Effects

| Event | Sound |
|-------|-------|
| Perfect hit | Crisp "ting" |
| Good hit | Soft "tap" |
| OK hit | Muted "thud" |
| Miss | Silence or soft buzz |
| Combo milestone | Rising chime |
| Fever activate | Power-up sound |
| Song end | Applause + jingle |

**Music:**
- Procedural or licensed-free background music
- Matches BPM of note pattern
- Cute, upbeat, food-themed

---

## Integration Points

- **Energy System:** Deduct 10 on game start
- **Stats Tracking:** Increment `minigamesCompleted` on finish
- **Unlock Check:** After game, check if Ember unlocks (10 games)
- **Pet Ability:** Apply active pet's ability at game start
- **Song Unlock:** Check player level for harder songs

---

## Test Cases

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

*END OF RHYTHM TAP DESIGN*
