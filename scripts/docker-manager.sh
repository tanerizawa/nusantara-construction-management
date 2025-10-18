#!/bin/bash

# ========================================
# Docker Helper Scripts - Main Menu
# ========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║          🐳 NUSANTARA YK - DOCKER MANAGEMENT SCRIPT             ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to display menu
show_menu() {
    echo -e "${YELLOW}📋 Available Commands:${NC}"
    echo ""
    echo -e "${GREEN}  1) start${NC}            - Start all services (database, backend, frontend)"
    echo -e "${GREEN}  2) stop${NC}             - Stop all services"
    echo -e "${GREEN}  3) restart${NC}          - Restart all services"
    echo -e "${GREEN}  4) logs${NC}             - View logs (all services)"
    echo -e "${GREEN}  5) migrate${NC}          - Run database migrations"
    echo -e "${GREEN}  6) seed${NC}             - Run database seeders"
    echo -e "${GREEN}  7) test${NC}             - Run API tests"
    echo -e "${GREEN}  8) shell-backend${NC}    - Open shell in backend container"
    echo -e "${GREEN}  9) shell-db${NC}         - Open PostgreSQL shell"
    echo -e "${GREEN} 10) pgadmin${NC}          - Start PgAdmin (database UI)"
    echo -e "${GREEN} 11) build${NC}            - Rebuild all containers"
    echo -e "${GREEN} 12) clean${NC}            - Clean up (remove containers, volumes)"
    echo -e "${GREEN} 13) status${NC}           - Show service status"
    echo -e "${GREEN} 14) setup${NC}            - Initial setup (build + migrate + seed)"
    echo -e "${GREEN} 15) user-mgmt-test${NC}   - Test User Management API"
    echo -e "${GREEN} 16) notifications-test${NC} - Test Notification System"
    echo -e "${RED} 0) exit${NC}             - Exit"
    echo ""
}

# Function to start services
start_services() {
    echo -e "${BLUE}🚀 Starting services...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml up -d postgres backend frontend
    echo -e "${GREEN}✅ Services started!${NC}"
    echo ""
    echo "Access points:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:5000"
    echo "  - Database: localhost:5432"
}

# Function to stop services
stop_services() {
    echo -e "${BLUE}🛑 Stopping services...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml down
    echo -e "${GREEN}✅ Services stopped!${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${BLUE}🔄 Restarting services...${NC}"
    stop_services
    sleep 2
    start_services
}

# Function to view logs
view_logs() {
    echo -e "${BLUE}📜 Viewing logs... (Press Ctrl+C to exit)${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml logs -f --tail=100
}

# Function to run migrations
run_migrations() {
    echo -e "${BLUE}📊 Running migrations...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml --profile tools run --rm migrations
    echo -e "${GREEN}✅ Migrations completed!${NC}"
}

# Function to run seeders
run_seeders() {
    echo -e "${BLUE}🌱 Running seeders...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml --profile tools run --rm seed
    echo -e "${GREEN}✅ Seeders completed!${NC}"
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}🧪 Running tests...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml --profile tools run --rm test
}

# Function to open backend shell
backend_shell() {
    echo -e "${BLUE}🖥️  Opening backend shell...${NC}"
    docker exec -it nusantara-backend sh
}

# Function to open database shell
db_shell() {
    echo -e "${BLUE}🗄️  Opening database shell...${NC}"
    docker exec -it nusantara-postgres psql -U admin -d nusantara_construction
}

# Function to start PgAdmin
start_pgadmin() {
    echo -e "${BLUE}🔧 Starting PgAdmin...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml --profile tools up -d pgadmin
    echo -e "${GREEN}✅ PgAdmin started!${NC}"
    echo "  Access: http://localhost:5050"
    echo "  Email: admin@nusantara.com"
    echo "  Password: admin123"
}

# Function to rebuild containers
rebuild() {
    echo -e "${BLUE}🔨 Rebuilding containers...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml build --no-cache
    echo -e "${GREEN}✅ Rebuild completed!${NC}"
}

# Function to clean up
cleanup() {
    echo -e "${RED}⚠️  This will remove all containers and volumes!${NC}"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${BLUE}🧹 Cleaning up...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose -f docker-compose.complete.yml down -v
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup completed!${NC}"
    else
        echo "Cancelled."
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.complete.yml ps
}

