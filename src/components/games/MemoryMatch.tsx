// ============================================
// GRUNDY — MEMORY MATCH MINI-GAME
// Bible §8, Design: GRUNDY_MEMORY_MATCH_DESIGN.md
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../game/store';
import { getAllFoods } from '../../data/foods';
import type { FoodDefinition } from '../../types';

// ============================================
// CONSTANTS
// ============================================

// Difficulty configurations
const DIFFICULTIES = {
  easy: { rows: 3, cols: 4, pairs: 6, timeMs: 60_000, unlockLevel: 1 },
  medium: { rows: 4, cols: 4, pairs: 8, timeMs: 90_000, unlockLevel: 5 },
  // hard: { rows: 4, cols: 5, pairs: 10, timeMs: 120_000, unlockLevel: 10 }, // Post-launch
} as const;

type Difficulty = keyof typeof DIFFICULTIES;

// Scoring
const POINTS = {
  findPair: 50,
  perfectMatch: 25, // Bonus for first-try match
  timeBonus: 2, // Per second remaining
  streakBonus: 10, // Per pair when 3+ streak
};

// Move efficiency bonus thresholds (for 8-pair game, scales for others)
function getMoveEfficiencyBonus(moves: number, totalPairs: number): number {
  // Scale thresholds based on pair count (8 pairs = baseline)
  const scale = totalPairs / 8;
  const perfect = Math.floor(12 * scale);
  const great = Math.floor(16 * scale);
  const good = Math.floor(20 * scale);

  if (moves <= perfect) return 100;
  if (moves <= great) return 50;
  if (moves <= good) return 25;
  return 0;
}

// Flip delay (ms to show mismatched cards before flipping back)
const MISMATCH_DELAY_MS = 1000;
const PEEK_DURATION_MS = 3000; // Whisp ability
const HINT_DURATION_MS = 2000; // Munchlet ability

// ============================================
// TYPES
// ============================================

