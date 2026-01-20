# 🚀 OPERATIONAL DASHBOARD - QUICK START GUIDE

**Last Updated:** October 18, 2025  
**Version:** 1.0

---

## 📋 TABLE OF CONTENTS

1. [Access Dashboard](#access-dashboard)
2. [System Metrics](#system-metrics)
3. [Backup Manager](#backup-manager)
4. [Audit Trail](#audit-trail)
5. [Security Sessions](#security-sessions)
6. [Troubleshooting](#troubleshooting)

---

## 🔐 ACCESS DASHBOARD

### URL:
```
http://localhost:3000/operations
```

### Requirements:
- ✅ Logged in as admin user
- ✅ Backend API running
- ✅ Valid JWT token

### Navigation:
1. Login to application
2. Click **"Operations"** in sidebar menu
3. Dashboard opens on **System Metrics** tab

---

## 📊 SYSTEM METRICS

### Overview:
Real-time system health and performance monitoring.

### Metrics Displayed:

#### 1. **Health Status Card**
- System status: Healthy / Warning / Critical
- Color-coded indicator
- Status message

#### 2. **Metrics Cards (4)**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ CPU         │ Memory      │ Disk        │ Database    │
│ %usage      │ %usage      │ %usage      │ Connections │
│ cores       │ GB used     │ GB used     │ DB size     │
│ load avg    │ GB total    │ GB total    │ active/max  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### 3. **Charts (2)**
- CPU Usage History (rolling 20 points)
- Memory Usage History (rolling 20 points)
- Auto-refresh: Every 5 seconds

#### 4. **Process Information**
- Uptime (hours/minutes)
- PID (Process ID)
- Memory RSS (MB)
- Node.js Version

### Actions:
- **Auto-refresh**: Automatic every 5 seconds
- **View Details**: Click metrics for more info

---

## 💾 BACKUP MANAGER

### Overview:
Database backup creation, verification, and restoration.

### Statistics Dashboard:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total       │ Success     │ Total       │ Avg         │
│ Backups     │ Rate        │ Size        │ Compression │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Create Manual Backup:
1. Enter optional description
2. Click **"Create Backup"** button
3. Wait for completion (typically 1-2 seconds)
4. Check status in backup list

### Backup List Columns:
- **File Name**: Backup filename (timestamp-based)
- **Status**: COMPLETED / VERIFIED / FAILED / CORRUPTED
- **Size**: File size with compression ratio
- **Created**: Date and time of backup

### Backup Actions:

#### ✅ Verify Backup:
- Click **CheckCircle** icon
- SHA-256 integrity check
- Status updates to VERIFIED

#### 📥 Download Backup:
- Click **Download** icon
- Browser downloads .sql.gz file
- Save to local storage

#### 🔄 Restore Backup:
- Click **RefreshCw** icon
- **WARNING**: Triple confirmation required
  1. Initial warning dialog
  2. Double confirmation
  3. Type "YES" to proceed
- Database restored from backup
- Application reloads automatically

#### 🗑️ Delete Backup:
- Click **Trash** icon
- Confirmation dialog
- Backup file removed

### Pagination:
- 10 backups per page
- Previous/Next buttons
- Current page indicator

---

## 📝 AUDIT TRAIL

### Overview:
Complete audit log viewer with advanced filtering.

### Header:
- Total logs count
- **Show/Hide Filters** button
- **Export CSV** button

### Filters:

#### Search:
```
[🔍 Search logs...]
```
- Full-text search across all fields
- Real-time filtering

#### Action Filter:
```
[Action ▼]
- All Actions
- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- VIEW
- EXPORT
```

#### Entity Type Filter:
```
[Entity Type ▼]
- All Types
- User
- Project
- Asset
- Subsidiary
- etc.
```

#### Date Range:
```
Start Date: [YYYY-MM-DD]
End Date:   [YYYY-MM-DD]
```

#### Reset:
```
[Reset Filters]
```
- Clears all filters
- Returns to default view

### Log Table Columns:
1. **Timestamp** - Date/time of action
2. **User** - User who performed action
3. **Action** - Action type (color-coded badge)
4. **Entity** - Entity type and ID
5. **Details** - Description of action
6. **IP Address** - Source IP

### Action Badge Colors:
```
CREATE  → Green
UPDATE  → Blue
DELETE  → Red
LOGIN   → Purple
LOGOUT  → Gray
VIEW    → Yellow
EXPORT  → Orange
```

### Export to CSV:
1. Apply desired filters (optional)
2. Click **"Export CSV"** button
3. File downloads: `audit_logs_YYYY-MM-DD_HHMMSS.csv`

### Pagination:
- 20 logs per page
- Previous/Next navigation
- Page indicator

---

## 🔒 SECURITY SESSIONS

### Overview:
Active session monitoring and login history tracking.

### Active Sessions Section:

#### Session Card Layout:
```
┌─────────────────────────────────────────────────┐
│ [📱] Username                    [Current Session] │
│                                                   │
│ 📍 IP: 192.168.1.100 • Jakarta, Indonesia       │
│ 💻 Device: Desktop - Chrome 120                  │
│ 🌐 User Agent: Mozilla/5.0...                   │
│ 🕐 Login: Oct 18, 2025 10:30:45 AM             │
│ 🕐 Last activity: Oct 18, 2025 11:15:22 AM     │
│                                  [Terminate ❌]   │
└─────────────────────────────────────────────────┘
```

#### Device Icons:
- 📱 **Smartphone**: Mobile devices (Android/iPhone)
- 💻 **Laptop**: Desktop/Laptop computers

#### Terminate Session:
- Click **"Terminate"** button
- Confirmation dialog
- User immediately logged out
- **Note**: Cannot terminate current session

### Login History Section:

#### Table Columns:
1. **User** - Username/ID
2. **Status** - Success (Green) / Failed (Red)
3. **IP Address / Location** - IP with city, country
4. **Device** - Device type with icon
5. **Timestamp** - Login date/time

#### Pagination:
- 10 entries per page
- Previous/Next navigation
- Page indicator

### Auto-Refresh:
- Every 30 seconds
- Real-time session updates
- Automatic failed login detection

---

## 🛠️ TROUBLESHOOTING

### Dashboard Not Loading:

**Problem**: White screen or 404 error  
**Solutions**:
1. Verify you're logged in as admin
2. Check URL: `http://localhost:3000/operations`
3. Clear browser cache
4. Check backend API status

### 401 Unauthorized Error:

**Problem**: "Unauthorized" or "Access Denied"  
**Solutions**:
1. Verify user role is 'admin'
2. Check JWT token in localStorage
3. Re-login to refresh token
4. Contact system administrator

### Metrics Not Updating:

**Problem**: Stale data, no refresh  
**Solutions**:
1. Check browser network tab for API errors
2. Verify backend monitoring service is running
3. Check auto-refresh interval (5-30 seconds)
4. Manually refresh browser

### Charts Not Rendering:

**Problem**: Blank chart area  
**Solutions**:
1. Check browser console for errors
2. Verify Chart.js is loaded
3. Check API response format
4. Clear cache and reload

### Backup Actions Failing:

**Problem**: Create/Restore/Download not working  
**Solutions**:
1. Check backend logs: `docker logs nusantara-backend`
2. Verify backup directory exists
3. Check disk space availability
4. Ensure PostgreSQL is running

### CSV Export Not Working:

**Problem**: No download or error  
**Solutions**:
1. Check browser download permissions
2. Disable popup blockers
3. Verify backend audit service
4. Check file size limits

---

## 🎯 QUICK ACTIONS CHEAT SHEET

### Daily Operations:

**Check System Health:**
```
Operations → System Metrics → View health status
```

**Create Manual Backup:**
```
Operations → Backup Manager → Create Backup
```

**View Recent Activity:**
```
Operations → Audit Trail → (Default shows latest)
```

**Monitor Active Users:**
```
Operations → Security → Active Sessions
```

### Weekly Tasks:

**Review Backup Status:**
```
Operations → Backup Manager → Check success rate
```

**Export Audit Logs:**
```
Operations → Audit Trail → Export CSV
```

**Check Failed Logins:**
```
Operations → Security → Login History → Filter Failed
```

### Monthly Tasks:

**Cleanup Old Logs:**
```
Backend API: DELETE /api/audit/cleanup?days=90
```

**Download Full Backup:**
```
Operations → Backup Manager → Download latest
```

**Review System Performance:**
```
Operations → System Metrics → Check CPU/Memory trends
```

---

## 📱 KEYBOARD SHORTCUTS

```
Ctrl + F     - Focus search (in Audit Trail)
Escape       - Close dialogs/modals
Tab          - Navigate between fields
Enter        - Submit forms
Ctrl + R     - Refresh page
```

---

## 🎨 UI COLOR INDICATORS

### Status Colors:
```
🟢 Green    - Healthy / Success (< 50%)
🟡 Yellow   - Warning (50-80%)
🔴 Red      - Critical / Failed (> 80%)
🔵 Blue     - Information / Updated
🟣 Purple   - Login/Authentication
⚪ Gray     - Neutral / Inactive
```

---

## 📞 SUPPORT & HELP

### Need Help?
1. Check this guide first
2. Review full documentation: `FRONTEND_DASHBOARD_COMPLETE.md`
3. Check backend documentation
4. Review browser console errors
5. Contact system administrator

### Reporting Issues:
Include the following:
- Browser type and version
- Error message (if any)
- Steps to reproduce
- Expected vs actual behavior
- Screenshot (if applicable)

---

## ✅ QUICK CHECKLIST

Before Using Dashboard:
- [ ] Backend API is running
- [ ] Logged in as admin user
- [ ] Browser is modern (Chrome, Firefox, Edge)
- [ ] JavaScript enabled
- [ ] Cookies enabled
- [ ] Network connection stable

---

**Document Version:** 1.0  
**Last Updated:** October 18, 2025  
**For:** Admin Users  
**Platform:** Web Browser (Desktop/Mobile)
