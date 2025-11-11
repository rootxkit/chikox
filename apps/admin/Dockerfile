# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/admin ./apps/admin

RUN npm ci
RUN npm run build:packages
RUN npm run build --workspace=apps/admin

# Production Stage
FROM nginx:alpine AS production

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
