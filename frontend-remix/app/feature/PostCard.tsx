import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import type { components } from "~/lib/api/schemas";

type PostCardProps = components["schemas"]["Post"];

export const PostCard = (post: PostCardProps) => {
  return (
    <Card className="mb-4 p-4">
      <CardTitle>
        <h2>{post.title}</h2>
      </CardTitle>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter>
        <small>作成:{post.created_at}</small>
      </CardFooter>
    </Card>
  );
};
