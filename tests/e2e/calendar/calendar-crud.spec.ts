import { test, expect } from '@playwright/test';

test.describe('Calendar CRUD Operations E2E Tests', () => {
  test('E2E-003: Create, Read, Update, Delete events', async ({ page }) => {
    // First, ensure user is logged in
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com'); // Use existing test user
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Wait for potential redirect after login - the auth test shows it redirects to /welcome
    await page.waitForURL('**/welcome', { timeout: 10000 }).catch(() => {
      console.log('Did not redirect to welcome page, checking current URL');
    });
    
    // Navigate to calendar page - go to home which contains the calendar
    await page.goto('/');
    
    // Wait for calendar to load - the Calendar component should render with its specific styling
    await page.waitForSelector('.bg-gradient-to-br, .from-\\[\\#292828\\], .to-\\[\\#353131\\], .rounded-lg', { timeout: 15000 });

    // CREATE: Add a new event - using the actual button text from CalendarHeader
    const addEventButton = page.locator('button:has-text("Add Event")');
    await expect(addEventButton).toBeVisible();
    await addEventButton.click();
    
    // Wait for the modal overlay to appear (the AddEventForm appears in a modal)
    await page.waitForSelector('div:has-text("Add New Event"), .fixed.inset-0.bg-black', { timeout: 5000 });

    // Wait for the form to appear
    await expect(page.locator('text=Add New Event')).toBeVisible();

    // Fill event details - using actual IDs from AddEventForm
    const eventTitle = `Test Event ${Date.now()}`;
    await page.locator('#title').fill(eventTitle);
    await page.locator('#description').fill('Test event description');
    
    // Set date and time - using actual IDs from AddEventForm
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('14:00');
    await page.locator('#endTime').fill('15:00');

    // Save the event
    await page.locator('button:has-text("Save"), button:has-text("Create")').click();

    // READ: Verify the event appears on the calendar
    await expect(page.locator(`text=${eventTitle}`)).toBeVisible({ timeout: 10000 });

    // UPDATE: Edit the event
    // Click on the event to select it and open the event detail view
    await page.locator(`text=${eventTitle}`).click();
    
    // Wait for the event detail view to appear
    await expect(page.locator('text=Saturday, text=Sunday, text=Monday').first()).toBeVisible(); // Day of week appears in the detail view
    
    // Find and click the edit button in the event detail view for this specific event
    const editButton = page.locator('button:has-text("Edit")').first(); // Use first() to get the first edit button
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Modify the event title
    const updatedTitle = `Updated ${eventTitle}`;
    await page.locator('#title, [data-testid="event-title"]').fill(updatedTitle);
    
    // Save the updated event
    await page.locator('button:has-text("Save"), button:has-text("Update")').click();

    // Verify the update
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();
    await expect(page.locator(`text=${eventTitle}`)).not.toBeVisible();

    // DELETE: Remove the event
    // Click on the updated event to open the event detail view
    await page.locator(`text=${updatedTitle}`).click();
    
    // Wait for the event detail view to appear
    await expect(page.locator('text=Saturday, text=Sunday, text=Monday').first()).toBeVisible(); // Day of week appears in the detail view
    
    // Find and click the delete button in the event detail view
    const deleteButton = page.locator('button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
    
    // Confirm deletion if there's a confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    await deleteButton.click();

    // Verify the event is deleted
    await expect(page.locator(`text=${updatedTitle}`)).not.toBeVisible({ timeout: 1000 });
    
    console.log('Calendar CRUD operations completed successfully');
  });

  test('E2E-004: Create all-day event', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create an all-day event
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const allDayEventTitle = `All-Day Event ${Date.now()}`;
    await page.locator('#title').fill(allDayEventTitle);
    await page.locator('#description').fill('This is an all-day event');
    
    // Check the "All day event" checkbox - using the actual selector from AddEventForm
    await page.locator('input[type="checkbox"]').first().click();
    
    // Set dates for the all-day event
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    
    await page.locator('button:has-text("Save")').click();
    
    // Verify the all-day event appears
    await expect(page.locator(`text=${allDayEventTitle}`)).toBeVisible();
    
    console.log('All-day event creation completed successfully');
  });
});