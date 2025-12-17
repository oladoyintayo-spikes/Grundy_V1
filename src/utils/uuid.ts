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
 * Checks Node.js and Vite/Vitest environment indicators.
 * Must catch VITEST env var since Vitest may not set NODE_ENV.
 */
function isTestEnv(): boolean {
  const proc = typeof process !== 'undefined' ? process : undefined;
  const meta = typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string | boolean | undefined> }) : undefined;

  return Boolean(
    proc?.env?.NODE_ENV === 'test' ||
    proc?.env?.VITEST ||                  // Vitest sets VITEST=true
    meta?.env?.MODE === 'test' ||
    meta?.env?.VITEST
  );
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
