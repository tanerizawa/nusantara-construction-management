# 🚀 Quick Start Guide - Approval Integration

**For Developers continuing Week 2+ Implementation**

---

## 📦 What's Been Done (Week 1)

✅ **4 Reusable Components Created** (1,136 lines total):
- `ApprovalSection.js` - Main container component
- `ApprovalItemCard.js` - Individual item card
- `useApprovalActions.js` - Approval actions hook
- `approvalHelpers.js` - Utility functions

✅ **RAB Page Integrated** - Pilot implementation complete

---

## 🎯 How to Use the Components

### Basic Integration (5 minutes)

```jsx
// 1. Import components
import ApprovalSection from './approval/ApprovalSection';
import useApprovalActions from '../../hooks/useApprovalActions';
import { getPendingApprovalItems } from '../../utils/approvalHelpers';

// 2. Setup hook
const {
  markAsReviewed,
  approveItem,
  rejectItem
} = useApprovalActions('rab', projectId, onSuccess, onError);

// 3. Filter pending items
const pendingItems = getPendingApprovalItems(allItems);

// 4. Render component
<ApprovalSection
  items={pendingItems}
  type="rab"  // or 'po', 'ba', 'tt'
  onApprove={approveItem}
  onReject={rejectItem}
  onReview={markAsReviewed}
/>
```

---

## 📋 Integration Checklist

### For Each Page (RAB, PO, BA, TT):

- [ ] **Import components** (3 imports)
- [ ] **Setup approval hook** with success/error callbacks
- [ ] **Filter pending items** using helper
- [ ] **Place ApprovalSection** after summary cards
- [ ] **Test basic functionality** (approve, reject, review)
- [ ] **Test search & filter**
- [ ] **Test bulk actions**
- [ ] **Verify synchronization** (events working)
- [ ] **Check responsive design** (mobile view)
- [ ] **Update documentation**

---

## 🎨 Customization Options

### ApprovalSection Props

```javascript
<ApprovalSection
  items={[]}              // Required: Array of items
  type="rab"              // Required: 'rab'|'po'|'ba'|'tt'
  onApprove={fn}          // Optional: Approve callback
  onReject={fn}           // Optional: Reject callback
  onReview={fn}           // Optional: Review callback
  isCollapsible={true}    // Optional: Allow collapse
  autoExpand={true}       // Optional: Auto-expand if items > 0
  showFilters={true}      // Optional: Show search/filter
  className=""            // Optional: Additional CSS
/>
```

### Type Configuration

