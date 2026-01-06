#!/bin/bash

# Health check script for App-Screen development environment
# Checks the status of all services and provides diagnostic information

set -Eeuo pipefail

echo "🏥 Running health check for App-Screen development environment..."

# Check if PIDs file exists
if [ -f "/tmp/appscreen_pids" ]; then
    PIDS=($(cat /tmp/appscreen_pids))
    echo "📋 Tracked processes: ${PIDS[*]}"
    
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ Process $pid is running"
            # Get process info
            ps -p "$pid" -o pid,ppid,cmd,etime,pcpu,pmem 2>/dev/null || echo "⚠️ Could not get details for process $pid"
        else
            echo "❌ Process $pid is not running"
        fi
    done
else
    echo "⚠️ No process tracking file found at /tmp/appscreen_pids"
fi

echo ""
echo "🔍 Checking service endpoints..."

# Check backend API
echo "Checking Backend API at http://localhost:8000..."
if curl -sf http://localhost:8000/docs > /dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

# Check frontend
echo "Checking Frontend at http://localhost:5173..."
if curl -sf http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding (this might be normal if on a different port)"
fi

echo ""
echo "📁 Checking log files..."

# Check log files
for log_file in backend.log frontend.log worker.log; do
    if [ -f "$log_file" ]; then
        echo "📄 Last 10 lines of $log_file:"
        tail -n 10 "$log_file"
        echo ""
    else
        echo "⚠️ Log file $log_file not found"
    fi
done

echo "📊 System resource usage:"
echo "Memory:"
free -h 2>/dev/null || echo "Could not get memory info"
echo ""
echo "Disk usage:"
df -h . 2>/dev/null || echo "Could not get disk info"

echo ""
echo "✅ Health check completed!"