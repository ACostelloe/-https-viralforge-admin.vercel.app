#!/bin/bash

# ViralForge AI - Complete System Setup Script
# This script sets up both the backend API and admin control panel

set -e

echo "🚀 ViralForge AI - Complete System Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed (for development)
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. You'll need it for admin panel development."
        return 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    return 0
}

# Setup environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "config.env" ]; then
        if [ -f "config.env.example" ]; then
            cp config.env.example config.env
            print_success "Created config.env from example"
        else
            print_error "config.env.example not found"
            exit 1
        fi
    else
        print_warning "config.env already exists, skipping..."
    fi
    
    # Admin panel environment
    if [ ! -f "admin-panel/.env" ]; then
        if [ -f "admin-panel/env.example" ]; then
            cp admin-panel/env.example admin-panel/.env
            print_success "Created admin-panel/.env from example"
        else
            print_warning "admin-panel/env.example not found, creating basic .env"
            cat > admin-panel/.env << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME="ViralForge AI"
VITE_APP_VERSION=1.0.0
VITE_MOCK_API=true
EOF
        fi
    else
        print_warning "admin-panel/.env already exists, skipping..."
    fi
}

# Install admin panel dependencies
install_admin_deps() {
    if check_node; then
        print_status "Installing admin panel dependencies..."
        cd admin-panel
        
        if [ -f "package-lock.json" ]; then
            npm ci
        else
            npm install
        fi
        
        print_success "Admin panel dependencies installed"
        cd ..
    else
        print_warning "Skipping admin panel dependency installation (Node.js not available)"
    fi
}

# Build and start services
start_services() {
    print_status "Building and starting ViralForge AI services..."
    
    # Build all services
    docker-compose build
    
    # Start services
    docker-compose up -d
    
    print_success "All services started successfully!"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for API
    print_status "Waiting for API server..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            print_success "API server is ready"
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "API server may not be ready yet"
    fi
    
    # Wait for Admin Panel
    print_status "Waiting for Admin Panel..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Admin Panel is ready"
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "Admin Panel may not be ready yet"
    fi
}

# Display service URLs
show_urls() {
    echo ""
    echo "🎉 ViralForge AI Setup Complete!"
    echo "================================"
    echo ""
    echo "📊 Admin Control Panel: http://localhost:3000"
    echo "🔧 API Server:          http://localhost:8000"
    echo "📋 API Documentation:   http://localhost:8000/docs"
    echo "🔍 Redis Insight:       http://localhost:8001"
    echo "🗄️  PostgreSQL:          localhost:5432"
    echo ""
    echo "📖 Documentation:"
    echo "   - Backend API:       ./README.md"
    echo "   - Admin Panel:       ./admin-panel/README.md"
    echo "   - Development Guide: ./DEVELOPMENT.md"
    echo ""
    echo "🛠️  Useful Commands:"
    echo "   - View logs:         docker-compose logs -f"
    echo "   - Stop services:     docker-compose down"
    echo "   - Restart services:  docker-compose restart"
    echo "   - Admin dev mode:    cd admin-panel && npm run dev"
    echo ""
}

# Development mode setup
setup_dev_mode() {
    if [ "$1" = "--dev" ]; then
        print_status "Setting up development mode..."
        
        # Start only backend services
        docker-compose up -d postgres redis viralforge-api viralforge-worker viralforge-scheduler
        
        if check_node; then
            print_status "Starting admin panel in development mode..."
            cd admin-panel
            npm run dev &
            ADMIN_PID=$!
            cd ..
            
            echo ""
            echo "🔥 Development Mode Active!"
            echo "=========================="
            echo ""
            echo "📊 Admin Panel (Dev):   http://localhost:5173"
            echo "🔧 API Server:          http://localhost:8000"
            echo ""
            echo "Press Ctrl+C to stop development server"
            
            # Wait for Ctrl+C
            trap "kill $ADMIN_PID 2>/dev/null; docker-compose down; exit" INT
            wait $ADMIN_PID
        else
            print_error "Node.js required for development mode"
            exit 1
        fi
        
        return 0
    fi
    return 1
}

# Main execution
main() {
    # Check for development mode
    if setup_dev_mode "$1"; then
        return 0
    fi
    
    # Regular setup
    check_docker
    setup_env_files
    install_admin_deps
    start_services
    wait_for_services
    show_urls
}

# Help message
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "ViralForge AI Setup Script"
    echo ""
    echo "Usage:"
    echo "  ./setup-admin.sh          # Full production setup"
    echo "  ./setup-admin.sh --dev    # Development mode"
    echo "  ./setup-admin.sh --help   # Show this help"
    echo ""
    echo "Requirements:"
    echo "  - Docker & Docker Compose"
    echo "  - Node.js 18+ (for development)"
    echo ""
    exit 0
fi

# Run main function
main "$1" 