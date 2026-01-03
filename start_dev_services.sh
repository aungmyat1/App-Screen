#!/bin/bash

# Script to start development services for App-Screen
# This script can be run manually to start all development services

echo "Starting App-Screen development services..."

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure we're in the right directory
cd /workspaces/App-Screen

# Start backend services if they exist
if [ -d "backend" ]; then
    cd backend
    
    # Start the backend API server in development mode on port 5000
    if [ -f "start_api.sh" ]; then
        echo "Starting backend API server on port 5000..."
        bash start_api.sh &
        echo "Backend API server started on port 5000"
    elif [ -f "src/main.py" ]; then
        source venv/bin/activate 2>/dev/null || true
        python -m uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload &
        echo "Backend API server started on port 5000"
    fi
    
    # Start Celery workers if they exist
    if [ -f "start_workers.sh" ]; then
        echo "Starting Celery workers..."
        bash start_workers.sh &
        echo "Celery workers started"
    fi
    
    # Start Celery beat if it exists
    if [ -f "start_beat.sh" ]; then
        echo "Starting Celery beat..."
        bash start_beat.sh &
        echo "Celery beat started"
    fi
    
    # Start Flower monitoring if available
    if [ -f "start_flower.sh" ]; then
        echo "Starting Flower monitoring..."
        bash start_flower.sh &
        echo "Flower monitoring started"
    fi
fi

# Start the frontend development server
cd /workspaces/App-Screen
if [ -f "package.json" ]; then
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "Starting frontend development server on port 3000..."
        npm run dev -- --host 0.0.0.0 &
        echo "Frontend development server started on port 3000"
    else
        echo "Vite configuration not found, trying other options..."
        if command -v npm &> /dev/null; then
            npm start &
            echo "Frontend development server started"
        fi
    fi
fi

echo "All development services have been started!"
echo "Frontend should be available on port 3000"
echo "Backend API should be available on port 5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo "To keep services running in background, run this script with 'nohup' or in a detached screen session"