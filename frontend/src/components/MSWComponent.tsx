'use client';

import React, { useEffect } from "react";



export const MSWComponent: React.FC = () => {
    useEffect(() => {
        if (typeof window !== "undefined"
            && process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
                import("@/mocks/browser").then(({ worker }) => {
                    worker.start({
                        onUnhandledRequest: 'bypass', // 未処理のリクエストをそのまま通す
                    });
                });
            }
    }, []);

    return null; // このコンポーネントは何もレンダリングしない
}
