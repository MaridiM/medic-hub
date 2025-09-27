#!/bin/sh
set -e

echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT}…"
/wait-for-it.sh "${DB_HOST}:${DB_PORT}" --timeout=30 --strict -- echo "Postgres is up."

# optionally wait for Redis too
# echo "Waiting for Redis at ${REDIS_HOST}:${REDIS_PORT}…"
# /wait-for-it.sh "${REDIS_HOST}:${REDIS_PORT}" --timeout=30 --strict -- echo "Redis is up."

exec "$@"
