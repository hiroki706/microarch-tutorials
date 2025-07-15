import { delay } from 'msw';
import { createOpenApiHttp, ResponseBodyFor } from "openapi-msw";
import type { paths } from '@/lib/api/schemas.gen';
import { env } from '@/env/client';

const http = createOpenApiHttp<paths>({
    baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL});

type PostResponse = ResponseBodyFor<typeof http.get, "/posts">;

const posts: PostResponse = [
    {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        title: 'MSWで始めるAPIモック',
        content: 'バックエンドがなくてもフロントエンド開発が進められます！',
        created_at: '2025-07-15T10:00:00Z',
    },
];

const handlers = [
    http.get("/posts", async ({ response }) => {
        return response(200).json(posts)
    }),

    http.post(`/posts`, async ({ request, response }) => {
        await delay(60); // ネットワーク遅延
        const newPostData = await request.json()

        const newPost = {
            id: crypto.randomUUID(),
            title: newPostData.title,
            content: newPostData.content,
            created_at: new Date().toISOString(),
        };
        posts.push(newPost);
        return response(201).json(newPost);
    }),
]
export { handlers, http };
