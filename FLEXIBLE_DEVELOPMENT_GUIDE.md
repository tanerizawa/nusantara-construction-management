# 🚀 Nusantara Construction - Flexible Development Guide

## Overview
Sekarang Anda memiliki 3 mode deployment yang fleksibel untuk kebutuhan development dan debugging yang berbeda.

## Mode yang Tersedia

### 1. 🔧 Development Mode (Full Debug)
```bash
./start-flexible.sh
# Pilih option 1

# Atau manual:
docker-compose -f docker-compose.development.yml up --build
```

**Features:**
- ✅ Hot reload untuk frontend & backend
- ✅ Source maps enabled
- ✅ Debug logs lengkap
- ✅ Nodemon untuk backend
- ✅ React Fast Refresh
- 🌐 Access: http://localhost:3001

**Use Case:** Development lokal dengan perubahan code real-time

---

### 2. 🎯 Staging Mode (Production Build + Debug)
```bash
./start-flexible.sh
# Pilih option 2

# Atau manual:
docker-compose -f docker-compose.staging.yml up --build
```

**Features:**
- ✅ Production build (optimized)
- ✅ Source maps untuk debugging
- ✅ Enhanced logging
- ✅ Domain access ready
- 🌐 Access: https://nusantaragroup.co (via Apache)

**Use Case:** Testing dengan build production tapi masih bisa debug via browser DevTools

---

### 3. 🏭 Production Mode (Full Optimized)
```bash
./start-flexible.sh
# Pilih option 3

# Atau manual:
docker-compose -f docker-compose.production.yml up --build
```

**Features:**
- ✅ Full optimization
- ✅ No debug overhead
- ✅ Minimal logging
- ✅ High performance
- 🌐 Access: https://nusantaragroup.co

**Use Case:** Production deployment final

---

## Apache Configuration Switching

Untuk switch antara staging dan production pada domain:

```bash
./switch-apache-mode.sh
```

**Options:**
1. **Production Mode**: Proxy ke port 8081 (frontend) & 5001 (backend)
2. **Staging Mode**: Proxy ke port 8080 (frontend) & 5000 (backend)
3. **Show Config**: Lihat konfigurasi saat ini

---

## Quick Commands Reference

```bash
# Start any mode interactively
./start-flexible.sh

# Switch Apache proxy target
./switch-apache-mode.sh

# Development mode direct
docker-compose -f docker-compose.development.yml up --build

# Staging mode direct  
docker-compose -f docker-compose.staging.yml up --build

# Production mode direct
docker-compose -f docker-compose.production.yml up --build

# Stop all
docker-compose down
```

---

## Database Connection

Semua mode menggunakan database yang sama:
- **Host**: yk-postgres-dev
- **Database**: nusantara_construction
- **Network**: app-yk_yk-dev-network

---

## Port Mapping Summary

| Mode | Frontend Port | Backend Port | Access Method |
|------|---------------|--------------|---------------|
| Development | 3001 | 5001 | Direct localhost |
| Staging | 8080 | 5000 | Via Apache domain |
| Production | 8081 | 5001 | Via Apache domain |

---

## Debugging Tips

### Development Mode
- Full console logs available
- Network tab shows unminified requests
- React DevTools works perfectly
- Hot reload untuk instant changes

### Staging Mode  
- Use browser DevTools dengan source maps
- Production-like performance
- Debug via domain (real environment)
- Enhanced backend logging

### Production Mode
- Minimal logging for performance
- Use Apache logs for troubleshooting
- Monitor via health checks

---

## Common Workflow

1. **Active Development**: Use Development mode
2. **Pre-deployment Testing**: Use Staging mode dengan Apache
3. **Final Deployment**: Use Production mode

**Perfect untuk debugging di cloud server!** 🎯