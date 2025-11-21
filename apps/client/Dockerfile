# ---------------------------------------------------
# 1. BUILDER STAGE: Build the Next.js application
# This stage installs dependencies and creates the optimized production build.
# ---------------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy configuration files for the root and the client package
COPY package.json package-lock.json ./
COPY apps/client/package.json apps/client/package.json

# Install dependencies (including dev dependencies needed for the build)
RUN npm install

# Copy all source code into the builder stage
COPY . .

# Run the Next.js build command for the client application
RUN npm run build --workspace=apps/client 


# ---------------------------------------------------
# 2. RUNNER STAGE: Run the optimized production build
# This stage is minimal and only contains what is required to run the app.
# ---------------------------------------------------
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only necessary runtime dependencies from the build stage
# 1. Node Modules (for runtime)
COPY --from=builder /app/node_modules ./node_modules
# 2. Client application's build output (.next)
COPY --from=builder /app/apps/client/.next ./apps/client/.next
# 3. Client package.json for starting the application
COPY apps/client/package.json apps/client/package.json

# ******** ეს არის შესწორებული ნაწილი ********
# 4. Public assets are needed at runtime. We copy them from the built stage (/app/apps/client/public).
COPY --from=builder /app/apps/client/public ./apps/client/public
# **********************************************

# 5. Copy root configuration files
COPY package.json package-lock.json ./

# Set the correct working directory for running the client application
WORKDIR /app/apps/client

# CRITICAL: Configure runtime environment
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001

# The command to start the Next.js server
CMD ["npm", "start"]