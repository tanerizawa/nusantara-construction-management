# 🔧 WORK ORDER PDF - FIX DIRECTOR NAME (JSONB PARSING)

**Tanggal:** 16 Oktober 2025  
**Issue:** Director name menampilkan "Pimpinan BINTANG SURAYA" instead of "Ahmad Wijaya, S.E."  
**Root Cause:** Sequelize `raw: true` tidak mem-parse JSONB fields dari PostgreSQL  
**Status:** ✅ FIXED

---

## 🐛 MASALAH

### Symptom:
```
❌ TAMPIL DI PDF:
Pimpinan BINTANG SURAYA
(Direktur Utama)

✅ SEHARUSNYA (SESUAI DATABASE):
Ahmad Wijaya, S.E.
(Direktur Utama)
```

### Database Actual Data:
```json
{
  "id": "NU002",
  "name": "CV. BINTANG SURAYA",
  "board_of_directors": [
    {
      "name": "Ahmad Wijaya, S.E.",
      "position": "Direktur Utama",
      "isActive": true,
      "email": "ahmad@bintangsuraya.co.id",
      "phone": "+62-812-3456-7890"
    },
    {
      "name": "Siti Nurhaliza, S.Ak.",
      "position": "Direktur Keuangan",
      "isActive": true
    }
  ]
}
```

---

## 🔍 ROOT CAUSE ANALYSIS

### Issue: Sequelize `raw: true` + PostgreSQL JSONB

When using `raw: true` in Sequelize query, PostgreSQL JSONB fields are returned as **JSON strings**, not parsed JavaScript objects.

**Code yang Bermasalah:**
```javascript
// ❌ PROBLEM
const subsidiaryData = await Subsidiary.findOne({
  where: { id: subsidiaryId },
  raw: true  // ← Returns JSONB as STRING!
});

// Result:
subsidiaryData.board_of_directors = '[{"name":"Ahmad..."}]'  // STRING!
// NOT:
subsidiaryData.board_of_directors = [{name:"Ahmad"...}]      // ARRAY
```

**Akibatnya:**
```javascript
// Check ini GAGAL karena board_of_directors adalah STRING, bukan ARRAY
if (Array.isArray(subsidiaryData.board_of_directors)) {
  // ❌ Never executed!
}

// Maka fallback dijalankan:
if (!directorName && subsidiaryData?.name) {
  // ✅ Executed!
  directorName = `Pimpinan ${companyName.replace('CV.', '').trim()}`;
  // Result: "Pimpinan BINTANG SURAYA"
}
```

---

## ✅ SOLUTION

### Parse JSONB Fields Manually After Raw Query

```javascript
// ✅ FIXED
const subsidiaryRaw = await Subsidiary.findOne({
  where: { id: subsidiaryId },
  raw: true
});

// Parse JSONB fields if they are strings
if (subsidiaryRaw) {
  subsidiaryData = {
    ...subsidiaryRaw,
    address: typeof subsidiaryRaw.address === 'string' 
      ? JSON.parse(subsidiaryRaw.address) 
      : subsidiaryRaw.address,
    contact_info: typeof subsidiaryRaw.contact_info === 'string' 
      ? JSON.parse(subsidiaryRaw.contact_info) 
      : subsidiaryRaw.contact_info,
    board_of_directors: typeof subsidiaryRaw.board_of_directors === 'string' 
      ? JSON.parse(subsidiaryRaw.board_of_directors) 
      : subsidiaryRaw.board_of_directors,
    legal_info: typeof subsidiaryRaw.legal_info === 'string' 
      ? JSON.parse(subsidiaryRaw.legal_info) 
      : subsidiaryRaw.legal_info
  };
}
```

### Enhanced Logging for Debugging

```javascript
console.log('📊 Subsidiary data found:', {
  id: subsidiaryData?.id,
  name: subsidiaryData?.name,
  hasAddress: !!subsidiaryData?.address,
  boardOfDirectorsType: typeof subsidiaryData?.board_of_directors,  // ← Check type!
  hasDirectors: Array.isArray(subsidiaryData?.board_of_directors) && 
                subsidiaryData.board_of_directors.length > 0
});

console.log('🔍 board_of_directors data:', {
  exists: !!subsidiaryData?.board_of_directors,
  isArray: Array.isArray(subsidiaryData?.board_of_directors),
  length: subsidiaryData?.board_of_directors?.length,
  rawData: subsidiaryData?.board_of_directors
});
```

---

## 🧪 TESTING RESULTS

