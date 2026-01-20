# User Management & Push Notification System - Comprehensive Analysis & Implementation Plan

**Tanggal:** 17 Oktober 2025  
**Scope:** Settings Page Enhancement - User Management & Push Notifications  
**Status:** 📋 PLANNING & RECOMMENDATION

---

## 📊 CURRENT STATE ANALYSIS

### ✅ Existing Infrastructure

#### 1. **Backend - Already Available**

**User Model** (`backend/models/User.js`):
```javascript
{
  id: STRING (PK),
  username: STRING (unique),
  email: STRING (unique),
  password: STRING (hashed),
  role: ENUM ['admin', 'project_manager', 'finance_manager', 
              'inventory_manager', 'hr_manager', 'supervisor'],
  profile: JSONB,
  permissions: JSONB (array),
  isActive: BOOLEAN,
  lastLogin: DATE,
  loginAttempts: INTEGER,
  lockUntil: DATE
}
```

**User Routes** (`backend/routes/users.js`):
- ✅ `GET /api/users` - List users (with pagination, filtering, search)
- ✅ `GET /api/users/:id` - Get single user
- ✅ `POST /api/users` - Create user
- ✅ `PUT /api/users/:id` - Update user
- ✅ `DELETE /api/users/:id` - Delete user

**Notification Model** (`backend/models/ApprovalNotification.js`):
```javascript
{
  id: UUID (PK),
  instanceId: UUID,
  stepId: UUID,
  recipientUserId: STRING,
  notificationType: ENUM ['approval_request', 'approved', 
                          'rejected', 'escalation', 'completed'],
  subject: STRING,
  message: TEXT,
  status: ENUM ['pending', 'sent', 'read', 'failed'],
  sentAt: DATE,
  readAt: DATE
}
```

**Notification Routes** (`backend/routes/notifications.js`):
- ✅ `/api/notifications` endpoint exists

#### 2. **Settings Page - Existing Structure**

**Current Sections** (`frontend/src/pages/Settings/utils/constants.js`):
1. ❌ Profil Pengguna (coming-soon)
2. ❌ Keamanan (coming-soon)
3. ❌ Notifikasi (coming-soon)
4. ❌ Bahasa & Lokalisasi (coming-soon)
5. ❌ Tema & Tampilan (coming-soon)
6. ✅ **Database Management** (available)
7. ❌ Manajemen Tim (coming-soon)
8. ❌ Integrasi Sistem (coming-soon)

---

## 🎯 PROPOSED IMPLEMENTATION

### Phase 1: User Management Module (Priority: HIGH)

#### A. **User List & Management Page**

**Location:** `/frontend/src/pages/Settings/components/UserManagement/`

**Features:**
1. **User Table** with advanced features:
   - Search by username/email
   - Filter by role, status (active/inactive)
   - Sort by name, role, last login, created date
   - Pagination (10, 25, 50, 100 per page)
   - Bulk actions (activate/deactivate, delete)
   - Export to CSV/Excel

2. **User Card/Row Display:**
   ```
   [Avatar] | Name | Email | Role | Status | Last Login | Actions
   ```

3. **Quick Stats Dashboard:**
   - Total Users
   - Active Users
   - Users by Role (pie chart)
   - Recent Logins (last 7 days)

**Component Structure:**
```
UserManagement/
├── UserManagementPage.js         (Main container)
├── components/
│   ├── UserTable.js              (Table with filters)
│   ├── UserCard.js               (Individual user card)
│   ├── UserStats.js              (Statistics dashboard)
│   ├── UserFilters.js            (Filter controls)
│   ├── BulkActions.js            (Bulk operation toolbar)
│   ├── AddUserModal.js           (Create user form)
│   ├── EditUserModal.js          (Edit user form)
│   ├── UserPermissionsModal.js   (Granular permissions)
│   └── DeleteConfirmModal.js     (Confirmation dialog)
├── hooks/
│   ├── useUserData.js            (Fetch & manage users)
│   ├── useUserFilters.js         (Filter state management)
│   └── useUserActions.js         (CRUD operations)
└── utils/
    ├── userHelpers.js            (Formatting, validation)
    └── rolePermissions.js        (Role-based configs)
```

