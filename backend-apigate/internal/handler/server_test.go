package handler_test

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
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
	sh := api.NewStrictHandler(serverHandler, nil)
	// 認証不要ルート
	r.Group(func(r chi.Router) {
		r.Post("/v1/auth/register", sh.RegisterUser)
		r.Post("/v1/auth/login", sh.LoginUser)
		r.Post("/v1/auth/refresh", sh.RefreshToken)
		r.Get("/v1/posts", sh.GetPosts)
	})

	// 認証が必要なルート
	r.Group(func(r chi.Router) {
		// ミドルウェアを適用
		r.Use(handler.Authenticator(&authUsecase))

		r.Post("/v1/posts", sh.CreatePost)
	})

	return r
}
