import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

// ストーリーの基本情報（タイトル、コンポーネントなど）
const meta: Meta<typeof Button> = {
  argTypes: {
    children: {
      control: { type: "text" },
    },
    // Storybook上で操作できるコンポーネントの引数
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
  },
  component: Button,
  tags: ["autodocs"], // ドキュメントを自動生成
  title: "UI/Button", // Storybookのサイドバーに表示されるパス
};

export default meta;
type Story = StoryObj<typeof Button>;

// デフォルトのストーリー
export const Default: Story = {
  args: {
    children: "ボタン",
    variant: "default",
  },
};

// 破壊的な操作を表すボタンのストーリー
export const Destructive: Story = {
  args: {
    children: "削除する",
    variant: "destructive",
  },
};

// 無効化された状態のストーリー
export const Disabled: Story = {
  args: {
    children: "送信できません",
    disabled: true,
    variant: "default",
  },
};
