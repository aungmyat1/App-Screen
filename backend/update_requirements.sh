#!/bin/bash

# Script to update requirements.txt with current installed packages

# Check if virtual environment exists and activate it
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
elif [ -f ".venv/bin/activate" ]; then
    echo "Activating virtual environment (.venv)..."
    source .venv/bin/activate
else
    echo "No virtual environment found. Using system Python."
fi

# Update pip first
pip install --upgrade pip

# Freeze current packages to requirements.txt
pip freeze > requirements.txt
echo "Requirements updated!"