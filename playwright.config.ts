
import { defineConfig, devices } from '@playwright/test';

// Playwright test configuration
export default defineConfig({
  // Folder where Playwright looks for test files
  testDir: './tests',

  // Allows independent tests to run in parallel
  fullyParallel: true,

  // Prevents test.only from accidentally running alone in CI
  forbidOnly: !!process.env.CI,

  // Retries failed tests twice on CI; no retries locally
  retries: process.env.CI ? 2 : 0,

  // Uses one worker on CI; default worker count locally
  workers: process.env.CI ? 1 : undefined,

  // Configure reporters for local execution and CI
  reporter: process.env.CI
    ? [
        // Produces blob reports that can be merged in CI
        ['blob'],

        // Collects test results for Allure reporting
        ['allure-playwright', { resultsDir: 'allure-results' }],
      ]
    : [
        // Generates the native Playwright HTML report without auto-opening it
        ['html', { open: 'never' }],

        // Collects test results for the Allure dashboard
        ['allure-playwright', { resultsDir: 'allure-results' }],
      ],

  // Shared settings applied to tests
  use: {
    // Base URL used with relative navigation paths
    baseURL: 'https://www.saucedemo.com',

    // Captures a trace on the first retry of a failed test
    trace: 'on-first-retry',

    // Captures screenshots only when tests fail
    screenshot: 'only-on-failure',
  },

  // Run tests across different browsers and API environments
  projects: [
    {
      // Runs authentication setup before dependent browser projects
      name: 'setup',
      testDir: './auth',
      testMatch: '**/auth.setup.ts',
    },
    {
      // Chromium UI tests using saved authentication state
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      // Firefox UI tests using saved authentication state
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      // WebKit UI tests using saved authentication state
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      // Dedicated project for API automation
      name: 'api',
      testDir: './api-tests',
      use: {
        // Base URL for the JSONPlaceholder practice API
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
    {
      // API authentication and authorization tests
      name: 'auth-api',
      testDir: './auth-api-tests',
      use: {
        // Base URL for the DummyJSON API
        baseURL: 'https://dummyjson.com',
      },
    },
  ],
});
