#!/bin/bash

# Deploy Apache configuration for Docker frontend proxy
# This script updates Apache to proxy to Docker containers instead of /var/www

echo "🚀 Deploying Apache Docker Proxy Configuration..."

# Backup current configuration
sudo cp /etc/apache2/sites-available/nusantara-group.conf /etc/apache2/sites-available/nusantara-group.conf.backup.$(date +%Y%m%d_%H%M%S)

# Copy new configuration
sudo cp /root/APP-YK/apache-proxy-config.conf /etc/apache2/sites-available/nusantara-group.conf

# Enable required Apache modules
echo "📦 Enabling required Apache modules..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl

# Test Apache configuration
echo "🔍 Testing Apache configuration..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo "✅ Apache configuration is valid"
    
    # Reload Apache
    echo "🔄 Reloading Apache..."
    sudo systemctl reload apache2
    
    if [ $? -eq 0 ]; then
        echo "✅ Apache reloaded successfully"
        echo "🌐 Frontend now proxied from Docker container on port 3000"
        echo "🔗 API proxied from Docker container on port 5000"
        echo ""
        echo "🎯 Configuration Summary:"
        echo "  - Frontend: https://nusantaragroup.co → http://localhost:3000"
        echo "  - API: https://nusantaragroup.co/api → http://localhost:5000/api"
        echo ""
        echo "🔧 Test with: curl -I https://nusantaragroup.co"
    else
        echo "❌ Failed to reload Apache"
        exit 1
    fi
else
    echo "❌ Apache configuration test failed"
    exit 1
fi