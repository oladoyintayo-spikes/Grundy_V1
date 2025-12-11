/**
 * BCT-EVO-01: Evolution thresholds match Bible
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §6.1
 * @see docs/BIBLE_COMPLIANCE_TEST.md BCT-EVOL-*
 */
import { describe, it, expect } from 'vitest';
import { EVOLUTION_THRESHOLDS, EVOLUTION_STAGES } from '../constants/bible.constants';

describe('BCT-EVO-01: Evolution thresholds match Bible', () => {
  it('should have Youth threshold at level 10', () => {
    expect(EVOLUTION_THRESHOLDS.YOUTH).toBe(10);
  });

  it('should have Evolved threshold at level 25', () => {
    expect(EVOLUTION_THRESHOLDS.EVOLVED).toBe(25);
  });

  it('should have exactly 3 evolution stages', () => {
    expect(Object.keys(EVOLUTION_STAGES)).toHaveLength(3);
  });

  it('should have correct stage names', () => {
    expect(EVOLUTION_STAGES.BABY).toBe('baby');
    expect(EVOLUTION_STAGES.YOUTH).toBe('youth');
    expect(EVOLUTION_STAGES.EVOLVED).toBe('evolved');
  });

  it('INVARIANT: Youth = 10, Evolved = 25 (Bible §6.1 LOCKED)', () => {
    // These values are explicitly locked in the Bible:
    // "LOCKED THRESHOLDS: Youth=10, Evolved=25. These values are final."
    expect(EVOLUTION_THRESHOLDS.YOUTH).toBe(10);
    expect(EVOLUTION_THRESHOLDS.EVOLVED).toBe(25);
  });

  it('should have stages in correct level order', () => {
    // Baby: 1-9, Youth: 10-24, Evolved: 25+
    expect(EVOLUTION_THRESHOLDS.YOUTH).toBeLessThan(EVOLUTION_THRESHOLDS.EVOLVED);
  });
});
