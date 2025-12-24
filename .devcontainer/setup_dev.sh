#!/bin/bash

# Setup script for devcontainer

echo "Setting up development environment..."

# Install frontend dependencies
cd /workspaces/App-Screen-
npm install

# Setup Python virtual environment and install backend dependencies
cd /workspaces/App-Screen-/backend
python3 -m venv venv
source venv/bin/activate

# Install pip packages
pip install --upgrade pip
pip install -r requirements.txt 2>/dev/null || echo "Backend requirements.txt not found or failed to install"

# Install any additional dependencies that might be needed
pip install flask flask-cors celery redis psycopg2-binary

echo "Setup complete!"