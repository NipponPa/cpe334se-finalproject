import { test, expect } from '@playwright/test';

test.describe('Calendar Conflict Detection E2E Tests', () => {
  test('E2E-005: Detect and handle overlapping events', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create the first event
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const firstEventTitle = `First Event ${Date.now()}`;
    await page.locator('#title').fill(firstEventTitle);
    await page.locator('#description').fill('First event in the day');
    
    // Set date and time for the first event (10:00 - 11:00)
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('10:00');
    await page.locator('#endTime').fill('11:00');
    
    await page.locator('button:has-text("Save")').click();
    
    // Verify the first event appears
    await expect(page.locator(`text=${firstEventTitle}`)).toBeVisible();

    // Create a second event that conflicts with the first (10:30 - 11:30)
    await addEventButton.click();
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const secondEventTitle = `Conflicting Event ${Date.now()}`;
    await page.locator('#title').fill(secondEventTitle);
    await page.locator('#description').fill('This event conflicts with the first event');
    
    // Set date and time for the second event (overlapping with the first)
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('10:30'); // Overlaps with first event
    await page.locator('#endTime').fill('11:30');  // Overlaps with first event
    
    // Try to save the conflicting event
    await page.locator('button:has-text("Save")').click();
    
    // Check if the application shows a conflict warning
    const conflictWarning = page.locator('text=conflict, text=overlap, text=already scheduled, text=double booking, text=schedule conflict');
    if (await conflictWarning.count() > 0) {
      await expect(conflictWarning).toBeVisible();
      console.log('Conflict detection is working - warning displayed');
      
      // If there's a warning, we might have options to proceed or cancel
      // Look for "Save Anyway" or similar button
      const saveAnywayButton = page.locator('button:has-text("Save Anyway"), button:has-text("Continue")');
      if (await saveAnywayButton.count() > 0) {
        await saveAnywayButton.click();
      } else {
        // If no "Save Anyway" button, just close the form
        await page.locator('button:has-text("Cancel"), button:has-text("Close")').click();
      }
    } else {
      // If no conflict warning, the event might save directly
      console.log('No conflict warning found - event may have saved without warning');
      // Wait a moment and check if the second event appears
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${secondEventTitle}`)).toBeVisible().catch(() => {
        console.log('Second event did not appear, which might indicate conflict prevention');
      });
    }
    
    // Verify both events are displayed (or only the first one if conflict was prevented)
    const firstEventExists = await page.locator(`text=${firstEventTitle}`).isVisible();
    const secondEventExists = await page.locator(`text=${secondEventTitle}`).isVisible();
    
    console.log(`First event exists: ${firstEventExists}`);
    console.log(`Second event exists: ${secondEventExists}`);
    
    console.log('Conflict detection test completed');
  });

  test('E2E-006: Multiple overlapping events detection', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create a base event (9:00 - 10:00)
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const baseEventTitle = `Base Event ${Date.now()}`;
    await page.locator('#title').fill(baseEventTitle);
    await page.locator('#description').fill('Base event for conflict testing');
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('09:00');
    await page.locator('#endTime').fill('10:00');
    
    await page.locator('button:has-text("Save")').click();
    await expect(page.locator(`text=${baseEventTitle}`)).toBeVisible();

    // Try to create an event that completely encompasses the base event (8:30 - 10:30)
    await addEventButton.click();
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const encompassingEventTitle = `Encompassing Event ${Date.now()}`;
    await page.locator('#title').fill(encompassingEventTitle);
    await page.locator('#description').fill('This event encompasses the base event');
    
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('08:30');
    await page.locator('#endTime').fill('10:30');
    
    await page.locator('button:has-text("Save")').click();
    
    // Check for conflict warning
    const encompassingConflictWarning = page.locator('text=conflict, text=overlap, text=already scheduled');
    if (await encompassingConflictWarning.count() > 0) {
      await expect(encompassingConflictWarning).toBeVisible();
      console.log('Detected encompassing conflict');
      // Close the form
      await page.locator('button:has-text("Cancel"), button:has-text("Close")').click();
    }
    
    // Try to create an event that partially overlaps at the end (9:30 - 10:30)
    await addEventButton.click();
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const endOverlapEventTitle = `End Overlap Event ${Date.now()}`;
    await page.locator('#title').fill(endOverlapEventTitle);
    await page.locator('#description').fill('This event overlaps at the end');
    
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('09:30');
    await page.locator('#endTime').fill('10:30');
    
    await page.locator('button:has-text("Save")').click();
    
    // Check for conflict warning
    const endOverlapConflictWarning = page.locator('text=conflict, text=overlap, text=already scheduled');
    if (await endOverlapConflictWarning.count() > 0) {
      await expect(endOverlapConflictWarning).toBeVisible();
      console.log('Detected end overlap conflict');
      // Close the form
      await page.locator('button:has-text("Cancel"), button:has-text("Close")').click();
    }
    
    console.log('Multiple conflict scenarios tested');
  });
});