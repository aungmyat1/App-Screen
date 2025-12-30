#!/bin/bash

echo "Starting App-Screen development environment..."

# Set environment to development
export ENVIRONMENT=development

# Start backend API in the background
echo "Starting backend API server..."
if [ -d "/workspaces/App-Screen/backend" ]; then
    cd /workspaces/App-Screen/backend
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    
    # Check if API files exist before starting
    if [ -f "src/main.py" ] || [ -f "src/api/main.py" ]; then
        uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload &
        # Small delay to ensure backend is starting
        sleep 5
    else
        echo "Backend API files not found. Skipping backend start."
    fi
    cd ..
else
    echo "Backend directory not found. Skipping backend start."
fi

# Start frontend in the background
echo "Starting frontend development server..."
npm run dev &

echo "Development environment started!"
echo "Backend API available at: http://localhost:8000 (if running)"
echo "Backend API docs available at: http://localhost:8000/docs (if running)"
echo "Frontend available at: http://localhost:3000 (or as shown in the npm output)"
echo ""
echo "To stop everything, run: pkill -f 'uvicorn\|npm'"