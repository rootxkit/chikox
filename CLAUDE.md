# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chikox is a full-stack TypeScript monorepo with:

- **Backend**: Fastify API server with JWT authentication
- **Frontend**: Next.js client app and React + Vite admin dashboard
- **Database**: PostgreSQL via Prisma ORM
- **Shared packages**: Database client, TypeScript types, and UI components

## Development Commands

### Starting Development

```bash
npm run dev                  # Start all apps (server:3000, client:3001, admin:3002)
npm run dev:server           # Start API server only (port 3000)
npm run dev:client           # Start client app only (port 3001)
npm run dev:admin            # Start admin dashboard only (port 3002)
```

### Building

**IMPORTANT**: The build process automatically builds shared packages first.

```bash
npm run build                # Build packages, then all apps
npm run build:packages       # Build shared packages only (database + types)
npm run build:server         # Build packages + server (TypeScript compilation)
npm run build:client         # Build packages + Next.js client
npm run build:admin          # Build packages + React admin (Vite)
```

The `build:packages` script runs:

1. `npm run db:generate` - Generate Prisma client
2. Build `@chikox/database` package
3. Build `@chikox/types` package

### Testing

```bash
npm test                     # Run all tests across workspaces
npm run test:watch           # Watch mode for all tests
npm run test:server          # Server tests only
npm run test:client          # Client tests only
npm run test:admin           # Admin tests only
```

### Database Operations

```bash
npm run db:generate          # Generate Prisma client (required after schema changes)
npm run db:push              # Push schema changes to database (development)
npm run db:migrate           # Create and run migrations (production)
npm run db:studio            # Open Prisma Studio visual database editor
```

### Code Quality

```bash
npm run lint                 # Lint all TypeScript files
npm run lint:fix             # Auto-fix linting issues
npm run format               # Format with Prettier
npm run format:check         # Check formatting
npm run type-check           # Run TypeScript compiler checks
npm run clean                # Remove all build artifacts and node_modules
```

## Architecture

### Monorepo Structure

- `apps/server/` - Fastify API (port 3000)
- `apps/client/` - Next.js client app (port 3001)
- `apps/admin/` - React + Vite admin dashboard (port 3002)
- `packages/database/` - Prisma client and schema
- `packages/types/` - Shared TypeScript interfaces and DTOs

**API Versioning**: All server routes are prefixed with `/api/v1/`

- Auth endpoints: `/api/v1/auth/*`
- User endpoints: `/api/v1/users/*`

### Authentication Flow

The system uses **dual-token JWT authentication**:

1. **Access Token** (short-lived, 15 minutes)
   - Returned in response body on login
   - Stored in localStorage on client
   - Sent via `Authorization: Bearer <token>` header
   - Contains: userId, email, role

2. **Refresh Token** (long-lived, 7 days)
   - Stored as HttpOnly, Secure, SameSite=strict cookie
   - Used to obtain new access tokens
   - Not accessible via JavaScript (XSS protection)

### Server Architecture (Fastify)

**Entry Point**: `apps/server/src/index.ts`

- Registers plugins (CORS, Cookie, JWT, Swagger)
- Registers routes with `/api/v1` prefix (versioned API)
- Error handling via `errorHandler`
- Swagger documentation at `http://localhost:3000/docs`

**Route Structure**:

- `apps/server/src/routes/auth.routes.ts` - Authentication endpoints (registered at `/api/v1/auth`)
- `apps/server/src/routes/user.routes.ts` - User management endpoints (registered at `/api/v1/users`)

**Health Check**: `GET /health` returns server status and timestamp

**Middleware**:

- `authenticate` - Verifies JWT token from Authorization header
- `authorize(...roles)` - Checks user role permissions

**Protected Route Pattern**:

```typescript
server.get(
  '/api/v1/users',
  {
    onRequest: [authenticate, authorize('ADMIN')]
  },
  handlerFunction
);
```

### Client App Architecture (Next.js)

**Tech Stack**:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Context API for state management

**Context Providers** (in `apps/client/src/context/`):
- `AuthContext` - User authentication state
- `LanguageContext` - i18n translations (English/Georgian)
- `ThemeContext` - Theme management (light/dark, defaults to light)

**Key Components** (in `apps/client/src/components/`):
- `Navbar` - Responsive navigation with burger menu for mobile (hidden on md+ breakpoint)
- `Footer` - Site footer with translations
- `Section` - Reusable section wrapper with background/padding variants
- `ThemeToggle` - Dark/light mode switcher
- `LanguageSwitcher` - EN/GE language toggle

