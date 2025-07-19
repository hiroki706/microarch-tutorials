import { screen, waitFor } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithQueryClient } from "@/lib/test/render";

import { CreatePostForm } from "./CreatePostForm";

describe("CreatePostForm", () => {
  it("入力欄とボタンが正しく表示されること", () => {
    renderWithQueryClient(<CreatePostForm onSuccess={() => {}} />);
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    expect(screen.getByLabelText(/本文/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /投稿する/ }),
    ).toBeInTheDocument();
  });

  it("ボタンをクリックするとonSuccessが呼ばれること", async () => {
    const user = UserEvent.setup();
    const onSuccess = vi.fn();
    renderWithQueryClient(<CreatePostForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/タイトル/), "テストタイトル");
    await user.type(screen.getByLabelText(/本文/), "テスト本文");
    await user.click(screen.getByRole("button", { name: /投稿する/ }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1); // onSuccessが1回呼ばれること
    });
  });
});
