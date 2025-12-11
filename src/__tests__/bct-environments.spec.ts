/**
 * BCT-ROOMS-*, BCT-FTUE-*
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §7.4, §14.4
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-ROOMS-*, BCT-FTUE-*
 */
import { describe, it, expect } from 'vitest';
import {
  ROOM_ACTIVITY_MAP,
  TIME_OF_DAY,
  FTUE_LORE_LINES,
  FTUE_LORE_FULL,
  normalizeText,
  containsAllFtueLore,
} from '../constants/bible.constants';

describe('BCT-ROOMS-01: Feeding uses Kitchen', () => {
  it('should map feeding to kitchen', () => {
    expect(ROOM_ACTIVITY_MAP.feeding).toBe('kitchen');
  });
});

describe('BCT-ROOMS-02: Sleep/Play room mapping', () => {
  it('should map sleeping to bedroom', () => {
    expect(ROOM_ACTIVITY_MAP.sleeping).toBe('bedroom');
  });

  it('should map playing to playroom', () => {
    expect(ROOM_ACTIVITY_MAP.playing).toBe('playroom');
  });

  it('should have default room as living_room', () => {
    expect(ROOM_ACTIVITY_MAP.default).toBe('living_room');
  });
});

describe('BCT-ROOMS-03: Time of day', () => {
  it('should have correct MORNING boundaries (6-12)', () => {
    expect(TIME_OF_DAY.MORNING.start).toBe(6);
    expect(TIME_OF_DAY.MORNING.end).toBe(12);
  });

  it('should have correct AFTERNOON boundaries (12-17)', () => {
    expect(TIME_OF_DAY.AFTERNOON.start).toBe(12);
    expect(TIME_OF_DAY.AFTERNOON.end).toBe(17);
  });

  it('should have correct EVENING boundaries (17-21)', () => {
    expect(TIME_OF_DAY.EVENING.start).toBe(17);
    expect(TIME_OF_DAY.EVENING.end).toBe(21);
  });

  it('should have correct NIGHT boundaries (21-6)', () => {
    expect(TIME_OF_DAY.NIGHT.start).toBe(21);
    expect(TIME_OF_DAY.NIGHT.end).toBe(6);
  });

  it('should have 4 time periods covering 24 hours', () => {
    expect(Object.keys(TIME_OF_DAY)).toHaveLength(4);
  });
});

describe('BCT-FTUE-01: Lore text', () => {
  it('should have exactly 3 lore lines', () => {
    expect(FTUE_LORE_LINES).toHaveLength(3);
  });

  it('should have correct Line 1 (Bible §7.4 LOCKED)', () => {
    expect(FTUE_LORE_LINES[0]).toBe('Sometimes, when a big feeling is left behind\u2026');
  });

  it('should have correct Line 2 (Bible §7.4 LOCKED)', () => {
    expect(FTUE_LORE_LINES[1]).toBe('A tiny spirit called a Grundy wakes up.');
  });

  it('should have correct Line 3 (Bible §7.4 LOCKED)', () => {
    expect(FTUE_LORE_LINES[2]).toBe('One of them just found you.');
  });

  it('should use proper ellipsis character (\u2026), not three dots', () => {
    // Bible uses the typographic ellipsis character, not "..."
    expect(FTUE_LORE_LINES[0]).toContain('\u2026');
    expect(FTUE_LORE_LINES[0]).not.toContain('...');
  });

  it('FTUE_LORE_FULL should contain all lines', () => {
    FTUE_LORE_LINES.forEach(line => {
      expect(FTUE_LORE_FULL).toContain(line);
    });
  });
});

describe('BCT-FTUE-02: Lore text utilities', () => {
  it('normalizeText should collapse whitespace', () => {
    const input = '  Hello    World  ';
    expect(normalizeText(input)).toBe('Hello World');
  });

  it('normalizeText should handle newlines', () => {
    const input = 'Line1\n\nLine2';
    expect(normalizeText(input)).toBe('Line1 Line2');
  });

  it('containsAllFtueLore should return true for full text', () => {
    expect(containsAllFtueLore(FTUE_LORE_FULL)).toBe(true);
  });

  it('containsAllFtueLore should work with extra whitespace', () => {
    const text = FTUE_LORE_LINES.join('   ');
    expect(containsAllFtueLore(text)).toBe(true);
  });

  it('containsAllFtueLore should return false for partial text', () => {
    const partial = FTUE_LORE_LINES[0] + ' ' + FTUE_LORE_LINES[1];
    expect(containsAllFtueLore(partial)).toBe(false);
  });

  it('containsAllFtueLore should return false for empty string', () => {
    expect(containsAllFtueLore('')).toBe(false);
  });
});
