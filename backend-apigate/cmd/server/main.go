package main

import (
	"log"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/handler"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"

	"github.com/go-chi/chi/v5"
)

func main() {
	// 1. インメモリデータベースリポジトリの初期化
	postRepo := repository.NewInMemoryPostRepository()

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
