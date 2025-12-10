// ============================================
// GRUNDY — RHYTHM TAP MINI-GAME
// Bible §8, Design: GRUNDY_RHYTHM_TAP_DESIGN.md
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../game/store';

// ============================================
// CONSTANTS (From Design Doc)
// ============================================

// Timing Windows (ms)
const TIMING_WINDOWS = {
  PERFECT: 50,
  GOOD: 100,
  OK: 150,
};

// Scoring
const POINTS = {
  PERFECT: 100,
  GOOD: 50,
  OK: 25,
  MISS: 0,
  HOLD_PER_BEAT: 10,
  DOUBLE_PERFECT: 150,
};

// Combo multipliers
const COMBO_MULTIPLIERS = [
  { threshold: 100, multiplier: 2.5 },
  { threshold: 50, multiplier: 2.0 },
  { threshold: 25, multiplier: 1.5 },
  { threshold: 10, multiplier: 1.25 },
  { threshold: 0, multiplier: 1.0 },
];

// Fever mode threshold
const FEVER_THRESHOLD = 50;
const FEVER_MULTIPLIER = 1.5;

// Song configurations
const SONGS = {
  morning_munch: { id: 'morning_munch', name: 'Morning Munch', bpm: 80, duration: 45, noteCount: 50 },
  snack_time: { id: 'snack_time', name: 'Snack Time', bpm: 100, duration: 50, noteCount: 70 },
};

// Visual constants
const NOTE_FALL_DURATION_MS = 2000; // Time for note to fall from top to target
const TARGET_LINE_Y = 0.85; // Target line at 85% of game area height
const TICK_RATE_MS = 16; // ~60fps

// Lane colors
const LANE_COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444']; // green, blue, yellow, red
const LANE_EMOJIS = ['🟢', '🔵', '🟡', '🔴'];

// Keyboard mappings
const KEY_TO_LANE: Record<string, number> = {
  'd': 0, 'D': 0,
  'f': 1, 'F': 1,
  'j': 2, 'J': 2,
  'k': 3, 'K': 3,
  // Arrow keys alternative
  'ArrowLeft': 0,
  'ArrowDown': 1,
  'ArrowUp': 2,
  'ArrowRight': 3,
};

// ============================================
// TYPES
// ============================================

type NoteType = 'single' | 'hold' | 'double';
type HitRating = 'perfect' | 'good' | 'ok' | 'miss';

interface RhythmNote {
  id: number;
  lane: 0 | 1 | 2 | 3;
  type: NoteType;
  targetTime: number; // ms from song start
  holdDuration?: number; // ms for hold notes
  isHit: boolean;
  rating?: HitRating;
  // For double notes, the paired lane
  pairedLane?: 0 | 1 | 2 | 3;
}

interface SongData {
  id: string;
  name: string;
  bpm: number;
  duration: number;
  noteCount: number;
}

interface RhythmScoreState {
  score: number;
  combo: number;
  maxCombo: number;
  perfectCount: number;
  goodCount: number;
  okCount: number;
  missCount: number;
}

