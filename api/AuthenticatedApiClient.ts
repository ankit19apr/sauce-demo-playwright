import {
    type APIRequestContext,
    type APIResponse,
} from '@playwright/test';

import { AuthApi } from './AuthApi';

export interface AuthenticatedGetOptions {
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

export class AuthenticatedApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly authApi: AuthApi,
        private readonly username: string,
        private readonly password: string
    ) {}

    async get(
        path: string,
        options: AuthenticatedGetOptions = {}
    ): Promise<APIResponse> {
        // Reuse the cached token whenever it is still valid.
        const tokens = await this.authApi.getTokens(
            this.username,
            this.password
        );

        const response = await this.sendGet(
            path,
            options,
            tokens.accessToken
        );

        // Only retry a safe GET after an authentication failure.
        if (response.status() !== 401) {
            return response;
        }

        // Refresh the session, or log in again if refresh fails.
        const renewedTokens =
            await this.authApi.renewAfterUnauthorized(
                this.username,
                this.password
            );

        // Exactly one retry. Return its response without another retry.
        return this.sendGet(
            path,
            options,
            renewedTokens.accessToken
        );
    }

    private sendGet(
        path: string,
        options: AuthenticatedGetOptions,
        accessToken: string
    ): Promise<APIResponse> {
        return this.request.get(path, {
            params: options.params,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}
