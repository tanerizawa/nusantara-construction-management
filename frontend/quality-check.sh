#!/bin/bash

echo "🔍 Running Frontend Code Quality Checks..."

# Check for unused dependencies
echo "📦 Checking for unused dependencies..."
npx depcheck --json > depcheck-report.json

# Run ESLint check
echo "🔍 Running ESLint..."
npx eslint src/ --ext .js,.jsx --format json > eslint-report.json || true

# Check bundle size
echo "📊 Analyzing bundle size..."
npm run build > build-output.log 2>&1 || true

# Generate report
echo "📋 Generating quality report..."
cat > quality-report.md << 'REPORT'
# Frontend Code Quality Report

## ESLint Issues
Check eslint-report.json for detailed issues

## Unused Dependencies  
Check depcheck-report.json for unused packages

## Bundle Size Analysis
Check build-output.log for build details

## Recommendations
1. Fix ESLint warnings
2. Remove unused dependencies
3. Optimize bundle size
4. Add performance monitoring

REPORT

echo "✅ Quality check completed!"
echo "📁 Reports generated:"
echo "   - eslint-report.json"
echo "   - depcheck-report.json" 
echo "   - quality-report.md"
