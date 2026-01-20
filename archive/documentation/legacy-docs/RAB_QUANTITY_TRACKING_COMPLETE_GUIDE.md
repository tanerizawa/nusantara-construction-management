# RAB Quantity Tracking - Complete Implementation Guide

## Problem Statement

**Original Issue:**  
Setelah membuat PO partial (500 qty dari 1000 yang tersedia), tabel list PO masih menunjukkan quantity tersedia yang sama (1000), tidak berkurang menjadi 500.

**Root Cause:**  
Backend tidak mencatat PO items ke tabel `rab_purchase_tracking` saat PO dibuat, sehingga:
- Purchase summary selalu return totalPurchased = 0
- Frontend calculate availableQuantity = totalQty - 0 = total quantity (tidak berkurang)

## Solution Architecture

### Database Structure

```sql
-- Table: rab_purchase_tracking
CREATE TABLE rab_purchase_tracking (
  id SERIAL PRIMARY KEY,
  projectId VARCHAR(255) NOT NULL,
  rabItemId VARCHAR(255) NOT NULL,  -- UUID dari RAB item
  poNumber VARCHAR(255),
  quantity DECIMAL(10,2) NOT NULL,
  unitPrice DECIMAL(15,2) NOT NULL,
  totalAmount DECIMAL(15,2) NOT NULL,
  purchaseDate TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CREATE PO WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. User creates PO with 500 qty from RAB item (total: 1000)
   ↓
2. Frontend sends POST /api/purchase-orders with:
   {
     projectId: "2025PJK001",
     poNumber: "PO-xxx",
     items: [{
       inventoryId: "b637468b-...",  // RAB item UUID
       itemName: "URUGAN TANAH",
       quantity: 500,
       unitPrice: 50000,
       totalPrice: 25000000
     }]
   }
   ↓
3. Backend (purchase-orders_db.js):
   a. Start Transaction
   b. Create PO record in purchase_orders table
   c. ✅ NEW: Create tracking record in rab_purchase_tracking:
      {
        projectId: "2025PJK001",
        rabItemId: "b637468b-...",  // from item.inventoryId
        poNumber: "PO-xxx",
        quantity: 500,
        unitPrice: 50000,
        totalAmount: 25000000,
        purchaseDate: orderDate,
        status: "pending"
      }
   d. Commit Transaction
   ↓
4. Frontend refreshes RAB items
   ↓
5. Frontend calls GET /api/rab-tracking/projects/:projectId/purchase-summary
   ↓
6. Backend calculates:
   SELECT rabItemId, 
          SUM(quantity) as totalPurchased
   FROM rab_purchase_tracking
   WHERE projectId = '2025PJK001'
   GROUP BY rabItemId
   
   Result: {
     rabItemId: "b637468b-...",
     totalPurchased: 500  ← ✅ Now correctly tracked!
   }
   ↓
7. Frontend (useRABItems hook) calculates:
   availableQuantity = 1000 - 500 = 500 ✅
   ↓
8. UI displays: "Qty Tersedia: 500.00 M3" ✅
```

## Implementation Details

### Backend Changes

#### File: `/backend/routes/purchase-orders_db.js`

**1. Import/Define RABPurchaseTracking Model**

```javascript
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const RABPurchaseTracking = sequelize.define('RABPurchaseTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rabItemId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  poNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'rab_purchase_tracking',
  timestamps: true
});
```

**2. POST /api/purchase-orders - Create with Tracking**

```javascript
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { error, value } = purchaseOrderSchema.validate(req.body);
    if (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Create PO
    const order = await PurchaseOrder.create(value, { transaction: t });

    // ✅ Record to RABPurchaseTracking for quantity tracking
    const trackingRecords = value.items.map(item => ({
      projectId: value.projectId,
      rabItemId: item.inventoryId,  // inventoryId = RAB item UUID
      poNumber: value.poNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalPrice,
      purchaseDate: value.orderDate,
      status: value.status || 'pending'
    }));

    await RABPurchaseTracking.bulkCreate(trackingRecords, { transaction: t });

    await t.commit();

    console.log(`✅ PO ${value.poNumber} created with ${trackingRecords.length} items tracked`);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Purchase order created successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create purchase order',
      details: error.message
    });
  }
});
```

**3. PUT /api/purchase-orders/:id - Update with Status Sync**

```javascript
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.findByPk(id);
    
    if (!order) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    // ... validation ...

    await order.update(value, { transaction: t });

    // ✅ Sync status to tracking records
    if (value.status && value.status !== order.status) {
      await RABPurchaseTracking.update(
        { status: value.status },
        { 
          where: { poNumber: order.poNumber },
          transaction: t 
        }
      );
      console.log(`✅ Updated status for PO ${order.poNumber} tracking records to ${value.status}`);
    }

    await t.commit();

    res.json({
      success: true,
      data: order,
      message: 'Purchase order updated successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update purchase order',
      details: error.message
    });
  }
});
```

