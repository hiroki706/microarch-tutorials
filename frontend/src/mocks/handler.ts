import { delay } from 'msw';
import { createOpenApiHttp, RequestBodyFor, ResponseBodyFor } from "openapi-msw";
import type { paths } from '@/lib/api/schemas';

const http = createOpenApiHttp<paths>();

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
    http.get("/posts", async ({ response, params }) => {
        await delay(200); // ネットワーク遅延
        return response(200).json(posts)
    }),

    http.post(`/posts`, async ({ request, response }) => {
        await delay(200); // ネットワーク遅延
        const newPostData = await request.json()

        const newPost = {
            id: crypto.randomUUID(),
            title: newPostData.title,
            content: newPostData.content,
            created_at: new Date().toISOString(),
        };
        posts.push(newPost);
        return response(201).json(newPost);
    })
]
export { handlers };
