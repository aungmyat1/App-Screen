#!/bin/bash

# Test runner script for the API

set -e  # Exit on any error

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    echo "Activating virtual environment (Windows)..."
    source venv/Scripts/activate
fi

# Navigate to backend directory
cd /workspaces/App-Screen-/backend

# Run integration tests
echo "Running integration tests..."
python -m pytest src/api/test_integration.py -v

echo "Tests completed!"