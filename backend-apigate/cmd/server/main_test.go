package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
)

func NewTestRouter() http.Handler {
	server := NewServer()
	r := chi.NewRouter()
	api.HandlerFromMuxWithBaseURL(server, r, "/v1")
	return r
}

func TestCreatePost(t *testing.T) {
	router := NewTestRouter()

	postJSON := `{"title":"Test Post","content":"This is a test post."}`
	req, err := http.NewRequest("POST", "/v1/posts", bytes.NewBufferString(postJSON))
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// レスポンスを記録するためのレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラにリクエストを送信
	router.ServeHTTP(rr, req) // まだないのでいったんコメントアウト

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusCreated)
	}

	if !bytes.Contains(rr.Body.Bytes(), []byte(`"title":"Test Post"`)) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), `"title":"Test Post"`)
	}
}
