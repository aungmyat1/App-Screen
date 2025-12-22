#!/bin/bash

# Script to monitor Celery workers

echo "Checking Celery worker status..."

# Check if Celery is installed
if ! command -v celery &> /dev/null; then
    echo "Error: Celery is not installed"
    exit 1
fi

# Ping the Celery workers
celery -A src.workers.celery_app inspect ping

# Show active tasks
echo -e "\nActive tasks:"
celery -A src.workers.celery_app inspect active

# Show registered tasks
echo -e "\nRegistered tasks:"
celery -A src.workers.celery_app inspect registered

# Show worker stats
echo -e "\nWorker stats:"
celery -A src.workers.celery_app inspect stats