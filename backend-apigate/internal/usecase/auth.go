package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/hiroki706/microarch-tutorials/backend-apigate/api"
	"github.com/hiroki706/microarch-tutorials/backend-apigate/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// 認証関連のビジネスロジックを定義するインターフェース
type AuthUsecase interface {
	RegisterUser(ctx context.Context, req api.UserRegisterRequest) error
	LoginUser(ctx context.Context, req api.UserLoginRequest) (*api.TokenPair, error)
	RefreshToken(ctx context.Context, req api.RefreshTokenRequest) (*api.TokenPair, error)
}

// TokenValidator はトークンの検証を行うインターフェースです。
type TokenValidator interface {
	Validate(tokenstr string) (uuid.UUID, error)
}

type authUsecase struct {
	userRepo        repository.UserRepository
	jwtSecret       []byte        // JWTの署名に使用するシークレットキー
	accessTokenTTL  time.Duration // アクセストークンの有効期限
	refreshTokenTTL time.Duration // リフレッシュトークンの有効期限
}

// NewAuthUsecase は AuthUsecase の新しいインスタンスを返します。
func NewAuthUsecase(userRepo repository.UserRepository, secret string) authUsecase {
	return authUsecase{
		userRepo:        userRepo,
		jwtSecret:       []byte(secret),
		accessTokenTTL:  15 * time.Minute,   // アクセストークンの有効期限
		refreshTokenTTL: 7 * 24 * time.Hour, // リフレッシュトークンの有効期限
	}
}

// RegisterUser は新しいユーザーを登録します。
func (u authUsecase) RegisterUser(ctx context.Context, req api.UserRegisterRequest) error {
	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Emailの重複チェック
	existingUser, _ := u.userRepo.FindByEmail(ctx, req.Email)
	if existingUser != nil {
		return errors.New("email already exists")
	}

	// ユーザーモデルを作成
	user := repository.User{
		ID:           uuid.New(),
		Username:     req.Username,
		PasswordHash: string(hashedPassword),
		Email:        req.Email,
	}

	return u.userRepo.Save(ctx, user)
}

// LoginUser はユーザーのログインを処理し、アクセストークンとリフレッシュトークンを返します。
func (u authUsecase) LoginUser(ctx context.Context, req api.UserLoginRequest) (*api.TokenPair, error) {
	// ユーザーをリポジトリから取得
	user, err := u.userRepo.FindByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil, errors.New("invalid credentials")
	}

	// パスワードを検証
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		// パスワードの詳細なエラーメッセージはセキュリティ上の理由で返さない
		return nil, errors.New("invalid credentials")
	}

	// アクセストークンを生成
	accessToken, err := u.generateToken(user.ID, u.accessTokenTTL)
	if err != nil {
		return nil, err
	}

	// リフレッシュトークンを生成
	refreshToken, err := u.generateToken(user.ID, u.refreshTokenTTL)
	if err != nil {
		return nil, err
	}
	// トークンペアを返す
	return &api.TokenPair{
		AccessToken:  &accessToken,
		RefreshToken: &refreshToken,
	}, nil
}

// RefreshToken はリフレッシュトークンを使用して新しいアクセストークンとリフレッシュトークンを生成します。
func (u authUsecase) RefreshToken(ctx context.Context, req api.RefreshTokenRequest) (*api.TokenPair, error) {
	userID, err := u.Validate(req.RefreshToken)
	if err != nil {
		return nil, errors.New("invalid user ID in token")
	}
	// ユーザーをリポジトリから取得
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return nil, errors.New("user not found")
	}
	// 新しいアクセストークンを生成
	accessToken, err := u.generateToken(user.ID, u.accessTokenTTL)
	if err != nil {
		return nil, err
	}
	return &api.TokenPair{
		AccessToken:  &accessToken,
		RefreshToken: &req.RefreshToken, // リフレッシュトークンはそのまま返す
	}, nil
}

func (u *authUsecase) Validate(tokenstr string) (uuid.UUID, error) {
	token, err := jwt.Parse(tokenstr, func(token *jwt.Token) (interface{}, error) { return u.jwtSecret, nil })
	if err != nil || !token.Valid {
		return uuid.Nil, errors.New("invalid token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.Nil, errors.New("invalid token claims")
	}
	userIDStr, ok := claims["sub"].(string)
	if !ok {
		return uuid.Nil, errors.New("invalid user ID in token")
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.Nil, errors.New("invalid user ID format in token")
	}
	return userID, nil
}

// generateToken はJWTトークンを生成するヘルパー関数
func (u *authUsecase) generateToken(userID uuid.UUID, ttl time.Duration) (string, error) {
	// JWTのクレームには好きな情報を含めることができます。
	// ここでは、ユーザーIDとトークンの有効期限を含めます。
	claims := jwt.MapClaims{
		"sub": userID.String(),            // Subject/識別情報
		"exp": time.Now().Add(ttl).Unix(), // トークンの有効期限
	}
	// JWTトークンを共通鍵暗号化方式で生成します。
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(u.jwtSecret)
}
