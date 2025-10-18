# 📌 Profile Settings - Quick Reference

**Status**: ✅ LIVE in Production  
**URL**: https://nusantaragroup.co/settings/profile  
**Deployed**: October 18, 2025 @ 06:17 WIB

---

## 🎯 Features at a Glance

### 1. Avatar Management 🖼️
- **Upload**: Click "Upload Photo" → Select image (JPG/PNG/GIF, max 5MB) → Auto-resize to 400×400px
- **Remove**: Click "Remove Photo" → Confirm → Reverts to gradient avatar with initials
- **Default**: Gradient circle (blue-purple) with user's first initial

### 2. Personal Information 👤
- **Edit Mode**: Click "Edit" → Form expands → Update fields → Save/Cancel
- **Fields**: Full Name*, Email (readonly), Phone, Position, Department, Bio (500 char max)
- **Validation**: Required fullName, phone regex, bio character limit

### 3. Preferences ⚙️
- **Auto-Save**: Change dropdown → Saves immediately (no button needed)
- **Options**:
  - Default Landing Page: Dashboard, Projects, Finance, Inventory
  - Items Per Page: 10, 25, 50, 100
  - Timezone: Jakarta, Makassar, Jayapura, Singapore, UTC
  - Date Format: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
  - Number Format: 1,234.56 (US), 1.234,56 (EU), 1 234,56 (FR)

### 4. Account Activity 📊
- **Display Only**: Account Created, Last Updated, Last Login
- **Format**: Indonesian locale (dd MMMM yyyy, HH:mm WIB)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Fetch current user profile |
| PUT | `/api/auth/profile` | Update personal information |
| PUT | `/api/auth/profile/preferences` | Update preferences (auto-save) |
| POST | `/api/auth/avatar` | Upload avatar image |
| DELETE | `/api/auth/avatar` | Remove avatar |

**Authentication**: All require `Authorization: Bearer {JWT_TOKEN}` header

---

## 🛠️ Quick Commands

### Test Profile API
```bash
# Get profile
curl -X GET https://nusantaragroup.co/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update profile
curl -X PUT https://nusantaragroup.co/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","phone":"+62812345678"}'

# Update preferences
curl -X PUT https://nusantaragroup.co/api/auth/profile/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemsPerPage":50}'

# Upload avatar
curl -X POST https://nusantaragroup.co/api/auth/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@image.jpg"

# Remove avatar
curl -X DELETE https://nusantaragroup.co/api/auth/avatar \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Backend Commands
```bash
# Restart backend
cd /root/APP-YK && docker-compose restart backend

# Check uploads folder
docker-compose exec backend ls -lh uploads/avatars/

# View backend logs
docker-compose logs backend | tail -50

# Install dependencies (if needed)
docker-compose exec backend npm install multer sharp
```

### Frontend Commands
```bash
# Rebuild frontend
cd /root/APP-YK/frontend
docker run --rm -v "$(pwd)":/app -w /app node:20-alpine npm run build

