# Field Naming Convention - item_type vs itemType

## 🔴 Critical Issue: Field Naming Inconsistency

### Problem
Sequelize model menggunakan `underscored: true` yang convert camelCase ke snake_case, TAPI field `item_type` di-define secara eksplisit sebagai snake_case. Ini menyebabkan konflik!

### Root Cause
```javascript
// ProjectRAB.js model
const ProjectRAB = sequelize.define('ProjectRAB', {
  item_type: {  // ❌ Explicitly defined as snake_case
    type: DataTypes.ENUM('material', 'service', 'labor', 'equipment', 'overhead'),
    // ...
  }
}, {
  underscored: true,  // ⚠️ This converts camelCase to snake_case
});
```

**Conflict:**
- Model field defined as: `item_type` (snake_case)
- Sequelize option: `underscored: true` (auto-convert)
- Frontend sends: `itemType` (camelCase)
- Backend was using: `itemType` in create() → **WRONG!**

## ✅ Solution: Consistent Snake_Case in Backend

### Rule: Backend ALWAYS uses snake_case for database fields

```javascript
// ✅ CORRECT - Backend receives both formats, uses snake_case
const { itemType, item_type } = req.body;
const receivedItemType = itemType || item_type; // Support both

await ProjectRAB.create({
  item_type: receivedItemType,  // ✅ Use snake_case for Sequelize
  // ...
});
```

```javascript
// ❌ WRONG - This will fail or use default value
await ProjectRAB.create({
  itemType: receivedItemType,  // ❌ Sequelize doesn't recognize this
  // ...
});
```

## 📋 Data Flow

### 1. Frontend → Backend (Request)
```javascript
// Frontend sends (camelCase)
{
  "itemType": "labor",
  "description": "borongan tukang",
  // ...
}
```

### 2. Backend Receives (Support Both)
```javascript
// Backend accepts both formats
const { itemType, item_type } = req.body;
const receivedItemType = itemType || item_type;
```

### 3. Backend → Database (snake_case)
```javascript
// Backend saves to Sequelize with snake_case
await ProjectRAB.create({
  item_type: receivedItemType,  // ✅ MUST use snake_case
  description: description,
  // ...
});
```

### 4. Database → Backend (snake_case)
```sql
-- Database stores as snake_case
SELECT item_type, description FROM project_rab;
-- Returns: item_type='labor', description='borongan tukang'
```

### 5. Backend → Frontend (Auto-Converted to camelCase)
```javascript
// Sequelize auto-converts to camelCase for response
{
  "itemType": "labor",  // ✅ Auto-converted by Sequelize underscored:true
  "description": "borongan tukang",
  // ...
}
```

## 🔧 Fixed Files

### backend/routes/projects/rab.routes.js

**POST /api/projects/:id/rab (Single Create)**
```javascript
const { 
  itemType,     // Frontend sends camelCase
  item_type     // Backend accepts snake_case
} = req.body;

// Support both formats
const receivedItemType = itemType || item_type;

// Validate
if (!receivedItemType) {
  return res.status(400).json({ error: 'itemType is required' });
}

// Save with snake_case
const rabItem = await ProjectRAB.create({
  item_type: receivedItemType,  // ✅ snake_case
  // ...
});
```

**POST /api/projects/:id/rab/bulk (Bulk Create)**
```javascript
const rabItems = items.map((item, index) => {
  // Support both formats from frontend
  const receivedItemType = item.itemType || item.item_type;
  
  // Validate
  if (!receivedItemType) {
    throw new Error(`Item at index ${index} missing itemType`);
  }
  
  return {
    item_type: receivedItemType,  // ✅ snake_case for Sequelize
    // ...
  };
});

await ProjectRAB.bulkCreate(rabItems);
```

## 🎯 Key Rules to Follow

### 1. Frontend (Always camelCase)
```javascript
// ✅ Frontend always uses camelCase
{
  itemType: 'labor',
  unitPrice: 100000,
  totalPrice: 1000000
}
```

### 2. Backend Request Handling (Accept Both)
```javascript
// ✅ Backend accepts both for compatibility
const { itemType, item_type } = req.body;
const value = itemType || item_type;
```

### 3. Backend Sequelize Operations (Always snake_case)
```javascript
// ✅ Creating/updating records: use snake_case
await ProjectRAB.create({
  item_type: value,        // snake_case
  unit_price: price,       // snake_case
  total_price: total       // snake_case
});

// ✅ Querying: use snake_case in where clause
await ProjectRAB.findAll({
  where: { item_type: 'labor' }  // snake_case
});
```

