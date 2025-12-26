#!/bin/bash

echo "AppScreens Database Setup"
echo "========================="

# Navigate to backend directory
cd /workspaces/App-Screen/backend

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Using virtual environment"
else
    echo "Warning: Virtual environment not found. Using system Python."
fi

# Check if database setup files exist
if [ -f "src/database/setup_comprehensive.py" ]; then
    cd src/database
    python setup_comprehensive.py
elif [ -f "database/setup_comprehensive.py" ]; then
    cd database
    python setup_comprehensive.py
elif [ -f "src/database/init_db.py" ]; then
    cd src/database
    python init_db.py
elif [ -f "database/init_db.py" ]; then
    cd database
    python init_db.py
else
    echo "Checking for Alembic migration setup..."
    if [ -f "alembic.ini" ] || [ -d "src/alembic" ]; then
        # Run alembic migrations if available
        if command -v alembic &> /dev/null; then
            alembic upgrade head
            echo "Database migrations applied"
        else
            echo "Installing and running alembic migrations..."
            pip install alembic
            if [ -f "src/alembic.ini" ]; then
                cd src
                alembic upgrade head
            else
                alembic upgrade head
            fi
        fi
    else
        echo "Error: Could not find database setup files"
        echo "Available files in database-related directories:"
        find . -name "*database*" -type d -exec echo "Directory: {}" \; -exec ls -la {} \;
        exit 1
    fi
fi

echo "Database setup completed!"