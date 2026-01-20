# Deployment Checklist: PWA Push Notifications

## Pre-Deployment Checklist

### 1. Firebase Configuration ✓

- [ ] Firebase project created
- [ ] Cloud Messaging enabled
- [ ] Service account JSON downloaded
- [ ] Service account placed in `backend/config/`
- [ ] Service account permissions set (chmod 600)
- [ ] Frontend config updated (`firebaseConfig.js`)
- [ ] Service worker config updated (`firebase-messaging-sw.js`)
- [ ] .gitignore includes service account file

### 2. Environment Variables ✓

**Backend `.env`:**
```env
# Required
NODE_ENV=production
PORT=5000
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_PROJECT_ID=

# Optional
ALLOWED_ORIGINS=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

- [ ] All environment variables set
- [ ] JWT_SECRET is strong (min 32 chars)
- [ ] Database credentials correct
- [ ] Firebase paths correct
- [ ] CORS origins configured

**Frontend `.env.production`:**
```env
REACT_APP_API_URL=https://nusantaragroup.co
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

- [ ] API_URL points to production domain
- [ ] All Firebase config values set

### 3. Database Setup ✓

- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] User created with proper permissions
- [ ] Tables migrated
- [ ] Indexes created
- [ ] Backup strategy in place

**Run migrations:**
```bash
cd backend
npm run migrate
```

**Verify tables:**
```sql
\dt
SELECT * FROM notification_tokens LIMIT 1;
```

### 4. SSL Certificates ✓

- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Certificate installed
- [ ] Auto-renewal configured
- [ ] HTTPS redirects working

**Certbot setup:**
```bash
sudo certbot --nginx -d nusantaragroup.co -d www.nusantaragroup.co
sudo certbot renew --dry-run
```

### 5. Nginx Configuration ✓

- [ ] Nginx installed
- [ ] Site configuration created
- [ ] Frontend static files served
- [ ] Backend proxy configured
- [ ] Service worker served with no-cache
- [ ] Manifest.json accessible
- [ ] CORS headers set
- [ ] Gzip compression enabled
- [ ] Rate limiting configured

**Test Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Backend Build ✓

- [ ] Dependencies installed
- [ ] Database connection tested
- [ ] FCM initialized successfully
- [ ] API endpoints tested
- [ ] PM2 configuration created
- [ ] Logs directory created

**Build steps:**
```bash
cd backend
npm install --production
npm test
node server.js # Test run
```

### 7. Frontend Build ✓

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Production build created
- [ ] Service worker generated
- [ ] Manifest.json included
- [ ] Icons present
- [ ] Build deployed to web root

**Build steps:**
```bash
cd frontend
npm install
npm run build
# Copy build to /var/www/nusantara/frontend/build/
```

### 8. PM2 Setup ✓

- [ ] PM2 installed globally
- [ ] Ecosystem config created
- [ ] App started with PM2
- [ ] PM2 startup script enabled
- [ ] PM2 save executed

**PM2 commands:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 status
```

### 9. Monitoring Setup ✓

- [ ] Winston logger configured
- [ ] Log rotation enabled
- [ ] Status monitor accessible
- [ ] Health check endpoint working
- [ ] Error tracking enabled
- [ ] Alerts configured

### 10. Security Hardening ✓

- [ ] Firewall configured (UFW/iptables)
- [ ] Only necessary ports open (80, 443, 22)
- [ ] SSH key authentication only
- [ ] Fail2ban installed
- [ ] Regular security updates enabled
- [ ] Database not exposed publicly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] XSS protection headers set
- [ ] CSRF protection enabled

### 11. Performance Optimization ✓

- [ ] Gzip compression enabled
- [ ] Static assets cached
- [ ] Database queries optimized
- [ ] Indexes created
- [ ] Connection pooling configured
- [ ] CDN configured (if applicable)

### 12. Backup Strategy ✓

- [ ] Database backup script created
- [ ] Backup cron job configured
- [ ] Backup retention policy set
- [ ] Backup restoration tested
- [ ] Service account backed up securely

---

## Deployment Steps

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx

# Install PM2
sudo npm install -g pm2

# Create app user
sudo useradd -m -s /bin/bash nusantara
sudo usermod -aG sudo nusantara
```

