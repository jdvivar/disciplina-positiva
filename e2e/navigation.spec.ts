import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('cover page loads and links to intro', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText('Disciplina');
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

  test('bottom nav prev/next goes to next sub-page', async ({ page }) => {
    await page.goto('/es/chapter-1');
    // Scroll to bottom to reveal the bottom nav
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    const nextLink = page.locator('[data-testid="nav-next"]');
    await expect(nextLink).toBeVisible();
    await nextLink.click();
    // Next page is the first sub-page, not next chapter
    await expect(page).toHaveURL(/\/es\/chapter-1\/imagina/);
  });

  test('all pages load without errors', async ({ page }) => {
    const pages = [
      'intro',
      'intro/para-quien',
      'intro/como-esta-organizado',
      'chapter-1',
      'chapter-1/imagina',
      'chapter-2',
      'chapter-2/calidez',
      'chapter-3',
      'chapter-3/5-a-9-anos',
      'chapter-4',
      'chapter-4/0-a-6-meses',
      'chapter-5',
      'chapter-5/0-a-6-meses',
      'conclusion',
      'about',
    ];
    for (const slug of pages) {
      const response = await page.goto(`/es/${slug}`);
      expect(response?.status()).toBe(200);
    }
  });

  test('journal page loads', async ({ page }) => {
    await page.goto('/es/diario');
    await expect(page.locator('h1').first()).toContainText('Diario');
  });
});
