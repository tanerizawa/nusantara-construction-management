#!/bin/bash

# Fix Fetch API Paths - REVERT for raw fetch() calls
# Raw fetch() needs full path /api/... because it doesn't use axios baseURL
# Only api.get() uses baseURL and should NOT have /api prefix

echo "🔧 Fixing fetch() API paths (adding /api back for raw fetch calls)..."
echo ""

FIXED=0

# List of files that use raw fetch() (not api.js)
FILES=(
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useTandaTerima.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useAvailablePOs.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/hooks/useTTForm.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/components/CreateTandaTerimaModal.js"
  "frontend/src/components/tanda-terima/tanda-terima-manager/components/CreateTandaTerimaForm.js"
  "frontend/src/components/berita-acara/hooks/useBeritaAcara.js"
  "frontend/src/components/workflow/rab-workflow/hooks/useRABItems.js"
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
    
    # Check if file uses fetch() - if yes, add /api back
    if grep -q "fetch(\`/" "$file" || grep -q "fetch('/" "$file" || grep -q 'fetch("/' "$file"; then
      # Revert: Add /api back for fetch() calls only
      sed -i 's|fetch(`/projects/|fetch(`/api/projects/|g' "$file"
      sed -i "s|fetch('/projects/|fetch('/api/projects/|g" "$file"
      sed -i 's|fetch("/projects/|fetch("/api/projects/|g' "$file"
      
      sed -i 's|fetch(`/berita-acara|fetch(`/api/berita-acara|g' "$file"
      sed -i "s|fetch('/berita-acara|fetch('/api/berita-acara|g" "$file"
      
      sed -i 's|fetch(`/progress-payments|fetch(`/api/progress-payments|g' "$file"
      sed -i "s|fetch('/progress-payments|fetch('/api/progress-payments|g" "$file"
      
      sed -i 's|fetch(`/delivery-receipts|fetch(`/api/delivery-receipts|g' "$file"
      sed -i "s|fetch('/delivery-receipts|fetch('/api/delivery-receipts|g" "$file"
      
      ((FIXED++))
      echo "  ✅ Fixed fetch() calls"
    else
      echo "  ⏭️  No fetch() calls, skipped"
    fi
  else
    echo "  ⚠️  File not found: $file"
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fixed $FIXED files"
echo ""
echo "📋 Summary:"
echo "  - fetch() calls: Use /api/projects/... (full path)"
echo "  - api.get() calls: Use /projects/... (no /api prefix)"
echo ""
echo "Next steps:"
echo "1. docker-compose restart frontend"
echo "2. Test RAB workflow"
echo "3. Check for JSON parse errors"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
