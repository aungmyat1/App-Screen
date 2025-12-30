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

# Check if Python virtual environment is available
if [ -d "/workspaces/App-Screen/backend/venv" ]; then
    echo "✓ Python virtual environment found"
    # Activate the virtual environment to check packages
    source /workspaces/App-Screen/backend/venv/bin/activate
    
    # Check if key Python packages are installed
    if python -c "import uvicorn, redis, celery, sqlalchemy" 2>/dev/null; then
        echo "✓ Backend Python dependencies found"
    else
        echo "INFO: Backend Python dependencies not fully available (this may be OK depending on project requirements)"
    fi
else
    echo "INFO: Backend virtual environment not found (this may be OK depending on project requirements)"
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
    if command -v apk &> /dev/null; then
        echo "For Alpine: apk add nodejs npm"
    elif command -v apt-get &> /dev/null; then
        echo "For Debian/Ubuntu: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    fi
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo "✓ npm found: $npm_version"
    
    # Check if package.json exists and node_modules are installed
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
    fi
else
    echo "ERROR: npm not found"
    exit 1
fi

# Check if Git is available
if ! command -v git &> /dev/null; then
    echo "ERROR: git is not installed"
    exit 1
else
    echo "✓ git found: $(git --version)"
fi

# Check if Git LFS is available
if command -v git-lfs &> /dev/null; then
    echo "✓ Git LFS found: $(git-lfs --version)"
else
    echo "INFO: Git LFS not found (this may be OK depending on project requirements)"
fi

# Check if Playwright is available (only if needed)
if [ -f "/workspaces/App-Screen/backend/requirements.txt" ] && grep -q "playwright" /workspaces/App-Screen/backend/requirements.txt; then
    if command -v playwright &> /dev/null; then
        echo "✓ Playwright found: $(playwright --version 2>/dev/null || echo "unknown")"
        # Check if browsers are installed
        if python -c "import playwright" 2>/dev/null; then
            echo "✓ Playwright Python package installed"
        else
            echo "ERROR: Playwright Python package not installed"
            exit 1
        fi
    else
        echo "ERROR: Playwright CLI not found (required by backend requirements)"
        exit 1
    fi
else
    echo "INFO: Playwright not required for this project configuration"
fi

# Check if backend services are running
if [ -d "/workspaces/App-Screen/backend" ]; then
    cd /workspaces/App-Screen/backend
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        # Check if we can import backend modules (if they exist)
        if [ -d "src" ] || [ -f "__init__.py" ]; then
            if python -c "import core, models, database" 2>/dev/null; then
                echo "✓ Backend modules can be imported"
            else
                echo "INFO: Backend modules cannot be imported (this may be OK depending on project structure)"
            fi
        fi
    fi
else
    echo "INFO: /workspaces/App-Screen/backend directory not found"
fi

# Check if PostgreSQL client is available
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL client found: $(psql --version 2>/dev/null || echo "unknown")"
else
    echo "INFO: PostgreSQL client not found (this may be OK depending on project requirements)"
fi

# Check if Redis is available
if command -v redis-cli &> /dev/null; then
    echo "✓ Redis CLI found"
else
    echo "INFO: Redis CLI not found (this may be OK depending on project requirements)"
fi

echo "Health checks completed successfully!"
exit 0