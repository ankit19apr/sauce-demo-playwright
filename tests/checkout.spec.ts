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

        // Step 7: Verify the exact customer information label
        await expect(checkoutPage.informationLabel).toHaveText(
            'Checkout: Your Information'
        );

        // Step 8: Enter customer information
        await checkoutPage.firstNameInput.fill('Ankit');
        await checkoutPage.lastNameInput.fill('Sharma');
        await checkoutPage.postalCodeInput.fill('160001');

        // Step 9: Click Continue
        await checkoutPage.continueButton.click();

        // Step 10: Verify navigation to the checkout overview page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-two.html/
        );

        // Step 11: Verify the backpack appears in the order overview
        await expect(
            checkoutPage.checkoutItems.getByText('Sauce Labs Backpack')
        ).toBeVisible();

        // Step 12: Verify the product price in the overview
        await expect(
            checkoutPage.checkoutItems.locator('.inventory_item_price')
        ).toHaveText('$29.99');

        // Step 13: Verify the item subtotal
        await expect(checkoutPage.subtotalLabel).toHaveText(
            'Item total: $29.99'
        );

        // Step 14: Verify the tax amount
        await expect(checkoutPage.taxLabel).toHaveText(
            'Tax: $2.40'
        );

        // Step 15: Verify the final total (item total + tax)
        await expect(checkoutPage.totalLabel).toHaveText(
            'Total: $32.39'
        );

        // Step 16: Verify the Finish button is visible
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

        // Step 6: Enter customer information
        await checkoutPage.firstNameInput.fill('Ankit');
        await checkoutPage.lastNameInput.fill('Sharma');
        await checkoutPage.postalCodeInput.fill('160001');

        // Verify that all entered values were accepted
        await expect(checkoutPage.firstNameInput).toHaveValue('Ankit');
        await expect(checkoutPage.lastNameInput).toHaveValue('Sharma');
        await expect(checkoutPage.postalCodeInput).toHaveValue('160001');

        // Step 7: Continue to the order overview
        await checkoutPage.continueButton.click();

        // Step 8: Verify the checkout overview page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-two.html/
        );

        // Step 9: Verify the product is present
        await expect(
            checkoutPage.checkoutItems.getByText('Sauce Labs Backpack')
        ).toBeVisible();

        // Step 10: Finish the order
        await checkoutPage.finishButton.click();

        // Step 11: Verify navigation to the confirmation page
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-complete.html/
        );

        // Step 12: Verify the order confirmation message
        await expect(checkoutPage.confirmationMessage).toHaveText(
            'Thank you for your order!'
        );

        // Step 13: Verify the Back Home button
        await expect(checkoutPage.backHomeButton).toBeVisible();

    });

});
