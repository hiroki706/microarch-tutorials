package handler

import (
	"encoding/json"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
)

// oapi-codegenで生成された ServerInterface を実装する
type PostHandler struct {
	uc usecase.PostUsecase
}

func NewPostHandler(uc usecase.PostUsecase) api.ServerInterface {
	return &PostHandler{
		uc: uc,
	}
}

func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := h.uc.GetAllPosts(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	var newPost api.NewPost
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	post, err := h.uc.CreatePost(r.Context(), newPost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}
