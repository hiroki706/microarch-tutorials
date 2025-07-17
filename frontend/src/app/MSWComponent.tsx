"use client";

import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export const MSWComponent = ({ children }: Props) => {
  const [mswReady, setMswReady] = React.useState(false);
  useEffect(() => {
    // 開発環境かつ、ブラウザでのみMSWを有効化
    if (process.env.NODE_ENV !== "production") {
      const initMSW = async () => {
        if (typeof window === "undefined") {
          const { server } = await import("@/mocks/server");
          server.listen({ onUnhandledRequest: "warn" });
        } else {
          const { worker } = await import("@/mocks/browser");
          await worker.start({ onUnhandledRequest: "warn" });
        }
        setMswReady(true);
      };
      if (!mswReady) {
        initMSW();
      }
    }
  }, [mswReady]);

  if (process.env.NODE_ENV !== "production" && !mswReady) {
    return <div>Loading MSW...</div>;
  }
  return <>{children}</>;
};
