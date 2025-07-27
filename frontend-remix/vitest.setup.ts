import "@testing-library/jest-dom/vitest";
import { server } from '~/mocks/server';
import { cleanup } from "@testing-library/react";

// 全てのテストの前にサーバーを起動
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// 各テストの後にリクエストハンドラをリセット
afterEach(() => {
  server.resetHandlers()
  cleanup(); // 各テスト後にDOMをクリーンアップ
});

// 全てのテストの後にサーバーを停止
afterAll(() => server.close());
