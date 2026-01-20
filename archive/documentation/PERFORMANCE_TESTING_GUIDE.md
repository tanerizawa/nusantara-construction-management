# Performance Testing Guide: PWA Push Notifications

## Overview

This guide provides comprehensive performance testing procedures for the PWA push notification system.

---

## Testing Tools

### Required Tools

```bash
# Install testing tools
npm install -g autocannon
npm install -g lighthouse
npm install -g artillery
sudo apt install apache2-utils # Apache Bench
```

### Browser Tools

- Chrome DevTools (Performance, Network, Application)
- Lighthouse (Built into Chrome)
- Web Vitals Extension

---

## 1. Backend API Performance

### Test 1: Health Endpoint

**Tool:** Apache Bench (ab)

```bash
# Test health endpoint
ab -n 1000 -c 10 https://nusantaragroup.co/api/health

# Expected results:
# Time per request: < 50ms (mean)
# Requests per second: > 100
# Failed requests: 0
```

**Pass criteria:**
- ✓ Response time < 100ms (95th percentile)
- ✓ No failed requests
- ✓ No 5xx errors

### Test 2: FCM Token Registration

**Tool:** Autocannon

```bash
# Create test script
cat > test-register-token.js << 'EOF'
const autocannon = require('autocannon');

const test = autocannon({
  url: 'https://nusantaragroup.co/api/fcm/register-token',
  connections: 10,
  duration: 30,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    token: 'test-fcm-token-' + Math.random(),
    deviceType: 'desktop',
    browser: 'Chrome',
    platform: 'Linux'
  })
}, console.log);

autocannon.track(test);
EOF

node test-register-token.js
```

**Expected results:**
```
Stat      Avg     Stdev   Max
Latency   150ms   25ms    300ms
Req/Sec   65      10      100
```

**Pass criteria:**
- ✓ Latency < 200ms (mean)
- ✓ Throughput > 50 req/s
- ✓ Error rate < 1%

### Test 3: Send Notification

```bash
cat > test-send-notification.js << 'EOF'
const autocannon = require('autocannon');

autocannon({
  url: 'https://nusantaragroup.co/api/fcm/test',
  connections: 5,
  duration: 30,
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}, console.log);
EOF

node test-send-notification.js
```

**Expected results:**
```
Stat      Avg     Stdev   Max
Latency   300ms   50ms    600ms
Req/Sec   15      5       25
```

**Pass criteria:**
- ✓ Latency < 500ms (mean)
- ✓ All notifications delivered
- ✓ No FCM errors

### Test 4: Batch Notification Send

**Scenario:** Send notification to 100 users

```bash
# Create test script
cat > test-batch-send.js << 'EOF'
const axios = require('axios');

const BASE_URL = 'https://nusantaragroup.co/api';
const TOKEN = 'YOUR_TOKEN';

async function testBatchSend() {
  const userIds = Array.from({ length: 100 }, (_, i) => i + 1);
  
  const start = Date.now();
  
  try {
    const response = await axios.post(
      `${BASE_URL}/fcm/send-batch`,
      {
        userIds,
        title: 'Performance Test',
        body: 'Testing batch send performance',
        data: { type: 'test' }
      },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    
    const duration = Date.now() - start;
    
    console.log('Batch send completed in', duration, 'ms');
    console.log('Success count:', response.data.successCount);
    console.log('Throughput:', (100 / (duration / 1000)).toFixed(2), 'notifications/sec');
  } catch (error) {
    console.error('Batch send failed:', error.message);
  }
}

testBatchSend();
EOF

node test-batch-send.js
```

**Expected results:**
- Duration: < 5 seconds for 100 users
- Throughput: > 20 notifications/sec
- Success rate: 100%

**Pass criteria:**
- ✓ All notifications sent
- ✓ No timeouts
- ✓ Proper error handling

---

## 2. Database Performance

### Test 1: Query Performance

```sql
-- Enable timing
\timing

-- Test 1: Get active tokens for user
SELECT * FROM notification_tokens 
WHERE user_id = 123 AND is_active = true;
-- Expected: < 10ms

-- Test 2: Get all active tokens
SELECT * FROM notification_tokens 
WHERE is_active = true;
-- Expected: < 50ms

-- Test 3: Insert new token
INSERT INTO notification_tokens (user_id, token, device_type) 
VALUES (123, 'test-token-' || NOW(), 'desktop');
-- Expected: < 20ms

-- Test 4: Complex query with JOIN
SELECT nt.*, u.username, u.email 
FROM notification_tokens nt
JOIN users u ON nt.user_id = u.id
WHERE nt.is_active = true
ORDER BY nt.last_used_at DESC
LIMIT 100;
-- Expected: < 100ms
```

