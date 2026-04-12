import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('cover page loads and links to intro', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Disciplina');
    const link = page.locator('a[href="/es/intro"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/es\/intro/);
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/es/intro');
    // Use the desktop sidebar specifically (not bottom nav)
    const sidebarLink = page.locator('[data-testid="sidebar"] a[href="/es/chapter-1"]');
    await expect(sidebarLink).toBeVisible();
    await sidebarLink.click();
    await expect(page).toHaveURL(/\/es\/chapter-1/);
  });

  test('bottom nav prev/next works', async ({ page }) => {
    await page.goto('/es/chapter-1');
    // Scroll up to reveal the bottom nav
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    const nextLink = page.locator('[data-testid="nav-next"]');
    await expect(nextLink).toBeVisible();
    await nextLink.click();
    await expect(page).toHaveURL(/\/es\/chapter-2/);
  });

  test('all chapter pages load without errors', async ({ page }) => {
    const pages = ['intro', 'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'conclusion', 'about'];
    for (const slug of pages) {
      const response = await page.goto(`/es/${slug}`);
      expect(response?.status()).toBe(200);
    }
  });

  test('journal page loads', async ({ page }) => {
    await page.goto('/es/diario');
    await expect(page.locator('h1')).toContainText('Diario');
  });
});
