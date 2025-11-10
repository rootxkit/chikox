# SSH Deployment Setup Guide

This guide will help you set up automated SSH deployment for your Chikox application using GitHub Actions.

## Prerequisites

- A server (VPS, EC2, DigitalOcean Droplet, etc.) running Ubuntu 20.04+ or similar
- SSH access to your server
- Node.js 24.x (LTS) installed on the server
- PostgreSQL database (local or remote)
- GitHub repository with Actions enabled

## Part 1: Prepare Your Production Server

### 1. Connect to Your Server

```bash
ssh your-username@your-server-ip
```

### 2. Install Node.js 24.x (Latest LTS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 24.x
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v24.x.x
npm --version
```

### 3. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 4. Install PostgreSQL (if not already installed)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE chikox;
CREATE USER chikox_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE chikox TO chikox_user;
\q
EOF
```

### 5. Set Up Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/chikox
sudo chown $USER:$USER /var/www/chikox

# Navigate to directory
cd /var/www/chikox

# Clone your repository
git clone https://github.com/rootxkit/chikox.git .

# Install dependencies
npm install
```

### 6. Configure Environment Variables

```bash
# Create production environment file for server
cat > apps/server/.env << 'EOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://chikox_user:your_secure_password@localhost:5432/chikox
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://your-domain.com,http://admin.your-domain.com
COOKIE_SECRET=$(openssl rand -base64 32)
EOF

# Replace the secrets with actual random values
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

# Update the .env file with actual secrets
sed -i "s|JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET|g" apps/server/.env
sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|g" apps/server/.env
sed -i "s|COOKIE_SECRET=.*|COOKIE_SECRET=$COOKIE_SECRET|g" apps/server/.env

# Create environment file for client
cat > apps/client/.env.production << 'EOF'
NEXT_PUBLIC_API_URL=http://your-domain.com
EOF

# Create environment file for admin
cat > apps/admin/.env.production << 'EOF'
VITE_API_URL=http://your-domain.com
EOF
```

### 7. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 8. Build Applications

```bash
npm run build
```

### 9. Start Applications with PM2

```bash
# Start server
pm2 start apps/server/dist/index.js --name chikox-server

# Start client
pm2 start npm --name chikox-client -- run start:client

# Install serve for admin static files
sudo npm install -g serve

# Start admin
pm2 start serve --name chikox-admin -- apps/admin/dist -l 3002

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Copy and run the command that PM2 outputs
```

### 10. Configure Firewall

```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow application ports
sudo ufw allow 3000/tcp  # Server
sudo ufw allow 3001/tcp  # Client
sudo ufw allow 3002/tcp  # Admin

# Enable firewall
sudo ufw enable
```

### 11. Set Up Nginx Reverse Proxy (Optional but Recommended)

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

# Enable the site
sudo ln -s /etc/nginx/sites-available/chikox /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 12. Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d your-domain.com -d api.your-domain.com -d admin.your-domain.com

# Follow the prompts to configure SSL
```

## Part 2: Configure GitHub Secrets

### 1. Generate SSH Key for GitHub Actions

On your **local machine**, generate a new SSH key pair:

```bash
# Generate SSH key (use a different name to avoid conflicts)
ssh-keygen -t ed25519 -C "github-actions@chikox" -f ~/.ssh/chikox_deploy

# This creates:
# - ~/.ssh/chikox_deploy (private key)
# - ~/.ssh/chikox_deploy.pub (public key)
```

### 2. Add Public Key to Production Server

```bash
# Copy the public key
cat ~/.ssh/chikox_deploy.pub

# On your production server, add it to authorized_keys
ssh your-username@your-server-ip
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

### 3. Test SSH Connection

```bash
# Test the connection from your local machine
ssh -i ~/.ssh/chikox_deploy your-username@your-server-ip

