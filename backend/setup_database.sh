#!/bin/bash

# Database setup script for AppScreens application

echo "AppScreens Database Setup"
echo "========================="

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Warning: Virtual environment not found. Using system Python."
fi

# Navigate to the database directory
cd src/database

# Run the comprehensive database setup
echo "Running database setup..."
python setup_comprehensive.py

# Check if setup was successful
if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
else
    echo "Database setup failed!"
    exit 1
fi

cd ../..
echo "Database setup process finished."