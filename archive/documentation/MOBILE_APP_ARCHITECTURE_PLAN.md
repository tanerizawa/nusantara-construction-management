# 📱 Mobile App Architecture - Nusantara Construction Management

**Tanggal:** 19 Oktober 2025  
**Tujuan:** Versi mobile dengan fitur terbatas untuk Input Dokumentasi, Approval, dan Absensi  
**Platform:** Android (dengan Push Notification)  
**Status:** 📋 PLANNING & ANALYSIS

---

## 📊 ANALISIS SISTEM EXISTING

### ✅ Backend Infrastructure Yang Sudah Ada

#### 1. **Database Schema**

**Tabel Approval System:**
```sql
✅ approval_workflows
   - Multi-level approval configuration
   - Support untuk RAB, PO, Work Orders
   
✅ approval_instances
   - Individual approval instances
   - Status tracking (pending/approved/rejected)
   
✅ approval_steps
   - Step-by-step approval tracking
   - Role-based assignment
   
✅ approval_notifications
   - Notification history per approval
```

**Tabel Dokumentasi (Milestone Photos):**
```sql
✅ milestone_photos
   - Photo documentation system
   - Multiple photo types (progress, issue, inspection, quality, before, after, general)
   - Location tracking (GPS coordinates)
   - Thumbnail support
   - Weather conditions
   - Metadata storage (JSONB)
```

**Tabel User & Authentication:**
```sql
✅ users
   - User authentication
   - Role-based access (admin, project_manager, supervisor, etc.)
   - Profile data (JSONB)
   - Active status tracking
   - Last login tracking
```

#### 2. **API Endpoints Yang Tersedia**

**Approval APIs** (`/api/approval`):
```javascript
✅ GET  /api/approval/pending
   - Mendapatkan pending approvals untuk user
   - Filter by entityType
   - Pagination support

✅ POST /api/approval/instance/:instanceId/decision
   - Approve atau reject
   - Body: { decision: 'approved'|'rejected', comments: string }
   
✅ GET  /api/approval/dashboard
   - Dashboard data (pending count, stats, recent approvals)
   
✅ GET  /api/approval/instance/:instanceId/status
   - Detail status approval
   
✅ GET  /api/approval/project/:projectId/status
   - Status approval untuk project (including PO drafts)

✅ POST /api/approval/purchase-order/:poId/approve
✅ POST /api/approval/purchase-order/:poId/reject
```

**Dokumentasi APIs** (`/api/projects/:projectId/milestones/:milestoneId`):
```javascript
✅ GET  /photos
   - List photos dengan filter (photoType, limit, offset)
   
✅ POST /photos
   - Upload multiple photos (max 10)
   - Support: title, description, photoType, takenAt
   - Auto thumbnail generation
   - File types: JPEG, JPG, PNG, GIF (max 10MB)
   
✅ DELETE /photos/:photoId
   - Hapus photo
```

**Notification APIs** (`/api/notifications`):
```javascript
✅ GET  /api/notifications
   - Get user notifications dengan pagination
   - Filter unreadOnly
   
✅ GET  /api/notifications/unread-count
   - Count unread notifications
   
✅ PUT  /api/notifications/:id/read
   - Mark as read
   
✅ PUT  /api/notifications/mark-all-read
   - Mark all as read
```

**Authentication APIs** (`/api/auth`):
```javascript
✅ POST /api/auth/login
   - Login with username/email + password
   - Returns: JWT token, user data
   
✅ POST /api/auth/logout
✅ GET  /api/auth/me
   - Get current user profile
```

#### 3. **Notification Service**

**NotificationService** (`backend/services/NotificationService.js`):
- ✅ Create notification system
- ✅ Support approval notifications
- ✅ User-based notification delivery
- ⚠️ Firebase integration sudah di-setup tapi belum aktif

### ❌ Yang Belum Ada (Perlu Dibuat)

1. **Attendance/Absensi System**
   - ❌ Tidak ada tabel attendance
   - ❌ Tidak ada API absensi
   - ❌ Perlu dibuat dari scratch

2. **Firebase Push Notification**
   - ✅ Config sudah ada di docker-compose.yml
   - ⚠️ Belum terintegrate dengan approval workflow
   - ❌ Belum ada FCM token management

3. **Mobile-Specific APIs**
   - ❌ Tidak ada API optimization untuk mobile
   - ❌ Tidak ada data compression
   - ❌ Tidak ada offline support

---

## 🎯 MOBILE APP REQUIREMENTS

### Fitur Utama (3 Fitur Inti)

#### 1. **Input Dokumentasi** 📸
**Tujuan:** Field staff bisa upload foto progress pekerjaan langsung dari lapangan

**Features:**
- Camera capture langsung dari app
- Upload multiple photos sekaligus
- Add title & description
- Select photo type (Progress, Issue, Inspection, Quality, Before, After)
- GPS location auto-capture
- Weather condition (optional, manual atau API)
- Preview before upload
- Offline queue (upload when online)

**User Flow:**
```
1. Login → Dashboard
2. Tap "Dokumentasi" card
3. Select Project → Select Milestone
4. Tap "📷 Ambil Foto" atau "📁 Pilih dari Galeri"
5. Multiple photo selection
6. Fill form:
   - Title (required)
   - Description (optional)
   - Photo Type (dropdown)
   - Location (auto-captured, can edit)
7. Preview grid of selected photos
8. Tap "Upload" → Progress indicator
9. Success notification
```

#### 2. **Approval** ✅❌
**Tujuan:** Manager/Director bisa approve/reject dari mana saja

