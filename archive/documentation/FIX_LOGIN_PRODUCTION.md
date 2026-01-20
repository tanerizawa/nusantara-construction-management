# 🔧 Fix Login di Production (nusantaragroup.co)

## ❌ Masalah

Login gagal dengan error:
- Frontend mengakses dari `https://nusantaragroup.co`
- Config menunjukkan `http://localhost:5000` (hardcoded fallback)
- Browser memblokir cross-origin request (CORS error)

**Root Cause:**
Frontend build saat ini **tidak membawa environment variable** yang benar. Build masih menggunakan `http://localhost:5000` padahal `.env` sudah berisi `https://nusantaragroup.co/api`.

---

## ✅ Solusi Immediate (Tanpa Rebuild - 2 Menit)

### Method 1: Update Hardcoded URL di config.js (Quick Fix)

File sudah diperbaiki di `/root/APP-YK/frontend/src/utils/config.js`:

```javascript
const getApiUrl = () => {
  // Jika ENV tidak ada (build lama), gunakan production URL
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    // PERBAIKAN: Gunakan full URL, bukan relative path
    return 'https://nusantaragroup.co/api';
  }

  return '/api';
};
```

**Rebuild frontend sekarang:**

```bash
cd /root/APP-YK/frontend

# Build dengan environment variable
REACT_APP_API_URL=https://nusantaragroup.co/api npm run build

# Copy ke production directory
sudo cp -r build/* /var/www/html/

# Atau jika menggunakan specific directory
sudo cp -r build/* /var/www/nusantaragroup.co/public_html/
```

---

## ✅ Solusi Permanent (Dengan Docker - 15 Menit)

### Step 1: Update docker-compose untuk production

Edit `/root/APP-YK/docker-compose.complete.yml`:

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  environment:
    - REACT_APP_API_URL=https://nusantaragroup.co/api
    - NODE_ENV=production
  ports:
    - "3000:80"  # Nginx serves on port 80 inside container
```

### Step 2: Build dan Deploy

```bash
cd /root/APP-YK

# Build production frontend
docker-compose -f docker-compose.complete.yml build frontend

# Atau manual build
cd frontend
docker build -t nusantara-frontend:prod \
  --build-arg REACT_APP_API_URL=https://nusantaragroup.co/api \
  .

# Extract build files
docker run --rm -v $(pwd)/build:/output nusantara-frontend:prod \
  sh -c "cp -r /usr/share/nginx/html/* /output/"

# Deploy to Apache
sudo cp -r build/* /var/www/html/
```

---

## ✅ Verifikasi CORS di Backend

Backend sudah dikonfigurasi dengan benar di `/root/APP-YK/backend/server.js`:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://nusantaragroup.co',      // ✅ Sudah ada
      'https://www.nusantaragroup.co',  // ✅ Sudah ada
      'http://localhost:3000',
      // ... other origins
    ];
    
    // In development, allow all origins
    if (!isProduction) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};
```

**Pastikan backend berjalan di production:**

```bash
# Cek backend status
curl https://nusantaragroup.co/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

---

## ✅ Verifikasi Apache/Nginx Reverse Proxy

### Jika menggunakan Apache:

File: `/etc/apache2/sites-available/nusantaragroup.co.conf`

```apache
<VirtualHost *:443>
    ServerName nusantaragroup.co
    
    # Frontend
    DocumentRoot /var/www/html
    
    # Backend API Proxy
    ProxyPreserveHost On
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    # CORS Headers
    Header always set Access-Control-Allow-Origin "https://nusantaragroup.co"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header always set Access-Control-Allow-Credentials "true"
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/nusantaragroup.co/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/nusantaragroup.co/privkey.pem
</VirtualHost>
```

**Reload Apache:**

```bash
sudo a2enmod proxy proxy_http headers
sudo systemctl reload apache2
```

### Jika menggunakan Nginx:

File: `/etc/nginx/sites-available/nusantaragroup.co`

```nginx
server {
    listen 443 ssl http2;
    server_name nusantaragroup.co;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/nusantaragroup.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nusantaragroup.co/privkey.pem;
    
    # Frontend
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS Headers
        add_header Access-Control-Allow-Origin "https://nusantaragroup.co" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
    }
}
```

**Reload Nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Testing Checklist

### 1. Test Backend Health

```bash
curl https://nusantaragroup.co/api/health
# Expected: {"status":"ok"}
```

### 2. Test CORS Preflight

```bash
curl -X OPTIONS https://nusantaragroup.co/api/auth/login \
  -H "Origin: https://nusantaragroup.co" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Expected headers in response:
- `Access-Control-Allow-Origin: https://nusantaragroup.co`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Credentials: true`

### 3. Test Login API

```bash
curl -X POST https://nusantaragroup.co/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://nusantaragroup.co" \
  -d '{"username":"admin","password":"admin123"}' \
  -v
```

Expected response:
```json
{
  "success": true,
  "token": "...",
  "user": {...}
}
```

### 4. Test dari Browser Console

Buka https://nusantaragroup.co, lalu di browser console:

```javascript
fetch('https://nusantaragroup.co/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 🚀 Quick Command to Fix (All-in-One)

```bash
#!/bin/bash

echo "🔧 Fixing login issue..."

# Step 1: Rebuild frontend with correct env
cd /root/APP-YK/frontend
export REACT_APP_API_URL=https://nusantaragroup.co/api
npm run build

# Step 2: Deploy to production
sudo cp -r build/* /var/www/html/

# Step 3: Restart backend (ensure latest CORS config)
docker restart nusantara-backend

# Step 4: Reload web server
if command -v apache2 &> /dev/null; then
    sudo systemctl reload apache2
elif command -v nginx &> /dev/null; then
    sudo systemctl reload nginx
fi

echo "✅ Done! Try login now at https://nusantaragroup.co"
```

Save as `fix-login.sh`, lalu jalankan:

```bash
chmod +x fix-login.sh
./fix-login.sh
```

---

## 📊 Debugging Tools

### Check Environment Variable di Browser

Buka https://nusantaragroup.co, tekan F12, lalu di Console:

```javascript
// Cek config
console.log('API_URL:', window.location.href);
console.log('Environment:', process.env.NODE_ENV);

// Cek apakah config.js ter-load
import('../utils/config.js').then(m => console.log(m.API_URL));
```

### Check CORS di Network Tab

1. Buka Developer Tools → Network
2. Coba login
3. Cek request ke `/api/auth/login`
4. Lihat Headers:
   - **Request Headers:** Harus ada `Origin: https://nusantaragroup.co`
   - **Response Headers:** Harus ada `Access-Control-Allow-Origin`

---

## 📝 Summary

**Immediate Fix (5 menit):**
```bash
cd /root/APP-YK/frontend
REACT_APP_API_URL=https://nusantaragroup.co/api npm run build
sudo cp -r build/* /var/www/html/
```

**Root Cause:**
- Frontend build tidak embed environment variable dengan benar
- Fallback hardcoded masih menggunakan `localhost:5000`

**Solution:**
- Rebuild dengan environment variable yang benar
- Update config.js untuk fallback ke production URL
- Pastikan reverse proxy (Apache/Nginx) sudah benar

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Fix tersedia, perlu rebuild frontend