#### B. **Role & Permission System**

**Role Definitions** (expand existing):
```javascript
const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    label: 'Super Admin',
    color: '#FF453A',
    icon: ShieldCheck,
    description: 'Full system access',
    permissions: ['*'], // All permissions
    canManageUsers: true,
    canManageRoles: true
  },
  ADMIN: {
    id: 'admin',
    label: 'Administrator',
    color: '#FF9F0A',
    icon: Shield,
    description: 'Administrative access',
    permissions: [
      'users.view', 'users.create', 'users.edit',
      'projects.*', 'finance.*', 'inventory.*'
    ],
    canManageUsers: true,
    canManageRoles: false
  },
  PROJECT_MANAGER: {
    id: 'project_manager',
    label: 'Project Manager',
    color: '#0A84FF',
    icon: Briefcase,
    description: 'Manage projects and teams',
    permissions: [
      'projects.*', 'teams.*', 'milestones.*',
      'rab.view', 'rab.edit', 'berita_acara.*'
    ],
    canManageUsers: false
  },
  FINANCE_MANAGER: {
    id: 'finance_manager',
    label: 'Finance Manager',
    color: '#30D158',
    icon: DollarSign,
    description: 'Manage financial operations',
    permissions: [
      'finance.*', 'budgets.*', 'invoices.*',
      'payments.*', 'reports.finance'
    ],
    canManageUsers: false
  },
  INVENTORY_MANAGER: {
    id: 'inventory_manager',
    label: 'Inventory Manager',
    color: '#5E5CE6',
    icon: Package,
    description: 'Manage inventory and assets',
    permissions: [
      'inventory.*', 'assets.*', 'purchase_orders.*',
      'suppliers.*'
    ],
    canManageUsers: false
  },
  HR_MANAGER: {
    id: 'hr_manager',
    label: 'HR Manager',
    color: '#BF5AF2',
    icon: Users,
    description: 'Manage human resources',
    permissions: [
      'users.view', 'teams.*', 'attendance.*',
      'payroll.*', 'employees.*'
    ],
    canManageUsers: true,
    canManageRoles: false
  },
  SUPERVISOR: {
    id: 'supervisor',
    label: 'Supervisor',
    color: '#64D2FF',
    icon: Eye,
    description: 'Monitor and supervise',
    permissions: [
      'projects.view', 'teams.view', 'reports.view',
      'milestones.view'
    ],
    canManageUsers: false
  },
  STAFF: {
    id: 'staff',
    label: 'Staff',
    color: '#98989D',
    icon: User,
    description: 'Basic access',
    permissions: [
      'projects.view', 'profile.edit', 'tasks.own'
    ],
    canManageUsers: false
  }
};
```

**Permission Categories:**
```javascript
const PERMISSION_CATEGORIES = {
  USERS: {
    label: 'User Management',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'users.manage_roles'
    ]
  },
  PROJECTS: {
    label: 'Project Management',
    permissions: [
      'projects.view',
      'projects.create',
      'projects.edit',
      'projects.delete',
      'projects.assign_team'
    ]
  },
  FINANCE: {
    label: 'Finance & Accounting',
    permissions: [
      'finance.view',
      'finance.create_transaction',
      'finance.approve_transaction',
      'finance.reports',
      'budgets.manage'
    ]
  },
  INVENTORY: {
    label: 'Inventory & Assets',
    permissions: [
      'inventory.view',
      'inventory.add',
      'inventory.transfer',
      'assets.manage'
    ]
  },
  REPORTS: {
    label: 'Reports & Analytics',
    permissions: [
      'reports.view',
      'reports.export',
      'reports.finance',
      'reports.projects'
    ]
  }
};
```

