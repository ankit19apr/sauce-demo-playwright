import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
}; 

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPageObject = new LoginPage(page);
        await use(loginPageObject);
    }
});

export { expect } from '@playwright/test';