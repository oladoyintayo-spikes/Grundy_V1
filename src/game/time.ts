/**
 * P10-A: Deterministic time hook for testing.
 * Bible v1.8 §9.4.7: Supports offline calculation and time-based triggers.
 *
 * Usage:
 *   import { nowMs, setTimeProvider } from './time';
 *
 *   // Production: uses Date.now() by default
 *   const currentTime = nowMs();
 *
 *   // Testing: inject a fixed clock
 *   setTimeProvider(() => 1700000000000);
 *   const fixedTime = nowMs(); // always returns 1700000000000
 *
 *   // Reset to real time
 *   setTimeProvider(null);
 */

/** Type for custom time provider function */
type TimeProvider = () => number;

/** Internal time provider - defaults to Date.now */
let _timeProvider: TimeProvider = () => Date.now();

/**
 * Get the current time in milliseconds.
 * Uses the configured time provider (default: Date.now).
 */
export function nowMs(): number {
  return _timeProvider();
}

/**
 * Set a custom time provider for testing.
 * Pass null to reset to the default (Date.now).
 *
 * @param provider - Custom time function or null to reset
 */
export function setTimeProvider(provider: TimeProvider | null): void {
  _timeProvider = provider ?? (() => Date.now());
}

/**
 * Reset the time provider to the default (Date.now).
 * Convenience function for test cleanup.
 */
export function resetTimeProvider(): void {
  _timeProvider = () => Date.now();
}