#### C. **User Form (Add/Edit)**

**Form Fields:**
```javascript
{
  // Basic Info
  username: string (required, unique),
  email: string (required, email format, unique),
  fullName: string (required),
  phone: string (optional),
  
  // Account
  password: string (required for new, optional for edit),
  confirmPassword: string (match password),
  role: select (required),
  isActive: toggle (default: true),
  
  // Profile (JSONB)
  profile: {
    avatar: url,
    position: string,
    department: string,
    employeeId: string,
    joinDate: date,
    birthDate: date,
    address: string
  },
  
  // Permissions (JSONB array)
  permissions: array (checkboxes grouped by category),
  
  // Advanced
  forcePasswordChange: boolean,
  sessionTimeout: number (minutes),
  maxLoginAttempts: number
}
```

**Form Validation:**
```javascript
const userValidationSchema = {
  username: Yup.string()
    .min(3, 'Minimal 3 karakter')
    .max(30, 'Maksimal 30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/, 'Hanya alfanumerik dan underscore')
    .required('Username wajib diisi'),
  
  email: Yup.string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  
  password: Yup.string()
    .min(8, 'Minimal 8 karakter')
    .matches(/(?=.*[a-z])/, 'Harus ada huruf kecil')
    .matches(/(?=.*[A-Z])/, 'Harus ada huruf besar')
    .matches(/(?=.*[0-9])/, 'Harus ada angka')
    .when('isNewUser', {
      is: true,
      then: Yup.string().required('Password wajib diisi')
    }),
  
  role: Yup.string()
    .oneOf(Object.keys(ROLES))
    .required('Role wajib dipilih')
};
```

---

### Phase 2: Push Notification System (Priority: HIGH)

#### A. **Architecture Overview**

**Tech Stack Recommendation:**

**Option 1: Firebase Cloud Messaging (FCM)** ⭐ RECOMMENDED
```
Pros:
✅ Free for unlimited notifications
✅ Cross-platform (Web, iOS, Android)
✅ Reliable delivery
✅ Support for topics & user targeting
✅ Rich notifications (images, actions)
✅ Analytics included

Cons:
❌ Requires Google account
❌ Learning curve
```

**Option 2: Web Push API (Service Workers)**
```
Pros:
✅ No third-party dependency
✅ Standard web API
✅ Works offline

Cons:
❌ Complex setup
❌ Browser compatibility issues
❌ No mobile app support
```

**Option 3: OneSignal** (Alternative)
```
Pros:
✅ Easy integration
✅ Free tier (10K subscribers)
✅ Multi-platform

Cons:
❌ Paid for larger scale
❌ Third-party lock-in
```

**DECISION: Use FCM (Firebase Cloud Messaging)**

#### B. **Database Schema Extension**

