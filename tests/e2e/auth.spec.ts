import { test, expect } from './fixtures/test-base';

test.describe('Authentication and access guard', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page renders', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');

    await expect(page.getByText(/sign in to your account/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('unauthenticated user is redirected from hub', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/hub');
    await expect(page).toHaveURL(/\/login/);
  });
});
