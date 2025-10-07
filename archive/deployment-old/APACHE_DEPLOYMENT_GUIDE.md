# APACHE DEPLOYMENT GUIDE - NUSANTARA GROUP
## Deploy ke https://nusantaragroup.co/approval

### ✅ Konfigurasi yang Sudah Siap

1. **Apache Virtual Host**: Sudah dikonfigurasi untuk `nusantaragroup.co`
2. **SSL/HTTPS**: Dikelola oleh Virtualmin/Let's Encrypt
3. **Proxy API**: Apache memproxy `/api/*` ke backend port 5000
4. **React Router**: Mendukung SPA routing untuk React

### 🚀 Quick Deployment

Jalankan script deployment otomatis:

```bash
sudo ./deploy-apache-production.sh
```

Script ini akan:
- ✅ Build frontend dengan konfigurasi production
- ✅ Deploy ke `/var/www/html/nusantara-frontend`
- ✅ Start backend containers via Docker
- ✅ Update konfigurasi Apache
- ✅ Reload Apache service
- ✅ Verify deployment

### 🌐 URL Akses

Setelah deployment selesai:

- **Main Site**: https://nusantaragroup.co
- **Approval Dashboard**: https://nusantaragroup.co/approval
- **API Endpoint**: https://nusantaragroup.co/api
- **Health Check**: https://nusantaragroup.co/api/health

### 🔧 Manual Deployment (Opsional)

Jika ingin deploy manual:

#### 1. Build Frontend
```bash
cd /root/APP-YK/frontend
export REACT_APP_API_URL=https://nusantaragroup.co/api
export NODE_ENV=production
npm run build
```

#### 2. Deploy Frontend
```bash
sudo cp -r /root/APP-YK/frontend/build/* /var/www/html/nusantara-frontend/
sudo chown -R www-data:www-data /var/www/html/nusantara-frontend
```

#### 3. Start Backend
```bash
cd /root/APP-YK
docker-compose -f docker-compose.production.yml up -d --build
```

#### 4. Reload Apache
```bash
sudo systemctl reload apache2
```

### 📋 Verifikasi

1. **Cek Apache Status**:
   ```bash
   sudo systemctl status apache2
   ```

2. **Cek Backend Containers**:
   ```bash
   docker-compose -f docker-compose.production.yml ps
   ```

3. **Test API**:
   ```bash
   curl https://nusantaragroup.co/api/health
   ```

4. **Test Frontend**:
   ```bash
   curl https://nusantaragroup.co/approval
   ```

### 🔍 Troubleshooting

#### Cek Logs Apache
```bash
sudo tail -f /var/log/apache2/nusantaragroup.co_error.log
sudo tail -f /var/log/apache2/nusantaragroup.co_access.log
```

#### Cek Logs Backend
```bash
cd /root/APP-YK
docker-compose -f docker-compose.production.yml logs backend
```

#### Restart Services
```bash
# Restart Apache
sudo systemctl restart apache2

# Restart Backend
docker-compose -f docker-compose.production.yml restart
```

### 📁 Struktur File

```
/var/www/html/nusantara-frontend/   # Frontend files
├── index.html                      # Main HTML
├── static/                         # CSS, JS, assets
└── ...

/root/APP-YK/                       # Source code
├── frontend/                       # React source
├── backend/                        # Node.js source
├── docker-compose.production.yml   # Production containers
└── apache-virtualhost.conf         # Apache config
```

### 🎯 Approval Dashboard

Dashboard approval dapat diakses di:
**https://nusantaragroup.co/approval**

Fitur yang tersedia:
- ✅ Multi-level approval workflow
- ✅ Real-time dashboard dengan KPI
- ✅ Approval cards dengan detail lengkap
- ✅ Decision dialog (Approve/Conditional/Reject)
- ✅ History dan tracking
- ✅ Responsive design untuk mobile

---

**Status**: ✅ Production Ready dengan Apache + HTTPS
