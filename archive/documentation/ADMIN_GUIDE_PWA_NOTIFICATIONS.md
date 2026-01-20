# Admin Guide: PWA Push Notifications System

## Panduan Administrator untuk Sistem Notifikasi Push

---

## Daftar Isi

1. [System Overview](#system-overview)
2. [Firebase Setup](#firebase-setup)
3. [Server Configuration](#server-configuration)
4. [Database Management](#database-management)
5. [Notification Management](#notification-management)
6. [Monitoring & Analytics](#monitoring--analytics)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)
9. [Scaling Guidelines](#scaling-guidelines)
10. [API Reference](#api-reference)

---

## System Overview

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (Browser)                    │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ React App    │  │ Service    │  │ FCM Client  │ │
│  │ (Frontend)   │  │ Worker     │  │ SDK         │ │
│  └──────────────┘  └────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                BACKEND (Node.js/Express)             │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ API Routes   │  │ FCM        │  │ Database    │ │
│  │              │  │ Service    │  │ (Postgres)  │ │
│  └──────────────┘  └────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│           FIREBASE CLOUD MESSAGING (FCM)             │
│                 Google's Push Service                │
└─────────────────────────────────────────────────────┘
```

### Components

1. **Frontend**
   - React application
   - Service Worker for background notifications
   - Firebase Messaging SDK
   - Deep link handler
   - Notification UI components

2. **Backend**
   - Express.js API server
   - FCM Admin SDK
   - PostgreSQL database
   - Notification queue
   - Token management

3. **Firebase**
   - FCM push service
   - Token management
   - Message delivery
   - Analytics (optional)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com
   ```

2. **Create New Project**
   - Click "Add project"
   - Enter project name: `nusantara-pwa`
   - Enable Google Analytics (optional)
   - Click "Create project"

3. **Add Web App**
   - Click "Web" icon (</>) in project overview
   - Register app: `Nusantara PWA`
   - Enable "Also set up Firebase Hosting" (optional)
   - Click "Register app"

4. **Get Configuration**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "nusantara-pwa.firebaseapp.com",
     projectId: "nusantara-pwa",
     storageBucket: "nusantara-pwa.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

### Step 2: Enable Cloud Messaging

1. **Enable FCM API**
   - Project Settings → Cloud Messaging
   - Note down "Server key" (Legacy)
   - Note down "Sender ID"

2. **Generate Service Account**
   - Project Settings → Service accounts
   - Click "Generate new private key"
   - Save as `firebase-service-account.json`
   - **KEEP THIS FILE SECURE!**

### Step 3: Configure Frontend

1. **Update `firebaseConfig.js`**
   ```bash
   nano frontend/src/config/firebaseConfig.js
   ```

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

2. **Update Service Worker**
   ```bash
   nano frontend/public/firebase-messaging-sw.js
   ```

   Replace config with your values.

### Step 4: Configure Backend

1. **Place Service Account File**
   ```bash
   cp firebase-service-account.json backend/config/
   chmod 600 backend/config/firebase-service-account.json
   ```

2. **Set Environment Variables**
   ```bash
   nano backend/.env
   ```

   ```env
   # Firebase Configuration
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
   FIREBASE_PROJECT_ID=nusantara-pwa
   ```

3. **Verify Backend Initialization**
   ```bash
   cd backend
   npm run dev
   ```

   Look for:
   ```
   ✅ FCM initialized successfully
   🚀 Nusantara Group SaaS Server Running
   ```

---

## Server Configuration

### Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nusantara_db
DB_USER=nusantara_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_PROJECT_ID=nusantara-pwa

# CORS
ALLOWED_ORIGINS=https://nusantaragroup.co,https://www.nusantaragroup.co

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Notification Settings
NOTIFICATION_BATCH_SIZE=500
NOTIFICATION_RETRY_ATTEMPTS=3
NOTIFICATION_RETRY_DELAY=5000
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nusantara-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100
  }]
};
```

**Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/nusantara

server {
    listen 80;
    listen [::]:80;
    server_name nusantaragroup.co www.nusantaragroup.co;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nusantaragroup.co www.nusantaragroup.co;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/nusantaragroup.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nusantaragroup.co/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    location / {
        root /var/www/nusantara/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Service Worker & Manifest
    location ~* (sw\.js|firebase-messaging-sw\.js|manifest\.json)$ {
        root /var/www/nusantara/frontend/build;
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/nusantara /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Database Management

### Notification Token Schema

```sql
CREATE TABLE notification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    platform VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_tokens_user_id ON notification_tokens(user_id);
CREATE INDEX idx_notification_tokens_active ON notification_tokens(is_active);
CREATE INDEX idx_notification_tokens_token ON notification_tokens(token);
```

### Common Queries

**1. Get Active Tokens for User**
```sql
SELECT * FROM notification_tokens 
WHERE user_id = $1 AND is_active = true
ORDER BY last_used_at DESC;
```

**2. Get All Active Tokens**
```sql
SELECT nt.*, u.username, u.email 
FROM notification_tokens nt
JOIN users u ON nt.user_id = u.id
WHERE nt.is_active = true;
```

**3. Deactivate Old Tokens**
```sql
UPDATE notification_tokens 
SET is_active = false
WHERE last_used_at < NOW() - INTERVAL '90 days';
```

**4. Token Statistics**
```sql
SELECT 
    COUNT(*) as total_tokens,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN is_active THEN 1 END) as active_tokens,
    COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop,
    COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile
FROM notification_tokens;
```

**5. Clean Up Invalid Tokens**
```sql
-- Remove tokens not used in 90 days
DELETE FROM notification_tokens 
WHERE last_used_at < NOW() - INTERVAL '90 days';

-- Remove duplicate tokens (keep newest)
DELETE FROM notification_tokens a
USING notification_tokens b
WHERE a.id < b.id 
AND a.token = b.token;
```

### Backup & Maintenance

**Daily Backup:**
```bash
#!/bin/bash
# backup-notifications.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres"
DB_NAME="nusantara_db"

pg_dump -U nusantara_user -d $DB_NAME -t notification_tokens \
  --clean --if-exists --no-owner --no-privileges \
  > "$BACKUP_DIR/notification_tokens_$DATE.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "notification_tokens_*.sql" -mtime +30 -delete
```

**Cron Job:**
```cron
0 2 * * * /usr/local/bin/backup-notifications.sh
```

---

## Notification Management

### Sending Notifications via API

#### 1. Send to Single User

```bash
curl -X POST https://nusantaragroup.co/api/fcm/send \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "title": "Test Notification",
    "body": "This is a test message",
    "data": {
      "type": "test",
      "action": "view"
    }
  }'
```

#### 2. Send to Multiple Users

```bash
curl -X POST https://nusantaragroup.co/api/fcm/send-batch \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": [123, 456, 789],
    "title": "Team Update",
    "body": "New project assigned to your team",
    "data": {
      "type": "project_update",
      "projectId": 999
    }
  }'
```

#### 3. Send to All Users (Broadcast)

```bash
curl -X POST https://nusantaragroup.co/api/fcm/broadcast \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "System Maintenance",
    "body": "System will be down for maintenance on Sunday 2 AM",
    "data": {
      "type": "system_announcement",
      "priority": "high"
    }
  }'
```

### Notification Templates

**Leave Approval Request:**
```javascript
{
  title: "Leave Request Approval",
  body: `${employeeName} mengajukan cuti ${daysCount} hari`,
  data: {
    type: "leave_approval_request",
    leaveRequestId: leaveId,
    employeeId: empId,
    startDate: startDate,
    endDate: endDate
  }
}
```

**Leave Approved:**
```javascript
{
  title: "Leave Request Approved",
  body: `Cuti Anda telah disetujui: ${startDate} - ${endDate}`,
  data: {
    type: "leave_approved",
    leaveRequestId: leaveId,
    approvedBy: managerId
  }
}
```

**Attendance Reminder:**
```javascript
{
  title: "Reminder: Clock In",
  body: "Jangan lupa untuk clock in hari ini!",
  data: {
    type: "attendance_reminder",
    date: today
  }
}
```

### Scheduled Notifications

**Setup Cron Jobs:**

```javascript
// backend/cron/notificationScheduler.js

const cron = require('node-cron');
const fcmService = require('../services/fcmNotificationService');

// Daily clock-in reminder at 8:00 AM
cron.schedule('0 8 * * 1-5', async () => {
  console.log('Sending clock-in reminders...');
  
  // Get users who haven't clocked in
  const users = await getUsersWithoutClockIn();
  
  for (const user of users) {
    await fcmService.sendNotification(user.id, {
      title: 'Reminder: Clock In',
      body: 'Jangan lupa untuk clock in hari ini!',
      data: {
        type: 'attendance_reminder'
      }
    });
  }
});

// Clock-out reminder at 5:00 PM
cron.schedule('0 17 * * 1-5', async () => {
  console.log('Sending clock-out reminders...');
  
  // Get users who clocked in but not out
  const users = await getUsersNeedClockOut();
  
  for (const user of users) {
    await fcmService.sendNotification(user.id, {
      title: 'Reminder: Clock Out',
      body: 'Waktunya clock out. Sudah selesai kerja?',
      data: {
        type: 'clockout_reminder'
      }
    });
  }
});
```

---

## Monitoring & Analytics

### Health Check Endpoint

```bash
curl https://nusantaragroup.co/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-19T10:30:00.000Z",
  "uptime": 123456.789,
  "environment": "production",
  "services": {
    "database": "connected",
    "fcm": "initialized",
    "redis": "connected"
  }
}
```

### FCM Status Endpoint

```bash
curl -X GET https://nusantaragroup.co/api/fcm/status \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "fcmStatus": {
    "initialized": true,
    "projectId": "nusantara-pwa"
  },
  "statistics": {
    "totalTokens": 1523,
    "activeTokens": 1487,
    "uniqueUsers": 845
  }
}
```

### Logging

**Winston Logger Configuration:**

```javascript
// backend/config/logger.js

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fcm-notifications' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Log Notification Sends:**

