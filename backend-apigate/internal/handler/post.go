package handler

import (
	"context"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
)

func (h *Server) GetPosts(ctx context.Context, r api.GetPostsRequestObject) (api.GetPostsResponseObject, error) {
	posts, err := h.postUC.GetAllPosts(ctx)
	if err != nil {
		return nil, nil
	}
	return api.GetPosts200JSONResponse(posts), nil
}

func (h *Server) CreatePost(ctx context.Context, r api.CreatePostRequestObject) (api.CreatePostResponseObject, error) {
	newPost := *r.Body
	post, err := h.postUC.CreatePost(ctx, newPost)
	if err != nil {
		return nil, err
	}

	return api.CreatePost201JSONResponse(post), nil
}
