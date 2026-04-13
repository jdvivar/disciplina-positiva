import { test, expect } from '@playwright/test';

test.describe('Plant ornament', () => {
  test('plant ornament SVG is visible on /es/intro', async ({ page }) => {
    await page.goto('/es/intro');
    const svg = page.locator('[data-testid="plant-ornament"] svg');
    await expect(svg).toBeVisible();
  });

  test('plant ornament SVG is visible on /es/conclusion', async ({ page }) => {
    await page.goto('/es/conclusion');
    const svg = page.locator('[data-testid="plant-ornament"] svg');
    await expect(svg).toBeVisible();
  });

  test('plant ornament SVG is NOT visible on /es/about', async ({ page }) => {
    await page.goto('/es/about');
    const svg = page.locator('[data-testid="plant-ornament"] svg');
    await expect(svg).not.toBeVisible();
  });

  test('plant SVG is smaller on early page than on later page', async ({ page }) => {
    await page.goto('/es/intro');
    const introSvg = page.locator('[data-testid="plant-ornament"] svg');
    const introWidth = await introSvg.getAttribute('width');

    await page.goto('/es/conclusion');
    const conclusionSvg = page.locator('[data-testid="plant-ornament"] svg');
    const conclusionWidth = await conclusionSvg.getAttribute('width');

    expect(Number(introWidth)).toBeLessThan(Number(conclusionWidth));
  });
});

test.describe('Short page bottom nav', () => {
  test('next button is visible without scrolling on short page /es/chapter-2', async ({ page }) => {
    await page.goto('/es/chapter-2', { waitUntil: 'networkidle' });
    const nextButton = page.locator('[data-testid="nav-next"]');
    await expect(nextButton).toBeVisible();
  });
});

test.describe('Illustrations', () => {
  test('/es/intro has the intro illustration', async ({ page }) => {
    await page.goto('/es/intro');
    const img = page.locator('img[src*="/illustrations/intro.webp"]');
    await expect(img).toBeVisible();
  });

  test('/es/chapter-1 has the chapter-1 illustration', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const img = page.locator('img[src*="/illustrations/chapter-1.webp"]');
    await expect(img).toBeVisible();
  });
});