interface PetAbilities {
  okWindowMultiplier: number;     // Munchlet: OK window expanded to ±200ms
  noteSpeedMultiplier: number;    // Grib: Notes fall 15% slower
  holdPointsMultiplier: number;   // Plompo: Hold notes worth 2× points
  feverBonusMultiplier: number;   // Fizz: +25% points during fever
  fireStreakEnabled: boolean;     // Ember: 15+ combo = auto-hit for 2 seconds
  secondChanceEnabled: boolean;   // Chomper: First miss doesn't break combo
  ghostNotesCount: number;        // Whisp: Miss up to 3 notes without penalty
  maxComboMultiplier: number;     // Luxe: Max combo multiplier 3.0× instead of 2.5×
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPetAbilities(petId: string): PetAbilities {
  const abilities: PetAbilities = {
    okWindowMultiplier: 1,
    noteSpeedMultiplier: 1,
    holdPointsMultiplier: 1,
    feverBonusMultiplier: 1,
    fireStreakEnabled: false,
    secondChanceEnabled: false,
    ghostNotesCount: 0,
    maxComboMultiplier: 2.5,
  };

  switch (petId) {
    case 'munchlet':
      abilities.okWindowMultiplier = 200 / TIMING_WINDOWS.OK; // Expand to ±200ms
      break;
    case 'grib':
      abilities.noteSpeedMultiplier = 1.15; // 15% slower = 15% more time
      break;
    case 'plompo':
      abilities.holdPointsMultiplier = 2;
      break;
    case 'fizz':
      abilities.feverBonusMultiplier = 1.25;
      break;
    case 'ember':
      abilities.fireStreakEnabled = true;
      break;
    case 'chomper':
      abilities.secondChanceEnabled = true;
      break;
    case 'whisp':
      abilities.ghostNotesCount = 3;
      break;
    case 'luxe':
      abilities.maxComboMultiplier = 3.0;
      break;
  }

  return abilities;
}

function getComboMultiplier(combo: number, maxMultiplier: number): number {
  for (const { threshold, multiplier } of COMBO_MULTIPLIERS) {
    if (combo >= threshold) {
      return Math.min(multiplier, maxMultiplier);
    }
  }
  return 1.0;
}

function generateNotes(song: SongData, abilities: PetAbilities): RhythmNote[] {
  const notes: RhythmNote[] = [];
  const beatInterval = 60000 / song.bpm;
  let noteId = 0;

  // Start 2 beats in for lead-in
  let time = beatInterval * 2;
  const endTime = (song.duration * 1000) - (beatInterval * 2);

  // Calculate notes per pattern
  const totalBeats = Math.floor((endTime - time) / beatInterval);
  const notesPerPattern = Math.ceil(song.noteCount / (totalBeats / 4));

  let patternCount = 0;

  while (time < endTime && notes.length < song.noteCount) {
    // Generate pattern
    const pattern = generatePattern(patternCount % 8, song.bpm);

    for (const noteData of pattern) {
      if (notes.length >= song.noteCount) break;

      const lane = noteData.lane as 0 | 1 | 2 | 3;

      if (noteData.type === 'double' && noteData.pairedLane !== undefined) {
        // Double note - add both
        notes.push({
          id: noteId++,
          lane: lane,
          type: 'double',
          targetTime: time + noteData.offset,
          isHit: false,
          pairedLane: noteData.pairedLane as 0 | 1 | 2 | 3,
        });
      } else if (noteData.type === 'hold' && noteData.holdDuration) {
        notes.push({
          id: noteId++,
          lane: lane,
          type: 'hold',
          targetTime: time + noteData.offset,
          holdDuration: noteData.holdDuration,
          isHit: false,
        });
      } else {
        notes.push({
          id: noteId++,
          lane: lane,
          type: 'single',
          targetTime: time + noteData.offset,
          isHit: false,
        });
      }
    }

    time += beatInterval * 4; // Move 4 beats forward
    patternCount++;
  }

  return notes;
}

function generatePattern(patternIndex: number, bpm: number): Array<{
  lane: number;
  type: NoteType;
  offset: number;
  holdDuration?: number;
  pairedLane?: number;
}> {
  const beatInterval = 60000 / bpm;
  const patterns: Array<Array<{ lane: number; type: NoteType; offset: number; holdDuration?: number; pairedLane?: number }>> = [
    // Pattern 0: Simple singles
    [
      { lane: 0, type: 'single', offset: 0 },
      { lane: 1, type: 'single', offset: beatInterval },
      { lane: 2, type: 'single', offset: beatInterval * 2 },
      { lane: 3, type: 'single', offset: beatInterval * 3 },
    ],
    // Pattern 1: Alternating
    [
      { lane: 0, type: 'single', offset: 0 },
      { lane: 2, type: 'single', offset: beatInterval },
      { lane: 1, type: 'single', offset: beatInterval * 2 },
      { lane: 3, type: 'single', offset: beatInterval * 3 },
    ],
    // Pattern 2: Fast doubles
    [
      { lane: 1, type: 'single', offset: 0 },
      { lane: 2, type: 'single', offset: beatInterval * 0.5 },
      { lane: 1, type: 'single', offset: beatInterval * 2 },
      { lane: 2, type: 'single', offset: beatInterval * 2.5 },
    ],
    // Pattern 3: Double notes
    [
      { lane: 0, type: 'double', offset: 0, pairedLane: 3 },
      { lane: 1, type: 'double', offset: beatInterval * 2, pairedLane: 2 },
    ],
    // Pattern 4: Hold note
    [
      { lane: 1, type: 'hold', offset: 0, holdDuration: beatInterval * 2 },
      { lane: 2, type: 'single', offset: beatInterval * 3 },
    ],
    // Pattern 5: Stairs up
    [
      { lane: 0, type: 'single', offset: 0 },
      { lane: 1, type: 'single', offset: beatInterval * 0.5 },
      { lane: 2, type: 'single', offset: beatInterval },
      { lane: 3, type: 'single', offset: beatInterval * 1.5 },
    ],
    // Pattern 6: Stairs down
    [
      { lane: 3, type: 'single', offset: 0 },
      { lane: 2, type: 'single', offset: beatInterval * 0.5 },
      { lane: 1, type: 'single', offset: beatInterval },
      { lane: 0, type: 'single', offset: beatInterval * 1.5 },
    ],
    // Pattern 7: Center focus
    [
      { lane: 1, type: 'single', offset: 0 },
      { lane: 2, type: 'single', offset: beatInterval },
      { lane: 1, type: 'single', offset: beatInterval * 2 },
      { lane: 2, type: 'single', offset: beatInterval * 3 },
    ],
  ];

  return patterns[patternIndex % patterns.length];
}

// ============================================
// COMPONENT
// ============================================

export interface RhythmTapProps {
  onGameEnd: (score: number) => void;
}

export function RhythmTap({ onGameEnd }: RhythmTapProps) {
  const petId = useGameStore((state) => state.pet.id);
  const abilities = getPetAbilities(petId);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [song] = useState<SongData>(SONGS.snack_time);
  const [notes, setNotes] = useState<RhythmNote[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [scoreState, setScoreState] = useState<RhythmScoreState>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    goodCount: 0,
    okCount: 0,
    missCount: 0,
  });

