#!/bin/bash

# ============================================================================
# Remove underscored: true from models (except User.js which is already fixed)
# Keep only models that have been properly fixed with field overrides
# ============================================================================

MODELS_DIR="/root/APP-YK/backend/models"

echo "🔧 Removing underscored: true from models..."
echo ""

# List of models to keep underscored: true (already fixed)
KEEP_MODELS=("User.js")

# Get all models with underscored: true
MODELS_TO_FIX=$(cd "$MODELS_DIR" && grep -l "underscored: true" *.js | grep -v -E "$(IFS=\| ; echo "${KEEP_MODELS[*]}")")

COUNT=0
for model in $MODELS_TO_FIX; do
  if [ -f "$MODELS_DIR/$model" ]; then
    echo "  Processing $model..."
    
    # Remove the underscored: true line (including trailing comma)
    sed -i '/underscored: true,\?/d' "$MODELS_DIR/$model"
    
    ((COUNT++))
  fi
done

echo ""
echo "✅ Processed $COUNT models"
echo "✅ Kept underscored: true in: ${KEEP_MODELS[@]}"
echo ""
echo "📋 Next: docker restart nusantara-backend"
