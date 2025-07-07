FROM golang:1.24-alpine AS dev
WORKDIR /app

# 開発用ホットリロードツールをインストール
RUN go install github.com/air-verse/air@latest

# キャッシュを利用して依存関係をダウンロード
COPY go.* ./
RUN go mod download -x

COPY . .

CMD ["air", "-c", ".air.toml"]

FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server/main.go

# distrolessイメージ デバックsh不要なら`:nonroot`を使う
FROM gcr.io/distroless/static-debian12:debug-nonroot AS prod
WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/server ./server

ENTRYPOINT ["./server"]
