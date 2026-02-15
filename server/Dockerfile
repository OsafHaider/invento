# -------------------------
# Stage 1: Builder
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm (better than npm install -g)
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Build TypeScript
RUN pnpm build


# -------------------------
# Stage 2: Production
# -------------------------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Only production deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built files only
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.js"]
