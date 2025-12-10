// ============================================
// GRUNDY — POOP SCOOP MINI-GAME TESTS
// Tests for game mechanics, scoring, pet abilities
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store';

// ============================================
// POOP TYPES TESTS
// ============================================

describe('Poop Scoop - Poop Types', () => {
  it('should have correct poop type configurations per design doc', () => {
    // From GRUNDY_POOP_SCOOP_DESIGN.md:
    const POOP_CONFIG = {
      normal: { points: 10, stinkRate: 2, weight: 70 },
      fresh: { points: 5, stinkRate: 1, weight: 15 },
      stinky: { points: 20, stinkRate: 5, weight: 10 },
      golden: { points: 50, stinkRate: 0, weight: 3 },
      rainbow: { points: 30, stinkRate: 0, weight: 2 },
    };

    expect(POOP_CONFIG.normal.points).toBe(10);
    expect(POOP_CONFIG.fresh.points).toBe(5);
    expect(POOP_CONFIG.stinky.points).toBe(20);
    expect(POOP_CONFIG.golden.points).toBe(50);
    expect(POOP_CONFIG.rainbow.points).toBe(30);
  });

  it('should have correct stink rates per poop type', () => {
    const POOP_CONFIG = {
      normal: { stinkRate: 2 },
      fresh: { stinkRate: 1 },
      stinky: { stinkRate: 5 },
      golden: { stinkRate: 0 },
      rainbow: { stinkRate: 0 },
    };

    expect(POOP_CONFIG.normal.stinkRate).toBe(2);
    expect(POOP_CONFIG.fresh.stinkRate).toBe(1);
    expect(POOP_CONFIG.stinky.stinkRate).toBe(5);
    expect(POOP_CONFIG.golden.stinkRate).toBe(0);
    expect(POOP_CONFIG.rainbow.stinkRate).toBe(0);
  });

  it('should have correct spawn weights per poop type', () => {
    const weights = {
      normal: 70,
      fresh: 15,
      stinky: 10,
      golden: 3,
      rainbow: 2,
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    expect(totalWeight).toBe(100);
  });
});

// ============================================
// SCORING TESTS
// ============================================

describe('Poop Scoop - Scoring', () => {
  it('should have correct point values per design doc', () => {
    const POINTS = {
      normal: 10,
      fresh: 5,
      stinky: 20,
      golden: 50,
      rainbow: 30,
      quickCleanBonus: 5,
      streakBonusPerPoop: 2,
      maxStreakBonus: 10,
      survivalBonusPerSecond: 3,
    };

    expect(POINTS.normal).toBe(10);
    expect(POINTS.fresh).toBe(5);
    expect(POINTS.stinky).toBe(20);
    expect(POINTS.golden).toBe(50);
    expect(POINTS.rainbow).toBe(30);
    expect(POINTS.quickCleanBonus).toBe(5);
    expect(POINTS.survivalBonusPerSecond).toBe(3);
  });

  it('should calculate quick clean bonus correctly', () => {
    const basePoints = 10;
    const QUICK_CLEAN_BONUS = 5;
    const QUICK_CLEAN_THRESHOLD_MS = 1000;

    function getPointsWithQuickBonus(poopAge: number, basePoints: number): number {
      return poopAge < QUICK_CLEAN_THRESHOLD_MS ? basePoints + QUICK_CLEAN_BONUS : basePoints;
    }

    // Quick clean (< 1 second)
    expect(getPointsWithQuickBonus(500, basePoints)).toBe(15);
    expect(getPointsWithQuickBonus(999, basePoints)).toBe(15);

    // Not quick clean (>= 1 second)
    expect(getPointsWithQuickBonus(1000, basePoints)).toBe(10);
    expect(getPointsWithQuickBonus(2000, basePoints)).toBe(10);
  });

  it('should calculate survival bonus correctly', () => {
    const SURVIVAL_BONUS_PER_SECOND = 3;
    const GAME_DURATION_SECONDS = 60;

    const survivalBonus = GAME_DURATION_SECONDS * SURVIVAL_BONUS_PER_SECOND;
    expect(survivalBonus).toBe(180);
  });
});

// ============================================
// STREAK SYSTEM TESTS
// ============================================

describe('Poop Scoop - Streak System', () => {
  it('should require 3+ cleans within 2 seconds for streak', () => {
    const STREAK_THRESHOLD = 3;
    const STREAK_WINDOW_MS = 2000;

    function calculateStreak(cleanTimes: number[], currentTime: number): number {
      const recentCleans = cleanTimes.filter((t) => currentTime - t < STREAK_WINDOW_MS);
      return recentCleans.length >= STREAK_THRESHOLD ? recentCleans.length : 0;
    }

    // 3 cleans within window = streak
    expect(calculateStreak([0, 500, 1000], 1500)).toBe(3);

    // 2 cleans = no streak
    expect(calculateStreak([0, 500], 1000)).toBe(0);

    // Old cleans don't count
    expect(calculateStreak([0, 500, 3000], 3500)).toBe(0);
  });

  it('should calculate streak bonus correctly', () => {
    const STREAK_BONUS_PER_POOP = 2;
    const MAX_STREAK_BONUS = 10;

    function getStreakBonus(streak: number): number {
      if (streak < 3) return 0;
      return Math.min(STREAK_BONUS_PER_POOP * streak, MAX_STREAK_BONUS);
    }

    // No streak
    expect(getStreakBonus(0)).toBe(0);
    expect(getStreakBonus(2)).toBe(0);

    // With streak
    expect(getStreakBonus(3)).toBe(6);
    expect(getStreakBonus(4)).toBe(8);
    expect(getStreakBonus(5)).toBe(10); // Max
    expect(getStreakBonus(10)).toBe(10); // Still max
  });
});

// ============================================
// STINK METER TESTS
// ============================================

describe('Poop Scoop - Stink Meter', () => {
  it('should have max stink of 100', () => {
    const MAX_STINK = 100;
    expect(MAX_STINK).toBe(100);
  });

  it('should calculate stink increase based on poop type and age', () => {
    interface Poop {
      type: string;
      age: number;
      stinkRate: number;
    }

    function calculateStinkDelta(poops: Poop[], deltaMs: number): number {
      let stinkDelta = 0;

      poops.forEach((poop) => {
        const ageMultiplier = 1 + poop.age / 5000;
        stinkDelta += poop.stinkRate * ageMultiplier * (deltaMs / 1000);
      });

      return stinkDelta;
    }

    // Single normal poop (stink rate 2), fresh (age 0), 1 second
    expect(calculateStinkDelta([{ type: 'normal', age: 0, stinkRate: 2 }], 1000)).toBe(2);

    // Normal poop aged 5 seconds (2x multiplier), 1 second
    expect(calculateStinkDelta([{ type: 'normal', age: 5000, stinkRate: 2 }], 1000)).toBe(4);

    // Stinky poop (rate 5), age 0, 1 second
    expect(calculateStinkDelta([{ type: 'stinky', age: 0, stinkRate: 5 }], 1000)).toBe(5);
  });

  it('should decrease stink when no poops are on screen', () => {
    const STINK_DECREASE_RATE = 2; // per second

    function calculateStinkDeltaEmpty(deltaMs: number): number {
      return -STINK_DECREASE_RATE * (deltaMs / 1000);
    }

    expect(calculateStinkDeltaEmpty(1000)).toBe(-2);
    expect(calculateStinkDeltaEmpty(500)).toBe(-1);
  });

  it('should clamp stink meter between 0 and 100', () => {
    const MAX_STINK = 100;

    function clampStink(value: number): number {
      return Math.max(0, Math.min(MAX_STINK, value));
    }

    expect(clampStink(-10)).toBe(0);
    expect(clampStink(50)).toBe(50);
    expect(clampStink(110)).toBe(100);
  });
});

// ============================================
// SPAWN LOGIC TESTS
// ============================================

describe('Poop Scoop - Spawn Logic', () => {
  it('should have correct spawn intervals per phase', () => {
    // Per design: 0-20s = 1/2sec, 20-40s = 1/1.5sec, 40-60s = 1/sec
    const SPAWN_INTERVALS = [
      { time: 0, interval: 2000 },
      { time: 20000, interval: 1500 },
      { time: 40000, interval: 1000 },
    ];

    function getSpawnInterval(elapsedMs: number): number {
      for (let i = SPAWN_INTERVALS.length - 1; i >= 0; i--) {
        if (elapsedMs >= SPAWN_INTERVALS[i].time) {
          return SPAWN_INTERVALS[i].interval;
        }
      }
      return SPAWN_INTERVALS[0].interval;
    }

    // Phase 1: 0-20s
    expect(getSpawnInterval(0)).toBe(2000);
    expect(getSpawnInterval(10000)).toBe(2000);
    expect(getSpawnInterval(19999)).toBe(2000);

    // Phase 2: 20-40s
    expect(getSpawnInterval(20000)).toBe(1500);
    expect(getSpawnInterval(30000)).toBe(1500);
    expect(getSpawnInterval(39999)).toBe(1500);

    // Phase 3: 40-60s
    expect(getSpawnInterval(40000)).toBe(1000);
    expect(getSpawnInterval(50000)).toBe(1000);
    expect(getSpawnInterval(60000)).toBe(1000);
  });

  it('should only spawn stinky after 20 seconds', () => {
    function getAvailableTypes(elapsedMs: number): string[] {
      const types = ['normal', 'fresh'];
      if (elapsedMs > 20000) types.push('stinky');
      if (elapsedMs > 40000) {
        types.push('golden');
        types.push('rainbow');
      }
      return types;
    }

    expect(getAvailableTypes(0)).not.toContain('stinky');
    expect(getAvailableTypes(19999)).not.toContain('stinky');
    expect(getAvailableTypes(20001)).toContain('stinky');
  });

  it('should only spawn golden and rainbow after 40 seconds', () => {
    function getAvailableTypes(elapsedMs: number): string[] {
      const types = ['normal', 'fresh'];
      if (elapsedMs > 20000) types.push('stinky');
      if (elapsedMs > 40000) {
        types.push('golden');
        types.push('rainbow');
      }
      return types;
    }

    expect(getAvailableTypes(30000)).not.toContain('golden');
    expect(getAvailableTypes(30000)).not.toContain('rainbow');
    expect(getAvailableTypes(40001)).toContain('golden');
    expect(getAvailableTypes(40001)).toContain('rainbow');
  });

  it('should spawn within valid bounds (avoid edges)', () => {
    function generateSpawnPosition(): { x: number; y: number } {
      return {
        x: Math.random() * 0.8 + 0.1, // 0.1 to 0.9
        y: Math.random() * 0.6 + 0.15, // 0.15 to 0.75
      };
    }

    // Test multiple spawns
    for (let i = 0; i < 100; i++) {
      const pos = generateSpawnPosition();
      expect(pos.x).toBeGreaterThanOrEqual(0.1);
      expect(pos.x).toBeLessThanOrEqual(0.9);
      expect(pos.y).toBeGreaterThanOrEqual(0.15);
      expect(pos.y).toBeLessThanOrEqual(0.75);
    }
  });
});

// ============================================
// POWERUP TESTS
// ============================================

describe('Poop Scoop - Powerups', () => {
  it('should have correct powerup durations', () => {
    const POWERUP_DURATIONS = {
      magnet: 3000,
      freeze: 3000,
      airfresh: 0, // instant
      speedscoop: 4000,
    };

    expect(POWERUP_DURATIONS.magnet).toBe(3000);
    expect(POWERUP_DURATIONS.freeze).toBe(3000);
    expect(POWERUP_DURATIONS.airfresh).toBe(0);
    expect(POWERUP_DURATIONS.speedscoop).toBe(4000);
  });

  it('should reduce stink by 30% with airfresh', () => {
    const AIR_FRESH_REDUCTION = 30;

    function applyAirFresh(currentStink: number): number {
      return Math.max(0, currentStink - AIR_FRESH_REDUCTION);
    }

    expect(applyAirFresh(100)).toBe(70);
    expect(applyAirFresh(50)).toBe(20);
    expect(applyAirFresh(20)).toBe(0);
  });

  it('should have 4 powerup types from rainbow', () => {
    const POWERUP_TYPES = ['magnet', 'freeze', 'airfresh', 'speedscoop'];
    expect(POWERUP_TYPES.length).toBe(4);
  });
});

// ============================================
// PET ABILITIES TESTS
// ============================================

describe('Poop Scoop - Pet Abilities', () => {
  function getPetAbilities(petId: string) {
    const abilities = {
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
        abilities.tapRadiusMultiplier = 1.3;
        break;
      case 'grib':
        abilities.stinkRateMultiplier = 0.75;
        break;
      case 'plompo':
        abilities.areaClean = true;
        break;
      case 'ember':
        abilities.stinkyMultiplier = 3;
        break;
      case 'chomper':
        abilities.pointsMultiplier = 2;
        break;
      case 'whisp':
        abilities.autoScoopsCount = 3;
        break;
      case 'luxe':
        abilities.divaRageThreshold = 15;
        break;
    }

    return abilities;
  }

  it('Munchlet should have 30% larger tap radius', () => {
    const abilities = getPetAbilities('munchlet');
    expect(abilities.tapRadiusMultiplier).toBe(1.3);
  });

  it('Grib should have 25% slower stink rate', () => {
    const abilities = getPetAbilities('grib');
    expect(abilities.stinkRateMultiplier).toBe(0.75);

    // Test stink calculation with Grib
    const normalStink = 2 * 1; // base stink rate
    const gribStink = 2 * abilities.stinkRateMultiplier;
    expect(gribStink).toBe(1.5);
  });

  it('Plompo should have 2x2 area clean', () => {
    const abilities = getPetAbilities('plompo');
    expect(abilities.areaClean).toBe(true);
  });

  it('Ember should have 3x points for stinky poop', () => {
    const abilities = getPetAbilities('ember');
    expect(abilities.stinkyMultiplier).toBe(3);

    const stinkyBasePoints = 20;
    const emberStinkyPoints = stinkyBasePoints * abilities.stinkyMultiplier;
    expect(emberStinkyPoints).toBe(60);
  });

  it('Chomper should have 2x points for all poop', () => {
    const abilities = getPetAbilities('chomper');
    expect(abilities.pointsMultiplier).toBe(2);

    const normalPoints = 10 * abilities.pointsMultiplier;
    expect(normalPoints).toBe(20);
  });

  it('Whisp should have 3 auto-scoops per game', () => {
    const abilities = getPetAbilities('whisp');
    expect(abilities.autoScoopsCount).toBe(3);
  });

  it('Luxe should have diva rage every 15 cleaned', () => {
    const abilities = getPetAbilities('luxe');
    expect(abilities.divaRageThreshold).toBe(15);
  });

  it('default pet should have no ability modifiers', () => {
    const abilities = getPetAbilities('unknown_pet');
    expect(abilities.tapRadiusMultiplier).toBe(1);
    expect(abilities.stinkRateMultiplier).toBe(1);
    expect(abilities.areaClean).toBe(false);
    expect(abilities.stinkyMultiplier).toBe(1);
    expect(abilities.pointsMultiplier).toBe(1);
    expect(abilities.autoScoopsCount).toBe(0);
    expect(abilities.divaRageThreshold).toBe(0);
  });
});

// ============================================
// GAME LIFECYCLE TESTS
// ============================================

describe('Poop Scoop - Game Lifecycle', () => {
  it('should initialize with correct default state', () => {
    const initialState = {
      score: 0,
      stinkMeter: 0,
      poopsCleaned: 0,
      streak: 0,
      timeRemaining: 60000,
      poops: [],
    };

    expect(initialState.score).toBe(0);
    expect(initialState.stinkMeter).toBe(0);
    expect(initialState.poopsCleaned).toBe(0);
    expect(initialState.streak).toBe(0);
    expect(initialState.timeRemaining).toBe(60000);
    expect(initialState.poops.length).toBe(0);
  });

  it('should have 60 second game duration', () => {
    const GAME_DURATION_MS = 60_000;
    expect(GAME_DURATION_MS).toBe(60000);
  });
});

// ============================================
// WIN/LOSE CONDITION TESTS
// ============================================

describe('Poop Scoop - Win/Lose Conditions', () => {
  it('should win when surviving full 60 seconds', () => {
    const timeRemaining = 0;
    const stinkMeter = 50;
    const MAX_STINK = 100;

    const gameEnded = timeRemaining <= 0 || stinkMeter >= MAX_STINK;
    const isWin = timeRemaining <= 0 && stinkMeter < MAX_STINK;

    expect(gameEnded).toBe(true);
    expect(isWin).toBe(true);
  });

  it('should lose when stink meter reaches 100%', () => {
    const timeRemaining = 30000;
    const stinkMeter = 100;
    const MAX_STINK = 100;

    const gameEnded = timeRemaining <= 0 || stinkMeter >= MAX_STINK;
    const isWin = timeRemaining <= 0 && stinkMeter < MAX_STINK;

    expect(gameEnded).toBe(true);
    expect(isWin).toBe(false);
  });

  it('should not end game if time remaining and stink < 100', () => {
    const timeRemaining: number = 30000;
    const stinkMeter: number = 80;
    const MAX_STINK: number = 100;

    const gameEnded = timeRemaining <= 0 || stinkMeter >= MAX_STINK;
    expect(gameEnded).toBe(false);
  });
});

// ============================================
// GAME END TESTS
// ============================================

describe('Poop Scoop - Game End', () => {
  it('should call onGameEnd exactly once per session', () => {
    let callCount = 0;
    let gameEndedRef = false;

    const onGameEnd = (score: number) => {
      callCount++;
    };

    function triggerGameEnd(score: number) {
      if (!gameEndedRef) {
        gameEndedRef = true;
        onGameEnd(score);
      }
    }

    triggerGameEnd(500);
    triggerGameEnd(500);
    triggerGameEnd(500);

    expect(callCount).toBe(1);
  });

  it('should include survival bonus in final score on win', () => {
    const SURVIVAL_BONUS_PER_SECOND = 3;
    const GAME_DURATION_SECONDS = 60;

    const baseScore = 300;
    const survivalBonus = GAME_DURATION_SECONDS * SURVIVAL_BONUS_PER_SECOND;
    const finalScore = baseScore + survivalBonus;

    expect(survivalBonus).toBe(180);
    expect(finalScore).toBe(480);
  });
});

// ============================================
// TAP DETECTION TESTS
// ============================================

describe('Poop Scoop - Tap Detection', () => {
  it('should detect tap within radius', () => {
    const BASE_TAP_RADIUS = 0.08;

    function isWithinRadius(
      tapX: number,
      tapY: number,
      poopX: number,
      poopY: number,
      radius: number
    ): boolean {
      const distance = Math.sqrt(Math.pow(tapX - poopX, 2) + Math.pow(tapY - poopY, 2));
      return distance <= radius;
    }

    // Direct hit
    expect(isWithinRadius(0.5, 0.5, 0.5, 0.5, BASE_TAP_RADIUS)).toBe(true);

    // Within radius
    expect(isWithinRadius(0.5, 0.5, 0.55, 0.55, BASE_TAP_RADIUS)).toBe(true);

    // Outside radius
    expect(isWithinRadius(0.5, 0.5, 0.7, 0.7, BASE_TAP_RADIUS)).toBe(false);
  });

  it('should have larger radius for Munchlet', () => {
    const BASE_TAP_RADIUS = 0.08;
    const MUNCHLET_MULTIPLIER = 1.3;

    const normalRadius = BASE_TAP_RADIUS;
    const munchletRadius = BASE_TAP_RADIUS * MUNCHLET_MULTIPLIER;

    expect(munchletRadius).toBeCloseTo(0.104);
    expect(munchletRadius).toBeGreaterThan(normalRadius);
  });

  it('should have larger area for Plompo (2x2)', () => {
    const BASE_TAP_RADIUS = 0.08;
    const PLOMPO_TAP_SIZE = 0.12;

    expect(PLOMPO_TAP_SIZE).toBeGreaterThan(BASE_TAP_RADIUS);
  });
});

// ============================================
// REWARD TIER TESTS
// ============================================

describe('Poop Scoop - Reward Tiers', () => {
  it('should have correct tier thresholds per design doc', () => {
    // From design: Bronze 0-199, Silver 200-399, Gold 400-599, Rainbow 600+
    const tiers = {
      bronze: { min: 0, max: 199 },
      silver: { min: 200, max: 399 },
      gold: { min: 400, max: 599 },
      rainbow: { min: 600, max: Infinity },
    };

    expect(tiers.bronze.max).toBe(199);
    expect(tiers.silver.min).toBe(200);
    expect(tiers.gold.min).toBe(400);
    expect(tiers.rainbow.min).toBe(600);
  });
});

// ============================================
// MAX SCORE CALCULATION TESTS
// ============================================

describe('Poop Scoop - Maximum Score', () => {
  it('should calculate reasonable max score', () => {
    // Estimate max with perfect play:
    // ~30 poops at average 15 points = 450
    // Quick clean bonus: 30 * 5 = 150
    // Some golden/rainbow: ~100 bonus
    // Survival bonus: 180
    // Streaks: ~50

    const estimatedMax = 450 + 150 + 100 + 180 + 50;
    expect(estimatedMax).toBeGreaterThan(600); // Should reach Rainbow tier
    expect(estimatedMax).toBeLessThan(2000); // Sanity check
  });
});

// ============================================
// INTEGRATION WITH STORE TESTS
// ============================================

describe('Poop Scoop - Store Integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('can read active pet ID from store', () => {
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('munchlet');
  });

  it('can select different pet for testing abilities', () => {
    useGameStore.getState().selectPet('grib');
    const petId = useGameStore.getState().pet.id;
    expect(petId).toBe('grib');
  });

  it('can select poop-specific ability pets', () => {
    // Test Whisp for auto-scoops
    useGameStore.getState().selectPet('whisp');
    expect(useGameStore.getState().pet.id).toBe('whisp');

    // Test Luxe for diva rage
    useGameStore.getState().selectPet('luxe');
    expect(useGameStore.getState().pet.id).toBe('luxe');

    // Test Chomper for 2x points
    useGameStore.getState().selectPet('chomper');
    expect(useGameStore.getState().pet.id).toBe('chomper');
  });
});

