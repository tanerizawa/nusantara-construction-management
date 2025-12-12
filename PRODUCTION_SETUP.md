# Production Setup - Nusantara Group Construction Management

## Architecture

```
Internet (HTTPS Port 443)
    ↓
Nginx (Host - Reverse Proxy)
    ↓
    ├──→ Frontend Container (Port 8090) - React + Nginx
    ├──→ Backend Container (Port 5000) - Node.js + Express
    └──→ PostgreSQL Container (Port 5432) - Database
```

## Components

### 1. Docker Containers
- **Frontend** (`nusantara-frontend-prod`): React production build served by Nginx
  - Internal: Port 80 (nginx)
  - External: Port 8090
  - Build: Multi-stage Docker build (Node.js → Nginx)
  
- **Backend** (`nusantara-backend-prod`): Node.js Express API
  - Port: 5000
  - Environment: Production with PM2
  
- **Database** (`nusantara-postgres-prod`): PostgreSQL 15
  - Port: 5432
  - Data: Persistent volume `postgres_data`

### 2. Nginx Reverse Proxy (Host)
- **Purpose**: SSL termination, rate limiting, caching
- **Config**: `/etc/nginx/sites-available/nusantaragroup.co`
- **Routes**:
  - `/` → Frontend container (port 8090)
  - `/api/*` → Backend container (port 5000)
  - `/uploads/*` → Backend container (port 5000)

## Best Practices Implemented

### ✅ Resource Efficiency
1. **Single Nginx instance**: Host-level reverse proxy (no additional container overhead)
2. **Multi-stage builds**: Frontend build dependencies removed from production image
3. **Connection pooling**: Nginx keepalive to Docker containers
4. **Resource limits**: CPU and memory limits in docker-compose.prod.yml

### ✅ Security
1. **SSL/TLS**: Let's Encrypt certificates with modern cipher suites
2. **Security headers**: HSTS, X-Frame-Options, CSP, etc.
3. **Rate limiting**: API and general request limits
4. **CORS**: Strict origin policies

### ✅ Performance
1. **Gzip compression**: Text content compressed
2. **Static file caching**: 1-year cache for immutable assets
3. **HTTP/2**: Enabled for multiplexing
4. **OCSP stapling**: Faster SSL handshakes (when supported)

### ✅ Reliability
1. **Health checks**: All containers have health monitoring
2. **Auto-restart**: Containers restart on failure
3. **Upstream failover**: Max fails and timeout configured
4. **Graceful degradation**: Backend failures handled properly

## Management Commands

### Docker Containers

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# Stop all services
docker compose -f docker-compose.prod.yml down

# Rebuild specific service
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml up -d frontend

# View logs
docker compose -f docker-compose.prod.yml logs -f
docker logs nusantara-frontend-prod --tail 50
docker logs nusantara-backend-prod --tail 50

# Check status
docker ps | grep nusantara
docker stats --no-stream | grep nusantara
```

### Nginx

```bash
# Test configuration
sudo nginx -t

# Reload (without downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/nusantara_access.log
sudo tail -f /var/log/nginx/nusantara_error.log

# Check status
sudo systemctl status nginx
```

### Database Backup

```bash
# Backup database
docker exec nusantara-postgres-prod pg_dump -U hadez nusantara_construction > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker exec -i nusantara-postgres-prod psql -U hadez nusantara_construction < backup_20251112.sql
```

## Deployment Workflow

### Initial Setup
```bash
# 1. Clone repository
git clone <repo-url> /root/APP-YK
cd /root/APP-YK

# 2. Configure environment
cp .env.example .env
# Edit .env with production values

# 3. Build containers
docker compose -f docker-compose.prod.yml build

# 4. Start services
docker compose -f docker-compose.prod.yml up -d

# 5. Setup Nginx
sudo cp nginx-production.conf /etc/nginx/sites-available/nusantaragroup.co
sudo ln -sf /etc/nginx/sites-available/nusantaragroup.co /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Update Deployment
```bash
# 1. Pull latest code
cd /root/APP-YK
git pull origin main

# 2. Rebuild changed services
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml build --no-cache backend

# 3. Restart services
docker compose -f docker-compose.prod.yml up -d

# 4. Verify
docker ps | grep nusantara
curl -s https://nusantaragroup.co/health
```

## Monitoring

### Container Health
```bash
# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}"

# Resource usage
docker stats --no-stream

# Disk usage
docker system df
```

### Application Logs
```bash
# Real-time monitoring
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Error checking
docker logs nusantara-backend-prod 2>&1 | grep -i error
docker logs nusantara-frontend-prod 2>&1 | grep -i error
```

### Nginx Monitoring
```bash
# Access logs (traffic patterns)
sudo tail -f /var/log/nginx/nusantara_access.log

# Error logs
sudo tail -f /var/log/nginx/nusantara_error.log

# Connection status
sudo netstat -tulpn | grep nginx
```

## Troubleshooting

### 502 Bad Gateway
```bash
# Check if backend is running
docker ps | grep backend

# Check backend logs
docker logs nusantara-backend-prod --tail 50

# Test backend directly
curl http://localhost:5000/health
```

### Container Not Starting
```bash
# Check logs
docker logs <container-name>

# Check resource usage
docker stats --no-stream
free -h

# Rebuild if needed
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### SSL Certificate Issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test SSL configuration
curl -vI https://nusantaragroup.co 2>&1 | grep SSL
```

## Resource Requirements

### Minimum (Development)
- CPU: 2 cores
- RAM: 2 GB
- Disk: 10 GB

### Recommended (Production)
- CPU: 4 cores
- RAM: 4 GB
- Disk: 20 GB SSD

### Current Limits (docker-compose.prod.yml)
- PostgreSQL: 512M RAM, 1 CPU
- Backend: 512M RAM, 1 CPU
- Frontend: 128M RAM, 0.5 CPU
- **Total**: ~1.2 GB RAM, 2.5 CPU

## URLs

- **Production**: https://nusantaragroup.co
- **API**: https://nusantaragroup.co/api
- **Health Check**: https://nusantaragroup.co/health

## Files Structure

```
/root/APP-YK/
├── docker-compose.prod.yml      # Production compose file
├── nginx-production.conf        # Nginx config template
├── frontend/
│   ├── Dockerfile.prod          # Frontend production build
│   └── nginx.conf              # Frontend nginx config
├── backend/
│   └── Dockerfile.backend.prod  # Backend production build
└── uploads/                     # Persistent upload storage

/etc/nginx/
└── sites-available/
    └── nusantaragroup.co        # Active nginx config

/var/log/nginx/
├── nusantara_access.log
└── nusantara_error.log
```

## Security Checklist

- [x] SSL/TLS enabled (Let's Encrypt)
- [x] Security headers configured
- [x] Rate limiting enabled
- [x] CORS policies strict
- [x] Database credentials secured
- [x] JWT secrets in environment
- [x] File upload size limits
- [x] No default passwords
- [x] Firewall rules (Docker handles)
- [x] Regular backups

## Performance Optimization

- [x] Gzip compression
- [x] Static file caching
- [x] Connection keepalive
- [x] HTTP/2 enabled
- [x] Nginx upstream pooling
- [x] Resource limits
- [x] Production build (minified)
- [x] No source maps in production

---

**Last Updated**: November 12, 2025  
**Maintained By**: Infrastructure Team
