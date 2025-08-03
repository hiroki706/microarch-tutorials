package handler

// Package handler は、APIのエンドポイントを実装するためのハンドラーを定義します。
// このファイルは、oapi-codegenで生成されたAPIインターフェースを実装するためのサーバー構造体を定義し、実装は別のファイルに分割されます。
import (
	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/usecase"
)

// oapi-codegenで生成された ServerInterface を実装する
type Server struct {
	postUC usecase.PostUsecase
	authUC usecase.AuthUsecase
}

// 新しいServerのインスタンスを作成する
func NewServer(postUC usecase.PostUsecase, authUC usecase.AuthUsecase) api.StrictServerInterface {
	return &Server{
		postUC: postUC,
		authUC: authUC,
	}
}