```javascript
logger.info('Notification sent', {
  userId: user.id,
  notificationType: 'leave_approval',
  success: true,
  timestamp: new Date().toISOString()
});
```

### Monitoring Dashboard

**Install Monitoring Tools:**

```bash
npm install express-status-monitor
```

**Add to server:**

```javascript
const monitor = require('express-status-monitor');

app.use(monitor({
  title: 'Nusantara API Monitor',
  path: '/status',
  spans: [{
    interval: 1,
    retention: 60
  }],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  }
}));
```

**Access:** `https://nusantaragroup.co/api/status`

---

## Troubleshooting

### Issue 1: FCM Not Initialized

**Error:**
```
Failed to initialize FCM: Cannot find module 'firebase-service-account.json'
```

**Solution:**
1. Check file exists:
   ```bash
   ls -la backend/config/firebase-service-account.json
   ```

2. Verify permissions:
   ```bash
   chmod 600 backend/config/firebase-service-account.json
   ```

3. Check environment variable:
   ```bash
   echo $FIREBASE_SERVICE_ACCOUNT_PATH
   ```

### Issue 2: Notifications Not Delivered

**Debugging Steps:**

1. **Check FCM status:**
   ```bash
   curl https://nusantaragroup.co/api/fcm/status \
     -H "Authorization: Bearer TOKEN"
   ```

