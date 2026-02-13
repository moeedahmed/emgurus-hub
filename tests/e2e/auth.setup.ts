import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = 'tests/e2e/.auth/user.json';
const E2E_EMAIL = process.env.E2E_EMAIL || 'builder-test@emgurus.com';
const E2E_PASSWORD = process.env.E2E_PASSWORD || 'TestAccount2026!';

async function completeOnboardingIfNeeded(page: import('@playwright/test').Page) {
  if (!/\/onboarding/.test(page.url())) return;

  // Step 1
  const firstName = page.getByPlaceholder(/your first name/i);
  if (await firstName.isVisible().catch(() => false)) {
    await firstName.fill('Builder');
    await page.getByRole('button', { name: /next/i }).click();
  }

  // Step 2
  if (/\/onboarding/.test(page.url())) {
    const track = page.getByRole('button', { name: /UK Trainee/i }).first();
    if (await track.isVisible().catch(() => false)) {
      await track.click();
      await page.getByRole('button', { name: /next/i }).click();
    }
  }

  // Step 3
  if (/\/onboarding/.test(page.url())) {
    const stage = page.getByRole('button', { name: /Medical Student|Foundation/i }).first();
    if (await stage.isVisible().catch(() => false)) {
      await stage.click();
      await page.getByRole('button', { name: /next/i }).click();
    }
  }

  // Step 4
  if (/\/onboarding/.test(page.url())) {
    const specialty = page.getByRole('button', { name: /Emergency Medicine|Internal Medicine|Undecided/i }).first();
    if (await specialty.isVisible().catch(() => false)) {
      await specialty.click();
      await page.getByRole('button', { name: /next/i }).click();
    }
  }

  // Step 5
  if (/\/onboarding/.test(page.url())) {
    await page.locator('input[type="number"]').first().fill('2019');
    await page.getByRole('button', { name: /UK CCT|Undecided/i }).first().click();
    await page.locator('select').nth(0).selectOption('full_time');
    await page.locator('select').nth(1).selectOption('1_year');
    await page.getByRole('button', { name: /finish/i }).click();
  }
}

setup('authenticate user and save storage state', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText(/sign in to your account/i)).toBeVisible();
  await page.getByLabel(/email/i).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /^sign in$/i }).click();

  await page.waitForURL(/\/(hub|onboarding)/, { timeout: 30000 });

  await completeOnboardingIfNeeded(page);

  await expect(page).toHaveURL(/\/hub/, { timeout: 30000 });
  await page.context().storageState({ path: AUTH_FILE });
});
