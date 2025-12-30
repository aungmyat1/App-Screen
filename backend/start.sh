#!/bin/bash

# Activate virtual environment
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "No virtual environment found"
fi

# Check if the expected API file exists
if [ -f "src/main.py" ]; then
    API_FILE="src/main.py"
elif [ -f "src/api/main.py" ]; then
    API_FILE="src/api/main.py"
else
    echo "API file does not exist."
    echo "Available directories in src:"
    if [ -d "src" ]; then
        ls -la src/
    else
        echo "src directory does not exist"
        echo "This application requires the backend API files to be present."
        echo "Please make sure the backend implementation is in place before running this script."
        exit 1
    fi
fi

# Extract module path from file path
MODULE_PATH=$(echo "$API_FILE" | sed 's|/[^/]*$||' | sed 's|/|.|g' | sed 's|^\.||')
FILE_NAME=$(basename "$API_FILE" .py)

# Run the FastAPI application
uvicorn ${MODULE_PATH}.${FILE_NAME}:app --host 0.0.0.0 --port 8000 --reload