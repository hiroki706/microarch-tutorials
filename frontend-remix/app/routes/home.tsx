import { Link } from "react-router";
import { client } from "~/lib/api/servise";
import type { Route } from "./+types/home";
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";

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
    <div className="max-w-2xl mx-auto p-4">
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <Card className="mb-4 p-4" key={post.id}>
            <CardTitle><h2>{post.title}</h2></CardTitle>
            <CardContent><p>{post.content}</p></CardContent>
            <CardFooter><small>作成:{post.created_at}</small></CardFooter>
          </Card>
        ))}
      </ul>
      <Link to="/login" className="text-blue-500 hover:underline">
        form
      </Link>
    </div>
  );
}
