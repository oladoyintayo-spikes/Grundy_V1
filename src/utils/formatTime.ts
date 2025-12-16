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
