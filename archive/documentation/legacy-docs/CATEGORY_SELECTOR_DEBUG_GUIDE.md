# 🧪 CategorySelector Debug & Testing Guide

**Date:** October 12, 2025  
**Status:** API Working ✅ | Debugging UI Display

---

## ✅ Current Status

### Backend API: WORKING ✅
```
GET /api/projects/2025LTS001/milestones/rab-categories
Status: 200 OK
Response: 
{
  "success": true,
  "data": [
    {
      "name": "Pekerjaan Finishing",
      "itemCount": 2,
      "totalValue": 15100000,
      "lastUpdated": "2025-10-12..."
    },
    // ... 3 more categories
  ],
  "count": 4,
  "message": "Found 4 RAB categories"
}
```

### Frontend State: DEBUGGING 🔍
- API calls successful (200 OK)
- Data received correctly
- Need to verify UI rendering

---

## 🧪 Debug Steps

### Step 1: Open Browser Console
1. Navigate to: `https://nusantaragroup.co/admin/projects/2025LTS001`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for debug logs starting with `[CategorySelector]`

###Step 2: Check Console Logs
You should see logs like:
```javascript
[CategorySelector] Fetching categories for project: 2025LTS001
[CategorySelector] API Response: {data: {...}, status: 200, ...}
[CategorySelector] Response data: {success: true, data: [...], count: 4}
[CategorySelector] Categories loaded: [{name: "...", itemCount: 2, ...}, ...]
[CategorySelector] Render state: {
  projectId: "2025LTS001",
  categoriesCount: 4,
  loading: false,
  error: null,
  isOpen: false,
  selectedCategory: null
}
```

### Step 3: Test UI Interaction

#### A. Open Milestone Form
1. Click "Add New Milestone" or edit existing milestone
2. Look for section: **"Link ke Kategori RAB (Opsional)"**
3. Check if you see:
   - A button saying "Select RAB category to link..."
   - OR: "Loading categories..."
   - OR: An error message

#### B. Open Category Dropdown
1. Click the "Select RAB category..." button
2. Dropdown should open showing 4 categories:
   - Pekerjaan Finishing (2 items, Rp 15,100,000)
   - Pekerjaan MEP (2 items, Rp 27,000,000)
   - Pekerjaan Persiapan (2 items, Rp 8,000,000)
   - Pekerjaan Struktur (2 items, Rp 16,250,000)

#### C. Select a Category
1. Click on any category
2. Should see:
   - Category card with blue border
   - Category name, item count, and total value
   - Green checkmark icon
   - "X" button to clear selection
   - Message: "✓ Auto-sync dengan workflow RAB → PO → Tanda Terima → BA → Payment"

---

## 🔍 Debug Console Logs Added

### In `CategorySelector.js`:

**Fetch Function:**
```javascript
console.log('[CategorySelector] Fetching categories for project:', projectId);
console.log('[CategorySelector] API Response:', response);
console.log('[CategorySelector] Response data:', data);
console.log('[CategorySelector] Categories loaded:', data.data);
```

**Render Function:**
```javascript
console.log('[CategorySelector] Render state:', {
  projectId,
  categoriesCount: categories.length,
  loading,
  error,
  isOpen,
  selectedCategory
});
```

---

## 🐛 Troubleshooting

### Issue: Button doesn't appear
**Check:**
- Is MilestoneInlineForm rendered?
- Is CategorySelector imported correctly?
- Check console for React errors

**Solution:**
```bash
# Check frontend logs
docker-compose logs frontend --tail=50

# Look for compilation errors
```

### Issue: Dropdown doesn't open
**Check Console Logs:**
```javascript
[CategorySelector] Render state: {
  ...,
  isOpen: false,  // Should change to true when clicked
  categoriesCount: 4  // Should be > 0
}
```

**Possible Causes:**
- `isOpen` state not updating → Check onClick handler
- Categories empty → Check fetch function
- CSS z-index issue → Check dropdown positioning

### Issue: No categories show in dropdown
**Check Console:**
```javascript
[CategorySelector] Categories loaded: []  // PROBLEM: Empty array
```

**Solution:**
1. Check if API returns data:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://nusantaragroup.co/api/projects/2025LTS001/milestones/rab-categories
   ```
2. Verify database has data:
   ```bash
   docker-compose exec postgres psql -U admin -d nusantara_construction \
     -c "SELECT * FROM rab_items WHERE project_id = '2025LTS001' LIMIT 5;"
   ```

### Issue: API returns 401 Unauthorized
**Check:**
- Token in localStorage
- Token is valid (not expired)
- Authorization header is set

**Solution:**
```javascript
// In browser console:
localStorage.getItem('token')  // Should return a JWT token

// If null or expired:
// Login again at /login
```

---

## 🧪 Manual API Test

### Option 1: Use Debug Page
1. Open: `https://nusantaragroup.co/test-category-selector-debug.html`
2. Click "🧪 Test API Call"
3. View results and raw data

### Option 2: Browser Console
```javascript
// In browser console (F12):
const token = localStorage.getItem('token');
const response = await fetch('https://nusantaragroup.co/api/projects/2025LTS001/milestones/rab-categories', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

### Option 3: curl
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://nusantaragroup.co/api/projects/2025LTS001/milestones/rab-categories
```

---

## 📊 Expected Behavior

### When Form Opens:
1. CategorySelector renders with button
2. Console shows: `[CategorySelector] Render state: {...}`
3. Button text: "Select RAB category to link..."

### When Button Clicked:
1. `isOpen` changes to `true`
2. Dropdown appears below button
3. Shows 4 category cards
4. Each card displays:
   - Category name (e.g., "Pekerjaan Finishing")
   - Item count (e.g., "2 items")
   - Total value (e.g., "Rp 15,100,000")
   - Last updated date

### When Category Selected:
1. Dropdown closes (`isOpen` = false)
2. Selected card appears with blue border
3. Shows checkmark icon
4. Shows "X" button to clear
5. Console shows: `selectedCategory: {name: "...", ...}`

---

## ✅ Verification Checklist

- [ ] Open browser console (F12)
- [ ] Navigate to `/admin/projects/2025LTS001`
- [ ] See debug logs in console
- [ ] Open milestone form (add or edit)
- [ ] See "Link ke Kategori RAB" section
- [ ] Click "Select RAB category..." button
- [ ] Dropdown opens showing 4 categories
- [ ] Each category shows correct data
- [ ] Click on a category to select it
- [ ] Selected category displays with blue border
- [ ] Click "X" to clear selection
- [ ] Selection clears successfully

---

## 📝 Report Issues

If something doesn't work, please provide:

1. **Console Logs:**
   - Copy all `[CategorySelector]` logs
   - Include any error messages (red text)

2. **Network Tab:**
   - F12 → Network tab
   - Filter by "rab-categories"
   - Check request/response

3. **Screenshot:**
   - Show the milestone form
   - Show the dropdown (if visible)
   - Show console with errors

4. **Steps to Reproduce:**
   - What did you click?
   - What happened?
   - What did you expect?

---

## 🎯 Next Steps After Verification

### If UI Works:
- ✅ Test selecting different categories
- ✅ Test clearing selection
- ✅ Test saving milestone with category link
- ✅ Verify workflow progress tracking

### If UI Doesn't Work:
- 🔍 Provide console logs
- 🔍 Check if dropdown HTML is in DOM (Elements tab)
- 🔍 Check CSS styles (computed styles)
- 🔍 Test with different browser

---

**Debug Mode Active:** ✅  
**Console Logging:** ✅  
**API Working:** ✅  
**Waiting for:** User feedback with console logs
