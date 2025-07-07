package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/oapi-codegen/runtime/types"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// Server構造体は、api.Serverインターフェースを実装するためのものです。
type Server struct {
	// 今はDBの代わりにメモリ内のスライスを使用しています。
	posts map[*types.UUID]api.Post
}

// Serverがapi.ServerInterfaceを実装していない場合、静的チェックでエラーを出すためのコードです。
var _ api.ServerInterface = &Server{}

func NewServer() *Server {
	return &Server{
		posts: make(map[*types.UUID]api.Post),
	}
}

func (s *Server) GetPosts(w http.ResponseWriter, r *http.Request) {
	posts := make([]api.Post, 0, len(s.posts))
	for _, post := range s.posts {
		posts = append(posts, post)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

// CreatePostは新しい投稿を作成するハンドラです。
func (s *Server) CreatePost(w http.ResponseWriter, r *http.Request) {
	var newPost api.NewPost
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := uuid.New()

	// 新しい投稿のIDを生成
	post := api.Post{
		// *types.UUID
		Id:      &id,
		Title:   &newPost.Title,
		Content: &newPost.Content,
	}

	s.posts[post.Id] = post

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
	w.Write([]byte("Post created successfully!"))
}

func main() {
	server := NewServer()

	// Chiルーターを使い、生成されたコードでハンドラを登録
	router := chi.NewRouter()
	api.HandlerFromMuxWithBaseURL(server, router, "/v1")

	log.Println("Starting server on http://localhost:8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
