# Fix: Missing /api/subsidiaries/statistics Endpoint

**Tanggal:** 17 Oktober 2025  
**Status:** ✅ FIXED

## 🐛 Problem

Frontend error saat membuka halaman Subsidiaries:

```
GET /api/subsidiaries/statistics 404 (Not Found)
API Error: {url: '/subsidiaries/statistics', status: 404, ...}
Error fetching subsidiary statistics: Error: Failed to fetch data
```

## 🔍 Root Cause

**Endpoint path mismatch!**

- **Frontend request:** `GET /api/subsidiaries/statistics`
- **Backend endpoint:** `GET /api/subsidiaries/stats/summary` ❌

Frontend code di `services/api.js`:
```javascript
export const subsidiaryAPI = {
  getStats: () => apiService.get('/subsidiaries/statistics'),
  // ^-- Request ke /statistics
}
```

Backend code di `routes/subsidiaries.js`:
```javascript
router.get('/stats/summary', async (req, res) => {
  // ^-- Only handles /stats/summary
})
```

## 🔧 Solution

**Added new endpoint** `/api/subsidiaries/statistics` yang compatible dengan frontend expectation.

**Location:** `/backend/routes/subsidiaries.js` (before `router.get('/:id')`)

**Added:**
```javascript
/**
 * @route   GET /api/subsidiaries/statistics
 * @desc    Get subsidiaries statistics (alias for /stats/summary)
 * @access  Private
 */
router.get('/statistics', async (req, res) => {
  try {
    const totalCount = await Subsidiary.count();
    const activeCount = await Subsidiary.count({ where: { status: 'active' } });
    const inactiveCount = totalCount - activeCount;

    // Count by specialization
    const { sequelize } = require('../config/database');
    const bySpecialization = await Subsidiary.findAll({
      where: { status: 'active' },
      attributes: [
        'specialization',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['specialization'],
      raw: true
    });

    // Calculate total employees
    const subsidiaries = await Subsidiary.findAll({
      attributes: ['employeeCount']
    });
    const totalEmployees = subsidiaries.reduce((sum, sub) => {
      return sum + (sub.employeeCount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalCount,
          active: activeCount,
          inactive: inactiveCount,
          totalEmployees: totalEmployees
        },
        bySpecialization: [...],
        specializations: [...]  // Duplicate for frontend compatibility
      }
    });
  } catch (error) {
    console.error('Error fetching subsidiary statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});
```

**Key Points:**
1. **Placed BEFORE `/:id` route** - Specific routes must come before parameterized routes
2. **Returns `overview` object** - Frontend expects this structure
3. **Includes both `bySpecialization` and `specializations`** - Backward compatibility
4. **Calculates `totalEmployees`** - Sum dari semua subsidiary employeeCount

## 📊 Response Structure

```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 6,
      "active": 6,
      "inactive": 0,
      "totalEmployees": 0
    },
    "bySpecialization": [
      {"specialization": "infrastructure", "count": 1},
      {"specialization": "industrial", "count": 1},
      {"specialization": "commercial", "count": 2},
      {"specialization": "residential", "count": 1},
      {"specialization": "renovation", "count": 1}
    ],
    "specializations": [
      // Same as bySpecialization for compatibility
    ]
  }
}
```

## ✅ Verification

### API Test:
```bash
curl -s http://localhost:5000/api/subsidiaries/statistics
```

**Result:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 6,
      "active": 6,
      "inactive": 0,
      "totalEmployees": 0
    },
    "bySpecialization": [...],
    "specializations": [...]
  }
}
```

✅ **Status 200** - Endpoint working!  
✅ **Data structure** matches frontend expectation!

## 📁 Files Modified

1. ✅ `/backend/routes/subsidiaries.js` - Added `/statistics` endpoint

## 🔄 Frontend Integration

**Hook:** `useSubsidiariesData.js`
```javascript
const fetchStats = async () => {
  try {
    const response = await subsidiaryAPI.getStats();
    // ^-- Calls /subsidiaries/statistics
    
    if (response.success) {
      const data = response.data;
      
      if (data.overview) {
        // ✅ New format with overview object
        setStats({
          total: data.overview.total,
          active: data.overview.active,
          totalEmployees: data.overview.totalEmployees,
          specializations: data.specializations?.length || 0
        });
      } else {
        // Fallback to old format
        setStats({ ... });
      }
    }
  } catch (error) {
    console.error('Error fetching subsidiary statistics:', error);
  }
};
```

## 💡 Why Route Order Matters

**Express route matching:**
```javascript
// ❌ WRONG ORDER
router.get('/:id', ...);        // This catches /statistics!
router.get('/statistics', ...); // Never reached

// ✅ CORRECT ORDER
router.get('/statistics', ...); // Specific route first
router.get('/:id', ...);        // Parameterized route after
```

**Rule:** Specific routes MUST be defined BEFORE parameterized routes (`:id`, `:param`)

## 🎯 Both Endpoints Now Available

**New Endpoint:**
- `GET /api/subsidiaries/statistics` ✅ (Frontend uses this)

**Old Endpoint (Still Works):**
- `GET /api/subsidiaries/stats/summary` ✅ (Backward compatible)

## 🚀 Testing Checklist

- [x] API endpoint returns 200 status
- [x] Response includes `overview` object
- [x] Response includes `bySpecialization` array
- [x] Response includes `specializations` array
- [x] Frontend loads without 404 error
- [x] Statistics display correctly in UI
- [x] No console errors

## 📝 Statistics Metrics

**Calculated:**
1. **total** - Total count of all subsidiaries
2. **active** - Count where status = 'active'
3. **inactive** - total - active
4. **totalEmployees** - Sum of employeeCount from all subsidiaries
5. **bySpecialization** - Group count by specialization type

**Specialization Types:**
- residential
- commercial
- industrial
- infrastructure
- renovation
- interior
- landscaping
- general

## 🔄 Data Flow

```
Frontend (useSubsidiariesData.js)
  ↓
subsidiaryAPI.getStats()
  ↓
GET /api/subsidiaries/statistics
  ↓
Backend Route Handler
  ↓
1. Count total subsidiaries
2. Count active subsidiaries
3. Calculate inactive (total - active)
4. Sum employee counts
5. Group by specialization
  ↓
Return JSON response
  ↓
Frontend displays stats in UI
```

---

**Summary:** ✅ Added missing `/api/subsidiaries/statistics` endpoint to match frontend API call. Endpoint returns comprehensive statistics including overview, specialization breakdown, and employee counts. Frontend now loads without 404 errors.
