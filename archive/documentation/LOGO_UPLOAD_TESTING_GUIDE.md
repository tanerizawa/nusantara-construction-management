# Logo Upload Feature - Testing Guide

## Quick Test Checklist

### Prerequisites
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Database migration applied
- ✅ At least one subsidiary exists with ID

---

## Test Scenarios

### 1. Display Logo in Detail Page

**Steps:**
1. Navigate to subsidiary detail page: `/subsidiaries/1`
2. Check header section

**Expected Results:**
- If subsidiary has logo: Image displayed (64x64px)
- If no logo: Company initials displayed (first 2 letters)
- If image fails: Fallback to initials

**Test Cases:**
```javascript
// No logo - should show "PT"
{ name: "PT Anak Usaha", logo: null }

// Valid logo - should show image
{ name: "PT Anak Usaha", logo: "subsidiaries/logos/1-1234567890.png" }

// Invalid path - should fallback to initials
{ name: "PT Anak Usaha", logo: "subsidiaries/logos/missing.png" }
```

---

### 2. Upload Logo - Success Cases

#### Test 2.1: Upload JPG (< 2MB)
**Steps:**
1. Navigate to edit page: `/subsidiaries/1/edit`
2. Click "Pilih File" in Logo section
3. Select a JPG file (< 2MB)
4. Verify preview appears
5. Click "Upload" button
6. Wait for success message

**Expected:**
- ✅ File selected successfully
- ✅ Preview displays correctly
- ✅ Upload button enabled
- ✅ Upload completes without error
- ✅ Success alert appears
- ✅ Preview clears
- ✅ Logo displays in preview area

#### Test 2.2: Upload PNG (< 2MB)
Same steps as 2.1 with PNG file

#### Test 2.3: Upload SVG (< 2MB)
Same steps as 2.1 with SVG file

#### Test 2.4: Upload WebP (< 2MB)
Same steps as 2.1 with WebP file

---

### 3. Upload Logo - Validation Errors

#### Test 3.1: File Too Large (> 2MB)
**Steps:**
1. Select a file larger than 2MB
2. Check error message

**Expected:**
- ❌ Error: "Ukuran file maksimal 2MB."
- ❌ Preview not shown
- ❌ Upload button not available

#### Test 3.2: Invalid File Type (GIF)
**Steps:**
1. Select a GIF file
2. Check error message

**Expected:**
- ❌ Error: "Format file tidak valid. Gunakan JPG, PNG, SVG, atau WebP."
- ❌ Preview not shown
- ❌ Upload button not available

#### Test 3.3: Invalid File Type (PDF)
Same as 3.2 with PDF file

---

### 4. Replace Existing Logo

**Steps:**
1. Navigate to edit page for subsidiary WITH logo
2. Verify current logo displays
3. Click "Pilih File"
4. Select new image
5. Click "Upload"
6. Confirm old logo is replaced

**Expected:**
- ✅ Old logo displays initially
- ✅ New preview shows after selection
- ✅ Upload succeeds
- ✅ Old file deleted from server
- ✅ New logo displays
- ✅ Detail page shows new logo after refresh

**Backend Verification:**
```bash
# Check uploads directory - old file should be deleted
ls -la backend/uploads/subsidiaries/logos/
```

---

### 5. Delete Logo

**Steps:**
1. Navigate to edit page for subsidiary WITH logo
2. Verify logo displays
3. Click "Hapus Logo" button
4. Confirm deletion in popup
5. Verify logo removed

**Expected:**
- ✅ Confirmation dialog appears
- ✅ Logo deleted from database (logo field = null)
- ✅ File deleted from server
- ✅ Preview shows initials instead
- ✅ Detail page shows initials after refresh

**Backend Verification:**
```bash
# File should be deleted
ls -la backend/uploads/subsidiaries/logos/

# Database should show null
SELECT id, name, logo FROM subsidiaries WHERE id = 1;
```

---

### 6. Upload Before Save (New Subsidiary)

**Steps:**
1. Create new subsidiary (not saved yet)
2. Try to upload logo

**Expected:**
- ⚠️ Warning message: "Simpan data dasar terlebih dahulu sebelum mengunggah logo."
- ❌ Upload button disabled
- ℹ️ File selection still works (for preview)

