# 📚 User Management API Documentation

Complete API reference for User Management system with role-based access control.

## 📋 Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [List Users](#1-list-users-with-advanced-filtering)
  - [Get Statistics](#2-get-user-statistics)
  - [Get User Details](#3-get-single-user-details)
  - [Create User](#4-create-new-user)
  - [Update User](#5-update-user)
  - [Toggle Status](#6-toggle-user-status)
  - [Delete User](#7-delete-user)
  - [Bulk Delete](#8-bulk-delete-users)
  - [Bulk Status Change](#9-bulk-change-status)
- [Data Models](#data-models)
- [Error Responses](#error-responses)

---

## Base URL

```
http://localhost:5000/api/users
```

All endpoints are prefixed with `/api/users/management` except where noted.

---

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Required Roles:**
- Super Admin: Full access to all endpoints
- Admin: Full access except cannot delete super_admin users
- Other roles: Limited to viewing own profile

---

## Endpoints

### 1. List Users with Advanced Filtering

Get paginated list of users with optional filtering and statistics.

**Endpoint:** `GET /api/users/management`

**Query Parameters:**

| Parameter | Type   | Default    | Description                                    |
|-----------|--------|------------|------------------------------------------------|
| `role`    | string | `all`      | Filter by role (e.g., 'admin', 'staff')       |
| `status`  | string | `all`      | Filter by status: 'active', 'inactive', 'all'  |
| `search`  | string | -          | Search in username, email, fullName            |
| `sort`    | string | `createdAt`| Sort field (username, email, createdAt, etc.)  |
| `order`   | string | `DESC`     | Sort order: 'ASC' or 'DESC'                    |
| `limit`   | number | `20`       | Items per page (max 100)                       |
| `page`    | number | `1`        | Page number                                    |

**Example Request:**

```bash
curl -X GET "http://localhost:5000/api/users/management?role=admin&status=active&search=john&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "U001",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phone": "+62812345678",
      "position": "Senior Manager",
      "department": "IT Department",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2025-10-17T10:30:00.000Z",
      "createdAt": "2025-01-15T08:00:00.000Z",
      "updatedAt": "2025-10-17T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 48,
    "perPage": 10
  },
  "statistics": {
    "total": 48,
    "active": 42,
    "inactive": 6,
    "byRole": {
      "super_admin": { "active": 1, "inactive": 0 },
      "admin": { "active": 5, "inactive": 1 },
      "project_manager": { "active": 8, "inactive": 2 },
      "finance_manager": { "active": 6, "inactive": 1 },
      "inventory_manager": { "active": 4, "inactive": 0 },
      "hr_manager": { "active": 3, "inactive": 1 },
      "staff": { "active": 10, "inactive": 1 },
      "supervisor": { "active": 5, "inactive": 0 }
    }
  }
}
```

---

### 2. Get User Statistics

Get aggregated user statistics for dashboard.

**Endpoint:** `GET /api/users/management/stats`

**Example Request:**

```bash
curl -X GET "http://localhost:5000/api/users/management/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**

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
      "project_manager": 10,
      "finance_manager": 7,
      "inventory_manager": 4,
      "hr_manager": 4,
      "staff": 11,
      "supervisor": 5
    }
  }
}
```

---

### 3. Get Single User Details

Retrieve detailed information about a specific user.

**Endpoint:** `GET /api/users/management/:id`

**URL Parameters:**

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| `id`      | string | User ID (e.g., U001) |

**Example Request:**

```bash
curl -X GET "http://localhost:5000/api/users/management/U001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "U001",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "+62812345678",
    "position": "Senior Manager",
    "department": "IT Department",
    "role": "admin",
    "isActive": true,
    "lastLogin": "2025-10-17T10:30:00.000Z",
    "createdAt": "2025-01-15T08:00:00.000Z",
    "updatedAt": "2025-10-17T10:30:00.000Z",
    "profile": {
      "fullName": "John Doe",
      "phone": "+62812345678",
      "position": "Senior Manager",
      "department": "IT Department",
      "avatar": null
    },
    "permissions": []
  }
}
```

---

### 4. Create New User

Create a new user account.

**Endpoint:** `POST /api/users/management`

**Request Body:**

```json
{
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "fullName": "Jane Doe",
  "phone": "+62812345679",
  "position": "Project Manager",
  "department": "Construction",
  "role": "project_manager",
  "isActive": true
}
```

**Field Validation:**

| Field        | Type    | Required | Constraints                              |
|--------------|---------|----------|------------------------------------------|
| `username`   | string  | ✅       | 3-50 chars, alphanumeric only            |
| `email`      | string  | ✅       | Valid email format                       |
| `password`   | string  | ✅       | Minimum 8 characters                     |
| `fullName`   | string  | ✅       | 2-100 characters                         |
| `phone`      | string  | ❌       | Valid phone format                       |
| `position`   | string  | ❌       | Max 100 characters                       |
| `department` | string  | ❌       | Max 100 characters                       |
| `role`       | string  | ✅       | One of 8 valid roles                     |
| `isActive`   | boolean | ❌       | Default: true                            |

**Valid Roles:**
- `super_admin`
- `admin`
- `project_manager`
- `finance_manager`
- `inventory_manager`
- `hr_manager`
- `staff`
- `supervisor`

**Example Request:**

```bash
curl -X POST "http://localhost:5000/api/users/management" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "fullName": "Jane Doe",
    "phone": "+62812345679",
    "position": "Project Manager",
    "department": "Construction",
    "role": "project_manager",
    "isActive": true
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "U049",
    "username": "janedoe",
    "email": "jane@example.com",
    "fullName": "Jane Doe",
    "phone": "+62812345679",
    "position": "Project Manager",
    "department": "Construction",
    "role": "project_manager",
    "isActive": true,
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**Error Responses:**

```json
// Validation Error (400)
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "\"password\" length must be at least 8 characters long"
  ]
}

// Duplicate Username/Email (400)
{
  "success": false,
  "error": "Username already exists"
}
```

---

### 5. Update User

Update existing user information.

**Endpoint:** `PUT /api/users/management/:id`

**URL Parameters:**

| Parameter | Type   | Description  |
|-----------|--------|--------------|
| `id`      | string | User ID      |

**Request Body (all fields optional):**

```json
{
  "username": "johndoe_updated",
  "email": "john.updated@example.com",
  "password": "NewSecurePass123!",
  "fullName": "John Updated Doe",
  "phone": "+62812345680",
  "position": "Lead Manager",
  "department": "IT Operations",
  "role": "admin",
  "isActive": true
}
```

**Example Request:**

```bash
curl -X PUT "http://localhost:5000/api/users/management/U001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated Doe",
    "position": "Lead Manager"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "U001",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Updated Doe",
    "phone": "+62812345678",
    "position": "Lead Manager",
    "department": "IT Department",
    "role": "admin",
    "isActive": true,
    "updatedAt": "2025-10-17T13:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

---

### 6. Toggle User Status

Activate or deactivate a user account.

**Endpoint:** `PATCH /api/users/management/:id/status`

**URL Parameters:**

| Parameter | Type   | Description  |
|-----------|--------|--------------|
| `id`      | string | User ID      |

**Request Body:**

```json
{
  "isActive": false
}
```

**Example Request:**

```bash
curl -X PATCH "http://localhost:5000/api/users/management/U001/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "U001",
    "username": "johndoe",
    "isActive": false,
    "updatedAt": "2025-10-17T13:30:00.000Z"
  },
  "message": "User deactivated successfully"
}
```

---

### 7. Delete User

Delete user account (soft delete by default, permanent with query param).

**Endpoint:** `DELETE /api/users/management/:id`

**URL Parameters:**

| Parameter   | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| `id`        | string | User ID                                        |
| `permanent` | string | Set to 'true' for permanent deletion (optional)|

**Example Requests:**

```bash
# Soft delete (deactivate)
curl -X DELETE "http://localhost:5000/api/users/management/U001" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Permanent delete
curl -X DELETE "http://localhost:5000/api/users/management/U001?permanent=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**

```json
// Soft delete
{
  "success": true,
  "data": {
    "id": "U001",
    "username": "johndoe",
    "isActive": false
  },
  "message": "User deactivated successfully"
}

// Permanent delete
{
  "success": true,
  "message": "User permanently deleted"
}
```

**Error Response:**

```json
// Cannot delete super_admin (403)
{
  "success": false,
  "error": "Cannot delete super admin user"
}
```

---

### 8. Bulk Delete Users

Delete multiple users at once.

**Endpoint:** `POST /api/users/management/bulk-delete`

**Request Body:**

```json
{
  "userIds": ["U002", "U003", "U004"],
  "permanent": false
}
```

**Field Description:**

| Field       | Type     | Required | Description                                    |
|-------------|----------|----------|------------------------------------------------|
| `userIds`   | string[] | ✅       | Array of user IDs to delete                    |
| `permanent` | boolean  | ❌       | true for permanent, false for soft delete      |

**Example Request:**

```bash
curl -X POST "http://localhost:5000/api/users/management/bulk-delete" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["U002", "U003", "U004"],
    "permanent": false
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "affected": 3,
    "permanent": false
  },
  "message": "3 user(s) deactivated successfully"
}
```

**Error Response:**

```json
// Super admin in selection (403)
{
  "success": false,
  "error": "Cannot delete super admin users",
  "details": "Found 1 super admin(s) in selection"
}
```

---

### 9. Bulk Change Status

Change status (active/inactive) for multiple users at once.

**Endpoint:** `POST /api/users/management/bulk-status`

**Request Body:**

```json
{
  "userIds": ["U002", "U003", "U004"],
  "isActive": true
}
```

**Field Description:**

| Field      | Type     | Required | Description                          |
|------------|----------|----------|--------------------------------------|
| `userIds`  | string[] | ✅       | Array of user IDs                    |
| `isActive` | boolean  | ✅       | true to activate, false to deactivate|

**Example Request:**

```bash
curl -X POST "http://localhost:5000/api/users/management/bulk-status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["U002", "U003", "U004"],
    "isActive": true
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "affected": 3
  },
  "message": "3 user(s) activated successfully"
}
```

---

## Data Models

### User Object

```typescript
interface User {
  id: string;              // Auto-generated (e.g., U001)
  username: string;        // Unique, 3-50 chars, alphanumeric
  email: string;           // Unique, valid email
  fullName: string;        // 2-100 chars
  phone?: string;          // Optional phone number
  position?: string;       // Optional job position
  department?: string;     // Optional department
  role: UserRole;          // One of 8 roles
  isActive: boolean;       // Account status
  lastLogin?: Date;        // Last login timestamp
  createdAt: Date;         // Account creation date
  updatedAt: Date;         // Last update date
  profile?: {              // JSONB profile data
    fullName: string;
    phone: string;
    position: string;
    department: string;
    avatar: string | null;
  };
  permissions?: string[];  // Custom permissions array
}
```

### User Roles

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',        // Full system access
  ADMIN = 'admin',                    // Administrative access
  PROJECT_MANAGER = 'project_manager', // Project management
  FINANCE_MANAGER = 'finance_manager', // Financial operations
  INVENTORY_MANAGER = 'inventory_manager', // Inventory control
  HR_MANAGER = 'hr_manager',          // HR operations
  STAFF = 'staff',                    // General staff access
  SUPERVISOR = 'supervisor'           // Supervisory access
}
```

### Statistics Object

```typescript
interface Statistics {
  total: number;           // Total user count
  active: number;          // Active users
  inactive: number;        // Inactive users
  byRole: {
    [role: string]: {
      active: number;
      inactive: number;
    }
  };
}
```

---

## Error Responses

### Common Error Codes

| Status | Error Type           | Description                              |
|--------|----------------------|------------------------------------------|
| 400    | Validation Error     | Invalid request data                     |
| 401    | Unauthorized         | Missing or invalid authentication token  |
| 403    | Forbidden            | Insufficient permissions                 |
| 404    | Not Found            | User not found                           |
| 409    | Conflict             | Duplicate username or email              |
| 500    | Internal Server Error| Server error                             |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Example Error Responses

```json
// 400 - Validation Error
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "\"username\" must only contain alpha-numeric characters",
    "\"password\" length must be at least 8 characters long"
  ]
}

// 401 - Unauthorized
{
  "success": false,
  "error": "Authentication required"
}

// 403 - Forbidden
{
  "success": false,
  "error": "Insufficient permissions to perform this action"
}

// 404 - Not Found
{
  "success": false,
  "error": "User not found"
}

// 409 - Conflict
{
  "success": false,
  "error": "Username already exists"
}

// 500 - Server Error
{
  "success": false,
  "error": "Failed to create user",
  "details": "Database connection error"
}
```

---

## Testing with cURL

### Complete Testing Flow

```bash
# 1. Login to get token
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Save token
TOKEN="your_jwt_token_here"

# 2. Get user statistics
curl -X GET "http://localhost:5000/api/users/management/stats" \
  -H "Authorization: Bearer $TOKEN"

# 3. List all users
curl -X GET "http://localhost:5000/api/users/management" \
  -H "Authorization: Bearer $TOKEN"

# 4. Create new user
curl -X POST "http://localhost:5000/api/users/management" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234!",
    "fullName": "Test User",
    "role": "staff"
  }'

# 5. Update user
curl -X PUT "http://localhost:5000/api/users/management/U001" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"position": "Senior Developer"}'

# 6. Deactivate user
curl -X PATCH "http://localhost:5000/api/users/management/U001/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# 7. Bulk operations
curl -X POST "http://localhost:5000/api/users/management/bulk-status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userIds": ["U002", "U003"], "isActive": true}'
```

---

## Notes

1. **Password Security:** All passwords are hashed using bcrypt with 10 salt rounds
2. **Soft Delete:** Default delete operation deactivates users instead of permanent deletion
3. **Super Admin Protection:** Super admin users cannot be deleted
4. **Username Format:** Only alphanumeric characters allowed (no spaces or special chars)
5. **Rate Limiting:** API endpoints are rate-limited to prevent abuse
6. **Pagination:** Maximum 100 items per page
7. **Search:** Case-insensitive search across username, email, and fullName
8. **Timestamps:** All dates in ISO 8601 format (UTC timezone)

---

## Support

For issues or questions:
- Backend: `/root/APP-YK/backend/routes/users.management.js`
- Frontend: `/root/APP-YK/frontend/src/pages/Settings/components/UserManagement/`
- Documentation: This file

---

**Last Updated:** October 17, 2025
**API Version:** 1.0.0
**Status:** ✅ Production Ready
