import { isRouteErrorResponse, redirect, useRouteError } from "react-router";
import { z } from "zod";
import { PostForm } from "~/feature/PostForm";
import { client } from "~/lib/api/servise";
import type { Route } from "./+types/page";

const formSchema = z.object({
  title: z
    .string({ error: "タイトルは文字列です" })
    .min(1, { message: "タイトルは必須です",}),
  content: z
    .string({ message: "内容は文字列です" })
    .min(1, { error: "内容は必須です",}),
});

// Action関数：サーバーサイドでのみ実行される
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = formSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      invalid: true,
      errors: z.treeifyError(result.error),
    };
  }
  const apiResult = await client.POST("/posts", { body: result.data });
  if (!apiResult.response.ok) {
    // Error Boundaryで処理される
    throw new Response("Failed to create post", {
      status: 500,
      statusText: "Internals Server Error",
    });
  }
  return redirect("/");
}

export default function NewPostPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="max-w-md mx-auto p-4">
      <PostForm
        invalid={actionData?.invalid || false}
        errorTitle={actionData?.errors?.properties?.title?.errors}
        errorContent={actionData?.errors?.properties?.content?.errors}
      />
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
      <div className="max-w-md mx-auto p-4">
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
        <p className="text-red-600">{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
