#!/bin/bash

# 🧪 Phase 1 Approval Workflow - Manual Testing Script
# Run this script to test all workflow endpoints

echo "=============================================="
echo "🧪 PHASE 1 WORKFLOW TESTING"
echo "=============================================="
echo ""

# Configuration
PROJECT_ID="your-project-id"  # TODO: Replace with actual project ID
MILESTONE_ID="your-milestone-id"  # TODO: Replace with actual milestone ID
COST_ID="your-cost-id"  # TODO: Replace with actual cost ID
TOKEN="your-jwt-token"  # TODO: Get from localStorage or login
BASE_URL="http://localhost:3000/api"

echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Milestone ID: $MILESTONE_ID"
echo "   Cost ID: $COST_ID"
echo ""

# Test 1: Submit Cost for Approval
echo "=============================================="
echo "TEST 1: Submit Cost for Approval (draft → submitted)"
echo "=============================================="
echo ""
echo "Request:"
echo "POST $BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/submit"
echo ""

curl -X POST "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-username: test-user" \
  | jq '.'

echo ""
echo "Expected: status = 'submitted', submitted_by = 'test-user', submitted_at = timestamp"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 2: Get Pending Costs
echo "=============================================="
echo "TEST 2: Get Pending Costs (submitted status)"
echo "=============================================="
echo ""
echo "Request:"
echo "GET $BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/pending"
echo ""

curl -X GET "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/pending" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

echo ""
echo "Expected: List of costs with status = 'submitted'"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 3: Approve Cost
echo "=============================================="
echo "TEST 3: Approve Cost (submitted → approved)"
echo "=============================================="
echo ""
echo "Request:"
echo "POST $BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/approve"
echo ""

curl -X POST "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-username: manager" \
  | jq '.'

echo ""
echo "Expected: status = 'approved', approved_by = 'manager', approved_at = timestamp"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 4: Reject Cost (requires reset to submitted first)
echo "=============================================="
echo "TEST 4: Reject Cost (submitted → rejected)"
echo "=============================================="
echo ""
echo "⚠️  Note: Cost must be in 'submitted' status to test this"
echo "   You may need to reset status manually first:"
echo "   UPDATE milestone_costs SET status='submitted' WHERE id='$COST_ID';"
echo ""
echo "Request:"
echo "POST $BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/reject"
echo ""

curl -X POST "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/reject" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-username: manager" \
  -d '{
    "reason": "Jumlah tidak sesuai dengan bukti transaksi. Harap cek kembali nota pembelian."
  }' \
  | jq '.'

echo ""
echo "Expected: status = 'rejected', rejected_by = 'manager', rejection_reason = '...'"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 5: Validation - Submit non-draft cost (should fail)
echo "=============================================="
echo "TEST 5: Validation - Submit non-draft cost"
echo "=============================================="
echo ""
echo "⚠️  This should FAIL with error message"
echo "   (Cost is not in draft status)"
echo ""

curl -X POST "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-username: test-user" \
  | jq '.'

echo ""
echo "Expected: HTTP 400 - Error message about status"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 6: Validation - Reject without reason (should fail)
echo "=============================================="
echo "TEST 6: Validation - Reject without reason"
echo "=============================================="
echo ""
echo "⚠️  This should FAIL with error message"
echo "   (Rejection reason is required)"
echo ""

curl -X POST "$BASE_URL/projects/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/reject" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-username: manager" \
  -d '{}' \
  | jq '.'

echo ""
echo "Expected: HTTP 400 - 'Rejection reason is required'"
echo ""
read -p "Press Enter to finish..."
echo ""

echo "=============================================="
echo "✅ TESTING COMPLETE"
echo "=============================================="
echo ""
echo "📊 Summary:"
echo "   - Test 1: Submit cost (draft → submitted)"
echo "   - Test 2: Get pending costs"
echo "   - Test 3: Approve cost (submitted → approved)"
echo "   - Test 4: Reject cost (submitted → rejected)"
echo "   - Test 5: Validation - Invalid status transition"
echo "   - Test 6: Validation - Missing rejection reason"
echo ""
echo "📝 Next Steps:"
echo "   1. Review test results above"
echo "   2. Check database: SELECT * FROM milestone_costs WHERE id='$COST_ID';"
echo "   3. Test frontend UI in browser"
echo "   4. Proceed to Phase 2 if all tests pass"
echo ""
echo "=============================================="
