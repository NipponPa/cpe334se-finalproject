# Profile E2E Tests

This directory contains end-to-end tests for profile management functionality including picture upload, information editing, and display.

## Test Categories

### Profile Picture Tests
- Picture upload functionality
- Picture validation (format, size)
- Picture display across application
- Default avatar handling

### Profile Information Tests
- Profile information editing
- Form validation
- Data persistence

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Profile Management Tests', () => {
  test('Profile picture upload', async ({ page }) => {
    await page.goto('/profile');
    
    // Upload a test image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Upload Picture').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('path/to/test-image.jpg');
    
    // Verify upload success
    await expect(page.locator('img[alt="Profile Picture"]')).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all profile tests
npx playwright test e2e/profile/

# Run specific profile test
npx playwright test e2e/profile/picture-upload.spec.ts