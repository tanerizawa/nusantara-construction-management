#!/bin/bash

# Start workflow development environment
echo "🚀 Starting workflow development environment..."

cd /root/APP-YK

# Ensure Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start development environment
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Show logs
echo "📋 Showing frontend logs..."
docker-compose logs -f frontend
