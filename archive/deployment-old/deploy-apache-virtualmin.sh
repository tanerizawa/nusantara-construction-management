#!/bin/bash

# Production Deployment Script for Apache/Virtualmin
# Deploy Nusantara Construction Management System

echo "🚀 Starting Apache/Virtualmin Deployment..."

# Variables
DOMAIN="nusantaragroup.co"
WEBROOT="/home/nusantaragroup/public_html"
BACKEND_DIR="/home/nusantaragroup/backend"

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd /root/APP-YK/frontend

# Make sure we have all dependencies
npm install

# Build the application
npm run build

# Copy build files to web root
echo "📂 Copying frontend build to web root..."
sudo mkdir -p $WEBROOT
sudo cp -r build/* $WEBROOT/
sudo chown -R nusantaragroup:nusantaragroup $WEBROOT

# Setup backend
echo "🔧 Setting up backend..."
sudo mkdir -p $BACKEND_DIR
cd /root/APP-YK/backend
sudo cp -r . $BACKEND_DIR/
sudo chown -R nusantaragroup:nusantaragroup $BACKEND_DIR

# Install backend dependencies
cd $BACKEND_DIR
sudo -u nusantaragroup npm install

# Install PM2 globally if not exists
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
sudo -u nusantaragroup cat > $BACKEND_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nusantara-backend',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Stop existing PM2 process if running
sudo -u nusantaragroup pm2 delete nusantara-backend 2>/dev/null || true

# Start backend with PM2
echo "🚀 Starting backend with PM2..."
sudo -u nusantaragroup pm2 start $BACKEND_DIR/ecosystem.config.js
sudo -u nusantaragroup pm2 save

# Enable required Apache modules
echo "🔧 Enabling Apache modules..."
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires

# Restart Apache
echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

echo ""
echo "🎉 Deployment completed!"
echo "================================"
echo "🌐 Website: https://$DOMAIN"
echo "📁 Frontend: $WEBROOT"
echo "🔧 Backend: $BACKEND_DIR"
echo "⚡ Backend: Running on PM2 (port 5000)"
echo "🌍 Apache: Configured with proxy to backend"
echo ""
echo "📊 PM2 Status:"
sudo -u nusantaragroup pm2 status

echo ""
echo "🔍 Test your site:"
echo "curl -I https://$DOMAIN"
echo "curl -I https://$DOMAIN/api/health"

echo ""
echo "📝 Next steps:"
echo "1. Ensure SSL certificate is configured in Virtualmin"
echo "2. Check Apache Virtual Host configuration"
echo "3. Test login functionality"
echo "4. Monitor PM2 logs: pm2 logs nusantara-backend"