**Features:**
- List pending approvals (real-time)
- Filter by type (RAB, PO, Work Order)
- Sort by priority/date
- Approval detail view (ringkasan)
- Approve/Reject dengan single tap
- Add comments (optional)
- Push notification ketika ada approval baru
- Deep link ke approval detail

**User Flow:**
```
1. Receive push notification: "New Approval Request"
2. Tap notification → Auto open app ke Approval Detail
3. View approval summary:
   - Type (PO/RAB/WO)
   - Amount
   - Requester
   - Date
   - Items summary
4. Swipe left = Reject, Swipe right = Approve (atau tombol)
5. Optional: Add comment
6. Confirm action
7. Success notification
8. Update list real-time
```

**Approval Card Design:**
```
┌─────────────────────────────────────┐
│ 📋 Purchase Order - PO-2024-001     │
│ ────────────────────────────────────│
│ Supplier: PT. Bangunan Jaya         │
│ Amount: Rp 250,000,000              │
│ Items: 5 items                       │
│ Requested by: John Doe               │
│ Date: 19 Oct 2024 14:30            │
│ ────────────────────────────────────│
│ [❌ REJECT]         [✅ APPROVE]    │
└─────────────────────────────────────┘
```

#### 3. **Absensi** 📍
**Tujuan:** Tracking kehadiran karyawan di lokasi proyek

**Features:**
- Clock In / Clock Out
- GPS-based location verification (radius checking)
- Photo selfie verification
- Real-time attendance status
- Attendance history (current week/month)
- Overtime tracking
- Leave request
- Late notification

**User Flow:**
```
1. Open app → Dashboard
2. Tap "Absensi" card
3. Show current status:
   - Last Clock In: 08:00 AM
   - Duration: 2h 30m
   - Location: Project Site A
4. Tap "Clock In" button:
   - Take selfie
   - Verify GPS location (must be within project radius)
   - Confirm
5. Success → Status changed to "Working"
6. Tap "Clock Out":
   - Take selfie
   - Auto-calculate work duration
   - Confirm
7. Success → Attendance logged
```

**Attendance Card Design:**
```
┌─────────────────────────────────────┐
│ 📅 Absensi Hari Ini                 │
│ ────────────────────────────────────│
│ Status: ● Working                   │
│ Clock In: 08:00 AM                  │
│ Duration: 5h 23m                    │
│ Location: ✓ Project Site A          │
│ ────────────────────────────────────│
│ [📷 CLOCK OUT]                      │
└─────────────────────────────────────┘
```

---

## 🏗️ MOBILE APP ARCHITECTURE

### Technology Stack Recommendation

#### Option 1: **PWA (Progressive Web App)** ⭐⭐⭐ HIGHLY RECOMMENDED
```
Pros:
✅ Development cepat (3 minggu vs 10 minggu)
✅ Biaya murah (Rp 40 juta vs Rp 105 juta = 62% cheaper!)
✅ 90% code reuse dari web app existing
✅ No app store approval (instant deploy)
✅ Instant updates (no waiting for approval)
✅ Cross-platform (Android, iOS, Desktop) automatic
✅ Lightweight (~5MB vs 50MB native)
✅ Install to home screen like native app
✅ Push notifications (Android, iOS 16.4+)
✅ Offline support dengan service workers
✅ Camera & GPS access via web APIs
✅ SEO friendly (masih searchable)
✅ Easy maintenance (1 codebase)

Cons:
❌ iOS push notification terbatas (iOS 16.4+ only)
❌ Tidak bisa akses fitur native advanced (Bluetooth, NFC)
❌ Performance slightly lower dari native (tapi cukup untuk use case kita)
❌ No presence di App Store (tapi bisa via TWA)

Perfect for: Dokumentasi, Approval, Absensi ✅
```

**📄 See detailed PWA implementation plan:** `PWA_IMPLEMENTATION_PLAN.md`

#### Option 2: **React Native** ⭐⭐ ALTERNATIVE
```
Pros:
✅ Codebase 70% reuse dari web (React)
✅ Cross-platform (iOS + Android)
✅ Large ecosystem (expo, libraries)
✅ Fast development
✅ Hot reload
✅ Native performance with Hermes engine
✅ Team sudah familiar dengan React
✅ Best performance
✅ Full native features access

Cons:
❌ Larger app size (~50MB)
❌ Some native features need bridging
❌ Development time: 10 weeks
❌ Cost: Rp 105 juta
❌ App store approval delay (1-2 weeks)
❌ Separate codebase maintenance
```

**Libraries:**
- **Navigation:** React Navigation 6
- **State Management:** Redux Toolkit / Zustand
- **API Client:** Axios
- **Push Notifications:** @react-native-firebase/messaging
- **Camera:** react-native-camera / expo-camera
- **Location:** @react-native-community/geolocation
- **Image Upload:** react-native-image-picker
- **Offline Storage:** @react-native-async-storage
- **UI Library:** React Native Paper / NativeBase

#### Option 2: **Flutter**
```
Pros:
✅ Excellent performance
✅ Beautiful UI out-of-box
✅ Single codebase

Cons:
❌ Team harus belajar Dart
❌ No code reuse dari web
❌ Longer development time
```

#### Option 3: **Native (Kotlin/Java)**
```
Pros:
✅ Best performance
✅ Full native features

Cons:
❌ Android only
❌ Longest development time
❌ No code reuse
```

**DECISION: PWA (Progressive Web App)** ⭐ RECOMMENDED

**Why PWA over React Native for this project:**
1. **62% cheaper**: Rp 40 juta vs Rp 105 juta
2. **70% faster**: 3 weeks vs 10 weeks development
3. **90% code reuse**: Existing React web app
4. **Instant deployment**: No app store approval
5. **Use case perfect**: Dokumentasi, Approval, Absensi tidak butuh native features advanced
6. **Easier maintenance**: 1 codebase untuk semua platform

