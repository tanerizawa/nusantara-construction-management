# YK Construction Management System

**Sistem Manajemen Konstruksi Modern untuk YK Construction**

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🏗️ Tentang Project

YK Construction Management System adalah aplikasi web modern yang dirancang khusus untuk mengelola operasional perusahaan konstruksi. Sistem ini menyediakan solusi terintegrasi untuk manajemen proyek, inventaris, keuangan, SDM, dan administrasi.

### ✨ Fitur Utama

- **📊 Dashboard Analitik** - Overview real-time performa bisnis
- **🏗️ Manajemen Proyek** - Tracking progress, timeline, dan anggaran
- **💰 Manajemen Keuangan** - Laporan keuangan, cash flow, invoice
- **📦 Manajemen Inventaris** - Stock control, purchase orders, suppliers
- **👥 Manajemen SDM** - Employee management, payroll, attendance
- **📋 Administrasi Pajak** - Tax compliance dan reporting
- **👤 User Management** - Role-based access control
- **🔐 Authentication** - Secure JWT-based authentication

## 🚀 Teknologi Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server runtime dan framework
- **PostgreSQL** - Primary database
- **Sequelize ORM** - Database modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **dotenv** - Environment management

## 📁 Struktur Project

```
YK/
├── backend/                 # Server-side application
│   ├── config/             # Database & app configuration
│   ├── models/             # Sequelize models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── middleware/         # Custom middleware
│   ├── migrations/         # Database migrations
│   ├── seeders/           # Database seeders
│   └── server.js          # Main server file
├── frontend/               # Client-side application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── data/                  # JSON data files (fallback)
└── docs/                  # Documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/yk-construction.git
cd yk-construction
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env.development

# Edit .env.development dengan konfigurasi database Anda
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=yk_construction_dev
# DB_USER=your_username
# DB_PASSWORD=your_password

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with initial data
npm run db:reset       # Reset database (drop + migrate + seed)
npm run db:drop        # Drop all tables
npm test               # Run tests
```

### Frontend Scripts
```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App
```

## 🔐 Authentication

Sistem menggunakan JWT (JSON Web Tokens) untuk authentication:

### Default Users
```javascript
// Admin User
Username: admin
Password: admin123

// Project Manager
Username: project_manager1
Password: pm123
```

### API Authentication
```javascript
// Login
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

// Use token in headers
Authorization: Bearer <your_jwt_token>
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Finance
- `GET /api/finance` - Get financial data
- `POST /api/finance` - Add financial transaction

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)

## 🎯 Development Features

### Hybrid Storage Mode
Sistem mendukung **hybrid storage mode** yang memungkinkan:
- **Database mode** - Menggunakan PostgreSQL untuk produksi
- **JSON fallback mode** - Menggunakan file JSON saat database tidak tersedia
- **Automatic switching** - Otomatis beralih antara mode tanpa downtime

### Environment-based Configuration
- **Development** - Full debug logging, hot reload
- **Production** - Optimized performance, security hardening
- **Test** - Isolated test database

### Security Features
- **Password hashing** dengan bcryptjs
- **Rate limiting** untuk API protection
- **CORS configuration** untuk cross-origin requests
- **Helmet.js** untuk security headers
- **Input validation** dengan Joi

## 🚀 Deployment

### Production Setup
1. Set environment variables
2. Run database migrations
3. Build frontend assets
4. Start production server

```bash
# Backend
NODE_ENV=production
npm run db:migrate
npm start

# Frontend
npm run build
# Deploy build folder to static hosting
```

### Docker Deployment (Coming Soon)
```bash
docker-compose up -d
```

## 📝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Manager** - System Architecture & Backend Development
- **Frontend Developer** - UI/UX Implementation
- **Database Designer** - Data Modeling & Optimization

## 📞 Support

Untuk support dan pertanyaan:
- **Email**: support@ykconstruction.com
- **Documentation**: [Wiki](https://github.com/yourusername/yk-construction/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/yk-construction/issues)

---

**Made with ❤️ for YK Construction**
