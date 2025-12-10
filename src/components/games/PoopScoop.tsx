// ============================================
// GRUNDY — POOP SCOOP MINI-GAME
// Bible §8, Design: GRUNDY_POOP_SCOOP_DESIGN.md
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../game/store';

// ============================================
// CONSTANTS (From Design Doc)
// ============================================

const GAME_DURATION_MS = 60_000; // 60 seconds
const TICK_RATE_MS = 16; // ~60fps
const MAX_STINK = 100;

// Poop types with their properties
const POOP_CONFIG = {
  normal: { emoji: '💩', points: 10, stinkRate: 2, weight: 70 },
  fresh: { emoji: '🟤', points: 5, stinkRate: 1, weight: 15 },
  stinky: { emoji: '💩💨', points: 20, stinkRate: 5, weight: 10 },
  golden: { emoji: '🌟', points: 50, stinkRate: 0, weight: 3 },
  rainbow: { emoji: '🌈', points: 30, stinkRate: 0, weight: 2 },
};

// Scoring constants
const QUICK_CLEAN_BONUS = 5; // Cleaned within 1 second
const QUICK_CLEAN_THRESHOLD_MS = 1000;
const STREAK_THRESHOLD = 3; // 3+ within 2 seconds for streak
const STREAK_WINDOW_MS = 2000;
const STREAK_BONUS_PER_POOP = 2;
const MAX_STREAK_BONUS = 10;
const SURVIVAL_BONUS_PER_SECOND = 3;

// Spawn rates based on time (spawn interval in ms)
const SPAWN_INTERVALS = [
  { time: 0, interval: 2000 },      // 0-20s: 1 per 2 sec
  { time: 20000, interval: 1500 },  // 20-40s: 1 per 1.5 sec
  { time: 40000, interval: 1000 },  // 40-60s: 1 per 1 sec
];

// Powerup types and durations
const POWERUP_DURATIONS = {
  magnet: 3000,
  freeze: 3000,
  airfresh: 0, // instant
  speedscoop: 4000,
};

// Tap radius for cleaning (normalized coordinates)
const BASE_TAP_RADIUS = 0.08;
const PLOMPO_TAP_SIZE = 0.12; // 2x2 area effect

// ============================================
// TYPES
// ============================================

type PoopType = 'normal' | 'fresh' | 'stinky' | 'golden' | 'rainbow';
type PowerupType = 'magnet' | 'freeze' | 'airfresh' | 'speedscoop' | null;

interface PoopItem {
  id: number;
  type: PoopType;
  x: number; // 0.0 to 1.0
  y: number; // 0.0 to 1.0
  age: number; // ms since spawn
  cleaned: boolean;
}

interface GameState {
  score: number;
  stinkMeter: number;
  poopsCleaned: number;
  streak: number;
  lastCleanTimes: number[];
}

