// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lucchese Product Page - Cart & Recommendations', () => {
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

  test('should handle complete Add to Cart workflow', async ({ page }) => {
    // First select a size to enable add to cart
    const sizeButton = page.locator('[\\@click="showSizeModal = true"]');
    await sizeButton.click();
    
    await page.waitForSelector('[x-show="showSizeModal"]', { state: 'visible' });
    
    const sizeOptions = page.locator('[\\@click="selectSize(size)"]');
    await sizeOptions.first().click();
    
    // Now add to cart button should be enabled
    const addToCartButton = page.locator('[\\@click="addToCart()"]');
    await expect(addToCartButton).not.toHaveClass(/bg-gray-300/);
    
    // Click add to cart
    await addToCartButton.click();
    
    // Check for success feedback (button text change)
    await expect(addToCartButton).toContainText(/Added to Cart!/);
  });

  test('should prevent Add to Cart when no size selected', async ({ page }) => {
    // Add to cart button should be disabled initially
    const addToCartButton = page.locator('[\\@click="addToCart()"]');
    await expect(addToCartButton).toHaveClass(/bg-gray-300/);
    
    // Helper text should be visible
    await expect(page.locator('text=Please select a size')).toBeVisible();
  });

  test('should display recommended products section', async ({ page }) => {
    // Wait for recommended products section
    await page.waitForSelector('h2:has-text("You may be interested in")', { timeout: 10000 });
    
    // Check if recommended products are visible
    const recommendedSection = page.locator('section').last();
    await expect(recommendedSection).toContainText('You may be interested in');
    
    // Check if product cards are present
    const productCards = page.locator('[x-for*="recommendedProducts"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display product features and shipping information', async ({ page }) => {
    // Check product details section
    await expect(page.locator('h3:has-text("Product Details")')).toBeVisible();
    
    // Check product description
    const description = page.locator('[x-text*="product.description"]');
    await expect(description).toBeVisible();
    await expect(description).not.toHaveText('Product description loading...');
    
    // Check shipping information
    await expect(page.locator('text=FREE SHIPPING ON ORDERS OVER')).toBeVisible();
    await expect(page.locator('text=DAY RETURN OR EXCHANGE')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Wait for content to load
    await page.waitForSelector('[x-text="product.name"]', { timeout: 10000 });
    
    // Check if page is still functional
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[x-text*="formatPrice"]')).toBeVisible();
    
    // Check if mobile navigation is accessible
    const sizeButton = page.locator('[\\@click="showSizeModal = true"]');
    await expect(sizeButton).toBeVisible();
  });
});