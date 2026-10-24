import { test, expect } from './fixtures';
import { z } from 'zod';
import { AuthApi } from '../api/AuthApi';

const AuthUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
});

test.describe('API Authentication Tests', () => {
    test('Access protected endpoint using authenticated client', async ({
        authenticatedClient,
    }) => {
        const response = await authenticatedClient.get('/auth/me');

        expect(response.status()).toBe(200);
        expect(response.ok()).toBe(true);

        expect(response.headers()['content-type'])
            .toContain('application/json');

        const json: unknown = await response.json();
        const user = AuthUserSchema.parse(json);

        expect(user.username).toBe('emilys');
        expect(user.id).toEqual(expect.any(Number));
    });

    test('Reject access without a token', async ({ request }) => {
        const response = await request.get('/auth/me');

        expect(response.status()).toBe(401);
    });

    test('Reject access with an invalid token', async ({ request }) => {
        const response = await request.get('/auth/me', {
            headers: {
                Authorization: 'Bearer invalid-token-for-testing',
            },
        });

        expect(response.status()).toBe(401);
    });

    test('Reuse a token while it remains valid', async ({ request }) => {
        const username = process.env.AUTH_API_USERNAME;
        const password = process.env.AUTH_API_PASSWORD;

        if (!username || !password) {
            throw new Error('Authentication credentials are missing');
        }

        const authApi = new AuthApi(request);

        const first = await authApi.getTokens(username, password);
        const second = await authApi.getTokens(username, password);

        // The second call should use the valid cached token.
        expect(second.accessToken).toBe(first.accessToken);
    });

    test('Refresh the session and access the protected endpoint', async ({
        request,
    }) => {
        const username = process.env.AUTH_API_USERNAME;
        const password = process.env.AUTH_API_PASSWORD;

        if (!username || !password) {
            throw new Error('Authentication credentials are missing');
        }

        const authApi = new AuthApi(request);

        // Obtain a token pair.
        const current = await authApi.getTokens(username, password);

        // Explicitly exercise the refresh endpoint.
        const refreshed = await authApi.refreshSession(
            username,
            current.refreshToken
        );

        expect(refreshed.accessToken).toBeTruthy();
        expect(refreshed.refreshToken).toBeTruthy();

        // Verify the new access token works.
        const response = await request.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${refreshed.accessToken}`,
            },
        });

        expect(response.status()).toBe(200);

        const json: unknown = await response.json();
        const user = AuthUserSchema.parse(json);

        expect(user.username).toBe(username);
    });
});
