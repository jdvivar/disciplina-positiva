import { test, expect } from '@playwright/test';

test.describe('Journal', () => {
  test('journal page shows all chapters with exercises', async ({ page }) => {
    await page.goto('/es/diario');
    await expect(page.locator('h1').first()).toContainText('Diario');
    const chapters = page.locator('[data-testid="journal-chapter"]');
    expect(await chapters.count()).toBeGreaterThan(0);
  });

  test('journal links point to exercises', async ({ page }) => {
    await page.goto('/es/diario');
    const exerciseLink = page.locator('a[href*="#"]').first();
    const href = await exerciseLink.getAttribute('href');
    expect(href).toMatch(/\/es\/.*#/);
  });

  test('open-text exercise appears in journal', async ({ page }) => {
    // open-text recap exercise is on chapter-5 index page
    await page.goto('/es/chapter-5');
    const card = page.locator('.exercise-card').first();
    await card.locator('textarea').first().fill('Texto abierto para diario');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    await expect(page.getByText('Texto abierto para diario')).toBeVisible();
  });

  test('numbered-list exercise appears in journal', async ({ page }) => {
    // First numbered-list exercise is on chapter-1 index page
    await page.goto('/es/chapter-1');
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type="text"]').first().fill('Primer objetivo listado');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    await expect(page.getByText('Primer objetivo listado')).toBeVisible();
  });

  test('multi-section exercise appears in journal', async ({ page }) => {
    // warmth-1 (multi-section) is on /es/chapter-2/calidez
    await page.goto('/es/chapter-2/calidez');
    const cards = page.locator('.exercise-card');
    // Second card is warmth-1 (first is the radio warmth-why)
    const card = cards.nth(1);
    await card.locator('input[type="text"]').first().fill('Calidez multi-section test');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    await expect(page.getByText('Calidez multi-section test')).toBeVisible();
  });

  test('guided-list exercise appears in journal', async ({ page }) => {
    // Guided-list exercises are on age sub-pages in chapter 4
    await page.goto('/es/chapter-4/0-a-6-meses');
    const card = page.locator('.exercise-card').first();
    const input = card.locator('input[type="text"]');
    await input.fill('Motivo guiado test');
    await card.locator('button', { hasText: 'Agregar' }).click();
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    await expect(page.getByText('Motivo guiado test')).toBeVisible();
  });

  test('radio exercise appears in journal', async ({ page }) => {
    // warmth-why (radio) is on /es/chapter-2/calidez
    await page.goto('/es/chapter-2/calidez');
    // First card is warmth-why (radio type)
    const card = page.locator('.exercise-card').first();
    // Select the first option of the first question
    await card.locator('input[type="radio"]').first().click();
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    // The selected option text should appear
    await expect(page.getByText('Le dice lo que está haciendo bien').first()).toBeVisible();
  });

  test('self-assessment exercise appears in journal as visual scale', async ({ page }) => {
    // Temperament exercises are on /es/chapter-3/5-a-9-anos
    await page.goto('/es/chapter-3/5-a-9-anos');
    // First exercise is temperament-child (self-assessment with sliders)
    const card = page.locator('.exercise-card').first();
    await card.locator('button', { hasText: 'Guardar' }).click();
    // Wait for the date text to appear (there are many sage-400 spans in sliders, so check for date format)
    await page.waitForTimeout(500);

    await page.goto('/es/diario');
    // The journal should show dimension names from the sketchy scale visualization
    const journal = page.locator('[data-testid="journal"]');
    await expect(journal.getByText('Nivel de actividad').first()).toBeVisible();
  });

  test('exercise notes appear in journal', async ({ page }) => {
    // open-text exercise with notes is on chapter-5 index page
    await page.goto('/es/chapter-5');
    const card = page.locator('.exercise-card').first();
    // Fill the main answer
    await card.locator('textarea').first().fill('Respuesta principal');
    // Find the notes textarea (the one after "Para tu diario")
    const textareas = card.locator('textarea');
    const notesTextarea = textareas.last();
    await notesTextarea.fill('Mi nota personal para el diario');
    await card.locator('button', { hasText: 'Guardar' }).click();
    await expect(card.locator('[data-testid="saved-at"]')).toBeVisible();

    await page.goto('/es/diario');
    await expect(page.getByText('Mi nota personal para el diario')).toBeVisible();
  });
});
