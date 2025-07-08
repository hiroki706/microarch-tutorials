package handler_test // テスト対象と別パッケージにすることで、公開されたものだけをテストできる

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "github.com/lib/pq" // PostgreSQLドライバをインポート
)

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

// TestGetPostsUnauthorized は認証なしで投稿一覧を取得することを確認
func TestGetPostsUnauthorized(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest("GET", "/v1/posts", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusUnauthorized)
	}
}

func TestPostWithauthPosts(t *testing.T) {
	router := setupTestRouter()
	userJSON := `{"username": "testuser", "password": "password123", "email": "test@example.com"}`
	reqRegister, _ := http.NewRequest("POST", "/v1/auth/register", bytes.NewBufferString(userJSON))
	reqRegister.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(httptest.NewRecorder(), reqRegister)
	// ユーザー登録が成功した後、ログインを試みる
	loginJSON := `{"email": "test@example.com", "password": "password123"}`
	reqLogin, _ := http.NewRequest("POST", "/v1/auth/login", bytes.NewBufferString(loginJSON))
	reqLogin.Header.Set("Content-Type", "application/json")
	rrLogin := httptest.NewRecorder()
	router.ServeHTTP(rrLogin, reqLogin)
	// 200 OK とトークンペアが返ってくることを期待
	if status := rrLogin.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v err: %v", status, http.StatusOK, rrLogin.Body.String())
	}
	var response map[string]string
	if err := json.NewDecoder(rrLogin.Body).Decode(&response); err != nil {
		t.Fatalf("could not decode response: %v", err)
	}
	access_token, _ := response["access_token"]

	// トークンをヘッダーにセットして投稿を作成
	reqCreate, _ := http.NewRequest("POST", "/v1/posts", bytes.NewBufferString(`{"title":"Test Post","content":"This is a test post."}`))
	reqCreate.Header.Set("Content-Type", "application/json")
	reqCreate.Header.Set("Authorization", "Bearer "+access_token)

	rrCreate := httptest.NewRecorder()
	router.ServeHTTP(rrCreate, reqCreate)
	if status := rrCreate.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
	// 投稿一覧を取得
	reqGet, _ := http.NewRequest("GET", "/v1/posts", nil)
	reqGet.Header.Set("Authorization", "Bearer "+access_token)
	rrGet := httptest.NewRecorder()
	router.ServeHTTP(rrGet, reqGet)
	if status := rrGet.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
	var posts []map[string]interface{}
	if err := json.NewDecoder(rrGet.Body).Decode(&posts); err != nil {
		t.Fatalf("could not decode response: %v", err)
	}
	if len(posts) == 0 {
		t.Error("expected at least one post in response")
	}
	if posts[0]["title"] != "Test Post" {
		t.Errorf("expected post title 'Test Post', got '%v'", posts[0]["title"])
	}
	if posts[0]["content"] != "This is a test post." {
		t.Errorf("expected post content 'This is a test post.', got '%v'", posts[0]["content"])
	}
}
