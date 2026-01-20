# Quick Start Guide - Operations Dashboard Implementation

**Panduan cepat untuk melanjutkan implementasi**

---

## 📋 Status Saat Ini

### ✅ SELESAI (Phase 1)
- **System Metrics Tab**: UI enhanced, styling professional, memory metrics akurat (20-30%)
- **Backend**: Semua endpoint sudah ready dan tested
- **Database**: Semua tabel verified
- **Documentation**: Complete dengan 3 dokumen utama

### ⏳ BELUM SELESAI (Phase 2-4)
- **Backup Manager**: UI ada, perlu connect ke backend real data
- **Audit Trail**: UI ada, perlu connect ke backend real data  
- **Security Sessions**: UI ada, perlu fix endpoint + connect real data

---

## 🚀 Langkah Implementasi

### PHASE 2: Backup Manager (3-4 jam)

#### Step 1: Test Backend Endpoint
```bash
# Login dulu untuk dapat token
# Kemudian test:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/backup/stats

curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/backup/list
```

#### Step 2: Cek Database
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction
```
```sql
-- Lihat backup yang ada
SELECT * FROM backups ORDER BY created_at DESC LIMIT 5;

-- Cek stats
SELECT 
  COUNT(*) as total_backups,
  COUNT(*) FILTER (WHERE verified = true) as verified,
  pg_size_pretty(SUM(file_size)) as total_size
FROM backups;
```

#### Step 3: Update Frontend Component
File: `/root/APP-YK/frontend/src/pages/OperationalDashboard/components/BackupManager.jsx`

Yang perlu dicek:
1. Apakah `backupApi.listBackups()` sudah return data?
2. Apakah `backupApi.getStats()` sudah return data?
3. Apakah create/verify/restore/download berfungsi?

Yang perlu ditambah:
1. Loading skeleton
2. Empty state (jika belum ada backup)
3. Shadow-md pada cards
4. Auto-refresh every 30 seconds
5. Success/error notifications

---

### PHASE 3: Audit Trail (4-5 jam)

#### Step 1: Test Backend
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://nusantaragroup.co/api/audit/logs?limit=10"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/audit/actions

curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/audit/entity-types
```

#### Step 2: Cek Database
```sql
-- Lihat audit logs terbaru
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- Grouping by action
SELECT action, COUNT(*) FROM audit_logs GROUP BY action;

-- Activity last 7 days
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### Step 3: Update Frontend
File: `/root/APP-YK/frontend/src/pages/OperationalDashboard/components/AuditLogViewer.jsx`

Yang perlu dicek:
1. `auditApi.getLogs()` return data real
2. Filters working (action, entity type, date)
3. Export CSV download file

Yang perlu ditambah:
1. Action badges dengan warna (CREATE=green, UPDATE=blue, DELETE=red)
2. Entity type icons
3. Expandable row details (show oldValue vs newValue)
4. Better search highlighting

---

### PHASE 4: Security Sessions (4-5 jam)

#### ⚠️ PENTING: Fix Endpoint Mismatch Dulu

**Problem**: Frontend pakai `/api/security/*` tapi backend ada di `/api/auth/*`

**Solusi Cepat** (10 menit):

File: `/root/APP-YK/frontend/src/services/operationalApi.js`

Cari section `securityApi`:
```javascript
export const securityApi = {
  getLoginHistory: async (params = {}) => {
    // GANTI ini:
    const response = await axios.get(`${API_BASE_URL}/security/login-history`, ...);
    
    // JADI ini:
    const response = await axios.get(`${API_BASE_URL}/auth/login-history`, ...);
  },
  
  getActiveSessions: async () => {
    // GANTI:
    const response = await axios.get(`${API_BASE_URL}/security/active-sessions`, ...);
    
    // JADI:
    const response = await axios.get(`${API_BASE_URL}/auth/active-sessions`, ...);
  },
  
  terminateSession: async (token) => {
    // GANTI:
    const response = await axios.delete(`${API_BASE_URL}/security/session/${token}`, ...);
    
    // JADI:
    const response = await axios.delete(`${API_BASE_URL}/auth/session/${token}`, ...);
  }
};
```

#### Step 2: Test Backend
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/auth/active-sessions

curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://nusantaragroup.co/api/auth/login-history
```

#### Step 3: Cek Database
```sql
-- Active sessions
SELECT 
  s.*,
  u.username
FROM active_sessions s
JOIN users u ON u.id = s.user_id
WHERE s.expires_at > NOW();

-- Login history
SELECT * FROM login_history ORDER BY created_at DESC LIMIT 20;

-- Failed logins
SELECT 
  username,
  ip_address,
  COUNT(*) as attempts
FROM login_history
WHERE success = false AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY username, ip_address;
```

#### Step 4: Update Frontend
File: `/root/APP-YK/frontend/src/pages/OperationalDashboard/components/SecuritySessions.jsx`

Yang perlu ditambah:
1. Device icons (Mobile vs Desktop detection)
2. Current session highlighting (beda warna)
3. Location display (dari IP)
4. Browser detection (dari user agent)
5. Failed login attempts section

---

## 🎨 Design Standards (WAJIB DIIKUTI)

### Card Structure
```jsx
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Title</h3>
      </div>
    </div>
  </div>
  
  {/* Content */}
  <div className="p-6">
    {/* Your content here */}
  </div>
