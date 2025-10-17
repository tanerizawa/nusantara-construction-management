# Fix: Subsidiary-ChartOfAccounts Association Error

**Tanggal:** 17 Oktober 2025  
**Status:** ✅ FIXED

## 🐛 Problem

Saat membuka halaman **Perusahaan (Subsidiary Edit)**, error muncul:

```
Error: ChartOfAccounts is not associated to Subsidiary!
GET /api/subsidiaries/NU002 500 (Internal Server Error)
```

## 🔍 Root Cause

**Backend model associations tidak terdefinisi!**

Di file `/backend/models/index.js`, tidak ada association antara:
- `Subsidiary.hasMany(ChartOfAccounts)`
- `ChartOfAccounts.belongsTo(Subsidiary)`

Padahal di route `/backend/routes/subsidiaries.js`, ada query yang include:
```javascript
include: [
  {
    model: ChartOfAccounts,
    as: 'Accounts',  // ❌ Alias tidak sesuai
    ...
  }
]
```

Sequelize tidak bisa resolve association yang tidak terdefinisi!

## 🔧 Solution

### 1. **Tambah Association di models/index.js**

**Location:** Line 157 (setelah Subsidiary-Project associations)

**Added:**
```javascript
// ChartOfAccounts - Subsidiary relationships
ChartOfAccounts.belongsTo(Subsidiary, {
  foreignKey: 'subsidiaryId',
  as: 'subsidiary'
});

Subsidiary.hasMany(ChartOfAccounts, {
  foreignKey: 'subsidiaryId',
  as: 'accounts'  // lowercase alias
});
```

**Why:**
- `belongsTo`: ChartOfAccounts memiliki foreign key `subsidiaryId`
- `hasMany`: Satu subsidiary bisa punya banyak accounts
- `as: 'accounts'`: Alias lowercase (best practice untuk collections)

### 2. **Fix Alias di routes/subsidiaries.js**

**Changed:**
```javascript
// BEFORE ❌
include: [
  {
    model: ChartOfAccounts,
    as: 'Accounts',  // Capital A - tidak match dengan association
    ...
  }
]

// AFTER ✅
include: [
  {
    model: ChartOfAccounts,
    as: 'accounts',  // lowercase - match dengan association definition
    ...
  }
]
```

**Why:**
- Alias harus **exact match** dengan alias di association definition
- Lowercase lebih konsisten untuk collections (projects, accounts, transactions)
- Uppercase biasa untuk singular references (Project, Account, User)

### 3. **Restart Backend**

**Command:**
```bash
docker restart nusantara-backend
```

**Why:**
- Sequelize load associations saat server start
- Perubahan di models/index.js memerlukan restart
- Docker container perlu reload code changes

## ✅ Verification

### API Test:
```bash
curl -s http://localhost:5000/api/subsidiaries/NU002 | head -100
```

**Result:**
```json
{
  "success": true,
  "data": {
    "id": "NU002",
    "name": "CV. BINTANG SURAYA",
    "code": "BSR",
    ...
    "accounts": [
      {
        "id": "COA-6104",
        "accountCode": "1101-10",
        "accountName": "BJB",
        "accountType": "ASSET"
      }
    ]
  }
}
```

✅ **Status 200** - No more 500 error!  
✅ **accounts array** returned with account data!

## 📁 Files Modified

1. ✅ `/backend/models/index.js` - Added Subsidiary-ChartOfAccounts associations
2. ✅ `/backend/routes/subsidiaries.js` - Fixed alias from 'Accounts' to 'accounts'

## 🔄 Related Components

### Database Schema:
```sql
chart_of_accounts:
  - id (PK)
  - subsidiary_id (FK → subsidiaries.id)
  - account_code
  - account_name
  - account_type
  ...

subsidiaries:
  - id (PK)
  - name
  - code
  ...
```

### Other Associations in models/index.js:
```javascript
// Already existed:
Subsidiary.hasMany(Project, { as: 'projects' })
Project.belongsTo(Subsidiary, { as: 'subsidiary' })

// Newly added:
Subsidiary.hasMany(ChartOfAccounts, { as: 'accounts' })
ChartOfAccounts.belongsTo(Subsidiary, { as: 'subsidiary' })
```

## 💡 Best Practices Learned

### 1. **Association Alias Consistency**
- Singular: `as: 'subsidiary'`, `as: 'project'`, `as: 'user'`
- Plural: `as: 'accounts'`, `as: 'projects'`, `as: 'transactions'`
- ❌ Avoid mixed case like `'Accounts'` for collections

### 2. **Association Definition Location**
- Define ALL associations in `/backend/models/index.js`
- NOT in individual model files (would create circular dependency)
- Group related associations together for readability

### 3. **Foreign Key Naming**
- Use `subsidiaryId` (camelCase) in code
- Maps to `subsidiary_id` (snake_case) in database
- Sequelize handles conversion automatically

### 4. **Include Options**
```javascript
// Limit accounts for performance
include: [{
  model: ChartOfAccounts,
  as: 'accounts',
  attributes: ['id', 'accountCode', 'accountName', 'accountType'],
  limit: 10  // Prevent returning too many accounts
}]
```

## 🎯 Impact

**Before Fix:**
- ❌ Subsidiary Edit page crashed
- ❌ Cannot view subsidiary details
- ❌ 500 Internal Server Error
- ❌ Frontend error loop

**After Fix:**
- ✅ Subsidiary Edit page loads successfully
- ✅ Can view subsidiary with related accounts
- ✅ 200 OK response
- ✅ Clean frontend rendering

## 🚀 Testing Checklist

- [x] API endpoint returns 200 status
- [x] Response includes `accounts` array
- [x] Subsidiary data complete
- [x] Frontend page loads without error
- [x] No console errors
- [x] Backend logs clean

## 📝 Notes

**Why wasn't this caught earlier?**
- Subsidiary list endpoint (`GET /subsidiaries`) doesn't include accounts
- Only detail endpoint (`GET /subsidiaries/:id`) tries to load associations
- Error only appears when navigating to Edit page for specific subsidiary

**Prevention:**
- Add association tests in backend test suite
- Validate all model associations on server start
- Document all associations in models/index.js with comments

---

**Summary:** ✅ Fixed missing Subsidiary-ChartOfAccounts association by adding proper model relationships in models/index.js and correcting alias in route handler. Backend now properly loads accounts when fetching subsidiary details.
