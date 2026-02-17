import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });
});

test.describe('Visual regression', () => {
  test('blog list page shell', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Blog/i }).first()).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('exam landing page', async ({ page }) => {
    await page.goto('/exam', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Exam Guru/i })).toBeVisible();
    await expect(page).toHaveScreenshot('exam-landing.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.06,
      timeout: 15000,
    });
  });

  test('blog list page', async ({ page }) => {
    test.setTimeout(45000);
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Blog/i }).first()).toBeVisible();
    await page.waitForTimeout(2000);
    await expect(page.locator('main').first()).toHaveScreenshot('blog-list-main.png', {
      maxDiffPixelRatio: 0.12,
      timeout: 20000,
    });
  });

  test('career landing page', async ({ page }) => {
    await page.goto('/career', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main').first()).toHaveScreenshot('career-landing-main.png', {
      maxDiffPixelRatio: 0.08,
      timeout: 20000,
    });
  });
});
