#!/bin/bash

# Script to start both backend API and frontend development servers

echo "🚀 Starting App-Screen services..."

# Start backend API in the background
echo "🐍 Starting backend API on port 8000..."
cd /workspaces/App-Screen/backend
/opt/venv/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Small delay to ensure backend is starting
sleep 3

# Start frontend development server in the background
echo "⚛️ Starting frontend on port 5173..."
cd /workspaces/App-Screen
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
echo "✅ Services started!"
echo "🌐 Backend API: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo "📊 Backend API docs: http://localhost:8000/docs"

# Create a file to track the PIDs so we can stop them later
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/appscreen_pids

# Wait for both processes to complete
wait $BACKEND_PID
wait $FRONTEND_PID