**Alternative: React Native dengan Expo** (if need native features later)

---

## 🗂️ PROJECT STRUCTURE

```
mobile-app/
├── android/                # Android native code
├── ios/                    # iOS native code (future)
├── src/
│   ├── api/               # API clients
│   │   ├── auth.api.js
│   │   ├── approval.api.js
│   │   ├── documentation.api.js
│   │   ├── attendance.api.js
│   │   └── notification.api.js
│   │
│   ├── assets/            # Images, fonts, icons
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/        # Reusable components
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   ├── Loading.js
│   │   │   └── Header.js
│   │   │
│   │   ├── approval/
│   │   │   ├── ApprovalCard.js
│   │   │   ├── ApprovalDetail.js
│   │   │   ├── ApprovalActions.js
│   │   │   └── ApprovalFilter.js
│   │   │
│   │   ├── documentation/
│   │   │   ├── PhotoUploader.js
│   │   │   ├── PhotoCard.js
│   │   │   ├── ProjectSelector.js
│   │   │   └── MilestoneSelector.js
│   │   │
│   │   └── attendance/
│   │       ├── ClockInButton.js
│   │       ├── AttendanceCard.js
│   │       ├── LocationVerifier.js
│   │       └── SelfieCapture.js
│   │
│   ├── screens/           # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SplashScreen.js
│   │   │
│   │   ├── home/
│   │   │   └── DashboardScreen.js
│   │   │
│   │   ├── approval/
│   │   │   ├── ApprovalListScreen.js
│   │   │   └── ApprovalDetailScreen.js
│   │   │
│   │   ├── documentation/
│   │   │   ├── DocumentationScreen.js
│   │   │   ├── ProjectListScreen.js
│   │   │   ├── MilestoneListScreen.js
│   │   │   └── PhotoUploadScreen.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceScreen.js
│   │   │   ├── AttendanceHistoryScreen.js
│   │   │   └── LeaveRequestScreen.js
│   │   │
│   │   └── profile/
│   │       └── ProfileScreen.js
│   │
│   ├── navigation/        # Navigation setup
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   │
│   ├── store/             # Redux/Zustand store
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── approvalSlice.js
│   │   │   ├── documentationSlice.js
│   │   │   └── attendanceSlice.js
│   │   └── store.js
│   │
│   ├── services/          # Business logic
│   │   ├── authService.js
│   │   ├── notificationService.js
│   │   ├── locationService.js
│   │   ├── cameraService.js
│   │   └── storageService.js
│   │
│   ├── utils/             # Utilities
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useNotification.js
│   │   ├── useLocation.js
│   │   └── useCamera.js
│   │
│   └── App.js             # Root component
│
├── app.json               # Expo config
├── package.json
└── babel.config.js
```

---

## 🔔 PUSH NOTIFICATION ARCHITECTURE

### Deep Linking Strategy

**URL Scheme:** `nusantara://`

**Deep Link Routes:**
```javascript
{
  'nusantara://approval/:approvalId': 'ApprovalDetailScreen',
  'nusantara://documentation/:projectId/:milestoneId': 'PhotoUploadScreen',
  'nusantara://attendance': 'AttendanceScreen',
  'nusantara://profile': 'ProfileScreen'
}
```

**Notification Payload Structure:**
```json
{
  "notification": {
    "title": "New Approval Request",
    "body": "PO-2024-001 - Rp 250,000,000 needs your approval",
    "icon": "@drawable/ic_notification",
    "sound": "default",
    "badge": "1"
  },
  "data": {
    "type": "approval",
    "action": "view_detail",
    "approvalId": "uuid-here",
    "entityType": "purchase_order",
    "deepLink": "nusantara://approval/uuid-here",
    "priority": "high"
  }
}
```

**Notification Handling Flow:**
```javascript
// services/notificationService.js
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';

class NotificationService {
  
  // Initialize FCM
  async init() {
    // Request permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // Get FCM token
      const fcmToken = await messaging().getToken();
      
      // Register token to backend
      await this.registerDeviceToken(fcmToken);
      
      // Listen for token refresh
      messaging().onTokenRefresh(token => {
        this.registerDeviceToken(token);
      });
    }
  }
  
  // Handle foreground notifications
  setupForegroundHandler() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
      
      // Show in-app notification
      showInAppNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        onPress: () => this.handleNotificationPress(remoteMessage.data)
      });
    });
  }
  
  // Handle background/quit notifications
  setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Notification:', remoteMessage);
    });
    
    // Handle notification tap (app opened from notification)
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      this.handleNotificationPress(remoteMessage.data);
    });
    
    // Check if app was opened by notification (app was quit)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state:', remoteMessage);
          this.handleNotificationPress(remoteMessage.data);
        }
      });
  }
  
  // Navigate based on notification data
  handleNotificationPress(data) {
    const { type, deepLink, approvalId } = data;
    
    if (deepLink) {
      Linking.openURL(deepLink);
    } else {
      // Fallback navigation
      switch (type) {
        case 'approval':
          navigation.navigate('ApprovalDetail', { id: approvalId });
          break;
        case 'documentation':
          navigation.navigate('Documentation');
          break;
        case 'attendance':
          navigation.navigate('Attendance');
          break;
      }
    }
  }
  
  // Register device token to backend
  async registerDeviceToken(token) {
    try {
      await axios.post('/api/notifications/register-device', {
        userId: getCurrentUserId(),
        token: token,
        platform: Platform.OS,
        appVersion: getAppVersion()
      });
    } catch (error) {
      console.error('Failed to register device token:', error);
    }
  }
}

export default new NotificationService();
```

