package handler

import (
	"context"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
)

func (s *Server) RegisterUser(ctx context.Context, r api.RegisterUserRequestObject) (api.RegisterUserResponseObject, error) {
	req := *r.Body
	// ユーザー登録のロジックを呼び出すだけ
	err := s.authUC.RegisterUser(ctx, req)
	if err != nil {
		return nil, err
	}
	return api.RegisterUser204Response{}, nil
}
func (s *Server) LoginUser(ctx context.Context, r api.LoginUserRequestObject) (api.LoginUserResponseObject, error) {
	req := *r.Body

	tokenPair, err := s.authUC.LoginUser(ctx, req)
	if err != nil {
		return nil, err
	}

	return api.LoginUser200JSONResponse(*tokenPair), nil
}

func (s *Server) RefreshToken(ctx context.Context, r api.RefreshTokenRequestObject) (api.RefreshTokenResponseObject, error) {
	req := *r.Body

	tokenPair, err := s.authUC.RefreshToken(ctx, req)
	if err != nil {
		return nil, err
	}

	return api.RefreshToken200JSONResponse(*tokenPair), nil
}
