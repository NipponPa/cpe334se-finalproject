# Authentication E2E Tests

This directory contains end-to-end tests for authentication flows including login, signup, password reset, and OAuth.

## Test Categories

### Login Tests
- Valid email/password login
- Invalid credentials handling
- Forgot password flow
- Remember me functionality

### Signup Tests
- Valid registration
- Invalid email format
- Password strength requirements
- Duplicate email handling

### OAuth Tests
- Google authentication flow
- OAuth callback handling
- OAuth error scenarios

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('User login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all auth tests
npx playwright test e2e/auth/

# Run specific auth test
npx playwright test e2e/auth/login.spec.ts