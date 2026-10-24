
import { test, expect } from '../fixture/myfixtures';
import { captureScreenshot } from '../utils/screenshotHelper';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { InventoryPage } from '../pages/InventoryPage';

// Groups all inventory-related test scenarios.
test.describe('Products and Sorting on Inventory Page', () => {

    // Inventory and product details tests.
    test.describe('Inventory and Product Details', () => {

        test('Verify that the products are displayed on the inventory page', async (
            { authenticatedPage },
            testInfo
        ) => {
            // Navigate to the inventory page.
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Capture a screenshot of the inventory page.
            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Inventory page loaded'
            );

            // Verify that all six product cards are displayed.
            await expect(inventoryPage.productCards).toHaveCount(6);

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Six inventory products verified'
            );
        });

        test('Verify the product details in the product card', async (
            { authenticatedPage },
            testInfo
        ) => {
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Find the Sauce Labs Backpack card by its product name.
            const productCard = inventoryPage.productCards.filter({
                hasText: 'Sauce Labs Backpack',
            });

            await expect(productCard).toBeVisible();

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Product card displayed'
            );

            // Verify the product name on the inventory card.
            const productNameOnCard = productCard.locator(
                '.inventory_item_name'
            );

            await expect(productNameOnCard).toHaveText(
                'Sauce Labs Backpack'
            );

            // Open the product details page.
            await productNameOnCard.click();

            const productDetailsPage = new ProductDetailsPage(
                authenticatedPage
            );

            await expect(productDetailsPage.productName).toBeVisible();

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Product details page displayed'
            );

            // Verify product information.
            await expect(productDetailsPage.productName).toHaveText(
                'Sauce Labs Backpack'
            );

            await expect(productDetailsPage.productDescription).toHaveText(
                'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
            );

            await expect(productDetailsPage.productPrice).toHaveText(
                '$29.99'
            );

            // Verify the Add to cart button.
            await expect(
                productDetailsPage.addToCartButton
            ).toBeVisible();

            await expect(
                productDetailsPage.addToCartButton
            ).toHaveText('Add to cart');

            // Verify the Back to products button.
            await expect(
                productDetailsPage.backToProductsButton
            ).toBeVisible();

            await expect(
                productDetailsPage.backToProductsButton
            ).toHaveText('Back to products');

            // Verify the product image and shopping cart link.
            await expect(productDetailsPage.productImage).toBeVisible();
            await expect(inventoryPage.shoppingCartLink).toBeVisible();
        });
    });

    // All product sorting tests are grouped separately.
    test.describe('Product Sorting', () => {

        test('Verify sorting by Name (A to Z)', async (
            { authenticatedPage },
            testInfo
        ) => {
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Select alphabetical ascending order.
            await inventoryPage.sortDropdown.selectOption('az');

            const productNames =
                await inventoryPage.productNames.allTextContents();

            // Create the expected ascending alphabetical order.
            const expectedNames = [...productNames].sort(
                (a, b) => a.localeCompare(b)
            );

            // Verify the displayed order matches the expected order.
            expect(productNames).toEqual(expectedNames);

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Products sorted by Name A to Z'
            );
        });

        test('Verify sorting by Name (Z to A)', async (
            { authenticatedPage },
            testInfo
        ) => {
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Select alphabetical descending order.
            await inventoryPage.sortDropdown.selectOption('za');

            const productNames =
                await inventoryPage.productNames.allTextContents();

            // Create the expected descending alphabetical order.
            const expectedNames = [...productNames].sort(
                (a, b) => b.localeCompare(a)
            );

            expect(productNames).toEqual(expectedNames);

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Products sorted by Name Z to A'
            );
        });

        test('Verify sorting by Price (low to high)', async (
            { authenticatedPage },
            testInfo
        ) => {
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Select ascending price order.
            await inventoryPage.sortDropdown.selectOption('lohi');

            const productPrices = await inventoryPage.productCards
                .locator('.inventory_item_price')
                .allTextContents();

            // Convert price strings such as "$29.99" into numbers.
            const pricesAsNumbers = productPrices.map(
                price => Number(price.replace('$', ''))
            );

            // Create the expected ascending numeric order.
            const expectedPrices = [...pricesAsNumbers].sort(
                (a, b) => a - b
            );

            expect(pricesAsNumbers).toEqual(expectedPrices);

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Products sorted by Price Low to High'
            );
        });

        test('Verify sorting by Price (high to low)', async (
            { authenticatedPage },
            testInfo
        ) => {
            await authenticatedPage.goto('/inventory.html');

            const inventoryPage = new InventoryPage(authenticatedPage);

            // Select descending price order.
            await inventoryPage.sortDropdown.selectOption('hilo');

            const productPrices = await inventoryPage.productCards
                .locator('.inventory_item_price')
                .allTextContents();

            // Convert price strings into numbers.
            const pricesAsNumbers = productPrices.map(
                price => Number(price.replace('$', ''))
            );

            // Create the expected descending numeric order.
            const expectedPrices = [...pricesAsNumbers].sort(
                (a, b) => b - a
            );

            expect(pricesAsNumbers).toEqual(expectedPrices);

            await captureScreenshot(
                authenticatedPage,
                testInfo,
                'Products sorted by Price High to Low'
            );
        });
    });
});
