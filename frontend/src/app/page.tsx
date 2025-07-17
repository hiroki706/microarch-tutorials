"use client";

import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/features/Post/PostCard";
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
    <main className="container mx-auto p-4">
      <h1 className="mb-6 border-b pb-2 text-3xl font-bold">投稿一覧</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
