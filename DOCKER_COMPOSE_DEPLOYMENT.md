# Docker Compose Deployment Guide

This guide will help you deploy your Chikox application using Docker Compose on any server.

## Prerequisites

- A server (VPS, EC2, DigitalOcean Droplet, etc.) running Ubuntu 20.04+ or similar
- SSH access to your server
- Docker and Docker Compose installed
- GitHub repository with Actions enabled

## Part 1: Prepare Your Production Server

### 1. Connect to Your Server

```bash
ssh your-username@your-server-ip
```

### 2. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
# SSH back in
ssh your-username@your-server-ip

# Verify Docker installation
docker --version
docker run hello-world
```

### 3. Install Docker Compose

```bash
# Download Docker Compose (latest version)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Set Up Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/chikox
sudo chown $USER:$USER /var/www/chikox

# Navigate to directory
cd /var/www/chikox

# Clone your repository
git clone https://github.com/rootxkit/chikox.git .
```

### 5. Create Production Environment File

```bash
# Create .env file for docker-compose
cat > .env << 'EOF'
# PostgreSQL Database Configuration
POSTGRES_USER=chikox_user
POSTGRES_PASSWORD=change_this_strong_password_123
POSTGRES_DB=chikox

# Server Environment Variables
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=change_this_to_random_string_min_32_chars
JWT_REFRESH_SECRET=change_this_to_random_string_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Origins (update with your domains)
CORS_ORIGIN=http://your-domain.com,http://admin.your-domain.com

# Cookie Secret
COOKIE_SECRET=change_this_to_random_string_min_32_chars

# Database URL (for Prisma)
DATABASE_URL=postgresql://chikox_user:change_this_strong_password_123@database:5432/chikox

# Client Environment
NEXT_PUBLIC_API_URL=http://your-domain.com

# Admin Environment
VITE_API_URL=http://your-domain.com
EOF

# Generate secure random secrets
echo "Generating secure secrets..."
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 24)

# Update the .env file with generated secrets
sed -i "s|JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET|g" .env
sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|g" .env
sed -i "s|COOKIE_SECRET=.*|COOKIE_SECRET=$COOKIE_SECRET|g" .env
sed -i "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$POSTGRES_PASSWORD|g" .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://chikox_user:$POSTGRES_PASSWORD@database:5432/chikox|g" .env

echo "✅ Secrets generated and saved to .env"
echo "⚠️  IMPORTANT: Update CORS_ORIGIN, NEXT_PUBLIC_API_URL, and VITE_API_URL with your actual domain!"
```

### 6. Update Domain Configuration

Edit the `.env` file and replace domain placeholders:

```bash
nano .env
```

Update these values:
- `CORS_ORIGIN` - Your actual domains (e.g., `https://app.example.com,https://admin.example.com`)
- `NEXT_PUBLIC_API_URL` - Your API URL (e.g., `https://api.example.com`)
- `VITE_API_URL` - Your API URL (e.g., `https://api.example.com`)

### 7. Build and Start Containers

```bash
# Build and start all containers
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 8. Run Database Migrations

```bash
# Wait for containers to be healthy (about 30 seconds)
sleep 30

# Run migrations
docker-compose exec server npm run db:migrate

# Verify migration
docker-compose exec server npm run db:studio
```

### 9. Configure Firewall

```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow application ports
sudo ufw allow 3000/tcp  # Server
sudo ufw allow 3001/tcp  # Client
sudo ufw allow 3002/tcp  # Admin

