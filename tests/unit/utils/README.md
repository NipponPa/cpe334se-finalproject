# Utility Function Unit Tests

This directory contains unit tests for utility functions including calendar utilities, auth utilities, and other helper functions.

## Test Categories

### Calendar Utility Tests
- Date formatting functions
- Multi-day event calculations
- Time zone handling
- Event validation

### Authentication Utility Tests
- Email validation
- Password validation
- Token handling
- Session management

### Image Processing Utility Tests
- Image format validation
- Size validation
- Optimization functions
- Upload validation

## Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/lib/auth-utils';

describe('Auth Utilities', () => {
 it('should validate correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  it('should reject invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

## Running Tests

```bash
# Run all utility tests
npx vitest unit/utils/

# Run specific utility test
npx vitest unit/utils/auth-utils.test.ts