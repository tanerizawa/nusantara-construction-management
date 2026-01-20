# 🖼️ Logo Upload - Quick Reference Card

## 📍 Lokasi Fitur

### Detail Page
**URL:** `/subsidiaries/:id`
**Posisi:** Header (sebelah nama perusahaan)
**Ukuran:** 64x64px
**Fallback:** Inisial perusahaan (2 huruf)

### Edit Page
**URL:** `/subsidiaries/:id/edit`
**Tab:** Basic Info (paling atas)
**Section:** Logo Anak Usaha
**Features:** Upload, Preview, Delete

---

## 📤 Upload Spesifikasi

| Property | Value |
|----------|-------|
| **Tipe File** | JPG, JPEG, PNG, SVG, WebP |
| **Ukuran Max** | 2MB (2,097,152 bytes) |
| **Field Name** | `logo` |
| **Storage Path** | `backend/uploads/subsidiaries/logos/` |
| **Filename Format** | `{id}-{timestamp}.{ext}` |
| **DB Path Format** | `subsidiaries/logos/{filename}` |

---

## 🔌 API Endpoints

### Upload
```
POST /api/subsidiaries/:id/logo
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
Body: logo=<File>
```

### Delete
```
DELETE /api/subsidiaries/:id/logo
Headers: Authorization: Bearer {token}
```

### View
```
GET /uploads/subsidiaries/logos/{filename}
No auth required
```

---

## 💻 Code Snippets

### Frontend - Upload
```javascript
const formData = new FormData();
formData.append('logo', file);

await axios.post(
  `${API_URL}/api/subsidiaries/${id}/logo`,
  formData,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);
```

### Frontend - Delete
```javascript
await axios.delete(
  `${API_URL}/api/subsidiaries/${id}/logo`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

### Frontend - Display
```jsx
<img 
  src={`${API_URL}/uploads/${subsidiary.logo}`}
  alt="Logo"
  className="w-16 h-16 object-contain"
/>
```

### Backend - Check Logo
```javascript
const subsidiary = await Subsidiary.findByPk(id);
if (subsidiary.logo) {
  console.log('Logo path:', subsidiary.logo);
}
```

---

## ✅ Validation Rules

### Client-Side (Frontend)
```javascript
// Type validation
const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
if (!validTypes.includes(file.type)) {
  error('Invalid file type');
}

// Size validation
if (file.size > 2 * 1024 * 1024) {
  error('File too large');
}
```

### Server-Side (Backend)
```javascript
// Multer filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images allowed'));
};

// Size limit
limits: { fileSize: 2 * 1024 * 1024 }
```

---

## 🐛 Common Errors & Fixes

### Error: "No file uploaded"
**Cause:** Field name mismatch
**Fix:** Ensure field name is `logo` in FormData

### Error: "File too large"
**Cause:** File > 2MB
**Fix:** Compress image or choose smaller file

### Error: "Only image files allowed"
**Cause:** Wrong file type
**Fix:** Use JPG, PNG, SVG, or WebP only

### Error: "Subsidiary not found"
**Cause:** Invalid ID or subsidiary deleted
**Fix:** Verify subsidiary exists

### Image Not Displaying
**Cause:** Incorrect path or file deleted
**Fix:** Check network tab, verify file exists on server

---

## 🧪 Quick Tests

### Manual Test
```bash
# 1. Upload via cURL
curl -X POST \
  http://localhost:5000/api/subsidiaries/1/logo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logo=@test.png"

# 2. Verify file created
ls backend/uploads/subsidiaries/logos/

# 3. Access via browser
open http://localhost:5000/uploads/subsidiaries/logos/1-*.png

# 4. Delete via cURL
curl -X DELETE \
  http://localhost:5000/api/subsidiaries/1/logo \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Verify file deleted
ls backend/uploads/subsidiaries/logos/
```

### Database Check
```sql
-- Check logo column
SELECT id, name, logo 
FROM subsidiaries 
WHERE logo IS NOT NULL;

