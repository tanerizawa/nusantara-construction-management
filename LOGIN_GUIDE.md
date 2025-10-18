# 🔐 Login Guide - Nusantara YK Construction Management

**Last Updated:** October 17, 2025  
**Status:** ✅ Login Fixed & Working

---

## ✅ MASALAH LOGIN DIPERBAIKI

### ❌ Masalah Sebelumnya:
- Login gagal dengan username `admin`
- Password tidak match di database
- User default tidak memiliki password yang konsisten

### ✅ Solusi yang Diterapkan:
1. ✅ Reset semua user passwords ke `admin123`
2. ✅ Verifikasi login API berfungsi
3. ✅ Update semua users dengan bcrypt hash yang benar

---

## 👥 LOGIN CREDENTIALS

### **Default Password Untuk Semua User:**
```
Password: admin123
```

### **Available Users:**

| Username | Role | Email | Status |
|----------|------|-------|--------|
| `yonokurniawan` | admin | yono.kurniawan@nusantaragroup.co.id | ✅ Active |
| `engkuskusnadi` | project_manager | - | ✅ Active |
| `azmy` | supervisor | - | ✅ Active |
| `hadez` | admin | - | ✅ Active |

---

## 🌐 Login URLs

### **Development (Docker):**
```
URL: http://localhost:3000
```

### **Production:**
```
URL: https://nusantaragroup.co
```

---

## 🔧 Cara Login

### Method 1: Via Frontend (Browser)

1. **Buka aplikasi:**
   - Development: `http://localhost:3000`
   - Production: `https://nusantaragroup.co`

2. **Masukkan credentials:**
   ```
   Username: yonokurniawan
   Password: admin123
   ```

3. **Klik Login**

### Method 2: Via API (cURL)

```bash
# Test login via API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "yonokurniawan",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "USR-DIR-YONO-001",
    "username": "yonokurniawan",
    "email": "yono.kurniawan@nusantaragroup.co.id",
    "role": "admin",
    "profile": {
      "fullName": "Yono Kurniawan, S.H",
      "position": "Direktur Umum/Utama",
      "department": "Direksi"
    }
  }
}
```

---

## 🔄 Reset Password (Jika Lupa)

### Quick Reset All Users:

```bash
# Jalankan script reset password
chmod +x /root/APP-YK/scripts/reset-user-passwords.sh
/root/APP-YK/scripts/reset-user-passwords.sh
```

### Manual Reset Specific User:

```bash
# 1. Generate hash
docker exec -it nusantara-backend node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));
"

# 2. Update database (ganti HASH_HERE dengan hasil step 1)
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
UPDATE users 
SET password = 'HASH_HERE' 
WHERE username = 'yonokurniawan';
"
```

---

## 🧪 Verifikasi Login

### Test 1: Backend Health
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"healthy",...}`

### Test 2: Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"yonokurniawan","password":"admin123"}'
```
Expected: `{"success":true,...}`

### Test 3: Get User Profile
```bash
# Use token from login response
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛡️ Security Notes

### ⚠️ PENTING - Untuk Production:

1. **Ubah Password Setelah Login Pertama:**
   ```
   - Login dengan admin123
   - Masuk ke Settings → Profile
   - Update password ke yang lebih kuat
   ```

2. **Password Requirements:**
   - Minimal 6 karakter
   - Kombinasi huruf dan angka (recommended)
   - Hindari password umum

3. **Admin Users:**
   - `yonokurniawan` - Direktur (Super Admin)
   - `hadez` - Admin

---

## 🐛 Troubleshooting

### Issue 1: "Invalid credentials"

**Penyebab:**
- Username salah
- Password tidak match
- User tidak aktif

**Solusi:**
```bash
# Cek user di database
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT username, role, is_active FROM users;
"

# Reset password
/root/APP-YK/scripts/reset-user-passwords.sh
```

### Issue 2: Backend tidak respond

**Penyebab:**
- Backend container stopped
- Port 5000 conflict

**Solusi:**
```bash
# Cek status
docker ps | grep backend

# Restart backend
docker restart nusantara-backend

# Cek logs
docker logs nusantara-backend --tail 50
```

### Issue 3: CORS error di production

**Penyebab:**
- Frontend menggunakan localhost API
- Browser memblokir cross-origin

**Solusi:**
```bash
# Rebuild frontend dengan production URL
cd /root/APP-YK/frontend
REACT_APP_API_URL=https://nusantaragroup.co/api npm run build
sudo cp -r build/* /var/www/html/
```

---

## 📊 Database Verification

### Cek Users di Database:

```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  username,
  role,
  CASE WHEN password IS NOT NULL THEN '✅ Set' ELSE '❌ NULL' END as password_status,
  is_active,
  email
FROM users
ORDER BY role, username;
"
```

### Cek Password Hash:

```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT username, LEFT(password, 20) as password_hash 
FROM users 
WHERE username = 'yonokurniawan';
"
```

Should show: `$2a$10$rpakkqHjZKlD...`

---

## 🔐 Password Management

### Create New User with Password:

```bash
# 1. Generate hash
HASH=$(docker exec -it nusantara-backend node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('newpassword123', 10));
")

# 2. Insert user
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
INSERT INTO users (id, username, email, password, role, is_active)
VALUES (
  'USR-NEW-001',
  'newuser',
  'newuser@example.com',
  '$HASH',
  'staff',
  true
);
"
```

---

## 📝 Files Created

1. **`/root/APP-YK/scripts/reset-user-passwords.sh`**
   - Script otomatis reset password semua user
   - Test login included
   
2. **`/root/APP-YK/LOGIN_GUIDE.md`** (this file)
   - Complete login documentation
   - Troubleshooting guide

---

## ✅ Verification Checklist

- [x] Backend running on port 5000
- [x] Database users have valid password hashes
- [x] Login API `/api/auth/login` working
- [x] All users reset to `admin123`
- [x] Login test passed
- [x] Token generation working
- [x] User profile data complete

---

## 🚀 Quick Commands

```bash
# Reset all passwords
/root/APP-YK/scripts/reset-user-passwords.sh

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"yonokurniawan","password":"admin123"}'

# View users
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "SELECT username, role FROM users;"

# Restart backend
docker restart nusantara-backend

# View backend logs
docker logs nusantara-backend --tail 50
```

---

## 📞 Summary

**Current Status:** ✅ **LOGIN WORKING**

**Default Credentials:**
```
Username: yonokurniawan
Password: admin123
```

**Login URLs:**
- Development: http://localhost:3000
- Production: https://nusantaragroup.co

**Password Reset:** Available via script

**Security:** ⚠️ Change password after first login!

---

**Last Verified:** October 17, 2025 20:45 WIB  
**All Tests:** ✅ PASSED