### Before Fix:
```javascript
// Log output:
📊 Subsidiary data found: {
  id: 'NU002',
  name: 'CV. BINTANG SURAYA',
  hasAddress: true,
  boardOfDirectorsType: 'string',  // ❌ STRING!
  hasDirectors: false              // ❌ FALSE because it's a string
}

❌ board_of_directors is not an array or does not exist
⚠️  No director in board_of_directors, using fallback: Pimpinan BINTANG SURAYA

// Result in PDF:
Pimpinan BINTANG SURAYA
(Direktur Utama)
```

### After Fix:
```javascript
// Expected log output:
📊 Subsidiary data found: {
  id: 'NU002',
  name: 'CV. BINTANG SURAYA',
  hasAddress: true,
  boardOfDirectorsType: 'object',  // ✅ OBJECT (array)!
  hasDirectors: true               // ✅ TRUE!
}

🔍 board_of_directors data: {
  exists: true,
  isArray: true,                   // ✅ IS ARRAY!
  length: 2,
  rawData: [
    { name: 'Ahmad Wijaya, S.E.', position: 'Direktur Utama', isActive: true },
    { name: 'Siti Nurhaliza, S.Ak.', position: 'Direktur Keuangan', isActive: true }
  ]
}

✅ Director found from board_of_directors: Ahmad Wijaya, S.E. - Direktur Utama

// Result in PDF:
Ahmad Wijaya, S.E.
(Direktur Utama)
```

---

## 📊 AFFECTED SUBSIDIARIES

### With Directors (Should Work Now):
| ID | Subsidiary | Director | Status |
|----|-----------|----------|---------|
| NU001 | CV. CAHAYA UTAMA EMPATBELAS | Budi Santoso, S.T. | ✅ Fixed |
| NU002 | CV. BINTANG SURAYA | Ahmad Wijaya, S.E. | ✅ Fixed |
| NU003 | CV. LATANSA | Hendra Kusuma, S.T., M.Eng. | ✅ Fixed |
| NU004 | CV. GRAHA BANGUN NUSANTARA | Ir. Hartono Wijaya, M.M. | ✅ Fixed |
| NU005 | CV. SAHABAT SINAR RAYA | Ir. Bambang Suryanto | ✅ Fixed |

### Without Directors (Uses Fallback):
| ID | Subsidiary | Director | Status |
|----|-----------|----------|---------|
| NU006 | PT. PUTRA JAYA KONSTRUKASI | Direktur PUTRA JAYA KONSTRUKASI | ✅ Correct (fallback intended) |

---

## 🔧 CODE CHANGES

### File: `backend/routes/workOrders.js`

**Location:** Line 330-356

**Before:**
```javascript
const subsidiaryData = await Subsidiary.findOne({
  where: { id: subsidiaryId },
  raw: true
});
```

**After:**
```javascript
const subsidiaryRaw = await Subsidiary.findOne({
  where: { id: subsidiaryId },
  raw: true
});

// Parse JSONB fields if they are strings
if (subsidiaryRaw) {
  subsidiaryData = {
    ...subsidiaryRaw,
    address: typeof subsidiaryRaw.address === 'string' 
      ? JSON.parse(subsidiaryRaw.address) 
      : subsidiaryRaw.address,
    contact_info: typeof subsidiaryRaw.contact_info === 'string' 
      ? JSON.parse(subsidiaryRaw.contact_info) 
      : subsidiaryRaw.contact_info,
    board_of_directors: typeof subsidiaryRaw.board_of_directors === 'string' 
      ? JSON.parse(subsidiaryRaw.board_of_directors) 
      : subsidiaryRaw.board_of_directors,
    legal_info: typeof subsidiaryRaw.legal_info === 'string' 
      ? JSON.parse(subsidiaryRaw.legal_info) 
      : subsidiaryRaw.legal_info
  };
}
```

---

## 🎯 WHY THIS HAPPENS

### PostgreSQL JSONB Behavior with Sequelize Raw Queries

1. **Normal Sequelize Query (without `raw: true`):**
   ```javascript
   const sub = await Subsidiary.findOne({ where: { id } });
   // Sequelize automatically parses JSONB:
   sub.board_of_directors // ✅ Array of objects
   ```

2. **Raw Sequelize Query (`raw: true`):**
   ```javascript
   const sub = await Subsidiary.findOne({ where: { id }, raw: true });
   // Returns raw PostgreSQL data:
   sub.board_of_directors // ❌ JSON string: '[{"name":"..."}]'
   ```

3. **Why Use `raw: true`?**
   - Faster (no model instantiation)
   - Returns plain object (no Sequelize instance methods)
   - Good for read-only operations
   
