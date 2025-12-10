// ============================================
// GRUNDY — SNACK CATCH MINI-GAME
// Bible §8.4, Design: GRUNDY_SNACK_CATCH_DESIGN.md
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../game/store';
import { FOODS, getAffinityForPet } from '../../data/foods';
import type { Affinity } from '../../types';

// ============================================
// CONSTANTS
// ============================================

const GAME_DURATION_MS = 60_000;
const BASKET_WIDTH_RATIO = 0.2; // 20% of screen width
const CATCH_ZONE_Y = 0.85;
const TICK_RATE_MS = 16; // ~60fps

// Difficulty phases
const DIFFICULTY_PHASES = [
  { time: 0, spawnRate: 1000, baseSpeed: 0.005, badChance: 0.05 },
  { time: 20000, spawnRate: 666, baseSpeed: 0.007, badChance: 0.15 },
  { time: 40000, spawnRate: 500, baseSpeed: 0.01, badChance: 0.25 },
];

// Scoring
const AFFINITY_SCORES: Record<Affinity, number> = {
  loved: 30,
  liked: 20,
  neutral: 10,
  disliked: -15,
};

const BAD_ITEM_SCORES: Record<string, number> = {
  bomb: -25,
  trash: -20,
  rock: -15,
};

const SPECIAL_ITEMS = {
  star: { score: 50, emoji: '⭐' },
  rainbow: { score: 0, emoji: '🌈', duration: 5000 },
  magnet: { score: 0, emoji: '🧲', duration: 3000 },
};

const BAD_ITEMS = [
  { id: 'bomb', emoji: '💣', spawnWeight: 10 },
  { id: 'trash', emoji: '🗑️', spawnWeight: 8 },
  { id: 'rock', emoji: '🪨', spawnWeight: 7 },
];

// Food pool for spawning (common to rare only, not epic/legendary)
const SPAWNABLE_FOODS = Object.values(FOODS).filter(
  (f) => f.rarity === 'common' || f.rarity === 'uncommon' || f.rarity === 'rare'
);

// ============================================
// TYPES
// ============================================

interface FallingItem {
  id: number;
  type: 'food' | 'bad' | 'special';
  itemId: string;
  emoji: string;
  x: number;
  y: number;
  speed: number;
}

interface PowerupState {
  type: 'rainbow' | 'magnet' | null;
  endTime: number;
}

interface PetAbilities {
  basketWidthMultiplier: number;
  badItemSpeedMultiplier: number;
  allItemSpeedMultiplier: number;
  spicyMultiplier: number;
  badItemPenalty: number | null; // null = use default
  ghostDodgeAvailable: boolean;
  specialItemChanceMultiplier: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPetAbilities(petId: string): PetAbilities {
  const abilities: PetAbilities = {
    basketWidthMultiplier: 1,
    badItemSpeedMultiplier: 1,
    allItemSpeedMultiplier: 1,
    spicyMultiplier: 1,
    badItemPenalty: null,
    ghostDodgeAvailable: false,
    specialItemChanceMultiplier: 1,
  };

  switch (petId) {
    case 'munchlet':
      abilities.basketWidthMultiplier = 1.2; // 20% wider
      break;
    case 'grib':
      abilities.badItemSpeedMultiplier = 0.7; // 30% slower bad items
      break;
    case 'plompo':
      abilities.allItemSpeedMultiplier = 0.8; // 20% slower all items
      break;
    // Fizz's +25% final score is handled in miniGameRewards.ts
    case 'ember':
      abilities.spicyMultiplier = 3; // 3x spicy food points
      break;
    case 'chomper':
      abilities.badItemPenalty = -5; // Only -5 for bad items
      break;
    case 'whisp':
      abilities.ghostDodgeAvailable = true;
      break;
    case 'luxe':
      abilities.specialItemChanceMultiplier = 2; // 2x special item chance
      break;
  }

  return abilities;
}

function isSpicyFood(foodId: string): boolean {
  return foodId === 'spicy_taco' || foodId === 'hot_pepper';
}

function getDifficultyPhase(elapsedMs: number) {
  for (let i = DIFFICULTY_PHASES.length - 1; i >= 0; i--) {
    if (elapsedMs >= DIFFICULTY_PHASES[i].time) {
      return DIFFICULTY_PHASES[i];
    }
  }
  return DIFFICULTY_PHASES[0];
}

// ============================================
// COMPONENT
// ============================================

interface SnackCatchProps {
  onGameEnd: (score: number) => void;
}

export function SnackCatch({ onGameEnd }: SnackCatchProps) {
  const petId = useGameStore((state) => state.pet.id);
  const abilities = getPetAbilities(petId);

  // Game state
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_MS);
  const [basketX, setBasketX] = useState(0.5);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [powerup, setPowerup] = useState<PowerupState>({ type: null, endTime: 0 });
  const [ghostDodgeUsed, setGhostDodgeUsed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastCatchEffect, setLastCatchEffect] = useState<{ text: string; color: string } | null>(null);

