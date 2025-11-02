# Porikroma Travel Platform - Startup Scripts

This directory contains helpful scripts to manage the Porikroma Travel Platform development environment.

## Prerequisites

Before running the scripts, ensure you have:

- **Java 11+** (for Spring Boot backend)
- **Maven 3.6+** (for building the backend)
- **Node.js 16+** (for React frontend)
- **npm** (comes with Node.js)
- **MySQL** running on localhost:3306 with the `porikroma` database

## Scripts Overview

### 🚀 `./run.sh`

**Main startup script** - Starts the entire application stack

- Cleans up any existing processes
- Starts Spring Boot backend (port 8080)
- Starts Socket.IO server (port 9092)
- Starts React frontend (port 5173)
- Provides colored output and progress indicators
- Creates log files for monitoring

### 🛑 `./stop.sh`

**Stop script** - Gracefully stops all services

- Stops backend and frontend processes
- Cleans up PID files
- Removes log files

### 🧹 `./cleanup.sh`

**Cleanup script** - Performs thorough cleanup

- Kills any remaining Java/Node processes
- Cleans up all temporary files
- Optionally removes node_modules and build files
- Resets the development environment

## Usage

### Start the Application

```bash
./run.sh
```

### Stop the Application

```bash
./stop.sh
```

or press `Ctrl+C` while `run.sh` is running

### Clean Everything

```bash
./cleanup.sh
```

## Service URLs

When running, the application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Socket.IO**: http://localhost:9092

## Logs

The startup script creates log files:

- `backend.log` - Spring Boot application logs
- `frontend.log` - React/Vite development server logs

Monitor logs in real-time:

```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
./cleanup.sh
./run.sh
```

### Services Won't Start

1. Check if MySQL is running
2. Verify Java/Node.js versions
3. Run cleanup and try again:

```bash
./cleanup.sh
./run.sh
```

### Database Connection Issues

Make sure MySQL is running with the correct credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/porikroma
spring.datasource.username=root
spring.datasource.password=your-password
```

## Development Workflow

1. **First time setup**:

   ```bash
   # Import database schema and sample data
   mysql -u root -p porikroma < database/schema.sql
   mysql -u root -p porikroma < database/sample_data.sql

   # Start the application
   ./run.sh
   ```

2. **Daily development**:

   ```bash
   ./run.sh    # Start everything
   # ... do your development work ...
   ./stop.sh   # Stop when done
   ```

3. **Fresh start** (if issues occur):
   ```bash
   ./cleanup.sh  # Clean everything
   ./run.sh      # Start fresh
   ```

## Notes

- The backend must start first and be ready before the frontend starts
- Socket.IO server starts automatically with the Spring Boot application
- Frontend hot-reloading is enabled for development
- All processes run in the background with proper logging
