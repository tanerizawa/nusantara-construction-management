#!/bin/bash

echo "🔧 Apache Configuration Switcher untuk Nusantara Construction"
echo "=============================================================="
echo ""
echo "Mode yang tersedia:"
echo "1. Production Mode (Port 8081 frontend, 5001 backend)"
echo "2. Staging Mode (Port 8080 frontend, 5000 backend) - dengan source maps"
echo "3. Show current configuration"
echo ""

read -p "Pilih mode (1-3): " choice

APACHE_CONF_FILE="/etc/apache2/sites-available/nusantara.conf"

case $choice in
    1)
        echo "🏭 Switching to Production Mode..."
        
        # Backup current config
        sudo cp $APACHE_CONF_FILE $APACHE_CONF_FILE.backup.$(date +%Y%m%d_%H%M%S)
        
        # Set production proxy
        sudo sed -i 's|# ProxyPass / http://127.0.0.1:8081/|ProxyPass / http://127.0.0.1:8081/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPassReverse / http://127.0.0.1:8081/|ProxyPassReverse / http://127.0.0.1:8081/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPass /api/ http://127.0.0.1:5001/|ProxyPass /api/ http://127.0.0.1:5001/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPassReverse /api/ http://127.0.0.1:5001/|ProxyPassReverse /api/ http://127.0.0.1:5001/|g' $APACHE_CONF_FILE
        
        # Comment out staging
        sudo sed -i 's|ProxyPass / http://127.0.0.1:8080/|# ProxyPass / http://127.0.0.1:8080/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPassReverse / http://127.0.0.1:8080/|# ProxyPassReverse / http://127.0.0.1:8080/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPass /api/ http://127.0.0.1:5000/|# ProxyPass /api/ http://127.0.0.1:5000/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPassReverse /api/ http://127.0.0.1:5000/|# ProxyPassReverse /api/ http://127.0.0.1:5000/|g' $APACHE_CONF_FILE
        
        sudo systemctl reload apache2
        echo "✅ Apache configured for Production Mode"
        echo "ℹ️  Pastikan jalankan: docker-compose -f docker-compose.production.yml up"
        ;;
        
    2)
        echo "🎯 Switching to Staging Mode..."
        
        # Backup current config
        sudo cp $APACHE_CONF_FILE $APACHE_CONF_FILE.backup.$(date +%Y%m%d_%H%M%S)
        
        # Set staging proxy
        sudo sed -i 's|# ProxyPass / http://127.0.0.1:8080/|ProxyPass / http://127.0.0.1:8080/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPassReverse / http://127.0.0.1:8080/|ProxyPassReverse / http://127.0.0.1:8080/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPass /api/ http://127.0.0.1:5000/|ProxyPass /api/ http://127.0.0.1:5000/|g' $APACHE_CONF_FILE
        sudo sed -i 's|# ProxyPassReverse /api/ http://127.0.0.1:5000/|ProxyPassReverse /api/ http://127.0.0.1:5000/|g' $APACHE_CONF_FILE
        
        # Comment out production
        sudo sed -i 's|ProxyPass / http://127.0.0.1:8081/|# ProxyPass / http://127.0.0.1:8081/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPassReverse / http://127.0.0.1:8081/|# ProxyPassReverse / http://127.0.0.1:8081/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPass /api/ http://127.0.0.1:5001/|# ProxyPass /api/ http://127.0.0.1:5001/|g' $APACHE_CONF_FILE
        sudo sed -i 's|ProxyPassReverse /api/ http://127.0.0.1:5001/|# ProxyPassReverse /api/ http://127.0.0.1:5001/|g' $APACHE_CONF_FILE
        
        sudo systemctl reload apache2
        echo "✅ Apache configured for Staging Mode"
        echo "ℹ️  Pastikan jalankan: docker-compose -f docker-compose.staging.yml up"
        echo "🔧 Features: Production build + source maps untuk debugging"
        ;;
        
    3)
        echo "📋 Current Apache Configuration:"
        echo "================================"
        grep -n "ProxyPass" $APACHE_CONF_FILE
        echo ""
        echo "Keterangan:"
        echo "- Port 8081/5001 = Production Mode"
        echo "- Port 8080/5000 = Staging Mode"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run again."
        exit 1
        ;;
esac