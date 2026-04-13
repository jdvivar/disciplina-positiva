import { test, expect } from '@playwright/test';

test.describe('Sub-page navigation', () => {
  test('navigates through intro sub-pages and crosses chapter boundary', async ({ page }) => {
    await page.goto('/es/intro', { waitUntil: 'networkidle' });

    // Scroll to bottom so the bottom nav appears, then click next
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/intro\/para-quien/);

    // Navigate to next sub-page
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/intro\/como-esta-organizado/);

    // Navigate across chapter boundary to chapter-1
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/chapter-1/);
  });

  test('sidebar shows sub-pages only for active chapter', async ({ page }) => {
    // Visit chapter-1 — its sub-pages should appear in the sidebar
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar.locator('a[href*="/chapter-1/imagina"]')).toBeVisible();
    await expect(sidebar.locator('a[href*="/chapter-1/como-satisfacer"]')).toBeVisible();

    // Visit chapter-2 — chapter-1 sub-pages should disappear, chapter-2 sub-pages should appear
    await page.goto('/es/chapter-2', { waitUntil: 'networkidle' });
    await expect(sidebar.locator('a[href*="/chapter-1/imagina"]')).not.toBeVisible();
    await expect(sidebar.locator('a[href*="/chapter-1/como-satisfacer"]')).not.toBeVisible();
    await expect(sidebar.locator('a[href*="/chapter-2/calidez"]')).toBeVisible();
  });

  test('reading one sub-page does not add checkmark to chapter', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Start at intro, read first sub-page only
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/intro\/para-quien/);

    // Go back to intro via sidebar — chapter checkmark should NOT be present yet
    await page.waitForLoadState('networkidle');
    const introLink = sidebar.locator('a[href="/es/intro"]');
    await introLink.click();
    await expect(page).toHaveURL(/\/es\/intro/);
    await page.waitForLoadState('networkidle');

    const chapterLink = page.locator('[data-testid="sidebar"] a[href="/es/intro"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();
  });

  test('all sub-page URLs return 200', async ({ page }) => {
    const slugs = [
      'intro',
      'intro/para-quien',
      'intro/como-esta-organizado',
      'chapter-1',
      'chapter-1/imagina',
      'chapter-1/como-satisfacer',
      'chapter-2',
      'chapter-2/calidez',
      'chapter-2/estructura',
      'chapter-3',
      'chapter-3/0-a-6-meses',
      'chapter-3/6-a-12-meses',
      'chapter-3/1-a-2-anos',
      'chapter-3/2-a-3-anos',
      'chapter-3/3-a-5-anos',
      'chapter-3/5-a-9-anos',
      'chapter-3/temperamento',
      'chapter-4',
      'chapter-4/0-a-6-meses',
      'chapter-4/6-a-12-meses',
      'chapter-4/1-a-2-anos',
      'chapter-4/2-a-3-anos',
      'chapter-4/3-a-5-anos',
      'chapter-4/5-a-9-anos',
      'chapter-5',
      'chapter-5/0-a-6-meses',
      'chapter-5/6-a-12-meses',
      'chapter-5/1-a-2-anos',
      'chapter-5/2-a-3-anos',
      'chapter-5/3-a-5-anos',
      'chapter-5/otras-situaciones',
      'conclusion',
      'about',
    ];

    for (const slug of slugs) {
      const response = await page.goto(`/es/${slug}`);
      expect(response?.status(), `Expected 200 for /es/${slug}`).toBe(200);
    }
  });

  test('sidebar sub-page link navigates to the correct sub-page', async ({ page }) => {
    await page.goto('/es/chapter-3', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    const subPageLink = sidebar.locator('a[href*="/chapter-3/0-a-6-meses"]');
    await expect(subPageLink).toBeVisible();
    await subPageLink.click();
    await expect(page).toHaveURL(/\/es\/chapter-3\/0-a-6-meses/);
  });
});
