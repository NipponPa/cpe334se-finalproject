import { test, expect } from '@playwright/test';

test('Google authentication flow', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.getByRole('button', { name: 'Sign in with Google' }).click();
  

  await page.waitForURL('http://localhost:3000/**');
  
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
});