interface PetAbilities {
  tapRadiusMultiplier: number;    // Munchlet: 1.3 (30% larger)
  stinkRateMultiplier: number;    // Grib: 0.75 (25% slower)
  areaClean: boolean;             // Plompo: 2x2 area
  stinkyMultiplier: number;       // Ember: 3x points for stinky
  pointsMultiplier: number;       // Chomper: 2x points (eww)
  autoScoopsCount: number;        // Whisp: 3 auto-cleans
  divaRageThreshold: number;      // Luxe: clear all every 15
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPetAbilities(petId: string): PetAbilities {
  const abilities: PetAbilities = {
    tapRadiusMultiplier: 1,
    stinkRateMultiplier: 1,
    areaClean: false,
    stinkyMultiplier: 1,
    pointsMultiplier: 1,
    autoScoopsCount: 0,
    divaRageThreshold: 0,
  };

  switch (petId) {
    case 'munchlet':
      abilities.tapRadiusMultiplier = 1.3; // 30% larger tap radius
      break;
    case 'grib':
      abilities.stinkRateMultiplier = 0.75; // 25% slower stink
      break;
    case 'plompo':
      abilities.areaClean = true; // 2x2 area clean
      break;
    // Fizz's +25% final score is handled in miniGameRewards.ts
    case 'ember':
      abilities.stinkyMultiplier = 3; // 3x points for stinky
      break;
    case 'chomper':
      abilities.pointsMultiplier = 2; // 2x points for all
      break;
    case 'whisp':
      abilities.autoScoopsCount = 3; // 3 auto-cleans
      break;
    case 'luxe':
      abilities.divaRageThreshold = 15; // Clear all every 15 cleaned
      break;
  }

  return abilities;
}

function getSpawnInterval(elapsedMs: number): number {
  for (let i = SPAWN_INTERVALS.length - 1; i >= 0; i--) {
    if (elapsedMs >= SPAWN_INTERVALS[i].time) {
      return SPAWN_INTERVALS[i].interval;
    }
  }
  return SPAWN_INTERVALS[0].interval;
}

function getAvailablePoopTypes(elapsedMs: number): PoopType[] {
  const types: PoopType[] = ['normal', 'fresh'];
  if (elapsedMs > 20000) types.push('stinky');
  if (elapsedMs > 40000) {
    types.push('golden');
    types.push('rainbow');
  }
  return types;
}

function weightedRandomType(elapsedMs: number): PoopType {
  const availableTypes = getAvailablePoopTypes(elapsedMs);
  const weights: Record<PoopType, number> = {
    normal: 70,
    fresh: 15,
    stinky: elapsedMs > 20000 ? 10 : 0,
    golden: elapsedMs > 40000 ? 3 : 0,
    rainbow: elapsedMs > 40000 ? 2 : 0,
  };

  const totalWeight = availableTypes.reduce((sum, type) => sum + weights[type], 0);
  let random = Math.random() * totalWeight;

  for (const type of availableTypes) {
    random -= weights[type];
    if (random <= 0) return type;
  }

  return 'normal';
}

function getRandomPowerup(): PowerupType {
  const powerups: PowerupType[] = ['magnet', 'freeze', 'airfresh', 'speedscoop'];
  return powerups[Math.floor(Math.random() * powerups.length)];
}

// ============================================
// COMPONENT
// ============================================

export interface PoopScoopProps {
  onGameEnd: (score: number) => void;
}

export function PoopScoop({ onGameEnd }: PoopScoopProps) {
  const petId = useGameStore((state) => state.pet.id);
  const abilities = getPetAbilities(petId);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_MS);
  const [poops, setPoops] = useState<PoopItem[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    stinkMeter: 0,
    poopsCleaned: 0,
    streak: 0,
    lastCleanTimes: [],
  });

  // Powerup state
  const [activePowerup, setActivePowerup] = useState<PowerupType>(null);
  const [powerupEndTime, setPowerupEndTime] = useState(0);

  // Pet ability state
  const [autoScoopsLeft, setAutoScoopsLeft] = useState(abilities.autoScoopsCount);
  const [divaRageCounter, setDivaRageCounter] = useState(0);

  // Visual feedback
  const [lastCleanEffect, setLastCleanEffect] = useState<{ x: number; y: number; points: number } | null>(null);
  const [showPowerupEffect, setShowPowerupEffect] = useState<string | null>(null);

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const poopIdRef = useRef<number>(0);
  const gameEndedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Computed values
  const tapRadius = abilities.areaClean ? PLOMPO_TAP_SIZE : BASE_TAP_RADIUS * abilities.tapRadiusMultiplier;
  const elapsedMs = GAME_DURATION_MS - timeRemaining;

  // Spawn a new poop
  const spawnPoop = useCallback((currentElapsed: number) => {
    const type = weightedRandomType(currentElapsed);
    const newPoop: PoopItem = {
      id: poopIdRef.current++,
      type,
      x: Math.random() * 0.8 + 0.1, // Avoid edges
      y: Math.random() * 0.6 + 0.15,
      age: 0,
      cleaned: false,
    };
    return newPoop;
  }, []);

  // Clean a poop
  const cleanPoop = useCallback((poopId: number) => {
    const now = Date.now();

    setPoops((prev) => {
      const poop = prev.find((p) => p.id === poopId && !p.cleaned);
      if (!poop) return prev;

      // Calculate points
      const config = POOP_CONFIG[poop.type];
      let points = config.points;

      // Apply pet ability multipliers
      if (poop.type === 'stinky' && abilities.stinkyMultiplier > 1) {
        points *= abilities.stinkyMultiplier;
      }
      points *= abilities.pointsMultiplier;

      // Quick clean bonus
      if (poop.age < QUICK_CLEAN_THRESHOLD_MS) {
        points += QUICK_CLEAN_BONUS;
      }

      // Update game state
      setGameState((gs) => {
        const newCleanTimes = [...gs.lastCleanTimes, now].filter(
          (t) => now - t < STREAK_WINDOW_MS
        );
        const newStreak = newCleanTimes.length >= STREAK_THRESHOLD
          ? Math.min(newCleanTimes.length, 5)
          : 0;

        // Streak bonus
        if (newStreak >= STREAK_THRESHOLD) {
          points += Math.min(STREAK_BONUS_PER_POOP * newStreak, MAX_STREAK_BONUS);
        }

        const newPoopsCleaned = gs.poopsCleaned + 1;

        return {
          ...gs,
          score: gs.score + Math.floor(points),
          poopsCleaned: newPoopsCleaned,
          streak: newStreak,
          lastCleanTimes: newCleanTimes,
        };
      });

      // Visual feedback
      setLastCleanEffect({ x: poop.x, y: poop.y, points: Math.floor(points) });
      setTimeout(() => setLastCleanEffect(null), 500);

      // Check for rainbow powerup
      if (poop.type === 'rainbow') {
        const powerup = getRandomPowerup();
        activatePowerup(powerup);
      }

      // Update diva rage counter (Luxe)
      if (abilities.divaRageThreshold > 0) {
        setDivaRageCounter((prev) => {
          const newCount = prev + 1;
          if (newCount >= abilities.divaRageThreshold) {
            // Clear all poops!
            setTimeout(() => {
              setPoops((p) => {
                let clearedPoints = 0;
                p.forEach((poop) => {
                  if (!poop.cleaned) {
                    clearedPoints += POOP_CONFIG[poop.type].points * abilities.pointsMultiplier;
                  }
                });
                setGameState((gs) => ({
                  ...gs,
                  score: gs.score + Math.floor(clearedPoints),
                  poopsCleaned: gs.poopsCleaned + p.filter((x) => !x.cleaned).length,
                }));
                return [];
              });
              setShowPowerupEffect('✨ DIVA RAGE! ✨');
              setTimeout(() => setShowPowerupEffect(null), 1000);
            }, 50);
            return 0;
          }
          return newCount;
        });
      }

      return prev.map((p) => (p.id === poopId ? { ...p, cleaned: true } : p));
    });
  }, [abilities]);

  // Activate a powerup
  const activatePowerup = useCallback((powerup: PowerupType) => {
    if (!powerup) return;

    if (powerup === 'airfresh') {
      // Instant stink reduction
      setGameState((gs) => ({
        ...gs,
        stinkMeter: Math.max(0, gs.stinkMeter - 30),
      }));
      setShowPowerupEffect('💨 Fresh Air! -30% Stink');
      setTimeout(() => setShowPowerupEffect(null), 1000);
    } else {
      setActivePowerup(powerup);
      setPowerupEndTime(Date.now() + POWERUP_DURATIONS[powerup]);
      const powerupNames = {
        magnet: '🧲 Magnet!',
        freeze: '❄️ Freeze!',
        speedscoop: '⚡ Speed Scoop!',
      };
      setShowPowerupEffect(powerupNames[powerup] || '');
      setTimeout(() => setShowPowerupEffect(null), 1000);
    }
  }, []);

  // Handle tap on game area
  const handleTap = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!gameStarted || gameEnded || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const tapX = (e.clientX - rect.left) / rect.width;
      const tapY = (e.clientY - rect.top) / rect.height;

      // Speed scoop powerup: clear larger area
      const effectiveRadius = activePowerup === 'speedscoop' ? tapRadius * 2 : tapRadius;

      // Find and clean poops within radius
      poops.forEach((poop) => {
        if (poop.cleaned) return;

        const distance = Math.sqrt(
          Math.pow(tapX - poop.x, 2) + Math.pow(tapY - poop.y, 2)
        );

        if (distance <= effectiveRadius) {
          cleanPoop(poop.id);
        }
      });
    },
    [gameStarted, gameEnded, poops, tapRadius, activePowerup, cleanPoop]
  );

  // Auto-scoop for Whisp
  const triggerAutoScoop = useCallback(() => {
    if (autoScoopsLeft <= 0) return;

    // Find oldest uncleaned poop
    const uncleaned = poops.filter((p) => !p.cleaned).sort((a, b) => b.age - a.age);
    if (uncleaned.length > 0) {
      cleanPoop(uncleaned[0].id);
      setAutoScoopsLeft((prev) => prev - 1);
      setShowPowerupEffect('👻 Auto-Scoop!');
      setTimeout(() => setShowPowerupEffect(null), 500);
    }
  }, [autoScoopsLeft, poops, cleanPoop]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

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

      const currentElapsed = GAME_DURATION_MS - timeRemaining + delta;

      // Update poop ages
      setPoops((prev) => prev.map((p) => (p.cleaned ? p : { ...p, age: p.age + delta })));

      // Check for magnet powerup
      if (activePowerup === 'magnet' && Date.now() < powerupEndTime) {
        setPoops((prev) => {
          prev.forEach((poop) => {
            if (!poop.cleaned) {
              const distance = Math.sqrt(Math.pow(0.5 - poop.x, 2) + Math.pow(0.5 - poop.y, 2));
              if (distance < 0.3) {
                cleanPoop(poop.id);
              }
            }
          });
          return prev;
        });
      }

      // Clear powerup if expired
      if (activePowerup && Date.now() >= powerupEndTime) {
        setActivePowerup(null);
      }

      // Spawn new poops (unless freeze is active)
      const spawnInterval = getSpawnInterval(currentElapsed);
      if (activePowerup !== 'freeze' && timestamp - lastSpawnRef.current >= spawnInterval) {
        lastSpawnRef.current = timestamp;
        const newPoop = spawnPoop(currentElapsed);
        setPoops((prev) => [...prev.filter((p) => !p.cleaned), newPoop]);
      }

      // Clean up old cleaned poops
      setPoops((prev) => prev.filter((p) => !p.cleaned || p.age < 500));

      // Update stink meter
      setGameState((gs) => {
        const activePoops = poops.filter((p) => !p.cleaned);
        let stinkDelta = 0;

        activePoops.forEach((poop) => {
          const config = POOP_CONFIG[poop.type];
          const ageMultiplier = 1 + poop.age / 5000; // Older = worse
          stinkDelta += config.stinkRate * ageMultiplier * (delta / 1000) * abilities.stinkRateMultiplier;
        });

        // Decrease stink if no poops
        if (activePoops.length === 0) {
          stinkDelta = -2 * (delta / 1000);
        }

        const newStink = Math.max(0, Math.min(MAX_STINK, gs.stinkMeter + stinkDelta));
        return { ...gs, stinkMeter: newStink };
      });

      // Check for game over conditions
      if (gameState.stinkMeter >= MAX_STINK && !gameEndedRef.current) {
        gameEndedRef.current = true;
        setGameEnded(true);
        setGameWon(false);
        const finalScore = gameState.score;
        onGameEnd(finalScore);
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
  }, [gameStarted, gameEnded, timeRemaining, poops, gameState, abilities, activePowerup, powerupEndTime, spawnPoop, cleanPoop, onGameEnd]);

  // End game when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && gameStarted && !gameEndedRef.current) {
      gameEndedRef.current = true;
      setGameEnded(true);
      setGameWon(true);

      // Add survival bonus
      const survivalBonus = Math.floor((GAME_DURATION_MS / 1000) * SURVIVAL_BONUS_PER_SECOND);
      const finalScore = gameState.score + survivalBonus;

      setGameState((gs) => ({ ...gs, score: finalScore }));
      onGameEnd(finalScore);
    }
  }, [timeRemaining, gameStarted, gameState.score, onGameEnd]);

  // Handle start
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

  // Stink meter color
  const getStinkColor = () => {
    if (gameState.stinkMeter >= 80) return 'bg-red-500';
    if (gameState.stinkMeter >= 50) return 'bg-orange-500';
    if (gameState.stinkMeter >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-600 to-yellow-700 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-white mb-4">🧹 Poop Scoop</h2>
        <p className="text-white/80 text-center mb-2">
          Tap poop to clean it before the stink fills up!
        </p>
        <p className="text-white/60 text-center text-sm mb-4">
          60 seconds • Keep it clean!
        </p>

        {/* Pet ability preview */}
        {abilities.tapRadiusMultiplier > 1 && (
          <p className="text-yellow-200 text-sm mb-2">🐾 Munchlet: 30% larger tap radius!</p>
        )}
        {abilities.stinkRateMultiplier < 1 && (
          <p className="text-blue-200 text-sm mb-2">😌 Grib: Stink fills 25% slower!</p>
        )}
        {abilities.areaClean && (
          <p className="text-green-200 text-sm mb-2">🦶 Plompo: Each tap cleans 2×2 area!</p>
        )}
        {abilities.stinkyMultiplier > 1 && (
          <p className="text-orange-200 text-sm mb-2">🔥 Ember: Stinky poop worth 3×!</p>
        )}
        {abilities.pointsMultiplier > 1 && (
          <p className="text-red-200 text-sm mb-2">😋 Chomper: All poop worth 2×!</p>
        )}
        {abilities.autoScoopsCount > 0 && (
          <p className="text-purple-200 text-sm mb-2">👻 Whisp: {abilities.autoScoopsCount} auto-scoops!</p>
        )}
        {abilities.divaRageThreshold > 0 && (
          <p className="text-pink-200 text-sm mb-2">✨ Luxe: Clear all every {abilities.divaRageThreshold} cleaned!</p>
        )}

        <button
          onClick={handleStart}
          className="bg-white rounded-xl px-8 py-4 text-amber-600 font-bold text-xl hover:bg-amber-50 transition active:scale-95"
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col select-none touch-none overflow-hidden transition-colors ${
        gameState.stinkMeter >= 80
          ? 'bg-gradient-to-b from-green-800 to-green-900'
          : gameState.stinkMeter >= 50
          ? 'bg-gradient-to-b from-amber-700 to-yellow-800'
          : 'bg-gradient-to-b from-amber-600 to-yellow-700'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20">
        <div className="text-white font-bold">
          Score: <span className="text-yellow-300">{gameState.score}</span>
        </div>
        <div className={`text-white font-bold ${timeRemaining <= 10000 ? 'text-red-300 animate-pulse' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Stink Meter */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">STINK:</span>
          <div className="flex-1 h-4 bg-black/30 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${getStinkColor()} ${
                gameState.stinkMeter >= 80 ? 'animate-pulse' : ''
              }`}
              style={{ width: `${gameState.stinkMeter}%` }}
            />
          </div>
          <span className="text-white text-sm">{Math.round(gameState.stinkMeter)}%</span>
        </div>
      </div>

      {/* Streak indicator */}
      {gameState.streak >= STREAK_THRESHOLD && (
        <div className="text-center text-orange-400 font-bold text-sm animate-bounce">
          🔥 Streak x{gameState.streak}!
        </div>
      )}

      {/* Powerup indicator */}
      {activePowerup && Date.now() < powerupEndTime && (
        <div className="text-center text-white font-bold bg-purple-500/80 py-1 mx-4 rounded-full text-sm">
          {activePowerup === 'magnet' && '🧲 Magnet Active!'}
          {activePowerup === 'freeze' && '❄️ Freeze Active!'}
          {activePowerup === 'speedscoop' && '⚡ Speed Scoop Active!'}
        </div>
      )}

      {/* Powerup effect */}
      {showPowerupEffect && (
        <div className="text-center text-yellow-300 font-bold text-lg animate-bounce py-2">
          {showPowerupEffect}
        </div>
      )}

      {/* Whisp auto-scoop button */}
      {abilities.autoScoopsCount > 0 && autoScoopsLeft > 0 && (
        <div className="text-center py-1">
          <button
            onClick={triggerAutoScoop}
            className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm hover:bg-purple-600 transition"
          >
            👻 Auto-Scoop ({autoScoopsLeft} left)
          </button>
        </div>
      )}

      {/* Luxe diva rage counter */}
      {abilities.divaRageThreshold > 0 && (
        <div className="text-center text-pink-200 text-xs">
          ✨ Diva Rage: {divaRageCounter}/{abilities.divaRageThreshold}
        </div>
      )}

      {/* Game area */}
      <div
        ref={containerRef}
        className="flex-1 relative"
        onPointerDown={handleTap}
      >
        {/* Poops */}
        {poops.map((poop) => {
          if (poop.cleaned) return null;

          const config = POOP_CONFIG[poop.type];
          const ageScale = 1 + Math.min(poop.age / 5000, 0.5); // Grow with age

          return (
            <div
              key={poop.id}
              className="absolute transition-transform pointer-events-none"
              style={{
                left: `${poop.x * 100}%`,
                top: `${poop.y * 100}%`,
                transform: `translate(-50%, -50%) scale(${ageScale})`,
              }}
            >
              <span className="text-3xl">{config.emoji}</span>
              {/* Stink lines for old poop */}
              {poop.age > 3000 && poop.type !== 'golden' && poop.type !== 'rainbow' && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs opacity-75">
                  💨
                </span>
              )}
            </div>
          );
        })}

        {/* Clean effect */}
        {lastCleanEffect && (
          <div
            className="absolute text-xl font-bold text-green-400 pointer-events-none animate-ping"
            style={{
              left: `${lastCleanEffect.x * 100}%`,
              top: `${lastCleanEffect.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            +{lastCleanEffect.points}
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="p-2 text-center text-white/50 text-xs bg-black/10">
        Cleaned: {gameState.poopsCleaned} • Tap poop to clean!
      </div>

      {/* Game over overlay */}
      {gameEnded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">
              {gameWon ? '✨ Fresh & Clean!' : '💩 Too Stinky!'}
            </h3>
            <p className="text-gray-600 mb-2">
              Final Score: {gameState.score}
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Poops Cleaned: {gameState.poopsCleaned}</p>
              {gameWon && <p>Survival Bonus: +{Math.floor((GAME_DURATION_MS / 1000) * SURVIVAL_BONUS_PER_SECOND)}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoopScoop;
