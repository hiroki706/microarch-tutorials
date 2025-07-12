# 1. deps: lockファイルから依存関係をインストール
FROM node:24-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

# 2. build: アプリケーションをビルド
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /root/.local/share/pnpm/store/v10 /root/.local/share/pnpm/store/v10
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm install --offline --frozen-lockfile
CMD [ "pnpm", "build" ]

# 3. runner: 最小イメージでアプリケーションを実行
FROM gcr.io/distroless/node24:nonroot
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD [ "server.js" ]