2. **Verify user has token:**
   ```sql
   SELECT * FROM notification_tokens 
   WHERE user_id = 123 AND is_active = true;
   ```

3. **Check backend logs:**
   ```bash
   pm2 logs nusantara-backend --lines 100
   ```

4. **Test send:**
   ```bash
   curl -X POST https://nusantaragroup.co/api/fcm/test \
     -H "Authorization: Bearer TOKEN"
   ```

### Issue 3: High Memory Usage

**Solutions:**

1. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 monit
   ```

2. **Restart if needed:**
   ```bash
   pm2 restart nusantara-backend
   ```

3. **Increase memory limit:**
   ```javascript
   // ecosystem.config.js
   max_memory_restart: '2G'
   ```

4. **Clean up old tokens:**
   ```sql
   DELETE FROM notification_tokens 
   WHERE last_used_at < NOW() - INTERVAL '90 days';
   ```

### Issue 4: Database Connection Issues

**Solutions:**

1. **Check PostgreSQL status:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verify connection:**
   ```bash
   psql -U nusantara_user -d nusantara_db -c "SELECT 1"
   ```

3. **Check connection pool:**
   ```javascript
   // backend/config/database.js
   pool: {
     max: 20,
     min: 5,
     acquire: 30000,
     idle: 10000
   }
   ```

---

## Security Best Practices

### 1. Protect Service Account

```bash
# Set strict permissions
chmod 600 backend/config/firebase-service-account.json

