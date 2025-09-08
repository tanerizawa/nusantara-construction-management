# 🏗️ # 🏗️ Nusantara Construction Management System

Sistem manajemen konstruksi terintegrasi untuk **Nusantara Group Karawang** - kontraktor terpercaya untuk proyek sipil, gedung, dan infrastruktur di Karawang dan sekitarnya.

## 🌟 Overview

Aplikasi web full-stack yang dirancang khusus untuk industri konstruksi dengan fitur lengkap untuk mengelola proyek, keuangan, inventori, dan sumber daya manusia.

**🌐 Live Demo:** [https://nusantaragroup.co](https://nusantaragroup.co)

## 🚀 Fitur Utama

### 📊 Dashboard Terintegrasi
- Real-time project monitoring
- Financial overview dan cash flow
- Inventory tracking
- HR analytics dan performance metrics

### 🏗️ Project Management
- Comprehensive project lifecycle management
- Bill of Quantities (BOQ) integration
- Milestone tracking dan progress monitoring
- Document management system
- Material reservation system

### 💰 Financial Management
- Chart of Accounts untuk industri konstruksi
- Journal entries dan double-entry bookkeeping
- Financial reporting (P&L, Balance Sheet, Cash Flow)
- Indonesian tax compliance (PPh, PPN)
- Budget planning dan cost allocation

### 📦 Inventory & Procurement
- Equipment maintenance management
- Material reservation system
- Purchase order management
- Stock opname dan warehouse management
- Unit conversion untuk material konstruksi

### 👥 Human Resources
- Employee management
- Attendance tracking
- Performance evaluation
- Training management
- Safety compliance monitoring

### 🏢 Subsidiary Management
- Multi-subsidiary operations
- Consolidated reporting
- Governance dan compliance
- Performance analytics

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM
- **bcryptjs** - Password hashing
- **JWT** - Authentication

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server & reverse proxy
- **Let's Encrypt** - SSL certificates

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (untuk development lokal)
- PostgreSQL 15+ (atau gunakan Docker)

### Development Setup

1. **Clone repository:**
```bash
git clone https://github.com/USERNAME/nusantara-construction-management.git
cd nusantara-construction-management
```

2. **Setup environment:**
```bash
cp .env.example .env.dev
# Edit .env.dev dengan konfigurasi database Anda
```

3. **Start dengan Docker:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

4. **Akses aplikasi:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Default Login Credentials
- **Admin:** `admin` / `admin123`
- **Project Manager:** `project_manager1` / `pm123`
- **Finance Manager:** `finance_manager` / `finance123`

## 📁 Project Structure

```
nusantara-construction-management/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── models/             # Sequelize models
│   ├── routes/             # Express routes
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic services
│   ├── migrations/         # Database migrations
│   ├── seeders/           # Database seeders
│   └── config/            # Configuration files
│
├── docker-compose.dev.yml   # Development Docker setup
├── nginx.production.conf    # Production Nginx config
└── docs/                   # Documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Management
```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed database
npx sequelize-cli db:seed:all

# Reset database
npm run db:reset
```

## 🚀 Deployment

### Production dengan Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Setup Nginx dengan konfigurasi yang disediakan
3. Setup SSL dengan Let's Encrypt
4. Configure environment variables
5. Start backend dengan PM2

## 📊 Features Overview

### For Construction Companies
- ✅ Project lifecycle management
- ✅ Financial tracking dengan standar akuntansi Indonesia
- ✅ Material dan equipment management
- ✅ Workforce planning dan HR
- ✅ Government compliance reporting
- ✅ Multi-subsidiary operations

### For Project Managers
- ✅ Real-time project dashboards
- ✅ Milestone tracking
- ✅ Resource allocation
- ✅ Document management
- ✅ Progress reporting

### For Finance Teams
- ✅ Double-entry bookkeeping
- ✅ Indonesian tax compliance
- ✅ Financial statement generation
- ✅ Budget vs actual analysis
- ✅ Cash flow management

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Proprietary software untuk Nusantara Group Karawang. Tidak untuk distribusi publik.

## 📞 Support

- **Email:** dev@nusantaragroup.co
- **Website:** [https://nusantaragroup.co](https://nusantaragroup.co)
- **Location:** Karawang, Jawa Barat, Indonesia

---

**© 2025 Nusantara Group Karawang. All rights reserved.**
## Development Environment

**Mode:** Development Only  
**Status:** Ready for Development  
**Version:** 1.0.0-dev  

---

## 🚀 Quick Start

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Stop development environment  
docker-compose down
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React development with hot reload |
| **Backend API** | http://localhost:5000 | Express.js API server |
| **Database Admin** | http://localhost:8080 | pgAdmin interface |
| **Email Testing** | http://localhost:8025 | MailHog email testing |

---

## 📊 Development Services

- **Frontend**: React 18 with hot reload
- **Backend**: Express.js with auto-restart  
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Email**: MailHog for development
- **Admin**: pgAdmin for database management

---

## 🗄️ Database Setup

```bash
# Import mock data
cd backend
node scripts/data-mapper.js

# Check database connection
docker-compose exec database psql -U yk_user -d yk_construction_dev
```

---

## 📁 Project Structure

```
APP-YK/
├── frontend/          # React 18 frontend
├── backend/           # Express.js backend  
├── docker-compose.yml # Development configuration
└── development-setup.sh # Environment setup
```

---

## 🛠️ Development Commands

```bash
# Setup development environment
./development-setup.sh

# Start containers
docker-compose up -d

# View container status  
docker-compose ps

# Rebuild containers
docker-compose build

# Clean restart
docker-compose down && docker-compose up -d
```

---

## 📝 Development Notes

- **Hot Reload**: Enabled for React frontend
- **Auto Restart**: Enabled for Express backend
- **Source Maps**: Enabled for debugging
- **Mock Data**: Available in `backend/data/`
- **Transformed Data**: Available in `backend/transformed-data/`

---

## 🎯 Focus Areas

1. **Database Integration**: Convert mock data to real database queries
2. **API Development**: Complete REST API endpoints
3. **Frontend Components**: Enhance UI components
4. **Authentication**: Implement JWT authentication
5. **Testing**: Add unit and integration tests

---

**🔧 Development Mode Only - No Production Configuration**
