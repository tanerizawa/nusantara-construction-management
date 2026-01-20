# User Management & Notifications - Quick Reference Card

## 🎯 TUJUAN
1. **User Management:** CRUD users, role & permission management
2. **Push Notifications:** Real-time alerts untuk approval, budget, project updates

---

## 📚 TECH STACK

### Backend
- **Firebase Admin SDK** - Push notifications
- **Nodemailer** - Email notifications  
- **PostgreSQL** - User & notification data
- **Express.js** - API routes

### Frontend
- **Firebase SDK** - Client-side push
- **React** - UI components
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

---

## 🗂️ DATABASE SCHEMA

### Existing: `users`
```sql
id, username, email, password, role, 
profile (JSONB), permissions (JSONB),
isActive, lastLogin, loginAttempts, lockUntil
```

### New: `notification_preferences`
```sql
id, user_id, 
email_enabled, push_enabled, sms_enabled,
categories (JSONB),
quiet_hours_start, quiet_hours_end,
weekend_notifications,
device_tokens (JSONB)
```

### New: `notifications`
```sql
id, user_id, role_filter[],
type, category, title, message,
action_url, action_label,
priority, channels[],
read_at, clicked_at, dismissed_at
```

---

## 🔌 API ENDPOINTS

### Users
```
GET    /api/users              - List users (paginated)
GET    /api/users/:id          - Get user detail
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
PATCH  /api/users/:id/activate - Activate/deactivate
POST   /api/users/bulk         - Bulk operations
```

### Notifications
```
GET    /api/notifications/user/:userId        - Get user notifications
GET    /api/notifications/preferences/:userId - Get preferences
PUT    /api/notifications/preferences/:userId - Update preferences
PATCH  /api/notifications/:id/read            - Mark as read
POST   /api/notifications/register-device     - Register FCM token
POST   /api/notifications/test                - Send test notification
POST   /api/notifications/send                - Send notification
```

---

## 🎨 ROLES & COLORS

| Role | Color | Hex |
|------|-------|-----|
| Super Admin | Red | #FF453A |
| Admin | Orange | #FF9F0A |
| Project Manager | Blue | #0A84FF |
| Finance Manager | Green | #30D158 |
| Inventory Manager | Purple | #5E5CE6 |
| HR Manager | Magenta | #BF5AF2 |
| Supervisor | Cyan | #64D2FF |
| Staff | Gray | #98989D |

---

## 🔔 NOTIFICATION TYPES

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| approval | 📋 | #0A84FF | Approval requests |
| alert | ⚠️ | #FF453A | Critical alerts |
| info | ℹ️ | #5E5CE6 | Informational |
| warning | ⚠️ | #FF9F0A | Warnings |
| success | ✅ | #30D158 | Success messages |

---

## 📁 FOLDER STRUCTURE

### Backend
```
backend/
├── models/
│   ├── User.js (existing)
│   ├── Notification.js (new)
│   └── NotificationPreference.js (new)
├── routes/
│   ├── users.js (existing)
│   └── notifications.js (existing)
├── services/
│   └── NotificationService.js (new)
└── config/
    └── firebase.js (new)
```

### Frontend
```
frontend/src/
├── pages/Settings/components/
│   ├── UserManagement/
│   │   ├── UserManagementPage.js
│   │   ├── components/
│   │   │   ├── UserTable.js
│   │   │   ├── UserFilters.js
│   │   │   ├── AddUserModal.js
│   │   │   └── PermissionsModal.js
│   │   └── hooks/
│   │       └── useUserData.js
│   └── NotificationSettings/
│       ├── NotificationSettings.js
│       └── CategoryPreferences.js
├── components/
│   └── NotificationCenter.js
└── services/
    └── firebase.js
```

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env)
```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY=your-private-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Optional)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend (.env)
```bash
# Firebase
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key
```

---

## 💻 CODE SNIPPETS

### Send Notification (Backend)
```javascript
const NotificationService = require('./services/NotificationService');

// To specific user
await NotificationService.sendToUser(userId, {
  type: 'approval',
  category: 'approval_requests',
  title: 'New Approval Request',
  message: 'You have a new RAB approval',
  action_url: '/approvals/123',
  priority: 'high',
  channels: ['push', 'email']
});

// To role(s)
await NotificationService.sendToRoles(['admin', 'finance_manager'], {
  type: 'alert',
  category: 'budget_alerts',
  title: 'Budget Alert',
  message: 'Project X exceeded budget',
  priority: 'urgent'
});
```

### Request Permission (Frontend)
```javascript
import { requestNotificationPermission } from './services/firebase';

const token = await requestNotificationPermission();
if (token) {
  // Register token to backend
  await axios.post('/api/notifications/register-device', {
    userId: currentUser.id,
    token: token
  });
}
```

### Listen to Messages (Frontend)
```javascript
import { onMessageListener } from './services/firebase';

