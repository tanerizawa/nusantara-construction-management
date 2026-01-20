#!/bin/bash

# ============================================================================
# Enable underscored: true for ALL Sequelize models
# Now that database is 100% snake_case, we can safely enable this globally
# ============================================================================

MODELS_DIR="/root/APP-YK/backend/models"

echo "🔧 Enabling underscored: true for ALL models..."
echo ""

COUNT=0
for model in "$MODELS_DIR"/*.js; do
  filename=$(basename "$model")
  
  # Skip index.js
  if [ "$filename" = "index.js" ]; then
    continue
  fi
  
  # Check if model already has underscored: true
  if grep -q "underscored: true" "$model"; then
    echo "  ✓ $filename (already has underscored: true)"
    continue
  fi
  
  # Check if model has timestamps: true
  if grep -q "timestamps: true" "$model"; then
    echo "  + Adding underscored to $filename..."
    
    # Add underscored: true after timestamps: true
    sed -i 's/timestamps: true,$/timestamps: true,\n  underscored: true,/' "$model"
    
    ((COUNT++))
  else
    echo "  ⚠ Skipping $filename (no timestamps config found)"
  fi
done

echo ""
echo "✅ Added underscored: true to $COUNT models"
echo ""
echo "📋 Next: docker restart nusantara-backend"
