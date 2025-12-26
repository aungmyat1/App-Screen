#!/bin/bash

# Post-create script for App-Screen Full-Stack Development DevContainer

echo "Setting up App-Screen development environment..."

# Install Python dependencies if requirements.txt exists
if [ -f "/workspace/backend/requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install --user -r /workspace/backend/requirements.txt
fi

# Install Node.js dependencies if package.json exists
if [ -f "/workspace/package.json" ]; then
    echo "Installing Node.js dependencies..."
    cd /workspace
    npm install
fi

# Setup Python virtual environment if needed
if [ -d "/workspace/backend" ]; then
    cd /workspace/backend
    
    # Create and activate virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    if [ -f "requirements.txt" ]; then
        pip install --upgrade pip
        pip install -r requirements.txt
    fi
fi

# Additional setup for Python formatting tools
pip install black flake8

# Setup Git configuration if needed
if ! git config user.email > /dev/null 2>&1; then
    echo "Please configure your Git email: git config --global user.email <your-email>"
fi

if ! git config user.name > /dev/null 2>&1; then
    echo "Please configure your Git username: git config --global user.name <your-username>"
fi

# Initialize Git LFS if .gitattributes exists
if [ -f "/workspace/.gitattributes" ]; then
    git lfs install
fi

# Set proper permissions for scripts
chmod +x /workspace/.devcontainer/post-start.sh

echo "Development environment setup complete!"
echo "Next steps:"
echo "1. If you haven't already, configure Git: git config --global user.email 'your-email@example.com'"
echo "2. Run your frontend with: cd /workspace && npm run dev"
echo "3. Run your backend with: cd /workspace/backend && python -m uvicorn src.main:app --reload"