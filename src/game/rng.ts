/**
 * P10-A: Deterministic RNG hook for testing.
 * Bible v1.8 §9.4.7: Supports deterministic sickness chance rolls.
 *
 * Usage:
 *   import { randomFloat, setRngProvider, createSequenceRng } from './rng';
 *
 *   // Production: uses Math.random() by default
 *   const roll = randomFloat(); // 0 <= roll < 1
 *
 *   // Testing: inject a fixed value
 *   setRngProvider(() => 0.5);
 *   const fixedRoll = randomFloat(); // always returns 0.5
 *
 *   // Testing: inject a sequence
 *   setRngProvider(createSequenceRng([0.1, 0.9, 0.5]));
 *   randomFloat(); // returns 0.1
 *   randomFloat(); // returns 0.9
 *   randomFloat(); // returns 0.5
 *   randomFloat(); // returns 0.1 (cycles)
 *
 *   // Reset to real randomness
 *   setRngProvider(null);
 */

/** Type for custom RNG provider function */
type RngProvider = () => number;

/** Internal RNG provider - defaults to Math.random */
let _rngProvider: RngProvider = () => Math.random();

/**
 * Get a random float in the range [0, 1).
 * Uses the configured RNG provider (default: Math.random).
 */
export function randomFloat(): number {
  return _rngProvider();
}

/**
 * Set a custom RNG provider for testing.
 * Pass null to reset to the default (Math.random).
 *
 * @param provider - Custom RNG function or null to reset
 */
export function setRngProvider(provider: RngProvider | null): void {
  _rngProvider = provider ?? (() => Math.random());
}

/**
 * Reset the RNG provider to the default (Math.random).
 * Convenience function for test cleanup.
 */
export function resetRngProvider(): void {
  _rngProvider = () => Math.random();
}

/**
 * Create a deterministic RNG that cycles through a sequence of values.
 * Useful for predictable test scenarios.
 *
 * @param sequence - Array of float values to cycle through
 * @returns RNG provider function
 */
export function createSequenceRng(sequence: number[]): RngProvider {
  if (sequence.length === 0) {
    throw new Error('RNG sequence must have at least one value');
  }
  let index = 0;
  return () => {
    const value = sequence[index];
    index = (index + 1) % sequence.length;
    return value;
  };
}
