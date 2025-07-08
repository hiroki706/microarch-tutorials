package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

type postgresUserRepository struct {
	db *pgxpool.Pool
	q  *sqlc.Queries
}

// 新しいUserRepositoryをインスタンスをPostgreSQLで作成する関数
func NewPostgresUserRepository(db *pgxpool.Pool) UserRepository {
	return &postgresUserRepository{
		db: db,
		q:  sqlc.New(db),
	}
}

func (r *postgresUserRepository) Save(ctx context.Context, user User) error {
	newUUID := user.ID
	if newUUID == uuid.Nil {
		// ユーザーIDが空なら空エラーを返す
		return errors.New("user ID cannot be empty")
	}

	params := sqlc.CreateUserParams{
		ID:           newUUID,
		Username:     user.Username,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}
	_, err := r.q.CreateUser(ctx, params)
	return err
}

func (r *postgresUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	user, err := r.q.GetUserByEmail(ctx, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // ユーザーが見つからない場合はnilを返す
		}
		return nil, err // その他のエラーはそのまま返す
	}

	return &User{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}, nil
}

func (r *postgresUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
	user, err := r.q.GetUserByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // ユーザーが見つからない場合はnilを返す
		}
		return nil, err // その他のエラーはそのまま返す
	}

	return &User{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}, nil
}
