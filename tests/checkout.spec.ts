import { test, expect } from '../fixture/myfixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Functionality', () => {

    test('Enter customer information and proceed to checkout overview', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);
        const checkoutPage = new CheckoutPage(authenticatedPage);

        // Step 1: Open the inventory page
        await authenticatedPage.goto('/inventory.html');

        // Step 2: Find the Sauce Labs Backpack product card
        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        // Step 3: Add the backpack to the cart
        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 4: Open the shopping cart
        await cartPage.shoppingCartLink.click();

        // Step 5: Proceed to checkout
        await cartPage.checkoutButton.click();

        // Step 6: Verify navigation to the customer information page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );

        // Step 7: Verify the customer information label
        await expect(checkoutPage.informationLabel).toHaveText(
            'Checkout: Your Information'
        );

        // Step 8: Enter customer information
        await checkoutPage.firstNameInput.fill('Ankit');
        await checkoutPage.lastNameInput.fill('Sharma');
        await checkoutPage.postalCodeInput.fill('160001');

        // Step 9: Verify customer information
        await expect(checkoutPage.firstNameInput).toHaveValue('Ankit');
        await expect(checkoutPage.lastNameInput).toHaveValue('Sharma');
        await expect(checkoutPage.postalCodeInput).toHaveValue('160001');

        // Step 10: Click Continue
        await checkoutPage.continueButton.click();

        // Step 11: Verify navigation to the checkout overview page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-two.html/
        );

        // Step 12: Verify the backpack appears in the order overview
        await expect(
            checkoutPage.checkoutItems.getByText('Sauce Labs Backpack')
        ).toBeVisible();

        // Step 13: Verify the product price
        await expect(
            checkoutPage.checkoutItems.locator('.inventory_item_price')
        ).toHaveText('$29.99');

        // Step 14: Verify the item subtotal
        await expect(checkoutPage.subtotalLabel).toHaveText(
            'Item total: $29.99'
        );

        // Step 15: Verify the tax amount
        await expect(checkoutPage.taxLabel).toHaveText(
            'Tax: $2.40'
        );

        // Step 16: Verify the final total
        await expect(checkoutPage.totalLabel).toHaveText(
            'Total: $32.39'
        );

        // Step 17: Verify the Finish button is visible
        await expect(checkoutPage.finishButton).toBeVisible();
    });

    test('Complete the order and verify confirmation', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);
        const checkoutPage = new CheckoutPage(authenticatedPage);

        // Step 1: Open the inventory page
        await authenticatedPage.goto('/inventory.html');

        // Step 2: Find the Sauce Labs Backpack
        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        // Step 3: Add the backpack to the cart
        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 4: Open the shopping cart
        await cartPage.shoppingCartLink.click();

        // Step 5: Proceed to checkout
        await cartPage.checkoutButton.click();

        // Step 6: Verify the checkout information page is ready
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.firstNameInput).toBeEnabled();

        // Step 7: Enter customer information
        await checkoutPage.firstNameInput.fill('Ankit');
        await checkoutPage.lastNameInput.fill('Sharma');
        await checkoutPage.postalCodeInput.fill('160001');

        // Step 8: Verify all values before submitting
        await expect(checkoutPage.firstNameInput).toHaveValue('Ankit');
        await expect(checkoutPage.lastNameInput).toHaveValue('Sharma');
        await expect(checkoutPage.postalCodeInput).toHaveValue('160001');

        // Step 9: Continue to the order overview
        await checkoutPage.continueButton.click();

        // Step 10: Verify the checkout overview page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-two.html/
        );

        // Step 11: Verify the product is present
        await expect(
            checkoutPage.checkoutItems.getByText('Sauce Labs Backpack')
        ).toBeVisible();

        // Step 12: Finish the order
        await checkoutPage.finishButton.click();

        // Step 13: Verify navigation to the confirmation page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-complete.html/
        );

        // Step 14: Verify the order confirmation message
        await expect(checkoutPage.confirmationMessage).toHaveText(
            'Thank you for your order!'
        );

        // Step 15: Verify the Back Home button
        await expect(checkoutPage.backHomeButton).toBeVisible();
    });

    test('Show validation error when all customer fields are empty', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);
        const checkoutPage = new CheckoutPage(authenticatedPage);

        // Step 1: Open inventory and add a product
        await authenticatedPage.goto('/inventory.html');

        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 2: Navigate to checkout information
        await cartPage.shoppingCartLink.click();
        await cartPage.checkoutButton.click();

        // Step 3: Click Continue without entering any information
        await checkoutPage.continueButton.click();

        // Step 4: Verify the first-name validation error
        await expect(checkoutPage.errorMessage).toHaveText(
            'Error: First Name is required'
        );

        // Step 5: Verify that we remain on the information page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );
    });

    test('Show validation error when last name and postal code are empty', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);
        const checkoutPage = new CheckoutPage(authenticatedPage);

        // Step 1: Open inventory and add a product
        await authenticatedPage.goto('/inventory.html');

        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 2: Navigate to checkout information
        await cartPage.shoppingCartLink.click();
        await cartPage.checkoutButton.click();

        // Step 3: Enter only the first name
        await checkoutPage.firstNameInput.fill('Ankit');

        // Step 4: Verify the first name is entered and other fields are empty
        await expect(checkoutPage.firstNameInput).toHaveValue('Ankit');
        await expect(checkoutPage.lastNameInput).toHaveValue('');
        await expect(checkoutPage.postalCodeInput).toHaveValue('');

        // Step 5: Click Continue
        await checkoutPage.continueButton.click();

        // Step 6: Verify the last-name validation error
        await expect(checkoutPage.errorMessage).toHaveText(
            'Error: Last Name is required'
        );

        // Step 7: Verify we remain on the information page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );
    });

    test('Show validation error when postal code is empty', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);
        const checkoutPage = new CheckoutPage(authenticatedPage);

        // Step 1: Open inventory and add a product
        await authenticatedPage.goto('/inventory.html');

        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 2: Navigate to checkout information
        await cartPage.shoppingCartLink.click();
        await cartPage.checkoutButton.click();

        // Step 3: Enter first name and last name
        await checkoutPage.firstNameInput.fill('Ankit');
        await checkoutPage.lastNameInput.fill('Sharma');

        // Step 4: Verify the field values before submitting
        await expect(checkoutPage.firstNameInput).toHaveValue('Ankit');
        await expect(checkoutPage.lastNameInput).toHaveValue('Sharma');
        await expect(checkoutPage.postalCodeInput).toHaveValue('');

        // Step 5: Click Continue without entering postal code
        await checkoutPage.continueButton.click();

        // Step 6: Verify the postal-code validation error
        await expect(checkoutPage.errorMessage).toHaveText(
            'Error: Postal Code is required'
        );

        // Step 7: Verify we remain on the information page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );
    });
});