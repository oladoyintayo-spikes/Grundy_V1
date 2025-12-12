/**
 * BCT-INV-017: Use on Pet E2E Tests
 *
 * Tests the "Use on Pet" flow from Inventory to feeding:
 * - Detail modal closes after clicking "Use on Pet"
 * - Inventory modal closes after clicking "Use on Pet"
 * - Preselection banner is visible on Home
 * - "Feed Now" clears the banner
 * - "X" clear button clears the banner
 *
 * Bible v1.6 / BCT v2.2
 * @see docs/GRUNDY_MASTER_BIBLE.md
 * @see docs/BIBLE_COMPLIANCE_TEST.md
 */
import { test, expect } from '@playwright/test';

test.describe('BCT-INV-017: Use on Pet', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset state
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should close modals and show preselection banner after clicking Use on Pet', async ({ page }) => {
    // First ensure we have items in inventory by buying food
    // Open shop
    await page.getByTestId('shop-button').click();
    await page.waitForTimeout(300);

    // Buy an item (click the first available food)
    const firstShopItem = page.locator('button:has-text("🍎")').first();
    if (await firstShopItem.isVisible()) {
      await firstShopItem.click();
      await page.waitForTimeout(200);
    }

    // Close shop
    await page.locator('button:has-text("×")').first().click();
    await page.waitForTimeout(300);

    // Open inventory
    await page.getByTestId('inventory-button').click();
    await page.waitForTimeout(300);

    // Verify inventory modal is visible
    await expect(page.getByTestId('inventory-modal')).toBeVisible();

    // Click on an inventory item to open detail modal
    const itemCard = page.getByTestId('inventory-item-card').first();
    if (await itemCard.isVisible()) {
      await itemCard.click();
      await page.waitForTimeout(300);

      // Verify detail modal is visible
      await expect(page.getByTestId('inventory-detail-modal')).toBeVisible();

      // Click "Use on Pet" button
      await page.getByTestId('inventory-use-on-pet').click();
      await page.waitForTimeout(500);

      // Verify detail modal is closed
      await expect(page.getByTestId('inventory-detail-modal')).not.toBeVisible();

      // Verify inventory modal is closed
      await expect(page.getByTestId('inventory-modal')).not.toBeVisible();

      // Verify preselection banner is visible
      await expect(page.getByTestId('feed-preselected-item')).toBeVisible();
    }
  });

  test('should clear preselection banner when clicking Feed Now', async ({ page }) => {
    // Setup: Buy food and select it from inventory
    await page.getByTestId('shop-button').click();
    await page.waitForTimeout(300);

    const firstShopItem = page.locator('button:has-text("🍎")').first();
    if (await firstShopItem.isVisible()) {
      await firstShopItem.click();
      await page.waitForTimeout(200);
    }

    await page.locator('button:has-text("×")').first().click();
    await page.waitForTimeout(300);

    await page.getByTestId('inventory-button').click();
    await page.waitForTimeout(300);

    const itemCard = page.getByTestId('inventory-item-card').first();
    if (await itemCard.isVisible()) {
      await itemCard.click();
      await page.waitForTimeout(300);

      await page.getByTestId('inventory-use-on-pet').click();
      await page.waitForTimeout(500);

      // Verify preselection banner is visible
      await expect(page.getByTestId('feed-preselected-item')).toBeVisible();

      // Click "Feed Now" button
      await page.getByTestId('feed-now-button').click();
      await page.waitForTimeout(500);

      // Verify preselection banner is cleared
      await expect(page.getByTestId('feed-preselected-item')).not.toBeVisible();
    }
  });

  test('should clear preselection banner when clicking X clear button', async ({ page }) => {
    // Setup: Buy food and select it from inventory
    await page.getByTestId('shop-button').click();
    await page.waitForTimeout(300);

    const firstShopItem = page.locator('button:has-text("🍎")').first();
    if (await firstShopItem.isVisible()) {
      await firstShopItem.click();
      await page.waitForTimeout(200);
    }

    await page.locator('button:has-text("×")').first().click();
    await page.waitForTimeout(300);

    await page.getByTestId('inventory-button').click();
    await page.waitForTimeout(300);

    const itemCard = page.getByTestId('inventory-item-card').first();
    if (await itemCard.isVisible()) {
      await itemCard.click();
      await page.waitForTimeout(300);

      await page.getByTestId('inventory-use-on-pet').click();
      await page.waitForTimeout(500);

      // Verify preselection banner is visible
      await expect(page.getByTestId('feed-preselected-item')).toBeVisible();

      // Click "X" clear button
      await page.getByTestId('feed-clear-preselection').click();
      await page.waitForTimeout(300);

      // Verify preselection banner is cleared (without feeding)
      await expect(page.getByTestId('feed-preselected-item')).not.toBeVisible();
    }
  });
});
