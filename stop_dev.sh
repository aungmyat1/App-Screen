#!/bin/bash

# Script to stop App-Screen development services
# Uses the PIDs stored in /tmp/appscreen_pids to stop all services

set -Eeuo pipefail

echo "🛑 Stopping App-Screen development services..."

# Check if PIDs file exists
if [ -f "/tmp/appscreen_pids" ]; then
    PIDS=($(cat /tmp/appscreen_pids))
    
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "Sending SIGTERM to process $pid..."
            kill -15 "$pid"  # SIGTERM for graceful shutdown
            
            # Wait a bit for graceful shutdown
            sleep 2
            
            # Check if process is still running
            if kill -0 "$pid" 2>/dev/null; then
                echo "Process $pid still running, sending SIGKILL..."
                kill -9 "$pid"  # SIGKILL if still running
            fi
            
            echo "✅ Process $pid stopped"
        else
            echo "⚠️ Process $pid was not running"
        fi
    done
    
    # Remove the PIDs file
    rm -f /tmp/appscreen_pids
    echo "✅ PIDs file removed"
else
    echo "⚠️ No process tracking file found at /tmp/appscreen_pids"
    echo "Looking for processes by name..."
    
    # Fallback: kill by process name
    for proc in uvicorn npm node celery; do
        pids=$(pgrep -f "$proc" 2>/dev/null) || true
        if [ -n "$pids" ]; then
            echo "Killing $proc processes: $pids"
            kill -15 $pids 2>/dev/null || true
            sleep 1
            # Force kill if still running
            pids=$(pgrep -f "$proc" 2>/dev/null) || true
            if [ -n "$pids" ]; then
                kill -9 $pids 2>/dev/null || true
            fi
        fi
    done
fi

echo "✅ Development services stopped."