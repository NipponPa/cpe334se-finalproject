# End-to-End (E2E) Tests

This directory contains end-to-end tests that simulate real user scenarios and verify the complete application flow.

## Directory Structure

- `auth/` - Authentication flow tests
- `calendar/` - Calendar functionality tests
- `profile/` - Profile management tests
- `navigation/` - Navigation and routing tests

## Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific E2E test file
npx playwright test e2e/auth/login.spec.ts

# Run tests with trace viewer
npx playwright test --trace on
```

## Test Categories

### Authentication Tests
- User registration
- User login
- Password reset
- Google OAuth flow
- Session management
- Logout functionality

### Calendar Tests
- Event creation
- Event editing
- Event deletion
- Calendar navigation
- Multi-day event handling
- Event sharing with friends

### Profile Tests
- Profile picture upload
- Profile information update
- Profile display validation

### Navigation Tests
- Menu navigation
- Protected route access
- Error handling for unauthorized access