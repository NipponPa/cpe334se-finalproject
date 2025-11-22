# Calendar E2E Tests

This directory contains end-to-end tests for calendar functionality including event management, navigation, and sharing features.

## Test Categories

### Event Management Tests
- Creating events with various options
- Editing existing events
- Deleting events with confirmation
- Multi-day event handling
- All-day event functionality

### Calendar Navigation Tests
- Month/week/day view switching
- Date navigation
- Today button functionality
- Event detail view

### Sharing Tests
- Friend selection for event sharing
- Shared event visibility
- Permission management

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Calendar Event Tests', () => {
  test('Creating a new event', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Add Event' }).click();
    
    await page.locator('#event-title').fill('Test Event');
    await page.locator('#event-date').fill('2024-01-15');
    await page.locator('#event-time-start').fill('09:00');
    await page.locator('#event-time-end').fill('10:00');
    
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.locator('text=Test Event')).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all calendar tests
npx playwright test e2e/calendar/

# Run specific calendar test
npx playwright test e2e/calendar/event-creation.spec.ts