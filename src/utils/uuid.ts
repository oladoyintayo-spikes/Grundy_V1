/**
 * GRUNDY UUID UTILITY
 *
 * UUID generation with deterministic behavior in tests.
 * Per spec: No Math.random() in store logic; use counter in test env.
 *
 * @see Phase 12-0 Spec: UUID deterministic in test env
 */

let __idCounter = 0;

/**
 * Detect test environment.
 *
 * Checks both Node.js and Vite test environment indicators.
 */
function isTestEnv(): boolean {
  // Node.js test environment (vitest, jest)
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return true;
  }

  // Vite test environment
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as { env?: { MODE?: string } }).env;
    if (env?.MODE === 'test') {
      return true;
    }
  }

  return false;
}

/**
 * Generate a unique ID.
 *
 * - In test environments: deterministic counter-based IDs
 * - In production: crypto.randomUUID()
 *
 * This ensures test determinism while maintaining uniqueness in production.
 */
export function generateUUID(): string {
  // ALWAYS use counter in test env for determinism
  if (isTestEnv()) {
    __idCounter += 1;
    return `notif-${__idCounter}`;
  }

  // Production: use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  // (should never hit in modern browsers)
  __idCounter += 1;
  return `notif-fallback-${__idCounter}`;
}

/**
 * Reset ID counter.
 *
 * ONLY for use in tests to ensure deterministic starting state.
 * Calling this in production code is a bug.
 */
export function __resetUUIDCounterForTests(): void {
  __idCounter = 0;
}
