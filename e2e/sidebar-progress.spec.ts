import { test, expect } from '@playwright/test';

test.describe('Sidebar progress', () => {
  test('active chapter shows sub-pages in sidebar', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Sub-pages should be listed under the active chapter
    await expect(sidebar.getByText('Imagínese lo siguiente', { exact: true })).toBeVisible();
  });

  test('current sub-page shows exercise list in sidebar', async ({ page }) => {
    await page.goto('/es/chapter-1/imagina', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Should show the exercise on this sub-page
    await expect(sidebar.getByText('Objetivos de ser padres', { exact: true })).toBeVisible();
  });

  test('non-current chapter does not show sub-pages', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Chapter 2 sub-pages should not be visible
    await expect(sidebar.getByText('Dando calidez')).not.toBeVisible();
  });

  test('exercise shows empty circle when pending', async ({ page }) => {
    await page.goto('/es/chapter-1/imagina', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseItem = sidebar.locator('a[href*="#parenting-goals-2"]');
    // Should have an empty circle (pending indicator)
    await expect(exerciseItem.locator('[data-testid="exercise-pending"]')).toBeVisible();
  });

  test('exercise shows filled dot and checkmark when completed', async ({ page }) => {
    await page.goto('/es/chapter-1/imagina', { waitUntil: 'networkidle' });
    // Complete the exercise on this sub-page
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type="text"]').first().fill('Test sidebar progress');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    // Sidebar should now show filled dot and checkmark for that exercise
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseItem = sidebar.locator('a[href*="#parenting-goals-2"]');
    await expect(exerciseItem.locator('[data-testid="exercise-done"]').first()).toBeVisible();
    await expect(exerciseItem.getByText('✓')).toBeVisible();
  });

  test('chapter shows checkmark when all exercises completed and all pages read', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Mark all pages as read by scrolling to bottom and clicking next on each
    // Page 1: /es/chapter-1 (has exercise parents-1)
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const card1 = page.locator('.exercise-card').first();
    await card1.locator('input[type="text"]').first().fill('Respuesta 1');
    await card1.locator('button', { hasText: 'Guardar' }).click();
    await expect(card1.locator('[data-testid="saved-at"]')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/chapter-1\/imagina/);

    // Page 2: /es/chapter-1/imagina (has exercise parenting-goals-2)
    await page.waitForLoadState('networkidle');
    const card2 = page.locator('.exercise-card').first();
    await card2.locator('input[type="text"]').first().fill('Respuesta 2');
    await card2.locator('button', { hasText: 'Guardar' }).click();
    await expect(card2.locator('[data-testid="saved-at"]')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/chapter-1\/como-satisfacer/);

    // Page 3: /es/chapter-1/como-satisfacer (no exercises, just needs to be read)
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/chapter-2/);

    // Go back and check the chapter-1 link has a checkmark
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const chapterLink = sidebar.locator('a[href="/es/chapter-1"]');
    await expect(chapterLink.getByText('✓')).toBeVisible();
  });

  test('chapter does NOT show checkmark with partial progress', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Complete only the first exercise on the index page
    const card1 = page.locator('.exercise-card').first();
    await card1.locator('input[type="text"]').first().fill('Solo una');
    await card1.locator('button', { hasText: 'Guardar' }).click();
    await expect(card1.locator('[data-testid="saved-at"]')).toBeVisible();

    // Chapter 1 link should NOT have a checkmark yet (sub-pages not read, second exercise not done)
    const chapterLink = sidebar.locator('a[href="/es/chapter-1"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();
  });

  test('intro gets checkmark after reading all sub-pages', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Visit intro and scroll to bottom, click next
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const chapterLink = sidebar.locator('a[href="/es/intro"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    await page.locator('[data-testid="nav-next"]').click();
    // Next is now /es/intro/para-quien (not /es/chapter-1)
    await expect(page).toHaveURL(/\/es\/intro\/para-quien/);

    // Read para-quien
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/intro\/como-esta-organizado/);

    // Read como-esta-organizado
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    await page.locator('[data-testid="nav-next"]').click();
    await expect(page).toHaveURL(/\/es\/chapter-1/);

    // Go back to intro and check sidebar
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const chapterLinkAfter = page.locator('[data-testid="sidebar"] a[href="/es/intro"]');
    await expect(chapterLinkAfter.getByText('✓')).toBeVisible();
  });

  test('conclusion chapter gets checkmark after scrolling and clicking next', async ({ page }) => {
    await page.goto('/es/conclusion', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');

    const chapterLink = sidebar.locator('a[href="/es/conclusion"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);

    // Click next
    const nextBtn = page.locator('[data-testid="nav-next"]');
    await nextBtn.click();
    await expect(page).toHaveURL(/\/es\/diario/);

    // Check sidebar on another page
    await page.goto('/es/conclusion', { waitUntil: 'networkidle' });
    const chapterLinkAfter = page.locator('[data-testid="sidebar"] a[href="/es/conclusion"]');
    await expect(chapterLinkAfter.getByText('✓')).toBeVisible();
  });

  test('intro does NOT get checkmark if user navigates without scrolling to bottom', async ({ page }) => {
    // Visit intro but navigate away without scrolling to bottom
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });

    // Go back and check — should NOT have checkmark
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const chapterLink = page.locator('[data-testid="sidebar"] a[href="/es/intro"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();
  });

  test('exercise links in sidebar navigate to exercise on sub-page', async ({ page }) => {
    await page.goto('/es/chapter-1/imagina', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseLink = sidebar.locator('a[href*="#parenting-goals-2"]');
    await exerciseLink.click();
    await expect(page).toHaveURL(/chapter-1\/imagina#parenting-goals-2/);
  });
});
