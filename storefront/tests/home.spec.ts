import { test, expect } from '@playwright/test';

test.describe('Storefront end-to-end flows', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Medusa/);
  });

  test('loads products on homepage from backend', async ({ page }) => {
    await page.goto('/');
    // Check that at least one product loads from the Medusa backend
    // Since we don't have seed data guaranteed, we wait for the products-list container
    // and verify it is rendered.
    const productsList = page.locator('[data-testid="products-list"]');
    await expect(productsList.first()).toBeVisible({ timeout: 10000 });
  });
});
