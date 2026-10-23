# SauceDemo Playwright Automation

An end-to-end UI automation project for
[SauceDemo](https://www.saucedemo.com/) built with **Playwright** and
**TypeScript**. This project is intended for hands-on practice with
browser automation, the Page Object Model (POM), reusable fixtures, and
cross-browser testing.

## Project Goals

-   Automate key SauceDemo user journeys.
-   Keep page interactions reusable with the Page Object Model.
-   Use Playwright Test for assertions, execution, and reporting.
-   Run tests across Chromium, Firefox, and WebKit.
-   Build practical skills for SDET / QA Automation Engineer interviews.

## Tech Stack

-   **Language:** TypeScript
-   **Automation:** Playwright Test
-   **Application under test:** SauceDemo
-   **Reporting:** Playwright HTML report
-   **Version control:** Git and GitHub

## Project Structure

``` text
sauce-demo-playwright/
├── .github/                 # GitHub configuration/workflows, if configured
├── fixture/
│   └── myfixtures.ts        # Custom Playwright fixtures
├── pages/
│   └── LoginPage.ts         # Login page object
├── test-data/
│   └── loginData.ts         # Reusable login test data
├── tests/
│   └── login.spec.ts        # Login test scenarios
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

*The structure may grow as additional page objects and scenarios are
added.*

## Prerequisites

-   [Node.js](https://nodejs.org/) (an active LTS version is
    recommended)
-   npm (included with Node.js)
-   Git

## Setup

Clone the repository:

``` bash
git clone https://github.com/ankit19apr/sauce-demo-playwright.git
cd sauce-demo-playwright
```

Install dependencies:

``` bash
npm install
```

Install Playwright browsers if they are not already installed:

``` bash
npx playwright install
```

## Running Tests

Run the full test suite:

``` bash
npm test
```

Run tests with the browser UI visible:

``` bash
npm run test:headed
```

Run tests in Chromium only:

``` bash
npm run test:chromium
```

Open the HTML report after a test run:

``` bash
npm run report
```

These commands assume the corresponding scripts are present in
`package.json`.

You can also run Playwright directly:

``` bash
npx playwright test
npx playwright test --project=chromium
npx playwright test --headed
```

## Browser Projects

The Playwright configuration defines these browser projects:

-   Chromium
-   Firefox
-   WebKit

Run one project at a time:

``` bash
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Framework Design

### Page Object Model

`pages/LoginPage.ts` encapsulates the login page's locators and login
action. This keeps page-specific implementation details out of the test
and supports reuse.

### Custom Fixtures

`fixture/myfixtures.ts` extends Playwright's built-in test object and
provides a reusable `loginPage` fixture. Tests can import `test` and
`expect` from the custom fixture module when they need that fixture.

### Test Data

`test-data/loginData.ts` stores reusable login data separately from test
logic, helping keep scenarios readable and easier to maintain.

### Configuration

`playwright.config.ts` sets the test directory, base URL, browser
projects, HTML reporter, and trace collection on the first retry.

## Application Under Test

-   URL: https://www.saucedemo.com/
-   Use only accounts and credentials provided by the SauceDemo demo
    application.
-   Do not commit private credentials, access tokens, or `.env` files to
    source control.

## Test Results and Troubleshooting

-   Playwright's HTML report is generated after a run when the HTML
    reporter is enabled.
-   If a browser is missing, run `npx playwright install`.
-   If a test fails, inspect the terminal output and open the HTML
    report with `npm run report`.
-   For TypeScript checks, run:

``` bash
npx tsc --noEmit
```

## Git Workflow

Check changed files:

``` bash
git status
```

Stage and commit changes:

``` bash
git add .
git commit -m "Describe your change"
```

Push the current branch:

``` bash
git push
```

## Planned Improvements

-   Add page objects for product listing, cart, and checkout.
-   Expand coverage for sorting, cart operations, checkout validation,
    and logout.
-   Add clear test tags or suites for smoke and regression execution.
-   Improve CI execution and publish test reports through GitHub
    Actions.

## Learning Focus

This repository is a hands-on learning project focused on practical
Playwright and TypeScript skills for SDET / QA Automation Engineer
roles. The framework will evolve as additional scenarios and engineering
practices are implemented.

------------------------------------------------------------------------

**Author:** [ankit19apr](https://github.com/ankit19apr)
