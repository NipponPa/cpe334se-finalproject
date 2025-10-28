# E2E Tests

This directory contains end-to-end tests for the application using Playwright.

## Test Structure

- `e2e/` - Contains all end-to-end test files
  - `googleauth.spec.ts` - Tests for authenticated user access (uses saved state)
  - `googleauth-flow.spec.ts` - Tests the full Google authentication flow
- `utils/` - Utility functions for testing
 - `auth.ts` - Authentication helper functions
- `auth-states/` - Directory for storing authentication states (do not commit these files)
- `save-auth-state.ts` - Script to manually authenticate and save Google auth state

## Prerequisites

Before running the tests, ensure you have:

1. Node.js and npm installed
2. Project dependencies installed: `npm install`
3. Playwright browsers installed: `npx playwright install`
4. Your application running: `npm run dev`

## Setting Up Google Authentication State

To run the authenticated tests, you need to manually authenticate with Google and save the authentication state:

1. Start your application:
   ```bash
   npm run dev
   ```

2. Run the save-auth-state script:
   ```bash
   npx tsx tests/save-auth-state.ts
   ```

3. The script will open a browser window and navigate to the login page.

4. Manually complete the Google authentication flow.

5. When prompted in the terminal, press Enter after successful authentication.

6. The authentication state will be saved to `tests/auth-states/google-auth.json`.

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run a Specific Test File
```bash
npx playwright test e2e/googleauth.spec.ts
npx playwright test e2e/googleauth-flow.spec.ts
```

### Run Tests in UI Mode (Recommended for Viewing Browser Actions)
```bash
npx playwright test --ui
```
In UI mode, you can:
- See the tests running in real-time
- Step through tests line by line using the "Step Over" button (F10)
- View detailed trace information
- Watch the full authentication flow by stepping through `googleauth-flow.spec.ts`

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Trace Viewer
```bash
npx playwright test --trace on
```
After running, view the trace with:
```bash
npx playwright show-trace
```

## Viewing Test Results

After running tests, you can view a detailed HTML report:
```bash
npx playwright show-report
```

This report includes:
- Test execution results
- Screenshots at each step
- Video recordings of the tests
- Trace information for debugging

## Important Notes

- The `tests/auth-states/` directory is in `.gitignore` and should not be committed to the repository as it contains sensitive authentication information.
- The `googleauth.spec.ts` test uses the saved authentication state and verifies that an authenticated user can access protected pages.
- The `googleauth-flow.spec.ts` test performs the full Google authentication flow and is useful for viewing the actual login process.
- To see the browser actions during the `googleauth-flow.spec.ts` test in UI mode, use the "Step Over" button (F10) to execute the test line by line.