# Function for initial setup
initial_setup() {
    echo -e "${MAGENTA}🎯 Running initial setup...${NC}"
    echo ""
    echo "This will:"
    echo "  1. Build all containers"
    echo "  2. Start services"
    echo "  3. Run migrations"
    echo "  4. Run seeders (optional)"
    echo ""
    read -p "Continue? (yes/no): " -r
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        cd "$PROJECT_ROOT"
        
        echo -e "${BLUE}Step 1/4: Building containers...${NC}"
        docker-compose -f docker-compose.complete.yml build
        
        echo -e "${BLUE}Step 2/4: Starting services...${NC}"
        docker-compose -f docker-compose.complete.yml up -d postgres backend frontend
        
        echo -e "${BLUE}Step 3/4: Waiting for services to be ready...${NC}"
        sleep 10
        
        echo -e "${BLUE}Step 4/4: Running migrations...${NC}"
        docker-compose -f docker-compose.complete.yml --profile tools run --rm migrations
        
        echo ""
        read -p "Run seeders? (yes/no): " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            docker-compose -f docker-compose.complete.yml --profile tools run --rm seed
        fi
        
        echo ""
        echo -e "${GREEN}✅ Setup completed!${NC}"
        echo ""
        echo "Access points:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend:  http://localhost:5000"
        echo "  - Database: localhost:5432"
    else
        echo "Setup cancelled."
    fi
}

# Function to test User Management API
test_user_management() {
    echo -e "${BLUE}🧪 Testing User Management API...${NC}"
    
    # Check if backend is running
    if ! docker ps | grep -q nusantara-backend; then
        echo -e "${RED}❌ Backend is not running. Start services first!${NC}"
        return 1
    fi
    
    echo ""
    echo "Testing endpoints:"
    echo ""
    
    # Test 1: Get user statistics
    echo -e "${CYAN}1. GET /api/users/management/stats${NC}"
    curl -s http://localhost:5000/api/users/management/stats | json_pp || echo "Failed"
    echo ""
    
    # Test 2: List users
    echo -e "${CYAN}2. GET /api/users/management${NC}"
    curl -s http://localhost:5000/api/users/management | json_pp || echo "Failed"
    echo ""
    
    echo -e "${GREEN}✅ User Management tests completed!${NC}"
}

# Function to test Notifications
test_notifications() {
    echo -e "${BLUE}🔔 Testing Notification System...${NC}"
    
    # Check if backend is running
    if ! docker ps | grep -q nusantara-backend; then
        echo -e "${RED}❌ Backend is not running. Start services first!${NC}"
        return 1
    fi
    
    echo ""
    echo "Testing endpoints:"
    echo ""
    
    # Test 1: Get notification preferences
    echo -e "${CYAN}1. GET /api/user-notifications/preferences?userId=U001${NC}"
    curl -s "http://localhost:5000/api/user-notifications/preferences?userId=U001" | json_pp || echo "Failed"
    echo ""
    
    # Test 2: Get user notifications
    echo -e "${CYAN}2. GET /api/user-notifications/my?userId=U001${NC}"
    curl -s "http://localhost:5000/api/user-notifications/my?userId=U001" | json_pp || echo "Failed"
    echo ""
    
    echo -e "${GREEN}✅ Notification tests completed!${NC}"
}

# Main menu loop
if [ $# -eq 0 ]; then
    while true; do
        show_menu
        read -p "Enter command (1-16 or 0): " choice
        echo ""
        
        case $choice in
            1|start) start_services ;;
            2|stop) stop_services ;;
            3|restart) restart_services ;;
            4|logs) view_logs ;;
            5|migrate) run_migrations ;;
            6|seed) run_seeders ;;
            7|test) run_tests ;;
            8|shell-backend) backend_shell ;;
            9|shell-db) db_shell ;;
            10|pgadmin) start_pgadmin ;;
            11|build) rebuild ;;
            12|clean) cleanup ;;
            13|status) show_status ;;
            14|setup) initial_setup ;;
            15|user-mgmt-test) test_user_management ;;
            16|notifications-test) test_notifications ;;
            0|exit) 
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0 
                ;;
            *) 
                echo -e "${RED}Invalid option!${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
        clear
    done
else
    # Direct command execution
    case $1 in
        start) start_services ;;
        stop) stop_services ;;
        restart) restart_services ;;
        logs) view_logs ;;
        migrate) run_migrations ;;
        seed) run_seeders ;;
        test) run_tests ;;
        shell-backend) backend_shell ;;
        shell-db) db_shell ;;
        pgadmin) start_pgadmin ;;
        build) rebuild ;;
        clean) cleanup ;;
        status) show_status ;;
        setup) initial_setup ;;
        user-mgmt-test) test_user_management ;;
        notifications-test) test_notifications ;;
        *) 
            echo -e "${RED}Unknown command: $1${NC}"
            show_menu
            exit 1
            ;;
    esac
fi
