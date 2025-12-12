#!/bin/bash

# ========================================
# Production Deployment Script
# ========================================

set -e

echo "🚀 Starting Production Deployment..."
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check prerequisites
echo ""
echo "📋 Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

print_success "Prerequisites check passed"

# Step 2: Check if env file exists
echo ""
echo "🔍 Checking environment file..."
if [ ! -f "$ENV_FILE" ]; then
    print_warning "Production environment file not found"
    echo "Creating from template..."
    cp .env.example "$ENV_FILE" 2>/dev/null || true
fi
print_success "Environment file ready"

# Step 3: Stop existing services
echo ""
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose.yml down 2>/dev/null || true
print_success "Existing services stopped"

# Step 4: Clean up old images (optional)
echo ""
read -p "🧹 Clean up old Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleaning up..."
    docker image prune -f
    print_success "Cleanup completed"
fi

# Step 5: Build production images
echo ""
echo "🔨 Building production images..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

if [ $? -eq 0 ]; then
    print_success "Images built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 6: Start production services
echo ""
echo "🚀 Starting production services..."
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

if [ $? -eq 0 ]; then
    print_success "Services started successfully"
else
    print_error "Failed to start services"
    exit 1
fi

# Step 7: Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
echo "🏥 Checking service health..."

# Check backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend is healthy"
else
    print_warning "Backend might not be ready yet"
fi

# Check frontend
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_success "Frontend is healthy"
else
    print_warning "Frontend might not be ready yet"
fi

# Step 8: Show running containers
echo ""
echo "📊 Running containers:"
docker-compose -f "$COMPOSE_FILE" ps

# Step 9: Show resource usage
echo ""
echo "💻 Resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Step 10: Display URLs
echo ""
echo "===================================="
echo "🎉 Deployment completed successfully!"
echo "===================================="
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:5000"
echo "   API Docs: http://localhost:5000/api-docs (if available)"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   Stop: docker-compose -f $COMPOSE_FILE down"
echo "   Restart: docker-compose -f $COMPOSE_FILE restart"
echo "   Status: docker-compose -f $COMPOSE_FILE ps"
echo ""
echo "🔍 Monitor:"
echo "   docker stats"
echo "   docker-compose -f $COMPOSE_FILE logs -f [service-name]"
echo ""

# Ask if user wants to view logs
read -p "📜 View logs now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f "$COMPOSE_FILE" logs -f
fi
