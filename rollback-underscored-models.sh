#!/bin/bash

# ============================================================================
# ROLLBACK: Remove underscored: true from all Sequelize models
# Reason: Database has too many camelCase columns that need manual migration
# Strategy: Keep models as-is, fix database later when we can plan properly
# ============================================================================

MODELS_DIR="/root/APP-YK/backend/models"
BACKUP_DIR="/root/APP-YK/backend/models/backup_20251013_055107"

echo "🔄 Rolling back Sequelize models..."
echo "📂 Backup location: $BACKUP_DIR"
echo ""

# Count files
TOTAL=$(ls -1 "$BACKUP_DIR"/*.js 2>/dev/null | wc -l)
echo "📊 Found $TOTAL model files in backup"
echo ""

# Restore from backup
cp -v "$BACKUP_DIR"/*.js "$MODELS_DIR/" 2>&1 | head -10
echo "..."
echo ""

# Verify
echo "✅ Rollback complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart backend: docker restart nusantara-backend"
echo "   2. Test API endpoints"
echo "   3. Plan proper database migration to snake_case"
echo ""
echo "💡 Why rollback?"
echo "   - Database has 100+ camelCase columns across multiple tables"
echo "   - Adding field overrides to all models is error-prone"
echo "   - Better to do comprehensive database migration first"
echo "   - Then enable underscored: true globally"