---

### 7. Cancel Upload

**Steps:**
1. Select a file
2. Verify preview appears
3. Click "Batal" button

**Expected:**
- ✅ Preview cleared
- ✅ File selection reset
- ✅ "Pilih File" button reappears
- ✅ No changes saved

---

### 8. Static File Access

**Direct URL Test:**
```bash
# After uploading a logo, test direct access
curl -I http://localhost:5000/uploads/subsidiaries/logos/1-1234567890.png
```

**Expected:**
- ✅ Status: 200 OK
- ✅ Content-Type: image/png (or appropriate type)
- ✅ File downloaded/displayed correctly

**Browser Test:**
1. Copy logo URL from network tab
2. Paste in new browser tab
3. Verify image displays

---

### 9. Persistence Test

**Steps:**
1. Upload logo
2. Refresh page
3. Navigate away and back
4. Restart frontend
5. Verify logo still displays

**Expected:**
- ✅ Logo persists after refresh
- ✅ Logo persists after navigation
- ✅ Logo persists after frontend restart
- ✅ Logo persists after backend restart

---

### 10. Error Handling

#### Test 10.1: Network Error
**Steps:**
1. Stop backend
2. Try to upload logo
3. Check error message

**Expected:**
- ❌ Error message displayed
- ❌ Upload state resets
- ❌ File not uploaded

#### Test 10.2: Invalid Token
**Steps:**
1. Clear localStorage token
2. Try to upload logo

**Expected:**
- ❌ 401 Unauthorized error
- ❌ Error message displayed

#### Test 10.3: Invalid Subsidiary ID
**Steps:**
1. Try to upload to non-existent subsidiary

**Expected:**
- ❌ 404 Not Found error
- ❌ File deleted from server
- ❌ Error message displayed

---

## Automated Test Commands

### Backend API Tests

```bash
# Test upload endpoint
curl -X POST \
  http://localhost:5000/api/subsidiaries/1/logo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logo=@test-logo.png"

# Expected: 200 OK with JSON response

# Test delete endpoint
curl -X DELETE \
  http://localhost:5000/api/subsidiaries/1/logo \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: 200 OK with success message

# Test static file serving
curl -I http://localhost:5000/uploads/subsidiaries/logos/1-1234567890.png

# Expected: 200 OK with image content type
```

### Database Verification

```bash
# Check logo column exists
docker exec -i nusantara-postgres psql -U ykdbuser -d ykdb -c "
  SELECT column_name, data_type, character_maximum_length, is_nullable 
  FROM information_schema.columns 
  WHERE table_name = 'subsidiaries' AND column_name = 'logo';
"

# Check logo data
docker exec -i nusantara-postgres psql -U ykdbuser -d ykdb -c "
  SELECT id, name, logo FROM subsidiaries;
"
```

### File System Verification

```bash
# Check upload directory exists
ls -la backend/uploads/subsidiaries/logos/

# Check file permissions
stat backend/uploads/subsidiaries/logos/

# Count uploaded files
ls -1 backend/uploads/subsidiaries/logos/ | wc -l
```

---

## Performance Tests

### 1. Upload Speed
- Upload 100KB file: Should complete in < 1 second
- Upload 1MB file: Should complete in < 2 seconds
- Upload 2MB file: Should complete in < 3 seconds

### 2. Static File Delivery
- First load: < 100ms
- Cached load: < 10ms
- Concurrent requests: Should handle 100+ simultaneous

### 3. Database Query
- Fetch subsidiary with logo: < 50ms
- Update logo path: < 30ms

---

## Security Tests

### 1. File Type Bypass Attempts

**Test:** Rename .exe to .png
```bash
mv malware.exe malware.png
# Try to upload
```
**Expected:** ❌ Rejected by MIME type check

**Test:** Double extension
```bash
mv file.php.png file.png
# Try to upload
```
**Expected:** ✅ Allowed (only checks extension, MIME type)

### 2. Path Traversal

**Test:** Upload with malicious filename
```javascript
const file = new File([blob], '../../../etc/passwd.png');
```
**Expected:** ❌ Rejected or sanitized

