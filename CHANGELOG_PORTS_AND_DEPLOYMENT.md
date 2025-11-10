# Changes Summary: Ports & CI/CD Configuration

## Date: 2025-11-10

## Changes Made

### 🔌 Port Configuration Changes

The application ports have been updated as follows:

| Application              | Old Port | New Port             |
| ------------------------ | -------- | -------------------- |
| **Server** (Fastify API) | 3001     | **3000** ✅          |
| **Client** (Next.js)     | 3000     | **3001** ✅          |
| **Admin** (React + Vite) | 3002     | **3002** (unchanged) |

### 📦 Files Updated

#### Configuration Files

- ✅ `apps/server/.env.example` - Updated PORT to 3000 and CORS_ORIGIN
- ✅ `apps/client/.env.example` - Updated NEXT_PUBLIC_API_URL to localhost:3000
- ✅ `apps/client/package.json` - Added port 3001 to dev and start scripts
- ✅ `apps/server/Dockerfile` - Updated EXPOSE to 3000
- ✅ `apps/client/Dockerfile` - Updated EXPOSE to 3001
- ✅ `docker-compose.yml` - Updated all port mappings
- ✅ `apps/admin/nginx.conf` - Already configured for port 3002

#### Documentation Files

- ✅ `README.md` - Updated all port references
- ✅ `CLAUDE.md` - Updated architecture and commands
- ✅ `ARCHITECTURE.md` - Updated architecture diagrams
- ✅ `QUICKSTART.md` - Updated all commands and URLs
- ✅ `DELIVERABLES.md` - Updated environment examples
- ✅ `DEPLOYMENT.md` - Updated deployment instructions and added port section

### 🚀 CI/CD Configuration

#### GitHub Actions Workflow

- ✅ **Node.js Version**: Updated to 24.x (latest LTS)
- ✅ **SSH Deployment**: Enabled and configured (Option 5)
- ✅ **Deployment Path**: `/var/www/chikox`
- ✅ **PM2 Integration**: Automatic restart of all services

#### Workflow Stages

1. **Install** - Dependencies with caching
2. **Lint** - ESLint and Prettier checks
3. **Type Check** - TypeScript validation
4. **Test** - Vitest tests for all apps
5. **Build** - Build artifacts with upload
6. **Deploy** - SSH deployment to production server

### 📝 New Files Created

1. **`.github/workflows/ci-cd.yml`**
   - Complete CI/CD pipeline
   - SSH deployment enabled
   - Runs on push to main/master

2. **`SSH_DEPLOYMENT_SETUP.md`**
   - Complete guide for setting up SSH deployment
   - Server preparation instructions
   - GitHub secrets configuration
   - Troubleshooting tips

3. **`DEPLOYMENT.md`**
   - Comprehensive deployment guide
   - Multiple platform options
   - Docker deployment instructions
   - Environment configuration

4. **Docker Files**
   - `apps/server/Dockerfile`
   - `apps/client/Dockerfile`
   - `apps/admin/Dockerfile`
   - `apps/admin/nginx.conf`
   - `docker-compose.yml`
   - `.dockerignore`

## 🎯 Next Steps

### 1. Update Your Local Environment

```bash
# Update environment files with new ports
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env

# Edit the files if needed
nano apps/server/.env
nano apps/client/.env
```

### 2. Test Locally

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Access applications:
# - Server: http://localhost:3000
# - Client: http://localhost:3001
# - Admin: http://localhost:3002
```

### 3. Set Up SSH Deployment

Follow the comprehensive guide in **`SSH_DEPLOYMENT_SETUP.md`**

**Quick Setup:**

1. Prepare your production server
2. Generate SSH keys for GitHub Actions
3. Add GitHub secrets:
   - `PROD_SERVER_HOST`
   - `PROD_SERVER_USERNAME`
   - `PROD_SERVER_SSH_KEY`
   - `PROD_SERVER_PORT` (optional)
4. Push to main branch

### 4. Test Deployment

```bash
# Commit and push changes
git add .
git commit -m "Update ports and enable CI/CD"
git push origin main

# Monitor deployment in GitHub Actions
# Go to: https://github.com/rootxkit/chikox/actions
```

## 🔍 Verification

### Local Development

```bash
# Check if server is running on correct port
curl http://localhost:3000/health

# Check Swagger docs
open http://localhost:3000/docs

# Check client
open http://localhost:3001

# Check admin
open http://localhost:3002
```

### Docker Deployment

```bash
# Build and start with Docker
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify services
docker-compose ps
```

### Production Deployment

```bash
# SSH into your server
ssh your-username@your-server-ip

# Check PM2 status
pm2 status

# Check logs
pm2 logs chikox-server
pm2 logs chikox-client
pm2 logs chikox-admin
```

## 📚 Documentation References

- **`SSH_DEPLOYMENT_SETUP.md`** - Complete SSH deployment guide
- **`DEPLOYMENT.md`** - All deployment methods
- **`CLAUDE.md`** - Development commands and architecture
- **`README.md`** - Project overview
- **`QUICKSTART.md`** - Quick start guide

## ⚠️ Important Notes

1. **Port Conflicts**: If you have any services running on ports 3000, 3001, or 3002, you'll need to stop them or change the ports in the environment files.

2. **CORS Configuration**: The server now expects client requests from `http://localhost:3001` instead of `http://localhost:3000`. This has been updated in all configuration files.

3. **Production URLs**: When deploying to production, make sure to update:
   - `CORS_ORIGIN` in server environment
   - `NEXT_PUBLIC_API_URL` in client environment
   - `VITE_API_URL` in admin environment

4. **Database Migrations**: Always run migrations in production:

   ```bash
   npm run db:migrate  # NOT db:push
   ```

5. **Security**: Generate strong random secrets for production:
   ```bash
   openssl rand -base64 32  # For JWT and cookie secrets
   ```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Kill the process
kill -9 <PID>
```

### GitHub Actions Fails

1. Check logs in Actions tab
2. Verify secrets are set correctly
3. Ensure server is accessible via SSH
4. Check server logs: `pm2 logs`

### Docker Issues

```bash
# Rebuild images
docker-compose build --no-cache

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## ✅ Checklist

- [ ] Updated local `.env` files with new ports
- [ ] Tested local development with `npm run dev`
- [ ] Verified all applications are accessible
- [ ] Read `SSH_DEPLOYMENT_SETUP.md`
- [ ] Prepared production server
- [ ] Generated SSH keys for GitHub Actions
- [ ] Added GitHub secrets
- [ ] Tested deployment by pushing to main
- [ ] Verified deployment in GitHub Actions
- [ ] Tested production applications

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ Local development runs without errors
2. ✅ All applications accessible on new ports
3. ✅ GitHub Actions workflow completes successfully
4. ✅ Production applications are accessible
5. ✅ PM2 shows all apps running on production server

---

**Questions or Issues?**

- Check the documentation files listed above
- Review GitHub Actions logs
- Check server logs with `pm2 logs`
- Verify all environment variables are set correctly
