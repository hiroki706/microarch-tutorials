"use client";

import { useEffect } from "react";

export const MSWComponent = () => {
  useEffect(() => {
    // 開発環境かつ、ブラウザでのみMSWを有効化
    if (process.env.NODE_ENV !== "production") {
      if (typeof window !== "undefined") {
        import("@/mocks/browser").then(({ worker }) => {
          worker.start();
        });
      } else {
        import("@/mocks/server").then(({ server }) => {
          server.listen({ onUnhandledRequest: "error" });
        });
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        import("@/mocks/browser").then(({ worker }) => {
          worker.stop();
        });
      } else {
        import("@/mocks/server").then(({ server }) => {
          server.close();
        });
      }
    };
  }, []);

  return null;
};
