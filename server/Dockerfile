FROM node:20-alpine AS builder

# Alpine ke liye zaroori libraries
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Corepack ke bajaye direct pnpm install karein (Fast & Reliable)
RUN npm install -g pnpm

# Files copy karein
COPY package.json pnpm-lock.yaml ./

# Dependencies install karein
RUN pnpm install --frozen-lockfile

COPY . .

# Build run karein
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
