#!/usr/bin/env bash
set -euo pipefail


# Если есть скрипт ожидания БД и заданы хост/порт — ждём
if [[ -x ./scripts/wait-for-it.sh && -n "${DATABASE_HOST:-}" && -n "${DATABASE_PORT:-}" ]]; then
echo "[entrypoint] wait-for-it ${DATABASE_HOST}:${DATABASE_PORT}"
./scripts/wait-for-it.sh "${DATABASE_HOST}:${DATABASE_PORT}" -t 60
fi


# Применяем миграции, если директория prisma присутствует
if [[ -d ./prisma ]]; then
echo "[entrypoint] prisma migrate deploy"
./node_modules/.bin/prisma migrate deploy
fi


echo "[entrypoint] start app"
node dist/main.js23