# 🐳 Docker Setup & Testing Guide

Complete guide untuk menjalankan **Nusantara YK Construction Management** menggunakan Docker, termasuk Node.js, migrations, dan testing.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Commands](#docker-commands)
- [Running Migrations](#running-migrations)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Sistem yang dibutuhkan:
- **Docker** 20.10+ (installed)
- **Docker Compose** 2.0+ (installed)
- **Git** (for cloning repository)
- **8GB RAM minimum** (recommended)
- **10GB disk space** (minimum)

### Check instalasi:
```bash
docker --version
# Output: Docker version 20.10.x or higher

docker-compose --version
# Output: Docker Compose version 2.x.x or higher
```

---

## 🚀 Quick Start

### Method 1: Using Helper Script (RECOMMENDED)

```bash
# 1. Make script executable
chmod +x scripts/docker-manager.sh

# 2. Run interactive menu
./scripts/docker-manager.sh

# 3. Or use direct commands:
./scripts/docker-manager.sh setup     # Initial setup (build + migrate)
./scripts/docker-manager.sh start     # Start services
./scripts/docker-manager.sh logs      # View logs
./scripts/docker-manager.sh stop      # Stop services
```

### Method 2: Manual Docker Compose

```bash
# 1. Build containers
docker-compose -f docker-compose.complete.yml build

# 2. Start services
docker-compose -f docker-compose.complete.yml up -d postgres backend frontend

# 3. Run migrations
docker-compose -f docker-compose.complete.yml --profile tools run --rm migrations

# 4. Check status
docker-compose -f docker-compose.complete.yml ps
```

---

## 🎯 Docker Commands

### Basic Operations

| Command | Description |
|---------|-------------|
| `./scripts/docker-manager.sh start` | Start all services |
| `./scripts/docker-manager.sh stop` | Stop all services |
| `./scripts/docker-manager.sh restart` | Restart all services |
| `./scripts/docker-manager.sh logs` | View logs (all services) |
| `./scripts/docker-manager.sh status` | Show service status |

### Development Operations

| Command | Description |
|---------|-------------|
| `./scripts/docker-manager.sh shell-backend` | Open shell in backend container |
| `./scripts/docker-manager.sh shell-db` | Open PostgreSQL shell |
| `./scripts/docker-manager.sh pgadmin` | Start PgAdmin (DB UI) |
| `./scripts/docker-manager.sh build` | Rebuild all containers |

### Database Operations

| Command | Description |
|---------|-------------|
| `./scripts/docker-manager.sh migrate` | Run database migrations |
| `./scripts/docker-manager.sh seed` | Run database seeders |

### Testing

| Command | Description |
|---------|-------------|
| `./scripts/docker-manager.sh test` | Run API tests |
| `./scripts/docker-manager.sh user-mgmt-test` | Test User Management API |
| `./scripts/docker-manager.sh notifications-test` | Test Notification System |

### Cleanup

| Command | Description |
|---------|-------------|
| `./scripts/docker-manager.sh clean` | Remove containers & volumes |

---

## 📊 Running Migrations

### Automatic (via script):
```bash
./scripts/docker-manager.sh migrate
```

### Manual (via docker-compose):
```bash
docker-compose -f docker-compose.complete.yml --profile tools run --rm migrations
```

### Manual (inside container):
```bash
# 1. Open backend shell
docker exec -it nusantara-backend sh

# 2. Run migrations
npx sequelize-cli db:migrate

# 3. Check migration status
npx sequelize-cli db:migrate:status

# 4. Exit shell
exit
```

### Migration Files Location:
```
/root/APP-YK/backend/migrations/
├── 20251017_create_notification_tables.js      # Notification system
├── 20251017_add_super_admin_staff_roles.js     # User roles update
└── ... other migrations
```

---

## 🧪 Testing

### 1. API Testing (Inside Container)

```bash
# Run all tests
./scripts/docker-manager.sh test

# Or manually
docker exec -it nusantara-backend npm test
```

### 2. User Management API Testing

```bash
# Via script
./scripts/docker-manager.sh user-mgmt-test

# Or via curl
curl http://localhost:5000/api/users/management/stats
curl http://localhost:5000/api/users/management
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 48,
    "active": 42,
    "inactive": 6,
    "byRole": {
      "super_admin": 1,
      "admin": 6,
      ...
    }
  }
}
```

### 3. Notification System Testing

```bash
# Via script
./scripts/docker-manager.sh notifications-test

# Test notification preferences
curl "http://localhost:5000/api/user-notifications/preferences?userId=U001"

# Test sending notification
curl -X POST http://localhost:5000/api/user-notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "U001",
    "title": "Test Notification",
    "message": "This is a test",
    "type": "info",
    "channels": ["push", "email"]
  }'
```

### 4. Integration Testing (All Services)

```bash
# 1. Ensure all services are running
./scripts/docker-manager.sh status

# Expected output:
# nusantara-postgres   running   0.0.0.0:5432->5432/tcp
# nusantara-backend    running   0.0.0.0:5000->5000/tcp
# nusantara-frontend   running   0.0.0.0:3000->3000/tcp

# 2. Test database connection
docker exec -it nusantara-backend sh -c "
  node -e \"
    const { sequelize } = require('./config/database');
    sequelize.authenticate()
      .then(() => console.log('✅ Database connected'))
      .catch(e => console.log('❌ Database error:', e.message));
  \"
"

# 3. Test API endpoints
curl http://localhost:5000/health
# Expected: {"status":"ok","timestamp":"..."}

# 4. Test frontend
curl http://localhost:3000
# Expected: HTML content

# 5. Test User Management
curl http://localhost:5000/api/users/management/stats

# 6. Test Notifications
curl "http://localhost:5000/api/user-notifications/my?userId=U001"
```

---

## 🔍 Service Details

### Container Names & Ports

| Service | Container Name | Port | Access URL |
|---------|---------------|------|------------|
| PostgreSQL | `nusantara-postgres` | 5432 | `localhost:5432` |
| Backend API | `nusantara-backend` | 5000 | `http://localhost:5000` |
| Frontend | `nusantara-frontend` | 3000 | `http://localhost:3000` |
| PgAdmin | `nusantara-pgadmin` | 5050 | `http://localhost:5050` |

### Database Credentials

```
Host: localhost (or postgres from within Docker network)
Port: 5432
Database: nusantara_construction
Username: admin
Password: admin123
```

### PgAdmin Credentials

```
URL: http://localhost:5050
Email: admin@nusantara.com
Password: admin123
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:5000: bind: address already in use
```

**Solution:**
```bash
# Check what's using the port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.complete.yml
ports:
  - "5001:5000"  # Changed from 5000 to 5001
```

### Issue 2: Container Won't Start

**Error:**
```
Container nusantara-backend exited with code 1
```

**Solution:**
```bash
# Check logs
docker logs nusantara-backend

# Or via script
./scripts/docker-manager.sh logs

# Common fixes:
# 1. Rebuild container
./scripts/docker-manager.sh build

# 2. Remove node_modules volume
docker volume rm app-yk_backend_node_modules

# 3. Restart services
./scripts/docker-manager.sh restart
```

### Issue 3: Database Connection Failed

**Error:**
```
Unable to connect to the database
```

**Solution:**
```bash
# 1. Check if postgres is running
docker ps | grep postgres

# 2. Check postgres logs
docker logs nusantara-postgres

# 3. Test connection manually
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction

# 4. Wait for healthcheck
docker-compose -f docker-compose.complete.yml ps
# Wait until postgres shows "healthy"
```

### Issue 4: Migration Failed

**Error:**
```
ERROR: relation "users" already exists
```

**Solution:**
```bash
# Check migration status
docker exec -it nusantara-backend npx sequelize-cli db:migrate:status

# Undo last migration
docker exec -it nusantara-backend npx sequelize-cli db:migrate:undo

# Or undo all migrations
docker exec -it nusantara-backend npx sequelize-cli db:migrate:undo:all

# Re-run migrations
./scripts/docker-manager.sh migrate
```

### Issue 5: Frontend Won't Build

**Error:**
```
Module not found: Error: Can't resolve 'xyz'
```

**Solution:**
```bash
# 1. Rebuild frontend container
docker-compose -f docker-compose.complete.yml build frontend

# 2. Clear node_modules volume
docker volume rm app-yk_frontend_node_modules

# 3. Restart frontend
docker-compose -f docker-compose.complete.yml restart frontend
```

### Issue 6: Out of Disk Space

**Error:**
```
no space left on device
```

**Solution:**
```bash
# Clean up Docker
docker system prune -a --volumes

# Or use script
./scripts/docker-manager.sh clean

# Check disk usage
docker system df
```

---

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=nusantara_construction
DB_USERNAME=admin
DB_PASSWORD=admin123

# Security
JWT_SECRET=nusantara-jwt-secret-2025

# Server
PORT=5000
NODE_ENV=development

# Firebase (Optional - for push notifications)
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_PROJECT_ID=nusantara-yk-construction

# Email (Optional - for email notifications)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000

# Firebase (Optional - for push notifications)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_PROJECT_ID=nusantara-yk-construction
REACT_APP_FIREBASE_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 🔒 Production Deployment

### Build Production Images

```bash
# Backend
docker build -f backend/Dockerfile.prod -t nusantara-backend:prod .

# Frontend
docker build -f frontend/Dockerfile -t nusantara-frontend:prod ./frontend
```

### Run Production

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Security Checklist

- [ ] Change default database password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up backup strategy
- [ ] Configure log rotation
- [ ] Enable monitoring (Prometheus/Grafana)
- [ ] Set resource limits

---

## 📚 Additional Resources

### Docker Compose Profiles

Profiles allow you to run specific services:

```bash
# Run only tools (migrations, seed, test)
docker-compose -f docker-compose.complete.yml --profile tools up

# Run specific tool
docker-compose -f docker-compose.complete.yml --profile tools run migrations
```

### Available Profiles:
- `tools` - Migrations, seeders, tests, PgAdmin

### Docker Network

All services run on `nusantara-network` bridge network:

```bash
# Inspect network
docker network inspect nusantara-network

# Check connected containers
docker network inspect nusantara-network -f '{{range .Containers}}{{.Name}} {{end}}'
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect app-yk_postgres_data

# Backup volume
docker run --rm -v app-yk_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore volume
docker run --rm -v app-yk_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

---

## 🎯 Quick Reference Commands

```bash
# === DEVELOPMENT ===
./scripts/docker-manager.sh setup          # Initial setup
./scripts/docker-manager.sh start          # Start services
./scripts/docker-manager.sh logs           # View logs
./scripts/docker-manager.sh shell-backend  # Backend shell
./scripts/docker-manager.sh shell-db       # Database shell

# === TESTING ===
./scripts/docker-manager.sh migrate        # Run migrations
./scripts/docker-manager.sh test           # Run tests
./scripts/docker-manager.sh user-mgmt-test # Test User Management
./scripts/docker-manager.sh notifications-test # Test Notifications

# === MAINTENANCE ===
./scripts/docker-manager.sh restart        # Restart services
./scripts/docker-manager.sh build          # Rebuild containers
./scripts/docker-manager.sh clean          # Clean up
./scripts/docker-manager.sh status         # Service status

# === DIRECT DOCKER COMMANDS ===
docker-compose -f docker-compose.complete.yml ps     # Status
docker-compose -f docker-compose.complete.yml logs   # Logs
docker exec -it nusantara-backend sh                 # Backend shell
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction  # DB shell
```

---

## 📞 Support

**Files:**
- Docker Compose: `/root/APP-YK/docker-compose.complete.yml`
- Helper Script: `/root/APP-YK/scripts/docker-manager.sh`
- Backend Dockerfile: `/root/APP-YK/backend/Dockerfile`
- Frontend Dockerfile: `/root/APP-YK/frontend/Dockerfile`

**Logs:**
```bash
# Backend logs
docker logs nusantara-backend

# Database logs
docker logs nusantara-postgres

# All services
docker-compose -f docker-compose.complete.yml logs -f
```

---

**Last Updated:** October 17, 2025  
**Docker Version:** 20.10+  
**Status:** ✅ Production Ready
