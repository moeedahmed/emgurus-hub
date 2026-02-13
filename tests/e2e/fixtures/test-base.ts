import { test as base, expect } from '@playwright/test';

export const test = base.extend<{
  waitForApp: () => Promise<void>;
  navigateAndWait: (path: string) => Promise<void>;
}>({
  waitForApp: async ({ page }, use) => {
    const waitForApp = async () => {
      await page.waitForLoadState('networkidle');
      const spinner = page.locator('[class*="animate-spin"]');
      if (await spinner.isVisible({ timeout: 500 }).catch(() => false)) {
        await spinner.waitFor({ state: 'hidden', timeout: 20000 });
      }
    };
    await use(waitForApp);
  },

  navigateAndWait: async ({ page }, use) => {
    const navigateAndWait = async (path: string) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      const spinner = page.locator('[class*="animate-spin"]');
      if (await spinner.isVisible({ timeout: 500 }).catch(() => false)) {
        await spinner.waitFor({ state: 'hidden', timeout: 20000 });
      }
    };
    await use(navigateAndWait);
  },
});

export { expect };
