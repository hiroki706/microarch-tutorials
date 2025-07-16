"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api/services";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryFn: () => client.GET("/posts"), // API呼び出し
    queryKey: ["posts"], // キャッシュ識別情報
  });
  if (isLoading) return <div>Loading...</div>;
  if (data?.error)
    return (
      <>
        <div>エラーが発生しました</div>
        {data.error.message}
      </>
    );
  if (error)
    return (
      <div>
        エラーが発生しました{error.message},{error.stack},{String(error.cause)}
      </div>
    );
  const posts = data?.data || [];

  return (
    <main>
      <h1>投稿一覧</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>投稿日: {post.created_at}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
