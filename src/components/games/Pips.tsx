// ============================================
// GRUNDY — PIPS MINI-GAME
// Bible §8, Design: GRUNDY_PIPS_DESIGN.md
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../game/store';

// ============================================
// CONSTANTS
// ============================================

const GAME_DURATION_MS = 120_000; // 120 seconds
const GRID_SIZE = 4; // 4x4 grid
const TOTAL_PAIRS = 8; // 8 pairs = 16 tiles
const COMBO_WINDOW_MS = 3000; // 3 seconds for combo

// Scoring
const POINTS = {
  matchPair: 10,
  comboX2: 5,
  comboX3: 10,
  comboX4Plus: 15,
  doublesMatch: 5, // For matching high pip values (5, 6)
  clearBoard: 50,
  timeBonus: 1, // Per 10 seconds remaining
};

// Pip display characters (dice faces)
const PIP_EMOJIS: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
};

// ============================================
// TYPES
// ============================================

interface PipTile {
  id: number;
  pips: 1 | 2 | 3 | 4 | 5 | 6;
  isCleared: boolean;
  isSelected: boolean;
  isWild: boolean;
  isHinted: boolean;
}

interface PetAbilities {
  extraTimeMs: number; // Plompo: +30s
  comboWindowMs: number; // Ember: extended to 5s
  doublesMultiplier: number; // Grib: 2x points for doubles
  hintAfterMs: number | null; // Munchlet: hint after 30s
  peekAtStart: boolean; // Whisp: show all matches for 3s
  hasWildTile: boolean; // Chomper: one wild tile
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPetAbilities(petId: string): PetAbilities {
  const abilities: PetAbilities = {
    extraTimeMs: 0,
    comboWindowMs: COMBO_WINDOW_MS,
    doublesMultiplier: 1,
    hintAfterMs: null,
    peekAtStart: false,
    hasWildTile: false,
  };

  switch (petId) {
    case 'munchlet':
      abilities.hintAfterMs = 30_000;
      break;
    case 'grib':
      abilities.doublesMultiplier = 2;
      break;
    case 'plompo':
      abilities.extraTimeMs = 30_000;
      break;
    // Fizz's +25% final score is handled in miniGameRewards.ts
    case 'ember':
      abilities.comboWindowMs = 5000;
      break;
    case 'chomper':
      abilities.hasWildTile = true;
      break;
    case 'whisp':
      abilities.peekAtStart = true;
      break;
    // Luxe's 2x food drop chance is handled in miniGameRewards.ts
  }

  return abilities;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateBoard(hasWildTile: boolean): PipTile[] {
  // Generate 8 pairs from pip values 1-6
  const pairs: number[] = [];
  for (let i = 0; i < TOTAL_PAIRS; i++) {
    const pip = (i % 6) + 1;
    pairs.push(pip, pip);
  }

  // Shuffle and create tiles
  const shuffledPairs = shuffle(pairs);
  const tiles = shuffledPairs.map((pips, id) => ({
    id,
    pips: pips as 1 | 2 | 3 | 4 | 5 | 6,
    isCleared: false,
    isSelected: false,
    isWild: false,
    isHinted: false,
  }));

  // Chomper ability: mark one random tile as wild
  if (hasWildTile) {
    const wildIndex = Math.floor(Math.random() * tiles.length);
    tiles[wildIndex].isWild = true;
  }

  return tiles;
}

function isDoubles(pips: number): boolean {
  return pips >= 5; // 5 and 6 are considered "doubles" for bonus
}

// ============================================
// COMPONENT
// ============================================

interface PipsProps {
  onGameEnd: (score: number) => void;
}

export function Pips({ onGameEnd }: PipsProps) {
  const petId = useGameStore((state) => state.pet.id);
  const abilities = getPetAbilities(petId);

  // Game state
  const [tiles, setTiles] = useState<PipTile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [pairsCleared, setPairsCleared] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_MS + abilities.extraTimeMs);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [wildUsed, setWildUsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchFeedback, setMatchFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Refs
  const lastMatchTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameEndedRef = useRef(false);
  const elapsedRef = useRef(0);

  // Initialize board
  useEffect(() => {
    const newTiles = generateBoard(abilities.hasWildTile);
    setTiles(newTiles);
    setTimeRemaining(GAME_DURATION_MS + abilities.extraTimeMs);
  }, [abilities.hasWildTile, abilities.extraTimeMs]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameEnded || isPeeking) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        elapsedRef.current += 100;
        if (prev <= 100) {
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded, isPeeking]);

  // Check for game end
  useEffect(() => {
    if (gameEndedRef.current) return;

    // Win condition: all pairs cleared
    if (pairsCleared === TOTAL_PAIRS && gameStarted) {
      gameEndedRef.current = true;
      setGameEnded(true);
      const finalScore = calculateFinalScore(true);
      onGameEnd(finalScore);
    }
    // Lose condition: time expired
    else if (timeRemaining <= 0 && gameStarted) {
      gameEndedRef.current = true;
      setGameEnded(true);
      const finalScore = calculateFinalScore(false);
      onGameEnd(finalScore);
    }
  }, [pairsCleared, timeRemaining, gameStarted]);

  // Munchlet hint ability - after 30s, show a valid pair
  useEffect(() => {
    if (
      abilities.hintAfterMs !== null &&
      elapsedRef.current >= abilities.hintAfterMs &&
      !hintUsed &&
      gameStarted &&
      !gameEnded
    ) {
      showHint();
    }
  }, [timeRemaining, abilities.hintAfterMs, hintUsed, gameStarted, gameEnded]);

  const showHint = useCallback(() => {
    setHintUsed(true);

    // Find a valid pair to hint
    const unclearedTiles = tiles.filter((t) => !t.isCleared);
    const pipCounts: Record<number, number[]> = {};

    unclearedTiles.forEach((tile) => {
      if (!pipCounts[tile.pips]) {
        pipCounts[tile.pips] = [];
      }
      pipCounts[tile.pips].push(tile.id);
    });

    // Find a pip value with at least 2 tiles
    for (const [_, tileIds] of Object.entries(pipCounts)) {
      if (tileIds.length >= 2) {
        // Highlight these tiles
        setTiles((prev) =>
          prev.map((t) => ({
            ...t,
            isHinted: tileIds.slice(0, 2).includes(t.id),
          }))
        );

        // Remove hint after 3 seconds
        setTimeout(() => {
          setTiles((prev) => prev.map((t) => ({ ...t, isHinted: false })));
        }, 3000);

        break;
      }
    }
  }, [tiles]);

  const calculateFinalScore = useCallback(
    (cleared: boolean) => {
      let finalScore = score;

      // Clear board bonus
      if (cleared) {
        finalScore += POINTS.clearBoard;
      }

      // Time bonus: +1 per 10 seconds remaining
      const secondsRemaining = Math.floor(timeRemaining / 1000);
      finalScore += Math.floor(secondsRemaining / 10) * POINTS.timeBonus;

      return finalScore;
    },
    [score, timeRemaining]
  );

  // Handle tile selection
  const handleTileClick = useCallback(
    (tileId: number) => {
      if (gameEnded || isProcessing) return;

      const tile = tiles.find((t) => t.id === tileId);
      if (!tile || tile.isCleared) return;

      // Start game on first click
      if (!gameStarted) {
        setGameStarted(true);

        // Whisp peek ability
        if (abilities.peekAtStart) {
          setIsPeeking(true);
          highlightAllMatches();
          setTimeout(() => {
            setTiles((prev) => prev.map((t) => ({ ...t, isHinted: false })));
            setIsPeeking(false);
          }, 3000);
          return;
        }
      }

      // If no tile selected, select this one
      if (selectedTileId === null) {
        setSelectedTileId(tileId);
        setTiles((prev) =>
          prev.map((t) => ({
            ...t,
            isSelected: t.id === tileId,
          }))
        );
        return;
      }

      // If clicking the same tile, deselect
      if (selectedTileId === tileId) {
        setSelectedTileId(null);
        setTiles((prev) =>
          prev.map((t) => ({
            ...t,
            isSelected: false,
          }))
        );
        return;
      }

      // Second tile selected - check for match
      setIsProcessing(true);
      const firstTile = tiles.find((t) => t.id === selectedTileId);
      const secondTile = tile;

      if (!firstTile) {
        setIsProcessing(false);
        return;
      }

      // Check if match (same pips OR one is wild)
      const isMatch =
        firstTile.pips === secondTile.pips ||
        (firstTile.isWild && !wildUsed) ||
        (secondTile.isWild && !wildUsed);

      if (isMatch) {
        // Mark wild as used if applicable
        if ((firstTile.isWild || secondTile.isWild) && !wildUsed) {
          setWildUsed(true);
        }

        // Calculate combo
        const now = Date.now();
        const timeSinceLastMatch = now - lastMatchTimeRef.current;
        let newCombo = 1;

        if (lastMatchTimeRef.current > 0 && timeSinceLastMatch < abilities.comboWindowMs) {
          newCombo = combo + 1;
        }

        lastMatchTimeRef.current = now;
        setCombo(newCombo);

        // Calculate points
        let points = POINTS.matchPair;

        // Combo bonus
        if (newCombo === 2) points += POINTS.comboX2;
        else if (newCombo === 3) points += POINTS.comboX3;
        else if (newCombo >= 4) points += POINTS.comboX4Plus;

        // Doubles bonus (for high pip values)
        if (isDoubles(firstTile.pips) || isDoubles(secondTile.pips)) {
          points += POINTS.doublesMatch * abilities.doublesMultiplier;
        }

        setScore((s) => s + points);
        setPairsCleared((p) => p + 1);

        // Clear the matched tiles
        setTiles((prev) =>
          prev.map((t) => ({
            ...t,
            isCleared: t.id === firstTile.id || t.id === secondTile.id ? true : t.isCleared,
            isSelected: false,
          }))
        );

        setMatchFeedback({ success: true, message: `+${points}` });
        setTimeout(() => setMatchFeedback(null), 800);
      } else {
        // No match - shake and reset
        setCombo(0);
        setTiles((prev) =>
          prev.map((t) => ({
            ...t,
            isSelected: false,
          }))
        );

        setMatchFeedback({ success: false, message: 'No match!' });
        setTimeout(() => setMatchFeedback(null), 800);
      }

      setSelectedTileId(null);
      setTimeout(() => setIsProcessing(false), 300);
    },
    [
      tiles,
      selectedTileId,
      gameStarted,
      gameEnded,
      isProcessing,
      combo,
      wildUsed,
      abilities.peekAtStart,
      abilities.comboWindowMs,
      abilities.doublesMultiplier,
    ]
  );

  const highlightAllMatches = useCallback(() => {
    // Find all pairs and highlight them
    const pipGroups: Record<number, number[]> = {};
    tiles.forEach((tile) => {
      if (!tile.isCleared) {
        if (!pipGroups[tile.pips]) {
          pipGroups[tile.pips] = [];
        }
        pipGroups[tile.pips].push(tile.id);
      }
    });

    const hintedIds: number[] = [];
    Object.values(pipGroups).forEach((ids) => {
      if (ids.length >= 2) {
        hintedIds.push(...ids.slice(0, 2));
      }
    });

    setTiles((prev) =>
      prev.map((t) => ({
        ...t,
        isHinted: hintedIds.includes(t.id),
      }))
    );
  }, [tiles]);

  // Format time display
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Pre-game start screen
  if (!gameStarted && !isPeeking) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-500 to-orange-600 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-4">🎲 Pips</h2>
        <p className="text-white/80 text-center mb-2">
          Match tiles with the same pip count!
        </p>
        <p className="text-white/60 text-center text-sm mb-6">
          {TOTAL_PAIRS} pairs • {formatTime(GAME_DURATION_MS + abilities.extraTimeMs)} time limit
        </p>

        {/* Pet ability preview */}
        {abilities.peekAtStart && (
          <p className="text-purple-200 text-sm mb-2">👻 Whisp: Preview all matches for 3 seconds!</p>
        )}
        {abilities.extraTimeMs > 0 && (
          <p className="text-blue-200 text-sm mb-2">⏰ Plompo: +30 seconds bonus time!</p>
        )}
        {abilities.hasWildTile && (
          <p className="text-green-200 text-sm mb-2">🃏 Chomper: One wild tile matches anything!</p>
        )}
        {abilities.doublesMultiplier > 1 && (
          <p className="text-yellow-200 text-sm mb-2">✨ Grib: 2x points for doubles!</p>
        )}
        {abilities.comboWindowMs > COMBO_WINDOW_MS && (
          <p className="text-red-200 text-sm mb-2">🔥 Ember: Extended combo window (5s)!</p>
        )}
        {abilities.hintAfterMs !== null && (
          <p className="text-pink-200 text-sm mb-2">💡 Munchlet: Hint after 30 seconds!</p>
        )}

        <button
          onClick={() => {
            setGameStarted(true);
            if (abilities.peekAtStart) {
              setIsPeeking(true);
              highlightAllMatches();
              setTimeout(() => {
                setTiles((prev) => prev.map((t) => ({ ...t, isHinted: false })));
                setIsPeeking(false);
              }, 3000);
            }
          }}
          className="bg-white rounded-xl px-8 py-4 text-orange-600 font-bold text-xl hover:bg-orange-50 transition active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  // Main game UI
  return (
    <div className="h-full bg-gradient-to-b from-amber-500 to-orange-600 flex flex-col select-none">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20">
        <div className="text-white font-bold">
          Score: <span className="text-yellow-300">{score}</span>
        </div>
        <div className="text-white/80 text-sm">
          Pairs: {pairsCleared}/{TOTAL_PAIRS}
        </div>
        <div
          className={`text-white font-bold ${
            timeRemaining <= 30000 ? 'text-red-300 animate-pulse' : ''
          }`}
        >
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Combo indicator */}
      {combo >= 2 && (
        <div className="text-center text-yellow-300 font-bold text-lg animate-bounce py-1">
          🔥 Combo x{combo}!
        </div>
      )}

      {/* Peeking indicator */}
      {isPeeking && (
        <div className="text-center text-purple-200 font-bold py-2 bg-purple-700/50">
          👻 Memorize the matches!
        </div>
      )}

      {/* Match feedback */}
      {matchFeedback && (
        <div
          className={`text-center font-bold text-lg py-1 ${
            matchFeedback.success ? 'text-green-300' : 'text-red-300'
          }`}
        >
          {matchFeedback.message}
        </div>
      )}

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {tiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.isCleared || isProcessing || gameEnded}
              className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-xl font-bold text-3xl sm:text-4xl
                transition-all duration-200 transform
                ${tile.isCleared
                  ? 'bg-transparent scale-0 opacity-0'
                  : tile.isSelected
                  ? 'bg-white ring-4 ring-yellow-400 scale-110'
                  : tile.isHinted
                  ? 'bg-yellow-300 animate-pulse'
                  : tile.isWild && !wildUsed
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                  : 'bg-white/90 hover:bg-white hover:scale-105'
                }
                ${!tile.isCleared && !tile.isSelected ? 'cursor-pointer active:scale-95' : ''}
                shadow-lg
              `}
            >
              {!tile.isCleared && (
                <>
                  {tile.isWild && !wildUsed ? '🃏' : PIP_EMOJIS[tile.pips]}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Game over overlay */}
      {gameEnded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">
              {pairsCleared === TOTAL_PAIRS ? '🎉 You Win!' : "⏰ Time's Up!"}
            </h3>
            <p className="text-gray-600">Final Score: {calculateFinalScore(pairsCleared === TOTAL_PAIRS)}</p>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div className="p-2 text-center text-white/50 text-xs bg-black/10">
        Tap two tiles with the same pips to clear them
      </div>
    </div>
  );
}

export default Pips;
