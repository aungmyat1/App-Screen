#!/bin/bash

# Script to start both backend API and frontend development servers

echo "🚀 Starting App-Screen services..."

# Check if backend API file exists before starting
if [ -f "/workspaces/App-Screen/src/api/main.py" ]; then
    API_PATH="src.api.main:app"
elif [ -f "/workspaces/App-Screen/src/main.py" ]; then
    API_PATH="src.main:app"
else
    echo "Backend API files not found. Checking for alternative locations..."
    if [ -d "/workspaces/App-Screen/src" ]; then
        echo "Available files in src:"
        find /workspaces/App-Screen/src -name "*.py" -type f
    else
        echo "Src directory does not exist"
    fi
    echo "This application requires the backend API files to be present."
    echo "Starting only the frontend for now..."
    API_AVAILABLE=false
fi

# Start backend API in the background if available
if [ "$API_AVAILABLE" != "false" ]; then
    echo "🐍 Starting backend API on port 8000..."
    cd /workspaces/App-Screen
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    elif [ -f "/opt/venv/bin/activate" ]; then
        source /opt/venv/bin/activate
    else
        echo "Warning: No virtual environment found"
    fi
    uvicorn $API_PATH --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    
    # Small delay to ensure backend is starting
    sleep 3
else
    BACKEND_PID=""
fi

# Start frontend development server in the background
echo "⚛️ Starting frontend on port 5173..."
cd /workspaces/App-Screen
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
if [ "$API_AVAILABLE" != "false" ]; then
    echo "✅ Services started!"
    echo "🌐 Backend API: http://localhost:8000"
    echo "📊 Backend API docs: http://localhost:8000/docs"
else
    echo "✅ Frontend only started (backend not available)!"
fi
echo "🌐 Frontend: http://localhost:5173"

# Create a file to track the PIDs so we can stop them later
if [ -n "$BACKEND_PID" ]; then
    echo "$BACKEND_PID $FRONTEND_PID" > /tmp/appscreen_pids
else
    echo "$FRONTEND_PID" > /tmp/appscreen_pids
fi

# Wait for both processes to complete
if [ -n "$BACKEND_PID" ]; then
    wait $BACKEND_PID
fi
wait $FRONTEND_PID