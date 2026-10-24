import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly shoppingCartLink: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;

        // Product cards on the inventory page
        this.productCards = page.locator('.inventory_item');
        // Product names within the product cards
        this.productNames = page.locator('.inventory_item_name');
        // Shopping cart icon link in the header
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        // Sort dropdown for sorting products
        this.sortDropdown = page.locator('.product_sort_container');
    }
}