  // Pet ability state
  const [ghostNotesUsed, setGhostNotesUsed] = useState(0);
  const [secondChanceUsed, setSecondChanceUsed] = useState(false);
  const [fireStreakEndTime, setFireStreakEndTime] = useState(0);

  // Visual feedback
  const [lastHitEffect, setLastHitEffect] = useState<{ rating: HitRating; lane: number } | null>(null);
  const [lanePressed, setLanePressed] = useState<boolean[]>([false, false, false, false]);

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const gameEndedRef = useRef(false);

  // Computed values
  const isFeverActive = scoreState.combo >= FEVER_THRESHOLD;
  const adjustedOkWindow = TIMING_WINDOWS.OK * abilities.okWindowMultiplier;
  const noteFallDuration = NOTE_FALL_DURATION_MS * abilities.noteSpeedMultiplier;

  // Initialize notes when game starts
  useEffect(() => {
    if (gameStarted && notes.length === 0) {
      const generatedNotes = generateNotes(song, abilities);
      setNotes(generatedNotes);
    }
  }, [gameStarted, song, abilities, notes.length]);

  // Handle hit rating
  const rateHit = useCallback((tapTime: number, targetTime: number): HitRating => {
    const diff = Math.abs(tapTime - targetTime);
    if (diff <= TIMING_WINDOWS.PERFECT) return 'perfect';
    if (diff <= TIMING_WINDOWS.GOOD) return 'good';
    if (diff <= adjustedOkWindow) return 'ok';
    return 'miss';
  }, [adjustedOkWindow]);