# If successful, you should be able to connect without entering a password
```

### 4. Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

#### PROD_SERVER_HOST
- **Name:** `PROD_SERVER_HOST`
- **Value:** Your server's IP address or domain (e.g., `123.45.67.89` or `server.your-domain.com`)

#### PROD_SERVER_USERNAME
- **Name:** `PROD_SERVER_USERNAME`
- **Value:** Your SSH username (e.g., `ubuntu`, `root`, or your custom username)

#### PROD_SERVER_SSH_KEY
- **Name:** `PROD_SERVER_SSH_KEY`
- **Value:** The content of your **private key** file

```bash
# Copy the private key
cat ~/.ssh/chikox_deploy
```

Copy the **entire output** including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.

#### PROD_SERVER_PORT (Optional)
- **Name:** `PROD_SERVER_PORT`
- **Value:** SSH port (default: `22`)

Only add this if you're using a non-standard SSH port.

## Part 3: Test Deployment

### 1. Push to Main Branch

```bash
git add .
git commit -m "Configure CI/CD deployment"
git push origin main
```

### 2. Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see a workflow running
4. Click on it to see the deployment progress

### 3. Verify Deployment

After the workflow completes:

```bash
# SSH into your server
ssh your-username@your-server-ip

# Check PM2 status
pm2 status

# Check application logs
pm2 logs chikox-server --lines 50
pm2 logs chikox-client --lines 50
pm2 logs chikox-admin --lines 50
```

Visit your application:
- API: http://your-server-ip:3000 or http://api.your-domain.com
- Client: http://your-server-ip:3001 or http://your-domain.com
- Admin: http://your-server-ip:3002 or http://admin.your-domain.com

## Troubleshooting

### Deployment Fails with "Permission Denied"

**Solution:** Make sure the public key is added to the server's `~/.ssh/authorized_keys` and permissions are correct:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### PM2 Apps Not Starting

**Solution:** Check logs and restart:

```bash
pm2 logs chikox-server --err --lines 100
pm2 restart chikox-server
```

### Database Connection Issues

**Solution:** Verify DATABASE_URL in `apps/server/.env`:

```bash
cat apps/server/.env | grep DATABASE_URL
```

Test database connection:

```bash
psql postgresql://chikox_user:your_password@localhost:5432/chikox -c "SELECT version();"
```

### Port Already in Use

**Solution:** Check what's using the port and stop it:

```bash
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :3002

# Kill the process if needed
pm2 stop all
pm2 start all
```

### Nginx Issues

**Solution:** Check Nginx logs:

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

Test configuration:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Maintenance Commands

### View Application Logs

```bash
# Real-time logs
pm2 logs

# Specific app logs
pm2 logs chikox-server
pm2 logs chikox-client
pm2 logs chikox-admin

# Last 100 lines
pm2 logs --lines 100
```

### Restart Applications

```bash
# Restart all
pm2 restart all

# Restart specific app
pm2 restart chikox-server
```

### Update Application Manually

```bash
cd /var/www/chikox
git pull origin main
npm ci
npm run db:migrate
npm run build
pm2 restart all
```

### Monitor Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
```

### Database Backup

```bash
# Create backup
pg_dump -U chikox_user chikox > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -U chikox_user chikox < backup_20240101_120000.sql
```

## Security Best Practices

1. **Use Strong Passwords:** Generate secure passwords for database and JWT secrets
2. **Enable Firewall:** Only allow necessary ports (22, 80, 443, and app ports if needed)
3. **Use SSL/TLS:** Set up HTTPS with Let's Encrypt
4. **Regular Updates:** Keep system packages and Node.js updated
5. **Backup Database:** Set up automated daily backups
6. **Monitor Logs:** Regularly check application and system logs
7. **Limit SSH Access:** Consider disabling root login and using SSH keys only
8. **Use Environment Variables:** Never commit sensitive data to Git

## Next Steps

- Set up automated database backups
- Configure monitoring with tools like Prometheus/Grafana
- Set up log aggregation with ELK stack or similar
- Configure auto-scaling if needed
- Set up staging environment for testing
