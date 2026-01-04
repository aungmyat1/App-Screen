#!/bin/bash

# Script to start development services for App-Screen
# This script can be run manually to start all development services

echo "🚀 Starting App-Screen development services..."

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure we're in the right directory
cd /workspaces/App-Screen

# Check if Python virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Python virtual environment not found, creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if requirements changed
echo "Checking and installing Python dependencies..."
pip install -r requirements.txt

# Install Playwright browsers if not already installed
echo "Ensuring Playwright browsers are installed..."
python -m playwright install chromium --quiet

# Check if Node dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Start backend services if they exist
if [ -d "src" ]; then
    # Start the backend API server in development mode
    echo "🐍 Starting backend API server on port 8000..."
    uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    echo "Backend API server started with PID $BACKEND_PID"
    
    # Start Celery worker in background if available
    if command -v celery &> /dev/null; then
        echo "⚡ Starting Celery worker..."
        celery -A src.workers worker --loglevel=info --detach
        echo "Celery worker started"
    fi
    
    # Small delay to ensure backend is starting
    sleep 3
fi

# Start the frontend development server
if [ -f "package.json" ]; then
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "⚛️ Starting frontend development server on port 5173..."
        npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo "Frontend development server started with PID $FRONTEND_PID"
    else
        echo "Vite configuration not found, trying other options..."
        if command -v npm &> /dev/null; then
            npm start &
            FRONTEND_PID=$!
            echo "Frontend development server started with PID $FRONTEND_PID"
        fi
    fi
fi

echo "✅ All development services have been started!"
echo "🌐 Frontend should be available on http://localhost:5173"
echo "🌐 Backend API should be available on http://localhost:8000"
echo "📊 Backend API docs available on http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""
echo "Note: If running in GitHub Codespaces, make sure to set ports 5173 and 8000 as Public"
echo "using the Ports tab in the lower panel of your VSCode window."

# Wait for processes to complete
if [ -n "$BACKEND_PID" ] && [ -n "$FRONTEND_PID" ]; then
    wait $BACKEND_PID $FRONTEND_PID
elif [ -n "$BACKEND_PID" ]; then
    wait $BACKEND_PID
elif [ -n "$FRONTEND_PID" ]; then
    wait $FRONTEND_PID
fi