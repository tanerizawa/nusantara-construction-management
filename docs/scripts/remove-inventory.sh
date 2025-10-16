#!/bin/bash

echo "🗑️  Removing Inventory components and routes..."

# Remove frontend files
rm -f frontend/src/pages/Inventory.js
rm -f frontend/src/routes/InventoryRoutes.js
rm -f frontend/src/components/InventoryDashboard.js
rm -f frontend/src/components/InventoryModals.js
rm -f frontend/src/components/Operations/InventoryTabs.js

echo "✅ Inventory files removed"
