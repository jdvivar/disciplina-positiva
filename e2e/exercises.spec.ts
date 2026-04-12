import { test, expect } from '@playwright/test';

test.describe('Exercises', () => {
  test('exercise cards render on chapter pages', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const exercises = page.locator('.exercise-card');
    await expect(exercises.first()).toBeVisible();
  });

  test('can fill and save a numbered-list exercise', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const card = page.locator('.exercise-card').first();
    // Fill the first numbered input
    await card.locator('input[type="text"]').first().fill('Mi primera respuesta');
    await card.locator('button', { hasText: 'Guardar' }).click();
    // Verify saved indicator appears (date text near the button)
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();
  });

  test('exercise progress persists after reload', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type="text"]').first().fill('Respuesta persistente');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.reload();

    const reloadedInput = page.locator('.exercise-card').first().locator('input[type="text"]').first();
    await expect(reloadedInput).toHaveValue('Respuesta persistente');
  });

  test('exercise shows saved timestamp after saving', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type="text"]').first().fill('Test para guardar');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();
  });

  test('guided-list exercise allows adding items', async ({ page }) => {
    // Guided-list exercises are on age sub-pages in chapter 4
    await page.goto('/es/chapter-4/0-a-6-meses');
    const card = page.locator('.exercise-card').first();
    const input = card.locator('input[type="text"]');
    await input.fill('Primer motivo');
    await card.locator('button', { hasText: 'Agregar' }).click();
    await expect(card.locator('li')).toHaveCount(1);
  });

  test('exercise heading links are anchors', async ({ page }) => {
    await page.goto('/es/chapter-1');
    const exerciseLink = page.locator('.exercise-card h3 a').first();
    const href = await exerciseLink.getAttribute('href');
    expect(href).toMatch(/^#/);
  });
});
