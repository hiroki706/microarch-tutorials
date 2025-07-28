import { Link } from "react-router";
import { PostCard } from "~/feature/PostCard";
import { client } from "~/lib/api/servise";
import type { Route } from "./+types/page";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// loaderはサーバーサイドで実行される
export async function loader() {
  const response = await client.GET("/posts");
  if (!response.response.ok) {
    return {
      posts: [],
      error: response.error?.message,
    };
  }
  const posts = response.data || [];
  return { posts: posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, error } = loaderData;
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1>投稿一覧</h1>
      {posts.map((post) => (
        <PostCard {...post} key={post.id} />
      ))}
      {error && <div className="text-red-600">エラー: {error}</div>}
      <Link to="/login" className="text-blue-500 hover:underline">
        form
      </Link>
    </div>
  );
}

export const handle = {
  breadcrumb: () => "Home",
};
