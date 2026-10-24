
import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { PostsApi } from '../api/PostsApi';

// Runtime schema: validates the actual JSON structure and values
const PostResponseSchema = z.object({
    userId: z.number().int(),
    id: z.number().int(),
    title: z.string().min(1),
    body: z.string().min(1),
});

// Runtime schema for an array of posts
const PostsArraySchema = z.array(PostResponseSchema);

test.describe('GET Request Tests', () => {
    test('GET single post - validate API response', async ({ request }) => {
        const postsApi = new PostsApi(request);
        const result = await postsApi.getPost(1);

        // Validate HTTP response
        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);

        // Validate response headers
        expect(result.response.headers()['content-type'])
            .toContain('application/json');

        // Runtime validation of the actual response JSON
        const post = PostResponseSchema.parse(result.body);

        expect(post.id).toBe(1);
        expect(post.userId).toEqual(expect.any(Number));
        expect(post.title.length).toBeGreaterThan(0);
        expect(post.body.length).toBeGreaterThan(0);
    });

    test('GET non-existent post - validate 404 response', async ({ request }) => {
        const postsApi = new PostsApi(request);
        const result = await postsApi.getPost(9999);

        // Validate the negative HTTP scenario
        expect(result.response.status()).toBe(404);
        expect(result.response.ok()).toBe(false);
    });

    test('GET posts filtered by user ID', async ({ request }) => {
        const postsApi = new PostsApi(request);
        const result = await postsApi.getPostsByUser(1);

        // Validate HTTP response
        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);

        // Validate response content type
        expect(result.response.headers()['content-type'])
            .toContain('application/json');

        // Runtime validation of every post in the array
        const posts = PostsArraySchema.parse(result.body);

        expect(posts.length).toBeGreaterThan(0);

        // Validate query filtering
        for (const post of posts) {
            expect(post.userId).toBe(1);
        }
    });

    test('GET posts for a user with no matching posts', async ({ request }) => {
        const postsApi = new PostsApi(request);

        // JSONPlaceholder returns an empty collection for this filter
        const result = await postsApi.getPostsByUser(9999);

        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);

        // Validate that the response is a valid array
        const posts = PostsArraySchema.parse(result.body);
        expect(posts).toEqual([]);
    });
});

test.describe('POST Request Tests', () => {
    test('POST create a new post - validate response', async ({ request }) => {
        const postsApi = new PostsApi(request);

        const payload = {
            title: 'Playwright API Testing',
            body: 'Learning POST requests with TypeScript',
            userId: 1,
        };

        const result = await postsApi.createPost(payload);

        // Validate HTTP response
        expect(result.response.status()).toBe(201);
        expect(result.response.ok()).toBe(true);

        // Runtime validation
        const post = PostResponseSchema.parse(result.body);

        expect(post.title).toBe(payload.title);
        expect(post.body).toBe(payload.body);
        expect(post.userId).toBe(payload.userId);
        expect(post.id).toEqual(expect.any(Number));
    });
});

test.describe('PUT Request Tests', () => {
    test('PUT update an existing post - validate response', async ({ request }) => {
        const postsApi = new PostsApi(request);

        const payload = {
            id: 1,
            title: 'Updated Playwright API Testing',
            body: 'Learning PUT requests with TypeScript',
            userId: 1,
        };

        const result = await postsApi.updatePost(1, payload);

        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);

        // Runtime validation
        const post = PostResponseSchema.parse(result.body);

        expect(post.id).toBe(payload.id);
        expect(post.title).toBe(payload.title);
        expect(post.body).toBe(payload.body);
        expect(post.userId).toBe(payload.userId);
    });
});

test.describe('PATCH Request Tests', () => {
    test('PATCH update post title - validate response', async ({ request }) => {
        const postsApi = new PostsApi(request);

        const payload = {
            title: 'Updated title using PATCH',
        };

        const result = await postsApi.patchPost(1, payload);

        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);

        // Runtime validation
        const post = PostResponseSchema.parse(result.body);

        expect(post.title).toBe(payload.title);
        expect(post.id).toBe(1);
    });
});

test.describe('DELETE Request Tests', () => {
    test('DELETE an existing post - validate response', async ({ request }) => {
        const postsApi = new PostsApi(request);

        const result = await postsApi.deletePost(1);

        expect(result.response.status()).toBe(200);
        expect(result.response.ok()).toBe(true);
    });
});
