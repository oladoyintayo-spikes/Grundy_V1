/**
 * Shared time formatting utility for cooldown displays.
 * Bible v1.10: Used by ActionBar, CooldownBanner, FoodDrawer, DebugHud.
 *
 * @param ms - Time in milliseconds
 * @returns Formatted string like "29:15" or "0:00"
 */
export function formatCooldownMs(ms: number): string {
  // Clamp to 0 (never negative)
  const clampedMs = Math.max(0, ms);
  // Convert ms to total seconds
  const totalSeconds = Math.floor(clampedMs / 1000);
  // Cap at 59:59 to prevent absurd display values (cooldown max is 30 min anyway)
  const cappedSeconds = Math.min(totalSeconds, 59 * 60 + 59);
  const mins = Math.floor(cappedSeconds / 60);
  const secs = cappedSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp as relative time string for notification display.
 * Per Phase 12-0: Notifications display relative time (e.g., "5 minutes ago").
 *
 * @param timestampMs - Event timestamp in milliseconds
 * @param nowMs - Current time in milliseconds (deterministic, passed in)
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(timestampMs: number, nowMs: number): string {
  const diffMs = nowMs - timestampMs;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
}
