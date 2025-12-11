/**
 * BCT-ECON-01, 02, BCT-GAME-01, 02
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §8.2-8.3, §11.4
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-ECON-*, BCT-GAME-*
 */
import { describe, it, expect } from 'vitest';
import {
  MINIGAME_RULES,
  REWARD_TIERS,
  MINIGAME_GEMS_ALLOWED,
  GEM_SOURCES,
  hasMiniGameGems,
  isGemSourceEnabled,
  getGemSourcesForPlatform,
} from '../constants/bible.constants';

describe('BCT-ECON-01: Mini-games never award gems', () => {
  it('should have MINIGAME_GEMS_ALLOWED = false', () => {
    expect(MINIGAME_GEMS_ALLOWED).toBe(false);
  });

  it('should have gems = 0 for BRONZE tier', () => {
    expect(REWARD_TIERS.BRONZE.gems).toBe(0);
  });

  it('should have gems = 0 for SILVER tier', () => {
    expect(REWARD_TIERS.SILVER.gems).toBe(0);
  });

  it('should have gems = 0 for GOLD tier', () => {
    expect(REWARD_TIERS.GOLD.gems).toBe(0);
  });

  it('should have gems = 0 for RAINBOW tier (Bible §8.3 LOCKED)', () => {
    // "Mini-games NEVER award gems under any circumstances -
    // including Rainbow tier. This is a locked design constraint."
    expect(REWARD_TIERS.RAINBOW.gems).toBe(0);
  });

  it('should NOT have mini-game gems on Web platform', () => {
    expect(hasMiniGameGems('web')).toBe(false);
  });
});

describe('BCT-ECON-02: Gem sources (membership + exclusion)', () => {
  it('should have core gem sources', () => {
    const ids = GEM_SOURCES.map(s => s.id);
    expect(ids).toContain('level_up');
    expect(ids).toContain('first_feed_daily');
    expect(ids).toContain('achievements');
  });

  it('should have login streak gem source', () => {
    const ids = GEM_SOURCES.map(s => s.id);
    expect(ids).toContain('daily_login_day7');
  });

  it('level_up should be enabled on web', () => {
    expect(isGemSourceEnabled('level_up', 'web')).toBe(true);
  });

  it('first_feed_daily should be enabled on web', () => {
    expect(isGemSourceEnabled('first_feed_daily', 'web')).toBe(true);
  });

  it('mini_game_rainbow should NOT be enabled on web', () => {
    // Gem income from mini-games is Unity-only per Bible §8.3
    expect(isGemSourceEnabled('mini_game_rainbow', 'web')).toBe(false);
  });

  it('should have mini-game gems on Unity (but not Web)', () => {
    expect(hasMiniGameGems('unity')).toBe(true);
    expect(hasMiniGameGems('web')).toBe(false);
  });

  it('web platform should have fewer gem sources than unity', () => {
    const webSources = getGemSourcesForPlatform('web');
    const unitySources = getGemSourcesForPlatform('unity');
    expect(webSources.length).toBeLessThan(unitySources.length);
  });
});

describe('BCT-GAME-01: Daily cap enforced', () => {
  it('should have daily cap of 3', () => {
    expect(MINIGAME_RULES.DAILY_CAP).toBe(3);
  });

  it('daily cap must be positive', () => {
    expect(MINIGAME_RULES.DAILY_CAP).toBeGreaterThan(0);
  });
});

describe('BCT-GAME-02: First game free', () => {
  it('should have FIRST_GAME_FREE = true', () => {
    expect(MINIGAME_RULES.FIRST_GAME_FREE).toBe(true);
  });

  it('should have energy cost of 10', () => {
    expect(MINIGAME_RULES.ENERGY_COST).toBe(10);
  });

  it('should have max energy of 50', () => {
    expect(MINIGAME_RULES.MAX_ENERGY).toBe(50);
  });

  it('should have 30-minute energy regeneration', () => {
    const thirtyMinutesMs = 30 * 60 * 1000;
    expect(MINIGAME_RULES.ENERGY_REGEN_MS).toBe(thirtyMinutesMs);
  });

  it('max energy should allow at least DAILY_CAP games', () => {
    const gamesFromFullEnergy = Math.floor(
      MINIGAME_RULES.MAX_ENERGY / MINIGAME_RULES.ENERGY_COST
    );
    expect(gamesFromFullEnergy).toBeGreaterThanOrEqual(MINIGAME_RULES.DAILY_CAP);
  });
});

describe('BCT-GAME-03: Reward tier structure', () => {
  it('should have 4 reward tiers', () => {
    expect(Object.keys(REWARD_TIERS)).toHaveLength(4);
  });

  it('BRONZE should award 2-3 coins', () => {
    expect(REWARD_TIERS.BRONZE.coins.min).toBe(2);
    expect(REWARD_TIERS.BRONZE.coins.max).toBe(3);
  });

  it('SILVER should award 5-7 coins', () => {
    expect(REWARD_TIERS.SILVER.coins.min).toBe(5);
    expect(REWARD_TIERS.SILVER.coins.max).toBe(7);
  });

  it('GOLD should award 8-15 coins', () => {
    expect(REWARD_TIERS.GOLD.coins.min).toBe(8);
    expect(REWARD_TIERS.GOLD.coins.max).toBe(15);
  });

  it('RAINBOW should award 12-22 coins', () => {
    expect(REWARD_TIERS.RAINBOW.coins.min).toBe(12);
    expect(REWARD_TIERS.RAINBOW.coins.max).toBe(22);
  });

  it('XP rewards should increase by tier', () => {
    expect(REWARD_TIERS.BRONZE.xp).toBeLessThan(REWARD_TIERS.SILVER.xp);
    expect(REWARD_TIERS.SILVER.xp).toBeLessThan(REWARD_TIERS.GOLD.xp);
    expect(REWARD_TIERS.GOLD.xp).toBeLessThan(REWARD_TIERS.RAINBOW.xp);
  });
});
