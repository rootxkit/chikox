# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/client ./apps/client

RUN npm ci
RUN npm run build:client

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/package.json ./apps/client/
COPY --from=builder /app/apps/client/next.config.js ./apps/client/
COPY package*.json ./

RUN npm ci --production --workspace=apps/client

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "run", "start:client"]
