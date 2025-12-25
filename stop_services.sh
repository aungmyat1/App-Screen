#!/bin/bash

# Script to stop the running backend and frontend services

echo "🛑 Stopping App-Screen services..."

# Check if we have PIDs stored
if [ -f /tmp/appscreen_pids ]; then
    PIDS=$(cat /tmp/appscreen_pids)
    echo "Found process IDs: $PIDS"
    
    # Kill the processes
    kill $PIDS 2>/dev/null
    echo "Services stopped!"
    
    # Remove the PID file
    rm /tmp/appscreen_pids
else
    echo "No process IDs found. Looking for processes by name..."
    
    # Find and kill the processes by name if PID file doesn't exist
    BACKEND_PID=$(pgrep -f "uvicorn.*src.api.main:app")
    FRONTEND_PID=$(pgrep -f "vite.*dev")
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo "Stopped backend process (PID: $BACKEND_PID)"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        echo "Stopped frontend process (PID: $FRONTEND_PID)"
    fi
    
    if [ -z "$BACKEND_PID" ] && [ -z "$FRONTEND_PID" ]; then
        echo "No services found running."
    fi
fi

echo "✅ Services stopped!"