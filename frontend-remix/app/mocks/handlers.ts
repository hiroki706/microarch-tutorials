import { createOpenApiHttp } from "openapi-msw";
import type { components, paths } from "~/lib/api/schemas";

type Post = components["schemas"]["Post"];

const http = createOpenApiHttp<paths>({
  baseUrl: "http://localhost:8080/v1",
});

// サーバーの代わりとなるデータストア（インメモリ）
const posts: Post[] = [
  {
    id: "c7b3d8e0-5e0b-4b0f-8b3a-2b9d3b0b0b0b",
    title: "MSWはすごい!",
    content: "バックエンドがなくても開発が進められる！",
    created_at: new Date().toISOString(),
  },
];

export const handlers = [
  // 投稿一覧を取得する (GET /posts)
  http.get("/posts", ({ response }) => {
    // ② 本物と同じようにJSONでデータを返す
    return response(200).json(posts);
  }),

  // 新しい投稿を作成する (POST /posts)
  http.post("/posts", async ({ request, response }) => {
    const newPost = (await request.json()) as components["schemas"]["NewPost"];

    const createdPost: Post = {
      id: crypto.randomUUID(),
      ...newPost,
      created_at: new Date().toISOString(),
    };
    posts.push(createdPost);

    // ③ 201 Created レスポンスを返す
    return response(201).json(createdPost);
  }),
];
