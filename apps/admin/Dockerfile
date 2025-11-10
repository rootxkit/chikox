# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps/admin ./apps/admin

# Install dependencies
RUN npm ci

# Build admin
RUN npm run build:admin

# Production stage - use nginx to serve static files
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3002

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