  // Calculate points for a hit
  const calculatePoints = useCallback((rating: HitRating, noteType: NoteType, holdBeats?: number): number => {
    let basePoints = 0;

    if (noteType === 'double') {
      basePoints = rating === 'perfect' ? POINTS.DOUBLE_PERFECT :
                   rating === 'good' ? POINTS.GOOD * 2 :
                   rating === 'ok' ? POINTS.OK * 2 : 0;
    } else {
      basePoints = rating === 'perfect' ? POINTS.PERFECT :
                   rating === 'good' ? POINTS.GOOD :
                   rating === 'ok' ? POINTS.OK : 0;
    }

    // Add hold points
    if (noteType === 'hold' && holdBeats && rating !== 'miss') {
      basePoints += POINTS.HOLD_PER_BEAT * holdBeats * abilities.holdPointsMultiplier;
    }

    // Apply combo multiplier
    const comboMult = getComboMultiplier(scoreState.combo, abilities.maxComboMultiplier);
    basePoints = Math.floor(basePoints * comboMult);

    // Apply fever bonus
    if (isFeverActive) {
      const feverMult = FEVER_MULTIPLIER * abilities.feverBonusMultiplier;
      basePoints = Math.floor(basePoints * feverMult);
    }

    return basePoints;
  }, [scoreState.combo, isFeverActive, abilities]);

  // Handle lane tap
  const handleTap = useCallback((lane: number) => {
    if (!gameStarted || gameEnded) return;

    const tapTime = currentTime;

    // Check for fire streak auto-hit
    if (abilities.fireStreakEnabled && Date.now() < fireStreakEndTime) {
      // Auto-hit any note in this lane
      const nearestNote = notes.find(
        (n) => !n.isHit && n.lane === lane && Math.abs(tapTime - n.targetTime) <= adjustedOkWindow * 2
      );
      if (nearestNote) {
        processHit(nearestNote, 'perfect', tapTime);
      }
      return;
    }

    // Find nearest unhit note in this lane within the OK window
    let nearestNote: RhythmNote | undefined;
    let nearestDiff = Infinity;

    for (const note of notes) {
      if (note.isHit) continue;
      if (note.lane !== lane && note.pairedLane !== lane) continue;

      const diff = Math.abs(tapTime - note.targetTime);
      if (diff < nearestDiff && diff <= adjustedOkWindow) {
        nearestNote = note;
        nearestDiff = diff;
      }
    }

    if (nearestNote) {
      const rating = rateHit(tapTime, nearestNote.targetTime);
      processHit(nearestNote, rating, tapTime);
    }
  }, [gameStarted, gameEnded, currentTime, notes, adjustedOkWindow, abilities, fireStreakEndTime, rateHit]);