### 3. SQL Injection

**Test:** Upload with SQL in filename
```javascript
const file = new File([blob], "'; DROP TABLE subsidiaries; --.png");
```
**Expected:** ✅ Filename sanitized, no SQL execution

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Key Features to Test:
- File input works
- Preview displays correctly
- Upload progress shows
- Images display correctly
- Error messages appear

---

## Mobile Testing

Test on mobile devices:
- [ ] Android Chrome
- [ ] iOS Safari

### Key Features:
- Camera access for file selection
- Touch interactions work
- Responsive layout
- Upload from gallery
- Preview displays correctly

---

## Common Issues & Solutions

### Issue 1: Image Not Displaying
**Symptoms:** Broken image icon in detail/edit page
**Causes:**
- Incorrect file path in database
- File deleted from server
- CORS issue
- Wrong API URL

**Debug:**
```javascript
// Check network tab in browser DevTools
// Look for 404 or CORS errors

// Check database
SELECT logo FROM subsidiaries WHERE id = 1;

// Check file exists
ls backend/uploads/subsidiaries/logos/
```

### Issue 2: Upload Fails Silently
**Symptoms:** No error message, upload doesn't complete
**Causes:**
- Token expired
- Network error
- Backend not running
- Multer not configured

**Debug:**
```javascript
// Check console for errors
console.log(error);

// Check backend logs
docker-compose logs backend

// Verify token
console.log(localStorage.getItem('token'));
```

### Issue 3: Old Logo Not Deleted
**Symptoms:** Multiple logo files for same subsidiary
**Causes:**
- File deletion error
- Incorrect file path
- Permission issues

**Debug:**
```bash
# Check file permissions
ls -la backend/uploads/subsidiaries/logos/

# Check backend logs for deletion errors
docker-compose logs backend | grep "delete"
```

---

## Test Data

### Sample Images for Testing

**Valid Images:**
- `test-logo-small.jpg` - 50KB
- `test-logo-medium.png` - 500KB
- `test-logo-large.png` - 1.8MB
- `test-logo-svg.svg` - 10KB
- `test-logo-webp.webp` - 200KB

**Invalid Images:**
- `test-logo-toolarge.jpg` - 3MB (too large)
- `test-logo.gif` - 100KB (wrong format)
- `test-logo.bmp` - 200KB (wrong format)
- `test-document.pdf` - 50KB (not an image)

---

## Test Report Template

```markdown
## Logo Upload Test Report

**Date:** YYYY-MM-DD
**Tester:** Name
**Environment:** Development/Staging/Production

### Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Display logo in detail | ✅/❌ | |
| 2.1 Upload JPG | ✅/❌ | |
| 2.2 Upload PNG | ✅/❌ | |
| 2.3 Upload SVG | ✅/❌ | |
| 2.4 Upload WebP | ✅/❌ | |
| 3.1 File too large | ✅/❌ | |
| 3.2 Invalid type (GIF) | ✅/❌ | |
| 3.3 Invalid type (PDF) | ✅/❌ | |
| 4. Replace existing logo | ✅/❌ | |
| 5. Delete logo | ✅/❌ | |
| 6. Upload before save | ✅/❌ | |
| 7. Cancel upload | ✅/❌ | |
| 8. Static file access | ✅/❌ | |
| 9. Persistence test | ✅/❌ | |
| 10.1 Network error | ✅/❌ | |

### Issues Found

1. **Issue:** Description
   - **Severity:** Critical/High/Medium/Low
   - **Steps to Reproduce:** 
   - **Expected:** 
   - **Actual:** 
   - **Screenshot:** 

### Performance Metrics

- Upload time (100KB): X ms
- Upload time (1MB): X ms
- Upload time (2MB): X ms
- Static file delivery: X ms

### Recommendations

1. 
2. 
3. 

### Sign-off

- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] Performance acceptable
- [ ] Ready for production

**Approved by:** _______________
**Date:** _______________
```

---

## Status: Ready for Testing ✅

All components implemented and ready for comprehensive testing.

**Next Steps:**
1. Run through all test scenarios
2. Document any issues found
3. Fix issues if necessary
4. Mark feature as production-ready

---

**Last Updated:** January 2025
