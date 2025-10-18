# 🎯 Settings Page - Fase Tertunda & Rekomendasi

**Tanggal:** 17 Oktober 2025  
**Status Login:** ✅ BERHASIL (Production working)  
**Progress Keseluruhan:** **25%** (2/8 sections complete)

---

## 📊 STATUS SAAT INI

### ✅ Sections yang Sudah Selesai (2/8)

| No | Section | Status | Progress | File |
|----|---------|--------|----------|------|
| 6 | **Database Management** | ✅ **AVAILABLE** | 100% | `/components/settings/DatabaseManagement.js` |
| 7 | **User Management** | ✅ **AVAILABLE** | 100% | `/pages/Settings/components/UserManagement/` |

**Fitur yang Sudah Berfungsi:**
- ✅ Database backup/restore
- ✅ Database testing (connection, queries, migrations)
- ✅ User list dengan search & filter
- ✅ Create/Edit/Delete users
- ✅ Role management (7 roles)
- ✅ User permissions (granular)
- ✅ Bulk actions (activate/deactivate, delete)
- ✅ Export users to CSV

---

## ⏳ Sections yang Tertunda (6/8)

### Priority: HIGH (Urgent - 2-3 hari)

#### 1. 🔔 **Notifikasi** (Status: `coming-soon`)
**Deskripsi:** Atur preferensi notifikasi email dan push  
**Progress:** 0%  
**Estimasi:** **1.5 hari**

**Fitur yang Perlu Diimplementasi:**

**A. Backend (SUDAH ADA - Tinggal Frontend!)**
- ✅ Notification model (`ApprovalNotification`)
- ✅ Notification service (`NotificationService.js`)
- ✅ API routes (`/api/notifications`, `/api/user-notifications`)
- ✅ Database tables (notifications, push_subscriptions)

**B. Frontend (BELUM - PRIORITAS!)**

1. **Notification Settings Page** (30 menit)
   ```javascript
   Location: /pages/Settings/components/NotificationSettings/
   
   Features:
   - [x] Email notifications ON/OFF
   - [x] Push notifications ON/OFF
   - [x] Notification types (approval, escalation, completion)
   - [x] Email frequency (instant, hourly, daily digest)
   - [x] Quiet hours (don't disturb mode)
   - [x] Channel preferences per notification type
   ```

2. **Notification Center/Panel** (1 jam)
   ```javascript
   Location: /components/Layout/NotificationPanel.js
   
   Features:
   - [x] Real-time notification badge (Bell icon)
   - [x] Dropdown panel with recent notifications
   - [x] Mark as read/unread
   - [x] Delete notification
   - [x] Filter by type (all, approval, escalation)
   - [x] "View All" link to full history
   ```

3. **Notification List Page** (30 menit)
   ```javascript
   Location: /pages/Notifications/
   
   Features:
   - [x] Paginated list of all notifications
   - [x] Filter: unread only, by type, by date
   - [x] Bulk actions: mark all as read, delete selected
   - [x] Notification detail view
   ```

4. **Firebase Cloud Messaging Integration** (OPTIONAL - 40 menit)
   ```javascript
   Location: /utils/firebase.js
   
   Features:
   - [x] Firebase SDK setup
   - [x] Request permission for push
   - [x] Register device token to backend
   - [x] Handle foreground messages
   - [x] Handle background messages (service worker)
   ```

**Dependency:**
- Backend: ✅ **READY** (NotificationService, routes exist)
- Frontend: ❌ **NOT STARTED**

**Blocker:** Tidak ada - backend sudah siap!

**Recommended Next Steps:**
```bash
# 1. Create NotificationSettings component (30 min)
cd /root/APP-YK/frontend/src/pages/Settings/components/
mkdir NotificationSettings
touch NotificationSettings/index.js
touch NotificationSettings/NotificationSettingsPage.js

# 2. Update constants to mark as 'available'
# Edit: /pages/Settings/utils/constants.js
# Change: status: 'coming-soon' → status: 'available'

# 3. Create NotificationPanel in Header (1 hour)
# Edit: /components/Layout/Header.js
# Add: Real-time notification fetching

# 4. Optional: Firebase setup (40 min)
npm install firebase
# Add Firebase config
# Create service worker
```

---

