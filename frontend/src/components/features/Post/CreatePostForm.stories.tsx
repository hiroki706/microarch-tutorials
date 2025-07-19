import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreatePostForm } from "./CreatePostForm";

const queryClient = new QueryClient();

const meta: Meta<typeof CreatePostForm> = {
  component: CreatePostForm,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
    ),
  ],
  tags: ["autodocs"],
  title: "Features/Post/CreatePostForm",
};

export default meta;
type Story = StoryObj<typeof CreatePostForm>;

export const Default: Story = {
  args: {
    onSuccess: () => null,
  },
};
