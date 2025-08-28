# PostgreSQL Setup Guide untuk YK Construction

## 1. Install PostgreSQL menggunakan Homebrew

```bash
# Update Homebrew
brew update

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Atau start sekali saja tanpa auto-start
pg_ctl -D /opt/homebrew/var/postgresql@15 start
```

## 2. Setup Database

```bash
# Login ke PostgreSQL
psql postgres

# Buat database untuk development
CREATE DATABASE yk_construction_dev;

# Buat user untuk aplikasi (opsional)
CREATE USER yk_user WITH PASSWORD 'yk_password';
GRANT ALL PRIVILEGES ON DATABASE yk_construction_dev TO yk_user;

# Keluar dari psql
\q
```

## 3. Test Connection

```bash
# Test koneksi
psql -h localhost -p 5432 -U postgres -d yk_construction_dev
```

## 4. Environment Variables

Buat file `.env` di folder backend:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yk_construction_dev
DB_USERNAME=postgres
DB_PASSWORD=

# Atau jika menggunakan custom user
# DB_USERNAME=yk_user
# DB_PASSWORD=yk_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# API Configuration
API_RATE_LIMIT=1000
API_RATE_WINDOW=900000
```

## 5. Alternative: Install menggunakan Postgres.app

Download dari: https://postgresapp.com/
- Simple drag & drop installation
- Includes pgAdmin
- Auto-starts with system

## 6. Run Database Migrations

Setelah PostgreSQL running:

```bash
cd backend

# Install dependencies jika belum
npm install

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start server
npm start
```

## 7. Troubleshooting

### PostgreSQL tidak start:
```bash
# Check status
brew services list | grep postgresql

# Force restart
brew services restart postgresql@15

# Check logs
tail -f /opt/homebrew/var/log/postgresql@15.log
```

### Connection refused:
```bash
# Check if PostgreSQL is listening
lsof -i :5432

# Check PostgreSQL config
psql postgres -c "SHOW config_file;"
```

### Permission issues:
```bash
# Fix permissions
sudo chown -R $(whoami) /opt/homebrew/var/postgresql@15
```
