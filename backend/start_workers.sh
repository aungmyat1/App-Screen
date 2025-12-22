#!/bin/bash

# Script to start Celery workers for the screenshot scraper application

# Exit on any error
set -e

echo "Starting Celery workers for screenshot scraper..."

# Change to the backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install/update dependencies
echo "Installing/updating dependencies..."
pip install -r requirements.txt

# Start Celery workers with different queues
echo "Starting Celery workers..."
celery -A src.workers.celery_app worker --loglevel=info \
    -Q playstore,appstore,downloads \
    -n screenshot_worker@%h \
    --concurrency=4

echo "Celery workers started successfully!"