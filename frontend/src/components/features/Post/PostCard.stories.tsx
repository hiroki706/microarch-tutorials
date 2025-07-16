import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostCard } from "./PostCard";

const meta: Meta<typeof PostCard> = {
  component: PostCard,
  tags: ["autodocs"],
  title: "Features/Post/PostCard",
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
  args: {
    post: {
      content:
        "これはStorybookから表示された投稿の本文です。コンポーネントの見た目をここで調整します。",
      created_at: "2025-07-17T10:00:00Z",
      id: "story-id-1",
      title: "Storybookで見るタイトル",
    },
  },
};
