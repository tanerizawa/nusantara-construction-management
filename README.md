# 🏗️ Nusantara Group Construction Management System
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
