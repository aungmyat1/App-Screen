#!/bin/bash

# Script to start Flower monitoring for Celery workers

# Exit on any error
set -e

echo "Starting Flower monitoring..."

# Change to the backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install flower if not already installed
echo "Checking Flower installation..."
pip install flower

# Start Flower monitoring
echo "Starting Flower monitoring..."
celery -A src.workers.celery_app flower \
    --conf=src/workers/flowerconfig.py

echo "Flower monitoring started successfully!"