#### 2. 🔒 **Keamanan** (Status: `coming-soon`)
**Deskripsi:** Pengaturan password, autentikasi dua faktor  
**Progress:** 0%  
**Estimasi:** **1 hari**

**Fitur yang Perlu Diimplementasi:**

1. **Change Password** (20 menit)
   ```javascript
   - [x] Current password verification
   - [x] New password (with strength meter)
   - [x] Confirm new password
   - [x] Password validation rules
   ```

2. **Two-Factor Authentication (2FA)** (3 jam)
   ```javascript
   Backend:
   - [ ] Install: npm install speakeasy qrcode
   - [ ] Add: 2FA secret field to User model
   - [ ] Create: /api/auth/2fa/setup (generate QR)
   - [ ] Create: /api/auth/2fa/verify (verify token)
   - [ ] Create: /api/auth/2fa/disable
   
   Frontend:
   - [ ] Enable 2FA page (show QR code)
   - [ ] Verify 2FA code input
   - [ ] Backup codes display
   - [ ] Disable 2FA confirmation
   ```

3. **Login History** (30 menit)
   ```javascript
   - [x] Track login IP, device, timestamp
   - [x] Show last 10 logins
   - [x] Detect suspicious logins
   - [x] Logout all other devices
   ```

4. **Active Sessions** (30 menit)
   ```javascript
   - [x] List active sessions (device, location, last active)
   - [x] Revoke specific session
   - [x] "Logout everywhere" button
   ```

5. **Security Audit Log** (1 jam)
   ```javascript
   - [x] Track password changes
   - [x] Track 2FA enable/disable
   - [x] Track permission changes
   - [x] Export audit log
   ```

**Backend Required:**
- ❌ 2FA setup (speakeasy + QR generation)
- ❌ Session management (JWT refresh tokens)
- ❌ Audit log table & routes

**Frontend Required:**
- ❌ Security settings UI
- ❌ 2FA setup wizard
- ❌ Login history table

**Recommended Priority:** Medium (after Notifications)

---

#### 3. 👤 **Profil Pengguna** (Status: `coming-soon`)
**Deskripsi:** Kelola informasi profil dan preferensi akun  
**Progress:** 0%  
**Estimasi:** **4 jam**

**Fitur:**

1. **Profile Information** (1 jam)
   ```javascript
   - [x] Full name
   - [x] Email (with verification)
   - [x] Phone number
   - [x] Avatar upload
   - [x] Bio/description
   - [x] Job title
   - [x] Department
   ```

2. **Account Settings** (30 menit)
   ```javascript
   - [x] Username (unique)
   - [x] Timezone
   - [x] Date format preference
   - [x] Language preference
   ```

3. **Profile Picture Management** (1 jam)
   ```javascript
   Backend:
   - [ ] Install: npm install multer sharp
   - [ ] Create: /api/users/avatar/upload
   - [ ] Image resize & compression
   - [ ] Store in /uploads/avatars/
   
   Frontend:
   - [x] Avatar upload with preview
   - [x] Crop/resize tool
   - [x] Default avatar if none
   ```

4. **Preferences** (30 menit)
   ```javascript
   - [x] Dashboard layout preference
   - [x] Default page on login
   - [x] Items per page (pagination)
   - [x] Sidebar collapsed by default
   ```

**Backend Required:**
- ❌ Avatar upload endpoint
- ❌ Image processing (multer + sharp)
- ✅ Profile update (already exists in User routes)

**Frontend Required:**
- ❌ Profile edit form
- ❌ Avatar upload component
- ❌ Preferences UI

**Recommended Priority:** Low (nice to have)

---

### Priority: MEDIUM (Important - 3-5 hari)

#### 4. 🎨 **Tema & Tampilan** (Status: `coming-soon`)
**Deskripsi:** Kustomisasi tema dan layout aplikasi  
**Progress:** 30% (Dark mode sudah ada!)  
**Estimasi:** **6 jam**

**Current State:**
- ✅ Dark mode toggle (ThemeContext exists)
- ✅ Basic theme switching
- ❌ Theme customization UI

**Fitur Tambahan:**

1. **Theme Selector** (2 jam)
   ```javascript
   - [x] Light mode
   - [x] Dark mode (✅ already implemented)
   - [x] Auto (system preference)
   - [x] High contrast mode
   - [x] Custom theme builder
   ```

