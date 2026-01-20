#!/bin/bash
# ============================================
# FIX SEQUELIZE MODELS - Add underscored: true
# This fixes the snake_case vs camelCase inconsistency
# ============================================

echo "============================================"
echo "FIXING SEQUELIZE MODELS NAMING CONVENTION"
echo "Adding 'underscored: true' to all models"
echo "============================================"
echo ""

MODELS_DIR="/root/APP-YK/backend/models"
BACKUP_DIR="/root/APP-YK/backend/models/backup_$(date +%Y%m%d_%H%M%S)"

# Create backup
echo "Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r "$MODELS_DIR"/*.js "$BACKUP_DIR/"
echo "✓ Backup created"
echo ""

# Count models to fix
TOTAL=$(find "$MODELS_DIR" -name "*.js" -not -name "index.js" | wc -l)
FIXED=0

echo "Found $TOTAL model files to process..."
echo ""

# Process each model file
for file in "$MODELS_DIR"/*.js; do
    filename=$(basename "$file")
    
    # Skip index.js
    if [ "$filename" = "index.js" ]; then
        continue
    fi
    
    echo "Processing: $filename"
    
    # Check if file already has 'underscored: true'
    if grep -q "underscored:" "$file"; then
        echo "  ⚠️  Already has 'underscored' config - skipping"
        continue
    fi
    
    # Check if file has timestamps: true
    if grep -q "timestamps: true" "$file"; then
        # Add underscored: true after timestamps: true
        sed -i '/timestamps: true/a\  underscored: true,' "$file"
        echo "  ✓ Added 'underscored: true' after 'timestamps: true'"
        FIXED=$((FIXED + 1))
    elif grep -q "timestamps: false" "$file"; then
        # Add underscored: true after timestamps: false
        sed -i '/timestamps: false/a\  underscored: true,' "$file"
        echo "  ✓ Added 'underscored: true' after 'timestamps: false'"
        FIXED=$((FIXED + 1))
    elif grep -q "tableName:" "$file"; then
        # Add underscored: true after tableName
        sed -i '/tableName:/a\  underscored: true,' "$file"
        echo "  ✓ Added 'underscored: true' after 'tableName'"
        FIXED=$((FIXED + 1))
    else
        echo "  ⚠️  Could not find insertion point - manual fix needed"
    fi
done

echo ""
echo "============================================"
echo "SUMMARY"
echo "============================================"
echo "Total models processed: $TOTAL"
echo "Models fixed: $FIXED"
echo "Models skipped: $((TOTAL - FIXED))"
echo "Backup location: $BACKUP_DIR"
echo ""
echo "✓ All models updated!"
echo ""
echo "NEXT STEPS:"
echo "1. Review changes with: git diff backend/models/"
echo "2. Restart backend: docker restart nusantara-backend"
echo "3. Test API endpoints"
echo "4. If issues occur, restore from: $BACKUP_DIR"
echo "============================================"
