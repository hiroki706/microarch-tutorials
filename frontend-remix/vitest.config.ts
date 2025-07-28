import { type ConfigEnv, defineConfig, mergeConfig } from "vitest/config";
import baseViteConfig from "./vite.config";

export default defineConfig(async (configEnv: ConfigEnv) => {
  const baseConfig = baseViteConfig(configEnv);

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        globals: true,
        include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      },
    }),
  );
});
