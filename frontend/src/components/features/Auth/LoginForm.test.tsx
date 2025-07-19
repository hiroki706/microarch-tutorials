import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithQueryClient } from '@/lib/test/render';
import { useAuthStore } from '@/store/auth';
import { LoginForm } from './LoginForm'; // これから作る

// 各テストの前にZustandストアの状態をリセット
const originalState = useAuthStore.getState();
beforeEach(() => {
  useAuthStore.setState(originalState);
});

describe('LoginForm', () => {
  it('ログインに成功すると、認証ストアにアクセストークンが保存される', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm onSuccess={() => {}} />);

    // 初期状態ではトークンはnull
    expect(useAuthStore.getState().accessToken).toBeNull();

    // フォームに入力
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com');
    await user.type(screen.getByLabelText(/パスワード/), 'password123');

    // ログインボタンをクリック
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    // ストアの状態が更新されるのを待機して検証
    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mocked-access-token-12345');
    });
  });
});