### Step 2: Clone Repository

```bash
# As nusantara user
cd /home/nusantara
git clone https://github.com/your-org/nusantara-app.git
cd nusantara-app
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install --production

# Create config directory
mkdir -p config logs

# Copy service account
scp your-local/firebase-service-account.json nusantara@server:/home/nusantara/nusantara-app/backend/config/
chmod 600 config/firebase-service-account.json

# Setup environment
cp .env.example .env
nano .env # Edit with production values

# Run migrations
npm run migrate

# Test run
node server.js
# Ctrl+C to stop
```

### Step 4: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.production
nano .env.production # Edit with production values

# Build
npm run build

# Deploy to web root
sudo mkdir -p /var/www/nusantara/frontend
sudo cp -r build/* /var/www/nusantara/frontend/
sudo chown -R www-data:www-data /var/www/nusantara
```

### Step 5: Configure Nginx

```bash
# Create site config
sudo nano /etc/nginx/sites-available/nusantara
# Paste Nginx configuration from ADMIN_GUIDE

# Enable site
sudo ln -s /etc/nginx/sites-available/nusantara /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### Step 6: Setup SSL

```bash
# Get certificate
sudo certbot --nginx -d nusantaragroup.co -d www.nusantaragroup.co

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Start Backend with PM2

```bash
cd /home/nusantara/nusantara-app/backend

# Create PM2 config
nano ecosystem.config.js
# Paste PM2 configuration

# Start app
pm2 start ecosystem.config.js

# Setup startup
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs
```

### Step 8: Setup Firewall

```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Step 9: Setup Monitoring

```bash
# Install monitoring tools
cd /home/nusantara/nusantara-app/backend
npm install express-status-monitor winston

# Restart PM2
pm2 restart all
```

### Step 10: Setup Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-nusantara.sh
# Paste backup script

# Make executable
sudo chmod +x /usr/local/bin/backup-nusantara.sh

# Setup cron
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-nusantara.sh
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Backend health
curl https://nusantaragroup.co/api/health

# Expected: {"status":"healthy",...}

# FCM status
curl -X GET https://nusantaragroup.co/api/fcm/status \
  -H "Authorization: Bearer TOKEN"

# Expected: {"success":true,"fcmStatus":{"initialized":true},...}
```

### 2. Frontend Tests

- [ ] Website loads on HTTPS
- [ ] Service worker registers
- [ ] Manifest loads
- [ ] Icons display
- [ ] Login works
- [ ] Dashboard accessible
- [ ] No console errors

**Browser console:**
```javascript
// Check service worker
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log('SW registered:', regs.length));

// Check notification permission
console.log('Notification:', Notification.permission);
```

### 3. Notification Tests

**Test flow:**
1. Login to application
2. Allow notification permission
3. Send test notification via API
4. Verify notification received
5. Click notification
6. Verify navigation works

**API test:**
```bash
curl -X POST https://nusantaragroup.co/api/fcm/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Deep Link Tests

**Test URLs:**
```
https://nusantaragroup.co/?deeplink=app://dashboard
https://nusantaragroup.co/?deeplink=app://attendance/leave-request?id=123
```

- [ ] Deep links open correct pages
- [ ] Authentication required for protected routes
- [ ] Post-login redirect works

### 5. Performance Tests

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test backend
ab -n 1000 -c 10 https://nusantaragroup.co/api/health

# Check PM2
pm2 monit
```

**Expected metrics:**
- Response time: < 200ms
- Throughput: > 100 req/s
- CPU usage: < 80%
- Memory usage: < 500MB

### 6. Security Tests

```bash
# Check SSL
curl -I https://nusantaragroup.co

# Expected headers:
# strict-transport-security
# x-content-type-options
# x-frame-options

# Test rate limiting
for i in {1..110}; do 
  curl https://nusantaragroup.co/api/fcm/test
done

# Should get 429 after 100 requests
```

---

## Rollback Plan

### If Deployment Fails

**1. Stop new version:**
```bash
pm2 stop all
```

**2. Restore previous version:**
```bash
cd /home/nusantara/nusantara-app
git checkout previous-tag
cd backend && npm install
pm2 restart all
```

**3. Restore database (if needed):**
```bash
pg_restore -U nusantara_user -d nusantara_db backup.sql
```

**4. Revert Nginx config:**
```bash
sudo cp /etc/nginx/sites-available/nusantara.backup /etc/nginx/sites-available/nusantara
sudo nginx -t && sudo systemctl reload nginx
```

---

## Monitoring & Maintenance

### Daily Checks

- [ ] PM2 status: `pm2 status`
- [ ] Server resources: `htop`
- [ ] Disk space: `df -h`
- [ ] Error logs: `pm2 logs --err --lines 50`
- [ ] Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Weekly Checks

- [ ] Database size: `SELECT pg_size_pretty(pg_database_size('nusantara_db'));`
- [ ] Token cleanup: Run cleanup SQL
- [ ] Backup verification
- [ ] SSL certificate expiry: `sudo certbot certificates`
- [ ] System updates: `sudo apt update && sudo apt list --upgradable`

### Monthly Checks

- [ ] Security patches
- [ ] Database optimization: `VACUUM ANALYZE;`
- [ ] Log rotation verification
- [ ] Backup restoration test
- [ ] Performance review

---

## Troubleshooting Guide

### Issue: Backend Won't Start

**Check:**
```bash
pm2 logs --err --lines 100
```

**Common causes:**
- Database connection failed
- FCM config missing
- Port already in use
- Environment variables missing

**Fix:**
```bash
# Check database
psql -U nusantara_user -d nusantara_db -c "SELECT 1"

# Check FCM file
ls -la backend/config/firebase-service-account.json

# Check port
sudo lsof -i :5000

# Restart
pm2 restart all
```

### Issue: Notifications Not Working

**Check:**
1. FCM status: `curl https://nusantaragroup.co/api/fcm/status`
2. Service worker: Browser DevTools → Application → Service Workers
3. Backend logs: `pm2 logs --lines 100`

**Fix:**
- Re-register service worker
- Check Firebase console
- Verify tokens in database
- Test send via API

### Issue: High Memory Usage

**Check:**
```bash
pm2 monit
free -h
```

**Fix:**
```bash
# Restart PM2
pm2 restart all

# Clean up old tokens
psql -U nusantara_user -d nusantara_db -c "DELETE FROM notification_tokens WHERE last_used_at < NOW() - INTERVAL '90 days';"

# Optimize database
psql -U nusantara_user -d nusantara_db -c "VACUUM ANALYZE;"
```

---

## Emergency Contacts

**On-Call Team:**
- Primary: +62 xxx xxxx xxxx
- Secondary: +62 xxx xxxx xxxx
- Email: oncall@nusantaragroup.co

**External Support:**
- Firebase Support: https://firebase.google.com/support
- DigitalOcean: https://www.digitalocean.com/support

---

## Success Criteria

Deployment is successful when:

- [x] Application loads over HTTPS
- [x] Service worker registers
- [x] Notifications can be sent and received
- [x] Deep links work correctly
- [x] Action buttons function properly
- [x] Database queries < 100ms
- [x] API response time < 200ms
- [x] No errors in logs
- [x] SSL certificate valid
- [x] Backups running
- [x] Monitoring active

---

**Deployment Date:** __________  
**Deployed By:** __________  
**Version:** __________  
**Sign-off:** __________

---

**Document Version:** 1.0.0  
**Last Updated:** October 19, 2024
