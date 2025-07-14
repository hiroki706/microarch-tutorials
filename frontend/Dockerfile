# 1. deps: lockファイルから依存関係をインストール
FROM node:24-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

# 2. build: アプリケーションをビルド
FROM deps AS builder
WORKDIR /app

COPY . .

RUN pnpm install --offline --frozen-lockfile
CMD [ "pnpm", "build" ]

# 3. runner: 最小イメージでアプリケーションを実行
FROM gcr.io/distroless/node24:nonroot AS prod
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
EXPOSE 3000
CMD [ "server.js" ]