**4. DELETE /api/purchase-orders/:id - Delete with Cascade**

```javascript
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.findByPk(id);
    
    if (!order) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    // ✅ Delete tracking records first
    await RABPurchaseTracking.destroy({
      where: { poNumber: order.poNumber },
      transaction: t
    });

    await order.destroy({ transaction: t });

    await t.commit();

    console.log(`✅ PO ${order.poNumber} and its tracking records deleted`);

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete purchase order',
      details: error.message
    });
  }
});
```

### Frontend Flow

#### File: `/frontend/src/components/workflow/purchase-orders/hooks/useRABItems.js`

**Fetch RAB Items with Purchase Summary:**

```javascript
const fetchRABItems = useCallback(async () => {
  try {
    setLoading(true);
    
    // 1. Get RAB items
    const response = await fetch(`/api/projects/${projectId}/rab`);
    const result = await response.json();
    const rabItemsData = result.data;
    
    // 2. Get purchase summary (includes totalPurchased from tracking)
    const summaryResponse = await fetch(`/api/rab-tracking/projects/${projectId}/purchase-summary`);
    const summaryResult = await summaryResponse.json();
    
    // Convert to object for easy lookup
    const purchaseSummary = summaryResult.data.reduce((acc, s) => {
      acc[String(s.rabItemId)] = s;
      return acc;
    }, {});
    
    // 3. Enhance RAB items with purchase data
    const enhancedRABItems = rabItemsData.map(item => {
      const purchaseData = purchaseSummary[String(item.id)] || {};
      const totalPurchased = parseFloat(purchaseData.totalPurchased || 0);
      const totalQty = parseFloat(item.quantity) || 0;
      
      // ✅ Calculate available quantity
      const remainingQuantity = Math.max(0, totalQty - totalPurchased);
      const availableQuantity = remainingQuantity;
      
      return {
        ...item,
        remainingQuantity,
        availableQuantity,
        totalPurchased,
        purchaseProgress: totalQty > 0 ? (totalPurchased / totalQty) * 100 : 0
      };
    });
    
    setRABItems(enhancedRABItems);
    setFilteredRABItems(enhancedRABItems);
  } catch (err) {
    console.error('Error fetching RAB items:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [projectId]);
```

#### File: `/frontend/src/components/workflow/purchase-orders/ProjectPurchaseOrders.js`

**Refresh After PO Creation:**

```javascript
const handleCreatePO = async (poData) => {
  try {
    const result = await createPurchaseOrder(poData);
    
    if (result.success) {
      // ✅ Refresh RAB items to update quantities
      await fetchRABItems();
      
      // Reset form and notify
      setCreatePOStep('rab-selection');
      setSelectedRABItems([]);
      alert(`✅ Purchase Order ${result.data.poNumber} berhasil dibuat!`);
    }
  } catch (error) {
    console.error('Error creating PO:', error);
    alert('Gagal membuat PO: ' + error.message);
  }
};
```

#### File: `/frontend/src/components/workflow/purchase-orders/views/RABSelectionView.js`

**Display Available Quantity:**

```javascript
<td className="px-6 py-4 text-right whitespace-nowrap">
  <span className="text-sm font-bold text-[#30D158]">
    {availableQty.toFixed(2)}
  </span>
  <span className="text-xs text-[#8E8E93] ml-1">
    {item.unit || item.satuan}
  </span>
</td>
```

## Testing Procedure

### Test Case 1: Create Partial PO

**Setup:**
- RAB Item: URUGAN TANAH
- Total Quantity: 1000 M3
- Unit Price: Rp 50,000

**Steps:**
1. Navigate to Purchase Orders → Create New
2. Select RAB item "URUGAN TANAH"
3. Set quantity: **500** (partial, not full 1000)
4. Fill supplier info
5. Submit PO

**Expected Results:**
✅ PO created successfully  
✅ Backend logs: `✅ PO PO-xxx created with 1 items tracked`  
✅ Database: New record in `rab_purchase_tracking`:
   - rabItemId: `b637468b-5ecb-4819-a4f4-97e7b99c912f`
   - quantity: 500
   - status: pending

**Verification:**
1. Go back to RAB selection
2. Check "Qty Tersedia" column
3. **Expected**: 500.00 M3 (1000 - 500)
4. **Before Fix**: Still showed 1000.00 M3

### Test Case 2: Create Second PO (Remaining Quantity)

**Setup:**
- Same RAB item
- Available after first PO: 500 M3

