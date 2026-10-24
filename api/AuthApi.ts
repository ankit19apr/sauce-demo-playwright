import { APIRequestContext } from '@playwright/test';
import { z } from 'zod';

const LoginSchema = z.object({
    id: z.number(),
    username: z.string(),
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

const RefreshSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

// Shared by AuthApi instances in the same worker process.
// Separate Playwright workers maintain separate caches.
const tokenCache = new Map<string, AuthTokens>();

const TOKEN_EXPIRY_BUFFER_MS = 30_000;

export class AuthApi {
    constructor(private readonly request: APIRequestContext) {}

    // Return a cached token if it is still valid.
    // Otherwise, try refreshing or log in again.
    async getTokens(
        username: string,
        password: string,
        expiresInMins = 30
    ): Promise<AuthTokens> {
        const cached = tokenCache.get(username);

        if (cached && cached.expiresAt > Date.now()) {
            return cached;
        }

        if (cached) {
            try {
                return await this.refreshSession(
                    username,
                    cached.refreshToken,
                    expiresInMins
                );
            } catch {
                // Refresh failed; fall back to login.
                tokenCache.delete(username);
            }
        }

        return this.login(username, password, expiresInMins);
    }

    // Explicitly renew credentials after a 401 response.
    // Refresh is attempted first; login is the fallback.
    async renewAfterUnauthorized(
        username: string,
        password: string,
        expiresInMins = 30
    ): Promise<AuthTokens> {
        const cached = tokenCache.get(username);

        if (cached) {
            try {
                return await this.refreshSession(
                    username,
                    cached.refreshToken,
                    expiresInMins
                );
            } catch {
                // Refresh failed; fall back to login.
                tokenCache.delete(username);
            }
        }

        return this.login(username, password, expiresInMins);
    }

    // Exchange a refresh token for a new token pair.
    async refreshSession(
        username: string,
        refreshToken: string,
        expiresInMins = 30
    ): Promise<AuthTokens> {
        const response = await this.request.post('/auth/refresh', {
            data: {
                refreshToken,
                expiresInMins,
            },
        });

        if (!response.ok()) {
            throw new Error(
                `Token refresh failed with status ${response.status()}`
            );
        }

        const json: unknown = await response.json();
        const refreshed = RefreshSchema.parse(json);

        const tokens = this.createTokenBundle(
            refreshed.accessToken,
            refreshed.refreshToken,
            expiresInMins
        );

        // Store the rotated refresh token as well.
        tokenCache.set(username, tokens);

        return tokens;
    }

    private async login(
        username: string,
        password: string,
        expiresInMins: number
    ): Promise<AuthTokens> {
        const response = await this.request.post('/auth/login', {
            data: {
                username,
                password,
                expiresInMins,
            },
        });

        if (!response.ok()) {
            throw new Error(
                `Authentication failed with status ${response.status()}`
            );
        }

        const json: unknown = await response.json();
        const login = LoginSchema.parse(json);

        const tokens = this.createTokenBundle(
            login.accessToken,
            login.refreshToken,
            expiresInMins
        );

        tokenCache.set(username, tokens);

        return tokens;
    }

    private createTokenBundle(
        accessToken: string,
        refreshToken: string,
        expiresInMins: number
    ): AuthTokens {
        // Estimate expiry from the requested lifetime and leave a
        // 30-second safety buffer. A 401 still triggers renewal.
        const expiresAt =
            Date.now() +
            expiresInMins * 60_000 -
            TOKEN_EXPIRY_BUFFER_MS;

        return {
            accessToken,
            refreshToken,
            expiresAt,
        };
    }
}