onMessageListener().then(payload => {
  // Show notification
  toast.info(payload.notification.title, {
    description: payload.notification.body,
    action: {
      label: 'View',
      onClick: () => navigate(payload.data.url)
    }
  });
});
```

---

## ✅ DEVELOPMENT CHECKLIST

### Week 1: User Management Backend
- [ ] Extend User model with profile
- [ ] Add permission middleware
- [ ] Create bulk operations endpoint
- [ ] Add activity logging
- [ ] Test API endpoints

### Week 2: User Management Frontend
- [ ] Create UserManagementPage
- [ ] Build UserTable with filters
- [ ] Create AddUserModal
- [ ] Create EditUserModal
- [ ] Build PermissionsModal
- [ ] Add UserStats dashboard
- [ ] Connect to API
- [ ] Add error handling

### Week 3: Notifications Backend
- [ ] Setup Firebase project
- [ ] Install Firebase Admin SDK
- [ ] Create NotificationService
- [ ] Add database tables
- [ ] Create API routes
- [ ] Setup email service
- [ ] Add notification triggers
- [ ] Test delivery

### Week 4: Notifications Frontend
- [ ] Install Firebase SDK
- [ ] Setup firebase.js config
- [ ] Create NotificationCenter
- [ ] Add bell icon with badge
- [ ] Request permission flow
- [ ] Handle foreground messages
- [ ] Create NotificationSettings page
- [ ] Test on devices

### Week 5: Polish
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] User training

---

## 🧪 TESTING COMMANDS

### Backend Tests
```bash
# Unit tests
npm test -- services/NotificationService.test.js

# Integration tests
npm test -- routes/notifications.test.js

# Load test (1000 notifications)
artillery run notification-load-test.yml
```

### Frontend Tests
```bash
# Component tests
npm test -- UserManagement.test.js

# E2E tests
npx cypress run --spec "cypress/e2e/user-management.cy.js"
```

### Manual Tests
```bash
# Test push notification
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER123","message":"Test notification"}'

# Test email
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER123","channels":["email"],"title":"Test","message":"Email test"}'
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue: Firebase permission denied
```bash
# Fix: Check firebase.json credentials
# Regenerate service account key from Firebase Console
```

### Issue: Notifications not received
```bash
# Check:
1. User has granted permission
2. Device token registered
3. User preferences allow category
4. Not in quiet hours
5. Check browser console for errors
```

### Issue: Email not sending
```bash
# Check:
1. SMTP credentials correct
2. Gmail "Less secure apps" enabled
3. Check spam folder
4. Verify email in logs
```

### Issue: Slow performance
```bash
# Optimize:
1. Add database indexes
2. Use batch operations
3. Implement pagination
4. Cache user preferences
5. Use Redis for session
```

---

## 📊 MONITORING & METRICS

### Key Metrics to Track
```javascript
{
  // Notifications
  sent: 1000,
  delivered: 950,
  read: 700,
  clicked: 400,
  deliveryRate: 95%,
  readRate: 70%,
  clickRate: 40%,
  
  // Users
  totalUsers: 45,
  activeUsers: 42,
  newUsers7d: 5,
  loginRate: 93%,
  
  // Performance
  avgNotificationDelay: '2.3s',
  apiResponseTime: '150ms',
  errorRate: '0.5%'
}
```

### Dashboard Queries
```sql
-- Notification delivery rate
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) as delivered,
  ROUND(COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) * 100.0 / COUNT(*), 2) as rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '7 days';

-- Top notification categories
SELECT 
  category,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (read_at - sent_at))) as avg_read_time_sec
FROM notifications
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY category
ORDER BY count DESC;

-- User activity
SELECT 
  role,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_7d
FROM users
GROUP BY role;
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Password hashing (bcrypt)
- [ ] JWT token validation
- [ ] Permission checks on all routes
- [ ] Rate limiting (max 100 req/min)
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (escape output)
- [ ] CSRF protection
- [ ] HTTPS only
- [ ] Audit logging
- [ ] Session timeout (30 min)
- [ ] Max login attempts (5)
- [ ] Account lockout (15 min)
- [ ] Firebase security rules
- [ ] Email verification
- [ ] 2FA support (future)

---

## 📞 QUICK CONTACTS

**Firebase Issues:**
- Docs: https://firebase.google.com/docs/cloud-messaging
- Console: https://console.firebase.google.com

**Email Issues:**
- Gmail SMTP: smtp.gmail.com:587
- App Password: https://myaccount.google.com/apppasswords

**Deployment:**
- Frontend: Vercel/Netlify
- Backend: Railway/Heroku/DigitalOcean
- Database: Supabase/Neon/Render

---

**Last Updated:** 17 Oktober 2025  
**Version:** 1.0  
**Status:** Ready for Development

Print this card and keep it handy! 📌
