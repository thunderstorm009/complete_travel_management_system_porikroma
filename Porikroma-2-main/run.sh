#!/bin/bash

# Porikroma Travel Platform - Startup Script
# This script starts the backend first, then the frontend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Porikroma Travel Platform...${NC}"
echo -e "${BLUE}================================================${NC}"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=60
    local attempt=0
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if check_port $port; then
            echo -e "${GREEN}✅ $service_name is ready on port $port${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
        echo -e "${YELLOW}   Attempt $attempt/$max_attempts...${NC}"
    done
    
    echo -e "${RED}❌ $service_name failed to start on port $port after $max_attempts attempts${NC}"
    echo -e "${YELLOW}💡 Check the logs for more details:${NC}"
    if [ "$service_name" = "Backend API" ]; then
        echo -e "${YELLOW}   tail -f backend.log${NC}"
    elif [ "$service_name" = "Frontend Development Server" ]; then
        echo -e "${YELLOW}   tail -f frontend.log${NC}"
    fi
    return 1
}

# Check if required directories exist
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Frontend directory not found!${NC}"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Maven first${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Node.js first${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install npm first${NC}"
    exit 1
fi

# Kill existing processes on ports if they exist
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"

# Kill processes on backend ports
if check_port 8080; then
    echo -e "${YELLOW}   Stopping existing backend process on port 8080...${NC}"
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
fi

if check_port 9092; then
    echo -e "${YELLOW}   Stopping existing Socket.IO process on port 9092...${NC}"
    lsof -ti:9092 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on frontend port
if check_port 3000; then
    echo -e "${YELLOW}   Stopping existing frontend process on port 3000...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

sleep 2

# Start Backend
echo -e "${BLUE}🏗️  Starting Backend (Spring Boot)...${NC}"
echo -e "${BLUE}================================================${NC}"

cd backend

# Clean and install dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
mvn clean install -DskipTests

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed!${NC}"
    exit 1
fi

# Start Spring Boot application in background
echo -e "${YELLOW}🚀 Starting Spring Boot application...${NC}"
nohup mvn spring-boot:run -DskipTests > ../backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}📝 Backend started with PID: $BACKEND_PID${NC}"
echo -e "${YELLOW}📋 Backend logs are being written to backend.log${NC}"

# Wait for backend to be ready
if ! wait_for_service 8080 "Backend API"; then
    echo -e "${RED}❌ Backend failed to start properly${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Wait for Socket.IO to be ready
if ! wait_for_service 9092 "Socket.IO Server"; then
    echo -e "${RED}❌ Socket.IO server failed to start properly${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend (React)...${NC}"
echo -e "${BLUE}================================================${NC}"

cd frontend

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed!${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start React development server
echo -e "${YELLOW}🚀 Starting React development server...${NC}"
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}📝 Frontend started with PID: $FRONTEND_PID${NC}"
echo -e "${YELLOW}📋 Frontend logs are being written to frontend.log${NC}"

# Wait for frontend to be ready
if ! wait_for_service 3000 "Frontend Development Server"; then
    echo -e "${RED}❌ Frontend failed to start properly${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Success message
echo -e "${GREEN}🎉 SUCCESS! Porikroma Travel Platform is now running!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🔗 Frontend:  http://localhost:3000${NC}"
echo -e "${GREEN}🔗 Backend:   http://localhost:8080${NC}"
echo -e "${GREEN}🔗 Socket.IO: http://localhost:9092${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "${YELLOW}   Backend:  tail -f backend.log${NC}"
echo -e "${YELLOW}   Frontend: tail -f frontend.log${NC}"
echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}🛑 To stop all services, run: ./stop.sh${NC}"
echo -e "${YELLOW}   Or press Ctrl+C and then run: ./cleanup.sh${NC}"

# Create PID file for cleanup
echo "$BACKEND_PID" > backend.pid
echo "$FRONTEND_PID" > frontend.pid

# Keep script running and handle Ctrl+C
trap 'echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; rm -f backend.pid frontend.pid backend.log frontend.log; echo -e "${GREEN}✅ Services stopped${NC}"; exit 0' INT

echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Wait for processes to finish
wait $BACKEND_PID $FRONTEND_PID