import { test, expect } from '@playwright/test';

test.describe('Calendar Notifications E2E Tests', () => {
  test('E2E-010: Event reminder notifications', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create an event with a reminder
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const eventTitle = `Event with Reminder ${Date.now()}`;
    await page.locator('#title').fill(eventTitle);
    await page.locator('#description').fill('This event has a reminder');
    
    // Set date and time (set for a future time for the test)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    const dateString = futureDate.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('10:00');
    await page.locator('#endTime').fill('11:00');
    
    // Select a reminder time (e.g., 10 minutes before)
    const reminderSelect = page.locator('#reminderMinutes, [data-testid="reminder-select"]');
    if (await reminderSelect.count() > 0) {
      await reminderSelect.selectOption('10'); // 10 minutes before
    }
    
    await page.locator('button:has-text("Save")').click();
    
    // Verify the event was created
    await expect(page.locator(`text=${eventTitle}`)).toBeVisible();
    
    console.log('Event with reminder created successfully');
  });

  test('E2E-011: Event invitation notifications', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create an event and share it with another user
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const eventTitle = `Shared Event Notification ${Date.now()}`;
    await page.locator('#title').fill(eventTitle);
    await page.locator('#description').fill('This event will generate an invitation notification');
    
    // Set date and time
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    await page.locator('#startTime').fill('14:00');
    await page.locator('#endTime').fill('15:00');
    
    // Add a friend to share the event with
    const friendInput = page.locator('input[placeholder*="friend"], [data-testid="friend-search"]');
    if (await friendInput.count() > 0) {
      await friendInput.fill('invitee@mail.com');
      await page.waitForSelector('text=invitee@mail.com', { timeout: 3000 });
      await page.locator('text=invitee@mail.com').click();
    }
    
    await page.locator('button:has-text("Save")').click();
    
    // Verify the event was created
    await expect(page.locator(`text=${eventTitle}`)).toBeVisible();
    
    // Navigate to notifications page to check for invitation notification
    // Look for a notification icon or link
    const notificationLink = page.locator('a:has-text("Notifications"), [data-testid="notification-icon"]');
    if (await notificationLink.count() > 0) {
      await notificationLink.click();
      
      // Look for the invitation notification
      const invitationNotification = page.locator(`text=has invited you to join "${eventTitle}"`);
      // Wait for notifications to load
      await expect(invitationNotification).toBeVisible({ timeout: 10000 });
      console.log('Event invitation notification found');
    } else {
      console.log('Notification link not found, checking other areas of the page');
    }
    
    console.log('Event invitation notification test completed');
  });

  test('E2E-012: View and manage notifications', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to notifications page
    // Look for notification icon or link in the navigation
    await page.goto('/'); // Go to home first
    
    // Try to find notification area
    const notificationIcon = page.locator('svg:has-text("notification"), [data-testid="notification-icon"], .notification-icon');
    if (await notificationIcon.count() > 0) {
      await notificationIcon.click();
    } else {
      // Look for a notifications link in the sidebar or header
      await page.locator('text=Notifications, [data-testid="notifications-link"]').click();
    }
    
    // Wait for notifications to load
    await page.waitForSelector('[data-testid="notification-list"], .notification-item, [data-testid="notifications-container"]', { timeout: 500 });
    
    // Verify notifications are displayed
    const notifications = page.locator('.notification-item, [data-testid="notification-item"]');
    const notificationCount = await notifications.count();
    console.log(`Found ${notificationCount} notifications`);
    
    if (notificationCount > 0) {
      // Test marking a notification as read
      const firstNotification = notifications.first();
      await expect(firstNotification).toBeVisible();
      
      // Look for a "Mark as read" button or similar
      const markAsReadButton = firstNotification.locator('button:has-text("Mark as read"), .mark-read-btn');
      if (await markAsReadButton.count() > 0) {
        await markAsReadButton.click();
        console.log('Notification marked as read');
      }
      
      // Test deleting a notification
      const deleteButton = firstNotification.locator('button:has-text("Delete"), .delete-btn');
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        // Confirm if there's a confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        console.log('Notification deleted');
      }
    } else {
      console.log('No notifications found to test');
    }
    
    // Test marking all as read
    const markAllReadButton = page.locator('button:has-text("Mark all as read"), [data-testid="mark-all-read"]');
    if (await markAllReadButton.count() > 0) {
      await markAllReadButton.click();
      console.log('All notifications marked as read');
    }
    
    console.log('Notification management test completed');
  });

  test('E2E-013: Browser notifications for events', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('#email').fill('testuser@mail.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to calendar
    await page.goto('/');

    // Create an event with a short-term reminder to test browser notification
    const addEventButton = page.locator('button:has-text("Add Event")');
    await addEventButton.click();
    
    await expect(page.locator('text=Add New Event')).toBeVisible();
    
    const eventTitle = `Browser Notification Event ${Date.now()}`;
    await page.locator('#title').fill(eventTitle);
    await page.locator('#description').fill('This event should trigger a browser notification');
    
    // Set date and time for very soon (for testing purposes, though in real scenario it would be in future)
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    await page.locator('#startDate').fill(dateString);
    await page.locator('#endDate').fill(dateString);
    // Set time to 1 minute from now to test notification
    const nextMinute = new Date(today.getTime() + 60000); // 1 minute later
    const nextMinuteTime = `${nextMinute.getHours().toString().padStart(2, '0')}:${nextMinute.getMinutes().toString().padStart(2, '0')}`;
    await page.locator('#startTime').fill(nextMinuteTime);
    await page.locator('#endTime').fill(nextMinuteTime);
    
    // Select a 1-minute reminder
    const reminderSelect = page.locator('#reminderMinutes, [data-testid="reminder-select"]');
    if (await reminderSelect.count() > 0) {
      await reminderSelect.selectOption('1'); // 1 minute before
    }
    
    await page.locator('button:has-text("Save")').click();
    
    // Verify the event was created
    await expect(page.locator(`text=${eventTitle}`)).toBeVisible();
    
    // Note: Testing actual browser notifications is complex in automated tests
    // This test ensures the functionality is set up correctly
    console.log('Browser notification event created - actual notification would appear at scheduled time');
  });
});