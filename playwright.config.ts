
import { defineConfig, devices } from '@playwright/test';

// Playwright test configuration
export default defineConfig({
  // Folder where Playwright looks for test files
  testDir: './tests',

  // Allows test files to run in parallel
  fullyParallel: true,

  // Prevents test.only from accidentally running alone in CI
  forbidOnly: !!process.env.CI,

  // Retries failed tests twice on CI; no retries locally
  retries: process.env.CI ? 2 : 0,

  // Uses one worker on CI; default worker count locally
  workers: process.env.CI ? 1 : undefined,

  // Generate mergeable blob reports in CI and HTML locally
  reporter: process.env.CI ? 'blob' : 'html',

  // Shared settings applied to tests
  use: {
    // Base URL used with relative navigation paths
    baseURL: 'https://www.saucedemo.com',

    // Capture trace on the first retry of a failed test
    trace: 'on-first-retry',

    // Capture screenshots only when tests fail
    screenshot: 'only-on-failure',
  },

  // Run tests across different browsers
  projects: [
    {
      name: 'setup',
      testDir: './auth',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Dedicated project for API automation
    {
      name: 'api',
      testDir: './api-tests',
      use: {
        // Base URL for our practice API
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
    // API Authentication & Authorization Tests (DummyJSON)
    {
      name: 'auth-api',
      testDir: './auth-api-tests',
      use: {
        baseURL: 'https://dummyjson.com',
      },
    },
  ],
});