2. **Color Customization** (2 jam)
   ```javascript
   - [x] Primary color picker
   - [x] Secondary color picker
   - [x] Accent color picker
   - [x] Save custom theme
   - [x] Theme presets (Ocean, Forest, Sunset, etc.)
   ```

3. **Layout Preferences** (1 jam)
   ```javascript
   - [x] Sidebar width
   - [x] Sidebar position (left/right)
   - [x] Compact/comfortable density
   - [x] Font size (small, medium, large)
   ```

4. **Dashboard Customization** (1 jam)
   ```javascript
   - [x] Widget arrangement (drag & drop)
   - [x] Show/hide widgets
   - [x] Widget size (small, medium, large)
   - [x] Save layout preference
   ```

**Backend Required:**
- ✅ User preferences field (already in JSONB)
- ❌ Theme preset save endpoint

**Frontend Required:**
- ❌ Theme customization UI
- ❌ Color picker component
- ❌ Layout preferences form

**Recommended Priority:** Low (nice to have, dark mode already works)

---

#### 5. 🌐 **Bahasa & Lokalisasi** (Status: `coming-soon`)
**Deskripsi:** Pilih bahasa dan format regional  
**Progress:** 0%  
**Estimasi:** **2 hari**

**Fitur:**

1. **Language Selection** (4 jam)
   ```javascript
   Backend:
   - [ ] Install: npm install i18next i18next-http-backend
   - [ ] Create: /locales/id/translation.json
   - [ ] Create: /locales/en/translation.json
   - [ ] API: /api/locales/:lang
   
   Frontend:
   - [ ] Install: npm install react-i18next
   - [ ] Create: i18n.js config
   - [ ] Wrap app with I18nextProvider
   - [ ] Replace all text with t('key')
   ```

2. **Regional Settings** (2 jam)
   ```javascript
   - [x] Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
   - [x] Time format (12h, 24h)
   - [x] Currency (IDR, USD, EUR)
   - [x] Number format (1.000,00 vs 1,000.00)
   - [x] Timezone selection
   ```

3. **Translation Management** (ADMIN ONLY - 2 jam)
   ```javascript
   - [x] List all translation keys
   - [x] Edit translations inline
   - [x] Export to JSON
   - [x] Import from JSON
   - [x] Missing translation detection
   ```

**Current State:**
- ✅ Application in Indonesian (default)
- ❌ No i18n framework
- ❌ No English translation

**Recommended Approach:**
```bash
# Option A: Full i18n (2 days)
npm install react-i18next i18next
# Translate all ~500+ strings

# Option B: Hybrid (3 hours)
# Just add language toggle for key areas:
- Dashboard labels
- Navigation menu
- Form labels
# Keep detailed text in Indonesian
```

**Recommended Priority:** Low (app already in Indonesian, most users are local)

---

#### 6. ⚙️ **Integrasi Sistem** (Status: `coming-soon`)
**Deskripsi:** Konfigurasi API dan integrasi pihak ketiga  
**Progress:** 0%  
**Estimasi:** **1 hari**

**Fitur:**

1. **API Key Management** (2 jam)
   ```javascript
   - [x] Generate API key for external apps
   - [x] Revoke API key
   - [x] API key permissions (read-only, full access)
   - [x] API usage statistics
   - [x] Rate limiting configuration
   ```

2. **Webhook Configuration** (2 jam)
   ```javascript
   - [x] Add webhook URL
   - [x] Select events (project.created, invoice.approved, etc.)
   - [x] Webhook secret for signing
   - [x] Test webhook
   - [x] Webhook delivery log
   ```

3. **Third-Party Integrations** (2 jam)
   ```javascript
   - [x] Slack integration (send notifications)
   - [x] Email service (SendGrid, Mailgun)
   - [x] SMS service (Twilio)
   - [x] Cloud storage (S3, Google Cloud)
   - [x] Enable/disable integrations
   ```

4. **OAuth Apps** (ADVANCED - 2 jam)
   ```javascript
   - [x] Register OAuth app
   - [x] Client ID & Secret
   - [x] Redirect URIs
   - [x] Scopes & permissions
   ```

