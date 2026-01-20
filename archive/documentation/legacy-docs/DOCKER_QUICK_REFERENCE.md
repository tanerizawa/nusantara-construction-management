# Quick Reference: Nusantara Docker Setup

## 🚀 Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📦 Container Services

| Service | Port | Container Name | Status |
|---------|------|----------------|--------|
| Frontend | 3000 | nusantara-frontend | ✅ Running |
| Backend | 5000 | nusantara-backend | ✅ Running |
| PostgreSQL | 5432 | nusantara-postgres | ✅ Running |

## 🔧 Common Commands

### Rebuild Frontend
```bash
docker-compose stop frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Rebuild Backend
```bash
docker-compose stop backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f nusantara-frontend
docker logs -f nusantara-backend
docker logs -f nusantara-postgres
```

### Check Status
```bash
docker ps
docker-compose ps
```

### Access Container Shell
```bash
# Frontend
docker exec -it nusantara-frontend sh

# Backend
docker exec -it nusantara-backend sh

# Database
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Database**: postgresql://admin:admin123@localhost:5432/nusantara_construction

## 🔄 Update Code

### Frontend Changes
Code changes in `./frontend/src` and `./frontend/public` are mounted as read-only volumes. Restart container to see changes:
```bash
docker-compose restart frontend
```

### Backend Changes
Backend code is mounted with hot-reload support. Changes should reflect automatically.

## 🐛 Troubleshooting

### Frontend Won't Start
```bash
# Check logs
docker logs nusantara-frontend --tail 100

# Rebuild
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Backend API Errors
```bash
# Check backend logs
docker logs nusantara-backend --tail 100

# Restart backend
docker-compose restart backend
```

### Database Connection Issues
```bash
# Check database status
docker exec -it nusantara-postgres pg_isready -U admin

# View database logs
docker logs nusantara-postgres --tail 50
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :5432

# Kill process
sudo kill -9 <PID>
```

### Clean Restart
```bash
# Stop all and remove volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q app-yk-*)

# Fresh start
docker-compose up -d --build
```

## 📝 Environment Variables

### Frontend (.env.development)
```env
NODE_ENV=development
REACT_APP_API_URL=/api
GENERATE_SOURCEMAP=false
ESLINT_NO_DEV_ERRORS=true
```

### Backend (.env)
```env
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=nusantara_construction
DB_USERNAME=admin
DB_PASSWORD=admin123
JWT_SECRET=nusantara-jwt-secret-2025
PORT=5000
```

## 🔐 Security Notes

- **Production**: Ubah credentials database di `docker-compose.yml`
- **JWT Secret**: Ubah `JWT_SECRET` untuk production
- **HTTPS**: Setup reverse proxy (nginx) untuk SSL/TLS
- **Firewall**: Tutup port 5432 (PostgreSQL) di production

## 📊 Monitoring

### Resource Usage
```bash
docker stats
```

### Disk Usage
```bash
docker system df
```

### Clean Up
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

## 🎯 Performance Tips

1. **Development**: Use volume mounts for hot reload
2. **Production**: Use multi-stage builds for smaller images
3. **Database**: Regular backups and monitoring
4. **Logs**: Rotate logs to prevent disk fill
5. **Resources**: Set memory/CPU limits in docker-compose.yml

## 🔗 Useful Links

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- React Scripts: https://create-react-app.dev/
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/

---
**Last Updated:** 15 Oktober 2025