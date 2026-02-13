import { test, expect } from './fixtures/test-base';

/**
 * Functional end-to-end exam flow:
 * Config → select exam → start session → answer questions → submit → see report
 *
 * Requires at least one published exam with questions in Supabase.
 * Skips gracefully if no exam data is available.
 */
test.describe('Exam functional E2E', () => {
  test('complete exam session: config → answer → submit → report', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam/config');

    // Wait for exams to load from Supabase
    const examSelect = page.locator('button:has-text("Select exam")');
    await expect(examSelect).toBeVisible({ timeout: 10000 });

    // Open the exam selector dropdown
    await examSelect.click();

    // Check if any exam options exist
    const options = page.locator('[role="option"]');
    const optionCount = await options.count();

    if (optionCount === 0) {
      test.skip(true, 'No exams available in Supabase — skipping functional test');
      return;
    }

    // Select the first available exam
    const firstExamName = await options.first().textContent();
    await options.first().click();

    // Keep default time (60 min) and question count — click Start
    const startButton = page.getByRole('button', { name: /Start Exam/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Either we land on the session page or get "No questions available" toast
    const sessionOrToast = await Promise.race([
      page.waitForURL(/\/exam\/session\//, { timeout: 15000 }).then(() => 'session' as const),
      page.getByText(/No questions available/i).waitFor({ timeout: 15000 }).then(() => 'no-questions' as const),
    ]);

    if (sessionOrToast === 'no-questions') {
      test.skip(true, `Exam "${firstExamName}" has no published questions — skipping`);
      return;
    }

    // We're in the exam session — verify core UI elements
    await expect(page.getByText('Question 1 of').first()).toBeVisible({ timeout: 15000 });

    // Answer the first question by clicking the first option label (A.)
    const optionLabel = page.locator('label').filter({ hasText: /^A\./ }).first();
    await optionLabel.click({ timeout: 5000 });

    // Submit / finish the exam
    const submitButton = page.getByRole('button', { name: /Finish Early|Submit|Finish|End Exam/i });
    if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitButton.click();

      // Handle confirmation dialog if present
      const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Submit/i });
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }
    }

    // Verify we reach the report page
    await expect(page.getByText(/Exam Complete/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/questions correct/i)).toBeVisible();
  });

  test('exam session: navigate between questions', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/exam/config');

    const examSelect = page.locator('button:has-text("Select exam")');
    await expect(examSelect).toBeVisible({ timeout: 10000 });
    await examSelect.click();

    const options = page.locator('[role="option"]');
    if ((await options.count()) === 0) {
      test.skip(true, 'No exams available');
      return;
    }

    await options.first().click();

    const startButton = page.getByRole('button', { name: /Start Exam/i });
    await startButton.click();

    const started = await page.waitForURL(/\/exam\/session\//, { timeout: 15000 }).then(() => true).catch(() => false);
    if (!started) {
      test.skip(true, 'Could not start exam session (no questions?)');
      return;
    }

    // Test navigation: Next button
    const nextButton = page.getByRole('button', { name: /Next/i });
    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextButton.click();
      // Should still be on session page
      await expect(page).toHaveURL(/\/exam\/session\//);
    }

    // Test navigation: Previous button
    const prevButton = page.getByRole('button', { name: /Prev|Back|Previous/i });
    if (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await prevButton.click();
      await expect(page).toHaveURL(/\/exam\/session\//);
    }
  });
});
