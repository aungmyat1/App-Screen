#!/bin/bash

# Post-create script for App-Screen development environment
# This script runs once after the container is created

set -euo pipefail  # More robust error handling

echo "🚀 Running post-create setup for App-Screen..."

# Ensure we're in the right directory using the environment variable
cd "${WORKSPACE_FOLDER:-/workspaces/App-Screen}" || exit 1

# Check if Git LFS is needed and available
if [ -f ".gitattributes" ] && grep -q "filter=lfs" .gitattributes; then
    echo "🔍 Git LFS attributes detected, checking Git LFS installation..."
    
    if command -v git-lfs &> /dev/null; then
        echo "✅ Git LFS is installed"
        git lfs install
        # Pull LFS files if not already done
        echo "📦 Pulling Git LFS files..."
        git lfs pull
    else
        echo "⚠️ Git LFS not installed, please install manually"
    fi
else
    echo "ℹ️ No Git LFS attributes detected"
fi

# Check if Python virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate
pip install --upgrade pip

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Install Playwright browsers if not already installed
if python -c "import playwright" &> /dev/null; then
    echo "🎮 Ensuring Playwright browsers are installed..."
    python -m playwright install chromium --quiet
else
    echo "⚠️ Playwright not found in requirements, skipping browser installation"
fi

# Generate .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "📝 Creating default .env file..."

  cat > .env << EOF
NODE_ENV=development
PYTHONPATH=${WORKSPACE_FOLDER:-/workspaces/App-Screen}/backend

# Services (docker-compose)
DATABASE_URL=postgresql://appscreens_user:appscreens_pass@postgres:5432/appscreens
REDIS_URL=redis://redis:6379

# API Keys (fill manually)
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Environment
ENVIRONMENT=development
DEVCONTAINER=true
EOF
fi

# Check if Node dependencies are installed
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install --prefer-offline --no-audit
fi

# Run any pending database migrations if backend exists
if [ -d "backend" ] && [ -f "backend/run_migrations.sh" ]; then
    echo "🗄️ Running database migrations..."
    cd backend
    chmod +x run_migrations.sh
    ./run_migrations.sh
    cd ..
fi

echo "✅ Post-create setup completed successfully!"
echo "📊 Services available via forwarded ports:"
echo "  - PostgreSQL : 5432"
echo "  - Redis      : 6379"
echo "  - Backend    : 8000"
echo "  - Frontend   : 5173"