  // Refs for game loop
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const basketWidth = BASKET_WIDTH_RATIO * abilities.basketWidthMultiplier;

  // Spawn a new item
  const spawnItem = useCallback(
    (elapsedMs: number): FallingItem => {
      const phase = getDifficultyPhase(elapsedMs);
      const specialChance = 0.07 * abilities.specialItemChanceMultiplier;
      const badChance = phase.badChance;

      const roll = Math.random();
      let item: FallingItem;

      if (roll < specialChance) {
        // Special item
        const specials = Object.entries(SPECIAL_ITEMS);
        const [id, data] = specials[Math.floor(Math.random() * specials.length)];
        item = {
          id: itemIdRef.current++,
          type: 'special',
          itemId: id,
          emoji: data.emoji,
          x: Math.random() * 0.8 + 0.1,
          y: 0,
          speed: phase.baseSpeed * abilities.allItemSpeedMultiplier,
        };
      } else if (roll < specialChance + badChance) {
        // Bad item
        const totalWeight = BAD_ITEMS.reduce((sum, b) => sum + b.spawnWeight, 0);
        let weightRoll = Math.random() * totalWeight;
        let badItem = BAD_ITEMS[0];
        for (const b of BAD_ITEMS) {
          weightRoll -= b.spawnWeight;
          if (weightRoll <= 0) {
            badItem = b;
            break;
          }
        }
        const speedMult = abilities.allItemSpeedMultiplier * abilities.badItemSpeedMultiplier;
        item = {
          id: itemIdRef.current++,
          type: 'bad',
          itemId: badItem.id,
          emoji: badItem.emoji,
          x: Math.random() * 0.8 + 0.1,
          y: 0,
          speed: phase.baseSpeed * speedMult,
        };
      } else {
        // Food item
        const food = SPAWNABLE_FOODS[Math.floor(Math.random() * SPAWNABLE_FOODS.length)];
        item = {
          id: itemIdRef.current++,
          type: 'food',
          itemId: food.id,
          emoji: food.emoji,
          x: Math.random() * 0.8 + 0.1,
          y: 0,
          speed: phase.baseSpeed * abilities.allItemSpeedMultiplier,
        };
      }

      return item;
    },
    [abilities]
  );

