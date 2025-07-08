package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostRepositoryのPostgreSQL実装
type postgresPostRepository struct {
	db *pgxpool.Pool
	q  *sqlc.Queries
}

func NewPostgresPostRepository(db *pgxpool.Pool) PostRepository {
	return &postgresPostRepository{
		db: db,
		q:  sqlc.New(db),
	}
}

func (r *postgresPostRepository) FindAll() ([]api.Post, error) {
	rows, err := r.q.ListPosts(context.Background())
	if err != nil {
		return nil, err
	}
	posts := make([]api.Post, 0, len(rows))
	for i, row := range rows {
		posts[i] = api.Post{
			Id:        &row.ID,
			Title:     &row.Title,
			Content:   &row.Content,
			CreatedAt: &row.CreatedAt.Time,
		}
	}
	return posts, nil
}

func (r *postgresPostRepository) Save(post api.Post) (api.Post, error) {
	newUUID, err := uuid.NewRandom()
	params := sqlc.CreatePostParams{
		ID:      newUUID,
		Title:   *post.Title,
		Content: *post.Content,
	}

	created, err := r.q.CreatePost(context.Background(), params)
	if err != nil {
		return api.Post{}, err
	}

	return api.Post{
		Id:        &created.ID,
		Title:     &created.Title,
		Content:   &created.Content,
		CreatedAt: &created.CreatedAt.Time,
	}, nil
}
