
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

    // Checkout form validation
    readonly errorMessage: Locator;

    // Checkout: Complete
    readonly confirmationMessage: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Customer information page heading
        this.informationLabel = page.getByText(
            'Checkout: Your Information',
            { exact: true },
        );

        // Customer information fields
        this.firstNameInput = page.getByRole('textbox', {
            name: 'First Name',
        });

        this.lastNameInput = page.getByRole('textbox', {
            name: 'Last Name',
        });

        this.postalCodeInput = page.getByRole('textbox', {
            name: 'Zip/Postal Code',
        });

        // Customer information actions
        this.continueButton = page.getByRole('button', {
            name: 'Continue',
        });

        this.cancelButton = page.getByRole('button', {
            name: 'Cancel',
        });

        // Order overview elements
        this.checkoutItems = page.locator('.cart_item');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');

        this.finishButton = page.getByRole('button', {
            name: 'Finish',
        });

        // Order confirmation elements
        this.confirmationMessage = page.locator('.complete-header');

        this.backHomeButton = page.getByRole('button', {
            name: 'Back Home',
        });

        // Validation error displayed by the checkout form
        this.errorMessage = page.locator('[data-test="error"]');
    }
}
