package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRegisterUser(t *testing.T) {
	router := setupTestRouter()

	userJSON := `{"username": "testuser", "password": "password123", "email": "test@example.com"}`
	req, _ := http.NewRequest("POST", "/v1/auth/register", bytes.NewBufferString(userJSON))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	// 204 No Content が返ってくることを期待
	if status := rr.Code; status != http.StatusNoContent {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusNoContent)
	}
}

func TestLoginUser(t *testing.T) {
	router := setupTestRouter()

	userJSON := `{"username": "testuser", "password": "password123", "email": "test@example.com"}`
	reqRegister, _ := http.NewRequest("POST", "/v1/auth/register", bytes.NewBufferString(userJSON))
	reqRegister.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, reqRegister)
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
	if _, ok := response["access_token"]; !ok {
		t.Error("expected access_token in response")
	}
	if _, ok := response["refresh_token"]; !ok {
		t.Error("expected refresh_token in response")
	}
}
