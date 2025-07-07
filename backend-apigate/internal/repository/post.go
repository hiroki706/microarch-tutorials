package repository

import (
	"sync"

	uuid "github.com/google/uuid"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
)

// PostRepository は投稿データへのアクセスを抽象化するインターフェース
type PostRepository interface {
	FindAll() ([]api.Post, error)
	Save(post api.Post) (api.Post, error)
}

// ----------------------------------------------------------------------
// インメモリで投稿データを管理するリポジトリの実装
// ----------------------------------------------------------------------
type inMemoryPostRepository struct {
	// 複雑goroutineの競合を避けるためのロック
	mu    sync.RWMutex
	posts map[uuid.UUID]api.Post
}

// NewInMemoryPostRepository は新しい inMemoryPostRepository を返す
func NewInMemoryPostRepository() (PostRepository, error) {
	return &inMemoryPostRepository{
		posts: make(map[uuid.UUID]api.Post),
	}, nil
}

func (r *inMemoryPostRepository) FindAll() ([]api.Post, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	// 投稿をスライスに変換
	posts := make([]api.Post, 0, len(r.posts))
	for _, post := range r.posts {
		posts = append(posts, post)
	}
	return posts, nil
}

func (r *inMemoryPostRepository) Save(post api.Post) (api.Post, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	var id uuid.UUID

	// 投稿のIDが設定されていない場合は新しいUUIDを生成
	if post.Id == nil || *post.Id == uuid.Nil {
		id = uuid.New()
		post.Id = &id
	}

	r.posts[*post.Id] = post
	return post, nil
}
