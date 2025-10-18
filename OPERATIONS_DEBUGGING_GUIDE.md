# 🔧 OPERATIONS DASHBOARD - DEBUGGING GUIDE

## ❗ MASALAH
- Klik menu "Operations" → Redirect ke `/dashboard`
- User: `hadez` (admin utama)
- Expected: Tampil Operations Dashboard
- Actual: Redirect ke dashboard

## ✅ VERIFIKASI BACKEND & BUILD

### 1. Backend `/auth/me` Endpoint ✅
```javascript
// File: backend/routes/auth/authentication.routes.js:236
role: user.role  // ✅ Backend SUDAH mengirim role
```

### 2. Frontend Component ✅
```bash
/root/APP-YK/frontend/src/pages/OperationalDashboard/
├── OperationalDashboard.jsx    # Main dashboard
├── index.js                     # Export
└── components/
    ├── SystemMetrics.jsx
    ├── BackupManager.jsx
    ├── AuditLogViewer.jsx
    └── SecuritySessions.jsx
```

### 3. Route Definition ✅
```javascript
// File: frontend/src/App.js:217-222
<Route path="/operations" element={
  <ProtectedRoute roles={['admin']}>
    <MainLayout>
      <OperationalDashboard />
    </MainLayout>
  </ProtectedRoute>
} />
```

### 4. ProtectedRoute Logic ✅
```javascript
// File: frontend/src/components/ProtectedRoute.js:28-31
if (roles.length > 0 && !roles.includes(user.role)) {
  return <Navigate to="/dashboard" replace />;
}
```

### 5. Production Build ✅
```bash
Build: October 18, 2025 16:39
Size: 600.23 kB (gzipped)
Location: /root/APP-YK/frontend-build/
Apache: Restarted ✅
```

---

## 🧪 DEBUGGING STEPS (DI BROWSER)

### Step 1: Check User Role in Browser
1. Buka https://nusantaragroup.co/login
2. Login dengan username: `hadez`
3. Tekan **F12** untuk buka Developer Tools
4. Klik tab **Console**
5. Ketik command ini:

```javascript
// Check token
localStorage.getItem('token')

// Decode token (copy token dari command di atas)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User Role:', payload.role);
console.log('User ID:', payload.id);
console.log('Username:', payload.username);
```

**Expected Output:**
```javascript
User Role: "admin"
User ID: "USR-IT-HADEZ-001"
Username: "hadez"
```

### Step 2: Check AuthContext User Object
Ketik di Console:

```javascript
// Check React context (jika menggunakan React DevTools)
// Atau check window object
console.log('Current User:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
```

Atau lebih mudah, tambahkan `console.log` di ProtectedRoute:

```javascript
// Temporary debug - tambahkan di ProtectedRoute.js:27
console.log('🔐 ProtectedRoute Check:', {
  userRole: user?.role,
  requiredRoles: roles,
  hasAccess: roles.length > 0 ? roles.includes(user?.role) : true
});
```

### Step 3: Check Network Request
1. Buka tab **Network** di DevTools
2. Refresh halaman
3. Cari request ke `/auth/me`
4. Klik request → Tab **Response**
5. Pastikan response mengandung:

```json
{
  "success": true,
  "user": {
    "id": "USR-IT-HADEZ-001",
    "username": "hadez",
    "role": "admin",    ← HARUS ada!
    "email": "hadez@nusantaragroup.co",
    "isActive": true
  }
}
```

### Step 4: Clear Browser Cache
**PENTING!** Browser mungkin masih pakai build lama.

#### Chrome/Edge:
1. Tekan **Ctrl + Shift + Delete**
2. Pilih "Cached images and files"
3. Time range: "Last 24 hours"
4. Klik "Clear data"
5. **ATAU** Hard refresh: **Ctrl + Shift + F5**

#### Firefox:
1. Tekan **Ctrl + Shift + Delete**
2. Centang "Cache"
3. Klik "Clear Now"
4. **ATAU** Hard refresh: **Ctrl + Shift + R**

### Step 5: Test Direct URL Access
1. Clear cache (Step 4)
2. Login sebagai `hadez`
3. Di address bar, ketik langsung: `https://nusantaragroup.co/operations`
4. Tekan Enter
5. Lihat Console untuk errors

---

## 🐛 KEMUNGKINAN MASALAH

### Masalah 1: Browser Cache (90% kemungkinan)
**Symptom:** Build baru sudah di-deploy tapi behavior masih sama

**Solution:**
```bash
# Hard refresh browser
Ctrl + Shift + F5 (Chrome/Edge)
Ctrl + Shift + R (Firefox)

# Atau clear cache manual
Ctrl + Shift + Delete
```

### Masalah 2: Token Tidak Mengandung Role
**Symptom:** `/auth/me` response tidak punya field `role`

**Check:**
```bash
# Test endpoint langsung
curl -H "Authorization: Bearer YOUR_TOKEN" https://nusantaragroup.co/api/auth/me
```

**Solution:** Logout dan login ulang untuk dapat token baru.

### Masalah 3: AuthContext Tidak Update User
**Symptom:** `user` object di context tidak punya `role` property

**Check:** File `/frontend/src/context/AuthContext.js:28-30`
```javascript
if (response.data.success && response.data.user) {
  setUser(response.data.user);  // ← Pastikan user.role ada
}
```

**Solution:** Pastikan backend response structure benar.

### Masalah 4: Route Order Conflict
**Symptom:** Route lain catching `/operations` sebelum ProtectedRoute

**Check:** File `/frontend/src/App.js` - pastikan `/operations` route sebelum catch-all route `*`

---

## ✅ CHECKLIST SEBELUM LAPOR BUG

Sebelum bilang "masih error", pastikan sudah:

- [ ] Hard refresh browser (Ctrl+Shift+F5)
- [ ] Clear browser cache
- [ ] Logout dan login ulang
- [ ] Check Console untuk error messages
- [ ] Check Network tab untuk `/auth/me` response
- [ ] Verify token contains `role: "admin"`
- [ ] Test direct URL: `https://nusantaragroup.co/operations`
- [ ] Try different browser (Chrome/Firefox/Edge)

---

## 🎯 QUICK FIX COMMANDS

### If Token Missing Role:
```bash
# Check database role
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT id, username, role FROM users WHERE username = 'hadez';"

# Expected: role | admin
```

### If Build Not Updated:
```bash
# Force rebuild
cd /root/APP-YK/frontend
docker exec nusantara-frontend npm run build
docker cp nusantara-frontend:/app/build/. /root/APP-YK/frontend-build/
sudo systemctl restart apache2

# Then hard refresh browser!
```

### If Still Not Working:
Add temporary debug logging:

```javascript
// File: frontend/src/components/ProtectedRoute.js
// Add before line 28:
console.log('🔐 ProtectedRoute Debug:', {
  path: location.pathname,
  userRole: user?.role,
  requiredRoles: roles,
  willRedirect: roles.length > 0 && !roles.includes(user?.role)
});
```

Rebuild, deploy, hard refresh, then check Console!

---

## 📞 NEXT STEPS

1. **PERTAMA:** Hard refresh browser (Ctrl+Shift+F5)
2. **KEDUA:** Logout dan login ulang
3. **KETIGA:** Check Console untuk error messages
4. **KEEMPAT:** Kasih screenshot Console + Network tab

Kalau masih error setelah langkah di atas, baru kita debug lebih dalam! 🚀
