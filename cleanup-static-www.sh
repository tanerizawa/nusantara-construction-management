#!/bin/bash

# Clean up static web files in /var/www/html for nusantaragroup.co
# Keep only essential files and remove old static React builds

echo "🧹 Cleaning up static web files in /var/www/html..."

# Backup important files first
echo "📦 Creating backup of important files..."
sudo mkdir -p /var/www/backup/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/backup/$(date +%Y%m%d_%H%M%S)"

# Backup .well-known (for SSL certificates)
if [ -d "/var/www/html/.well-known" ]; then
    sudo cp -r /var/www/html/.well-known $BACKUP_DIR/
    echo "✅ Backed up .well-known directory"
fi

# Backup company profile if exists
if [ -f "/var/www/html/company-profile-yk.pdf" ]; then
    sudo cp /var/www/html/company-profile-yk.pdf $BACKUP_DIR/
    echo "✅ Backed up company-profile-yk.pdf"
fi

# Show current directory contents
echo "📋 Current /var/www/html contents:"
sudo ls -la /var/www/html/

echo ""
echo "🗑️ Files to be removed:"
echo "  - asset-manifest.json (old React build)"
echo "  - index.html (old React build)"
echo "  - static/ (old React static assets)"
echo "  - hero-pattern.svg (old static asset)"
echo "  - og-image.png (old static asset)"
echo "  - index.nginx-debian.html (default nginx page)"

read -p "⚠️  Continue with cleanup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Remove old React build files
    echo "🗑️ Removing old React build files..."
    
    sudo rm -f /var/www/html/asset-manifest.json
    sudo rm -f /var/www/html/index.html
    sudo rm -f /var/www/html/hero-pattern.svg
    sudo rm -f /var/www/html/og-image.png
    sudo rm -f /var/www/html/index.nginx-debian.html
    
    # Remove static directory
    if [ -d "/var/www/html/static" ]; then
        sudo rm -rf /var/www/html/static
        echo "✅ Removed static/ directory"
    fi
    
    # Remove nusantara-frontend directory if exists
    if [ -d "/var/www/html/nusantara-frontend" ]; then
        sudo rm -rf /var/www/html/nusantara-frontend
        echo "✅ Removed nusantara-frontend/ directory"
    fi
    
    echo ""
    echo "🧹 Cleanup completed!"
    echo "📋 Remaining files in /var/www/html:"
    sudo ls -la /var/www/html/
    
    echo ""
    echo "📦 Backup created at: $BACKUP_DIR"
    echo "🐳 Frontend now served from Docker container at port 3000"
    echo "🔗 Access via: https://nusantaragroup.co (proxied to Docker)"
    
else
    echo "❌ Cleanup cancelled"
fi