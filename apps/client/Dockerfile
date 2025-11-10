# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps/client ./apps/client

# Install dependencies
RUN npm ci

# Build client
RUN npm run build:client

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/package.json ./apps/client/
COPY --from=builder /app/apps/client/next.config.js ./apps/client/

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production --workspace=apps/client

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start Next.js
CMD ["npm", "run", "start:client"]
