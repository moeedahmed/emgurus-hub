import { test, expect } from './fixtures/test-base';

test.describe('Exam Guru flow', () => {
  test('exam landing page renders all three mode cards', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam');

    await expect(page.getByRole('heading', { name: /Exam Guru/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start AI Mode/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Study Session/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Exam/i })).toBeVisible();
  });

  test('exam mode: navigates to config page', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam');

    await page.getByRole('button', { name: /Start Exam/i }).click();
    await expect(page).toHaveURL(/\/exam\/config/);
    await expect(page.getByText(/Exam Mode/i).first()).toBeVisible();
  });

  test('study mode: navigates to practice config page', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam');

    await page.getByRole('button', { name: /Start Study Session/i }).click();
    await expect(page).toHaveURL(/\/exam\/practice\/config/);
  });

  test('ai mode: navigates to AI config page', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam');

    await page.getByRole('button', { name: /Start AI Mode/i }).click();
    await expect(page).toHaveURL(/\/exam\/ai\/config/);
  });

  test('question bank page loads', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam/bank');

    // Question bank has search/filter controls and question cards
    await expect(page.getByPlaceholder(/Search/i).first()).toBeVisible();
  });

  test('exam config page has configuration controls', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam/config');

    // Should have time limit selector and question count
    await expect(page.getByText(/time/i).first()).toBeVisible();
    // Back button should exist
    await expect(page.locator('button', { has: page.locator('svg') }).first()).toBeVisible();
  });
});
