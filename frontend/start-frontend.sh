#!/bin/bash

# YK Construction SaaS - Frontend Startup Script
echo "🚀 Starting YK Construction SaaS Frontend..."

# Set proper PATH for Node.js
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
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

# Check if react-scripts is available
if [ ! -f "node_modules/.bin/react-scripts" ]; then
    echo "📦 Installing react-scripts..."
    npm install react-scripts --save
fi

echo "🎯 Starting development server..."
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔄 Backend should be running at: http://localhost:5001"
echo ""

# Start the development server
npm start
