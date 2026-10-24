import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPageObject = new LoginPage(page);
    await use(loginPageObject);
  },

  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

});

export { expect };
