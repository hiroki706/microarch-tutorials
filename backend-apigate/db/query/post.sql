-- name: CreatePost :one
INSERT INTO posts (id, title, content)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ListPosts :many
SELECT * FROM posts
ORDER BY created_at DESC;
