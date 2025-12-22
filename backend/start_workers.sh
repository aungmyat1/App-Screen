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

# Start multiple Celery workers with different queues
echo "Starting Celery workers..."

# Start Play Store worker
celery -A src.workers.celery_app worker \
    --loglevel=info \
    -Q playstore \
    -n playstore_worker@%h \
    --concurrency=2 \
    --max-tasks-per-child=100 \
    &

# Start App Store worker
celery -A src.workers.celery_app worker \
    --loglevel=info \
    -Q appstore \
    -n appstore_worker@%h \
    --concurrency=2 \
    --max-tasks-per-child=100 \
    &

# Start Downloads worker
celery -A src.workers.celery_app worker \
    --loglevel=info \
    -Q downloads \
    -n downloads_worker@%h \
    --concurrency=4 \
    --max-tasks-per-child=50 \
    &

# Start Maintenance worker
celery -A src.workers.celery_app worker \
    --loglevel=info \
    -Q maintenance \
    -n maintenance_worker@%h \
    --concurrency=1 \
    --max-tasks-per-child=10 \
    &

# Wait for all background processes
wait

echo "All Celery workers started successfully!"