# Add to .gitignore
echo "firebase-service-account.json" >> .gitignore

# Never commit to Git
git rm --cached backend/config/firebase-service-account.json
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  message: 'Too many notification requests'
});

app.use('/api/fcm/', notificationLimiter);
```

### 3. Input Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/fcm/send',
  verifyToken,
  [
    body('userId').isInt().withMessage('Invalid user ID'),
    body('title').trim().isLength({ min: 1, max: 100 }),
    body('body').trim().isLength({ min: 1, max: 500 }),
    body('data').optional().isObject()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... send notification
  }
);
```

### 4. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5. HTTPS Only

```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

---

## Scaling Guidelines

### Horizontal Scaling

**PM2 Cluster Mode:**

```javascript
// ecosystem.config.js
instances: 'max', // Use all CPU cores
exec_mode: 'cluster'
```

**Load Balancer (Nginx):**

```nginx
upstream backend {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
    server 127.0.0.1:5003;
}

location /api/ {
    proxy_pass http://backend;
}
```

### Database Optimization

**Connection Pooling:**

```javascript
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
});
```

**Indexing:**

```sql
-- Add composite index
CREATE INDEX idx_tokens_user_active 
ON notification_tokens(user_id, is_active);

-- Analyze table
ANALYZE notification_tokens;
```

### Caching

**Redis for Token Cache:**

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache active tokens
const cacheKey = `tokens:user:${userId}`;
const cached = await client.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const tokens = await NotificationToken.findAll({
  where: { userId, isActive: true }
});

await client.setex(cacheKey, 3600, JSON.stringify(tokens));
```

### Queue System

**Bull Queue for Notifications:**

```javascript
const Queue = require('bull');
const notificationQueue = new Queue('notifications', {
  redis: { host: 'localhost', port: 6379 }
});

// Producer
notificationQueue.add({
  userId: 123,
  title: 'Test',
  body: 'Test message'
}, {
  attempts: 3,
  backoff: 5000
});

// Consumer
notificationQueue.process(async (job) => {
  const { userId, title, body } = job.data;
  await fcmService.sendNotification(userId, { title, body });
});
```

---

## API Reference

### Authentication

All API endpoints require JWT token:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### POST /api/fcm/register-token

Register FCM token for user.

**Request:**
```json
{
  "token": "fcm_token_string",
  "deviceType": "desktop",
  "browser": "Chrome 118",
  "platform": "Windows 10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token registered successfully",
  "data": {
    "id": 123,
    "userId": 456,
    "token": "fcm_token_string"
  }
}
```

#### DELETE /api/fcm/unregister-token

Unregister specific FCM token.

**Request:**
```json
{
  "token": "fcm_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token unregistered successfully"
}
```

#### DELETE /api/fcm/unregister-all

Unregister all tokens for user.

**Response:**
```json
{
  "success": true,
  "message": "All tokens unregistered",
  "count": 3
}
```

#### POST /api/fcm/test

Send test notification to user.

**Response:**
```json
{
  "success": true,
  "message": "Test notification sent",
  "sentCount": 2
}
```

#### GET /api/fcm/status

Get FCM status and statistics.

**Response:**
```json
{
  "success": true,
  "fcmStatus": {
    "initialized": true,
    "projectId": "nusantara-pwa"
  },
  "statistics": {
    "totalTokens": 1523,
    "activeTokens": 1487,
    "uniqueUsers": 845
  }
}
```

---

## Conclusion

Dokumentasi ini mencakup semua aspek administrasi sistem notifikasi push. Untuk pertanyaan lebih lanjut, hubungi tim development.

**Contact:**
- Email: admin@nusantaragroup.co
- Slack: #nusantara-dev
- On-call: +62 xxx xxxx xxxx

---

**Last Updated:** October 19, 2024  
**Version:** 1.0.0  
**Maintained by:** Nusantara Dev Team