**Backend Required:**
- ❌ API key generation & validation
- ❌ Webhook system
- ❌ Integration connectors

**Frontend Required:**
- ❌ Integration settings UI
- ❌ API key management page
- ❌ Webhook configuration form

**Recommended Priority:** Low (for future external integrations)

---

## 🎯 RECOMMENDED IMPLEMENTATION PRIORITY

### **CRITICAL (Do Now - 2 hari)**

**1. Notifikasi System** ⚡ **PRIORITAS #1**
- **Why:** Backend sudah 100% ready, tinggal frontend!
- **Impact:** High - users need real-time updates
- **Effort:** Low - 1.5 hari
- **Blocker:** NONE

**Implementation Order:**
```
Day 1 (Kamis):
├─ Morning (3h): NotificationSettings page
│  ├─ Email/Push toggle
│  ├─ Notification type preferences
│  └─ Quiet hours settings
│
└─ Afternoon (3h): NotificationPanel in Header
   ├─ Badge with count
   ├─ Dropdown with recent notifications
   └─ Mark as read/delete actions

Day 2 (Jumat):
├─ Morning (2h): Notification List page
│  ├─ Full history with filters
│  └─ Bulk actions
│
└─ Afternoon (2h): Real-time integration
   ├─ WebSocket/polling for live updates
   └─ Toast notifications
```

**2. Keamanan (Security)** 🔒 **PRIORITAS #2**
- **Why:** Security is critical, especially password change
- **Impact:** High - user account security
- **Effort:** Medium - 1 hari
- **Blocker:** 2FA requires backend changes

**Implementation Order:**
```
Day 3 (Sabtu):
├─ Morning (2h): Change Password
│  ├─ Current password verify
│  ├─ Password strength meter
│  └─ Success notification
│
├─ Midday (2h): Login History
│  ├─ Track logins in DB
│  └─ Display last 10 logins
│
└─ Afternoon (2h): Active Sessions
   ├─ JWT refresh token tracking
   └─ Revoke session feature
```

---

### **IMPORTANT (Do Next - 1-2 minggu)**

**3. Profil Pengguna** 👤
- **When:** Week 2
- **Why:** Better user experience
- **Effort:** 4 jam
- **Blocker:** Avatar upload needs backend

**4. Tema & Tampilan** 🎨
- **When:** Week 2
- **Why:** Dark mode sudah ada, tinggal polish
- **Effort:** 6 jam
- **Blocker:** None

---

### **NICE TO HAVE (Future - 1+ bulan)**

**5. Bahasa & Lokalisasi** 🌐
- **When:** Month 2
- **Why:** App already works well in Indonesian
- **Effort:** 2 hari (full i18n) or 3 jam (hybrid)
- **Blocker:** Massive translation effort

**6. Integrasi Sistem** ⚙️
- **When:** Month 3+
- **Why:** Needed only when external systems integrate
- **Effort:** 1 hari
- **Blocker:** No current external integrations

---

## 📋 DETAILED IMPLEMENTATION CHECKLIST

### Phase 1: Notifications (URGENT)

#### Backend (ALREADY DONE ✅)
- [x] Notification model
- [x] NotificationService
- [x] API routes (`/api/notifications`, `/api/user-notifications`)
- [x] Database tables

#### Frontend (TO DO - 1.5 hari)

**Step 1: NotificationSettings Component** (30 min)
```bash
Files to create:
- [x] /pages/Settings/components/NotificationSettings/index.js
- [x] /pages/Settings/components/NotificationSettings/NotificationSettingsPage.js
- [x] /pages/Settings/components/NotificationSettings/EmailSettings.js
- [x] /pages/Settings/components/NotificationSettings/PushSettings.js
- [x] /pages/Settings/components/NotificationSettings/QuietHours.js
```

**Step 2: Update Settings Constants** (5 min)
```javascript
// File: /pages/Settings/utils/constants.js
// Change line 37:
{
  id: 'notifications',
  title: 'Notifikasi',
  icon: Bell,
  description: 'Atur preferensi notifikasi email dan push',
  status: 'available', // ← Change from 'coming-soon'
  color: '#FF9F0A',
  path: '/settings/notifications',
  favorite: true // ← Add to favorites
}
```

