#!/bin/bash

# GitHub Repository Setup Script
# Ganti USERNAME dengan username GitHub Anda

echo "🚀 Setting up GitHub repository for Nusantara Construction Management System"

# Tambahkan remote origin (ganti USERNAME dengan username GitHub Anda)
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/tanerizawa/nusantara-construction-management.git

# Push ke GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Repository berhasil di-backup ke GitHub!"
echo "🔗 URL Repository: https://github.com/tanerizawa/nusantara-construction-management"

# Tampilkan informasi repository
echo ""
echo "📊 Repository Information:"
echo "===========================================" 
echo "Name: Nusantara Construction Management"
echo "Description: Full-stack construction management system"
echo "Technologies: React.js, Node.js, PostgreSQL, Docker"
echo "Features: Project Management, Financial Tracking, Inventory, HR"
echo "Domain: https://nusantaragroup.co"
echo "==========================================="