  // Handle catching an item
  const handleCatch = useCallback(
    (item: FallingItem) => {
      let points = 0;
      let effectColor = '#fff';
      let effectText = '';

      if (item.type === 'food') {
        const affinity = getAffinityForPet(item.itemId, petId);
        points = AFFINITY_SCORES[affinity];

        // Ember's spicy bonus
        if (isSpicyFood(item.itemId) && abilities.spicyMultiplier > 1) {
          points = Math.abs(points) * abilities.spicyMultiplier * Math.sign(points);
        }

        // Rainbow 2x multiplier
        if (powerup.type === 'rainbow' && Date.now() < powerup.endTime) {
          points *= 2;
        }

        // Combo bonus (only for positive catches)
        if (points > 0) {
          const comboBonus = Math.min(combo * 2, 10);
          points += comboBonus;
          setCombo((c) => c + 1);
        } else {
          setCombo(0);
        }

        effectColor = points > 0 ? '#4ade80' : '#f87171';
        effectText = points > 0 ? `+${points}` : `${points}`;
      } else if (item.type === 'bad') {
        // Ghost dodge for Whisp
        if (abilities.ghostDodgeAvailable && !ghostDodgeUsed) {
          setGhostDodgeUsed(true);
          effectColor = '#a78bfa';
          effectText = 'Dodged!';
          setLastCatchEffect({ text: effectText, color: effectColor });
          setTimeout(() => setLastCatchEffect(null), 500);
          return; // No penalty
        }

        points = abilities.badItemPenalty ?? BAD_ITEM_SCORES[item.itemId] ?? -20;
        setCombo(0);
        effectColor = '#f87171';
        effectText = `${points}`;
      } else if (item.type === 'special') {
        if (item.itemId === 'star') {
          points = SPECIAL_ITEMS.star.score;
          if (powerup.type === 'rainbow' && Date.now() < powerup.endTime) {
            points *= 2;
          }
          const comboBonus = Math.min(combo * 2, 10);
          points += comboBonus;
          setCombo((c) => c + 1);
          effectColor = '#fbbf24';
          effectText = `+${points}`;
        } else if (item.itemId === 'rainbow') {
          setPowerup({ type: 'rainbow', endTime: Date.now() + SPECIAL_ITEMS.rainbow.duration });
          effectColor = '#ec4899';
          effectText = '2x!';
          setCombo((c) => c + 1);
        } else if (item.itemId === 'magnet') {
          setPowerup({ type: 'magnet', endTime: Date.now() + SPECIAL_ITEMS.magnet.duration });
          effectColor = '#60a5fa';
          effectText = 'Magnet!';
          setCombo((c) => c + 1);
        }
      }

      setScore((s) => Math.max(0, s + points));
      setLastCatchEffect({ text: effectText, color: effectColor });
      setTimeout(() => setLastCatchEffect(null), 500);
    },
    [petId, abilities, combo, powerup, ghostDodgeUsed]
  );

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
        lastSpawnRef.current = timestamp;
      }

      const delta = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      // Update time
      setTimeRemaining((t) => {
        const newTime = t - delta;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });

      const elapsedMs = GAME_DURATION_MS - timeRemaining + delta;
      const phase = getDifficultyPhase(elapsedMs);

      // Spawn items
      if (timestamp - lastSpawnRef.current >= phase.spawnRate) {
        lastSpawnRef.current = timestamp;
        const newItem = spawnItem(elapsedMs);
        setFallingItems((items) => [...items, newItem]);
      }

      // Update item positions and check catches
      setFallingItems((items) => {
        const remaining: FallingItem[] = [];
        const now = Date.now();
        const magnetActive = powerup.type === 'magnet' && now < powerup.endTime;

        for (const item of items) {
          let newY = item.y + item.speed;
          let newX = item.x;

          // Magnet effect - pull food/special items toward basket
          if (magnetActive && item.type !== 'bad') {
            const dx = basketX - item.x;
            newX += dx * 0.05;
          }

          // Check if caught
          if (newY >= CATCH_ZONE_Y) {
            const basketLeft = basketX - basketWidth / 2;
            const basketRight = basketX + basketWidth / 2;
            if (newX >= basketLeft && newX <= basketRight) {
              handleCatch(item);
              continue; // Item caught, don't add to remaining
            }
          }

          // Check if missed (fell off bottom)
          if (newY > 1.1) {
            // Missing food resets combo (but no point penalty)
            if (item.type === 'food') {
              setCombo(0);
            }
            continue;
          }

          remaining.push({ ...item, y: newY, x: newX });
        }

        return remaining;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, basketX, basketWidth, handleCatch, spawnItem, powerup, timeRemaining]);

  // End game when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && gameStarted) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      onGameEnd(score);
    }
  }, [timeRemaining, gameStarted, score, onGameEnd]);

  // Handle touch/mouse for basket movement
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setBasketX(Math.max(basketWidth / 2, Math.min(1 - basketWidth / 2, x)));
    },
    [basketWidth]
  );

  // Start game on first interaction
  const handleStart = useCallback(() => {
    setGameStarted(true);
    lastTickRef.current = 0;
    lastSpawnRef.current = 0;
  }, []);

  // Format time display
  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="h-full bg-gradient-to-b from-sky-400 to-sky-600 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-4">🧺 Snack Catch</h2>
        <p className="text-white/80 text-center mb-6">
          Move the basket to catch falling food!
          <br />
          Your pet loves: different foods give different points.
        </p>
        {abilities.ghostDodgeAvailable && (
          <p className="text-purple-200 text-sm mb-4">
            Whisp: One free dodge through bad items!
          </p>
        )}
        <button
          onClick={handleStart}
          className="bg-white rounded-xl px-8 py-4 text-sky-600 font-bold text-xl hover:bg-sky-50 transition active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full bg-gradient-to-b from-sky-400 to-sky-600 flex flex-col select-none touch-none overflow-hidden"
      onPointerMove={handlePointerMove}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20">
        <div className="text-white font-bold">
          Score: <span className="text-yellow-300">{score}</span>
        </div>
        <div className={`text-white font-bold ${timeRemaining <= 10000 ? 'text-red-300 animate-pulse' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Combo indicator */}
      {combo >= 2 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-orange-400 font-bold text-lg animate-bounce">
          Combo x{combo} 🔥
        </div>
      )}

      {/* Powerup indicator */}
      {powerup.type && Date.now() < powerup.endTime && (
        <div className="absolute top-16 right-4 text-white font-bold bg-purple-500/80 px-3 py-1 rounded-full">
          {powerup.type === 'rainbow' ? '🌈 2x' : '🧲'}
        </div>
      )}

      {/* Ghost dodge indicator */}
      {abilities.ghostDodgeAvailable && !ghostDodgeUsed && (
        <div className="absolute top-16 left-4 text-purple-200 text-sm">
          👻 Dodge ready
        </div>
      )}

      {/* Game area */}
      <div className="flex-1 relative">
        {/* Falling items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            className="absolute text-3xl transition-none pointer-events-none"
            style={{
              left: `${item.x * 100}%`,
              top: `${item.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute text-5xl pointer-events-none"
          style={{
            left: `${basketX * 100}%`,
            top: `${CATCH_ZONE_Y * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          🧺
        </div>

        {/* Basket hitbox indicator (debug, hidden in prod) */}
        {/* <div
          className="absolute border-2 border-white/30 pointer-events-none"
          style={{
            left: `${(basketX - basketWidth / 2) * 100}%`,
            top: `${(CATCH_ZONE_Y - 0.05) * 100}%`,
            width: `${basketWidth * 100}%`,
            height: '10%',
          }}
        /> */}

        {/* Catch effect */}
        {lastCatchEffect && (
          <div
            className="absolute text-2xl font-bold pointer-events-none animate-ping"
            style={{
              left: `${basketX * 100}%`,
              top: `${(CATCH_ZONE_Y - 0.1) * 100}%`,
              transform: 'translate(-50%, -50%)',
              color: lastCatchEffect.color,
            }}
          >
            {lastCatchEffect.text}
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="p-2 text-center text-white/50 text-xs bg-black/10">
        Move finger to control basket
      </div>
    </div>
  );
}

export default SnackCatch;
