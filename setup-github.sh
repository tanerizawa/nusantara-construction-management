#!/bin/bash

# YK Construction - GitHub Setup Script
# This script initializes the repository and prepares it for GitHub upload

echo "🚀 YK Construction - GitHub Setup"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "📦 Git repository already exists"
fi

# Create or update .gitignore
echo "📝 Setting up .gitignore..."

# Add all files
echo "📁 Adding files to Git..."
git add .

# Check git status
echo "📋 Git Status:"
git status --short

# Create initial commit
echo "💾 Creating initial commit..."
read -p "Enter commit message (default: 'Initial commit - YK Construction Management System'): " commit_message
commit_message=${commit_message:-"Initial commit - YK Construction Management System"}

git commit -m "$commit_message"

echo ""
echo "✅ Repository is ready for GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a new repository on GitHub (https://github.com/new)"
echo "2. Copy the repository URL"
echo "3. Run the following commands:"
echo ""
echo "   git remote add origin <your-repository-url>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🔗 Example:"
echo "   git remote add origin https://github.com/yourusername/yk-construction.git"
echo "   git branch -M main" 
echo "   git push -u origin main"
echo ""
echo "📚 Repository Information:"
echo "   - Total files: $(find . -type f | wc -l)"
echo "   - Backend files: $(find backend -type f -name '*.js' | wc -l) JavaScript files"
echo "   - Frontend files: $(find frontend/src -type f -name '*.js' | wc -l) React components"
echo "   - Documentation: $(find . -name '*.md' | wc -l) Markdown files"
echo ""
echo "🎯 Ready to upload to GitHub! 🚀"
