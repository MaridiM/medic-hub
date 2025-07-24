# 1. deps
FROM oven/bun:latest AS deps
WORKDIR /frontend
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# 2. runner
FROM oven/bun:latest AS dev
WORKDIR /frontend
COPY --from=deps /frontend/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "dev"]
