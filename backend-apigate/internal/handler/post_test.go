package handler_test // テスト対象と別パッケージにすることで、公開されたものだけをテストできる

import (
	"bytes"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/handler"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"

	_ "github.com/lib/pq" // PostgreSQLドライバをインポート
)

func setupTestRouter() http.Handler {
	postRepo, err := repository.NewInMemoryPostRepository()
	if err != nil {
		log.Fatalf("Failed to create PostgresPostRepository: %v", err)
	}
	postUsecase := usecase.NewPostUsecase(postRepo)
	postHandler := handler.NewPostHandler(postUsecase)

	r := chi.NewRouter()
	api.HandlerFromMuxWithBaseURL(postHandler, r, "/v1")
	return r
}

func TestCreatePost(t *testing.T) {
	router := setupTestRouter()

	postJSON := `{"title":"Test Post","content":"This is a test post."}`
	reqCreate, _ := http.NewRequest("POST", "/v1/posts", bytes.NewBufferString(postJSON))
	reqCreate.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	router.ServeHTTP(httptest.NewRecorder(), reqCreate)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got \033[31m%v\033[0m want %v", status, http.StatusOK)
	}
}

func TestGetPosts(t *testing.T) {
	router := setupTestRouter()

	// まずはポストを作成しておく
	postJSON := `{"title":"Test Post","content":"This is a test post."}`
	reqCreate, _ := http.NewRequest("POST", "/v1/posts", bytes.NewBufferString(postJSON))
	reqCreate.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(httptest.NewRecorder(), reqCreate)

	// GETリクエストを作成
	reqGet, err := http.NewRequest("GET", "/v1/posts", nil)
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, reqGet)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got \033[31m%v\033[0m want %v", status, http.StatusOK)
	}

	if !bytes.Contains(rr.Body.Bytes(), []byte(`"title":"Test Post"`)) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `"title":"Test Post"`)
	}
}
