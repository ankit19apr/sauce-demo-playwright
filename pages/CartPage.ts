import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly addToCartButton: Locator;
    readonly shoppingCartLink: Locator;
    readonly cartBadge: Locator;
    readonly removeButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Button to add a product to the cart
        this.addToCartButton = page.getByRole('button', {
            name: 'Add to cart',
        });

        // Shopping cart icon in the header
        this.shoppingCartLink = page.locator('.shopping_cart_link');

        // Number displayed on the cart icon
        this.cartBadge = page.locator('.shopping_cart_badge');

        // Button to remove a product from the cart
        this.removeButton = page.getByRole('button', {
            name: 'Remove',
        });
        // Button to proceed to checkout
        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout',
        });
    }
}