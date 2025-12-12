#!/bin/bash

# ========================================
# Rollback to Development Mode Script
# ========================================

set -e

echo "🔄 Rolling back to Development Mode..."
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Confirm rollback
echo ""
print_warning "This will stop production services and start development mode"
read -p "Are you sure you want to rollback? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 0
fi

# Step 1: Stop production services
echo ""
echo "🛑 Stopping production services..."
docker-compose -f docker-compose.prod.yml down
print_success "Production services stopped"

# Step 2: Start development services
echo ""
echo "🚀 Starting development services..."
docker-compose -f docker-compose.yml up -d

if [ $? -eq 0 ]; then
    print_success "Development services started"
else
    print_error "Failed to start development services"
    exit 1
fi

# Step 3: Wait for services
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Step 4: Show status
echo ""
echo "📊 Running containers:"
docker-compose -f docker-compose.yml ps

# Step 5: Show resource usage
echo ""
echo "💻 Resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "===================================="
echo "✅ Rollback completed!"
echo "===================================="
echo ""
echo "📍 Development URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
