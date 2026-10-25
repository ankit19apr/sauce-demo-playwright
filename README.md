# 🚀 Playwright & TypeScript Automation Framework \| UI, REST API & CI/CD

A QA/SDET automation framework demonstrating end-to-end UI testing of
**SauceDemo**, REST API testing against **JSONPlaceholder**,
authentication API testing against **DummyJSON**, and CI execution with
**GitHub Actions**.

The framework uses Playwright Test with TypeScript, Page Object Model
(POM), reusable fixtures and API clients, Zod response validation, and
two reporting options: the native Playwright HTML report and **Allure
Report**.

> **Project note:** The project structure and project names below
> reflect the intended current framework. Keep them aligned with the
> actual files in `playwright.config.ts` and the repository.

## Table of Contents

-   [Overview](#overview)
-   [Technology Stack](#technology-stack)
-   [Framework Architecture](#framework-architecture)
-   [Project Structure](#project-structure)
-   [UI Automation Design](#ui-automation-design)
-   [API Automation Design](#api-automation-design)
-   [Authentication and Token
    Lifecycle](#authentication-and-token-lifecycle)
-   [Setup](#setup)
-   [Running Tests](#running-tests)
-   [Reporting and Test Evidence](#reporting-and-test-evidence)
-   [GitHub Actions CI](#github-actions-ci)
-   [Environment Variables and
    Security](#environment-variables-and-security)
-   [Troubleshooting](#troubleshooting)
-   [Skills Demonstrated](#skills-demonstrated)

## Overview

The framework demonstrates practical QA/SDET engineering skills:

-   End-to-end UI automation for SauceDemo.
-   Page Object Model to separate locators and page actions from test
    scenarios.
-   Shared fixtures for reusable setup and controlled resource cleanup.
-   Cross-browser testing with Chromium, Firefox, and WebKit.
-   API testing against JSONPlaceholder and DummyJSON practice APIs.
-   Reusable, typed API clients.
-   Zod runtime validation for selected response payloads.
-   Bearer-token authentication, token reuse, refresh flow, and a
    bounded retry for authenticated GET requests.
-   TypeScript type checking and ESLint quality checks.
-   GitHub Actions CI with sharded UI execution, API testing, uploaded
    artifacts, and consolidated reporting.
-   Native Playwright HTML reporting plus Allure reporting.

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Node.js and npm                     Runtime and dependency management

  TypeScript                          Static typing for tests, API
                                      clients, and helpers

  Playwright Test                     UI/API test runner, fixtures,
                                      assertions, projects, and reporters

  Allure (`allure`)                   Generates and serves Allure reports

  `allure-playwright`                 Collects Playwright test results
                                      for Allure

  Zod                                 Runtime validation of selected API
                                      response shapes

  dotenv                              Loads local environment variables
                                      from `.env`

  ESLint                              Code-quality and lint checks

  GitHub Actions                      CI execution on pushes, pull
                                      requests, and manual runs
  -----------------------------------------------------------------------

## Framework Architecture

The framework separates test scenarios, reusable UI components, API
clients, configuration, and CI execution.

``` mermaid
flowchart TD
    A[Playwright Test Runner] --> B[UI Test Suites]
    A --> C[API Test Suites]

    B --> D[Custom UI Fixtures]
    D --> E[Authenticated Page]
    E --> F[Page Objects]
    F --> G[SauceDemo]
    B --> H[Screenshots and Test Evidence]

    C --> I[Posts API Tests]
    C --> J[Authentication API Tests]
    I --> K[PostsApi Client]
    J --> L[AuthApi]
    J --> M[AuthenticatedApiClient]
    J --> N[Authentication Fixtures]
    K --> O[JSONPlaceholder API]
    L --> P[DummyJSON API]
    M --> P
    N --> L

    Q[playwright.config.ts] --> A
    A --> R[Playwright HTML Report]
    A --> S[Allure Results]
    A --> T[CI Blob Reports]
    T --> U[Merge Reports]
    U --> V[Consolidated Playwright HTML Artifact]
    S --> W[Allure Report Generation]
    W --> X[Consolidated Allure Artifact]
```

### Main layers

1.  **Test layer:** Describes scenarios and assertions.
2.  **Fixture layer:** Provides reusable setup and controlled resource
    cleanup.
3.  **UI page-object layer:** Encapsulates page locators and user
    interactions.
4.  **API client layer:** Centralizes HTTP operations, typing, and
    authentication behavior.
5.  **Validation layer:** Checks response status, headers, payload
    values, and selected Zod schemas.
6.  **Configuration and CI layer:** Selects projects, browsers,
    execution settings, and report handling.

## Project Structure

Key folders and files in the framework:

``` text
sauce-demo-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow
├── api/
│   ├── PostsApi.ts              # Typed Posts API client
│   ├── AuthApi.ts               # Login, token cache and refresh handling
│   └── AuthenticatedApiClient.ts # Authenticated GET and bounded retry
├── api-tests/
│   └── posts.spec.ts            # JSONPlaceholder API tests
├── auth-api-tests/
│   ├── auth.spec.ts             # DummyJSON authentication tests
│   └── fixtures.ts              # Authenticated API client fixture
├── auth/                        # Authentication setup
├── pages/                       # UI Page Object Model classes
├── fixture/                     # Shared UI test fixtures
├── utils/                       # Helpers such as screenshot capture
├── tests/                       # UI test scenarios, including checkout tests
├── playwright.config.ts         # Projects, base URLs, reporters and settings
├── package.json                 # Scripts and dependencies
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Safe environment-variable template, if present
├── .gitignore                   # Excludes secrets and generated files
└── README.md
```

### File responsibilities

  ------------------------------------------------------------------------
  File/folder                          Responsibility
  ------------------------------------ -----------------------------------
  `pages/`                             Encapsulates UI locators and page
                                       actions using POM

  `fixture/`                           Shares UI setup, such as
                                       authenticated pages

  `utils/`                             Reusable helpers, including
                                       screenshot capture where configured

  `api/PostsApi.ts`                    Typed GET, filtered GET, POST, PUT,
                                       PATCH, and DELETE operations

  `api/AuthApi.ts`                     Login, token reuse, refresh
                                       exchange, and renewal fallback

  `api/AuthenticatedApiClient.ts`      Adds bearer authentication to GET
                                       requests and retries once after
                                       `401`

  `api-tests/posts.spec.ts`            Posts API assertions and response
                                       validation

  `auth-api-tests/auth.spec.ts`        Login, protected-resource,
                                       invalid-token, reuse, and refresh
                                       scenarios

  `auth-api-tests/fixtures.ts`         Creates and disposes the
                                       authenticated API request context

  `playwright.config.ts`               Configures test directories,
                                       projects, base URLs, and reporters

  `.github/workflows/playwright.yml`   CI workflow and report artifact
                                       handling
  ------------------------------------------------------------------------

## UI Automation Design

The UI layer follows the Page Object Model pattern:

``` mermaid
flowchart LR
    A[UI Test Scenario] --> B[Custom Fixture]
    B --> C[Authenticated Playwright Page]
    A --> D[Page Object]
    D --> E[Locators and Page Actions]
    E --> C
    C --> F[SauceDemo Application]
    A --> G[Assertions]
    A --> H[Screenshot Helper]
```

### Why use Page Objects?

-   Locators and page interactions live in reusable classes.
-   Test scenarios focus on business behavior and assertions.
-   Shared page methods reduce duplication.
-   Locator changes can often be maintained in one place.

Prefer Playwright's auto-waiting locators and web-first assertions.
Avoid fixed sleeps unless a condition-based wait cannot reasonably
address the situation.

## API Automation Design

### Posts API

**Base URL:** `https://jsonplaceholder.typicode.com`

The `api/PostsApi.ts` client centralizes request methods and typed
responses.

Current coverage described for this suite includes:

-   Retrieve a post.
-   Verify a missing post returns `404`.
-   Filter posts by `userId`.
-   Verify a filter with no matches returns an empty array.
-   Create a post.
-   Replace a post with PUT.
-   Partially update a post with PATCH.
-   Delete a post.
-   Validate selected response shapes with Zod.

JSONPlaceholder is a practice API; write operations simulate behavior
and should not be treated as persistent production data.

### Authentication API

**Base URL:** `https://dummyjson.com`

The authentication suite covers:

-   Access a protected endpoint using valid authentication.
-   Reject requests with no token.
-   Reject requests with an invalid token.
-   Reuse a token while the local cache considers it valid.
-   Refresh a session and verify the refreshed access token can access
    `/auth/me`.

### API request and validation flow

``` mermaid
sequenceDiagram
    participant T as API Test
    participant C as API Client
    participant S as Practice API
    participant V as Assertions / Zod

    T->>C: Call typed client method
    C->>S: Send HTTP request
    S-->>C: Return status, headers and body
    C-->>T: Return response and parsed body
    T->>V: Assert status and response contract
    V-->>T: Pass or fail
```

## Authentication and Token Lifecycle

The authentication client is designed to avoid logging in before every
protected GET request.

``` mermaid
flowchart TD
    A[Authenticated GET requested] --> B[Ask AuthApi for tokens]
    B --> C{Cached access token valid?}
    C -->|Yes| D[Reuse access token]
    C -->|No| E{Cached refresh token available?}
    E -->|Yes| F[Try refresh endpoint]
    F -->|Success| G[Store rotated token pair]
    F -->|Failure| H[Clear cache and log in]
    E -->|No| H
    H --> I[Store new token pair]
    G --> D
    I --> D
    D --> J[Send GET with Bearer token]
    J --> K{HTTP status is 401?}
    K -->|No| L[Return response to test]
    K -->|Yes| M[Renew tokens]
    M --> N[Retry GET once]
    N --> O[Return second response]
```

### Retry policy

-   Only the client's **GET** method is exposed for authenticated
    requests in this implementation.
-   A `401 Unauthorized` response triggers a renewal attempt and exactly
    one retry.
-   A second `401` is returned to the test; the client does not retry
    indefinitely.
-   A `403 Forbidden` response does not trigger renewal.
-   Refresh failure falls back to login in the current practice
    implementation.

### Important implementation limits

-   Expiry is estimated from the requested token lifetime with a safety
    buffer; the implementation does not decode a JWT `exp` claim.
-   The in-memory cache is shared by `AuthApi` instances in the same
    Node.js worker process. Separate Playwright workers have separate
    caches.
-   A production implementation may need cache keys scoped by API issuer
    and identity, plus synchronization for concurrent refresh-token
    rotation.
-   These are public practice API credentials. Do not use this example
    as a production secrets-management pattern beyond the
    environment-variable approach.

## Setup

### Prerequisites

Install Node.js and npm. The current GitHub Actions workflow uses
Node.js 22.

``` bash
node --version
npm --version
```

### Install dependencies

Run from the project root:

``` bash
npm ci
npx playwright install
```

On Linux CI, browser system dependencies are installed with:

``` bash
npx playwright install --with-deps
```

### Configure local authentication credentials

Create a `.env` file in the repository root:

``` dotenv
AUTH_API_USERNAME=emilys
AUTH_API_PASSWORD=emilyspass
```

These are public DummyJSON practice credentials. The authentication
fixture loads environment variables with dotenv.

Ensure `.gitignore` contains:

``` gitignore
.env
.env.*
!.env.example
```

Optionally commit a `.env.example` containing empty values:

``` dotenv
AUTH_API_USERNAME=
AUTH_API_PASSWORD=
```

Never commit real passwords, access tokens, refresh tokens, or private
API credentials.

## Running Tests

Run commands from the project root.

### Quality checks

``` bash
npm run typecheck
npm run lint
```

### UI tests

Run all tests selected by the configuration:

``` bash
npm test
```

Run tests in a specific browser project:

``` bash
npm run test:chromium
```

Or use the Playwright CLI directly:

``` bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Run the checkout tests in WebKit:

``` bash
npx playwright test tests/checkout.spec.ts --project=webkit
```

### API tests

``` bash
# JSONPlaceholder Posts API suite
npx playwright test --project=api

# DummyJSON authentication suite
npx playwright test --project=auth-api

# Both API suites
npx playwright test --project=auth-api --project=api
```

### Run in headed mode

``` bash
npm run test:headed
```

## Reporting and Test Evidence

The framework supports both the native Playwright HTML report and Allure
reporting.

### Native Playwright HTML report

The configured local HTML reporter generates a report without
automatically opening it.

``` bash
npm run report
```

If no report is available, run tests first to generate one.

### Allure report

`allure-playwright` collects test results in `allure-results/`. The
`allure` CLI generates an HTML report in `allure-report/`.

**Generate a report after running tests:**

``` bash
npm run allure:generate
```

**Open an already generated report:**

``` bash
npm run allure:open
```

**Serve a report directly from the raw results:**

``` bash
npm run allure:serve
```

**Remove generated Allure files:**

``` bash
npm run allure:clean
```

`allure:clean` removes both `allure-results/` and `allure-report/`. Run
it before a fresh test execution only when you no longer need the
previous results.

### What the reports provide

-   Test status summaries and test-level details.
-   Failed-test information to support debugging.
-   Execution breakdowns and visual summaries supported by the Allure
    report.
-   A separate native Playwright HTML report for familiar Playwright
    diagnostics.

Playwright trace and screenshot collection remain controlled by
`playwright.config.ts`. For example, `trace: 'on-first-retry'` and
`screenshot: 'only-on-failure'` collect evidence according to the
configured run behavior.

**Trend/history note:** Allure can show historical trends when prior
report history is carried forward between runs. Generating a report from
only the current run's results does not by itself preserve historical
trends. The current workflow generates and uploads a consolidated
report; persistent cross-run trend history requires an additional
history-preservation step.

### Generated report directories

These generated directories should not be committed:

``` text
allure-results/
allure-report/
playwright-report/
blob-report/
test-results/
```

The repository `.gitignore` should exclude generated reports and test
results.

## GitHub Actions CI

Workflow file:

``` text
.github/workflows/playwright.yml
```

The workflow is configured to run on:

-   Pushes to `main`.
-   Pull requests targeting `main`.
-   Manual execution through `workflow_dispatch`.

### CI stages

  -----------------------------------------------------------------------
  Job                                 Purpose
  ----------------------------------- -----------------------------------
  `test`                              Runs Chromium, Firefox, and WebKit
                                      UI tests in four shards

  `api-tests`                         Runs the `auth-api` and `api`
                                      projects

  `merge-reports`                     Downloads available report
                                      artifacts, merges Playwright Blob
                                      reports, and generates consolidated
                                      reports
  -----------------------------------------------------------------------

The workflow uses Node.js 22, installs dependencies with `npm ci`, and
runs type checking and linting in the UI job. UI shards and the API job
upload their Playwright Blob reports and Allure results. The merge job
combines the Playwright reports and merges Allure result files before
generating the report artifacts.

The consolidated Playwright HTML and Allure report artifacts are
configured for retention for 14 days. Verify the actual workflow run in
GitHub Actions before stating that CI passed.

### Configure GitHub Secrets

In your GitHub repository, navigate to:

**Settings → Secrets and variables → Actions → New repository secret**

Create these repository secrets:

  Secret                Purpose
  --------------------- -----------------------------
  `AUTH_API_USERNAME`   DummyJSON practice username
  `AUTH_API_PASSWORD`   DummyJSON practice password

The workflow maps these secrets to environment variables for the API
test job. Keep credentials out of workflow YAML and logs.

### Validate CI

After pushing changes:

1.  Open the repository's **Actions** tab.
2.  Open the latest **Playwright Tests** workflow run.
3.  Check the UI shard jobs and API job.
4.  Check the report merge job.
5.  Download and open the consolidated Playwright HTML and Allure report
    artifacts.

A locally passing suite does not guarantee that an external practice API
or GitHub-hosted workflow will pass on every run.

## Environment Variables and Security

-   Keep `.env` ignored by Git.
-   Store CI credentials in GitHub Secrets.
-   Never print passwords, access tokens, or refresh tokens in logs.
-   Use dedicated practice accounts and non-production data.
-   Do not commit generated report directories.
-   Review artifacts before sharing them, because test attachments or
    logs can contain sensitive information if tests capture it.

## Troubleshooting

### Missing authentication environment variables

-   Verify `.env` exists locally and uses the exact variable names.
-   Verify GitHub repository secrets are present.
-   Verify the workflow maps both secrets into the API test step.

### Project not found

The `--project` value must exactly match a project name in
`playwright.config.ts`.

### API test failure

-   Check the API base URL for the selected project.
-   Confirm the practice API is available.
-   Inspect status codes and response bodies without logging credentials
    or tokens.
-   Remember that public practice APIs may change behavior or
    availability.

### Allure report is empty or missing results

1.  Run tests with the configured `allure-playwright` reporter.

2.  Check that `allure-results/` contains result files.

3.  Generate the report after the test run:

    ``` bash
    npm run allure:generate
    ```

4.  If the CLI reports an invalid option, check the installed CLI help
    and align the script with that installed version.

5.  In CI, check that each test job uploads its `allure-results/`
    directory and that the merge job downloads the artifacts.

### Blob report merge failure

-   Ensure the `blob` reporter is enabled in CI.
-   Ensure each UI shard and the API job upload the `blob-report/`
    directory.
-   Ensure the merge job downloads the matching Blob report artifacts.
-   Check the merge-job logs for missing or invalid report files.

### Type-check or lint failure

Run locally and resolve the reported issue before pushing:

``` bash
npm run typecheck
npm run lint
```

## Skills Demonstrated

This project can support SDET/QA Automation interview discussions
around:

-   Playwright with TypeScript.
-   Page Object Model and custom fixtures.
-   Cross-browser execution and sharding.
-   UI checkout validation and regression testing.
-   API CRUD testing and HTTP status validation.
-   Zod runtime schema validation.
-   Bearer-token authentication and refresh-token rotation.
-   Safe, bounded retry behavior for GET requests.
-   Native Playwright HTML and Allure reporting.
-   GitHub Actions CI, report merging, and artifact handling.
-   Test isolation, environment configuration, and secret hygiene.

------------------------------------------------------------------------

**Status:** This README documents the framework design and intended
CI/reporting behavior. Confirm the latest GitHub Actions run before
claiming that a specific pipeline execution passed.