**New Table: `notification_preferences`**
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  
  -- Channel preferences
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  
  -- Category preferences (JSONB)
  categories JSONB DEFAULT '{
    "approval_requests": true,
    "project_updates": true,
    "budget_alerts": true,
    "team_assignments": true,
    "system_announcements": true,
    "payment_reminders": true
  }',
  
  -- Schedule preferences
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  weekend_notifications BOOLEAN DEFAULT false,
  
  -- Device tokens (for push)
  device_tokens JSONB DEFAULT '[]',
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**New Table: `notifications`** (General purpose, not just approval)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  
  -- Recipient
  user_id VARCHAR REFERENCES users(id),
  role_filter VARCHAR[], -- Send to specific roles
  
  -- Content
  type VARCHAR NOT NULL, -- 'approval', 'alert', 'info', 'warning', 'success'
  category VARCHAR, -- 'approval_requests', 'project_updates', etc.
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR,
  image_url VARCHAR,
  
  -- Action
  action_url VARCHAR,
  action_label VARCHAR,
  
  -- Priority
  priority VARCHAR DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Delivery
  channels VARCHAR[] DEFAULT '{push,email}',
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Status
  read_at TIMESTAMP,
  clicked_at TIMESTAMP,
  dismissed_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  INDEX (user_id, created_at),
  INDEX (type, category),
  INDEX (read_at)
);
```

#### C. **Backend Implementation**

**Notification Service** (`backend/services/NotificationService.js`):
```javascript
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    
    this.messaging = admin.messaging();
  }

  /**
   * Send notification to specific user
   */
  async sendToUser(userId, notification) {
    const user = await User.findByPk(userId, {
      include: [{ model: NotificationPreference }]
    });
    
    if (!user) throw new Error('User not found');
    
    const pref = user.NotificationPreference;
    
    // Check if user wants this notification
    if (!this.shouldSendNotification(notification, pref)) {
      return { skipped: true, reason: 'User preferences' };
    }
    
    const results = {};
    
    // Send via Push
    if (pref.push_enabled && notification.channels.includes('push')) {
      results.push = await this.sendPushNotification(user, notification);
    }
    
    // Send via Email
    if (pref.email_enabled && notification.channels.includes('email')) {
      results.email = await this.sendEmailNotification(user, notification);
    }
    
    // Save to database
    await Notification.create({
      userId: userId,
      ...notification,
      sentAt: new Date()
    });
    
    return results;
  }

  /**
   * Send notification to role(s)
   */
  async sendToRoles(roles, notification) {
    const users = await User.findAll({
      where: { role: roles, isActive: true }
    });
    
    const results = await Promise.allSettled(
      users.map(user => this.sendToUser(user.id, notification))
    );
    
    return {
      total: users.length,
      sent: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  }

  /**
   * Send push notification via FCM
   */
  async sendPushNotification(user, notification) {
    const pref = user.NotificationPreference;
    if (!pref.device_tokens || pref.device_tokens.length === 0) {
      return { skipped: true, reason: 'No device tokens' };
    }
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
        icon: notification.icon || '/logo192.png',
        image: notification.image_url
      },
      data: {
        url: notification.action_url || '/',
        type: notification.type,
        category: notification.category
      },
      tokens: pref.device_tokens
    };
    
    try {
      const response = await this.messaging.sendMulticast(message);
      return {
        success: response.successCount,
        failed: response.failureCount
      };
    } catch (error) {
      console.error('FCM Error:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(user, notification) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    const mailOptions = {
      from: 'Nusantara Construction <noreply@nusantara.co>',
      to: user.email,
      subject: notification.title,
      html: this.getEmailTemplate(notification)
    };
    
    return await transporter.sendMail(mailOptions);
  }

  /**
   * Check if notification should be sent based on preferences
   */
  shouldSendNotification(notification, preferences) {
    // Check category preference
    if (preferences.categories && 
        !preferences.categories[notification.category]) {
      return false;
    }
    
    // Check quiet hours
    if (this.isQuietHours(preferences)) {
      return notification.priority === 'urgent';
    }
    
    // Check weekend
    if (!preferences.weekend_notifications && this.isWeekend()) {
      return notification.priority === 'urgent';
    }
    
    return true;
  }

  /**
   * Send approval request notification
   */
  async sendApprovalRequest(approvalStep) {
    const user = await User.findByPk(approvalStep.approverId);
    
    return this.sendToUser(user.id, {
      type: 'approval',
      category: 'approval_requests',
      title: '🔔 Approval Request',
      message: `You have a new approval request for ${approvalStep.documentType}`,
      action_url: `/approvals/${approvalStep.instanceId}`,
      action_label: 'Review Now',
      priority: approvalStep.isUrgent ? 'high' : 'normal',
      channels: ['push', 'email']
    });
  }

  /**
   * Send project update notification
   */
  async sendProjectUpdate(project, updateType, description) {
    const teamMembers = await project.getTeamMembers();
    
    return Promise.all(
      teamMembers.map(member => 
        this.sendToUser(member.userId, {
          type: 'info',
          category: 'project_updates',
          title: `📊 Project Update: ${project.name}`,
          message: description,
          action_url: `/projects/${project.id}`,
          priority: 'normal',
          channels: ['push']
        })
      )
    );
  }

  /**
   * Send budget alert
   */
  async sendBudgetAlert(project, budgetData) {
    const managers = await User.findAll({
      where: { 
        role: ['admin', 'finance_manager', 'project_manager'],
        isActive: true
      }
    });
    
    return this.sendToRoles(['admin', 'finance_manager'], {
      type: 'warning',
      category: 'budget_alerts',
      title: '⚠️ Budget Alert',
      message: `Project "${project.name}" has exceeded ${budgetData.percentage}% of budget`,
      action_url: `/projects/${project.id}/budget`,
      priority: budgetData.percentage > 100 ? 'high' : 'normal',
      channels: ['push', 'email']
    });
  }
}