Each type has specific colors/icons:
- **RAB**: Blue (#0A84FF)
- **PO**: Purple (#BF5AF2)
- **BA**: Green (#34C759)
- **TT**: Orange (#FF9500)

---

## 🔧 Helper Functions Quick Reference

```javascript
// Get items needing approval
const pending = getPendingApprovalItems(items);

// Group by status
const grouped = groupItemsByApprovalStatus(items);
// Returns: { draft: [], pending_approval: [], reviewed: [], approved: [], rejected: [] }

// Calculate stats
const stats = calculateApprovalStats(items);
// Returns: { total, draft, pending, reviewed, approved, rejected, pendingCount, approvalRate }

// Check permissions
const canApprove = canApproveItem(item, user);

// Get badge config
const badge = getApprovalStatusBadge(status);

// Sort by priority
const sorted = sortItemsByApprovalPriority(items);

// Validate action
const { valid, error } = validateApprovalAction(item, 'approve');
```

---

## 📡 API Endpoints Expected

The hook expects these endpoints:

```
PATCH /api/projects/:projectId/:type/:itemId/status
POST  /api/projects/:projectId/:type/:itemId/approve
POST  /api/projects/:projectId/:type/:itemId/reject
```

**Request/Response Format:**

```javascript
// Review
PATCH /api/projects/123/rab/456/status
Body: { approval_status: 'reviewed', notes: '...' }

// Approve
POST /api/projects/123/rab/456/approve
Body: { notes: '...', approval_date: '2025-10-12T...' }

// Reject
POST /api/projects/123/rab/456/reject
Body: { reason: 'Budget too high', rejection_date: '2025-10-12T...' }

// All return:
{
  success: true,
  data: { id, code, approval_status, ... }
}
```

---

## 🎭 Events System

### Events Dispatched

```javascript
// On approval status change
window.dispatchEvent(new CustomEvent('approval-status-changed', {
  detail: {
    type: 'rab',
    itemId: 123,
    status: 'approved',
    item: {...}
  }
}));

// Show notification
window.dispatchEvent(new CustomEvent('show-notification', {
  detail: {
    type: 'success',
    message: 'RAB-001 berhasil diapprove',
    duration: 3000
  }
}));
```

### Listen to Events

```javascript
useEffect(() => {
  const handleStatusChange = (e) => {
    const { type, itemId, status } = e.detail;
    if (type === 'rab') {
      refetch(); // Refresh data
    }
  };

  window.addEventListener('approval-status-changed', handleStatusChange);
  return () => window.removeEventListener('approval-status-changed', handleStatusChange);
}, [refetch]);
```

---

## 🧪 Testing Tips

### Manual Testing

```bash
# 1. Start dev server
cd /root/APP-YK/frontend
npm start

# 2. Test scenarios:
- Create RAB items with draft status
- Check if approval section appears
- Try search (should filter items)
- Try status filter (draft/pending/reviewed)
- Click Review → Status should change
- Click Approve → Item approved
- Click Reject → Modal opens
- Enter reason → Item rejected
- Try bulk actions → All items processed
- Check responsive (resize browser)
```

### Unit Testing (Jest)

```javascript
// Example test structure
describe('ApprovalSection', () => {
  it('should render pending items', () => {});
  it('should filter by search query', () => {});
  it('should handle approve action', () => {});
  it('should show reject modal', () => {});
  it('should handle bulk approve', () => {});
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Approval section not showing
**Solution**: Check if `items` array has pending items (draft/pending_approval/reviewed status)

### Issue: Actions not working
**Solution**: 
1. Check if callbacks are passed correctly
2. Check backend API endpoints exist
3. Check console for errors
4. Verify projectId is correct

### Issue: Synchronization not working
**Solution**: 
1. Check event listeners are registered
2. Check `useRABSync` hook is used
3. Verify `refetch()` is called on success

### Issue: Styling looks wrong
**Solution**:
1. Check Tailwind CSS is configured
2. Check color classes are not purged
3. Verify existing design system classes

---

## 📈 Next Steps (Week 2)

### Priority 1: Testing
- [ ] Manual test all functionality
- [ ] Write Jest unit tests
- [ ] Code review

### Priority 2: PO Integration
- [ ] Analyze PurchaseOrdersManager.js
- [ ] Integrate ApprovalSection
- [ ] Test PO approval flow

### Priority 3: Backend API
- [ ] Create review/approve/reject endpoints
- [ ] Test API integration
- [ ] Handle error cases

---

## 📞 Help & Resources

**Files to Reference**:
- `/root/APP-YK/frontend/src/components/workflow/approval/ApprovalSection.js`
- `/root/APP-YK/frontend/src/components/workflow/approval/ApprovalItemCard.js`
- `/root/APP-YK/frontend/src/hooks/useApprovalActions.js`
- `/root/APP-YK/frontend/src/utils/approvalHelpers.js`

**Documentation**:
- Analysis: `docs/analysis/APPROVAL_INTEGRATION_REDESIGN_ANALYSIS.md`
- Week 1 Report: `docs/reports/APPROVAL_INTEGRATION_WEEK1_IMPLEMENTATION_COMPLETE.md`

**Example Implementation**:
- RAB Integration: `/root/APP-YK/frontend/src/components/workflow/ProjectRABWorkflow.js`

---

## 💡 Pro Tips

1. **Reuse, don't recreate** - All components are fully reusable
2. **Follow the pattern** - Use same integration pattern as RAB page
3. **Test incrementally** - Test each page before moving to next
4. **Use helper functions** - Don't reinvent logic, use helpers
5. **Document changes** - Update docs as you go

---

**Last Updated**: October 12, 2025  
**Status**: Week 1 Complete - Ready for Week 2  
**Developer**: Your team here 👨‍💻
