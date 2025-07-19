"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { client, type Schemas } from "@/lib/api/services";

const formSchema = z.strictObject({
  content: z.string().min(1, { message: "本文は必須です" }),
  title: z.string().min(1, { message: "タイトルは必須です" }),
});

type CreatePostFormProps = {
  onSuccess: () => void;
};

export const CreatePostForm = ({ onSuccess }: CreatePostFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  // データ更新(Create/Update/Delete)にはuseMutationフックを使用
  const mutation = useMutation({
    mutationFn: (formData: Schemas["NewPost"]) =>
      client.POST("/posts", { body: formData }),
    onSuccess: () => {
      onSuccess(); // 親コンポーネントに成功を通知
      form.reset(); // フォームをリセット
    },
  });

  const onSubmit = (request: Schemas["NewPost"]) => {
    mutation.mutate(request);
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="投稿のタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文</FormLabel>
              <FormControl>
                <Textarea placeholder="投稿の本文" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </Form>
  );
};
