// ============================================
// GRUNDY — DATE KEY UTILITY
// Phase 11-0: Deterministic date handling for gem sources
// ============================================

/**
 * Test-only override for the local date key.
 * When set, getLocalDateKey() returns this value instead of actual date.
 * Set to null to restore normal behavior.
 */
let testDateKeyOverride: string | null = null;

/**
 * Set a test override for getLocalDateKey().
 * ONLY for use in tests - allows deterministic date testing.
 *
 * @param dateKey - The date key to return (YYYY-MM-DD format), or null to clear override
 */
export function __setTestDateKey(dateKey: string | null): void {
  testDateKeyOverride = dateKey;
}

/**
 * Get the current local date as a YYYY-MM-DD string.
 * Uses player's local timezone for calendar day calculation.
 *
 * All daily logic (first feed gem, login streak) MUST use this function
 * instead of direct Date construction to ensure testability.
 *
 * @returns Date string in YYYY-MM-DD format (e.g., "2025-12-15")
 */
export function getLocalDateKey(): string {
  if (testDateKeyOverride !== null) {
    return testDateKeyOverride;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if dateKeyA is exactly one day before dateKeyB.
 * Used for login streak consecutive day detection.
 *
 * @param dateKeyA - The earlier date key (YYYY-MM-DD)
 * @param dateKeyB - The later date key (YYYY-MM-DD)
 * @returns true if dateKeyA is exactly yesterday relative to dateKeyB
 */
export function isYesterday(dateKeyA: string | null, dateKeyB: string): boolean {
  if (!dateKeyA) return false;

  // Parse dates (treating as local dates)
  const [yearA, monthA, dayA] = dateKeyA.split('-').map(Number);
  const [yearB, monthB, dayB] = dateKeyB.split('-').map(Number);

  // Create Date objects at noon to avoid DST issues
  const dateA = new Date(yearA, monthA - 1, dayA, 12, 0, 0);
  const dateB = new Date(yearB, monthB - 1, dayB, 12, 0, 0);

  // Calculate difference in days
  const diffMs = dateB.getTime() - dateA.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays === 1;
}

/**
 * Check if two date keys represent the same calendar day.
 *
 * @param dateKeyA - First date key (YYYY-MM-DD)
 * @param dateKeyB - Second date key (YYYY-MM-DD)
 * @returns true if both represent the same day
 */
export function isSameDay(dateKeyA: string | null, dateKeyB: string | null): boolean {
  if (!dateKeyA || !dateKeyB) return false;
  return dateKeyA === dateKeyB;
}