**Step 3: NotificationPanel in Header** (1 jam)
```bash
Files to create/edit:
- [x] /components/Layout/NotificationPanel.js (NEW)
- [x] /components/Layout/Header.js (EDIT - integrate panel)
- [x] /hooks/useNotifications.js (NEW - fetch & manage)
```

**Step 4: Notification List Page** (30 min)
```bash
Files to create:
- [x] /pages/Notifications/index.js
- [x] /pages/Notifications/NotificationList.js
- [x] /pages/Notifications/NotificationItem.js
- [x] /pages/Notifications/NotificationFilters.js
```

**Step 5: Real-time Updates** (2 jam)
```bash
Options:
A) WebSocket (recommended for real-time)
B) Polling (simpler, every 30 seconds)
C) Server-Sent Events (one-way real-time)

Implementation:
- [x] Create WebSocket connection
- [x] Subscribe to user notifications
- [x] Update badge count on new notification
- [x] Show toast on new notification
```

**Step 6: Firebase (OPTIONAL - 40 min)**
```bash
Only if push notifications to mobile browsers needed:
- [ ] npm install firebase
- [ ] Create /utils/firebase.js
- [ ] Request notification permission
- [ ] Register device token
- [ ] Handle messages
```

---

### Phase 2: Security (IMPORTANT)

#### Backend (TO DO - 3 jam)

**Step 1: Change Password Endpoint** (30 min)
```javascript
// File: /backend/routes/auth.js
// Add: POST /api/auth/change-password

Required:
- [x] Verify current password
- [x] Hash new password
- [x] Update in database
- [x] Invalidate old sessions (optional)
```

**Step 2: 2FA Setup** (2 jam)
```bash
Install:
npm install speakeasy qrcode

Files:
- [x] /backend/routes/auth.2fa.js (NEW)
- [x] /backend/models/User.js (add: twoFactorSecret, twoFactorEnabled)

Endpoints:
- POST /api/auth/2fa/setup (generate secret + QR)
- POST /api/auth/2fa/verify (verify token)
- POST /api/auth/2fa/disable (turn off 2FA)
- POST /api/auth/login (update to check 2FA)
```

**Step 3: Login History Tracking** (30 min)
```javascript
// File: /backend/models/LoginHistory.js (NEW)
{
  userId: STRING,
  ipAddress: STRING,
  userAgent: STRING,
  location: STRING (optional - GeoIP),
  loginAt: DATE,
  success: BOOLEAN
}

// Update login route to track
```

#### Frontend (TO DO - 3 jam)

**Step 1: Security Settings Page** (1 jam)
```bash
Files:
- [x] /pages/Settings/components/SecuritySettings/index.js
- [x] /pages/Settings/components/SecuritySettings/ChangePassword.js
- [x] /pages/Settings/components/SecuritySettings/TwoFactorAuth.js
- [x] /pages/Settings/components/SecuritySettings/LoginHistory.js
- [x] /pages/Settings/components/SecuritySettings/ActiveSessions.js
```

**Step 2: 2FA Setup Wizard** (1 jam)
```javascript
Steps:
1. Show QR code
2. Ask user to scan with authenticator app
3. Verify code
4. Show backup codes
5. Enable 2FA
```

**Step 3: Login History Table** (30 min)
```javascript
Columns:
- Date & Time
- IP Address
- Device/Browser
- Location
- Status (Success/Failed)
```

---

## 🚀 QUICK START GUIDE

### **Mulai dari Notifikasi (Termudah & Berdampak)**

#### 1. Create NotificationSettings (30 menit)

```bash
cd /root/APP-YK/frontend/src/pages/Settings/components
mkdir NotificationSettings
cd NotificationSettings
touch index.js NotificationSettingsPage.js
```

**File:** `index.js`
```javascript
export { default } from './NotificationSettingsPage';
```

