# Chikox - Full-Stack TypeScript Monorepo

A production-ready full-stack application built with Fastify, Next.js, Prisma, and TypeScript in a monorepo structure.

## 🏗️ Monorepo Structure

```
chikox/
├── apps/
│   ├── server/          # Fastify API server
│   ├── client/          # Next.js client application
│   └── admin/           # Next.js admin dashboard
├── packages/
│   ├── database/        # Prisma client and schema
│   ├── types/           # Shared TypeScript types
│   └── ui-common/       # Shared UI components
├── package.json         # Root workspace configuration
└── tsconfig.json        # Base TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd chikox
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Server
   cp apps/server/.env.example apps/server/.env

   # Client
   cp apps/client/.env.example apps/client/.env

   # Database
   cp packages/database/.env.example packages/database/.env
   ```

3. **Configure your database connection in `packages/database/.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chikox"
   ```

4. **Generate Prisma client and push schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - API Server: http://localhost:3001
   - Client: http://localhost:3000
   - Admin: http://localhost:3002

## 📦 Available Scripts

### Development
- `npm run dev` - Start all apps in development mode
- `npm run dev:server` - Start only the API server
- `npm run dev:client` - Start only the client app
- `npm run dev:admin` - Start only the admin app

### Build
- `npm run build` - Build all apps
- `npm run build:server` - Build API server
- `npm run build:client` - Build client app
- `npm run build:admin` - Build admin app

### Production
- `npm run start:server` - Start production API server
- `npm run start:client` - Start production client
- `npm run start:admin` - Start production admin

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:server` - Run server tests only
- `npm run test:client` - Run client tests only

### Code Quality
- `npm run lint` - Lint all TypeScript files
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting
- `npm run type-check` - Type check all apps

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

## 🔐 Authentication Flow

### JWT with HttpOnly Cookies

The authentication system uses a dual-token approach:

1. **Access Token (Short-lived, 15 minutes)**
   - Sent in response body
   - Stored in memory/localStorage on client
   - Used for API authentication via Authorization header
   - Format: `Authorization: Bearer <access_token>`

2. **Refresh Token (Long-lived, 7 days)**
   - Stored as HttpOnly cookie (secure, not accessible via JavaScript)
   - Used to obtain new access tokens
   - Automatically sent with requests to `/api/auth/*`

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Protected Routes

Protected routes require authentication:

```typescript
// Server-side middleware
server.get('/api/users/me', {
  onRequest: [authenticate]
}, async (request, reply) => {
  const user = request.user; // JWTPayload
  // ...
});
```

### Role-Based Authorization

```typescript
// Admin-only route
server.get('/api/users', {
  onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')]
}, async (request, reply) => {
  // Only ADMIN and SUPER_ADMIN can access
});
```

## 📚 API Documentation (Swagger)

Once the server is running, access the interactive API documentation at:

**http://localhost:3001/docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

### Example Route with Swagger Schema

```typescript
server.post('/api/auth/login', {
  schema: {
    description: 'Login with email and password',
    tags: ['Authentication'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: { /* ... */ },
              accessToken: { type: 'string' }
            }
          }
        }
      }
    }
  }
}, handlerFunction);
```

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  sessions      Session[]
}
```

### Session Model

```prisma
model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  userAgent    String?
  ipAddress    String?
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### User Roles

```prisma
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}
```

## 🧪 Testing

### Server Tests (Vitest)

```typescript
// apps/server/src/routes/__tests__/auth.test.ts
import { describe, it, expect } from 'vitest';

describe('Auth Routes', () => {
  it('should validate email format', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'invalid', password: 'password123' }
    });

    expect(response.statusCode).toBe(400);
  });
});
```

### Client Tests (Vitest + React Testing Library)

```typescript
// apps/client/src/__tests__/page.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('should render login form', () => {
    render(<Home />);
    expect(screen.getByText('Chikox Login')).toBeDefined();
  });
});
```

## 🏢 Architecture Highlights

### Type Safety Across the Stack

Shared types package ensures type consistency:

```typescript
// packages/types/src/index.ts
export interface LoginRequest {
  email: string;
  password: string;
}

// Used in server
import type { LoginRequest } from '@chikox/types';

// Used in client
import type { LoginRequest } from '@chikox/types';
```

### Singleton Prisma Client

```typescript
// packages/database/src/index.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

### Password Security

- Passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Verified securely on login

### JWT Security

- Access tokens short-lived (15 minutes)
- Refresh tokens stored as HttpOnly cookies
- Secure in production (HTTPS only)
- SameSite strict policy

## 🔧 Configuration

### Server Environment Variables

```env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
COOKIE_SECRET=your-secret
```

### Client Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Code Quality

### ESLint Configuration

- TypeScript-aware linting
- Prettier integration
- Consistent code style enforcement

### Prettier Configuration

- Single quotes
- 2-space indentation
- 100 character line width
- Trailing commas: none

## 🚢 Deployment

### Server Deployment

1. Build the server:
   ```bash
   npm run build:server
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm run start:server
   ```

### Client Deployment

1. Build the client:
   ```bash
   npm run build:client
   ```

2. Start the client:
   ```bash
   npm run start:client
   ```

### Database Migrations

For production deployments, use migrations instead of `db:push`:

```bash
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT

## 🆘 Support

For issues and questions, please open an issue on GitHub.