---

## 🛠️ BACKEND ENHANCEMENTS NEEDED

### 1. Create Attendance System

**Migration:** `backend/migrations/20251019_create_attendance_system.sql`

```sql
-- Attendance Check-ins Table
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Clock In
  clock_in_time TIMESTAMP NOT NULL,
  clock_in_location_lat DECIMAL(10, 8),
  clock_in_location_lng DECIMAL(11, 8),
  clock_in_address TEXT,
  clock_in_photo_url TEXT,
  
  -- Clock Out
  clock_out_time TIMESTAMP,
  clock_out_location_lat DECIMAL(10, 8),
  clock_out_location_lng DECIMAL(11, 8),
  clock_out_address TEXT,
  clock_out_photo_url TEXT,
  
  -- Calculated
  work_duration INTERVAL,
  is_late BOOLEAN DEFAULT false,
  late_duration INTERVAL,
  is_overtime BOOLEAN DEFAULT false,
  overtime_duration INTERVAL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'working', -- 'working', 'completed', 'no_clock_out'
  
  -- Notes
  notes TEXT,
  approved_by VARCHAR REFERENCES users(id),
  approved_at TIMESTAMP,
  
  -- Metadata
  device_info JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_user_date ON attendance_records(user_id, DATE(clock_in_time));
CREATE INDEX idx_attendance_project ON attendance_records(project_id);
CREATE INDEX idx_attendance_status ON attendance_records(status);

-- Project Site Locations (for GPS verification)
CREATE TABLE project_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  location_name VARCHAR(255),
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100, -- 100 meter radius
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_project_locations_project ON project_locations(project_id);

-- Attendance Settings
CREATE TABLE attendance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Working hours
  work_start_time TIME DEFAULT '08:00:00',
  work_end_time TIME DEFAULT '17:00:00',
  
  -- Late tolerance
  late_tolerance_minutes INTEGER DEFAULT 15,
  
  -- Overtime
  overtime_start_after_minutes INTEGER DEFAULT 60,
  
  -- GPS verification
  require_gps_verification BOOLEAN DEFAULT true,
  gps_accuracy_meters INTEGER DEFAULT 50,
  
  -- Photo verification
  require_photo_verification BOOLEAN DEFAULT true,
  
  -- Working days
  working_days JSONB DEFAULT '["monday","tuesday","wednesday","thursday","friday"]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(project_id)
);

-- Leave Requests
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  
  leave_type VARCHAR(50) NOT NULL, -- 'sick', 'annual', 'personal', 'emergency'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  
  reason TEXT,
  attachment_url TEXT,
  
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  approved_by VARCHAR REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
```

**API Routes:** `backend/routes/attendance.js`

```javascript
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const AttendanceService = require('../services/AttendanceService');

// Clock In
router.post('/clock-in', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      projectId, 
      latitude, 
      longitude, 
      address,
      photoUrl,
      deviceInfo 
    } = req.body;
    
    // Verify location is within project radius
    const isValidLocation = await AttendanceService.verifyLocation(
      projectId, 
      latitude, 
      longitude
    );
    
    if (!isValidLocation) {
      return res.status(400).json({
        success: false,
        error: 'Location verification failed. You must be at the project site.'
      });
    }
    
    // Check if already clocked in today
    const existingRecord = await AttendanceService.getTodayRecord(userId);
    if (existingRecord && !existingRecord.clock_out_time) {
      return res.status(400).json({
        success: false,
        error: 'Already clocked in today'
      });
    }
    
    // Create attendance record
    const record = await AttendanceService.clockIn({
      userId,
      projectId,
      location: { lat: latitude, lng: longitude, address },
      photoUrl,
      deviceInfo
    });
    
    // Send notification to supervisor
    await NotificationService.sendAttendanceNotification(record);
    
    res.json({
      success: true,
      data: record,
      message: 'Clock in successful'
    });
    
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock in',
      details: error.message
    });
  }
});

// Clock Out
router.post('/clock-out', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, address, photoUrl, notes } = req.body;
    
    // Get today's record
    const record = await AttendanceService.getTodayRecord(userId);
    if (!record) {
      return res.status(400).json({
        success: false,
        error: 'No clock in record found for today'
      });
    }
    
    if (record.clock_out_time) {
      return res.status(400).json({
        success: false,
        error: 'Already clocked out'
      });
    }
    
    // Update with clock out
    const updatedRecord = await AttendanceService.clockOut(record.id, {
      location: { lat: latitude, lng: longitude, address },
      photoUrl,
      notes
    });
    
    res.json({
      success: true,
      data: updatedRecord,
      message: 'Clock out successful'
    });
    
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock out',
      details: error.message
    });
  }
});

// Get today's attendance status
router.get('/today', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const record = await AttendanceService.getTodayRecord(userId);
    
    res.json({
      success: true,
      data: record || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get attendance history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30 } = req.query;
    
    const records = await AttendanceService.getHistory(userId, {
      startDate,
      endDate,
      limit
    });
    
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get attendance summary
router.get('/summary/:year/:month', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.params;
    
    const summary = await AttendanceService.getMonthlySummary(userId, year, month);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit leave request
router.post('/leave-request', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { leaveType, startDate, endDate, reason, attachmentUrl } = req.body;
    
    const leaveRequest = await AttendanceService.createLeaveRequest({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      attachmentUrl
    });
    
    // Notify supervisor
    await NotificationService.sendLeaveRequestNotification(leaveRequest);
    
    res.json({
      success: true,
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

**Service:** `backend/services/AttendanceService.js`

```javascript
const AttendanceRecord = require('../models/AttendanceRecord');
const ProjectLocation = require('../models/ProjectLocation');
const AttendanceSetting = require('../models/AttendanceSetting');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

