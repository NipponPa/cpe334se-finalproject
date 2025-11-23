# Integration Tests

This directory contains integration tests that verify the interaction between different modules, API calls, and database operations.

## Directory Structure

- `api/` - API endpoint integration tests
- `database/` - Database operation tests
- `auth/` - Authentication integration tests

## Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific integration test file
npx vitest integration/database/check-events.test.ts
```

## Test Categories

### API Integration Tests
- Endpoint functionality
- Request/response validation
- Error handling
- Authentication headers

### Database Integration Tests
- CRUD operations
- Data consistency
- Query validation
- Relationship integrity

### Authentication Integration Tests
- Login/logout functionality
- Session management
- Token validation
- Authorization checks