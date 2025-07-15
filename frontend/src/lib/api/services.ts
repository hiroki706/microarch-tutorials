import createClient from "openapi-fetch";
import { paths } from "./schemas.gen";
import { env } from "@/env/client";

export const client = createClient<paths>({
    baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
    // [原因不明]この設定がないと、test環境でMSWが動作しない
    // サーバーではfetchが独自定義されている？
    fetch: (input) => fetch(input)
})