module.exports = new NotificationService();
```

**API Routes** (`backend/routes/notifications.js`):
```javascript
// Get user notifications
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { unread, limit = 20, page = 1 } = req.query;
  
  const where = { userId };
  if (unread === 'true') {
    where.read_at = null;
  }
  
  const notifications = await Notification.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: (page - 1) * limit
  });
  
  res.json({ success: true, data: notifications });
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
  await Notification.update(
    { read_at: new Date() },
    { where: { id: req.params.id } }
  );
  res.json({ success: true });
});

// Get notification preferences
router.get('/preferences/:userId', async (req, res) => {
  const pref = await NotificationPreference.findOne({
    where: { userId: req.params.userId }
  });
  res.json({ success: true, data: pref });
});

// Update notification preferences
router.put('/preferences/:userId', async (req, res) => {
  const [pref, created] = await NotificationPreference.upsert({
    userId: req.params.userId,
    ...req.body
  });
  res.json({ success: true, data: pref });
});

// Register device token for push
router.post('/register-device', async (req, res) => {
  const { userId, token } = req.body;
  
  const pref = await NotificationPreference.findOne({
    where: { userId }
  });
  
  const tokens = pref.device_tokens || [];
  if (!tokens.includes(token)) {
    tokens.push(token);
    await pref.update({ device_tokens: tokens });
  }
  
  res.json({ success: true });
});

