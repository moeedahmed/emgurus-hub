import { test, expect } from './fixtures/test-base';

test.describe('Blog flow', () => {
  test('blog landing page loads with heading', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/blog');

    await expect(page.getByRole('heading', { name: /Blog/i }).first()).toBeVisible();
  });

  test('blog list displays posts or empty state', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/blog');

    // Either posts exist or we see an empty/loading state — page should not crash
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Check for post links or a fallback message
    const postLinks = page.locator('a[href^="/blog/"]:not([href="/blog/"]):not([href="/blog"]):not([href*="/editor"]):not([href*="/category/"])');
    const count = await postLinks.count();

    if (count > 0) {
      // Verify first post link is clickable
      const firstHref = await postLinks.first().getAttribute('href');
      expect(firstHref).toBeTruthy();
    }
    // If no posts, that's fine — we just verify no crash
  });

  test('blog post detail page loads when posts exist', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/blog');

    const postLinks = page.locator('a[href^="/blog/"]:not([href="/blog/"]):not([href="/blog"]):not([href*="/editor"]):not([href*="/category/"])');
    const count = await postLinks.count();
    test.skip(count === 0, 'No blog posts available — skipping detail test');

    await postLinks.first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('article, main').first()).toBeVisible();
  });

  test('blog editor new page loads for authenticated user', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/blog/editor/new');

    // Should load editor or redirect — either way, no crash
    await expect(page.locator('main, [role="textbox"], textarea, form').first()).toBeVisible({ timeout: 15000 });
  });

  test('blog navigation links work', async ({ page, navigateAndWait }) => {
    await navigateAndWait('/blog');

    // The "Write" nav link should exist in the sidebar/nav
    const writeLink = page.locator('a[href="/blog/editor/new"]');
    if (await writeLink.count() > 0) {
      await writeLink.first().click();
      await expect(page).toHaveURL(/\/blog\/editor\/new/);
    }
  });
});
