#!/bin/bash

echo "Fixing App-Screen setup..."

# 1. Set correct workspace path
WORKSPACE_ROOT="/workspaces/App-Screen"
cd "$WORKSPACE_ROOT"

# 2. Create virtual environment for backend
echo "Creating Python virtual environment..."
cd backend
python -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip

# Install all requirements except playwright first to avoid issues
pip install --break-system-packages -r <(grep -v "playwright" requirements.txt)

# 4. Install Playwright separately with a fallback version
echo "Installing Playwright..."
if grep -q "playwright" requirements.txt; then
    # Try installing playwright with a more flexible approach
    if ! pip install --break-system-packages playwright; then
        echo "Installing playwright with a known compatible version..."
        # Try a more recent version that may have better Python 3.12 support
        pip install --break-system-packages playwright>=1.30.0
        if [ $? -ne 0 ]; then
            echo "Installing playwright without version constraint..."
            pip install --break-system-packages playwright --pre
        fi
    fi
fi

# Install Playwright browsers if playwright was installed
if python -c "import playwright" &>/dev/null; then
    echo "Playwright installed, installing browsers..."
    python -m playwright install chromium
else
    echo "Playwright could not be installed, but this may not be critical for basic operation"
    echo "Some browser automation features may not work without Playwright"
fi

# 5. Fix Node.js permissions for global installs
echo "Setting up Node.js..."
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# 6. Install frontend dependencies
echo "Installing frontend dependencies..."
cd ..
npm install

# 7. Set up environment variables
cd "$WORKSPACE_ROOT"
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "Created .env file from example"
fi

echo "Setup fixed successfully!"
echo ""
echo "Next steps:"
echo "1. To start the backend API server: cd backend && source venv/bin/activate && uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload"
echo "2. To start the frontend: npm run dev"
echo "3. To start all services: bash start_services.sh (if available)"
echo "4. If you need to start the database and other services: docker-compose up -d"
echo ""
echo "Note: If Playwright is needed for browser automation features, ensure it's properly installed:"
echo "   cd backend && source venv/bin/activate && python -m playwright install"