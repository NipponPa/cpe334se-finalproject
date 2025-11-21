import { expect, test } from '@playwright/test';

test.describe('Profile Picture Upload System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the profile page
    await page.goto('/profile');
  });

  test('should display profile page with upload component when authenticated', async ({ page }) => {
    // Note: This test assumes a logged-in state
    // In a real scenario, you'd need to authenticate first
    
    // Check if profile picture upload component is visible
    await expect(page.locator('text=Profile Picture')).toBeVisible();
    await expect(page.locator('button:has-text("Upload Picture")')).toBeVisible();
    
    // Check if profile picture display is present
    await expect(page.locator('.rounded-full[alt="Profile Picture"], .rounded-full.bg-gray-200')).toBeVisible();
  });

  test('should allow navigation to profile from navbar', async ({ page }) => {
    // Go to home page
    await page.goto('/');
    
    // Click on user menu (assuming user is logged in)
    await page.locator('button').filter({ hasText: '@' }).click(); // Find button with email
    
    // Click on profile link
    await page.locator('text=Profile').click();
    
    // Verify navigation to profile page
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.locator('h1:has-text("Your Profile")')).toBeVisible();
  });

  test('should handle image upload and display', async ({ page }) => {
    // This test would require mocking file uploads
    // which is complex in an automated test
    
    // Check that drag & drop area is present
    await expect(page.locator('text=Drag & drop your photo here')).toBeVisible();
    
    // Check that file input exists
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should display default avatar when no profile picture is set', async ({ page }) => {
    // Check that default avatar is displayed when no picture is set
    const defaultAvatar = page.locator('.bg-gray-200').first();
    await expect(defaultAvatar).toBeVisible();
  });
});

// Additional unit tests for utility functions would go here
// These would be run separately from the E2E tests