  // Process a hit
  const processHit = useCallback((note: RhythmNote, rating: HitRating, tapTime: number) => {
    // Mark note as hit
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, isHit: true, rating } : n
      )
    );

    // Visual feedback
    setLastHitEffect({ rating, lane: note.lane });
    setTimeout(() => setLastHitEffect(null), 300);

    // Calculate hold beats if applicable
    const holdBeats = note.type === 'hold' && note.holdDuration
      ? Math.floor(note.holdDuration / (60000 / song.bpm))
      : undefined;

    // Update score state
    setScoreState((prev) => {
      const isMiss = rating === 'miss';
      let newCombo = prev.combo;
      let newMissCount = prev.missCount;

      if (isMiss) {
        // Check for second chance (Chomper)
        if (abilities.secondChanceEnabled && !secondChanceUsed) {
          setSecondChanceUsed(true);
          // Don't break combo
        } else if (abilities.ghostNotesCount > 0 && ghostNotesUsed < abilities.ghostNotesCount) {
          // Whisp ghost notes - no penalty
          setGhostNotesUsed((g) => g + 1);
        } else {
          newCombo = 0;
          newMissCount = prev.missCount + 1;
        }
      } else {
        newCombo = prev.combo + 1;

        // Check for fire streak activation (Ember)
        if (abilities.fireStreakEnabled && newCombo >= 15) {
          setFireStreakEndTime(Date.now() + 2000);
        }
      }

      const points = calculatePoints(rating, note.type, holdBeats);
      const newScore = prev.score + points;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);

      return {
        score: newScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
        perfectCount: prev.perfectCount + (rating === 'perfect' ? 1 : 0),
        goodCount: prev.goodCount + (rating === 'good' ? 1 : 0),
        okCount: prev.okCount + (rating === 'ok' ? 1 : 0),
        missCount: newMissCount,
      };
    });
  }, [song.bpm, abilities, secondChanceUsed, ghostNotesUsed, calculatePoints]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const gameLoop = (timestamp: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      setCurrentTime(elapsed);

      // Check for missed notes
      setNotes((prev) => {
        let hasChanges = false;
        const updated = prev.map((note) => {
          if (!note.isHit && elapsed > note.targetTime + adjustedOkWindow) {
            hasChanges = true;
            return { ...note, isHit: true, rating: 'miss' as HitRating };
          }
          return note;
        });

        if (hasChanges) {
          // Count misses
          const newMisses = updated.filter(
            (n, i) => n.isHit && n.rating === 'miss' && !prev[i]?.isHit
          );

          if (newMisses.length > 0) {
            setScoreState((prevScore) => {
              let newCombo = prevScore.combo;
              let missesToCount = 0;

              for (const miss of newMisses) {
                // Check ghost notes
                if (abilities.ghostNotesCount > 0 && ghostNotesUsed < abilities.ghostNotesCount) {
                  setGhostNotesUsed((g) => g + 1);
                } else if (abilities.secondChanceEnabled && !secondChanceUsed) {
                  setSecondChanceUsed(true);
                } else {
                  newCombo = 0;
                  missesToCount++;
                }
              }

              return {
                ...prevScore,
                combo: newCombo,
                missCount: prevScore.missCount + missesToCount,
              };
            });
          }
        }

        return hasChanges ? updated : prev;
      });

      // Check for game end
      if (elapsed >= song.duration * 1000 && !gameEndedRef.current) {
        gameEndedRef.current = true;
        setGameEnded(true);
        onGameEnd(scoreState.score);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameEnded, song.duration, adjustedOkWindow, onGameEnd, scoreState.score, abilities, ghostNotesUsed, secondChanceUsed]);

  // Keyboard input
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const lane = KEY_TO_LANE[e.key];
      if (lane !== undefined) {
        e.preventDefault();
        setLanePressed((prev) => {
          const next = [...prev];
          next[lane] = true;
          return next;
        });
        handleTap(lane);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const lane = KEY_TO_LANE[e.key];
      if (lane !== undefined) {
        setLanePressed((prev) => {
          const next = [...prev];
          next[lane] = false;
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameEnded, handleTap]);

  // End game check - ensure onGameEnd is called
  useEffect(() => {
    if (gameEnded && !gameEndedRef.current) {
      gameEndedRef.current = true;
      onGameEnd(scoreState.score);
    }
  }, [gameEnded, scoreState.score, onGameEnd]);

  // Handle start
  const handleStart = useCallback(() => {
    setGameStarted(true);
    startTimeRef.current = 0;
  }, []);

  // Format time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil((song.duration * 1000 - ms) / 1000));
    return `0:${totalSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate song progress
  const songProgress = Math.min(currentTime / (song.duration * 1000), 1);

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="h-full bg-gradient-to-b from-purple-600 to-pink-600 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-4">🎵 Rhythm Tap</h2>
        <p className="text-white/80 text-center mb-2">
          Tap notes when they reach the target line!
        </p>
        <p className="text-white/60 text-center text-sm mb-4">
          {song.name} • {song.duration}s • {song.noteCount} notes
        </p>
        <p className="text-white/50 text-center text-xs mb-6">
          Keys: D F J K or Arrow Keys
        </p>

        {/* Pet ability preview */}
        {abilities.okWindowMultiplier > 1 && (
          <p className="text-pink-200 text-sm mb-2">💖 Munchlet: Wider OK timing window!</p>
        )}
        {abilities.noteSpeedMultiplier > 1 && (
          <p className="text-blue-200 text-sm mb-2">🐢 Grib: Notes fall 15% slower!</p>
        )}
        {abilities.holdPointsMultiplier > 1 && (
          <p className="text-green-200 text-sm mb-2">⏳ Plompo: Hold notes worth 2×!</p>
        )}
        {abilities.feverBonusMultiplier > 1 && (
          <p className="text-yellow-200 text-sm mb-2">🔥 Fizz: +25% fever bonus!</p>
        )}
        {abilities.fireStreakEnabled && (
          <p className="text-orange-200 text-sm mb-2">🔥 Ember: Auto-hit at 15+ combo!</p>
        )}
        {abilities.secondChanceEnabled && (
          <p className="text-red-200 text-sm mb-2">💪 Chomper: First miss won't break combo!</p>
        )}
        {abilities.ghostNotesCount > 0 && (
          <p className="text-purple-200 text-sm mb-2">👻 Whisp: {abilities.ghostNotesCount} free misses!</p>
        )}
        {abilities.maxComboMultiplier > 2.5 && (
          <p className="text-yellow-300 text-sm mb-2">✨ Luxe: Max combo 3.0× multiplier!</p>
        )}

        <button
          onClick={handleStart}
          className="bg-white rounded-xl px-8 py-4 text-purple-600 font-bold text-xl hover:bg-purple-50 transition active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col select-none touch-none overflow-hidden transition-colors ${
      isFeverActive ? 'bg-gradient-to-b from-orange-500 to-red-600' : 'bg-gradient-to-b from-purple-600 to-pink-600'
    }`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20">
        <div className="text-white font-bold">
          Score: <span className="text-yellow-300">{scoreState.score}</span>
        </div>
        <div className={`text-white font-bold ${currentTime >= (song.duration * 1000) - 10000 ? 'text-red-300 animate-pulse' : ''}`}>
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Combo and fever indicator */}
      <div className="flex justify-between px-4 py-1">
        <div className={`font-bold ${scoreState.combo >= 10 ? 'text-orange-400' : 'text-white/70'}`}>
          {scoreState.combo > 0 && (
            <>
              Combo: {scoreState.combo}x
              {isFeverActive && <span className="ml-2 text-yellow-300 animate-pulse">🔥 FEVER!</span>}
            </>
          )}
        </div>
        <div className="text-white/50 text-sm">
          ×{getComboMultiplier(scoreState.combo, abilities.maxComboMultiplier).toFixed(2)}
        </div>
      </div>

      {/* Fire streak indicator */}
      {Date.now() < fireStreakEndTime && (
        <div className="text-center text-yellow-300 font-bold text-sm animate-bounce">
          🔥 AUTO-HIT ACTIVE! 🔥
        </div>
      )}

      {/* Ghost notes remaining */}
      {abilities.ghostNotesCount > 0 && ghostNotesUsed < abilities.ghostNotesCount && (
        <div className="text-center text-purple-200 text-xs">
          👻 {abilities.ghostNotesCount - ghostNotesUsed} ghost saves left
        </div>
      )}

      {/* Second chance indicator */}
      {abilities.secondChanceEnabled && !secondChanceUsed && (
        <div className="text-center text-green-200 text-xs">
          💪 Second chance ready
        </div>
      )}

      {/* Game area */}
      <div className="flex-1 relative flex">
        {/* Lanes */}
        {[0, 1, 2, 3].map((lane) => (
          <div
            key={lane}
            className="flex-1 relative border-l border-white/10 first:border-l-0"
            onPointerDown={() => {
              setLanePressed((prev) => {
                const next = [...prev];
                next[lane] = true;
                return next;
              });
              handleTap(lane);
            }}
            onPointerUp={() => {
              setLanePressed((prev) => {
                const next = [...prev];
                next[lane] = false;
                return next;
              });
            }}
            onPointerLeave={() => {
              setLanePressed((prev) => {
                const next = [...prev];
                next[lane] = false;
                return next;
              });
            }}
          >
            {/* Notes in this lane */}
            {notes
              .filter((note) => (note.lane === lane || note.pairedLane === lane) && !note.isHit)
              .map((note) => {
                // Calculate note position
                const timeUntilHit = note.targetTime - currentTime;
                const progress = 1 - (timeUntilHit / noteFallDuration);

                // Only render visible notes
                if (progress < 0 || progress > 1.2) return null;

                const topPercent = progress * TARGET_LINE_Y * 100;

                return (
                  <div
                    key={note.id}
                    className={`absolute left-1/2 -translate-x-1/2 text-3xl transition-none ${
                      note.type === 'hold' ? 'text-4xl' : ''
                    }`}
                    style={{
                      top: `${topPercent}%`,
                    }}
                  >
                    {note.type === 'double' ? '⚡' : note.type === 'hold' ? '⬇️' : LANE_EMOJIS[lane]}
                  </div>
                );
              })}

            {/* Target line tap zone */}
            <div
              className={`absolute left-0 right-0 h-16 flex items-center justify-center transition-all ${
                lanePressed[lane] ? 'scale-110' : ''
              }`}
              style={{ top: `${TARGET_LINE_Y * 100 - 4}%` }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-4 transition-all ${
                  lanePressed[lane]
                    ? 'bg-white scale-110'
                    : 'bg-white/20'
                }`}
                style={{ borderColor: LANE_COLORS[lane] }}
              >
                🎯
              </div>
            </div>

            {/* Hit effect */}
            {lastHitEffect && lastHitEffect.lane === lane && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 text-xl font-bold pointer-events-none animate-ping ${
                  lastHitEffect.rating === 'perfect' ? 'text-yellow-400' :
                  lastHitEffect.rating === 'good' ? 'text-green-400' :
                  lastHitEffect.rating === 'ok' ? 'text-blue-400' :
                  'text-red-400'
                }`}
                style={{ top: `${(TARGET_LINE_Y - 0.1) * 100}%` }}
              >
                {lastHitEffect.rating === 'perfect' ? '✨ PERFECT!' :
                 lastHitEffect.rating === 'good' ? '👍 GOOD!' :
                 lastHitEffect.rating === 'ok' ? 'OK' :
                 '✗ MISS'}
              </div>
            )}
          </div>
        ))}

        {/* Target line */}
        <div
          className="absolute left-0 right-0 h-1 bg-white/50"
          style={{ top: `${TARGET_LINE_Y * 100}%` }}
        />
      </div>

      {/* Bottom controls */}
      <div className="p-3 bg-black/20">
        {/* Song progress */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div
            className="bg-white/80 rounded-full h-2 transition-all"
            style={{ width: `${songProgress * 100}%` }}
          />
        </div>
        <div className="text-center text-white/50 text-xs">
          {song.name} • {Math.floor(songProgress * 100)}%
        </div>
      </div>

      {/* Game over overlay */}
      {gameEnded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">🎵 Song Complete!</h3>
            <p className="text-gray-600 mb-2">
              Final Score: {scoreState.score}
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Perfect: {scoreState.perfectCount} | Good: {scoreState.goodCount}</p>
              <p>OK: {scoreState.okCount} | Miss: {scoreState.missCount}</p>
              <p>Max Combo: {scoreState.maxCombo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RhythmTap;
