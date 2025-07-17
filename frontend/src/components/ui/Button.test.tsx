import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("子要素として渡されたテキストを正しく描画する", () => {
    // 1. レンダリング
    render(<Button>投稿する</Button>);

    // 2. 要素の取得
    const buttonElement = screen.getByRole("button", { name: "投稿する" });

    // 3. 検証
    expect(buttonElement).toBeInTheDocument();
  });
});
