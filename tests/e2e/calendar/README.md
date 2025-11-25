# Calendar E2E Tests

This directory contains end-to-end tests for the calendar functionality, covering the complete flow from authentication to notifications.

## Test Files

### `auth-crud-conflict-sharing-notifications-flow.spec.ts`
Tests the complete end-to-end flow:
- Authentication (login/register)
- Calendar CRUD operations
- Conflict detection
- Event sharing
- Notifications

### `calendar-crud.spec.ts`
Tests calendar CRUD (Create, Read, Update, Delete) operations:
- Creating events
- Reading events from the calendar
- Updating existing events
- Deleting events
- Creating all-day events

### `conflict-detection.spec.ts`
Tests the calendar's conflict detection system:
- Detecting overlapping events
- Handling multiple overlapping events
- Warning users about scheduling conflicts

### `sharing.spec.ts`
Tests the event sharing functionality:
- Sharing events with friends
- Adding multiple friends to events
- Editing shared events

### `notifications.spec.ts`
Tests the notification system:
- Event reminder notifications
- Event invitation notifications
- Notification management
- Browser notifications

## Test IDs

Each test has a unique ID following the pattern E2E-XXX:

- E2E-001: Complete flow - Authentication to Notifications
- E2E-02: Authentication flow with error handling
- E2E-003: Create, Read, Update, Delete events
- E2E-004: Create all-day event
- E2E-005: Detect and handle overlapping events
- E2E-006: Multiple overlapping events detection
- E2E-007: Share event with friends
- E2E-08: Share event with multiple friends
- E2E-009: Edit shared event permissions
- E2E-010: Event reminder notifications
- E2E-011: Event invitation notifications
- E2E-012: View and manage notifications
- E2E-013: Browser notifications for events

## Running Tests

To run all calendar E2E tests:

```bash
npx playwright test calendar/
```

To run a specific test file:

```bash
npx playwright test tests/e2e/calendar/calendar-crud.spec.ts
```

To run tests in headed mode (visible browser):

```bash
npx playwright test calendar/ --headed
```

To run tests in debug mode:

```bash
npx playwright test calendar/ --debug
```

## Test Environment

Tests expect the application to be running at `http://localhost:3000`. Make sure to start the development server before running tests:

```bash
npm run dev
```

## Test User Credentials

The tests use the following credentials for authenticated tests:
- Email: `testuser@mail.com`
- Password: `password123`

For new user registration tests, the tests generate unique email addresses using timestamps.