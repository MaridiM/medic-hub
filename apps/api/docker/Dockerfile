FROM oven/bun:latest AS base
WORKDIR /backend

FROM base AS deps
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS dev
# ps/openssl нужны для watch и prisma
RUN if [ -f /etc/alpine-release ]; then \
  apk add --no-cache procps psmisc openssl; \
  else \
  apt-get update && apt-get install -y procps psmisc openssl wget ca-certificates && rm -rf /var/lib/apt/lists/*; \
  fi

COPY --from=deps /backend/node_modules ./node_modules
COPY prisma ./prisma
COPY . .

COPY docker/entrypoint.dev.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=development \
  CHOKIDAR_USEPOLLING=true \
  WATCHPACK_POLLING=true \
  PORT=8000

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
# внутри вызовется bunx nest ...
CMD ["bun", "run", "start:dev"]
