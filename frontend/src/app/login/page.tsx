'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/features/Auth/LoginForm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // ログイン成功後、ホームページにリダイレクト
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
