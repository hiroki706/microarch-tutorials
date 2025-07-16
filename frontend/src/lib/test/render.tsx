import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";

// テストごとに新しいQueryClientを作成しないとキャッシュが干渉する
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // テストではリトライしない
        retry: false,
      },
    },
  });
};

export const renderWithQueryClient = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(ui, { wrapper, ...options });
};
