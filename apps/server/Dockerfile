# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/server ./apps/server

RUN npm ci
RUN npm run db:generate
RUN npm run build:packages
RUN npm run build --workspace=apps/server

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/packages ./packages
COPY package*.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN npm ci --production --workspace=apps/server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/server/dist/index.js"]
