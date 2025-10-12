#!/bin/bash

# Fix Double /api/api Path Issue - Comprehensive Fix
# This script removes /api prefix from all API calls in frontend components
# Because api.js already has baseURL: '/api'

echo "🔧 Fixing double /api/api path issue in all frontend files..."
echo ""

# Counter
FIXED=0

# List of files to fix based on grep results
FILES=(
  "frontend/src/hooks/useApprovalActions.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useTandaTerima.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useAvailablePOs.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useTTForm.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/components/CreateTandaTerimaModal.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/components/CreateTandaTerimaForm.js"
  "frontend/src/components/berita-acara/hooks/useBeritaAcara.js"
  "frontend/src/components/workflow/rab-workflow/hooks/useRABItems.js"
  "frontend/src/components/workflow/budget-monitoring/hooks/useBudgetData.js"
  "frontend/src/components/workflow/purchase-orders/hooks/useRABItems.js"
  "frontend/src/components/workflow/approval/hooks/useApprovalActions.js"
  "frontend/src/components/workflow/approval/hooks/useApprovalData.js"
  "frontend/src/components/progress-payment/hooks/useApprovedBA.js"
  "frontend/src/components/progress-payment/hooks/useProgressPayments.js"
  "frontend/src/components/progress-payment/components/PaymentCreateForm.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Replace /api/projects/ with /projects/
    sed -i 's|`/api/projects/|`/projects/|g' "$file"
    sed -i "s|'/api/projects/|'/projects/|g" "$file"
    sed -i 's|"/api/projects/|"/projects/|g' "$file"
    
    # Also fix other /api/ patterns
    sed -i 's|`/api/auth/|`/auth/|g' "$file"
    sed -i "s|'/api/auth/|'/auth/|g" "$file"
    sed -i 's|"/api/auth/|"/auth/|g' "$file"
    
    ((FIXED++))
    echo "  ✅ Fixed"
  else
    echo "  ⚠️  File not found: $file"
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fixed $FIXED files"
echo ""
echo "Next steps:"
echo "1. docker-compose restart frontend"
echo "2. Test the application"
echo "3. Check console for 404 errors"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