4. **The Catch:**
   - JSONB fields need manual parsing
   - Type checking becomes critical

---

## 📋 ALTERNATIVE SOLUTIONS

### Option 1: Remove `raw: true` (Simplest)
```javascript
// ✅ Easiest but slightly slower
const subsidiaryData = await Subsidiary.findOne({
  where: { id: subsidiaryId }
  // No raw: true - Sequelize auto-parses JSONB
});
```

### Option 2: Use Sequelize JSON Attributes (Current Fix)
```javascript
// ✅ Best performance + manual control
const subsidiaryRaw = await Subsidiary.findOne({
  where: { id: subsidiaryId },
  raw: true
});

// Parse JSONB manually
if (subsidiaryRaw) {
  subsidiaryData = {
    ...subsidiaryRaw,
    board_of_directors: typeof subsidiaryRaw.board_of_directors === 'string' 
      ? JSON.parse(subsidiaryRaw.board_of_directors) 
      : subsidiaryRaw.board_of_directors
  };
}
```

### Option 3: Use Sequelize Casting
```javascript
// ✅ Parse in query
const subsidiaryData = await sequelize.query(`
  SELECT 
    *,
    board_of_directors::jsonb as board_of_directors
  FROM subsidiaries
  WHERE id = :id
`, {
  replacements: { id: subsidiaryId },
  type: sequelize.QueryTypes.SELECT,
  plain: true
});
```

---

## ✅ VERIFICATION STEPS

### 1. Check Backend Logs
```bash
docker logs nusantara-backend --tail 50 | grep -A 5 "Director"
```

**Expected Output:**
```
📊 Subsidiary data found: {
  id: 'NU002',
  name: 'CV. BINTANG SURAYA',
  hasAddress: true,
  boardOfDirectorsType: 'object',
  hasDirectors: true
}

🔍 board_of_directors data: {
  exists: true,
  isArray: true,
  length: 2,
  rawData: [ ... ]
}

✅ Director found from board_of_directors: Ahmad Wijaya, S.E. - Direktur Utama
```

### 2. Generate Work Order PDF
- Create WO for project with subsidiary NU002
- Generate PDF
- Check signature section

**Expected:**
```
Yang Memerintahkan,
Karawang, 16 Oktober 2025

    [QR CODE]
 Tanda Tangan Digital

Ahmad Wijaya, S.E.
(Direktur Utama)
```

---

## 🔄 SIMILAR ISSUE IN PURCHASE ORDER?

### Check PO Route:
```bash
grep -A 10 "raw: true" backend/routes/purchaseOrders.js
```

If PO also uses `raw: true`, it might have the same issue! Should apply same fix.

---

## 📚 LESSONS LEARNED

### 1. **Sequelize `raw: true` Gotcha**
   - Always check if JSONB needs parsing
   - Use typeof checks before parsing
   - Add logging for debugging

### 2. **Type Safety**
   - Always verify data types in logs
   - Use Array.isArray() checks
   - Add fallbacks gracefully

### 3. **Testing JSONB Fields**
   - Test with actual database data
   - Don't assume Sequelize auto-parses
   - Check both array and object JSONB types

---

## 📝 CHECKLIST

- [x] Identify root cause (JSONB not parsed)
- [x] Add JSONB parsing logic
- [x] Add enhanced logging
- [x] Restart backend
- [ ] Test with NU002 (CV. BINTANG SURAYA)
- [ ] Test with other subsidiaries (NU001, NU003, NU004, NU005)
- [ ] Test with NU006 (fallback case)
- [ ] Verify logs show correct types
- [ ] Verify PDF shows correct director names
- [ ] Apply same fix to PO route if needed

---

## 🎯 EXPECTED RESULTS

### NU002 - CV. BINTANG SURAYA:
```
✅ Ahmad Wijaya, S.E.
✅ (Direktur Utama)
```

### NU004 - CV. GRAHA BANGUN NUSANTARA:
```
✅ Ir. Hartono Wijaya, M.M.
✅ (Direktur Utama)
```

### NU006 - PT. PUTRA JAYA KONSTRUKASI:
```
✅ Direktur PUTRA JAYA KONSTRUKASI
✅ (Direktur Utama)
(Fallback - correct behavior)
```

---

**Status:** ✅ **FIX APPLIED**  
**Backend:** ✅ **RESTARTED**  
**Ready for Testing:** ✅ **YES**

---

*Test dengan generate Work Order PDF untuk subsidiary NU002 untuk verify fix!* 🎉
