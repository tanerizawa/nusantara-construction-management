#!/bin/bash

# NUSANTARA GROUP - APACHE PROXY SETUP SCRIPT
# Production-ready Apache configuration with backend proxy

echo "🚀 Setting up Apache proxy for Nusantara Group..."

# Enable required Apache modules
echo "📦 Enabling Apache modules..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl

# Create Apache VirtualHost configuration
echo "📝 Creating VirtualHost configuration..."

sudo tee /etc/apache2/sites-available/nusantara-group.conf > /dev/null << 'EOF'
# NUSANTARA GROUP - PRODUCTION APACHE CONFIGURATION

<VirtualHost *:80>
    ServerName nusantaragroup.co
    ServerAlias www.nusantaragroup.co
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName nusantaragroup.co
    ServerAlias www.nusantaragroup.co
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/nusantaragroup.co/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/nusantaragroup.co/privkey.pem
    
    # Modern SSL Configuration
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off
    
    # Frontend static files
    DocumentRoot /var/www/html/nusantara-frontend
    
    # Security Headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    # Relaxed CSP for React development
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' blob:; worker-src 'self' blob:"
    
    # Proxy Configuration for Backend API
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Proxy /api requests to backend on port 5000
    ProxyPass /api/ http://127.0.0.1:5000/api/
    ProxyPassReverse /api/ http://127.0.0.1:5000/api/
    
    # API Location with CORS headers
    <Location "/api">
        # CORS Headers for production
        Header always set Access-Control-Allow-Origin "https://nusantaragroup.co"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        Header always set Access-Control-Allow-Credentials "true"
        
        # Handle preflight OPTIONS requests
        RewriteEngine On
        RewriteCond %{REQUEST_METHOD} OPTIONS
        RewriteRule ^(.*)$ - [R=200,L,E=HTTP_ORIGIN:%{HTTP:Origin}]
        Header always set Access-Control-Allow-Origin %{HTTP_ORIGIN}e env=HTTP_ORIGIN
    </Location>
    
    # Frontend SPA Routing Support
    <Directory "/var/www/html/nusantara-frontend">
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
        
        # React Router Support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api/
        RewriteRule . /index.html [L]
    </Directory>
    
    # Static Asset Optimization
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public, immutable"
    </LocationMatch>
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/nusantara_error.log
    CustomLog ${APACHE_LOG_DIR}/nusantara_access.log combined
    LogLevel warn
</VirtualHost>
EOF

# Disable default Apache site
echo "🔧 Configuring Apache sites..."
sudo a2dissite 000-default
sudo a2dissite default-ssl

# Enable our site
sudo a2ensite nusantara-group

# Test Apache configuration
echo "🧪 Testing Apache configuration..."
if sudo apache2ctl configtest; then
    echo "✅ Apache configuration is valid"
    
    # Restart Apache
    echo "🔄 Restarting Apache..."
    sudo systemctl restart apache2
    
    if sudo systemctl is-active --quiet apache2; then
        echo "✅ Apache restarted successfully"
        echo ""
        echo "🎉 Apache proxy setup complete!"
        echo "📍 Frontend: https://nusantaragroup.co"
        echo "📍 API Proxy: https://nusantaragroup.co/api"
        echo "📍 Backend Direct: http://localhost:5000"
        echo ""
        echo "📋 Next steps:"
        echo "1. Build and deploy frontend to /var/www/html/nusantara-frontend"
        echo "2. Ensure backend is running on port 5000"
        echo "3. Test login functionality"
    else
        echo "❌ Failed to start Apache"
        sudo systemctl status apache2
    fi
else
    echo "❌ Apache configuration test failed"
    sudo apache2ctl configtest
fi

echo ""
echo "📊 Current status:"
echo "Apache: $(sudo systemctl is-active apache2)"
echo "Backend: $(curl -s http://localhost:5000/api/health > /dev/null && echo 'running' || echo 'not running')"
