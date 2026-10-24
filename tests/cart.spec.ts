
import { test, expect } from '../fixture/myfixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Shopping Cart Functionality', () => {

    test('Add a product and verify it in the cart', async ({ authenticatedPage }) => {

        // Step 1: Open the inventory page
        await authenticatedPage.goto('/inventory.html');

        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        // Step 2: Find the Sauce Labs Backpack product card
        const backpackCard = inventoryPage.productCards.filter({
            hasText: 'Sauce Labs Backpack',
        });

        // Step 3: Click Add to cart for this product only
        await backpackCard.getByRole('button', {
            name: 'Add to cart',
        }).click();

        // Step 4: Verify the button changes to Remove
        await expect(
            backpackCard.getByRole('button', { name: 'Remove' })
        ).toBeVisible();

        // Step 5: Verify the cart badge shows one item
        await expect(cartPage.cartBadge).toHaveText('1');

        // Step 6: Open the shopping cart
        await cartPage.shoppingCartLink.click();

        // Step 7: Verify navigation to the cart page
        await expect(authenticatedPage).toHaveURL(/.*cart.html/);

        // Step 8: Find the backpack's cart item
        const backpackCartItem = authenticatedPage
            .locator('.cart_item')
            .filter({ hasText: 'Sauce Labs Backpack' });

        // Step 9: Verify the backpack appears in the cart
        await expect(
            backpackCartItem.getByText('Sauce Labs Backpack')
        ).toBeVisible();

        // Step 10: Verify the backpack price in the cart
        await expect(
            backpackCartItem.locator('.inventory_item_price')
        ).toHaveText('$29.99');

        // Step 11: Verify the Remove button is present
        await expect(
            backpackCartItem.getByRole('button', { name: 'Remove' })
        ).toBeVisible();
    });


    test('Checkout the product in the cart', async ({ authenticatedPage }) => {

        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

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

        // Step 5: Verify navigation to the cart page
        await expect(authenticatedPage).toHaveURL(/.*cart.html/);

        // Step 6: Verify the Checkout button is visible
        await expect(cartPage.checkoutButton).toBeVisible();

        // Step 7: Click Checkout
        await cartPage.checkoutButton.click();

        // Step 8: Verify navigation to checkout information
        await expect(authenticatedPage).toHaveURL(
            /.*checkout-step-one.html/
        );
    });


    test('Remove a product from the inventory page', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

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

        // Step 4: Verify the cart badge shows one item
        await expect(cartPage.cartBadge).toHaveText('1');

        // Step 5: Click Remove on the backpack card
        await backpackCard.getByRole('button', {
            name: 'Remove',
        }).click();

        // Step 6: Verify the button changes back to Add to cart
        await expect(
            backpackCard.getByRole('button', { name: 'Add to cart' })
        ).toBeVisible();

        // Step 7: Verify the cart badge disappears
        await expect(cartPage.cartBadge).toHaveCount(0);
    });


    test('Remove a product from the cart page', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

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

        // Step 5: Locate the backpack cart item
        const backpackCartItem = authenticatedPage
            .locator('.cart_item')
            .filter({ hasText: 'Sauce Labs Backpack' });

        // Step 6: Verify the backpack is in the cart
        await expect(backpackCartItem).toBeVisible();

        // Step 7: Click Remove for the backpack
        await backpackCartItem.getByRole('button', {
            name: 'Remove',
        }).click();

        // Step 8: Verify the backpack is removed
        await expect(backpackCartItem).toHaveCount(0);

        // Step 9: Verify the cart badge disappears
        await expect(cartPage.cartBadge).toHaveCount(0);
    });


});
