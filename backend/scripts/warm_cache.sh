#!/bin/bash

# Cache warming script
# This script runs the cache warming service to pre-populate Redis with frequently accessed data

set -e  # Exit on any error

echo "Running cache warming process..."

# Activate virtual environment if it exists
if [ -f "/workspaces/App-Screen-/backend/venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source /workspaces/App-Screen-/backend/venv/bin/activate
elif [ -f "/workspaces/App-Screen-/backend/venv/Scripts/activate" ]; then
    echo "Activating virtual environment (Windows)..."
    source /workspaces/App-Screen-/backend/venv/Scripts/activate
fi

# Navigate to backend directory
cd /workspaces/App-Screen-/backend

# Run cache warming service
echo "Executing cache warming service..."
python src/services/cache_warming_service.py

echo ""
echo "Cache warming process completed!"
echo "The Redis cache has been pre-populated with frequently accessed data."