import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';

// ストーリーの基本情報（タイトル、コンポーネントなど）
const meta: Meta<typeof Button> = {
  title: 'UI/Button', // Storybookのサイドバーに表示されるパス
  component: Button,
  tags: ['autodocs'], // ドキュメントを自動生成
  argTypes: {
    // Storybook上で操作できるコンポーネントの引数
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// デフォルトのストーリー
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'ボタン',
  },
};

// 破壊的な操作を表すボタンのストーリー
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '削除する',
  },
};

// 無効化された状態のストーリー
export const Disabled: Story = {
  args: {
    variant: 'default',
    children: '送信できません',
    disabled: true,
  },
};
