// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lucchese Product Page Tests', () => {
  
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Priscilla Suede - Lucchese/);
  });

  test('main product name is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); 
    await expect(page.locator('h1:has-text("LUCCHESE")')).toBeVisible();
  });

  test('product images are displayed', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const images = page.locator('img').first();
    await expect(images).toBeVisible();
  });

  test('size selection button exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const sizeButton = page.locator('button').filter({ hasText: /Size|Choose/ });
    await expect(sizeButton.first()).toBeVisible();
  });

});