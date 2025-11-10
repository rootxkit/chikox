# 🚀 Chikox Quick Start Guide

Get up and running with Chikox in 5 minutes!

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm >= 9.0.0

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd chikox
npm install
```

This installs all dependencies for the monorepo, including all apps and packages.

### 2. Set Up Environment Variables

```bash
# Copy environment templates
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
cp packages/database/.env.example packages/database/.env
```

### 3. Configure Database Connection

Edit `packages/database/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/chikox?schema=public"
```

Replace with your PostgreSQL credentials.

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Servers

```bash
npm run dev
```

This starts:
- ✅ API Server at http://localhost:3000
- ✅ Client App at http://localhost:3001
- ✅ Admin App at http://localhost:3002

## 🎉 You're Ready!

### Try These:

1. **API Documentation**
   Visit http://localhost:3000/docs

2. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Register a User**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User"
     }'
   ```

4. **Login**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

5. **Access Client**
   Open http://localhost:3001 in your browser

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific tests
npm run test:server
npm run test:client
```

## 🔍 Code Quality

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 📊 Database Management

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Create a migration
npm run db:migrate

# Reset database (⚠️ deletes all data)
npm run db:push -- --force-reset
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 3002 are in use:

1. Edit `.env` files to change ports
2. Or kill processes using those ports:
   ```bash
   # Find process
   lsof -i :3000

   # Kill process
   kill -9 <PID>
   ```

### Database Connection Error

1. Ensure PostgreSQL is running
2. Verify credentials in `packages/database/.env`
3. Create database if it doesn't exist:
   ```bash
   createdb chikox
   ```

### Module Not Found Errors

```bash
# Clean and reinstall
npm run clean
npm install
```

## 📖 Next Steps

- Read [README.md](./README.md) for complete documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [DELIVERABLES.md](./DELIVERABLES.md) for implementation details

## 💡 Useful Commands

```bash
# Development
npm run dev                 # Start all apps
npm run dev:server          # Start API only
npm run dev:client          # Start client only

# Build
npm run build               # Build all apps
npm run build:server        # Build API only

# Production
npm run start:server        # Start production API
npm run start:client        # Start production client

# Database
npm run db:generate         # Generate Prisma client
npm run db:push             # Push schema
npm run db:migrate          # Run migrations
npm run db:studio           # Open Prisma Studio

# Testing
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:server         # Server tests
npm run test:client         # Client tests

# Code Quality
npm run lint                # Check linting
npm run lint:fix            # Fix linting
npm run format              # Format code
npm run format:check        # Check formatting
npm run type-check          # TypeScript check

# Cleanup
npm run clean               # Remove all build artifacts
```

## 🎯 What to Build Next

- [ ] Add more API endpoints
- [ ] Implement user profile management
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add file upload functionality
- [ ] Create admin dashboard features
- [ ] Add real-time features (WebSocket)
- [ ] Implement caching (Redis)
- [ ] Add rate limiting
- [ ] Deploy to production!

---

Happy coding! 🎉