### Test 2: Index Efficiency

```sql
-- Check index usage
EXPLAIN ANALYZE 
SELECT * FROM notification_tokens 
WHERE user_id = 123 AND is_active = true;

-- Should show:
-- Index Scan using idx_notification_tokens_user_id
-- Execution time: < 5ms
```

### Test 3: Connection Pool Stress Test

```javascript
// test-db-pool.js
const { sequelize } = require('./backend/config/database');

async function testConnectionPool() {
  const promises = [];
  const start = Date.now();
  
  // Simulate 100 concurrent queries
  for (let i = 0; i < 100; i++) {
    promises.push(
      sequelize.query('SELECT * FROM notification_tokens LIMIT 10')
    );
  }
  
  await Promise.all(promises);
  
  const duration = Date.now() - start;
  console.log('100 concurrent queries completed in', duration, 'ms');
  console.log('Average per query:', (duration / 100).toFixed(2), 'ms');
}

testConnectionPool()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

**Expected results:**
- Total duration: < 2 seconds
- Average per query: < 20ms
- No connection timeouts

**Pass criteria:**
- ✓ All queries complete successfully
- ✓ No connection pool exhaustion
- ✓ Proper connection recycling

---

## 3. Frontend Performance

### Test 1: Lighthouse Score

```bash
# Run Lighthouse
lighthouse https://nusantaragroup.co \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-report.html
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- PWA: 100

**Pass criteria:**
- ✓ All scores above thresholds
- ✓ Service worker registered
- ✓ Manifest valid
- ✓ HTTPS enabled

### Test 2: Core Web Vitals

**Metrics to measure:**

1. **Largest Contentful Paint (LCP)**
   - Target: < 2.5s
   - Measures: Loading performance

2. **First Input Delay (FID)**
   - Target: < 100ms
   - Measures: Interactivity

3. **Cumulative Layout Shift (CLS)**
   - Target: < 0.1
   - Measures: Visual stability

**Chrome DevTools:**
```
1. Open DevTools (F12)
2. Performance tab
3. Click Record
4. Refresh page
5. Stop recording
6. Check metrics
```

**Pass criteria:**
- ✓ LCP < 2.5s
- ✓ FID < 100ms
- ✓ CLS < 0.1

### Test 3: Service Worker Performance

```javascript
// In browser console
performance.mark('sw-register-start');

navigator.serviceWorker.register('/service-worker.js')
  .then(() => {
    performance.mark('sw-register-end');
    performance.measure('sw-registration', 'sw-register-start', 'sw-register-end');
    
    const measure = performance.getEntriesByName('sw-registration')[0];
    console.log('SW registration time:', measure.duration.toFixed(2), 'ms');
  });
```

**Expected:**
- Registration time: < 100ms
- Activation time: < 50ms

### Test 4: Notification Display Performance

```javascript
// test-notification-performance.js
const { performance } = require('perf_hooks');

function testNotificationDisplay() {
  const iterations = 100;
  const durations = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    // Simulate notification display
    window.dispatchEvent(new CustomEvent('nusantara-notification', {
      detail: {
        title: `Test Notification ${i}`,
        body: 'Performance test',
        type: 'success',
        timestamp: new Date().toISOString()
      }
    }));
    
    const duration = performance.now() - start;
    durations.push(duration);
  }
  
  const avg = durations.reduce((a, b) => a + b) / durations.length;
  const max = Math.max(...durations);
  const min = Math.min(...durations);
  
  console.log('Average:', avg.toFixed(2), 'ms');
  console.log('Max:', max.toFixed(2), 'ms');
  console.log('Min:', min.toFixed(2), 'ms');
}

testNotificationDisplay();
```

**Expected:**
- Average: < 10ms
- Max: < 50ms
- No frame drops

**Pass criteria:**
- ✓ Smooth animations
- ✓ No layout shifts
- ✓ Fast rendering

---

## 4. Network Performance

### Test 1: API Endpoint Latency

