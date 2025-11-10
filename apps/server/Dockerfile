# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps/server ./apps/server

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npm run db:generate

# Build packages first (database and types)
RUN npm run build:packages

# Build server
RUN npm run build --workspace=apps/server

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built server
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/

# Copy packages
COPY --from=builder /app/packages ./packages

# Install production dependencies only
RUN npm ci --production --workspace=apps/server

# Generate Prisma client for production
RUN npm run db:generate

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "apps/server/dist/index.js"]
