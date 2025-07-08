package handler

import (
	"context"
	"net/http"
	"strings"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
)

// コンテキストにユーザー情報を格納するためのキー
type userContextKey string

const UserIDKey userContextKey = "userID"

func Authenticator(validator usecase.TokenValidator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Authorizationヘッダーからトークンを取得
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Authorization header required", http.StatusUnauthorized)
				return
			}
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader { // "Bearer "が含まれていない場合
				http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
				return
			}

			// JWTトークンを検証
			userID, err := validator.Validate(tokenString)
			if err != nil {
				http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			// コンテキストを更新したリクエストで次のハンドラーを呼び出す
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
