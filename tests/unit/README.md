# Unit Tests

This directory contains unit tests for individual components, utility functions, and React contexts.

## Directory Structure

- `components/` - Unit tests for React components
- `utils/` - Unit tests for utility functions
- `contexts/` - Unit tests for React contexts and hooks

## Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific unit test file
npx vitest unit/utils/multi-day-events.test.ts
```

## Test Categories

### Component Tests
- Individual React component functionality
- Component props validation
- Component state management
- Component lifecycle methods

### Utility Function Tests
- Pure function testing
- Input/output validation
- Edge case handling
- Error handling

### Context Tests
- State management
- Provider functionality
- Hook behavior