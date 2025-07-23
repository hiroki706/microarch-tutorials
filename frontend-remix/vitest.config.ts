import { type ConfigEnv, defineConfig, mergeConfig } from "vitest/config";
import baseViteConfig from "./vite.config";

export default defineConfig(async (configEnv: ConfigEnv) => {
  // NOTE: 環境変数の読み込み（loadEnv()）が非同期的なためawaitを設定
  const baseConfig = baseViteConfig(configEnv);

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        setupFiles: ["./vitest.setup.ts"],
        globals: true,
        environment: "jsdom",
        include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      },
    }),
  );
});
