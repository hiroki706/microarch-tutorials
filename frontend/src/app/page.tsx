"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePostForm } from "@/components/features/Post/CreatePostForm";
import { PostCard } from "@/components/features/Post/PostCard";
import { client } from "@/lib/api/services";

export default function Home() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: () => client.GET("/posts"), // API呼び出し
    queryKey: ["posts"], // キャッシュ識別情報
  });

  const handleCreateSuccess = () => {
    // 新しい投稿が作成された後にキャッシュを無効化、データを再フェッチ
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        エラーが発生しました{error.message},{error.stack},{String(error.cause)}
      </div>
    );
  if (data?.error) {
    return (
      <>
        <div>エラーが発生しました</div>: {data.error.message}
      </>
    );
  }
  const posts = data?.data || [];

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">新しい投稿の作成</h2>
        <CreatePostForm onSuccess={handleCreateSuccess} />
      </div>
      <h1 className="mb-6 border-b pb-2 text-3xl font-bold">投稿一覧</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
