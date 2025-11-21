# Base stage for dependencies
FROM node:18-alpine AS base
WORKDIR /app
# Install system dependencies required for Prisma/OpenSSL
RUN apk add --no-cache libc6-compat openssl

# ---------------------------------------------------
# Builder Stage
# ---------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy configuration files
COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/server ./apps/server

# Install dependencies and build
RUN npm ci
RUN npm run db:generate
RUN npm run build:packages
RUN npm run build --workspace=apps/server

# ---------------------------------------------------
# Production Stage
# ---------------------------------------------------
FROM base AS production
WORKDIR /app

# Copy built assets and necessary package files
COPY package*.json ./
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/packages ./packages

# Install only production dependencies
RUN npm ci --production --workspace=apps/server

# Regenerate Prisma Client in production to ensure binary compatibility
COPY packages/database/prisma ./packages/database/prisma
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/server/dist/index.js"]