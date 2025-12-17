/**
 * GRUNDY PAYLOAD HELPERS
 *
 * Safe type coercion utilities for event payload extraction.
 * These handle the Record<string, unknown> shape without type assertions.
 */

/**
 * Safely extract string from payload with fallback.
 *
 * @param payload - Event payload object
 * @param key - Key to extract
 * @param fallback - Default value if key missing or wrong type
 * @returns String value or fallback
 */
export function getString(
  payload: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const value = payload[key];

  if (typeof value === 'string') {
    return value;
  }

  // Coerce non-null/undefined values to string
  if (value !== null && value !== undefined) {
    return String(value);
  }

  return fallback;
}

/**
 * Safely extract number from payload with fallback.
 *
 * @param payload - Event payload object
 * @param key - Key to extract
 * @param fallback - Default value if key missing or wrong type
 * @returns Number value or fallback
 */
export function getNumber(
  payload: Record<string, unknown>,
  key: string,
  fallback: number
): number {
  const value = payload[key];

  // Direct number
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  // String that parses to number
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

/**
 * Safely extract optional string from payload.
 *
 * @param payload - Event payload object
 * @param key - Key to extract
 * @returns String value or undefined
 */
export function getOptionalString(
  payload: Record<string, unknown>,
  key: string
): string | undefined {
  const value = payload[key];

  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

/**
 * Safely extract boolean from payload with fallback.
 *
 * @param payload - Event payload object
 * @param key - Key to extract
 * @param fallback - Default value if key missing or wrong type
 * @returns Boolean value or fallback
 */
export function getBoolean(
  payload: Record<string, unknown>,
  key: string,
  fallback: boolean
): boolean {
  const value = payload[key];

  if (typeof value === 'boolean') {
    return value;
  }

  return fallback;
}
