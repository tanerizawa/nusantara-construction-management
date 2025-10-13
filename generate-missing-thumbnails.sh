#!/bin/bash

# Generate thumbnails for existing photos
# This will create thumbnails for photos that don't have them yet

echo "🔄 Generating Thumbnails for Existing Photos"
echo "=============================================="
echo ""

# Run the migration script that was created earlier
docker-compose exec backend node /app/scripts/migrate-thumbnails.js

echo ""
echo "✅ Thumbnail generation complete!"
echo ""
echo "Run diagnostic to verify:"
echo "bash /root/APP-YK/test-thumbnail-system.sh"
