import { client } from "~/lib/api/servise";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// loaderはサーバーサイドで実行される
export async function loader() {
  console.log("loader: APIから投稿データを取得します");

  // MSWがこのfetchをインターセプトする！
  const response = await client.GET("/posts");
  const posts = response.data || [];
  return posts;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const posts = loaderData;
  return (
    <div>
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
