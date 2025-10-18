# 🚀 QUICK REFERENCE GUIDE - Operational Systems

## 📞 Quick Access Commands

### Check System Health
```bash
# Comprehensive health check
curl -X GET "http://localhost:5000/api/monitoring/health" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -m json.tool

# Quick status
curl -X GET "http://localhost:5000/api/monitoring/alerts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Recent Audit Logs
```bash
# Last 10 audit logs
curl -X GET "http://localhost:5000/api/audit/logs?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -m json.tool

# Today's activity
curl -X GET "http://localhost:5000/api/audit/system-activity?days=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Login History
```bash
# Recent logins
curl -X GET "http://localhost:5000/api/security/login-history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Active sessions
curl -X GET "http://localhost:5000/api/security/active-sessions" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Export Reports
```bash
# Export audit logs to CSV
curl -X GET "http://localhost:5000/api/audit/export?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN" > audit_logs.csv

# Export with filters
curl -X GET "http://localhost:5000/api/audit/export?action=UPDATE&entityType=project&days=30" \
  -H "Authorization: Bearer YOUR_TOKEN" > project_updates.csv
```

---

## 🗄️ Database Quick Queries

### Check Audit Log Count
```sql
SELECT COUNT(*) as total_logs FROM audit_logs;
```

### Recent Activity by User
```sql
SELECT 
  user_id, 
  username, 
  action, 
  entity_type,
  created_at
FROM audit_logs
WHERE user_id = 'USR-IT-HADEZ-001'
ORDER BY created_at DESC
LIMIT 10;
```

### Failed Operations
```sql
SELECT 
  action,
  entity_type,
  COUNT(*) as failures
FROM audit_logs
WHERE status_code >= 400
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY action, entity_type
ORDER BY failures DESC;
```

### Login Success Rate
```sql
SELECT 
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE success = true) / COUNT(*), 2) as success_rate
FROM login_history
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
```

---

## 🔧 Maintenance Commands

### Restart Backend
```bash
docker restart nusantara-backend
docker logs -f --tail=50 nusantara-backend
```

### Check Database Connections
```bash
docker exec -it nusantara-postgres psql -U nusantara_user -d nusantara_db \
  -c "SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'nusantara_db';"
```

### Cleanup Old Audit Logs
```bash
# Delete logs older than 1 year
curl -X DELETE "http://localhost:5000/api/audit/cleanup?days=365" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Vacuum Database
```bash
docker exec -it nusantara-postgres psql -U nusantara_user -d nusantara_db \
  -c "VACUUM ANALYZE audit_logs;"
```

---

## 📊 Monitoring Shortcuts

### CPU Usage
```bash
curl -s "http://localhost:5000/api/monitoring/cpu" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'CPU: {data[\"data\"][\"overall\"]}%')"
```

### Memory Usage
```bash
curl -s "http://localhost:5000/api/monitoring/memory" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Memory: {data[\"data\"][\"percentUsed\"]}%')"
```

### Disk Usage
```bash
curl -s "http://localhost:5000/api/monitoring/disk" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Disk: {data[\"data\"][\"percentUsed\"]}%')"
```

---

## 🔐 Security Checks

### Suspicious Activity Detection
```sql
-- Multiple failed logins from same IP
SELECT 
  ip_address,
  COUNT(*) as failed_attempts,
  MAX(created_at) as last_attempt
FROM login_history
WHERE success = false
  AND created_at >= NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) >= 3;
```

### Recent Deletions
```sql
-- Track all deletions in last 24 hours
SELECT 
  user_id,
  username,
  entity_type,
  entity_name,
  created_at
FROM audit_logs
WHERE action = 'DELETE'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Active Sessions by User
```sql
SELECT 
  user_id,
  ip_address,
  user_agent,
  created_at,
  last_active
FROM active_sessions
ORDER BY last_active DESC;
```

---

## 🛠️ Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
docker ps | grep nusantara-backend

# Check logs
docker logs --tail=100 nusantara-backend

# Restart if needed
docker restart nusantara-backend
```

### High Memory Usage
```bash
# Check memory details
curl "http://localhost:5000/api/monitoring/memory" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check Node.js process memory
docker exec nusantara-backend ps aux | grep node
```

### Slow Queries
```sql
-- Check slow queries
SELECT
  calls,
  total_exec_time / calls as avg_time_ms,
  query
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY avg_time_ms DESC
LIMIT 10;
```

### Database Connection Issues
```bash
# Check PostgreSQL status
docker exec nusantara-postgres pg_isready

# Check connection limit
docker exec -it nusantara-postgres psql -U nusantara_user -d nusantara_db \
  -c "SHOW max_connections;"
```

---

## 📈 Performance Monitoring

### API Response Time Trends
```bash
# Last hour's API performance
curl "http://localhost:5000/api/monitoring/api-performance?minutes=60" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -m json.tool
```

### Database Performance
```sql
-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index Usage
```sql
-- Check if indexes are being used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 📝 Daily Checklist

### Morning Check (5 minutes)
- [ ] Check system health: `/api/monitoring/health`
- [ ] Review active alerts: `/api/monitoring/alerts`
- [ ] Check failed logins: `login_history` with `success=false`
- [ ] Review yesterday's audit summary: `/api/audit/system-activity?days=1`

### Weekly Check (15 minutes)
- [ ] Review disk usage trends
- [ ] Check database size growth
- [ ] Review audit logs for anomalies
- [ ] Check API performance metrics
- [ ] Verify backup completion (when implemented)

### Monthly Check (30 minutes)
- [ ] Run cleanup: `/api/audit/cleanup?days=365`
- [ ] Vacuum database tables
- [ ] Review index usage and optimize
- [ ] Export monthly audit report
- [ ] Update documentation if needed

---

## 🚨 Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU Usage | >70% | >90% | Scale up or optimize |
| Memory Usage | >80% | >95% | Restart or add RAM |
| Disk Usage | >80% | >95% | Clean up or expand |
| Response Time | >500ms | >2s | Optimize queries |
| Failed Logins | >5/hour | >20/hour | Security review |
| Database Connections | >15/20 | >18/20 | Increase pool size |

---

## 📧 Contact Information

**System Administrator**: hadez  
**Database**: PostgreSQL 15 on nusantara-postgres  
**Backend**: Node.js 20.19.5 on nusantara-backend  
**Documentation**: `/root/APP-YK/*.md`

---

## 🔗 Useful Links

- **Health Dashboard**: `http://localhost:5000/api/monitoring/health`
- **Audit Logs**: `http://localhost:5000/api/audit/logs`
- **Login History**: `http://localhost:5000/api/security/login-history`
- **System Metrics**: `http://localhost:5000/api/monitoring/metrics`

---

**Last Updated**: October 18, 2025  
**Version**: 1.0.0
