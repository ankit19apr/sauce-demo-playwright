# SauceDemo Playwright Automation Framework

A UI automation framework for [SauceDemo](https://www.saucedemo.com/)
built with **Playwright**, **TypeScript**, and the **Page Object Model
(POM)**. It includes reusable fixtures, authenticated test setup,
cross-browser testing, GitHub Actions CI with four-way sharding,
consolidated HTML reporting, and TypeScript/ESLint quality gates.

## Features

-   Page Object Model with dedicated page classes.
-   Reusable Playwright fixtures.
-   Authentication setup using saved browser storage state.
-   Cross-browser execution across Chromium, Firefox, and WebKit.
-   UI coverage for login, inventory, product details, sorting, cart
    operations, checkout, order confirmation, and negative checkout
    validation.
-   Screenshots on failure and traces on the first retry.
-   TypeScript checks with `tsc --noEmit`.
-   ESLint checks for JavaScript/TypeScript code quality.
-   GitHub Actions on pushes to `main`, pull requests targeting `main`,
    and manual workflow dispatch.
-   Four-way Playwright sharding and merged HTML reporting.

## Tech Stack

-   TypeScript and Node.js
-   Playwright Test (`@playwright/test`)
-   ESLint with `typescript-eslint`
-   Git and GitHub
-   GitHub Actions

## Framework Architecture

The framework separates test scenarios, page-specific interactions,
shared fixtures, authentication, and test data.

``` mermaid
flowchart TD
    A["Playwright Test Specs<br/>tests/*.spec.ts"] --> B["Custom Fixtures<br/>fixture/myfixtures.ts"]
    B --> C["Page Object Model"]
    C --> D["LoginPage"]
    C --> E["InventoryPage"]
    C --> F["ProductDetailsPage"]
    C --> G["CartPage"]
    C --> H["CheckoutPage"]
    D --> I["SauceDemo Web Application"]
    E --> I
    F --> I
    G --> I
    H --> I
    J["Authentication Setup<br/>auth/auth.setup.ts"] --> K["Saved Storage State<br/>playwright/.auth/user.json"]
    K --> B
    L["Test Data<br/>test-data/loginData.ts"] --> D
    M["Utilities<br/>utils/screenshotHelper.ts"] --> A
```

### Main components

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  `tests/`                            Test scenarios and assertions for
                                      login, inventory, cart, and
                                      checkout.

  `pages/`                            Page Object Model classes
                                      encapsulating locators and page
                                      actions.

  `fixture/myfixtures.ts`             Reusable test fixtures and shared
                                      setup.

  `auth/auth.setup.ts`                Signs in and saves browser storage
                                      state for dependent projects.

  `test-data/`                        Centralized test data such as login
                                      data.

  `utils/`                            Shared helper utilities.

  `playwright.config.ts`              Test discovery, reporters, retries,
                                      workers, browser projects, and
                                      project dependencies.

  `tsconfig.json`                     TypeScript compiler settings.

  `eslint.config.mjs`                 ESLint flat configuration and lint
                                      rules.
  -----------------------------------------------------------------------

## CI/CD Architecture

The GitHub Actions workflow runs code-quality checks before browser
installation and test execution. Four shard jobs execute in parallel;
each uploads a Playwright blob report. A merge job combines available
reports and uploads a consolidated HTML report.

``` mermaid
flowchart TD
    A["Push to main / Pull Request / Manual Run"] --> B["GitHub Actions Workflow"]
    B --> C["Checkout + Setup Node.js"]
    C --> D["npm ci"]
    D --> E["TypeScript Check<br/>npm run typecheck"]
    E --> F["ESLint Check<br/>npm run lint"]
    F --> G["Four Shard Jobs in Parallel"]
    G --> H1["Shard 1<br/>Install browsers + run tests"]
    G --> H2["Shard 2<br/>Install browsers + run tests"]
    G --> H3["Shard 3<br/>Install browsers + run tests"]
    G --> H4["Shard 4<br/>Install browsers + run tests"]
    H1 --> I1["blob-report-1"]
    H2 --> I2["blob-report-2"]
    H3 --> I3["blob-report-3"]
    H4 --> I4["blob-report-4"]
    I1 --> J["Merge Reports"]
    I2 --> J
    I3 --> J
    I4 --> J
    J --> K["consolidated-playwright-report<br/>HTML Artifact"]
```

### CI workflow stages

1.  Check out the repository.
2.  Set up Node.js.
3.  Install dependencies with `npm ci`.
4.  Run the TypeScript quality check using `npm run typecheck`.
5.  Run ESLint using `npm run lint`.
6.  Install Playwright browsers and Linux system dependencies in each
    shard job.
7.  Run the assigned Playwright shard.
8.  Upload each shard's blob report.
9.  Download and merge available blob reports.
10. Upload the consolidated HTML report artifact.

> **Note:** Four shards run on separate GitHub-hosted runners. Each
> shard currently installs Chromium, Firefox, and WebKit, so initial
> runs may spend significant time downloading browsers. Sharding does
> not guarantee a fourfold speed improvement.

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
│   └── .auth/                 # Generated locally; do not commit
├── eslint.config.mjs
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

This tree shows the main project files; supporting files may be added as
the framework evolves.

## Prerequisites

-   Node.js and npm
-   Git
-   A GitHub account for CI execution

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

For local testing:

``` bash
npx playwright install
```

On the Linux CI runner, browsers and system dependencies are installed
with:

``` bash
npx playwright install --with-deps
```

## Run Tests and Quality Checks

  -------------------------------------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- -------------------------------------------------------------------
  Run the full Playwright suite       `npm test`

  Run tests in headed mode            `npm run test:headed`

  Run the Chromium project            `npm run test:chromium`

  TypeScript type check               `npm run typecheck`

  ESLint code-quality check           `npm run lint`

  Open the local HTML report          `npm run report`

  Run shard 1 of 4 locally            `npx playwright test --shard=1/4`

  Merge downloaded blob reports       `npx playwright merge-reports --reporter html ./all-blob-reports`
  -------------------------------------------------------------------------------------------------------

## Authentication

The `auth/auth.setup.ts` setup project signs in using the `LoginPage`
page object and saves browser storage state to:

``` text
playwright/.auth/user.json
```

The Chromium, Firefox, and WebKit projects depend on the setup project
and use this saved state. The authentication file contains session data
and must not be committed.

The setup imports `loginData` from `test-data/loginData.ts`. Do not
commit real credentials or secrets. If credentials are moved to
environment variables or GitHub Secrets, update the login-data
implementation to read them securely.

Ensure `.gitignore` excludes generated files and authentication state,
for example:

``` gitignore
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/playwright/.auth/
.env
.env.*
!.env.example
```

## TypeScript Configuration

The `tsconfig.json` file configures TypeScript checking. The `typecheck`
script runs:

``` bash
tsc --noEmit
```

This checks the included TypeScript files without emitting JavaScript
output.

## ESLint Configuration

The `eslint.config.mjs` file uses ESLint's flat configuration,
recommended JavaScript rules, and recommended TypeScript rules from
`typescript-eslint`.

Run linting with:

``` bash
npm run lint
```

Linting and TypeScript type checking complement one another; neither
replaces executing the tests.

## GitHub Actions and Consolidated Reporting

Workflow file:

``` text
.github/workflows/playwright.yml
```

The workflow runs on pushes to `main`, pull requests targeting `main`,
and manual execution using `workflow_dispatch`.

To download the consolidated report:

1.  Open the repository on GitHub.
2.  Select **Actions**.
3.  Open a completed **Playwright Tests** workflow run.
4.  Find `consolidated-playwright-report` in the run summary's Artifacts
    section.
5.  Download and extract the ZIP.
6.  Open `index.html` in a browser.

The current workflow retains individual shard artifacts for one day and
the consolidated HTML report for 14 days.

A shard that fails after producing a blob report may still upload that
report. If a job fails before producing a report, merging may require
troubleshooting. Review the GitHub Actions logs if dependency
installation, quality checks, authentication, browser installation,
tests, or report merging fails.

## Test Coverage

The suite covers the main SauceDemo user journeys:

-   Login scenarios
-   Inventory and product details
-   Product sorting
-   Adding and removing cart items
-   Checkout information and overview
-   Order completion
-   Negative checkout validation

Refer to the spec files under `tests/` for individual scenarios.

## Troubleshooting

### TypeScript check fails

Run `npm run typecheck`, review the compiler errors, and fix the
relevant source or type configuration.

### ESLint reports errors

Run `npm run lint`. Review the file, line, and rule reported. Fix the
code where appropriate rather than disabling rules without a reason.

### Browser executable is missing

Run:

``` bash
npx playwright install
```

### Authentication storage state is missing

Confirm that the setup project completes successfully and writes
`playwright/.auth/user.json`. Ensure the directory exists before the
storage-state file is written.

### Tests fail only in CI

Inspect the failed step and logs in GitHub Actions. Review screenshots,
traces, timeouts, and differences between local and CI environments.

### Consolidated report is missing

Confirm that shard jobs produced and uploaded blob reports, the merge
job downloaded them, and `playwright merge-reports` completed
successfully.

## Potential Next Improvements

-   Optimize CI browser installation and caching based on measured
    runtime.
-   Preserve traces and screenshots as CI artifacts where useful.
-   Add API automation with Playwright's `APIRequestContext`.
-   Separate smoke and regression workflows.
-   Add accessibility checks, SQL/data validation, and performance
    testing.
-   Explore AI-assisted failure triage with human review.

## Author

**Ankit Sharma**

Repository: https://github.com/ankit19apr/sauce-demo-playwright