**File:** `NotificationSettingsPage.js` (minimal):
```javascript
import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Moon } from 'lucide-react';
import { API_URL } from '../../../../utils/config';

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: false,
    approvalRequests: true,
    approvalDecisions: true,
    escalations: true,
    completions: false,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/user-notifications/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
        <p className="text-gray-600 mt-1">Manage how and when you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailEnabled}
              onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold">Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushEnabled}
              onChange={(e) => setSettings({...settings, pushEnabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Notification Types</h3>
        <div className="space-y-3">
          {[
            { key: 'approvalRequests', label: 'Approval Requests', desc: 'When you need to approve something' },
            { key: 'approvalDecisions', label: 'Approval Decisions', desc: 'When your request is approved/rejected' },
            { key: 'escalations', label: 'Escalations', desc: 'When a request is escalated' },
            { key: 'completions', label: 'Completions', desc: 'When a process is completed' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Moon className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold">Quiet Hours</h3>
              <p className="text-sm text-gray-600">Don't disturb me during these hours</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.quietHoursEnabled}
              onChange={(e) => setSettings({...settings, quietHoursEnabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        {settings.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => setSettings({...settings, quietHoursStart: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings({...settings, quietHoursEnd: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
```

#### 2. Update SettingsPage.js (10 menit)

```javascript
// File: /pages/Settings/components/SettingsPage.js
// Add import:
import NotificationSettings from './NotificationSettings';

// Add state:
const [showNotificationSettings, setShowNotificationSettings] = useState(false);

// Add handler:
const handleNotificationSection = () => {
  setShowNotificationSettings(true);
  setSelectedSection(null);
  setShowDatabaseSection(false);
  setShowUserManagement(false);
};

// In renderContent(), add:
if (showNotificationSettings) {
  return (
    <div className="mt-4">
      <div className="mb-4">
        <button 
          onClick={handleBackToSettings}
          className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Pengaturan
        </button>
      </div>
      <NotificationSettings />
    </div>
  );
}

// In handleSectionClick:
if (id === 'notifications') {
  handleNotificationSection();
}
```

#### 3. Update constants.js (2 menit)

```javascript
// File: /pages/Settings/utils/constants.js
// Line 37 - Change:
{
  id: 'notifications',
  title: 'Notifikasi',
  icon: Bell,
  description: 'Atur preferensi notifikasi email dan push',
  status: 'available', // ← CHANGED
  color: '#FF9F0A',
  path: '/settings/notifications',
  favorite: true // ← ADDED
}
```

#### 4. Test (5 menit)

```bash
# 1. Access settings page
https://nusantaragroup.co/settings

# 2. Click "Notifikasi" card
# Should navigate to notification settings

# 3. Toggle switches
# Save settings

# 4. Check browser console for API calls
```

---

## 📊 PROGRESS TRACKER

### Current Status (After Login Fix)
- [x] Login system: 100% ✅
- [x] Database Management: 100% ✅
- [x] User Management: 100% ✅
- [ ] Notifications: 0% ⏳ **← NEXT!**
- [ ] Security: 0% ⏳
- [ ] Profile: 0% ⏳
- [ ] Theme: 30% (dark mode only) ⏳
- [ ] Localization: 0% ⏳
- [ ] Integrations: 0% ⏳

### Overall Settings Page Progress
**25%** → Target: **60%** (after Notifications + Security)

---

## 🎯 EXECUTIVE SUMMARY

### What's Done ✅
1. ✅ Login system (production working)
2. ✅ Database Management (full CRUD)
3. ✅ User Management (full CRUD, roles, permissions)

### What's Pending ⏳
1. 🔔 **Notifikasi** (URGENT - backend ready, 1.5 hari frontend)
2. 🔒 **Keamanan** (IMPORTANT - 1 hari)
3. 👤 **Profil Pengguna** (MEDIUM - 4 jam)
4. 🎨 **Tema** (LOW - 6 jam, dark mode works)
5. 🌐 **Lokalisasi** (LOW - 2 hari, app is Indonesian)
6. ⚙️ **Integrasi** (LOW - 1 hari, no current need)

### Recommended Next Action
**Start with Notifications!**  
- Backend: ✅ 100% ready (models, services, routes exist)
- Frontend: ❌ 0% (but easy - 1.5 hari)
- Impact: High (users need real-time updates)
- Blocker: NONE

**Timeline:**
- Day 1: NotificationSettings + NotificationPanel (6 jam)
- Day 2: Notification List + Real-time (4 jam)
- Total: **1.5 hari** to complete

---

**Status:** ✅ **READY TO IMPLEMENT**  
**Next Step:** Create NotificationSettings component  
**Estimated Completion:** 2 hari (Notifications + Security)

