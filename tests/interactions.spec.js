// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lucchese Product Page - Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.Alpine);
    await page.waitForSelector('[x-text="product.name"]', { timeout: 10000 });
    
    // Wait for product data to fully load
    await page.waitForFunction(() => {
      const nameElement = document.querySelector('[x-text="product.name"]');
      return nameElement && nameElement.textContent && nameElement.textContent !== 'Loading...';
    });
  });

  test('should display and navigate product image gallery', async ({ page }) => {
    // Wait for images to load
    await page.waitForSelector('img[alt*="Priscilla"]', { timeout: 10000 });
    
    // Check if main image is visible
    const mainImage = page.locator('.aspect-square img').first();
    await expect(mainImage).toBeVisible();
    
    // Check if thumbnail images are present
    const thumbnails = page.locator('.grid.grid-cols-4 img');
    await expect(thumbnails).toHaveCount(4);
    
    // Test thumbnail navigation
    const secondThumbnail = thumbnails.nth(1);
    const mainImageSrcBefore = await mainImage.getAttribute('src');
    
    await secondThumbnail.click();
    await page.waitForTimeout(500); // Wait for image change
    
    const mainImageSrcAfter = await mainImage.getAttribute('src');
    expect(mainImageSrcBefore).not.toBe(mainImageSrcAfter);
  });

  test('should allow color selection and update display', async ({ page }) => {
    // Wait for color options to be available
    await page.waitForSelector('[\\@click="selectedColor = color"]', { timeout: 10000 });
    
    // Get color options
    const colorOptions = page.locator('[\\@click="selectedColor = color"]');
    const colorCount = await colorOptions.count();
    
    if (colorCount > 1) {
      // Get initial color
      const initialColorText = await page.locator('[x-text*="selectedColor"]').textContent();
      
      // Click on second color option
      await colorOptions.nth(1).click();
      await page.waitForTimeout(500);
      
      // Verify color changed
      const newColorText = await page.locator('[x-text*="selectedColor"]').textContent();
      expect(newColorText).not.toBe(initialColorText);
    }
  });

  test('should open size selection modal and allow size picking', async ({ page }) => {
    // Click on the size selection button
    const sizeButton = page.locator('[\\@click="showSizeModal = true"]');
    await expect(sizeButton).toBeVisible();
    await sizeButton.click();
    
    // Check if modal is visible
    await expect(page.locator('[x-show="showSizeModal"]')).toBeVisible();
    
    // Check if size options are present
    const sizeOptions = page.locator('[\\@click="selectSize(size)"]');
    await expect(sizeOptions.first()).toBeVisible();
    
    // Select a size
    const firstSize = sizeOptions.first();
    const sizeText = await firstSize.textContent();
    
    await firstSize.click();
    
    // Verify modal closed
    await expect(page.locator('[x-show="showSizeModal"]')).not.toBeVisible();
    
    // Check if the size button shows the selected size
    await expect(sizeButton).toContainText(`Size ${sizeText}`);
  });

  test('should allow width selection with visual feedback', async ({ page }) => {
    // Wait for width options
    await page.waitForSelector('[\\@click="selectedWidth = width"]', { timeout: 10000 });
    
    // Get width options
    const widthOptions = page.locator('[\\@click="selectedWidth = width"]');
    const widthCount = await widthOptions.count();
    
    expect(widthCount).toBeGreaterThan(0);
    
    // Click on a different width option (not the first one which might be selected)
    if (widthCount > 1) {
      await widthOptions.nth(1).click();
      await page.waitForTimeout(500);
      
      // Verify selection (visual change in button state)
      await expect(widthOptions.nth(1)).toHaveClass(/bg-gray-900/);
    }
  });
});