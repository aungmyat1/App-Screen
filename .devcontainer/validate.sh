#!/bin/bash
# Validation script to check if the setup is working correctly

set -e

echo "Validating setup..."

# Check if backend directory exists and requirements are installed
if [ -d "/workspace/backend" ] && [ -f "/workspace/backend/requirements.txt" ]; then
    echo "Checking backend requirements..."
    # Check a few critical packages
    if ! python -c "import fastapi" 2>/dev/null; then
        echo "ERROR: FastAPI not installed properly"
        exit 1
    fi
    
    if ! python -c "import redis" 2>/dev/null; then
        echo "ERROR: Redis not installed properly"
        exit 1
    fi
    
    if ! python -c "import celery" 2>/dev/null; then
        echo "ERROR: Celery not installed properly"
        exit 1
    fi
    
    echo "✓ Backend requirements validated"
fi

# Check if frontend dependencies are installed
if [ -f "/workspace/package.json" ]; then
    if [ ! -d "/workspace/node_modules" ]; then
        echo "ERROR: node_modules not found"
        exit 1
    fi
    
    # Check for critical frontend packages
    if ! npm ls react 2>/dev/null | grep -q "react"; then
        echo "WARNING: React not found in node_modules"
    else
        echo "✓ React found in node_modules"
    fi
    
    if ! npm ls vite 2>/dev/null | grep -q "vite"; then
        echo "WARNING: Vite not found in node_modules"
    else
        echo "✓ Vite found in node_modules"
    fi
fi

# Check if services are running on expected ports
if command -v nc >/dev/null 2>&1; then
    # Check if backend is running on port 5000
    if nc -z localhost 5000; then
        echo "✓ Backend service running on port 5000"
    else
        echo "INFO: Backend service not running on port 5000"
    fi
    
    # Check if frontend is running on port 3000
    if nc -z localhost 3000; then
        echo "✓ Frontend service running on port 3000"
    else
        echo "INFO: Frontend service not running on port 3000"
    fi
else
    echo "INFO: netcat not available, skipping port checks"
fi

echo "Setup validation completed successfully!"
exit 0