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

test('visual: blog list page', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('blog-list.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
});

test('visual: exam landing page', async ({ page }) => {
  await page.goto('/exam', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('exam-landing.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
});
