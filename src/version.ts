// ============================================
// GRUNDY — VERSION
// Web Edition version tracking
// ============================================

/**
 * Grundy Web Edition version
 *
 * Follows semver: MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes or major feature releases
 * - MINOR: New features, backwards compatible
 * - PATCH: Bug fixes, backwards compatible
 */
export const GRUNDY_WEB_VERSION = '1.1.0';

/**
 * Version metadata
 */
export const VERSION_INFO = {
  version: GRUNDY_WEB_VERSION,
  edition: 'Web',
  codename: 'Phase 10 Complete',
  releaseDate: '2025-12-14',
} as const;
