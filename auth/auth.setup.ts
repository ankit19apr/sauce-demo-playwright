
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../test-data/loginData';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');
  await loginPage.login(loginData.validUser.username, loginData.validUser.password);

  await expect(page).toHaveURL(/inventory.html/);

  await page.context().storageState({ path: authFile });
});
