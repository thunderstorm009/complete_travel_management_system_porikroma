#!/bin/bash

# Porikroma Travel Platform - Cleanup Script
# This script performs a thorough cleanup of all processes and files

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Performing thorough cleanup...${NC}"

# Kill any Java processes (Spring Boot)
echo -e "${YELLOW}🔄 Killing any Java processes...${NC}"
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "java.*porikroma" 2>/dev/null || true

# Kill any Node processes (React/Vite)
echo -e "${YELLOW}🔄 Killing any Node processes...${NC}"
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Kill processes on specific ports
echo -e "${YELLOW}🔄 Cleaning up ports...${NC}"
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:9092 | xargs kill -9 2>/dev/null || true  
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clean up PID files
echo -e "${YELLOW}🗑️  Removing PID files...${NC}"
rm -f backend.pid frontend.pid

# Clean up log files
echo -e "${YELLOW}🗑️  Removing log files...${NC}"
rm -f backend.log frontend.log

# Clean up any temporary Maven files
echo -e "${YELLOW}🗑️  Cleaning Maven temporary files...${NC}"
cd backend 2>/dev/null && mvn clean -q 2>/dev/null && cd .. || true

# Clean up Node modules and build artifacts (optional)
read -p "$(echo -e ${YELLOW}❓ Do you want to clean node_modules and build files? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Cleaning node_modules and build files...${NC}"
    cd frontend 2>/dev/null && rm -rf node_modules build dist .vite && cd .. || true
    echo -e "${GREEN}✅ Node modules and build files cleaned${NC}"
fi

sleep 2

echo -e "${GREEN}✅ Cleanup completed successfully!${NC}"
echo -e "${YELLOW}ℹ️  You can now run ./run.sh to start the application${NC}"