**Steps:**
1. Create new PO for same item
2. Try to set quantity: 600 (more than available)

**Expected Results:**
❌ Validation error: "Quantity exceeds available (500 M3)"

**Steps (continued):**
3. Set quantity: **300** (within available)
4. Submit PO

**Expected Results:**
✅ Second PO created  
✅ Qty Tersedia: 200.00 M3 (1000 - 500 - 300)

### Test Case 3: Delete PO (Restore Quantity)

**Setup:**
- First PO: 500 M3 (status: pending)
- Second PO: 300 M3 (status: approved)
- Current available: 200 M3

**Steps:**
1. Delete first PO (500 M3, pending)
2. Refresh page

**Expected Results:**
✅ PO deleted  
✅ Backend logs: `✅ PO PO-xxx and its tracking records deleted`  
✅ Qty Tersedia: 700.00 M3 (1000 - 300, first PO restored)

### Test Case 4: Update PO Status

**Setup:**
- PO status: pending

**Steps:**
1. Update PO status to "approved"

**Expected Results:**
✅ Status updated  
✅ Backend logs: `✅ Updated status for PO PO-xxx tracking records to approved`  
✅ Tracking records status synced

## Monitoring & Debugging

### Backend Logs to Watch

```bash
# Check PO creation tracking
docker logs nusantara-backend --tail 100 | grep "✅ PO"

# Check transaction commits
docker logs nusantara-backend --tail 100 | grep "Executing (default): INSERT INTO"

# Check tracking table queries
docker logs nusantara-backend --tail 100 | grep "rab_purchase_tracking"
```

### API Testing

```bash
# Test purchase summary endpoint
curl -s "https://nusantaragroup.co/api/rab-tracking/projects/2025PJK001/purchase-summary" | python3 -m json.tool

# Check specific RAB item tracking
# Look for rabItemId matching your item UUID
```

### Database Verification

```sql
-- Check tracking records
SELECT * FROM rab_purchase_tracking 
WHERE projectId = '2025PJK001' 
ORDER BY purchaseDate DESC;

-- Verify totals
SELECT 
  rabItemId,
  COUNT(*) as po_count,
  SUM(quantity) as total_purchased,
  SUM(totalAmount) as total_amount
FROM rab_purchase_tracking
WHERE projectId = '2025PJK001'
GROUP BY rabItemId;
```

## Troubleshooting

### Issue: Qty Tersedia Not Updating

**Symptoms:**
- PO created successfully
- But available quantity still shows original value

**Diagnosis Steps:**
1. Check backend logs for tracking creation:
   ```bash
   docker logs nusantara-backend | grep "bulkCreate\|items tracked"
   ```
   
2. Verify tracking records exist:
   ```bash
   curl "https://nusantaragroup.co/api/rab-tracking/projects/2025PJK001/purchase-summary"
   ```

3. Check if rabItemId matches:
   - PO item.inventoryId: `b637468b-5ecb-4819-a4f4-97e7b99c912f`
   - Should match tracking.rabItemId
   - Should match RAB item.id

**Common Causes:**
- ❌ Transaction rollback due to error
- ❌ inventoryId mismatch (wrong UUID)
- ❌ Frontend not refreshing after PO create
- ❌ Backend code not loaded (need restart)

**Solutions:**
1. Restart backend: `docker-compose restart backend`
2. Check error logs for transaction failures
3. Verify UUID mapping is correct
4. Ensure frontend calls `fetchRABItems()` after PO creation

### Issue: Backend Not Saving Tracking Records

**Check:**
```bash
# Look for transaction commits
docker logs nusantara-backend --tail 200 | grep -A 3 "INSERT INTO.*purchase_orders"
```

**If no bulkCreate seen:**
- Code may not be loaded
- Transaction may be rolling back silently
- Check for JavaScript syntax errors

**Solution:**
1. Restart backend
2. Check backend startup logs for errors
3. Verify code syntax is correct

## Status & Next Steps

### ✅ Completed
- Backend purchase-orders_db.js updated
- RABPurchaseTracking model defined
- Transaction-safe create/update/delete
- Frontend already refreshes on PO create
- Documentation complete

### 🧪 Testing Required
- [ ] Create new PO and verify tracking
- [ ] Verify qty tersedia updates
- [ ] Test partial PO quantities
- [ ] Test multiple POs for same item
- [ ] Test PO deletion restores quantity

### 📋 Deployment Checklist
- [x] Code changes committed
- [x] Backend restarted
- [ ] Test in development
- [ ] Verify logs show tracking
- [ ] Test with real data
- [ ] Deploy to production

---

**Documentation Created**: 2025-10-09  
**Author**: GitHub Copilot  
**Status**: Implementation Complete, Testing Required