```bash
# Test from different locations
curl -w "@curl-format.txt" -o /dev/null -s https://nusantaragroup.co/api/health

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

**Expected:**
- DNS lookup: < 50ms
- Connection: < 100ms
- First byte: < 200ms
- Total: < 300ms

### Test 2: Asset Loading

```javascript
// In browser console
performance.getEntriesByType('resource').forEach(resource => {
  console.log(
    resource.name,
    'Duration:', resource.duration.toFixed(2), 'ms',
    'Size:', resource.transferSize, 'bytes'
  );
});
```

**Check:**
- JS bundles: < 500ms
- CSS files: < 200ms
- Images: < 1s
- Service worker: < 100ms

### Test 3: Gzip Compression

```bash
# Test compression
curl -I -H "Accept-Encoding: gzip" https://nusantaragroup.co

# Should see:
# Content-Encoding: gzip
```

**Verify compression ratios:**
- HTML: > 70%
- CSS: > 80%
- JS: > 70%

---

## 5. Load Testing

### Test 1: Concurrent Users

**Tool:** Artillery

```yaml
# artillery-config.yml
config:
  target: 'https://nusantaragroup.co'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 180
      arrivalRate: 100
      name: "Peak load"
    - duration: 60
      arrivalRate: 10
      name: "Cool down"

scenarios:
  - name: "User flow"
    flow:
      - get:
          url: "/"
      - post:
          url: "/api/auth/login"
          json:
            username: "testuser"
            password: "testpass"
      - get:
          url: "/api/dashboard"
      - post:
          url: "/api/fcm/register-token"
          json:
            token: "test-token-{{ $randomString() }}"
```

```bash
# Run load test
artillery run artillery-config.yml
```

**Expected results:**
- Response time p95: < 500ms
- Response time p99: < 1000ms
- Error rate: < 1%
- Throughput: > 50 req/s

### Test 2: Stress Test

**Goal:** Find breaking point

```yaml
# artillery-stress.yml
config:
  target: 'https://nusantaragroup.co'
  phases:
    - duration: 300
      arrivalRate: 200
      name: "Stress test"

scenarios:
  - name: "API stress"
    flow:
      - get:
          url: "/api/health"
      - post:
          url: "/api/fcm/test"
          headers:
            Authorization: "Bearer {{ token }}"
```

**Monitor:**
- CPU usage
- Memory usage
- Response times
- Error rates

**Pass criteria:**
- ✓ System handles 200 req/s
- ✓ No crashes
- ✓ Graceful degradation
- ✓ Recovery after load drops

---

## 6. Mobile Performance

### Test 1: Mobile Lighthouse

```bash
# Run mobile Lighthouse
lighthouse https://nusantaragroup.co \
  --preset=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=html \
  --output-path=./lighthouse-mobile.html
```

**Target Scores:**
- Performance: > 80
- PWA: 100

### Test 2: Network Throttling

**Chrome DevTools:**
1. Network tab
2. Throttling: Slow 3G
3. Reload page
4. Measure load time

**Expected:**
- Load time: < 10s
- First paint: < 3s
- Interactive: < 5s

### Test 3: Offline Performance

```javascript
// Test offline functionality
navigator.serviceWorker.ready.then(registration => {
  // Go offline
  console.log('Testing offline mode...');
  
  // Try to load pages
  fetch('/dashboard')
    .then(response => console.log('Dashboard loaded:', response.ok))
    .catch(err => console.error('Failed:', err));
});
```

**Pass criteria:**
- ✓ Cached pages load offline
- ✓ Service worker serves cache
- ✓ Proper offline UI

---

## 7. Memory & Resource Usage

### Test 1: Memory Leaks

```javascript
// In browser console
// Take heap snapshot before
console.memory;

// Trigger notifications 1000 times
for (let i = 0; i < 1000; i++) {
  window.dispatchEvent(new CustomEvent('nusantara-notification', {
    detail: {
      title: `Test ${i}`,
      body: 'Memory test',
      type: 'success',
      timestamp: new Date().toISOString()
    }
  }));
}

// Take heap snapshot after
console.memory;

// Memory should not increase significantly
```

**Expected:**
- Memory increase: < 10MB
- No memory leaks
- Proper cleanup

### Test 2: CPU Usage

**Chrome DevTools:**
1. Performance tab
2. Record
3. Trigger heavy operations
4. Stop recording
5. Check CPU usage

**Expected:**
- CPU usage: < 50% average
- No long tasks (> 50ms)
- Smooth 60fps

### Test 3: Backend Resource Usage

```bash
# Monitor with PM2
pm2 monit

