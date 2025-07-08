package main

import (
	"context"
	"log"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/handler"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
)

func main() {
	// TODO: 環境変数や設定ファイルから変数を取得する
	dbURL := "postgres://app_user:password@localhost:5432/app_db?sslmode=disable"
	jwtSecret := "your_jwt_secret_key"

	if dbURL == "" {
		log.Fatal("Database URL is not set")
	}
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	// 1. RDBデータベースリポジトリの初期化
	postRepo := repository.NewPostgresPostRepository(pool)
	authRepo := repository.NewPostgresUserRepository(pool)

	// 2. Usecaseのインスタンスを作成し、repositoryを注入
	postUsecase := usecase.NewPostUsecase(postRepo)
	authUsecase := usecase.NewAuthUsecase(authRepo, jwtSecret)

	// 3. APIハンドラーのインスタンスを作成し、Usecaseを注入
	serverHandler := handler.NewServer(postUsecase, authUsecase)

	// 4. ルーターを設定し、ハンドラーを登録

	r := chi.NewRouter()
	// 認証不要ルート
	r.Group(func(r chi.Router) {
		r.Post("/v1/auth/register", serverHandler.RegisterUser)
		r.Post("/v1/auth/login", serverHandler.LoginUser)
		r.Post("/v1/auth/refresh", serverHandler.RefreshToken)
		r.Get("/v1/posts", serverHandler.GetPosts)
	})

	// 認証が必要なルート
	r.Group(func(r chi.Router) {
		// ミドルウェアを適用
		r.Use(handler.Authenticator(&authUsecase))

		r.Post("/v1/posts", serverHandler.CreatePost)
	})

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