// Send test notification
router.post('/test', async (req, res) => {
  const { userId, message } = req.body;
  
  const result = await NotificationService.sendToUser(userId, {
    type: 'info',
    category: 'system_announcements',
    title: 'Test Notification',
    message: message || 'This is a test notification',
    priority: 'normal',
    channels: ['push']
  });
  
  res.json({ success: true, data: result });
});
```

#### D. **Frontend Implementation**

**1. Firebase Setup** (`frontend/src/services/firebase.js`):
```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Permission denied:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
```

**2. Notification Component** (`frontend/src/components/NotificationCenter.js`):
```javascript
import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-700"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {/* Notification List */}
          <div>
            {notifications.map(notif => (
              <NotificationItem 
                key={notif.id}
                notification={notif}
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

**3. Notification Settings Page** (`frontend/src/pages/Settings/components/NotificationSettings/`):
```javascript
const NotificationSettings = ({ userId }) => {
  const [preferences, setPreferences] = useState({});
  
  return (
    <div className="space-y-6">
      {/* Enable/Disable Channels */}
      <section>
        <h3 className="text-xl font-bold mb-4">Notification Channels</h3>
        <div className="space-y-3">
          <Toggle
            label="📧 Email Notifications"
            checked={preferences.email_enabled}
            onChange={(val) => updatePref('email_enabled', val)}
          />
          <Toggle
            label="🔔 Push Notifications"
            checked={preferences.push_enabled}
            onChange={(val) => updatePref('push_enabled', val)}
          />
          <Toggle
            label="📱 SMS Notifications"
            checked={preferences.sms_enabled}
            onChange={(val) => updatePref('sms_enabled', val)}
          />
        </div>
      </section>
      
      {/* Category Preferences */}
      <section>
        <h3 className="text-xl font-bold mb-4">Notification Categories</h3>
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Checkbox
              key={key}
              label={label}
              checked={preferences.categories?.[key]}
              onChange={(val) => updateCategory(key, val)}
            />
          ))}
        </div>
      </section>
      
      {/* Quiet Hours */}
      <section>
        <h3 className="text-xl font-bold mb-4">Quiet Hours</h3>
        <div className="grid grid-cols-2 gap-4">
          <TimePicker
            label="Start"
            value={preferences.quiet_hours_start}
            onChange={(val) => updatePref('quiet_hours_start', val)}
          />
          <TimePicker
            label="End"
            value={preferences.quiet_hours_end}
            onChange={(val) => updatePref('quiet_hours_end', val)}
          />
        </div>
        <Toggle
          label="Allow urgent notifications during quiet hours"
          checked={preferences.allow_urgent_in_quiet}
          className="mt-3"
        />
      </section>
      
      {/* Test Notification */}
      <section>
        <button 
          onClick={sendTestNotification}
          className="px-4 py-2 bg-blue-500 rounded-lg"
        >
          Send Test Notification
        </button>
      </section>
    </div>
  );
};
```

---

## 🎨 UI/UX DESIGN RECOMMENDATIONS

### Color Scheme (Dark Mode Optimized)

**User Status Colors:**
```javascript
{
  active: '#30D158',      // Green
  inactive: '#98989D',    // Gray
  locked: '#FF453A',      // Red
  pending: '#FF9F0A'      // Orange
}
```

**Role Colors:**
```javascript
{
  super_admin: '#FF453A',
  admin: '#FF9F0A',
  project_manager: '#0A84FF',
  finance_manager: '#30D158',
  inventory_manager: '#5E5CE6',
  hr_manager: '#BF5AF2',
  supervisor: '#64D2FF',
  staff: '#98989D'
}
```

**Notification Types:**
```javascript
{
  approval: '#0A84FF',
  alert: '#FF453A',
  info: '#5E5CE6',
  warning: '#FF9F0A',
  success: '#30D158'
}
```

### Layout Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Settings > User Management                            [+ Add User] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Quick Stats ────────────────────────────────────────┐   │
│ │ Total: 45 | Active: 42 | Inactive: 3 | Locked: 0    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Filters & Search ───────────────────────────────────┐   │
│ │ [Search] [Role: All ▼] [Status: All ▼] [Sort ▼]     │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ User Table ─────────────────────────────────────────┐   │
│ │ ☑ | Avatar | Name | Email | Role | Status | Actions │   │
│ │ ☑ | 👤    | John | j@... | Admin | ● Active | ⚙️ 🗑️   │   │
│ │ ☑ | 👤    | Jane | j@... | PM    | ● Active | ⚙️ 🗑️   │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ [Pagination: 1 2 3 ... 10]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: User Management (Week 1-2)

**Backend:**
- [x] User model already exists
- [ ] Extend User model with profile fields
- [ ] Add role-permission mapping
- [ ] Create permission checking middleware
- [ ] Add user activity logging
- [ ] Add bulk operations endpoints

**Frontend:**
- [ ] Create UserManagement page structure
- [ ] Build UserTable component with filters
- [ ] Create AddUserModal with validation
- [ ] Create EditUserModal
- [ ] Build PermissionsModal with categories
- [ ] Add UserStats dashboard
- [ ] Implement search & filter logic
- [ ] Add bulk actions toolbar
- [ ] Connect to API endpoints
- [ ] Add toast notifications for actions

### Phase 2: Push Notifications (Week 3-4)

**Backend:**
- [ ] Install Firebase Admin SDK
- [ ] Create NotificationService class
- [ ] Add notification_preferences table
- [ ] Add notifications table
- [ ] Create notification routes
- [ ] Integrate with existing approval system
- [ ] Add notification triggers for events
- [ ] Setup email templates

**Frontend:**
- [ ] Install Firebase SDK
- [ ] Create firebase.js config
- [ ] Create NotificationCenter component
- [ ] Add notification dropdown
- [ ] Create NotificationSettings page
- [ ] Implement permission request
- [ ] Register service worker
- [ ] Handle foreground messages
- [ ] Add notification sound/vibration

**Infrastructure:**
- [ ] Create Firebase project
- [ ] Configure FCM
- [ ] Generate VAPID keys
- [ ] Setup environment variables
- [ ] Create email SMTP config
- [ ] Setup Nodemailer

### Phase 3: Testing & Polish (Week 5)

- [ ] Unit tests for NotificationService
- [ ] Integration tests for API
- [ ] E2E tests for user flows
- [ ] Test push notifications on devices
- [ ] Performance testing (1000+ notifications)
- [ ] Security audit (permission checks)
- [ ] Documentation
- [ ] User guide

---

## 💰 COST ESTIMATION

**Infrastructure:**
- Firebase (FCM): **FREE** (unlimited)
- Email SMTP (SendGrid/Gmail): **FREE** (up to 100/day)
- SMS (Twilio): **~$0.0075/SMS** (optional)

**Development Time:**
- User Management: **40 hours** (1 week)
- Push Notifications: **60 hours** (1.5 weeks)
- Testing & Polish: **20 hours** (0.5 week)
- **Total: ~120 hours (3 weeks)**

---

## 🚀 QUICK START GUIDE

### Step 1: Enable User Management

1. Update Settings constants:
```javascript
{
  id: 'user-management',
  title: 'User Management',
  icon: Users,
  description: 'Manage users, roles, and permissions',
  status: 'available', // Change from 'coming-soon'
  path: '/settings/users'
}
```

2. Create route in App.js:
```javascript
<Route path="/settings/users" element={<UserManagementPage />} />
```

### Step 2: Setup Firebase

1. Create Firebase project
2. Enable Cloud Messaging
3. Download service account JSON
4. Add to `.env`:
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_VAPID_KEY=your-vapid-key
```

### Step 3: Install Dependencies

**Backend:**
```bash
npm install firebase-admin nodemailer
```

**Frontend:**
```bash
npm install firebase
```

---

## 📊 SUCCESS METRICS

**User Management:**
- ✅ Admins can create users in < 30 seconds
- ✅ Role assignment in < 5 clicks
- ✅ Search finds users in < 2 seconds
- ✅ Bulk operations work for 100+ users

**Push Notifications:**
- ✅ Notification delivery < 3 seconds
- ✅ 95%+ delivery success rate
- ✅ < 5% opt-out rate
- ✅ Users check notifications within 5 minutes

---

## 🎯 RECOMMENDED APPROACH

### Priority Order:

1. **Week 1-2: User Management** ⭐ HIGH
   - Core feature for system administration
   - Foundation for permissions
   - Immediate business value

2. **Week 3-4: Push Notifications** ⭐ HIGH
   - Enhances user engagement
   - Critical for approval workflows
   - Competitive advantage

3. **Week 5: Polish & Launch** ⭐ MEDIUM
   - Testing and optimization
   - Documentation
   - Training materials

### Quick Win Strategy:

**MVP (Minimum Viable Product):**
1. Basic user CRUD (Create, Read, Update, Delete)
2. Role assignment
3. Simple push notifications for approvals
4. Email fallback

**Then Expand:**
1. Advanced permissions (granular)
2. Notification preferences
3. Analytics & reporting
4. SMS integration

---

**Summary:** Sistem User Management & Push Notification dapat diimplementasikan dalam 3-4 minggu dengan Firebase FCM sebagai solusi notification. Backend sudah 60% ready, tinggal extend dengan preference management dan notification service. Frontend perlu build dari scratch tapi dengan component library yang sudah ada, development akan cepat. Total estimasi 120 jam development.

