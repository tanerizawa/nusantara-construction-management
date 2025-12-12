# 🚀 Production Deployment Guide

**Tanggal:** 12 November 2025
**Versi:** 1.0

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [File Structure](#file-structure)
4. [Quick Start](#quick-start)
5. [Manual Deployment](#manual-deployment)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Rollback](#rollback)
9. [Maintenance](#maintenance)

---

## 🎯 Overview

Production setup menggunakan:
- **Frontend:** Nginx serving static built files (bukan webpack-dev-server)
- **Backend:** PM2 cluster mode untuk load balancing
- **Database:** PostgreSQL dengan optimized settings
- **Resource limits:** CPU dan RAM limits untuk stability

### Resource Comparison

| Mode | Frontend RAM | Frontend CPU | Backend RAM | Backend CPU | Total |
|------|--------------|--------------|-------------|-------------|-------|
| **Development** | 300-500MB | 15-30% | 150-250MB | 5-10% | ~650-750MB |
| **Production** | 15-20MB | 1-2% | 200-300MB | 5-8% | ~220-320MB |
| **Saving** | **95%** | **90%** | 20% | 30% | **65%** |

---

## ✅ Prerequisites

### System Requirements
- Docker 20.10+
- Docker Compose 2.0+
- 1GB+ available RAM
- 5GB+ available disk space
- Linux/Unix-based OS

### Check Installation
```bash
docker --version
docker-compose --version
```

---

## 📁 File Structure

```
APP-YK/
├── docker-compose.yml              # Development compose
├── docker-compose.prod.yml         # Production compose ✅
├── .env.production                 # Production environment variables
├── deploy-production.sh            # Automated deployment script ✅
├── rollback-to-dev.sh             # Rollback script ✅
├── Dockerfile.backend.prod        # Backend production Dockerfile ✅
├── frontend/
│   ├── Dockerfile.prod            # Frontend production Dockerfile ✅
│   ├── nginx.conf                 # Nginx configuration ✅
│   └── ...
└── backend/
    ├── ecosystem.config.js        # PM2 configuration ✅
    └── ...
```

---

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
cd /root/APP-YK
./deploy-production.sh
```

Script akan:
1. ✅ Check prerequisites
2. ✅ Stop development services
3. ✅ Build production images
4. ✅ Start production services
5. ✅ Verify health
6. ✅ Show resource usage

### Option 2: One-liner

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📖 Manual Deployment

### Step 1: Stop Development Services

```bash
# Stop current development containers
docker-compose down

# Verify stopped
docker ps
```

### Step 2: Build Production Images

```bash
# Build all production images
docker-compose -f docker-compose.prod.yml build --no-cache

# Build specific service
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml build backend
```

### Step 3: Start Production Services

```bash
# Start all services in detached mode
docker-compose -f docker-compose.prod.yml up -d

# Start specific service
docker-compose -f docker-compose.prod.yml up -d frontend
```

### Step 4: Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl http://localhost/health          # Frontend health
curl http://localhost:5000/health     # Backend health
```

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100

# With timestamps
docker-compose -f docker-compose.prod.yml logs -f --timestamps
```

### Resource Usage

```bash
# Real-time resource monitoring
docker stats

# One-time snapshot
docker stats --no-stream

# Formatted output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
```

### Container Health

```bash
# Check health status
docker inspect nusantara-frontend-prod | grep -A 10 Health
docker inspect nusantara-backend-prod | grep -A 10 Health

# Quick status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### PM2 Backend Monitoring

```bash
# Access backend container
docker exec -it nusantara-backend-prod sh

# Inside container, view PM2 status
pm2 status
pm2 logs
pm2 monit

# Exit container
exit
```

---

## 🛠️ Management Commands

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend
```

### Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml stop

# Stop specific service
docker-compose -f docker-compose.prod.yml stop frontend
```

### Remove Services

```bash
# Stop and remove containers (keeps volumes)
docker-compose -f docker-compose.prod.yml down

# Stop and remove containers + volumes (⚠️ deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or rebuild specific service
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

---

## 🐛 Troubleshooting

### Issue 1: Frontend Not Accessible

**Symptoms:** Can't access http://localhost

**Solutions:**
```bash
# Check if container is running
docker ps | grep frontend

# Check container logs
docker-compose -f docker-compose.prod.yml logs frontend

# Check if port 80 is available
sudo netstat -tulpn | grep :80

# Restart frontend
docker-compose -f docker-compose.prod.yml restart frontend
```

### Issue 2: Backend Not Responding

**Symptoms:** API calls fail, 502 errors

**Solutions:**
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check database connection
docker exec -it nusantara-postgres-prod psql -U admin -d nusantara_construction

# Check PM2 status
docker exec -it nusantara-backend-prod pm2 status

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Issue 3: High Memory Usage

**Symptoms:** Server slow, OOM errors

**Solutions:**
```bash
# Check resource usage
docker stats

# Check resource limits
docker inspect nusantara-backend-prod | grep -A 20 Resources

# Restart services to free memory
docker-compose -f docker-compose.prod.yml restart

# If needed, clear unused resources
docker system prune -a
```

### Issue 4: Database Connection Errors

**Symptoms:** Backend can't connect to database

**Solutions:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs nusantara-postgres-prod

# Test database connection
docker exec -it nusantara-postgres-prod pg_isready -U admin

# Check database is accessible from backend
docker exec -it nusantara-backend-prod ping postgres
```

### Issue 5: Build Failures

**Symptoms:** Docker build fails

**Solutions:**
```bash
# Clean Docker cache
docker builder prune -a

# Remove old images
docker image prune -a

# Rebuild with no cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Check disk space
df -h

# Clean up old containers/images
docker system df
docker system prune -a
```

---

## 🔄 Rollback to Development

### Option 1: Automated Rollback

```bash
./rollback-to-dev.sh
```

### Option 2: Manual Rollback

```bash
# Stop production services
docker-compose -f docker-compose.prod.yml down

# Start development services
docker-compose up -d

# Verify
docker ps
```

### Emergency Rollback

```bash
# Stop everything
docker stop $(docker ps -aq)

# Start development
docker-compose up -d
```

---

## 🔧 Maintenance

### Regular Tasks

#### Daily
- Check logs for errors: `docker-compose -f docker-compose.prod.yml logs --tail=100`
- Monitor resource usage: `docker stats --no-stream`

#### Weekly
- Backup database: 
  ```bash
  docker exec nusantara-postgres-prod pg_dump -U admin nusantara_construction > backup_$(date +%Y%m%d).sql
  ```
- Review logs for patterns
- Check disk space: `df -h`

#### Monthly
- Update dependencies:
  ```bash
  cd frontend && npm update
  cd ../backend && npm update
  ```
- Rebuild images: `docker-compose -f docker-compose.prod.yml build --no-cache`
- Review and clean old images: `docker image prune -a`

### Database Backup

```bash
# Create backup
docker exec nusantara-postgres-prod pg_dump -U admin nusantara_construction > backup.sql

# Compress backup
gzip backup.sql

# Restore from backup
gunzip backup.sql.gz
docker exec -i nusantara-postgres-prod psql -U admin nusantara_construction < backup.sql
```

### Log Rotation

```bash
# Clear logs older than 7 days
find /root/APP-YK/backend/logs -name "*.log" -mtime +7 -delete

# Or configure Docker log rotation in daemon.json
```

---

## 📈 Performance Tuning

### Nginx Optimization

Edit `frontend/nginx.conf`:
```nginx
# Increase worker connections
events {
    worker_connections 2048;
}

# Enable HTTP/2
listen 443 ssl http2;

# Increase buffer sizes
client_body_buffer_size 16K;
client_header_buffer_size 1k;
client_max_body_size 20m;
large_client_header_buffers 4 16k;
```

### PM2 Optimization

Edit `backend/ecosystem.config.js`:
```javascript
// Adjust instances based on CPU cores
instances: 2, // or 4, 'max'

// Increase memory limit
max_memory_restart: '1G',
```

### PostgreSQL Optimization

Add to docker-compose.prod.yml:
```yaml
command:
  - "postgres"
  - "-c"
  - "shared_buffers=256MB"
  - "-c"
  - "effective_cache_size=1GB"
  - "-c"
  - "max_connections=100"
```

---

## 🔐 Security Checklist

- [ ] Change default passwords in `.env.production`
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (SSL certificates)
- [ ] Configure firewall (ufw/iptables)
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Monitor failed login attempts
- [ ] Set up log monitoring/alerts

---

## 📞 Support

### Quick Help

```bash
# View deployment guide
cat PRODUCTION_DEPLOYMENT_GUIDE.md

# View analysis
cat PRODUCTION_ANALYSIS_AND_PLAN.md

# Check running services
docker-compose -f docker-compose.prod.yml ps

# Access container shell
docker exec -it nusantara-backend-prod sh
docker exec -it nusantara-frontend-prod sh
```

### Useful Links
- Docker Documentation: https://docs.docker.com
- Nginx Documentation: https://nginx.org/en/docs/
- PM2 Documentation: https://pm2.keymetrics.io/docs/

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Frontend accessible at http://localhost
- [ ] Backend API responding at http://localhost:5000
- [ ] Database connection working
- [ ] Login functionality working
- [ ] Resource usage < 500MB RAM
- [ ] CPU usage < 20%
- [ ] Page load time < 2 seconds
- [ ] No errors in logs
- [ ] Health checks passing
- [ ] All features functional

---

**🎉 Deployment Complete!**

Monitor for 24 hours and check logs regularly.
Keep development mode available for emergency rollback.
