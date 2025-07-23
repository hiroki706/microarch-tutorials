import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NewPostPage from "./NewPostForm"; // 作成したコンポーネントをインポート

describe("New Post Page", () => {
  test("タイトル、内容の入力欄、投稿ボタンが表示される", () => {
    // 1. コンポーネントをレンダリング
    render(<NewPostPage />);

    // 2. 各要素が画面に存在するかをチェック (getByRole)
    // labelテキストから要素を探すのが推奨される方法
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const contentInput = screen.getByRole("textbox", { name: /content/i });
    const submitButton = screen.getByRole("button", { name: /post/i });

    // 3. アサーション（期待する結果の検証）
    expect(titleInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
