# ---------------------------------------------------
# 1. BUILDER STAGE: Build the Next.js application
# ---------------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files (including monorepo root package.json)
COPY package.json package-lock.json ./
COPY packages/client/package.json packages/client/package.json

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy all source code
COPY . .

# Run the Next.js build command
# The Next.js app is located in /apps/client
RUN npm run build --workspace=packages/client 


# ---------------------------------------------------
# 2. RUNNER STAGE: Run the optimized production build
# ---------------------------------------------------
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only necessary runtime dependencies from the build stage
# 1. Node Modules (for runtime)
COPY --from=builder /app/node_modules ./node_modules
# 2. Client application's build output and source files
COPY --from=builder /app/packages/client/.next ./packages/client/.next
COPY packages/client/package.json packages/client/package.json
COPY packages/client/public packages/client/public
COPY package.json package-lock.json ./

# Set the correct working directory for running the client
WORKDIR /app/packages/client

# CRITICAL: Ensure the Next.js app listens on port 3001
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001

# The command to start the Next.js server
CMD ["npm", "start"]