class AttendanceService {
  
  /**
   * Verify if location is within project radius
   */
  async verifyLocation(projectId, latitude, longitude) {
    const projectLocation = await ProjectLocation.findOne({
      where: { projectId, isActive: true }
    });
    
    if (!projectLocation) {
      throw new Error('Project location not configured');
    }
    
    const distance = this.calculateDistance(
      latitude, 
      longitude,
      projectLocation.location_lat,
      projectLocation.location_lng
    );
    
    return distance <= projectLocation.radius_meters;
  }
  
  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
  
  /**
   * Clock In
   */
  async clockIn(data) {
    const { userId, projectId, location, photoUrl, deviceInfo } = data;
    
    const settings = await AttendanceSetting.findOne({
      where: { projectId }
    });
    
    const now = moment().tz('Asia/Jakarta');
    const workStartTime = moment(settings.work_start_time, 'HH:mm:ss');
    
    // Check if late
    const isLate = now.isAfter(workStartTime.add(settings.late_tolerance_minutes, 'minutes'));
    const lateDuration = isLate 
      ? moment.duration(now.diff(workStartTime)).asMinutes() 
      : 0;
    
    const record = await AttendanceRecord.create({
      userId,
      projectId,
      clock_in_time: now.toDate(),
      clock_in_location_lat: location.lat,
      clock_in_location_lng: location.lng,
      clock_in_address: location.address,
      clock_in_photo_url: photoUrl,
      is_late: isLate,
      late_duration: lateDuration > 0 ? `${lateDuration} minutes` : null,
      status: 'working',
      device_info: deviceInfo
    });
    
    return record;
  }
  
  /**
   * Clock Out
   */
  async clockOut(recordId, data) {
    const { location, photoUrl, notes } = data;
    
    const record = await AttendanceRecord.findByPk(recordId);
    const now = moment().tz('Asia/Jakarta');
    
    const clockInTime = moment(record.clock_in_time);
    const workDuration = moment.duration(now.diff(clockInTime));
    
    // Check overtime (more than 8 hours)
    const isOvertime = workDuration.asHours() > 8;
    const overtimeDuration = isOvertime 
      ? workDuration.asHours() - 8 
      : 0;
    
    await record.update({
      clock_out_time: now.toDate(),
      clock_out_location_lat: location.lat,
      clock_out_location_lng: location.lng,
      clock_out_address: location.address,
      clock_out_photo_url: photoUrl,
      work_duration: `${workDuration.asHours()} hours`,
      is_overtime: isOvertime,
      overtime_duration: overtimeDuration > 0 ? `${overtimeDuration} hours` : null,
      status: 'completed',
      notes
    });
    
    return record;
  }
  
  /**
   * Get today's attendance record
   */
  async getTodayRecord(userId) {
    const today = moment().tz('Asia/Jakarta').startOf('day');
    
    return await AttendanceRecord.findOne({
      where: {
        userId,
        clock_in_time: {
          [Op.gte]: today.toDate()
        }
      }
    });
  }
  
  /**
   * Get attendance history
   */
  async getHistory(userId, options = {}) {
    const { startDate, endDate, limit } = options;
    
    const where = { userId };
    
    if (startDate && endDate) {
      where.clock_in_time = {
        [Op.between]: [
          moment(startDate).startOf('day').toDate(),
          moment(endDate).endOf('day').toDate()
        ]
      };
    }
    
    return await AttendanceRecord.findAll({
      where,
      order: [['clock_in_time', 'DESC']],
      limit: limit || 30
    });
  }
  
  /**
   * Get monthly summary
   */
  async getMonthlySummary(userId, year, month) {
    const startDate = moment(`${year}-${month}-01`).startOf('month');
    const endDate = moment(startDate).endOf('month');
    
    const records = await AttendanceRecord.findAll({
      where: {
        userId,
        clock_in_time: {
          [Op.between]: [startDate.toDate(), endDate.toDate()]
        }
      }
    });
    
    const summary = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === 'completed').length,
      lateDays: records.filter(r => r.is_late).length,
      overtimeDays: records.filter(r => r.is_overtime).length,
      totalWorkHours: records.reduce((sum, r) => {
        if (r.work_duration) {
          const hours = parseFloat(r.work_duration.split(' ')[0]);
          return sum + hours;
        }
        return sum;
      }, 0)
    };
    
    return {
      ...summary,
      records
    };
  }
  
  /**
   * Create leave request
   */
  async createLeaveRequest(data) {
    const { userId, leaveType, startDate, endDate, reason, attachmentUrl } = data;
    
    const start = moment(startDate);
    const end = moment(endDate);
    const totalDays = end.diff(start, 'days') + 1;
    
    return await LeaveRequest.create({
      userId,
      leaveType,
      startDate: start.toDate(),
      endDate: end.toDate(),
      totalDays,
      reason,
      attachmentUrl,
      status: 'pending'
    });
  }
}

module.exports = new AttendanceService();
```

---

### 2. Enhance Notification System for Mobile

**Update:** `backend/services/NotificationService.js`

Add mobile-specific notification methods:

```javascript
/**
 * Send approval notification to mobile
 */
