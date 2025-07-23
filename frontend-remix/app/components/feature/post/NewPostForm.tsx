import { Form } from "react-router";

// とりあえず空のコンポーネントをエクスポートしておく
export default function NewPostPage() {
  return (
    <form method="post">
      <h2>Create a New Post</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" />
      </div>
      <div>
        <button type="submit">Post</button>
      </div>
    </form>
  );
}
