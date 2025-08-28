#!/bin/bash

# YK Construction SaaS - Backend Startup Script
echo "🚀 Starting YK Construction SaaS Backend..."

# Set proper PATH for Node.js
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Make sure you're in the backend directory."
    exit 1
fi

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir -p logs
fi

# Check environment configuration
if [ ! -f ".env.development" ]; then
    echo "⚠️  Warning: .env.development not found. Using default configuration."
fi

echo "🎯 Starting backend server..."
echo "🌐 Backend API will be available at: http://localhost:5001"
echo "📊 Health Check: http://localhost:5001/health"
echo "🔄 Frontend should be running at: http://localhost:3000"
echo ""

# Start the server with development environment
NODE_ENV=development node server.js