async sendApprovalNotificationMobile(approvalInstance, approverId) {
  const user = await User.findByPk(approverId);
  const pref = await NotificationPreference.findOne({
    where: { userId: approverId }
  });
  
  if (!pref || !pref.device_tokens || pref.device_tokens.length === 0) {
    console.log('No device tokens for user:', approverId);
    return;
  }
  
  const message = {
    notification: {
      title: '🔔 New Approval Request',
      body: `${approvalInstance.entityType.toUpperCase()} - ${this.formatCurrency(approvalInstance.totalAmount)} needs your approval`,
      icon: '@drawable/ic_approval',
      sound: 'default',
      badge: '1',
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    data: {
      type: 'approval',
      action: 'view_detail',
      approvalId: approvalInstance.id,
      entityType: approvalInstance.entityType,
      entityId: approvalInstance.entityId,
      amount: String(approvalInstance.totalAmount),
      deepLink: `nusantara://approval/${approvalInstance.id}`,
      priority: 'high',
      timestamp: new Date().toISOString()
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'approval_channel',
        priority: 'high',
        sound: 'default',
        defaultSound: true,
        defaultVibrateTimings: true,
        defaultLightSettings: true
      }
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default',
          category: 'APPROVAL_CATEGORY'
        }
      }
    },
    tokens: pref.device_tokens
  };
  
  try {
    const response = await this.messaging.sendMulticast(message);
    console.log('Approval notification sent:', {
      success: response.successCount,
      failed: response.failureCount
    });
    
    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(pref.device_tokens[idx]);
        }
      });
      await this.removeInvalidTokens(approverId, failedTokens);
    }
    
    return response;
  } catch (error) {
    console.error('Failed to send approval notification:', error);
    throw error;
  }
}

/**
 * Remove invalid FCM tokens
 */
async removeInvalidTokens(userId, tokens) {
  const pref = await NotificationPreference.findOne({
    where: { userId }
  });
  
  const validTokens = pref.device_tokens.filter(t => !tokens.includes(t));
  await pref.update({ device_tokens: validTokens });
}
```

---

## 📱 MOBILE SCREENS DESIGN

### 1. Dashboard Screen

```
┌─────────────────────────────────────┐
│  ☰  Dashboard         👤 🔔(3)     │
├─────────────────────────────────────┤
│                                     │
│ 👋 Selamat Pagi, John Doe           │
│ Project Manager                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 Approval           (5)       │ │
│ │ You have 5 pending approvals    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📸 Dokumentasi                  │ │
│ │ Upload progress photos          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📍 Absensi          ● Working   │ │
│ │ Clock In: 08:00 AM (2h 30m)    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Recent Activity ───────────────┐ │
│ │ • PO-2024-001 approved          │ │
│ │ • 5 photos uploaded to Site A   │ │
│ │ • Clocked in at 08:00 AM        │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 2. Approval List Screen

```
┌─────────────────────────────────────┐
│  ←  Approval             [Filter]   │
├─────────────────────────────────────┤
│ [All] [RAB] [PO] [Work Order]       │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 PO-2024-001        HIGH      │ │
│ │ PT. Bangunan Jaya               │ │
│ │ Rp 250,000,000                  │ │
│ │ 5 items • By: John • 2h ago     │ │
│ │ ──────────────────────────────  │ │
│ │ [REJECT]            [APPROVE]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📊 RAB-KRW-2024-003   MEDIUM    │ │
│ │ Foundation Work                 │ │
│ │ Rp 180,000,000                  │ │
│ │ 25 items • By: Jane • 5h ago    │ │
│ │ ──────────────────────────────  │ │
│ │ [REJECT]            [APPROVE]   │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 3. Approval Detail Screen (Swipe Actions)

```
┌─────────────────────────────────────┐
│  ←  Purchase Order                  │
├─────────────────────────────────────┤
│                                     │
│ PO-2024-001                         │
│ Status: ⏳ Pending Approval          │
│                                     │
│ ┌─ Supplier ──────────────────────┐ │
│ │ PT. Bangunan Jaya               │ │
│ │ 📞 +62 21 1234567               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Financial ─────────────────────┐ │
│ │ Total: Rp 250,000,000           │ │
│ │ Tax: Rp 25,000,000 (10%)        │ │
│ │ Grand Total: Rp 275,000,000     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Items (5) ─────────────────────┐ │
│ │ • Semen Portland (100 sak)      │ │
│ │   Rp 65,000 × 100 = Rp 6,500K   │ │
│ │ • Besi Beton 12mm (500 btg)     │ │
│ │   Rp 85,000 × 500 = Rp 42,500K  │ │
│ │ • [View all items...]           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Timeline ──────────────────────┐ │
│ │ ● Created by John Doe           │ │
│ │   19 Oct 2024 14:30             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Comments (Optional) ───────────┐ │
│ │ [Type your comment...]          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [❌ REJECT]        [✅ APPROVE]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⬅️ Swipe left to REJECT             │
│ ➡️ Swipe right to APPROVE            │
│                                     │
└─────────────────────────────────────┘
```

### 4. Documentation Screen

```
┌─────────────────────────────────────┐
│  ←  Dokumentasi                     │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Select Project ────────────────┐ │
│ │ Villa Bali Construction    [▼]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Select Milestone ──────────────┐ │
│ │ Foundation Complete        [▼]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [📷 Camera]  [📁 Gallery]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Photos (3) ────────────────────┐ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐     │ │
│ │ │ 📷 1 │ │ 📷 2 │ │ 📷 3 │  [+]│ │
│ │ └──────┘ └──────┘ └──────┘     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Title *                             │
│ ┌─────────────────────────────────┐ │
│ │ Foundation Progress - Week 2    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description                         │
│ ┌─────────────────────────────────┐ │
│ │ Concrete pouring complete...    │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Photo Type                          │
│ ┌─────────────────────────────────┐ │
│ │ Progress               [▼]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Location: ✓ Project Site A (GPS)   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        [🚀 UPLOAD PHOTOS]       │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 5. Attendance Screen

