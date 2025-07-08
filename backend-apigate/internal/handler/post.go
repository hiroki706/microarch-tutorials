package handler

import (
	"encoding/json"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
)

func (h *Server) GetPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := h.postUC.GetAllPosts(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func (h *Server) CreatePost(w http.ResponseWriter, r *http.Request) {
	var newPost api.NewPost
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	post, err := h.postUC.CreatePost(r.Context(), newPost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}
