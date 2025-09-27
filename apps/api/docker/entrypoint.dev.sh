#!/bin/sh
set -e

# Генерируем Prisma, если клиента нет или схема новее
if [ ! -d "node_modules/.prisma/client" ] || [ prisma/schema.prisma -nt node_modules/.prisma/client/index.js ]; then
  echo "=> prisma generate..."
  bunx prisma generate --schema prisma/schema.prisma
fi

exec "$@"