# Expected:
# CPU: < 30%
# Memory: < 500MB
# Stable over time
```

---

## 8. Scalability Testing

### Test 1: User Growth Simulation

**Scenario:** 10,000 active users

```javascript
// simulate-users.js
const axios = require('axios');

async function simulateUsers(count) {
  const promises = [];
  
  for (let i = 0; i < count; i++) {
    promises.push(
      axios.post('https://nusantaragroup.co/api/fcm/register-token', {
        token: `token-${i}`,
        deviceType: 'desktop'
      }, {
        headers: { Authorization: `Bearer ${generateToken(i)}` }
      })
    );
    
    // Stagger requests
    if (i % 100 === 0) {
      await Promise.all(promises);
      promises.length = 0;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  await Promise.all(promises);
}

simulateUsers(10000)
  .then(() => console.log('Done'))
  .catch(console.error);
```

**Monitor:**
- Database size
- Query performance
- Response times
- Memory usage

### Test 2: Notification Burst

**Scenario:** Send 1000 notifications simultaneously

```javascript
async function burstTest() {
  const promises = [];
  
  for (let i = 0; i < 1000; i++) {
    promises.push(
      axios.post('https://nusantaragroup.co/api/fcm/test', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }
  
  const start = Date.now();
  await Promise.all(promises);
  const duration = Date.now() - start;
  
  console.log('1000 notifications sent in', duration, 'ms');
  console.log('Throughput:', (1000 / (duration / 1000)).toFixed(2), '/sec');
}
```

**Expected:**
- Duration: < 30 seconds
- Throughput: > 30 notifications/sec
- No failures

---

## Performance Benchmarks Summary

### Backend API

| Endpoint | Latency (p95) | Throughput | Error Rate |
|----------|---------------|------------|------------|
| /health | < 50ms | > 100 req/s | 0% |
| /fcm/register-token | < 200ms | > 50 req/s | < 1% |
| /fcm/send | < 500ms | > 20 req/s | < 1% |
| /fcm/send-batch | < 5s | > 20 notif/s | < 1% |

### Database

| Operation | Latency | Notes |
|-----------|---------|-------|
| Simple SELECT | < 10ms | With index |
| INSERT | < 20ms | Single row |
| Complex JOIN | < 100ms | With proper indexes |
| Batch INSERT | < 500ms | 100 rows |

### Frontend

| Metric | Target | Notes |
|--------|--------|-------|
| Lighthouse Performance | > 90 | Desktop |
| Lighthouse Performance | > 80 | Mobile |
| LCP | < 2.5s | Core Web Vital |
| FID | < 100ms | Core Web Vital |
| CLS | < 0.1 | Core Web Vital |

### Load Testing

| Test | Target | Notes |
|------|--------|-------|
| Concurrent users | 100 | Stable performance |
| Peak load | 200 req/s | No errors |
| Stress test | 500 req/s | Graceful degradation |

---

## Continuous Monitoring

### Setup Monitoring

```javascript
// backend/middleware/performanceMonitor.js

const monitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn('Slow request:', {
        method: req.method,
        url: req.url,
        duration,
        status: res.statusCode
      });
    }
    
    // Send to monitoring service
    metrics.record('api_response_time', duration, {
      endpoint: req.path,
      method: req.method,
      status: res.statusCode
    });
  });
  
  next();
};

module.exports = monitor;
```

### Alerts

Setup alerts for:
- Response time > 1s
- Error rate > 5%
- CPU usage > 80%
- Memory usage > 80%
- Disk space < 20%

---

## Performance Optimization Checklist

### Backend
- [x] Database indexes created
- [x] Connection pooling configured
- [x] Query optimization done
- [x] Caching implemented
- [x] Gzip compression enabled
- [x] Rate limiting implemented

### Frontend
- [x] Code splitting
- [x] Lazy loading
- [x] Image optimization
- [x] Bundle size optimized
- [x] Service worker caching
- [x] Asset preloading

### Infrastructure
- [x] CDN configured
- [x] Load balancer setup
- [x] Auto-scaling enabled
- [x] Monitoring active
- [x] Backup strategy
- [x] Failover plan

---

**Last Updated:** October 19, 2024  
**Version:** 1.0.0
