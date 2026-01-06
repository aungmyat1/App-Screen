#!/bin/bash

# Improved script to start development services for App-Screen
# This script can be run manually to start all development services
# Incorporates best practices for service readiness and process supervision

set -Eeuo pipefail

echo "🚀 Starting App-Screen development services..."

# Use the workspace folder environment variable with fallback
WORKSPACE_PATH="${WORKSPACE_FOLDER:-/workspaces/App-Screen}"

# Function to check if a port is available
check_port_availability() {
    local port=$1
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "❌ Port $port is already in use"
            return 1
        else
            echo "✅ Port $port is available"
            return 0
        fi
    else
        # Fallback for systems without lsof
        if command -v nc &> /dev/null; then
            nc -z localhost $port
            if [ $? -eq 0 ]; then
                echo "❌ Port $port is already in use"
                return 1
            else
                echo "✅ Port $port is available"
                return 0
            fi
        fi
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=${3:-30}
    local sleep_time=${4:-2}
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if command -v nc &> /dev/null; then
            if nc -z localhost $port; then
                echo "✅ $service_name is ready on port $port"
                return 0
            fi
        elif command -v curl &> /dev/null; then
            if curl -sf "http://localhost:$port" > /dev/null 2>&1; then
                echo "✅ $service_name is ready on port $port"
                return 0
            fi
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - waiting for $service_name..."
        sleep $sleep_time
        attempt=$((attempt + 1))
    done
    
    echo "❌ Timeout waiting for $service_name to be ready"
    return 1
}

# Check port availability before starting services
check_port_availability 8000  # Backend API
check_port_availability 5173  # Frontend (Vite default)

# Ensure we're in the right directory
cd "$WORKSPACE_PATH" || exit 1

# Check if Python virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if requirements changed
if [ -f "requirements.txt" ]; then
    echo "📦 Checking and installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
fi

# Install Playwright browsers if not already installed
if python -c "import playwright" &> /dev/null; then
    echo "🎮 Ensuring Playwright browsers are installed..."
    python -m playwright install chromium --quiet
else
    echo "⚠️ Playwright not found in requirements, skipping browser installation"
fi

# Check if Node dependencies are installed
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start backend services if they exist
if [ -d "src" ] || [ -d "$WORKSPACE_PATH/src" ]; then
    # Determine the correct source directory
    if [ -d "$WORKSPACE_PATH/src" ]; then
        cd "$WORKSPACE_PATH"
    fi
    
    # Start the backend API server in development mode
    echo "🐍 Starting backend API server on port 8000..."
    nohup uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend API server started with PID $BACKEND_PID"
    
    # Wait for backend to be ready
    if wait_for_service "Backend API" 8000 20 3; then
        echo "✅ Backend API is ready"
    else
        echo "⚠️ Backend API may not have started properly"
    fi
    
    # Start Celery worker in background if available
    if command -v celery &> /dev/null; then
        echo "⚡ Starting Celery worker..."
        nohup celery -A src.workers worker --loglevel=info --hostname=appscreen_worker > worker.log 2>&1 &
        WORKER_PID=$!
        echo "✅ Celery worker started with PID $WORKER_PID"
    fi
fi

# Start the frontend development server
if [ -f "package.json" ]; then
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "⚛️ Starting frontend development server on port 5173..."
        nohup npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo "✅ Frontend development server started with PID $FRONTEND_PID"
        
        # Wait for frontend to be ready
        if wait_for_service "Frontend" 5173 15 2; then
            echo "✅ Frontend is ready"
        else
            echo "⚠️ Frontend may not have started properly"
        fi
    else
        echo "ℹ️ Vite configuration not found, trying other options..."
        if command -v npm &> /dev/null; then
            nohup npm start > frontend.log 2>&1 &
            FRONTEND_PID=$!
            echo "✅ Frontend development server started with PID $FRONTEND_PID"
        fi
    fi
fi

# Create a file to track the PIDs so we can stop them later
PIDS=()
[ -n "${BACKEND_PID:-}" ] && PIDS+=("$BACKEND_PID")
[ -n "${FRONTEND_PID:-}" ] && PIDS+=("$FRONTEND_PID")
[ -n "${WORKER_PID:-}" ] && PIDS+=("$WORKER_PID")

if [ ${#PIDS[@]} -gt 0 ]; then
    echo "${PIDS[@]}" > /tmp/appscreen_pids
fi

echo ""
echo "✅ All development services have been started!"
echo "🌐 Frontend should be available on http://localhost:5173"
echo "📊 Backend API should be available on http://localhost:8000"
echo "📋 Backend API docs available on http://localhost:8000/docs"
echo ""
echo "📋 Process IDs have been saved to /tmp/appscreen_pids"
echo ""
echo "💡 In GitHub Codespaces, make sure to set ports 5173 and 8000 as Public"
echo "using the Ports tab in the lower panel of your VSCode window."

# Monitor background processes
monitor_processes() {
    for pid in "${PIDS[@]:-}"; do
        if ! kill -0 "$pid" 2>/dev/null; then
            echo "⚠️ Process with PID $pid has stopped"
            return 1
        fi
    done
    return 0
}

# Keep script running and monitor processes
while true; do
    sleep 10
    if ! monitor_processes; then
        echo "❌ One or more processes have stopped. Check logs for details."
        break
    fi
done

echo "🏁 Development services stopped."