import { test, expect } from '@playwright/test';

test('should display the application', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/nikki/);
  await expect(page.locator('h1')).toContainText('nikki');
  await expect(page.locator('text=プロトタイプ開発中')).toBeVisible();
});
