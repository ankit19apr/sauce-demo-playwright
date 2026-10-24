import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;

    // Checkout: Your Information
    readonly informationLabel: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;

    // Checkout: Overview
    readonly checkoutItems: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;

    // Checkout : Negative

    readonly errorMessage: Locator;

    // Checkout: Complete
    readonly confirmationMessage: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Customer information fields

        // Label displayed on the customer information page
        this.informationLabel = page.getByText('Checkout: Your Information', {
            exact: true,
        });

        this.firstNameInput = page.getByRole('textbox', {
            name: 'First Name',
        });

        this.lastNameInput = page.getByRole('textbox', {
            name: 'Last Name',
        });

        this.postalCodeInput = page.getByRole('textbox', {
            name: 'Zip/Postal Code',
        });

        this.continueButton = page.getByRole('button', {
            name: 'Continue',
        });

        this.cancelButton = page.getByRole('button', {
            name: 'Cancel',
        });

        // Order overview
        this.checkoutItems = page.locator('.cart_item');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');

        this.finishButton = page.getByRole('button', {
            name: 'Finish',
        });

        // Order confirmation
        this.confirmationMessage = page.locator('.complete-header');

        this.backHomeButton = page.getByRole('button', {
            name: 'Back Home',
        });

        // Checkout form validation error message
        this.errorMessage = page.locator('[data-test="error"]');
    }
}