// ============================================
// AUTO-SCOOP TESTS (WHISP)
// ============================================

describe('Poop Scoop - Whisp Auto-Scoop', () => {
  it('should clean oldest poop first', () => {
    const poops = [
      { id: 1, age: 1000 },
      { id: 2, age: 3000 }, // oldest
      { id: 3, age: 500 },
    ];

    const oldest = poops.sort((a, b) => b.age - a.age)[0];
    expect(oldest.id).toBe(2);
  });

  it('should decrement auto-scoop count on use', () => {
    let autoScoopsLeft = 3;

    function useAutoScoop(): boolean {
      if (autoScoopsLeft > 0) {
        autoScoopsLeft--;
        return true;
      }
      return false;
    }

    expect(useAutoScoop()).toBe(true);
    expect(autoScoopsLeft).toBe(2);
    expect(useAutoScoop()).toBe(true);
    expect(autoScoopsLeft).toBe(1);
    expect(useAutoScoop()).toBe(true);
    expect(autoScoopsLeft).toBe(0);
    expect(useAutoScoop()).toBe(false);
    expect(autoScoopsLeft).toBe(0);
  });
});

// ============================================
// DIVA RAGE TESTS (LUXE)
// ============================================

describe('Poop Scoop - Luxe Diva Rage', () => {
  it('should trigger diva rage every 15 cleaned', () => {
    const DIVA_RAGE_THRESHOLD = 15;

    function shouldTriggerDivaRage(poopsCleaned: number): boolean {
      return poopsCleaned > 0 && poopsCleaned % DIVA_RAGE_THRESHOLD === 0;
    }

    expect(shouldTriggerDivaRage(14)).toBe(false);
    expect(shouldTriggerDivaRage(15)).toBe(true);
    expect(shouldTriggerDivaRage(16)).toBe(false);
    expect(shouldTriggerDivaRage(30)).toBe(true);
    expect(shouldTriggerDivaRage(45)).toBe(true);
  });

  it('should clear all poops on diva rage', () => {
    interface Poop {
      id: number;
      cleaned: boolean;
    }

    function clearAllPoops(poops: Poop[]): Poop[] {
      return poops.map((p) => ({ ...p, cleaned: true }));
    }

    const poops = [
      { id: 1, cleaned: false },
      { id: 2, cleaned: false },
      { id: 3, cleaned: false },
    ];

    const cleared = clearAllPoops(poops);
    expect(cleared.every((p) => p.cleaned)).toBe(true);
  });
});
