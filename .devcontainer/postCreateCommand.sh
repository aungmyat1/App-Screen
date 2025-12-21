#!/bin/bash

echo "Setting up development environment..."

# Install Playwright browsers
cd /workspaces/App-Screen-/backend
playwright install-deps
playwright install chromium firefox webkit

# Install Python dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "Setting up Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    echo "Virtual environment already exists."
fi

# Install Node dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    cd /workspaces/App-Screen-
    npm install
else
    echo "Node modules already installed."
fi

echo "Setup completed!"