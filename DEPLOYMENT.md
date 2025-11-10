# Deployment Guide

This guide covers deploying the Chikox application using various methods and platforms.

## Table of Contents

- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Deployment](#docker-deployment)
- [Platform-Specific Deployment](#platform-specific-deployment)
- [Environment Variables](#environment-variables)

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that automatically:

1. **Installs dependencies** and caches them for faster builds
2. **Runs linting** and format checks
3. **Performs TypeScript type checking**
4. **Runs all tests** (server, client, admin)
5. **Builds all applications**
6. **Deploys** (when pushing to main/master branch)

### Workflow Triggers

The pipeline runs on:

- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

### Required GitHub Secrets

Depending on your deployment platform, add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

#### For Vercel Deployment:

- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_CLIENT_PROJECT_ID` - Project ID for client app
- `VERCEL_ADMIN_PROJECT_ID` - Project ID for admin app

#### For Railway Deployment:

- `RAILWAY_TOKEN` - Your Railway token

#### For AWS Deployment:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

#### For Heroku Deployment:

- `HEROKU_API_KEY` - Your Heroku API key
- `HEROKU_EMAIL` - Your Heroku email

#### For Docker Compose SSH Deployment (Currently Enabled):

- `PROD_SERVER_HOST` - Production server IP/domain (required)
- `PROD_SERVER_USERNAME` - SSH username (required)
- `PROD_SERVER_SSH_KEY` - Private SSH key (required)
- `PROD_SERVER_PORT` - SSH port (optional, defaults to 22)

### Docker Compose SSH Deployment (Currently Active)

The workflow is configured to deploy via SSH using Docker Compose. To set it up:

1. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
   - `PROD_SERVER_HOST` - Your server's IP address or domain
   - `PROD_SERVER_USERNAME` - SSH username (e.g., ubuntu)
   - `PROD_SERVER_SSH_KEY` - Your private SSH key
   - `PROD_SERVER_PORT` - (Optional) SSH port, defaults to 22

2. **Prepare Your Server** - See **`DOCKER_COMPOSE_DEPLOYMENT.md`** for complete setup guide

3. **Push to main/master** - Deployment will trigger automatically

**📚 Full Guide:** See `DOCKER_COMPOSE_DEPLOYMENT.md` for step-by-step instructions

### Switching Deployment Methods

To use a different deployment method:

1. Open `.github/workflows/ci-cd.yml`
2. Comment out the current SSH deployment section
3. Uncomment your preferred deployment option (Vercel, Railway, AWS, Heroku)
4. Add required secrets to your GitHub repository
5. Push to main/master branch

## Docker Deployment

### ⭐ Recommended Deployment Method

**Docker Compose is the recommended deployment method for this project.** It provides:

- ✅ Consistent environment across development and production
- ✅ Easy setup and maintenance
- ✅ Automatic container orchestration
- ✅ Built-in networking and volume management
- ✅ Simple rollback and updates

**📚 Complete Guide:** See **`DOCKER_COMPOSE_DEPLOYMENT.md`** for full production setup

### Local Development with Docker

Run the entire stack locally using Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v
```

Services will be available at:

- Server: http://localhost:3000
- Client: http://localhost:3001
- Admin: http://localhost:3002
- Database: localhost:5432

### Building Individual Docker Images

```bash
# Build server
docker build -f apps/server/Dockerfile -t chikox-server .

# Build client
docker build -f apps/client/Dockerfile -t chikox-client .

# Build admin
docker build -f apps/admin/Dockerfile -t chikox-admin .
```

### Production Docker Deployment

1. **Build and tag images:**

   ```bash
   docker build -f apps/server/Dockerfile -t your-registry/chikox-server:latest .
   docker build -f apps/client/Dockerfile -t your-registry/chikox-client:latest .
   docker build -f apps/admin/Dockerfile -t your-registry/chikox-admin:latest .
   ```

2. **Push to registry:**

   ```bash
   docker push your-registry/chikox-server:latest
   docker push your-registry/chikox-client:latest
   docker push your-registry/chikox-admin:latest
   ```

3. **Deploy using docker-compose on production server:**

   ```bash
   # Create .env file with production secrets
   cp .env.example .env
   # Edit .env with production values

   # Start services
   docker-compose -f docker-compose.yml up -d
   ```

## Platform-Specific Deployment

### Option 1: Vercel (Client & Admin) + Railway (Server & Database)

#### Deploy Server to Railway:

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Create new project: `railway init`
4. Add PostgreSQL: `railway add -d postgres`
5. Deploy server:
   ```bash
   cd apps/server
   railway up
   ```
6. Set environment variables in Railway dashboard
7. Get your Railway server URL

#### Deploy Client to Vercel:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy client:
   ```bash
   cd apps/client
   vercel --prod
   ```
4. Set `NEXT_PUBLIC_API_URL` environment variable to your Railway server URL

#### Deploy Admin to Vercel:

1. Deploy admin:
   ```bash
   cd apps/admin
   vercel --prod
   ```
2. Set `VITE_API_URL` environment variable to your Railway server URL

### Option 2: AWS EC2 + RDS

#### Set up RDS PostgreSQL:

1. Create RDS PostgreSQL instance in AWS Console
2. Configure security groups to allow connections
3. Note the connection string

#### Set up EC2 Instance:

1. Launch EC2 instance (Ubuntu 22.04 recommended)
2. Configure security groups (allow ports 22, 3000, 3001, 3002)
3. SSH into instance:

   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

4. Install dependencies:

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Git
   sudo apt install -y git
   ```

5. Clone and setup:

   ```bash
   git clone https://github.com/rootxkit/chikox.git
   cd chikox
   npm install
   ```

6. Configure environment variables:

   ```bash
   cp apps/server/.env.example apps/server/.env
   # Edit with production values
   nano apps/server/.env
   ```

7. Build and start with PM2:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run build

   # Start server
   pm2 start apps/server/dist/index.js --name chikox-server

   # Start client
   pm2 start npm --name chikox-client -- run start:client

   # Start admin (use serve for static files)
   npm install -g serve
   pm2 start serve --name chikox-admin -- apps/admin/dist -l 3002

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

8. Set up Nginx reverse proxy (optional but recommended):

   ```bash
   sudo apt install -y nginx
   sudo nano /etc/nginx/sites-available/chikox
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   server {
       listen 80;
       server_name admin.your-domain.com;

       location / {
           proxy_pass http://localhost:3002;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/chikox /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 3: Heroku

#### Deploy Server:

```bash
# Login to Heroku
heroku login

# Create app
heroku create chikox-server

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-secret
# ... other env vars

# Create Procfile
echo "web: node apps/server/dist/index.js" > Procfile

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
```

#### Deploy Client and Admin:

Use Vercel or Netlify for Next.js client and static admin, pointing to your Heroku server URL.

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings for each app
3. Add environment variables
4. Deploy

## Environment Variables

### Server (.env)

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_ACCESS_SECRET=your-strong-secret-min-32-chars
JWT_REFRESH_SECRET=your-strong-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-client.com,https://admin.your-domain.com
COOKIE_SECRET=your-strong-secret-min-32-chars
```

### Client (.env)

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Admin (.env)

```env
VITE_API_URL=https://api.your-domain.com
```

## Port Configuration

The application uses the following ports:

- **Server (Fastify API):** 3000
- **Client (Next.js):** 3001
- **Admin (React + Vite):** 3002
- **Database (PostgreSQL):** 5432

## Database Migrations

Always run migrations in production:

```bash
# Using Prisma CLI
npx prisma migrate deploy

# Or using npm script
npm run db:migrate
```

**Never use `db:push` in production** - it's only for development.

## Health Checks

Add health check endpoints for monitoring:

```typescript
// In apps/server/src/index.ts
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});
```

## Monitoring and Logs

### PM2 (if using)

```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# Restart process
pm2 restart chikox-server
```

### Docker

```bash
# View logs
docker-compose logs -f server

# View specific service
docker-compose logs -f client
```

## SSL/TLS Certificates

For production, always use HTTPS:

### With Nginx + Let's Encrypt (Free):

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d admin.your-domain.com
```

### With Cloudflare (Free):

1. Point your domain to Cloudflare nameservers
2. Enable "Full" or "Full (strict)" SSL mode
3. Configure origin certificates if needed

## Backup Strategy

### Database Backups

#### Automated daily backups:

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$TIMESTAMP.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Common Issues

**Issue: Database connection fails**

- Check DATABASE_URL is correct
- Verify database is running and accessible
- Check firewall/security group settings

**Issue: CORS errors**

- Verify CORS_ORIGIN includes your client domains
- Check protocol (http vs https) matches

**Issue: JWT token errors**

- Ensure JWT secrets are set and same across restarts
- Check token expiration times

**Issue: Build fails**

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .next`
- Verify all environment variables are set

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple server instances behind a load balancer
2. **Database Connection Pooling**: Configure Prisma connection limits
3. **Caching**: Add Redis for session storage and caching
4. **CDN**: Use Cloudflare or AWS CloudFront for static assets
5. **Database Replicas**: Set up read replicas for heavy read workloads