**Adding Translations**:
1. Add keys to both `en` and `ge` objects in `apps/client/src/context/LanguageContext.tsx`
2. Use `const { t } = useLanguage()` hook in components
3. Call `t('key.name')` to get translated string

**Mobile Menu**: When burger menu is open, body scroll is disabled and the menu covers full viewport height.

### Admin Dashboard (React + Vite)

**Tech Stack**:

- React 18 with TypeScript
- Vite for build tooling
- Ant Design UI component library
- React Router for routing
- Axios for API calls
- SWR for data fetching/caching
- Nginx for static file serving in production (Docker)

**Key Files**:

- `apps/admin/src/App.tsx` - Route definitions
- `apps/admin/src/lib/api.ts` - API client with interceptors
- `apps/admin/src/hooks/useAuth.ts` - Authentication hook
- `apps/admin/src/hooks/useUsers.ts` - User data fetching
- `apps/admin/nginx.conf` - Nginx configuration for production

**API Client**: All API calls go through axios instance in `api.ts` which:

- Automatically attaches access token to requests
- Handles 401 responses by redirecting to login
- Uses `withCredentials: true` for cookies

**Production Build**: The admin dashboard builds to static files (`dist/`) and is served via Nginx in Docker

### Database (Prisma + PostgreSQL)

**Schema Location**: `packages/database/prisma/schema.prisma`

**Models**:

- `User` - User accounts with email, passwordHash (bcrypt), name, role, timestamps
- `Session` - Refresh token sessions with userId foreign key, expiresAt, userAgent, ipAddress
- `UserRole` enum - USER, ADMIN, SUPER_ADMIN

**Prisma Client**: Singleton instance exported from `packages/database/src/index.ts`

**Important**: After any schema changes, always run `npm run db:generate` to regenerate the Prisma client.

### Shared Types Package

**Location**: `packages/types/src/index.ts`

Contains interfaces used by both server and client:

- `LoginRequest`, `RegisterRequest` - Auth DTOs
- `AuthResponse` - Login/register response
- `UserDTO` - User data transfer object (role field is `string` type)
- `JWTPayload` - JWT token payload structure (role field is `string` type)
- `ApiResponse<T>` - Standard API response wrapper

**Important**: The `role` field in `UserDTO` and `JWTPayload` uses `string` type instead of `UserRole` enum to avoid type conflicts with Prisma's generated `UserRole` type. At runtime, values are still `'USER' | 'ADMIN' | 'SUPER_ADMIN'`.

**Usage**: Import as `import type { LoginRequest } from '@chikox/types';`

## Key Implementation Details

### Password Security

- Passwords hashed with bcrypt (10 rounds) in `apps/server/src/utils/auth.ts:10`
- Never stored in plain text
- Verified with `verifyPassword()` function

### JWT Token Generation

- Access tokens: 15 minutes expiry
- Refresh tokens: 7 days expiry
- Generated via `generateTokens()` in `apps/server/src/utils/auth.ts:24`
- Refresh token set as HttpOnly cookie in `apps/server/src/utils/auth.ts:43`

### Error Handling

- Centralized error handler in `apps/server/src/utils/error-handler.ts`
- Standard response format: `{ success: boolean, data?: T, error?: { message, code } }`
- Validation errors returned as 400 Bad Request
- Auth errors as 401 Unauthorized
- Permission errors as 403 Forbidden

### API Documentation

- Swagger/OpenAPI available at `http://localhost:3000/docs`
- Route schemas defined inline with Fastify route definitions
- Documents all endpoints, request/response schemas, and authentication requirements

## Testing Strategy

### Server Tests (Vitest)

- Located in `apps/server/src/routes/__tests__/`
- Test route handlers with `server.inject()` for HTTP simulation
- Test authentication and authorization middleware
- Test validation and error handling

### Client Tests (Vitest + React Testing Library)

- Located in `apps/client/src/__tests__/`
- Component tests for Navbar, Footer, Section, ThemeToggle, LanguageSwitcher
- Page tests for Login, Register, Home
- Test setup in `apps/client/src/__tests__/setup.ts`
- **Note**: When testing components that appear in both desktop and mobile (like LanguageSwitcher in Navbar), use `getAllByText()` instead of `getByText()` to handle multiple instances

