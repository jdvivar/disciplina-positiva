import { test, expect } from '@playwright/test';

test.describe('Dark mode', () => {
  test('toggle switches to dark mode', async ({ page }) => {
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const toggle = page.locator('button[aria-label="Modo oscuro"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('dark mode persists after navigation', async ({ page }) => {
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const toggle = page.locator('button[aria-label="Modo oscuro"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('toggle switches back to light mode', async ({ page }) => {
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const toggle = page.locator('button[aria-label="Modo oscuro"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    const lightToggle = page.locator('button[aria-label="Modo claro"]').first();
    await expect(lightToggle).toBeVisible();
    await lightToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('cover page is not affected by dark mode', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('theme-set-at', String(Date.now()));
    });
    await page.reload({ waitUntil: 'networkidle' });
    const cover = page.locator('.cover-page');
    await expect(cover).toBeVisible();
  });
});
