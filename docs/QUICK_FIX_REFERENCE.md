# Quick Fix Reference: Common Modularization Issues

## 🔴 Issue: Maximum Call Stack Size Exceeded

**Symptoms:**
```
RangeError: Maximum call stack size exceeded
```

**Cause:** Circular import

**Quick Fix:**
```javascript
// ❌ WRONG
export { Component } from './module';

// ✅ CORRECT
export { Component } from './module/index';
```

## 🔴 Issue: WebSocket Connection Failed

**Symptoms:**
```
WebSocket connection to 'wss://domain.com:3000/ws' failed
```

**Cause:** Hot Module Replacement in production

**Quick Fix:**
```bash
# In docker-compose.yml
environment:
  WDS_SOCKET_PORT: "0"
  FAST_REFRESH: "false"
```

## 🔴 Issue: Module Not Found

**Symptoms:**
```
Module not found: Can't resolve '@components/...'
```

**Quick Fix:**
```javascript
// Check craco.config.js or jsconfig.json
resolve: {
  alias: {
    '@components': path.resolve(__dirname, 'src/components'),
  }
}
```

## 🔴 Issue: Infinite Re-render

**Symptoms:**
```
Warning: Maximum update depth exceeded
```

**Cause:** useEffect without dependencies

**Quick Fix:**
```javascript
// ❌ WRONG
useEffect(() => {
  fetchData();
});

// ✅ CORRECT
useEffect(() => {
  fetchData();
}, []); // Add dependency array
```

## 🔴 Issue: Props Not Updating

**Cause:** Object/Array identity change

**Quick Fix:**
```javascript
// ❌ WRONG
const data = { ...props.data };

// ✅ CORRECT
const data = useMemo(() => ({ ...props.data }), [props.data]);
```

## 🛠️ Debug Commands

```bash
# Check circular dependencies
npm install -g madge
madge --circular src/

# Check bundle size
npm run build
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js

# Check import issues
grep -r "from '\\./" src/

# Monitor logs
docker logs -f nusantara-frontend
```

## 📋 Pre-deployment Checklist

- [ ] No circular imports
- [ ] All environment variables set
- [ ] WebSocket disabled for production
- [ ] Build completes successfully
- [ ] No console errors
- [ ] API routes working
- [ ] Performance acceptable

---
**Keep this reference handy for quick troubleshooting!**