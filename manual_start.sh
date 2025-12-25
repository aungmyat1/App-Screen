#!/bin/bash

# Manual script to start services with better feedback and error handling
# This can be used if the automatic startup doesn't work

echo "🚀 Manually starting App-Screen services..."

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is free
    fi
}

# Check if backend port is available
if check_port 8000; then
    echo "✅ Port 8000 is available for backend"
else
    echo "❌ Port 8000 is already in use. Please stop the existing process."
    exit 1
fi

# Check if frontend port is available
if check_port 5173; then
    echo "✅ Port 5173 is available for frontend"
else
    echo "❌ Port 5173 is already in use. Please stop the existing process."
    exit 1
fi

# Start backend API in the background
echo "🐍 Starting backend API on port 8000..."
cd /workspaces/App-Screen/backend
if [ -f "/opt/venv/bin/uvicorn" ]; then
    /opt/venv/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
else
    echo "❌ Error: uvicorn not found in virtual environment"
    exit 1
fi

# Wait a moment for backend to start
sleep 3

# Check if backend is responding
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend API might not be responding yet, giving it more time..."
    sleep 5
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ Backend API is now responding"
    else
        echo "❌ Backend API is not responding. Check logs."
        exit 1
    fi
fi

# Start frontend development server in the background
echo "⚛️ Starting frontend on port 5173..."
cd /workspaces/App-Screen
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Small delay to allow frontend to start
sleep 2

# Wait for both processes
echo "✅ Services started successfully!"
echo "🌐 Backend API: http://localhost:8000 (docs at http://localhost:8000/docs)"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "💡 Tip: To stop these services, run: ./stop_services.sh"

# Create a file to track the PIDs so we can stop them later
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/appscreen_pids

# Wait for both processes to complete
wait $BACKEND_PID
wait $FRONTEND_PID