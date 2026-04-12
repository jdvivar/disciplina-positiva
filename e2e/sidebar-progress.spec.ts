import { test, expect } from '@playwright/test';

test.describe('Sidebar progress', () => {
  test('current chapter shows exercise list', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Should show exercises for chapter 1
    await expect(sidebar.getByText('Ser padres', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Objetivos de ser padres', { exact: true })).toBeVisible();
  });

  test('non-current chapter does not show exercise list', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Chapter 2 exercises should not be visible
    await expect(sidebar.getByText('Dando calidez')).not.toBeVisible();
  });

  test('exercise shows empty circle when pending', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseItem = sidebar.locator('a[href*="#parenting-goals-2"]');
    // Should have an empty circle (border only, no bg-sage-600)
    await expect(exerciseItem.locator('[data-testid="exercise-pending"]')).toBeVisible();
  });

  test('exercise shows filled dot and checkmark when completed', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    // Complete the first exercise
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type="text"]').first().fill('Test sidebar progress');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    // Sidebar should now show filled dot and checkmark for that exercise
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseItem = sidebar.locator('a[href*="#parents-1"]');
    await expect(exerciseItem.locator('[data-testid="exercise-done"]').first()).toBeVisible();
    await expect(exerciseItem.getByText('✓')).toBeVisible();
  });

  test('chapter shows checkmark when all exercises completed', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Complete first exercise
    const card1 = page.locator('.exercise-card').first();
    await card1.locator('input[type="text"]').first().fill('Respuesta 1');
    await card1.locator('button', { hasText: 'Guardar' }).click();
    await expect(card1.locator('[data-testid="saved-at"]')).toBeVisible();

    // Complete second exercise
    const card2 = page.locator('.exercise-card').nth(1);
    await card2.locator('input[type="text"]').first().fill('Respuesta 2');
    await card2.locator('button', { hasText: 'Guardar' }).click();
    await expect(card2.locator('[data-testid="saved-at"]')).toBeVisible();

    // Chapter 1 link should now have a checkmark
    const chapterLink = sidebar.locator('a[href="/es/chapter-1"]');
    await expect(chapterLink.getByText('✓')).toBeVisible();
  });

  test('chapter does NOT show checkmark with partial progress', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Complete only the first exercise
    const card1 = page.locator('.exercise-card').first();
    await card1.locator('input[type="text"]').first().fill('Solo una');
    await card1.locator('button', { hasText: 'Guardar' }).click();
    await expect(card1.locator('[data-testid="saved-at"]')).toBeVisible();

    // Chapter 1 link should NOT have a checkmark yet
    const chapterLink = sidebar.locator('a[href="/es/chapter-1"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();
  });

  test('intro chapter gets checkmark after scrolling to bottom and clicking next', async ({ page }) => {
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');

    // Chapter should not have checkmark yet
    const chapterLink = sidebar.locator('a[href="/es/intro"]');
    await expect(chapterLink.getByText('✓')).not.toBeVisible();

    // Scroll to the very bottom
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);

    // Click the next button
    const nextBtn = page.locator('[data-testid="nav-next"]');
    await nextBtn.click();

    // Should be on chapter 1 now
    await expect(page).toHaveURL(/\/es\/chapter-1/);

    // Go back to intro to check the sidebar
    await page.goto('/es/intro', { waitUntil: 'networkidle' });
    const sidebarAfter = page.locator('[data-testid="sidebar"]');
    const chapterLinkAfter = sidebarAfter.locator('a[href="/es/intro"]');
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

  test('exercise links in sidebar navigate to exercise on page', async ({ page }) => {
    await page.goto('/es/chapter-1', { waitUntil: 'networkidle' });
    const sidebar = page.locator('[data-testid="sidebar"]');
    const exerciseLink = sidebar.locator('a[href*="#parents-1"]');
    await exerciseLink.click();
    await expect(page).toHaveURL(/chapter-1#parents-1/);
  });
});