</div>
```

### Colors
```javascript
Blue:   'blue-600'   // Primary, CPU
Purple: 'purple-500' // Memory
Green:  'green-500'  // Success, Disk
Yellow: 'yellow-500' // Warning, Database
Red:    'red-500'    // Error, Critical
Gray:   'gray-50/200/600/900' // Backgrounds & text
```

### Loading State
```jsx
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
) : (
  // Your content
)}
```

### Empty State
```jsx
{data.length === 0 && !loading && (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <Icon className="h-16 w-16 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
    <p className="text-gray-600">Description here</p>
  </div>
)}
```

---

## 🧪 Testing Checklist

### Setiap Phase Selesai, Test:

#### Browser (Chrome DevTools Open)
- [ ] No console errors
- [ ] No console warnings
- [ ] Data loads correctly
- [ ] Loading states appear
- [ ] Empty states work (jika kosong)
- [ ] Pagination works
- [ ] Filters work
- [ ] Actions work (create, delete, etc)
- [ ] Responsive di mobile

#### Backend Logs
```bash
docker logs nusantara-backend -f
# Cari error atau warning
```

#### Frontend Logs
```bash
docker logs nusantara-frontend -f
# Harus "webpack compiled successfully"
```

#### Database
```sql
-- Verify data exists
SELECT COUNT(*) FROM [table_name];
```

---

## 📁 File Locations (Quick Reference)

### Frontend Components
```
/root/APP-YK/frontend/src/pages/OperationalDashboard/components/
├── SystemMetrics.jsx       ✅ Phase 1 DONE
├── BackupManager.jsx       ⏳ Phase 2 TODO
├── AuditLogViewer.jsx      ⏳ Phase 3 TODO
└── SecuritySessions.jsx    ⏳ Phase 4 TODO (fix endpoint first)
```

### Frontend API Service
```
/root/APP-YK/frontend/src/services/operationalApi.js
⚠️ Needs update for Security endpoints
```

### Backend Routes
```
/root/APP-YK/backend/routes/
├── monitoring/monitoring.routes.js  ✅ Working
├── backup/backup.routes.js          ✅ Working
├── audit/audit.routes.js            ✅ Working
└── auth/authentication.routes.js    ✅ Has security endpoints
```

### Backend Services
```
/root/APP-YK/backend/services/
├── systemMonitoringService.js  ✅ Fixed
├── backupService.js            ✅ Ready
├── auditService.js             ✅ Ready
└── securityService.js          ✅ Ready
```

---

## 🔥 Common Commands

### Restart After Code Changes
```bash
docker restart nusantara-frontend  # Frontend changes
docker restart nusantara-backend   # Backend changes
```

### Watch Logs
```bash
# Both at once (split terminal)
docker logs nusantara-frontend -f &
docker logs nusantara-backend -f
```

### Database Access
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction
```

### Check If Compiled
```bash
docker logs nusantara-frontend --tail 20 | grep compiled
```

---

## ⏱️ Time Estimates

| Phase | Task | Time |
|-------|------|------|
| 1 | ✅ System Metrics | 30 mins DONE |
| 2 | Backup Manager | 3-4 hours |
| 3 | Audit Trail | 4-5 hours |
| 4 | Security (fix endpoint + implement) | 4-5 hours |
| **TOTAL** | | **12-15 hours** |

---

## 📝 Documentation Files

1. **Master Plan**: `OPERATIONS_DASHBOARD_IMPLEMENTATION_PLAN.md`
   - Complete roadmap semua phase
   - Design standards
   - API endpoints

2. **Phase 1 Complete**: `PHASE_1_SYSTEM_METRICS_COMPLETE.md`
   - What was done
   - Before/after comparison
   - Testing results

3. **Complete Summary**: `OPERATIONS_DASHBOARD_COMPLETE_SUMMARY.md`
   - Executive summary
   - Backend status
   - Database schema
   - Known issues & solutions

4. **This Guide**: `OPERATIONS_DASHBOARD_QUICK_START.md`
   - Quick reference
   - Step-by-step untuk setiap phase
   - Common commands

---

## ✅ Success Criteria

### Phase Complete When:
1. ✅ Backend endpoint returns real data (no mock)
2. ✅ Frontend displays data correctly
3. ✅ UI follows design standards
4. ✅ Loading states work
5. ✅ Error handling implemented
6. ✅ No console errors
7. ✅ Responsive design works
8. ✅ Performance acceptable (<2s)

---

## 🎯 Prioritas Implementasi

### HIGH (Lakukan Dulu)
1. **Test Phase 1 di browser** - Pastikan memory sudah benar (20-30%)
2. **Phase 2: Backup Manager** - Critical untuk data safety
3. **Fix Security Endpoint** - 10 menit, blocker untuk Phase 4

### MEDIUM (Lakukan Berikutnya)
4. **Phase 3: Audit Trail** - Important untuk compliance
5. **Phase 4: Security Sessions** - After endpoint fix

### LOW (Optional Enhancements)
6. Timeline view untuk audit
7. Geo-location map
8. Advanced filters
9. Dark mode support

---

## 🆘 Troubleshooting

### Frontend tidak compile
```bash
docker logs nusantara-frontend --tail 50
# Cari syntax error
# Fix file yang error
docker restart nusantara-frontend
```

### Backend error 500
```bash
docker logs nusantara-backend --tail 50
# Cari stack trace
# Check database connection
docker restart nusantara-backend
```

### Data tidak muncul
1. Check backend logs: `docker logs nusantara-backend -f`
2. Check browser console (F12)
3. Check network tab (XHR requests)
4. Verify database has data
5. Check auth token valid

### Endpoint 404
1. Check route registered in server.js
2. Check endpoint path exact match
3. Check auth middleware not blocking
4. Test with curl

---

**Ready to Continue!** 🚀

Mulai dengan:
1. Test Phase 1 di browser: https://nusantaragroup.co/operations
2. Fix security endpoint (10 menit)
3. Start Phase 2: Backup Manager

**Estimated Time to Complete All**: 11-14 hours

Good luck! 💪
