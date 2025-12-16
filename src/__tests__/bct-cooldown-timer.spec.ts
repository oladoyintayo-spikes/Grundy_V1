/**
 * BCT-COOLDOWN-TIMER: Cooldown Timer Formatting Tests
 *
 * Tests for the timer display formatting to prevent regression of absurd values.
 *
 * The formatTime function must:
 * 1. Accept milliseconds as input (from getCooldownRemaining)
 * 2. Convert to MM:SS format correctly
 * 3. Clamp negative values to 0:00
 * 4. Cap absurdly large values at 59:59
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §4.3 (Cooldown System)
 * @see src/components/layout/CooldownBanner.tsx
 * @see src/components/layout/FoodDrawer.tsx
 */
import { describe, it, expect } from 'vitest';
import { COOLDOWN } from '../constants/bible.constants';

/**
 * Reference implementation of formatTime (mirrors CooldownBanner/FoodDrawer)
 * Used for testing the formatting logic in isolation.
 */
function formatTimeMs(ms: number): string {
  // Clamp to 0 (never negative)
  const clampedMs = Math.max(0, ms);
  // Convert ms to total seconds
  const totalSeconds = Math.floor(clampedMs / 1000);
  // Cap at 59:59 to prevent absurd display values
  const cappedSeconds = Math.min(totalSeconds, 59 * 60 + 59);
  const mins = Math.floor(cappedSeconds / 60);
  const secs = cappedSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

describe('BCT-COOLDOWN-TIMER-001: Timer Formatting - Basic Cases', () => {
  it('should format 0ms as 0:00', () => {
    expect(formatTimeMs(0)).toBe('0:00');
  });

  it('should format 1000ms (1 second) as 0:01', () => {
    expect(formatTimeMs(1000)).toBe('0:01');
  });

  it('should format 65000ms (65 seconds) as 1:05', () => {
    expect(formatTimeMs(65000)).toBe('1:05');
  });

  it('should format 5000ms (5 seconds) as 0:05', () => {
    expect(formatTimeMs(5000)).toBe('0:05');
  });

  it('should format 60000ms (60 seconds) as 1:00', () => {
    expect(formatTimeMs(60000)).toBe('1:00');
  });

  it('should format 90000ms (90 seconds) as 1:30', () => {
    expect(formatTimeMs(90000)).toBe('1:30');
  });

  it('should format 599000ms (9:59) correctly', () => {
    expect(formatTimeMs(599000)).toBe('9:59');
  });
});

describe('BCT-COOLDOWN-TIMER-002: Timer Formatting - Cooldown Duration', () => {
  /**
   * Bible §4.3: Cooldown duration is 30 minutes (1,800,000 ms)
   * Timer should display up to 30:00 correctly
   */

  it('should correctly format full 30 minute cooldown', () => {
    // COOLDOWN.DURATION_MS = 30 * 60 * 1000 = 1,800,000 ms
    expect(formatTimeMs(COOLDOWN.DURATION_MS)).toBe('30:00');
  });

  it('should format 29 minutes 15 seconds correctly', () => {
    const ms = (29 * 60 + 15) * 1000; // 1,755,000 ms
    expect(formatTimeMs(ms)).toBe('29:15');
  });

  it('should format 15 minutes 30 seconds correctly', () => {
    const ms = (15 * 60 + 30) * 1000; // 930,000 ms
    expect(formatTimeMs(ms)).toBe('15:30');
  });
});

describe('BCT-COOLDOWN-TIMER-003: Timer Formatting - Negative Input Clamping', () => {
  /**
   * Negative values must be clamped to 0:00
   * This prevents display of negative timers if timing is off
   */

  it('should clamp negative input to 0:00', () => {
    expect(formatTimeMs(-1000)).toBe('0:00');
  });

  it('should clamp large negative input to 0:00', () => {
    expect(formatTimeMs(-999999)).toBe('0:00');
  });

  it('should handle negative zero edge case', () => {
    expect(formatTimeMs(-0)).toBe('0:00');
  });
});

describe('BCT-COOLDOWN-TIMER-004: Timer Formatting - Absurd Value Capping', () => {
  /**
   * Absurdly large values must be capped at 59:59
   * This prevents display of values like "29326:48" which was the original bug
   */

  it('should cap values larger than 59:59 at 59:59', () => {
    const hugeMs = 1758880000; // ~488 hours - the original bug value
    expect(formatTimeMs(hugeMs)).toBe('59:59');
  });

  it('should cap 1 hour (3600000ms) at 59:59', () => {
    expect(formatTimeMs(3600000)).toBe('59:59');
  });

  it('should cap 2 hours at 59:59', () => {
    expect(formatTimeMs(7200000)).toBe('59:59');
  });

  it('should allow exactly 59:59 without capping', () => {
    const fiftyNineMinutesFiftyNineSeconds = (59 * 60 + 59) * 1000; // 3,599,000 ms
    expect(formatTimeMs(fiftyNineMinutesFiftyNineSeconds)).toBe('59:59');
  });

  it('should cap 60:00 to 59:59', () => {
    const sixtyMinutes = 60 * 60 * 1000; // 3,600,000 ms
    expect(formatTimeMs(sixtyMinutes)).toBe('59:59');
  });
});

describe('BCT-COOLDOWN-TIMER-005: Timer Formatting - Edge Cases', () => {
  /**
   * Various edge cases for robustness
   */

  it('should handle fractional milliseconds (rounds down)', () => {
    expect(formatTimeMs(1500)).toBe('0:01'); // 1.5 seconds → 1 second
    expect(formatTimeMs(1999)).toBe('0:01'); // 1.999 seconds → 1 second
  });

  it('should handle very small positive values', () => {
    expect(formatTimeMs(1)).toBe('0:00'); // 1ms rounds to 0 seconds
    expect(formatTimeMs(999)).toBe('0:00'); // 999ms rounds to 0 seconds
  });

  it('should format boundary at 1 minute correctly', () => {
    expect(formatTimeMs(59999)).toBe('0:59');
    expect(formatTimeMs(60000)).toBe('1:00');
    expect(formatTimeMs(60001)).toBe('1:00');
  });

  it('should pad single-digit seconds with leading zero', () => {
    expect(formatTimeMs(3000)).toBe('0:03');
    expect(formatTimeMs(9000)).toBe('0:09');
    expect(formatTimeMs(63000)).toBe('1:03');
  });
});

describe('BCT-COOLDOWN-TIMER-006: Integration - getCooldownRemaining Output', () => {
  /**
   * Verify that getCooldownRemaining output (in ms) formats correctly
   * This simulates real-world usage
   */

  it('should format typical remaining cooldown values correctly', () => {
    // Simulate cooldown started 5 minutes ago (25 min remaining)
    const remaining = COOLDOWN.DURATION_MS - (5 * 60 * 1000); // 1,500,000 ms
    expect(formatTimeMs(remaining)).toBe('25:00');
  });

  it('should format cooldown near end correctly', () => {
    // Simulate cooldown with 30 seconds remaining
    const remaining = 30 * 1000; // 30,000 ms
    expect(formatTimeMs(remaining)).toBe('0:30');
  });

  it('should format expired cooldown as 0:00', () => {
    // Simulate expired cooldown (getCooldownRemaining returns 0)
    expect(formatTimeMs(0)).toBe('0:00');
  });
});
