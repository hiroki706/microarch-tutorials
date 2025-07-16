import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/api/services";

import { PostCard } from "./PostCard";

const testData: Post = {
  content: "これが投稿の本文です。",
  created_at: "2025-07-17T10:00:00Z",
  id: "test-id-1",
  title: "テスト投稿のタイトル",
};

describe("PostCard", () => {
  it("渡された投稿のタイトルと本文を正しく描画する", () => {
    render(<PostCard post={testData} />);
    expect(
      screen.getByRole("heading", { name: "テスト投稿のタイトル" }),
    ).toBeInTheDocument();
    expect(screen.getByText("これが投稿の本文です。")).toBeInTheDocument();
  });
});
