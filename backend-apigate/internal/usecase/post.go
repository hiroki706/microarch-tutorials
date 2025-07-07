package usecase

import (
	"context"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
)

// PostUsecase は投稿に関するビジネスロジックを定義するインターフェースです。
type PostUsecase interface {
	// すべての投稿を取得します。
	GetAllPosts(ctx context.Context) ([]api.Post, error)
	// 新しい投稿を作成します。
	CreatePost(ctx context.Context, newPost api.NewPost) (api.Post, error)
}

// ---------------------------------
// PostUsecaseの実装
// ---------------------------------
type postUsecase struct {
	repo repository.PostRepository // repoをインターフェースとして定義することで差し替え容易です
}

// 新しいPostUsecaseのインスタンスを作成します。
func NewPostUsecase(repo repository.PostRepository) PostUsecase {
	return &postUsecase{
		repo: repo,
	}
}

func (u *postUsecase) GetAllPosts(ctx context.Context) ([]api.Post, error) {
	return u.repo.FindAll()
}

func (u *postUsecase) CreatePost(ctx context.Context, newPost api.NewPost) (api.Post, error) {
	post := api.Post{
		Title:   &newPost.Title,
		Content: &newPost.Content,
	}

	return u.repo.Save(post) // ID採番や保存はリポジトリ側の責任
}
