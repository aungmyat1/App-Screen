#!/bin/bash

# Script to start Celery Beat scheduler for periodic tasks

# Exit on any error
set -e

echo "Starting Celery Beat scheduler..."

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

# Start Celery Beat scheduler
echo "Starting Celery Beat scheduler..."
celery -A src.workers.celery_app beat \
    --loglevel=info \
    --schedule-file=celerybeat-schedule

echo "Celery Beat scheduler started successfully!"