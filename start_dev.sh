#!/bin/bash

# Improved startup script for App-Screen development environment
# Addresses all feedback points including error handling, service readiness, and process supervision

set -Eeuo pipefail  # More robust error handling

echo "🚀 Starting App-Screen development environment..."

# Set environment to development
export ENVIRONMENT=development

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

# Start backend API in the background
echo "🐍 Starting backend API server..."
if [ -d "$WORKSPACE_PATH/backend" ]; then
    cd "$WORKSPACE_PATH/backend" || exit 1
    
    # Check and activate Python virtual environment
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    elif [ -d "$WORKSPACE_PATH/venv" ]; then
        source "$WORKSPACE_PATH/venv/bin/activate"
    else
        echo "⚠️ Python virtual environment not found, attempting to create..."
        python3 -m venv venv
        source venv/bin/activate
        if [ -f "$WORKSPACE_PATH/requirements.txt" ]; then
            pip install -r "$WORKSPACE_PATH/requirements.txt"
        fi
    fi
    
    # Check if API files exist before starting
    if [ -f "src/main.py" ] || [ -f "src/api/main.py" ] || [ -f "$WORKSPACE_PATH/src/main.py" ] || [ -f "$WORKSPACE_PATH/src/api/main.py" ]; then
        echo "📦 Starting backend API server on port 8000..."
        nohup uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
        BACKEND_PID=$!
        echo "✅ Backend API server started with PID $BACKEND_PID"
        
        # Wait for backend to be ready
        if wait_for_service "Backend API" 8000 20 3; then
            echo "✅ Backend API is ready"
        else
            echo "⚠️ Backend API may not have started properly"
        fi
    else
        echo "⚠️ Backend API files not found. Skipping backend start."
    fi
    cd "$WORKSPACE_PATH" || exit 1
else
    echo "⚠️ Backend directory not found. Skipping backend start."
fi

# Start frontend in the background
echo "⚛️ Starting frontend development server..."
if [ -f "$WORKSPACE_PATH/package.json" ]; then
    cd "$WORKSPACE_PATH"
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        echo "📦 Starting frontend development server on port 5173..."
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
        echo "⚠️ Vite configuration not found, trying alternative start method..."
        if command -v npm &> /dev/null; then
            nohup npm start > frontend.log 2>&1 &
            FRONTEND_PID=$!
            echo "✅ Frontend development server started with PID $FRONTEND_PID"
        else
            echo "❌ NPM not available, cannot start frontend"
        fi
    fi
else
    echo "⚠️ package.json not found. Skipping frontend start."
fi

# Start Celery worker if available (for backend tasks)
if [ -d "$WORKSPACE_PATH/backend" ] && [ -f "$WORKSPACE_PATH/backend/start_workers.sh" ]; then
    cd "$WORKSPACE_PATH/backend"
    chmod +x start_workers.sh
    echo "⚡ Starting Celery worker..."
    nohup ./start_workers.sh > worker.log 2>&1 &
    WORKER_PID=$!
    echo "✅ Celery worker started with PID $WORKER_PID"
    cd "$WORKSPACE_PATH"
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
echo "🎉 Development environment started!"
echo "🌐 Backend API available at: http://localhost:8000 (if running)"
echo "📊 Backend API docs available at: http://localhost:8000/docs (if running)"
echo "🌐 Frontend available at: http://localhost:5173 (or as shown in the npm output)"
echo ""
echo "📋 Process IDs have been saved to /tmp/appscreen_pids"
echo ""
echo "💡 Tip: In GitHub Codespaces, make sure ports 5173 and 8000 are set as Public"
echo "using the Ports tab in the lower panel of your VSCode window."

# Monitor background processes
monitor_processes() {
    for pid in "${PIDS[@]}"; do
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

echo "🏁 Development environment stopped."