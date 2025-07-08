package repository

import (
	"context"
	"errors"
	"sync"

	"github.com/google/uuid"
)

// User はDBに保存するユーザーデータの構造体 (apiとして公開してはいけないので、apiパッケージにはありません)
type User struct {
	ID           uuid.UUID `json:"id"` // ユーザーID (UUID)
	Username     string    `json:"username"`
	Email        string    `json:"email"`    // メールアドレス(ユニーク)
	PasswordHash string    `json:"password"` // パスワードは必ずハッシュ化して保存すること
}

// UserRepository はユーザーデータへのアクセスを抽象化する
type UserRepository interface {
	Save(ctx context.Context, user User) error
	FindByEmail(ctx context.Context, email string) (*User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
}

// ---------------------------------------------------------------------------
// InMemoryUserRepository はメモリ内でユーザーデータを管理するリポジトリの実装
// ----------------------------------------------------------------------------
type InMemoryUserRepository struct {
	mu    sync.RWMutex       // 同時アクセスを防ぐためのミューテックス
	users map[uuid.UUID]User // ユーザーIDをキーにしたマップ
}

// NewInMemoryUserRepository はInMemoryUserRepositoryの新しいインスタンスを返す
func NewInMemoryUserRepository() UserRepository {
	return &InMemoryUserRepository{
		users: make(map[uuid.UUID]User),
	}
}

// Save はユーザーデータをメモリに保存する
func (r *InMemoryUserRepository) Save(ctx context.Context, user User) error {
	newUUID := user.ID

	// ユーザーIDが空なら新しいUUIDを生成
	if newUUID == uuid.Nil {
		return errors.New("user ID cannot be empty")
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	// ユーザーデータをマップに保存
	r.users[newUUID] = User{
		ID:           newUUID,
		Username:     user.Username,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}

	return nil
}

// FindByEmail はメールアドレスでユーザーデータを検索する
func (r *InMemoryUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, user := range r.users {
		if user.Email == email {
			return &User{
				ID:           user.ID,
				Username:     user.Username,
				Email:        user.Email,
				PasswordHash: user.PasswordHash,
			}, nil
		}
	}
	return nil, errors.New("user not found")
}

// FindByID はユーザーIDでユーザーデータを検索する
func (r *InMemoryUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, exists := r.users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return &User{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}, nil
}
