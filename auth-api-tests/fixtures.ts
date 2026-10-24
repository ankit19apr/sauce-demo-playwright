import 'dotenv/config';

import {
    test as base,
    expect,
    request as playwrightRequest,
} from '@playwright/test';

import { AuthApi } from '../api/AuthApi';
import { AuthenticatedApiClient } from '../api/AuthenticatedApiClient';

type AuthFixtures = {
    authenticatedClient: AuthenticatedApiClient;
};

export const test = base.extend<AuthFixtures>({
    authenticatedClient: async ({ request }, use) => {
        const username = process.env.AUTH_API_USERNAME;
        const password = process.env.AUTH_API_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'Set AUTH_API_USERNAME and AUTH_API_PASSWORD in .env'
            );
        }

        const authApi = new AuthApi(request);

        // A fresh request context for this test.
        // Tokens are added per request by AuthenticatedApiClient.
        const context = await playwrightRequest.newContext({
            baseURL: 'https://dummyjson.com',
            extraHTTPHeaders: {
                Accept: 'application/json',
            },
        });

        const client = new AuthenticatedApiClient(
            context,
            authApi,
            username,
            password
        );

        try {
            await use(client);
        } finally {
            // Dispose of the test's context even if the test fails.
            await context.dispose();
        }
    },
});

export { expect };
