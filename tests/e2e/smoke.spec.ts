import { expect, test } from '@playwright/test';

const coreRoutes = ['/', '/career', '/exam', '/blog'];

for (const route of coreRoutes) {
  test(`smoke: ${route} renders without crash`, async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText('Something went wrong');

    expect(errors, `Unexpected page errors on ${route}`).toEqual([]);
  });
}