# Deploy to production
sudo cp -r build/* /var/www/html/nusantara-frontend/

# Check bundle size
ls -lh build/static/js/main.*.js
```

---

## 🎨 Component Structure

```
ProfileSettingsPage.js (863 lines)
├── useState Hooks (lines 15-30)
│   ├── profile, setProfile
│   ├── personalInfo, setPersonalInfo
│   ├── preferences, setPreferences
│   ├── avatar, setAvatar
│   ├── isEditingPersonalInfo, setIsEditingPersonalInfo
│   ├── uploading, setUploading
│   └── savingPersonalInfo, setSavingPersonalInfo
│
├── useEffect - Load Profile (lines 32-60)
│   └── Fetch GET /api/auth/profile on mount
│
├── Avatar Handlers (lines 62-180)
│   ├── handleAvatarChange → Upload logic
│   ├── handleRemoveAvatar → Delete logic
│   └── fileInputRef → File input reference
│
├── Personal Info Handlers (lines 182-250)
│   ├── handleSavePersonalInfo → PUT /api/auth/profile
│   └── handleCancelPersonalInfo → Reset form
│
├── Preferences Handler (lines 252-286)
│   └── handlePreferenceChange → PUT /api/auth/profile/preferences
│
├── JSX - Avatar Section (lines 288-369)
│   ├── Avatar display (image or gradient)
│   ├── Upload button
│   ├── Remove button
│   └── File input (hidden)
│
├── JSX - Personal Info Section (lines 371-548)
│   ├── Edit mode: Inline form with fields
│   └── View mode: InfoItem components
│
├── JSX - Preferences Section (lines 550-688)
│   ├── Default Landing Page dropdown
│   ├── Items Per Page dropdown
│   ├── Timezone dropdown
│   ├── Date Format dropdown
│   └── Number Format dropdown
│
├── JSX - Account Activity Section (lines 690-730)
│   ├── Account Created
│   ├── Last Updated
│   └── Last Login
│
└── InfoItem Component (lines 733-748)
    └── Reusable display component with icon
```

---

## 🐛 Common Issues & Fixes

### Issue: Avatar not uploading
```bash
# Check backend logs
docker-compose logs backend | grep "avatar"

# Verify uploads directory
docker-compose exec backend ls -la uploads/avatars

# Check file size (must be < 5MB)
# Check file type (must be JPG/PNG/GIF)
```

### Issue: Preferences not auto-saving
```javascript
// Check network tab in DevTools
// Verify PUT /api/auth/profile/preferences request

// Check console for errors
console.log('Preference change:', preference, value);

// Verify JWT token in localStorage
```

### Issue: Personal info not saving
```javascript
// Check validation errors in UI
// Ensure fullName is not empty
// Verify phone format if provided

// Check network response
// PUT /api/auth/profile should return 200 OK
```

### Issue: Backend not responding
```bash
# Restart backend container
docker-compose restart backend

# Check if backend is running
docker-compose ps

# View recent logs
docker-compose logs backend | tail -100

# Check if routes are loaded
docker-compose exec backend cat routes/auth/authentication.routes.js | grep "profile"
```

---

## 📊 File Locations

### Frontend
```
/root/APP-YK/frontend/src/pages/Settings/components/
├── ProfileSettings/
│   ├── index.js                      # Export wrapper
│   └── ProfileSettingsPage.js        # Main component (863 lines)
├── SettingsPage.js                   # Integration + routing
└── ../utils/constants.js             # Section status: 'available'
```

### Backend
```
/root/APP-YK/backend/
├── routes/auth/authentication.routes.js  # 5 profile endpoints
├── uploads/avatars/                      # Avatar storage folder
└── server.js                             # Static serving: /uploads
```

### Production
```
/var/www/html/nusantara-frontend/
├── index.html                            # Entry point
├── static/js/main.65d4ad23.js           # Bundle (517.57 KB gzipped)
└── static/css/main.a4ac3031.css         # Styles (21.6 KB gzipped)
```

---

## ✅ Validation Rules

### Personal Info
```javascript
{
  fullName: 'Required, 2-100 characters',
  phone: 'Optional, regex: /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/',
  position: 'Optional, max 100 characters',
  department: 'Optional, max 100 characters',
  bio: 'Optional, max 500 characters'
}
```

### Avatar Upload
```javascript
{
  fileType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  maxSize: 5 * 1024 * 1024,  // 5MB
  processing: 'Resize to 400x400, JPEG quality 90%'
}
```

### Preferences
```javascript
{
  defaultLandingPage: ['dashboard', 'projects', 'finance', 'inventory'],
  itemsPerPage: [10, 25, 50, 100],
  timezone: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Singapore', 'UTC'],
  dateFormat: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
  numberFormat: ['1,234.56', '1.234,56', '1 234,56']
}
```

---

## 🎯 Testing Checklist

- [ ] **Avatar Upload**: Select image → Verify preview → Upload → Check success message
- [ ] **Avatar Remove**: Click remove → Confirm → Check default gradient appears
- [ ] **Personal Info Edit**: Click Edit → Update fields → Save → Verify updates
- [ ] **Personal Info Validation**: Try empty fullName → Check error message
- [ ] **Preferences Auto-Save**: Change dropdown → Verify success toast → Refresh → Check persists
- [ ] **Account Activity**: Verify dates display correctly with Indonesian format
- [ ] **Navigation**: Settings → Profile → Back to Settings
- [ ] **API Endpoints**: Test all 5 endpoints with Postman/cURL
- [ ] **Backend Logs**: Check for errors after operations
- [ ] **Bundle Size**: Verify main.65d4ad23.js is 517.57 KB gzipped

---

## 📈 Progress Update

### Settings Page Progress: **62.5%** (5/8 sections)

| Section | Status | Notes |
|---------|--------|-------|
| Database Management | ✅ Complete | Backup, restore, testing |
| User Management | ✅ Complete | Inline editing |
| Notifications | ✅ Complete | Settings + panel + list |
| Security | ✅ Complete | Password, history, sessions |
| **Profile Settings** | ✅ **Complete** | **Avatar, info, preferences, activity** |
| Theme Customization | ⏳ Pending | Dark mode works, need color picker |
| Localization | ⏳ Pending | Low priority |
| Integrations | ⏳ Pending | Low priority |

---

## 🚀 Next Phase

**Recommended**: Theme Customization (6 hours)
- Expand dark mode toggle
- Add color picker (primary/accent colors)
- Layout preferences (sidebar width, compact mode)
- Dashboard widget customization

**Alternative**: Polish Security (2 hours)
- Create LoginHistory table
- Create Sessions table
- Implement real activity tracking
- IP geolocation

---

**Quick Ref Version**: 1.0  
**Last Updated**: October 18, 2025 @ 06:17 WIB  
**Full Documentation**: See PROFILE_SETTINGS_COMPLETE.md
