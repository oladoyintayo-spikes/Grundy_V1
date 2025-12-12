/**
 * Bible Compliance E2E Tests
 *
 * These tests verify that the running application complies with
 * GRUNDY_MASTER_BIBLE v1.6 / BCT v2.2 specifications.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5173';
const MOBILE_VIEWPORT = { width: 390, height: 844 };

/**
 * Test IDs should match those defined in bible.constants.ts
 * Components must add these data-testid attributes for E2E testing
 */
const TEST_ID = {
  GLOBAL_NAV: 'global-nav',
  NAV_HOME: 'nav-home',
  NAV_GAMES: 'nav-games',
  NAV_SETTINGS: 'nav-settings',
  HUD_BOND: 'hud-bond',
  HUD_COINS: 'hud-coins',
  HUD_GEMS: 'hud-gems',
  ACTIVE_PET: 'active-pet',
  FEED_BUTTON: 'feed-button',
  PLAY_BUTTON: 'play-button',
  DEBUG_HUD: 'debug-hud',
  DEBUG_PANEL: 'debug-panel',
  FTUE_LORE: 'ftue-lore',
  FTUE_SCREEN: 'ftue-screen',
  ROOM_BACKGROUND: 'room-background',
};

test.describe('BCT-HUD-01: Bond visible, debug hidden', () => {
  test('should show bond indicator in HUD', async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Bond should be visible (Bible §4.4: "Bond is visible")
    await expect(page.getByTestId(TEST_ID.HUD_BOND)).toBeVisible();
  });

  test('should NOT show debug HUD in production', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Debug HUD should not be visible in production (Bible §4.4: "Debug counters: Dev builds only")
    await expect(page.getByTestId(TEST_ID.DEBUG_HUD)).not.toBeVisible();
  });

  test('should NOT show debug panel in production', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.DEBUG_PANEL)).not.toBeVisible();
  });
});

test.describe('BCT-NAV-01: Navigation accessible', () => {
  test('should show global navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.GLOBAL_NAV)).toBeVisible();
  });

  test('should show home nav button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.NAV_HOME)).toBeVisible();
  });

  test('should show games nav button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.NAV_GAMES)).toBeVisible();
  });

  test('should show settings nav button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.NAV_SETTINGS)).toBeVisible();
  });
});

test.describe('BCT-PET-01: Single active pet', () => {
  test('should show active pet on main screen', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.ACTIVE_PET)).toBeVisible();
  });

  test('should show feed button for pet interaction', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.FEED_BUTTON)).toBeVisible();
  });
});

test.describe('BCT-MOBILE-01: No scroll required (Bible §14.6)', () => {
  test('should fit pet in mobile viewport', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Active pet should be in viewport without scrolling
    await expect(page.getByTestId(TEST_ID.ACTIVE_PET)).toBeInViewport();
  });

  test('should fit feed button in mobile viewport', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Feed button should be in viewport without scrolling
    await expect(page.getByTestId(TEST_ID.FEED_BUTTON)).toBeInViewport();
  });

  test('should fit navigation in mobile viewport', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Navigation should be in viewport without scrolling
    await expect(page.getByTestId(TEST_ID.GLOBAL_NAV)).toBeInViewport();
  });

  test('should not require horizontal scroll', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check that body doesn't overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);
  });
});

test.describe('BCT-CURRENCY-01: Currency display', () => {
  test('should show coins in HUD', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.HUD_COINS)).toBeVisible();
  });

  test('should show gems in HUD', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId(TEST_ID.HUD_GEMS)).toBeVisible();
  });
});

// Note: FTUE tests would run on a fresh/new user session
test.describe('BCT-FTUE-E2E: First Time User Experience', () => {
  test.skip('should display FTUE screen for new users', async ({ page }) => {
    // This test requires a way to clear user state
    // Skip by default as it requires special setup
    await page.goto(BASE_URL);

    await expect(page.getByTestId(TEST_ID.FTUE_SCREEN)).toBeVisible();
  });

  test.skip('should display correct lore text in FTUE', async ({ page }) => {
    // This test requires a way to access FTUE state
    await page.goto(BASE_URL);

    const loreElement = page.getByTestId(TEST_ID.FTUE_LORE);
    await expect(loreElement).toBeVisible();

    const loreText = await loreElement.textContent();
    expect(loreText).toContain('Sometimes, when a big feeling is left behind');
    expect(loreText).toContain('A tiny spirit called a Grundy wakes up');
    expect(loreText).toContain('One of them just found you');
  });
});
