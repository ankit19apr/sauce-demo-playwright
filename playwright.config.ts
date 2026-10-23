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

  // Generates an HTML report after test execution
  reporter: 'html',

  // Shared settings applied to tests
  use: {
    // Base URL used with relative navigation paths
    // Example: await page.goto('/')
    baseURL: 'https://www.saucedemo.com',

    // Captures a trace on the first retry of a failed test
    trace: 'on-first-retry',
  },

  // Run tests across different browsers
  projects: [
    {
      // Google Chrome-compatible Chromium browser
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Firefox browser
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      // WebKit browser engine, used by Safari
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
