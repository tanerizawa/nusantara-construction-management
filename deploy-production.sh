#!/bin/bash

# NUSANTARA GROUP - PRODUCTION DEPLOYMENT SCRIPT
# Build and deploy frontend to Apache DocumentRoot

echo "🏗️ Building Nusantara Group Frontend for Production..."

# Change to project directory
cd /root/APP-YK

# Build frontend using Docker (production optimized)
echo "📦 Building frontend with Docker..."
docker-compose -f docker-compose.yml run --rm frontend npm run build

# Check if build was successful
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build successful"
    
    # Create production directory
    echo "📁 Setting up production directory..."
    sudo mkdir -p /var/www/html/nusantara-frontend
    
    # Backup existing deployment if exists
    if [ -d "/var/www/html/nusantara-frontend/static" ]; then
        echo "💾 Backing up existing deployment..."
        sudo mv /var/www/html/nusantara-frontend /var/www/html/nusantara-frontend.backup.$(date +%Y%m%d_%H%M%S)
        sudo mkdir -p /var/www/html/nusantara-frontend
    fi
    
    # Copy build files to Apache DocumentRoot
    echo "📋 Deploying to Apache DocumentRoot..."
    sudo cp -r frontend/build/* /var/www/html/nusantara-frontend/
    
    # Set proper permissions
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data /var/www/html/nusantara-frontend
    sudo chmod -R 755 /var/www/html/nusantara-frontend
    
    # Create .htaccess for React Router (backup for Apache config)
    echo "📝 Creating .htaccess for SPA routing..."
    sudo tee /var/www/html/nusantara-frontend/.htaccess > /dev/null << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF
    
    sudo chown www-data:www-data /var/www/html/nusantara-frontend/.htaccess
    
    echo ""
    echo "🎉 Frontend deployment successful!"
    echo "📍 Location: /var/www/html/nusantara-frontend"
    echo "📊 Files deployed:"
    sudo ls -la /var/www/html/nusantara-frontend/
    
    echo ""
    echo "🔗 URLs:"
    echo "Frontend: https://nusantaragroup.co"
    echo "API: https://nusantaragroup.co/api"
    
else
    echo "❌ Frontend build failed"
    echo "Check Docker logs:"
    docker-compose logs frontend
    exit 1
fi

# Clean up build artifacts in container
echo "🧹 Cleaning up..."
docker-compose run --rm frontend rm -rf build

echo ""
echo "✅ Production deployment complete!"
