import { test, expect } from '../fixture/myfixtures';

import { loginData } from '../test-data/loginData';

test.use({
    storageState: {
        cookies: [],
        origins: [],
    },
});

test.describe('Login Tests', () => {
    test('Valid user can log in successfully', async ({ page, loginPage }) => {
        await page.goto('/');
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        await expect(page).toHaveURL(/inventory/);
    });

    test('Locked out user cannot log in', async ({ page, loginPage }) => {
        await page.goto('/');
        await loginPage.login(loginData.lockedOutUser.username, loginData.lockedOutUser.password);
        await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    });

    test('Invalid user cannot log in', async ({ page, loginPage }) => {
        await page.goto('/');
        await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
        await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
    });

    test('Empty username and password fields show error', async ({ page, loginPage }) => {
        await page.goto('/');
        await loginPage.login('', '');
        await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
    });

});