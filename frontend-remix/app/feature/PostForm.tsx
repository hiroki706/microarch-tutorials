import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Schemas } from "~/lib/api/servise";

type postFormProps = {
  defaultValues?: Schemas["NewPost"];
  invalid: boolean;
  errorTitle?: string[];
  errorContent?: string[];
};

export const PostForm = (p: postFormProps) => {
  return (
    <Form method="post" className="space-y-4">
      <Label htmlFor="title">タイトル</Label>
      <Input
        id="title"
        name="title"
        type="text"
        className="w-full"
        aria-invalid={p.invalid}
        aria-describedby="titleError"
      />
      {p.errorTitle?.map((error) => (
        <div key={error} className="text-red-600">
          {error}
        </div>
      ))}

      <Label htmlFor="content">内容</Label>
      <Input
        id="content"
        name="content"
        type="text"
        className="w-full"
        aria-invalid={p.invalid}
        aria-describedby="contentError"
      />
      {p.errorContent?.map((error) => (
        <div key={error} className="text-red-600">
          {error}
        </div>
      ))}

      <Button
        type="submit"
        className="bg-primary text-white hover:bg-accent-foreground"
      >
        投稿
      </Button>
    </Form>
  );
};
