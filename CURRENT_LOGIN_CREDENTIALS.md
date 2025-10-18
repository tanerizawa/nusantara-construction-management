# 🔐 Updated Login Credentials - Nusantara YK

**Last Updated:** October 17, 2025 20:50 WIB  
**Status:** ✅ All accounts active

---

## 👥 LOGIN CREDENTIALS

### **Admin Accounts:**

#### 1. **Hadez (Admin)**
```
Username: hadez
Password: T@n12089
Role: admin
```
✅ **Primary admin account** - Verified working

#### 2. **Yono Kurniawan (Direktur/Admin)**
```
Username: yonokurniawan
Password: admin123
Role: admin
Email: yono.kurniawan@nusantaragroup.co.id
```
✅ Direktur Umum/Utama

---

### **Other Users:**

#### 3. **Engkus Kusnadi (Project Manager)**
```
Username: engkuskusnadi
Password: admin123
Role: project_manager
```

#### 4. **Azmy (Supervisor)**
```
Username: azmy
Password: admin123
Role: supervisor
```

---

## 🌐 Login URLs

### **Development:**
```
URL: http://localhost:3000
Backend API: http://localhost:5000
```

### **Production:**
```
URL: https://nusantaragroup.co
Backend API: https://nusantaragroup.co/api
```

---

## ✅ Verification Test

### **Test Login - Hadez:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "hadez",
    "password": "T@n12089"
  }'
```

**Result:** ✅ `{"success":true,...}`

---

## 🔧 Quick Commands

### **Check All Users:**
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT username, role, is_active, 
       CASE WHEN email IS NOT NULL THEN email ELSE '-' END as email
FROM users 
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'project_manager' THEN 2
    WHEN 'supervisor' THEN 3
    ELSE 4
  END,
  username;
"
```

### **Update Password for Specific User:**
```bash
# 1. Generate hash
HASH=$(docker exec -it nusantara-backend node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('YOUR_PASSWORD_HERE', 10));
" | tr -d '\r\n')

# 2. Update database
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
UPDATE users 
SET password = '$HASH', updated_at = CURRENT_TIMESTAMP 
WHERE username = 'USERNAME_HERE';
"
```

### **Reset All Passwords to admin123:**
```bash
/root/APP-YK/scripts/reset-user-passwords.sh
```

---

## 📋 Summary

**Active Users:** 4

| Username | Password | Role | Status |
|----------|----------|------|--------|
| hadez | T@n12089 | admin | ✅ Active |
| yonokurniawan | admin123 | admin | ✅ Active |
| engkuskusnadi | admin123 | project_manager | ✅ Active |
| azmy | admin123 | supervisor | ✅ Active |

---

## 🔐 Security Notes

1. **Password Strength:**
   - hadez: ✅ Strong (special chars, numbers)
   - Others: ⚠️ Basic (recommended to change)

2. **Recommendations:**
   - Change default passwords after first login
   - Use password manager for secure storage
   - Enable 2FA if available

3. **Admin Access:**
   - Two admin accounts available
   - hadez: Primary admin with strong password
   - yonokurniawan: Direktur with basic password

---

**Last Verified:** October 17, 2025 20:50 WIB  
**All Accounts:** ✅ Tested & Working
