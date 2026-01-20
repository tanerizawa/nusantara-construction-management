#!/bin/bash

# Fix dashboard controller - Remove deleted_at checks and fix column names

cd /root/APP-YK/backend/controllers

# Backup first
cp dashboardController.js dashboardController.js.backup_$(date +%Y%m%d_%H%M%S)

# Remove deleted_at IS NULL from WHERE clauses
sed -i 's/WHERE deleted_at IS NULL//g' dashboardController.js
sed -i 's/AND deleted_at IS NULL//g' dashboardController.js

# Fix project_rab queries - use unit_price and total_price instead of estimated_cost
sed -i 's/estimated_cost \* quantity/total_price/g' dashboardController.js
sed -i 's/r\.estimated_cost/r.unit_price/g' dashboardController.js
sed -i 's/(r\.estimated_cost \* r\.quantity)/r.total_price/g' dashboardController.js
sed -i 's/estimatedCost: parseFloat(item\.estimated_cost)/unitPrice: parseFloat(item.unit_price)/g' dashboardController.js
sed -i 's/parseFloat(item\.total_amount)/parseFloat(item.total_price)/g' dashboardController.js

# Fix projects table columns - use name instead of project_name and project_code
sed -i 's/p\.project_name/p.name as project_name/g' dashboardController.js
sed -i 's/p\.project_code/p.name as project_code/g' dashboardController.js

echo "Dashboard controller fixed!"
