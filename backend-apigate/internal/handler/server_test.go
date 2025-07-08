package handler_test

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/handler"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
)

func setupTestRouter() http.Handler {
	var jwtSecret = "mysecretkey"

	postRepo := repository.NewInMemoryPostRepository()
	authRepo := repository.NewInMemoryUserRepository()

	postUsecase := usecase.NewPostUsecase(postRepo)
	authUsecase := usecase.NewAuthUsecase(authRepo, jwtSecret)
	serverHandler := handler.NewServer(postUsecase, authUsecase)

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
		r.Use(handler.Authenticator([]byte(jwtSecret)))

		r.Post("/v1/posts", serverHandler.CreatePost)
	})

	return r
}
