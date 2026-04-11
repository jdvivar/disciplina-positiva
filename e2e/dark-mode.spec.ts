import { test, expect } from '@playwright/test';

test.describe('Dark mode', () => {
  test('toggle switches to dark mode', async ({ page }) => {
    await page.goto('/es/intro');
    const toggle = page.locator('button[aria-label="Modo oscuro"]').first();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('dark mode persists after navigation', async ({ page }) => {
    await page.goto('/es/intro');
    await page.locator('button[aria-label="Modo oscuro"]').first().click();
    await page.goto('/es/chapter-1');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('toggle switches back to light mode', async ({ page }) => {
    await page.goto('/es/intro');
    await page.locator('button[aria-label="Modo oscuro"]').first().click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.locator('button[aria-label="Modo claro"]').first().click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('cover page is not affected by dark mode', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('theme-set-at', String(Date.now()));
    });
    await page.reload();
    const cover = page.locator('.cover-page');
    await expect(cover).toBeVisible();
  });
});
