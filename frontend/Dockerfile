# 1. Собираем приложение
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# 2. Финальный имидж
FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
# копируем только нужное из билд-этапа
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN bun install --production --frozen-lockfile

EXPOSE $FRONTEND_PORT
CMD ["bun", "run", "start"]
