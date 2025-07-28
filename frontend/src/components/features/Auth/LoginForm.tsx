"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/api/services"; // インターセプター付きのクライアント
import { useAuthStore } from "@/store/auth";

const formSchema = z.object({
  email: z.email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(8, { message: "パスワードは8文字以上です" }),
});

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  // ZustandストアからsetAccessToken関数を取得
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    // インターセプター付きのapiClientを使ってAPIを呼び出す
    mutationFn: (data: z.infer<typeof formSchema>) =>
      client.POST("/users/login", { body: data }),
    onError: () => {
      // 実際にはここでエラーメッセージを表示する
      console.error("ログインに失敗しました");
    },
    onSuccess: (response) => {
      // レスポンスからアクセストークンを取得してストアに保存
      const access_token = response.data?.access_token;
      if (access_token) {
        setAccessToken(access_token);
        onSuccess();
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="test@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "処理中..." : "ログイン"}
        </Button>
      </form>
    </Form>
  );
};
