# Testing Strategy for CPE334SE Final Project

## Overview

This document outlines the comprehensive testing strategy for the web application, covering unit tests, integration tests, and end-to-end (E2E) tests to ensure quality, reliability, and maintainability.

## Test Folder Structure

```
tests/
├── unit/                    # Unit tests for individual functions/components
│   ├── components/          # Component unit tests
│   ├── utils/               # Utility function tests
│   └── contexts/            # React context tests
├── integration/            # Integration tests for API/database interactions
│   ├── api/                # API endpoint tests
│   ├── database/           # Database operation tests
│   └── auth/               # Authentication integration tests
├── e2e/                    # End-to-end tests for user flows
│   ├── auth/               # Authentication flows
│   ├── calendar/           # Calendar functionality
│   ├── profile/            # Profile management
│   └── navigation/         # Navigation and routing
├── fixtures/               # Test data and fixtures
├── utils/                  # Test utilities and helpers
├── auth-states/            # Authentication state files (not committed)
├── types/                  # Test-specific TypeScript types
└── reports/                # Test reports and coverage data
```

## Testing Frameworks and Tools

### Current Setup
- **Playwright**: For E2E testing
- **Vitest**: For unit testing
- **React Testing Library**: For component testing
- **Supabase**: For database testing

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run all integration tests
npm run test:integration

# Run all E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests with coverage report
npm run test:coverage
```

## Types of Tests

### 1. Unit Tests

Unit tests focus on testing individual functions, components, and utility functions in isolation.

**Location**: `tests/unit/`

**Coverage includes**:
- Utility functions in `lib/`
- Individual React components
- Context providers and hooks
- Form validation functions

**Example**:
```typescript
// tests/unit/utils/auth-utils.test.ts
import { validateEmail } from '@/lib/auth-utils';

describe('Auth Utilities', () => {
  test('should validate correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  test('should reject invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### 2. Integration Tests

Integration tests verify the interaction between different modules, API calls, and database operations.

**Location**: `tests/integration/`

**Coverage includes**:
- Supabase authentication integration
- Database CRUD operations
- File upload functionality
- API endpoint interactions

**Example**:
```typescript
// tests/integration/database/events.test.ts
import { createEvent } from '@/lib/calendar-service';

describe('Calendar Service Integration', () => {
  test('should create event in database', async () => {
    const event = {
      title: 'Test Event',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      userId: 'test-user-id'
    };
    
    const result = await createEvent(event);
    
    expect(result.success).toBe(true);
    expect(result.data.title).toBe('Test Event');
  });
});
```

### 3. End-to-End (E2E) Tests

E2E tests simulate real user scenarios and verify the complete application flow.

**Location**: `tests/e2e/`

**Coverage includes**:
- Authentication flows (login, signup, password reset)
- Calendar functionality (create, edit, delete events)
- Profile management (picture upload, information update)
- Navigation and routing

**Example**:
```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('User login with email and password', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await expect(page).toHaveURL('/');
  });
});
```

## Test Coverage Areas

### Authentication System
- User registration with email/password
- User login with email/password
- Google OAuth integration
- Password reset functionality
- Session management
- Protected route access control
- User logout functionality

### Calendar System
- Event creation with validation
- Event editing functionality
- Event deletion with confirmation
- Multi-day event support
- All-day event handling
- Event time display formatting
- Calendar navigation (month/week/day views)
- Event conflict detection
- Friend event sharing

### Profile Management
- Profile picture upload
- Profile picture validation (format, size)
- Profile picture display
- Default avatar handling
- Profile information editing

### UI/UX Components
- Responsive design across devices
- Form validation and error handling
- Loading states
- Error boundary handling
- Accessibility compliance

### Database Operations
- Event CRUD operations
- User profile management
- Profile picture storage and retrieval
- Friend relationship management
- Data consistency across operations

## Testing Best Practices

### Naming Conventions
- Use descriptive test names that explain the expected behavior
- Follow the pattern: `should [expected behavior] when [conditions]`

### Test Structure
- Use AAA pattern (Arrange, Act, Assert)
- Keep tests small and focused
- Use meaningful variable names
- Group related tests with `describe` blocks

### Mocking and Stubbing
- Mock external dependencies (APIs, databases)
- Use fake data for consistent test results
- Isolate components for unit testing

### Continuous Integration
- All tests must pass before merging
- Code coverage thresholds (aim for 80%+ coverage)
- Automated test execution on pull requests

## Quality Gates

- All tests must pass before deployment
- Code coverage should not decrease
- No critical or high severity bugs in test code
- Performance tests should meet defined thresholds