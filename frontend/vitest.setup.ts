import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";

// MSWのサーバーをセットアップ
beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});
// 各テスト後にサーバーの状態をリセット
afterEach(() => {
	server.resetHandlers();
	cleanup();
});
// 全てのテスト後にサーバーをクリーンアップ
afterAll(() => {
	server.close();
});