-- Update logo manually (testing)
UPDATE subsidiaries 
SET logo = 'subsidiaries/logos/1-1234567890.png' 
WHERE id = 1;

-- Clear logo
UPDATE subsidiaries 
SET logo = NULL 
WHERE id = 1;
```

---

## 📊 File Structure

```
APP-YK/
├── backend/
│   ├── config/
│   │   └── multer.js              ← Upload config
│   ├── models/
│   │   └── Subsidiary.js          ← Model with logo field
│   ├── routes/
│   │   └── subsidiaries/
│   │       └── basic.routes.js    ← Upload/delete routes
│   ├── server.js                  ← Static file serving
│   └── uploads/                   ← File storage
│       └── subsidiaries/
│           └── logos/             ← Logo files here
│               ├── 1-1704067200000.png
│               ├── 2-1704067300000.jpg
│               └── ...
├── frontend/
│   └── src/
│       └── pages/
│           ├── Subsidiaries/
│           │   └── Detail/
│           │       └── SubsidiaryDetail.js     ← Display logo
│           └── subsidiary-edit/
│               └── components/
│                   └── forms/
│                       └── BasicInfoForm.js    ← Upload form
└── migrations/
    └── add_logo_to_subsidiaries.sql           ← DB migration
```

---

## 🔍 Debugging Tips

### Check Upload Directory
```bash
ls -la backend/uploads/subsidiaries/logos/
```

### Check Backend Logs
```bash
docker-compose logs backend | tail -50
```

### Check Frontend Console
```javascript
// In browser DevTools Console
console.log(formData.logo);
console.log(localStorage.getItem('token'));
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by "logo"
3. Check request headers, body, response

### Check Database
```bash
docker exec -i nusantara-postgres psql -U ykdbuser -d ykdb -c "
  SELECT id, name, logo FROM subsidiaries;
"
```

---

## 📱 User Flow

```
1. User navigates to subsidiary detail
   ↓
2. Sees logo (or initials if no logo)
   ↓
3. Clicks "Edit" button
   ↓
4. Scrolls to "Logo Anak Usaha" section
   ↓
5. Clicks "Pilih File"
   ↓
6. Selects image file (JPG/PNG/SVG/WebP, <2MB)
   ↓
7. Preview appears
   ↓
8. Clicks "Upload" button
   ↓
9. Loading spinner shows
   ↓
10. Success alert appears
    ↓
11. Logo displayed in preview
    ↓
12. Returns to detail page
    ↓
13. Logo displayed in header ✅
```

---

## 🎯 Success Criteria

- ✅ Upload JPG/PNG/SVG/WebP (< 2MB)
- ✅ Reject invalid file types
- ✅ Reject files > 2MB
- ✅ Preview before upload
- ✅ Display in detail page
- ✅ Replace existing logo
- ✅ Delete logo
- ✅ Persist after refresh
- ✅ Fallback to initials
- ✅ Error handling
- ✅ Loading states
- ✅ Mobile responsive

---

## 🚀 Performance

| Operation | Target | Actual |
|-----------|--------|--------|
| Upload 100KB | < 1s | TBD |
| Upload 1MB | < 2s | TBD |
| Upload 2MB | < 3s | TBD |
| Display logo | < 100ms | TBD |
| Delete logo | < 500ms | TBD |

---

## 📞 Support

**Documentation:**
- `LOGO_UPLOAD_FEATURE_COMPLETE.md` - Full technical docs
- `LOGO_UPLOAD_TESTING_GUIDE.md` - Testing guide
- `LOGO_UPLOAD_SUMMARY.md` - Quick summary

**Files Modified:**
- Backend: 4 files
- Frontend: 2 files
- Database: 1 migration
- Docs: 3 files

---

## ✨ Status

**Implementation:** ✅ COMPLETE
**Testing:** ⏳ PENDING
**Production:** ⏳ PENDING

**Last Updated:** January 2025