### Admin Tests (Vitest + React Testing Library)

- Located in `apps/admin/src/__tests__/`
- Component rendering tests
- User interaction tests with `@testing-library/user-event`
- API mocking for integration tests
- Test setup in `apps/admin/src/__tests__/setup.ts`

### Running Single Test File

```bash
# In workspace directory
cd apps/server && npx vitest run src/routes/__tests__/auth.test.ts
cd apps/admin && npx vitest run src/__tests__/Login.test.tsx
cd apps/client && npx vitest run src/__tests__/Login.test.tsx

# Or from root with workspace flag
npx vitest run apps/server/src/routes/__tests__/auth.test.ts
npx vitest run apps/admin/src/__tests__/Login.test.tsx
```

**Note**: Admin tests use React Testing Library with jsdom environment. Run with UI for debugging:

```bash
npm run test:ui --workspace=apps/admin
```

## Environment Variables

### Server (`apps/server/.env`)

```
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
COOKIE_SECRET=your-secret
```

### Client (`apps/client/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Note**: The client app includes ThemeContext (dark mode) and LanguageContext (internationalization) providers in `apps/client/src/context/`.

### Admin (`apps/admin/.env`)

```
VITE_API_URL=http://localhost:3000
```

### Database (`packages/database/.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/chikox
```

## Common Workflows

### Adding a New API Endpoint

1. Define route in appropriate file under `apps/server/src/routes/`
2. Add Swagger schema for documentation
3. Use shared types from `@chikox/types`
4. Apply middleware (`authenticate`, `authorize`) as needed
5. Write tests in `__tests__` directory

### Adding a New Shared Type

1. Add interface to `packages/types/src/index.ts`
2. Export the type
3. Use in both server and client: `import type { YourType } from '@chikox/types';`

### Modifying Database Schema

1. Edit `packages/database/prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)
4. Update affected TypeScript types if needed

### Adding Client Page/Feature

1. Create page in `apps/client/src/app/[route]/page.tsx`
2. Add translation keys to `LanguageContext.tsx` (both `en` and `ge` objects)
3. Create components in `apps/client/src/components/`
4. Write tests in `apps/client/src/__tests__/`
5. Update Navbar `navLinks` array if navigation link needed

### Adding Admin Dashboard Feature

1. Create page component in `apps/admin/src/pages/`
2. Add route in `apps/admin/src/App.tsx`
3. Create API functions in `apps/admin/src/lib/api.ts`
4. Add SWR hook in `apps/admin/src/hooks/` if needed
5. Write tests in `__tests__` directory

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

**Workflow**: `.github/workflows/ci-cd.yml`

**Pipeline Stages**:

1. **Install** - Install dependencies and cache `node_modules`
2. **Lint** - ESLint and Prettier checks
3. **Type Check** - TypeScript compilation checks (builds packages first)
4. **Test** - Run all test suites (builds packages first)
5. **Build** - Build all applications (builds packages first)
6. **Deploy** - Docker Compose deployment to production (on push to main)

**Key Points**:

- **CRITICAL**: `npm run build:packages` MUST run before type-check, lint, and test. Without this, shared packages won't be available and builds will fail.
- CI uses Node.js 20.x
- Shared packages (`@chikox/database`, `@chikox/types`) are built in the quality-check job before any checks
- All quality checks must pass before Docker images are built
- Uses GitHub Actions cache (v4) for faster builds
- Requires secrets: `PROD_SERVER_HOST`, `PROD_SERVER_USERNAME`, `PROD_SERVER_SSH_KEY`, `PROD_SERVER_PORT` (optional, defaults to 22), `CR_PAT` (GitHub Container Registry token), `NEXT_PUBLIC_API_URL` (optional, for client build)

**Deployment Methods**:

- Docker Compose (recommended) - See `DOCKER_COMPOSE_DEPLOYMENT.md`
- SSH deployment - See `SSH_DEPLOYMENT_SETUP.md`

**Deploy Script**: The CI/CD pipeline uses `docker-compose` commands to:

1. Pull latest code from git
2. Stop and remove existing containers
3. Build fresh images with `--no-cache`
4. Start all services in detached mode
5. Run database migrations inside server container
6. Clean up unused Docker resources

## Important Notes

