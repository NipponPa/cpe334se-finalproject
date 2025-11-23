// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: !!process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*auth\.spec\.ts/,
      testIgnore: /.*googleauth-flow\.spec\.ts/,
    },
    {
      name: 'authenticated-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth-states/google-auth.json',
      },
      testMatch: /.*googleauth-flow\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*auth\.spec\.ts/,
      testIgnore: /.*googleauth-flow\.spec\.ts/,
    },
  ],
});
