#!/bin/bash

# YK Construction Database Setup Script
# This script handles PostgreSQL database setup for development

echo "🏗️  YK Construction Database Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="yk_construction_dev"
DB_USER="yk_dev_user"
DB_PASSWORD="dev_password_123"
DB_TEST_NAME="yk_construction_test"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PostgreSQL is installed
check_postgresql() {
    print_status "Checking PostgreSQL installation..."
    
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is installed"
        psql --version
    else
        print_error "PostgreSQL is not installed!"
        echo ""
        echo "Please install PostgreSQL first:"
        echo "  macOS: brew install postgresql"
        echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        echo "  Windows: Download from https://www.postgresql.org/download/"
        exit 1
    fi
}

# Check if PostgreSQL service is running
check_postgresql_service() {
    print_status "Checking PostgreSQL service..."
    
    if pg_isready &> /dev/null; then
        print_success "PostgreSQL service is running"
    else
        print_warning "PostgreSQL service is not running"
        echo ""
        echo "Starting PostgreSQL service..."
        
        # Try to start PostgreSQL (macOS with Homebrew)
        if command -v brew &> /dev/null; then
            brew services start postgresql
        else
            print_error "Please start PostgreSQL service manually"
            echo "  macOS: brew services start postgresql"
            echo "  Ubuntu: sudo systemctl start postgresql"
            echo "  Windows: Start PostgreSQL service from Services panel"
            exit 1
        fi
        
        # Wait a bit for service to start
        sleep 3
        
        if pg_isready &> /dev/null; then
            print_success "PostgreSQL service started successfully"
        else
            print_error "Failed to start PostgreSQL service"
            exit 1
        fi
    fi
}

# Create database user
create_database_user() {
    print_status "Creating database user: $DB_USER"
    
    # Check if user already exists
    if psql -t -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" postgres 2>/dev/null | grep -q 1; then
        print_warning "User $DB_USER already exists"
    else
        # Create user
        psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" postgres
        psql -c "ALTER USER $DB_USER CREATEDB;" postgres
        print_success "Database user $DB_USER created"
    fi
}

# Create databases
create_databases() {
    print_status "Creating databases..."
    
    # Development database
    if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "Database $DB_NAME already exists"
    else
        createdb -O $DB_USER $DB_NAME
        print_success "Database $DB_NAME created"
    fi
    
    # Test database
    if psql -lqt | cut -d \| -f 1 | grep -qw $DB_TEST_NAME; then
        print_warning "Database $DB_TEST_NAME already exists"
    else
        createdb -O $DB_USER $DB_TEST_NAME
        print_success "Database $DB_TEST_NAME created"
    fi
}

# Install Node.js dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_error "package.json not found. Please run this script from the backend directory."
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if command -v npx &> /dev/null; then
        npx sequelize-cli db:migrate
        print_success "Database migrations completed"
    else
        print_error "npx not found. Please install Node.js and npm."
        exit 1
    fi
}

# Run database seeders
run_seeders() {
    print_status "Running database seeders..."
    
    npx sequelize-cli db:seed:all
    print_success "Database seeders completed"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    node -e "
        const { testConnection } = require('./config/database');
        testConnection().then(success => {
            if (success) {
                console.log('✅ Database connection test passed');
                process.exit(0);
            } else {
                console.log('❌ Database connection test failed');
                process.exit(1);
            }
        });
    "
}

# Main setup function
main() {
    echo ""
    print_status "Starting database setup process..."
    echo ""
    
    check_postgresql
    check_postgresql_service
    create_database_user
    create_databases
    install_dependencies
    run_migrations
    run_seeders
    test_connection
    
    echo ""
    print_success "🎉 Database setup completed successfully!"
    echo ""
    echo "Database Information:"
    echo "  Development DB: $DB_NAME"
    echo "  Test DB: $DB_TEST_NAME"
    echo "  User: $DB_USER"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo ""
    echo "You can now start the backend server with: npm start"
}

# Check if script is run with --help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "YK Construction Database Setup Script"
    echo ""
    echo "This script will:"
    echo "  1. Check PostgreSQL installation and service"
    echo "  2. Create database user and databases"
    echo "  3. Install Node.js dependencies"
    echo "  4. Run database migrations"
    echo "  5. Run database seeders"
    echo "  6. Test database connection"
    echo ""
    echo "Usage: ./setup-database.sh"
    echo ""
    echo "Requirements:"
    echo "  - PostgreSQL installed and running"
    echo "  - Node.js and npm installed"
    echo "  - Run from backend directory"
    exit 0
fi

# Run main function
main
