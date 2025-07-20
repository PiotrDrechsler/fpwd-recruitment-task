// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lucchese Product Page - Basic Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the product page
    await page.goto('/');
    
    // Wait for Alpine.js to initialize
    await page.waitForFunction(() => window.Alpine);
    await page.waitForSelector('[x-text="product.name"]', { timeout: 10000 });
  });

  test('should load the product page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Priscilla Suede - Lucchese/);
    
    // Check if main header is visible
    await expect(page.locator('h1')).toContainText('LUCCHESE');
  });

  test('should display main product information', async ({ page }) => {
    // Wait for product data to load
    await page.waitForFunction(() => {
      const nameElement = document.querySelector('[x-text="product.name"]');
      return nameElement && nameElement.textContent && nameElement.textContent !== 'Loading...';
    });

    // Check if main product elements are visible
    await expect(page.locator('[x-text="product.name"]')).toContainText('Priscilla Suede');
    await expect(page.locator('[x-text*="formatPrice"]')).toBeVisible();
  });

  test('should handle loading states properly', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Loading should disappear after data loads
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
    
    // Main content should be visible
    await expect(page.locator('main')).toBeVisible();
  });
});