- **Admin Dashboard**: Recently refactored from Next.js to React + Vite for better performance and simpler architecture. In Docker, admin serves static files via Nginx.
- **Client i18n**: Client supports English and Georgian (GE) translations via LanguageContext. Theme defaults to light mode (not system).
- **Workspace Dependencies**: Internal packages referenced with `"*"` in package.json (e.g., `"@chikox/types": "*"`)
- **Type Safety**: All shared types must be defined in `@chikox/types` package
- **Database Client**: Always import Prisma client from `@chikox/database`, never instantiate directly
- **Test Framework**: All apps use Vitest (not Jest)
- **Server Module System**: Server uses ES modules (`"type": "module"` in package.json). All import statements must include `.js` extension.
- **Build Order**: Always build shared packages before apps using `npm run build:packages`
- **Docker Builds**:
  - Admin: Multi-stage build with Nginx for static file serving
  - Client: Builds shared packages first, then Next.js. Requires `npm install --include=dev` to have TypeScript available.
  - Server: Node.js runtime
  - All Dockerfiles must copy shared package definitions and build them before building the app

## Docker Deployment

### Prerequisites

**Important**: Docker must be installed on your system:

- **Windows/Mac**: Install Docker Desktop
- **Linux**: Install Docker Engine + Docker Compose plugin
- **WSL2**: Use Docker Desktop with WSL2 integration enabled

### Local Docker Deployment

```bash
# Build and start all services (database, server, client, admin)
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

**Services**:

- `database` - PostgreSQL 15 (port 5432)
- `server` - Fastify API (port 3000)
- `client` - Next.js (port 3001)
- `admin` - React + Nginx (port 3002)

**Important Notes**:

- The server waits for database health check before starting
- Database data persists in Docker volume `postgres_data`
- All services communicate via `chikox-network` bridge network
- Environment variables can be overridden with `.env` file or shell exports

### Production Docker Deployment

For production, set these environment variables:

```bash
export JWT_ACCESS_SECRET="strong-random-secret"
export JWT_REFRESH_SECRET="another-strong-secret"
export COOKIE_SECRET="cookie-signing-secret"
```

Then deploy:

```bash
docker compose -f docker-compose.yml up -d --build
```

### Running Database Migrations in Docker

```bash
# After containers are running
docker compose exec server npx prisma migrate deploy
```

## Troubleshooting

### Docker Not Found

If you see `docker: command not found` or `docker-compose: command not found`:

1. **Check if Docker is installed**: `docker --version`
2. **WSL2 users**: Ensure Docker Desktop has WSL2 integration enabled
3. **Linux users**: Install Docker Engine and Docker Compose plugin
4. **Try newer syntax**: Use `docker compose` instead of `docker-compose`

### Database Package Build Issues

The `@chikox/database` package must be built before the server can run. If you see errors like:

```
Error: Cannot find package '/home/.../node_modules/@chikox/database/dist/index.js'
```

**Solution**: The database package uses a standalone TypeScript configuration (doesn't extend the parent tsconfig which has `noEmit: true`). Build the package:

```bash
cd packages/database && npm run build
```

### Prisma Client Type Errors

If you see errors like `SyntaxError: The requested module '@prisma/client' does not provide an export named 'UserRole'` or `Cannot find module '@chikox/database'`:

**Solution**: Regenerate and build the Prisma client:

```bash
npm run db:generate
npm run build:packages
```

### Docker Build: TypeScript Not Found

If Docker build fails with `sh: tsc: not found` when building shared packages:

**Solution**: Install ALL dependencies including devDependencies in the builder stage:

```dockerfile
# Wrong - skips devDependencies
RUN npm install

# Correct - includes TypeScript and other build tools
RUN npm install --include=dev
```

### Initial Setup Checklist

After cloning the repository:

1. `npm install` - Install all dependencies
2. Copy environment files:
   ```bash
   cp apps/server/.env.example apps/server/.env
   cp apps/client/.env.example apps/client/.env
   cp apps/admin/.env.example apps/admin/.env
   cp packages/database/.env.example packages/database/.env
   ```
3. Configure `packages/database/.env` with your PostgreSQL connection string
4. `npm run db:generate` - Generate Prisma client
5. `npm run db:push` - Push schema to database
6. `npm run build:packages` - Build shared packages (database + types)
7. `npm run dev` - Start all apps

**Note**: The `build:packages` step is crucial as it builds the `@chikox/database` and `@chikox/types` packages that other apps depend on.