### 4. Backend Response (Auto-Converted)
```javascript
// ✅ Sequelize automatically converts to camelCase in response
// No manual conversion needed!
res.json({
  success: true,
  data: rabItems  // item_type → itemType (auto)
});
```

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Using camelCase in Sequelize create
```javascript
// ❌ WRONG - Sequelize won't save this correctly
await ProjectRAB.create({
  itemType: 'labor',  // This field doesn't exist in model!
  // Will use default value 'material' instead
});
```

### ❌ Mistake 2: Not accepting both formats
```javascript
// ❌ WRONG - Only accepts one format
const { itemType } = req.body;  // Frontend might send item_type

await ProjectRAB.create({
  item_type: itemType  // undefined if frontend sent item_type!
});
```

### ❌ Mistake 3: Manual camelCase conversion in response
```javascript
// ❌ WRONG - Unnecessary and error-prone
const response = {
  itemType: item.item_type,  // Sequelize does this automatically!
  unitPrice: item.unit_price
};
```

## ✅ Correct Pattern

```javascript
// ✅ CORRECT - Full flow
router.post('/:id/rab', async (req, res) => {
  // 1. Accept both formats
  const { itemType, item_type, description, unitPrice, unit_price } = req.body;
  
  // 2. Normalize to local variables
  const receivedItemType = itemType || item_type;
  const receivedUnitPrice = unitPrice || unit_price;
  
  // 3. Validate
  if (!receivedItemType) {
    return res.status(400).json({ error: 'itemType required' });
  }
  
  // 4. Save with snake_case
  const rabItem = await ProjectRAB.create({
    item_type: receivedItemType,      // snake_case
    description: description,          // same in both
    unit_price: receivedUnitPrice,    // snake_case
    // Sequelize handles conversion
  });
  
  // 5. Return (auto-converted to camelCase)
  res.json({
    success: true,
    data: rabItem  // item_type becomes itemType automatically!
  });
});
```

## 📊 Testing the Fix

### Test 1: Create Item with camelCase (Frontend)
```bash
curl -X POST http://localhost/api/projects/PROJECT_ID/rab \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "labor",
    "description": "Test Item",
    "unit": "hari",
    "quantity": 1,
    "unitPrice": 100000
  }'
```

**Expected Result:**
```sql
SELECT item_type, description FROM project_rab WHERE description = 'Test Item';
-- item_type | description
-- labor     | Test Item
```

### Test 2: Create Item with snake_case (Direct)
```bash
curl -X POST http://localhost/api/projects/PROJECT_ID/rab \
  -H "Content-Type: application/json" \
  -d '{
    "item_type": "service",
    "description": "Test Item 2",
    "unit": "ls",
    "quantity": 1,
    "unit_price": 200000
  }'
```

**Expected Result:**
```sql
SELECT item_type, description FROM project_rab WHERE description = 'Test Item 2';
-- item_type | description
-- service   | Test Item 2
```

### Test 3: Get Items (Response Format)
```bash
curl http://localhost/api/projects/PROJECT_ID/rab
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "itemType": "labor",      // ✅ camelCase
      "description": "...",
      "unitPrice": 100000,      // ✅ camelCase
      "totalPrice": 100000      // ✅ camelCase
    }
  ]
}
```

## 📝 Verification Checklist

- ✅ Model field defined as `item_type` (snake_case)
- ✅ Model uses `underscored: true`
- ✅ Backend accepts both `itemType` and `item_type` in request
- ✅ Backend normalizes to `item_type` for Sequelize operations
- ✅ Frontend receives `itemType` (auto-converted by Sequelize)
- ✅ Database stores `item_type` (snake_case)
- ✅ No manual conversion in response
- ✅ Logging shows received format for debugging

## 🎓 Why This Matters

**Before Fix:**
```javascript
// Backend was using camelCase
await ProjectRAB.create({
  itemType: 'labor'  // ❌ Sequelize doesn't recognize this field
});
// Result: Uses default value 'material' → WRONG!
```

**After Fix:**
```javascript
// Backend uses snake_case
await ProjectRAB.create({
  item_type: 'labor'  // ✅ Sequelize recognizes this field
});
// Result: Saves 'labor' correctly → CORRECT!
```

## 🚀 Impact

- ✅ **Consistency**: All database operations use snake_case
- ✅ **Compatibility**: Accepts both camelCase and snake_case from frontend
- ✅ **Reliability**: No more default value 'material' bugs
- ✅ **Maintainability**: Clear pattern to follow for future fields
- ✅ **Auto-Conversion**: Sequelize handles response conversion automatically

---

**Status**: ✅ Fixed
**Last Updated**: October 15, 2025
**Files Modified**: backend/routes/projects/rab.routes.js
**Testing**: Required after deployment