interface MemoryCard {
  id: number;
  foodId: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface PetAbilities {
  extraTimeMs: number; // Grib: +15s
  timerSpeedMultiplier: number; // Plompo: 0.75 (25% slower)
  peekAtStart: boolean; // Whisp: see all cards 3s
  flashMatchesAtStart: boolean; // Ember: show matched positions briefly
  hintAfterMoves: number | null; // Munchlet: hint after 8 moves
  freeReflip: boolean; // Chomper: undo last flip once
  luckyFirstFlip: boolean; // Luxe: first flip guaranteed match
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPetAbilities(petId: string): PetAbilities {
  const abilities: PetAbilities = {
    extraTimeMs: 0,
    timerSpeedMultiplier: 1,
    peekAtStart: false,
    flashMatchesAtStart: false,
    hintAfterMoves: null,
    freeReflip: false,
    luckyFirstFlip: false,
  };

  switch (petId) {
    case 'munchlet':
      abilities.hintAfterMoves = 8;
      break;
    case 'grib':
      abilities.extraTimeMs = 15_000;
      break;
    case 'plompo':
      abilities.timerSpeedMultiplier = 0.75;
      break;
    // Fizz's +25% final score is handled in miniGameRewards.ts
    case 'ember':
      abilities.flashMatchesAtStart = true;
      break;
    case 'chomper':
      abilities.freeReflip = true;
      break;
    case 'whisp':
      abilities.peekAtStart = true;
      break;
    case 'luxe':
      abilities.luckyFirstFlip = true;
      break;
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

function generateBoard(pairs: number): MemoryCard[] {
  const foods = shuffle(getAllFoods()).slice(0, pairs);
  const cards: MemoryCard[] = [];

  foods.forEach((food, i) => {
    cards.push({
      id: i * 2,
      foodId: food.id,
      emoji: food.emoji,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: i * 2 + 1,
      foodId: food.id,
      emoji: food.emoji,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffle(cards);
}

// ============================================
// COMPONENT
// ============================================

interface MemoryMatchProps {
  onGameEnd: (score: number) => void;
}

export function MemoryMatch({ onGameEnd }: MemoryMatchProps) {
  const petId = useGameStore((state) => state.pet.id);
  const abilities = getPetAbilities(petId);

  // Game configuration
  const [difficulty] = useState<Difficulty>('easy'); // Start with easy for now
  const config = DIFFICULTIES[difficulty];

  // Game state
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeMs + abilities.extraTimeMs);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [hintPair, setHintPair] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [reflipUsed, setReflipUsed] = useState(false);
  const [lastFlippedIndex, setLastFlippedIndex] = useState<number | null>(null);
  const [luckyFirstUsed, setLuckyFirstUsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [perfectMatches, setPerfectMatches] = useState<Set<number>>(new Set());

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameEndedRef = useRef(false);

  // Initialize board
  useEffect(() => {
    const newCards = generateBoard(config.pairs);
    setCards(newCards);
    setTimeRemaining(config.timeMs + abilities.extraTimeMs);
  }, [config.pairs, config.timeMs, abilities.extraTimeMs]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameEnded || isPeeking) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const decrement = 100 * abilities.timerSpeedMultiplier;
        const newTime = prev - decrement;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded, isPeeking, abilities.timerSpeedMultiplier]);

  // Check for game end
  useEffect(() => {
    if (gameEndedRef.current) return;

    // Win condition: all pairs matched
    if (matchedPairs === config.pairs && gameStarted) {
      gameEndedRef.current = true;
      setGameEnded(true);
      const finalScore = calculateFinalScore();
      onGameEnd(finalScore);
    }
    // Lose condition: time expired
    else if (timeRemaining <= 0 && gameStarted) {
      gameEndedRef.current = true;
      setGameEnded(true);
      const finalScore = calculateFinalScore();
      onGameEnd(finalScore);
    }
  }, [matchedPairs, timeRemaining, gameStarted, config.pairs]);

  // Munchlet hint ability
  useEffect(() => {
    if (
      abilities.hintAfterMoves !== null &&
      moves >= abilities.hintAfterMoves &&
      !hintUsed &&
      gameStarted &&
      !gameEnded
    ) {
      // Find an unmatched pair to hint
      const unmatchedFoodIds = new Set<string>();
      cards.forEach((card) => {
        if (!card.isMatched) {
          unmatchedFoodIds.add(card.foodId);
        }
      });
      if (unmatchedFoodIds.size > 0) {
        const hintFoodId = Array.from(unmatchedFoodIds)[0];
        setHintPair(hintFoodId);
        setHintUsed(true);
        setTimeout(() => setHintPair(null), HINT_DURATION_MS);
      }
    }
  }, [moves, abilities.hintAfterMoves, hintUsed, gameStarted, gameEnded, cards]);

  const calculateFinalScore = useCallback(() => {
    let finalScore = score;

    // Time bonus
    const secondsRemaining = Math.floor(timeRemaining / 1000);
    finalScore += secondsRemaining * POINTS.timeBonus;

    // Move efficiency bonus
    finalScore += getMoveEfficiencyBonus(moves, config.pairs);

    return finalScore;
  }, [score, timeRemaining, moves, config.pairs]);

  // Handle card flip
  const handleCardClick = useCallback(
    (index: number) => {
      if (gameEnded || isProcessing) return;
      if (cards[index].isFlipped || cards[index].isMatched) return;
      if (flippedIndices.length >= 2) return;

      // Start game on first click
      if (!gameStarted) {
        setGameStarted(true);

        // Whisp peek ability
        if (abilities.peekAtStart) {
          setIsPeeking(true);
          setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
          setTimeout(() => {
            setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
            setIsPeeking(false);
          }, PEEK_DURATION_MS);
          return;
        }
      }

      // Luxe lucky first flip
      if (abilities.luckyFirstFlip && !luckyFirstUsed && flippedIndices.length === 0) {
        setLuckyFirstUsed(true);
        // Find the matching card for this one
        const targetCard = cards[index];
        const matchingIndex = cards.findIndex(
          (c, i) => i !== index && c.foodId === targetCard.foodId
        );

        // Flip both cards
        setCards((prev) => {
          const newCards = [...prev];
          newCards[index] = { ...newCards[index], isFlipped: true };
          if (matchingIndex !== -1) {
            newCards[matchingIndex] = { ...newCards[matchingIndex], isFlipped: true };
          }
          return newCards;
        });
        setFlippedIndices([index, matchingIndex]);
        setLastFlippedIndex(matchingIndex);

        // Process as a match after delay
        setTimeout(() => {
          setCards((prev) => {
            const newCards = [...prev];
            newCards[index] = { ...newCards[index], isMatched: true };
            if (matchingIndex !== -1) {
              newCards[matchingIndex] = { ...newCards[matchingIndex], isMatched: true };
            }
            return newCards;
          });
          setMatchedPairs((p) => p + 1);
          setScore((s) => s + POINTS.findPair + POINTS.perfectMatch);
          setStreak((s) => s + 1);
          setPerfectMatches((prev) => new Set(prev).add(index));
          setMoves((m) => m + 1);
          setFlippedIndices([]);
        }, 500);
        return;
      }

      // Normal flip
      setCards((prev) => {
        const newCards = [...prev];
        newCards[index] = { ...newCards[index], isFlipped: true };
        return newCards;
      });
      setLastFlippedIndex(index);

      const newFlippedIndices = [...flippedIndices, index];
      setFlippedIndices(newFlippedIndices);

      // If two cards are flipped, check for match
      if (newFlippedIndices.length === 2) {
        setMoves((m) => m + 1);
        setIsProcessing(true);

        const [first, second] = newFlippedIndices;
        const card1 = cards[first];
        const card2 = { ...cards[second], isFlipped: true }; // Use updated state

        if (card1.foodId === card2.foodId) {
          // Match found!
          const isFirstTry = !perfectMatches.has(first) && !perfectMatches.has(second);

          setTimeout(() => {
            setCards((prev) => {
              const newCards = [...prev];
              newCards[first] = { ...newCards[first], isMatched: true };
              newCards[second] = { ...newCards[second], isMatched: true };
              return newCards;
            });
            setMatchedPairs((p) => p + 1);

            // Calculate score
            let points = POINTS.findPair;
            if (isFirstTry) {
              points += POINTS.perfectMatch;
            }

            // Streak bonus
            const newStreak = streak + 1;
            if (newStreak >= 3) {
              points += POINTS.streakBonus;
            }

            setScore((s) => s + points);
            setStreak(newStreak);
            setFlippedIndices([]);
            setIsProcessing(false);
          }, 500);
        } else {
          // No match - flip back after delay
          setStreak(0);
          setTimeout(() => {
            setCards((prev) => {
              const newCards = [...prev];
              newCards[first] = { ...newCards[first], isFlipped: false };
              newCards[second] = { ...newCards[second], isFlipped: false };
              return newCards;
            });
            setFlippedIndices([]);
            setIsProcessing(false);
          }, MISMATCH_DELAY_MS);
        }
      }
    },
    [
      cards,
      flippedIndices,
      gameStarted,
      gameEnded,
      isProcessing,
      streak,
      perfectMatches,
      abilities.peekAtStart,
      abilities.luckyFirstFlip,
      luckyFirstUsed,
    ]
  );

  // Chomper undo ability
  const handleUndo = useCallback(() => {
    if (reflipUsed || !abilities.freeReflip || lastFlippedIndex === null) return;
    if (cards[lastFlippedIndex].isMatched) return;

    setReflipUsed(true);
    setCards((prev) => {
      const newCards = [...prev];
      newCards[lastFlippedIndex] = { ...newCards[lastFlippedIndex], isFlipped: false };
      return newCards;
    });
    setFlippedIndices((prev) => prev.filter((i) => i !== lastFlippedIndex));
  }, [reflipUsed, abilities.freeReflip, lastFlippedIndex, cards]);

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
      <div className="h-full bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-4">🧠 Memory Match</h2>
        <p className="text-white/80 text-center mb-2">
          Find all matching pairs of food!
        </p>
        <p className="text-white/60 text-center text-sm mb-6">
          {config.pairs} pairs • {formatTime(config.timeMs + abilities.extraTimeMs)} time limit
        </p>

        {/* Pet ability preview */}
        {abilities.peekAtStart && (
          <p className="text-purple-200 text-sm mb-2">👻 Whisp: Preview all cards for 3 seconds!</p>
        )}
        {abilities.luckyFirstFlip && (
          <p className="text-yellow-200 text-sm mb-2">✨ Luxe: First flip is a guaranteed match!</p>
        )}
        {abilities.extraTimeMs > 0 && (
          <p className="text-blue-200 text-sm mb-2">⏰ Grib: +15 seconds bonus time!</p>
        )}
        {abilities.timerSpeedMultiplier < 1 && (
          <p className="text-green-200 text-sm mb-2">🐢 Plompo: Timer runs 25% slower!</p>
        )}
        {abilities.hintAfterMoves !== null && (
          <p className="text-pink-200 text-sm mb-2">💡 Munchlet: Hint after 8 moves!</p>
        )}
        {abilities.freeReflip && (
          <p className="text-orange-200 text-sm mb-2">↩️ Chomper: One free undo!</p>
        )}
        {abilities.flashMatchesAtStart && (
          <p className="text-red-200 text-sm mb-2">🔥 Ember: Matches flash at start!</p>
        )}

        <button
          onClick={() => {
            setGameStarted(true);
            if (abilities.peekAtStart) {
              setIsPeeking(true);
              setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
              setTimeout(() => {
                setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
                setIsPeeking(false);
              }, PEEK_DURATION_MS);
            }
          }}
          className="bg-white rounded-xl px-8 py-4 text-purple-600 font-bold text-xl hover:bg-purple-50 transition active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  // Main game UI
  return (
    <div className="h-full bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col select-none">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20">
        <div className="text-white font-bold">
          Score: <span className="text-yellow-300">{score}</span>
        </div>
        <div className="text-white/80 text-sm">
          Moves: {moves} | Pairs: {matchedPairs}/{config.pairs}
        </div>
        <div
          className={`text-white font-bold ${
            timeRemaining <= 15000 ? 'text-red-300 animate-pulse' : ''
          }`}
        >
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Streak indicator */}
      {streak >= 3 && (
        <div className="text-center text-orange-400 font-bold text-sm animate-bounce">
          🔥 Streak x{streak}!
        </div>
      )}

      {/* Peeking indicator */}
      {isPeeking && (
        <div className="text-center text-purple-200 font-bold py-2 bg-purple-700/50">
          👻 Memorize the cards!
        </div>
      )}

      {/* Chomper undo button */}
      {abilities.freeReflip && !reflipUsed && flippedIndices.length === 1 && (
        <div className="text-center py-2">
          <button
            onClick={handleUndo}
            className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-600 transition"
          >
            ↩️ Undo Flip
          </button>
        </div>
      )}

      {/* Card Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {cards.map((card, index) => {
            const isHinted = hintPair !== null && card.foodId === hintPair && !card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.isMatched || isProcessing || gameEnded}
                className={`
                  aspect-square w-16 h-16 sm:w-20 sm:h-20 rounded-xl font-bold text-2xl sm:text-3xl
                  transition-all duration-200 transform
                  ${card.isMatched
                    ? 'bg-green-500/50 scale-90 opacity-50'
                    : card.isFlipped
                    ? 'bg-white'
                    : isHinted
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-white/20 hover:bg-white/30'
                  }
                  ${!card.isFlipped && !card.isMatched ? 'cursor-pointer active:scale-95' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game over overlay */}
      {gameEnded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">
              {matchedPairs === config.pairs ? '🎉 You Win!' : '⏰ Time\'s Up!'}
            </h3>
            <p className="text-gray-600">
              Final Score: {calculateFinalScore()}
            </p>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div className="p-2 text-center text-white/50 text-xs bg-black/10">
        Tap cards to flip • Find all pairs to win
      </div>
    </div>
  );
}

export default MemoryMatch;
