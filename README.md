# SauceDemo Playwright Automation Framework

A UI test automation framework for
[SauceDemo](https://www.saucedemo.com/) built with **Playwright**,
**TypeScript**, and the **Page Object Model (POM)**. The project
includes reusable fixtures, authenticated test setup, cross-browser
execution, and GitHub Actions CI with sharding and consolidated HTML
reporting.

## Features

-   **Page Object Model:** page classes encapsulate locators and user
    actions.
-   **Reusable fixtures:** shared test setup through custom Playwright
    fixtures.
-   **Authentication setup:** logs in and saves browser storage state
    for dependent projects.
-   **Cross-browser coverage:** Chromium, Firefox, and WebKit.
-   **UI test coverage:** login, inventory, product details, sorting,
    cart operations, checkout, order confirmation, and negative checkout
    validation.
-   **Failure evidence:** screenshots on failure and traces on the first
    retry.
-   **CI execution:** GitHub Actions runs on pushes to `main`, pull
    requests targeting `main`, and manual workflow dispatch.
-   **Sharding and reporting:** CI uses Playwright's blob reporter so
    shard reports can be merged into one HTML report artifact.

## Tech Stack

-   TypeScript
-   Node.js and npm
-   `@playwright/test`
-   Git and GitHub
-   GitHub Actions

## Project Structure

``` text
sauce-demo-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── auth/
│   └── auth.setup.ts
├── fixture/
│   └── myfixtures.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── ProductDetailsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   └── loginData.ts
├── tests/
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── utils/
│   └── screenshotHelper.ts
├── playwright/
│   └── .auth/                 # Generated locally; not committed
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

> This tree shows the main project files; supporting files may be added
> as the framework evolves.

## Prerequisites

-   Node.js and npm
-   Git
-   A GitHub account to use the CI workflow

The current GitHub Actions workflow uses Node.js 22.

## Setup

### 1. Clone the repository

``` bash
git clone https://github.com/ankit19apr/sauce-demo-playwright.git
cd sauce-demo-playwright
```

### 2. Install dependencies

``` bash
npm ci
```

### 3. Install Playwright browsers

For local cross-browser testing:

``` bash
npx playwright install
```

On Linux CI runners, the workflow installs browsers and system
dependencies using:

``` bash
npx playwright install --with-deps
```

### 4. Run the tests

Run the full suite:

``` bash
npm test
```

Run tests in headed mode:

``` bash
npm run test:headed
```

Run the Chromium project:

``` bash
npm run test:chromium
```

Open the most recent local HTML report:

``` bash
npm run report
```

The exact available npm scripts are defined in `package.json`.

## Authentication

The `auth/auth.setup.ts` setup project signs in through the `LoginPage`
page object and saves authenticated browser state to:

``` text
playwright/.auth/user.json
```

The Chromium, Firefox, and WebKit projects depend on the setup project
and use this saved state. The storage-state file contains session data
and must not be committed.

The authentication setup imports `loginData` from
`test-data/loginData.ts`. Do not commit real credentials, passwords, or
other secrets. If credentials are moved to environment variables or
GitHub Secrets, update the login-data implementation to read them
securely.

The repository's `.gitignore` should exclude at least:

``` gitignore
/playwright/.auth/
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
.env
.env.*
!.env.example
```

## GitHub Actions CI

Workflow file:

``` text
.github/workflows/playwright.yml
```

The workflow runs on:

-   Pushes to `main`
-   Pull requests targeting `main`
-   Manual execution using `workflow_dispatch`

The workflow runs four shard jobs in parallel. Each shard installs
dependencies and Playwright browsers, then executes its assigned portion
of the suite. Each job uploads a Playwright blob report. A dependent
merge job downloads the shard reports, merges them, and uploads one
consolidated HTML report.

### CI reporting flow

``` text
GitHub event
    |
    v
Four parallel shard jobs
    |
    +--> Shard 1 --> blob report
    +--> Shard 2 --> blob report
    +--> Shard 3 --> blob report
    +--> Shard 4 --> blob report
                    |
                    v
              Merge reports
                    |
                    v
       consolidated-playwright-report
```

### Download the consolidated report

1.  Open the repository on GitHub.
2.  Select **Actions**.
3.  Open the completed **Playwright Tests** workflow run.
4.  In the run summary, find `consolidated-playwright-report`.
5.  Download and extract the ZIP.
6.  Open `index.html` in a browser.

The individual shard artifacts are named `blob-report-1`,
`blob-report-2`, `blob-report-3`, and `blob-report-4`. The current
workflow retains them for one day and retains the consolidated HTML
report for 14 days.

### Notes about sharding

-   Sharding distributes test execution across separate GitHub-hosted
    jobs; it does not guarantee a proportional speed improvement.
-   The current workflow installs Chromium, Firefox, and WebKit in each
    shard job, which can make initial runs slow.
-   A shard that fails after tests start can still upload its report
    when a blob report exists. If a job fails before producing a report,
    report merging may need troubleshooting.
-   Review workflow logs if browser installation, authentication setup,
    tests, or report merging fails.

## Test Coverage

The framework covers the main SauceDemo user journeys, including:

-   Login scenarios
-   Inventory and product details
-   Product sorting
-   Adding and removing cart items
-   Checkout information and order overview
-   Order completion
-   Negative checkout validation

For the current list of individual scenarios, refer to the spec files in
`tests/`.

## Troubleshooting

### Browser executable is missing

``` bash
npx playwright install
```

### Authentication storage state is missing

Confirm that the setup project runs successfully and saves
`playwright/.auth/user.json`. Ensure the authentication directory exists
before the storage-state file is written.

### Tests fail only in CI

Inspect the failed step in GitHub Actions. Check browser/test logs,
screenshots, traces, environment differences, timeouts, and
dependency-installation errors. CI uses retries and one Playwright
worker per shard in the current configuration.

### Consolidated report is missing

Confirm that each shard produced and uploaded its `blob-report/` output,
that the merge job downloaded the shard artifacts, and that
`merge-reports` completed successfully.

## Useful Commands

  -------------------------------------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- -------------------------------------------------------------------
  Install dependencies                `npm ci`

  Install local browsers              `npx playwright install`

  Run all tests                       `npm test`

  Run headed tests                    `npm run test:headed`

  Run Chromium project                `npm run test:chromium`

  Open local HTML report              `npm run report`

  Run shard 1 of 4 locally            `npx playwright test --shard=1/4`

  Merge downloaded blob reports       `npx playwright merge-reports --reporter html ./all-blob-reports`
  -------------------------------------------------------------------------------------------------------

## Future Improvements

-   Cache dependencies or browser downloads where it measurably improves
    CI time.
-   Retain traces and screenshots as CI artifacts when useful.
-   Add API tests and integrate them into the pipeline.
-   Add scheduled cross-browser runs or separate smoke and regression
    workflows.
-   Expand test data management and secret handling.

## Author

**Ankit Sharma**

Repository: https://github.com/ankit19apr/sauce-demo-playwright
