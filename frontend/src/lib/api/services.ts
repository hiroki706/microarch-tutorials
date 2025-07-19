import createClient from "openapi-fetch";
import { env } from "@/env/client";
import type { components, paths } from "./schemas";
import { useAuthStore } from "@/store/auth";

export const client = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  // [原因不明]この設定がないと、test環境でMSWが動作しない
  // サーバーではfetchが独自定義されているから？
  fetch: (input) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      return fetch(input, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mocked-access-token${accessToken}`,
        },
      });
    }
    return fetch(input);
  },
});


export type Schemas = components["schemas"];
