# ====== СБОРОЧНЫЙ ЭТАП ====== 
FROM oven/bun:latest AS builder

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Установка зависимостей
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Копируем схему Prisma отдельно (чтобы cache работал)
COPY prisma ./prisma
RUN bunx prisma generate

# Копирование и сборка приложения
COPY . .
RUN bun run build

# ====== ПРОДАКШЕН ЭТАП ====== 
FROM oven/bun:latest
WORKDIR /app

# Установка системных зависимостей для production
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV BUN_ENV=production

# Копируем зависимости и сборку
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/bun.lock /app/bun.lock
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

# Копируем скрипты (включая миграции)
COPY --from=builder /app/scripts /app/scripts  # Добавлено копирование скриптов
RUN chmod +x /app/scripts/*.sh  # Делаем скрипты исполняемыми

# Оптимизация для production
RUN bun install --production --frozen-lockfile

# Настройки здоровья приложения
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:$BACKEND_PORT/api/health || exit 1

EXPOSE $BACKEND_PORT
CMD ["bun", "run", "start:prod"]