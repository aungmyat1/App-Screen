#!/bin/bash

# Post-start script for App-Screen SaaS Development DevContainer

echo "Starting App-Screen services..."

# Wait for services to be ready
echo "Waiting for PostgreSQL, Redis and MinIO to be ready..."
sleep 15

# Check if backend is available and start development servers
if [ -d "/workspace/backend" ]; then
    cd /workspace/backend
    
    # Start the backend API server in development mode on port 5000
    if [ -f "start_api.sh" ]; then
        echo "Starting backend API server on port 5000..."
        # Create a temporary version of start_api.sh that runs on port 5000
        sed 's/--port 8000/--port 5000/' start_api.sh > start_api_dev.sh
        bash start_api_dev.sh &
        rm start_api_dev.sh  # Clean up temporary file
    elif [ -f "src/main.py" ]; then
        python -m uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload &
    fi
    
    # Start Celery workers if they exist
    if [ -f "start_workers.sh" ]; then
        echo "Starting Celery workers..."
        bash start_workers.sh &
    elif [ -f "workers/worker.py" ]; then
        cd workers
        python worker.py &
    fi
fi

# Start the frontend development server if needed
if [ -f "/workspace/package.json" ]; then
    cd /workspace
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "Starting frontend development server on port 3000..."
        npm run dev -- --host 0.0.0.0 &
    elif [ -f "start.sh" ]; then
        bash start.sh &
    fi
fi

# Wait a bit more to ensure services are running
sleep 5

echo "Services started successfully! The development environment is ready."
echo "Frontend should be available on port 3000"
echo "Backend API (dev) should be available on port 5000"
echo "PostgreSQL is on port 5432"
echo "Redis is on port 6379"
echo "MinIO is on port 9000"
echo "MailHog SMTP on port 1025, Web UI on port 8025"