# Allow HTTP/HTTPS (if using Nginx)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 10. Set Up Nginx Reverse Proxy (Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/chikox > /dev/null << 'EOF'
# API Server
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Client Application
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Dashboard
server {
    listen 80;
    server_name admin.your-domain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Update with your domains
sudo nano /etc/nginx/sites-available/chikox

# Enable the site
sudo ln -s /etc/nginx/sites-available/chikox /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 11. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates (update with your domains)
sudo certbot --nginx -d your-domain.com -d api.your-domain.com -d admin.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Part 2: Configure GitHub Actions

### 1. Generate SSH Key for GitHub Actions

On your **local machine**:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions@chikox" -f ~/.ssh/chikox_deploy

# Copy the public key
cat ~/.ssh/chikox_deploy.pub
```

### 2. Add Public Key to Production Server

```bash
# On your production server
ssh your-username@your-server-ip

# Add the public key to authorized_keys
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

exit
```

### 3. Test SSH Connection

```bash
# From your local machine
ssh -i ~/.ssh/chikox_deploy your-username@your-server-ip
```

### 4. Add GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

#### PROD_SERVER_HOST
- **Name:** `PROD_SERVER_HOST`
- **Value:** Your server's IP address or domain

#### PROD_SERVER_USERNAME
- **Name:** `PROD_SERVER_USERNAME`
- **Value:** Your SSH username (e.g., `ubuntu`)

#### PROD_SERVER_SSH_KEY
- **Name:** `PROD_SERVER_SSH_KEY`
- **Value:** Content of your private key

```bash
# Copy private key
cat ~/.ssh/chikox_deploy
```

Copy the entire output including BEGIN and END lines.

#### PROD_SERVER_PORT (Optional)
- **Name:** `PROD_SERVER_PORT`
- **Value:** SSH port (default: `22`)

## Part 3: Deploy

### Automatic Deployment

```bash
# Commit and push to trigger deployment
git add .
git commit -m "Configure Docker Compose deployment"
git push origin main

# Monitor deployment
# Go to: https://github.com/rootxkit/chikox/actions
```

### Manual Deployment

```bash
# SSH into your server
ssh your-username@your-server-ip

# Navigate to app directory
cd /var/www/chikox

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose up -d --build

# Run migrations
docker-compose exec server npm run db:migrate

# Check status
docker-compose ps
```

## Docker Compose Commands

### View Status

```bash
# Show all containers
docker-compose ps

# Show detailed status
docker ps
```

### View Logs

```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f admin
docker-compose logs -f database

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 30m
```

### Restart Services

```bash
# Restart all containers
docker-compose restart

# Restart specific service
docker-compose restart server
docker-compose restart client
docker-compose restart admin
```

### Stop/Start Services

```bash
# Stop all containers
docker-compose stop

# Start all containers
docker-compose start

# Stop and remove containers (data persists)
docker-compose down

# Stop and remove everything including volumes (⚠️ DELETES DATA)
docker-compose down -v
```

### Rebuild Containers

```bash
# Rebuild all containers
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build server
```

### Execute Commands in Containers

```bash
# Run migration
docker-compose exec server npm run db:migrate

# Access PostgreSQL
docker-compose exec database psql -U chikox_user -d chikox

# Open shell in server container
docker-compose exec server sh

# Run Prisma Studio
docker-compose exec server npm run db:studio
```

### Clean Up

```bash
# Remove unused images
docker image prune -f

# Remove unused containers
docker container prune -f

# Remove unused volumes (⚠️ be careful)
docker volume prune -f

# Clean everything (⚠️ very destructive)
docker system prune -af
```

## Database Management

### Backup Database

```bash
# Create backup
docker-compose exec -T database pg_dump -U chikox_user chikox > backup_$(date +%Y%m%d_%H%M%S).sql

# Create backups directory
mkdir -p /var/www/chikox/backups

# Automated backup
docker-compose exec -T database pg_dump -U chikox_user chikox > /var/www/chikox/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Stop applications (keep database running)
docker-compose stop server client admin

# Restore from backup
cat backup_20240101_120000.sql | docker-compose exec -T database psql -U chikox_user chikox

# Start applications
docker-compose start server client admin
```

### Automated Daily Backup Script

```bash
# Create backup script
cat > /var/www/chikox/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/chikox/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /var/www/chikox

# Create backup
docker-compose exec -T database pg_dump -U chikox_user chikox > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
EOF

# Make executable
chmod +x /var/www/chikox/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/chikox/backup.sh >> /var/www/chikox/backups/backup.log 2>&1") | crontab -
```

## Monitoring

### Check Resource Usage

```bash
# Docker stats
docker stats

# Container resource usage
docker-compose stats
```

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check Swagger docs
curl http://localhost:3000/docs

# Check database connection
docker-compose exec database pg_isready -U chikox_user
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :3002

# Stop the process
sudo kill -9 <PID>
```

### Container Won't Start

```bash
# View logs
docker-compose logs service-name

# Check container details
docker inspect chikox-server
docker inspect chikox-client
docker inspect chikox-admin
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps database

# View database logs
docker-compose logs database

# Test connection
docker-compose exec server node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected!')).catch(e => console.error(e));"
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -af
docker volume prune -f

# Remove old logs
sudo journalctl --vacuum-time=7d
```

### Containers Keep Restarting

```bash
# Check logs for errors
docker-compose logs --tail=100 server

# Check environment variables
docker-compose exec server env | grep DATABASE_URL

# Restart with fresh build
docker-compose down
docker-compose up -d --build
```

## Security Best Practices

1. **Use Strong Passwords:** Generated with `openssl rand -base64 32`
2. **Enable Firewall:** Only allow necessary ports
3. **Use SSL/TLS:** Set up Let's Encrypt certificates
4. **Regular Updates:** Keep Docker and system packages updated
5. **Backup Database:** Automated daily backups
6. **Monitor Logs:** Regularly check application and container logs
7. **Limit SSH Access:** Use SSH keys only, disable root login
8. **Environment Variables:** Never commit `.env` to Git

## Performance Optimization

### Enable Docker BuildKit

```bash
# Add to ~/.bashrc or ~/.profile
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Limit Container Resources

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  server:
    # ...
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Scaling

### Run Multiple Instances

```bash
# Scale server instances
docker-compose up -d --scale server=3

# Note: You'll need a load balancer (Nginx, HAProxy) in front
```

## Next Steps

- Set up monitoring with Prometheus/Grafana
- Configure log aggregation with ELK stack
- Set up auto-scaling if needed
- Configure CDN for static assets
- Set up staging environment

---

**Questions or Issues?**
- Check container logs: `docker-compose logs -f`
- Verify environment variables: `cat .env`
- Test database connection: `docker-compose exec database psql -U chikox_user -d chikox`
