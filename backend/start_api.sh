#!/bin/bash

# Startup script for the FastAPI application

set -e  # Exit on any error

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    echo "Activating virtual environment (Windows)..."
    source venv/Scripts/activate
fi

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "WARNING: DATABASE_URL is not set. Using default configuration."
fi

if [ -z "$REDIS_URL" ]; then
    echo "WARNING: REDIS_URL is not set. Using default configuration."
fi

# Check if the expected API file exists
API_FILE="src/api/main.py"
if [ ! -f "$API_FILE" ]; then
    echo "API file $API_FILE does not exist. Looking for alternative locations..."
    API_FILE="src/main.py"
    if [ ! -f "$API_FILE" ]; then
        echo "API file $API_FILE does not exist either."
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
fi

# Start the FastAPI application
echo "Starting FastAPI application from $API_FILE..."
echo "API will be available at http://localhost:8000"
echo "Documentation will be available at http://localhost:8000/docs"

# Extract module path from file path
MODULE_PATH=$(echo "$API_FILE" | sed 's|/[^/]*$||' | sed 's|/|.|g' | sed 's|^\.||')
FILE_NAME=$(basename "$API_FILE" .py)

# Use uvicorn to run the application
uvicorn ${MODULE_PATH}.${FILE_NAME}:app --host 0.0.0.0 --port 8000 --reload