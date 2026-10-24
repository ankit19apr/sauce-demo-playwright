
import {
    APIRequestContext,
    APIResponse,
} from '@playwright/test';

// Structure of data sent when creating or replacing a post
export interface PostPayload {
    title: string;
    body: string;
    userId: number;
    id?: number;
}

// Fields allowed in a partial update
export type PatchPostPayload = Partial<
    Pick<PostPayload, 'title' | 'body' | 'userId'>
>;

// Structure expected in a post response
export interface PostResponse {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// Generic structure containing HTTP response and parsed body
export interface ApiResult<T> {
    response: APIResponse;
    body: T;
}

export class PostsApi {
    constructor(private readonly request: APIRequestContext) {}

    // Retrieve a single post by ID
    async getPost(postId: number): Promise<ApiResult<PostResponse>> {
        const response = await this.request.get(`/posts/${postId}`);
        const body = (await response.json()) as PostResponse;

        return { response, body };
    }

    // Retrieve posts filtered by user ID
    async getPostsByUser(
        userId: number
    ): Promise<ApiResult<PostResponse[]>> {
        const response = await this.request.get('/posts', {
            params: { userId },
            headers: {
                Accept: 'application/json',
            },
        });

        const body = (await response.json()) as PostResponse[];

        return { response, body };
    }

    // Create a new post
    async createPost(
        payload: PostPayload
    ): Promise<ApiResult<PostResponse>> {
        const response = await this.request.post('/posts', {
            data: payload,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const body = (await response.json()) as PostResponse;

        return { response, body };
    }

    // Replace a post
    async updatePost(
        postId: number,
        payload: PostPayload
    ): Promise<ApiResult<PostResponse>> {
        const response = await this.request.put(`/posts/${postId}`, {
            data: payload,
        });

        const body = (await response.json()) as PostResponse;

        return { response, body };
    }

    // Partially update a post
    async patchPost(
        postId: number,
        payload: PatchPostPayload
    ): Promise<ApiResult<PostResponse>> {
        const response = await this.request.patch(`/posts/${postId}`, {
            data: payload,
        });

        const body = (await response.json()) as PostResponse;

        return { response, body };
    }

    // Delete a post; the response body may be empty or non-JSON
    async deletePost(postId: number): Promise<ApiResult<unknown>> {
        const response = await this.request.delete(`/posts/${postId}`);

        let body: unknown = undefined;

        try {
            body = await response.json();
        } catch {
            // Keep body undefined if the response has no valid JSON
        }

        return { response, body };
    }
}
