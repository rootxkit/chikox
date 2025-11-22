# ---------------------------------------------------
# 1. BUILDER STAGE: Build the Next.js application
# ---------------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# --- ARGUMENTS FOR BUILD (CRITICAL FIX) ---
# Define build arguments that might be required by Next.js during compilation
# Note: You need to pass these variables during docker build using --build-arg
ARG NEXT_PUBLIC_API_URL

# Set environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy configuration files for root, client, and shared packages
COPY package.json package-lock.json ./
COPY apps/client/package.json apps/client/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/types/package.json packages/types/package.json

# Install ALL dependencies (including devDependencies for build)
RUN npm install --include=dev

# Copy all source code into the builder stage
COPY . .

# Build shared packages first (required for client build)
RUN npm run build:packages

# Run the Next.js build command for the client application
RUN npm run build --workspace=apps/client


# ---------------------------------------------------
# 2. RUNNER STAGE: Run the optimized production build
# ---------------------------------------------------
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only necessary runtime dependencies from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY apps/client/package.json apps/client/package.json
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY package.json package-lock.json ./

# Set the correct working directory for running the client application
WORKDIR /app/apps/client

# CRITICAL: Configure runtime environment for the running server (not build)
ENV PORT=3001
# Note: Other runtime ENV variables are usually passed via docker-compose .env
EXPOSE 3001

# The command to start the Next.js server
CMD ["npm", "start"]