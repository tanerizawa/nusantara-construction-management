#!/bin/bash

# Production Deployment Script for Nusantara Group
# Setup HTTPS with Let's Encrypt and Nginx Proxy

echo "🚀 Starting Production Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y nginx certbot python3-certbot-nginx

# Stop nginx if running
sudo systemctl stop nginx

# Get SSL certificate
echo "🔐 Getting SSL certificate from Let's Encrypt..."
sudo certbot certonly --standalone -d nusantaragroup.co -d www.nusantaragroup.co --email admin@nusantaragroup.co --agree-tos --non-interactive

# Copy Nginx configuration
echo "⚙️ Setting up Nginx configuration..."
sudo cp nginx.production.conf /etc/nginx/sites-available/nusantaragroup.co
sudo ln -sf /etc/nginx/sites-available/nusantaragroup.co /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration error"
    exit 1
fi

# Create web root directory
echo "📁 Creating web root directory..."
sudo mkdir -p /var/www/nusantaragroup.co/html
sudo chown -R www-data:www-data /var/www/nusantaragroup.co

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd frontend
npm install
npm run build

# Copy build files to web root
echo "📂 Copying frontend build to web root..."
sudo cp -r build/* /var/www/nusantaragroup.co/html/
sudo chown -R www-data:www-data /var/www/nusantaragroup.co/html

# Start backend
echo "🔧 Starting backend server..."
cd ../backend
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start backend with PM2
PM2_HOME=/root/.pm2 pm2 start server.js --name "nusantara-backend" --node-args="--max-old-space-size=1024"
PM2_HOME=/root/.pm2 pm2 save
PM2_HOME=/root/.pm2 pm2 startup

# Start Nginx
echo "🌐 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup auto-renewal for SSL certificates
echo "🔄 Setting up SSL certificate auto-renewal..."
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx"; } | sudo crontab -

# Show status
echo ""
echo "🎉 Deployment completed!"
echo "================================"
echo "🌐 Website: https://nusantaragroup.co"
echo "🔒 SSL: Enabled with Let's Encrypt"
echo "⚡ Backend: Running on PM2"
echo "🌍 Nginx: Configured with HTTPS proxy"
echo ""
echo "📊 Services Status:"
sudo systemctl status nginx --no-pager -l
PM2_HOME=/root/.pm2 pm2 status

echo ""
echo "🔍 Test your site:"
echo "curl -I https://nusantaragroup.co"
echo "curl -I https://nusantaragroup.co/api/health"
