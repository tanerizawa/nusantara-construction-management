#!/bin/bash

# Install workflow dependencies using Docker
echo "🐳 Installing workflow dependencies in Docker container..."

cd /root/APP-YK

# Check if docker-compose is available
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please ensure Docker setup is complete."
    exit 1
fi

# Stop any running containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Install dependencies inside Docker container
echo "📦 Installing dependencies in Docker container..."
docker-compose run --rm frontend npm install

# Restart the development environment
echo "🚀 Starting development environment..."
docker-compose up -d

echo "✅ Workflow dependencies installed successfully in Docker!"
echo "📝 Dependencies added:"
echo "   - recharts (for charts)"
echo "   - date-fns (for date handling)"
echo "   - react-hook-form (for forms)"
echo "   - react-hot-toast (for notifications)"
