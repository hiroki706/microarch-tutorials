import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithQueryClient } from "@/lib/test/render";
import { http } from "@/mocks/handler";
import { server } from "@/mocks/server";
import Page from "./page";

describe("Home Page", () => {
  it("データ取得に成功した場合、投稿のタイトルが表示される", async () => {
    // レンダリング
    renderWithQueryClient(<Page />);
    // MSWの返すモックデータ
    expect(
      await screen.findByRole("heading", { name: "MSWで始めるAPIモック" }),
    ).toBeInTheDocument();
  });

  it("データ取得に失敗した場合、エラーメッセージが表示される", async () => {
    // 2. このテストの間だけ、MSWの挙動を「500エラーを返す」ように上書き
    server.use(
      http.get("/posts", ({ response }) => {
        return response(500).json({ message: "Internal Server Error" });
      }),
    );

    // 1. レンダリング
    renderWithQueryClient(<Page />);

    // 3. 検証
    // エラーメッセージが画面に表示されるのを待つ
    expect(await screen.findByText("エラーが発生しました")).toBeInTheDocument();
  });
});
