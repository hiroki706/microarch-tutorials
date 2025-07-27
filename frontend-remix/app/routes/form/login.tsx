import {
  Form,
  isRouteErrorResponse,
  redirect,
  useRouteError,
} from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { client } from "~/lib/api/servise";
import type { Route } from "./+types/login";

const formSchema = z.object({
  title: z.string({ error: "タイトルは文字列です" }).min(1, {
    message: "タイトルは必須です",
  }),
  content: z.string({ error: "内容は文字列です" }).min(1, {
    message: "内容は必須です",
  }),
});

// Action関数：サーバーサイドでのみ実行される
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = formSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      invalid: true,
      titleError: result.error.issues[0].message,
      contentError: result.error.issues[1].message,
    };
  }
  await client.POST("/posts", { body: result.data });
  return redirect("/");
}

export default function NewPostPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Form method="post" className="space-y-4">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          name="title"
          type="text"
          className="w-full"
          aria-invalid={actionData?.invalid}
          aria-describedby="titleError"
        />
        {actionData?.titleError && (
          <div className="text-red-600" id={actionData.titleError}>
            {actionData.titleError}
          </div>
        )}

        <Label htmlFor="content">内容</Label>
        <Input
          id="content"
          name="content"
          type="text"
          className="w-full"
          aria-invalid={!!actionData?.invalid}
          aria-describedby="contentError"
        />
        {actionData?.contentError && (
          <div className="text-red-600" id={actionData.contentError}>
            {actionData.contentError}
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary text-white hover:bg-blue-600"
        >
          投稿
        </Button>
      </Form>
    </div>
  );
}

export const handle = {
  breadcrumb: () => "New Post",
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
