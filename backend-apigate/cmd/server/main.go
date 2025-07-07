package main

import (
	"context"
	"log"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/handler"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
)

func main() {
	dbURL := "postgres://app_user:password@localhost:5432/app_db?sslmode=disable"
	if dbURL == "" {
		log.Fatal("Database URL is not set")
	}
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	// 1. RDBデータベースリポジトリの初期化
	postRepo, err := repository.NewPostgresPostRepository(pool)

	if err != nil {
		log.Fatalf("Failed to create PostgresPostRepository: %v", err)
	}
	// 2. Usecaseのインスタンスを作成し、repositoryを注入
	postUsecase := usecase.NewPostUsecase(postRepo)

	// 3. APIハンドラーのインスタンスを作成し、Usecaseを注入
	postHandler := handler.NewPostHandler(postUsecase)

	// 4. ルーターを設定し、ハンドラーを登録
	r := chi.NewRouter()
	api.HandlerFromMuxWithBaseURL(postHandler, r, "/v1")

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
