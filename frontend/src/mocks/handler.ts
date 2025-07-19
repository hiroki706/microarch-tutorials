import { delay } from "msw";
import { createOpenApiHttp, type ResponseBodyFor } from "openapi-msw";
import { env } from "@/env/client";
import type { paths } from "@/lib/api/schemas";

const http = createOpenApiHttp<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

type PostResponse = ResponseBodyFor<typeof http.get, "/posts">;

const posts: PostResponse = [
  {
    content: "バックエンドがなくてもフロントエンド開発が進められます！",
    created_at: "2025-07-15T10:00:00Z",
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    title: "MSWで始めるAPIモック",
  },
];

const UserData: {username: string|undefined, email:string, password:string}[] = [{
  username: "testuser",
  email: "test@example.com",
  password: "password123",
}];

const handlers = [
  http.get("/posts", async ({ response }) => {
    await delay(40); // ネットワーク遅延
    return response(200).json(posts);
  }),

  http.post(`/posts`, async ({ request, response }) => {
    await delay(60); // ネットワーク遅延
    const newPostData = await request.json();
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer mocked-access-token")) {
      return response(401).json({ message: "Unauthorized" });
    }
    const newPost = {
      content: newPostData.content,
      created_at: new Date().toISOString(),
      id: crypto.randomUUID(),
      title: newPostData.title,
    };
    posts.push(newPost);
    return response(201).json(newPost);
  }),

  http.post("/users/register", async ({ request, response }) => {
    const { username, email, password } = await request.json();
    await delay(50); // ネットワーク遅延
    UserData.push({ username, email, password });
    return response(201).json(
      {
        access_token: "mocked-access-token-12345",
      },
      {
        headers: {
          "Set-Cookie": `refresh_token=mocked-refresh-token-12345; HttpOnly; Path=/; SameSite=Strict`,
        }
      },
    );
  }),

  http.post("/users/login", async ({ request, response }) => {
    const { email, password } = await request.json();
    if (!UserData.some(user => user.email === email && user.password === password)) {
      return response(401).json({ message: "Invalid credentials" });
    }
    return response(200).json(
      {
        access_token: "mocked-access-token-12345",
      },
      {
        headers: {
          "Set-Cookie": `refresh_token=mocked-refresh-token-12345; HttpOnly; Path=/; SameSite=Strict`,
        },
      },
    );
  }),

  http.post("/token/refresh", async ({ request, response }) => {
    // モックでは常に成功するように設定
    await delay(50); // ネットワーク遅延
    const refreshToken = request.credentials;
    console.log("Refresh token received:", refreshToken);

    return response(200).json({
      access_token: "mocked-access-token-67890",
    });
  }),
];
export { handlers, http };
