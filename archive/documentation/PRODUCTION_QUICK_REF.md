# ⚡ Production Mode - Quick Reference

## 🚀 DEPLOYMENT

```bash
# Automated (Recommended)
./deploy-production.sh

# Manual
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔄 ROLLBACK

```bash
# Automated
./rollback-to-dev.sh

# Manual
docker-compose -f docker-compose.prod.yml down
docker-compose up -d
```

## 📊 MONITORING

```bash
# Status
docker-compose -f docker-compose.prod.yml ps

# Logs (all)
docker-compose -f docker-compose.prod.yml logs -f

# Logs (specific)
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend

# Resources
docker stats

# Health checks
curl http://localhost/health
curl http://localhost:5000/health
```

## 🛠️ MANAGEMENT

```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific
docker-compose -f docker-compose.prod.yml restart frontend

# Stop
docker-compose -f docker-compose.prod.yml stop

# Remove (keeps data)
docker-compose -f docker-compose.prod.yml down

# Remove (deletes data!)
docker-compose -f docker-compose.prod.yml down -v
```

## 🔧 TROUBLESHOOTING

```bash
# Rebuild everything
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Clean Docker cache
docker system prune -a

# Check disk space
df -h

# Database access
docker exec -it nusantara-postgres-prod psql -U admin -d nusantara_construction

# Backend shell
docker exec -it nusantara-backend-prod sh

# PM2 status (inside backend)
docker exec -it nusantara-backend-prod pm2 status
```

## 💾 BACKUP

```bash
# Create backup
docker exec nusantara-postgres-prod pg_dump -U admin nusantara_construction > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_*.sql

# Restore
gunzip backup.sql.gz
docker exec -i nusantara-postgres-prod psql -U admin nusantara_construction < backup.sql
```

## 📈 EXPECTED METRICS

```
RAM Usage:    < 700MB  (vs 970MB dev)
CPU Usage:    < 20%    (vs 35% dev)
Load Time:    < 1s     (vs 3-5s dev)
Bundle Size:  ~3MB     (vs 15MB dev)
```

## 🔗 URLs

```
Frontend:     http://localhost
Backend:      http://localhost:5000
Frontend HP:  http://localhost/health
Backend HP:   http://localhost:5000/health
```

## 📚 DOCS

- Full Analysis: `PRODUCTION_ANALYSIS_AND_PLAN.md`
- Deployment Guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Summary: `PRODUCTION_SUMMARY.md`
- This Card: `PRODUCTION_QUICK_REF.md`
