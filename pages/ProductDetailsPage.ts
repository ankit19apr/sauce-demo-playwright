
import { Page, Locator } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly backToProductsButton: Locator;
    readonly productImage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = page.locator('.inventory_details_name');

        this.productDescription = page.locator(
            '.inventory_details_desc.large_size'
        );
        this.productPrice = page.locator('.inventory_details_price');
        this.addToCartButton = page.getByRole('button', {
            name: 'Add to cart',
        });
        this.backToProductsButton = page.locator(
            '.inventory_details_back_button'
        );
        this.productImage = page.locator(
            '.inventory_details_img_container img'
        );
    }
}