```
┌─────────────────────────────────────┐
│  ←  Absensi              [History]  │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Today Status ──────────────────┐ │
│ │ 📅 Senin, 19 Oktober 2024        │ │
│ │                                  │ │
│ │ Status: ● Working                │ │
│ │ Clock In: 08:00 AM               │ │
│ │ Duration: 5h 23m                 │ │
│ │                                  │ │
│ │ Location: ✓ Project Site A       │ │
│ │ Distance: 12m from center        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Clock In Photo ────────────────┐ │
│ │ [📷 Selfie photo shown here]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Location Map ──────────────────┐ │
│ │ [🗺️ Mini map with user marker]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       [📷 CLOCK OUT]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ This Week ─────────────────────┐ │
│ │ Mon ✓ Tue ✓ Wed ✓ Thu ✓ Fri -   │ │
│ │ Total: 32h 15m (4 days)         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Quick Stats ───────────────────┐ │
│ │ On Time: 18 days                │ │
│ │ Late: 2 days                    │ │
│ │ Overtime: 5 days                │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚙️ IMPLEMENTATION ROADMAP

### Phase 1: Backend Preparation (Week 1-2)

**Week 1:**
- [ ] Create attendance database schema
- [ ] Build AttendanceService
- [ ] Create attendance API endpoints
- [ ] Setup Firebase Admin SDK
- [ ] Implement FCM token registration
- [ ] Create mobile-specific notification methods

**Week 2:**
- [ ] Test attendance APIs dengan Postman
- [ ] Test notification system
- [ ] Create sample data untuk testing
- [ ] Document API endpoints
- [ ] Setup monitoring & logging

### Phase 2: Mobile App Development (Week 3-6)

**Week 3: Project Setup & Authentication**
- [ ] Initialize React Native project dengan Expo
- [ ] Setup navigation structure
- [ ] Install dependencies (Firebase, Axios, etc.)
- [ ] Create authentication flow (Login/Logout)
- [ ] Setup API client
- [ ] Create reusable components (Button, Card, Input, etc.)

**Week 4: Approval Module**
- [ ] Build ApprovalListScreen
- [ ] Create ApprovalCard component
- [ ] Implement ApprovalDetailScreen
- [ ] Add swipe actions (approve/reject)
- [ ] Connect to approval APIs
- [ ] Test approval workflow

**Week 5: Documentation Module**
- [ ] Build DocumentationScreen
- [ ] Implement camera capture
- [ ] Create gallery picker
- [ ] Build photo upload functionality
- [ ] Add progress indicator
- [ ] Implement offline queue
- [ ] Test photo upload

**Week 6: Attendance Module**
- [ ] Build AttendanceScreen
- [ ] Implement GPS location service
- [ ] Create selfie capture feature
- [ ] Build clock in/out functionality
- [ ] Create AttendanceHistoryScreen
- [ ] Test location verification

### Phase 3: Push Notification Integration (Week 7)

- [ ] Setup Firebase Cloud Messaging
- [ ] Implement FCM token registration
- [ ] Handle foreground notifications
- [ ] Handle background notifications
- [ ] Implement deep linking
- [ ] Test notification on physical device
- [ ] Test notification tap actions

### Phase 4: UI/UX Polish (Week 8)

- [ ] Refine UI design (colors, spacing, typography)
- [ ] Add animations & transitions
- [ ] Implement loading states
- [ ] Add error handling & validation
- [ ] Create empty states
- [ ] Add success/error toasts
- [ ] Optimize performance

### Phase 5: Testing & Deployment (Week 9-10)

**Week 9: Testing**
- [ ] Unit testing (critical functions)
- [ ] Integration testing (API calls)
- [ ] E2E testing (user flows)
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing (UAT)

**Week 10: Deployment**
- [ ] Generate APK/AAB
- [ ] Setup internal testing (Google Play)
- [ ] Create user documentation
- [ ] Train users
- [ ] Deploy to production
- [ ] Monitor & fix bugs

---

## 📊 ESTIMASI WAKTU & BIAYA

### Option A: PWA (RECOMMENDED) ⭐

**Development Time:**

| Phase | Duration | Team |
|-------|----------|------|
| Backend Preparation | 1 week | 1 Backend Dev |
| PWA Core Setup | 1 week | 1 Frontend Dev |
| Mobile Features | 1 week | 1 Frontend Dev |
| Push Notifications | 1 week | 1 Frontend Dev |
| Testing & Deployment | 1 week | 1 QA + 1 Dev |
| **TOTAL** | **4 weeks (~1 month)** 🚀 | |

**Cost Breakdown:**
- Backend Developer (1 week): Rp 10,000,000
- Frontend/PWA Developer (3 weeks): Rp 30,000,000
- QA Tester (1 week): Rp 5,000,000
- **Total Development**: Rp 45,000,000

**Infrastructure:**
- Firebase (FCM): FREE
- Cloud Storage (photos): ~Rp 500,000/month
- HTTPS/SSL: Already included
- **Total Infrastructure**: Rp 500,000 (first month)

**GRAND TOTAL**: ~Rp 45,500,000 💰

---

### Option B: React Native (Alternative)

**Development Time:**

| Phase | Duration | Team |
|-------|----------|------|
| Backend Preparation | 2 weeks | 1 Backend Dev |
| Mobile App Development | 4 weeks | 1 Mobile Dev |
| Push Notification | 1 week | 1 Mobile Dev |
| UI/UX Polish | 1 week | 1 Mobile Dev + 1 Designer |
| Testing & Deployment | 2 weeks | 1 QA + 1 Dev |
| **TOTAL** | **10 weeks (~2.5 months)** | |

**Cost Breakdown:**
- Backend Developer (2 weeks): Rp 20,000,000
- Mobile Developer (6 weeks): Rp 60,000,000
- UI/UX Designer (1 week): Rp 10,000,000
- QA Tester (2 weeks): Rp 15,000,000
- **Total Development**: Rp 105,000,000

**Infrastructure:**
- Firebase (FCM): FREE
- Cloud Storage (photos): ~Rp 500,000/month
- Google Play Developer Account: Rp 400,000 (one-time)
- **Total Infrastructure**: Rp 900,000 (first month)

**GRAND TOTAL**: ~Rp 105,900,000

---

### 💡 Comparison Summary

| Aspect | PWA ⭐ | React Native |
|--------|-------|--------------|
| Development Time | **4 weeks** | 10 weeks |
| Total Cost | **Rp 45.5 juta** | Rp 105.9 juta |
| Time to Market | **1 month** | 2.5 months |
| Code Reuse | **90%** | 70% |
| Maintenance | **Easy** | Medium |
| Updates | **Instant** | Via App Store |
| App Store | Not needed | Required |
| **SAVINGS** | **-** | **Rp 60.4 juta (57%)** |

**Recommendation:** Start with PWA (Option A) for faster ROI

---

## 🎯 SUCCESS CRITERIA

### Performance Metrics

**Approval Module:**
- ✅ Load pending approvals < 2 seconds
- ✅ Approve/Reject action < 1 second
- ✅ Push notification delivery < 5 seconds
- ✅ Deep link navigation < 1 second

**Documentation Module:**
- ✅ Photo capture/select < 1 second
- ✅ Upload 5 photos < 10 seconds (4G connection)
- ✅ Thumbnail generation < 2 seconds per photo

**Attendance Module:**
- ✅ GPS location accuracy < 20 meters
- ✅ Clock in/out < 3 seconds
- ✅ Selfie capture & verification < 2 seconds

### User Satisfaction

- ✅ 90%+ user adoption rate
- ✅ 4+ rating on Google Play Store
- ✅ < 5% crash rate
- ✅ < 10% negative feedback

---

## 📝 NEXT STEPS

### ⭐ RECOMMENDED: Go with PWA

### Immediate Actions (This Week)

1. **Review & Approval**
   - ✅ Review PWA architecture proposal (see `PWA_IMPLEMENTATION_PLAN.md`)
   - ✅ Approve tech stack (PWA with React + Service Workers)
   - ✅ Review mobile-responsive mockups
   - ✅ Get budget approval (Rp 45.5 juta vs Rp 105.9 juta)

2. **Team Assembly**
   - Assign backend developer (1 week for attendance module)
   - Assign frontend developer (3 weeks for PWA features)
   - Assign QA tester (1 week for testing)

3. **Infrastructure Setup**
   - Create Firebase project for FCM
   - Generate PWA icons (8 sizes)
   - Setup HTTPS (already available)
   - Prepare test devices (Android + iOS)

### Week 1 Kickoff (PWA Path)

- Setup PWA manifest.json
- Implement service worker
- Create attendance backend module
- Test install prompt on mobile
- Setup push notification config
   - Prepare development environment

### Week 1 Kickoff

- Setup project repository
- Create development branch
- Initialize backend attendance module
- Initialize React Native project
- Setup CI/CD pipeline
- Create project management board (Jira/Trello)

---

## 📚 RESOURCES & DOCUMENTATION

### Technical Documentation
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging
- React Navigation: https://reactnavigation.org/
- Sequelize ORM: https://sequelize.org/

### Design Resources
- Material Design: https://material.io/design
- React Native Paper: https://callstack.github.io/react-native-paper/
- Figma Mobile UI Kits: https://www.figma.com/community

### Testing Tools
- Jest: https://jestjs.io/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/
- Detox E2E: https://wix.github.io/Detox/

---

## 🔒 SECURITY CONSIDERATIONS

1. **Authentication**
   - JWT token with expiration
   - Refresh token mechanism
   - Secure token storage (AsyncStorage encrypted)

2. **Data Protection**
   - HTTPS only communication
   - Encrypt sensitive data at rest
   - No hardcoded credentials

3. **Location Privacy**
   - Request location permission explicitly
   - Only use location during clock in/out
   - Don't track location in background

4. **Photo Privacy**
   - Request camera/storage permissions
   - Photos only visible to authorized users
   - Implement photo deletion capability

5. **Push Notifications**
   - Don't send sensitive data in notification body
   - Use notification payload for routing only
   - Implement notification expiration

---

## 📞 SUPPORT & MAINTENANCE

### Post-Launch Support Plan

**Month 1-3 (Critical Period):**
- Daily monitoring & bug fixes
- Weekly performance review
- User feedback collection & response
- Feature enhancement based on feedback

**Month 4-6 (Stabilization):**
- Weekly monitoring
- Bi-weekly updates
- Feature additions
- Performance optimization

**Month 7+ (Maintenance):**
- Monthly updates
- Security patches
- OS compatibility updates
- New feature development

---

**Kesimpulan:** Mobile app dengan fokus pada 3 fitur inti (Dokumentasi, Approval, Absensi) dapat diimplementasikan dalam 10 minggu dengan biaya estimasi Rp 105 juta. Backend sudah 40% ready (approval & documentation), tinggal tambahkan attendance module. Menggunakan React Native + Expo untuk development speed & Firebase FCM untuk push notification yang reliable dan gratis. Deep linking untuk notification tap sudah terintegrasi dengan architecture.

---

**Status:** READY FOR IMPLEMENTATION  
**Next Action:** Get stakeholder approval & assemble team
