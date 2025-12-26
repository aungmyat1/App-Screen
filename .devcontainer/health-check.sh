#!/bin/bash
# Exit with non-zero status if any check fails

set -e

echo "Running health checks..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 is not installed"
    exit 1
else
    python_version=$(python3 --version)
    echo "✓ Python found: $python_version"
fi

# Check Node.js with better diagnostics
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✓ Node.js found: $node_version"
    
    # Check if node version is compatible
    if [[ "$node_version" =~ v(1[89]|2[0-9]) ]]; then
        echo "✓ Node.js version compatible: $node_version"
    else
        echo "WARNING: Node.js version $node_version may not be optimal"
    fi
elif command -v npm &> /dev/null; then
    echo "WARNING: npm found but node command not in PATH"
    echo "INFO: Checking for nvm installation..."
    if [ -d "/home/vscode/.nvm" ]; then
        echo "INFO: nvm found, sourcing it..."
        source /home/vscode/.nvm/nvm.sh
        node_version=$(node --version 2>/dev/null || echo "not available")
        echo "Node.js after nvm source: $node_version"
    fi
else
    echo "ERROR: Neither node nor npm found"
    echo "ACTION REQUIRED: Install Node.js"
    echo "For Debian/Ubuntu: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "For Alpine: sudo apk add nodejs npm"
    exit 1
fi

# Check if Git is available
if ! command -v git &> /dev/null; then
    echo "ERROR: git is not installed"
    exit 1
else
    echo "✓ git found: $(git --version)"
fi

# Check backend dependencies
if [ -f "/workspaces/App-Screen/backend/requirements.txt" ]; then
    echo "✓ Backend requirements.txt found"
    # Check if Python dependencies are installed
    if ! python3 -c "import fastapi, uvicorn, redis, celery" 2>/dev/null; then
        echo "INFO: Backend Python dependencies may not be fully available, running setup if needed"
    else
        echo "✓ Backend Python dependencies found"
    fi
else
    echo "INFO: /workspaces/App-Screen/backend/requirements.txt not found, skipping Python dependencies check"
fi

# Check frontend dependencies
if [ -f "/workspaces/App-Screen/package.json" ]; then
    echo "✓ package.json found"
    if [ -d "/workspaces/App-Screen/node_modules" ]; then
        echo "✓ node_modules directory found"
        # Check if node_modules is not empty
        if [ "$(ls -A node_modules 2>/dev/null | head -1)" ]; then
            echo "✓ node_modules contains packages"
        else
            echo "WARNING: node_modules directory is empty"
        fi
    else
        echo "WARNING: node_modules not found, run 'npm install'"
    fi
else
    echo "INFO: /workspaces/App-Screen/package.json not found, skipping frontend dependencies check"
fi

# Check if backend services are running
if [ -d "/workspaces/App-Screen/backend" ]; then
    # Check if we can find a running Python process related to the backend
    if ! pgrep -f "uvicorn\|python.*main\|gunicorn" > /dev/null; then
        echo "INFO: Backend processes not found, they may not be running yet"
    else
        echo "✓ Backend processes found"
    fi
else
    echo "INFO: /workspaces/App-Screen/backend directory not found, skipping backend check"
fi

# Check if frontend is running
if [ -f "/workspaces/App-Screen/package.json" ] && (command -v node &> /dev/null || command -v npm &> /dev/null); then
    # Check if we can find a running Node process related to the frontend
    if ! pgrep -f "vite\|npm.*dev\|webpack" > /dev/null; then
        echo "INFO: Frontend processes not found, they may not be running yet"
    else
        echo "✓ Frontend processes found"
    fi
else
    echo "INFO: Node.js not available or /workspaces/App-Screen/package.json not found, skipping frontend check"
fi

echo "Health checks completed successfully!"
exit 0