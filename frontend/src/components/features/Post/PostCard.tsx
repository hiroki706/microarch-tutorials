import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Schemas } from "@/lib/api/services";

type PostCardProps = {
  post: Schemas["Post"];
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>投稿日: {post.created_at}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{post.content}</p>
      </CardContent>
    </Card>
  );
};
