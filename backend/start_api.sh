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

# Start the FastAPI application
echo "Starting FastAPI application..."
echo "API will be available at http://localhost:8000"
echo "Documentation will be available at http://localhost:8000/docs"

# Use uvicorn to run the application
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload