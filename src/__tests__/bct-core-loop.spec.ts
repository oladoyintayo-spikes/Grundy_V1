/**
 * BCT-FEED-01, 02, 03: Feeding, Cooldown, Fullness
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §4.3-4.4
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-CORE-*
 */
import { describe, it, expect } from 'vitest';
import { FULLNESS_STATES, COOLDOWN } from '../constants/bible.constants';

describe('BCT-FEED-01: Stuffed pets cannot be fed', () => {
  it('should have STUFFED state with feedValue = 0', () => {
    expect(FULLNESS_STATES.STUFFED.feedValue).toBe(0);
  });

  it('should have STUFFED range 91-100', () => {
    expect(FULLNESS_STATES.STUFFED.min).toBe(91);
    expect(FULLNESS_STATES.STUFFED.max).toBe(100);
  });

  it('INVARIANT: STUFFED blocks feeding entirely (Bible §4.4 LOCKED)', () => {
    // "LOCKED RULE: When fullness reaches STUFFED (91-100),
    // feeding is completely blocked, not just reduced."
    expect(FULLNESS_STATES.STUFFED.feedValue).toBe(0);
    expect(FULLNESS_STATES.STUFFED.min).toBe(91);
  });
});

describe('BCT-FEED-02: Cooldown exists', () => {
  it('should have 30 minute cooldown', () => {
    const thirtyMinutesMs = 30 * 60 * 1000;
    expect(COOLDOWN.DURATION_MS).toBe(thirtyMinutesMs);
  });

  it('should have 0.25 reduced value during cooldown', () => {
    expect(COOLDOWN.REDUCED_VALUE).toBe(0.25);
  });

  it('cooldown must exist (Bible §4.3 mandatory)', () => {
    // "A cooldown MUST exist - spam-feeding must be prevented"
    expect(COOLDOWN.DURATION_MS).toBeGreaterThan(0);
  });
});

describe('BCT-FEED-03: Fullness states defined', () => {
  it('should have 5 fullness states', () => {
    expect(Object.keys(FULLNESS_STATES)).toHaveLength(5);
  });

  it('should have all expected states', () => {
    expect(FULLNESS_STATES).toHaveProperty('HUNGRY');
    expect(FULLNESS_STATES).toHaveProperty('PECKISH');
    expect(FULLNESS_STATES).toHaveProperty('CONTENT');
    expect(FULLNESS_STATES).toHaveProperty('SATISFIED');
    expect(FULLNESS_STATES).toHaveProperty('STUFFED');
  });

  it('INVARIANT: HUNGRY has feedValue 1.0', () => {
    expect(FULLNESS_STATES.HUNGRY.feedValue).toBe(1.0);
  });

  it('should have decreasing feed values as fullness increases', () => {
    expect(FULLNESS_STATES.HUNGRY.feedValue).toBeGreaterThan(FULLNESS_STATES.PECKISH.feedValue);
    expect(FULLNESS_STATES.PECKISH.feedValue).toBeGreaterThan(FULLNESS_STATES.CONTENT.feedValue);
    expect(FULLNESS_STATES.CONTENT.feedValue).toBeGreaterThan(FULLNESS_STATES.SATISFIED.feedValue);
    expect(FULLNESS_STATES.SATISFIED.feedValue).toBeGreaterThan(FULLNESS_STATES.STUFFED.feedValue);
  });

  it('should have contiguous fullness ranges', () => {
    // HUNGRY: 0-20, PECKISH: 21-40, CONTENT: 41-70, SATISFIED: 71-90, STUFFED: 91-100
    expect(FULLNESS_STATES.HUNGRY.min).toBe(0);
    expect(FULLNESS_STATES.HUNGRY.max + 1).toBe(FULLNESS_STATES.PECKISH.min);
    expect(FULLNESS_STATES.PECKISH.max + 1).toBe(FULLNESS_STATES.CONTENT.min);
    expect(FULLNESS_STATES.CONTENT.max + 1).toBe(FULLNESS_STATES.SATISFIED.min);
    expect(FULLNESS_STATES.SATISFIED.max + 1).toBe(FULLNESS_STATES.STUFFED.min);
    expect(FULLNESS_STATES.STUFFED.max).toBe(100);
  });
});
