#!/bin/bash

# Production Build Script using Docker - Full Docker Environment
echo "🚀 Building production frontend using Docker..."

# Build production-ready Docker image
docker build -t yk-frontend-prod \
  --build-arg NODE_ENV=production \
  --build-arg REACT_APP_API_URL=/api \
  -f Dockerfile.frontend.prod \
  .

if [ $? -eq 0 ]; then
    echo "✅ Production build successful!"
    
    # Create temporary container to extract build files
    echo "📦 Extracting build files..."
    docker create --name temp-container yk-frontend-prod
    
    # Remove existing build directory
    rm -rf ./frontend/build
    
    # Extract build files
    docker cp temp-container:/app/build ./frontend/
    
    # Cleanup temporary container
    docker rm temp-container
    
    echo "✅ Build files extracted to ./frontend/build"
    
    # List files to verify
    echo "� Build contents:"
    ls -la ./frontend/build/
    
    echo "✅ Production build completed! Files ready in ./frontend/build/"
    
else
    echo "❌ Build failed!"
    exit 1
fi
