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


FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Standalone files copy karein (Next.js focus)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]