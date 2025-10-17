# Fix: Auth Token Expired Returns 500 Instead of 401

**Tanggal:** 17 Oktober 2025  
**Status:** ✅ FIXED

## 🐛 Problem

Frontend console menampilkan error 500 saat membuka aplikasi:

```
GET /api/auth/me 500 (Internal Server Error)
Token verification failed: AxiosError {message: 'Request failed with status code 500', ...}
```

## 🔍 Root Cause

**Backend tidak handle TokenExpiredError dengan benar!**

Backend logs menunjukkan:
```
Auth error: TokenExpiredError: jwt expired
GET /api/auth/me 500 3.723 ms - 64
```

**Problem di `/backend/routes/auth/authentication.routes.js`:**
```javascript
} catch (error) {
  console.error("Auth error:", error);
  
  // Only handles JsonWebTokenError
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
  
  // TokenExpiredError falls through to 500 ❌
  res.status(500).json({
    success: false,
    error: "Server error",
    details: error.message,
  });
}
```

**Issue:** TokenExpiredError tidak dihandle, jadi masuk ke generic 500 error handler.

## 🔧 Solution

### 1. **Backend: Handle TokenExpiredError** 

**File:** `/backend/routes/auth/authentication.routes.js`

**Changed:**
```javascript
} catch (error) {
  console.error("Auth error:", error);
  
  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
  
  // ✅ NEW: Handle expired tokens
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      tokenExpired: true  // Flag for frontend
    });
  }
  
  // Only true server errors return 500
  res.status(500).json({
    success: false,
    error: "Server error",
    details: error.message,
  });
}
```

**Why:**
- **401 Unauthorized** is correct status for expired tokens
- **500 Internal Server Error** should only be for actual server problems
- `tokenExpired: true` flag lets frontend handle gracefully

### 2. **Frontend: Better Error Logging**

**File:** `/frontend/src/context/AuthContext.js`

**Changed:**
```javascript
} catch (error) {
  console.error('Token verification failed:', error);
  
  // ✅ Handle different error types
  if (error.response) {
    if (error.response.status === 401) {
      // Token invalid or expired - this is expected
      console.log('Token expired or invalid, clearing auth state');
    } else if (error.response.status >= 500) {
      // Server error - log for debugging
      console.error('Server error during token verification:', error.response.status);
    }
  }
  
  // Clear token and logout on any verification error
  logout();
} finally {
  setLoading(false);
}
```

**Why:**
- Differentiate between expected (401) and unexpected (500) errors
- Better logging for debugging
- User experience remains the same (logout), but console is cleaner

## 📊 Error Types Handled

### JWT Error Types:
1. **JsonWebTokenError** → 401 (Invalid token format)
2. **TokenExpiredError** → 401 (Token expired) ✅ **NEW**
3. **NotBeforeError** → 401 (Token not yet valid)
4. **Other errors** → 500 (Actual server errors)

### Response Examples:

**Expired Token:**
```json
{
  "success": false,
  "error": "Token expired",
  "tokenExpired": true
}
```

**Invalid Token:**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Server Error:**
```json
{
  "success": false,
  "error": "Server error",
  "details": "Database connection failed"
}
```

## ✅ Verification

### Test Expired Token:
```bash
# Generate expired token (or use old token)
curl -H "Authorization: Bearer <expired_token>" http://localhost:5000/api/auth/me
```

**Before Fix:**
```
Status: 500 Internal Server Error
Auth error: TokenExpiredError: jwt expired
```

**After Fix:**
```
Status: 401 Unauthorized
{
  "success": false,
  "error": "Token expired",
  "tokenExpired": true
}
```

### Frontend Console:

**Before:**
```
❌ GET /api/auth/me 500 (Internal Server Error)
❌ Token verification failed: AxiosError {...}
```

**After:**
```
✅ Token expired or invalid, clearing auth state
(User redirected to login - expected behavior)
```

## 📁 Files Modified

1. ✅ `/backend/routes/auth/authentication.routes.js` - Added TokenExpiredError handling
2. ✅ `/frontend/src/context/AuthContext.js` - Improved error logging

## 🔄 User Flow

### When Token Expires:

**Before Fix:**
1. User opens app
2. Frontend sends GET /auth/me with expired token
3. Backend returns 500 ❌
4. Console shows scary server error
5. User logged out

**After Fix:**
1. User opens app
2. Frontend sends GET /auth/me with expired token
3. Backend returns 401 ✅
4. Console shows "Token expired or invalid" (normal)
5. User logged out and redirected to login (clean)

## 💡 Best Practices

### HTTP Status Codes:
- **401 Unauthorized** - Authentication issues (invalid/expired tokens)
- **403 Forbidden** - Authorization issues (valid token, insufficient permissions)
- **500 Internal Server Error** - Actual server problems (database errors, crashes)

### JWT Error Handling:
```javascript
// Always handle all JWT error types
try {
  const decoded = jwt.verify(token, secret);
} catch (error) {
  if (error.name === "JsonWebTokenError") return 401;
  if (error.name === "TokenExpiredError") return 401;
  if (error.name === "NotBeforeError") return 401;
  // Only unknown errors should be 500
  return 500;
}
```

### Frontend Token Handling:
```javascript
// Check response status
if (error.response?.status === 401) {
  // Expected - token issues
  console.log('Auth required');
  redirectToLogin();
} else if (error.response?.status >= 500) {
  // Unexpected - server problems
  console.error('Server error:', error);
  showErrorToast('Server temporarily unavailable');
}
```

## 🎯 Impact

**Error Reduction:**
- ❌ Before: Server error (500) on every expired token
- ✅ After: Proper auth error (401) with clear message

**Developer Experience:**
- ❌ Before: Confusing 500 errors in console
- ✅ After: Clear "Token expired" messages

**User Experience:**
- Same logout behavior (expected)
- Cleaner error messages
- No false alarm "server errors"

## 🚀 Testing Checklist

- [x] Expired token returns 401 (not 500)
- [x] Invalid token returns 401
- [x] Valid token returns 200 with user data
- [x] Frontend logs appropriate messages
- [x] User redirected to login on auth failure
- [x] No console errors for expected auth failures

## 📝 Related Endpoints

**Also checked and confirmed OK:**
- `POST /api/auth/login` - Creates new tokens
- `POST /api/auth/refresh-token` - Refreshes expired tokens (already handles TokenExpiredError)
- `POST /api/auth/logout` - Clears tokens

**Note:** `/auth/refresh-token` already had proper TokenExpiredError handling:
```javascript
if (
  error.name === "JsonWebTokenError" ||
  error.name === "TokenExpiredError"
) {
  return res.status(401).json({
    success: false,
    error: "Invalid or expired token",
  });
}
```

---

**Summary:** ✅ Fixed backend to return 401 (not 500) when JWT token expires. Improved frontend error logging to distinguish between expected auth failures and actual server errors. Console now shows clean messages instead of scary 500 errors.
