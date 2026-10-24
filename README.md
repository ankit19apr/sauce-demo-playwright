# SauceDemo Playwright Automation Framework

A practical **Playwright + TypeScript** framework for browser UI
automation and API testing. The project combines reusable UI components,
typed API clients, authentication handling, response validation, and
GitHub Actions CI.

> **Project note:** The paths and API files listed below reflect the
> current project context. Keep the names of browser projects and any
> additional UI folders aligned with the actual `playwright.config.ts`
> and repository.

## Table of Contents

-   [Overview](#overview)
-   [Technology Stack](#technology-stack)
-   [Framework Architecture](#framework-architecture)
-   [Test Execution Flow](#test-execution-flow)
-   [Project Structure](#project-structure)
-   [UI Automation Design](#ui-automation-design)
-   [API Automation Design](#api-automation-design)
-   [Authentication and Token
    Lifecycle](#authentication-and-token-lifecycle)
-   [Setup](#setup)
-   [Running Tests](#running-tests)
-   [Reporting and Evidence](#reporting-and-evidence)
-   [GitHub Actions CI](#github-actions-ci)
-   [Environment Variables and
    Security](#environment-variables-and-security)
-   [Troubleshooting](#troubleshooting)

## Overview

The framework is designed to demonstrate practical QA/SDET engineering
skills:

-   Browser-based end-to-end tests for SauceDemo.
-   Page Object Model (POM) to separate page locators/actions from test
    scenarios.
-   Shared fixtures for reusable test setup.
-   Screenshot evidence attached to test results where implemented.
-   API tests against JSONPlaceholder and DummyJSON practice APIs.
-   Reusable, typed API clients.
-   Zod runtime validation for selected response payloads.
-   Bearer-token authentication, token reuse, refresh flow, and a
    bounded retry for authenticated GET requests.
-   GitHub Actions execution, sharded UI testing, artifacts, and
    consolidated HTML reporting.

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Node.js and npm                     JavaScript/TypeScript runtime and
                                      dependency management

  TypeScript                          Static typing for tests, API
                                      clients, and helpers

  Playwright Test                     UI and API test runner, fixtures,
                                      assertions, projects, and reporting

  Zod                                 Runtime validation of API response
                                      shapes

  dotenv                              Load local environment variables
                                      from `.env`

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

    B --> D[Custom Fixtures]
    D --> E[Authenticated Page]
    E --> F[Page Objects]
    F --> G[SauceDemo Web Application]
    B --> H[Screenshot Helper / Test Evidence]

    C --> I[Posts API Tests]
    C --> J[Authentication API Tests]
    I --> K[PostsApi Client]
    J --> L[AuthApi]
    J --> M[AuthenticatedApiClient]
    J --> N[Authentication Fixtures]
    K --> O[JSONPlaceholder API]
    L --> P[DummyJSON Auth API]
    M --> P
    N --> L

    Q[playwright.config.ts] --> A
    R[GitHub Actions] --> A
    A --> S[Blob Reports]
    S --> T[Merge Reports]
    T --> U[HTML Report Artifact]
```

### Main layers

1.  **Test layer:** describes scenarios and assertions.
2.  **Fixture layer:** provides reusable setup and controlled resource
    cleanup.
3.  **UI page-object layer:** encapsulates page locators and user
    interactions.
4.  **API client layer:** centralizes HTTP operations, typing, and
    authentication behavior.
5.  **Validation layer:** checks response status, headers, payload
    values, and Zod schemas.
6.  **Configuration and CI layer:** selects projects, browsers, test
    execution settings, and report handling.

## Test Execution Flow

### Local execution

``` mermaid
flowchart TD
    A[Developer runs an npm / Playwright command] --> B[Read Playwright configuration]
    B --> C{Selected project}
    C -->|UI browser project| D[Start browser and create fixtures]
    D --> E[Execute UI test]
    E --> F[Page Objects interact with SauceDemo]
    F --> G[Assertions and optional screenshots]

    C -->|api| H[Run Posts API tests]
    H --> I[PostsApi sends HTTP requests]
    I --> J[Validate status and response body]

    C -->|auth-api| K[Run authentication tests]
    K --> L[Load credentials from environment]
    L --> M[Login / reuse token / refresh as required]
    M --> N[Call protected endpoint and assert response]

    G --> O[Playwright results and reports]
    J --> O
    N --> O
```

### CI execution

``` mermaid
flowchart TD
    A[Push to main / Pull Request / Manual trigger] --> B[GitHub Actions workflow]
    B --> C[Install dependencies]
    C --> D[UI test job: 4 shards]
    C --> E[API test job]

    D --> F[Upload UI blob reports]
    E --> G[Upload API blob report]

    F --> H[Merge report job]
    G --> H
    H --> I[Consolidated HTML report artifact]
```

## Project Structure

The following diagram shows the key folders and files in the current
framework. Other UI test files may exist in the repository.

``` text
sauce-demo-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow (filename may differ)
│
├── api/
│   ├── PostsApi.ts                 # Typed Posts API client
│   ├── AuthApi.ts                  # Login, token cache and refresh handling
│   └── AuthenticatedApiClient.ts   # Authenticated GET and bounded retry
│
├── api-tests/
│   └── posts.spec.ts               # JSONPlaceholder API tests
│
├── auth-api-tests/
│   ├── auth.spec.ts                # DummyJSON authentication tests
│   └── fixtures.ts                 # Authenticated API client fixture
│
├── pages/                          # UI Page Object Model classes
├── fixture/                        # Shared UI test fixtures
├── utils/                           # Helpers such as screenshot capture
│
├── playwright.config.ts             # Projects, base URLs, reporters and settings
├── package.json                    # Scripts and dependencies
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                    # TypeScript configuration (if present)
├── .env.example                     # Safe environment-variable template (optional)
├── .gitignore                       # Excludes secrets and generated files
└── README.md
```

### File responsibilities

  -----------------------------------------------------------------------
  File / folder                       Responsibility
  ----------------------------------- -----------------------------------
  `pages/`                            Encapsulates UI locators and page
                                      actions using the Page Object Model

  `fixture/`                          Shares UI setup such as
                                      authenticated pages between tests

  `utils/`                            Reusable helpers, including
                                      screenshot capture where configured

  `api/PostsApi.ts`                   Typed GET, filtered GET, POST, PUT,
                                      PATCH, and DELETE operations

  `api/AuthApi.ts`                    Login, token reuse, refresh
                                      exchange, and renewal fallback

  `api/AuthenticatedApiClient.ts`     Adds bearer authentication to GET
                                      requests and retries once after
                                      `401`

  `api-tests/posts.spec.ts`           Posts API assertions and response
                                      validation

  `auth-api-tests/auth.spec.ts`       Login, protected-resource,
                                      invalid-token, reuse, and refresh
                                      scenarios

  `auth-api-tests/fixtures.ts`        Creates and disposes the
                                      authenticated API request context

  `playwright.config.ts`              Configures test directories,
                                      projects, base URLs, and reporters

  `.github/workflows/`                CI workflow definition
  -----------------------------------------------------------------------

## UI Automation Design

The UI layer follows the Page Object Model pattern:

``` mermaid
flowchart LR
    A[UI Spec / Test Scenario] --> B[Custom Fixture]
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

Use Playwright's auto-waiting locators and web-first assertions where
possible. Avoid fixed sleeps unless there is a specific reason that
cannot be addressed with a condition-based wait.

## API Automation Design

### Posts API

Base URL: `https://jsonplaceholder.typicode.com`

The `api/PostsApi.ts` client centralizes request methods and typed
responses.

Current test coverage includes:

-   Retrieve a post.
-   Verify a missing post returns `404`.
-   Filter posts by `userId`.
-   Verify a filter with no matches returns an empty array.
-   Create a post.
-   Replace a post with PUT.
-   Partially update a post with PATCH.
-   Delete a post.
-   Validate selected response shapes with Zod.

### Authentication API

Base URL: `https://dummyjson.com`

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
    S-->>C: HTTP status, headers and body
    C-->>T: Response and parsed body
    T->>V: Assert status and response contract
    V-->>T: Pass or fail
```

## Authentication and Token Lifecycle

The authentication client is intended to avoid logging in before every
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
-   The tests use public practice API credentials. Do not use this
    example as a production secrets-management pattern beyond the
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

From the project root:

``` bash
npm ci
npx playwright install
```

On Linux CI, the workflow installs browser system dependencies with:

``` bash
npx playwright install --with-deps
```

### Configure local authentication credentials

Create a `.env` file in the repository root:

``` dotenv
AUTH_API_USERNAME=emilys
AUTH_API_PASSWORD=emilyspass
```

These are public DummyJSON practice credentials. The auth fixture loads
environment variables with `dotenv/config`.

Make sure `.gitignore` includes:

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
npx playwright test
```

Run a specific configured UI project (use the exact project name from
`playwright.config.ts`):

``` bash
npx playwright test --project=chromium
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

### View the HTML report

``` bash
npx playwright show-report
```

This command opens the most recent report directory generated by your
configured reporter.

## Reporting and Evidence

The project uses Playwright reporting and can capture screenshots
through its screenshot helper.

In CI, the workflow is designed to:

1.  Upload a blob report from each UI shard.
2.  Upload the API job's blob report.
3.  Download all `blob-report-*` artifacts.
4.  Merge the reports with `playwright merge-reports`.
5.  Upload a consolidated HTML report artifact.

For the merge step to work, Playwright must produce blob reports in the
expected `blob-report/` directory in both UI and API jobs. Confirm that
`playwright.config.ts` configures the `blob` reporter in CI, along with
any other desired reporters.

## GitHub Actions CI

Workflow directory:

``` text
.github/workflows/
```

The workflow is configured to trigger on:

-   Push to `main`.
-   Pull request targeting `main`.
-   Manual trigger through `workflow_dispatch`.

### CI stages

  Stage                Purpose
  -------------------- ---------------------------------------------
  Checkout             Downloads the repository
  Node setup           Sets up Node.js and npm caching
  Dependency install   Runs `npm ci`
  Quality checks       Runs TypeScript type-check and ESLint
  UI test matrix       Runs UI browser projects across four shards
  API test job         Runs `auth-api` and `api` projects
  Artifact upload      Stores shard and API blob reports
  Report merge         Builds a consolidated HTML report
  HTML artifact        Keeps the consolidated report for 14 days

### Configure GitHub Secrets

In your GitHub repository, open:

**Settings → Secrets and variables → Actions → New repository secret**

Create:

  Secret name           Purpose
  --------------------- -----------------------------
  `AUTH_API_USERNAME`   DummyJSON practice username
  `AUTH_API_PASSWORD`   DummyJSON practice password

The API job maps these secrets to environment variables. Keep secrets
out of YAML and logs.

### Check UI project names

If the workflow command explicitly selects `chromium`, `firefox`, and
`webkit`, ensure those exact names exist in `playwright.config.ts`.
Change the workflow command to match the configured names if necessary.

### Validate CI before relying on it

After pushing changes:

1.  Open the repository's **Actions** tab.
2.  Open the latest **Playwright Tests** run.
3.  Check the UI shard jobs and the API job.
4.  Check the report merge job.
5.  Download and open the consolidated HTML report artifact.

A locally passing suite does not guarantee the external API or
GitHub-hosted workflow will pass on every run.

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
-   Inspect status code and response body without logging credentials or
    tokens.
-   Remember that public practice APIs may change behavior or
    availability.

### Blob report merge failure

-   Ensure the `blob` reporter is enabled in CI.
-   Ensure each job uploads the `blob-report/` directory.
-   Ensure the merge job downloads the matching report artifacts.

### Type-check or lint failure

Run locally and resolve the reported issue before pushing:

``` bash
npm run typecheck
npm run lint
```

## Security Checklist

-   [ ] `.env` is ignored by Git.
-   [ ] No passwords or tokens are committed.
-   [ ] CI uses GitHub Secrets for authentication variables.
-   [ ] Logs do not print secrets or bearer tokens.
-   [ ] Tests use dedicated non-production accounts and data.

## Skills Demonstrated

This project can be used to discuss the following SDET/QA Automation
topics in interviews:

-   Playwright with TypeScript.
-   Page Object Model and custom fixtures.
-   Cross-browser execution and sharding.
-   UI screenshots and HTML reports.
-   API CRUD testing and HTTP status validation.
-   Zod runtime schema validation.
-   Bearer-token authentication and refresh-token rotation.
-   Safe, bounded retry behavior for GET requests.
-   GitHub Actions CI and artifact handling.
-   Test isolation, environment configuration, and secret hygiene.

------------------------------------------------------------------------

**Status:** The README describes the current intended framework design.
Verify the latest local test run and GitHub Actions execution before
claiming that a specific pipeline run passed.
