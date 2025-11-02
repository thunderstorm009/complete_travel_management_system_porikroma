#!/bin/bash

# Porikroma Travel Platform - Stop Script
# This script stops all running services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Porikroma Travel Platform...${NC}"

# Function to check if a port is in use and kill the process
kill_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}🔄 Stopping $service_name on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${RED}❌ Failed to stop $service_name${NC}"
        fi
    else
        echo -e "${YELLOW}ℹ️  No $service_name running on port $port${NC}"
    fi
}

# Kill processes using PID files if they exist
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    echo -e "${YELLOW}🔄 Stopping backend process (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    rm -f backend.pid
fi

if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    echo -e "${YELLOW}🔄 Stopping frontend process (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null || true
    rm -f frontend.pid
fi

# Kill any remaining processes on the ports
kill_port 8080 "Backend API"
kill_port 9092 "Socket.IO Server"
kill_port 3000 "Frontend Dev Server"

# Clean up log files
echo -e "${YELLOW}🧹 Cleaning up log files...${NC}"
rm -f backend.log frontend.log

echo -e "${GREEN}✅ All services stopped successfully!${NC}"