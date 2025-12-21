#!/bin/bash

# Script to run Alembic migrations

echo "Running Alembic migrations..."

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Navigate to database directory
cd src/database

# Run migrations
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "Migrations applied successfully!"
else
    echo "Failed to apply migrations!"
    exit 1
fi