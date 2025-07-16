import createClient from "openapi-fetch";
import { env } from "@/env/client";
import type { components, paths } from "./schemas.gen";

export const client = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  // [原因不明]この設定がないと、test環境でMSWが動作しない
  // サーバーではfetchが独自定義されているから？
  fetch: (input) => fetch(input),
});

export type Post = components["schemas"]["Post"];
