# Testing Plan for CPE334SE Final Project

## Overview

This document outlines the comprehensive testing strategy for the web application, covering unit tests, integration tests, and end-to-end (E2E) tests to ensure quality, reliability, and maintainability.

## Current Testing Setup

### Testing Frameworks and Tools
- **Playwright**: For E2E testing
- **Vitest**: For unit testing
- **Supabase**: For database testing

### Existing Test Coverage
- Authentication E2E tests (`tests/e2e/auth.spec.ts`)
- Calendar functionality unit tests (`tests/multi-day-events.test.ts`)
- Profile picture upload tests (`tests/profile-picture-upload.test.ts`)
- Database utility tests (`tests/check-events.ts`)

## Testing Strategy

### 1. Unit Testing

Unit tests will focus on testing individual functions, components, and utility functions in isolation.

#### Components to Test
- **Calendar Components**
  - `AddEventForm.tsx`
  - `CalendarGrid.tsx`
  - `CalendarHeader.tsx`
  - `DayCell.tsx`
  - `EventDetailView.tsx`
  - `FriendSelection.tsx`
  
- **Profile Components**
  - `ProfilePictureDisplay.tsx`
  - `ProfilePictureUpload.tsx`
  
- **Layout Components**
  - `NavigationBar.tsx`
  - `ProtectedRoute.tsx`

- **Utility Functions**
  - `lib/auth-utils.ts`
  - `lib/profilePictureUtils.ts`
  - `lib/imageOptimizer.ts`
  - `lib/utils.ts`

#### Unit Test Examples
```typescript
// Example for testing utility functions
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

### 2. Integration Testing

Integration tests will verify the interaction between different modules, API calls, and database operations.

#### API Integration Tests
- Supabase authentication integration
- Database operations (CRUD for events, profiles)
- File upload functionality (profile pictures)

#### Integration Test Examples
```typescript
// Example for testing Supabase integration
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

### 3. End-to-End (E2E) Testing

E2E tests will simulate real user scenarios and verify the complete application flow.

#### Authentication Flow Tests
- User registration
- User login
- Password reset
- Google authentication
- Logout functionality

#### Calendar Functionality Tests
- Creating events
- Editing events
- Deleting events
- Viewing events in different calendar views
- Multi-day event handling
- Event sharing with friends

#### Profile Management Tests
- Profile picture upload
- Profile information update
- Profile picture display across the application

#### Navigation Tests
- Menu navigation
- Protected route access
- Error handling for unauthorized access

## Testing Coverage Areas

### Authentication System
- [ ] User registration with email/password
- [ ] User login with email/password
- [ ] Google OAuth integration
- [ ] Password reset functionality
- [ ] Session management
- [ ] Protected route access control
- [ ] User logout functionality

### Calendar System
- [ ] Event creation with validation
- [ ] Event editing functionality
- [ ] Event deletion with confirmation
- [ ] Multi-day event support
- [ ] All-day event handling
- [ ] Event time display formatting
- [ ] Calendar navigation (month/week/day views)
- [ ] Event conflict detection
- [ ] Friend event sharing

### Profile Management
- [ ] Profile picture upload
- [ ] Profile picture validation (format, size)
- [ ] Profile picture display
- [ ] Default avatar handling
- [ ] Profile information editing

### UI/UX Components
- [ ] Responsive design across devices
- [ ] Form validation and error handling
- [ ] Loading states
- [ ] Error boundary handling
- [ ] Accessibility compliance

### Database Operations
- [ ] Event CRUD operations
- [ ] User profile management
- [ ] Profile picture storage and retrieval
- [ ] Friend relationship management
- [ ] Data consistency across operations

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

## Test Implementation Plan

### Phase 1: Core Functionality
1. Implement authentication unit tests
2. Add calendar component unit tests
3. Enhance existing E2E authentication tests

### Phase 2: Advanced Features
1. Profile picture upload integration tests
2. Calendar event management tests
3. Friend selection and sharing tests

### Phase 3: Edge Cases and Error Handling
1. Error boundary tests
2. Invalid input handling tests
3. Performance tests
4. Load tests for critical paths

## Code Coverage Goals

- **Unit Tests**: 80%+ coverage for utility functions and components
- **Integration Tests**: Cover all API endpoints and database operations
- **E2E Tests**: Cover all major user workflows

## Test Execution Commands

### Running Tests
```bash
# Run all unit tests
npm run test:unit

# Run all E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests with coverage report
npm run test:coverage
```

## Maintenance and Monitoring

- Regular review of test suite performance
- Update tests when features change
- Monitor test flakiness and fix unstable tests
- Add new tests for new features
- Refactor tests for better maintainability

## Quality Gates

- All tests must pass before deployment
- Code coverage should not decrease
- No critical or high severity bugs in test code
- Performance tests should meet defined thresholds