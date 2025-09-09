#!/bin/bash

# =============================================================================
# NUSANTARA GROUP APACHE DEPLOYMENT SCRIPT
# Deploy to https://nusantaragroup.co/approval
# =============================================================================

set -e

echo "🚀 Starting Apache Deployment to nusantaragroup.co..."

# Configuration
DOMAIN="nusantaragroup.co"
FRONTEND_DIR="/var/www/html/nusantara-frontend"
BACKUP_DIR="/var/backups/nusantara-$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to backup existing frontend
backup_frontend() {
    if [ -d "$FRONTEND_DIR" ]; then
        echo_info "Creating backup of existing frontend..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$FRONTEND_DIR" "$BACKUP_DIR/"
        echo_success "Backup created at $BACKUP_DIR"
    fi
}

# Function to build production frontend
build_frontend() {
    echo_info "Building production frontend..."
    
    # Set production environment
    export NODE_ENV=production
    export REACT_APP_API_URL=https://nusantaragroup.co/api
    export REACT_APP_ENV=production
    export GENERATE_SOURCEMAP=false
    
    cd /root/APP-YK/frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Build for production
    echo_info "Building React application..."
    npm run build
    
    echo_success "Frontend built successfully"
}

# Function to deploy frontend
deploy_frontend() {
    echo_info "Deploying frontend to Apache document root..."
    
    # Create frontend directory if it doesn't exist
    mkdir -p "$FRONTEND_DIR"
    
    # Copy built files
    echo_info "Copying build files..."
    cp -r /root/APP-YK/frontend/build/* "$FRONTEND_DIR/"
    
    # Set proper ownership and permissions
    chown -R www-data:www-data "$FRONTEND_DIR"
    chmod -R 755 "$FRONTEND_DIR"
    
    echo_success "Frontend deployed successfully"
}

# Function to start/restart backend
deploy_backend() {
    echo_info "Deploying backend services..."
    
    cd /root/APP-YK
    
    # Stop existing containers
    echo_info "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down || true
    
    # Build and start production containers
    echo_info "Starting production containers..."
    docker-compose -f docker-compose.production.yml up -d --build
    
    # Wait for services to be ready
    echo_info "Waiting for services to start..."
    sleep 30
    
    # Check backend health
    echo_info "Checking backend health..."
    for i in {1..10}; do
        if curl -s -f http://localhost:5000/health > /dev/null; then
            echo_success "Backend is healthy"
            break
        fi
        if [ $i -eq 10 ]; then
            echo_error "Backend health check failed"
            exit 1
        fi
        echo_warning "Waiting for backend... ($i/10)"
        sleep 5
    done
}

# Function to update Apache configuration
update_apache_config() {
    echo_info "Updating Apache configuration..."
    
    # Copy Apache configuration
    cp /root/APP-YK/apache-virtualhost.conf /etc/apache2/sites-available/nusantaragroup.co.conf
    
    # Enable site if not already enabled
    a2ensite nusantaragroup.co.conf
    
    # Enable required Apache modules
    a2enmod rewrite
    a2enmod proxy
    a2enmod proxy_http
    a2enmod headers
    a2enmod ssl
    a2enmod expires
    
    # Test Apache configuration
    if apache2ctl configtest; then
        echo_success "Apache configuration is valid"
        
        # Reload Apache
        systemctl reload apache2
        echo_success "Apache reloaded successfully"
    else
        echo_error "Apache configuration test failed"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo_info "Verifying deployment..."
    
    # Check if frontend is accessible
    if curl -s -f "https://$DOMAIN" > /dev/null; then
        echo_success "Frontend is accessible at https://$DOMAIN"
    else
        echo_warning "Frontend may not be fully accessible yet"
    fi
    
    # Check if API is accessible through Apache proxy
    if curl -s -f "https://$DOMAIN/api/health" > /dev/null; then
        echo_success "API is accessible at https://$DOMAIN/api"
    else
        echo_warning "API may not be fully accessible yet"
    fi
    
    # Check approval dashboard specifically
    echo_info "Checking approval dashboard route..."
    if curl -s "https://$DOMAIN/approval" | grep -q "Nusantara"; then
        echo_success "Approval dashboard route is working"
    else
        echo_warning "Approval dashboard route may need verification"
    fi
}

# Function to show deployment summary
show_summary() {
    echo ""
    echo "==================== DEPLOYMENT SUMMARY ===================="
    echo_success "✅ Frontend deployed to: $FRONTEND_DIR"
    echo_success "✅ Backend containers running"
    echo_success "✅ Apache configuration updated"
    echo_success "✅ SSL/HTTPS enabled"
    echo ""
    echo_info "🌐 Application URLs:"
    echo "   • Main Site: https://$DOMAIN"
    echo "   • Approval Dashboard: https://$DOMAIN/approval"
    echo "   • API Endpoint: https://$DOMAIN/api"
    echo "   • Health Check: https://$DOMAIN/api/health"
    echo ""
    echo_info "📋 Backend Containers:"
    docker-compose -f /root/APP-YK/docker-compose.production.yml ps
    echo ""
    echo_warning "📝 Next Steps:"
    echo "   1. Test the approval dashboard at https://$DOMAIN/approval"
    echo "   2. Verify API endpoints are working"
    echo "   3. Check logs if any issues: docker-compose logs"
    echo "   4. Monitor Apache logs: tail -f /var/log/apache2/nusantaragroup.co_*.log"
    echo "=============================================================="
}

# Main execution
main() {
    echo_info "Deployment Target: https://$DOMAIN/approval"
    echo ""
    
    check_root
    backup_frontend
    build_frontend
    deploy_frontend
    deploy_backend
    update_apache_config
    verify_deployment
    show_summary
    
    echo_success "🎉 Deployment completed successfully!"
    echo_info "Your approval dashboard is now live at: https://$DOMAIN/approval"
}

# Run main function
main "$@"
