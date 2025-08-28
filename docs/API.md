# API Documentation

YK Construction Management System REST API

## Base URL

```
Development: http://localhost:5001/api
Production: https://api.ykconstruction.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR001",
    "username": "admin",
    "email": "admin@ykconstruction.com",
    "role": "admin",
    "profile": {
      "fullName": "Admin User",
      "position": "Administrator"
    }
  }
}
```

### Register

```http
POST /auth/register
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@ykconstruction.com",
  "password": "password123",
  "fullName": "New User",
  "position": "Project Manager",
  "role": "project_manager"
}
```

### Get Current User

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "USR001",
    "username": "admin",
    "email": "admin@ykconstruction.com",
    "role": "admin",
    "profile": {
      "fullName": "Admin User",
      "position": "Administrator"
    }
  },
  "storageMode": "database"
}
```

## Project Management

### Get All Projects

```http
GET /projects
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "PRJ001",
      "name": "Pembangunan Gedung Perkantoran",
      "description": "Proyek pembangunan gedung perkantoran 10 lantai",
      "status": "in_progress",
      "startDate": "2024-01-15",
      "endDate": "2024-12-31",
      "budget": 15000000000,
      "actualCost": 8500000000,
      "location": "Jakarta Selatan",
      "clientInfo": {
        "name": "PT ABC Corporation",
        "contact": "+62812-3456-7890"
      }
    }
  ]
}
```

### Create Project

```http
POST /projects
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Construction Project",
  "description": "Project description",
  "startDate": "2024-02-01",
  "endDate": "2024-11-30",
  "budget": 5000000000,
  "location": "Bandung",
  "clientInfo": {
    "name": "PT XYZ Company",
    "contact": "+62813-1234-5678",
    "email": "contact@xyz.com"
  }
}
```

### Get Project Details

```http
GET /projects/:id
```

### Update Project

```http
PUT /projects/:id
```

### Delete Project

```http
DELETE /projects/:id
```

## Finance Management

### Get Financial Transactions

```http
GET /finance
```

**Query Parameters:**
- `type` - Transaction type (income, expense)
- `category` - Transaction category
- `startDate` - Start date filter
- `endDate` - End date filter

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "FIN001",
      "type": "income",
      "category": "project_payment",
      "amount": 500000000,
      "description": "Pembayaran progress proyek gedung",
      "date": "2024-01-20",
      "projectId": "PRJ001",
      "receiptNumber": "INV-2024-001"
    }
  ],
  "summary": {
    "totalIncome": 2500000000,
    "totalExpense": 1800000000,
    "netIncome": 700000000
  }
}
```

### Add Financial Transaction

```http
POST /finance
```

**Request Body:**
```json
{
  "type": "expense",
  "category": "material_purchase",
  "amount": 150000000,
  "description": "Pembelian bahan bangunan",
  "projectId": "PRJ001",
  "receiptNumber": "PO-2024-015"
}
```

## Inventory Management

### Get Inventory Items

```http
GET /inventory
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "INV001",
      "name": "Semen Portland",
      "category": "material",
      "quantity": 500,
      "unit": "bag",
      "pricePerUnit": 65000,
      "supplier": "PT Supplier Material",
      "location": "Gudang A",
      "minStock": 50,
      "lastUpdated": "2024-01-25"
    }
  ]
}
```

### Add Inventory Item

```http
POST /inventory
```

**Request Body:**
```json
{
  "name": "Besi Beton 12mm",
  "category": "material",
  "quantity": 200,
  "unit": "batang",
  "pricePerUnit": 85000,
  "supplier": "PT Besi Jaya",
  "location": "Gudang B",
  "minStock": 20
}
```

### Update Inventory

```http
PUT /inventory/:id
```

### Delete Inventory Item

```http
DELETE /inventory/:id
```

## User Management

### Get All Users

```http
GET /users
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "USR001",
      "username": "admin",
      "email": "admin@ykconstruction.com",
      "role": "admin",
      "profile": {
        "fullName": "Admin User",
        "position": "Administrator",
        "department": "IT",
        "isActive": true
      },
      "permissions": ["all"]
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests, try again later",
  "retryAfter": 900
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are limited to:
- **Development**: 10,000 requests per 15 minutes
- **Production**: 100 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time

## Data Validation

All input data is validated using Joi schemas. Common validation rules:

- **Usernames**: 3-30 characters, alphanumeric
- **Emails**: Valid email format
- **Passwords**: Minimum 6 characters
- **Dates**: ISO 8601 format (YYYY-MM-DD)
- **Numbers**: Positive integers for amounts and quantities

## Pagination

For endpoints that return large datasets, pagination is supported:

```http
GET /projects?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Response includes pagination info:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Health Check

### System Health

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-25T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "storage": "database"
}
```
